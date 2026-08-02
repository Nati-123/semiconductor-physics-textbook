// Electron Configuration Explorer MicroSim
// Bohr-model-style diagram of electron shell filling for atomic number
// Z = 1..18 (H through Ar), highlighting core electrons vs. valence
// electrons (those in the outermost occupied principal shell), with
// preset jump buttons for Na, Si, and Cl -- the three elements compared
// in Chapter 4's bonding discussion.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02 (2D static/interactive variant)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 30;
let sliderLeftMargin = 150;

let zSlider;
let naBtn, siBtn, clBtn;

// Subshells filled in order (valid, no exceptions, for Z = 1..18)
const SUBSHELLS = [
  { n: 1, l: 's', cap: 2 },
  { n: 2, l: 's', cap: 2 },
  { n: 2, l: 'p', cap: 6 },
  { n: 3, l: 's', cap: 2 },
  { n: 3, l: 'p', cap: 6 }
];

const ELEMENT_SYMBOLS = [
  '', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
  'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'
];
const ELEMENT_NAMES = [
  '', 'Hydrogen', 'Helium', 'Lithium', 'Beryllium', 'Boron', 'Carbon',
  'Nitrogen', 'Oxygen', 'Fluorine', 'Neon', 'Sodium', 'Magnesium',
  'Aluminum', 'Silicon', 'Phosphorus', 'Sulfur', 'Chlorine', 'Argon'
];

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  zSlider = createSlider(1, 18, 14, 1);
  zSlider.attribute('aria-label', 'Atomic number Z');

  naBtn = createButton('Na (Z=11)');
  naBtn.mousePressed(function () { zSlider.value(11); });

  siBtn = createButton('Si (Z=14)');
  siBtn.mousePressed(function () { zSlider.value(14); });

  clBtn = createButton('Cl (Z=17)');
  clBtn.mousePressed(function () { zSlider.value(17); });

  positionUIElements();

  describe('Bohr-model diagram of electron shell filling for atomic number Z from 1 to 18, distinguishing core electrons from valence electrons in the outermost occupied shell', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;

  zSlider.position(bx + sliderLeftMargin, by + drawHeight + 15);
  zSlider.size(min(canvasWidth - sliderLeftMargin - margin, 300));

  naBtn.position(bx + 10, by + drawHeight + 55);
  siBtn.position(bx + 110, by + drawHeight + 55);
  clBtn.position(bx + 210, by + drawHeight + 55);
}

// ---------- electron configuration logic ----------
function computeConfig(Z) {
  let remaining = Z;
  const filled = []; // { n, l, count, cap }
  for (const sub of SUBSHELLS) {
    if (remaining <= 0) break;
    const count = Math.min(remaining, sub.cap);
    filled.push({ n: sub.n, l: sub.l, count, cap: sub.cap });
    remaining -= count;
  }
  const highestN = filled.length ? filled[filled.length - 1].n : 1;
  let valence = 0, core = 0;
  for (const f of filled) {
    if (f.n === highestN) valence += f.count;
    else core += f.count;
  }
  // group by shell n for the Bohr-ring diagram
  const shellCounts = {};
  for (const f of filled) {
    shellCounts[f.n] = (shellCounts[f.n] || 0) + f.count;
  }
  return { filled, core, valence, highestN, shellCounts };
}

function configString(filled) {
  return filled.map(f => f.n + f.l + toSuperscript(f.count)).join(' ');
}

function toSuperscript(n) {
  const map = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return String(n).split('').map(d => map[d]).join('');
}

// ---------- draw ----------
function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const Z = zSlider.value();
  const cfg = computeConfig(Z);
  const symbol = ELEMENT_SYMBOLS[Z];
  const name = ELEMENT_NAMES[Z];

  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Electron Configuration: ' + name + ' (' + symbol + ', Z=' + Z + ')', canvasWidth / 2, 10);

  drawBohrDiagram(cfg);
  drawReadouts(cfg, symbol);
  drawControlLabels(Z);
}

function drawBohrDiagram(cfg) {
  const cx = canvasWidth / 2;
  const cy = drawHeight / 2 + 10;
  const maxShellRadius = min(canvasWidth, drawHeight) * 0.34;
  const shellNs = Object.keys(cfg.shellCounts).map(Number).sort((a, b) => a - b);
  const nShells = shellNs.length;

  // nucleus
  noStroke();
  fill('#5A3EED');
  circle(cx, cy, 34);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(12);
  text('+' + zSlider.value(), cx, cy);

  for (let i = 0; i < nShells; i++) {
    const n = shellNs[i];
    const radius = maxShellRadius * ((i + 1) / nShells);
    const count = cfg.shellCounts[n];
    const isValenceShell = (n === cfg.highestN);

    noFill();
    stroke(160);
    strokeWeight(1);
    circle(cx, cy, radius * 2);

    noStroke();
    fill(isValenceShell ? '#E67E22' : '#2E7D32');
    for (let k = 0; k < count; k++) {
      const angle = (TWO_PI / count) * k - HALF_PI;
      const ex = cx + radius * cos(angle);
      const ey = cy + radius * sin(angle);
      circle(ex, ey, 11);
    }
  }

  // legend
  const lx = margin;
  const ly = 40;
  noStroke();
  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(lx, ly, 170, 62, 8);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(12);
  fill('#2E7D32');
  circle(lx + 16, ly + 20, 12);
  fill(20);
  text('Core electron', lx + 30, ly + 20);
  fill('#E67E22');
  circle(lx + 16, ly + 44, 12);
  fill(20);
  text('Valence electron', lx + 30, ly + 44);
}

function drawReadouts(cfg, symbol) {
  const boxW = min(460, canvasWidth - 2 * margin);
  const boxX = canvasWidth / 2 - boxW / 2;
  const boxY = drawHeight - 68;

  noStroke();
  fill(255, 247, 221, 235);
  stroke(240, 216, 122);
  strokeWeight(1);
  rect(boxX, boxY, boxW, 56, 8);

  noStroke();
  fill('#7a5c00');
  textAlign(CENTER, TOP);
  textSize(13);
  text('Configuration: ' + configString(cfg.filled), canvasWidth / 2, boxY + 8);
  text('Core electrons: ' + cfg.core + '   |   Valence electrons: ' + cfg.valence, canvasWidth / 2, boxY + 28);

  if (symbol === 'Si') {
    fill('#B03A2E');
    textAlign(CENTER, TOP);
    textSize(12);
    text('Silicon’s 4 valence electrons → 4 covalent bonds (Chapter 4)', canvasWidth / 2, boxY + 46);
  }
}

function drawControlLabels(Z) {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Atomic number Z: ' + Z, 10, drawHeight + 22);
}

// ---------- responsive sizing ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
}

function updateCanvasSize() {
  var mainEl = document.querySelector('main');
  containerWidth = Math.floor(mainEl.getBoundingClientRect().width);
  canvasWidth = containerWidth;

  var availableHeight = window.innerHeight;
  var children = mainEl.children;
  for (var i = 0; i < children.length; i++) {
    if (children[i].tagName !== 'CANVAS') {
      availableHeight -= children[i].offsetHeight;
    }
  }
  drawHeight = Math.max(minDrawHeight, availableHeight - controlHeight);
  canvasHeight = drawHeight + controlHeight;
  containerHeight = canvasHeight;
}
