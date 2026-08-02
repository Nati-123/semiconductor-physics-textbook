// Crystal Structure Explorer MicroSim
// Expanded from the original 3-structure Cubic Lattice Explorer into a full
// 9-structure crystal structure explorer covering the major structures used
// in solid-state and semiconductor physics: Simple Cubic, BCC, FCC, HCP,
// Diamond Cubic, Zinc Blende, Rock Salt, Cesium Chloride, and Wurtzite.
// Bloom Level: Understand / Apply / Analyze (L2-L4)
// MicroSim template version 2026.02 (3D / WEBGL variant)

let containerWidth;
let drawHeight = 480;
let minDrawHeight = 420;
let maxDrawHeight = 560;

// p5's WEBGL renderer refuses to draw text() until a font is explicitly
// loaded and set with textFont() -- without this, the "Atom labels" toggle
// silently draws nothing (see console: "you must load and set a font").
let atomFont;

// --- DOM control references ---
let structureSelect;
let labelsToggle, edgesToggle, bondsToggle, primitiveToggle, overlayToggle;
let atomSizeSlider;
let hInput, kInput, lInput, uInput, vInput, wInput;
let resetCamBtn;
let readoutDiv;
let cam;
let camDefault = null;

// --- pixel-scale lattice constants (not to real physical scale) ---
const A = 200;                 // rendered cubic lattice constant
const HEX_A = 150;             // rendered hexagonal basal edge
const HEX_C = HEX_A * Math.sqrt(8 / 3); // ideal c/a = sqrt(8/3)
const WURTZITE_U = 0.375;      // ideal internal parameter

// ============================================================
// Fractional-coordinate point "families" shared by cubic structures.
// Each family lists points in fractional (0..1) cube coordinates plus
// the textbook sharing weight (used only for documentation / cross
// checks -- the atoms-per-cell numbers below are the authoritative,
// citation-checked values).
// ============================================================
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
function famEdges() {
  return [
    [0.5, 0, 0], [0.5, 1, 0], [0.5, 0, 1], [0.5, 1, 1],
    [0, 0.5, 0], [1, 0.5, 0], [0, 0.5, 1], [1, 0.5, 1],
    [0, 0, 0.5], [1, 0, 0.5], [0, 1, 0.5], [1, 1, 0.5]
  ];
}
function famBody() {
  return [[0.5, 0.5, 0.5]];
}
function famInterior() {
  return [
    [0.25, 0.25, 0.25], [0.75, 0.75, 0.25],
    [0.75, 0.25, 0.75], [0.25, 0.75, 0.75]
  ];
}
function familyPoints(name) {
  if (name === 'corners') return famCorners();
  if (name === 'faces') return famFaces();
  if (name === 'edges') return famEdges();
  if (name === 'body') return famBody();
  if (name === 'interior') return famInterior();
  return [];
}

// Tetrahedral bonds for diamond / zincblende: each of the 4 interior
// (0.25-type) atoms bonds to its 4 nearest corner+face neighbors, all at
// distance (sqrt(3)/4)*a -- reused unchanged from diamond-zincblende.js.
const DIAMOND_BONDS_FRAC = [
  [[0.25, 0.25, 0.25], [0, 0, 0]],
  [[0.25, 0.25, 0.25], [0.5, 0.5, 0]],
  [[0.25, 0.25, 0.25], [0.5, 0, 0.5]],
  [[0.25, 0.25, 0.25], [0, 0.5, 0.5]],
  [[0.75, 0.75, 0.25], [0.5, 0.5, 0]],
  [[0.75, 0.75, 0.25], [1, 1, 0]],
  [[0.75, 0.75, 0.25], [1, 0.5, 0.5]],
  [[0.75, 0.75, 0.25], [0.5, 1, 0.5]],
  [[0.75, 0.25, 0.75], [0.5, 0, 0.5]],
  [[0.75, 0.25, 0.75], [1, 0.5, 0.5]],
  [[0.75, 0.25, 0.75], [1, 0, 1]],
  [[0.75, 0.25, 0.75], [0.5, 0.5, 1]],
  [[0.25, 0.75, 0.75], [0, 0.5, 0.5]],
  [[0.25, 0.75, 0.75], [0.5, 1, 0.5]],
  [[0.25, 0.75, 0.75], [0.5, 0.5, 1]],
  [[0.25, 0.75, 0.75], [0, 1, 1]]
];

