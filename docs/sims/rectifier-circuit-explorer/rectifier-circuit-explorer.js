// Rectifier Circuit Explorer MicroSim
// Plots an AC input waveform and the resulting half-wave or full-wave
// rectified output, with average DC output voltage computed and marked.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let typeSelect, vpeakSlider, vfSlider;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  typeSelect = createSelect();
  typeSelect.option('Half-Wave');
  typeSelect.option('Full-Wave (Bridge)');
  typeSelect.selected('Full-Wave (Bridge)');
  typeSelect.attribute('aria-label', 'Rectifier type');

  vpeakSlider = createSlider(20, 200, 170, 1);
  vpeakSlider.attribute('aria-label', 'Peak AC input voltage');
  vfSlider = createSlider(0, 1.5, 0.7, 0.05);
  vfSlider.attribute('aria-label', 'Diode forward voltage drop');

  positionUIElements();
  describe('Rectifier circuit explorer: plots an AC input waveform and the half-wave or full-wave rectified output, with average DC voltage computed', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  typeSelect.position(bx + 150, by + drawHeight + 12);
  vpeakSlider.position(bx + 150, by + drawHeight + 50);
  vpeakSlider.size(min(canvasWidth - 170 - 30, 320));
  vfSlider.position(bx + 150, by + drawHeight + 88);
  vfSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const isFull = typeSelect.value() === 'Full-Wave (Bridge)';
  const Vpeak = vpeakSlider.value();
  const VF = vfSlider.value();
  const nDiodes = isFull ? 2 : 1;
  const Vdc = isFull ? 2 * (Vpeak - nDiodes * VF) / PI : (Vpeak - nDiodes * VF) / PI;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text(isFull ? 'Full-Wave Bridge Rectifier' : 'Half-Wave Rectifier', canvasWidth / 2, 8);

  const rowH = (drawHeight - 40) / 2 - 10;
  drawWaveform(30, rowH, 'AC Input', (t) => Vpeak * sin(t), color(90, 62, 237), -Vpeak * 1.2, Vpeak * 1.2, null);
  drawWaveform(30 + rowH + 20, rowH, 'Rectified Output', (t) => {
    const s = Vpeak * sin(t);
    if (isFull) {
      const mag = abs(s) - nDiodes * VF;
      return max(mag, 0);
    } else {
      if (s <= 0) return 0;
      return max(s - nDiodes * VF, 0);
    }
  }, color(230, 90, 60), -Vpeak * 0.2, Vpeak * 1.2, Vdc);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12.5);
  text('Type:', 10, drawHeight + 18);
  text('Vpeak = ' + Vpeak + ' V', 10, drawHeight + 56);
  text('VF (per diode) = ' + VF.toFixed(2) + ' V', 10, drawHeight + 94);
  text('V_DC ≈ ' + Vdc.toFixed(2) + ' V', 10, drawHeight + 118);
}

function drawWaveform(y0, h, label, fn, col, yMin, yMax, dcLine) {
  const x0 = 70, x1 = canvasWidth - 30, w = x1 - x0;
  noStroke(); fill(30); textAlign(LEFT, TOP); textSize(11.5);
  text(label, x0, y0 - 14);
  stroke(210); strokeWeight(1); noFill();
  rect(x0, y0, w, h);

  function yToPx(v) { return map(v, yMin, yMax, y0 + h, y0); }
  const zeroY = yToPx(0);
  stroke(190); strokeWeight(1); drawingContext.setLineDash([2, 3]);
  line(x0, zeroY, x1, zeroY);
  drawingContext.setLineDash([]);

  stroke(col); strokeWeight(2); noFill();
  beginShape();
  for (let px = 0; px <= w; px++) {
    const t = map(px, 0, w, 0, 4 * PI);
    vertex(x0 + px, yToPx(fn(t)));
  }
  endShape();

  if (dcLine !== null) {
    stroke(40, 150, 90); strokeWeight(1.5); drawingContext.setLineDash([4, 3]);
    line(x0, yToPx(dcLine), x1, yToPx(dcLine));
    drawingContext.setLineDash([]);
    noStroke(); fill(40, 150, 90); textAlign(LEFT, BOTTOM); textSize(10.5);
    text('V_DC = ' + dcLine.toFixed(1) + ' V', x0 + 4, yToPx(dcLine) - 3);
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
