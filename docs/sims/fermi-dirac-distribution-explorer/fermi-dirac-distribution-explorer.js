// Fermi-Dirac Distribution Explorer MicroSim
// Plots f(E) = 1 / (1 + exp((E-EF)/(kB*T))) vs. absolute energy E (eV).
// Students move EF and T independently and watch the S-curve translate
// (EF slider) and change steepness (T slider), always crossing f=0.5
// exactly at E=EF. A faint T->0 step-function overlay shows the limiting
// case for comparison.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02 (2D static/interactive variant)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 440;
let minDrawHeight = 440;
let controlHeight = 195;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 54;

let efSlider, tempPresetSelect, tSlider;

const KB = 8.617333e-5; // eV/K
const E_MIN = 0, E_MAX = 2.0;
const EF_MIN = 0.2, EF_MAX = 1.8;
const T_MIN = 1, T_MAX = 800;

const TEMP_PRESETS = { '0 K (approx.)': 1, '77 K (liquid N₂)': 77, '300 K (room temp.)': 300, '600 K': 600 };

const CURVE_COLOR = '#5A3EED';
const STEP_COLOR = '#B0B0B0';

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  efSlider = createSlider(EF_MIN, EF_MAX, 1.0, 0.01);
  efSlider.attribute('aria-label', 'Fermi level EF in eV');

  tempPresetSelect = createSelect();
  Object.keys(TEMP_PRESETS).forEach(name => tempPresetSelect.option(name));
  tempPresetSelect.selected('300 K (room temp.)');
  tempPresetSelect.attribute('aria-label', 'Temperature preset');
  tempPresetSelect.changed(function () {
    tSlider.value(TEMP_PRESETS[tempPresetSelect.value()]);
  });

  tSlider = createSlider(T_MIN, T_MAX, 300, 1);
  tSlider.attribute('aria-label', 'Temperature T in kelvin');

  positionUIElements();

  describe('Fermi-Dirac distribution explorer: plots occupation probability f(E) versus energy E, with adjustable Fermi level EF and temperature T, always crossing f=0.5 at E=EF', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function controlX() {
  return canvasWidth < 480 ? 130 : 190;
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;
  const cx = controlX();

  efSlider.position(bx + cx, by + drawHeight + 12);
  efSlider.size(min(canvasWidth - cx - margin - 10, 300));

  tempPresetSelect.position(bx + cx, by + drawHeight + 50);

  tSlider.position(bx + cx, by + drawHeight + 92);
  tSlider.size(min(canvasWidth - cx - margin - 10, 300));
}

function fermi(E, EF, kT) {
  return 1 / (1 + Math.exp((E - EF) / kT));
}

function compact() { return canvasWidth < 480; }

// ---------- draw ----------
function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225);
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  const EF = efSlider.value();
  const T = tSlider.value();
  const kT = max(KB * T, 1e-6);

  drawPlot(EF, kT, T);
  drawControlLabels(EF, kT, T);
}

function drawControlLabels(EF, kT, T) {
  fill('black');
  noStroke();
  const cx = controlX();
  textSize(compact() ? 11.5 : 13);

  textAlign(RIGHT, CENTER);
  text('EF: ' + EF.toFixed(2) + ' eV', cx - 10, drawHeight + 24);
  text('Temp. preset:', cx - 10, drawHeight + 62);
  text('T: ' + T.toFixed(0) + ' K', cx - 10, drawHeight + 102);

  // legend
  const legendY = drawHeight + 138;
  textAlign(LEFT, CENTER);
  textSize(compact() ? 10.5 : 12);
  let lx = 12;
  stroke(CURVE_COLOR); strokeWeight(3); line(lx, legendY, lx + 18, legendY);
  noStroke(); fill(20); text('f(E) at current T', lx + 24, legendY);
  lx += (compact() ? 130 : 155);
  stroke(STEP_COLOR); strokeWeight(2);
  drawingContext.setLineDash([3, 3]);
  line(lx, legendY, lx + 18, legendY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90); text('T → 0 step limit', lx + 24, legendY);

  const readY = legendY + (compact() ? 22 : 24);
  fill('#333'); noStroke();
  textAlign(LEFT, CENTER);
  textSize(compact() ? 10.5 : 12);
  text('kBT = ' + kT.toFixed(4) + ' eV   |   f(EF) = 0.500 exactly', 12, readY);
}

