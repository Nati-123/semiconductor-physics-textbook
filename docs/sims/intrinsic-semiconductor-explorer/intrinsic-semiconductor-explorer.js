// Intrinsic Semiconductor Explorer MicroSim
// A schematic 2D silicon lattice (each atom bonded to its right and lower
// neighbor) where bonds thermally break and reform. Breaking a bond
// creates one free electron (blue) and one hole (red) together, modeling
// intrinsic (thermal) electron-hole pair generation. Break/reform
// probabilities are illustrative, chosen so the equilibrium broken-bond
// fraction grows with temperature in a qualitatively Boltzmann-like way.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 40;
let tempSlider;
let isAnimating = false;
let startStopBtn = { x: 0, y: 0, w: 90, h: 32 };
let resetBtn = { x: 0, y: 0, w: 90, h: 32 };

const COLS = 5, ROWS = 4;
const T_MIN = 100, T_MAX = 900, T_DEFAULT = 300;
const REFORM_PROB = 0.03;

let brokenSet;      // Set of bond keys currently broken
let carriers;        // Map bondKey -> {ex, ey, evx, evy, hx, hy}
let bondKeys;         // list of all bond keys with endpoints

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  tempSlider = createSlider(T_MIN, T_MAX, T_DEFAULT, 10);
  tempSlider.attribute('aria-label', 'Lattice temperature in kelvin');

  brokenSet = new Set();
  carriers = new Map();
  buildBondKeyList();

  positionUIElements();
  describe('Intrinsic semiconductor explorer: a silicon lattice grid where covalent bonds thermally break into electron-hole pairs, at a rate controlled by a temperature slider', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function buildBondKeyList() {
  bondKeys = [];
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      if (i < COLS - 1) bondKeys.push(i + ',' + j + '-' + (i + 1) + ',' + j);
      if (j < ROWS - 1) bondKeys.push(i + ',' + j + '-' + i + ',' + (j + 1));
    }
  }
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  tempSlider.position(bx + 150, by + drawHeight + 15);
  tempSlider.size(min(canvasWidth - 170 - margin, 300));
  // Canvas-drawn buttons use local canvas coordinates (not page coordinates).
  startStopBtn.x = 10; startStopBtn.y = drawHeight + 65;
  resetBtn.x = 110; resetBtn.y = drawHeight + 65;
}

function flipProbability(T) {
  const logMin = Math.log(0.0002), logMax = Math.log(0.02);
  const frac = constrain((T - T_MIN) / (T_MAX - T_MIN), 0, 1);
  return Math.exp(logMin + frac * (logMax - logMin));
}

function latticeOrigin() {
  const spacing = min((canvasWidth - 2 * margin - 40) / (COLS - 1), 90);
  const x0 = canvasWidth / 2 - (spacing * (COLS - 1)) / 2;
  const y0 = 70;
  return { x0, y0, spacing };
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const T = tempSlider.value();
  const { x0, y0, spacing } = latticeOrigin();

  if (isAnimating) stepPhysics(T);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Intrinsic Silicon Lattice (schematic 2D bonding diagram)', canvasWidth / 2, 8);

  smlDrawLatticeGrid(x0, y0, COLS, ROWS, spacing, {
    atomR: 14, atomColor: color(90, 140, 220), atomLabel: 'Si',
    bondColor: color(110), electronColor: color(40, 40, 220),
    brokenBondSet: brokenSet
  });

  // draw drifting electrons and stationary holes for broken bonds
  carriers.forEach(function (c) {
    smlDrawHole(c.hx, c.hy, 10);
    smlDrawElectron(c.ex, c.ey, 10);
  });

  drawControlLabels(T);
  smlDrawInfoBox(canvasWidth, drawHeight - 58, [
    'Broken bond = one electron-hole pair (intrinsic generation).',
    'Break probability grows with T; a constant rate reforms bonds (recombination).',
    'Equilibrium broken-bond fraction: ' + (brokenSet.size) + ' / ' + bondKeys.length
  ]);
}

function stepPhysics(T) {
  const pBreak = flipProbability(T);
  for (const key of bondKeys) {
    if (brokenSet.has(key)) {
      if (Math.random() < REFORM_PROB) {
        brokenSet.delete(key);
        carriers.delete(key);
      }
    } else {
      if (Math.random() < pBreak) {
        brokenSet.add(key);
        const [a, b] = key.split('-');
        const [i1, j1] = a.split(',').map(Number);
        const { x0, y0, spacing } = latticeOrigin();
        const p1x = x0 + i1 * spacing, p1y = y0 + j1 * spacing;
        carriers.set(key, {
          hx: p1x, hy: p1y,
          ex: p1x, ey: p1y, evx: random(-0.4, 0.4), evy: random(-0.4, 0.4)
        });
      }
    }
  }
  carriers.forEach(function (c) {
    c.ex += c.evx; c.ey += c.evy;
    c.evx += random(-0.05, 0.05); c.evy += random(-0.05, 0.05);
    c.evx = constrain(c.evx, -0.6, 0.6); c.evy = constrain(c.evy, -0.6, 0.6);
    const { x0, y0, spacing } = latticeOrigin();
    c.ex = constrain(c.ex, x0 - spacing * 0.6, x0 + spacing * (COLS - 1) + spacing * 0.6);
    c.ey = constrain(c.ey, y0 - spacing * 0.6, y0 + spacing * (ROWS - 1) + spacing * 0.6);
  });
}

function drawControlLabels(T) {
  fill('black'); noStroke();
  textAlign(LEFT, CENTER); textSize(13);
  text('Temperature: ' + T + ' K', 10, drawHeight + 30);
  smlDrawButton(startStopBtn.x, startStopBtn.y, startStopBtn.w, startStopBtn.h, isAnimating ? 'Stop' : 'Start', isAnimating);
  smlDrawButton(resetBtn.x, resetBtn.y, resetBtn.w, resetBtn.h, 'Reset', false);
}

function mousePressed() {
  if (smlPointInRect(mouseX, mouseY, startStopBtn.x, startStopBtn.y, startStopBtn.w, startStopBtn.h)) {
    isAnimating = !isAnimating;
  } else if (smlPointInRect(mouseX, mouseY, resetBtn.x, resetBtn.y, resetBtn.w, resetBtn.h)) {
    isAnimating = false;
    tempSlider.value(T_DEFAULT);
    brokenSet.clear();
    carriers.clear();
  }
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
