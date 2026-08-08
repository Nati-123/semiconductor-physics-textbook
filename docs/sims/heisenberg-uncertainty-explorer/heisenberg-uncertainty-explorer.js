// Heisenberg Uncertainty Principle Explorer MicroSim
// Lets students adjust the position uncertainty (dx) of an electron or
// proton and see the resulting minimum momentum uncertainty (dp) and
// velocity uncertainty (dv), visualized as two inversely-related Gaussian
// curves (position wave packet vs. momentum spread).
// Bloom Level: Understand / Apply (L2-L3) - interpret, calculate
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 400;
let controlHeight = 118;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 30;
let dxSlider, particleSelect;

const HBAR = 1.0546e-34; // reduced Planck's constant, J*s

const PARTICLE_MASS = {
  'Electron': 9.109e-31,
  'Proton': 1.673e-27
};

const DX_MIN_EXP = -12; // 1 pm
const DX_MAX_EXP = -6;  // 1 micron

const COLOR_DX = '#1E88E5';
const COLOR_DP = '#E53935';

function setup() {
  updateCanvasSize();
  var mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  dxSlider = createSlider(DX_MIN_EXP, DX_MAX_EXP, -10, 0.05);
  dxSlider.size(180);
  dxSlider.input(() => redraw());
  dxSlider.attribute('aria-label', 'Position uncertainty, log10 meters');

  particleSelect = createSelect();
  ['Electron', 'Proton'].forEach(p => particleSelect.option(p));
  particleSelect.changed(() => redraw());
  particleSelect.attribute('aria-label', 'Particle type');

  positionUIElements();

  describe('Explorer showing the inverse relationship between position uncertainty and momentum uncertainty required by the Heisenberg uncertainty principle', LABEL);

  noLoop(); // redraw only when a control changes, to save CPU/battery

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  dxSlider.position(mainRect.left + 170, mainRect.top + drawHeight + 15);
  particleSelect.position(mainRect.left + 170, mainRect.top + drawHeight + 50);
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

  const smallText = canvasWidth < 500;

  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(smallText ? 14 : 18);
  text('Heisenberg Uncertainty Principle Explorer', canvasWidth / 2, 8);

  const dx = Math.pow(10, dxSlider.value());
  const dp = HBAR / (2 * dx);
  const m = PARTICLE_MASS[particleSelect.value()];
  const dv = dp / m;

  // Normalized slider fraction 0..1 (0 = smallest dx, 1 = largest dx)
  const frac = (dxSlider.value() - DX_MIN_EXP) / (DX_MAX_EXP - DX_MIN_EXP);

  const geom = computeGeometry();
  drawPositionPacket(geom, frac, dx);
  drawInverseConnector(geom, frac);
  drawMomentumSpread(geom, frac, dp);
  drawReadouts(geom, dx, dp, dv);
  drawControlLabels(dx);
}

function computeGeometry() {
  const panelTop = 34;
  const packetCy = panelTop + 62;
  const connectorY = packetCy + 78;
  const spreadCy = connectorY + 78;
  return { packetCy, connectorY, spreadCy, plotW: canvasWidth - 2 * margin };
}

function drawPositionPacket(geom, frac, dx) {
  const cx = canvasWidth / 2;
  const cy = geom.packetCy;
  // width in pixels: narrow (10px) when dx is smallest, wide (plotW*0.42) when dx is largest
  const sigmaPx = lerp(10, geom.plotW * 0.42, frac);

  const smallText = canvasWidth < 500;
  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(smallText ? 11.5 : 13);
  text(smallText ? 'Position wave packet ψ(x)' : 'Position wave packet ψ(x) — width ∝ Δx', margin, cy - 52, canvasWidth - 2 * margin);

  stroke(180);
  strokeWeight(1);
  line(margin, cy, canvasWidth - margin, cy);

  stroke(COLOR_DX);
  strokeWeight(2.4);
  noFill();
  beginShape();
  for (let px = margin; px <= canvasWidth - margin; px += 4) {
    const xx = px - cx;
    const yy = 44 * Math.exp(-(xx * xx) / (2 * sigmaPx * sigmaPx));
    vertex(px, cy - yy);
  }
  endShape();

  // A width bracket under the curve makes "how wide is this, in pixels"
  // directly comparable to the momentum panel's bracket below.
  drawWidthBracket(cx, cy + 14, sigmaPx * 1.4, COLOR_DX);

  noStroke();
  fill(COLOR_DX);
  textAlign(CENTER, TOP);
  textSize(13);
  text('Δx = ' + formatMeters(dx), cx, cy + 30);
}

function drawMomentumSpread(geom, frac, dp) {
  const cx = canvasWidth / 2;
  const cy = geom.spreadCy;
  // inverse relationship: wide (plotW*0.42) when dx is smallest (frac=0), narrow (10px) when dx is largest
  const sigmaPx = lerp(geom.plotW * 0.42, 10, frac);

  const smallText = canvasWidth < 500;
  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(smallText ? 11.5 : 13);
  text(smallText ? 'Momentum spread φ(p)' : 'Momentum spread φ(p) — width ∝ Δp (inverse of Δx)', margin, cy - 52, canvasWidth - 2 * margin);

  stroke(180);
  strokeWeight(1);
  line(margin, cy, canvasWidth - margin, cy);

  stroke(COLOR_DP);
  strokeWeight(2.4);
  noFill();
  beginShape();
  for (let px = margin; px <= canvasWidth - margin; px += 4) {
    const xx = px - cx;
    const yy = 44 * Math.exp(-(xx * xx) / (2 * sigmaPx * sigmaPx));
    vertex(px, cy - yy);
  }
  endShape();

  drawWidthBracket(cx, cy + 14, sigmaPx * 1.4, COLOR_DP);

  noStroke();
  fill(COLOR_DP);
  textAlign(CENTER, TOP);
  textSize(13);
  text('Δp(min) = ' + formatSci(dp) + ' kg·m/s', cx, cy + 30);
}

