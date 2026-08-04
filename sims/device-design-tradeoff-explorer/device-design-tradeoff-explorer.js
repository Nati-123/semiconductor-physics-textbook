// Device Design Trade-Off Explorer MicroSim
// Plots the power-diode "silicon limit" trade-off between breakdown
// voltage and specific on-resistance, Ron,sp = 4*BV^2/(mu_n*eps*Ecrit^3),
// on a log-log chart, with a live marker and the required drift doping
// and width shown alongside.
// Bloom Level: Analyze (L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let bvSlider;

const Q = 1.602e-19, EPS_S = 1.035e-12, ECRIT = 3e5, MU_N = 1350;

function NDfor(BV) { return EPS_S * ECRIT * ECRIT / (2 * Q * BV); }
function Wfor(BV) { return 2 * BV / ECRIT; }
function RonSpFor(BV) { return 4 * BV * BV / (MU_N * EPS_S * Math.pow(ECRIT, 3)); }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  bvSlider = createSlider(50, 2000, 500, 10);
  bvSlider.attribute('aria-label', 'Target breakdown voltage in volts');

  positionUIElements();
  describe('Device design trade-off explorer: plots the power diode trade-off between breakdown voltage and specific on-resistance, with required drift doping and width', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  bvSlider.position(bx + 190, by + drawHeight + 14);
  bvSlider.size(min(canvasWidth - 210 - 30, 400));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const BV = bvSlider.value();
  const ND = NDfor(BV), W = Wfor(BV), Ronsp = RonSpFor(BV);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15.5);
  text('R_on,sp ≈ 4·V_BR² / (μn·εs·E_crit³)', canvasWidth / 2, 8);

  const chartX = 85, chartY = 40, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;
  const pts = [];
  for (let bv = 50; bv <= 2000; bv += 10) {
    pts.push({ x: Math.log10(bv), y: Math.log10(RonSpFor(bv)) });
  }
  const info = smlDrawLineChart(chartX, chartY, chartW, chartH, Math.log10(50), Math.log10(2000), Math.log10(RonSpFor(50)) - 0.3, Math.log10(RonSpFor(2000)) + 0.3, [
    { points: pts, color: color(90, 62, 237) }
  ], {
    marker: { x: Math.log10(BV), y: Math.log10(Ronsp) },
    xLabel: 'log10 V_BR (V)', yLabel: 'log10 R_on,sp (Ω·cm²)', yLabelOffset: 50
  });

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12);
  text('Target V_BR (V):', 10, drawHeight + 18);
  textSize(11.5); fill(70);
  text('V_BR=' + BV + 'V  →  ND=' + ND.toExponential(2) + ' cm⁻³   W=' + (W * 1e4).toFixed(1) + ' μm   R_on,sp=' + Ronsp.toFixed(4) + ' Ω·cm²', canvasWidth * 0.42, drawHeight + 20, canvasWidth * 0.56);
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
