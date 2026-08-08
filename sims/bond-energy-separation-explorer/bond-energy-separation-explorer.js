// Bond Energy vs. Atomic Separation Explorer MicroSim
// Plots the total bonding potential energy U(r) as the sum of a short-range
// repulsive term and a longer-range attractive term:
//   U(r) = E0 * [ (r0/r)^12 - 2*(r0/r)^6 ]
// This form is constructed so the curve has its minimum at exactly r = r0
// with depth U(r0) = -E0, giving students two directly-meaningful sliders
// (equilibrium separation r0, bond energy E0) instead of abstract exponents.
// A third slider moves a marker along the curve and a small two-atom
// diagram shows whether the pair is currently under net attraction,
// net repulsion, or at equilibrium.
// Bloom Level: Understand / Analyze (L2-L4)
// MicroSim template version 2026.02 (2D static/interactive variant)

let containerWidth;
let drawHeight = 430;
let graphHeight = 300;

let r0Slider, e0Slider, rSlider;
let readoutDiv;

// Fixed viewing window so the curve's position/shape changes with the
// sliders but the axes themselves stay put -- easier to compare presets.
const R_AXIS_MIN = 0.08, R_AXIS_MAX = 0.62; // nm
const U_AXIS_MIN = -8.5, U_AXIS_MAX = 8; // eV (repulsive wall is clipped)

const margin = { left: 56, right: 20, top: 16, bottom: 34 };

