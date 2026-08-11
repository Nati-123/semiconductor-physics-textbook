// Compensated Semiconductor Explorer MicroSim
// A lattice with one donor and one acceptor atom present simultaneously,
// alongside log-scale N_D and N_A bars, a net-doping gauge, a majority
// carrier / compensated badge, and an approximate Fermi-level position
// indicator (T = 300 K, non-degenerate preview).
// Performance note: redraw is event-driven (noLoop + redraw-on-input);
// nothing here needs a continuous animation loop.
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let presetSelect, ndExpSlider, naExpSlider;
const COLS = 5, ROWS = 3;
const DONOR_I = 1, DONOR_J = 1, ACC_I = 3, ACC_J = 1;
const KT_300 = 0.0259, NI_SI = 1.0e10, EG_SI = 1.12;
const COMP_TOL = 0.05; // relative tolerance for calling it "compensated"

const PRESETS = {
  'Custom': null,
  'n-type (ND ≫ NA)': { nd: 17, na: 14.3 },
  'p-type (NA ≫ ND)': { nd: 14.3, na: 17 },
  'Compensation Point (ND = NA)': { nd: 16, na: 16 },
  'Strongly Compensated (both high, nearly equal)': { nd: 18, na: 17.99 }
};

function compact() { return canvasWidth < 480; }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  presetSelect = createSelect();
  Object.keys(PRESETS).forEach(name => presetSelect.option(name));
  presetSelect.attribute('aria-label', 'Doping preset');
  presetSelect.changed(function () {
    const p = PRESETS[presetSelect.value()];
    if (p) { ndExpSlider.value(p.nd); naExpSlider.value(p.na); }
    redraw();
  });

  ndExpSlider = createSlider(14, 18, 16.5, 0.05);
  ndExpSlider.attribute('aria-label', 'Donor concentration exponent');
  ndExpSlider.input(function () { presetSelect.selected('Custom'); redraw(); });

  naExpSlider = createSlider(14, 18, 15.5, 0.05);
  naExpSlider.attribute('aria-label', 'Acceptor concentration exponent');
  naExpSlider.input(function () { presetSelect.selected('Custom'); redraw(); });

  positionUIElements();
  noLoop();
  describe('Compensated semiconductor explorer: a lattice with both a donor and an acceptor atom present, with sliders for N_D and N_A, a net-doping gauge, a majority-carrier/compensated badge, and an approximate Fermi level indicator', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function controlX() { return compact() ? 130 : 190; }

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const cx = controlX();
  const sw = min(canvasWidth - cx - 40, 300);
  presetSelect.position(bx + cx, by + drawHeight + 12);
  ndExpSlider.position(bx + cx, by + drawHeight + 50); ndExpSlider.size(sw);
  naExpSlider.position(bx + cx, by + drawHeight + 88); naExpSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  const ND = Math.pow(10, ndExpSlider.value());
  const NA = Math.pow(10, naExpSlider.value());
  const net = ND - NA;
  const relDiff = Math.abs(net) / Math.max(ND, NA);
  const state = relDiff < COMP_TOL ? 'compensated' : (net > 0 ? 'n' : 'p');

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13 : 16);
  text('Compensated Silicon: Donor and Acceptor Both Present', canvasWidth / 2, 8);

  const leftW = compact() ? canvasWidth : canvasWidth * 0.54;
  drawLattice(leftW);
  drawRightPanel(compact() ? 0 : leftW, compact() ? drawHeight * 0.5 : 0, compact() ? canvasWidth : canvasWidth - leftW, compact() ? drawHeight * 0.5 : drawHeight, ND, NA, net, state);

  fill(30); noStroke();
  textAlign(RIGHT, CENTER); textSize(compact() ? 11 : 13);
  text('ND: ' + smlFormatPow10(ndExpSlider.value(), { noUnit: true }), controlX() - 10, drawHeight + 62);
  text('NA: ' + smlFormatPow10(naExpSlider.value(), { noUnit: true }), controlX() - 10, drawHeight + 100);
  textAlign(RIGHT, CENTER);
  text('Preset:', controlX() - 10, drawHeight + 24);
}

