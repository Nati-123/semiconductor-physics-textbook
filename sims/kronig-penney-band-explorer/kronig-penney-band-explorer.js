// Kronig-Penney Band Formation Explorer MicroSim
// Two linked views selected by a top-level dropdown:
//   "Transcendental Equation" -- plots P*sin(x)/x + cos(x) vs. x = alpha*a,
//                                 shading regions where |LHS| > 1 as
//                                 forbidden band gaps
//   "E-k Diagram"              -- inverts the same equation (via arccos,
//                                 no iterative root-finding needed) to
//                                 plot the resulting E(k) bands, with
//                                 Brillouin zone boundaries marked
// Bloom Level: Understand / Analyze (L2-L4)
// MicroSim template version 2026.02 (2D static/interactive variant)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 40;

let viewSelect, pSlider;

const X_MAX = 3 * Math.PI + 0.5; // sweep alpha*a from ~0 to just past 3*pi

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  viewSelect = createSelect();
  viewSelect.option('Transcendental Equation');
  viewSelect.option('E-k Diagram');
  viewSelect.selected('Transcendental Equation');
  viewSelect.attribute('aria-label', 'View selector');

  pSlider = createSlider(0, 12, 4, 0.1);
  pSlider.attribute('aria-label', 'Barrier strength P');

  positionUIElements();

  describe('Kronig-Penney model explorer: plots the transcendental equation P sin(x)/x + cos(x) = cos(ka) and shades forbidden band gaps, or shows the resulting E-k band diagram with Brillouin zone boundaries', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;

  viewSelect.position(bx + 10, by + drawHeight + 10);

  pSlider.position(bx + 10, by + drawHeight + 55);
  pSlider.size(min(canvasWidth - 20 - margin, 340));
}

// LHS of the Kronig-Penney transcendental equation
function lhs(x, P) {
  const sinc = (x === 0) ? 1 : Math.sin(x) / x;
  return P * sinc + Math.cos(x);
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

  const view = viewSelect.value();
  const P = pSlider.value();

  if (view === 'Transcendental Equation') {
    drawTranscendental(P);
  } else {
    drawEkDiagram(P);
  }

  drawControlLabels(P);
}

function drawControlLabels(P) {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text('View:', 10, drawHeight + 25);
  text('Barrier strength P: ' + P.toFixed(1), 10, drawHeight + 40);
}

// ============================================================
// TRANSCENDENTAL EQUATION VIEW
// ============================================================
function drawTranscendental(P) {
  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  text('P·sin(x)/x + cos(x)  vs.  x = αa   (shaded = forbidden band gap)', canvasWidth / 2, 8);

  const plotX0 = margin + 10;
  const plotX1 = canvasWidth - margin;
  const plotY0 = 40;
  const plotY1 = drawHeight - 50;
  const midY = (plotY0 + plotY1) / 2;
  const yScale = (plotY1 - plotY0) / 2 / max(2, 1 + P * 0.15);

  function xToPx(x) { return map(x, 0, X_MAX, plotX0, plotX1); }
  function yToPx(y) { return midY - y * yScale; }

  // shade forbidden regions first (so curve draws on top)
  noStroke();
  const steps = 600;
  for (let i = 0; i < steps; i++) {
    const x0 = (i / steps) * X_MAX;
    const x1 = ((i + 1) / steps) * X_MAX;
    const yMid = lhs((x0 + x1) / 2, P);
    if (Math.abs(yMid) > 1) {
      fill(255, 120, 100, 90);
      rect(xToPx(x0), plotY0, xToPx(x1) - xToPx(x0) + 1, plotY1 - plotY0);
    }
  }

  // reference lines y = +1, -1, 0
  stroke(150);
  strokeWeight(1);
  line(plotX0, yToPx(1), plotX1, yToPx(1));
  line(plotX0, yToPx(-1), plotX1, yToPx(-1));
  stroke(200);
  line(plotX0, midY, plotX1, midY);

  noStroke();
  fill(90);
  textAlign(LEFT, BOTTOM);
  textSize(11);
  text('+1', plotX0 + 2, yToPx(1) - 2);
  text('−1', plotX0 + 2, yToPx(-1) - 2);

  // Brillouin zone boundary markers (x = n*pi)
  stroke(120, 120, 120, 150);
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  for (let n = 1; n * Math.PI < X_MAX; n++) {
    const px = xToPx(n * Math.PI);
    line(px, plotY0, px, plotY1);
  }
  drawingContext.setLineDash([]);

  // the curve itself
  stroke('#5A3EED');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * X_MAX;
    let y = lhs(x, P);
    y = constrain(y, -1 - P * 0.5, 1 + P * 0.5);
    vertex(xToPx(x), yToPx(y));
  }
  endShape();

  // axis label
  noStroke();
  fill(20);
  textAlign(CENTER, TOP);
  textSize(12);
  text('x = αa  (proportional to √E)', canvasWidth / 2, plotY1 + 8);

  drawInfoBox([
    'Red shading: |LHS| > 1 → no real k → forbidden band gap.',
    'Dashed vertical lines: Brillouin zone boundaries, x = nπ.',
    'Drag P to 0 to see all gaps close (free-electron limit).'
  ]);
}

