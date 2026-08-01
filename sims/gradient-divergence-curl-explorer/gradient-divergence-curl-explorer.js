// Gradient, Divergence, and Curl Explorer MicroSim
// Lets students switch between the three vector-calculus operators
// introduced in Chapter 1 and see how each transforms a preset scalar or
// vector field, with a numeric readout of the analytic result.
// Bloom Level: Understand (L2) - interpret, distinguish
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 400;
let minDrawHeight = 400;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 20;
let modeSelect, fieldSelect;

const GRADIENT_FIELDS = [
  { label: 'Bowl: V = x² + y²', V: (x, y) => x * x + y * y, grad: (x, y) => [2 * x, 2 * y] },
  { label: 'Saddle: V = x² − y²', V: (x, y) => x * x - y * y, grad: (x, y) => [2 * x, -2 * y] }
];

const DIVERGENCE_FIELDS = [
  { label: 'Source (outward): F = (x, y)', F: (x, y) => [x, y], div: 2 },
  { label: 'Sink (inward): F = (−x, −y)', F: (x, y) => [-x, -y], div: -2 },
  { label: 'Uniform: F = (1, 0)', F: (x, y) => [1, 0], div: 0 }
];

const CURL_FIELDS = [
  { label: 'Rotational (CCW): F = (−y, x)', F: (x, y) => [-y, x], curl: 2 },
  { label: 'Radial: F = (x, y)', F: (x, y) => [x, y], curl: 0 },
  { label: 'Uniform: F = (1, 0)', F: (x, y) => [1, 0], curl: 0 }
];

function fieldsForMode(mode) {
  if (mode === 'Gradient') return GRADIENT_FIELDS;
  if (mode === 'Divergence') return DIVERGENCE_FIELDS;
  return CURL_FIELDS;
}

