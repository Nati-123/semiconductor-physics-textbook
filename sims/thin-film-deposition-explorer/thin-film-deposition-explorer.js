// Thin-Film Deposition Explorer MicroSim
// Compares CVD, PVD, and ALD by animating how each method fills a trench
// feature: CVD gives good but imperfect conformality, PVD leaves a
// sidewall gap, and ALD coats every surface uniformly.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let methodSelect;
let progress = 0;
let animating = false;
let startStopBtn = { x: 0, y: 0, w: 110, h: 34 };
let resetBtn = { x: 0, y: 0, w: 90, h: 34 };

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  methodSelect = createSelect();
  methodSelect.option('CVD');
  methodSelect.option('PVD');
  methodSelect.option('ALD');
  methodSelect.selected('CVD');
  methodSelect.attribute('aria-label', 'Deposition method');

  positionUIElements();
  describe('Thin-film deposition explorer: animates how CVD, PVD, and ALD each fill a trench feature differently, comparing conformality', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  methodSelect.position(bx + 160, by + drawHeight + 16);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  if (animating) {
    progress = min(progress + 0.006, 1);
    if (progress >= 1) animating = false;
  }

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('Thin-Film Deposition: ' + methodSelect.value() + ' Filling a Trench', canvasWidth / 2, 8);

  const trenchX = canvasWidth / 2 - 90, trenchY = 60, trenchW = 180, trenchH = 220;
  const wallT = 26;

  noStroke(); fill(225);
  rect(trenchX - 60, trenchY, 60, trenchH);
  rect(trenchX + trenchW, trenchY, 60, trenchH);
  fill(200, 200, 210);
  rect(trenchX, trenchY, wallT, trenchH);
  rect(trenchX + trenchW - wallT, trenchY, wallT, trenchH);
  rect(trenchX, trenchY + trenchH - wallT, trenchW, wallT);

  const method = methodSelect.value();
  const depColor = color(90, 62, 237, 220);
  noStroke(); fill(depColor);

  if (method === 'CVD') {
    const t = progress * 18;
    rect(trenchX, trenchY, t, trenchH - wallT);
    rect(trenchX + trenchW - t, trenchY, t, trenchH - wallT);
    rect(trenchX, trenchY + trenchH - wallT - t, trenchW, t);
  } else if (method === 'PVD') {
    const topT = progress * 26;
    rect(trenchX - 5, trenchY, trenchW + 10, topT);
    const sideT = progress * 8;
    rect(trenchX, trenchY, sideT, trenchH * 0.35);
    rect(trenchX + trenchW - sideT, trenchY, sideT, trenchH * 0.35);
  } else {
    const t = progress * 14;
    rect(trenchX, trenchY, t, trenchH - wallT);
    rect(trenchX + trenchW - t, trenchY, t, trenchH - wallT);
    rect(trenchX, trenchY + trenchH - wallT - t, trenchW, t);
    rect(trenchX - 3, trenchY - t, trenchW + 6, t);
  }

  fill(30); noStroke(); textAlign(CENTER, TOP); textSize(12.5);
  const desc = method === 'CVD' ? 'Good step coverage, slightly thinner at trench corners.'
    : method === 'PVD' ? 'Line-of-sight deposition leaves the sidewalls thin or bare — poor conformality.'
    : 'Sequential self-limiting reactions coat every exposed surface equally — excellent conformality.';
  text(desc, canvasWidth / 2, trenchY + trenchH + 20, canvasWidth - 60);

  drawControlLabels();
  drawButtons();
}

function drawControlLabels() {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Method', 150, drawHeight + 16 + 10);
}

function drawButtons() {
  startStopBtn.x = 20; startStopBtn.y = drawHeight + 60;
  resetBtn.x = startStopBtn.x + startStopBtn.w + 12; resetBtn.y = startStopBtn.y;
  smlDrawButton(startStopBtn.x, startStopBtn.y, startStopBtn.w, startStopBtn.h, animating ? 'Stop' : 'Start', animating);
  smlDrawButton(resetBtn.x, resetBtn.y, resetBtn.w, resetBtn.h, 'Reset', false);
}

function mousePressed() {
  if (smlPointInRect(mouseX, mouseY, startStopBtn.x, startStopBtn.y, startStopBtn.w, startStopBtn.h)) {
    animating = !animating;
  } else if (smlPointInRect(mouseX, mouseY, resetBtn.x, resetBtn.y, resetBtn.w, resetBtn.h)) {
    progress = 0;
    animating = false;
  }
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
