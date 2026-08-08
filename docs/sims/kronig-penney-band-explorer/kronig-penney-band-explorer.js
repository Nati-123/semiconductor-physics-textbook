// Kronig-Penney Band Formation Explorer MicroSim
// Four selectable views walk from the physical setup to the final result:
//   "Periodic Potential"       -- schematic V(x): a periodic array of square
//                                 barriers, height scaling qualitatively with P
//   "Transcendental Equation"  -- plots P*sin(x)/x + cos(x) vs. x = alpha*a,
//                                 shading regions where |LHS| > 1 as
//                                 forbidden band gaps
//   "Allowed/Forbidden Bands"  -- a labeled energy-axis "band ladder" showing
//                                 allowed bands and forbidden gaps as solid
//                                 strips, computed from the same equation
//   "E-k Diagram"              -- inverts the same equation (via arccos, no
//                                 iterative root-finding needed) to plot the
//                                 resulting E(k) bands, with Brillouin zone
//                                 boundaries marked and labeled at k=+-n*pi/a;
//                                 click/drag on the curve to read off (E,k)
// Bloom Level: Understand / Analyze (L2-L4)
// MicroSim template version 2026.02 (2D static/interactive variant)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 40;

let viewSelect, pSlider, resetBtn;

const X_MAX = 3 * Math.PI + 0.5; // sweep alpha*a from ~0 to just past 3*pi
const DEFAULT_P = 4;

// cache of plotted E-k points for the draggable readout, rebuilt each frame
// the E-k view is drawn: [{k, E, px, py}, ...]
let ekPoints = [];
let selectedEk = null; // {k, E} currently picked by the student

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  viewSelect = createSelect();
  viewSelect.option('Periodic Potential');
  viewSelect.option('Transcendental Equation');
  viewSelect.option('Allowed/Forbidden Bands');
  viewSelect.option('E-k Diagram');
  viewSelect.selected('Transcendental Equation');
  viewSelect.attribute('aria-label', 'View selector');

  pSlider = createSlider(0, 12, DEFAULT_P, 0.1);
  pSlider.attribute('aria-label', 'Barrier strength P');

  resetBtn = createButton('Reset');
  resetBtn.attribute('aria-label', 'Reset to default values');
  resetBtn.mousePressed(function () {
    pSlider.value(DEFAULT_P);
    selectedEk = null;
  });

  positionUIElements();

  describe('Kronig-Penney model explorer with four views: the periodic square-barrier potential, the transcendental equation with shaded forbidden gaps, a labeled allowed/forbidden band ladder, and an interactive E-k band diagram with Brillouin zone boundaries', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;

  viewSelect.position(bx + 10, by + drawHeight + 10);
  viewSelect.size(min(canvasWidth - 20, 260));

  pSlider.position(bx + 10, by + drawHeight + 55);
  pSlider.size(min(canvasWidth - 20 - margin, 340));

  resetBtn.position(bx + 10, by + drawHeight + 90);
}

// Title text shrinks on narrow canvases so long titles never get clipped
// by the canvas edge on mobile widths.
function titleTextSize() {
  return canvasWidth < 420 ? 11 : (canvasWidth < 600 ? 13 : 16);
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

  if (view === 'Periodic Potential') {
    drawPeriodicPotential(P);
  } else if (view === 'Transcendental Equation') {
    drawTranscendental(P);
  } else if (view === 'Allowed/Forbidden Bands') {
    drawBandLadder(P);
  } else {
    drawEkDiagram(P);
  }

  drawControlLabels(P, view);
}

function drawControlLabels(P, view) {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  // Positioned in the gap between the view dropdown (ends ~+36) and the P
  // slider (starts ~+55) so the text never renders on top of either control.
  text('Barrier strength P: ' + P.toFixed(1) + (view === 'E-k Diagram' ? '   (drag on a band to read E and k)' : ''), 10, drawHeight + 45);
}

