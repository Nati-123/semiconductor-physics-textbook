// Coulomb's Law Force Vectors MicroSim
// Illustrates that the electrostatic force between two point charges is a
// vector directed along the line connecting them, and that its direction
// depends on the relative sign of the charges.
// Bloom Level: Understand (L2) - illustrate
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 700;
let drawHeight = 320;
let minDrawHeight = 320;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 30;
let comboSelect;
let rSlider;

const COMBOS = [
  { label: 'Like Charges (+, +)', q1: 1, q2: 1 },
  { label: 'Like Charges (−, −)', q1: -1, q2: -1 },
  { label: 'Unlike Charges (+, −)', q1: 1, q2: -1 }
];

function setup() {
  updateCanvasSize();
  var mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  comboSelect = createSelect();
  COMBOS.forEach(c => comboSelect.option(c.label));
  comboSelect.changed(() => redraw());
  comboSelect.attribute('aria-label', 'Charge combination');

  rSlider = createSlider(1, 5, 2.5, 0.1);
  rSlider.size(160);
  rSlider.input(() => redraw());
  rSlider.attribute('aria-label', 'Separation r in nanometers');

  positionUIElements();

  describe('Two point charges with force vectors showing attraction or repulsion depending on charge sign', LABEL);

  noLoop(); // redraw only when a control changes, to save CPU/battery

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  comboSelect.position(mainRect.left + 140, mainRect.top + drawHeight + 18);
  rSlider.position(mainRect.left + 140, mainRect.top + drawHeight + 58);
}

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text("Coulomb's Law Force Vectors", canvasWidth / 2, 10);

  const combo = COMBOS[comboSelect.selected() ? COMBOS.findIndex(c => c.label === comboSelect.value()) : 0];
  const q1 = combo.q1;
  const q2 = combo.q2;
  const r = rSlider.value();

  const cx = canvasWidth / 2;
  const cy = drawHeight / 2 + 15;
  const pxPerUnit = min(80, (canvasWidth - 2 * margin - 120) / (2 * 3));
  const halfSep = (r / 2) * pxPerUnit;
  const x1 = cx - halfSep;
  const x2 = cx + halfSep;

  // relative force magnitude (arbitrary units), Coulomb's law: F ~ q1*q2 / r^2
  const forceMag = abs(q1 * q2) / (r * r);
  const attractive = (q1 * q2) < 0;
  const arrowLen = constrain(forceMag * 90, 18, 90);

  // distance bracket
  stroke(120);
  strokeWeight(1);
  const bracketY = cy + 70;
  line(x1, bracketY - 6, x1, bracketY + 6);
  line(x2, bracketY - 6, x2, bracketY + 6);
  line(x1, bracketY, x2, bracketY);
  noStroke();
  fill(90);
  textAlign(CENTER, TOP);
  textSize(13);
  text('r', cx, bracketY + 8);

  // charges
  drawCharge(x1, cy, q1, 'q₁');
  drawCharge(x2, cy, q2, 'q₂');

  // force vectors: attractive => arrows point toward each other; repulsive => away
  stroke(20);
  strokeWeight(3);
  fill(20);
  if (attractive) {
    drawArrow(x1 + 26, cy, x1 + 26 + arrowLen, cy);
    drawArrow(x2 - 26, cy, x2 - 26 - arrowLen, cy);
  } else {
    drawArrow(x1 - 26, cy, x1 - 26 - arrowLen, cy);
    drawArrow(x2 + 26, cy, x2 + 26 + arrowLen, cy);
  }

  noStroke();
  fill(20);
  textAlign(CENTER, TOP);
  textSize(13);
  text('F', (x1 + x2) / 2, cy - 55);

  // status text
  fill(attractive ? '#1565C0' : '#C62828');
  textAlign(CENTER, TOP);
  textSize(15);
  text(attractive ? 'Attractive force (unlike charges pull together)' : 'Repulsive force (like charges push apart)', cx, cy + 95);

  // controls labels
  fill('black');
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(13);
  text('Charge combination:', 135, drawHeight + 27);
  text('Separation r: ' + r.toFixed(1), 135, drawHeight + 67);
}

function drawCharge(x, y, q, label) {
  const isPos = q > 0;
  fill(isPos ? '#E53935' : '#1E88E5');
  stroke(0);
  strokeWeight(1.5);
  circle(x, y, 44);
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(isPos ? '+' : '−', x, y - 2);
  fill(0);
  textSize(13);
  text(label, x, y + 35);
}

function drawArrow(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
  push();
  translate(x2, y2);
  const a = atan2(y2 - y1, x2 - x1);
  rotate(a);
  const arrowSize = 8;
  triangle(0, 0, -arrowSize * 1.6, -arrowSize / 2, -arrowSize * 1.6, arrowSize / 2);
  pop();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
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
