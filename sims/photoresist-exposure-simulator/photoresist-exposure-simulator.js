// Photoresist Exposure Simulator MicroSim
// Shows how a fixed mask pattern, UV dose, and resist type (positive or
// negative) combine to determine which regions of photoresist remain
// after development.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let resistSelect, doseSlider;

// Mask pattern: 1 = light passes (open), 0 = blocked
const MASK = [0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0];
const THRESHOLD = 50;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  resistSelect = createSelect();
  resistSelect.option('Positive Resist');
  resistSelect.option('Negative Resist');
  resistSelect.selected('Positive Resist');
  resistSelect.attribute('aria-label', 'Photoresist type');

  doseSlider = createSlider(0, 100, 70, 1);
  doseSlider.attribute('aria-label', 'UV exposure dose');

  positionUIElements();
  describe('Photoresist exposure simulator: shows how a fixed mask pattern, UV dose, and resist type combine to determine which regions of photoresist remain after development', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  resistSelect.position(bx + 170, by + drawHeight + 16);
  doseSlider.position(bx + 170, by + drawHeight + 60);
  doseSlider.size(min(canvasWidth - 190 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const dose = doseSlider.value();
  const exposed = dose >= THRESHOLD;
  const isPositive = resistSelect.value() === 'Positive Resist';
  const n = MASK.length;
  const rowW = canvasWidth - 100;
  const cellW = rowW / n;
  const x0 = 50;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('Photoresist Exposure and Development', canvasWidth / 2, 8);

  // Mask row
  const maskY = 45;
  drawRowLabel('Mask', x0, maskY);
  for (let i = 0; i < n; i++) {
    noStroke();
    fill(MASK[i] ? color(255, 240, 150) : color(70));
    rect(x0 + i * cellW, maskY, cellW - 2, 40);
  }

  // UV row
  const uvY = maskY + 60;
  drawRowLabel('UV', x0, uvY);
  for (let i = 0; i < n; i++) {
    noStroke();
    if (MASK[i] && exposed) fill(255, 230, 90);
    else fill(240);
    rect(x0 + i * cellW, uvY, cellW - 2, 40);
  }

  // Resist row (before development)
  const resistY = uvY + 60;
  drawRowLabel('Resist', x0, resistY);
  for (let i = 0; i < n; i++) {
    const wasExposed = MASK[i] && exposed;
    noStroke();
    fill(wasExposed ? color(180, 210, 255) : color(120, 150, 210));
    rect(x0 + i * cellW, resistY, cellW - 2, 40);
  }

  // Developed row (final pattern)
  const devY = resistY + 60;
  drawRowLabel('Developed', x0, devY);
  for (let i = 0; i < n; i++) {
    const wasExposed = MASK[i] && exposed;
    // positive resist: exposed regions dissolve away (removed)
    // negative resist: unexposed regions dissolve away (removed)
    const remains = isPositive ? !wasExposed : wasExposed;
    noStroke();
    fill(remains ? color(90, 62, 237) : color(250));
    stroke(220); strokeWeight(1);
    rect(x0 + i * cellW, devY, cellW - 2, 40);
  }

  fill(30); noStroke(); textAlign(CENTER, TOP); textSize(12.5);
  text((exposed ? 'Dose above threshold — exposed regions react' : 'Dose below threshold — resist unaffected') + '  |  ' + resistSelect.value(), canvasWidth / 2, devY + 55);

  drawControlLabels();
}

function drawRowLabel(label, x0, y) {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(12);
  text(label, x0 - 10, y + 20);
}

function drawControlLabels() {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Resist type', 165, drawHeight + 16 + 9);
  text('UV dose ' + doseSlider.value() + '%', 165, drawHeight + 60 + 9);
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
