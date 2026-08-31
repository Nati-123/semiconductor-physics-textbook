// Junction Electric Field and Depletion Width Explorer MicroSim
// Applies Poisson's equation to the depletion approximation for a silicon
// step junction: computes depletion charge density rho(x), the triangular
// junction electric field E(x), and the electrostatic potential psi(x) in
// closed form, and displays all three stacked and vertically aligned, with
// a single shared, draggable position marker spanning the full plotted
// range (so students can see rho=0, E=0 outside the depletion region, and
// psi flattening on both sides). N_A and N_D sliders update x_p, x_n, W,
// E_max, and V_bi live, all marked directly on the charts.
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 780;
let drawHeight = 520;
let minDrawHeight = 500;
let controlHeight = 260;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let naSlider, ndSlider, xMarkSlider;
let presetBtnRects = [];
const PRESETS = [
  { label: 'Symmetric (N_A = N_D)', na: 17, nd: 17 },
  { label: 'p+–n (N_A ≫ N_D)', na: 19, nd: 15 },
  { label: 'p–n+ (N_D ≫ N_A)', na: 15, nd: 19 }
];

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
  const Emax = Q * NA * xp / EPS; // V/cm
  return { Vbi, W, xn, xp, Emax };
}

function rhoOfX(xUm, NA, ND, xpUm, xnUm) {
  if (xUm < -xpUm || xUm > xnUm) return 0;
  return xUm < 0 ? -NA : ND;
}

function eFieldOfX(xUm, NA, ND, xpUm, xnUm) {
  const xCm = xUm * 1e-4;
  const xpCm = xpUm * 1e-4, xnCm = xnUm * 1e-4;
  if (xUm < -xpUm || xUm > xnUm) return 0;
  if (xUm <= 0) return -(Q * NA / EPS) * (xCm + xpCm);
  return (Q * ND / EPS) * (xCm - xnCm);
}

