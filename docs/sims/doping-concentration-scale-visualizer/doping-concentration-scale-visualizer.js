// Doping Concentration Scale Visualizer MicroSim
// A log-scale axis from 10^10 to 10^23 cm^-3 with a fixed marker for
// silicon's atomic density and a slider-driven marker for dopant
// concentration N_D, plus a "1 dopant per N silicon atoms" readout.
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 400;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let expSlider;
const SI_DENSITY = 5.0e22; // atoms/cm^3
const LOG_MIN = 10, LOG_MAX = 23;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  expSlider = createSlider(13, 19, 16, 0.1);
  expSlider.attribute('aria-label', 'Doping concentration exponent (power of 10, per cm cubed)');

  positionUIElements();
  describe('Doping concentration scale visualizer: a logarithmic axis comparing dopant concentration to silicon atomic density, with a 1-in-N ratio readout', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  expSlider.position(bx + 220, by + drawHeight + 15);
  expSlider.size(min(canvasWidth - 240 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const exponent = expSlider.value();
  const ND = Math.pow(10, exponent);
  const ratio = SI_DENSITY / ND;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Doping Concentration vs. Silicon Atomic Density (log scale)', canvasWidth / 2, 8);

  const axX0 = 60, axX1 = canvasWidth - 60, axY = drawHeight * 0.42;
  function logToPx(v) { return map(Math.log10(v), LOG_MIN, LOG_MAX, axX0, axX1); }

  stroke(180); strokeWeight(2);
  line(axX0, axY, axX1, axY);
  noStroke(); fill(60); textAlign(CENTER, TOP); textSize(10);
  for (let e = LOG_MIN; e <= LOG_MAX; e += 1) {
    const x = logToPx(Math.pow(10, e));
    stroke(200); line(x, axY - 5, x, axY + 5);
    noStroke(); fill(80);
    if (e % 2 === 0) text('10^' + e, x, axY + 8);
  }

  // Silicon atomic density marker (fixed)
  const siX = logToPx(SI_DENSITY);
  stroke(90, 180, 120); strokeWeight(2);
  line(siX, axY - 40, siX, axY + 5);
  noStroke(); fill(90, 180, 120);
  textAlign(CENTER, BOTTOM); textSize(12);
  text('Si atomic density\n5×10²² cm⁻³', siX, axY - 44);

  // dopant concentration marker (movable)
  const ndX = logToPx(ND);
  stroke(90, 62, 237); strokeWeight(2);
  line(ndX, axY - 5, ndX, axY + 40);
  noStroke(); fill(90, 62, 237);
  textAlign(CENTER, TOP); textSize(12);
  text('N_D = 10^' + exponent.toFixed(1) + ' cm⁻³', ndX, axY + 44);

  drawRatioCard(ratio, exponent);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Doping concentration N_D:', 10, drawHeight + 20);
}

function drawRatioCard(ratio, exponent) {
  const cardY = drawHeight - 130, cardW = min(600, canvasWidth - 60), cardX = canvasWidth / 2 - cardW / 2, cardH = 90;
  noStroke();
  fill(240, 245, 255);
  stroke(168, 200, 255);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke();
  fill('#5A3EED');
  textAlign(CENTER, TOP); textSize(15);
  text('1 dopant atom per ~' + formatBig(ratio) + ' silicon atoms', cardX + cardW / 2, cardY + 14);
  fill(50); textSize(12.5);
  text('(N_D = 10^' + exponent.toFixed(1) + ' cm⁻³, silicon density = 5×10²² cm⁻³)', cardX + cardW / 2, cardY + 44);
  textAlign(CENTER, TOP);
  text('Even "heavily doped" silicon is still overwhelmingly silicon.', cardX + cardW / 2, cardY + 64);
}

function formatBig(x) {
  if (x >= 1e9) return (x / 1e9).toFixed(1) + ' billion';
  if (x >= 1e6) return (x / 1e6).toFixed(1) + ' million';
  if (x >= 1e3) return (x / 1e3).toFixed(1) + ' thousand';
  return x.toFixed(0);
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
