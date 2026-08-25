// Mobility vs. Temperature and Doping (Matthiessen's Rule) Explorer
// MicroSim
// Plots lattice-limited mobility (~T^-1.5), impurity-limited mobility
// (~T^1.5/N), and their Matthiessen's-rule combination, for an
// adjustable carrier type, doping concentration, and temperature
// marker. A comparison mode overlays electrons and holes together.
// Calibration constants (shared with the other Chapter 11 MicroSims via
// semiconductor-materials-lib.js) are illustrative, chosen to roughly
// match real silicon mobility at 300 K.
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Analyze (L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let carrierSelect, ndExpSlider, tempSlider, compareCheckbox;
const TEMP_PRESETS = [77, 300, 500];

function compact() { return canvasWidth < 480; }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  carrierSelect = createSelect();
  Object.keys(SML_MOBILITY_CARRIERS).forEach(k => carrierSelect.option(k));
  carrierSelect.selected('Electrons (n-type)');
  carrierSelect.attribute('aria-label', 'Carrier type');
  carrierSelect.changed(function () { redraw(); });

  ndExpSlider = createSlider(14, 19, 16, 0.1);
  ndExpSlider.attribute('aria-label', 'Doping concentration exponent');
  ndExpSlider.input(function () { redraw(); });

  tempSlider = createSlider(77, 600, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature marker in kelvin');
  tempSlider.input(function () { redraw(); });

  compareCheckbox = createCheckbox(' Compare electrons vs. holes', false);
  compareCheckbox.attribute('aria-label', 'Compare electrons and holes together');
  compareCheckbox.changed(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Mobility versus temperature and doping explorer: plots lattice-limited, impurity-limited, and Matthiessen-rule combined mobility curves for an adjustable carrier type, doping level, and temperature marker, with an option to compare electrons and holes together', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

// Row layout, compact-aware: presets share the temperature row on wide
// screens (to its right) but get their own row on narrow screens, where
// they would otherwise overlap the slider track.
function rowY() {
  if (compact()) return { carrier: 12, compare: 50, nd: 88, presets: 126, temp: 164 };
  return { carrier: 12, compare: 50, nd: 88, presets: 126, temp: 126 };
}

function presetButtons() {
  const bw = 52, bh = 22, gap = 6;
  const rows = rowY();
  if (compact()) {
    return TEMP_PRESETS.map((t, i) => ({ t: t, x: 10 + i * (bw + gap), y: drawHeight + rows.presets, w: bw, h: bh }));
  }
  const startX = canvasWidth - (bw + gap) * TEMP_PRESETS.length - 14;
  return TEMP_PRESETS.map((t, i) => ({ t: t, x: startX + i * (bw + gap), y: drawHeight + rows.presets, w: bw, h: bh }));
}

function mousePressed() {
  for (const b of presetButtons()) {
    if (smlPointInRect(mouseX, mouseY, b.x, b.y, b.w, b.h)) {
      tempSlider.value(b.t);
      redraw();
      return false;
    }
  }
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 95 : 150;
  const rows = rowY();
  const sw = min(canvasWidth - lbl - 30, 300);
  const tempSw = compact() ? sw : min(canvasWidth - lbl - 220, 300);
  carrierSelect.position(bx + lbl, by + drawHeight + rows.carrier);
  compareCheckbox.position(bx + lbl, by + drawHeight + rows.compare);
  ndExpSlider.position(bx + lbl, by + drawHeight + rows.nd); ndExpSlider.size(sw);
  tempSlider.position(bx + lbl, by + drawHeight + rows.temp); tempSlider.size(tempSw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1); line(0, drawHeight, canvasWidth, drawHeight);

  const compareMode = compareCheckbox.checked();
  const N = Math.pow(10, ndExpSlider.value());
  const Tmark = tempSlider.value();

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13 : 16);
  text('Matthiessen\'s Rule: 1/μ_total = 1/μ_L + 1/μ_I', canvasWidth / 2, 8);

  const chartX = compact() ? 55 : 70, chartY = 44, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 130;
  // LOGMAX must cover the worst case over the full slider ranges: at the
  // lightest doping (N=1e14) and lowest temperature (77 K), impurity-
  // limited mobility (mu_I ~ T^1.5/N) grows very large -- log10 of it can
  // exceed 5. Points are also explicitly clamped below as a second,
  // independent safety net against any future slider-range change.
  const TMIN = 77, TMAX = 600, LOGMIN = 0, LOGMAX = 6.0;

  const carriersToShow = compareMode ? Object.keys(SML_MOBILITY_CARRIERS) : [carrierSelect.value()];
  const series = [];
  const legendEntries = [];
  for (const name of carriersToShow) {
    const carrier = SML_MOBILITY_CARRIERS[name];
    const dash = name.indexOf('Hole') >= 0 && compareMode;
    const ptsL = [], ptsI = [], ptsT = [];
    for (let T = TMIN; T <= TMAX; T += 5) {
      const muL = smlMuLattice(carrier.muL0, T);
      const muI = smlMuImpurity(carrier.muI0, T, N);
      ptsL.push({ x: T, y: constrain(Math.log10(muL), LOGMIN, LOGMAX) });
      ptsI.push({ x: T, y: constrain(Math.log10(muI), LOGMIN, LOGMAX) });
      ptsT.push({ x: T, y: constrain(Math.log10(smlMuTotal(muL, muI)), LOGMIN, LOGMAX) });
    }
    series.push({ points: ptsL, color: color(90, 180, 120) });
    series.push({ points: ptsI, color: color(230, 140, 60) });
    series.push({ points: ptsT, color: color(...carrier.color) });
    legendEntries.push({ label: (compareMode ? carrier.symbol + '-total μ' : 'Total μ (Matthiessen)'), color: carrier.color });
  }

  const primaryCarrier = SML_MOBILITY_CARRIERS[carrierSelect.value()];
  const muLm = smlMuLattice(primaryCarrier.muL0, Tmark);
  const muIm = smlMuImpurity(primaryCarrier.muI0, Tmark, N);
  const muTm = smlMuTotal(muLm, muIm);

  smlDrawLineChart(chartX, chartY, chartW, chartH, TMIN, TMAX, LOGMIN, LOGMAX, series, {
    marker: { x: Tmark, y: Math.log10(muTm) },
    xLabel: 'Temperature (K)', yLabel: 'log₁₀ μ (cm²/V·s)', yLabelOffset: 34
  });

  const legendH = compareMode ? 64 : 49;
  noStroke(); fill(255, 255, 255, 220); rect(chartX + 4, chartY - 2, compact() ? 145 : 165, legendH, 6);

  fill(90, 180, 120); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11);
  text('■ Lattice-limited μ_L', chartX + 10, chartY + 4);
  fill(230, 140, 60);
  text('■ Impurity-limited μ_I', chartX + 10, chartY + 19);
  if (compareMode) {
    fill(...SML_MOBILITY_CARRIERS['Electrons (n-type)'].color);
    text('■ Total μ — electrons', chartX + 10, chartY + 34);
    fill(...SML_MOBILITY_CARRIERS['Holes (p-type)'].color);
    text('■ Total μ — holes', chartX + 10, chartY + 49);
  } else {
    fill(...primaryCarrier.color);
    text('■ Total μ (Matthiessen)', chartX + 10, chartY + 34);
  }

  for (const b of presetButtons()) smlDrawButton(b.x, b.y, b.w, b.h, b.t + 'K', Tmark === b.t);

  const rows = rowY();
  fill(30); noStroke();
  textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 13);
  text('Carrier:', 10, drawHeight + rows.carrier + 11);
  text('N = ' + smlFormatPow10(ndExpSlider.value()), 10, drawHeight + rows.nd + 11);
  text('T marker = ' + Tmark + ' K  →  μ_total = ' + muTm.toFixed(0) + ' cm²/V·s', 10, drawHeight + rows.temp + (compact() ? 34 : 11), canvasWidth - 20);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 235 : 165;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 560);
}
