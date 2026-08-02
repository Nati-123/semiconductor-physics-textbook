// N-Type vs. P-Type Majority Carrier Comparison MicroSim
// Two small lattices side by side: a donor-doped (n-type) lattice and an
// acceptor-doped (p-type) lattice, with a shared checkbox toggling both
// between the neutral and ionized state, highlighting each type's
// majority carrier.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let ionizedCheckbox;
const COLS = 3, ROWS = 3;
const DOP_I = 1, DOP_J = 1;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  ionizedCheckbox = createCheckbox('Show Ionized State', false);
  positionUIElements();
  describe('N-type versus p-type majority carrier comparison: side-by-side donor-doped and acceptor-doped silicon lattices showing their respective majority carriers', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  ionizedCheckbox.position(bx + 10, by + drawHeight + 15);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const ionized = ionizedCheckbox.checked();
  const half = canvasWidth / 2;
  const spacing = min((half - 80) / (COLS - 1), 70);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('N-Type (Donor-Doped)', half / 2, 8);
  text('P-Type (Acceptor-Doped)', half + half / 2, 8);

  drawPanel(40, ionized, 'donor');
  drawPanel(half + 40, ionized, 'acceptor');

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Majority carrier: electron (−)', 40, drawHeight - 30);
  text('Majority carrier: hole (+)', half + 40, drawHeight - 30);
}

function drawPanel(xOff, ionized, kind) {
  const spacing = min((canvasWidth / 2 - 80) / (COLS - 1), 70);
  const y0 = 50;

  const brokenSet = new Set();
  if (kind === 'acceptor') brokenSet.add(DOP_I + ',' + DOP_J + '-' + (DOP_I + 1) + ',' + DOP_J);

  smlDrawLatticeGrid(xOff, y0, COLS, ROWS, spacing, {
    atomR: 13, bondColor: color(110), electronColor: color(40, 40, 220),
    labelFor: function (i, j) {
      if (i === DOP_I && j === DOP_J) return kind === 'donor' ? 'P' : 'B';
      return 'Si';
    },
    colorFor: function (i, j) {
      if (i === DOP_I && j === DOP_J) return kind === 'donor' ? color(90, 62, 237) : color(200, 90, 90);
      return color(90, 140, 220);
    },
    brokenBondSet: brokenSet
  });

  const dx = xOff + DOP_I * spacing, dy = y0 + DOP_J * spacing;
  if (kind === 'donor') {
    if (ionized) {
      drawIonMarker(dx, dy - spacing * 0.6, '+', color(90, 62, 237));
      smlDrawElectron(dx + spacing * 0.9, dy - spacing * 0.1, 10);
    } else {
      stroke(90, 62, 237); strokeWeight(1); noFill();
      drawingContext.setLineDash([2, 3]);
      ellipse(dx, dy - spacing * 0.55, spacing * 0.85, spacing * 0.5);
      drawingContext.setLineDash([]);
      smlDrawElectron(dx + spacing * 0.4, dy - spacing * 0.72, 9);
    }
  } else {
    const holeX = xOff + (DOP_I + 0.5) * spacing;
    if (ionized) {
      drawIonMarker(dx, dy - spacing * 0.6, '−', color(200, 90, 90));
      smlDrawHole(holeX + spacing * 0.65, dy + spacing * 0.45, 10);
    } else {
      smlDrawHole(holeX, dy, 10);
    }
  }
}

function drawIonMarker(x, y, sign, col) {
  noFill(); stroke(col); strokeWeight(1.5);
  circle(x, y, 15);
  noStroke(); fill(col);
  textAlign(CENTER, CENTER); textSize(11);
  text(sign, x, y - 0.5);
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