// ============================================================
// PERIODIC POTENTIAL VIEW
// ============================================================
function drawPeriodicPotential(P) {
  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(titleTextSize());
  text('The Kronig-Penney Periodic Potential V(x)  (schematic)', canvasWidth / 2, 8);

  const plotX0 = margin + 10;
  const plotX1 = canvasWidth - margin;
  const baseY = drawHeight - 150;
  const periods = 4;
  const aPx = (plotX1 - plotX0) / periods;
  const bPx = aPx * 0.22; // illustrative barrier width fraction
  const maxBarrierH = 150;
  const barrierH = 20 + (P / 12) * maxBarrierH; // qualitative: taller barrier <-> larger P

  // energy level line (schematic electron energy E, fixed low in the well)
  const EPx = baseY - 22;

  noStroke();
  fill(230, 230, 245);
  rect(plotX0, baseY - maxBarrierH - 20, plotX1 - plotX0, maxBarrierH + 20 + 40);

  // draw wells + barriers
  stroke('#5A3EED');
  strokeWeight(2.5);
  fill(120, 100, 230, 90);
  let x0 = plotX0 - aPx / 2;
  beginShape();
  vertex(x0, baseY);
  for (let n = -1; n <= periods; n++) {
    const wellStart = plotX0 + n * aPx;
    const barrierStart = wellStart + (aPx - bPx);
    const barrierEnd = wellStart + aPx;
    vertex(constrain(wellStart, plotX0 - 5, plotX1 + 5), baseY);
    vertex(constrain(barrierStart, plotX0 - 5, plotX1 + 5), baseY);
    vertex(constrain(barrierStart, plotX0 - 5, plotX1 + 5), baseY - barrierH);
    vertex(constrain(barrierEnd, plotX0 - 5, plotX1 + 5), baseY - barrierH);
    vertex(constrain(barrierEnd, plotX0 - 5, plotX1 + 5), baseY);
  }
  vertex(plotX1 + 5, baseY);
  endShape();

  // lattice constant a annotation (between two barrier centers)
  const c1x = plotX0 + (aPx - bPx / 2);
  const c2x = c1x + aPx;
  stroke(120);
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(c1x, baseY + 14, c1x, baseY + 34);
  line(c2x, baseY + 14, c2x, baseY + 34);
  drawingContext.setLineDash([]);
  line(c1x, baseY + 26, c2x, baseY + 26);
  noStroke();
  fill(60);
  textAlign(CENTER, TOP);
  textSize(12);
  text('lattice constant a', (c1x + c2x) / 2, baseY + 30);

  // barrier width b annotation on one barrier
  const bStart = plotX0 + (aPx - bPx);
  const bEnd = plotX0 + aPx;
  stroke(120);
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(bStart, baseY - barrierH - 10, bStart, baseY - barrierH - 26);
  line(bEnd, baseY - barrierH - 10, bEnd, baseY - barrierH - 26);
  drawingContext.setLineDash([]);
  line(bStart, baseY - barrierH - 18, bEnd, baseY - barrierH - 18);
  noStroke();
  fill(60);
  textAlign(CENTER, BOTTOM);
  textSize(11);
  text('width b', (bStart + bEnd) / 2, baseY - barrierH - 20);

  // barrier height V0 annotation
  stroke(150);
  strokeWeight(1);
  drawingContext.setLineDash([2, 3]);
  line(plotX1 + 8, baseY, plotX1 + 8, baseY - barrierH);
  drawingContext.setLineDash([]);
  noStroke();
  fill(60);
  textAlign(LEFT, CENTER);
  textSize(11);
  push();
  translate(plotX1 + 12, baseY - barrierH / 2);
  text('V₀', 0, 0);
  pop();

  drawInfoBox([
    'Barrier height/width shown schematically (idealized thin, tall-barrier limit — only P ∝ V₀·b·a matters).',
    'Increasing P (drag the slider) makes the barriers taller here, and — as seen in the other views —',
    'widens the forbidden band gaps.'
  ], 11);
}

