// Forward and Reverse Bias Band Diagram Explorer MicroSim
// Shows how an applied bias V modifies the equilibrium band diagram,
// barrier height (Vbi - V), and depletion width W(V) = sqrt((2*eps*(Vbi-V)/q)
// * (1/NA + 1/ND)) of a silicon p-n junction. Positive V is forward bias,
// negative V is reverse bias. Three preset buttons (Reverse Bias /
// Equilibrium / Forward Bias) snap the bias slider to representative
// values while leaving it continuously draggable; a horizontal width bar
// gives students a direct visual read on how W(V) narrows and widens.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let naSlider, ndSlider, vSlider;
let presetBtnRects = [];

const Q = 1.602e-19;      // C
const EPS = 1.035e-12;    // F/cm  (Si, er=11.7)
const NI = 1.5e10;        // cm^-3 (Si, 300K)
const KT_Q = 0.0259;      // V (300K)
const WMAX_UM = 4;        // display cap for the depletion-width bar, in microns

const PRESETS = [
  { label: 'Reverse Bias', v: -3, color: [220, 90, 60] },
  { label: 'Equilibrium', v: 0, color: [90, 62, 237] },
  { label: 'Forward Bias', v: 0.5, color: [40, 150, 90] }
];

function compact() { return canvasWidth < 640; }

function vbiOf(NA, ND) {
  return KT_Q * Math.log((NA * ND) / (NI * NI));
}

function regimeOf(V) {
  if (V > 0.001) return { name: 'Forward Bias', color: color(40, 150, 90) };
  if (V < -0.001) return { name: 'Reverse Bias', color: color(220, 90, 60) };
  return { name: 'Equilibrium', color: color(90, 62, 237) };
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  naSlider = createSlider(15, 19, 17, 0.1);
  naSlider.attribute('aria-label', 'Acceptor doping concentration exponent N_A');
  naSlider.input(function () { redraw(); });
  ndSlider = createSlider(15, 19, 16, 0.1);
  ndSlider.attribute('aria-label', 'Donor doping concentration exponent N_D');
  ndSlider.input(function () { redraw(); });
  vSlider = createSlider(-10, 0.7, 0, 0.01);
  vSlider.attribute('aria-label', 'Applied bias voltage, positive is forward, negative is reverse');
  vSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Forward and reverse bias band diagram explorer: shows how applied bias modifies the equilibrium band diagram, potential barrier, and depletion width of a p-n junction, with preset buttons for reverse bias, equilibrium, and forward bias and a visual depletion-width bar', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function controlRows() {
  const stacked = compact();
  const rowH = stacked ? 54 : 36;
  const topPad = 12;
  return {
    stacked: stacked, rowH: rowH,
    na: topPad, nd: topPad + rowH, v: topPad + 2 * rowH,
    bottom: topPad + 3 * rowH + 6
  };
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const rows = controlRows();
  const widgetX = rows.stacked ? 16 : 150;
  const widgetOffsetY = rows.stacked ? 20 : 8;
  const sw = rows.stacked ? Math.min(canvasWidth - 32, 340) : Math.min(canvasWidth - 150 - 30, 320);

  naSlider.position(bx + widgetX, by + drawHeight + rows.na + widgetOffsetY);
  naSlider.size(sw);
  ndSlider.position(bx + widgetX, by + drawHeight + rows.nd + widgetOffsetY);
  ndSlider.size(sw);
  vSlider.position(bx + widgetX, by + drawHeight + rows.v + widgetOffsetY);
  vSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const NA = Math.pow(10, naSlider.value());
  const ND = Math.pow(10, ndSlider.value());
  const Vbi = vbiOf(NA, ND);
  const V = vSlider.value();
  const barrier = max(Vbi - V, 0.01 * Vbi);
  const W = Math.sqrt((2 * EPS * barrier / Q) * (1 / NA + 1 / ND));
  const W0 = Math.sqrt((2 * EPS * Vbi / Q) * (1 / NA + 1 / ND));
  const regime = regimeOf(V);

  // Left-aligned (never centered) so the title text can never drift into
  // the fullscreen-toggle button's reserved region (x > canvasWidth-140,
  // y < 34) at narrow canvas widths.
  fill(20); noStroke(); textAlign(LEFT, TOP);
  const titleStr = compact()
    ? 'Barrier = V_bi − V'
    : 'Barrier = V_bi − V,   W(V) = √[2ε(V_bi−V)/q · (1/N_A+1/N_D)]';
  smlMathText(10, 8, titleStr, { size: compact() ? 12 : 13 });

  // btnY is kept >= 34 so the preset-button row never enters the
  // fullscreen-toggle's reserved region regardless of its x-extent.
  const btnY = 36, btnH = 28;
  const diagTop = btnY + btnH + 14;
  drawPresetButtons(btnY, btnH, V);

  const wide = !compact();
  const x0 = compact() ? 34 : 40, x1 = wide ? canvasWidth * 0.56 : canvasWidth - 34;
  const widthBarBlockH = compact() ? 54 : 50;
  const gapBelow = 10;

  // Content-driven result card height, computed up front so the diagram
  // (and, on narrow canvases, the width bar) know how much vertical room
  // they actually have left instead of guessing and either clipping the
  // card or leaving it stranded off the bottom of the canvas.
  const cardLines = 6;
  const cardSz = compact() ? 11 : 11.5;
  const cardLineH = compact() ? 21 : 20;
  const cardHeaderH = 26;
  const cardH = 12 + cardHeaderH + cardLines * cardLineH + 14 + (wide ? 30 : 0);

  const totalDiagH = wide ? (drawHeight - diagTop - 10) : (drawHeight - diagTop - cardH - 10);
  const bandBlockH = Math.max(120, totalDiagH - widthBarBlockH - gapBelow);

  drawBandDiagram(diagTop, bandBlockH, x0, x1, barrier, Vbi, V, NA, ND, W, regime.color);

  const widthBarY = diagTop + bandBlockH + gapBelow;
  drawWidthBar(widthBarY, widthBarBlockH, x0, x1, W, W0, regime.color);

  drawResultCard(diagTop, cardH, cardSz, cardLineH, cardHeaderH, wide, NA, ND, Vbi, V, barrier, W, regime);

  drawControlLabels(V);
}

