// Direct vs. Indirect Bandgap E-k Explorer MicroSim
// Plots simplified valence- and conduction-band parabolas:
//   E_v(k) = -A0/m_h* * k^2                 (valence band, hole effective mass)
//   E_c(k) = Eg + A0/m_e* * (k-k0)^2         (conduction band, electron effective mass)
// Material presets set Eg, k0 (0 for direct, nonzero for indirect), and the
// hole effective mass; the electron effective-mass slider is adjustable so
// students can see curvature change directly (1/m* = (1/hbar^2) d^2E/dk^2).
// A transition path shows either a vertical (photon-only) jump at k=0, or a
// diagonal path (photon segment + phonon segment) reaching the true CB minimum.
// Bloom Level: Understand / Analyze (L2-L4)
// MicroSim template version 2026.02 (2D static/interactive variant)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 200;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 50;

let materialSelect, transitionSelect, massSlider;

const A0 = 1.0;    // band curvature scale constant (eV), shared by CB and VB
const K_MAX = 1.25; // plot range in k, units of pi/a

// mh: illustrative hole (valence-band) effective mass, m0 units.
// Si value matches Chapter 9's density-of-states hole mass (0.56 m0);
// Ge and GaAs use representative literature values for comparison.
const PRESETS = {
  'GaAs (Direct)': { Eg: 1.42, k0: 0.00, me: 0.067, mh: 0.45 },
  'Si (Indirect)': { Eg: 1.12, k0: 0.85, me: 0.26,  mh: 0.56 },
  'Ge (Indirect)': { Eg: 0.66, k0: 0.70, me: 0.12,  mh: 0.29 }
};

const PHOTON_COLOR = '#E67E22'; // orange
const PHONON_COLOR = '#00897B'; // teal
const CB_COLOR = '#5A3EED';     // purple
const VB_COLOR = '#2E7D32';     // green

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

  massSlider = createSlider(0.05, 1.0, PRESETS['GaAs (Direct)'].me, 0.005);
  massSlider.attribute('aria-label', 'Conduction band electron effective mass');

  positionUIElements();

  describe('Direct vs indirect bandgap explorer: plots valence and conduction band parabolas on an E-k diagram, with a transition path showing photon-only or phonon-assisted band-to-band transitions, and effective mass controls for both bands', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function applyPreset() {
  const p = PRESETS[materialSelect.value()];
  massSlider.value(p.me);
}

function controlX() {
  return canvasWidth < 480 ? 130 : 190;
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;
  const cx = controlX();

  materialSelect.position(bx + cx, by + drawHeight + 12);
  transitionSelect.position(bx + cx, by + drawHeight + 48);
  massSlider.position(bx + cx, by + drawHeight + 90);
  massSlider.size(min(canvasWidth - cx - margin - 10, 300));
}

function currentParams() {
  const preset = PRESETS[materialSelect.value()];
  const me = massSlider.value();
  const aC = A0 / me;
  const aV = A0 / preset.mh;
  return { Eg: preset.Eg, k0: preset.k0, aC: aC, aV: aV, me: me, mh: preset.mh };
}

function Ev(k, aV) { return -aV * k * k; }
function Ec(k, Eg, k0, aC) { return Eg + aC * (k - k0) * (k - k0); }

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

  const p = currentParams();
  drawEkDiagram(p);
  drawControlLabels(p);
}

function compact() { return canvasWidth < 480; }

function drawControlLabels(p) {
  fill('black');
  noStroke();
  const cx = controlX();
  textSize(compact() ? 11.5 : 13);

  textAlign(RIGHT, CENTER);
  text('Material:', cx - 10, drawHeight + 24);
  text('Transition:', cx - 10, drawHeight + 60);
  text('mₑ*/m₀: ' + p.me.toFixed(3), cx - 10, drawHeight + 100);

  // legend row
  const legendY = drawHeight + 135;
  textAlign(LEFT, CENTER);
  textSize(compact() ? 10.5 : 12);
  let lx = 12;

  stroke(CB_COLOR); strokeWeight(3); line(lx, legendY, lx + 18, legendY);
  noStroke(); fill(20); text('Conduction band', lx + 24, legendY);
  lx += (compact() ? 118 : 140);

  stroke(VB_COLOR); strokeWeight(3); line(lx, legendY, lx + 18, legendY);
  noStroke(); fill(20); text('Valence band', lx + 24, legendY);

  const legendY2 = legendY + (compact() ? 22 : 24);
  lx = 12;
  stroke(PHOTON_COLOR); strokeWeight(3); line(lx, legendY2, lx + 18, legendY2);
  noStroke(); fill(20); text('Photon (energy only)', lx + 24, legendY2);
  lx += (compact() ? 130 : 152);

  stroke(PHONON_COLOR); strokeWeight(3);
  drawingContext.setLineDash([4, 3]);
  line(lx, legendY2, lx + 18, legendY2);
  drawingContext.setLineDash([]);
  noStroke(); fill(20); text('Phonon (momentum Δk)', lx + 24, legendY2);

  // numeric readout: Eg, k0, and both effective masses
  const readY = legendY2 + (compact() ? 24 : 26);
  const readY2 = readY + (compact() ? 18 : 18);
  fill('#333'); noStroke();
  textAlign(LEFT, CENTER);
  textSize(compact() ? 10.5 : 12);
  text('Eg = ' + p.Eg.toFixed(2) + ' eV   |   mₑ* = ' + p.me.toFixed(3) + ' m₀ (electron, CB)   |   m_h* = ' + p.mh.toFixed(2) + ' m₀ (hole, VB)', 12, readY);
  text('k₀ (CB offset) = ' + p.k0.toFixed(2) + '   |   ' + transitionInfoText(p), 12, readY2);
}

