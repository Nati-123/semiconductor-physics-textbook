// Coulomb's Law Force and Field Explorer MicroSim
// Lets students apply Coulomb's law and the point-charge field/potential
// equations by adjusting charge magnitudes and separation and observing the
// resulting force, field, and potential values update numerically and graphically.
// Bloom Level: Apply (L3) - calculate
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 340;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 30;
let q1Slider, q2Slider, rSlider, resetButton;

const K = 8.99e9;      // Coulomb constant, N*m^2/C^2
const NC = 1e-9;        // nanocoulombs -> coulombs
const NM = 1e-9;        // nanometers -> meters

function setup() {
  updateCanvasSize();
  var mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  q1Slider = createSlider(-5, 5, 2, 0.5);
  q1Slider.size(160);
  q1Slider.input(() => redraw());
  q1Slider.attribute('aria-label', 'Charge q1 in nanocoulombs');
  q2Slider = createSlider(-5, 5, -1, 0.5);
  q2Slider.size(160);
  q2Slider.input(() => redraw());
  q2Slider.attribute('aria-label', 'Charge q2 in nanocoulombs');
  rSlider = createSlider(0.2, 5, 1, 0.1);
  rSlider.size(160);
  rSlider.input(() => redraw());
  rSlider.attribute('aria-label', 'Separation r in nanometers');

  resetButton = createButton('Reset to Defaults');
  resetButton.mousePressed(() => {
    q1Slider.value(2);
    q2Slider.value(-1);
    rSlider.value(1);
    redraw();
  });

  positionUIElements();

  describe('Two point charges with sliders for magnitude and separation, showing computed force, field, potential, and energy', LABEL);

  noLoop(); // redraw only when a control changes, to save CPU/battery

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  q1Slider.position(mainRect.left + 150, mainRect.top + drawHeight + 15);
  q2Slider.position(mainRect.left + 150, mainRect.top + drawHeight + 45);
  rSlider.position(mainRect.left + 150, mainRect.top + drawHeight + 75);
  resetButton.position(mainRect.left + 150, mainRect.top + drawHeight + 100);
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
  textSize(canvasWidth < 500 ? 14 : 18);
  text("Coulomb's Law Force and Field Explorer", canvasWidth / 2, 10);

  const q1nC = q1Slider.value();
  const q2nC = q2Slider.value();
  const rNm = max(rSlider.value(), 0.1);

  const q1 = q1nC * NC;
  const q2 = q2nC * NC;
  const r = rNm * NM;

  const F = K * q1 * q2 / (r * r);          // signed: negative = attractive
  const E = K * q1 / (r * r);                // field at q2's location, due to q1
  const V = K * q1 / r;                      // potential at q2's location, due to q1
  const U = K * q1 * q2 / r;                 // electrostatic potential energy of the pair

  drawDiagram(q1nC, q2nC, rNm, F);
  drawReadouts(F, E, V, U);
  drawControlLabels(q1nC, q2nC, rNm);
}

function drawDiagram(q1nC, q2nC, rNm, F) {
  const cx = canvasWidth * 0.35;
  const cy = drawHeight / 2 - 10;
  const pxPerNm = min(70, (canvasWidth * 0.6) / (2 * 5));
  const halfSep = (rNm / 2) * pxPerNm;
  const x1 = cx - halfSep;
  const x2 = cx + halfSep;

  // distance bracket
  stroke(120);
  strokeWeight(1);
  const bracketY = cy + 80;
  line(x1, bracketY - 6, x1, bracketY + 6);
  line(x2, bracketY - 6, x2, bracketY + 6);
  line(x1, bracketY, x2, bracketY);
  noStroke();
  fill(90);
  textAlign(CENTER, TOP);
  textSize(12);
  text('r = ' + rNm.toFixed(1) + ' nm', cx, bracketY + 8);

  drawCharge(x1, cy, q1nC, 'q₁', 'left');
  drawCharge(x2, cy, q2nC, 'q₂', 'right');

  // force vectors: length scaled to log of |F| for visibility across many orders of magnitude
  const absF = abs(F);
  const arrowLen = absF > 0 ? constrain(18 + 8 * log(absF / 1e-12 + 1), 14, 70) : 0;
  const attractive = F < 0;

  stroke(20);
  strokeWeight(3);
  fill(20);
  if (attractive) {
    drawArrow(x1 + 26, cy, x1 + 26 + arrowLen, cy);
    drawArrow(x2 - 26, cy, x2 - 26 - arrowLen, cy);
  } else if (F > 0) {
    drawArrow(x1 - 26, cy, x1 - 26 - arrowLen, cy);
    drawArrow(x2 + 26, cy, x2 + 26 + arrowLen, cy);
  }

  noStroke();
  fill(20);
  textAlign(CENTER, TOP);
  textSize(12);
  if (F !== 0) {
    text('F', (x1 + x2) / 2, cy - 50);
  }
}

function drawCharge(x, y, qnC, label, side) {
  const isPos = qnC >= 0;
  fill(isPos ? '#E53935' : '#1E88E5');
  stroke(0);
  strokeWeight(1.5);
  circle(x, y, 42);
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);
  text(isPos ? '+' : '−', x, y - 2);
  fill(0);
  textSize(12);
  // Anchor the label so it grows away from the other charge, so the two
  // labels never collide even when the charges are drawn close together.
  if (side === 'left') {
    textAlign(RIGHT, TOP);
    text(label + ' = ' + qnC.toFixed(1) + ' nC', x, y + 33);
  } else {
    textAlign(LEFT, TOP);
    text(label + ' = ' + qnC.toFixed(1) + ' nC', x, y + 33);
  }
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

function drawReadouts(F, E, V, U) {
  // Anchor from the right edge (instead of a fixed % of canvasWidth) so the
  // box always stays fully inside the canvas, even at mobile widths.
  const boxW = constrain(canvasWidth * 0.34, 150, 300);
  const px = canvasWidth - boxW - 15;
  const fs = canvasWidth < 500 ? 11 : 14;
  const lineH = fs * 2.3;
  const textW = boxW - 24;
  let py = 50;

  fill(245);
  stroke(200);
  strokeWeight(1);
  rect(px - 12, py - 15, boxW, 4 * lineH + 20, 8);

  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(fs);
  textWrap(WORD);
  text('Force F = ' + formatSci(F) + ' N', px, py, textW);
  py += lineH;
  text('Field E (at q₂) = ' + formatSci(E) + ' V/m', px, py, textW);
  py += lineH;
  text('Potential V (at q₂) = ' + formatSci(V) + ' V', px, py, textW);
  py += lineH;
  text('Energy U = ' + formatSci(U) + ' J', px, py, textW);
}

function drawControlLabels(q1nC, q2nC, rNm) {
  fill('black');
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(13);
  text('q₁ = ' + q1nC.toFixed(1) + ' nC', 145, drawHeight + 27);
  text('q₂ = ' + q2nC.toFixed(1) + ' nC', 145, drawHeight + 57);
  text('r = ' + rNm.toFixed(1) + ' nm', 145, drawHeight + 87);
}

function formatSci(x) {
  if (x === 0) return '0';
  const sign = x < 0 ? '-' : '';
  const ax = abs(x);
  const exp = Math.floor(Math.log10(ax));
  const mantissa = ax / Math.pow(10, exp);
  return sign + mantissa.toFixed(2) + ' x 10^' + exp;
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
  canvasHeight = drawHeight + controlHeight;
  containerHeight = canvasHeight;
}