// ============================================================
// Hexagonal-prism point families for HCP / Wurtzite. The "conventional"
// cell drawn here is the standard textbook hexagonal-prism visual
// (equivalent to 3 stacked primitive cells): 12 corner atoms (6 on the
// bottom hexagon + 6 on the top hexagon), 2 hexagon-center face atoms
// (top + bottom), and 3 interior atoms sitting in alternating triangular
// voids at half height -- 12x(1/6) + 2x(1/2) + 3x1 = 6 atoms, matching
// 2 atoms/primitive cell x 3 stacked cells.
// zShift (0..1, fraction of c) offsets every point along the c-axis --
// used to build the second (anion) sublattice of Wurtzite, which is a
// second HCP-type sublattice displaced along c by the internal parameter
// u (ideal u = 3/8), wrapped into the [0, c] prism.
// ============================================================
function hexCorners(zShift) {
  const pts = [];
  for (let ring = 0; ring < 2; ring++) {
    let z = ring === 0 ? 0 : 1; // fraction of c
    z = wrapFrac(z + zShift);
    for (let i = 0; i < 6; i++) {
      const ang = (Math.PI / 3) * i;
      pts.push([Math.cos(ang), Math.sin(ang), z]);
    }
  }
  return pts;
}
function hexFaces(zShift) {
  return [
    [0, 0, wrapFrac(0 + zShift)],
    [0, 0, wrapFrac(1 + zShift)]
  ];
}
function hexInterior(zShift) {
  const pts = [];
  const r = 1 / Math.sqrt(3);
  for (let i = 0; i < 3; i++) {
    const ang = (Math.PI / 3) * (i * 2 + 0.5); // 30, 150, 270 deg
    pts.push([r * Math.cos(ang), r * Math.sin(ang), wrapFrac(0.5 + zShift)]);
  }
  return pts;
}
function wrapFrac(z) {
  let out = z % 1;
  if (out < 0) out += 1;
  return out;
}
// world coords for a hex-family point [xRadiusUnits, yRadiusUnits, zFracOfC]
function hexToWorld(p) {
  return { x: p[0] * HEX_A, y: p[1] * HEX_A, z: p[2] * HEX_C - HEX_C / 2 };
}

