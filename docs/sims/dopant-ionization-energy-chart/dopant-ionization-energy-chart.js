// Common Dopant Ionization Energy Chart MicroSim
// Bar chart of measured donor and acceptor ionization energies (meV) in
// silicon or germanium, selected via a dropdown.
// Bloom Level: Remember / Understand (L1-L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let hostSelect;

// Approximate measured ionization energies (meV)
const DATA = {
  'Silicon': {
    donors: [{ label: 'P', v: 45 }, { label: 'As', v: 54 }, { label: 'Sb', v: 39 }],
    acceptors: [{ label: 'B', v: 45 }, { label: 'Al', v: 67 }, { label: 'Ga', v: 72 }, { label: 'In', v: 160 }]
  },
  'Germanium': {
    donors: [{ label: 'P', v: 12.0 }, { label: 'As', v: 12.7 }, { label: 'Sb', v: 9.6 }],
    acceptors: [{ label: 'B', v: 10.4 }, { label: 'Al', v: 10.2 }, { label: 'Ga', v: 10.8 }, { label: 'In', v: 11.2 }]
  }
};

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  hostSelect = createSelect();
  hostSelect.option('Silicon');
  hostSelect.option('Germanium');
  hostSelect.selected('Silicon');
  hostSelect.attribute('aria-label', 'Host semiconductor');

  positionUIElements();
  describe('Common dopant ionization energy chart: bar chart of measured donor and acceptor ionization energies in silicon or germanium', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  hostSelect.position(bx + 130, by + drawHeight + 15);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const host = hostSelect.value();
  const data = DATA[host];
  const yMax = host === 'Silicon' ? 180 : 16;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Dopant Ionization Energies in ' + host + ' (meV)', canvasWidth / 2, 8);

  fill(40); textAlign(LEFT, TOP); textSize(13);
  text('Donors (n-type)', 40, 40);
  const donorSeries = data.donors.map(d => ({ label: d.label, value: d.v, color: color(90, 62, 237) }));
  smlDrawBarChart(40, 62, canvasWidth * 0.42, drawHeight - 130, donorSeries, yMax, { valueFormat: v => v });

  text('Acceptors (p-type)', canvasWidth * 0.55, 40);
  const accSeries = data.acceptors.map(d => ({ label: d.label, value: d.v, color: color(200, 90, 90) }));
  smlDrawBarChart(canvasWidth * 0.55, 62, canvasWidth * 0.43, drawHeight - 130, accSeries, yMax, { valueFormat: v => v });

  smlDrawInfoBox(canvasWidth, drawHeight - 58, [
    'Room-temperature thermal energy: k_BT ≈ 26 meV.',
    'Most of these energies are comparable to or below k_BT,',
    'so nearly all dopants ionize at room temperature.'
  ]);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Host material:', 10, drawHeight + 20);
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
