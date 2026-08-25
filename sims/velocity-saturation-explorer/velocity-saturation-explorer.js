// Velocity Saturation Explorer MicroSim
// Plots the saturating drift-velocity curve
//   v_d(E) = mu*E / sqrt(1 + (mu*E/v_sat)^2)
// against the naive linear prediction v_d=mu*E, using a low-field
// mobility computed via the shared Chapter 11 Matthiessen's-rule model,
// with a selectable tolerance (matching Chapter 10's exact-vs-approximate
// pattern) quantifying exactly where the linear approximation stops
// being acceptable.
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Understand / Analyze / Evaluate (L2-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 190;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let carrierSelect, ndExpSlider, tempSlider, eSlider, toleranceSelect;
const VSAT = { 'Electrons (n-type)': 1.0e7, 'Holes (p-type)': 0.8e7 };
const FIELD_PRESETS = [{ label: 'Low', v: 2000 }, { label: 'Moderate', v: 10000 }, { label: 'High', v: 40000 }];

function compact() { return canvasWidth < 480; }
function vDrift(mu, vsat, E) {
  const linear = mu * E;
  return linear / Math.sqrt(1 + (linear / vsat) * (linear / vsat));
}
function pctError(mu, vsat, E) {
  const linear = mu * E;
  const actual = vDrift(mu, vsat, E);
  return Math.abs(linear - actual) / actual * 100;
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  carrierSelect = createSelect();
  Object.keys(SML_MOBILITY_CARRIERS).forEach(k => carrierSelect.option(k));
  carrierSelect.selected('Electrons (n-type)');
  carrierSelect.attribute('aria-label', 'Carrier type');
  carrierSelect.changed(function () { redraw(); });

  ndExpSlider = createSlider(14, 19, 16, 0.1);
  ndExpSlider.attribute('aria-label', 'Doping concentration exponent');
  ndExpSlider.input(function () { redraw(); });
  tempSlider = createSlider(150, 500, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');
  tempSlider.input(function () { redraw(); });
  eSlider = createSlider(0, 50000, 5000, 500);
  eSlider.attribute('aria-label', 'Electric field marker in volts per centimeter');
  eSlider.input(function () { redraw(); });

  toleranceSelect = createSelect();
  toleranceSelect.option('1%'); toleranceSelect.option('5%'); toleranceSelect.option('10%');
  toleranceSelect.selected('5%');
  toleranceSelect.attribute('aria-label', 'Acceptable error tolerance for the linear approximation');
  toleranceSelect.changed(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Velocity saturation explorer: plots the saturating drift velocity curve against the naive linear mobility prediction as a function of electric field, with a selectable error tolerance quantifying where the linear approximation stops being valid', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function rowY() {
  if (compact()) return { carrier: 12, nd: 50, temp: 88, presets: 126, field: 164, tol: 202 };
  return { carrier: 12, nd: 50, temp: 88, presets: 126, field: 126, tol: 164 };
}

function presetButtons() {
  const bw = 62, bh = 22, gap = 8;
  const rows = rowY();
  if (compact()) return FIELD_PRESETS.map((p, i) => ({ p: p, x: 10 + i * (bw + gap), y: drawHeight + rows.presets, w: bw, h: bh }));
  const startX = canvasWidth - (bw + gap) * FIELD_PRESETS.length - 14;
  return FIELD_PRESETS.map((p, i) => ({ p: p, x: startX + i * (bw + gap), y: drawHeight + rows.presets, w: bw, h: bh }));
}

function mousePressed() {
  for (const b of presetButtons()) {
    if (smlPointInRect(mouseX, mouseY, b.x, b.y, b.w, b.h)) { eSlider.value(b.p.v); redraw(); return false; }
  }
}

function toleranceFraction() {
  const v = toleranceSelect.value();
  return v === '1%' ? 0.01 : (v === '10%' ? 0.10 : 0.05);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 95 : 150;
  const rows = rowY();
  const sw = min(canvasWidth - lbl - 30, 300);
  const fieldSw = compact() ? sw : min(canvasWidth - lbl - 240, 300);
  carrierSelect.position(bx + lbl, by + drawHeight + rows.carrier);
  ndExpSlider.position(bx + lbl, by + drawHeight + rows.nd); ndExpSlider.size(sw);
  tempSlider.position(bx + lbl, by + drawHeight + rows.temp); tempSlider.size(sw);
  eSlider.position(bx + lbl, by + drawHeight + rows.field); eSlider.size(fieldSw);
  toleranceSelect.position(bx + lbl, by + drawHeight + rows.tol);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1); line(0, drawHeight, canvasWidth, drawHeight);

  const carrier = SML_MOBILITY_CARRIERS[carrierSelect.value()];
  const vsat = VSAT[carrierSelect.value()];
  const N = Math.pow(10, ndExpSlider.value());
  const T = tempSlider.value();
  const Emark = eSlider.value();
  const mu = smlMobility(carrier, T, N);
  const tol = toleranceFraction();

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 12.5 : 15);
  text('Drift Velocity: v_d = μE / √(1+(μE/v_sat)²)', canvasWidth / 2, 8);

  const chartX = compact() ? 60 : 70, chartY = 44, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;
  const EMAX = 50000;

  const ptsActual = [], ptsLinear = [];
  for (let E = 0; E <= EMAX; E += 500) {
    ptsActual.push({ x: E, y: vDrift(mu, vsat, E) });
    ptsLinear.push({ x: E, y: min(mu * E, vsat * 1.5) });
  }
  const yMax = vsat * 1.5;

  // shade the region where the linear approximation meets tolerance
  let crossE = null;
  for (let E = 500; E <= EMAX; E += 100) {
    if (pctError(mu, vsat, E) > tol * 100) { crossE = E; break; }
  }
  if (crossE !== null) {
    noStroke(); fill(255, 220, 210, 150);
    const x0 = map(crossE, 0, EMAX, chartX, chartX + chartW);
    rect(x0, chartY, chartX + chartW - x0, chartH);
  }

  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, EMAX, 0, yMax, [
    { points: ptsLinear, color: color(200) },
    { points: ptsActual, color: color(90, 62, 237) }
  ], {
    marker: { x: Emark, y: vDrift(mu, vsat, Emark) },
    xLabel: 'Electric field E (V/cm)', yLabel: 'Drift velocity (cm/s)', yLabelOffset: 46
  });

  const vsatY = map(vsat, 0, yMax, chartY + chartH, chartY);
  stroke(90, 180, 120); strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(chartX, vsatY, chartX + chartW, vsatY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90, 180, 120); textAlign(LEFT, BOTTOM); textSize(compact() ? 10 : 11);
  text('v_sat = ' + vsat.toExponential(1) + ' cm/s', chartX + 4, vsatY - 3);

  if (crossE !== null) {
    noStroke(); fill(200, 90, 30); textAlign(LEFT, TOP); textSize(compact() ? 9.5 : 10.5);
    text('shaded: linear approx. exceeds ' + toleranceSelect.value() + ' error', chartX + 6, chartY + 4);
  }

  for (const b of presetButtons()) smlDrawButton(b.x, b.y, b.w, b.h, b.p.label, Emark === b.p.v);

  const rows = rowY();
  const errNow = pctError(mu, vsat, Emark);
  fill(30); noStroke();
  textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 13);
  text('Carrier:', 10, drawHeight + rows.carrier + 11);
  text('N:', 10, drawHeight + rows.nd + 11);
  text('T:', 10, drawHeight + rows.temp + 11);
  text('Field E:', 10, drawHeight + rows.field + 11);
  text('Tolerance:', 10, drawHeight + rows.tol + 11);
  textAlign(RIGHT, CENTER);
  text(smlFormatPow10(ndExpSlider.value()), canvasWidth - 10, drawHeight + rows.nd + 11);
  text(T + ' K', canvasWidth - 10, drawHeight + rows.temp + 11);

  const readY = drawHeight + rows.tol + (compact() ? 34 : 24);
  fill(20); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11.5);
  text('low-field μ = ' + mu.toFixed(0) + ' cm²/V·s   |   at E=' + Emark + ' V/cm: linear error = ' + errNow.toFixed(1) + '%' +
    (crossE !== null ? '   |   exceeds ' + toleranceSelect.value() + ' error above E ≈ ' + crossE.toFixed(0) + ' V/cm' : '   |   stays within tolerance over this whole range'),
    10, readY, canvasWidth - 20);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 280 : 220;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 560);
}
