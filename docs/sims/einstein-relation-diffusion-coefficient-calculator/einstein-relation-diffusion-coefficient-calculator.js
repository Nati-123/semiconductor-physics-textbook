// Einstein Relation and Diffusion Coefficient Calculator MicroSim
// Computes mobility via the same Matthiessen's-rule model used in
// Chapter 11, then applies the Einstein relation D = mu*kT/q (with kT/q
// in volts numerically equal to kT in eV) to compute the diffusion
// coefficient, plotted against temperature with a live marker.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let carrierSelect, ndExpSlider, tempSlider;
const KB_EV = 8.617e-5;

const CARRIERS = {
  'Electrons (n-type)': { muL0: 1350, muI0: 1965 },
  'Holes (p-type)': { muL0: 480, muI0: 800 }
};

function muLattice(muL0, T) { return muL0 * Math.pow(T / 300, -1.5); }
function muImpurity(muI0, T, N) { return muI0 * Math.pow(T / 300, 1.5) * (1e17 / N); }
function mobility(carrier, T, N) {
  const muL = muLattice(carrier.muL0, T), muI = muImpurity(carrier.muI0, T, N);
  return 1 / (1 / muL + 1 / muI);
}
function diffusionCoeff(mu, T) { return mu * (KB_EV * T); } // cm^2/s

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  carrierSelect = createSelect();
  Object.keys(CARRIERS).forEach(k => carrierSelect.option(k));
  carrierSelect.selected('Electrons (n-type)');
  carrierSelect.attribute('aria-label', 'Carrier type');

  ndExpSlider = createSlider(14, 19, 16, 0.1);
  ndExpSlider.attribute('aria-label', 'Doping concentration exponent');

  tempSlider = createSlider(150, 600, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');

  positionUIElements();
  describe('Einstein relation and diffusion coefficient calculator: computes mobility via Matthiessen\'s rule and the diffusion coefficient via the Einstein relation, plotted against temperature', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  carrierSelect.position(bx + 90, by + drawHeight + 12);
  ndExpSlider.position(bx + 150, by + drawHeight + 52);
  ndExpSlider.size(min(canvasWidth - 170 - 30, 300));
  tempSlider.position(bx + 150, by + drawHeight + 90);
  tempSlider.size(min(canvasWidth - 170 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const carrier = CARRIERS[carrierSelect.value()];
  const N = Math.pow(10, ndExpSlider.value());
  const T = tempSlider.value();
  const mu = mobility(carrier, T, N);
  const D = diffusionCoeff(mu, T);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Einstein Relation: D = μ·k_BT/q', canvasWidth / 2, 8);

  drawCard(mu, D, T);
  drawCurve(carrier, N, T, D);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Carrier:', 10, drawHeight + 18);
  text('N = 10^' + ndExpSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 58);
  text('Temperature = ' + T + ' K', 10, drawHeight + 96);
}

function drawCard(mu, D, T) {
  const cardX = 30, cardY = 44, cardW = canvasWidth * 0.42, cardH = drawHeight - 90;
  noStroke();
  fill(240, 245, 255);
  stroke(168, 200, 255);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke();
  fill(30);
  textAlign(LEFT, TOP);
  textSize(12.5);
  const lines = [
    'μ (Matthiessen, ' + T + ' K) = ' + mu.toFixed(0) + ' cm²/V·s',
    'k_BT = ' + (KB_EV * T).toFixed(4) + ' eV (= V equivalent)',
    'D = μ × k_BT/q',
    'D = ' + D.toFixed(2) + ' cm²/s'
  ];
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cardX + 16, cardY + 14 + i * 26, cardW - 32);
  }
}

function drawCurve(carrier, N, Tmark, Dmark) {
  const chartX = canvasWidth * 0.5, chartY = 50, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;
  const pts = [];
  for (let T = 150; T <= 600; T += 10) {
    const mu = mobility(carrier, T, N);
    pts.push({ x: T, y: diffusionCoeff(mu, T) });
  }
  const maxD = Math.max(...pts.map(p => p.y)) * 1.15;
  smlDrawLineChart(chartX, chartY, chartW, chartH, 150, 600, 0, maxD, [{ points: pts, color: color(90, 62, 237) }], {
    marker: { x: Tmark, y: Dmark },
    xLabel: 'Temperature (K)', yLabel: 'D (cm²/s)', yLabelOffset: 34
  });
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
}

function updateCanvasSize() {
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
}