// ---- three-way preset row: Reverse Bias / Equilibrium / Forward Bias ----
function drawPresetButtons(btnY, btnH, V) {
  const areaW = compact() ? canvasWidth - 20 : Math.min(460, canvasWidth - 40);
  const areaX = compact() ? 10 : Math.round((canvasWidth - areaW) / 2);
  const gap = 6;
  const bw = (areaW - 2 * gap) / 3;

  // Highlight whichever preset the current slider value is closest to,
  // so the row stays a live readout even when the slider is dragged
  // freely rather than clicked into place.
  let activeIdx = 0, bestDist = Infinity;
  for (let i = 0; i < PRESETS.length; i++) {
    const d = Math.abs(V - PRESETS[i].v);
    if (d < bestDist) { bestDist = d; activeIdx = i; }
  }

  presetBtnRects = [];
  for (let i = 0; i < PRESETS.length; i++) {
    const bx = areaX + i * (bw + gap);
    const p = PRESETS[i];
    const active = i === activeIdx;
    stroke(p.color[0], p.color[1], p.color[2]); strokeWeight(1.5);
    fill(active ? color(p.color[0], p.color[1], p.color[2]) : color(245, 245, 250));
    rect(bx, btnY, bw, btnH, 6);
    noStroke();
    fill(active ? 255 : color(p.color[0], p.color[1], p.color[2]));
    smlMathText(bx + bw / 2, btnY + btnH / 2 - 6.5, p.label, { align: 'center', size: compact() ? 10.5 : 12 });
    presetBtnRects.push({ x: bx, y: btnY, w: bw, h: btnH, v: p.v });
  }
}