// ============================================================
// STRUCTURES -- one authoritative data record per crystal structure.
// Values (atoms/cell, CN, NN distance, APF, examples, relevance) are the
// verified constants specified for this MicroSim; they are not derived
// on the fly.
// ============================================================
const STRUCTURES = {
  'Simple Cubic (SC)': {
    key: 'sc', system: 'Cubic', bravais: 'Simple cubic (P) -- basis: 1 atom at (0,0,0)',
    lattice: 'cubic', atomsPerCell: 1, coordination: 6,
    nnDistance: 'a', nnFactor: 1.0, apf: 0.524,
    examples: 'Polonium (only elemental room-temperature example)',
    relevance: 'Rare in nature; used as the pedagogical reference structure other cubic lattices build on.',
    species: [{ label: 'Po', color: [76, 111, 231], families: ['corners'] }],
    bonds: null, primitive: 'sc'
  },
  'Body-Centered Cubic (BCC)': {
    key: 'bcc', system: 'Cubic', bravais: 'Body-centered cubic (I) -- basis: (0,0,0) + (1/2,1/2,1/2)',
    lattice: 'cubic', atomsPerCell: 2, coordination: 8,
    nnDistance: '(√3/2)a', nnFactor: Math.sqrt(3) / 2, apf: 0.680,
    examples: 'α-iron, chromium, tungsten, sodium',
    relevance: 'Common metal electrode/interconnect material (e.g. tungsten vias).',
    species: [{ label: 'M', color: [76, 111, 231], families: ['corners', 'body'] }],
    bonds: null, primitive: 'bcc'
  },
  'Face-Centered Cubic (FCC)': {
    key: 'fcc', system: 'Cubic', bravais: 'Face-centered cubic (F) -- basis: (0,0,0) + 3 face-center positions',
    lattice: 'cubic', atomsPerCell: 4, coordination: 12,
    nnDistance: 'a/√2', nnFactor: 1 / Math.sqrt(2), apf: 0.740,
    examples: 'Aluminum, copper, gold, silver',
    relevance: 'Common interconnect metals (Al, Cu); also the parent lattice of Diamond Cubic and Zinc Blende.',
    species: [{ label: 'M', color: [76, 111, 231], families: ['corners', 'faces'] }],
    bonds: null, primitive: 'fcc'
  },
  'Hexagonal Close-Packed (HCP)': {
    key: 'hcp', system: 'Hexagonal', bravais: 'Simple hexagonal lattice + 2-atom basis (ABAB stacking)',
    lattice: 'hex', atomsPerCell: 6, coordination: 12,
    nnDistance: 'a', nnFactor: 1.0, apf: 0.740,
    examples: 'Magnesium, zinc, titanium, cobalt, beryllium',
    relevance: 'Wurtzite is the two-species/compound analog of HCP -- important for GaN/ZnO optoelectronics.',
    species: [{ label: 'M', color: [76, 111, 231], families: ['hexCorners', 'hexFaces', 'hexInterior'] }],
    bonds: null, primitive: 'hex'
  },
  'Diamond Cubic': {
    key: 'diamond', system: 'Cubic', bravais: 'FCC + 2-atom basis at (0,0,0) and (1/4,1/4,1/4), same element on both sublattices',
    lattice: 'cubic', atomsPerCell: 8, coordination: 4,
    nnDistance: '(√3/4)a', nnFactor: Math.sqrt(3) / 4, apf: 0.340,
    examples: 'Silicon (a=0.543 nm), germanium (a=0.566 nm), diamond (carbon)',
    relevance: 'The single most important structure in this chapter -- silicon and germanium, the two workhorse elemental semiconductors, both crystallize in diamond cubic.',
    species: [
      { label: 'Si', color: [120, 130, 150], families: ['corners', 'faces'] },
      { label: 'Si', color: [120, 130, 150], families: ['interior'] }
    ],
    bonds: 'diamond', primitive: 'fcc'
  },
  'Zinc Blende (Zincblende)': {
    key: 'zincblende', system: 'Cubic', bravais: 'FCC + 2-atom basis at (0,0,0) and (1/4,1/4,1/4), two different species',
    lattice: 'cubic', atomsPerCell: 8, coordination: 4,
    nnDistance: '(√3/4)a', nnFactor: Math.sqrt(3) / 4, apf: 'Varies by ionic/atomic radii (no single universal number)',
    examples: 'GaAs (a=0.565 nm), GaP, InP, InAs, ZnS (sphalerite)',
    relevance: 'THE fundamental structure for most III-V compound semiconductors -- critical for LEDs, laser diodes, solar cells, and high-speed/high-frequency transistors.',
    species: [
      { label: 'Ga', color: [76, 111, 231], families: ['corners', 'faces'] },
      { label: 'As', color: [230, 126, 34], families: ['interior'] }
    ],
    bonds: 'diamond', primitive: 'fcc'
  },
  'Rock Salt (NaCl structure)': {
    key: 'rocksalt', system: 'Cubic', bravais: 'Two interpenetrating FCC sublattices offset by (1/2,0,0)a',
    lattice: 'cubic', atomsPerCell: 8, coordination: 6,
    nnDistance: 'a/2', nnFactor: 0.5, apf: 'Varies by ionic radii (no single universal number)',
    examples: 'NaCl (table salt), MgO, many alkali halides',
    relevance: 'Mostly ionic insulators, included for structural contrast -- its 6-fold octahedral ionic coordination is a useful counterpoint to zincblende’s 4-fold tetrahedral covalent coordination; MgO is sometimes used as an insulating substrate/barrier layer.',
    species: [
      { label: 'Na', color: [76, 111, 231], families: ['corners', 'faces'] },
      { label: 'Cl', color: [46, 158, 91], families: ['edges', 'body'] }
    ],
    bonds: null, primitive: 'fcc'
  },
  'Cesium Chloride (CsCl)': {
    key: 'cscl', system: 'Cubic', bravais: 'Simple cubic (P) + 2-atom basis: Cs+ at (0,0,0), Cl- at (1/2,1/2,1/2) (NOT body-centered -- corner and body-center sites hold different species)',
    lattice: 'cubic', atomsPerCell: 2, coordination: 8,
    nnDistance: '(√3/2)a', nnFactor: Math.sqrt(3) / 2, apf: 'Varies by ionic radii (no single universal number)',
    examples: 'CsCl, CsBr, CsI',
    relevance: 'Mostly ionic salts, included as the compound analog of BCC for structural contrast -- occupying corner and body-center sites with different species changes the Bravais lattice classification itself.',
    species: [
      { label: 'Cs', color: [76, 111, 231], families: ['corners'] },
      { label: 'Cl', color: [46, 158, 91], families: ['body'] }
    ],
    bonds: null, primitive: 'sc'
  },
  'Wurtzite (GaN)': {
    key: 'wurtzite', system: 'Hexagonal', bravais: 'Compound analog of HCP -- two HCP-type sublattices offset along c by internal parameter u (ideal u=3/8), ABAB stacking',
    lattice: 'hex', atomsPerCell: 12, coordination: 4,
    nnDistance: 'u·c (≈ 0.612a for ideal c/a and u=3/8)', nnFactor: WURTZITE_U * Math.sqrt(8 / 3), apf: 'Varies by ionic/atomic radii (no single universal number)',
    examples: 'GaN, AlN, ZnO, CdS, and SiC’s hexagonal polytype',
    relevance: 'GaN and AlN are the basis of blue/UV LEDs, laser diodes, and high-power/high-frequency GaN transistors (HEMTs); ZnO is used in transparent electronics and UV photodetectors.',
    species: [
      { label: 'Ga', color: [76, 111, 231], families: ['hexCorners', 'hexFaces', 'hexInterior'], zShift: 0 },
      { label: 'N', color: [230, 126, 34], families: ['hexCorners', 'hexFaces', 'hexInterior'], zShift: WURTZITE_U }
    ],
    bonds: 'wurtzite', primitive: 'hex'
  }
};

