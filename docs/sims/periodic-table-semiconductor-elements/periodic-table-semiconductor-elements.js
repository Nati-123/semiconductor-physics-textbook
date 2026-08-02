// Periodic Table of Semiconductor Elements MicroSim
// A clickable mini periodic table (Groups II-VI, Periods 2-5) covering the
// elements relevant to elemental and compound semiconductors and to
// donor/acceptor doping. Clicking a cell shows a role-description card.
// Bloom Level: Remember / Understand (L1-L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 40;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

const GROUPS = ['II', 'III', 'IV', 'V', 'VI'];
// Plain RGB triplets (not p5 color() objects) since this array is built
// before p5.js has created its global-mode instance; converted to a
// color() object at draw time instead.
const GROUP_COLOR_RGB = [
  [190, 220, 250], [250, 210, 160], [200, 230, 190], [250, 190, 190], [220, 195, 240]
];

// row: 0=Period2 .. 3=Period5 ; col index into GROUPS
const ELEMENTS = [
  { sym: 'B', num: 5, row: 0, col: 1, name: 'Boron', role: 'Group III — common acceptor dopant in silicon, creating p-type material.' },
  { sym: 'C', num: 6, row: 0, col: 2, name: 'Carbon', role: 'Group IV — diamond is an elemental, wide-bandgap semiconductor.' },
  { sym: 'Al', num: 13, row: 1, col: 1, name: 'Aluminum', role: 'Group III — acceptor dopant in silicon, creating p-type material.' },
  { sym: 'Si', num: 14, row: 1, col: 2, name: 'Silicon', role: 'Group IV — the dominant elemental semiconductor used in electronics.' },
  { sym: 'P', num: 15, row: 1, col: 3, name: 'Phosphorus', role: 'Group V — common donor dopant in silicon, creating n-type material.' },
  { sym: 'Zn', num: 30, row: 2, col: 0, name: 'Zinc', role: 'Group II — combines with Group VI elements to form II-VI compounds like ZnSe.' },
  { sym: 'Ga', num: 31, row: 2, col: 1, name: 'Gallium', role: 'Group III — combines with As to form the compound semiconductor GaAs.' },
  { sym: 'Ge', num: 32, row: 2, col: 2, name: 'Germanium', role: 'Group IV — elemental semiconductor with a smaller band gap than silicon.' },
  { sym: 'As', num: 33, row: 2, col: 3, name: 'Arsenic', role: 'Group V — forms GaAs; also used as an n-type donor dopant in silicon.' },
  { sym: 'Se', num: 34, row: 2, col: 4, name: 'Selenium', role: 'Group VI — combines with Group II elements to form II-VI compounds like ZnSe.' },
  { sym: 'Cd', num: 48, row: 3, col: 0, name: 'Cadmium', role: 'Group II — combines with Te to form the compound semiconductor CdTe.' },
  { sym: 'In', num: 49, row: 3, col: 1, name: 'Indium', role: 'Group III — combines with P or Sb to form III-V compounds like InP.' },
  { sym: 'Sn', num: 50, row: 3, col: 2, name: 'Tin', role: 'Group IV — gray tin (α-Sn) is a rare elemental-semiconductor allotrope.' },
  { sym: 'Sb', num: 51, row: 3, col: 3, name: 'Antimony', role: 'Group V — donor dopant in silicon and germanium.' },
  { sym: 'Te', num: 52, row: 3, col: 4, name: 'Tellurium', role: 'Group VI — combines with Cd to form the compound semiconductor CdTe.' }
];

let selected = ELEMENTS[3]; // Silicon by default
let cellSize = 60;
let gridX0 = 40, gridY0 = 50;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);
  describe('Periodic table of semiconductor elements: a clickable grid of Group II through VI elements across Periods 2-5, showing each element\'s role in elemental or compound semiconductors and in donor/acceptor doping', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function layoutGrid() {
  cellSize = min(70, (canvasWidth - 80) / GROUPS.length);
  gridX0 = (canvasWidth - cellSize * GROUPS.length) / 2;
  gridY0 = 56;
}

function draw() {
  updateCanvasSize();
  layoutGrid();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Semiconductor-Relevant Elements (Groups II–VI)', canvasWidth / 2, 8);

  // group headers
  textAlign(CENTER, CENTER); textSize(13); fill(60);
  for (let c = 0; c < GROUPS.length; c++) {
    text('Group ' + GROUPS[c], gridX0 + c * cellSize + cellSize / 2, gridY0 - 16);
  }

  for (const el of ELEMENTS) {
    const x = gridX0 + el.col * cellSize;
    const y = gridY0 + el.row * cellSize;
    const rgb = GROUP_COLOR_RGB[el.col];
    smlDrawPeriodicCell(x, y, cellSize - 6, el.sym, el.num, color(rgb[0], rgb[1], rgb[2]), selected === el);
  }

  drawInfoCard();
}

function drawInfoCard() {
  const cardY = gridY0 + 4 * cellSize + 20;
  const cardW = min(600, canvasWidth - 60);
  const cardX = canvasWidth / 2 - cardW / 2;
  const cardH = drawHeight - cardY - 10;
  noStroke();
  fill(240, 245, 255);
  stroke(168, 200, 255);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, max(70, cardH), 10);
  noStroke();
  fill('#5A3EED');
  textAlign(LEFT, TOP);
  textSize(16);
  text(selected.name + ' (' + selected.sym + ', Z=' + selected.num + ')', cardX + 16, cardY + 12);
  fill(50);
  textSize(13);
  text(selected.role, cardX + 16, cardY + 38, cardW - 32);
}

function mousePressed() {
  for (const el of ELEMENTS) {
    const x = gridX0 + el.col * cellSize;
    const y = gridY0 + el.row * cellSize;
    if (smlPointInRect(mouseX, mouseY, x, y, cellSize - 6, cellSize - 6)) {
      selected = el;
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
}
