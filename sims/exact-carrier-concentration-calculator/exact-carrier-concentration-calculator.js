// Carrier Concentration and Charge Neutrality Explorer MicroSim
// Solves the mass action law + charge neutrality system exactly,
// n0 = [(ND-NA) + sqrt((ND-NA)^2 + 4*ni^2)] / 2,  p0 = ni^2/n0,
// and visualizes BOTH equations being satisfied simultaneously: a
// log-scale "charge balance" pair of towers (positive charge p0+ND on
// the left, negative charge n0+NA on the right) that always reach the
// same height, plus an explicit comparison of the exact n0 against the
// common approximation n0~ND-NA.
// Physics note: complete ionization is assumed throughout (ND+~ND,
// NA-~NA), matching this chapter's own derivation.
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Apply / Analyze / Evaluate (L3-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, tempSlider, ndExpSlider, naExpSlider, presetSelect;

const PRESETS = {
  'Custom': null,
  'Intrinsic (ND=NA=0)': { nd: 0, na: 0 },
  'n-type (ND ≫ NA)': { nd: 17, na: 13 },
  'p-type (NA ≫ ND)': { nd: 13, na: 17 },
  'Compensated (ND slightly > NA)': { nd: 16, na: 15.7 },
  'Nearly compensated (ND ≈ NA)': { nd: 16, na: 15.98 }
};

function compact() { return canvasWidth < 480; }

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

  ndExpSlider = createSlider(0, 19, 16, 0.05);
  ndExpSlider.attribute('aria-label', 'Donor concentration exponent, power of 10 per cm cubed (0 means ND=0)');
  ndExpSlider.input(function () { presetSelect.selected('Custom'); redraw(); });

  naExpSlider = createSlider(0, 19, 0, 0.05);
  naExpSlider.attribute('aria-label', 'Acceptor concentration exponent, power of 10 per cm cubed (0 means NA=0)');
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
  describe('Carrier concentration and charge neutrality explorer: solves the mass action law and charge neutrality condition together for electron and hole concentration at any doping level, visualizes both equations being satisfied simultaneously as a charge balance, and compares the exact result to the common approximation', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

// A slider value of 0 represents ND (or NA) = 0 exactly, not 10^0=1 --
// sliders below 0.3 are treated as "no dopant of this type" so the
// intrinsic and single-type-doping presets are exactly reachable.
function concFromSlider(v) { return v < 0.3 ? 0 : Math.pow(10, v); }

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
  const ND = concFromSlider(ndExpSlider.value());
  const NA = concFromSlider(naExpSlider.value());
  const ni = smlNi(mat, T);
  const n0 = smlExactN0(ND, NA, ni);
  const p0 = smlExactP0(ND, NA, ni);
  const net = ND - NA;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13 : 16);
  text('n₀p₀ = nᵢ²   and   p₀ + N_D = n₀ + N_A   (charge neutrality)', canvasWidth / 2, 8);

  const leftW = compact() ? canvasWidth : Math.round(canvasWidth * 0.42);
  // In compact mode the canvas is split top/bottom (balance chart above,
  // info panel below) rather than left/right -- drawBalance must be told
  // where its half ends, or it draws using the full canvas height and
  // collides with the info panel underneath it.
  const balanceBottom = compact() ? drawHeight * 0.5 : drawHeight;
  drawBalance(ND, NA, n0, p0, leftW, balanceBottom);
  drawInfoPanel(compact() ? 0 : leftW, compact() ? drawHeight * 0.5 : 0, compact() ? canvasWidth : canvasWidth - leftW, compact() ? drawHeight * 0.5 : drawHeight,
    ND, NA, ni, n0, p0, net);

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

function drawBalance(ND, NA, n0, p0, panelW, panelBottom) {
  // Reserved zones, top to bottom: page title (drawn separately, ends
  // ~y=32), column headers (two lines), then the bar-drawing region
  // starts at topY and ends at baseY, bounded by panelBottom -- in
  // compact mode the canvas is split top/bottom (this chart above, the
  // info panel below), so baseY must stay inside this chart's own half
  // rather than defaulting to the full canvas height.
  // Each tower's TOTAL height is log10(total), where total=p0+ND (left)
  // or n0+NA (right) -- these two totals are exactly equal by charge
  // neutrality, so the towers always reach the same height. Within that
  // single log-scaled height, the two components are split by their
  // LINEAR fraction of the total (not independently log-scaled and
  // stacked, which would not represent a sum correctly on a log axis).
  const headerY = compact() ? 40 : 44;
  const topY = compact() ? 90 : 96;
  const baseY = panelBottom - 60;
  const barW = compact() ? 60 : 80;
  const leftX = panelW * 0.28 - barW / 2;
  const rightX = panelW * 0.72 - barW / 2;
  const AXMIN = 0, AXMAX = 20;
  function valToH(v) { return map(constrain(Math.log10(max(v, 1)), AXMIN, AXMAX), AXMIN, AXMAX, 0, baseY - topY); }

  fill(60); noStroke(); textAlign(CENTER, TOP); textSize(compact() ? 10.5 : 12);
  text('Positive charge', leftX + barW / 2, headerY);
  text('(p₀ + N_D⁺)', leftX + barW / 2, headerY + 14);
  text('Negative charge', rightX + barW / 2, headerY);
  text('(n₀ + N_A⁻)', rightX + barW / 2, headerY + 14);

  const totalLeft = p0 + ND, totalRight = n0 + NA;
  const hLeft = valToH(totalLeft), hRight = valToH(totalRight);
  const fracND = ND / totalLeft, fracP0 = p0 / totalLeft;
  const fracNA = NA / totalRight, fracN0 = n0 / totalRight;

  noStroke(); fill(90, 62, 237, 190);
  rect(leftX, baseY - hLeft * fracND, barW, hLeft * fracND);
  fill(200, 90, 40, 190);
  rect(leftX, baseY - hLeft, barW, hLeft * fracP0);

  fill(200, 90, 40, 190);
  rect(rightX, baseY - hRight * fracNA, barW, hRight * fracNA);
  fill(90, 62, 237, 190);
  rect(rightX, baseY - hRight, barW, hRight * fracN0);

  stroke(140); strokeWeight(1);
  line(0, baseY, panelW, baseY);

  const topLeftY = baseY - hLeft, topRightY = baseY - hRight;
  const lineY = min(topLeftY, topRightY);
  stroke(40, 160, 90); strokeWeight(2);
  drawingContext.setLineDash([5, 4]);
  line(leftX, lineY - 4, rightX + barW, lineY - 4);
  drawingContext.setLineDash([]);
  noStroke(); fill(40, 160, 90); textAlign(CENTER, BOTTOM); textSize(compact() ? 10 : 11.5);
  text('totals always match — charge neutrality', panelW / 2, lineY - 8);

  fill(30); textAlign(CENTER, BOTTOM); textSize(compact() ? 9.5 : 11);
  if (ND > 0 && fracND > 0.04) text('N_D⁺: ' + smlFormatConc(ND), leftX + barW / 2, baseY - hLeft * fracND / 2 + 4);
  if (p0 > 1 && fracP0 > 0.04) text('p₀: ' + smlFormatConc(p0), leftX + barW / 2, baseY - hLeft * (1 - fracP0 / 2) + 4);
  if (NA > 0 && fracNA > 0.04) text('N_A⁻: ' + smlFormatConc(NA), rightX + barW / 2, baseY - hRight * fracNA / 2 + 4);
  if (n0 > 1 && fracN0 > 0.04) text('n₀: ' + smlFormatConc(n0), rightX + barW / 2, baseY - hRight * (1 - fracN0 / 2) + 4);
}

function drawInfoPanel(panelX, panelY, panelW, panelH, ND, NA, ni, n0, p0, net) {
  const cardX = panelX + 16, cardY = panelY + 16, cardW = panelW - 32;
  const majority = n0 >= p0 ? 'n-type (electrons majority)' : 'p-type (holes majority)';
  const minority = n0 >= p0 ? 'holes minority' : 'electrons minority';

  const approx = net >= 0 ? net : 0;
  const approxLabel = net >= 0 ? 'n₀ ≈ N_D−N_A' : 'n₀ ≈ 0 (approximation invalid here)';
  const approxErr = approx > 0 ? Math.abs(n0 - approx) / n0 * 100 : null;

  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 10.5 : 12.5);
  const lines = [
    'nᵢ = ' + smlFormatConc(ni),
    'Net doping (N_D−N_A) = ' + (ND - NA).toExponential(2) + ' cm⁻³',
    'n₀ (exact) = ' + smlFormatConc(n0),
    'p₀ (exact) = ' + smlFormatConc(p0),
    'Majority carrier: ' + majority,
    'Minority carrier: ' + minority,
    'Check: n₀p₀ = ' + (n0 * p0).toExponential(2) + '  (nᵢ² = ' + (ni * ni).toExponential(2) + ')'
  ];
  let y = cardY;
  for (const l of lines) { text(l, cardX, y, cardW); y += compact() ? 18 : 20; }

  y += 6;
  const approxColor = approxErr !== null && approxErr < 5 ? color(46, 125, 50) : color(200, 90, 30);
  fill(approxColor); textAlign(LEFT, TOP); textSize(compact() ? 10.5 : 12.5);
  text(approxLabel + (approx > 0 ? ' = ' + smlFormatConc(approx) : ''), cardX, y, cardW);
  y += compact() ? 18 : 20;
  if (approxErr !== null) {
    text('Approximation error vs. exact n₀: ' + approxErr.toFixed(1) + '%' +
      (approxErr < 5 ? '  (good approximation here)' : '  (approximation breaking down)'),
      cardX, y, cardW);
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
  if (compact()) drawHeight = Math.max(drawHeight, 720);
}
