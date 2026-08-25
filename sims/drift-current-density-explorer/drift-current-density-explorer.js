// Drift Current Density Explorer MicroSim
// Computes J_n=qn0*mu_n*E and J_p=qp0*mu_p*E in real units (A/cm^2) for a
// chosen material, doping level, temperature, and applied field, using
// the exact carrier concentrations from Chapter 9-10's equations
// (smlExactN0/P0) and the Chapter 11 Matthiessen's-rule mobility model
// (smlMobility) -- the first place in this chapter a student sees an
// actual physical current density number, not just a drift velocity or
// mobility ratio.
// Physics note: J = q(n*mu_n + p*mu_p)*E; in extrinsic material the
// minority carrier's contribution is negligible by the mass action law
// (Chapter 9), which this sim makes directly visible on a log-scale bar
// comparison.
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, tempSlider, ndExpSlider, naExpSlider, fieldSlider, presetSelect;
const Q = 1.602e-19; // C

const PRESETS = {
  'Custom': null,
  'Intrinsic (ND=NA=0)': { nd: 0, na: 0 },
  'n-type (ND ≫ NA)': { nd: 17, na: 0 },
  'p-type (NA ≫ ND)': { nd: 0, na: 17 }
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

  tempSlider = createSlider(150, 500, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');
  tempSlider.input(function () { redraw(); });

  ndExpSlider = createSlider(0, 19, 16, 0.05);
  ndExpSlider.attribute('aria-label', 'Donor concentration exponent');
  ndExpSlider.input(function () { presetSelect.selected('Custom'); redraw(); });

  naExpSlider = createSlider(0, 19, 0, 0.05);
  naExpSlider.attribute('aria-label', 'Acceptor concentration exponent');
  naExpSlider.input(function () { presetSelect.selected('Custom'); redraw(); });

  fieldSlider = createSlider(1, 4, 2.5, 0.05);
  fieldSlider.attribute('aria-label', 'Applied electric field exponent, power of 10 volts per cm');
  fieldSlider.input(function () { redraw(); });

  presetSelect = createSelect();
  Object.keys(PRESETS).forEach(k => presetSelect.option(k));
  presetSelect.selected('n-type (ND ≫ NA)');
  presetSelect.attribute('aria-label', 'Doping preset');
  presetSelect.changed(function () {
    const p = PRESETS[presetSelect.value()];
    if (p) { ndExpSlider.value(p.nd); naExpSlider.value(p.na); }
    redraw();
  });
  ndExpSlider.value(17);

  positionUIElements();
  noLoop();
  describe('Drift current density explorer: computes electron and hole drift current density in amperes per square centimeter from doping, temperature, mobility, and applied field, comparing the majority and minority carrier contributions', LABEL);
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
  fieldSlider.position(bx + lbl, by + drawHeight + 202); fieldSlider.size(sw);
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
  const E = Math.pow(10, fieldSlider.value());

  const eCarrier = SML_MOBILITY_CARRIERS['Electrons (n-type)'];
  const hCarrier = SML_MOBILITY_CARRIERS['Holes (p-type)'];
  const muN = smlMobility(eCarrier, T, max(ND, 1e13));
  const muP = smlMobility(hCarrier, T, max(NA, 1e13));

  const Jn = Q * n0 * muN * E;
  const Jp = Q * p0 * muP * E;
  const Jtotal = Jn + Jp;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 12.5 : 15);
  text('J = q(n₀μ_n + p₀μ_p)E', canvasWidth / 2, 8);
  textAlign(CENTER, TOP); textSize(11); fill(80);
  text(materialSelect.value() + ', ' + T + ' K, E = ' + smlFormatConc(E, { noUnit: true }) + ' V/cm', canvasWidth / 2, 28);

  const leftW = compact() ? canvasWidth : Math.round(canvasWidth * 0.44);
  drawBarChart(n0, p0, muN, muP, Jn, Jp, leftW);
  drawInfoPanel(compact() ? 0 : leftW, compact() ? drawHeight * 0.5 : 0, compact() ? canvasWidth : canvasWidth - leftW, compact() ? drawHeight * 0.5 : drawHeight,
    n0, p0, muN, muP, Jn, Jp, Jtotal, E);

  const rows = { preset: 12, mat: 50, temp: 88, nd: 126, na: 164, field: 202 };
  fill(30); noStroke(); textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 13);
  text('Preset:', 10, drawHeight + rows.preset + 11);
  text('Material:', 10, drawHeight + rows.mat + 11);
  text('Temperature:', 10, drawHeight + rows.temp + 11);
  text('N_D:', 10, drawHeight + rows.nd + 11);
  text('N_A:', 10, drawHeight + rows.na + 11);
  text('Field E:', 10, drawHeight + rows.field + 11);
  textAlign(RIGHT, CENTER);
  text(smlFormatPow10(ndExpSlider.value()), canvasWidth - 10, drawHeight + rows.nd + 11);
  text(smlFormatPow10(naExpSlider.value()), canvasWidth - 10, drawHeight + rows.na + 11);
  text(smlFormatPow10(fieldSlider.value(), { noUnit: true }) + ' V/cm', canvasWidth - 10, drawHeight + rows.field + 11);
}

