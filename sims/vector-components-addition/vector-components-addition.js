// Vector Components and Addition MicroSim
// Lets students build two 2D vectors from magnitude and angle, see their
// x/y components, and add them tip-to-tail to form the resultant vector.
// Bloom Level: Apply (L3) - construct, compute
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 380;
let minDrawHeight = 380;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 20;
let magASlider, angASlider, magBSlider, angBSlider, showComponentsCheckbox;

function setup() {
  updateCanvasSize();
  var mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  magASlider = createSlider(0, 10, 6, 0.5);
  magASlider.size(180);
  magASlider.input(() => redraw());
  magASlider.attribute('aria-label', 'Magnitude of vector A');
  angASlider = createSlider(0, 360, 30, 1);
  angASlider.size(180);
  angASlider.input(() => redraw());
  angASlider.attribute('aria-label', 'Angle of vector A in degrees');
  magBSlider = createSlider(0, 10, 4, 0.5);
  magBSlider.size(180);
  magBSlider.input(() => redraw());
  magBSlider.attribute('aria-label', 'Magnitude of vector B');
  angBSlider = createSlider(0, 360, 120, 1);
  angBSlider.size(180);
  angBSlider.input(() => redraw());
  angBSlider.attribute('aria-label', 'Angle of vector B in degrees');

  showComponentsCheckbox = createCheckbox(' Show component projections', true);
  showComponentsCheckbox.changed(() => redraw());

  positionUIElements();

  describe('Two 2D vectors built from magnitude and angle sliders, with component projections and tip-to-tail vector addition', LABEL);

  noLoop(); // redraw only when a control changes, to save CPU/battery

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  magASlider.position(mainRect.left + 160, mainRect.top + drawHeight + 15);
  angASlider.position(mainRect.left + 160, mainRect.top + drawHeight + 45);
  magBSlider.position(mainRect.left + 160, mainRect.top + drawHeight + 75);
  angBSlider.position(mainRect.left + 160, mainRect.top + drawHeight + 105);
  showComponentsCheckbox.position(mainRect.left + 400, mainRect.top + drawHeight + 15);
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
  text('Vector Components and Addition', canvasWidth / 2, 10);

  const magA = magASlider.value();
  const angA = radians(angASlider.value());
  const magB = magBSlider.value();
  const angB = radians(angBSlider.value());
  const showComp = showComponentsCheckbox.checked();

  const Ax = magA * cos(angA);
  const Ay = -magA * sin(angA); // screen y grows downward
  const Bx = magB * cos(angB);
  const By = -magB * sin(angB);
  const Rx = Ax + Bx;
  const Ry = Ay + By;

  const originX = canvasWidth * 0.32;
  const originY = drawHeight / 2 + 30;
  const scalePx = min(28, (canvasWidth * 0.55) / 22);

  drawGrid(originX, originY, scalePx);

  // Component projections (dashed) for vector A
  if (showComp) {
    stroke(30, 100, 200, 140);
    strokeWeight(1);
    drawingContext.setLineDash([4, 4]);
    line(originX, originY, originX + Ax * scalePx, originY);
    line(originX + Ax * scalePx, originY, originX + Ax * scalePx, originY + Ay * scalePx);
    drawingContext.setLineDash([]);
  }

  // Vector A (blue)
  stroke('#1565C0');
  strokeWeight(3);
  fill('#1565C0');
  drawVector(originX, originY, Ax * scalePx, Ay * scalePx);
  noStroke();
  fill('#1565C0');
  textAlign(LEFT, BOTTOM);
  textSize(13);
  text('A', originX + Ax * scalePx + 6, originY + Ay * scalePx - 4);

  // Vector B drawn tip-to-tail from the tip of A (dashed, green) to build the resultant
  stroke('#2E7D32');
  strokeWeight(2);
  drawingContext.setLineDash([3, 3]);
  drawVector(originX + Ax * scalePx, originY + Ay * scalePx, Bx * scalePx, By * scalePx);
  drawingContext.setLineDash([]);

  // Vector B from origin (solid green) for reference
  stroke('#2E7D32');
  strokeWeight(3);
  fill('#2E7D32');
  drawVector(originX, originY, Bx * scalePx, By * scalePx);
  noStroke();
  fill('#2E7D32');
  textAlign(LEFT, BOTTOM);
  textSize(13);
  text('B', originX + Bx * scalePx + 6, originY + By * scalePx - 4);

  // Resultant R = A + B (red, thicker) from origin
  stroke('#C62828');
  strokeWeight(3.5);
  fill('#C62828');
  drawVector(originX, originY, Rx * scalePx, Ry * scalePx);
  noStroke();
  fill('#C62828');
  textAlign(LEFT, BOTTOM);
  textSize(14);
  text('R = A + B', originX + Rx * scalePx + 6, originY + Ry * scalePx - 4);

  drawReadouts(Ax, Ay, magA, angASlider.value(), Bx, By, magB, angBSlider.value(), Rx, Ry);
  drawControlLabels(magA, angASlider.value(), magB, angBSlider.value());
}

