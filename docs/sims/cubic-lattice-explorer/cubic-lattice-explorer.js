// Cubic Lattice Explorer MicroSim
// Lets students rotate a 3D cubic unit cell (Simple Cubic, Body-Centered
// Cubic, or Face-Centered Cubic) and compare atoms-per-cell, coordination
// number, and atomic packing fraction across the three structures.
// Bloom Level: Understand / Apply (L2-L3) - identify, calculate
// MicroSim template version 2026.02 (3D / WEBGL variant)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 480;
let minDrawHeight = 420;
let maxDrawHeight = 520;

let structureSelect;
let readoutDiv;

const A = 180; // rendered lattice constant, in pixel-scale units (not to real scale)

// Structure data: atoms/cell, coordination number, and packing fraction
// come directly from the standard cubic-structure formulas:
//   SC:  1 atom/cell,  CN=6,  APF = (pi/6)          ~= 0.524  (2r = a)
//   BCC: 2 atoms/cell, CN=8,  APF = (sqrt(3)*pi/8)  ~= 0.680  (4r = sqrt(3) a)
//   FCC: 4 atoms/cell, CN=12, APF = (sqrt(2)*pi/6)  ~= 0.740  (4r = sqrt(2) a)
const STRUCTURES = {
  'Simple Cubic (SC)': {
    key: 'sc',
    atomsPerCell: 1,
    coordination: 6,
    packingFraction: 0.524,
    cornerColor: [76, 111, 231]
  },
  'Body-Centered Cubic (BCC)': {
    key: 'bcc',
    atomsPerCell: 2,
    coordination: 8,
    packingFraction: 0.680,
    cornerColor: [76, 111, 231],
    centerColor: [230, 126, 34]
  },
  'Face-Centered Cubic (FCC)': {
    key: 'fcc',
    atomsPerCell: 4,
    coordination: 12,
    packingFraction: 0.740,
    cornerColor: [76, 111, 231],
    faceColor: [230, 126, 34]
  }
};

// Touching-atom radius for each structure (from the packing-fraction touch
// condition), scaled down to 40% of true size so the wireframe cube stays
// visible instead of being hidden behind overlapping full-size spheres.
function atomRadius(key) {
  let full;
  if (key === 'sc') full = A / 2;
  else if (key === 'bcc') full = (A * Math.sqrt(3)) / 4;
  else full = (A * Math.sqrt(2)) / 4;
  return full * 0.4;
}

function setup() {
  updateCanvasSize();
  var mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, drawHeight, WEBGL);
  canvas.parent(mainElement);

  const controlPanel = createDiv('');
  controlPanel.class('control-panel');
  controlPanel.parent(mainElement);

  const selectLabel = createSpan('Crystal structure:');
  selectLabel.class('ctrl-label');
  selectLabel.parent(controlPanel);

  structureSelect = createSelect();
  structureSelect.parent(controlPanel);
  Object.keys(STRUCTURES).forEach((name) => structureSelect.option(name));
  structureSelect.selected('Simple Cubic (SC)');
  structureSelect.changed(updateReadout);
  structureSelect.attribute('aria-label', 'Crystal structure selection');

  const hint = createSpan('Drag to rotate · Scroll to zoom');
  hint.class('ctrl-hint');
  hint.parent(controlPanel);

  readoutDiv = createDiv('');
  readoutDiv.class('readout-panel');
  readoutDiv.parent(mainElement);

  updateReadout();

  describe('Rotatable 3D cubic unit cell showing atom positions for simple cubic, body-centered cubic, or face-centered cubic structures, with a live readout of atoms per cell, coordination number, and packing fraction', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function currentStructure() {
  return STRUCTURES[structureSelect.value()];
}

function updateReadout() {
  const s = currentStructure();
  readoutDiv.html(
    '<div class="readout-row"><strong>' + structureSelect.value() + '</strong></div>' +
    '<div class="readout-row">Atoms per unit cell: <span class="readout-value">' + s.atomsPerCell + '</span></div>' +
    '<div class="readout-row">Coordination number: <span class="readout-value">' + s.coordination + '</span></div>' +
    '<div class="readout-row">Atomic packing fraction: <span class="readout-value">' + s.packingFraction.toFixed(3) + '</span></div>' +
    '<div class="readout-row legend">' +
    '<span class="swatch" style="background: rgb(' + s.cornerColor.join(',') + ')"></span> corner atom' +
    (s.centerColor ? ' &nbsp;&nbsp; <span class="swatch" style="background: rgb(' + s.centerColor.join(',') + ')"></span> body-center atom' : '') +
    (s.faceColor ? ' &nbsp;&nbsp; <span class="swatch" style="background: rgb(' + s.faceColor.join(',') + ')"></span> face-center atom' : '') +
    '</div>'
  );
}

function draw() {
  background(250);
  orbitControl(1, 1, 0.15);

  ambientLight(130);
  directionalLight(255, 255, 255, 0.4, 0.8, -0.6);
  directionalLight(80, 80, 95, -0.4, -0.6, 0.7);

  const s = currentStructure();
  const r = atomRadius(s.key);

  drawWireCube(A);
  drawCornerAtoms(A, r, s.cornerColor);

  if (s.key === 'bcc') {
    drawBodyCenterAtom(r, s.centerColor);
  } else if (s.key === 'fcc') {
    drawFaceCenterAtoms(A, r, s.faceColor);
  }
}

function cubeCorners(a) {
  const h = a / 2;
  const pts = [];
  for (let xi = 0; xi <= 1; xi++) {
    for (let yi = 0; yi <= 1; yi++) {
      for (let zi = 0; zi <= 1; zi++) {
        pts.push({ x: xi * a - h, y: yi * a - h, z: zi * a - h });
      }
    }
  }
  return pts; // index = xi*4 + yi*2 + zi
}

function cubeEdges() {
  return [
    [0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3],
    [2, 6], [3, 7], [4, 5], [4, 6], [5, 7], [6, 7]
  ];
}

function drawWireCube(a) {
  const corners = cubeCorners(a);
  const edges = cubeEdges();
  stroke(60);
  strokeWeight(1.5);
  noFill();
  edges.forEach(([i, j]) => {
    line(corners[i].x, corners[i].y, corners[i].z, corners[j].x, corners[j].y, corners[j].z);
  });
}

function drawCornerAtoms(a, r, col) {
  const corners = cubeCorners(a);
  noStroke();
  ambientMaterial(col[0], col[1], col[2]);
  corners.forEach((p) => {
    push();
    translate(p.x, p.y, p.z);
    sphere(r, 18, 18);
    pop();
  });
}

function drawBodyCenterAtom(r, col) {
  noStroke();
  ambientMaterial(col[0], col[1], col[2]);
  push();
  translate(0, 0, 0);
  sphere(r, 18, 18);
  pop();
}

function drawFaceCenterAtoms(a, r, col) {
  const h = a / 2;
  const faces = [
    [0, 0, h], [0, 0, -h],
    [0, h, 0], [0, -h, 0],
    [h, 0, 0], [-h, 0, 0]
  ];
  noStroke();
  ambientMaterial(col[0], col[1], col[2]);
  faces.forEach((f) => {
    push();
    translate(f[0], f[1], f[2]);
    sphere(r, 18, 18);
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
  canvasWidth = containerWidth;
  drawHeight = Math.max(minDrawHeight, Math.min(maxDrawHeight, Math.floor(containerWidth * 0.62)));
}
