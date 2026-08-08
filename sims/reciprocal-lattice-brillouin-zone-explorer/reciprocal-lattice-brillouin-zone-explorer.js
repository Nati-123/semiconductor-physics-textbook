// Reciprocal Lattice and Brillouin Zone Explorer MicroSim
// Two linked views selected by a top-level dropdown:
//   "Real vs. Reciprocal Lattice" -- side-by-side 2D real lattice and its
//                                    reciprocal lattice, with primitive
//                                    vectors a1/a2 and b1/b2 drawn from the
//                                    origin, the first BZ boundary overlaid
//                                    on the reciprocal panel, adjustable
//                                    lattice constants a_x, a_y (nm),
//                                    optional rotation, and highlighted
//                                    origin/nearest-neighbor lattice points
//   "Wigner-Seitz Construction"   -- zoomed Wigner-Seitz construction of the
//                                    first Brillouin zone from the 2D
//                                    reciprocal lattice, with a real-space
//                                    Wigner-Seitz inset for comparison
// Real-space and reciprocal-space spacing are shown numerically (nm and
// m^-1), and both animate smoothly toward new slider values so the inverse
// relationship (larger a -> smaller G) is visibly demonstrated, not just
// stated.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02 (2D static/interactive variant)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 280; // extra room for the numeric readout, which can wrap to 4 lines on narrow canvases
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 30;

let viewSelect, axSlider, aySlider, shapeSelect, rotSlider, resetBtn;

// Reference scale: at the reference lattice constant REF_A, the real-space
// and reciprocal-space panels are drawn with visually matching dot spacing,
// so the inverse relationship reads as a mirror-image compression/expansion.
const REF_A = 0.40;       // nm
const REAL_SCALE = 120;   // px per nm
const RECIP_SCALE = REAL_SCALE * REF_A * REF_A / (2 * Math.PI); // px per nm^-1