// ============================================================
// TRANSCENDENTAL EQUATION VIEW
// ============================================================
function drawTranscendental(P) {
  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(titleTextSize());
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

  // "ALLOWED" / "FORBIDDEN" labels directly on a representative band and gap
  // -- only drawn where they fit without colliding with each other
  const edges = computeBandEdgesX(P, X_MAX, 1200);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(11);
  const allowedLabelW = textWidth('ALLOWED BAND');
  const forbiddenLabelW = textWidth('FORBIDDEN GAP');
  let allowedCx = null, forbiddenCx = null;
  if (edges.length > 0) {
    const b0 = edges[0];
    allowedCx = xToPx((b0.start + b0.end) / 2);
  }
  if (edges.length > 1) {
    forbiddenCx = xToPx((edges[0].end + edges[1].start) / 2);
  }
  let drawAllowed = allowedCx !== null;
  let drawForbidden = forbiddenCx !== null;
  if (drawAllowed && drawForbidden && Math.abs(forbiddenCx - allowedCx) < (allowedLabelW + forbiddenLabelW) / 2 + 8) {
    drawAllowed = false; // prioritize the forbidden-gap label; gaps are the harder concept to infer from shading alone
  }
  if (drawAllowed) {
    fill('#2E7D32');
    text('ALLOWED BAND', allowedCx, plotY0 + 14);
  }
  if (drawForbidden) {
    fill('#B71C1C');
    text('FORBIDDEN GAP', forbiddenCx, plotY0 + 14);
  }

  // axis label
  noStroke();
  fill(20);
  textAlign(CENTER, TOP);
  textSize(12);
  text('x = αa  (proportional to √E)', canvasWidth / 2, plotY1 + 8);

  drawInfoBox([
    'Red shading: |LHS| > 1 → no real k → forbidden band gap.',
    'Dashed vertical lines: Brillouin zone boundaries, x = nπ (i.e. k = ±nπ/a).',
    'Drag P to 0 to see all gaps close (free-electron limit).'
  ], 11);
}

