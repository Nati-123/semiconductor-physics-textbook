// Czochralski Crystal Growth Explorer MicroSim
// Animates a seed crystal being pulled and rotated from a crucible of
// molten silicon, showing how pull rate trades off ingot diameter
// uniformity against crystal defect density.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let pullSlider, rotSlider;
let ingotLen = 0;
let animating = false;
let startStopBtn = { x: 0, y: 0, w: 110, h: 34 };

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  pullSlider = createSlider(1, 10, 4, 0.5);
  pullSlider.attribute('aria-label', 'Pull rate in mm per minute');
  rotSlider = createSlider(2, 30, 15, 1);
  rotSlider.attribute('aria-label', 'Rotation rate in rpm');

  positionUIElements();
  describe('Czochralski crystal growth explorer: animates a seed crystal being pulled and rotated from molten silicon, showing how pull rate affects ingot diameter uniformity and defect density', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  pullSlider.position(bx + 190, by + drawHeight + 16);
  pullSlider.size(min(canvasWidth - 210 - 30, 300));
  rotSlider.position(bx + 190, by + drawHeight + 54);
  rotSlider.size(min(canvasWidth - 210 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const pullRate = pullSlider.value();
  const rotRate = rotSlider.value();

  // Ideal pull rate is around 3-5 mm/min; deviation increases defect density
  const idealPull = 4;
  const deviation = abs(pullRate - idealPull);
  const defectFrac = constrain(deviation / 6, 0, 1);
  const diameterUniformity = 1 - defectFrac * 0.6;

  if (animating) {
    ingotLen += pullRate * 0.06;
    if (ingotLen > 260) ingotLen = 260;
  }

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('Czochralski Crystal Growth', canvasWidth / 2, 8);

  const cx = canvasWidth / 2;
  const crucibleY = drawHeight - 60;
  const crucibleW = 180, crucibleH = 70;

  // crucible with molten silicon
  noStroke(); fill(230, 100, 60, 200);
  arc(cx, crucibleY + crucibleH * 0.4, crucibleW, crucibleH, 0, PI);
  rect(cx - crucibleW / 2, crucibleY, crucibleW, crucibleH * 0.4);
  fill(60); textAlign(CENTER, TOP); textSize(11);
  text('molten silicon crucible', cx, crucibleY + crucibleH + 6);

  // growing ingot (width varies with diameter uniformity)
  const baseIngotW = 46;
  const wobble = (1 - diameterUniformity) * 14;
  const topY = crucibleY - ingotLen;
  push();
  translate(cx, 0);
  noStroke();
  const nSeg = 40;
  for (let i = 0; i < nSeg; i++) {
    const segY0 = crucibleY - (ingotLen * i) / nSeg;
    const segY1 = crucibleY - (ingotLen * (i + 1)) / nSeg;
    const w = baseIngotW + sin(i * 0.9 + rotRate * 0.1) * wobble;
    const defectColor = lerpColor(color(230, 230, 250), color(200, 90, 90), defectFrac);
    fill(defectColor);
    rect(-w / 2, segY1, w, segY0 - segY1 + 1);
  }
  pop();

  // seed holder + rotation indicator
  noStroke(); fill(90, 62, 237);
  rect(cx - 10, topY - 20, 20, 20, 3);
  push();
  translate(cx, topY - 30);
  rotate(frameCount * rotRate * 0.01);
  stroke(90, 62, 237); strokeWeight(2);
  line(-14, 0, 14, 0);
  line(0, -14, 0, 14);
  pop();

  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(12.5);
  text('Ingot length: ' + nf(ingotLen, 1, 0) + ' px  |  Diameter uniformity: ' + nf(diameterUniformity * 100, 1, 0) + '%  |  Defect level: ' + nf(defectFrac * 100, 1, 0) + '%', 15, drawHeight - 22);

  fill(defectFrac > 0.5 ? color(200, 60, 60) : color(40, 130, 70));
  textAlign(RIGHT, TOP);
  text(defectFrac > 0.5 ? 'High defect risk — pull rate far from ideal' : 'Good process window', canvasWidth - 15, drawHeight - 22);

  drawControlLabels();
  drawStartStopButton();
}

function drawControlLabels() {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Pull rate ' + pullSlider.value() + ' mm/min', 185, drawHeight + 16 + 9);
  text('Rotation ' + rotSlider.value() + ' rpm', 185, drawHeight + 54 + 9);
}

function drawStartStopButton() {
  startStopBtn.x = 20; startStopBtn.y = drawHeight + 90;
  smlDrawButton(startStopBtn.x, startStopBtn.y, startStopBtn.w, startStopBtn.h, animating ? 'Stop' : 'Start', animating);
  const resetBtn = { x: startStopBtn.x + startStopBtn.w + 12, y: startStopBtn.y, w: 90, h: startStopBtn.h };
  smlDrawButton(resetBtn.x, resetBtn.y, resetBtn.w, resetBtn.h, 'Reset', false);
  window._czResetBtn = resetBtn;
}

function mousePressed() {
  if (smlPointInRect(mouseX, mouseY, startStopBtn.x, startStopBtn.y, startStopBtn.w, startStopBtn.h)) {
    animating = !animating;
  } else if (window._czResetBtn && smlPointInRect(mouseX, mouseY, window._czResetBtn.x, window._czResetBtn.y, window._czResetBtn.w, window._czResetBtn.h)) {
    ingotLen = 0;
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