function potentialU(r, r0, E0) {
  const x = r0 / r;
  const x6 = Math.pow(x, 6);
  return E0 * (x6 * x6 - 2 * x6);
}
function attractiveTerm(r, r0, E0) {
  const x6 = Math.pow(r0 / r, 6);
  return -2 * E0 * x6;
}
function repulsiveTerm(r, r0, E0) {
  const x6 = Math.pow(r0 / r, 6);
  return E0 * x6 * x6;
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, drawHeight);
  canvas.parent(mainElement);

  const sliderPanel = createDiv('');
  sliderPanel.class('control-panel');
  sliderPanel.parent(mainElement);

  r0Slider = makeSlider(sliderPanel, 'Equilibrium separation r0', 0.20, 0.40, 0.235, 0.005, 'nm');
  e0Slider = makeSlider(sliderPanel, 'Bond energy E0', 1.0, 8.0, 3.4, 0.1, 'eV');

  const rPanel = createDiv('');
  rPanel.class('control-panel');
  rPanel.parent(mainElement);

  rSlider = makeSlider(rPanel, 'Current separation r', R_AXIS_MIN, R_AXIS_MAX, 0.30, 0.005, 'nm');

  const snapBtn = createButton('Snap r to r0 (equilibrium)');
  snapBtn.class('preset-btn');
  snapBtn.parent(rPanel);
  snapBtn.mousePressed(() => { rSlider.value(r0Slider.value()); updateReadout(); });

  const presetRow = createDiv('');
  presetRow.class('control-panel');
  presetRow.parent(mainElement);

  const presetLabel = createSpan('Presets:');
  presetLabel.class('ctrl-label');
  presetLabel.parent(presetRow);

  addPresetButton(presetRow, 'Covalent Si–Si', 0.235, 3.4);
  addPresetButton(presetRow, 'Ionic Na–Cl', 0.28, 5.1);

  readoutDiv = createDiv('');
  readoutDiv.class('readout-panel');
  readoutDiv.parent(mainElement);

  updateReadout();

  describe('A graph of bonding potential energy versus atomic separation, decomposed into attractive and repulsive components, with adjustable equilibrium separation and bond energy, plus a draggable marker showing the current separation on a two-atom diagram', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function makeSlider(parent, name, lo, hi, val, step, unit) {
  const wrap = createDiv('');
  wrap.class('slider-field');
  wrap.parent(parent);

  const label = createSpan(name + ':');
  label.class('ctrl-label');
  label.parent(wrap);

  const slider = createSlider(lo, hi, val, step);
  slider.class('index-slider');
  slider.parent(wrap);
  slider.input(updateReadout);
  slider.attribute('aria-label', name);

  const valueSpan = createSpan(' ' + val.toFixed(3) + ' ' + unit);
  valueSpan.class('slider-value');
  valueSpan.parent(wrap);
  slider.valueSpan = valueSpan;
  slider.unit = unit;

  return slider;
}

function addPresetButton(parent, label, r0, E0) {
  const btn = createButton(label);
  btn.class('preset-btn');
  btn.parent(parent);
  btn.mousePressed(() => {
    r0Slider.value(r0);
    e0Slider.value(E0);
    rSlider.value(r0 * 1.25);
    updateReadout();
  });
}

function updateReadout() {
  const r0 = r0Slider.value();
  const E0 = e0Slider.value();
  const r = rSlider.value();

  r0Slider.valueSpan.html(' ' + r0.toFixed(3) + ' nm');
  e0Slider.valueSpan.html(' ' + E0.toFixed(2) + ' eV');
  rSlider.valueSpan.html(' ' + r.toFixed(3) + ' nm');

  const U = potentialU(r, r0, E0);
  const deltaFrac = (r - r0) / r0;

  let stateLabel, stateColor, stateExplain;
  if (Math.abs(deltaFrac) < 0.01) {
    stateLabel = 'Equilibrium — net force ≈ 0';
    stateColor = '#2E7D32';
    stateExplain = 'The atoms sit at the bottom of the energy well; attraction and repulsion exactly balance.';
  } else if (r > r0) {
    stateLabel = 'Net attractive force (pulls atoms together)';
    stateColor = '#2E5FE7';
    stateExplain = 'Separated farther than r0, so the longer-range attractive term dominates and pulls the atoms back toward r0.';
  } else {
    stateLabel = 'Net repulsive force (pushes atoms apart)';
    stateColor = '#C0392B';
    stateExplain = 'Pushed closer than r0, so overlapping electron clouds create a strong short-range repulsion that pushes the atoms back toward r0.';
  }

  let html = '<div class="readout-row"><strong>U(r) = ' + U.toFixed(2) + ' eV</strong> at r = ' + r.toFixed(3) + ' nm</div>';
  html += '<div class="readout-row" style="color:' + stateColor + '; font-weight:700;">' + stateLabel + '</div>';
  html += '<div class="readout-row">' + stateExplain + '</div>';
  html += '<div class="readout-row legend"><span class="swatch" style="background:#5A3EED"></span> Total U(r) &nbsp; ' +
          '<span class="swatch" style="background:#2E5FE7"></span> Attractive term &nbsp; ' +
          '<span class="swatch" style="background:#C0392B"></span> Repulsive term</div>';
  readoutDiv.html(html);
}

// ---------- graph coordinate mapping ----------
function graphX0() { return margin.left; }
function graphX1() { return containerWidth - margin.right; }
function graphY0() { return margin.top; }
function graphY1() { return graphHeight - margin.bottom; }

function rToPx(r) {
  return map(r, R_AXIS_MIN, R_AXIS_MAX, graphX0(), graphX1());
}
function uToPy(u) {
  return map(constrain(u, U_AXIS_MIN, U_AXIS_MAX), U_AXIS_MIN, U_AXIS_MAX, graphY1(), graphY0());
}

function draw() {
  background(255);

  const r0 = r0Slider.value();
  const E0 = e0Slider.value();
  const r = rSlider.value();

  drawGraphFrame();
  drawCurve((rr) => attractiveTerm(rr, r0, E0), '#2E5FE7', true);
  drawCurve((rr) => repulsiveTerm(rr, r0, E0), '#C0392B', true);
  drawCurve((rr) => potentialU(rr, r0, E0), '#5A3EED', false);
  drawEquilibriumGuides(r0, E0);
  drawCurrentMarker(r, potentialU(r, r0, E0));

  drawAtomPairStrip(r0, r);
}

function drawGraphFrame() {
  const x0 = graphX0(), x1 = graphX1(), y0 = graphY0(), y1 = graphY1();

  noStroke();
  fill('aliceblue');
  rect(x0, y0, x1 - x0, y1 - y0);

  // zero-energy axis
  stroke(160);
  strokeWeight(1);
  const zy = uToPy(0);
  line(x0, zy, x1, zy);

  stroke(120);
  noFill();
  rect(x0, y0, x1 - x0, y1 - y0);

  // axis ticks/labels
  const smallText = containerWidth < 500;
  fill(90);
  noStroke();
  textSize(smallText ? 9 : 10);
  textAlign(CENTER, TOP);
  for (let rr = 0.1; rr <= R_AXIS_MAX + 1e-9; rr += 0.1) {
    const px = rToPx(rr);
    if (px < x0 - 1 || px > x1 + 1) continue;
    stroke(200);
    line(px, y0, px, y1);
    noStroke();
    text(rr.toFixed(1), px, y1 + 4);
  }
  textAlign(RIGHT, CENTER);
  for (let uu = -8; uu <= U_AXIS_MAX; uu += 2) {
    const py = uToPy(uu);
    stroke(200);
    line(x0, py, x1, py);
    noStroke();
    text(uu, x0 - 6, py);
  }

  textAlign(CENTER, TOP);
  noStroke();
  fill(60);
  textSize(smallText ? 10 : 12);
  text('Separation r (nm)', (x0 + x1) / 2, y1 + (smallText ? 16 : 18));

  push();
  translate(smallText ? 12 : 14, (y0 + y1) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Potential energy U (eV)', 0, 0);
  pop();
}

function drawCurve(fn, col, dashed) {
  const x0 = graphX0(), x1 = graphX1();
  stroke(col);
  strokeWeight(dashed ? 1.6 : 2.6);
  noFill();
  if (dashed) drawingContext.setLineDash([5, 4]);
  beginShape();
  for (let px = x0; px <= x1; px += 2) {
    const r = map(px, x0, x1, R_AXIS_MIN, R_AXIS_MAX);
    const u = fn(r);
    vertex(px, uToPy(u));
  }
  endShape();
  if (dashed) drawingContext.setLineDash([]);
}

function drawEquilibriumGuides(r0, E0) {
  const px = rToPx(r0);
  const py = uToPy(-E0);
  const x0 = graphX0(), x1 = graphX1(), y0 = graphY0(), y1 = graphY1();

  stroke(180);
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  if (px >= x0 && px <= x1) line(px, y0, px, y1);
  line(x0, py, x1, py);
  drawingContext.setLineDash([]);

  noStroke();
  fill('#5A3EED');
  circle(px, py, 7);

  const smallText = containerWidth < 500;
  textSize(smallText ? 9 : 10);
  fill('#5A3EED');
  textAlign(CENTER, BOTTOM);
  text('r0 = ' + r0.toFixed(3) + ' nm', constrain(px, x0 + 30, x1 - 30), y0 + 12);
  textAlign(LEFT, BOTTOM);
  text('-E0 = ' + (-E0).toFixed(2) + ' eV', x0 + 6, py - 4);
}

function drawCurrentMarker(r, u) {
  const px = rToPx(r);
  const py = uToPy(u);
  const y1 = graphY1();

  if (px < graphX0() || px > graphX1()) return;

  stroke(40);
  strokeWeight(1.2);
  drawingContext.setLineDash([2, 3]);
  line(px, py, px, y1);
  drawingContext.setLineDash([]);

  noStroke();
  fill(40);
  circle(px, py, 9);
  fill(255);
  circle(px, py, 4);
}

// ---------- two-atom mini diagram ----------
function drawAtomPairStrip(r0, r) {
  const y0 = graphHeight;
  const y1 = drawHeight;
  const cy = (y0 + y1) / 2 + 6;

  noStroke();
  fill(250, 250, 253);
  rect(0, y0, containerWidth, y1 - y0);
  stroke(220);
  line(0, y0, containerWidth, y0);
  noStroke();

  const cx = containerWidth / 2;
  const basePxPerNm = min((containerWidth - 120) / (2 * R_AXIS_MAX), 260);
  const gapPx = constrain(r * basePxPerNm, 14, containerWidth / 2 - 30);
  const atomR = 17;

  const deltaFrac = (r - r0) / r0;
  const attractive = deltaFrac > 0.01;
  const repulsive = deltaFrac < -0.01;
  const col = attractive ? '#2E5FE7' : (repulsive ? '#C0392B' : '#2E7D32');

  // bond line
  stroke(col);
  strokeWeight(3);
  line(cx - gapPx, cy, cx + gapPx, cy);
  noStroke();

  // atoms
  fill('#5A3EED');
  circle(cx - gapPx, cy, atomR * 2);
  circle(cx + gapPx, cy, atomR * 2);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(11);
  text('A', cx - gapPx, cy);
  text('B', cx + gapPx, cy);

  // force arrows
  const arrowLen = 14 + 22 * constrain(Math.abs(deltaFrac), 0, 1);
  stroke(col);
  strokeWeight(2.5);
  if (attractive) {
    // arrows point inward, toward each atom, showing the pull toward the bond
    drawArrowHead(cx - gapPx - arrowLen - atomR, cy, cx - gapPx - atomR - 4, cy);
    drawArrowHead(cx + gapPx + arrowLen + atomR, cy, cx + gapPx + atomR + 4, cy);
  } else if (repulsive) {
    // arrows point outward, away from each atom, showing the push apart
    drawArrowHead(cx - gapPx - atomR - 4, cy, cx - gapPx - atomR - 4 - arrowLen, cy);
    drawArrowHead(cx + gapPx + atomR + 4, cy, cx + gapPx + atomR + 4 + arrowLen, cy);
  }

  noStroke();
  fill(col);
  const smallText = containerWidth < 500;
  textSize(smallText ? 11 : 12);
  textAlign(CENTER, TOP);
  const label = attractive ? 'Attraction pulls A and B together' :
                repulsive ? 'Repulsion pushes A and B apart' : 'Equilibrium — no net force';
  text(label, cx, y1 - (smallText ? 16 : 18));
}

function drawArrowHead(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
  const a = atan2(y2 - y1, x2 - x1);
  push();
  translate(x2, y2);
  rotate(a);
  line(0, 0, -8, -4);
  line(0, 0, -8, 4);
  pop();
}

// ---------- responsive sizing ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, drawHeight);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  containerWidth = Math.floor(mainEl.getBoundingClientRect().width);
  const smallText = containerWidth < 500;
  graphHeight = smallText ? 260 : 300;
  drawHeight = graphHeight + (smallText ? 110 : 120);
}