// ============================================================
// ALLOWED/FORBIDDEN BAND LADDER VIEW
// ============================================================
function drawBandLadder(P) {
  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(titleTextSize());
  text('Allowed Energy Bands and Forbidden Band Gaps', canvasWidth / 2, 8);

  const edges = computeBandEdgesX(P, X_MAX, 1500);
  const EMax = X_MAX * X_MAX;

  const plotY0 = 40;
  const plotY1 = drawHeight - 90; // leave room below for the info box
  const barX0 = canvasWidth / 2 - 90;
  const barX1 = canvasWidth / 2 + 90;

  function eToPx(E) { return map(E, 0, EMax, plotY1, plotY0); }

  // draw the full column as forbidden (red) first, then paint allowed bands over it
  noStroke();
  fill(255, 205, 197);
  rect(barX0, plotY0, barX1 - barX0, plotY1 - plotY0);

  let bandIdx = 0;
  for (const e of edges) {
    bandIdx++;
    const E0 = e.start * e.start;
    const E1 = e.end * e.end;
    const y0 = eToPx(E1);
    const y1 = eToPx(E0);
    fill(180, 230, 180);
    rect(barX0, y0, barX1 - barX0, y1 - y0);
    stroke('#2E7D32');
    strokeWeight(1.5);
    noFill();
    rect(barX0, y0, barX1 - barX0, y1 - y0);

    noStroke();
    fill('#1B5E20');
    textAlign(CENTER, CENTER);
    textSize(11);
    if (y1 - y0 > 14) {
      text('Band ' + bandIdx + ' (allowed)', (barX0 + barX1) / 2, (y0 + y1) / 2);
    }
  }

  // label gaps between consecutive bands
  stroke('#B71C1C');
  strokeWeight(1.5);
  noFill();
  for (let i = 0; i < edges.length - 1; i++) {
    const gStart = edges[i].end * edges[i].end;
    const gEnd = edges[i + 1].start * edges[i + 1].start;
    const y0 = eToPx(gEnd);
    const y1 = eToPx(gStart);
    stroke('#B71C1C');
    strokeWeight(1.5);
    noFill();
    rect(barX0, y0, barX1 - barX0, y1 - y0);
    noStroke();
    fill('#B71C1C');
    textAlign(LEFT, CENTER);
    textSize(11);
    if (y1 - y0 > 10) {
      // Wrap to whatever width is actually available to the right of the
      // ladder, so the label never gets clipped by the canvas edge on
      // narrow (mobile) canvases.
      const label = 'Gap ' + (i + 1) + ' (forbidden), ΔE ∝ ' + (gEnd - gStart).toFixed(2);
      const availWidth = Math.max(60, canvasWidth - (barX1 + 10) - 8);
      const labelLines = wrapToWidth(label, availWidth);
      const midY = (y0 + y1) / 2;
      const startY = midY - ((labelLines.length - 1) * 13) / 2;
      for (let li = 0; li < labelLines.length; li++) {
        text(labelLines[li], barX1 + 10, startY + li * 13);
      }
    }
  }

  // axis
  stroke(120);
  strokeWeight(1);
  line(barX0, plotY0, barX0, plotY1);
  noStroke();
  fill(20);
  textAlign(RIGHT, CENTER);
  textSize(11);
  text('E = ' + EMax.toFixed(0), barX0 - 6, plotY0);
  text('E = 0', barX0 - 6, plotY1);
  push();
  translate(barX0 - 34, (plotY0 + plotY1) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Energy (∝ α²a², increasing upward)', 0, 0);
  pop();

  drawInfoBox([
    'Green = allowed energy band (continuous states exist).  Red = forbidden band gap (no states exist).',
    'This ladder is exactly the same physics as the shaded "Transcendental Equation" view and the gaps',
    'in the "E-k Diagram" view — just re-drawn as a single energy axis, with no k dependence shown.'
  ], 11);
}

// Finds allowed-band edges in x-space (x = alpha*a) where |lhs(x,P)| <= 1.
// Returns [{start, end}, ...] in ascending x.
function computeBandEdgesX(P, xMax, steps) {
  const edges = [];
  let inBand = false;
  let bandStart = 0;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * xMax;
    const allowed = Math.abs(lhs(x, P)) <= 1;
    if (allowed && !inBand) { bandStart = x; inBand = true; }
    if (!allowed && inBand) { edges.push({ start: bandStart, end: x }); inBand = false; }
  }
  if (inBand) edges.push({ start: bandStart, end: xMax });
  return edges;
}

