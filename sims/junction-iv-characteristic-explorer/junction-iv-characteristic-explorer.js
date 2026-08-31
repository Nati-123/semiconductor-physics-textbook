// Complete Junction I-V Characteristic Explorer MicroSim
// Synthesizes forward exponential conduction, reverse saturation, and
// reverse breakdown into ONE log|J| vs. V curve, driven by a single
// lightly-doped-side concentration slider N, plus a voltage-marker
// slider that sweeps a live dot from deep breakdown through zero into
// forward bias. A small junction cross-section mini-diagram updates
// live with the marker to show depletion width, barrier height, current
// direction, and the dominant conduction mechanism at that voltage.
//
// Physics constants and formulas are kept numerically consistent with
// the sibling sims: ideal-diode-iv-curve-explorer.js (J0*(exp(V/VT)-1),
// K_EV) and reverse-breakdown-mechanism-explorer.js (V_BR estimate,
// Q/EPS/ECRIT, the ~6V Zener/avalanche crossover convention).
//
// SIMPLIFICATIONS (pedagogical synthesis, not a rigorous derivation --
// documented here and again at each formula below):
//   1. J0 is held at ideal-diode-iv-curve-explorer's default order of
//      magnitude (1e-11 A/cm^2 at N=1e16 cm^-3) and scales mildly
//      *inversely* with N (see j0Of) -- the correct qualitative
//      direction per J0 = q*ni^2*(Dp/(Lp*ND) + Dn/(Ln*NA)), without
//      re-deriving Dp, Dn, Lp, Ln from N.
//   2. The breakdown-side current (V <= -V_BR) is a smooth,
//      monotonically-increasing-in-magnitude curve continuous with the
//      ideal-diode value at V=-V_BR (see jOf) -- explicitly NOT a
//      rigorous avalanche-multiplication (Miller) model, matching the
//      chapter's own "rapid breakdown current increase" language.
//   3. The depletion width in the mini-diagram uses a fixed
//      representative V_bi = 0.7 V (typical silicon) and the
//      lightly-doped-side-dominates approximation W(V) ~= sqrt(2*EPS*
//      (V_bi-V)/Q/N), then a saturating map compresses it to a legible
//      pixel width across many orders of magnitude of reverse bias.
//
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 780;
let drawHeight = 560;
let minDrawHeight = 560;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let nSlider, vSlider;

const Q = 1.602e-19;      // C
const EPS = 1.035e-12;    // F/cm (Si, er=11.7)
const ECRIT = 3e5;        // V/cm (avalanche critical field estimate)
const K_EV = 8.617e-5;    // eV/K
const ZENER_THRESHOLD_V = 6; // classic Si avalanche/Zener crossover, approximate
const VBI = 0.7;          // representative silicon built-in potential, V
const N_REF = 1e16, J0_REF = 1e-11; // matches ideal-diode-iv-curve-explorer.js's default
const JBK_REF = 1e-6;     // A/cm^2, illustrative breakdown-spike current scale (see jOf)
const T = 300;            // K, held fixed (this sim's synthesis is about V and N, not T)

function compact() { return canvasWidth < 640; }

function bvOf(N) {
  return EPS * ECRIT * ECRIT / (2 * Q * N);
}

// SIMPLIFICATION #1 (see file header): illustrative mild inverse scaling
// with N, chosen only to move J0 in the physically correct direction as
// doping changes -- not a re-derivation of the full saturation-current
// formula.
function j0Of(N) {
  return J0_REF * (N_REF / N);
}

// SIMPLIFICATION #2 (see file header): ideal diode equation for
// V > -V_BR; a smooth, continuous, monotonically-increasing-in-
// magnitude illustrative extension for V <= -V_BR.
function jOf(V, J0, VT, VBR) {
  if (V > -VBR) {
    return J0 * (Math.exp(V / VT) - 1);
  }
  const Jatbreak = J0 * (Math.exp(-VBR / VT) - 1); // continuity anchor, ~ -J0
  const dV = -V - VBR; // >= 0, how far past breakdown
  const VK = Math.max(0.04 * VBR, 6 * VT); // knee width, floored at a few VT
  return Jatbreak - JBK_REF * (Math.exp(dV / VK) - 1);
}

