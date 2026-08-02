// Direct vs. Indirect Bandgap E-k Explorer MicroSim
// Plots simplified valence- and conduction-band parabolas:
//   E_v(k) = -Bv * k^2                     (fixed valence band)
//   E_c(k) = Eg + a*(k-k0)^2,  a = A0/mass  (conduction band, adjustable)
// Material presets set Eg and k0 (0 for direct, nonzero for indirect).
// A transition arrow shows either a vertical (photon-only) jump at k=0,
// or a diagonal (photon + phonon) path reaching the true CB minimum.
// Bloom Level: Understand / Analyze (L2-L4)
// MicroSim template version 2026.02 (2D static/interactive variant)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 46;

let materialSelect, transitionSelect, massSlider;

const Bv = 2.6;   // fixed valence-band curvature (eV per unit k^2)
const A0 = 1.0;   // conduction-band curvature scale constant (eV)
const K_MAX = 1.25; // plot range in k, units of pi/a

const PRESETS = {
  'GaAs (Direct)':   { Eg: 1.42, k0: 0.00, mass: 0.067 },
  'Si (Indirect)':   { Eg: 1.12, k0: 0.85, mass: 0.26 },
  'Ge (Indirect)':   { Eg: 0.66, k0: 0.70, mass: 0.12 }
};

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  Object.keys(PRESETS).forEach(name => materialSelect.option(name));
  materialSelect.selected('GaAs (Direct)');
  materialSelect.attribute('aria-label', 'Material preset');
  materialSelect.changed(applyPreset);

  transitionSelect = createSelect();
  transitionSelect.option('Vertical (photon only)');
  transitionSelect.option('Diagonal (phonon-assisted)');
  transitionSelect.selected('Vertical (photon only)');
  transitionSelect.attribute('aria-label', 'Transition type');

  massSlider = createSlider(0.05, 1.0, PRESETS['GaAs (Direct)'].mass, 0.005);
  massSlider.attribute('aria-label', 'Conduction band effective mass');

  positionUIElements();

  describe('Direct vs indirect bandgap explorer: plots valence and conduction band parabolas on an E-k diagram, with a transition arrow showing photon-only or phonon-assisted band-to-band transitions', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function applyPreset() {
  const p = PRESETS[materialSelect.value()];
  massSlider.value(p.mass);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;

  materialSelect.position(bx + 10, by + drawHeight + 10);
  transitionSelect.position(bx + 10, by + drawHeight + 45);

  massSlider.position(bx + 10, by + drawHeight + 95);
  massSlider.size(min(canvasWidth - 20 - margin, 320));
}

function currentParams() {
  const preset = PRESETS[materialSelect.value()];
  const mass = massSlider.value();
  const a = A0 / mass;
  return { Eg: preset.Eg, k0: preset.k0, a: a, mass: mass };
}

function Ev(k) { return -Bv * k * k; }
function Ec(k, Eg, k0, a) { return Eg + a * (k - k0) * (k - k0); }

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

  const p = currentParams();
  drawEkDiagram(p);
  drawControlLabels(p);
}

function drawControlLabels(p) {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Material:', 10, drawHeight + 32);
  text('Transition:', 10, drawHeight + 67);
  text('Effective mass m*/m₀: ' + p.mass.toFixed(3), 10, drawHeight + 88);
}