function drawControlLabels(V) {
  const rows = controlRows();
  const sz = compact() ? 12 : 13;
  fill(30); noStroke(); textSize(sz);
  if (rows.stacked) {
    textAlign(LEFT, TOP);
    smlMathText(10, drawHeight + rows.na, 'N_A = ' + smlFormatPow10(naSlider.value()), { size: sz });
    smlMathText(10, drawHeight + rows.nd, 'N_D = ' + smlFormatPow10(ndSlider.value()), { size: sz });
    smlMathText(10, drawHeight + rows.v, 'Applied V = ' + V.toFixed(2) + ' V', { size: sz });
  } else {
    textAlign(LEFT, TOP);
    smlDrawSubLabel(10, drawHeight + rows.na + 9 + sz * 0.36, 'N', 'A', { size: sz, baseline: CENTER });
    smlDrawSubLabel(10, drawHeight + rows.nd + 9 + sz * 0.36, 'N', 'D', { size: sz, baseline: CENTER });
    text('V', 10, drawHeight + rows.v + 9);
    textAlign(RIGHT, TOP);
    text(smlFormatPow10(naSlider.value()), canvasWidth - 10, drawHeight + rows.na + 9);
    text(smlFormatPow10(ndSlider.value()), canvasWidth - 10, drawHeight + rows.nd + 9);
    text(V.toFixed(2) + ' V', canvasWidth - 10, drawHeight + rows.v + 9);
  }
}