function psiOfX(xUm, NA, ND, xpUm, xnUm) {
  const xCm = xUm * 1e-4;
  const xpCm = xpUm * 1e-4, xnCm = xnUm * 1e-4;
  if (xUm < -xpUm) return 0;
  if (xUm > xnUm) return (Q / (2 * EPS)) * (NA * xpCm * xpCm + ND * xnCm * xnCm);
  if (xUm <= 0) return (Q * NA / (2 * EPS)) * (xCm + xpCm) * (xCm + xpCm);
  const psi0 = (Q * NA / (2 * EPS)) * xpCm * xpCm;
  return psi0 + (Q * ND / EPS) * (xnCm * xCm - xCm * xCm / 2);
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
  xMarkSlider = createSlider(0, 1, 0.5, 0.005);
  xMarkSlider.attribute('aria-label', 'Position marker, spanning the full plotted x range');
  xMarkSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Junction electric field and depletion width explorer: shows depletion charge density, junction electric field, and electrostatic potential stacked and aligned for a silicon step junction, with N_A and N_D sliders and a shared draggable position marker spanning the full plotted range', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function controlRows() {
  const stacked = compact();
  const rowH = stacked ? 54 : 36;
  const topPad = 10;
  const presetH = 34;
  // On a narrow canvas, three side-by-side preset buttons don't leave
  // enough width for labels like "Symmetric (N_A = N_D)" -- they
  // overflowed past their own button edges. Stacking the three presets
  // into their own column instead needs 3 row-heights of vertical
  // space here rather than 1.
  const presetRows = stacked ? 3 : 1;
  const presetBlockH = presetRows * presetH + (presetRows - 1) * 8;
  return {
    stacked: stacked, rowH: rowH, presetH: presetH, presetRows: presetRows,
    preset: topPad,
    na: topPad + presetBlockH + 8, nd: topPad + presetBlockH + 8 + rowH, xmark: topPad + presetBlockH + 8 + 2 * rowH,
    cardTop: topPad + presetBlockH + 8 + 3 * rowH + 8
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
  xMarkSlider.position(bx + widgetX, by + drawHeight + rows.xmark + widgetOffsetY);
  xMarkSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const NA = Math.pow(10, naSlider.value());
  const ND = Math.pow(10, ndSlider.value());
  const geo = junctionGeometry(NA, ND);
  const xpUm = geo.xp * 1e4, xnUm = geo.xn * 1e4, WUm = geo.W * 1e4;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 12.5 : 15.5);
  text(compact() ? 'Poisson: ρ(x) → E(x) → ψ(x)' : 'Poisson’s Equation: ρ(x) → E(x) → ψ(x)   (silicon step junction)', canvasWidth / 2, 6);

  const chartX = compact() ? 62 : 92, chartW = canvasWidth - chartX - 26;
  const titleH = compact() ? 22 : 26;
  const rowGap = compact() ? 26 : 20;

  // Marker now spans the FULL plotted domain (not just the depletion
  // region), so students can drag it outside the depletion edges and
  // directly confirm rho=0, E=0, and psi flat there.
  const xMin = -xpUm * 1.4 - 0.01, xMax = xnUm * 1.4 + 0.01;
  const xMarkUm = xMin + xMarkSlider.value() * (xMax - xMin);

  // Row 3 alone carries both the W bracket AND the shared x-axis
  // caption below its boundary tick labels, so it needs extra reserved
  // space that rows 1-2 don't -- otherwise the two could land on top
  // of each other. It needs even more when -x_p (or x_n) sits close
  // enough to x=0 in pixels that the "0" tick label has to drop to its
  // own row rather than sitting beside them (see zeroLabelCollides).
  const xJpx = map(0, xMin, xMax, chartX, chartX + chartW);
  const xPpx = map(-xpUm, xMin, xMax, chartX, chartX + chartW);
  const xNpx = map(xnUm, xMin, xMax, chartX, chartX + chartW);
  const row3ZeroCollides = (xJpx - xPpx) < 16 || (xNpx - xJpx) < 16;
  const row3Extra = (compact() ? 36 : 34) + (row3ZeroCollides ? (compact() ? 11 : 12) : 0);
  const rowH = (drawHeight - titleH - 2 * rowGap - row3Extra - 10) / 3;
  const rowY1 = titleH + 6, rowY2 = rowY1 + rowH + rowGap, rowY3 = rowY2 + rowH + rowGap;

  const rhoPts = [], ePts = [], psiPts = [];
  const N = 160;
  for (let i = 0; i <= N; i++) {
    const xv = xMin + (xMax - xMin) * (i / N);
    rhoPts.push({ x: xv, y: rhoOfX(xv, NA, ND, xpUm, xnUm) });
    ePts.push({ x: xv, y: eFieldOfX(xv, NA, ND, xpUm, xnUm) });
    psiPts.push({ x: xv, y: psiOfX(xv, NA, ND, xpUm, xnUm) });
  }
  const rhoMax = Math.max(NA, ND) * 1.15;

  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11.5);
  text('ρ(x) / q  (cm⁻³)', 10, rowY1);
  const info1 = smlDrawLineChart(chartX, rowY1, chartW, rowH, xMin, xMax, -rhoMax, rhoMax,
    [{ points: rhoPts, color: color(230, 90, 60) }],
    { marker: { x: xMarkUm, y: rhoOfX(xMarkUm, NA, ND, xpUm, xnUm) } });
  drawBoundaries(info1, rowY1, rowH, xpUm, xnUm, false, false);
  noStroke(); fill(60);
  // Clamped so these labels never poke above/below the chart box --
  // for near-symmetric doping (N_A ~ N_D), the unclamped positions
  // landed right on top of the axis title (above) or the boundary
  // tick labels (below).
  // Clamped well below rowY1 (not just past it): the RIGHT-aligned
  // label text extends leftward from its x-anchor, into the same
  // horizontal territory as the "ρ(x)/q" axis title, so it must clear
  // the title's full line height vertically, not just its top edge.
  const rhoLabelMin = rowY1 + (compact() ? 15 : 17), rhoLabelMax = rowY1 + rowH - 12;
  smlMathText(info1.xToPx(xMin) + 4, constrain(info1.yToPx(-NA * 1.02), rhoLabelMin, rhoLabelMax), '−N_A', { size: compact() ? 9 : 10 });
  smlMathText(info1.xToPx(xMin) + 4, constrain(info1.yToPx(ND * 1.02) - (compact() ? 11 : 12), rhoLabelMin, rhoLabelMax), '+N_D', { size: compact() ? 9 : 10 });

  fill(30); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11.5);
  text('E(x)  (V/cm)', 10, rowY2);
  const info2 = smlDrawLineChart(chartX, rowY2, chartW, rowH, xMin, xMax, -geo.Emax * 1.15, geo.Emax * 0.2,
    [{ points: ePts, color: color(90, 62, 237) }],
    { marker: { x: xMarkUm, y: eFieldOfX(xMarkUm, NA, ND, xpUm, xnUm) } });
  drawBoundaries(info2, rowY2, rowH, xpUm, xnUm, false, false);
  // E_max annotation. E(x) is exactly 0 (flat) everywhere outside the
  // depletion edges, so the label is anchored just past whichever edge
  // (-x_p or x_n) has more pixel room, guaranteeing it sits over the
  // flat part of the curve rather than the sloped part -- a fixed left
  // anchor collided with the descending curve whenever x_p << x_n (the
  // common case), since the flat pre-edge strip on the left is then
  // very narrow.
  const emaxY = info2.yToPx(-geo.Emax);
  stroke(90, 62, 237); strokeWeight(1); drawingContext.setLineDash([2, 3]);
  line(chartX, emaxY, chartX + chartW, emaxY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90, 62, 237); textSize(compact() ? 9 : 10);
  const xpPx2 = info2.xToPx(-xpUm), xnPx2 = info2.xToPx(xnUm);
  const emaxLabel = 'E_max = ' + geo.Emax.toExponential(2) + ' V/cm';
  if ((chartX + chartW - xnPx2) >= (xpPx2 - chartX)) {
    smlMathText(xnPx2 + 6, emaxY - 2 - (compact() ? 9 : 10), emaxLabel, { size: compact() ? 9 : 10 });
  } else {
    smlMathText(xpPx2 - 6, emaxY - 2 - (compact() ? 9 : 10), emaxLabel, { size: compact() ? 9 : 10, align: 'right' });
  }

  fill(30); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11.5);
  text('ψ(x)  (V)', 10, rowY3);
  const info3 = smlDrawLineChart(chartX, rowY3, chartW, rowH, xMin, xMax, -geo.Vbi * 0.15, geo.Vbi * 1.15,
    [{ points: psiPts, color: color(40, 140, 90) }],
    { marker: { x: xMarkUm, y: psiOfX(xMarkUm, NA, ND, xpUm, xnUm) } });
  drawBoundaries(info3, rowY3, rowH, xpUm, xnUm, true, compact());
  // V_bi annotation: psi(x) is always exactly 0 immediately left of
  // -x_p (a flat quasi-neutral p-region by construction), so a
  // left-anchored label near the top of the chart never collides with
  // the curve, unlike the E_max case above.
  const vbiY = info3.yToPx(geo.Vbi);
  stroke(40, 140, 90); strokeWeight(1); drawingContext.setLineDash([2, 3]);
  line(chartX, vbiY, chartX + chartW, vbiY);
  drawingContext.setLineDash([]);
  noStroke(); fill(40, 140, 90); textSize(compact() ? 9 : 10);
  smlMathText(chartX + 4, vbiY - 2 - (compact() ? 9 : 10), 'V_bi = ' + geo.Vbi.toFixed(3) + ' V', { size: compact() ? 9 : 10 });
  noStroke(); fill(40); textAlign(CENTER, TOP); textSize(compact() ? 9.5 : 11);
  text('Position x (μm)', chartX + chartW / 2, rowY3 + rowH + (compact() ? 36 : 34) + (row3ZeroCollides ? (compact() ? 11 : 12) : 0));

  drawPresetButtons();
  drawControlLabels(NA, ND);
  drawInfoCard(NA, ND, geo, xpUm, xnUm, WUm, xMarkUm);
}

