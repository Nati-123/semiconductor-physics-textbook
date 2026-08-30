// Depletion Approximation Explorer MicroSim
// Compares the actual (smooth, conceptual) mobile-carrier concentration
// transition near a p-n junction to the idealized depletion
// approximation used throughout this chapter: an abrupt step from
// "fully depleted" to "fully neutral" at x = -x_p and x = x_n. Labels
// the quasi-neutral p-region, depletion region, and quasi-neutral
// n-region, and shows the fixed acceptor/donor charge exposed inside
// the (idealized) depletion region. N_A and N_D sliders update x_p and
// x_n live, using the same closed-form depletion-width formulas as the
// Junction Electric Field and Depletion Width Explorer.
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 780;
let drawHeight = 480;
let minDrawHeight = 460;
let controlHeight = 240;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let naSlider, ndSlider;

const Q = 1.602e-19;      // C
const EPS = 1.035e-12;    // F/cm  (Si, er=11.7)
const NI = 1.5e10;        // cm^-3 (Si, 300K)
const KT_Q = 0.0259;      // V (300K)

function compact() { return canvasWidth < 620; }

function junctionGeometry(NA, ND) {
  const Vbi = KT_Q * Math.log((NA * ND) / (NI * NI));
  const W = Math.sqrt((2 * EPS * Vbi / Q) * (1 / NA + 1 / ND)); // cm
  const xn = W * NA / (NA + ND);
  const xp = W * ND / (NA + ND);
  return { Vbi, W, xn, xp };
}

