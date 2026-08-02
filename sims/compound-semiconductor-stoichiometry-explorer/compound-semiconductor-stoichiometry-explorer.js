// Compound Semiconductor Stoichiometry Explorer MicroSim
// A GaAs lattice grid where a Ga-fraction slider (0.5 = perfect
// stoichiometry) introduces antisite defects (wrong species on a site) as
// it moves away from 0.5. Each site has a fixed pseudo-random threshold
// assigned once, so defects appear smoothly and deterministically as the
// slider moves, rather than flickering every frame.
// Bloom Level: Evaluate (L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let gaSlider;
const COLS = 6, ROWS = 4;
let siteThreshold = [];

function pseudoRandom(i, j) {
  const x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return x - Math.floor(x); // [0,1)
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  gaSlider = createSlider(0.40, 0.60, 0.50, 0.005);
  gaSlider.attribute('aria-label', 'Gallium fraction');

  for (let j = 0; j < ROWS; j++) {
    const row = [];
    for (let i = 0; i < COLS; i++) row.push(pseudoRandom(i, j));
    siteThreshold.push(row);
  }

  positionUIElements();
  describe('Compound semiconductor stoichiometry explorer: a GaAs lattice where a gallium-fraction slider introduces antisite defects as it moves away from perfect 1:1 stoichiometry', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  gaSlider.position(bx + 130, by + drawHeight + 15);
  gaSlider.size(min(canvasWidth - 150 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const gaFrac = gaSlider.value();
  const dev = gaFrac - 0.5; // positive = Ga-rich, negative = As-rich
  const K = 8; // sensitivity: at slider extreme (+/-0.10), ~80% of eligible sites can flip

  const spacing = min((canvasWidth - 100) / (COLS - 1), 85);
  const x0 = canvasWidth / 2 - (spacing * (COLS - 1)) / 2;
  const y0 = 60;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('GaAs Stoichiometry: Ga fraction = ' + gaFrac.toFixed(3) + (Math.abs(dev) < 0.002 ? ' (stoichiometric)' : (dev > 0 ? ' (Ga-rich)' : ' (As-rich)')), canvasWidth / 2, 8);

  let defectCount = 0;
  const defectSites = new Set();
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      const nominal = (i + j) % 2 === 0 ? 'Ga' : 'As';
      const th = siteThreshold[j][i];
      let isDefect = false;
      if (dev > 0 && nominal === 'As' && th < dev * K) isDefect = true;
      if (dev < 0 && nominal === 'Ga' && th < -dev * K) isDefect = true;
      if (isDefect) { defectCount++; defectSites.add(i + ',' + j); }
    }
  }

  smlDrawLatticeGrid(x0, y0, COLS, ROWS, spacing, {
    atomR: 14, bondColor: color(110), electronColor: color(150, 40, 150),
    labelFor: function (i, j) {
      const nominal = (i + j) % 2 === 0 ? 'Ga' : 'As';
      if (defectSites.has(i + ',' + j)) return nominal === 'Ga' ? 'As' : 'Ga'; // flipped species
      return nominal;
    },
    colorFor: function (i, j) {
      const nominal = (i + j) % 2 === 0 ? 'Ga' : 'As';
      const shown = defectSites.has(i + ',' + j) ? (nominal === 'Ga' ? 'As' : 'Ga') : nominal;
      return shown === 'Ga' ? color(230, 140, 60) : color(90, 180, 120);
    },
    atomStroke: null
  });

  // outline defect atoms in red
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      if (defectSites.has(i + ',' + j)) {
        noFill(); stroke(210, 40, 40); strokeWeight(2.5);
        circle(x0 + i * spacing, y0 + j * spacing, 14 * 2 + 6);
      }
    }
  }

  smlDrawInfoBox(canvasWidth, drawHeight - 58, [
    'Antisite defects (red outline): ' + defectCount + ' of ' + (COLS * ROWS) + ' sites.',
    'Real GaAs deviations are far smaller (ppm-level) —',
    'this MicroSim exaggerates them so the effect is visible.'
  ]);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Ga fraction:', 10, drawHeight + 20);
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