// Dashed vertical lines at x=-x_p, x=0 (metallurgical junction), and
// x=x_n, each labeled, plus a W bracket along the bottom of the psi(x)
// chart (the last one drawn, so it doesn't collide with the other two).
// Shared by drawBoundaries (to decide whether "0" needs its own row)
// and draw() (to keep the "Position x" caption below row 3 clear of
// whatever drawBoundaries ends up drawing there).
function zeroLabelCollides(info, xpUm, xnUm) {
  const xJ = info.xToPx(0), xP = info.xToPx(-xpUm), xN = info.xToPx(xnUm);
  return (xJ - xP) < 16 || (xN - xJ) < 16;
}

function drawBoundaries(info, rowY, rowH, xpUm, xnUm, drawWBracket, tinyLabels) {
  push();
  const xJ = info.xToPx(0), xP = info.xToPx(-xpUm), xN = info.xToPx(xnUm);
  stroke(140); strokeWeight(1); drawingContext.setLineDash([2, 3]);
  line(xJ, rowY, xJ, rowY + rowH);
  drawingContext.setLineDash([1, 2]);
  line(xP, rowY, xP, rowY + rowH);
  line(xN, rowY, xN, rowY + rowH);
  drawingContext.setLineDash([]);
  const tickSize = tinyLabels ? 8.5 : 9.5;
  const tickRowY = rowY + rowH + 2;
  noStroke(); fill(90); textAlign(CENTER, TOP); textSize(tickSize);
  smlMathText(xP, tickRowY, '−x_p', { size: tickSize, align: 'center' });
  smlMathText(xN, tickRowY, 'x_n', { size: tickSize, align: 'center' });
  // Under strongly asymmetric doping, -x_p (or x_n) can land only a
  // few px from the x=0 junction line, close enough that "0" collides
  // with the boundary label -- drop it to its own row below instead of
  // overlapping (the same fix used in the Depletion Approximation
  // Explorer for the identical layout problem).
  const zeroCollides = zeroLabelCollides(info, xpUm, xnUm);
  const zeroRowDy = tinyLabels ? 11 : 12;
  text('0', xJ, zeroCollides ? tickRowY + zeroRowDy : tickRowY);

  if (drawWBracket) {
    const by = rowY + rowH + (tinyLabels ? 15 : 16) + (zeroCollides ? zeroRowDy : 0);
    stroke(120); strokeWeight(1);
    line(xP, by, xN, by);
    line(xP, by - 4, xP, by + 4);
    line(xN, by - 4, xN, by + 4);
    noStroke(); fill(90); textAlign(CENTER, TOP); textSize(tickSize);
    text('W', (xP + xN) / 2, by + 2);
  }
  pop();
}

