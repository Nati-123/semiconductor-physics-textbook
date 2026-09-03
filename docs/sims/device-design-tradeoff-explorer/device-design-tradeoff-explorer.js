// Device Design Trade-Off Explorer MicroSim
// Plots the power-device "unipolar limit" trade-off between breakdown
// voltage and specific on-resistance, Ron,sp = 4*VBR^2/(mu_n*eps_s*Ecrit^3),
// on a log-log chart, comparing Silicon, 4H-SiC, and GaN drift regions,
// with the required drift doping and width shown for the selected material.
// Bloom Level: Analyze (L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 780;
let drawHeight = 385;
let minDrawHeight = 385;
let controlHeight = 175;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let bvSlider, matSelect;

const Q = 1.602e-19;
const BV_MIN = 50, BV_MAX = 2000;

// Illustrative textbook-typical drift-region constants. Real E_crit is
// itself weakly doping-dependent; these single representative values are
// for comparing the ORDER-OF-MAGNITUDE unipolar trade-off across
// materials (the Baliga figure of merit), not a precise device model.
const MATERIALS = {
  'Silicon': { epsS: 1.035e-12, ecrit: 3.0e5, muN: 1350, color: [90, 62, 237] },
  '4H-SiC': { epsS: 8.58e-13, ecrit: 2.5e6, muN: 950, color: [0, 140, 140] },
  'GaN': { epsS: 7.97e-13, ecrit: 3.3e6, muN: 1000, color: [225, 120, 20] }
};
const MATERIAL_NAMES = Object.keys(MATERIALS);

function NDfor(BV, m) { return (m.epsS * m.ecrit * m.ecrit) / (2 * Q * BV); }
function Wfor(BV, m) { return (2 * BV) / m.ecrit; }
function RonSpFor(BV, m) { return (4 * BV * BV) / (m.muN * m.epsS * Math.pow(m.ecrit, 3)); }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  matSelect = createSelect();
  MATERIAL_NAMES.forEach(n => matSelect.option(n));
  matSelect.selected('Silicon');
  matSelect.attribute('aria-label', 'Drift-region material');

  bvSlider = createSlider(BV_MIN, BV_MAX, 500, 10);
  bvSlider.attribute('aria-label', 'Target breakdown voltage in volts');

  positionUIElements();
  describe('Device design trade-off explorer: plots the power device trade-off between breakdown voltage and specific on-resistance for Silicon, 4H-SiC, and GaN drift regions, with required drift doping and width for the selected material', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  matSelect.position(bx + 190, by + drawHeight + 12);
  bvSlider.position(bx + 190, by + drawHeight + 50);
  bvSlider.size(min(canvasWidth - 210 - 30, 380));
}