const STRUCTURE_NAMES = Object.keys(STRUCTURES);

function preload() {
  atomFont = loadFont('../fonts/DejaVuSans.ttf');
}

// ============================================================
// setup / DOM
// ============================================================
function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, drawHeight, WEBGL);
  canvas.parent(mainElement);
  textFont(atomFont);
  cam = createCamera();
  camDefault = { eyeX: cam.eyeX, eyeY: cam.eyeY, eyeZ: cam.eyeZ, centerX: cam.centerX, centerY: cam.centerY, centerZ: cam.centerZ, upX: cam.upX, upY: cam.upY, upZ: cam.upZ };

  // --- Row 1: structure dropdown ---
  const row1 = createDiv(''); row1.class('control-panel'); row1.parent(mainElement);
  const selLabel = createSpan('Crystal structure:'); selLabel.class('ctrl-label'); selLabel.parent(row1);
  structureSelect = createSelect();
  structureSelect.parent(row1);
  STRUCTURE_NAMES.forEach((name) => structureSelect.option(name));
  structureSelect.selected('Simple Cubic (SC)');
  structureSelect.changed(onStructureChanged);
  structureSelect.attribute('aria-label', 'Crystal structure selection');
  const hint1 = createSpan('Drag to rotate · Scroll to zoom'); hint1.class('ctrl-hint'); hint1.parent(row1);

  // --- Row 2: toggles ---
  const row2 = createDiv(''); row2.class('control-panel'); row2.parent(mainElement);
  labelsToggle = makeCheckbox(row2, 'Atom labels', false);
  edgesToggle = makeCheckbox(row2, 'Unit-cell edges', true);
  bondsToggle = makeCheckbox(row2, 'Nearest-neighbor bonds', true);
  primitiveToggle = makeCheckbox(row2, 'Primitive cell (instead of conventional)', false);
  overlayToggle = makeCheckbox(row2, 'Show plane / direction overlay', false);

  // --- Row 3: atom size slider ---
  const row3 = createDiv(''); row3.class('control-panel'); row3.parent(mainElement);
  const sizeLabel = createSpan('Atom size:'); sizeLabel.class('ctrl-label'); sizeLabel.parent(row3);
  atomSizeSlider = createSlider(0.15, 1.0, 0.4, 0.05);
  atomSizeSlider.class('index-slider');
  atomSizeSlider.parent(row3);
  atomSizeSlider.attribute('aria-label', 'Atom display size');
  resetCamBtn = createButton('↺ Reset Camera');
  resetCamBtn.class('preset-btn');
  resetCamBtn.parent(row3);
  resetCamBtn.mousePressed(resetCamera);

  // --- Row 4: Miller plane (h k l) + direction [u v w] ---
  const row4 = createDiv(''); row4.class('control-panel'); row4.parent(mainElement);
  const planeLabel = createSpan('Plane (h k l):'); planeLabel.class('ctrl-label'); planeLabel.parent(row4);
  hInput = makeSmallNumberInput(row4, 'h', 1);
  kInput = makeSmallNumberInput(row4, 'k', 1);
  lInput = makeSmallNumberInput(row4, 'l', 1);
  const dirLabel = createSpan('Direction [u v w]:'); dirLabel.class('ctrl-label'); dirLabel.parent(row4);
  uInput = makeSmallNumberInput(row4, 'u', 1);
  vInput = makeSmallNumberInput(row4, 'v', 1);
  wInput = makeSmallNumberInput(row4, 'w', 0);

  readoutDiv = createDiv(''); readoutDiv.class('readout-panel'); readoutDiv.parent(mainElement);

  updateReadout();

  describe('Rotatable 3D crystal structure viewer covering nine major crystal structures (SC, BCC, FCC, HCP, Diamond Cubic, Zinc Blende, Rock Salt, Cesium Chloride, Wurtzite) with atom labels, unit-cell edges, nearest-neighbor bonds, primitive-cell overlay, Miller-index plane shading, and a live readout of crystallographic properties', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function makeCheckbox(parent, labelText, defaultVal) {
  const wrap = createDiv(''); wrap.class('slider-field'); wrap.parent(parent);
  const cb = createCheckbox(labelText, defaultVal);
  cb.parent(wrap);
  cb.changed(updateReadout);
  return cb;
}

function makeSmallNumberInput(parent, name, def) {
  const wrap = createDiv(''); wrap.class('slider-field'); wrap.parent(parent);
  const label = createSpan(name + ':'); label.class('ctrl-label'); label.parent(wrap);
  const inp = createInput(String(def), 'number');
  inp.attribute('step', '1');
  inp.style('width', '46px');
  inp.parent(wrap);
  inp.attribute('aria-label', 'Miller/direction index ' + name);
  inp.input(updateReadout);
  return inp;
}

function onStructureChanged() {
  updateReadout();
}

function resetCamera() {
  if (!camDefault) return;
  cam.camera(camDefault.eyeX, camDefault.eyeY, camDefault.eyeZ,
    camDefault.centerX, camDefault.centerY, camDefault.centerZ,
    camDefault.upX, camDefault.upY, camDefault.upZ);
}

function currentStructure() {
  return STRUCTURES[structureSelect.value()];
}

function isHexStructure(s) {
  return s.lattice === 'hex';
}

// ============================================================
// readout panel
// ============================================================
function updateReadout() {
  const s = currentStructure();
  const apfStr = (typeof s.apf === 'number') ? s.apf.toFixed(3) : s.apf;

  let legend = '<div class="readout-row legend">';
  s.species.forEach((sp) => {
    legend += '<span class="swatch" style="background: rgb(' + sp.color.join(',') + ')"></span> ' + sp.label + ' &nbsp;&nbsp; ';
  });
  legend += '</div>';

  let bondNote = '';
  if (s.bonds) {
    bondNote = '<div class="readout-row">Nearest-neighbor bonds: <span class="readout-value">tetrahedral, CN=' + s.coordination + '</span></div>';
  } else {
    bondNote = '<div class="readout-row">Nearest-neighbor bonds: <span class="readout-value">not applicable for this structure (CN=' + s.coordination + ' but non-tetrahedral geometry) -- bond toggle has no visual effect</span></div>';
  }

  let planeNote = '';
  if (isHexStructure(s)) {
    planeNote = '<div class="readout-row warn">Miller plane / direction overlay is disabled for hexagonal structures (HCP, Wurtzite) in this simplified tool -- hexagonal systems use 4-index Miller-Bravais (hkil) notation, not the 3-index (hkl) notation modeled here.</div>';
  } else if (overlayToggle && overlayToggle.checked()) {
    const h = parseIntSafe(hInput.value());
    const k = parseIntSafe(kInput.value());
    const l = parseIntSafe(lInput.value());
    if (!(h === 0 && k === 0 && l === 0)) {
      const poly = computeIntersectionPolygonCubic(h, k, l);
      if (!poly) {
        planeNote = '<div class="readout-row warn">Plane (' + h + ' ' + k + ' ' + l + ') does not cross this conventional unit cell -- this cell spans (0,0,0) to (a,a,a), and at least one of this plane\'s axis intercepts falls outside that range. Negative indices are valid and shade correctly when mixed with a positive index that pulls the intercept back into range -- try (1 1 -1) or (-1 1 1). A negative index with no compensating positive index (e.g. (-1 0 0) or (-1 1 0)) places the whole plane in a neighboring cell, so nothing is visible here -- this itself is a useful observation about how Miller planes relate to adjacent unit cells.</div>';
      }
    }
  }

  readoutDiv.html(
    '<div class="readout-row"><strong>' + structureSelect.value() + '</strong></div>' +
    '<div class="readout-row">Crystal system: <span class="readout-value">' + s.system + '</span></div>' +
    '<div class="readout-row">Bravais lattice / basis: <span class="readout-value">' + s.bravais + '</span></div>' +
    '<div class="readout-row">Atoms per conventional cell: <span class="readout-value">' + s.atomsPerCell + '</span></div>' +
    '<div class="readout-row">Coordination number: <span class="readout-value">' + s.coordination + '</span></div>' +
    '<div class="readout-row">Nearest-neighbor distance: <span class="readout-value">' + s.nnDistance + '</span></div>' +
    '<div class="readout-row">Atomic packing factor: <span class="readout-value">' + apfStr + '</span></div>' +
    '<div class="readout-row">Example materials: <span class="readout-value">' + s.examples + '</span></div>' +
    '<div class="readout-row">Semiconductor relevance: ' + s.relevance + '</div>' +
    bondNote + planeNote + legend
  );
}

// ============================================================
// draw
// ============================================================
function draw() {
  background(250);
  orbitControl(1, 1, 0.15);

  ambientLight(130);
  directionalLight(255, 255, 255, 0.4, 0.8, -0.6);
  directionalLight(80, 80, 95, -0.4, -0.6, 0.7);

  const s = currentStructure();
  const showLabels = labelsToggle.checked();
  const showEdges = edgesToggle.checked();
  const showBonds = bondsToggle.checked();
  const showPrimitive = primitiveToggle.checked();
  const showOverlay = overlayToggle.checked();
  const sizeMul = atomSizeSlider.value();

  if (isHexStructure(s)) {
    drawHexStructure(s, showLabels, showEdges, showBonds, showPrimitive, sizeMul);
  } else {
    drawCubicStructure(s, showLabels, showEdges, showBonds, showPrimitive, showOverlay, sizeMul);
  }
}

// ---------- cubic rendering ----------
function toWorldCubic(p) {
  const h = A / 2;
  return { x: p[0] * A - h, y: p[1] * A - h, z: p[2] * A - h };
}

function cubeCorners() {
  return famCorners().map(toWorldCubic);
}
const CUBE_EDGES = [
  [0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 4],
  [2, 6], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7]
];
// NOTE: famCorners() ordering is [000,100,010,001,110,101,011,111] which
// matches the CORNERS ordering used in miller-indices-explorer.js, so the
// edge index pairs above (identical to that file) are valid here too.

