// Photodiode and Solar Cell I-V Explorer MicroSim
// Plots I = I0*(exp(V/VT)-1) - IL, the diode equation shifted down by a
// photocurrent IL, with Voc and Isc marked and the power-generating
// fourth quadrant (V>0, I<0) shaded.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let i0Slider, ilSlider;

const KT_Q = 0.0259;

function diodeI(V, I0, IL) {
  return I0 * (Math.exp(V / KT_Q) - 1) - IL;
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  i0Slider = createSlider(-14, -9, -12, 0.1);
  i0Slider.attribute('aria-label', 'Dark saturation current exponent, base 10, in amps');
  ilSlider = createSlider(1, 50, 20, 1);
  ilSlider.attribute('aria-label', 'Photocurrent in milliamps');

  positionUIElements();
  describe('Photodiode and solar cell I-V explorer: plots diode current shifted by photocurrent, with open-circuit voltage, short-circuit current, and the power-generating region marked', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  i0Slider.position(bx + 150, by + drawHeight + 12);
  i0Slider.size(min(canvasWidth - 170 - 30, 320));
  ilSlider.position(bx + 150, by + drawHeight + 50);
  ilSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const I0 = Math.pow(10, i0Slider.value());
  const IL = ilSlider.value() * 1e-3;
  const Voc = KT_Q * Math.log(IL / I0 + 1);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15.5);
  text('I = I0(e^(V/VT) − 1) − IL', canvasWidth / 2, 8);

  const chartX = 85, chartY = 44, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;
  const VMIN = -0.1, VMAX = Voc * 1.3 + 0.05;
  const IMIN = -IL * 1.3, IMAX = IL * 0.3;

  noStroke(); fill(230, 245, 235, 180);
  const info0 = smlDrawLineChart(chartX, chartY, chartW, chartH, VMIN, VMAX, IMIN * 1000, IMAX * 1000, [], {});
  const x0 = info0.xToPx(0), xVoc = info0.xToPx(Voc), y0 = info0.yToPx(0);
  rect(x0, chartY, xVoc - x0, y0 - chartY);

  const pts = [];
  for (let v = VMIN; v <= VMAX; v += (VMAX - VMIN) / 250) {
    pts.push({ x: v, y: diodeI(v, I0, IL) * 1000 });
  }
  const info = smlDrawLineChart(chartX, chartY, chartW, chartH, VMIN, VMAX, IMIN * 1000, IMAX * 1000, [
    { points: pts, color: color(90, 62, 237) }
  ], { xLabel: 'V (V)', yLabel: 'I (mA)', yLabelOffset: 44 });

  noStroke(); fill(230, 90, 60);
  circle(info.xToPx(0), info.yToPx(-IL * 1000), 7);
  textAlign(LEFT, BOTTOM); textSize(10.5);
  text('Isc = ' + (IL * 1000).toFixed(1) + ' mA', info.xToPx(0) + 6, info.yToPx(-IL * 1000) - 4);

  fill(40, 150, 90);
  circle(info.xToPx(Voc), info.yToPx(0), 7);
  textAlign(LEFT, TOP); textSize(10.5);
  text('Voc = ' + Voc.toFixed(3) + ' V', info.xToPx(Voc) + 6, info.yToPx(0) + 4);

  fill(30); textAlign(LEFT, TOP); textSize(10.5); noStroke();
  text('shaded region: solar cell delivers power (V>0, I<0)', chartX + 6, chartY + 6);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12.5);
  text('I0 = ' + I0.toExponential(2) + ' A', 10, drawHeight + 18);
  text('IL = ' + (IL * 1000).toFixed(1) + ' mA', 10, drawHeight + 56);
  text('Isc = ' + (IL * 1000).toFixed(1) + ' mA   Voc = ' + Voc.toFixed(3) + ' V', 10, drawHeight + 94);
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
