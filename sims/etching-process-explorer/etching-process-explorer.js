// Etching Process Explorer MicroSim
// Visualizes the etched cross-section profile under a fixed resist mask
// for wet, dry, or plasma etching, and computes the resulting anisotropy
// factor from vertical and lateral etch rates.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let etchSelect;

const ETCH_PRESETS = {
  'Wet Etching': { vertical: 150, lateral: 150 },
  'Dry Etching': { vertical: 180, lateral: 60 },
  'Plasma Etching': { vertical: 200, lateral: 10 }
};

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  etchSelect = createSelect();
  for (const k in ETCH_PRESETS) etchSelect.option(k);
  etchSelect.selected('Plasma Etching');
  etchSelect.attribute('aria-label', 'Etching type');

  positionUIElements();
  describe('Etching process explorer: visualizes the etched cross-section profile for wet, dry, or plasma etching and computes the resulting anisotropy factor', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  etchSelect.position(bx + 150, by + drawHeight + 16);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const preset = ETCH_PRESETS[etchSelect.value()];
  const anisotropy = 1 - preset.lateral / preset.vertical;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('Etch Cross-Section: ' + etchSelect.value(), canvasWidth / 2, 8);

  const cx = canvasWidth / 2;
  const filmY = 60, filmW = 300, filmH = 200, maskW = 60;
  const filmX = cx - filmW / 2;

  // background film (before etch, light color)
  noStroke(); fill(225, 225, 235);
  rect(filmX, filmY, filmW, filmH);

  // resist mask on top
  fill(255, 210, 90);
  rect(cx - maskW / 2, filmY - 22, maskW, 22);

  // etched cavity: depth proportional to vertical rate, undercut proportional to lateral rate
  const vDepth = map(preset.vertical, 0, 220, 0, filmH * 0.85);
  const lUndercut = map(preset.lateral, 0, 220, 0, maskW * 1.4);

  noStroke(); fill(255);
  beginShape();
  vertex(cx - maskW / 2, filmY);
  vertex(cx - maskW / 2 - lUndercut, filmY + vDepth * 0.15);
  vertex(cx - maskW / 2 - lUndercut * 0.7, filmY + vDepth);
  vertex(cx + maskW / 2 + lUndercut * 0.7, filmY + vDepth);
  vertex(cx + maskW / 2 + lUndercut, filmY + vDepth * 0.15);
  vertex(cx + maskW / 2, filmY);
  endShape(CLOSE);

  stroke(200, 90, 60); strokeWeight(1.5); noFill();
  rect(filmX, filmY, filmW, filmH);

  fill(30); noStroke(); textAlign(CENTER, TOP); textSize(12.5);
  text('Vertical rate: ' + preset.vertical + ' nm/min   |   Lateral rate: ' + preset.lateral + ' nm/min', cx, filmY + filmH + 25);

  fill(anisotropy > 0.7 ? color(40, 130, 70) : (anisotropy > 0.3 ? color(200, 140, 30) : color(200, 60, 60)));
  textAlign(CENTER, TOP); textSize(14);
  text('Anisotropy factor Af = 1 − Rlat/Rvert = ' + nf(anisotropy, 1, 2), cx, filmY + filmH + 48);

  drawControlLabels();
}

function drawControlLabels() {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Etch type', 140, drawHeight + 16 + 10);
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