function drawPlot(EF, kT, T) {
  const plotX0 = margin + 8;
  const plotX1 = canvasWidth - margin;
  const plotY0 = 46;
  const plotY1 = drawHeight - 48;

  function eToPx(E) { return map(E, E_MIN, E_MAX, plotX0, plotX1); }
  function fToPx(f) { return map(f, 0, 1, plotY1, plotY0); }

  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(compact() ? 13 : 16);
  text('Fermi-Dirac Occupation Probability f(E)', canvasWidth / 2, 8);

  // axes
  stroke(200); strokeWeight(1);
  line(plotX0, plotY1, plotX1, plotY1);
  line(plotX0, plotY0, plotX0, plotY1);

  // y ticks at 0, 0.5, 1
  textAlign(RIGHT, CENTER);
  fill(90); textSize(10);
  [0, 0.5, 1].forEach(function (fv) {
    const y = fToPx(fv);
    stroke(200); strokeWeight(1);
    line(plotX0 - 4, y, plotX0, y);
    noStroke();
    text(fv.toFixed(1), plotX0 - 7, y);
  });

  // horizontal guide at f = 0.5
  stroke(190); strokeWeight(1);
  drawingContext.setLineDash([2, 3]);
  line(plotX0, fToPx(0.5), plotX1, fToPx(0.5));
  drawingContext.setLineDash([]);

  // x ticks
  textAlign(CENTER, TOP);
  fill(90); textSize(10);
  for (let e = 0; e <= E_MAX + 0.001; e += 0.5) {
    const x = eToPx(e);
    stroke(200); strokeWeight(1);
    line(x, plotY1, x, plotY1 + 4);
    noStroke();
    text(e.toFixed(1), x, plotY1 + 6);
  }

  // T -> 0 step-function reference (faint gray)
  stroke(STEP_COLOR); strokeWeight(2);
  drawingContext.setLineDash([3, 3]);
  noFill();
  beginShape();
  vertex(eToPx(E_MIN), fToPx(1));
  vertex(eToPx(EF), fToPx(1));
  vertex(eToPx(EF), fToPx(0));
  vertex(eToPx(E_MAX), fToPx(0));
  endShape();
  drawingContext.setLineDash([]);

  // f(E) curve at current T
  stroke(CURVE_COLOR);
  strokeWeight(2.75);
  noFill();
  beginShape();
  const steps = 220;
  for (let i = 0; i <= steps; i++) {
    const E = E_MIN + (i / steps) * (E_MAX - E_MIN);
    const f = fermi(E, EF, kT);
    vertex(eToPx(E), fToPx(f));
  }
  endShape();

  // EF marker: vertical dashed line down to axis, dot at (EF, 0.5)
  stroke(200, 30, 30); strokeWeight(1.5);
  drawingContext.setLineDash([4, 3]);
  line(eToPx(EF), fToPx(0), eToPx(EF), fToPx(1));
  drawingContext.setLineDash([]);

  noStroke();
  fill(200, 30, 30);
  circle(eToPx(EF), fToPx(0.5), 8);
  textAlign(eToPx(EF) < (plotX0 + plotX1) / 2 ? LEFT : RIGHT, BOTTOM);
  textSize(compact() ? 11 : 12);
  text('f(EF) = 0.5', eToPx(EF) + (eToPx(EF) < (plotX0 + plotX1) / 2 ? 10 : -10), fToPx(0.5) - 8);

  fill(60);
  textAlign(CENTER, TOP);
  textSize(compact() ? 10.5 : 11);
  text('EF = ' + EF.toFixed(2) + ' eV', eToPx(EF), plotY1 + 20);

  // axis titles
  fill(20);
  textAlign(CENTER, TOP);
  textSize(12);
  text('Energy E (eV)', canvasWidth / 2, plotY1 + 34);

  push();
  translate(plotX0 - 38, (plotY0 + plotY1) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Occupation probability f(E)', 0, 0);
  pop();
}

// ---------- responsive sizing ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
}

function updateCanvasSize() {
  var mainEl = document.querySelector('main');
  containerWidth = Math.floor(mainEl.getBoundingClientRect().width);
  canvasWidth = containerWidth;
  controlHeight = compact() ? 225 : 195;

  var availableHeight = window.innerHeight;
  var children = mainEl.children;
  for (var i = 0; i < children.length; i++) {
    if (children[i].tagName !== 'CANVAS') {
      availableHeight -= children[i].offsetHeight;
    }
  }
  drawHeight = Math.max(minDrawHeight, availableHeight - controlHeight);
  canvasHeight = drawHeight + controlHeight;
  containerHeight = canvasHeight;
}
