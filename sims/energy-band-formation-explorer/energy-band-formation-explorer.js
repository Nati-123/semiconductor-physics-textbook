// Energy Band Formation Explorer MicroSim
// Shows the classic "energy level splitting vs. interatomic spacing" picture:
// N isolated atoms each have the same sharp discrete energy levels. As they
// are brought together, wavefunction overlap splits each level into N
// closely-spaced sub-levels (a simple finite tight-binding spectrum,
// E = E0 +/- t(d)*cos(pi*(j+1)/(N+1)) for j=0..N-1), whose spread (bandwidth)
// grows as the coupling t(d) grows with decreasing spacing d. For large N
// this fan of discrete levels looks like a continuous band; at equilibrium
// spacing the two resulting bands are labeled valence/conduction band,
// exactly the Chapter 5 "band formation" terminology.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02 (2D static/interactive variant)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 235; // extra room for the readout, which can wrap to 6 lines on narrow canvases
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 56;
let atomStripH = 66;

let nSlider, dSlider, resetBtn;

const D_MIN = 0.15, D_MAX = 1.50;   // nm, interatomic spacing range
const D_DEFAULT = 0.60;
const N_MIN = 2, N_MAX = 40, N_DEFAULT = 12;

const E1 = 0.0, E2 = 4.2;    // eV, base isolated-atom energy levels
const T1_0 = 1.3, T2_0 = 2.3; // eV, coupling strength at the closest spacing
const DECAY = 0.35;          // nm, overlap decay length

let animD = D_DEFAULT; // eased spacing value so motion is visibly gradual

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  dSlider = createSlider(D_MIN, D_MAX, D_DEFAULT, 0.01);
  dSlider.attribute('aria-label', 'Interatomic spacing d in nanometers');

  nSlider = createSlider(N_MIN, N_MAX, N_DEFAULT, 1);
  nSlider.attribute('aria-label', 'Number of atoms N');

  resetBtn = createButton('Reset');
  resetBtn.attribute('aria-label', 'Reset to default values');
  resetBtn.mousePressed(function () {
    dSlider.value(D_DEFAULT);
    nSlider.value(N_DEFAULT);
  });

  positionUIElements();
  animD = dSlider.value();

  describe('Energy band formation explorer: shows N isolated-atom discrete energy levels splitting into closely-spaced states as interatomic spacing decreases, eventually forming continuous-looking valence and conduction bands', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;

  const sliderX = bx + 190;
  const sliderW = min(canvasWidth - 210 - margin + 20, 320);

  dSlider.position(sliderX, by + drawHeight + 14);
  dSlider.size(sliderW);

  nSlider.position(sliderX, by + drawHeight + 50);
  nSlider.size(sliderW);

  resetBtn.position(bx + 10, by + drawHeight + 90);
}

function couplingT(t0, d) {
  return t0 * Math.exp(-(d - D_MIN) / DECAY);
}

function levelEnergies(E0, t0, d, N) {
  const t = couplingT(t0, d);
  const arr = new Array(N);
  for (let j = 0; j < N; j++) {
    arr[j] = E0 + t * Math.cos(Math.PI * (j + 1) / (N + 1));
  }
  return arr;
}

// Title text shrinks on narrow canvases so long titles never get clipped
// by the canvas edge on mobile widths.
function titleTextSize() {
  return canvasWidth < 420 ? 11 : (canvasWidth < 600 ? 13 : 16);
}

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

  const targetD = dSlider.value();
  animD = lerp(animD, targetD, 0.08);
  if (abs(animD - targetD) < 0.001) animD = targetD;

  const N = nSlider.value();

  drawAtomStrip(animD);
  drawFanDiagram(animD, N);
  drawControlLabels(targetD, N);
  drawReadout(animD, N);
}

function drawControlLabels(d, N) {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Interatomic spacing d: ' + d.toFixed(2) + ' nm', 10, drawHeight + 24);
  text('Number of atoms N: ' + N, 10, drawHeight + 60);
}

// ============================================================
// TOP STRIP: schematic row of atoms at the current spacing
// ============================================================
function drawAtomStrip(d) {
  fill(20);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(canvasWidth < 480 ? 9.5 : 11.5);
  text(canvasWidth < 480 ? 'Atoms coming together (schematic)' : 'Atoms coming together (schematic; always 8 atoms shown)', margin, 6);

  const nShown = 8;
  const stripW = canvasWidth - 2 * margin;
  const pxPerNm = stripW / (nShown * D_MAX);
  const spacingPx = d * pxPerNm;
  const totalW = (nShown - 1) * spacingPx;
  const cy = atomStripH / 2 + 14;
  const startX = canvasWidth / 2 - totalW / 2;

  stroke(200);
  strokeWeight(1);
  line(margin, cy, canvasWidth - margin, cy);

  noStroke();
  fill('#5A3EED');
  for (let i = 0; i < nShown; i++) {
    circle(startX + i * spacingPx, cy, 14);
  }
}