function drawPresetButtons() {
  const rows = controlRows();
  const n = PRESETS.length;
  const gap = 8;
  presetBtnRects = [];
  if (rows.stacked) {
    // Stacked into one full-width button per row -- three side-by-side
    // buttons don't leave room for labels like "Symmetric (N_A = N_D)"
    // on a narrow canvas; they overflowed past their own button edges.
    const btnW = canvasWidth - 20;
    for (let i = 0; i < n; i++) {
      const by = drawHeight + rows.preset + i * (rows.presetH + 8);
      smlDrawButton(10, by, btnW, rows.presetH, PRESETS[i].label, false);
      presetBtnRects.push({ x: 10, y: by, w: btnW, h: rows.presetH });
    }
  } else {
    const btnW = (canvasWidth - 20 - gap * (n - 1)) / n;
    const btnY = drawHeight + rows.preset;
    for (let i = 0; i < n; i++) {
      const bx = 10 + i * (btnW + gap);
      smlDrawButton(bx, btnY, btnW, rows.presetH, PRESETS[i].label, false);
      presetBtnRects.push({ x: bx, y: btnY, w: btnW, h: rows.presetH });
    }
  }
}

function drawControlLabels(NA, ND) {
  const rows = controlRows();
  const sz = compact() ? 12 : 13;
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(sz);
  if (rows.stacked) {
    smlMathText(10, drawHeight + rows.na, 'N_A = ' + NA.toExponential(1) + ' cm⁻³', { size: sz });
    smlMathText(10, drawHeight + rows.nd, 'N_D = ' + ND.toExponential(1) + ' cm⁻³', { size: sz });
    text('Position marker x', 10, drawHeight + rows.xmark);
  } else {
    smlDrawSubLabel(10, drawHeight + rows.na + 9 + sz * 0.36, 'N', 'A', { size: sz, baseline: CENTER });
    smlDrawSubLabel(10, drawHeight + rows.nd + 9 + sz * 0.36, 'N', 'D', { size: sz, baseline: CENTER });
    text('Position marker x', 10, drawHeight + rows.xmark + 9);
    textAlign(RIGHT, TOP);
    text(NA.toExponential(1) + ' cm⁻³', canvasWidth - 10, drawHeight + rows.na + 9);
    text(ND.toExponential(1) + ' cm⁻³', canvasWidth - 10, drawHeight + rows.nd + 9);
  }
}

