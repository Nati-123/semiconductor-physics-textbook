// Fick's Law and Total Current Density Explorer MicroSim
// Plots a decaying hole concentration profile p(x) = P0*exp(-x/L), shows
// the tangent line and diffusion current at a movable marker position
// (J_diff = -q*Dp*dp/dx, positive in the direction of decreasing
// concentration), and combines it with a uniform drift current
// contribution into a total current density readout. D_p is computed
// live from the Einstein relation (Chapter 12) using the shared
// Matthiessen's-rule mobility model (Chapter 11), not a fixed constant,
// so temperature changes propagate correctly through D_p into J_diff.
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 190;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let lSlider, xSlider, eSlider, tempSlider, ndExpSlider;
const Q = 1.602e-19, KB_EV = 8.617e-5;
const P0 = 1e16;   // cm^-3, concentration at x=0
const XMAX_UM = 10;

function compact() { return canvasWidth < 480; }
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
  lSlider.input(function () { redraw(); });
  xSlider = createSlider(0, XMAX_UM, 2, 0.1);
  xSlider.attribute('aria-label', 'Position marker in micrometers');
  xSlider.input(function () { redraw(); });
  eSlider = createSlider(-500, 500, 0, 10);
  eSlider.attribute('aria-label', 'Electric field in volts per centimeter');
  eSlider.input(function () { redraw(); });
  tempSlider = createSlider(150, 500, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature in kelvin, used in the Einstein relation for D_p');
  tempSlider.input(function () { redraw(); });
  ndExpSlider = createSlider(14, 19, 16, 0.1);
  ndExpSlider.attribute('aria-label', 'Acceptor concentration exponent, used for hole mobility');
  ndExpSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Fick\'s law and total current density explorer: plots a decaying hole concentration profile with a movable position marker showing local diffusion current computed from a temperature-dependent diffusion coefficient via the Einstein relation, combined with a drift current contribution into a total current readout', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function rowY() {
  return { L: 12, x: 50, E: 88, T: 126, N: 164 };
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 95 : 150;
  const sw = min(canvasWidth - lbl - 30, 300);
  const rows = rowY();
  lSlider.position(bx + lbl, by + drawHeight + rows.L); lSlider.size(sw);
  xSlider.position(bx + lbl, by + drawHeight + rows.x); xSlider.size(sw);
  eSlider.position(bx + lbl, by + drawHeight + rows.E); eSlider.size(sw);
  tempSlider.position(bx + lbl, by + drawHeight + rows.T); tempSlider.size(sw);
  ndExpSlider.position(bx + lbl, by + drawHeight + rows.N); ndExpSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1); line(0, drawHeight, canvasWidth, drawHeight);

  const L = lSlider.value();
  const xMark = xSlider.value();
  const E = eSlider.value();
  const T = tempSlider.value();
  const NA = Math.pow(10, ndExpSlider.value());

  const holeCarrier = SML_MOBILITY_CARRIERS['Holes (p-type)'];
  const muP = smlMobility(holeCarrier, T, NA);
  const DP = muP * KB_EV * T; // Einstein relation, cm^2/s

  const slope = dpdx(xMark, L); // cm^-3/cm, negative
  const Jdiff = -Q * DP * slope; // A/cm^2 (positive, flows toward lower concentration)
  const Jdrift = Q * P0 * muP * E; // A/cm^2, uniform background concentration P0
  const Jtotal = Jdiff + Jdrift;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 12.5 : 15);
  text('J_diff = −qD_p(dp/dx)   |   J_total = J_diff + J_drift', canvasWidth / 2, 8);
  textAlign(CENTER, TOP); textSize(11); fill(80);
  text('D_p = μ_p·k_BT/q (Einstein relation) = ' + DP.toFixed(2) + ' cm²/s at ' + T + ' K', canvasWidth / 2, 28);

  const leftW = compact() ? canvasWidth : Math.round(canvasWidth * 0.58);
  drawChart(L, xMark, slope, leftW);
  // Card panelX is 0 in compact mode (stacked below the chart, full
  // width) but leftW in non-compact mode (to the right of the chart) --
  // NOT leftW in both cases, which would place it off-screen when
  // leftW equals the full canvas width.
  const cardPanelX = compact() ? 0 : leftW;
  drawCard(L, xMark, slope, Jdiff, E, Jdrift, Jtotal, muP, DP, cardPanelX, compact() ? drawHeight * 0.56 : 0, compact() ? canvasWidth : canvasWidth - leftW, compact() ? drawHeight * 0.44 : drawHeight);

  const rows = rowY();
  fill(30); noStroke(); textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 13);
  text('Decay length L:', 10, drawHeight + rows.L + 11);
  text('Position x:', 10, drawHeight + rows.x + 11);
  text('Field E:', 10, drawHeight + rows.E + 11);
  text('Temperature:', 10, drawHeight + rows.T + 11);
  text('N_A (holes):', 10, drawHeight + rows.N + 11);
  textAlign(RIGHT, CENTER);
  text(L.toFixed(1) + ' μm', canvasWidth - 10, drawHeight + rows.L + 11);
  text(xMark.toFixed(1) + ' μm', canvasWidth - 10, drawHeight + rows.x + 11);
  text(E + ' V/cm', canvasWidth - 10, drawHeight + rows.E + 11);
  text(T + ' K', canvasWidth - 10, drawHeight + rows.T + 11);
  text(smlFormatPow10(ndExpSlider.value()), canvasWidth - 10, drawHeight + rows.N + 11);
}

