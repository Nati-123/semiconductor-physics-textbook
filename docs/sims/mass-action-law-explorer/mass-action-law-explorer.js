// Mass Action Law Explorer MicroSim
// Plots the n0*p0 = ni^2 hyperbola on log-log axes; an n0 slider moves a
// marker along the curve, with p0 computed automatically to keep the
// product fixed at the selected material/temperature's ni^2.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let presetSelect, n0ExpSlider;

// ni values (cm^-3) at the labeled condition, precomputed for simplicity
const PRESETS = {
  'Silicon, 300 K (nᵢ≈8×10⁹)': 8e9,
  'Silicon, 400 K (nᵢ≈4×10¹²)': 4e12,
  'Germanium, 300 K (nᵢ≈2×10¹³)': 2e13,
  'GaAs, 300 K (nᵢ≈2×10⁶)': 2e6
};

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  presetSelect = createSelect();
  Object.keys(PRESETS).forEach(k => presetSelect.option(k));
  presetSelect.selected('Silicon, 300 K (nᵢ≈8×10⁹)');
  presetSelect.attribute('aria-label', 'Material and temperature preset');

  n0ExpSlider = createSlider(6, 19, 16, 0.1);
  n0ExpSlider.attribute('aria-label', 'Electron concentration exponent (log10 n0)');

  positionUIElements();
  describe('Mass action law explorer: plots the n0 times p0 equals ni squared hyperbola on log-log axes with a slider-driven marker showing the majority/minority carrier tradeoff', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  presetSelect.position(bx + 10, by + drawHeight + 12);
  n0ExpSlider.position(bx + 170, by + drawHeight + 52);
  n0ExpSlider.size(min(canvasWidth - 190 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const ni = PRESETS[presetSelect.value()];
  const ni2 = ni * ni;
  const logN0 = n0ExpSlider.value();
  const n0 = Math.pow(10, logN0);
  const p0 = ni2 / n0;
  const logP0 = Math.log10(p0);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Mass Action Law: n₀ · p₀ = nᵢ² (fixed at this T)', canvasWidth / 2, 8);

  const chartX = 80, chartY = 44, chartW = canvasWidth - chartX - 40, chartH = drawHeight - 96;
  const AXMIN = 0, AXMAX = 22;

  function xToPx(v) { return map(v, AXMIN, AXMAX, chartX, chartX + chartW); }
  function yToPx(v) { return map(v, AXMIN, AXMAX, chartY + chartH, chartY); }

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
  const niLog = Math.log10(ni);
  noStroke(); fill(90, 180, 120);
  circle(xToPx(niLog), yToPx(niLog), 9);
  fill(60); textAlign(LEFT, BOTTOM); textSize(11);
  text('intrinsic (n₀=p₀=nᵢ)', xToPx(niLog) + 8, yToPx(niLog) - 4);

  // current marker
  noStroke(); fill(200, 90, 40);
  circle(xToPx(logN0), yToPx(logP0), 10);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12);
  text('log₁₀ p₀ (cm⁻³)', chartX, chartY - 18);
  textAlign(RIGHT, TOP);
  text('log₁₀ n₀ (cm⁻³) →', chartX + chartW, chartY + chartH + 20);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Preset:', 10, drawHeight + 20 - 8);
  text('n₀ = 10^' + logN0.toFixed(1) + ' cm⁻³  →  p₀ = ' + p0.toExponential(2) + ' cm⁻³', 10, drawHeight + 60);
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