function setup() {
  updateCanvasSize();
  var mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  modeSelect = createSelect();
  ['Gradient', 'Divergence', 'Curl'].forEach(m => modeSelect.option(m));
  modeSelect.changed(refreshFieldOptions);
  modeSelect.attribute('aria-label', 'Vector calculus operator');

  fieldSelect = createSelect();
  fieldSelect.changed(() => redraw());
  fieldSelect.attribute('aria-label', 'Preset field');
  refreshFieldOptions();

  positionUIElements();

  describe('Selector-driven visualization comparing gradient, divergence, and curl on preset scalar and vector fields', LABEL);

  noLoop(); // redraw only when a control changes, to save CPU/battery

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function refreshFieldOptions() {
  fieldSelect.html('');
  fieldsForMode(modeSelect.value()).forEach(f => fieldSelect.option(f.label));
  redraw();
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  modeSelect.position(mainRect.left + 110, mainRect.top + drawHeight + 15);
  fieldSelect.position(mainRect.left + 110, mainRect.top + drawHeight + 50);
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
  text('Gradient, Divergence, and Curl Explorer', canvasWidth / 2, 10);

  const mode = modeSelect.value();
  const fields = fieldsForMode(mode);
  let field = fields.find(f => f.label === fieldSelect.value());
  if (!field) field = fields[0];

  const originX = canvasWidth / 2;
  const originY = drawHeight / 2 + 15;
  const worldRange = 3;
  const scalePx = min(60, (canvasWidth * 0.7) / (2 * worldRange));

  if (mode === 'Gradient') {
    drawGradientMode(field, originX, originY, scalePx, worldRange);
  } else if (mode === 'Divergence') {
    drawVectorFieldMode(field, originX, originY, scalePx, worldRange, 'div', field.div);
  } else {
    drawVectorFieldMode(field, originX, originY, scalePx, worldRange, 'curl', field.curl);
  }

  drawControlLabels(mode);
}

function drawGradientMode(field, originX, originY, scalePx, worldRange) {
  // Background tint based on normalized scalar value (blue = low, red = high)
  let maxV = 0;
  for (let gx = -worldRange; gx <= worldRange; gx += 0.25) {
    for (let gy = -worldRange; gy <= worldRange; gy += 0.25) {
      maxV = max(maxV, abs(field.V(gx, gy)));
    }
  }
  noStroke();
  const cell = 10;
  for (let px = margin; px < canvasWidth - margin; px += cell) {
    for (let py = 40; py < drawHeight - 20; py += cell) {
      const wx = (px - originX) / scalePx;
      const wy = -(py - originY) / scalePx;
      const v = field.V(wx, wy) / maxV; // -1..1 roughly
      const c = divergingColor(v);
      fill(c);
      rect(px, py, cell, cell);
    }
  }

  drawAxes(originX, originY, worldRange, scalePx);

  // Gradient arrows at grid points
  stroke(20);
  strokeWeight(2);
  fill(20);
  for (let gx = -worldRange; gx <= worldRange; gx += 1) {
    for (let gy = -worldRange; gy <= worldRange; gy += 1) {
      const [gxv, gyv] = field.grad(gx, gy);
      const mag = sqrt(gxv * gxv + gyv * gyv);
      if (mag < 0.05) continue;
      const len = constrain(mag * 6, 6, 26);
      const ux = gxv / mag;
      const uy = gyv / mag;
      const px = originX + gx * scalePx;
      const py = originY - gy * scalePx;
      drawArrow(px, py, px + ux * len, py - uy * len);
    }
  }

  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(13);
  text('Arrows show ∇V (direction of steepest increase)', margin, drawHeight - 22);
}

function drawVectorFieldMode(field, originX, originY, scalePx, worldRange, kind, value) {
  fill(255);
  noStroke();

  drawAxes(originX, originY, worldRange, scalePx);

  // Uniform background tint by sign of the (constant, analytic) divergence/curl
  if (value !== 0) {
    const col = kind === 'div'
      ? (value > 0 ? color(229, 57, 53, 35) : color(30, 136, 229, 35))
      : color(126, 87, 194, 35);
    fill(col);
    noStroke();
    rect(margin, 40, canvasWidth - 2 * margin, drawHeight - 60);
  }

  stroke(20);
  strokeWeight(2);
  fill(20);
  for (let gx = -worldRange; gx <= worldRange; gx += 1) {
    for (let gy = -worldRange; gy <= worldRange; gy += 1) {
      const [fx, fy] = field.F(gx, gy);
      const mag = sqrt(fx * fx + fy * fy);
      if (mag < 0.05) continue;
      const len = constrain(mag * 10, 8, 26);
      const ux = fx / mag;
      const uy = fy / mag;
      const px = originX + gx * scalePx;
      const py = originY - gy * scalePx;
      drawArrow(px, py, px + ux * len, py - uy * len);
    }
  }

  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(13);
  if (kind === 'div') {
    text('∇·F = ' + value + (value > 0 ? '  (source: red tint)' : value < 0 ? '  (sink: blue tint)' : '  (no source or sink)'), margin, drawHeight - 22);
  } else {
    text('∇×F (z-component) = ' + value + (value !== 0 ? '  (rotational: purple tint)' : '  (no rotation)'), margin, drawHeight - 22);
  }
}

function divergingColor(v) {
  v = constrain(v, -1, 1);
  if (v >= 0) {
    return lerpColor(color(255, 255, 255), color(229, 57, 53), v);
  }
  return lerpColor(color(255, 255, 255), color(30, 136, 229), -v);
}

function drawAxes(originX, originY, worldRange, scalePx) {
  stroke(150);
  strokeWeight(1);
  line(originX - worldRange * scalePx, originY, originX + worldRange * scalePx, originY);
  line(originX, originY - worldRange * scalePx, originX, originY + worldRange * scalePx);
}

function drawArrow(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
  push();
  translate(x2, y2);
  const a = atan2(y2 - y1, x2 - x1);
  rotate(a);
  const arrowSize = 5;
  triangle(0, 0, -arrowSize * 1.6, -arrowSize / 2, -arrowSize * 1.6, arrowSize / 2);
  pop();
}

function drawControlLabels(mode) {
  fill('black');
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(13);
  text('Operator:', 100, drawHeight + 27);
  text('Field:', 100, drawHeight + 62);
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
