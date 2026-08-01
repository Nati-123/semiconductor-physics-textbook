// Electric Field and Flux Explorer MicroSim
// Shows the radial electric field of a point charge together with a small
// flat test surface whose tilt angle can be adjusted, so students can see
// Phi_E = E * A * cos(theta) range from maximum to zero.
// Bloom Level: Apply (L3) - calculate
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 380;
let minDrawHeight = 380;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 20;
let qSlider, dSlider, thetaSlider;

const K = 8.99e9;
const NC = 1e-9;
const NM = 1e-9;
const AREA_NM2 = 4; // fixed test-surface area, in nm^2 (a 2 nm x 2 nm square)

function setup() {
  updateCanvasSize();
  var mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  qSlider = createSlider(-5, 5, 3, 0.5);
  qSlider.size(180);
  qSlider.input(() => redraw());
  qSlider.attribute('aria-label', 'Charge q in nanocoulombs');
  dSlider = createSlider(1, 5, 2.5, 0.1);
  dSlider.size(180);
  dSlider.input(() => redraw());
  dSlider.attribute('aria-label', 'Distance d in nanometers');
  thetaSlider = createSlider(0, 90, 0, 1);
  thetaSlider.size(180);
  thetaSlider.input(() => redraw());
  thetaSlider.attribute('aria-label', 'Angle theta in degrees between field and surface normal');

  positionUIElements();

  describe('Point charge with radiating electric field and a tiltable flat test surface showing how electric flux depends on the angle between the field and the surface normal', LABEL);

  noLoop(); // redraw only when a control changes, to save CPU/battery

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  qSlider.position(mainRect.left + 190, mainRect.top + drawHeight + 15);
  dSlider.position(mainRect.left + 190, mainRect.top + drawHeight + 45);
  thetaSlider.position(mainRect.left + 190, mainRect.top + drawHeight + 75);
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
  text('Electric Field and Flux Explorer', canvasWidth / 2, 10);

  const qnC = qSlider.value();
  const dNm = dSlider.value();
  const thetaDeg = thetaSlider.value();
  const theta = radians(thetaDeg);

  const cx = canvasWidth * 0.38;
  const cy = drawHeight / 2 + 10;
  const scalePx = min(55, (canvasWidth * 0.55) / (2 * 5.5));

  // Draw radiating field arrows around the charge (radial, 1/r^2 magnitude)
  drawFieldLines(cx, cy, qnC, scalePx);

  // Draw the charge
  drawCharge(cx, cy, qnC);

  // Test surface positioned at distance d along +x from the charge
  const surfX = cx + dNm * scalePx;
  const surfY = cy;
  drawSurface(surfX, surfY, theta);

  // Physics: E at the surface location (SI units), area fixed at AREA_NM2 (nm^2 -> m^2)
  const q = qnC * NC;
  const d = dNm * NM;
  const E = K * q / (d * d);              // signed V/m, positive points away from + charge
  const A = AREA_NM2 * (NM * NM);          // m^2
  const flux = E * A * cos(theta);         // V*m (equivalent to N*m^2/C)

  drawReadouts(E, thetaDeg, flux);
  drawControlLabels(qnC, dNm, thetaDeg);
}

function drawFieldLines(cx, cy, qnC, scalePx) {
  if (qnC === 0) return; // no field to draw for zero charge
  const outward = qnC > 0;
  stroke(qnC > 0 ? '#E53935' : '#1E88E5');
  strokeWeight(1.5);
  fill(qnC > 0 ? '#E53935' : '#1E88E5');
  const nDirs = 12;
  for (let i = 0; i < nDirs; i++) {
    const a = (TWO_PI / nDirs) * i;
    const rInner = 30;
    const rOuter = 85;
    const x1 = cx + rInner * cos(a);
    const y1 = cy + rInner * sin(a);
    const x2 = cx + rOuter * cos(a);
    const y2 = cy + rOuter * sin(a);
    if (outward) {
      drawArrow(x1, y1, x2, y2);
    } else {
      drawArrow(x2, y2, x1, y1);
    }
  }
}

function drawCharge(x, y, qnC) {
  const isPos = qnC > 0;
  const isZero = qnC === 0;
  fill(isZero ? '#9E9E9E' : (isPos ? '#E53935' : '#1E88E5'));
  stroke(0);
  strokeWeight(1.5);
  circle(x, y, 38);
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(17);
  text(isZero ? '0' : (isPos ? '+' : '−'), x, y - 1);
  fill(0);
  textSize(12);
  textAlign(CENTER, TOP);
  text('q = ' + qnC.toFixed(1) + ' nC', x, y + 24);
}

function drawSurface(x, y, theta) {
  // The surface normal makes angle "theta" with the radial (horizontal) field
  // direction. theta = 0 => surface perpendicular to field (normal horizontal,
  // surface drawn vertical). theta = 90 => surface parallel to field.
  const halfLen = 46;
  const normalAngle = theta;         // angle of the normal from horizontal
  const surfaceAngle = normalAngle + HALF_PI; // surface segment is perpendicular to its normal

  const sx1 = x - halfLen * cos(surfaceAngle);
  const sy1 = y - halfLen * sin(surfaceAngle);
  const sx2 = x + halfLen * cos(surfaceAngle);
  const sy2 = y + halfLen * sin(surfaceAngle);

  stroke('#2E7D32');
  strokeWeight(4);
  line(sx1, sy1, sx2, sy2);

  // normal vector arrow
  stroke('#333');
  strokeWeight(2);
  fill('#333');
  const nLen = 40;
  drawArrow(x, y, x + nLen * cos(normalAngle), y + nLen * sin(normalAngle));

  noStroke();
  fill('#2E7D32');
  textAlign(CENTER, TOP);
  textSize(12);
  text('test surface', x, y + 30);
}

function drawArrow(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
  push();
  translate(x2, y2);
  const a = atan2(y2 - y1, x2 - x1);
  rotate(a);
  const arrowSize = 7;
  triangle(0, 0, -arrowSize * 1.6, -arrowSize / 2, -arrowSize * 1.6, arrowSize / 2);
  pop();
}

function drawReadouts(E, thetaDeg, flux) {
  const px = canvasWidth * 0.66;
  let py = 45;
  const lineH = 22;

  fill(245);
  stroke(200);
  strokeWeight(1);
  rect(px - 15, py - 15, min(canvasWidth * 0.32, 300), 5 * lineH + 15, 8);

  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(13);
  text('E at surface = ' + formatSci(E) + ' V/m', px, py);
  py += lineH;
  text('Surface area A = ' + AREA_NM2 + ' nm²', px, py);
  py += lineH;
  text('θ (field to normal) = ' + thetaDeg + '°', px, py);
  py += lineH;
  text('cos θ = ' + cos(radians(thetaDeg)).toFixed(3), px, py);
  py += lineH;
  text('Φ = E·A·cos θ = ' + formatSci(flux) + ' V·m', px, py);
}

function drawControlLabels(qnC, dNm, thetaDeg) {
  fill('black');
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(13);
  text('Charge q = ' + qnC.toFixed(1) + ' nC', 185, drawHeight + 27);
  text('Distance d = ' + dNm.toFixed(1) + ' nm', 185, drawHeight + 57);
  text('Angle θ = ' + thetaDeg + '°', 185, drawHeight + 87);
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
