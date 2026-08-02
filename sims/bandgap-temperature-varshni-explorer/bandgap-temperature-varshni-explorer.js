// Bandgap vs. Temperature (Varshni Equation) Explorer MicroSim
// Overlays the Varshni-equation Eg(T) curves for Si, Ge, and GaAs on one
// chart, with checkboxes to isolate individual curves and a temperature
// marker slider that reads off each visible material's band gap.
// Bloom Level: Analyze (L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let tempSlider;
let checkboxes = {};

const MATERIALS = {
  'Silicon': { Eg0: 1.166, alpha: 4.73e-4, beta: 636, col: [90, 140, 220] },
  'Germanium': { Eg0: 0.7437, alpha: 4.77e-4, beta: 235, col: [90, 180, 120] },
  'GaAs': { Eg0: 1.519, alpha: 5.41e-4, beta: 204, col: [230, 140, 60] }
};

function EgAt(mat, T) { return mat.Eg0 - (mat.alpha * T * T) / (T + mat.beta); }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  tempSlider = createSlider(0, 600, 300, 10);
  tempSlider.attribute('aria-label', 'Temperature marker in kelvin');

  let xOff = 10;
  Object.keys(MATERIALS).forEach(function (name) {
    const cb = createCheckbox(name, true);
    cb.position(0, 0); // repositioned in positionUIElements
    checkboxes[name] = cb;
  });

  positionUIElements();
  describe('Bandgap versus temperature Varshni equation explorer: overlaid band gap curves for silicon, germanium, and gallium arsenide with a movable temperature marker', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  let i = 0;
  Object.keys(MATERIALS).forEach(function (name) {
    checkboxes[name].position(bx + 10 + i * 140, by + drawHeight + 12);
    i++;
  });
  tempSlider.position(bx + 150, by + drawHeight + 52);
  tempSlider.size(min(canvasWidth - 170 - 40, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const T = tempSlider.value();

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Band Gap vs. Temperature: Eg(T) = Eg(0) − αT²/(T+β)', canvasWidth / 2, 8);

  const chartX = 70, chartY = 44, chartW = canvasWidth - chartX - 40, chartH = drawHeight - 100;

  const series = [];
  Object.keys(MATERIALS).forEach(function (name) {
    if (!checkboxes[name].checked()) return;
    const mat = MATERIALS[name];
    const pts = [];
    for (let t = 0; t <= 600; t += 10) pts.push({ x: t, y: EgAt(mat, t) });
    series.push({ points: pts, color: color(mat.col[0], mat.col[1], mat.col[2]), label: name });
  });

  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 600, 0, 1.7, series, {
    xLabel: 'Temperature (K)', yLabel: 'Eg (eV)', yLabelOffset: 40
  });

  // temperature marker vertical line + readouts
  const markerX = map(T, 0, 600, chartX, chartX + chartW);
  stroke(120); strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(markerX, chartY, markerX, chartY + chartH);
  drawingContext.setLineDash([]);

  let readY = chartY + 10;
  noStroke();
  textAlign(LEFT, TOP); textSize(12);
  Object.keys(MATERIALS).forEach(function (name) {
    if (!checkboxes[name].checked()) return;
    const mat = MATERIALS[name];
    fill(mat.col[0], mat.col[1], mat.col[2]);
    text(name + ': ' + EgAt(mat, T).toFixed(3) + ' eV', chartX + chartW - 150, readY);
    readY += 18;
  });

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Temperature marker: ' + T + ' K', 10, drawHeight + 58);
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
