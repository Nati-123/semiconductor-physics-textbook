// Melting Point & Thermal Processing Comparison MicroSim
// Three clickable thermometer bars (Si, Ge, GaAs) showing melting point
// and an engineering note about processing implications.
// Bloom Level: Evaluate (L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 380;
let controlHeight = 30;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

const MATERIALS = [
  { name: 'Silicon', melt: 1414, note: 'High melting point gives silicon a wide thermal processing window, tolerating the high-temperature oxidation and dopant-diffusion steps standard IC fabrication relies on.', col: [90, 140, 220] },
  { name: 'Germanium', melt: 938, note: 'A much lower melting point limits germanium\'s thermal budget during processing, one reason silicon displaced germanium as the dominant IC material.', col: [90, 180, 120] },
  { name: 'GaAs', melt: 1238, note: 'GaAs has a respectable melting point, but arsenic evaporates preferentially at high temperature and the crystal is mechanically brittle, requiring specialized growth (e.g. liquid-encapsulated Czochralski).', col: [230, 140, 60] }
];
const MAX_TEMP = 1600;
let selectedIdx = 0;
let bars = [];

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);
  describe('Melting point and thermal processing comparison: three clickable thermometer bars for silicon, germanium, and gallium arsenide with processing implication notes', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Melting Point Comparison (click a thermometer)', canvasWidth / 2, 8);

  const thermoW = 44, thermoH = drawHeight - 220;
  const gap = (canvasWidth - MATERIALS.length * thermoW) / (MATERIALS.length + 1);
  bars = [];

  for (let i = 0; i < MATERIALS.length; i++) {
    const m = MATERIALS[i];
    const x = gap + i * (thermoW + gap);
    const y = 60;
    const frac = m.melt / MAX_TEMP;
    smlDrawThermometer(x, y, thermoW, thermoH, frac, m.name + '\n' + m.melt + ' °C');
    if (i === selectedIdx) {
      noFill(); stroke(90, 62, 237); strokeWeight(2);
      rect(x - 4, y - 4, thermoW + 8, thermoH + 40, 8);
    }
    bars.push({ x: x - 6, y: y - 6, w: thermoW + 12, h: thermoH + 30 });
  }

  drawNoteCard(MATERIALS[selectedIdx]);
}

function drawNoteCard(mat) {
  const cardY = drawHeight - 130;
  const cardW = min(640, canvasWidth - 60);
  const cardX = canvasWidth / 2 - cardW / 2;
  const cardH = 110;
  noStroke();
  fill(240, 245, 255);
  stroke(168, 200, 255);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke();
  fill('#5A3EED');
  textAlign(LEFT, TOP);
  textSize(15);
  text(mat.name + ' — Melting Point ' + mat.melt + ' °C', cardX + 16, cardY + 12);
  fill(50);
  textSize(12.5);
  text(mat.note, cardX + 16, cardY + 38, cardW - 32);
}

function mousePressed() {
  for (let i = 0; i < bars.length; i++) {
    const b = bars[i];
    if (smlPointInRect(mouseX, mouseY, b.x, b.y, b.w, b.h)) {
      selectedIdx = i;
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
}