function drawChart(L, xMark, slope, panelW) {
  const chartX = compact() ? 55 : 60, chartY = 54, chartW = panelW - chartX - 20;
  const chartBottom = compact() ? drawHeight * 0.5 : drawHeight - 40;
  const chartH = chartBottom - chartY;
  const pts = [];
  for (let x = 0; x <= XMAX_UM; x += 0.1) pts.push({ x: x, y: pAt(x, L) });
  const { xToPx, yToPx } = smlDrawLineChart(chartX, chartY, chartW, chartH, 0, XMAX_UM, 0, P0 * 1.05, [
    { points: pts, color: color(90, 62, 237) }
  ], {
    marker: { x: xMark, y: pAt(xMark, L) },
    xLabel: 'Position x (μm)', yLabel: 'p(x) (cm⁻³)', yLabelOffset: compact() ? 40 : 46
  });

  const pMark = pAt(xMark, L);
  const dx_um = 1.5;
  const y1 = pMark - slope * (dx_um * 1e-4);
  const y2 = pMark + slope * (dx_um * 1e-4);
  stroke(220, 140, 40); strokeWeight(2);
  line(xToPx(max(0, xMark - dx_um)), yToPx(constrain(y1, 0, P0 * 1.05)), xToPx(min(XMAX_UM, xMark + dx_um)), yToPx(constrain(y2, 0, P0 * 1.05)));
}

function drawCard(L, xMark, slope, Jdiff, E, Jdrift, Jtotal, muP, DP, panelX, panelY, panelW, panelH) {
  const cardX = panelX + (compact() ? 20 : 16), cardY = panelY + (compact() ? 16 : 54);
  const cardW = (compact() ? canvasWidth - 40 : panelW - 32);
  const lines = [
    'μ_p = ' + muP.toFixed(0) + ' cm²/V·s   D_p = ' + DP.toFixed(2) + ' cm²/s',
    'dp/dx at x=' + xMark.toFixed(1) + ' μm: ' + slope.toExponential(2) + ' cm⁻⁴',
    'J_diffusion = ' + Jdiff.toExponential(2) + ' A/cm²',
    'J_drift = ' + Jdrift.toExponential(2) + ' A/cm²',
    'J_total = ' + Jtotal.toExponential(2) + ' A/cm²'
  ];
  const lineH = compact() ? 22 : 24;
  const cardH = 14 + lines.length * lineH + 10;
  noStroke();
  fill(240, 245, 255);
  stroke(168, 200, 255);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke();
  fill(30);
  textAlign(LEFT, TOP);
  textSize(compact() ? 11 : 12);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cardX + 14, cardY + 12 + i * lineH, cardW - 28);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 230 : 190;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 620);
}
