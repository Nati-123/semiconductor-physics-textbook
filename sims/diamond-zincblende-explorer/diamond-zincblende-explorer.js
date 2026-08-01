// Diamond / Zincblende Structure Explorer MicroSim
// Renders the diamond-cubic conventional unit cell -- an FCC lattice of
// corner + face atoms interpenetrated by a second FCC lattice of 4 interior
// atoms offset by (1/4,1/4,1/4)a -- with tetrahedral bonds drawn between
// each interior atom and its 4 nearest neighbors. In Zincblende mode the two
// interpenetrating sublattices are different species (e.g. Ga and As).
// Bloom Level: Understand (L2) - describe, distinguish
// MicroSim template version 2026.02 (3D / WEBGL variant)

let containerWidth;
let drawHeight = 480;
let minDrawHeight = 420;
let maxDrawHeight = 520;

let modeSelect;
let readoutDiv;

const A = 220; // rendered lattice constant, in pixel-scale units (not to real scale)
const ATOM_R = 15;

// Sublattice A: 8 corners + 6 face centers (fractional coordinates 0..1)
const SUB_A_FRAC = [
  [0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1],
  [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1],
  [0.5, 0.5, 0], [0.5, 0.5, 1], [0.5, 0, 0.5], [0.5, 1, 0.5], [0, 0.5, 0.5], [1, 0.5, 0.5]
];

// Sublattice B: 4 interior tetrahedral-site atoms, offset by (1/4,1/4,1/4)
const SUB_B_FRAC = [
  [0.25, 0.25, 0.25], [0.75, 0.75, 0.25], [0.75, 0.25, 0.75], [0.25, 0.75, 0.75]
];

// Each interior (sublattice B) atom bonds to its 4 nearest sublattice-A
// neighbors, all at distance sqrt(3)/4 * a -- the tetrahedral bonding that
// gives diamond cubic its coordination number of 4.
const BONDS_FRAC = [
  // from (0.25,0.25,0.25)
  [[0.25, 0.25, 0.25], [0, 0, 0]],
  [[0.25, 0.25, 0.25], [0.5, 0.5, 0]],
  [[0.25, 0.25, 0.25], [0.5, 0, 0.5]],
  [[0.25, 0.25, 0.25], [0, 0.5, 0.5]],
  // from (0.75,0.75,0.25)
  [[0.75, 0.75, 0.25], [0.5, 0.5, 0]],
  [[0.75, 0.75, 0.25], [1, 1, 0]],
  [[0.75, 0.75, 0.25], [1, 0.5, 0.5]],
  [[0.75, 0.75, 0.25], [0.5, 1, 0.5]],
  // from (0.75,0.25,0.75)
  [[0.75, 0.25, 0.75], [0.5, 0, 0.5]],
  [[0.75, 0.25, 0.75], [1, 0.5, 0.5]],
  [[0.75, 0.25, 0.75], [1, 0, 1]],
  [[0.75, 0.25, 0.75], [0.5, 0.5, 1]],
  // from (0.25,0.75,0.75)
  [[0.25, 0.75, 0.75], [0, 0.5, 0.5]],
  [[0.25, 0.75, 0.75], [0.5, 1, 0.5]],
  [[0.25, 0.75, 0.75], [0.5, 0.5, 1]],
  [[0.25, 0.75, 0.75], [0, 1, 1]]
];

const MODES = {
  'Diamond (Silicon, single element)': {
    key: 'diamond',
    colorA: [120, 130, 150],
    colorB: [120, 130, 150],
    labelA: 'Si',
    labelB: 'Si'
  },
  'Zincblende (Gallium Arsenide, GaAs)': {
    key: 'zincblende',
    colorA: [76, 111, 231],
    colorB: [230, 126, 34],
    labelA: 'Ga',
    labelB: 'As'
  }
};

function toWorld(p) {
  const h = A / 2;
  return { x: p[0] * A - h, y: p[1] * A - h, z: p[2] * A - h };
}

