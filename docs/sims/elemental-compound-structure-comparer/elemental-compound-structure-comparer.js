// Elemental vs. Compound Semiconductor Structure Comparer MicroSim
// Draws a schematic 2D lattice for silicon (one atom species) or GaAs
// (two alternating atom species), using the shared lattice-grid helper.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 40;
let materialSelect;
const COLS = 5, ROWS = 4;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  materialSelect.option('Silicon (Elemental)');
  materialSelect.option('GaAs (Compound)');
  materialSelect.selected('Silicon (Elemental)');
  materialSelect.attribute('aria-label', 'Material selection');

  positionUIElements();
  describe('Elemental vs compound semiconductor structure comparer: shows a schematic lattice of silicon (one atom type) or gallium arsenide (two alternating atom types)', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  materialSelect.position(bx + 10, by + drawHeight + 15);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const isCompound = materialSelect.value().indexOf('Compound') >= 0;
  const spacing = min((canvasWidth - 2 * margin - 40) / (COLS - 1), 90);
  const x0 = canvasWidth / 2 - (spacing * (COLS - 1)) / 2;
  const y0 = 70;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text(isCompound ? 'GaAs: Compound Semiconductor Lattice' : 'Silicon: Elemental Semiconductor Lattice', canvasWidth / 2, 8);

  smlDrawLatticeGrid(x0, y0, COLS, ROWS, spacing, {
    atomR: 15,
    bondColor: color(110),
    electronColor: isCompound ? color(150, 40, 150) : color(40, 40, 220),
    labelFor: function (i, j) {
      if (!isCompound) return 'Si';
      return (i + j) % 2 === 0 ? 'Ga' : 'As';
    },
    colorFor: function (i, j) {
      if (!isCompound) return color(90, 140, 220);
      return (i + j) % 2 === 0 ? color(230, 140, 60) : color(90, 180, 120);
    }
  });

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Material:', 10, drawHeight + 20);

  const lines = isCompound
    ? ['GaAs alternates Ga (orange) and As (green) atoms on the lattice.',
       'Each bond joins one Group III (Ga) atom to one Group V (As) atom.',
       'Average of 4 valence electrons per atom, same as silicon.']
    : ['Silicon (blue) repeats a single atomic species throughout.',
       'Each atom forms 4 identical covalent bonds to Si neighbors.',
       'This uniform bonding is what "elemental" semiconductor means.'];
  smlDrawInfoBox(canvasWidth, drawHeight - 58, lines);
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
