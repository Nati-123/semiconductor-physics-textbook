// Fick's Law and Total Current Density Explorer MicroSim
// Plots a decaying carrier concentration profile (holes p(x) or electrons
// n(x), selectable) with a movable marker showing the tangent line and
// local diffusion current, then plots J_diffusion(x), J_drift(x), and
// J_total(x) together across the full domain so students can see where
// drift and diffusion reinforce or cancel. D is computed live from the
// Einstein relation (Chapter 12) using the shared Matthiessen's-rule
// mobility model (Chapter 11), not a fixed constant, so temperature
// changes propagate correctly into J_diffusion.
//
// Sign conventions (Sze / Neamen):
//   J_p,diff = -q D_p (dp/dx)      J_p,drift = q p mu_p E
//   J_n,diff = +q D_n (dn/dx)      J_n,drift = q n mu_n E
// Both drift terms share the same sign structure (conventional current
// flows with E for either carrier), but the diffusion term flips sign
// between electrons and holes for the *same* concentration-profile shape
// -- a key teaching point exercised by the carrier-type toggle below.
//
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 600;
let minDrawHeight = 600;
let controlHeight = 228;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let lSlider, xSlider, eSlider, tempSlider, ndExpSlider, carrierSelect;
const Q = 1.602e-19, KB_EV = 8.617e-5;
const N0 = 1e16;   // cm^-3, concentration at x=0 (holes or electrons)
const XMAX_UM = 10;

let snapBtnRect = null; // hit-test rect for the "Snap to cancellation field" button

function compact() { return canvasWidth < 480; }
function concAt(x_um, L_um) { return N0 * Math.exp(-x_um / L_um); }
function dNdx(x_um, L_um) { // returns d(conc) / dx in cm^-3 per cm (negative: decaying profile)
  const c = concAt(x_um, L_um);
  const L_cm = L_um * 1e-4;
  return -c / L_cm;
}

function isHoleCarrier() { return carrierSelect.value().indexOf('Holes') === 0; }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  carrierSelect = createSelect();
  carrierSelect.option('Holes (p-type)');
  carrierSelect.option('Electrons (n-type)');
  carrierSelect.attribute('aria-label', 'Carrier type: holes or electrons, sets the sign convention for diffusion current');
  carrierSelect.changed(function () { redraw(); });

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
  tempSlider.attribute('aria-label', 'Temperature in kelvin, used in the Einstein relation for the diffusion coefficient');
  tempSlider.input(function () { redraw(); });
  ndExpSlider = createSlider(14, 19, 16, 0.1);
  ndExpSlider.attribute('aria-label', 'Doping concentration exponent, used for majority carrier mobility');
  ndExpSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Fick\'s law and total current density explorer: plots a decaying hole or electron concentration profile with a movable position marker showing local diffusion current computed from a temperature-dependent diffusion coefficient via the Einstein relation, plotted together with drift current and total current density across position, including a control that snaps the field to the value where drift and diffusion exactly cancel', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function rowY() {
  return { C: 12, L: 50, x: 88, E: 126, T: 164, N: 202 };
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 95 : 150;
  const sw = min(canvasWidth - lbl - 30, 300);
  const rows = rowY();
  carrierSelect.position(bx + lbl, by + drawHeight + rows.C - 4); carrierSelect.size(sw);
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

  const holes = isHoleCarrier();
  const L = lSlider.value();
  const xMark = xSlider.value();
  const E = eSlider.value();
  const T = tempSlider.value();
  const ND = Math.pow(10, ndExpSlider.value());
  const sym = holes ? 'p' : 'n';

  const carrier = SML_MOBILITY_CARRIERS[holes ? 'Holes (p-type)' : 'Electrons (n-type)'];
  const mu = smlMobility(carrier, T, ND);
  const D = mu * KB_EV * T; // Einstein relation, cm^2/s

  const slope = dNdx(xMark, L); // cm^-3/cm, negative
  const NMark = concAt(xMark, L);
  const Jdiff = (holes ? -1 : 1) * Q * D * slope; // A/cm^2
  const Jdrift = Q * NMark * mu * E; // A/cm^2, local concentration at the marker
  const Jtotal = Jdiff + Jdrift;

  // Field at which drift exactly cancels diffusion at the marker position:
  // solve Q*NMark*mu*Ecancel + Jdiff = 0 for Ecancel.
  const Ecancel = -Jdiff / (Q * NMark * mu);
  const EcancelClamped = constrain(Ecancel, -500, 500);
  const maxMag = Math.max(Math.abs(Jdiff), Math.abs(Jdrift), 1e-30);
  const nearCancel = Math.abs(Jtotal) < 0.02 * maxMag;

  const leftW = compact() ? canvasWidth : Math.round(canvasWidth * 0.62);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 11 : 13);
  if (holes) {
    text('J_diff = −qD_p(dp/dx)   |   J_drift = qpμ_p·E', 10, 8, leftW - 20);
  } else {
    text('J_diff = +qD_n(dn/dx)   |   J_drift = qnμ_n·E', 10, 8, leftW - 20);
  }
  textAlign(CENTER, TOP); textSize(compact() ? 9.5 : 11); fill(80);
  text('D_' + sym + ' = μ_' + sym + '·k_BT/q (Einstein relation) = ' + D.toFixed(2) + ' cm²/s at ' + T + ' K', 10, 27, leftW - 20);

  const chart1Y = 54, chartH = 220, chartGap = 60;
  const chart2Y = chart1Y + chartH + chartGap;

  drawConcChart(L, xMark, holes, leftW, chart1Y, chartH);
  drawCurrentChart(L, xMark, E, holes, mu, D, leftW, chart2Y, chartH);

  const cardPanelX = compact() ? 0 : leftW;
  const cardPanelY = compact() ? chart2Y + chartH + 46 : 0;
  const cardPanelW = compact() ? canvasWidth : canvasWidth - leftW;
  const cardPanelH = compact() ? drawHeight - cardPanelY : drawHeight;
  drawCard(sym, xMark, slope, NMark, Jdiff, E, Jdrift, Jtotal, mu, D, Ecancel, EcancelClamped, nearCancel, cardPanelX, cardPanelY, cardPanelW, cardPanelH);

  const rows = rowY();
  fill(30); noStroke(); textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 13);
  text('Carrier type:', 10, drawHeight + rows.C + 11);
  text('Decay length L:', 10, drawHeight + rows.L + 11);
  text('Position x:', 10, drawHeight + rows.x + 11);
  text('Field E:', 10, drawHeight + rows.E + 11);
  text('Temperature:', 10, drawHeight + rows.T + 11);
  text(holes ? 'N_A (holes):' : 'N_D (electrons):', 10, drawHeight + rows.N + 11);
  textAlign(RIGHT, CENTER);
  text(L.toFixed(1) + ' μm', canvasWidth - 10, drawHeight + rows.L + 11);
  text(xMark.toFixed(1) + ' μm', canvasWidth - 10, drawHeight + rows.x + 11);
  text(E + ' V/cm', canvasWidth - 10, drawHeight + rows.E + 11);
  text(T + ' K', canvasWidth - 10, drawHeight + rows.T + 11);
  text(smlFormatPow10(ndExpSlider.value()), canvasWidth - 10, drawHeight + rows.N + 11);
}

