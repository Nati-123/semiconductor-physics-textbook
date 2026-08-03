// MOS Surface Regime Explorer MicroSim
// Plots the surface minority-carrier (electron) concentration
// ns(psi_s) = np0 * exp(psi_s/VT) for a p-type substrate on a log scale
// against surface potential psi_s, with color-coded regime bands
// (accumulation, depletion, weak inversion, strong inversion) and
// reference lines at phi_F, 2*phi_F, and the bulk doping NA (which
// ns reaches exactly at psi_s = 2*phi_F, the strong-inversion threshold).
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let psiSlider, naSlider;

const KT_Q = 0.0259;
const NI = 1.5e10;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  psiSlider = createSlider(-0.2, 0.9, 0.3, 0.005);
  psiSlider.attribute('aria-label', 'Surface potential psi_s');
  naSlider = createSlider(14, 18, 16, 0.1);
  naSlider.attribute('aria-label', 'Substrate doping concentration exponent');

  positionUIElements();
  describe('MOS surface regime explorer: plots surface electron concentration versus surface potential, with color-coded accumulation, depletion, weak inversion, and strong inversion regimes', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  psiSlider.position(bx + 150, by + drawHeight + 12);
  psiSlider.size(min(canvasWidth - 170 - 30, 320));
  naSlider.position(bx + 150, by + drawHeight + 50);
  naSlider.size(min(canvasWidth - 170 - 30, 320));
}

function regimeOf(psiS, phiF) {
  if (psiS < 0) return { name: 'Accumulation', color: color(220, 90, 60) };
  if (psiS < phiF) return { name: 'Depletion', color: color(90, 62, 237) };
  if (psiS < 2 * phiF) return { name: 'Weak Inversion', color: color(200, 140, 30) };
  return { name: 'Strong Inversion', color: color(40, 150, 90) };
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const psiS = psiSlider.value();
  const NA = Math.pow(10, naSlider.value());
  const phiF = KT_Q * Math.log(NA / NI);
  const np0 = NI * NI / NA;
  const r = regimeOf(psiS, phiF);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15.5);
  text('Surface Electron Concentration: ns(ψs) = np0 · e^(ψs/VT)', canvasWidth / 2, 8, canvasWidth - 20);

  const chartX = 85, chartY = 40, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;
  const psiMin = -0.2, psiMax = 0.9;

  drawRegimeBands(chartX, chartY, chartW, chartH, psiMin, psiMax, phiF);

  const pts = [];
  for (let p = psiMin; p <= psiMax; p += 0.01) {
    const ns = np0 * Math.exp(p / KT_Q);
    pts.push({ x: p, y: Math.log10(max(ns, 1)) });
  }
  const info = smlDrawLineChart(chartX, chartY, chartW, chartH, psiMin, psiMax, 0, 22,
    [{ points: pts, color: color(20) }],
    { marker: { x: psiS, y: Math.log10(max(np0 * Math.exp(psiS / KT_Q), 1)) }, xLabel: 'ψs (V)', yLabel: 'log10 ns (cm⁻³)', yLabelOffset: 48 });

  const naY = info.yToPx(Math.log10(NA));
  stroke(90); strokeWeight(1); drawingContext.setLineDash([3, 3]);
  line(chartX, naY, chartX + chartW, naY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90); textAlign(LEFT, BOTTOM); textSize(10.5);
  text('NA (bulk hole conc.) — reached at ψs=2φF', chartX + 4, naY - 3);

  noStroke(); fill(r.color); textAlign(CENTER, TOP); textSize(14); textStyle(BOLD);
  text(r.name, canvasWidth / 2, drawHeight - 24);
  textStyle(NORMAL);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12.5);
  text('ψs:', 10, drawHeight + 18);
  text('NA = 10^' + naSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 56);
  text('ψs = ' + psiS.toFixed(3) + ' V   φF = ' + phiF.toFixed(3) + ' V   2φF = ' + (2 * phiF).toFixed(3) + ' V   ns = ' + (np0 * Math.exp(psiS / KT_Q)).toExponential(2) + ' cm⁻³', 10, drawHeight + 94);
}

function drawRegimeBands(x, y, w, h, psiMin, psiMax, phiF) {
  function xOf(p) { return map(p, psiMin, psiMax, x, x + w); }
  noStroke();
  fill(220, 90, 60, 40);
  rect(xOf(psiMin), y, xOf(0) - xOf(psiMin), h);
  fill(90, 62, 237, 35);
  rect(xOf(0), y, xOf(phiF) - xOf(0), h);
  fill(200, 140, 30, 40);
  rect(xOf(phiF), y, xOf(2 * phiF) - xOf(phiF), h);
  fill(40, 150, 90, 35);
  rect(xOf(2 * phiF), y, xOf(psiMax) - xOf(2 * phiF), h);
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
