// Compound Semiconductor Explorer MicroSim
// Compares Si, GaAs, and InP across electron mobility, band gap type
// (direct vs. indirect), and typical application.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect;

const MATERIALS = {
  'Silicon (Si)': { mobility: 1350, gapType: 'Indirect', gap: 1.12, app: 'General-purpose digital/analog electronics' },
  'Gallium Arsenide (GaAs)': { mobility: 8500, gapType: 'Direct', gap: 1.42, app: 'High-frequency RF electronics, LEDs, solar cells' },
  'Indium Phosphide (InP)': { mobility: 5400, gapType: 'Direct', gap: 1.35, app: 'High-speed laser diodes and photodetectors for fiber optics' }
};

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  for (const k in MATERIALS) materialSelect.option(k);
  materialSelect.selected('Gallium Arsenide (GaAs)');
  materialSelect.attribute('aria-label', 'Compound semiconductor material');

  positionUIElements();
  describe('Compound semiconductor explorer: compares silicon, gallium arsenide, and indium phosphide across electron mobility, band gap type, and typical application', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  materialSelect.position(bx + 170, by + drawHeight + 16);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const key = materialSelect.value();
  const m = MATERIALS[key];

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('Compound Semiconductor Properties: ' + key, canvasWidth / 2, 8);

  const series = Object.keys(MATERIALS).map((k, i) => ({
    label: k.split(' ')[0],
    value: MATERIALS[k].mobility,
    color: k === key ? color(90, 62, 237) : color(200)
  }));
  smlDrawBarChart(70, 40, canvasWidth - 140, 190, series, 9000);
  fill(60); noStroke(); textAlign(CENTER, TOP); textSize(11);
  text('Electron mobility (cm²/V·s)', canvasWidth / 2, 235);

  const infoY = 265;
  fill(30); textAlign(LEFT, TOP); textSize(13);
  text('Band gap: ' + nf(m.gap, 1, 2) + ' eV (' + m.gapType + ')', 40, infoY);
  text('Electron mobility: ' + m.mobility + ' cm²/V·s', 40, infoY + 22);
  text('Typical application:', 40, infoY + 44);
  fill(90, 62, 237); textSize(12.5);
  text(m.app, 40, infoY + 64, canvasWidth - 80);

  drawControlLabels();
}

function drawControlLabels() {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Material', 160, drawHeight + 16 + 10);
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