function drawCubicStructure(s, showLabels, showEdges, showBonds, showPrimitive, showOverlay, sizeMul) {
  if (showEdges) {
    if (showPrimitive) {
      drawPrimitiveParallelepiped(s.primitive);
    } else {
      drawWireCubeConventional();
    }
  }

  if (showBonds && s.bonds === 'diamond') {
    drawDiamondBonds();
  }

  const r = (s.nnFactor * A / 2) * sizeMul;
  s.species.forEach((sp) => {
    let pts = [];
    sp.families.forEach((fam) => { pts = pts.concat(familyPoints(fam)); });
    drawCubicAtoms(pts, r, sp.color, showLabels ? sp.label : null);
  });

  if (showOverlay) {
    const h = parseIntSafe(hInput.value());
    const k = parseIntSafe(kInput.value());
    const l = parseIntSafe(lInput.value());
    if (!(h === 0 && k === 0 && l === 0)) {
      const poly = computeIntersectionPolygonCubic(h, k, l);
      if (poly) drawPlanePolygonCubic(poly);
    }
    const u = parseIntSafe(uInput.value());
    const v = parseIntSafe(vInput.value());
    const w = parseIntSafe(wInput.value());
    if (!(u === 0 && v === 0 && w === 0)) {
      drawDirectionVectorCubic(u, v, w);
    }
  }
}