function drawLattice(panelW) {
  const spacing = min((panelW - 60) / (COLS - 1), compact() ? 60 : 75);
  const x0 = (panelW - spacing * (COLS - 1)) / 2;
  const y0 = compact() ? 45 : 58;

  smlDrawLatticeGrid(x0, y0, COLS, ROWS, spacing, {
    atomR: compact() ? 11 : 13, bondColor: color(110), electronColor: color(40, 40, 220),
    labelFor: function (i, j) {
      if (i === DONOR_I && j === DONOR_J) return 'P';
      if (i === ACC_I && j === ACC_J) return 'B';
      return 'Si';
    },
    colorFor: function (i, j) {
      if (i === DONOR_I && j === DONOR_J) return color(90, 62, 237);
      if (i === ACC_I && j === ACC_J) return color(200, 90, 90);
      return color(150, 180, 220);
    }
  });

  // legend
  const legY = y0 + spacing * (ROWS - 1) + (compact() ? 30 : 40);
  const legX0 = 10;
  textAlign(LEFT, CENTER); textSize(compact() ? 10 : 11.5);
  let lx = legX0, ly = legY;
  const items = [
    { c: color(150, 180, 220), t: 'Si — host lattice atom' },
    { c: color(90, 62, 237), t: 'P — donor (Group V, contributes an electron)' },
    { c: color(200, 90, 90), t: 'B — acceptor (Group III, contributes a hole)' }
  ];
  for (const it of items) {
    noStroke(); fill(it.c); circle(lx + 6, ly, 12);
    fill(30); text(it.t, lx + 16, ly);
    ly += compact() ? 16 : 18;
  }
}

function drawRightPanel(panelX, panelY, panelW, panelH, ND, NA, net, state) {
  const barY = panelY + (compact() ? 8 : 14);
  const barH = panelH * (compact() ? 0.28 : 0.32);
  const yMax = Math.max(ND, NA) * 1.15;
  const series = [
    { label: 'ND', value: ND, color: color(90, 62, 237) },
    { label: 'NA', value: NA, color: color(200, 90, 90) }
  ];
  smlDrawBarChart(panelX + 20, barY, panelW - 40, barH, series, yMax, {
    valueFormat: function (v) { return smlFormatConc(v, { noUnit: true }); }
  });

  // net-doping gauge: a horizontal bar from -maxExp to +maxExp (in decades)
  // showing where the SIGNED net doping falls, so crossing ND=NA is visible
  // as the marker crossing the gauge's center.
  const gaugeY = barY + barH + (compact() ? 42 : 50);
  const gaugeX0 = panelX + 24, gaugeX1 = panelX + panelW - 24;
  const gaugeW = gaugeX1 - gaugeX0;
  const maxDecades = 4.5; // gauge spans +/- this many decades from ND=NA
  const netExp = net === 0 ? 0 : Math.sign(net) * Math.log10(Math.abs(net));
  const zeroPointExp = Math.log10(Math.sqrt(ND * NA)); // geometric-mean reference, ~ typical exponent scale
  let signedDecades = net === 0 ? 0 : Math.sign(net) * (Math.log10(Math.abs(net)) - zeroPointExp);
  signedDecades = constrain(signedDecades, -maxDecades, maxDecades);
  const gaugeColor = state === 'compensated' ? color(120, 100, 160) : (state === 'n' ? color(90, 62, 237) : color(200, 90, 90));

  noFill(); stroke(200); strokeWeight(1);
  rect(gaugeX0, gaugeY, gaugeW, compact() ? 14 : 16, 4);
  stroke(150); strokeWeight(1);
  line(gaugeX0 + gaugeW / 2, gaugeY - 4, gaugeX0 + gaugeW / 2, gaugeY + (compact() ? 18 : 20));
  const markerX = map(signedDecades, -maxDecades, maxDecades, gaugeX0, gaugeX1);
  noStroke(); fill(gaugeColor);
  circle(markerX, gaugeY + (compact() ? 7 : 8), compact() ? 12 : 14);

  fill(90); textAlign(LEFT, TOP); textSize(compact() ? 9 : 10);
  text('p-type ←', gaugeX0, gaugeY + (compact() ? 20 : 24));
  textAlign(RIGHT, TOP);
  text('→ n-type', gaugeX1, gaugeY + (compact() ? 20 : 24));
  textAlign(CENTER, TOP);
  text('ND = NA', gaugeX0 + gaugeW / 2, gaugeY + (compact() ? 20 : 24));

  // majority-type / compensated badge
  const cardY = gaugeY + (compact() ? 46 : 54);
  const cardH = compact() ? 46 : 52;
  const info = {
    n: { name: 'Net n-type', bg: color(230, 235, 255), bd: color(90, 62, 237), tx: color(90, 62, 237) },
    p: { name: 'Net p-type', bg: color(255, 230, 230), bd: color(200, 90, 90), tx: color(200, 90, 90) },
    compensated: { name: 'Compensated (Nnet ≈ 0)', bg: color(240, 235, 250), bd: color(130, 100, 170), tx: color(110, 80, 150) }
  }[state];
  noStroke(); fill(info.bg); stroke(info.bd); strokeWeight(1.5);
  rect(panelX + 20, cardY, panelW - 40, cardH, 10);
  noStroke(); fill(info.tx);
  textAlign(CENTER, TOP); textSize(compact() ? 13 : 15);
  text(info.name, panelX + panelW / 2, cardY + 8);
  fill(50); textSize(compact() ? 10.5 : 12);
  text('Nnet = |ND − NA| = ' + smlFormatConc(Math.abs(net)), panelX + panelW / 2, cardY + (compact() ? 26 : 30));

  drawEFIndicator(panelX, cardY + cardH + (compact() ? 14 : 18), panelW, net, state);
}