// ============================================================
// MAIN FAN DIAGRAM: energy vs. interatomic spacing
// ============================================================
function drawFanDiagram(dCurrent, N) {
  const plotX0 = margin;
  const plotX1 = canvasWidth - margin;
  const plotY0 = atomStripH + 34;
  const plotY1 = drawHeight - 20;

  const EMin = E1 - T1_0 - 0.6;
  const EMax = E2 + T2_0 + 0.6;

  function dToPx(d) { return map(d, D_MIN, D_MAX, plotX0, plotX1); }
  function eToPx(E) { return map(E, EMin, EMax, plotY1, plotY0); }

  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(titleTextSize());
  text('Discrete Levels → Bands, as Atoms Are Brought Together', canvasWidth / 2, atomStripH + 4);

  // axis
  stroke(200);
  strokeWeight(1);
  line(plotX0, plotY1, plotX1, plotY1);

  noStroke();
  fill(20);
  const compact = canvasWidth < 480;
  textAlign(LEFT, TOP);
  textSize(compact ? 9 : 11);
  text(compact ? '← a₀ (crystal)' : '← Equilibrium spacing a₀ (crystal)', plotX0, plotY1 + 6);
  textAlign(RIGHT, TOP);
  text(compact ? 'Isolated (d large) →' : 'Isolated atoms (d large) →', plotX1, plotY1 + 6);

  // fan curves: trace each of the N discrete states across the spacing range
  const samples = 140;
  strokeWeight(1);
  noFill();
  for (let level = 0; level < 2; level++) {
    const E0 = level === 0 ? E1 : E2;
    const t0 = level === 0 ? T1_0 : T2_0;
    const col = level === 0 ? color(46, 125, 50, 130) : color(90, 62, 237, 130);
    stroke(col);
    for (let j = 0; j < N; j++) {
      beginShape();
      for (let s = 0; s <= samples; s++) {
        const d = D_MIN + (s / samples) * (D_MAX - D_MIN);
        const t = couplingT(t0, d);
        const E = E0 + t * Math.cos(Math.PI * (j + 1) / (N + 1));
        vertex(dToPx(d), eToPx(E));
      }
      endShape();
    }
  }

  // vertical cursor at the current spacing, with enlarged discrete ticks
  const cursorX = dToPx(dCurrent);
  stroke(120);
  strokeWeight(1.5);
  drawingContext.setLineDash([3, 3]);
  line(cursorX, plotY0, cursorX, plotY1);
  drawingContext.setLineDash([]);

  const e1States = levelEnergies(E1, T1_0, dCurrent, N);
  const e2States = levelEnergies(E2, T2_0, dCurrent, N);

  noStroke();
  fill('#2E7D32');
  for (const E of e1States) {
    rectMode(CENTER);
    rect(cursorX, eToPx(E), 14, 2.4);
  }
  fill('#5A3EED');
  for (const E of e2States) {
    rectMode(CENTER);
    rect(cursorX, eToPx(E), 14, 2.4);
  }
  rectMode(CORNER);

  // band labels at the equilibrium (left) end
  fill('#2E7D32');
  textAlign(LEFT, BOTTOM);
  textSize(12);
  text('Valence band', plotX0 + 4, eToPx(E1 - T1_0) - 6);
  fill('#5A3EED');
  text('Conduction band', plotX0 + 4, eToPx(E2 + T2_0) - 6);

  // y-axis label
  push();
  translate(plotX0 - 40, (plotY0 + plotY1) / 2);
  rotate(-HALF_PI);
  fill(20);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  text('Energy (eV)', 0, 0);
  pop();
}

// ============================================================
// NUMERIC READOUT
// ============================================================
// Greedily wraps a single line of text to fit maxWidth, using the current
// font/size (caller must set textSize before calling).
function wrapToWidth(str, maxWidth) {
  const words = str.split(' ');
  const out = [];
  let current = '';
  for (const w of words) {
    const test = current ? current + ' ' + w : w;
    if (current && textWidth(test) > maxWidth) {
      out.push(current);
      current = w;
    } else {
      current = test;
    }
  }
  if (current) out.push(current);
  return out;
}

function drawReadout(d, N) {
  const t1 = couplingT(T1_0, d);
  const t2 = couplingT(T2_0, d);
  const bw1 = 2 * t1;
  const bw2 = 2 * t2;
  const gap = (E2 - t2) - (E1 + t1);

  const lines = [
    'Lower-band width: 2×t₁(d) = ' + bw1.toFixed(2) + ' eV   |   Upper-band width: 2×t₂(d) = ' + bw2.toFixed(2) + ' eV',
    gap > 0
      ? ('Gap between bands: ' + gap.toFixed(2) + ' eV')
      : ('Bands overlap by ' + (-gap).toFixed(2) + ' eV — no gap (metal-like)'),
    N >= 15
      ? (N + ' states per band — closely spaced enough to look like a continuous band')
      : (N + ' states per band — small enough to see as individual discrete levels')
  ];

  fill('#3d2b8c');
  noStroke();
  textAlign(LEFT, CENTER);
  const size = 12.5;
  textSize(size);
  const maxW = canvasWidth - 20;
  const wrapped = [];
  for (const line of lines) wrapped.push(...wrapToWidth(line, maxW));
  const lineH = size + 5;
  for (let i = 0; i < wrapped.length; i++) {
    text(wrapped[i], 10, drawHeight + 120 + i * lineH);
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
  // Fixed at minDrawHeight rather than growing to fill extra iframe height:
  // this sim is embedded in a fixed-height iframe sized to exactly fit the
  // canvas plus the learning-panel summary bar below it, so letting the
  // canvas grow to fill "spare" iframe height would just re-create the
  // overflow it was sized to avoid.
  drawHeight = minDrawHeight;
  canvasHeight = drawHeight + controlHeight;
  containerHeight = canvasHeight;
}