// "Actual" (illustrative, not a rigorous solution) smooth transition:
// a logistic curve between the two equilibrium majority values,
// centered at the junction, with a width set by the depletion width
// itself -- wide enough that the smooth curve visibly extends past the
// approximation's sharp edges on both sides, which is the whole point
// of the comparison.
function smoothMajority(xUm, N_here, N_other, xEdgeUm, sign) {
  // sign = -1 for the p-side curve (falls off to the right, toward n),
  // sign = +1 for the n-side curve (rises to the right, toward n).
  const k = 2.5 / Math.max(xEdgeUm, 0.01); // transition steepness
  const s = 1 / (1 + Math.exp(-sign * k * xUm));
  return N_other + (N_here - N_other) * s;
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  naSlider = createSlider(15, 19, 17, 0.1);
  naSlider.attribute('aria-label', 'Acceptor doping concentration exponent, N_A');
  naSlider.input(function () { redraw(); });
  ndSlider = createSlider(15, 19, 16, 0.1);
  ndSlider.attribute('aria-label', 'Donor doping concentration exponent, N_D');
  ndSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Depletion approximation explorer: compares the actual smooth mobile-carrier concentration transition near a p-n junction to the idealized abrupt depletion approximation, labeling the quasi-neutral p-region, depletion region, and quasi-neutral n-region', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function controlRows() {
  const stacked = compact();
  const rowH = stacked ? 54 : 36;
  const topPad = 10;
  return {
    stacked: stacked, rowH: rowH,
    na: topPad, nd: topPad + rowH,
    cardTop: topPad + 2 * rowH + 8
  };
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const rows = controlRows();
  const widgetX = rows.stacked ? 16 : 150;
  const widgetOffsetY = rows.stacked ? 20 : 8;
  const sw = rows.stacked ? Math.min(canvasWidth - 32, 360) : Math.min(canvasWidth - 150 - 30, 360);

  naSlider.position(bx + widgetX, by + drawHeight + rows.na + widgetOffsetY);
  naSlider.size(sw);
  ndSlider.position(bx + widgetX, by + drawHeight + rows.nd + widgetOffsetY);
  ndSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const NA = Math.pow(10, naSlider.value());
  const ND = Math.pow(10, ndSlider.value());
  const geo = junctionGeometry(NA, ND);
  const xpUm = geo.xp * 1e4, xnUm = geo.xn * 1e4;
  const npMinor = (NI * NI) / NA; // minority electrons in p-region
  const pnMinor = (NI * NI) / ND; // minority holes in n-region

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 12.5 : 15.5);
  text(compact() ? 'Actual vs. Depletion Approximation' : 'Actual Carrier Transition vs. the Depletion Approximation', 10, 8, canvasWidth - 20);

  const chartX = compact() ? 56 : 76;
  // Region name labels get their own strip above the chart (rather
  // than being overlaid inside the plot area) so they never collide
  // with whichever curve happens to be near the top of the log scale
  // for a given doping choice.
  const labelStripY = 32, labelStripH = compact() ? 22 : 18;
  const chartY = labelStripY + labelStripH + 6;
  const chartW = canvasWidth - chartX - 24;
  const chartH = drawHeight - 130 - (chartY - 42);
  const xMin = -xpUm * 2.2 - 0.02, xMax = xnUm * 2.2 + 0.02;
  const yMin = Math.log10(Math.min(npMinor, pnMinor)) - 1;
  const yMax = Math.log10(Math.max(NA, ND)) + 0.6;

  // Region shading: quasi-neutral p / depletion / quasi-neutral n.
  function xToPxRegion(xv) { return map(xv, xMin, xMax, chartX, chartX + chartW); }
  noStroke();
  fill(255, 238, 238); rect(xToPxRegion(xMin), chartY, xToPxRegion(-xpUm) - xToPxRegion(xMin), chartH);
  fill(238, 235, 250); rect(xToPxRegion(-xpUm), chartY, xToPxRegion(xnUm) - xToPxRegion(-xpUm), chartH);
  fill(235, 240, 255); rect(xToPxRegion(xnUm), chartY, xToPxRegion(xMax) - xToPxRegion(xnUm), chartH);

  // Actual (smooth) n(x), p(x) curves.
  const nActual = [], pActual = [], nApprox = [], pApprox = [];
  const N_PTS = 140;
  for (let i = 0; i <= N_PTS; i++) {
    const xv = xMin + (xMax - xMin) * (i / N_PTS);
    const nSmooth = smoothMajority(xv, ND, npMinor, Math.max(xnUm, 0.05), +1);
    const pSmooth = smoothMajority(xv, NA, pnMinor, Math.max(xpUm, 0.05), -1);
    nActual.push({ x: xv, y: Math.log10(nSmooth) });
    pActual.push({ x: xv, y: Math.log10(pSmooth) });
    // Idealized approximation: flat majority value outside the
    // depletion edges, ~0 (floored for the log scale) inside it.
    const nApproxV = xv > xnUm ? ND : (xv < -xpUm ? npMinor : 1);
    const pApproxV = xv < -xpUm ? NA : (xv > xnUm ? pnMinor : 1);
    nApprox.push({ x: xv, y: Math.log10(nApproxV) });
    pApprox.push({ x: xv, y: Math.log10(pApproxV) });
  }

  const info = smlDrawLineChart(chartX, chartY, chartW, chartH, xMin, xMax, yMin, yMax, [
    { points: nActual, color: color(40, 40, 190) },
    { points: pActual, color: color(220, 60, 60) }
  ], {});
  // Approximation curves drawn dashed, on top, in matching hues.
  drawDashedSeries(info, nApprox, color(40, 40, 190));
  drawDashedSeries(info, pApprox, color(220, 60, 60));

  // Boundary lines + labels.
  const xJ = info.xToPx(0), xP = info.xToPx(-xpUm), xN = info.xToPx(xnUm);
  stroke(140); strokeWeight(1); drawingContext.setLineDash([2, 3]);
  line(xJ, chartY, xJ, chartY + chartH);
  drawingContext.setLineDash([1, 2]);
  line(xP, chartY, xP, chartY + chartH);
  line(xN, chartY, xN, chartY + chartH);
  drawingContext.setLineDash([]);
  noStroke(); fill(90); textAlign(CENTER, TOP); textSize(compact() ? 9 : 10);
  text('0', xJ, chartY + chartH + 3);
  text('−x_p', xP, chartY + chartH + 3);
  text('x_n', xN, chartY + chartH + 3);

  // Region name labels, in their own strip above the chart. x must be
  // each region's LEFT edge (not its center) once a width is passed to
  // text() under CENTER alignment -- the label is then centered within
  // that [left, left+width] box, which is the actual region span.
  noStroke(); fill(190, 40, 40); textAlign(CENTER, TOP); textSize(compact() ? 8.5 : 10);
  text('quasi-neutral p-region', xToPxRegion(xMin), labelStripY, xP - xToPxRegion(xMin));
  fill(90, 62, 237);
  text('depletion region', xP, labelStripY, xN - xP);
  fill(40, 40, 190);
  text('quasi-neutral n-region', xN, labelStripY, xToPxRegion(xMax) - xN);

  // Legend.
  const legX = chartX + 10, legY = chartY + chartH - (compact() ? 58 : 62);
  noStroke(); fill(255, 255, 255, 235); stroke(210); strokeWeight(1);
  rect(legX - 6, legY - 6, compact() ? 150 : 168, compact() ? 52 : 56, 4);
  noStroke();
  drawLegendLine(legX, legY + 4, color(40, 40, 190), false, 'n(x) — actual (smooth)');
  drawLegendLine(legX, legY + 20, color(40, 40, 190), true, 'n(x) — depletion approx.');
  drawLegendLine(legX, legY + 36, color(220, 60, 60), false, 'p(x) — actual / approx. (red)');

  fill(30); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11.5);
  text('log(concentration), cm⁻³', chartX, chartY + chartH + (compact() ? 18 : 18));

  drawIonStrip(chartX, chartY + chartH + (compact() ? 34 : 32), chartW, compact() ? 26 : 30, xToPxRegion, xpUm, xnUm);

  drawControlLabels(NA, ND);
  drawInfoCard(NA, ND, geo, xpUm, xnUm, npMinor, pnMinor);
}