// Approximate Fermi-level position at T = 300 K, non-degenerate preview:
// EF - Ei ~ kT*ln(Nnet/ni) for net n-type, Ei - EF ~ kT*ln(Nnet/ni) for
// net p-type. Ei is taken at exact midgap for this simplified preview
// (Chapter 10 refines this with the N_C/N_V correction).
function drawEFIndicator(panelX, y0, panelW, net, state) {
  const barX = panelX + panelW / 2 - (compact() ? 55 : 70);
  const barW = compact() ? 110 : 140;
  const barH = compact() ? 16 : 18;

  fill(60); noStroke(); textAlign(CENTER, TOP); textSize(compact() ? 9.5 : 10.5);
  text('Approx. Fermi level position (T = 300 K)', panelX + panelW / 2, y0 - (compact() ? 13 : 14));

  noFill(); stroke(90, 180, 120); strokeWeight(1.5);
  rect(barX, y0, barW, barH);
  stroke(90, 62, 237);
  line(barX, y0, barX + barW, y0);
  stroke(90, 180, 120);
  line(barX, y0 + barH, barX + barW, y0 + barH);

  // Ei tick at midpoint
  stroke(150); strokeWeight(1);
  drawingContext.setLineDash([2, 2]);
  line(barX + barW / 2, y0 - 3, barX + barW / 2, y0 + barH + 3);
  drawingContext.setLineDash([]);

  let fracFromEi = 0; // -0.5..0.5 across the gap, 0 = Ei
  let efLabel = 'EF ≈ Ei (intrinsic-like)';
  if (state !== 'compensated' && Math.abs(net) > 0) {
    const delta = KT_300 * Math.log(Math.abs(net) / NI_SI); // eV from Ei
    const deltaClamped = constrain(delta, -EG_SI / 2 + 0.03, EG_SI / 2 - 0.03);
    fracFromEi = (state === 'n' ? 1 : -1) * (deltaClamped / EG_SI);
    efLabel = 'EF ' + (state === 'n' ? '+' : '−') + delta.toFixed(3) + ' eV from Ei' + (Math.abs(delta) > EG_SI / 2 - 0.03 ? ' (approaching degenerate — see that Explorer)' : '');
  }
  const efX = barX + barW / 2 + fracFromEi * barW;
  noStroke(); fill(200, 30, 30);
  circle(constrain(efX, barX + 3, barX + barW - 3), y0 + barH / 2, compact() ? 10 : 11);

  fill(30); textSize(compact() ? 9 : 10);
  textAlign(RIGHT, CENTER); text('EC', barX - 4, y0 + 4);
  textAlign(RIGHT, CENTER); text('EV', barX - 4, y0 + barH - 4);
  // text(str,x,y,w,h) treats x as the box's LEFT edge, not its center --
  // pass panelX+10 (not the panel's center) so the wrapped caption stays
  // fully inside the panel instead of overflowing past the canvas edge.
  fill(60); textAlign(CENTER, TOP); textSize(compact() ? 9 : 10.5);
  text(efLabel, panelX + 10, y0 + barH + 8, panelW - 20);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 190 : 150;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 620);
}