// animated (eased) values -- these lag the sliders so changes visibly
// animate instead of snapping instantly
let animAx = REF_A, animAy = REF_A, animRot = 0;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  viewSelect = createSelect();
  viewSelect.option('Real vs. Reciprocal Lattice');
  viewSelect.option('Wigner-Seitz Construction');
  viewSelect.selected('Real vs. Reciprocal Lattice');
  viewSelect.attribute('aria-label', 'View selector');

  axSlider = createSlider(0.20, 0.80, REF_A, 0.01);
  axSlider.attribute('aria-label', 'Lattice constant a_x in nanometers');
  axSlider.input(onAxChanged);

  aySlider = createSlider(0.20, 0.80, REF_A, 0.01);
  aySlider.attribute('aria-label', 'Lattice constant a_y in nanometers');

  shapeSelect = createSelect();
  shapeSelect.option('Square lattice (a_x = a_y)');
  shapeSelect.option('Rectangular lattice (a_x independent of a_y)');
  shapeSelect.selected('Square lattice (a_x = a_y)');
  shapeSelect.attribute('aria-label', 'Lattice shape');
  shapeSelect.changed(onShapeChanged);

  rotSlider = createSlider(0, 45, 0, 1);
  rotSlider.attribute('aria-label', 'Lattice rotation in degrees');

  resetBtn = createButton('Reset');
  resetBtn.attribute('aria-label', 'Reset to default values');
  resetBtn.mousePressed(resetToDefaults);

  positionUIElements();
  onShapeChanged();

  animAx = axSlider.value();
  animAy = aySlider.value();
  animRot = rotSlider.value();

  describe('Side-by-side comparison of a real-space 2D lattice and its reciprocal lattice, showing primitive vectors, the first Brillouin zone boundary, and a Wigner-Seitz construction, with numerical real-space and reciprocal-space spacing values', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function resetToDefaults() {
  axSlider.value(REF_A);
  aySlider.value(REF_A);
  rotSlider.value(0);
  shapeSelect.selected('Square lattice (a_x = a_y)');
  onShapeChanged();
}

function onAxChanged() {
  if (isSquare()) aySlider.value(axSlider.value());
}

function isSquare() {
  return shapeSelect.value().indexOf('Square') === 0;
}

function onShapeChanged() {
  if (isSquare()) {
    aySlider.value(axSlider.value());
    aySlider.attribute('disabled', '');
  } else {
    aySlider.removeAttribute('disabled');
  }
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;

  const selectW = min(canvasWidth - 20, 300);
  viewSelect.position(bx + 10, by + drawHeight + 8);
  viewSelect.size(selectW);

  shapeSelect.position(bx + 10, by + drawHeight + 40);
  shapeSelect.size(selectW);

  const sliderX = bx + 150;
  const sliderW = min(canvasWidth - 170 - margin, 300);

  axSlider.position(sliderX, by + drawHeight + 74);
  axSlider.size(sliderW);

  aySlider.position(sliderX, by + drawHeight + 104);
  aySlider.size(sliderW);

  rotSlider.position(sliderX, by + drawHeight + 134);
  rotSlider.size(sliderW);

  resetBtn.position(bx + 10, by + drawHeight + 164);
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

  const view = viewSelect.value();
  const targetAx = axSlider.value();
  const targetAy = isSquare() ? axSlider.value() : aySlider.value();
  const targetRot = rotSlider.value();

  // ease toward target values so the inverse real<->reciprocal relationship
  // visibly animates instead of snapping
  animAx = lerp(animAx, targetAx, 0.08);
  animAy = lerp(animAy, targetAy, 0.08);
  animRot = lerp(animRot, targetRot, 0.08);
  if (abs(animAx - targetAx) < 0.0005) animAx = targetAx;
  if (abs(animAy - targetAy) < 0.0005) animAy = targetAy;
  if (abs(animRot - targetRot) < 0.02) animRot = targetRot;

  if (view === 'Real vs. Reciprocal Lattice') {
    drawRealVsReciprocal(animAx, animAy, animRot);
  } else {
    drawWignerSeitz(animAx, animAy, animRot);
  }

  drawControlLabels(targetAx, targetAy, targetRot);
  drawNumericalReadout(animAx, animAy);
}

function drawControlLabels(ax, ay, rot) {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text('a_x: ' + ax.toFixed(2) + ' nm', 10, drawHeight + 79);
  text('a_y: ' + ay.toFixed(2) + ' nm' + (isSquare() ? ' (locked)' : ''), 10, drawHeight + 109);
  text('rotation θ: ' + rot.toFixed(0) + '°', 10, drawHeight + 139);
}

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

function drawNumericalReadout(ax, ay) {
  const Gx = 2 * Math.PI / ax; // nm^-1
  const Gy = 2 * Math.PI / ay; // nm^-1
  const GxSI = (Gx * 1e9).toExponential(2); // m^-1
  const GySI = (Gy * 1e9).toExponential(2); // m^-1

  fill('#3d2b8c');
  noStroke();
  textAlign(LEFT, CENTER);
  const size = 12.5;
  textSize(size);
  const maxW = canvasWidth - 20;
  const lines = [
    'Real-space spacing:  a_x = ' + ax.toFixed(3) + ' nm,   a_y = ' + ay.toFixed(3) + ' nm',
    'Reciprocal-space spacing:  G_x = 2π/a_x = ' + Gx.toFixed(2) + ' nm⁻¹ (' + GxSI + ' m⁻¹),   G_y = ' + Gy.toFixed(2) + ' nm⁻¹ (' + GySI + ' m⁻¹)'
  ];
  const wrapped = [];
  for (const line of lines) wrapped.push(...wrapToWidth(line, maxW));
  const lineH = size + 5;
  for (let i = 0; i < wrapped.length; i++) {
    text(wrapped[i], 10, drawHeight + 200 + i * lineH);
  }
}

function rotatePt(x, y, rotDeg) {
  const r = radians(rotDeg);
  return { x: x * Math.cos(r) - y * Math.sin(r), y: x * Math.sin(r) + y * Math.cos(r) };
}

// ============================================================
// REAL VS. RECIPROCAL LATTICE VIEW
// ============================================================
function drawRealVsReciprocal(ax, ay, rot) {
  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(titleTextSize());
  text('Real-Space Lattice', canvasWidth / 4, 8);
  text('Reciprocal Lattice', 3 * canvasWidth / 4, 8);

  stroke(180);
  strokeWeight(1);
  line(canvasWidth / 2, 34, canvasWidth / 2, drawHeight - 30);

  const leftCx = canvasWidth / 4;
  const rightCx = 3 * canvasWidth / 4;
  const cy = drawHeight / 2 + 10;

  const spacingXreal = ax * REAL_SCALE;
  const spacingYreal = ay * REAL_SCALE;
  drawLatticePanel(leftCx, cy, spacingXreal, spacingYreal, rot, '#5A3EED', 'a', canvasWidth / 4 - margin, drawHeight / 2 - 55);

  const Gx = 2 * Math.PI / ax;
  const Gy = 2 * Math.PI / ay;
  const spacingXrecip = Gx * RECIP_SCALE;
  const spacingYrecip = Gy * RECIP_SCALE;
  drawLatticePanel(rightCx, cy, spacingXrecip, spacingYrecip, rot, '#E67E22', 'b', canvasWidth / 4 - margin, drawHeight / 2 - 55);

  // overlay the first Brillouin zone boundary on the reciprocal panel
  push();
  translate(rightCx, cy);
  rotate(radians(rot));
  noStroke();
  fill(90, 60, 220, 50);
  rectMode(CENTER);
  rect(0, 0, spacingXrecip, spacingYrecip);
  stroke('#5A3EED');
  strokeWeight(2);
  noFill();
  rect(0, 0, spacingXrecip, spacingYrecip);
  rectMode(CORNER);
  pop();

  fill('#5A3EED');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(11);
  text('shaded: first Brillouin zone', rightCx, drawHeight - 46);

  fill('#7a5c00');
  textAlign(CENTER, TOP);
  textSize(12);
  const capLines = wrapToWidth('Larger real-space spacing → smaller reciprocal-space spacing (inverse relationship)', canvasWidth - 20);
  const capStartY = drawHeight - 16 - (capLines.length - 1) * 15;
  for (let i = 0; i < capLines.length; i++) {
    text(capLines[i], canvasWidth / 2, capStartY + i * 15);
  }
}

// Draws a lattice panel with primitive vectors from the origin and
// highlighted origin / nearest-neighbor points. nx/ny are padded beyond the
// axis-aligned half-extent so the panel still looks well-filled once rotated.
function drawLatticePanel(cx, cy, spacingX, spacingY, rot, color, vecLabel, halfW, halfH) {
  // Extra coverage (beyond the axis-aligned half-extent) so rotated corners
  // aren't left empty, with each point's final rotated position clipped
  // against the panel bounds so it never spills into the neighboring panel.
  const pad = 1.5;
  const nx = Math.max(1, Math.ceil(pad * halfW / spacingX));
  const ny = Math.max(1, Math.ceil(pad * halfH / spacingY));
  const r = radians(rot);
  const cosR = Math.cos(r), sinR = Math.sin(r);

  // lattice points (rotated manually + bounds-checked, drawn in screen space)
  noStroke();
  fill(color);
  for (let i = -nx; i <= nx; i++) {
    for (let j = -ny; j <= ny; j++) {
      if (i === 0 && j === 0) continue;
      const lx = i * spacingX, ly = j * spacingY;
      const rx = lx * cosR - ly * sinR;
      const ry = lx * sinR + ly * cosR;
      if (Math.abs(rx) > halfW || Math.abs(ry) > halfH) continue;
      const isNeighbor = (Math.abs(i) <= 1 && j === 0) || (i === 0 && Math.abs(j) <= 1);
      circle(cx + rx, cy + ry, isNeighbor ? 9 : 6);
    }
  }

  push();
  translate(cx, cy);
  rotate(r);

  // origin, highlighted
  fill(20);
  circle(0, 0, 12);
  stroke(255);
  strokeWeight(1.5);
  noFill();
  circle(0, 0, 16);
  noStroke();

  // primitive vectors from the origin
  stroke(color);
  strokeWeight(2.5);
  fill(color);
  drawVectorArrow(0, 0, spacingX, 0);
  drawVectorArrow(0, 0, 0, spacingY);

  noStroke();
  textAlign(LEFT, BOTTOM);
  textSize(13);
  text(vecLabel + '₁', spacingX + 6, -4);
  text(vecLabel + '₂', 6, -spacingY - 4);

  pop();
}

function drawVectorArrow(x0, y0, x1, y1) {
  line(x0, y0, x1, y1);
  const angle = atan2(y1 - y0, x1 - x0);
  const headLen = 9;
  push();
  translate(x1, y1);
  rotate(angle);
  triangle(0, 0, -headLen, headLen / 2.3, -headLen, -headLen / 2.3);
  pop();
}

// ============================================================
// WIGNER-SEITZ CONSTRUCTION VIEW
// ============================================================
function drawWignerSeitz(ax, ay, rot) {
  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(titleTextSize());
  text('First Brillouin Zone: Wigner-Seitz Cell of the Reciprocal Lattice', canvasWidth / 2, 8);

  const cx = canvasWidth / 2 - 60;
  const cy = drawHeight / 2 + 20;
  const Gx = (2 * Math.PI / ax) * RECIP_SCALE;
  const Gy = (2 * Math.PI / ay) * RECIP_SCALE;

  const nx = Math.min(2, Math.floor((canvasWidth / 2 - margin - 40) / Gx));
  const ny = Math.min(2, Math.floor((drawHeight / 2 - 70) / Gy));

  push();
  translate(cx, cy);
  rotate(radians(rot));

  // reciprocal lattice points, nearest neighbors highlighted
  noStroke();
  for (let i = -nx; i <= nx; i++) {
    for (let j = -ny; j <= ny; j++) {
      if (i === 0 && j === 0) continue;
      const isNeighbor = (Math.abs(i) <= 1 && j === 0) || (i === 0 && Math.abs(j) <= 1);
      fill(isNeighbor ? '#C0392B' : '#E67E22');
      circle(i * Gx, j * Gy, isNeighbor ? 10 : 7);
    }
  }
  fill(20);
  circle(0, 0, 11);

  // perpendicular bisector construction lines to the 4 nearest neighbors
  stroke(150);
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(Gx / 2, -Gy * ny, Gx / 2, Gy * ny);
  line(-Gx / 2, -Gy * ny, -Gx / 2, Gy * ny);
  line(-Gx * nx, Gy / 2, Gx * nx, Gy / 2);
  line(-Gx * nx, -Gy / 2, Gx * nx, -Gy / 2);
  drawingContext.setLineDash([]);

  // shaded first Brillouin zone
  noStroke();
  fill(90, 60, 220, 70);
  rectMode(CENTER);
  rect(0, 0, Gx, Gy);

  stroke('#5A3EED');
  strokeWeight(2.5);
  noFill();
  rect(0, 0, Gx, Gy);
  rectMode(CORNER);

  noStroke();
  fill('#5A3EED');
  textAlign(CENTER, CENTER);
  textSize(12);
  text('First BZ', 0, 0);

  pop();

  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);
  text('Red points: nearest-neighbor reciprocal lattice points used in the construction', cx, drawHeight - 46);
  text('Dashed lines: perpendicular bisectors  |  Shaded rectangle: |k_x| ≤ π/a_x, |k_y| ≤ π/a_y', cx, drawHeight - 28);

  drawRealSpaceInset();
}

// Small inset showing the real-space Wigner-Seitz cell for comparison,
// tying back to Chapter 3's primitive-cell construction.
function drawRealSpaceInset() {
  const insetX = canvasWidth - 190;
  const insetY = 40;
  const insetSize = 150;

  stroke(200);
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(insetX, insetY, insetSize, insetSize, 8);

  noStroke();
  fill(60);
  textAlign(CENTER, TOP);
  textSize(11);
  text('Compare: real-space', insetX + insetSize / 2, insetY + 6);
  text('Wigner-Seitz cell (Ch. 3)', insetX + insetSize / 2, insetY + 19);

  const cx = insetX + insetSize / 2;
  const cy = insetY + insetSize / 2 + 14;
  const s = 26;

  noStroke();
  fill('#5A3EED');
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      circle(cx + i * s, cy + j * s, 6);
    }
  }
  fill(90, 60, 220, 70);
  rectMode(CENTER);
  rect(cx, cy, s, s);
  stroke('#5A3EED');
  strokeWeight(1.5);
  noFill();
  rect(cx, cy, s, s);
  rectMode(CORNER);
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
