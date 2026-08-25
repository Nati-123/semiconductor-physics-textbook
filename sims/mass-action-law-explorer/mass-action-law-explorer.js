// Mass Action Law Explorer MicroSim
// Plots the n0*p0 = ni^2 hyperbola on log-log axes for a chosen material
// and temperature (computed from the shared semiconductor-materials-lib
// physics helpers, not a fixed preset table). An n0 slider moves a marker
// along the curve, with p0 computed automatically to keep the product
// fixed, and the chart is split into shaded n-type (n0>ni) and p-type
// (n0<ni) regions on either side of the intrinsic point.
// Physics note: n0p0=ni^2 holds because E_F cancels exactly when the
// non-degenerate n0 and p0 formulas are multiplied -- see Chapter 9.
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, tempSlider, n0ExpSlider;

function compact() { return canvasWidth < 480; }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  Object.keys(SML_MATERIALS).forEach(k => materialSelect.option(k));
  materialSelect.selected('Silicon');
  materialSelect.attribute('aria-label', 'Material selection');
  materialSelect.changed(function () { redraw(); });

  tempSlider = createSlider(150, 600, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');
  tempSlider.input(function () { redraw(); });

  n0ExpSlider = createSlider(0, 21, 16, 0.1);
  n0ExpSlider.attribute('aria-label', 'Electron concentration exponent (log10 n0)');
  n0ExpSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Mass action law explorer: plots the n0 times p0 equals ni squared hyperbola on log-log axes for a chosen material and temperature, with a slider-driven marker and shaded n-type/p-type regions showing the majority/minority carrier tradeoff', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 90 : 130;
  const sw = min(canvasWidth - lbl - 30, 300);
  materialSelect.position(bx + lbl, by + drawHeight + 12);
  tempSlider.position(bx + lbl, by + drawHeight + 50); tempSlider.size(sw);
  n0ExpSlider.position(bx + lbl, by + drawHeight + 88); n0ExpSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1); line(0, drawHeight, canvasWidth, drawHeight);

  const mat = SML_MATERIALS[materialSelect.value()];
  const T = tempSlider.value();
  const ni = smlNi(mat, T);
  const ni2 = ni * ni;
  const logN0 = n0ExpSlider.value();
  const n0 = Math.pow(10, logN0);
  const p0 = ni2 / n0;
  const logP0 = Math.log10(p0);
  const logNi = Math.log10(ni);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13 : 16);
  text('Mass Action Law: n₀ · p₀ = nᵢ²  (' + materialSelect.value() + ', ' + T + ' K)', canvasWidth / 2, 8);

  const chartX = 80, chartY = 44, chartW = canvasWidth - chartX - 40, chartH = drawHeight - 96;
  const AXMIN = -2, AXMAX = 22;

  function xToPx(v) { return map(v, AXMIN, AXMAX, chartX, chartX + chartW); }
  function yToPx(v) { return map(v, AXMIN, AXMAX, chartY + chartH, chartY); }

  // shaded n-type (n0>ni, right of intrinsic column) / p-type (left) regions
  noStroke();
  fill(90, 62, 237, 20);
  rect(xToPx(logNi), chartY, chartX + chartW - xToPx(logNi), chartH);
  fill(220, 150, 30, 20);
  rect(chartX, chartY, xToPx(logNi) - chartX, chartH);

  stroke(210); strokeWeight(1); noFill();
  rect(chartX, chartY, chartW, chartH);

  // hyperbola: logN0 + logP0 = log10(ni2), sample logN0 across range
  stroke(90, 62, 237); strokeWeight(2.2); noFill();
  beginShape();
  const logNi2 = Math.log10(ni2);
  for (let x = AXMIN; x <= AXMAX; x += 0.2) {
    const y = logNi2 - x;
    if (y >= AXMIN && y <= AXMAX) vertex(xToPx(x), yToPx(y));
  }
  endShape();

  // diagonal n0=p0 reference line
  stroke(200); strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(xToPx(AXMIN), yToPx(AXMIN), xToPx(AXMAX), yToPx(AXMAX));
  drawingContext.setLineDash([]);

  // intrinsic point
  noStroke(); fill(90, 180, 120);
  circle(xToPx(logNi), yToPx(logNi), 9);
  fill(60); textAlign(LEFT, BOTTOM); textSize(11);
  text('intrinsic (n₀=p₀=nᵢ)', xToPx(logNi) + 8, yToPx(logNi) - 4);

  // region labels
  fill(90, 62, 237); noStroke(); textAlign(RIGHT, TOP); textSize(compact() ? 11 : 13);
  text('n-type region (n₀ > nᵢ)', chartX + chartW - 8, chartY + 8);
  fill(200, 130, 20); textAlign(LEFT, TOP);
  text('p-type region (n₀ < nᵢ)', chartX + 8, chartY + 8);

  // current marker
  noStroke(); fill(200, 90, 40);
  circle(xToPx(logN0), yToPx(logP0), 10);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12);
  text('log₁₀ p₀ (cm⁻³)', chartX, chartY - 18);
  textAlign(RIGHT, TOP);
  text('log₁₀ n₀ (cm⁻³) →', chartX + chartW, chartY + chartH + 20);

  fill(30); noStroke();
  textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 13);
  text('Material:', 10, drawHeight + 12 + 11);
  text('Temperature:', 10, drawHeight + 50 + 11);
  text('n₀ (log scale):', 10, drawHeight + 88 + 11);
  textAlign(LEFT, TOP);
  text('nᵢ = ' + smlFormatConc(ni) + ' at ' + T + ' K   |   n₀ = ' + smlFormatConc(n0) + '  →  p₀ = ' + smlFormatConc(p0),
    10, drawHeight + 118, canvasWidth - 20);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 150 : 130;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
}
