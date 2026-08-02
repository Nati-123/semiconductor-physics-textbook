// Unit Cell Repetition Explorer MicroSim
// Shows how a single conventional unit cell (Simple Cubic, Body-Centered
// Cubic, or Face-Centered Cubic) tiles by simple translation into an N x N x N
// block of repeated cells -- the direct visual meaning of "a crystal lattice
// is a single unit cell repeated infinitely in three dimensions."
// Structure-specific detail (Diamond, Zincblende, HCP, etc.) is intentionally
// out of scope here -- that is the Crystal Structure Explorer's job. This
// sim's only job is the repetition concept itself.
// Reuses the corner/face/body atom-family approach from
// cubic-lattice-explorer.js, generalized with a per-cell (i,j,k) translation.
// Bloom Level: Understand (L2) - visualize, describe
// MicroSim template version 2026.02 (3D / WEBGL variant)

let containerWidth;
let drawHeight = 480;
let minDrawHeight = 420;
let maxDrawHeight = 560;

let structureSelect, nSlider, edgesToggle, atomSizeSlider;
let startButton, resetCamBtn;
let readoutDiv;
let isRunning = false;
let revealedCount = 0;
let revealOrder = [];
let lastN = 0;
let cam, camDefault = null;

const A = 200; // rendered cubic lattice constant, matches cubic-lattice-explorer.js

// ---------- shared corner/face/body point families (fractional cube coords) ----------
function famCorners() {
  return [
    [0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1],
    [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1]
  ];
}
function famFaces() {
  return [
    [0.5, 0.5, 0], [0.5, 0.5, 1], [0.5, 0, 0.5],
    [0.5, 1, 0.5], [0, 0.5, 0.5], [1, 0.5, 0.5]
  ];
}
function famBody() {
  return [[0.5, 0.5, 0.5]];
}
function familyPoints(name) {
  if (name === 'corners') return famCorners();
  if (name === 'faces') return famFaces();
  if (name === 'body') return famBody();
  return [];
}

const STRUCTURES = {
  'Simple Cubic (SC)': { color: [76, 111, 231], families: ['corners'] },
  'Body-Centered Cubic (BCC)': { color: [76, 111, 231], families: ['corners', 'body'] },
  'Face-Centered Cubic (FCC)': { color: [76, 111, 231], families: ['corners', 'faces'] }
};
const STRUCTURE_NAMES = Object.keys(STRUCTURES);

const CUBE_EDGES = [
  [0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 4],
  [2, 6], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7]
];

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, drawHeight, WEBGL);
  canvas.parent(mainElement);
  cam = createCamera();

  const row1 = createDiv(''); row1.class('control-panel'); row1.parent(mainElement);
  const selLabel = createSpan('Crystal structure:'); selLabel.class('ctrl-label'); selLabel.parent(row1);
  structureSelect = createSelect();
  structureSelect.parent(row1);
  STRUCTURE_NAMES.forEach((name) => structureSelect.option(name));
  structureSelect.selected('Simple Cubic (SC)');
  structureSelect.changed(onParamsChanged);
  const hint1 = createSpan('Drag to rotate · Scroll to zoom'); hint1.class('ctrl-hint'); hint1.parent(row1);

  const row2 = createDiv(''); row2.class('control-panel'); row2.parent(mainElement);
  const nLabel = createSpan('Repeat count N:'); nLabel.class('ctrl-label'); nLabel.parent(row2);
  nSlider = createSlider(1, 4, 2, 1);
  nSlider.class('index-slider');
  nSlider.parent(row2);
  nSlider.input(onParamsChanged);
  edgesToggle = createCheckbox('Show every cell\'s edges (vs. outer boundary only)', true);
  edgesToggle.parent(row2);

  const row3 = createDiv(''); row3.class('control-panel'); row3.parent(mainElement);
  const sizeLabel = createSpan('Atom size:'); sizeLabel.class('ctrl-label'); sizeLabel.parent(row3);
  atomSizeSlider = createSlider(0.15, 0.6, 0.32, 0.02);
  atomSizeSlider.class('index-slider');
  atomSizeSlider.parent(row3);
  startButton = createButton('Start');
  startButton.class('preset-btn');
  startButton.parent(row3);
  startButton.mousePressed(toggleRunning);
  resetCamBtn = createButton('↺ Reset Camera');
  resetCamBtn.class('preset-btn');
  resetCamBtn.parent(row3);
  resetCamBtn.mousePressed(resetCamera);

  readoutDiv = createDiv(''); readoutDiv.class('readout-panel'); readoutDiv.parent(mainElement);

  rebuildRevealOrder();
  setCameraForN();
  updateReadout();

  describe('3D viewer showing an N by N by N grid of repeated Simple Cubic, Body-Centered Cubic, or Face-Centered Cubic unit cells, with an optional cell-by-cell reveal animation, illustrating how a crystal lattice is built by repeating a single unit cell in three dimensions', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function onParamsChanged() {
  rebuildRevealOrder();
  isRunning = false;
  startButton.html('Start');
  revealedCount = revealOrder.length; // default: fully built, static
  setCameraForN();
  updateReadout();
}

function rebuildRevealOrder() {
  const N = nSlider.value();
  const cells = [];
  const center = (N - 1) / 2;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      for (let k = 0; k < N; k++) {
        const d = Math.sqrt((i - center) ** 2 + (j - center) ** 2 + (k - center) ** 2);
        cells.push({ i, j, k, d });
      }
    }
  }
  cells.sort((a, b) => a.d - b.d);
  revealOrder = cells;
  revealedCount = cells.length;
  lastN = N;
}

