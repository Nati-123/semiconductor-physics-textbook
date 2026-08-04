// AI Hardware Semiconductor Explorer MicroSim
// A simplified AI accelerator die model showing how transistor density
// trades off against power density as scaling increases compute capability.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let densitySlider;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  densitySlider = createSlider(10, 100, 50, 1);
  densitySlider.attribute('aria-label', 'Relative transistor density percent');

  positionUIElements();
  describe('AI hardware semiconductor explorer: a simplified AI accelerator die model showing how transistor density trades off against power density as scaling increases compute capability', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  densitySlider.position(bx + 220, by + drawHeight + 16);
  densitySlider.size(min(canvasWidth - 240 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const density = densitySlider.value(); // percent of max
  const compute = density; // relative compute capability, linear in density
  const power = pow(density / 50, 1.7) * 50; // power density rises faster than linearly

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('AI Accelerator Die: Density, Compute, and Power Trade-Off', canvasWidth / 2, 8);

  const dieX = canvasWidth / 2 - 100, dieY = 45, dieW = 200, dieH = 140;
  const gridN = 10;
  const cellSize = dieW / gridN;
  const filled = round((density / 100) * gridN * gridN);
  let count = 0;
  for (let j = 0; j < gridN; j++) {
    for (let i = 0; i < gridN; i++) {
      noStroke();
      fill(count < filled ? color(90, 62, 237) : color(230));
      rect(dieX + i * cellSize, dieY + j * cellSize, cellSize - 1, cellSize - 1);
      count++;
    }
  }
  stroke(150); noFill(); strokeWeight(1.5);
  rect(dieX, dieY, dieW, dieH);

  const series = [
    { label: 'Compute', value: compute, color: color(90, 62, 237) },
    { label: 'Power Density', value: power, color: color(230, 90, 60) }
  ];
  smlDrawBarChart(canvasWidth / 2 + 130, dieY, 150, dieH, series, 130);

  const infoY = dieY + dieH + 30;
  fill(30); noStroke(); textAlign(CENTER, TOP); textSize(13);
  text('Transistor density: ' + density + '%   |   Relative compute: ' + nf(compute, 1, 0) + '   |   Relative power density: ' + nf(power, 1, 0), canvasWidth / 2, infoY);

  fill(power > 90 ? color(200, 60, 60) : color(90));
  textAlign(CENTER, TOP); textSize(12);
  text(power > 90 ? 'High power density — thermal management (Ch. 17, 19) becomes critical' : 'Manageable power density', canvasWidth / 2, infoY + 22);

  drawControlLabels();
}

function drawControlLabels() {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Transistor density ' + densitySlider.value() + '%', 215, drawHeight + 16 + 9);
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
