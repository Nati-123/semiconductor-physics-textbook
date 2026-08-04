// Technology Scaling Explorer MicroSim
// Plots Moore's Law transistor count growth on a log axis as process year
// advances, alongside a shrinking gate length readout and a short-channel
// effect severity indicator that rises as gate length shrinks.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let yearSlider;
const N0 = 1e9, t0 = 2010, T = 2;
const YEAR_MIN = 2000, YEAR_MAX = 2030;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  yearSlider = createSlider(YEAR_MIN, YEAR_MAX, 2024, 1);
  yearSlider.attribute('aria-label', 'Process year');

  positionUIElements();
  describe('Technology scaling explorer: plots Moore\'s Law transistor count growth as process year advances, alongside gate length shrinkage and short-channel effect severity', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  yearSlider.position(bx + 160, by + drawHeight + 16);
  yearSlider.size(min(canvasWidth - 180 - 30, 350));
}

function gateLengthForYear(year) {
  // simplified: gate length halves every ~7 years from 90nm in 2000
  return 90 * pow(0.5, (year - 2000) / 7);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const year = yearSlider.value();
  const N = N0 * pow(2, (year - t0) / T);
  const gateLen = gateLengthForYear(year);
  const sceIndex = constrain(map(gateLen, 30, 3, 0, 1), 0, 1);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('Technology Scaling: Transistor Count (Moore\'s Law)', canvasWidth / 2, 8);

  const chartX = 75, chartY = 40, chartW = canvasWidth - 120, chartH = drawHeight - 100;
  const pts = [];
  for (let y = YEAR_MIN; y <= YEAR_MAX; y += 0.25) {
    const n = N0 * pow(2, (y - t0) / T);
    pts.push({ x: y, y: log(n) / log(10) });
  }
  const yMinLog = log(N0 * pow(2, (YEAR_MIN - t0) / T)) / log(10);
  const yMaxLog = log(N0 * pow(2, (YEAR_MAX - t0) / T)) / log(10);
  smlDrawLineChart(chartX, chartY, chartW, chartH, YEAR_MIN, YEAR_MAX, yMinLog, yMaxLog,
    [{ points: pts, color: color(90, 62, 237) }],
    { xLabel: 'year', yLabel: 'log10(transistor count)', marker: { x: year, y: log(N) / log(10) }, markerColor: color(230, 90, 60) }
  );

  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(12.5);
  text('Year ' + year + ':  N ≈ ' + nfs(N, 0, 0) + ' transistors   |   Gate length ≈ ' + nf(gateLen, 1, 1) + ' nm', chartX, chartY + chartH + 20);

  fill(sceIndex > 0.6 ? color(200, 60, 60) : (sceIndex > 0.3 ? color(200, 140, 30) : color(40, 130, 70)));
  textAlign(LEFT, TOP); textSize(12.5);
  text('Short-channel effect severity: ' + nf(sceIndex * 100, 1, 0) + '%', chartX, chartY + chartH + 40);

  drawControlLabels();
}

function drawControlLabels() {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Process year', 150, drawHeight + 16 + 10);
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