// A small "I-beam" bracket showing the curve's width at a glance, so the
// two panels can be visually compared even before reading the numbers.
function drawWidthBracket(cx, y, halfWidth, col) {
  const hw = constrain(halfWidth, 8, canvasWidth / 2 - margin - 4);
  stroke(col);
  strokeWeight(1.5);
  line(cx - hw, y - 4, cx - hw, y + 4);
  line(cx + hw, y - 4, cx + hw, y + 4);
  line(cx - hw, y, cx + hw, y);
}

// A visual reminder, between the two panels, that they move in opposite
// directions -- immediately reinforces "narrower here means wider there."
function drawInverseConnector(geom, frac) {
  const cx = canvasWidth / 2;
  const y = geom.connectorY;
  noStroke();
  fill('#5A3EED');
  textAlign(CENTER, CENTER);
  textSize(13);
  text('narrower Δx  ⇕  broader Δp', cx, y);

  const arrowLen = 26;
  stroke('#5A3EED');
  strokeWeight(2);
  drawArrowV(cx - 90, y, -arrowLen);
  drawArrowV(cx + 90, y, arrowLen);
}

function drawArrowV(x, yCenter, dy) {
  const y1 = yCenter - dy / 2;
  const y2 = yCenter + dy / 2;
  line(x, y1, x, y2);
  push();
  translate(x, y2);
  rotate(dy > 0 ? HALF_PI : -HALF_PI);
  noStroke();
  fill('#5A3EED');
  triangle(0, 0, -5, -9, 5, -9);
  pop();
}

function drawReadouts(geom, dx, dp, dv) {
  const smallText = canvasWidth < 500;
  const px = margin;
  const boxH = smallText ? 70 : 44;
  const py = drawHeight - boxH - 8;
  const boxW = canvasWidth - 2 * margin;
  fill(245);
  stroke('#5A3EED');
  strokeWeight(1.5);
  rect(px, py, boxW, boxH, 8);

  noStroke();
  textAlign(LEFT, CENTER);
  textSize(smallText ? 12 : 15);

  if (smallText) {
    // Stacked: the flowing single-line layout used on wide screens would
    // overflow the canvas edge here, so each part gets its own line.
    fill(COLOR_DX);
    text('Δx = ' + formatMeters(dx), px + 14, py + 18);
    fill(20);
    text('×', px + 14 + textWidth('Δx = ' + formatMeters(dx)) + 8, py + 18);
    fill(COLOR_DP);
    text('Δp = ' + formatSci(dp), px + 14 + textWidth('Δx = ' + formatMeters(dx)) + 24, py + 18);
    fill(20);
    text('= ħ/2 = ' + formatSci(HBAR / 2) + ' J·s', px + 14, py + 46);
    return;
  }

  fill(COLOR_DX);
  let tx = px + 14;
  text('Δx = ' + formatMeters(dx), tx, py + 22);
  tx += textWidth('Δx = ' + formatMeters(dx)) + 18;

  fill(20);
  text('×', tx, py + 22);
  tx += 16;

  fill(COLOR_DP);
  text('Δp = ' + formatSci(dp), tx, py + 22);
  tx += textWidth('Δp = ' + formatSci(dp)) + 18;

  fill(20);
  text('= ħ/2 = ' + formatSci(HBAR / 2) + ' J·s', tx, py + 22);
}

function drawControlLabels(dx) {
  const stacked = canvasWidth < 650; // not enough room for the Δv note beside the dropdown
  fill('black');
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(13);
  text('Δx:', 160, drawHeight + 27);
  text('Particle:', 160, drawHeight + 62);

  textAlign(LEFT, CENTER);
  text(formatMeters(dx), 360, drawHeight + 27);

  const m = PARTICLE_MASS[particleSelect.value()];
  const dv = (HBAR / (2 * dx)) / m;
  fill('#666');
  textSize(11);
  if (stacked) {
    text('Δv(min) = ' + formatSci(dv) + ' m/s for the selected particle', 20, drawHeight + 90, canvasWidth - 40);
  } else {
    text('Δv(min) = ' + formatSci(dv) + ' m/s for the selected particle', 360, drawHeight + 62, canvasWidth - 380);
  }
}

function formatMeters(x) {
  const abs = Math.abs(x);
  if (abs >= 1e-12 && abs < 1e-9) return (x * 1e12).toFixed(2) + ' pm';
  if (abs >= 1e-9 && abs < 1e-6) return (x * 1e9).toFixed(2) + ' nm';
  if (abs >= 1e-6 && abs < 1e-3) return (x * 1e6).toFixed(2) + ' µm';
  return formatSci(x) + ' m';
}

const SUPERSCRIPT_DIGITS = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
function superscript(n) {
  return String(n).split('').map((ch) => SUPERSCRIPT_DIGITS[ch] || ch).join('');
}

function formatSci(x) {
  if (x === 0) return '0';
  const sign = x < 0 ? '-' : '';
  const ax = abs(x);
  const exp = Math.floor(Math.log10(ax));
  const mantissa = ax / Math.pow(10, exp);
  return sign + mantissa.toFixed(3) + ' × 10' + superscript(exp);
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
