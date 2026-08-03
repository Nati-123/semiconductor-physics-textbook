// Ideal Diode I-V Curve Explorer MicroSim
// Plots J = J0*(exp(V/VT) - 1) for a chosen J0 and temperature, in either
// a linear view (showing the sharp forward "knee") or a semi-log view of
// |J| (showing the exponential forward region as a straight line and the
// reverse region flattening at J0).
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 190;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let j0Slider, tSlider, viewSelect, vSlider;

const K_EV = 8.617e-5; // eV/K

function draw_J(V, J0, VT) {
  return J0 * (Math.exp(V / VT) - 1);
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  j0Slider = createSlider(-14, -8, -11, 0.1);
  j0Slider.attribute('aria-label', 'Saturation current density exponent, base 10, in amps per square centimeter');
  tSlider = createSlider(250, 400, 300, 5);
  tSlider.attribute('aria-label', 'Temperature in kelvin');
  viewSelect = createSelect();
  viewSelect.option('Linear View');
  viewSelect.option('Semi-Log View');
  viewSelect.selected('Linear View');
  viewSelect.attribute('aria-label', 'Chart view mode');
  vSlider = createSlider(-2, 0.8, 0.5, 0.01);
  vSlider.attribute('aria-label', 'Voltage marker position');

  positionUIElements();
  describe('Ideal diode I-V curve explorer: plots diode current density versus voltage from the ideal diode equation, in linear or semi-log view, with adjustable saturation current and temperature', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  j0Slider.position(bx + 150, by + drawHeight + 12);
  j0Slider.size(min(canvasWidth - 170 - 30, 320));
  tSlider.position(bx + 150, by + drawHeight + 50);
  tSlider.size(min(canvasWidth - 170 - 30, 320));
  viewSelect.position(bx + 150, by + drawHeight + 88);
  vSlider.position(bx + 150, by + drawHeight + 126);
  vSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const J0 = Math.pow(10, j0Slider.value());
  const T = tSlider.value();
  const VT = K_EV * T;
  const V = vSlider.value();
  const isLog = viewSelect.value() === 'Semi-Log View';
  const Jmark = draw_J(V, J0, VT);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('J = J0(e^(V/VT) − 1)', canvasWidth / 2, 8);

  const chartX = 90, chartY = 44, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;
  const VMIN = -2, VMAX = 0.8;

  const pts = [];
  if (isLog) {
    for (let v = VMIN; v <= VMAX; v += (VMAX - VMIN) / 200) {
      const j = Math.abs(draw_J(v, J0, VT));
      pts.push({ x: v, y: Math.log10(max(j, 1e-20)) });
    }
    const yTop = Math.ceil(Math.log10(J0 * Math.exp(VMAX / VT)) + 1);
    const yBot = Math.floor(Math.log10(J0) - 1);
    smlDrawLineChart(chartX, chartY, chartW, chartH, VMIN, VMAX, yBot, yTop, [
      { points: pts, color: color(90, 62, 237) }
    ], {
      marker: { x: V, y: Math.log10(max(Math.abs(Jmark), 1e-20)) },
      xLabel: 'Voltage V (V)', yLabel: 'log10 |J| (A/cm²)', yLabelOffset: 50
    });
  } else {
    const Jmax = J0 * (Math.exp(VMAX / VT) - 1);
    for (let v = VMIN; v <= VMAX; v += (VMAX - VMIN) / 200) {
      pts.push({ x: v, y: draw_J(v, J0, VT) });
    }
    smlDrawLineChart(chartX, chartY, chartW, chartH, VMIN, VMAX, -J0 * 3, Jmax * 1.1, [
      { points: pts, color: color(90, 62, 237) }
    ], {
      marker: { x: V, y: Jmark },
      xLabel: 'Voltage V (V)', yLabel: 'J (A/cm²)', yLabelOffset: 50
    });
  }

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12.5);
  text('J0 = ' + J0.toExponential(2) + ' A/cm²', 10, drawHeight + 18);
  text('T = ' + T + ' K  (VT = ' + VT.toFixed(4) + ' V)', 10, drawHeight + 56);
  text('View:', 10, drawHeight + 94);
  text('V marker = ' + V.toFixed(2) + ' V  →  J = ' + Jmark.toExponential(3) + ' A/cm²', 10, drawHeight + 132);
  textSize(11.5); fill(90);
  text(isLog ? 'Semi-log view: forward region is a straight line; reverse flattens at −J0.' :
    'Linear view: forward current rises so sharply it looks like a sharp "knee".', 10, drawHeight + 166);
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