function drawDashedSeries(info, pts, col) {
  stroke(col); strokeWeight(2); noFill();
  drawingContext.setLineDash([5, 4]);
  beginShape();
  for (const p of pts) vertex(info.xToPx(p.x), info.yToPx(p.y));
  endShape();
  drawingContext.setLineDash([]);
}

function drawLegendLine(x, y, col, dashed, label) {
  stroke(col); strokeWeight(2.2);
  if (dashed) drawingContext.setLineDash([4, 3]);
  line(x, y, x + 22, y);
  drawingContext.setLineDash([]);
  noStroke(); fill(30); textAlign(LEFT, CENTER); textSize(9.5);
  text(label, x + 28, y);
}

// A thin strip directly below the chart showing the fixed ionized
// dopant charge exposed inside the (idealized) depletion region only
// -- the quasi-neutral regions outside get no ion marks, since they
// are, by the approximation's own assumption, exactly neutral there.
function drawIonStrip(chartX, y, chartW, h, xToPxRegion, xpUm, xnUm) {
  const xMinPx = chartX, xMaxPx = chartX + chartW;
  const xP = xToPxRegion(-xpUm), xN = xToPxRegion(xnUm);
  noStroke(); fill(250, 250, 252); stroke(220); strokeWeight(1);
  rect(xMinPx, y, chartW, h, 4);
  noStroke(); fill(230, 220, 245);
  rect(xP, y, xN - xP, h);
  const n = Math.max(2, Math.round((xN - xP) / 34));
  fill(140, 20, 130); textAlign(CENTER, CENTER); textSize(compact() ? 10 : 11); textStyle(BOLD);
  for (let i = 0; i < n; i++) {
    const fx = xP + (i + 0.5) * (xN - xP) / n;
    if (fx < (xP + xN) / 2) text('−', fx, y + h / 2); else { fill(200, 110, 10); text('+', fx, y + h / 2); fill(140, 20, 130); }
  }
  textStyle(NORMAL);
  fill(90); textAlign(LEFT, CENTER); textSize(compact() ? 8.5 : 9.5);
  text('fixed ionized charge (idealized: only inside the depletion region)', xMinPx, y + h + (compact() ? 9 : 10));
}

function drawControlLabels(NA, ND) {
  const rows = controlRows();
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 12 : 13);
  if (rows.stacked) {
    text('N_A = ' + NA.toExponential(1) + ' cm⁻³', 10, drawHeight + rows.na);
    text('N_D = ' + ND.toExponential(1) + ' cm⁻³', 10, drawHeight + rows.nd);
  } else {
    text('N_A', 10, drawHeight + rows.na + 9);
    text('N_D', 10, drawHeight + rows.nd + 9);
    textAlign(RIGHT, TOP);
    text(NA.toExponential(1) + ' cm⁻³', canvasWidth - 10, drawHeight + rows.na + 9);
    text(ND.toExponential(1) + ' cm⁻³', canvasWidth - 10, drawHeight + rows.nd + 9);
  }
}

function drawInfoCard(NA, ND, geo, xpUm, xnUm, npMinor, pnMinor) {
  const rows = controlRows();
  const cardY = drawHeight + rows.cardTop;
  const cardX = 10, cardW = canvasWidth - 20;
  const cardH = controlHeight - rows.cardTop - 8;

  fill(247, 249, 255); stroke(200, 215, 245); strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);

  noStroke(); fill(30); textAlign(LEFT, TOP); textSize(compact() ? 10.5 : 12);
  const line1 = 'x_p = ' + xpUm.toFixed(3) + ' μm      x_n = ' + xnUm.toFixed(3) + ' μm      W = ' + (xpUm + xnUm).toFixed(3) + ' μm';
  const line2 = 'Minority concentrations at the edges (real, nonzero): n_p0 = ' + npMinor.toExponential(2) + ' cm⁻³ (p-side)      p_n0 = ' + pnMinor.toExponential(2) + ' cm⁻³ (n-side)';
  text(line1, cardX + 12, cardY + 10, cardW - 24);
  text(line2, cardX + 12, cardY + 10 + (compact() ? 34 : 22), cardW - 28);
  fill(90); textSize(compact() ? 9.5 : 10.5);
  text('The depletion approximation treats the transition as abrupt (dashed) and the minority concentrations inside the depletion edges as negligible — a good approximation because the real transition (solid) happens over a distance far shorter than W for typical doping.',
    cardX + 12, cardY + 10 + (compact() ? 68 : 46), cardW - 24);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  minDrawHeight = compact() ? 560 : 460;
  controlHeight = compact() ? 330 : 240;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  drawHeight = Math.max(drawHeight, minDrawHeight);
}