function transitionInfoText(p) {
  const mode = transitionSelect.value();
  if (mode === 'Vertical (photon only)') {
    const Etop = Ec(0, p.Eg, p.k0, p.aC);
    return 'photon ΔE = ' + Etop.toFixed(2) + ' eV' + (Math.abs(p.k0) > 0.02 ? ' (misses true CB min)' : '');
  }
  return 'photon ΔE = ' + p.Eg.toFixed(2) + ' eV' + (Math.abs(p.k0) > 0.02 ? '  +  phonon Δk = ' + p.k0.toFixed(2) : '');
}

function drawEkDiagram(p) {
  const EMaxTop = p.Eg + 4.5;
  const EMinBot = -4.5;

  const plotX0 = margin + 12;
  const plotX1 = canvasWidth - margin;
  const plotY0 = 50;
  const plotY1 = drawHeight - 50;

  function kToPx(k) { return map(k, -K_MAX, K_MAX, plotX0, plotX1); }
  function eToPx(E) { return map(E, EMinBot, EMaxTop, plotY1, plotY0); }

  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(compact() ? 13 : 16);
  text('E-k Diagram: ' + materialSelect.value(), canvasWidth / 2, 8);

  // axes
  stroke(200);
  strokeWeight(1);
  line(plotX0, plotY1, plotX1, plotY1);
  line(kToPx(0), plotY0, kToPx(0), plotY1);

  // k-axis ticks
  stroke(180); strokeWeight(1);
  fill(90); textAlign(CENTER, TOP); textSize(10);
  for (let kt = -1; kt <= 1; kt += 0.5) {
    const x = kToPx(kt);
    line(x, plotY1, x, plotY1 + 4);
    noStroke();
    text(kt.toFixed(1), x, plotY1 + 6);
    stroke(180);
  }

  // E-axis ticks (every 2 eV)
  const eStart = Math.ceil(EMinBot / 2) * 2;
  textAlign(RIGHT, CENTER);
  for (let et = eStart; et <= EMaxTop; et += 2) {
    const y = eToPx(et);
    stroke(180); strokeWeight(1);
    line(plotX0 - 4, y, plotX0, y);
    noStroke(); fill(90); textSize(10);
    text(et.toFixed(0), plotX0 - 7, y);
  }

  // E = 0 reference (valence band maximum energy)
  stroke(190);
  drawingContext.setLineDash([2, 3]);
  line(plotX0, eToPx(0), plotX1, eToPx(0));
  drawingContext.setLineDash([]);

  // valence band (downward parabola, vertex at k=0)
  noFill();
  stroke(VB_COLOR);
  strokeWeight(2.5);
  beginShape();
  const steps = 200;
  for (let i = 0; i <= steps; i++) {
    const k = -K_MAX + (i / steps) * (2 * K_MAX);
    const E = constrain(Ev(k, p.aV), EMinBot - 1, EMaxTop + 1);
    vertex(kToPx(k), eToPx(E));
  }
  endShape();

  // conduction band (upward parabola, vertex at k=k0)
  stroke(CB_COLOR);
  strokeWeight(2.5);
  beginShape();
  for (let i = 0; i <= steps; i++) {
    const k = -K_MAX + (i / steps) * (2 * K_MAX);
    const E = constrain(Ec(k, p.Eg, p.k0, p.aC), EMinBot - 1, EMaxTop + 1);
    vertex(kToPx(k), eToPx(E));
  }
  endShape();

  // band curve name labels, placed away from the transition path and info readouts
  noStroke();
  textSize(compact() ? 11 : 12);
  fill(CB_COLOR);
  textAlign(plotX1 - kToPx(p.k0) > kToPx(p.k0) - plotX0 ? LEFT : RIGHT, BOTTOM);
  text('Conduction Band', constrain(kToPx(p.k0) + (plotX1 - kToPx(p.k0) > kToPx(p.k0) - plotX0 ? 40 : -40), plotX0 + 4, plotX1 - 4), eToPx(EMaxTop * 0.72 + p.Eg * 0.28) );
  fill(VB_COLOR);
  textAlign(CENTER, TOP);
  text('Valence Band', kToPx(K_MAX * 0.55), eToPx(Ev(K_MAX * 0.55, p.aV)) + 4);

  // same-k alignment guide for direct-gap materials
  if (Math.abs(p.k0) < 0.02) {
    stroke(160); strokeWeight(1);
    drawingContext.setLineDash([2, 4]);
    line(kToPx(0), eToPx(0), kToPx(0), eToPx(p.Eg));
    drawingContext.setLineDash([]);
  }

  // mark valence band maximum and conduction band minimum
  noStroke();
  fill(VB_COLOR);
  circle(kToPx(0), eToPx(0), 8);
  fill(CB_COLOR);
  circle(kToPx(p.k0), eToPx(p.Eg), 8);

  // Eg bracket: vertical measurement from VB max energy (0) up to CB min energy (Eg),
  // offset to the side of the CB-min marker so it never overlaps the transition path.
  // (The exact Eg, k0, and photon/phonon numbers are reported in the readout line
  // below the diagram rather than as floating text here, so labels never collide
  // regardless of where k0 happens to fall.)
  const bracketSide = (kToPx(p.k0) < (plotX0 + plotX1) / 2) ? 1 : -1;
  const bx_ = kToPx(p.k0) + bracketSide * 22;
  stroke(120); strokeWeight(1.2);
  line(bx_, eToPx(0), bx_, eToPx(p.Eg));
  line(bx_ - 4, eToPx(0), bx_ + 4, eToPx(0));
  line(bx_ - 4, eToPx(p.Eg), bx_ + 4, eToPx(p.Eg));

  // transition path (photon / phonon)
  drawTransitionArrow(p, kToPx, eToPx);

  // VB max / CB min point labels (short words only, placed OUTWARD from each
  // other -- VB max below its marker, CB min above its marker -- so the two
  // labels stay maximally separated even for small-Eg indirect materials
  // where the two markers sit close together in pixel space)
  fill(60);
  textAlign(LEFT, TOP);
  textSize(compact() ? 10 : 11);
  text('VB max', constrain(kToPx(0) + 10, plotX0, plotX1 - 55), eToPx(0) + 8);
  textAlign(kToPx(p.k0) < plotX1 - 55 ? LEFT : RIGHT, BOTTOM);
  text('CB min', constrain(kToPx(p.k0) + (kToPx(p.k0) < plotX1 - 55 ? 10 : -10), plotX0, plotX1 - 10), eToPx(p.Eg) - 8);

  // axis titles
  fill(20);
  textAlign(CENTER, TOP);
  textSize(12);
  text('k (units of π/a)', canvasWidth / 2, plotY1 + 20);

  push();
  translate(plotX0 - 36, (plotY0 + plotY1) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Energy (eV)', 0, 0);
  pop();
}

function drawTransitionArrow(p, kToPx, eToPx) {
  const mode = transitionSelect.value();

  if (mode === 'Vertical (photon only)') {
    const Etop = Ec(0, p.Eg, p.k0, p.aC);
    stroke(PHOTON_COLOR); strokeWeight(2.5); fill(PHOTON_COLOR);
    drawArrowSegment(kToPx(0), eToPx(0), kToPx(0), eToPx(Etop));
    if (Math.abs(p.k0) > 0.02) {
      noStroke(); fill('#B23A2E');
      textAlign(LEFT, TOP);
      textSize(compact() ? 10 : 11);
      text('misses true CB min!', constrain(kToPx(0) + 6, 4, canvasWidth - 4), eToPx(Etop) + 4);
    }
  } else {
    // vertical segment (photon, energy Eg) then horizontal segment (phonon, momentum k0)
    stroke(PHOTON_COLOR); strokeWeight(2.5); fill(PHOTON_COLOR);
    drawArrowSegment(kToPx(0), eToPx(0), kToPx(0), eToPx(p.Eg));

    if (Math.abs(p.k0) > 0.02) {
      stroke(PHONON_COLOR); strokeWeight(2.5); fill(PHONON_COLOR);
      drawingContext.setLineDash([5, 4]);
      drawArrowSegment(kToPx(0), eToPx(p.Eg), kToPx(p.k0), eToPx(p.Eg));
      drawingContext.setLineDash([]);
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
  controlHeight = compact() ? 250 : 225;

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