// ============================================================
// E-K DIAGRAM VIEW
// ============================================================
function drawEkDiagram(P) {
  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  text('E-k Diagram (energy ∝ x², extended zone scheme)', canvasWidth / 2, 8);

  const plotX0 = margin + 10;
  const plotX1 = canvasWidth - margin;
  const plotY0 = 40;
  const plotY1 = drawHeight - 50;

  const kMaxUnits = 3; // in units of pi/a
  const EMax = X_MAX * X_MAX;

  function kToPx(kUnits) { return map(kUnits, -kMaxUnits, kMaxUnits, plotX0, plotX1); }
  function eToPx(E) { return map(E, 0, EMax, plotY1, plotY0); }

  // Brillouin zone boundaries (vertical dashed lines at every integer k/(pi/a))
  stroke(120, 120, 120, 150);
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  for (let n = -kMaxUnits; n <= kMaxUnits; n++) {
    const px = kToPx(n);
    line(px, plotY0, px, plotY1);
  }
  drawingContext.setLineDash([]);

  stroke(200);
  strokeWeight(1);
  line(plotX0, plotY1, plotX1, plotY1);
  line(kToPx(0), plotY0, kToPx(0), plotY1);

  // scan energy (via x = alpha*a), invert cos(ka) = LHS(x) using arccos
  noStroke();
  fill('#5A3EED');
  const steps = 900;
  for (let i = 1; i < steps; i++) {
    const x = (i / steps) * X_MAX;
    const val = lhs(x, P);
    if (Math.abs(val) <= 1) {
      const k0 = Math.acos(val) / Math.PI; // in units of pi/a, lies in [0,1]
      const E = x * x;
      const py = eToPx(E);
      // plot the point and its periodic images across the extended zone scheme
      for (let n = -kMaxUnits - 1; n <= kMaxUnits + 1; n += 2) {
        const kPlus = n + k0;
        const kMinus = n - k0;
        if (kPlus >= -kMaxUnits && kPlus <= kMaxUnits) circle(kToPx(kPlus), py, 3);
        if (kMinus >= -kMaxUnits && kMinus <= kMaxUnits) circle(kToPx(kMinus), py, 3);
      }
    }
  }

  noStroke();
  fill(20);
  textAlign(CENTER, TOP);
  textSize(12);
  text('k  (units of π/a)', canvasWidth / 2, plotY1 + 8);

  fill(90);
  textAlign(CENTER, BOTTOM);
  textSize(11);
  for (let n = -kMaxUnits; n <= kMaxUnits; n++) {
    text(n, kToPx(n), plotY1 - 2);
  }

  drawInfoBox([
    'Each dashed line is a Brillouin zone boundary, k = nπ/a.',
    'Gaps in the plotted curve (no dots) are the forbidden band gaps —',
    'notice they open exactly at the dashed zone-boundary lines.'
  ]);
}

function drawInfoBox(lines) {
  const boxW = min(480, canvasWidth - 2 * margin);
  const boxX = canvasWidth / 2 - boxW / 2;
  const boxY = drawHeight - 12 - lines.length * 16 - 10;
  noStroke();
  fill(255, 247, 221, 235);
  stroke(240, 216, 122);
  strokeWeight(1);
  rect(boxX, boxY, boxW, lines.length * 16 + 14, 8);
  noStroke();
  fill('#7a5c00');
  textAlign(LEFT, TOP);
  textSize(12);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], boxX + 12, boxY + 8 + i * 16);
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
