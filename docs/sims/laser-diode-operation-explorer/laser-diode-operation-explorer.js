// Laser Diode Operation Explorer MicroSim
// Plots output optical power vs. injection current, showing the sharp
// kink at threshold current where stimulated emission takes over from
// weak spontaneous (LED-like) emission.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let currentSlider;
const Ith = 40; // mA threshold

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  currentSlider = createSlider(0, 100, 60, 1);
  currentSlider.attribute('aria-label', 'Injection current in milliamps');

  positionUIElements();
  describe('Laser diode operation explorer: plots output optical power versus injection current, showing the sharp threshold kink where stimulated emission takes over', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  currentSlider.position(bx + 190, by + drawHeight + 16);
  currentSlider.size(min(canvasWidth - 210 - 30, 320));
}

function outputPower(I) {
  if (I < Ith) return 0.002 * I;
  return 0.002 * Ith + 0.09 * (I - Ith);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const I = currentSlider.value();
  const P = outputPower(I);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('Laser Diode: Output Power vs. Injection Current', canvasWidth / 2, 8);

  const chartX = 70, chartY = 40, chartW = canvasWidth - 110, chartH = drawHeight - 100;
  const pts = [];
  for (let i = 0; i <= 100; i += 1) pts.push({ x: i, y: outputPower(i) });
  const pMax = outputPower(100) * 1.1;

  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 100, 0, pMax,
    [{ points: pts, color: color(90, 62, 237) }],
    { xLabel: 'injection current I (mA)', yLabel: 'output power P (a.u.)', marker: { x: I, y: P }, markerColor: color(230, 90, 60) }
  );

  const threshX = map(Ith, 0, 100, chartX, chartX + chartW);
  stroke(200, 140, 30); strokeWeight(1.5); drawingContext.setLineDash([5, 4]);
  line(threshX, chartY, threshX, chartY + chartH);
  drawingContext.setLineDash([]);
  noStroke(); fill(200, 140, 30); textAlign(CENTER, TOP); textSize(11);
  text('I_th = ' + Ith + ' mA', threshX, chartY + chartH + 4);

  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(12.5);
  text('At I = ' + I + ' mA:  ' + (I < Ith ? 'below threshold — weak spontaneous emission (LED-like)' : 'above threshold — stimulated emission dominates'), chartX, chartY + chartH + 24);

  drawControlLabels();
}

function drawControlLabels() {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Injection current ' + currentSlider.value() + ' mA', 185, drawHeight + 16 + 9);
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
