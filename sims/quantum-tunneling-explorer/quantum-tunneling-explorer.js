// Quantum Tunneling Probability Explorer MicroSim
// Lets students apply the simplified tunneling-probability approximation
// T ~= exp(-2*kappa*L) for an electron of fixed energy (1 eV) encountering
// a rectangular barrier of adjustable height ratio and width, and see a
// schematic wavefunction (oscillating - decaying - oscillating) alongside
// a live transmission-probability readout.
// Bloom Level: Apply / Understand (L3) - calculate, interpret
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 380;
let minDrawHeight = 380;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 30;
let ratioSlider, widthSlider;

const HBAR = 1.0546e-34;  // reduced Planck's constant, J*s
const ME = 9.109e-31;     // electron mass, kg
const EV = 1.602e-19;     // 1 eV in joules
const NM = 1e-9;          // nanometers -> meters
const E_FIXED = 1 * EV;   // fixed particle energy, 1 eV

function setup() {
  updateCanvasSize();
  var mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  ratioSlider = createSlider(1.1, 5, 2, 0.1);
  ratioSlider.size(180);
  ratioSlider.input(() => redraw());
  ratioSlider.attribute('aria-label', 'Barrier height ratio V0 over E');

  widthSlider = createSlider(0.1, 2, 0.5, 0.05);
  widthSlider.size(180);
  widthSlider.input(() => redraw());
  widthSlider.attribute('aria-label', 'Barrier width L in nanometers');

  positionUIElements();

  describe('Explorer showing a schematic wavefunction tunneling through a rectangular energy barrier, with a live transmission probability readout as barrier height and width change', LABEL);

  noLoop(); // redraw only when a control changes, to save CPU/battery

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  ratioSlider.position(mainRect.left + 170, mainRect.top + drawHeight + 15);
  widthSlider.position(mainRect.left + 170, mainRect.top + drawHeight + 50);
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
  text('Quantum Tunneling Probability Explorer', canvasWidth / 2, 10);

  const ratio = ratioSlider.value();
  const Lnm = widthSlider.value();
  const L = Lnm * NM;

  const V0minusE = (ratio - 1) * E_FIXED;
  const kappa = Math.sqrt(2 * ME * V0minusE) / HBAR; // 1/m
  const T = Math.exp(-2 * kappa * L);

  drawWaveSchematic(kappa, L, Lnm, T);
  drawReadouts(ratio, kappa, T);
  drawControlLabels(ratio, Lnm);
}

