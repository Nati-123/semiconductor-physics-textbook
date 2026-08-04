// Si vs SiC vs GaN Device Explorer MicroSim
// Compares silicon, SiC, and GaN side by side across band gap, mobility,
// critical field, and typical switching frequency, letting students see
// that material selection balances several properties at once.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let propertySelect;

const MATERIALS = ['Silicon (Si)', 'Silicon Carbide (SiC)', 'Gallium Nitride (GaN)'];
const PROPERTIES = {
  'Band Gap (eV)': [1.12, 3.3, 3.4],
  'Critical Field (MV/cm)': [0.3, 2.5, 3.3],
  'Electron Mobility (cm²/V·s)': [1350, 900, 1250],
  'Thermal Conductivity (W/m·K)': [150, 370, 130],
  'Typical Switching Frequency (kHz)': [20, 100, 1000]
};

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  propertySelect = createSelect();
  for (const k in PROPERTIES) propertySelect.option(k);
  propertySelect.selected('Critical Field (MV/cm)');
  propertySelect.attribute('aria-label', 'Property to compare');

  positionUIElements();
  describe('Si vs SiC vs GaN device explorer: compares silicon, silicon carbide, and gallium nitride side by side across band gap, mobility, critical field, thermal conductivity, and switching frequency', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  propertySelect.position(bx + 170, by + drawHeight + 16);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const propKey = propertySelect.value();
  const values = PROPERTIES[propKey];
  const colors = [color(150, 150, 160), color(230, 150, 30), color(90, 62, 237)];

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('Material Comparison: ' + propKey, canvasWidth / 2, 8);

  const series = MATERIALS.map((m, i) => ({ label: m.split(' ')[0], value: values[i], color: colors[i] }));
  const yMax = max(values) * 1.2;
  smlDrawBarChart(70, 45, canvasWidth - 140, drawHeight - 130, series, yMax);

  fill(60); noStroke(); textAlign(CENTER, TOP); textSize(11.5);
  text('Higher critical field and thermal conductivity favor power devices; higher mobility favors high-frequency switching.', canvasWidth / 2, drawHeight - 70, canvasWidth - 80);

  drawControlLabels();
}

function drawControlLabels() {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Property', 160, drawHeight + 16 + 10);
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
