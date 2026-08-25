// Fermi Level vs. Temperature Explorer MicroSim
// Holds doping (ND, NA) fixed and sweeps temperature, showing E_F's
// position on a band diagram together with a trend chart of E_F-E_i vs T
// -- the direct visual answer to "does E_F drift toward E_i (intrinsic)
// as temperature rises, and how fast?"
// Physics note: as T rises, ni(T) grows exponentially until it exceeds
// the fixed net doping, at which point n0 -> ni and E_F -> Ei -- the same
// intrinsic-temperature-region transition Chapter 8 introduced
// qualitatively, now shown through Chapter 10's exact E_F equation.
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 480;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, ndExpSlider, naExpSlider, tempSlider;
const KB = 8.617e-5;

function compact() { return canvasWidth < 480; }
function concFromSlider(v) { return v < 0.3 ? 0 : Math.pow(10, v); }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  Object.keys(SML_MATERIALS).forEach(k => materialSelect.option(k));
  materialSelect.selected('Silicon');
  materialSelect.attribute('aria-label', 'Material selection');
  materialSelect.changed(function () { redraw(); });

  ndExpSlider = createSlider(0, 18, 15, 0.05);
  ndExpSlider.attribute('aria-label', 'Fixed donor concentration exponent, power of 10 per cm cubed');
  ndExpSlider.input(function () { redraw(); });

  naExpSlider = createSlider(0, 18, 0, 0.05);
  naExpSlider.attribute('aria-label', 'Fixed acceptor concentration exponent, power of 10 per cm cubed');
  naExpSlider.input(function () { redraw(); });

  tempSlider = createSlider(150, 800, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');
  tempSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Fermi level versus temperature explorer: holds a chosen donor and acceptor concentration fixed and sweeps temperature, showing the Fermi level drift toward the intrinsic level on a band diagram and on a trend chart as the material approaches intrinsic behavior at high temperature', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 95 : 150;
  const sw = min(canvasWidth - lbl - 30, 300);
  materialSelect.position(bx + lbl, by + drawHeight + 12);
  ndExpSlider.position(bx + lbl, by + drawHeight + 50); ndExpSlider.size(sw);
  naExpSlider.position(bx + lbl, by + drawHeight + 88); naExpSlider.size(sw);
  tempSlider.position(bx + lbl, by + drawHeight + 126); tempSlider.size(sw);
}

function computeAt(mat, T, ND, NA) {
  const kT = KB * T;
  const Nc = smlEffDOS(mat.me, T), Nv = smlEffDOS(mat.mh, T);
  const Eg = smlEgVarshni(mat, T);
  const ni = smlNi(mat, T);
  const n0 = smlExactN0(ND, NA, ni);
  const p0 = smlExactP0(ND, NA, ni);
  const ecMinusEf = smlEcMinusEf(Nc, n0, kT);
  const efMinusEv = Eg - ecMinusEf;
  const eiOffset = smlEiOffsetFromMidgap(Nc, Nv, kT);
  const efMinusEi = efMinusEv - (Eg / 2 + eiOffset);
  return { kT, Eg, ni, n0, p0, ecMinusEf, efMinusEv, eiOffset, efMinusEi };
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1); line(0, drawHeight, canvasWidth, drawHeight);

  const mat = SML_MATERIALS[materialSelect.value()];
  const ND = concFromSlider(ndExpSlider.value());
  const NA = concFromSlider(naExpSlider.value());
  const T = tempSlider.value();
  const cur = computeAt(mat, T, ND, NA);

  const distToBand = Math.min(cur.ecMinusEf, cur.efMinusEv);
  const zone = smlDegeneracyZone(distToBand, cur.kT);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 12.5 : 15);
  text(materialSelect.value() + ' at fixed N_D=' + smlFormatConc(ND, { noUnit: true }) + ', N_A=' + smlFormatConc(NA, { noUnit: true }) + ' cm⁻³ — sweep T', canvasWidth / 2, 8);

  const leftW = compact() ? canvasWidth : Math.round(canvasWidth * 0.42);
  drawBandDiagram(cur.Eg, cur.ecMinusEf, cur.efMinusEv, cur.eiOffset, zone, cur.kT, leftW);
  drawTrendAndReadout(mat, ND, NA, T, cur, zone, compact() ? 0 : leftW, compact() ? drawHeight * 0.52 : 0, compact() ? canvasWidth : canvasWidth - leftW, compact() ? drawHeight * 0.48 : drawHeight);

  const rows = { mat: 12, nd: 50, na: 88, temp: 126 };
  fill(30); noStroke(); textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 13);
  text('Material:', 10, drawHeight + rows.mat + 11);
  text('N_D (fixed):', 10, drawHeight + rows.nd + 11);
  text('N_A (fixed):', 10, drawHeight + rows.na + 11);
  text('Temperature:', 10, drawHeight + rows.temp + 11);
  textAlign(RIGHT, CENTER);
  text(smlFormatPow10(ndExpSlider.value()), canvasWidth - 10, drawHeight + rows.nd + 11);
  text(smlFormatPow10(naExpSlider.value()), canvasWidth - 10, drawHeight + rows.na + 11);
  text(T + ' K', canvasWidth - 10, drawHeight + rows.temp + 11);
}