function parseIntSafe(v) {
  const n = parseInt(v, 10);
  return isNaN(n) ? 0 : n;
}

function drawWireCubeConventional() {
  const corners = cubeCorners();
  stroke(60); strokeWeight(1.5); noFill();
  CUBE_EDGES.forEach(([i, j]) => {
    line(corners[i].x, corners[i].y, corners[i].z, corners[j].x, corners[j].y, corners[j].z);
  });
}

function drawDiamondBonds() {
  stroke(90); strokeWeight(3.0);
  DIAMOND_BONDS_FRAC.forEach(([p, q]) => {
    const wp = toWorldCubic(p), wq = toWorldCubic(q);
    line(wp.x, wp.y, wp.z, wq.x, wq.y, wq.z);
  });
}

function drawCubicAtoms(fracList, r, col, label) {
  noStroke();
  ambientMaterial(col[0], col[1], col[2]);
  fracList.forEach((p) => {
    const w = toWorldCubic(p);
    push();
    translate(w.x, w.y, w.z);
    sphere(r, 16, 16);
    if (label) {
      fill(20);
      textSize(11);
      translate(0, -r - 6, 0);
      text(label, 0, 0);
      ambientMaterial(col[0], col[1], col[2]);
    }
    pop();
  });
}

// Primitive-cell parallelepipeds, per the standard primitive vectors.
function primitiveVectorsFor(kind) {
  const h = A / 2;
  if (kind === 'sc') {
    return { origin: [-h, -h, -h], v1: [A, 0, 0], v2: [0, A, 0], v3: [0, 0, A] };
  }
  if (kind === 'bcc') {
    return { origin: [-h, -h, -h], v1: [-A / 2, A / 2, A / 2], v2: [A / 2, -A / 2, A / 2], v3: [A / 2, A / 2, -A / 2] };
  }
  if (kind === 'fcc') {
    return { origin: [-h, -h, -h], v1: [0, A / 2, A / 2], v2: [A / 2, 0, A / 2], v3: [A / 2, A / 2, 0] };
  }
  return null;
}

