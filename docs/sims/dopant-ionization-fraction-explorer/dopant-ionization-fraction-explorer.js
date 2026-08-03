// Dopant Ionization Fraction vs. Temperature Explorer MicroSim
// Plots f_ion(T) = 1/(1 + B*exp(E_D/kT)), a simplified sigmoid model of
// the fraction of ionized dopant atoms, with an adjustable ionization
// energy slider and a movable temperature marker readout.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let edSlider, tempSlider;
const KB = 8.617e-5;
const B_FREEZE = 0.02;

function fIon(T, ED) {
  const kT = KB * T;
  return 1 / (1 + B_FREEZE * Math.exp(ED / kT));
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  edSlider = createSlider(0.02, 0.15, 0.045, 0.005);
  edSlider.attribute('aria-label', 'Dopant ionization energy in eV');

  tempSlider = createSlider(20, 500, 150, 5);
  tempSlider.attribute('aria-label', 'Temperature marker in kelvin');

  positionUIElements();
  describe('Dopant ionization fraction versus temperature explorer: plots the fraction of ionized dopant atoms as a function of temperature for an adjustable ionization energy', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  edSlider.position(bx + 170, by + drawHeight + 15);
  edSlider.size(min(canvasWidth - 190 - 30, 300));
  tempSlider.position(bx + 170, by + drawHeight + 55);
  tempSlider.size(min(canvasWidth - 190 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const ED = edSlider.value();
  const Tmark = tempSlider.value();

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Dopant Ionization Fraction: f_ion(T) = 1 / (1 + B·e^(E_D/kT))', canvasWidth / 2, 8);

  const chartX = 70, chartY = 44, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;
  const TMIN = 20, TMAX = 500;

  const pts = [];
  for (let T = TMIN; T <= TMAX; T += 5) pts.push({ x: T, y: fIon(T, ED) });

  const { xToPx, yToPx } = smlDrawLineChart(chartX, chartY, chartW, chartH, TMIN, TMAX, 0, 1, [{ points: pts, color: color(90, 62, 237) }], {
    marker: { x: Tmark, y: fIon(Tmark, ED) },
    xLabel: 'Temperature (K)', yLabel: 'Ionization fraction', yLabelOffset: 34
  });

  // 50% reference line
  stroke(200, 30, 30); strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(chartX, yToPx(0.5), chartX + chartW, yToPx(0.5));
  drawingContext.setLineDash([]);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('E_D = ' + ED.toFixed(3) + ' eV', 10, drawHeight + 20);
  text('Temperature marker: ' + Tmark + ' K → f_ion = ' + fIon(Tmark, ED).toFixed(3), 10, drawHeight + 60);
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