function drawInfoCard(NA, ND, geo, xpUm, xnUm, WUm, xMarkUm) {
  const rows = controlRows();
  const cardY = drawHeight + rows.cardTop;
  const cardX = 10, cardW = canvasWidth - 20;
  const cardH = controlHeight - rows.cardTop - 8;

  fill(247, 249, 255); stroke(200, 215, 245); strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);

  const NAd = Math.pow(10, naSlider.value()), NDd = Math.pow(10, ndSlider.value());
  const Emark = eFieldOfX(xMarkUm, NA, ND, xpUm, xnUm);
  const psiMark = psiOfX(xMarkUm, NA, ND, xpUm, xnUm);

  noStroke(); fill(30);
  const sz = compact() ? 10.5 : 12;
  const lineH = compact() ? 22 : 20;
  let ly = cardY + 10;
  if (compact()) {
    smlMathText(cardX + 12, ly, 'x_p = ' + xpUm.toFixed(3) + ' μm      x_n = ' + xnUm.toFixed(3) + ' μm', { size: sz }); ly += lineH;
    smlMathText(cardX + 12, ly, 'W = ' + WUm.toFixed(3) + ' μm      V_bi = ' + geo.Vbi.toFixed(3) + ' V', { size: sz }); ly += lineH;
    smlMathText(cardX + 12, ly, 'E_max = ' + geo.Emax.toExponential(2) + ' V/cm', { size: sz }); ly += lineH;
    smlMathText(cardX + 12, ly, 'At marker x = ' + xMarkUm.toFixed(3) + ' μm:', { size: sz }); ly += lineH;
    smlMathText(cardX + 12, ly, 'ρ/q = ' + rhoOfX(xMarkUm, NA, ND, xpUm, xnUm).toExponential(2) + ' cm⁻³   E = ' + Emark.toExponential(2) + ' V/cm', { size: sz }); ly += lineH;
    smlMathText(cardX + 12, ly, 'ψ = ' + psiMark.toFixed(3) + ' V', { size: sz }); ly += lineH;
  } else {
    smlMathText(cardX + 12, ly, 'x_p = ' + xpUm.toFixed(3) + ' μm      x_n = ' + xnUm.toFixed(3) + ' μm      W = ' + WUm.toFixed(3) + ' μm      V_bi = ' + geo.Vbi.toFixed(3) + ' V      E_max = ' + geo.Emax.toExponential(2) + ' V/cm', { size: sz }); ly += lineH;
    smlMathText(cardX + 12, ly, 'At marker x = ' + xMarkUm.toFixed(3) + ' μm:   ρ/q = ' + rhoOfX(xMarkUm, NA, ND, xpUm, xnUm).toExponential(2) + ' cm⁻³      E = ' + Emark.toExponential(2) + ' V/cm      ψ = ' + psiMark.toFixed(3) + ' V', { size: sz }); ly += lineH;
  }

  fill(90);
  const noteSz = compact() ? 9.5 : 10.5;
  if (compact()) {
    smlMathText(cardX + 12, ly + 4, 'The more lightly doped side always gets the wider', { size: noteSz }); ly += 15;
    smlMathText(cardX + 12, ly + 4, 'share of the depletion region (N_A·x_p = N_D·x_n).', { size: noteSz });
  } else {
    smlMathText(cardX + 12, ly + 4, 'The more lightly doped side always gets the wider share of the depletion region (N_A·x_p = N_D·x_n).', { size: noteSz });
  }
}

function mousePressed() {
  for (let i = 0; i < presetBtnRects.length; i++) {
    const r = presetBtnRects[i];
    if (smlPointInRect(mouseX, mouseY, r.x, r.y, r.w, r.h)) {
      naSlider.value(PRESETS[i].na);
      ndSlider.value(PRESETS[i].nd);
      redraw();
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  minDrawHeight = compact() ? 560 : 500;
  controlHeight = compact() ? 504 : 300;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  drawHeight = Math.max(drawHeight, minDrawHeight);
}