// Geometry note (fixes a real overflow bug found in browser testing): the
// vertical extent of the two flat band segments from the box's own
// vertical center is (bandGapPx/2 + bendPx). The OLD code capped bendPx
// at a fixed chartH*0.5 -- but bandGapPx/2 is ADDED on top of that, so
// the true extent could reach chartH*0.71, well past the chartH*0.5
// half-height actually available inside the box, at any large barrier
// (e.g. V=-3V, barrier=Vbi+3). This version instead (a) reserves the
// band-gap's own vertical room FIRST, so the bend can only ever use the
// remaining chartH*0.5-bandGapPx/2 (times a small safety margin) --
// mathematically guaranteeing the curves stay inside the box at ANY
// barrier, not just barriers below some fixed cutoff -- and (b) maps
// barrier through a saturating (not hard-clamped) function of Vbi, so a
// larger barrier always bends the curve visibly more (never looks
// "maxed out and identical" the way a hard clamp would), while still
// asymptotically approaching, but never reaching, that safe maximum.
function drawBandDiagram(top, blockH, x0, x1, barrier, Vbi, V, NA, ND, W, regimeColor) {
  // 54px (not the original 40px) reserved below the box: one row for
  // the -x_p/+x_n depletion-boundary tick labels, a second row below
  // that for the p-side/n-side labels, so the two don't collide.
  const chartY = top, chartH = Math.max(90, blockH - 54);
  const midX = (x0 + x1) / 2;
  const bandGapPx = chartH * 0.38;
  const bendPxMax = (chartH * 0.5 - bandGapPx / 2) * 0.92; // 8% headroom
  // Saturating map: bendFrac(barrier=Vbi) = 0.5 always (a consistent,
  // doping-independent look at equilibrium); bendFrac -> 1 only as
  // barrier -> infinity, so it can never reach (let alone exceed)
  // bendPxMax regardless of how far reverse the V slider goes.
  const bendFrac = barrier / (barrier + Vbi);
  const bendPx = bendFrac * bendPxMax;

  noFill(); stroke(210); strokeWeight(1);
  rect(x0 - 10, chartY - 6, x1 - x0 + 20, chartH + 12, 6);

  const ecFlatN = chartY + chartH * 0.5 - bandGapPx / 2 - bendPx;
  const ecFlatP = chartY + chartH * 0.5 - bandGapPx / 2 + bendPx;
  const evFlatN = ecFlatN + bandGapPx;
  const evFlatP = ecFlatP + bandGapPx;

  // Transition ("band-bending") zone width scales with the ACTUAL
  // depletion width W, saturating against the same WMAX_UM reference
  // used by the width bar below, so forward bias (narrow W) reads as a
  // visibly abrupt step and reverse bias (wide W) reads as a visibly
  // wide, gradual transition -- not a fixed-width kink regardless of W.
  const Wfrac = constrain((W * 1e4) / WMAX_UM, 0, 1);
  const maxHalfW = Math.min(70, (x1 - x0) * 0.18);
  const minHalfW = Math.min(10, maxHalfW * 0.4);
  const curveHalfW = minHalfW + (maxHalfW - minHalfW) * Wfrac;
  const ctrlHalfW = curveHalfW / 3;

  function bandCurve(yLeft, yRight) {
    beginShape();
    vertex(x0, yLeft);
    vertex(midX - curveHalfW, yLeft);
    bezierVertex(midX - ctrlHalfW, yLeft, midX - ctrlHalfW, yRight, midX + ctrlHalfW, yRight);
    vertex(x1, yRight);
    endShape();
  }

  stroke(regimeColor); strokeWeight(2.5); noFill();
  bandCurve(ecFlatP, ecFlatN);
  bandCurve(evFlatP, evFlatN);

  noStroke(); fill(regimeColor); textStyle(BOLD);
  smlDrawSubLabel(x1 + 6, ecFlatN, 'E', 'C', { size: compact() ? 10 : 11, baseline: CENTER });
  smlDrawSubLabel(x1 + 6, evFlatN, 'E', 'V', { size: compact() ? 10 : 11, baseline: CENTER });
  textStyle(NORMAL);

  stroke(200); strokeWeight(1);
  drawingContext.setLineDash([2, 3]);
  line(x0, chartY - 2, x0, chartY + chartH + 4);
  line(x1, chartY - 2, x1, chartY + chartH + 4);
  drawingContext.setLineDash([]);

  // Depletion-region boundaries (-x_p, +x_n) drawn directly in the band
  // diagram, split asymmetrically per the depletion approximation
  // (N_A*x_p = N_D*x_n, so the more heavily doped side gets the
  // narrower share of W) and tied to the SAME curveHalfW pixel scale as
  // the bend itself, so the two visual cues (transition width and
  // boundary markers) always move together as W changes with bias.
  const xpFrac = ND / (NA + ND), xnFrac = NA / (NA + ND);
  const depBoundaryX = curveHalfW * 2;
  const xpPx = midX - depBoundaryX * xpFrac;
  const xnPx = midX + depBoundaryX * xnFrac;
  stroke(120, 120, 130); strokeWeight(1.2);
  drawingContext.setLineDash([4, 3]);
  line(xpPx, chartY - 2, xpPx, chartY + chartH + 4);
  line(xnPx, chartY - 2, xnPx, chartY + chartH + 4);
  drawingContext.setLineDash([]);
  noStroke(); fill(100, 100, 110); textAlign(CENTER, TOP); textSize(compact() ? 8.5 : 9.5);
  smlDrawSubLabel(xpPx - 8, chartY + chartH + 8, '−x', 'p', { size: compact() ? 8.5 : 9.5, baseline: TOP });
  smlDrawSubLabel(xnPx - 8, chartY + chartH + 8, '+x', 'n', { size: compact() ? 8.5 : 9.5, baseline: TOP });

  // LEFT/RIGHT-anchored at x0/x1 (not CENTER) so these labels can never
  // clip off the left/right edge of a narrow (compact) canvas the way a
  // center-anchored label straddling x0 or x1 would.
  noStroke(); fill(190, 40, 40); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11); textStyle(BOLD);
  text('p-side (neutral)', x0, chartY + chartH + 22);
  fill(40, 40, 190); textAlign(RIGHT, TOP);
  text('n-side (neutral)', x1, chartY + chartH + 22);
  textStyle(NORMAL);

  const bx = midX;
  stroke(230, 150, 30); strokeWeight(1.5);
  line(bx - 34, ecFlatP, bx - 34, ecFlatN);
  noStroke(); fill(230, 150, 30);
  triangle(bx - 34, ecFlatP, bx - 38, ecFlatP + 6, bx - 30, ecFlatP + 6);
  triangle(bx - 34, ecFlatN, bx - 38, ecFlatN - 6, bx - 30, ecFlatN - 6);
  fill(200, 120, 10); textStyle(BOLD);
  // Barrier label spelled out per-regime (Vbi-VF / Vbi / Vbi+VR) so a
  // student reads the same three-case story the preset buttons and
  // result card show, instead of one generic "V_bi-V" formula whose
  // sign flip for reverse bias is easy to miss.
  const barrierLabel = V > 0.001 ? 'q(V_bi−V_F)' : (V < -0.001 ? 'q(V_bi+V_R)' : 'qV_bi');
  smlMathText(bx - 26, (ecFlatP + ecFlatN) / 2 - 6, barrierLabel, { size: compact() ? 10 : 11 });
  textStyle(NORMAL);
}

