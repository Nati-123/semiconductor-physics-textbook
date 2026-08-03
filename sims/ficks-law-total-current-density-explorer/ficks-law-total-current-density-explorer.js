// Fick's Law and Total Current Density Explorer MicroSim
// Plots a decaying hole concentration profile p(x) = P0*exp(-x/L), shows
// the tangent line and diffusion current at a movable marker position
// (J_diff = -q*Dp*dp/dx, positive in the direction of decreasing
// concentration), and combines it with a uniform drift current
// contribution into a total current density readout.
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let lSlider, xSlider, eSlider;
const Q = 1.602e-19;
const P0 = 1e16;   // cm^-3, concentration at x=0
const DP = 12;     // cm^2/s, representative hole diffusion coefficient
const MU_P = 480;  // cm^2/V.s, representative hole mobility
const XMAX_UM = 10;

function pAt(x_um, L_um) { return P0 * Math.exp(-x_um / L_um); }
function dpdx(x_um, L_um) { // returns d p / d x  in cm^-3 per cm
  const p = pAt(x_um, L_um);
  const L_cm = L_um * 1e-4;
  return -p / L_cm;
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  lSlider = createSlider(1, 10, 4, 0.1);
  lSlider.attribute('aria-label', 'Concentration decay length in micrometers');
  xSlider = createSlider(0, XMAX_UM, 2, 0.1);
  xSlider.attribute('aria-label', 'Position marker in micrometers');
  eSlider = createSlider(-500, 500, 0, 10);
  eSlider.attribute('aria-label', 'Electric field in volts per centimeter');

  positionUIElements();
  describe('Fick\'s law and total current density explorer: plots a decaying hole concentration profile with a movable position marker showing local diffusion current, combined with a drift current contribution into a total current readout', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  lSlider.position(bx + 190, by + drawHeight + 15);
  lSlider.size(min(canvasWidth - 210 - 20, 280));
  xSlider.position(bx + 190, by + drawHeight + 53);
  xSlider.size(min(canvasWidth - 210 - 20, 280));
  eSlider.position(bx + 190, by + drawHeight + 91);
  eSlider.size(min(canvasWidth - 210 - 20, 280));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const L = lSlider.value();
  const xMark = xSlider.value();
  const E = eSlider.value();

  const slope = dpdx(xMark, L); // cm^-3/cm, negative
  const Jdiff = -Q * DP * slope; // A/cm^2 (positive, flows toward lower concentration)
  const Jdrift = Q * P0 * MU_P * E; // A/cm^2, uniform background concentration P0
  const Jtotal = Jdiff + Jdrift;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Fick\'s Law: J_diff = −qD_p(dp/dx)   |   J_total = J_diff + J_drift', canvasWidth / 2, 8);

  const chartX = 60, chartY = 44, chartW = canvasWidth * 0.55, chartH = drawHeight - 96;
  const pts = [];
  for (let x = 0; x <= XMAX_UM; x += 0.1) pts.push({ x: x, y: pAt(x, L) });
  const { xToPx, yToPx } = smlDrawLineChart(chartX, chartY, chartW, chartH, 0, XMAX_UM, 0, P0 * 1.05, [
    { points: pts, color: color(90, 62, 237) }
  ], {
    marker: { x: xMark, y: pAt(xMark, L) },
    xLabel: 'Position x (μm)', yLabel: 'p(x) (cm⁻³)', yLabelOffset: 46
  });

  // tangent line at marker
  const pMark = pAt(xMark, L);
  const dx_um = 1.5;
  const y1 = pMark - slope * (dx_um * 1e-4);
  const y2 = pMark + slope * (dx_um * 1e-4);
  stroke(220, 140, 40); strokeWeight(2);
  line(xToPx(max(0, xMark - dx_um)), yToPx(constrain(y1, 0, P0 * 1.05)), xToPx(min(XMAX_UM, xMark + dx_um)), yToPx(constrain(y2, 0, P0 * 1.05)));

  drawCard(L, xMark, slope, Jdiff, E, Jdrift, Jtotal);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Decay length L = ' + L.toFixed(1) + ' μm', 10, drawHeight + 24);
  text('Position marker x = ' + xMark.toFixed(1) + ' μm', 10, drawHeight + 62);
  text('Electric field E = ' + E + ' V/cm', 10, drawHeight + 100);
}

function drawCard(L, xMark, slope, Jdiff, E, Jdrift, Jtotal) {
  const cardX = canvasWidth * 0.62, cardY = 44, cardW = canvasWidth - cardX - 20, cardH = drawHeight - 96;
  noStroke();
  fill(240, 245, 255);
  stroke(168, 200, 255);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke();
  fill(30);
  textAlign(LEFT, TOP);
  textSize(12);
  const lines = [
    'dp/dx at x = ' + xMark.toFixed(1) + ' μm:',
    slope.toExponential(2) + ' cm⁻⁴',
    '',
    'J_diffusion = ' + Jdiff.toExponential(2) + ' A/cm²',
    'J_drift = ' + Jdrift.toExponential(2) + ' A/cm²',
    '',
    'J_total = ' + Jtotal.toExponential(2) + ' A/cm²'
  ];
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cardX + 14, cardY + 12 + i * 22, cardW - 28);
  }
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
