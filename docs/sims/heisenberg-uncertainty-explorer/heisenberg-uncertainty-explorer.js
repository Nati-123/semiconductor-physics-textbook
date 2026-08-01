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
let minDrawHeight = 400;
let controlHeight = 100;
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

  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Heisenberg Uncertainty Principle Explorer', canvasWidth / 2, 10);

  const dx = Math.pow(10, dxSlider.value());
  const dp = HBAR / (2 * dx);
  const m = PARTICLE_MASS[particleSelect.value()];
  const dv = dp / m;

  // Normalized slider fraction 0..1 (0 = smallest dx, 1 = largest dx)
  const frac = (dxSlider.value() - DX_MIN_EXP) / (DX_MAX_EXP - DX_MIN_EXP);

  drawPositionPacket(frac, dx);
  drawMomentumSpread(frac, dp);
  drawReadouts(dx, dp, dv);
  drawControlLabels(dx);
}

function drawPositionPacket(frac, dx) {
  const cx = canvasWidth / 2;
  const cy = 110;
  const plotW = canvasWidth - 2 * margin;
  // width in pixels: narrow (12px) when dx is smallest, wide (plotW*0.42) when dx is largest
  const sigmaPx = lerp(10, plotW * 0.42, frac);

  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(13);
  text('Position wave packet  ψ(x)  —  width ∝ Δx', margin, cy - 75);

  stroke('#1E88E5');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let px = margin; px <= canvasWidth - margin; px += 4) {
    const xx = px - cx;
    const yy = 60 * Math.exp(-(xx * xx) / (2 * sigmaPx * sigmaPx));
    vertex(px, cy - yy);
  }
  endShape();

  stroke(180);
  strokeWeight(1);
  line(margin, cy, canvasWidth - margin, cy);

  noStroke();
  fill('#1E88E5');
  textAlign(CENTER, TOP);
  textSize(12);
  text('Δx = ' + formatMeters(dx), cx, cy + 10);
}

function drawMomentumSpread(frac, dp) {
  const cx = canvasWidth / 2;
  const cy = 250;
  const plotW = canvasWidth - 2 * margin;
  // inverse relationship: wide (plotW*0.42) when dx is smallest (frac=0), narrow (12px) when dx is largest
  const sigmaPx = lerp(plotW * 0.42, 10, frac);

  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(13);
  text('Momentum spread  φ(p)  —  width ∝ Δp (inverse of Δx)', margin, cy - 75);

  stroke('#E53935');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let px = margin; px <= canvasWidth - margin; px += 4) {
    const xx = px - cx;
    const yy = 60 * Math.exp(-(xx * xx) / (2 * sigmaPx * sigmaPx));
    vertex(px, cy - yy);
  }
  endShape();

  stroke(180);
  strokeWeight(1);
  line(margin, cy, canvasWidth - margin, cy);

  noStroke();
  fill('#E53935');
  textAlign(CENTER, TOP);
  textSize(12);
  text('Δp(min) = ' + formatSci(dp) + ' kg·m/s', cx, cy + 10);
}

function drawReadouts(dx, dp, dv) {
  const px = margin;
  const py = drawHeight - 45;
  fill(245);
  stroke(200);
  strokeWeight(1);
  rect(px - 10, py - 10, canvasWidth - 2 * margin + 20, 40, 8);
  noStroke();
  fill(20);
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Δx·Δp(min) = ħ/2 = ' + formatSci(HBAR / 2) + ' J·s   |   Δv(min) = ' + formatSci(dv) + ' m/s (' + particleSelect.value() + ')', px, py + 10);
}

function drawControlLabels(dx) {
  fill('black');
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(13);
  text('Δx:', 160, drawHeight + 27);
  text('Particle:', 160, drawHeight + 62);

  textAlign(LEFT, CENTER);
  text(formatMeters(dx), 360, drawHeight + 27);
}

function formatMeters(x) {
  const abs = Math.abs(x);
  if (abs >= 1e-12 && abs < 1e-9) return (x * 1e12).toFixed(2) + ' pm';
  if (abs >= 1e-9 && abs < 1e-6) return (x * 1e9).toFixed(2) + ' nm';
  if (abs >= 1e-6 && abs < 1e-3) return (x * 1e6).toFixed(2) + ' µm';
  return formatSci(x) + ' m';
}

function formatSci(x) {
  if (x === 0) return '0';
  const sign = x < 0 ? '-' : '';
  const ax = abs(x);
  const exp = Math.floor(Math.log10(ax));
  const mantissa = ax / Math.pow(10, exp);
  return sign + mantissa.toFixed(3) + ' x 10^' + exp;
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