function drawConcChart(L, xMark, holes, panelW, chartY, chartH) {
  const chartX = compact() ? 55 : 60, chartW = panelW - chartX - 20;
  const pts = [];
  for (let x = 0; x <= XMAX_UM; x += 0.1) pts.push({ x: x, y: concAt(x, L) });
  const { xToPx, yToPx } = smlDrawLineChart(chartX, chartY, chartW, chartH, 0, XMAX_UM, 0, N0 * 1.05, [
    { points: pts, color: color(90, 62, 237) }
  ], {
    marker: { x: xMark, y: concAt(xMark, L) },
    xLabel: 'Position x (μm)', yLabel: (holes ? 'p(x)' : 'n(x)') + ' (cm⁻³)', yLabelOffset: compact() ? 40 : 46
  });

  const cMark = concAt(xMark, L);
  const slope = dNdx(xMark, L);
  const dx_um = 1.5;
  const y1 = cMark - slope * (dx_um * 1e-4);
  const y2 = cMark + slope * (dx_um * 1e-4);
  stroke(220, 140, 40); strokeWeight(2);
  line(xToPx(max(0, xMark - dx_um)), yToPx(constrain(y1, 0, N0 * 1.05)), xToPx(min(XMAX_UM, xMark + dx_um)), yToPx(constrain(y2, 0, N0 * 1.05)));

  fill(40); noStroke(); textAlign(LEFT, TOP); textSize(11);
  text('Tangent = d' + (holes ? 'p' : 'n') + '/dx at marker', chartX + 4, chartY + 4);
}

