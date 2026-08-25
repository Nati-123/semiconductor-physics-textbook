// Fermi Level Position vs. Doping Explorer MicroSim
// Draws a full band diagram (E_C, E_i, E_F, E_V) and computes E_F's exact
// position from the doping-dependent n0 (the same quadratic solution used
// in the Carrier Concentration and Charge Neutrality Explorer) via
// E_C-E_F = kT ln(NC/n0), with a live non-degenerate/transition/degenerate
// warning -- this chapter's equations assume the non-degenerate regime.
// Physics note: increasing ND pushes n0 up, shrinking EC-EF and moving EF
// toward EC; increasing NA does the mirror-image thing toward EV.
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, tempSlider, ndExpSlider, naExpSlider, presetSelect;
const KB = 8.617e-5;

const PRESETS = {
  'Custom': null,
  'Intrinsic (ND=NA=0)': { nd: 0, na: 0 },
  'n-type (ND ≫ NA)': { nd: 17, na: 13 },
  'p-type (NA ≫ ND)': { nd: 13, na: 17 },
  'Compensated (ND slightly > NA)': { nd: 16, na: 15.7 },
  'Degenerate n-type (ND very heavy)': { nd: 20, na: 13 }
};

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

  tempSlider = createSlider(150, 600, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');
  tempSlider.input(function () { redraw(); });

  ndExpSlider = createSlider(0, 20, 16, 0.05);
  ndExpSlider.attribute('aria-label', 'Donor concentration exponent, power of 10 per cm cubed');
  ndExpSlider.input(function () { presetSelect.selected('Custom'); redraw(); });

  naExpSlider = createSlider(0, 20, 0, 0.05);
  naExpSlider.attribute('aria-label', 'Acceptor concentration exponent, power of 10 per cm cubed');
  naExpSlider.input(function () { presetSelect.selected('Custom'); redraw(); });

  presetSelect = createSelect();
  Object.keys(PRESETS).forEach(k => presetSelect.option(k));
  presetSelect.selected('Custom');
  presetSelect.attribute('aria-label', 'Doping preset');
  presetSelect.changed(function () {
    const p = PRESETS[presetSelect.value()];
    if (p) { ndExpSlider.value(p.nd); naExpSlider.value(p.na); }
    redraw();
  });

  positionUIElements();
  noLoop();
  describe('Fermi level position versus doping explorer: draws a band diagram showing the exact Fermi level position computed from donor and acceptor concentration, with the intrinsic Fermi level marked as reference and a warning when the non-degenerate approximation breaks down', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 95 : 150;
  const sw = min(canvasWidth - lbl - 30, 300);
  presetSelect.position(bx + lbl, by + drawHeight + 12); presetSelect.size(sw);
  materialSelect.position(bx + lbl, by + drawHeight + 50);
  tempSlider.position(bx + lbl, by + drawHeight + 88); tempSlider.size(sw);
  ndExpSlider.position(bx + lbl, by + drawHeight + 126); ndExpSlider.size(sw);
  naExpSlider.position(bx + lbl, by + drawHeight + 164); naExpSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1); line(0, drawHeight, canvasWidth, drawHeight);

  const mat = SML_MATERIALS[materialSelect.value()];
  const T = tempSlider.value();
  const kT = KB * T;
  const ND = concFromSlider(ndExpSlider.value());
  const NA = concFromSlider(naExpSlider.value());
  const Nc = smlEffDOS(mat.me, T), Nv = smlEffDOS(mat.mh, T);
  const Eg = smlEgVarshni(mat, T);
  const ni = smlNi(mat, T);
  const n0 = smlExactN0(ND, NA, ni);
  const p0 = smlExactP0(ND, NA, ni);

  const ecMinusEf = smlEcMinusEf(Nc, n0, kT);
  const efMinusEv = Eg - ecMinusEf;
  const eiOffset = smlEiOffsetFromMidgap(Nc, Nv, kT);
  const efMinusEi = efMinusEv - (Eg / 2 + eiOffset); // Ei measured from EV is midgap(Eg/2) + offset

  const distToBand = Math.min(ecMinusEf, efMinusEv);
  const zone = smlDegeneracyZone(distToBand, kT);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 12.5 : 15);
  text(materialSelect.value() + ': E_C − E_F = k_BT·ln(N_C/n₀)', canvasWidth / 2, 8);

  const leftW = compact() ? canvasWidth : Math.round(canvasWidth * 0.46);
  drawBandDiagram(Eg, ecMinusEf, efMinusEv, eiOffset, zone, kT, leftW);
  drawReadout(compact() ? 0 : leftW, compact() ? drawHeight * 0.56 : 0, compact() ? canvasWidth : canvasWidth - leftW, compact() ? drawHeight * 0.44 : drawHeight,
    n0, p0, ni, ecMinusEf, efMinusEv, efMinusEi, eiOffset, zone, kT);

  const rows = { preset: 12, mat: 50, temp: 88, nd: 126, na: 164 };
  fill(30); noStroke(); textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 13);
  text('Preset:', 10, drawHeight + rows.preset + 11);
  text('Material:', 10, drawHeight + rows.mat + 11);
  text('Temperature:', 10, drawHeight + rows.temp + 11);
  text('N_D:', 10, drawHeight + rows.nd + 11);
  text('N_A:', 10, drawHeight + rows.na + 11);
  textAlign(RIGHT, CENTER);
  text(smlFormatPow10(ndExpSlider.value()), canvasWidth - 10, drawHeight + rows.nd + 11);
  text(smlFormatPow10(naExpSlider.value()), canvasWidth - 10, drawHeight + rows.na + 11);
}

