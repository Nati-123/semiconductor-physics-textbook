// Minority Carrier Injection Profile Explorer MicroSim
// Compares the long-base (exponential) and short-base (linear) excess
// minority carrier profiles injected at a p-n junction's depletion edge
// under forward bias, normalized to the peak injected concentration so
// their shapes can be compared directly regardless of applied voltage.
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let vSlider, lpSlider, wpSlider;

const KT_Q = 0.0259;
const PN0 = 2.25e4; // cm^-3, matches chapter worked examples

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  vSlider = createSlider(0.1, 0.65, 0.5, 0.01);
  vSlider.attribute('aria-label', 'Applied forward bias voltage');
  lpSlider = createSlider(10, 60, 35, 1);
  lpSlider.attribute('aria-label', 'Minority carrier diffusion length Lp in micrometers');
  wpSlider = createSlider(1, 60, 8, 1);
  wpSlider.attribute('aria-label', 'Short-base quasi-neutral width Wprime in micrometers');

  positionUIElements();
  describe('Minority carrier injection profile explorer: compares long-base exponential and short-base linear excess carrier profiles injected at a p-n junction depletion edge under forward bias', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  vSlider.position(bx + 150, by + drawHeight + 12);
  vSlider.size(min(canvasWidth - 170 - 30, 320));
  lpSlider.position(bx + 150, by + drawHeight + 50);
  lpSlider.size(min(canvasWidth - 170 - 30, 320));
  wpSlider.position(bx + 150, by + drawHeight + 88);
  wpSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const V = vSlider.value();
  const Lp = lpSlider.value();
  const Wp = wpSlider.value();
  const peak = PN0 * (Math.exp(V / KT_Q) - 1);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15.5);
  text('Excess Minority Carrier Profile, normalized to Δp(0)', canvasWidth / 2, 8);

  const chartX = 80, chartY = 40, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;
  const XMAX = 80;

  const longPts = [], shortPts = [];
  for (let x = 0; x <= XMAX; x += XMAX / 120) {
    longPts.push({ x: x, y: Math.exp(-x / Lp) });
    shortPts.push({ x: x, y: max(0, 1 - x / Wp) });
  }

  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, XMAX, 0, 1.08, [
    { points: longPts, color: color(90, 62, 237) },
    { points: shortPts, color: color(230, 90, 60) }
  ], { xLabel: "Distance from injection edge, x' (μm)", yLabel: 'Δp(x\') / Δp(0)', yLabelOffset: 44 });

  noStroke();
  fill(90, 62, 237); textAlign(LEFT, TOP); textSize(12);
  text('— Long-base: exp(−x\'/Lp)', chartX + 8, chartY + 8);
  fill(230, 90, 60);
  text('— Short-base: 1 − x\'/W\'', chartX + 8, chartY + 26);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12.5);
  text('V = ' + V.toFixed(2) + ' V   Lp = ' + Lp + ' μm   W\' = ' + Wp + ' μm', 10, drawHeight + 18);
  text('Δp(0) = pn0(e^(V/VT) − 1) ≈ ' + peak.toExponential(3) + ' cm⁻³  (pn0 = ' + PN0.toExponential(2) + ' cm⁻³)', 10, drawHeight + 56);
  const ratio = Lp / Wp;
  text('Lp / W\' = ' + ratio.toFixed(2) + (ratio > 3 ? '  → short-base approximation is excellent here' : (ratio < 0.5 ? '  → this W\' is not really "short base"' : '  → intermediate regime')), 10, drawHeight + 94);
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
