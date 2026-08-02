// Donor Atom Bonding Explorer MicroSim
// A Group V dopant substituted into a silicon lattice: 4 valence electrons
// fill covalent bonds identical to silicon's, and the 5th is shown either
// weakly bound (dashed orbit) or ionized (drifted free), toggled by a
// button. A fixed positive ion marker appears on the donor once ionized.
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
let ionizeBtn = { x: 130, y: 0, w: 140, h: 32 };

const DOPANTS = { 'Phosphorus (P)': 'P', 'Arsenic (As)': 'As', 'Antimony (Sb)': 'Sb' };
const COLS = 5, ROWS = 4;
const DOP_I = 2, DOP_J = 1;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  dopantSelect = createSelect();
  Object.keys(DOPANTS).forEach(k => dopantSelect.option(k));
  dopantSelect.selected('Phosphorus (P)');
  dopantSelect.attribute('aria-label', 'Donor dopant species');

  positionUIElements();
  describe('Donor atom bonding explorer: a Group V dopant atom substituted into a silicon lattice, showing its four covalent bonds and a fifth electron that can be toggled between weakly bound and ionized', LABEL);
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
  text('Donor Atom: ' + label + ' Substituted into Silicon', canvasWidth / 2, 8);

  smlDrawLatticeGrid(x0, y0, COLS, ROWS, spacing, {
    atomR: 15, bondColor: color(110), electronColor: color(40, 40, 220),
    labelFor: function (i, j) { return (i === DOP_I && j === DOP_J) ? label : 'Si'; },
    colorFor: function (i, j) { return (i === DOP_I && j === DOP_J) ? color(90, 62, 237) : color(90, 140, 220); }
  });

  const dx = x0 + DOP_I * spacing, dy = y0 + DOP_J * spacing;
  if (ionized) {
    fill(90, 62, 237); noStroke();
    textAlign(CENTER, CENTER); textSize(12);
    // '+' marker just above the donor atom
    push();
    translate(dx, dy - spacing * 0.62);
    noFill(); stroke(90, 62, 237); strokeWeight(1.5);
    circle(0, 0, 16);
    noStroke(); fill(90, 62, 237);
    text('+', 0, -1);
    pop();
    smlDrawElectron(dx + spacing * 0.9, dy - spacing * 0.15, 10);
  } else {
    stroke(90, 62, 237); strokeWeight(1); noFill();
    drawingContext.setLineDash([2, 3]);
    ellipse(dx, dy - spacing * 0.55, spacing * 0.9, spacing * 0.55);
    drawingContext.setLineDash([]);
    smlDrawElectron(dx + spacing * 0.42, dy - spacing * 0.75, 9);
  }

  smlDrawButton(ionizeBtn.x, ionizeBtn.y, ionizeBtn.w, ionizeBtn.h, ionized ? 'Reset (Un-ionize)' : 'Ionize Donor', ionized);

  smlDrawInfoBox(canvasWidth, drawHeight - 58, ionized
    ? ['5th electron has left — now a free carrier.', 'Donor atom is now a fixed +1 ion (immobile).', 'No covalent bond was broken to do this.']
    : ['4 electrons fill normal covalent bonds.', '5th electron is only weakly bound (dashed orbit).', 'Click "Ionize Donor" to release it.']);

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