function drawBandDiagram(Eg, ecMinusEf, efMinusEv, eiOffset, zone, kT, panelW) {
  const diagX0 = compact() ? 60 : 70, diagX1 = panelW - (compact() ? 60 : 90);
  const plotY0 = 40, plotY1 = (compact() ? drawHeight * 0.52 : drawHeight) - 46;
  const HEAD = 0.22;
  function eToPx(depthBelowEc) { return map(depthBelowEc, -HEAD, Eg + HEAD, plotY0, plotY1); }

  const ecDepth = 0, evDepth = Eg;
  const eiDepth = Eg / 2 - eiOffset;
  const efDepth = ecMinusEf;

  noStroke();
  fill(90, 62, 237, 28);
  rect(diagX0, plotY0, diagX1 - diagX0, eToPx(ecDepth) - plotY0);
  fill(200, 90, 90, 28);
  rect(diagX0, eToPx(evDepth), diagX1 - diagX0, eToPx(Eg + HEAD) - eToPx(evDepth));

  noStroke(); fill(255, 160, 60, 55);
  rect(diagX0, eToPx(3 * kT), diagX1 - diagX0, eToPx(0) - eToPx(3 * kT));
  rect(diagX0, eToPx(evDepth), diagX1 - diagX0, eToPx(evDepth - 3 * kT) - eToPx(evDepth));

  stroke(90, 62, 237); strokeWeight(2.5);
  line(diagX0, eToPx(ecDepth), diagX1, eToPx(ecDepth));
  stroke(90, 180, 120); strokeWeight(1.5);
  drawingContext.setLineDash([3, 3]);
  line(diagX0, eToPx(eiDepth), diagX1, eToPx(eiDepth));
  drawingContext.setLineDash([]);
  stroke(200, 90, 90); strokeWeight(2.5);
  line(diagX0, eToPx(evDepth), diagX1, eToPx(evDepth));

  noStroke(); fill(90, 62, 237); textAlign(LEFT, BOTTOM); textSize(compact() ? 10.5 : 12);
  text('E_C', diagX1 + 6, eToPx(ecDepth) + 4);
  fill(90, 150, 110); textAlign(LEFT, CENTER);
  text('E_i', diagX1 + 6, eToPx(eiDepth));
  fill(200, 90, 90); textAlign(LEFT, TOP);
  text('E_V', diagX1 + 6, eToPx(evDepth) + 4);

  const efClamped = constrain(efDepth, -HEAD + 0.02, Eg + HEAD - 0.02);
  const zoneColor = zone === 'non' ? color(46, 125, 50) : (zone === 'transition' ? color(200, 140, 20) : color(200, 30, 30));
  stroke(zoneColor); strokeWeight(2.6);
  if (zone === 'degenerate') drawingContext.setLineDash([6, 4]); else drawingContext.setLineDash([]);
  line(diagX0, eToPx(efClamped), diagX1, eToPx(efClamped));
  drawingContext.setLineDash([]);
  noStroke(); fill(zoneColor); textAlign(LEFT, efDepth < 0 ? TOP : (efDepth > Eg ? BOTTOM : CENTER)); textSize(compact() ? 10.5 : 12);
  text('E_F' + (zone === 'degenerate' ? ' (estimate)' : ''), diagX1 + 6, eToPx(efClamped));
}

function drawTrendAndReadout(mat, ND, NA, T, cur, zone, panelX, panelY, panelW, panelH) {
  // Non-compact layout shares the top row with the page title (drawn
  // separately at y=8..~30), so cardY must clear it.
  const cardX = panelX + 16, cardY = panelY + (compact() ? 16 : 40), cardW = panelW - 32;
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 10.5 : 12.5);
  const lines = [
    'T = ' + T + ' K   (k_BT = ' + cur.kT.toFixed(4) + ' eV)',
    'E_F − E_i = ' + (cur.efMinusEi >= 0 ? '+' : '') + cur.efMinusEi.toFixed(3) + ' eV',
    'n₀ = ' + smlFormatConc(cur.n0) + '   p₀ = ' + smlFormatConc(cur.p0),
    'nᵢ(T) = ' + smlFormatConc(cur.ni)
  ];
  let y = cardY;
  for (const l of lines) { text(l, cardX, y, cardW); y += compact() ? 17 : 19; }

  if (zone !== 'non') {
    y += 4;
    fill(180, 90, 10); textAlign(LEFT, TOP); textSize(compact() ? 9.5 : 11);
    text('Near or past a band edge — non-degenerate formulas are becoming inaccurate.', cardX, y, cardW);
    y += compact() ? 28 : 30;
  }

  const chartTop = y + 16;
  const chartBottom = panelY + panelH - 10;
  if (chartBottom - chartTop > 70) {
    drawTrendChart(mat, ND, NA, T, cardX, chartTop, cardW, chartBottom - chartTop);
  }
}

function drawTrendChart(mat, ND, NA, T, x, y, w, h) {
  const pts = [];
  const TMIN = 150, TMAX = 800;
  for (let t = TMIN; t <= TMAX; t += 10) {
    const c = computeAt(mat, t, ND, NA);
    pts.push({ x: t, y: c.efMinusEi });
  }
  fill(60); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11);
  text('E_F − E_i vs. T  (→ 0 as the sample turns intrinsic):', x, y - 14);
  const yAbs = Math.max(...pts.map(p => Math.abs(p.y)), 0.05) * 1.15;
  const cur = computeAt(mat, T, ND, NA);
  smlDrawLineChart(x, y, w, h, TMIN, TMAX, -yAbs, yAbs, [
    { points: pts, color: color(90, 62, 237) }
  ], {
    marker: { x: T, y: cur.efMinusEi },
    xLabel: 'Temperature (K)', yLabel: 'E_F−E_i (eV)', yLabelOffset: 34
  });
  stroke(160); strokeWeight(1);
  drawingContext.setLineDash([2, 3]);
  line(x, map(0, -yAbs, yAbs, y + h, y), x + w, map(0, -yAbs, yAbs, y + h, y));
  drawingContext.setLineDash([]);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 165 : 130;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 720);
}