function toggleRunning() {
  if (nSlider.value() !== lastN) rebuildRevealOrder();
  isRunning = !isRunning;
  if (isRunning) {
    revealedCount = 0;
    startButton.html('Stop');
  } else {
    startButton.html('Start');
  }
  updateReadout();
}

function resetCamera() {
  setCameraForN();
}

function setCameraForN() {
  const N = nSlider.value();
  const span = N * A;
  const eyeDist = 900 + span * 1.1;
  cam.camera(eyeDist * 0.55, -eyeDist * 0.35, eyeDist * 0.75, 0, 0, 0, 0, 1, 0);
  camDefault = { eyeDist };
}

// ---------- world coordinates for a fractional point in cell (i,j,k) of an N^3 block ----------
function toWorldRepeated(p, i, j, k, N) {
  const halfSpan = (N * A) / 2;
  return {
    x: (p[0] + i) * A - halfSpan,
    y: (p[1] + j) * A - halfSpan,
    z: (p[2] + k) * A - halfSpan
  };
}

function draw() {
  background(250);
  orbitControl(1, 1, 0.15);

  ambientLight(130);
  directionalLight(255, 255, 255, 0.4, 0.8, -0.6);
  directionalLight(80, 80, 95, -0.4, -0.6, 0.7);

  const N = nSlider.value();
  const struct = STRUCTURES[structureSelect.value()];
  const showEdges = edgesToggle.checked();
  const sizeMul = atomSizeSlider.value();
  const r = (A / 5) * sizeMul;

  if (isRunning && revealedCount < revealOrder.length) {
    revealedCount++;
    if (revealedCount >= revealOrder.length) {
      isRunning = false;
      startButton.html('Replay');
    }
    updateReadout();
  }

  const cellsToShow = revealOrder.slice(0, revealedCount);

  if (showEdges) {
    cellsToShow.forEach((c) => drawCellEdges(c.i, c.j, c.k, N));
  } else {
    drawOuterBoundary(N);
  }

  cellsToShow.forEach((c) => {
    let pts = [];
    struct.families.forEach((fam) => { pts = pts.concat(familyPoints(fam)); });
    drawAtomsAt(pts, c.i, c.j, c.k, N, r, struct.color);
  });
}

function drawCellEdges(i, j, k, N) {
  const corners = famCorners().map((p) => toWorldRepeated(p, i, j, k, N));
  stroke(60); strokeWeight(1); noFill();
  CUBE_EDGES.forEach(([a, b]) => {
    line(corners[a].x, corners[a].y, corners[a].z, corners[b].x, corners[b].y, corners[b].z);
  });
}

function drawOuterBoundary(N) {
  const corners = famCorners().map((p) => ({
    x: p[0] * N * A - (N * A) / 2,
    y: p[1] * N * A - (N * A) / 2,
    z: p[2] * N * A - (N * A) / 2
  }));
  stroke(90, 40, 200); strokeWeight(2); noFill();
  CUBE_EDGES.forEach(([a, b]) => {
    line(corners[a].x, corners[a].y, corners[a].z, corners[b].x, corners[b].y, corners[b].z);
  });
}

function drawAtomsAt(fracList, i, j, k, N, r, col) {
  noStroke();
  ambientMaterial(col[0], col[1], col[2]);
  fracList.forEach((p) => {
    const w = toWorldRepeated(p, i, j, k, N);
    push();
    translate(w.x, w.y, w.z);
    sphere(r, 10, 10);
    pop();
  });
}

function updateReadout() {
  const N = nSlider.value();
  const total = N * N * N;
  readoutDiv.html(
    '<div class="readout-row"><strong>' + structureSelect.value() + '</strong></div>' +
    '<div class="readout-row">Unit cells shown: <span class="readout-value">' + revealedCount + ' / ' + total + '</span> &nbsp; (N&sup3; = ' + N + '&sup3; = ' + total + ')</div>' +
    '<div class="readout-row">Lattice constant <em>a</em> is the edge length of a single cell -- the whole block spans ' + N + '<em>a</em> in each direction.</div>'
  );
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, drawHeight);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  containerWidth = Math.floor(mainEl.getBoundingClientRect().width);
  drawHeight = Math.max(minDrawHeight, Math.min(maxDrawHeight, Math.floor(containerWidth * 0.62)));
}
