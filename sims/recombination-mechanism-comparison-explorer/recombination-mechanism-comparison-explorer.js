// Recombination Mechanism Comparison Explorer MicroSim
// Compares SRH (trap-assisted), Auger, and direct (band-to-band)
// recombination rates as separate curves R(Δn) swept across a wide
// range of excess carrier concentration, on a log-log chart, for
// silicon (indirect gap) vs. GaAs (direct gap).
//   R_SRH    = Δn / τ_SRH
//   R_Auger  = C_Auger * Δn^3
//   R_direct = B * Δn * (n0 + p0 + Δn)
// A movable Δn marker shows the dominant mechanism at that injection
// level. No temperature control: an honest T-dependence for τ_SRH and
// C_Auger at this textbook's level would require inventing coefficients
// not grounded in the text, so it is intentionally omitted.
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 500;
let minDrawHeight = 460;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, dnExpSlider, dopingExpSlider;

const MATERIALS = {
  'Silicon (indirect gap)': { B: 1.0e-14, tauSRH: 1e-6, cAuger: 2.8e-31, n0: 1e10, isIndirect: true },
  'GaAs (direct gap)': { B: 1.0e-10, tauSRH: 5e-8, cAuger: 7e-30, n0: 2.1e6, isIndirect: false }
};

const SWEEP_MIN = 10, SWEEP_MAX = 20; // Δn exponent range for the curves

function compact() { return canvasWidth < 480; }

