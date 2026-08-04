// Planar MOSFET vs FinFET vs GAA Explorer MicroSim
// Compares planar, FinFET, and Gate-All-Around transistor cross-sections
// and computes relative natural length (electrostatic control) for each.
// Bloom Level: Understand/Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let structureSelect;

const STRUCTURES = {
  'Planar MOSFET': { n: 1, sides: 'Top only' },
  'FinFET': { n: 2, sides: 'Three of four sides' },
  'Gate-All-Around': { n: 4, sides: 'All four sides' }
};

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  structureSelect = createSelect();
  for (const k in STRUCTURES) structureSelect.option(k);
  structureSelect.selected('FinFET');
  structureSelect.attribute('aria-label', 'Transistor structure');

  positionUIElements();
  describe('Planar MOSFET vs FinFET vs Gate-All-Around explorer: compares transistor cross-sections and computes relative natural length for each gate geometry', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  structureSelect.position(bx + 170, by + drawHeight + 16);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const key = structureSelect.value();
  const s = STRUCTURES[key];
  const lambdaRel = 1 / sqrt(s.n);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('Transistor Geometry: ' + key, canvasWidth / 2, 8);

  const cx = canvasWidth / 2, cy = drawHeight / 2 - 10;

  if (key === 'Planar MOSFET') {
    noStroke(); fill(230, 230, 240);
    rect(cx - 90, cy, 180, 60);
    fill(150, 130, 220);
    rect(cx - 60, cy - 16, 120, 16);
  } else if (key === 'FinFET') {
    noStroke(); fill(230, 230, 240);
    rect(cx - 90, cy + 30, 180, 30);
    fill(220, 220, 235);
    rect(cx - 15, cy - 40, 30, 70);
    fill(150, 130, 220, 200);
    rect(cx - 26, cy - 50, 52, 10);
    rect(cx - 26, cy - 50, 11, 80);
    rect(cx + 15, cy - 50, 11, 80);
  } else {
    noStroke(); fill(230, 230, 240);
    rect(cx - 90, cy + 40, 180, 20);
    for (let i = 0; i < 3; i++) {
      const sy = cy - 10 + i * 22;
      fill(220, 220, 235);
      rect(cx - 40, sy, 80, 12);
      fill(150, 130, 220, 160);
      rect(cx - 46, sy - 5, 92, 22);
    }
  }

  fill(30); noStroke(); textAlign(CENTER, TOP); textSize(12);
  text('Gate contacts: ' + s.sides, cx, cy + 100);

  const infoY = drawHeight - 60;
  fill(30); textAlign(CENTER, TOP); textSize(13.5);
  text('Gate-controlled sides n = ' + s.n + '     Relative natural length λ ∝ 1/√n ≈ ' + nf(lambdaRel, 1, 3), cx, infoY);
  fill(lambdaRel < 0.6 ? color(40, 130, 70) : (lambdaRel < 0.85 ? color(200, 140, 30) : color(200, 60, 60)));
  textAlign(CENTER, TOP); textSize(12);
  text(lambdaRel < 0.6 ? 'Strong short-channel-effect suppression' : (lambdaRel < 0.85 ? 'Moderate suppression' : 'Weakest suppression (most susceptible to short-channel effects)'), cx, infoY + 22);

  drawControlLabels();
}

function drawControlLabels() {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Structure', 160, drawHeight + 16 + 10);
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
