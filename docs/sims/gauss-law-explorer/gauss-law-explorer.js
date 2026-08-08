// Gauss's Law Explorer MicroSim
// Shows a spherical (2D cross-section) Gaussian surface around a point
// charge and demonstrates that total electric flux depends only on the
// enclosed charge, not on the surface's radius, and drops to zero when the
// charge lies outside the surface.
// Bloom Level: Apply (L3) - calculate, verify
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 380;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 20;
let radiusSlider, chargeSlider, toggleButton;
let chargeInside = true;

const K = 8.99e9;
const EPS0 = 8.854e-12;
const NC = 1e-9;
const NM = 1e-9;

function setup() {
  updateCanvasSize();
  var mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  radiusSlider = createSlider(1, 5, 2.5, 0.1);
  radiusSlider.size(180);
  radiusSlider.input(() => redraw());
  radiusSlider.attribute('aria-label', 'Gaussian surface radius in nanometers');
  chargeSlider = createSlider(-5, 5, 3, 0.5);
  chargeSlider.size(180);
  chargeSlider.input(() => redraw());
  chargeSlider.attribute('aria-label', 'Enclosed charge in nanocoulombs');

  toggleButton = createButton('Move Charge Outside Surface');
  toggleButton.mousePressed(() => {
    chargeInside = !chargeInside;
    toggleButton.html(chargeInside ? 'Move Charge Outside Surface' : 'Move Charge Inside Surface');
    redraw();
  });

  positionUIElements();

  describe('Gaussian surface of adjustable radius around a point charge, showing flux is radius-independent when the charge is enclosed and zero when it is not', LABEL);

  noLoop(); // redraw only when a control changes, to save CPU/battery

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const sliderW = constrain(mainRect.width - 190 - 20, 80, 180);
  radiusSlider.size(sliderW);
  chargeSlider.size(sliderW);
  radiusSlider.position(mainRect.left + 190, mainRect.top + drawHeight + 15);
  chargeSlider.position(mainRect.left + 190, mainRect.top + drawHeight + 45);
  const btnX = Math.min(190, mainRect.width - 180);
  toggleButton.position(mainRect.left + btnX, mainRect.top + drawHeight + 75);
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
  text("Gauss's Law Explorer", canvasWidth / 2, 10);

  const rNm = radiusSlider.value();
  const qnC = chargeSlider.value();

  const cx = canvasWidth * 0.36;
  const cy = drawHeight / 2 + 10;
  const scalePx = min(50, (canvasWidth * 0.55) / (2 * 6));
  const rPx = rNm * scalePx;

  // Gaussian surface (circle)
  noFill();
  stroke('#5A3EED');
  strokeWeight(2.5);
  circle(cx, cy, 2 * rPx);

  if (chargeInside) {
    drawChargeAndField(cx, cy, qnC, rPx, true);
  } else {
    const chargeX = cx + rPx + 70;
    drawChargeAndField(chargeX, cy, qnC, rPx, false);
  }

  noStroke();
  fill('#5A3EED');
  textAlign(LEFT, TOP);
  textSize(12);
  text('Gaussian surface, r = ' + rNm.toFixed(1) + ' nm', cx - rPx, cy - rPx - 16);

  const q = qnC * NC;
  const r = rNm * NM;
  const fluxInside = q / EPS0;
  const E_at_surface = K * abs(qnC * NC) / (r * r);

  drawReadouts(qnC, rNm, fluxInside, E_at_surface);
  drawControlLabels(qnC, rNm);
}

function drawChargeAndField(qx, qy, qnC, rPx, isInside) {
  // Field lines radiating from the charge
  if (qnC !== 0) {
    const outward = qnC > 0;
    stroke(qnC > 0 ? '#E53935' : '#1E88E5');
    strokeWeight(1.5);
    const nDirs = 16;
    for (let i = 0; i < nDirs; i++) {
      const a = (TWO_PI / nDirs) * i;
      const rInner = 22;
      const rOuter = isInside ? rPx + 25 : rPx * 1.6;
      const x1 = qx + rInner * cos(a);
      const y1 = qy + rInner * sin(a);
      const x2 = qx + rOuter * cos(a);
      const y2 = qy + rOuter * sin(a);
      if (outward) {
        drawArrow(x1, y1, x2, y2);
      } else {
        drawArrow(x2, y2, x1, y1);
      }
    }
  }

  // Charge
  const isPos = qnC > 0;
  const isZero = qnC === 0;
  fill(isZero ? '#9E9E9E' : (isPos ? '#E53935' : '#1E88E5'));
  stroke(0);
  strokeWeight(1.5);
  circle(qx, qy, 34);
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text(isZero ? '0' : (isPos ? '+' : '−'), qx, qy - 1);
  fill(0);
  textSize(11);
  textAlign(CENTER, TOP);
  text('q = ' + qnC.toFixed(1) + ' nC', qx, qy + 22);
}

function drawArrow(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
  push();
  translate(x2, y2);
  const a = atan2(y2 - y1, x2 - x1);
  rotate(a);
  const arrowSize = 6;
  triangle(0, 0, -arrowSize * 1.6, -arrowSize / 2, -arrowSize * 1.6, arrowSize / 2);
  pop();
}

function drawReadouts(qnC, rNm, fluxInside, E_at_surface) {
  const boxW = constrain(canvasWidth * 0.34, 150, 300);
  const px = canvasWidth - boxW - 15;
  const fs = canvasWidth < 500 ? 10 : 13;
  const lineH = fs * 2.1;
  const textW = boxW - 22;
  let py = 52;

  fill(245);
  stroke(200);
  strokeWeight(1);
  rect(px - 12, py - 20, boxW, 4 * lineH + 15, 8);

  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(fs);
  textWrap(WORD);
  text('Charge enclosed: ' + (chargeInside ? 'Yes' : 'No'), px, py, textW);
  py += lineH;
  if (chargeInside) {
    text('E at surface = ' + formatSci(E_at_surface) + ' V/m', px, py, textW);
    py += lineH;
    text('Φ = Q_enc / ε₀ = ' + formatSci(fluxInside) + ' V·m', px, py, textW);
    py += lineH;
    text('(changes only with q, not with r)', px, py, textW);
  } else {
    text('Q_enc = 0 (charge outside surface)', px, py, textW);
    py += lineH;
    text('Φ = Q_enc / ε₀ = 0 V·m', px, py, textW);
    py += lineH;
    text('(field lines that enter also exit)', px, py, textW);
  }
}

function drawControlLabels(qnC, rNm) {
  fill('black');
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(13);
  text('Radius r = ' + rNm.toFixed(1) + ' nm', 185, drawHeight + 27);
  text('Charge q = ' + qnC.toFixed(1) + ' nC', 185, drawHeight + 57);
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
