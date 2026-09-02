// Photodiode and Solar Cell I-V Explorer MicroSim
// Plots I = I0*(exp(V/VT)-1) - IL, the dark diode curve shifted down by a
// photocurrent IL, alongside the dark (IL=0) curve for comparison, with
// Isc, Voc, and the maximum-power point marked and the power-generating
// fourth quadrant (V>0, I<0) shaded.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 450;
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
  ilSlider.attribute('aria-label', 'Illumination level, set as photocurrent in milliamps');

  positionUIElements();
  describe('Photodiode and solar cell I-V explorer: plots the dark diode curve and the illuminated diode curve shifted by photocurrent, with open-circuit voltage, short-circuit current, maximum-power point, and the power-generating region marked', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  i0Slider.position(bx + 190, by + drawHeight + 12);
  i0Slider.size(min(canvasWidth - 210 - 30, 300));
  ilSlider.position(bx + 190, by + drawHeight + 50);
  ilSlider.size(min(canvasWidth - 210 - 30, 300));
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

  // Title, pushed clear of the fixed top-right fullscreen button.
  noStroke(); fill(20);
  smlMathText(canvasWidth / 2, 10, 'I = I_0(e^(V/V_T) − 1) − I_L', { align: 'center', size: 16 });

  const chartX = 88, chartY = 42, chartW = canvasWidth - chartX - 30, chartH = drawHeight - chartY - 40;
  const VMIN = -0.1, VMAX = Voc * 1.3 + 0.05;
  const IMIN = -IL * 1.3, IMAX = IL * 0.3;

  noStroke(); fill(230, 245, 235, 180);
  const info0 = smlDrawLineChart(chartX, chartY, chartW, chartH, VMIN, VMAX, IMIN * 1000, IMAX * 1000, [], {});
  const x0 = info0.xToPx(0), xVoc = info0.xToPx(Voc), y0 = info0.yToPx(0);
  rect(x0, chartY, xVoc - x0, y0 - chartY);

  const darkPts = [], illumPts = [];
  for (let v = VMIN; v <= VMAX; v += (VMAX - VMIN) / 250) {
    darkPts.push({ x: v, y: diodeI(v, I0, 0) * 1000 });
    illumPts.push({ x: v, y: diodeI(v, I0, IL) * 1000 });
  }

  // maximum-power point: search the illuminated curve for max delivered
  // power P_out = -I*V (positive in the fourth quadrant, V in [0,Voc]).
  let vMp = 0, pMax = 0, iMp = 0;
  for (let v = 0; v <= Voc; v += Voc / 400) {
    const iAmp = diodeI(v, I0, IL);
    const pOut = -iAmp * v;
    if (pOut > pMax) { pMax = pOut; vMp = v; iMp = iAmp; }
  }

  const vTicks = []; for (let v = Math.ceil(VMIN * 10) / 10; v <= VMAX; v += 0.1) vTicks.push(Math.round(v * 10) / 10);
  const iTickStep = max(Math.round((IMAX - IMIN) * 1000 / 5 / 5) * 5, 5);
  const iTicks = []; for (let i = Math.ceil(IMIN * 1000 / iTickStep) * iTickStep; i <= IMAX * 1000; i += iTickStep) iTicks.push(i);

  smlDrawLineChart(chartX, chartY, chartW, chartH, VMIN, VMAX, IMIN * 1000, IMAX * 1000, [
    { points: darkPts, color: color(160) },
    { points: illumPts, color: color(90, 62, 237) }
  ], {
    xLabel: 'V (V)', yLabel: 'I (mA)', yLabelOffset: 46,
    xTicks: vTicks, xTickFormat: v => v.toFixed(1),
    yTicks: iTicks, yTickFormat: v => v.toFixed(0)
  });
  const info = { xToPx: info0.xToPx, yToPx: info0.yToPx };

  noStroke(); fill(230, 90, 60);
  circle(info.xToPx(0), info.yToPx(-IL * 1000), 6);
  textAlign(LEFT, BOTTOM); textSize(10.5);
  text('I_sc = ' + (IL * 1000).toFixed(1) + ' mA', info.xToPx(0) + 6, info.yToPx(-IL * 1000) - 4);

  fill(40, 150, 90);
  circle(info.xToPx(Voc), info.yToPx(0), 6);
  textAlign(LEFT, TOP); textSize(10.5);
  text('V_oc = ' + Voc.toFixed(3) + ' V', info.xToPx(Voc) + 6, info.yToPx(0) + 4);

  fill(210, 60, 150);
  circle(info.xToPx(vMp), info.yToPx(iMp * 1000), 6);
  textAlign(LEFT, TOP); textSize(10.5);
  text('P_max point', info.xToPx(vMp) + 6, info.yToPx(iMp * 1000) - 30);
  text('(' + vMp.toFixed(3) + ' V, ' + (iMp * 1000).toFixed(1) + ' mA)', info.xToPx(vMp) + 6, info.yToPx(iMp * 1000) - 16);

  fill(120); textAlign(LEFT, TOP); textSize(10);
  text('— gray: dark (IL=0)      — purple: illuminated', chartX + 6, chartY + 4);
  fill(40, 130, 80);
  text('shaded: power-generating region (V>0, I<0)', chartX + 6, chartY + 18);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12.5);
  text('I₀:', 10, drawHeight + 18);
  text('Illumination (I_L):', 10, drawHeight + 56);
  textSize(11.5);
  text('I₀ = ' + I0.toExponential(2) + ' A     I_L = ' + (IL * 1000).toFixed(1) + ' mA', 10, drawHeight + 94);
  text('I_sc = ' + (IL * 1000).toFixed(1) + ' mA   V_oc = ' + Voc.toFixed(3) + ' V   P_max = ' + (pMax * 1000).toFixed(2) + ' mW at V=' + vMp.toFixed(3) + ' V', 10, drawHeight + 116, canvasWidth - 20);
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
