// MEMS Structure Explorer MicroSim
// Adjusts cantilever length and thickness and computes the resulting
// spring constant, effective mass, and resonant frequency.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let lengthSlider, thickSlider;
const E = 170e9; // Pa, Young's modulus for silicon (approx)
const width = 10e-6; // m, fixed width
const rho = 2330; // kg/m^3, silicon density

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  lengthSlider = createSlider(20, 200, 100, 1);
  lengthSlider.attribute('aria-label', 'Cantilever length in micrometers');
  thickSlider = createSlider(0.5, 5, 2, 0.1);
  thickSlider.attribute('aria-label', 'Cantilever thickness in micrometers');

  positionUIElements();
  describe('MEMS structure explorer: adjusts cantilever length and thickness and computes the resulting spring constant, effective mass, and resonant frequency', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  lengthSlider.position(bx + 200, by + drawHeight + 16);
  lengthSlider.size(min(canvasWidth - 220 - 30, 300));
  thickSlider.position(bx + 200, by + drawHeight + 58);
  thickSlider.size(min(canvasWidth - 220 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const Lum = lengthSlider.value(), tum = thickSlider.value();
  const L = Lum * 1e-6, t = tum * 1e-6;
  const I = (width * pow(t, 3)) / 12;
  const k = (3 * E * I) / pow(L, 3);
  const m = rho * width * t * L;
  const f = (1 / (2 * PI)) * sqrt(k / m);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('MEMS Cantilever: Dimensions → Resonant Frequency', canvasWidth / 2, 8);

  const baseX = 80, baseY = 130, maxLen = 320, maxThick = 40;
  const drawLen = map(Lum, 20, 200, 60, maxLen);
  const drawThick = map(tum, 0.5, 5, 6, maxThick);

  noStroke(); fill(180);
  rect(baseX - 20, baseY - 30, 20, 60);
  fill(150, 130, 220);
  rect(baseX, baseY - drawThick / 2, drawLen, drawThick);
  fill(30); textAlign(CENTER, TOP); textSize(11);
  text('cantilever (fixed at left)', baseX + drawLen / 2, baseY + maxThick / 2 + 10);

  const infoY = 220;
  fill(30); textAlign(LEFT, TOP); textSize(13);
  text('Spring constant k ≈ ' + nfs(k, 0, 4) + ' N/m', 60, infoY);
  text('Effective mass m ≈ ' + nfs(m, 0, 4) + ' kg', 60, infoY + 24);
  fill(90, 62, 237); textSize(14.5);
  text('Resonant frequency f = (1/2π)√(k/m) ≈ ' + nfs(f, 0, 3) + ' Hz', 60, infoY + 52);

  drawControlLabels();
}

function drawControlLabels() {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Length ' + nf(lengthSlider.value(), 1, 0) + ' μm', 195, drawHeight + 16 + 9);
  text('Thickness ' + nf(thickSlider.value(), 1, 1) + ' μm', 195, drawHeight + 58 + 9);
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
