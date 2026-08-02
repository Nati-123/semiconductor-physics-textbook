// Acceptor Atom Bonding Explorer MicroSim
// A Group III dopant substituted into a silicon lattice: 3 valence
// electrons complete 3 covalent bonds, leaving the 4th incomplete (a
// hole). A button toggles the hole between sitting at the acceptor site
// and having moved away, revealing the fixed negative ion left behind.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let dopantSelect;
let ionized = false;
let ionizeBtn = { x: 10, y: 0, w: 150, h: 32 };

const DOPANTS = { 'Boron (B)': 'B', 'Aluminum (Al)': 'Al', 'Gallium (Ga)': 'Ga', 'Indium (In)': 'In' };
const COLS = 5, ROWS = 4;
const ACC_I = 2, ACC_J = 1;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  dopantSelect = createSelect();
  Object.keys(DOPANTS).forEach(k => dopantSelect.option(k));
  dopantSelect.selected('Boron (B)');
  dopantSelect.attribute('aria-label', 'Acceptor dopant species');

  positionUIElements();
  describe('Acceptor atom bonding explorer: a Group III dopant atom substituted into a silicon lattice, showing its three complete covalent bonds and one incomplete bond (a hole) that can be toggled between bound and ionized', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  dopantSelect.position(bx + 100, by + drawHeight + 12);
  ionizeBtn.x = 10; ionizeBtn.y = drawHeight + 55;
}

function latticeOrigin() {
  const spacing = min((canvasWidth - 2 * 40 - 40) / (COLS - 1), 85);
  const x0 = canvasWidth / 2 - (spacing * (COLS - 1)) / 2;
  return { x0, y0: 60, spacing };
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const label = DOPANTS[dopantSelect.value()];
  const { x0, y0, spacing } = latticeOrigin();

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Acceptor Atom: ' + label + ' Substituted into Silicon', canvasWidth / 2, 8);

  const brokenSet = new Set();
  brokenSet.add(ACC_I + ',' + ACC_J + '-' + (ACC_I + 1) + ',' + ACC_J); // incomplete bond to the right neighbor

  smlDrawLatticeGrid(x0, y0, COLS, ROWS, spacing, {
    atomR: 15, bondColor: color(110), electronColor: color(40, 40, 220),
    labelFor: function (i, j) { return (i === ACC_I && j === ACC_J) ? label : 'Si'; },
    colorFor: function (i, j) { return (i === ACC_I && j === ACC_J) ? color(200, 90, 90) : color(90, 140, 220); },
    brokenBondSet: brokenSet
  });

  const dx = x0 + ACC_I * spacing, dy = y0 + ACC_J * spacing;
  const holeBaseX = x0 + (ACC_I + 0.5) * spacing, holeBaseY = dy;

  if (ionized) {
    push();
    translate(dx, dy - spacing * 0.62);
    noFill(); stroke(200, 90, 90); strokeWeight(1.5);
    circle(0, 0, 16);
    noStroke(); fill(200, 90, 90);
    textAlign(CENTER, CENTER); textSize(12);
    text('−', 0, -1);
    pop();
    smlDrawHole(holeBaseX + spacing * 0.7, holeBaseY + spacing * 0.5, 10);
  } else {
    smlDrawHole(holeBaseX, holeBaseY, 10);
  }

  smlDrawButton(ionizeBtn.x, ionizeBtn.y, ionizeBtn.w, ionizeBtn.h, ionized ? 'Reset (Un-ionize)' : 'Ionize Acceptor', ionized);

  smlDrawInfoBox(canvasWidth, drawHeight - 58, ionized
    ? ['A neighboring electron filled the incomplete bond.', 'The hole has effectively moved away into the lattice.', 'Acceptor atom is now a fixed −1 ion (immobile).']
    : ['3 electrons complete 3 covalent bonds.', '4th bond is incomplete — a hole (open circle).', 'Click "Ionize Acceptor" to let the hole move away.']);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Dopant:', 10, drawHeight + 18);
}

function mousePressed() {
  if (smlPointInRect(mouseX, mouseY, ionizeBtn.x, ionizeBtn.y, ionizeBtn.w, ionizeBtn.h)) {
    ionized = !ionized;
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