function drawWaveSchematic(kappa, L, Lnm, T) {
  const baseY = 130;
  const amp = 40;
  const x0 = margin + 10;
  const x1 = canvasWidth - margin - 10;
  const totalW = x1 - x0;

  // barrier width in pixels scales with the slider (0.1nm -> 40px, 2nm -> min(320, totalW*0.5))
  const maxBarrierPx = min(320, totalW * 0.5);
  const barrierPx = map(Lnm, 0.1, 2, 40, maxBarrierPx);
  const leftW = (totalW - barrierPx) * 0.55;
  const rightW = totalW - barrierPx - leftW;

  const bx0 = x0 + leftW;
  const bx1 = bx0 + barrierPx;

  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(13);
  text('Schematic wavefunction: incident+reflected (left) — decaying (barrier) — transmitted (right)', x0, 40);

  // barrier shading
  fill(255, 193, 7, 70);
  noStroke();
  rect(bx0, 60, barrierPx, drawHeight - 130);
  fill('#8D6E63');
  textAlign(CENTER, TOP);
  textSize(12);
  text('Barrier  L = ' + Lnm.toFixed(2) + ' nm', (bx0 + bx1) / 2, 64);

  // zero line
  stroke(180);
  strokeWeight(1);
  line(x0, baseY, x1, baseY);

  // Region 1: incident + reflected, oscillating amplitude 1
  const wavelenPx = 26;
  stroke('#1E88E5');
  strokeWeight(2.2);
  noFill();
  beginShape();
  for (let px = x0; px <= bx0; px += 2) {
    const y = baseY - amp * Math.sin((px - x0) / wavelenPx * TWO_PI);
    vertex(px, y);
  }
  endShape();

  // amplitude at barrier entrance (continuity)
  const ampAtEntry = amp;
  const entryPhase = (bx0 - x0) / wavelenPx * TWO_PI;
  const entryY = baseY - ampAtEntry * Math.sin(entryPhase);

  // Region 2: exponential decay inside barrier (envelope), drawn as a
  // symmetric decaying curve (upper and lower envelope) rather than an
  // oscillation, per the classically-forbidden-region physics.
  stroke('#E53935');
  strokeWeight(2.2);
  noFill();
  beginShape();
  for (let px = bx0; px <= bx1; px += 2) {
    const distIntoBarrier = (px - bx0) / barrierPx * L;
    const decay = Math.exp(-kappa * distIntoBarrier);
    const y = baseY - amp * decay;
    vertex(px, y);
  }
  endShape();
  beginShape();
  for (let px = bx0; px <= bx1; px += 2) {
    const distIntoBarrier = (px - bx0) / barrierPx * L;
    const decay = Math.exp(-kappa * distIntoBarrier);
    const y = baseY + amp * decay;
    vertex(px, y);
  }
  endShape();

  // Region 3: transmitted wave, amplitude scaled by sqrt(T) (never below a
  // small visible floor so the curve remains visible even for tiny T)
  const transAmp = amp * max(Math.sqrt(T), 0.03);
  stroke('#2E7D32');
  strokeWeight(2.2);
  noFill();
  beginShape();
  for (let px = bx1; px <= x1; px += 2) {
    const y = baseY - transAmp * Math.sin((px - bx1) / wavelenPx * TWO_PI);
    vertex(px, y);
  }
  endShape();

  noStroke();
  fill('#1E88E5');
  textAlign(CENTER, TOP);
  textSize(11);
  text('incident + reflected', (x0 + bx0) / 2, baseY + amp + 14);
  fill('#2E7D32');
  text('transmitted', (bx1 + x1) / 2, baseY + amp + 14);
}

function drawReadouts(ratio, kappa, T) {
  const px = margin;
  const py = drawHeight - 40;
  fill(245);
  stroke(200);
  strokeWeight(1);
  rect(px - 10, py - 22, canvasWidth - 2 * margin + 20, 60, 8);

  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(13);
  text('κ = ' + formatSci(kappa) + ' m⁻¹   |   T ≈ e^(−2κL) = ' + formatTPercent(T), px, py - 16);

  // T gauge bar (sqrt-scaled for visibility of tiny probabilities)
  const barX = px;
  const barY = py + 8;
  const barW = canvasWidth - 2 * margin;
  const barH = 14;
  const fillFrac = constrain(Math.sqrt(T), 0, 1);

  noFill();
  stroke(150);
  strokeWeight(1);
  rect(barX, barY, barW, barH, 6);
  noStroke();
  fill('#2E7D32');
  rect(barX, barY, barW * fillFrac, barH, 6);
  fill(20);
  textAlign(LEFT, TOP);
  textSize(10);
  text('Transmission probability gauge (√T scale, for visibility)', barX, barY + barH + 3);
}

function formatTPercent(T) {
  const pct = T * 100;
  if (pct >= 0.01) return pct.toFixed(2) + ' %';
  return formatSci(T) + '  (' + formatSci(pct) + ' %)';
}

function drawControlLabels(ratio, Lnm) {
  fill('black');
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(13);
  text('V₀ / E ratio:', 160, drawHeight + 27);
  text('Barrier width L:', 160, drawHeight + 62);

  textAlign(LEFT, CENTER);
  text(ratio.toFixed(1) + '  (V₀ = ' + ratio.toFixed(1) + ' eV, E = 1 eV)', 360, drawHeight + 27);
  text(Lnm.toFixed(2) + ' nm', 360, drawHeight + 62);
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