function drawBarChart(n0, p0, muN, muP, Jn, Jp, panelW) {
  const chartX = compact() ? 55 : 70, chartY = 54, chartW = panelW - chartX - 20;
  const chartBottom = compact() ? drawHeight * 0.5 - 30 : drawHeight - 60;
  const chartH = chartBottom - chartY;
  // smlDrawBarChart maps its values over a fixed [0, yMax] range with no
  // negative support, but log10(J) is very often negative (J can be many
  // orders of magnitude below 1 A/cm^2) -- shift by a fixed floor so
  // every plausible J maps to a non-negative bar height, and un-shift
  // in valueFormat so the printed label still shows the real exponent.
  const FLOOR_EXP = -16, SHIFT_MAX = 20;
  function shifted(J) { return constrain(Math.log10(max(J, Math.pow(10, FLOOR_EXP))) - FLOOR_EXP, 0, SHIFT_MAX); }
  const series = [
    { label: 'J_n (electrons)', value: shifted(Jn), color: color(90, 62, 237) },
    { label: 'J_p (holes)', value: shifted(Jp), color: color(200, 90, 40) }
  ];
  smlDrawBarChart(chartX, chartY, chartW, chartH, series, SHIFT_MAX, {
    valueFormat: function (v) { return (v + FLOOR_EXP).toFixed(1); }
  });
  fill(30); noStroke(); textAlign(CENTER, TOP); textSize(compact() ? 10 : 11.5);
  text('log₁₀ current density (A/cm²)', chartX + chartW / 2, chartY - 16);
}

function drawInfoPanel(panelX, panelY, panelW, panelH, n0, p0, muN, muP, Jn, Jp, Jtotal, E) {
  // Non-compact layout shares the top row with the page title AND its
  // subtitle (drawn separately at y=8 and y=28), so cardY must clear
  // both -- matching the bar chart's own chartY=54 below.
  const cardX = panelX + 16, cardY = panelY + (compact() ? 16 : 54), cardW = panelW - 32;
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 10.5 : 12.5);
  const lines = [
    'n₀ = ' + smlFormatConc(n0) + '   μ_n = ' + muN.toFixed(0) + ' cm²/V·s',
    'p₀ = ' + smlFormatConc(p0) + '   μ_p = ' + muP.toFixed(0) + ' cm²/V·s',
    'J_n = qn₀μ_nE = ' + Jn.toExponential(2) + ' A/cm²',
    'J_p = qp₀μ_pE = ' + Jp.toExponential(2) + ' A/cm²',
    'J_total = J_n + J_p = ' + Jtotal.toExponential(2) + ' A/cm²'
  ];
  let y = cardY;
  for (const l of lines) { text(l, cardX, y, cardW); y += compact() ? 18 : 20; }

  y += 6;
  const dominant = Jn >= Jp ? 'electrons (n-type)' : 'holes (p-type)';
  const ratio = Jn >= Jp ? Jn / max(Jp, 1e-30) : Jp / max(Jn, 1e-30);
  fill(46, 125, 50); textAlign(LEFT, TOP); textSize(compact() ? 10.5 : 12);
  const msg = ratio > 10
    ? 'Majority carrier (' + dominant + ') dominates J_total by a factor of ' + (ratio > 1e6 ? ratio.toExponential(1) : ratio.toFixed(0)) + '.'
    : 'Both carriers contribute comparably to J_total (near-intrinsic doping).';
  text(msg, cardX, y, cardW);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 240 : 210;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 700);
}
