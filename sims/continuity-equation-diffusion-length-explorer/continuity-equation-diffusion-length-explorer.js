// Continuity Equation & Diffusion Length Explorer MicroSim
// Plots the steady-state solution of the minority carrier continuity
// equation for carriers injected at x=0 into a long field-free region:
//   Δp(x) = Δp(0) * exp(-x/Lp),   Lp = sqrt(Dp * τp)
// A movable position marker reads off Δp(x) and marks the diffusion
// length where the profile falls to 1/e of its peak value.
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let dpSlider, tauSlider, xSlider;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  dpSlider = createSlider(1, 40, 12, 0.5);
  dpSlider.attribute('aria-label', 'Hole diffusion coefficient in centimeters squared per second');
  tauSlider = createSlider(0.1, 20, 5, 0.1);
  tauSlider.attribute('aria-label', 'Minority carrier lifetime in microseconds');
  xSlider = createSlider(0, 30, 6, 0.1);
  xSlider.attribute('aria-label', 'Position marker in micrometers');

  positionUIElements();
  describe('Continuity equation and diffusion length explorer: plots the steady-state exponential minority carrier profile and its diffusion length', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  dpSlider.position(bx + 150, by + drawHeight + 12);
  dpSlider.size(min(canvasWidth - 170 - 30, 320));
  tauSlider.position(bx + 150, by + drawHeight + 50);
  tauSlider.size(min(canvasWidth - 170 - 30, 320));
  xSlider.position(bx + 150, by + drawHeight + 88);
  xSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const Dp = dpSlider.value();
  const tauS = tauSlider.value() * 1e-6;
  const LpCm = Math.sqrt(Dp * tauS);
  const LpUm = LpCm * 1e4;
  const dp0 = 1e15;
  const xMarkUm = xSlider.value();

  function dpOfX(xUm) { return dp0 * Math.exp(-xUm / LpUm); }

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Steady-State Minority Carrier Profile: Δp(x) = Δp(0)e^(-x/Lp)', canvasWidth / 2, 8);

  const chartX = 78, chartY = 44, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;
  const XMAX = 30;

  const pts = [];
  for (let x = 0; x <= XMAX; x += XMAX / 80) {
    pts.push({ x: x, y: dpOfX(x) });
  }

  const chartInfo = smlDrawLineChart(chartX, chartY, chartW, chartH, 0, XMAX, 0, dp0 * 1.1, [
    { points: pts, color: color(90, 62, 237) }
  ], {
    marker: { x: xMarkUm, y: dpOfX(xMarkUm) },
    xLabel: 'Position x (μm)', yLabel: 'Δp (cm⁻³)', yLabelOffset: 60
  });

  // Lp reference line
  if (LpUm <= XMAX) {
    const xLp = chartInfo.xToPx(LpUm);
    stroke(230, 90, 60); strokeWeight(1);
    drawingContext.setLineDash([3, 3]);
    line(xLp, chartY, xLp, chartY + chartH);
    drawingContext.setLineDash([]);
    noStroke(); fill(230, 90, 60); textAlign(LEFT, BOTTOM); textSize(11);
    text('Lp = ' + LpUm.toFixed(2) + ' μm (37% point)', xLp + 4, chartY + 14);
  }

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Dp = ' + Dp.toFixed(1) + ' cm²/s     τp = ' + tauSlider.value().toFixed(1) + ' μs', 10, drawHeight + 18);
  text('Diffusion length: Lp = √(Dp·τp) = ' + LpUm.toFixed(2) + ' μm', 10, drawHeight + 56);
  text('x = ' + xMarkUm.toFixed(1) + ' μm  →  Δp(x) = ' + dpOfX(xMarkUm).toExponential(2) + ' cm⁻³', 10, drawHeight + 94);
  text('This exponential profile is the steady-state solution of the minority carrier continuity equation for constant injection at x=0.', 10, drawHeight + 128);
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