// SIMPLIFICATION #3 (see file header): representative fixed V_bi,
// lightly-doped-side-dominates approximation.
function wOf(V, N) {
  return Math.sqrt(2 * EPS * Math.max(VBI - V, 0.01 * VBI) / Q / N); // cm
}

function toSup(exp) {
  const supDigits = { '-': '⁻', '.': '·', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return String(exp).split('').map(c => supDigits[c] || c).join('');
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  nSlider = createSlider(14, 19, 16, 0.05);
  nSlider.attribute('aria-label', 'Lightly doped side concentration exponent, base 10');

  const VBR0 = bvOf(Math.pow(10, 16));
  const VMIN0 = -1.3 * VBR0, VMAX0 = 0.7;
  vSlider = createSlider(VMIN0, VMAX0, 0, (VMAX0 - VMIN0) / 600);
  vSlider.attribute('aria-label', 'Voltage marker, from deep reverse breakdown through forward bias');

  positionUIElements();
  describe('Complete junction I-V characteristic explorer: combines forward exponential conduction, reverse saturation, and reverse breakdown into one log-current-density-versus-voltage chart driven by a single doping slider, with a live draggable voltage marker and a junction cross-section mini-diagram showing depletion width, barrier height, current direction, and dominant conduction mechanism', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function controlRows() {
  const stacked = compact();
  const rowH = stacked ? 54 : 40;
  const topPad = 14;
  return { stacked: stacked, rowH: rowH, n: topPad, v: topPad + rowH, bottom: topPad + 2 * rowH + 10 };
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const rows = controlRows();
  const widgetX = rows.stacked ? 16 : 175;
  const widgetOffsetY = rows.stacked ? 20 : 8;
  const sw = rows.stacked ? Math.min(canvasWidth - 32, 360) : Math.min(canvasWidth - 175 - 30, 340);

  nSlider.position(bx + widgetX, by + drawHeight + rows.n + widgetOffsetY);
  nSlider.size(sw);
  vSlider.position(bx + widgetX, by + drawHeight + rows.v + widgetOffsetY);
  vSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const N = Math.pow(10, nSlider.value());
  const VBR = bvOf(N);
  const J0 = j0Of(N);
  const VT = K_EV * T;
  const likelyZener = VBR < ZENER_THRESHOLD_V;

  // Voltage-marker slider's range is recomputed every frame from the
  // current doping slider, per the sim spec: well past breakdown
  // (-1.3*V_BR) through zero into forward bias (+0.7 V).
  const VMIN = -1.3 * VBR, VMAX = 0.7;
  vSlider.attribute('min', VMIN);
  vSlider.attribute('max', VMAX);
  vSlider.attribute('step', (VMAX - VMIN) / 600);

  let V = constrain(Number(vSlider.value()), VMIN, VMAX);
  const J = jOf(V, J0, VT, VBR);
  const region = V <= -VBR ? 'breakdown' : (V < 0 ? 'reverse' : 'forward');

  // Title -- kept below y=34 across the FULL canvas width so it never
  // enters the fullscreen-toggle button's reserved top-right corner
  // (x > canvasWidth-140, y < 34), regardless of how wide the centered
  // text renders.
  noStroke(); fill(20); textAlign(CENTER, TOP);
  smlMathText(canvasWidth / 2, 36, 'Complete Junction I-V Characteristic', { size: compact() ? 13 : 16, align: 'center' });

  const y0 = 66;
  if (compact()) {
    const chartBX = 10, chartBW = canvasWidth - 20;
    const chartBH = Math.round((drawHeight - y0 - 8) * 0.40);
    const chartBY = y0;
    const diagBY = chartBY + chartBH + 14;
    const diagBH = Math.round((drawHeight - y0 - 8) * 0.28);
    const cardBY = diagBY + diagBH + 14;
    const cardBH = Math.max(170, drawHeight - cardBY - 8);

    drawIVChart(chartBX, chartBY, chartBW, chartBH, VMIN, VMAX, VBR, J0, VT, V, J);
    drawJunctionDiagram(chartBX, diagBY, chartBW, diagBH, V, VBR, N, likelyZener, region);
    drawReadoutCard(chartBX, cardBY, chartBW, cardBH, N, VBR, J0, VT, V, J, region);
  } else {
    const chartBX = 10, chartBH = drawHeight - y0 - 8;
    const chartBW = Math.round((canvasWidth - 20) * 0.58);
    const chartBY = y0;
    const rightBX = chartBX + chartBW + 14;
    const rightBW = canvasWidth - rightBX - 10;
    const cardBH = 190;
    const diagBH = chartBH - cardBH - 12;

    drawIVChart(chartBX, chartBY, chartBW, chartBH, VMIN, VMAX, VBR, J0, VT, V, J);
    drawReadoutCard(rightBX, chartBY, rightBW, cardBH, N, VBR, J0, VT, V, J, region);
    drawJunctionDiagram(rightBX, chartBY + cardBH + 12, rightBW, diagBH, V, VBR, N, likelyZener, region);
  }

  drawControlLabels(N, V);
}

// ---------------- I-V chart ----------------
function drawIVChart(bx, by, bw, bh, VMIN, VMAX, VBR, J0, VT, V, J) {
  const sz = compact() ? 8.5 : 9.5;
  const chartX = bx + (compact() ? 40 : 54);
  const labelStripH = compact() ? 14 : 16;
  const chartY = by + labelStripH + 4;
  const bottomRoom = compact() ? 46 : 50;
  const chartW = bw - (chartX - bx) - 8;
  const chartH = Math.max(60, bh - labelStripH - 4 - bottomRoom);

  const N_PTS = 240;
  const pts = [];
  let yMinRaw = Infinity, yMaxRaw = -Infinity;
  for (let i = 0; i <= N_PTS; i++) {
    const v = VMIN + (VMAX - VMIN) * i / N_PTS;
    const ly = Math.log10(Math.max(Math.abs(jOf(v, J0, VT, VBR)), 1e-20));
    pts.push({ x: v, y: ly });
    if (ly < yMinRaw) yMinRaw = ly;
    if (ly > yMaxRaw) yMaxRaw = ly;
  }
  const yMin = Math.floor(yMinRaw) - 0.5, yMax = Math.ceil(yMaxRaw) + 0.5;
  const Jmark = Math.log10(Math.max(Math.abs(J), 1e-20));

  const info = smlDrawLineChart(chartX, chartY, chartW, chartH, VMIN, VMAX, yMin, yMax, [
    { points: pts, color: color(90, 62, 237) }
  ], { marker: { x: V, y: Jmark } });

  // Real numeric y-axis ticks (powers of ten) using the returned yToPx.
  const yStep = Math.max(1, Math.round((yMax - yMin) / 6));
  textAlign(RIGHT, CENTER); textSize(sz);
  for (let ye = Math.ceil(yMin / yStep) * yStep; ye <= yMax; ye += yStep) {
    const py = info.yToPx(ye);
    stroke(228); strokeWeight(1); line(chartX, py, chartX + chartW, py);
    noStroke(); fill(90);
    text('10' + toSup(ye), chartX - 6, py);
  }

  // Region boundary lines at V = -V_BR and V = 0, using xToPx.
  const xBR = constrain(info.xToPx(-VBR), chartX, chartX + chartW);
  const x0 = info.xToPx(0);
  stroke(150); strokeWeight(1); drawingContext.setLineDash([3, 3]);
  line(xBR, chartY, xBR, chartY + chartH);
  line(x0, chartY, x0, chartY + chartH);
  drawingContext.setLineDash([]);

  // Region name labels in a strip above the chart. Forward Conduction's
  // true region (0 to VMAX=0.7V) is a razor-thin sliver of the full
  // V-axis once breakdown (tens of volts) is in view, so labels are
  // NOT sized to their own region's pixel width (that produced severe
  // overlap/garbling between "Reverse Saturation" and "Forward
  // Conduction" previously) -- each label instead gets a width sized to
  // its own text, is centered on its region's midpoint, clamped to stay
  // on-canvas, and then pushed right of the previous label if the two
  // would still overlap, guaranteeing left-to-right non-overlap
  // regardless of how narrow the underlying region is.
  noStroke(); textAlign(CENTER, TOP); textSize(sz);
  let prevLabelRight = chartX;
  function regionLabel(str, regionX1, regionX2, col) {
    const w = textWidth(str) + 6;
    let left = constrain((regionX1 + regionX2) / 2 - w / 2, chartX + 2, chartX + chartW - 2 - w);
    if (left < prevLabelRight + 3) left = prevLabelRight + 3;
    fill(col[0], col[1], col[2]);
    // text(str,x,y,w) box left edge = x (not centered on x), so `left`
    // (already the box's own left edge) is passed directly.
    text(str, left, by, w);
    prevLabelRight = left + w;
  }
  if (info.xToPx(-VBR) > chartX) regionLabel('Breakdown', chartX, xBR, [140, 60, 200]);
  regionLabel('Reverse Saturation', xBR, x0, [210, 110, 40]);
  regionLabel('Forward Conduction', x0, chartX + chartW, [40, 150, 90]);

  // Real numeric x-axis ticks at physically meaningful points.
  const xTicks = [VMIN, -VBR, 0, VMAX];
  noStroke(); fill(90); textAlign(CENTER, TOP); textSize(sz);
  for (const tv of xTicks) {
    const px = info.xToPx(tv);
    if (px < chartX - 1 || px > chartX + chartW + 1) continue;
    text(tv.toFixed(Math.abs(tv) < 5 ? 2 : 0), px, chartY + chartH + 3);
  }
  fill(70);
  text('(Near-Zero)', x0, chartY + chartH + (compact() ? 15 : 16));

  noStroke(); fill(30); textAlign(CENTER, TOP); textSize(sz);
  text('Voltage V (V)', chartX + chartW / 2, chartY + chartH + (compact() ? 28 : 30));
  push();
  translate(bx + (compact() ? 12 : 16), chartY + chartH / 2);
  rotate(-HALF_PI);
  noStroke(); fill(30); textAlign(CENTER, CENTER); textSize(sz);
  text('log10 |J| (A/cm²)', 0, 0);
  pop();

  return info;
}

// ---------------- junction cross-section mini-diagram ----------------
function drawJunctionDiagram(bx, by, bw, bh, V, VBR, N, likelyZener, region) {
  const titleSz = compact() ? 10.5 : 12;
  noStroke(); fill(30); textAlign(CENTER, TOP); textStyle(BOLD); textSize(titleSz);
  text('Junction Cross-Section', bx + bw / 2, by);
  textStyle(NORMAL);

  const diagTop = by + titleSz + 8;
  const diagH = Math.max(46, bh - titleSz - 8 - 92);
  const diagY = diagTop;
  const diagX = bx + 10;
  const diagW = Math.max(60, bw - 20 - 56); // reserve room on the right for the barrier bracket

  const W = wOf(V, N), Wref = wOf(0, N);
  const frac = W / (W + 2 * Wref); // saturating 0..~1 map across huge W range
  const depW = Math.max(6, frac * diagW * 0.7);
  const pW = (diagW - depW) / 2, nW = (diagW - depW) / 2;

  noStroke(); fill(255, 235, 235);
  rect(diagX, diagY, pW, diagH);
  fill(235, 240, 255);
  rect(diagX + pW + depW, diagY, nW, diagH);
  fill(238, 232, 250);
  rect(diagX + pW, diagY, depW, diagH);
  noFill(); stroke(200); strokeWeight(1);
  rect(diagX, diagY, diagW, diagH);

  const midY = diagY + diagH / 2;
  smlDrawHole(diagX + pW * 0.3, midY - diagH * 0.2, 9);
  smlDrawHole(diagX + pW * 0.55, midY + diagH * 0.18, 9);
  smlDrawHole(diagX + pW * 0.78, midY - diagH * 0.05, 9);
  smlDrawElectron(diagX + pW + depW + nW * 0.28, midY - diagH * 0.1, 9);
  smlDrawElectron(diagX + pW + depW + nW * 0.55, midY + diagH * 0.2, 9);
  smlDrawElectron(diagX + pW + depW + nW * 0.78, midY - diagH * 0.2, 9);

  noStroke(); fill(190, 40, 40); textAlign(CENTER, BOTTOM); textSize(compact() ? 9 : 10);
  text('p', diagX + pW / 2, diagY - 2);
  fill(40, 40, 190);
  text('n', diagX + pW + depW + nW / 2, diagY - 2);
  fill(90, 62, 237);
  text('depletion', diagX + pW + depW / 2, diagY - 2);

  // Barrier-height bracket, proportional to a saturating map of (VBI-V).
  const barrier = Math.max(VBI - V, 0);
  const barrierFrac = barrier / (barrier + 2 * VBI);
  const brX = diagX + diagW + 16;
  const brH = diagH * constrain(barrierFrac, 0.06, 0.95);
  const brY0 = midY - brH / 2, brY1 = midY + brH / 2;
  stroke(230, 150, 30); strokeWeight(1.5);
  line(brX, brY0, brX, brY1);
  noStroke(); fill(230, 150, 30);
  triangle(brX, brY0, brX - 4, brY0 + 6, brX + 4, brY0 + 6);
  triangle(brX, brY1, brX - 4, brY1 - 6, brX + 4, brY1 - 6);
  fill(200, 120, 10); textAlign(LEFT, CENTER); textSize(compact() ? 7.5 : 8.5);
  text('barrier\n≈' + barrier.toFixed(2) + ' eV', brX + 6, midY);

  // Current-direction arrow.
  const arrowY = diagY + diagH + 14;
  const forwardish = V >= 0;
  const arrowCol = region === 'breakdown' ? color(140, 60, 200) : (forwardish ? color(40, 150, 90) : color(210, 110, 40));
  stroke(arrowCol); strokeWeight(2.5); noFill();
  if (forwardish) {
    line(diagX + 10, arrowY, diagX + diagW - 12, arrowY);
    noStroke(); fill(arrowCol);
    triangle(diagX + diagW - 12, arrowY - 5, diagX + diagW - 12, arrowY + 5, diagX + diagW - 4, arrowY);
  } else {
    line(diagX + diagW - 10, arrowY, diagX + 12, arrowY);
    noStroke(); fill(arrowCol);
    triangle(diagX + 12, arrowY - 5, diagX + 12, arrowY + 5, diagX + 4, arrowY);
  }
  noStroke(); fill(arrowCol); textAlign(CENTER, TOP); textSize(compact() ? 8 : 9);
  text(forwardish ? 'conventional current (p → n)' : 'conventional current (n → p)', diagX + diagW / 2, arrowY + 6);

  let mech;
  if (region === 'breakdown') mech = likelyZener ? 'Zener breakdown (tunneling)' : 'Avalanche breakdown (impact ionization)';
  else if (region === 'forward') mech = 'Forward diffusion current';
  else mech = 'Reverse saturation current (drift-limited)';
  noStroke(); fill(30); textAlign(CENTER, TOP); textStyle(BOLD); textSize(compact() ? 9.5 : 11);
  // text(str,x,y,w) box left edge = x, not the box's center, so the box
  // must start at bx+4 (a small inset) rather than the panel's midpoint
  // -- centering on bx+bw/2 pushed the wrap box (and this label) far
  // past the panel's own right edge, clipping it against the canvas.
  text(mech, bx + 4, arrowY + (compact() ? 20 : 22), bw - 8);
  textStyle(NORMAL);
}

// ---------------- numeric readouts + region badge ----------------
function drawReadoutCard(bx, by, bw, bh, N, VBR, J0, VT, V, J, region) {
  const sz = compact() ? 10.5 : 11.5;
  const lineH = compact() ? 20 : 19;
  noStroke(); fill(247, 249, 255); stroke(200, 215, 245); strokeWeight(1.5);
  rect(bx, by, bw, bh, 10);

  const badgeInfo = {
    forward: { name: 'FORWARD CONDUCTION', col: [40, 150, 90], bg: [225, 245, 232] },
    reverse: { name: 'REVERSE SATURATION', col: [210, 110, 40], bg: [255, 235, 218] },
    breakdown: { name: 'BREAKDOWN', col: [140, 60, 200], bg: [240, 225, 250] }
  }[region];
  const badgeW = Math.min(bw - 20, 260), badgeH = compact() ? 24 : 26;
  const badgeX = bx + 10, badgeY = by + 10;
  noStroke(); fill(badgeInfo.bg[0], badgeInfo.bg[1], badgeInfo.bg[2]);
  stroke(badgeInfo.col[0], badgeInfo.col[1], badgeInfo.col[2]); strokeWeight(1.5);
  rect(badgeX, badgeY, badgeW, badgeH, 6);
  noStroke(); fill(badgeInfo.col[0], badgeInfo.col[1], badgeInfo.col[2]);
  textAlign(CENTER, CENTER); textStyle(BOLD); textSize(compact() ? 11.5 : 13);
  text(badgeInfo.name, badgeX + badgeW / 2, badgeY + badgeH / 2 + 1);
  textStyle(NORMAL);

  let ly = badgeY + badgeH + 12;
  noStroke(); fill(30); textAlign(LEFT, TOP);
  smlMathText(bx + 12, ly, 'N = ' + smlFormatConc(N, {}), { size: sz }); ly += lineH;
  smlMathText(bx + 12, ly, 'V_BR (estimate) ≈ ' + VBR.toFixed(3) + ' V', { size: sz }); ly += lineH;
  smlMathText(bx + 12, ly, 'J_0 = ' + J0.toExponential(2) + ' A/cm²', { size: sz }); ly += lineH;
  smlMathText(bx + 12, ly, 'V_T = ' + VT.toFixed(4) + ' V  (T = 300 K)', { size: sz }); ly += lineH;
  smlMathText(bx + 12, ly, 'V (marker) = ' + V.toFixed(3) + ' V', { size: sz }); ly += lineH;
  smlMathText(bx + 12, ly, 'J(V) = ' + J.toExponential(3) + ' A/cm²', { size: sz }); ly += lineH;
}

function drawControlLabels(N, V) {
  const rows = controlRows();
  fill(30); noStroke();
  const sz = compact() ? 12 : 13;
  textSize(sz);
  if (rows.stacked) {
    textAlign(LEFT, TOP);
    smlMathText(10, drawHeight + rows.n, 'N = ' + smlFormatConc(N, {}), { size: sz });
    smlMathText(10, drawHeight + rows.v, 'V marker = ' + V.toFixed(3) + ' V', { size: sz });
  } else {
    textAlign(LEFT, TOP);
    text('N (doping)', 10, drawHeight + rows.n + 10);
    text('V (marker)', 10, drawHeight + rows.v + 10);
    textAlign(RIGHT, TOP);
    text(smlFormatConc(N, {}), canvasWidth - 10, drawHeight + rows.n + 10);
    text(V.toFixed(3) + ' V', canvasWidth - 10, drawHeight + rows.v + 10);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
}

function updateCanvasSize() {
  minDrawHeight = compact() ? 760 : 560;
  controlHeight = compact() ? 150 : 110;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  drawHeight = Math.max(drawHeight, minDrawHeight);
}
