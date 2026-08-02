// Si / Ge / GaAs Property Comparison Chart MicroSim
// A grouped bar chart comparing four key properties (band gap, electron
// mobility, lattice constant, melting point) across silicon, germanium,
// and gallium arsenide, selected via a dropdown.
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let propertySelect;

const MATERIALS = [
  { name: 'Silicon', color: [90, 140, 220], Eg: 1.12, mobility: 1350, lattice: 0.543, melt: 1414 },
  { name: 'Germanium', color: [90, 180, 120], Eg: 0.66, mobility: 3900, lattice: 0.566, melt: 938 },
  { name: 'GaAs', color: [230, 140, 60], Eg: 1.42, mobility: 8500, lattice: 0.565, melt: 1238 }
];

const PROPERTIES = {
  'Band Gap (eV)': { key: 'Eg', max: 1.6, unit: ' eV' },
  'Electron Mobility (cm²/V·s)': { key: 'mobility', max: 9000, unit: '' },
  'Lattice Constant (nm)': { key: 'lattice', max: 0.6, unit: ' nm' },
  'Melting Point (°C)': { key: 'melt', max: 1500, unit: ' °C' }
};

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  propertySelect = createSelect();
  Object.keys(PROPERTIES).forEach(k => propertySelect.option(k));
  propertySelect.selected('Band Gap (eV)');
  propertySelect.attribute('aria-label', 'Property to compare');

  positionUIElements();
  describe('Silicon, germanium, gallium arsenide property comparison chart: a bar chart comparing band gap, electron mobility, lattice constant, or melting point across the three materials', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  propertySelect.position(bx + 170, by + drawHeight + 15);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const propName = propertySelect.value();
  const prop = PROPERTIES[propName];

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Comparing: ' + propName, canvasWidth / 2, 8);

  const series = MATERIALS.map(m => ({
    label: m.name,
    value: m[prop.key],
    color: color(m.color[0], m.color[1], m.color[2])
  }));

  smlDrawBarChart(60, 60, canvasWidth - 120, drawHeight - 130, series, prop.max, {
    valueFormat: function (v) { return v + prop.unit; }
  });

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Property:', 10, drawHeight + 20);
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
