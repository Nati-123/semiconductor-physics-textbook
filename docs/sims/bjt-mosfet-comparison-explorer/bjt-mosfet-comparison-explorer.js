// Bipolar Transistor and MOSFET Comparison Explorer MicroSim
// Left panel: BJT collector current IC = beta*IB, linear in IB.
// Right panel: MOSFET drain current ID = (mu_n*Cox/2)(W/L)(VGS-VT)^2,
// quadratic in overdrive voltage. Both panels share a live marker and
// numeric readout, directly contrasting linear vs. quadratic control.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 190;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let betaSlider, ibSlider, vovSlider, wlSlider;

const COX = 1.73e-7; // F/cm^2, from Ch16 example
const MU_N_INV = 600; // cm^2/V-s

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  betaSlider = createSlider(20, 300, 100, 5);
  betaSlider.attribute('aria-label', 'BJT current gain beta');
  ibSlider = createSlider(1, 50, 10, 1);
  ibSlider.attribute('aria-label', 'BJT base current in microamps');
  vovSlider = createSlider(0.05, 1.5, 0.5, 0.01);
  vovSlider.attribute('aria-label', 'MOSFET gate overdrive voltage');
  wlSlider = createSlider(1, 30, 10, 1);
  wlSlider.attribute('aria-label', 'MOSFET width to length ratio');

  positionUIElements();
  describe('Bipolar transistor and MOSFET comparison explorer: shows BJT collector current scaling linearly with base current, and MOSFET drain current scaling quadratically with gate overdrive voltage', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  betaSlider.position(bx + 150, by + drawHeight + 12);
  betaSlider.size(min(canvasWidth - 170 - 30, 300));
  ibSlider.position(bx + 150, by + drawHeight + 50);
  ibSlider.size(min(canvasWidth - 170 - 30, 300));
  vovSlider.position(bx + 150, by + drawHeight + 88);
  vovSlider.size(min(canvasWidth - 170 - 30, 300));
  wlSlider.position(bx + 150, by + drawHeight + 126);
  wlSlider.size(min(canvasWidth - 170 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const beta = betaSlider.value();
  const IB = ibSlider.value() * 1e-6;
  const IC = beta * IB;
  const IE = IC + IB;

  const Vov = vovSlider.value();
  const WL = wlSlider.value();
  const kp = MU_N_INV * COX;
  const ID = (kp / 2) * WL * Vov * Vov;

  const halfW = canvasWidth / 2;
  drawBjtPanel(0, halfW, beta, IB, IC, IE);
  stroke(210); line(halfW, 20, halfW, drawHeight - 20);
  drawMosfetPanel(halfW, halfW, Vov, WL, ID);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12);
  text('β:', 10, drawHeight + 18);
  text('IB (μA):', 10, drawHeight + 56);
  text('Vov (V):', 10, drawHeight + 94);
  text('W/L:', 10, drawHeight + 132);
  textSize(11); fill(80);
  text('β=' + beta + '  IB=' + ibSlider.value() + 'μA  →  IC=' + (IC * 1000).toFixed(3) + 'mA, IE=' + (IE * 1000).toFixed(3) + 'mA', canvasWidth * 0.32, drawHeight + 18, canvasWidth * 0.6);
  text('Vov=' + Vov.toFixed(2) + 'V  W/L=' + WL + '  →  ID=' + (ID * 1000).toFixed(4) + 'mA', canvasWidth * 0.32, drawHeight + 56, canvasWidth * 0.6);
}

function drawBjtPanel(x, w, beta, IB, IC, IE) {
  noStroke(); fill(20); textAlign(CENTER, TOP); textSize(13); textStyle(BOLD);
  text('BJT: IC = β·IB  (linear)', x + w / 2, 6);
  textStyle(NORMAL);

  const chartX = x + 60, chartY = 30, chartW = w - 100, chartH = drawHeight - 100;
  const pts = [];
  for (let ib = 0; ib <= 50; ib += 1) pts.push({ x: ib, y: beta * ib * 1e-6 * 1000 });
  const info = smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 50, 0, beta * 50e-6 * 1000 * 1.1, [
    { points: pts, color: color(90, 62, 237) }
  ], { marker: { x: IB * 1e6, y: IC * 1000 }, xLabel: 'IB (μA)', yLabel: 'IC (mA)', yLabelOffset: 42 });
}

function drawMosfetPanel(x, w, Vov, WL, ID) {
  noStroke(); fill(20); textAlign(CENTER, TOP); textSize(13); textStyle(BOLD);
  text('MOSFET: ID ∝ (VGS−VT)²  (quadratic)', x + w / 2, 6);
  textStyle(NORMAL);

  const chartX = x + 60, chartY = 30, chartW = w - 90, chartH = drawHeight - 100;
  const kp = MU_N_INV * COX;
  const pts = [];
  for (let v = 0; v <= 1.5; v += 0.02) pts.push({ x: v, y: (kp / 2) * WL * v * v * 1000 });
  const yMax = (kp / 2) * WL * 1.5 * 1.5 * 1000 * 1.1;
  const info = smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 1.5, 0, yMax, [
    { points: pts, color: color(230, 90, 60) }
  ], { marker: { x: Vov, y: ID * 1000 }, xLabel: 'Vov (V)', yLabel: 'ID (mA)', yLabelOffset: 42 });
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