function drawCurrentChart(L, xMark, E, holes, mu, D, panelW, chartY, chartH) {
  const chartX = compact() ? 55 : 60, chartW = panelW - chartX - 20;
  const diffPts = [], driftPts = [], totalPts = [];
  let maxMag = 1e-6;
  for (let x = 0; x <= XMAX_UM; x += 0.1) {
    const c = concAt(x, L);
    const s = dNdx(x, L);
    const jd = (holes ? -1 : 1) * Q * D * s;
    const jr = Q * c * mu * E;
    const jt = jd + jr;
    diffPts.push({ x: x, y: jd });
    driftPts.push({ x: x, y: jr });
    totalPts.push({ x: x, y: jt });
    maxMag = Math.max(maxMag, Math.abs(jd), Math.abs(jr), Math.abs(jt));
  }
  const yLim = maxMag * 1.15;

  const { xToPx, yToPx } = smlDrawLineChart(chartX, chartY, chartW, chartH, 0, XMAX_UM, -yLim, yLim, [
    { points: diffPts, color: color(220, 140, 40) },
    { points: driftPts, color: color(30, 130, 200) },
    { points: totalPts, color: color(25, 25, 25) }
  ], {
    xLabel: 'Position x (μm)', yLabel: 'J (A/cm²)', yLabelOffset: compact() ? 44 : 50
  });

  // zero-current reference line
  stroke(180); strokeWeight(1);
  line(xToPx(0), yToPx(0), xToPx(XMAX_UM), yToPx(0));
  // marker line synced to the position slider
  stroke(200, 30, 30); strokeWeight(1.5);
  line(xToPx(xMark), chartY, xToPx(xMark), chartY + chartH);

  noStroke(); textAlign(LEFT, TOP); textSize(11);
  fill(220, 140, 40); text('J_diff', chartX + 4, chartY + 4);
  fill(30, 130, 200); text('J_drift', chartX + 54, chartY + 4);
  fill(25, 25, 25); text('J_total', chartX + 108, chartY + 4);
}

function drawCard(sym, xMark, slope, NMark, Jdiff, E, Jdrift, Jtotal, mu, D, Ecancel, EcancelClamped, nearCancel, panelX, panelY, panelW, panelH) {
  const cardX = panelX + (compact() ? 20 : 16), cardY = panelY + (compact() ? 10 : 8);
  const cardW = (compact() ? canvasWidth - 40 : panelW - 32);
  const lines = [
    'μ_' + sym + ' = ' + mu.toFixed(0) + ' cm²/V·s   D_' + sym + ' = ' + D.toFixed(2) + ' cm²/s',
    sym + '(x) at x=' + xMark.toFixed(1) + ' μm: ' + NMark.toExponential(2) + ' cm⁻³',
    'd' + sym + '/dx: ' + slope.toExponential(2) + ' cm⁻⁴',
    'J_diffusion = ' + Jdiff.toExponential(2) + ' A/cm²',
    'J_drift = ' + Jdrift.toExponential(2) + ' A/cm²',
    'J_total = ' + Jtotal.toExponential(2) + ' A/cm²'
  ];
  const lineH = compact() ? 21 : 22;
  const cardH = 10 + lines.length * lineH + 6;
  fill(240, 245, 255);
  stroke(168, 200, 255);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke();
  fill(30);
  textAlign(LEFT, TOP);
  textSize(compact() ? 11 : 12);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cardX + 14, cardY + 10 + i * lineH, cardW - 28);
  }

  // cancellation status card
  const statY = cardY + cardH + 12;
  const statH = compact() ? 100 : 92;
  fill(nearCancel ? color(225, 250, 230) : color(255, 248, 225));
  stroke(nearCancel ? color(90, 180, 110) : color(230, 190, 90));
  strokeWeight(1.5);
  rect(cardX, statY, cardW, statH, 10);
  noStroke();
  fill(nearCancel ? color(30, 110, 50) : color(120, 90, 10));
  textAlign(LEFT, TOP);
  textSize(compact() ? 11 : 12);
  const statusLine = nearCancel
    ? '✓ J_total ≈ 0 at the marker'
    : 'Cancels here at E ≈ ' + Ecancel.toFixed(1) + ' V/cm';
  text(statusLine, cardX + 14, statY + 10, cardW - 28);

  fill(30); textSize(compact() ? 10.5 : 11);
  text('(current E = ' + E + ' V/cm)', cardX + 14, statY + 32, cardW - 28);

  const btnY = statY + (compact() ? 58 : 54);
  const btnH = 30;
  smlDrawButton(cardX + 14, btnY, cardW - 28, btnH, 'Snap to cancellation field', false);
  snapBtnRect = { x: cardX + 14, y: btnY, w: cardW - 28, snapValue: EcancelClamped, h: btnH };
}

function mousePressed() {
  if (snapBtnRect && smlPointInRect(mouseX, mouseY, snapBtnRect.x, snapBtnRect.y, snapBtnRect.w, snapBtnRect.h)) {
    eSlider.value(round(snapBtnRect.snapValue / 10) * 10);
    redraw();
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 268 : 228;
  minDrawHeight = compact() ? 960 : 600;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 960);
  else drawHeight = Math.max(drawHeight, 600);
}