function drawEkDiagram(p) {
  const EMaxTop = p.Eg + 4.5;
  const EMinBot = -4.5;

  const plotX0 = margin + 10;
  const plotX1 = canvasWidth - margin;
  const plotY0 = 44;
  const plotY1 = drawHeight - 46;

  function kToPx(k) { return map(k, -K_MAX, K_MAX, plotX0, plotX1); }
  function eToPx(E) { return map(E, EMinBot, EMaxTop, plotY1, plotY0); }

  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  text('E-k Diagram: ' + materialSelect.value(), canvasWidth / 2, 8);

  // axes
  stroke(200);
  strokeWeight(1);
  line(plotX0, plotY1, plotX1, plotY1);
  line(kToPx(0), plotY0, kToPx(0), plotY1);

  // E = 0 reference (valence band maximum energy)
  stroke(180);
  drawingContext.setLineDash([2, 3]);
  line(plotX0, eToPx(0), plotX1, eToPx(0));
  drawingContext.setLineDash([]);

  // valence band (downward parabola, vertex at k=0)
  noFill();
  stroke('#2E7D32');
  strokeWeight(2.5);
  beginShape();
  const steps = 200;
  for (let i = 0; i <= steps; i++) {
    const k = -K_MAX + (i / steps) * (2 * K_MAX);
    const E = constrain(Ev(k), EMinBot - 1, EMaxTop + 1);
    vertex(kToPx(k), eToPx(E));
  }
  endShape();

  // conduction band (upward parabola, vertex at k=k0)
  stroke('#5A3EED');
  strokeWeight(2.5);
  beginShape();
  for (let i = 0; i <= steps; i++) {
    const k = -K_MAX + (i / steps) * (2 * K_MAX);
    const E = constrain(Ec(k, p.Eg, p.k0, p.a), EMinBot - 1, EMaxTop + 1);
    vertex(kToPx(k), eToPx(E));
  }
  endShape();

  // mark valence band maximum and conduction band minimum
  noStroke();
  fill('#2E7D32');
  circle(kToPx(0), eToPx(0), 7);
  fill('#5A3EED');
  circle(kToPx(p.k0), eToPx(p.Eg), 7);

  // transition arrow
  drawTransitionArrow(p, kToPx, eToPx);

  // labels
  fill(20);
  textAlign(CENTER, TOP);
  textSize(12);
  text('k (units of π/a)', canvasWidth / 2, plotY1 + 6);

  push();
  translate(plotX0 - 32, (plotY0 + plotY1) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Energy (eV)', 0, 0);
  pop();

  fill(90);
  textAlign(LEFT, CENTER);
  textSize(11);
  text('VB max', kToPx(0) + 8, eToPx(0) + 12);
  text('CB min (k₀ = ' + p.k0.toFixed(2) + ')', kToPx(p.k0) + 8, eToPx(p.Eg) - 10);

  drawInfoBox(p);
}

function drawTransitionArrow(p, kToPx, eToPx) {
  const mode = transitionSelect.value();
  stroke('#B8860B');
  strokeWeight(2.5);
  fill('#B8860B');

  if (mode === 'Vertical (photon only)') {
    const Etop = Ec(0, p.Eg, p.k0, p.a);
    drawArrowSegment(kToPx(0), eToPx(0), kToPx(0), eToPx(Etop));
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(11);
    text('photon, ΔE = ' + Etop.toFixed(2) + ' eV', kToPx(0) + 8, eToPx((0 + Etop) / 2));
  } else {
    // vertical segment (photon, energy Eg) then horizontal segment (phonon, momentum k0)
    drawArrowSegment(kToPx(0), eToPx(0), kToPx(0), eToPx(p.Eg));
    drawArrowSegment(kToPx(0), eToPx(p.Eg), kToPx(p.k0), eToPx(p.Eg));
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(11);
    text('photon, ΔE = ' + p.Eg.toFixed(2) + ' eV', kToPx(0) + 8, eToPx(p.Eg / 2));
    if (Math.abs(p.k0) > 0.02) {
      textAlign(CENTER, BOTTOM);
      text('phonon, Δk = ' + p.k0.toFixed(2), (kToPx(0) + kToPx(p.k0)) / 2, eToPx(p.Eg) - 6);
    }
  }
}

function drawArrowSegment(x0, y0, x1, y1) {
  line(x0, y0, x1, y1);
  const angle = atan2(y1 - y0, x1 - x0);
  const headLen = 8;
  push();
  translate(x1, y1);
  rotate(angle);
  triangle(0, 0, -headLen, headLen / 2, -headLen, -headLen / 2);
  pop();
}

function drawInfoBox(p) {
  const lines = [
    'k₀ = 0: direct gap (photon-only reaches CB minimum).',
    'k₀ ≠ 0: indirect gap (needs a phonon to reach CB minimum).',
    'Effective mass sets curvature: smaller m* = sharper parabola.'
  ];
  const boxW = min(500, canvasWidth - 2 * margin);
  const boxX = canvasWidth / 2 - boxW / 2;
  const boxY = drawHeight - 10 - lines.length * 15 - 10;
  noStroke();
  fill(255, 247, 221, 235);
  stroke(240, 216, 122);
  strokeWeight(1);
  rect(boxX, boxY, boxW, lines.length * 15 + 14, 8);
  noStroke();
  fill('#7a5c00');
  textAlign(LEFT, TOP);
  textSize(11);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], boxX + 12, boxY + 8 + i * 15);
  }
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