// ============================================================
// E-K DIAGRAM VIEW
// ============================================================
function drawEkDiagram(P) {
  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(titleTextSize());
  text('E-k Diagram (energy ∝ x², extended zone scheme)', canvasWidth / 2, 8);

  const plotX0 = margin + 10;
  const plotX1 = canvasWidth - margin;
  const plotY0 = 40;
  const plotY1 = drawHeight - 50;

  const kMaxUnits = 3; // in units of pi/a
  const EMax = X_MAX * X_MAX;

  function kToPx(kUnits) { return map(kUnits, -kMaxUnits, kMaxUnits, plotX0, plotX1); }
  function eToPx(E) { return map(E, 0, EMax, plotY1, plotY0); }

  // Brillouin zone boundaries (vertical dashed lines at every integer k/(pi/a)), labeled
  stroke(120, 120, 120, 150);
  strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  for (let n = -kMaxUnits; n <= kMaxUnits; n++) {
    const px = kToPx(n);
    line(px, plotY0, px, plotY1);
  }
  drawingContext.setLineDash([]);

  noStroke();
  fill(110);
  textAlign(CENTER, TOP);
  textSize(10);
  for (let n = -kMaxUnits; n <= kMaxUnits; n++) {
    if (n === 0) continue;
    const label = (Math.abs(n) === 1 ? '' : Math.abs(n)) + 'π/a';
    text((n < 0 ? '−' : '') + label, kToPx(n), plotY0 + 2);
  }

  stroke(200);
  strokeWeight(1);
  line(plotX0, plotY1, plotX1, plotY1);
  line(kToPx(0), plotY0, kToPx(0), plotY1);

  // scan energy (via x = alpha*a), invert cos(ka) = LHS(x) using arccos
  noStroke();
  fill('#5A3EED');
  const steps = 900;
  ekPoints = [];
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
        if (kPlus >= -kMaxUnits && kPlus <= kMaxUnits) {
          circle(kToPx(kPlus), py, 3);
          ekPoints.push({ k: kPlus, E: E, px: kToPx(kPlus), py: py });
        }
        if (kMinus >= -kMaxUnits && kMinus <= kMaxUnits) {
          circle(kToPx(kMinus), py, 3);
          ekPoints.push({ k: kMinus, E: E, px: kToPx(kMinus), py: py });
        }
      }
    }
  }

  // draggable readout point
  if (selectedEk) {
    stroke('#B8860B');
    strokeWeight(2);
    fill(255, 235, 180);
    circle(kToPx(selectedEk.k), eToPx(selectedEk.E), 11);

    noStroke();
    fill('#7a5c00');
    textAlign(LEFT, BOTTOM);
    textSize(12);
    const label = 'E = ' + selectedEk.E.toFixed(2) + '  |  k = ' + selectedEk.k.toFixed(2) + ' π/a';
    let lx = kToPx(selectedEk.k) + 10;
    if (lx + 140 > plotX1) lx = kToPx(selectedEk.k) - 150;
    text(label, lx, eToPx(selectedEk.E) - 8);
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
    'Each dashed line is a Brillouin zone boundary, k = nπ/a (labeled above the plot).',
    'Gaps in the plotted band curve (no dots) are the forbidden band gaps — notice they open',
    'exactly at the dashed zone-boundary lines. Click or drag on a band to read its (E, k).'
  ], 11);
}

// ============================================================
// SHARED HELPERS
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

function drawInfoBox(lines, fontSize) {
  const size = fontSize || 12;
  const lineH = size + 4;
  const boxW = min(560, canvasWidth - 2 * margin);
  const boxX = canvasWidth / 2 - boxW / 2;

  // Wrap each authored line to the box's actual width so nothing gets
  // clipped by the canvas edge on narrow (mobile) canvases.
  textSize(size);
  const innerW = boxW - 24;
  const wrapped = [];
  for (const line of lines) wrapped.push(...wrapToWidth(line, innerW));

  const boxY = drawHeight - 12 - wrapped.length * lineH - 10;
  noStroke();
  fill(255, 247, 221, 235);
  stroke(240, 216, 122);
  strokeWeight(1);
  rect(boxX, boxY, boxW, wrapped.length * lineH + 14, 8);
  noStroke();
  fill('#7a5c00');
  textAlign(LEFT, TOP);
  textSize(size);
  for (let i = 0; i < wrapped.length; i++) {
    text(wrapped[i], boxX + 12, boxY + 8 + i * lineH);
  }
}

// ---------- draggable E-k point interaction ----------
function pickNearestEkPoint() {
  if (ekPoints.length === 0) return null;
  let best = null;
  let bestD = Infinity;
  for (const pt of ekPoints) {
    const d = (pt.px - mouseX) * (pt.px - mouseX) + (pt.py - mouseY) * (pt.py - mouseY);
    if (d < bestD) { bestD = d; best = pt; }
  }
  return bestD < 30 * 30 ? best : null; // require a reasonably close click
}

function mousePressed() {
  if (viewSelect && viewSelect.value() === 'E-k Diagram' && mouseY >= 0 && mouseY <= drawHeight) {
    const pt = pickNearestEkPoint();
    if (pt) selectedEk = { k: pt.k, E: pt.E };
  }
}

function mouseDragged() {
  if (viewSelect && viewSelect.value() === 'E-k Diagram' && mouseY >= 0 && mouseY <= drawHeight) {
    const pt = pickNearestEkPoint();
    if (pt) selectedEk = { k: pt.k, E: pt.E };
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
