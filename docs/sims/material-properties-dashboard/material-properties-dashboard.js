// Semiconductor Material Properties Dashboard MicroSim
// Shows a full property card (structure, band gap type, mobility, melting
// point) plus a live Varshni-equation band-gap-vs-temperature readout for
// whichever of Si / Ge / GaAs is selected.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, tempSlider;

// Varshni parameters: Eg(T) = Eg0 - alpha*T^2/(T+beta)
const MATERIALS = {
  'Silicon': { structure: 'Diamond cubic', type: 'Indirect', Eg0: 1.166, alpha: 4.73e-4, beta: 636, lattice: 0.543, melt: 1414, mobility: 1350 },
  'Germanium': { structure: 'Diamond cubic', type: 'Indirect', Eg0: 0.7437, alpha: 4.77e-4, beta: 235, lattice: 0.566, melt: 938, mobility: 3900 },
  'GaAs': { structure: 'Zincblende', type: 'Direct', Eg0: 1.519, alpha: 5.41e-4, beta: 204, lattice: 0.565, melt: 1238, mobility: 8500 }
};

function EgAt(mat, T) {
  return mat.Eg0 - (mat.alpha * T * T) / (T + mat.beta);
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  Object.keys(MATERIALS).forEach(k => materialSelect.option(k));
  materialSelect.selected('Silicon');
  materialSelect.attribute('aria-label', 'Material selection');

  tempSlider = createSlider(0, 600, 300, 10);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');

  positionUIElements();
  describe('Semiconductor material properties dashboard: property card and Varshni-equation band gap versus temperature curve for silicon, germanium, or gallium arsenide', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  materialSelect.position(bx + 90, by + drawHeight + 12);
  tempSlider.position(bx + 150, by + drawHeight + 52);
  tempSlider.size(min(canvasWidth - 170 - 40, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const mat = MATERIALS[materialSelect.value()];
  const T = tempSlider.value();
  const Eg = EgAt(mat, T);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text(materialSelect.value() + ' Material Properties', canvasWidth / 2, 8);

  drawCard(mat, Eg, T);
  drawCurve(mat, T, Eg);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Material:', 10, drawHeight + 18);
  text('Temperature: ' + T + ' K', 10, drawHeight + 58);
}

function drawCard(mat, Eg, T) {
  const cardX = 30, cardY = 44, cardW = canvasWidth * 0.42, cardH = drawHeight - 90;
  noStroke();
  fill(240, 245, 255);
  stroke(168, 200, 255);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke();
  fill(30);
  textAlign(LEFT, TOP);
  textSize(13);
  const lines = [
    'Crystal structure: ' + mat.structure,
    'Band gap type: ' + mat.type,
    'Band gap at ' + T + ' K: ' + Eg.toFixed(3) + ' eV',
    'Lattice constant: ' + mat.lattice + ' nm',
    'Melting point: ' + mat.melt + ' °C',
    'Electron mobility: ' + mat.mobility + ' cm²/V·s'
  ];
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cardX + 16, cardY + 16 + i * 24, cardW - 32);
  }
}

function drawCurve(mat, T, Eg) {
  const chartX = canvasWidth * 0.5, chartY = 50, chartW = canvasWidth - chartX - 40, chartH = drawHeight - 96;
  const pts = [];
  for (let t = 0; t <= 600; t += 10) pts.push({ x: t, y: EgAt(mat, t) });
  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 600, 0, 1.7, [{ points: pts, color: color(90, 62, 237) }], {
    marker: { x: T, y: Eg },
    xLabel: 'Temperature (K)',
    yLabel: 'Eg (eV)',
    yLabelOffset: 30
  });
  fill(30); noStroke();
  textAlign(CENTER, TOP); textSize(12);
  text('Varshni Equation: Eg(T) = Eg(0) − αT² / (T + β)', chartX + chartW / 2, chartY - 14);
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