function computeRates(mat, dn, Ndoping) {
  const p0 = Ndoping;
  const n0eff = (mat.n0 * mat.n0) / Ndoping;
  const RSRH = dn / mat.tauSRH;
  const RAuger = mat.cAuger * dn * dn * dn;
  const Rdirect = mat.B * dn * (n0eff + p0 + dn);
  return { RSRH: RSRH, RAuger: RAuger, Rdirect: Rdirect };
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  Object.keys(MATERIALS).forEach(k => materialSelect.option(k));
  materialSelect.selected('Silicon (indirect gap)');
  materialSelect.attribute('aria-label', 'Material');
  materialSelect.changed(function () { redraw(); });

  dnExpSlider = createSlider(SWEEP_MIN + 0.5, SWEEP_MAX - 0.5, 15, 0.1);
  dnExpSlider.attribute('aria-label', 'Excess carrier concentration marker exponent');
  dnExpSlider.input(function () { redraw(); });
  dopingExpSlider = createSlider(14, 18, 16, 0.1);
  dopingExpSlider.attribute('aria-label', 'Doping concentration exponent');
  dopingExpSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Recombination mechanism comparison explorer: plots SRH, Auger, and direct recombination rate curves against excess carrier concentration on a log-log chart, with a movable marker showing the dominant mechanism at that injection level', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 95 : 150;
  const sw = min(canvasWidth - lbl - 30, 320);
  materialSelect.position(bx + lbl, by + drawHeight + 8); materialSelect.size(sw);
  dnExpSlider.position(bx + lbl, by + drawHeight + 46); dnExpSlider.size(sw);
  dopingExpSlider.position(bx + lbl, by + drawHeight + 84); dopingExpSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const mat = MATERIALS[materialSelect.value()];
  const dnMarkerExp = dnExpSlider.value();
  const dnMarker = Math.pow(10, dnMarkerExp);
  const Ndoping = Math.pow(10, dopingExpSlider.value());

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13 : 16);
  text('Recombination Rate vs. Excess Carrier Concentration (log-log)', canvasWidth / 2, 8);

  // Sample the three rate curves across the sweep range.
  const N_PTS = 80;
  const srhPts = [], augerPts = [], directPts = [];
  let yLo = Infinity, yHi = -Infinity;
  for (let i = 0; i <= N_PTS; i++) {
    const xExp = SWEEP_MIN + (SWEEP_MAX - SWEEP_MIN) * (i / N_PTS);
    const dn = Math.pow(10, xExp);
    const r = computeRates(mat, dn, Ndoping);
    const ySRH = Math.log10(Math.max(r.RSRH, 1e-6));
    const yAug = Math.log10(Math.max(r.RAuger, 1e-6));
    const yDir = Math.log10(Math.max(r.Rdirect, 1e-6));
    srhPts.push({ x: xExp, y: ySRH });
    augerPts.push({ x: xExp, y: yAug });
    directPts.push({ x: xExp, y: yDir });
    yLo = Math.min(yLo, ySRH, yAug, yDir);
    yHi = Math.max(yHi, ySRH, yAug, yDir);
  }
  yLo = Math.floor(yLo) - 0.5;
  yHi = Math.ceil(yHi) + 0.5;

  const chartX = compact() ? 46 : 58, chartY = 42;
  const chartW = canvasWidth - chartX - 24;
  const chartH = drawHeight - 118;

  const { xToPx, yToPx } = smlDrawLineChart(chartX, chartY, chartW, chartH, SWEEP_MIN, SWEEP_MAX, yLo, yHi, [
    { points: srhPts, color: color(90, 62, 237) },
    { points: augerPts, color: color(230, 90, 60) },
    { points: directPts, color: color(60, 160, 100) }
  ], {
    xLabel: 'Δn (cm⁻³, log scale)', yLabel: 'Recombination rate (cm⁻³s⁻¹, log scale)', yLabelOffset: compact() ? 34 : 42
  });

  // Manual axis tick labels (log-log chart: shared lib draws no ticks).
  noStroke(); fill(70); textAlign(CENTER, TOP); textSize(compact() ? 9 : 10);
  for (let xe = Math.ceil(SWEEP_MIN / 2) * 2; xe <= SWEEP_MAX; xe += 2) {
    const px = xToPx(xe);
    stroke(225); line(px, chartY, px, chartY + chartH); noStroke();
    text('10' + toSuperscript(xe), px, chartY + chartH + 6);
  }
  const yStep = Math.max(2, Math.round((yHi - yLo) / 6));
  textAlign(RIGHT, CENTER);
  for (let ye = Math.ceil(yLo / yStep) * yStep; ye <= yHi; ye += yStep) {
    const py = yToPx(ye);
    stroke(225); line(chartX, py, chartX + chartW, py); noStroke();
    text('10' + toSuperscript(ye), chartX - 6, py);
  }

  // Legend
  const legX = chartX + chartW - (compact() ? 108 : 128), legY = chartY + 8;
  noStroke(); fill(255, 255, 255, 235); rect(legX - 4, legY - 3, 96, 54, 4);
  drawLegendSwatch(legX, legY, color(90, 62, 237), 'SRH');
  drawLegendSwatch(legX, legY + 16, color(230, 90, 60), 'Auger');
  drawLegendSwatch(legX, legY + 32, color(60, 160, 100), 'Direct');

  // Marker: vertical dashed line at the chosen Δn, with a dot on each curve.
  const rates = computeRates(mat, dnMarker, Ndoping);
  const mx = xToPx(dnMarkerExp);
  stroke(90); strokeWeight(1); drawingContext.setLineDash([3, 3]);
  line(mx, chartY, mx, chartY + chartH);
  drawingContext.setLineDash([]);
  noStroke();
  fill(90, 62, 237); circle(mx, yToPx(Math.log10(Math.max(rates.RSRH, 1e-6))), 7);
  fill(230, 90, 60); circle(mx, yToPx(Math.log10(Math.max(rates.RAuger, 1e-6))), 7);
  fill(60, 160, 100); circle(mx, yToPx(Math.log10(Math.max(rates.Rdirect, 1e-6))), 7);

  let dominant = 'SRH (trap-assisted)';
  let maxR = rates.RSRH;
  if (rates.RAuger > maxR) { dominant = 'Auger'; maxR = rates.RAuger; }
  if (rates.Rdirect > maxR) { dominant = 'Direct (band-to-band)'; maxR = rates.Rdirect; }
  const others = [
    { label: 'SRH', v: rates.RSRH }, { label: 'Auger', v: rates.RAuger }, { label: 'Direct', v: rates.Rdirect }
  ].filter(o => o.v !== maxR && o.v > 0);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(compact() ? 11 : 13);
  text('Material: ' + materialSelect.value() + '   N (doping) = 10' + toSuperscript(dopingExpSlider.value().toFixed(1)) + ' cm⁻³', 10, drawHeight + 4);
  text('Marker: Δn = 10' + toSuperscript(dnMarkerExp.toFixed(1)) + ' cm⁻³', 10, drawHeight + 24);
  fill(90, 62, 237);
  textStyle(BOLD);
  let domLine = 'Dominant mechanism at this Δn: ' + dominant;
  if (others.length > 0) {
    const ratios = others.map(o => o.label + ' ' + (maxR / o.v).toExponential(1) + '× weaker').join(', ');
    domLine += '  (' + ratios + ')';
  }
  text(domLine, 10, drawHeight + 44, canvasWidth - 20);
  textStyle(NORMAL);
  fill(80); textSize(compact() ? 10 : 11.5);
  text('Auger grows as Δn³ and only overtakes the others at very high injection; direct recombination is far stronger in GaAs than silicon at every Δn.', 10, drawHeight + (compact() ? 78 : 70), canvasWidth - 20);
}

function toSuperscript(exp) {
  const supDigits = { '-': '⁻', '.': '·', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return String(exp).split('').map(c => supDigits[c] || c).join('');
}

function drawLegendSwatch(x, y, col, label) {
  stroke(col); strokeWeight(2.5); line(x, y + 5, x + 16, y + 5);
  noStroke(); fill(30); textAlign(LEFT, CENTER); textSize(10.5);
  text(label, x + 20, y + 5);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 190 : 150;
  minDrawHeight = compact() ? 620 : 460;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 620);
  else drawHeight = Math.max(drawHeight, 460);
}