function drawPrimitiveParallelepiped(kind) {
  if (kind === 'hex') { drawPrimitiveHex(); return; }
  const pv = primitiveVectorsFor(kind);
  if (!pv) return;
  const o = pv.origin;
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const verts = [
    o,
    add(o, pv.v1), add(o, pv.v2), add(o, pv.v3),
    add(add(o, pv.v1), pv.v2), add(add(o, pv.v1), pv.v3), add(add(o, pv.v2), pv.v3),
    add(add(add(o, pv.v1), pv.v2), pv.v3)
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 4],
    [2, 6], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7]
  ];
  stroke(90, 40, 200); strokeWeight(2); noFill();
  edges.forEach(([i, j]) => {
    line(verts[i][0], verts[i][1], verts[i][2], verts[j][0], verts[j][1], verts[j][2]);
  });
}

// ---------- Miller plane / direction overlay (cubic) ----------
// Reuses the exact plane-clipping approach from miller-indices-explorer.js:
// intersect h*X + k*Y + l*Z = 1 (fractional cell coords) against the unit
// cube edges, then order the resulting points into a convex polygon.
const MC_CORNERS = famCorners();
const MC_EDGES = CUBE_EDGES;

function vecSub3(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function vecCross3(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function vecDot3(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function vecLen3(a) { return Math.sqrt(vecDot3(a, a)); }
function vecNorm3(a) { const len = vecLen3(a); return len < 1e-12 ? [0, 0, 0] : [a[0] / len, a[1] / len, a[2] / len]; }
function pointDist3(a, b) { return vecLen3(vecSub3(a, b)); }

function computeIntersectionPolygonCubic(h, k, l) {
  if (h === 0 && k === 0 && l === 0) return null;
  const f = (p) => h * p[0] + k * p[1] + l * p[2] - 1;
  const EPS = 1e-9;
  let pts = [];
  MC_EDGES.forEach(([i, j]) => {
    const pi = MC_CORNERS[i], pj = MC_CORNERS[j];
    const fi = f(pi), fj = f(pj);
    if (Math.abs(fi) < EPS) pts.push(pi.slice());
    if (Math.abs(fj) < EPS) pts.push(pj.slice());
    if ((fi > EPS && fj < -EPS) || (fi < -EPS && fj > EPS)) {
      const t = fi / (fi - fj);
      pts.push([pi[0] + t * (pj[0] - pi[0]), pi[1] + t * (pj[1] - pi[1]), pi[2] + t * (pj[2] - pi[2])]);
    }
  });
  const uniq = [];
  pts.forEach((p) => { if (!uniq.some((q) => pointDist3(q, p) < 1e-4)) uniq.push(p); });
  if (uniq.length < 3) return null;
  const centroid = [0, 0, 0];
  uniq.forEach((p) => { centroid[0] += p[0] / uniq.length; centroid[1] += p[1] / uniq.length; centroid[2] += p[2] / uniq.length; });
  const normal = vecNorm3([h, k, l]);
  let ref = Math.abs(normal[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  const u = vecNorm3(vecCross3(normal, ref));
  const v = vecNorm3(vecCross3(normal, u));
  uniq.sort((p, q) => {
    const dp = vecSub3(p, centroid), dq = vecSub3(q, centroid);
    const angleP = Math.atan2(vecDot3(dp, v), vecDot3(dp, u));
    const angleQ = Math.atan2(vecDot3(dq, v), vecDot3(dq, u));
    return angleP - angleQ;
  });
  return uniq;
}

function drawPlanePolygonCubic(poly) {
  const worldPts = poly.map(toWorldCubic);
  noStroke(); fill(90, 110, 240, 120);
  beginShape();
  worldPts.forEach((p) => vertex(p.x, p.y, p.z));
  endShape(CLOSE);
  stroke('#5A3EED'); strokeWeight(2.2); noFill();
  beginShape();
  worldPts.forEach((p) => vertex(p.x, p.y, p.z));
  endShape(CLOSE);
}

function drawDirectionVectorCubic(u, v, w) {
  const o = toWorldCubic([0, 0, 0]);
  const tip = toWorldCubic([u * 1.3, v * 1.3, w * 1.3]);
  stroke('#E67E22'); strokeWeight(3);
  line(o.x, o.y, o.z, tip.x, tip.y, tip.z);
  noStroke(); fill('#E67E22');
  push(); translate(tip.x, tip.y, tip.z); sphere(6, 8, 8); pop();
}

// ---------- hex rendering (HCP / Wurtzite) ----------
function drawHexStructure(s, showLabels, showEdges, showBonds, showPrimitive, sizeMul) {
  if (showEdges) {
    if (showPrimitive) {
      drawPrimitiveHex();
    } else {
      drawWireHexPrism();
    }
  }

  const r = (s.nnFactor * HEX_A / 2) * sizeMul;

  // gather per-species world points for bonding + drawing
  const speciesPoints = s.species.map((sp) => {
    let pts = [];
    sp.families.forEach((famName) => {
      const zShift = sp.zShift || 0;
      if (famName === 'hexCorners') pts = pts.concat(hexCorners(zShift));
      else if (famName === 'hexFaces') pts = pts.concat(hexFaces(zShift));
      else if (famName === 'hexInterior') pts = pts.concat(hexInterior(zShift));
    });
    return { sp, world: pts.map(hexToWorld) };
  });

  if (showBonds && s.bonds === 'wurtzite' && speciesPoints.length === 2) {
    drawWurtziteBonds(speciesPoints[0].world, speciesPoints[1].world);
  }

  speciesPoints.forEach(({ sp, world }) => {
    drawHexAtoms(world, r, sp.color, showLabels ? sp.label : null);
  });
}

function drawHexAtoms(worldPts, r, col, label) {
  noStroke();
  ambientMaterial(col[0], col[1], col[2]);
  worldPts.forEach((w) => {
    push();
    translate(w.x, w.y, w.z);
    sphere(r, 16, 16);
    if (label) {
      fill(20);
      textSize(11);
      translate(0, -r - 6, 0);
      text(label, 0, 0);
      ambientMaterial(col[0], col[1], col[2]);
    }
    pop();
  });
}

function drawWireHexPrism() {
  const bottomRing = [];
  const topRing = [];
  for (let i = 0; i < 6; i++) {
    const ang = (Math.PI / 3) * i;
    bottomRing.push(hexToWorld([Math.cos(ang), Math.sin(ang), 0]));
    topRing.push(hexToWorld([Math.cos(ang), Math.sin(ang), 1]));
  }
  stroke(60); strokeWeight(1.5); noFill();
  for (let i = 0; i < 6; i++) {
    const j = (i + 1) % 6;
    line(bottomRing[i].x, bottomRing[i].y, bottomRing[i].z, bottomRing[j].x, bottomRing[j].y, bottomRing[j].z);
    line(topRing[i].x, topRing[i].y, topRing[i].z, topRing[j].x, topRing[j].y, topRing[j].z);
    line(bottomRing[i].x, bottomRing[i].y, bottomRing[i].z, topRing[i].x, topRing[i].y, topRing[i].z);
  }
}

// Standard rhombic hexagonal primitive cell: a1=(a,0,0), a2=(-a/2, a*sqrt3/2, 0), a3=(0,0,c)
function drawPrimitiveHex() {
  const a1 = [HEX_A, 0, 0];
  const a2 = [-HEX_A / 2, (HEX_A * Math.sqrt(3)) / 2, 0];
  const a3 = [0, 0, HEX_C];
  const o = [0, 0, -HEX_C / 2];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const verts = [
    o, add(o, a1), add(o, a2), add(o, a3),
    add(add(o, a1), a2), add(add(o, a1), a3), add(add(o, a2), a3),
    add(add(add(o, a1), a2), a3)
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 4],
    [2, 6], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7]
  ];
  stroke(90, 40, 200); strokeWeight(2); noFill();
  edges.forEach(([i, j]) => {
    line(verts[i][0], verts[i][1], verts[i][2], verts[j][0], verts[j][1], verts[j][2]);
  });
}

// Wurtzite bonds: generic nearest-neighbor search between the two rendered
// sublattices (cation vs anion world points) -- each cation atom bonds to
// its 4 nearest anion atoms. With the ideal parameters used here (c/a =
// sqrt(8/3), u = 3/8) these 4 bonds come out numerically equal in length,
// consistent with "ideal" wurtzite tetrahedral coordination; see the
// Node.js verification script referenced in the sim documentation.
function drawWurtziteBonds(setA, setB) {
  stroke(90); strokeWeight(2.5);
  const k = 4;
  setA.forEach((pa) => {
    const withDist = setB.map((pb) => ({ pb, d: dist3(pa, pb) }));
    withDist.sort((x, y) => x.d - y.d);
    for (let i = 0; i < Math.min(k, withDist.length); i++) {
      const pb = withDist[i].pb;
      line(pa.x, pa.y, pa.z, pb.x, pb.y, pb.z);
    }
  });
}
function dist3(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

// ============================================================
// resize
// ============================================================
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, drawHeight);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  containerWidth = Math.floor(mainEl.getBoundingClientRect().width);
  drawHeight = Math.max(minDrawHeight, Math.min(maxDrawHeight, Math.floor(containerWidth * 0.68)));
}
