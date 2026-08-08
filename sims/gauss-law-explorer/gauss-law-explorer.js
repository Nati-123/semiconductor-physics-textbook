// Gauss's Law Explorer MicroSim
// Shows a spherical (2D cross-section) Gaussian surface around a point
// charge and demonstrates that total electric flux depends only on the
// enclosed charge, not on the surface's radius, and drops to zero when the
// charge lies outside the surface.
// Bloom Level: Apply (L3) - calculate, verify
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 360;
let controlHeight = 122;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 20;
let radiusSlider, chargeSlider, toggleButton;
let chargeInside = true;

const K = 8.99e9;
const EPS0 = 8.854e-12;
const NC = 1e-9;
const NM = 1e-9;
const MAX_R_NM = 5;          // matches radiusSlider max — used to size the
                              // diagram so nothing can ever spill past the
                              // canvas edge, at any slider setting
const ARROW_PAD_IN = 25;     // how far field arrows extend past the surface (charge inside)
const ARROW_PAD_OUT = 1.6;   // field-arrow outer-radius multiplier (charge outside)

function setup() {
  updateCanvasSize();
  var mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  radiusSlider = createSlider(1, MAX_R_NM, 2.5, 0.1);
  radiusSlider.size(180);
  radiusSlider.input(() => redraw());
  radiusSlider.attribute('aria-label', 'Gaussian surface radius in nanometers');
  chargeSlider = createSlider(-5, 5, 3, 0.5);
  chargeSlider.size(180);
  chargeSlider.input(() => redraw());
  chargeSlider.attribute('aria-label', 'Enclosed charge in nanocoulombs');

  toggleButton = createButton('Move Charge Outside');
  toggleButton.mousePressed(() => {
    chargeInside = !chargeInside;
    toggleButton.html(chargeInside ? 'Move Charge Outside' : 'Move Charge Inside');
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
  radiusSlider.position(mainRect.left + 190, mainRect.top + drawHeight + 14);
  chargeSlider.position(mainRect.left + 190, mainRect.top + drawHeight + 44);
  const btnX = Math.min(190, mainRect.width - 180);
  toggleButton.position(mainRect.left + btnX, mainRect.top + drawHeight + 74);
}

function readoutBoxWidth() {
  return constrain(canvasWidth * 0.34, 150, 300);
}

// Diagram geometry, recomputed every draw() from the current canvasWidth.
// scalePx is sized so that even at the slider's MAXIMUM radius (5 nm) with
// the charge inside, the surface circle, its field arrows, and the "Move
// Charge Outside Surface" position all stay fully within the canvas —
// not just at the currently-selected radius.
function computeGeometry() {
  const plotTop = 40;
  const plotBottom = drawHeight - 14;
  const cy = plotTop + (plotBottom - plotTop) / 2;
  const cx = canvasWidth * 0.33;

  const boxW = readoutBoxWidth();
  const readoutLeftX = canvasWidth - boxW - 27;

  const vClearance = 40; // room reserved above/below for arrow tips + the surface label
  const scalePxByHeight = ((plotBottom - plotTop) / 2 - vClearance) / MAX_R_NM;

  const scalePxByLeftW = (cx - margin - ARROW_PAD_IN) / MAX_R_NM;
  // Right side must fit the surface AND (when toggled) the charge re-drawn
  // further right at cx + r + 70, plus its own outward field arrows.
  const scalePxByRightW = (readoutLeftX - cx - 70 - 40) / (MAX_R_NM * (1 + ARROW_PAD_OUT));

  const scalePx = constrain(min(scalePxByHeight, scalePxByLeftW, scalePxByRightW), 10, 50);

  return { plotTop, plotBottom, cx, cy, scalePx, boxW, readoutLeftX };
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

  const geo = computeGeometry();
  const cx = geo.cx, cy = geo.cy, scalePx = geo.scalePx;
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

  // Short, non-numeric label (the numeric value already lives in the
  // control panel and stats box) placed beyond the field-arrow tips so it
  // can never intersect them, regardless of radius or charge sign.
  noStroke();
  fill('#5A3EED');
  textAlign(CENTER, BOTTOM);
  textSize(12);
  text('Gaussian surface', cx, cy - rPx - ARROW_PAD_IN - 6);

  const q = qnC * NC;
  const r = rNm * NM;
  const fluxInside = q / EPS0;
  const E_at_surface = K * abs(qnC * NC) / (r * r);

  drawReadouts(qnC, rNm, fluxInside, E_at_surface, geo);
  drawControlLabels(qnC, rNm);
}

function drawChargeAndField(qx, qy, qnC, rPx, isInside) {
  const rInner = 22;
  const rOuter = isInside ? rPx + ARROW_PAD_IN : rPx * ARROW_PAD_OUT;

  // Field lines radiating from the charge
  if (qnC !== 0) {
    const outward = qnC > 0;
    stroke(qnC > 0 ? '#E53935' : '#1E88E5');
    strokeWeight(1.5);
    const nDirs = 16;
    for (let i = 0; i < nDirs; i++) {
      const a = (TWO_PI / nDirs) * i;
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

  // "q" label placed beyond the outward field-arrow tips (same logic as the
  // surface label) so it never overlaps the charge or the radiating lines.
  fill(0);
  textSize(11);
  textAlign(CENTER, TOP);
  text('q', qx, qy + rOuter + 6);
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

function drawReadouts(qnC, rNm, fluxInside, E_at_surface, geo) {
  const boxW = geo.boxW;
  const px = canvasWidth - boxW - 15;
  const fs = canvasWidth < 500 ? 10 : 13;
  const lineH = fs * 1.9;
  const textW = boxW - 22;
  let py = 42;

  const nLines = chargeInside ? 5 : 4;
  fill(245);
  stroke(200);
  strokeWeight(1);
  rect(px - 12, py - 16, boxW, nLines * lineH + 12, 8);

  // Short, single-line entries only — long combined strings were wrapping
  // to a second line on narrow canvases and colliding with the row below.
  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(fs);
  textWrap(WORD);
  text('Charge enclosed: ' + (chargeInside ? 'Yes' : 'No'), px, py, textW);
  py += lineH;
  if (chargeInside) {
    fill('#B45309');
    text('E = ' + formatSci(E_at_surface) + ' V/m', px, py, textW);
    py += lineH;
    fill('#B45309');
    text('E depends on r', px, py, textW);
    py += lineH;
    fill('#2E7D32');
    text('Φ = ' + formatSci(fluxInside) + ' V·m', px, py, textW);
    py += lineH;
    fill('#2E7D32');
    text('Φ independent of r', px, py, textW);
  } else {
    fill(20);
    text('Q_enc = 0', px, py, textW);
    py += lineH;
    fill('#2E7D32');
    text('Φ = 0 V·m', px, py, textW);
    py += lineH;
    fill(20);
    text('Lines in = lines out', px, py, textW);
  }
}

function drawControlLabels(qnC, rNm) {
  fill('black');
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(13);
  text('Radius r = ' + rNm.toFixed(1) + ' nm', 185, drawHeight + 26);
  text('Charge q = ' + qnC.toFixed(1) + ' nC', 185, drawHeight + 56);

  fill('#666');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Drag the radius or charge, or toggle the charge outside the surface.', 20, drawHeight + 98, canvasWidth - 40);
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