function drawBandDiagram(Eg, ecMinusEf, efMinusEv, eiOffset, zone, kT, panelW) {
  const diagX0 = compact() ? 60 : 70, diagX1 = panelW - (compact() ? 60 : 90);
  const plotY0 = 40, plotY1 = (compact() ? drawHeight * 0.56 : drawHeight) - 46;
  const HEAD = 0.22;
  function eToPx(depthBelowEc) { return map(depthBelowEc, -HEAD, Eg + HEAD, plotY0, plotY1); }

  const ecDepth = 0, evDepth = Eg;
  const eiDepth = Eg / 2 - eiOffset; // depth below EC
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

function drawReadout(panelX, panelY, panelW, panelH, n0, p0, ni, ecMinusEf, efMinusEv, efMinusEi, eiOffset, zone, kT) {
  // In non-compact layout this panel shares the top row with the page
  // title (drawn separately at y=8..~30), so cardY must clear it; in
  // compact layout the panel already sits below the band diagram.
  const cardX = panelX + 16, cardY = panelY + (compact() ? 16 : 40), cardW = panelW - 32;
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 10.5 : 12.5);
  const lines = [
    'E_C − E_F = ' + ecMinusEf.toFixed(3) + ' eV',
    'E_F − E_V = ' + efMinusEv.toFixed(3) + ' eV',
    'E_F − E_i = ' + (efMinusEi >= 0 ? '+' : '') + efMinusEi.toFixed(3) + ' eV',
    'E_i offset from exact midgap: ' + (eiOffset >= 0 ? '+' : '') + (eiOffset * 1000).toFixed(1) + ' meV',
    'n₀ = ' + smlFormatConc(n0),
    'p₀ = ' + smlFormatConc(p0),
    'nᵢ = ' + smlFormatConc(ni)
  ];
  let y = cardY;
  for (const l of lines) { text(l, cardX, y, cardW); y += compact() ? 17 : 19; }

  const badgeY = y + 8;
  const info = {
    non: { name: 'NON-DEGENERATE', bg: color(222, 245, 225), bd: color(46, 125, 50), tx: color(30, 100, 40) },
    transition: { name: 'APPROACHING DEGENERATE', bg: color(255, 240, 210), bd: color(200, 140, 20), tx: color(150, 100, 10) },
    degenerate: { name: 'DEGENERATE — ESTIMATE ONLY', bg: color(255, 220, 220), bd: color(200, 30, 30), tx: color(180, 20, 20) }
  }[zone];
  noStroke(); fill(info.bg); stroke(info.bd); strokeWeight(1.5);
  rect(cardX, badgeY, cardW, compact() ? 22 : 25, 6);
  noStroke(); fill(info.tx); textAlign(CENTER, CENTER); textSize(compact() ? 10 : 12);
  text(info.name, cardX + cardW / 2, badgeY + (compact() ? 11 : 12.5));

  if (zone !== 'non') {
    fill(150, 90, 10); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 9.5 : 11);
    text('E_F is within 3k_BT of a band edge (or past it) — the non-degenerate formulas above are becoming inaccurate or invalid.',
      cardX, badgeY + (compact() ? 28 : 32), cardW);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 200 : 170;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 640);
}
