// Thermal Oxidation Simulator MicroSim
// Plots oxide thickness vs. time from the Deal-Grove growth law, letting
// students see the transition from the linear (thin-oxide) regime to the
// parabolic (thick-oxide) regime as temperature and time change.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let tempSelect, timeSlider;

const TEMP_PRESETS = {
  '900°C': { A: 0.6, B: 0.02 },
  '1000°C': { A: 0.3, B: 0.045 },
  '1100°C': { A: 0.12, B: 0.09 }
};

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  tempSelect = createSelect();
  for (const k in TEMP_PRESETS) tempSelect.option(k);
  tempSelect.selected('1000°C');
  tempSelect.attribute('aria-label', 'Oxidation temperature');

  timeSlider = createSlider(0.1, 8, 4, 0.1);
  timeSlider.attribute('aria-label', 'Oxidation time in hours');

  positionUIElements();
  describe('Thermal oxidation simulator: plots oxide thickness versus time from the Deal-Grove growth law, showing the transition from linear to parabolic growth regimes', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  tempSelect.position(bx + 170, by + drawHeight + 14);
  timeSlider.position(bx + 170, by + drawHeight + 56);
  timeSlider.size(min(canvasWidth - 190 - 30, 320));
}

function deatGroveThickness(t, A, B) {
  // solve xox^2 + A*xox = B*t  ->  xox = (-A + sqrt(A^2 + 4Bt)) / 2
  return (-A + sqrt(A * A + 4 * B * t)) / 2;
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const preset = TEMP_PRESETS[tempSelect.value()];
  const tNow = timeSlider.value();
  const xNow = deatGroveThickness(tNow, preset.A, preset.B);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('Thermal Oxidation: Oxide Thickness vs. Time (' + tempSelect.value() + ')', canvasWidth / 2, 8);

  const chartX = 65, chartY = 40, chartW = canvasWidth - 110, chartH = drawHeight - 100;
  const tMax = 8;
  const xMax = deatGroveThickness(tMax, TEMP_PRESETS['1100°C'].A, TEMP_PRESETS['1100°C'].B) * 1.1;

  const pts = [];
  for (let t = 0; t <= tMax; t += tMax / 200) {
    pts.push({ x: t, y: deatGroveThickness(t, preset.A, preset.B) });
  }
  const result = smlDrawLineChart(chartX, chartY, chartW, chartH, 0, tMax, 0, xMax, [
    { points: pts, color: color(90, 62, 237) }
  ], { xLabel: 'time (hr)', yLabel: 'oxide thickness (μm)', marker: { x: tNow, y: xNow }, markerColor: color(230, 90, 60) });

  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(13);
  text('At t = ' + nf(tNow, 1, 2) + ' hr:  x_ox ≈ ' + nf(xNow, 1, 3) + ' μm', chartX, chartY + chartH + 20);

  const regime = xNow < preset.A * 0.5 ? 'linear (reaction-limited) regime' : (xNow > preset.A * 2 ? 'parabolic (diffusion-limited) regime' : 'transition region');
  fill(90, 62, 237);
  textAlign(RIGHT, TOP);
  text('Currently in the ' + regime, chartX + chartW, chartY + chartH + 20);

  drawControlLabels();
}

function drawControlLabels() {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Temperature', 165, drawHeight + 14 + 10);
  text('Time ' + nf(timeSlider.value(), 1, 1) + ' hr', 165, drawHeight + 56 + 9);
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
