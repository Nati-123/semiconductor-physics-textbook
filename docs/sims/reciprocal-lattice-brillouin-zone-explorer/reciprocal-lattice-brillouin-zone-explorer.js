// Reciprocal Lattice and Brillouin Zone Explorer MicroSim
// Two linked views selected by a top-level dropdown:
//   "Real vs. Reciprocal Lattice" -- side-by-side 2D real lattice and its
//                                    reciprocal lattice, with adjustable
//                                    lattice constants a_x, a_y
//   "Brillouin Zone" -- Wigner-Seitz construction of the first Brillouin
//                        zone from the 2D reciprocal lattice
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02 (2D static/interactive variant)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 30;

let viewSelect, axSlider, aySlider, lockAspectCheckbox;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  viewSelect = createSelect();
  viewSelect.option('Real vs. Reciprocal Lattice');
  viewSelect.option('Brillouin Zone');
  viewSelect.selected('Real vs. Reciprocal Lattice');
  viewSelect.attribute('aria-label', 'View selector');

  axSlider = createSlider(20, 60, 40, 1);
  axSlider.attribute('aria-label', 'Lattice constant a_x');
  axSlider.input(onAxChanged);

  aySlider = createSlider(20, 60, 40, 1);
  aySlider.attribute('aria-label', 'Lattice constant a_y');

  lockAspectCheckbox = createCheckbox('Square lattice (a_x = a_y)', true);
  lockAspectCheckbox.changed(onLockChanged);

  positionUIElements();
  onLockChanged();

  describe('Side-by-side comparison of a real-space 2D lattice and its reciprocal lattice, and a Wigner-Seitz construction of the first Brillouin zone', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function onAxChanged() {
  if (lockAspectCheckbox.checked()) {
    aySlider.value(axSlider.value());
  }
}

function onLockChanged() {
  if (lockAspectCheckbox.checked()) {
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

  viewSelect.position(bx + 10, by + drawHeight + 10);

  axSlider.position(bx + 220, by + drawHeight + 12);
  axSlider.size(min(canvasWidth - 240 - margin, 180));

  aySlider.position(bx + 220, by + drawHeight + 42);
  aySlider.size(min(canvasWidth - 240 - margin, 180));

  lockAspectCheckbox.position(bx + 10, by + drawHeight + 70);
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
  const ax = axSlider.value();
  const ay = lockAspectCheckbox.checked() ? axSlider.value() : aySlider.value();

  if (view === 'Real vs. Reciprocal Lattice') {
    drawRealVsReciprocal(ax, ay);
  } else {
    drawBrillouinZone(ax, ay);
  }

  drawControlLabels(ax, ay);
}

function drawControlLabels(ax, ay) {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text('View:', 10, drawHeight + 22);
  text('a_x: ' + ax, 60, drawHeight + 22);
  text('a_y: ' + ay, 60, drawHeight + 52);
}

// ============================================================
// REAL VS. RECIPROCAL LATTICE VIEW
// ============================================================
function drawRealVsReciprocal(ax, ay) {
  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  text('Real-Space Lattice', canvasWidth / 4, 10);
  text('Reciprocal Lattice', 3 * canvasWidth / 4, 10);

  stroke(180);
  strokeWeight(1);
  line(canvasWidth / 2, 40, canvasWidth / 2, drawHeight - 40);

  const leftCx = canvasWidth / 4;
  const rightCx = 3 * canvasWidth / 4;
  const cy = drawHeight / 2 + 15;

  drawLatticeGrid(leftCx, cy, ax, ay, '#5A3EED', 'a');
  const gx = (2 * Math.PI / ax) * 300; // scale factor for visibility
  const gy = (2 * Math.PI / ay) * 300;
  drawLatticeGrid(rightCx, cy, gx, gy, '#E67E22', 'G');

  fill(20);
  textAlign(CENTER, TOP);
  textSize(12);
  text('spacing a_x = ' + ax + ', a_y = ' + ay, leftCx, drawHeight - 34);
  text('spacing G_x = 2π/a_x, G_y = 2π/a_y (shown to scale)', rightCx, drawHeight - 34);

  fill('#7a5c00');
  textAlign(CENTER, TOP);
  textSize(12);
  text('Larger real-space spacing → smaller reciprocal-space spacing (inverse relationship)', canvasWidth / 2, drawHeight - 18);
}

function drawLatticeGrid(cx, cy, spacingX, spacingY, color, label) {
  const nx = Math.floor((canvasWidth / 4 - margin) / spacingX);
  const ny = Math.floor((drawHeight / 2 - 60) / spacingY);

  noStroke();
  fill(color);
  for (let i = -nx; i <= nx; i++) {
    for (let j = -ny; j <= ny; j++) {
      const x = cx + i * spacingX;
      const y = cy + j * spacingY;
      circle(x, y, 8);
    }
  }

  // highlight origin
  fill(20);
  circle(cx, cy, 10);
  fill(color);
  textAlign(LEFT, BOTTOM);
  textSize(12);
  text(label, cx + spacingX * 0.3, cy - spacingY * 0.3);
}

// ============================================================
// BRILLOUIN ZONE VIEW
// ============================================================
function drawBrillouinZone(ax, ay) {
  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  text('First Brillouin Zone (Wigner-Seitz cell of the reciprocal lattice)', canvasWidth / 2, 10);

  const cx = canvasWidth / 2;
  const cy = drawHeight / 2 + 15;
  const scaleFactor = 300;
  const Gx = (2 * Math.PI / ax) * scaleFactor;
  const Gy = (2 * Math.PI / ay) * scaleFactor;

  const nx = Math.min(2, Math.floor((canvasWidth / 2 - margin) / Gx));
  const ny = Math.min(2, Math.floor((drawHeight / 2 - 60) / Gy));

  // reciprocal lattice points
  noStroke();
  fill('#E67E22');
  for (let i = -nx; i <= nx; i++) {
    for (let j = -ny; j <= ny; j++) {
      if (i === 0 && j === 0) continue;
      circle(cx + i * Gx, cy + j * Gy, 8);
    }
  }
  fill(20);
  circle(cx, cy, 10);

  // perpendicular bisector construction lines to the 4 nearest neighbors
  stroke(150);
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(cx + Gx / 2, cy - Gy * ny, cx + Gx / 2, cy + Gy * ny);
  line(cx - Gx / 2, cy - Gy * ny, cx - Gx / 2, cy + Gy * ny);
  line(cx - Gx * nx, cy + Gy / 2, cx + Gx * nx, cy + Gy / 2);
  line(cx - Gx * nx, cy - Gy / 2, cx + Gx * nx, cy - Gy / 2);
  drawingContext.setLineDash([]);

  // shaded first Brillouin zone (rectangle bounded by the bisectors)
  noStroke();
  fill(90, 60, 220, 60);
  rectMode(CENTER);
  rect(cx, cy, Gx, Gy);
  rectMode(CORNER);

  stroke('#5A3EED');
  strokeWeight(2);
  noFill();
  rectMode(CENTER);
  rect(cx, cy, Gx, Gy);
  rectMode(CORNER);

  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(12);
  text('Shaded region: first Brillouin zone, |k_x| ≤ π/a_x, |k_y| ≤ π/a_y', cx, drawHeight - 34);
  text('Dashed lines: perpendicular bisectors to the nearest reciprocal lattice points', cx, drawHeight - 18);
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