function setup() {
  updateCanvasSize();
  var mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, drawHeight, WEBGL);
  canvas.parent(mainElement);

  const controlPanel = createDiv('');
  controlPanel.class('control-panel');
  controlPanel.parent(mainElement);

  const selectLabel = createSpan('Structure:');
  selectLabel.class('ctrl-label');
  selectLabel.parent(controlPanel);

  modeSelect = createSelect();
  modeSelect.parent(controlPanel);
  Object.keys(MODES).forEach((name) => modeSelect.option(name));
  modeSelect.selected('Diamond (Silicon, single element)');
  modeSelect.changed(updateReadout);
  modeSelect.attribute('aria-label', 'Diamond or zincblende structure selection');

  const hint = createSpan('Drag to rotate · Scroll to zoom');
  hint.class('ctrl-hint');
  hint.parent(controlPanel);

  readoutDiv = createDiv('');
  readoutDiv.class('readout-panel');
  readoutDiv.parent(mainElement);

  updateReadout();

  describe('Rotatable 3D diamond-cubic unit cell showing two interpenetrating FCC sublattices connected by tetrahedral bonds, toggled between single-element diamond and two-element zincblende coloring', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function currentMode() {
  return MODES[modeSelect.value()];
}

function updateReadout() {
  const m = currentMode();
  readoutDiv.html(
    '<div class="readout-row"><strong>' + modeSelect.value() + '</strong></div>' +
    '<div class="readout-row">Atoms per unit cell: <span class="readout-value">8</span></div>' +
    '<div class="readout-row">Coordination number: <span class="readout-value">4</span> (tetrahedral bonding)</div>' +
    '<div class="readout-row legend">' +
    '<span class="swatch" style="background: rgb(' + m.colorA.join(',') + ')"></span> ' + m.labelA + ' sublattice (corners + faces)' +
    ' &nbsp;&nbsp; <span class="swatch" style="background: rgb(' + m.colorB.join(',') + ')"></span> ' + m.labelB + ' sublattice (interior, offset by 1/4,1/4,1/4)' +
    '</div>'
  );
}

function draw() {
  background(250);
  orbitControl(1, 1, 0.15);

  ambientLight(130);
  directionalLight(255, 255, 255, 0.4, 0.8, -0.6);
  directionalLight(80, 80, 95, -0.4, -0.6, 0.7);

  drawWireCube();
  drawBonds();

  const m = currentMode();
  drawAtoms(SUB_A_FRAC, m.colorA);
  drawAtoms(SUB_B_FRAC, m.colorB);
}

function drawWireCube() {
  const corners = [
    [0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1],
    [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1]
  ].map(toWorld);
  const edges = [
    [0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 4],
    [2, 6], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7]
  ];
  stroke(150, 150, 160);
  strokeWeight(1);
  noFill();
  edges.forEach(([i, j]) => {
    line(corners[i].x, corners[i].y, corners[i].z, corners[j].x, corners[j].y, corners[j].z);
  });
}

function drawBonds() {
  stroke(90);
  strokeWeight(3.5);
  BONDS_FRAC.forEach(([p, q]) => {
    const wp = toWorld(p);
    const wq = toWorld(q);
    line(wp.x, wp.y, wp.z, wq.x, wq.y, wq.z);
  });
}

function drawAtoms(fracList, col) {
  noStroke();
  ambientMaterial(col[0], col[1], col[2]);
  fracList.forEach((p) => {
    const w = toWorld(p);
    push();
    translate(w.x, w.y, w.z);
    sphere(ATOM_R, 16, 16);
    pop();
  });
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, drawHeight);
}

function updateCanvasSize() {
  var mainEl = document.querySelector('main');
  containerWidth = Math.floor(mainEl.getBoundingClientRect().width);
  drawHeight = Math.max(minDrawHeight, Math.min(maxDrawHeight, Math.floor(containerWidth * 0.62)));
}