function drawGrid(originX, originY, scalePx) {
  stroke(210);
  strokeWeight(1);
  for (let i = -10; i <= 10; i++) {
    line(originX + i * scalePx, 40, originX + i * scalePx, drawHeight - 20);
    line(margin, originY + i * scalePx, canvasWidth * 0.62, originY + i * scalePx);
  }
  stroke(90);
  strokeWeight(1.5);
  line(margin, originY, canvasWidth * 0.62, originY);
  line(originX, 40, originX, drawHeight - 20);
  noStroke();
  fill(80);
  textSize(11);
  textAlign(LEFT, TOP);
  text('x', canvasWidth * 0.62 - 12, originY + 4);
  text('y', originX + 4, 42);
}

function drawVector(x0, y0, dx, dy) {
  const x1 = x0 + dx;
  const y1 = y0 + dy;
  line(x0, y0, x1, y1);
  push();
  translate(x1, y1);
  const a = atan2(dy, dx);
  rotate(a);
  const arrowSize = 9;
  triangle(0, 0, -arrowSize * 1.6, -arrowSize / 2, -arrowSize * 1.6, arrowSize / 2);
  pop();
}

function drawReadouts(Ax, Ay, magA, angADeg, Bx, By, magB, angBDeg, Rx, Ry) {
  const px = canvasWidth * 0.66;
  let py = 45;
  const lineH = 19;

  fill(245);
  stroke(200);
  strokeWeight(1);
  rect(px - 15, py - 15, min(canvasWidth * 0.32, 300), 8 * lineH + 15, 8);

  noStroke();
  fill('#1565C0');
  textAlign(LEFT, TOP);
  textSize(13);
  text('A: |A| = ' + magA.toFixed(1) + ', θ = ' + angADeg + '°', px, py);
  py += lineH;
  text('Ax = ' + Ax.toFixed(2) + ',  Ay = ' + (-Ay).toFixed(2), px, py);
  py += lineH * 1.3;

  fill('#2E7D32');
  text('B: |B| = ' + magB.toFixed(1) + ', θ = ' + angBDeg + '°', px, py);
  py += lineH;
  text('Bx = ' + Bx.toFixed(2) + ',  By = ' + (-By).toFixed(2), px, py);
  py += lineH * 1.3;

  const magR = sqrt(Rx * Rx + Ry * Ry);
  const angR = (degrees(atan2(-Ry, Rx)) + 360) % 360;
  fill('#C62828');
  text('R = A + B: |R| = ' + magR.toFixed(2) + ', θ = ' + angR.toFixed(1) + '°', px, py);
  py += lineH;
  text('Rx = ' + Rx.toFixed(2) + ',  Ry = ' + (-Ry).toFixed(2), px, py);
}

function drawControlLabels(magA, angADeg, magB, angBDeg) {
  fill('black');
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(13);
  text('|A| = ' + magA.toFixed(1), 155, drawHeight + 27);
  text('θA = ' + angADeg + '°', 155, drawHeight + 57);
  text('|B| = ' + magB.toFixed(1), 155, drawHeight + 87);
  text('θB = ' + angBDeg + '°', 155, drawHeight + 117);
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