// Nice log-decade ticks (powers of ten) spanning [loExp,hiExp], inclusive.
function decadeTicks(loVal, hiVal) {
  const lo = Math.floor(Math.log10(loVal)), hi = Math.ceil(Math.log10(hiVal));
  const ticks = [];
  for (let e = lo; e <= hi; e++) ticks.push({ v: e, label: '10' + smlSuperscript(e) });
  return ticks;
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const matName = matSelect.value();
  const mat = MATERIALS[matName];
  const BV = bvSlider.value();
  const ND = NDfor(BV, mat), W = Wfor(BV, mat), Ronsp = RonSpFor(BV, mat);

  // ---------- Title + equation (kept clear of the top-right fullscreen button) ----------
  noStroke(); fill(90, 62, 237); textAlign(CENTER, TOP); textSize(16);
  text('Device Design Trade-Off Explorer', canvasWidth / 2, 6);
  fill(40);
  smlMathText(canvasWidth / 2, 27, 'R_on,sp ≈ 4·V_BR² / (μn·εs·E_crit³)', { align: 'center', size: 13 });

  // ---------- Log-log trade-off chart: all three materials, selected one highlighted ----------
  const chartX = 92, chartY = 54, chartW = canvasWidth - chartX - 26, chartH = 232;

  let yLo = Infinity, yHi = -Infinity;
  const seriesData = {};
  MATERIAL_NAMES.forEach(name => {
    const m = MATERIALS[name];
    const pts = [];
    for (let bv = BV_MIN; bv <= BV_MAX; bv += (BV_MAX - BV_MIN) / 200) {
      const y = Math.log10(RonSpFor(bv, m));
      pts.push({ x: Math.log10(bv), y: y });
      if (y < yLo) yLo = y;
      if (y > yHi) yHi = y;
    }
    seriesData[name] = pts;
  });
  yLo -= 0.4; yHi += 0.4;

  const xTicks = [50, 100, 200, 500, 1000, 2000].map(v => ({
    v: Math.log10(v), label: v >= 1000 ? (v / 1000) + 'k' : String(v)
  }));
  const yTicks = decadeTicks(Math.pow(10, yLo), Math.pow(10, yHi));

  const series = MATERIAL_NAMES.map(name => ({
    points: seriesData[name],
    color: name === matName ? color(mat.color[0], mat.color[1], mat.color[2]) : color(200)
  }));
  // Draw the highlighted material's series last (on top) for clarity.
  const hlIdx = MATERIAL_NAMES.indexOf(matName);
  const ordered = series.slice(); const hl = ordered.splice(hlIdx, 1)[0]; ordered.push(hl);

  const info = smlDrawLineChart(chartX, chartY, chartW, chartH,
    Math.log10(BV_MIN), Math.log10(BV_MAX), yLo, yHi, ordered,
    { xTicks: xTicks, yTicks: yTicks, marker: { x: Math.log10(BV), y: Math.log10(Ronsp) }, markerColor: color(220, 40, 40) });

  noStroke(); fill(40); textAlign(CENTER, TOP); textSize(11);
  text('V_BR (V, log scale)', chartX + chartW / 2, chartY + chartH + 20);
  push();
  translate(chartX - 58, chartY + chartH / 2); rotate(-HALF_PI);
  noStroke(); fill(40); textAlign(CENTER, CENTER); textSize(11);
  text('R_on,sp (Ω·cm², log scale)', 0, 0);
  pop();

  // Legend: each material's line color, bold-labeled if selected.
  let lx = chartX + 8;
  const legendY = chartY + 6;
  MATERIAL_NAMES.forEach(name => {
    const m = MATERIALS[name];
    const isSel = name === matName;
    noStroke(); fill(isSel ? color(m.color[0], m.color[1], m.color[2]) : color(160));
    textAlign(LEFT, TOP); textSize(isSel ? 11.5 : 10.5);
    text((isSel ? '● ' : '— ') + name, lx, legendY);
    lx += textWidth((isSel ? '● ' : '— ') + name) + 16;
  });

  // ---------- Symbol definitions ----------
  const defY = chartY + chartH + 40;
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(10.8);
  const defs = [
    'R_on,sp = specific on-resistance (Ω·cm²)     V_BR = breakdown voltage (V)',
    'μn = electron mobility (cm²/V·s)     εs = semiconductor permittivity (F/cm)     E_crit = critical (avalanche) electric field (V/cm)'
  ];
  text(defs[0], 20, defY, canvasWidth - 40);
  text(defs[1], 20, defY + 16, canvasWidth - 40);

  // ---------- Controls (left of slider/dropdown) ----------
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(12.5);
  text('Material:', 10, drawHeight + 18);
  text('Target V_BR = ' + BV + ' V', 10, drawHeight + 56);

  // ---------- Calculated results: separate full-width row, never over controls ----------
  stroke(225); strokeWeight(1);
  line(10, drawHeight + 90, canvasWidth - 10, drawHeight + 90);
  noStroke(); fill(20); textAlign(LEFT, TOP); textSize(11.5);
  text('Calculated Results — ' + matName + ' drift region', 10, drawHeight + 96);
  textSize(11); fill(60);
  text('μn = ' + mat.muN + ' cm²/V·s     εs = ' + mat.epsS.toExponential(2) + ' F/cm     E_crit = ' + mat.ecrit.toExponential(2) + ' V/cm',
    10, drawHeight + 114, canvasWidth - 20);
  fill(40, 100, 190);
  text('Drift doping N_D = ' + ND.toExponential(2) + ' cm⁻³      Drift width W = ' + (W * 1e4).toFixed(2) + ' μm', 10, drawHeight + 132, canvasWidth - 20);
  fill(190, 40, 40);
  text('Specific on-resistance R_on,sp = ' + Ronsp.toExponential(3) + ' Ω·cm²', 10, drawHeight + 148, canvasWidth - 20);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
}

function updateCanvasSize() {
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
}