// ---- horizontal depletion-width indicator: makes W(V) a length a
// student can *see* narrow/widen, not just a number they have to read.
// Scaled against a fixed display cap (WMAX_UM) since W grows without
// bound as reverse V grows; a thin gray tick marks the equilibrium
// (V=0) width W0 as a fixed reference to compare against. ----
function drawWidthBar(y, blockH, x0, x1, W, W0, regimeColor) {
  const Wum = W * 1e4, W0um = W0 * 1e4;
  const frac = constrain(Wum / WMAX_UM, 0, 1);
  const eqFrac = constrain(W0um / WMAX_UM, 0, 1);
  const sz = compact() ? 10.5 : 11.5;

  noStroke(); fill(60); textAlign(LEFT, TOP); textStyle(BOLD); textSize(sz);
  text('Depletion Width W', x0, y);
  textStyle(NORMAL);
  fill(regimeColor); textAlign(RIGHT, TOP);
  text('W = ' + Wum.toFixed(3) + ' µm', x1, y);

  const trackY = y + sz + 6, trackH = compact() ? 14 : 16;
  const trackW = x1 - x0;
  noStroke(); fill(225, 228, 235);
  rect(x0, trackY, trackW, trackH, trackH / 2);
  fill(regimeColor);
  rect(x0, trackY, Math.max(trackH, trackW * frac), trackH, trackH / 2);

  stroke(110); strokeWeight(1.5);
  drawingContext.setLineDash([3, 2]);
  line(x0 + trackW * eqFrac, trackY - 4, x0 + trackW * eqFrac, trackY + trackH + 4);
  drawingContext.setLineDash([]);
  noStroke(); fill(90); textAlign(CENTER, TOP); textSize(compact() ? 9 : 9.5);
  text('eq.', x0 + trackW * eqFrac, trackY + trackH + 5);

  textAlign(LEFT, TOP); fill(120); textSize(compact() ? 9 : 9.5);
  text('0 µm', x0, trackY + trackH + 5);
  textAlign(RIGHT, TOP);
  text(WMAX_UM + '+ µm', x1, trackY + trackH + 5);
}

function drawResultCard(diagTop, cardH, sz, lineH, headerH, wide, NA, ND, Vbi, V, barrier, W, regime) {
  const cx = wide ? canvasWidth * 0.60 : 10;
  const cy = wide ? diagTop : drawHeight - cardH;
  const cw = wide ? canvasWidth - cx - 16 : canvasWidth - 20;

  noStroke(); fill(240, 245, 255);
  stroke(168, 200, 255); strokeWeight(1.5);
  rect(cx, cy, cw, cardH, 10);
  noStroke(); fill(regime.color); textAlign(CENTER, TOP); textStyle(BOLD); textSize(headerH - 12);
  text(regime.name, cx + cw / 2, cy + 12);
  textStyle(NORMAL);

  fill(30);
  let ly = cy + 12 + headerH;
  // Same per-regime formula spelled out as the band-diagram label
  // (Vbi-VF / Vbi / Vbi+VR), so the two never tell visually-different
  // stories about the same number.
  const barrierFormula = V > 0.001 ? ('V_bi − V_F = ' + Vbi.toFixed(3) + ' − ' + V.toFixed(2))
    : (V < -0.001 ? ('V_bi + V_R = ' + Vbi.toFixed(3) + ' + ' + (-V).toFixed(2))
      : 'V_bi');
  const lines = [
    'V_bi = ' + Vbi.toFixed(3) + ' V',
    'Applied V = ' + V.toFixed(2) + ' V',
    'Barrier = ' + barrierFormula + ' = ' + barrier.toFixed(3) + ' V',
    'W = ' + (W * 1e4).toFixed(3) + ' µm',
    'N_A = ' + smlFormatConc(NA),
    'N_D = ' + smlFormatConc(ND)
  ];
  for (let i = 0; i < lines.length; i++) {
    smlMathText(cx + 14, ly, lines[i], { size: sz });
    ly += lineH;
  }

  if (wide) {
    noStroke(); fill(90); textAlign(LEFT, TOP); textSize(10.5);
    text('Forward bias lowers the barrier and narrows W; reverse bias raises the barrier and widens W.', cx + 14, ly + 6, cw - 28);
  }
}

function mousePressed() {
  for (const r of presetBtnRects) {
    if (smlPointInRect(mouseX, mouseY, r.x, r.y, r.w, r.h)) {
      vSlider.value(r.v);
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
  minDrawHeight = compact() ? 530 : 440;
  controlHeight = compact() ? 220 : 170;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  drawHeight = Math.max(drawHeight, minDrawHeight);
}
