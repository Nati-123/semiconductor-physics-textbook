// Device Modeling and Simulation Hierarchy Explorer MicroSim
// Lets the user select one of three modeling levels (analytic, compact
// model, numerical simulation) and compares illustrative accuracy and
// computational cost via a bar chart, alongside a description card.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let levelSelect;

const LEVELS = {
  'Analytic (this course)': {
    accuracy: 0.35, cost: 0.05,
    desc: 'Closed-form physics under idealizing assumptions (depletion approximation, long/short-base limits, square-law MOSFET model). Fast, builds intuition, but only as accurate as its assumptions.',
    use: 'Hand calculation, first-pass design, building physical understanding'
  },
  'Compact Model (SPICE)': {
    accuracy: 0.7, cost: 0.3,
    desc: 'Semi-empirical equations, more detailed than idealized analytic models, fitted to match real measured or simulated device behavior.',
    use: 'Circuit simulation, verifying whole-circuit behavior quickly'
  },
  'Numerical Device Simulation': {
    accuracy: 0.95, cost: 0.95,
    desc: "Discretized Poisson's equation and continuity equations solved numerically on a mesh representing the device's actual geometry and doping — no simplifying assumptions.",
    use: 'Detailed design verification, non-ideal geometries, novel device exploration'
  }
};

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  levelSelect = createSelect();
  Object.keys(LEVELS).forEach(k => levelSelect.option(k));
  levelSelect.selected('Analytic (this course)');
  levelSelect.attribute('aria-label', 'Device modeling level');

  positionUIElements();
  describe('Device modeling and simulation hierarchy explorer: compares analytic, compact, and numerical simulation modeling levels by accuracy, computational cost, and typical use case', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  levelSelect.position(bx + 190, by + drawHeight + 14);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const level = LEVELS[levelSelect.value()];

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15.5);
  text('Accuracy vs. Computational Cost Across Modeling Levels', canvasWidth / 2, 8, canvasWidth - 20);

  drawComparisonChart(levelSelect.value());
  drawDescriptionCard(level);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12);
  text('Modeling level:', 10, drawHeight + 20);
}

function drawComparisonChart(selectedKey) {
  const chartX = 50, chartY = 40, chartW = canvasWidth * 0.42, chartH = drawHeight - 90;
  const keys = Object.keys(LEVELS);
  const n = keys.length;
  const groupW = chartW / n;

  stroke(200); strokeWeight(1); noFill();
  rect(chartX, chartY, chartW, chartH);

  for (let i = 0; i < n; i++) {
    const k = keys[i];
    const lv = LEVELS[k];
    const gx = chartX + i * groupW;
    const barW = groupW * 0.32;
    const accH = lv.accuracy * chartH;
    const costH = lv.cost * chartH;
    const selected = (k === selectedKey);

    noStroke(); fill(selected ? color(90, 62, 237) : color(90, 62, 237, 110));
    rect(gx + groupW * 0.15, chartY + chartH - accH, barW, accH);
    fill(selected ? color(230, 90, 60) : color(230, 90, 60, 110));
    rect(gx + groupW * 0.53, chartY + chartH - costH, barW, costH);

    noStroke(); fill(30); textAlign(CENTER, TOP); textSize(9.5);
    text(k.split(' (')[0], gx + groupW / 2, chartY + chartH + 6, groupW - 4);
  }

  noStroke(); fill(90, 62, 237); textAlign(LEFT, TOP); textSize(10.5);
  text('■ Accuracy', chartX, chartY - 16);
  fill(230, 90, 60);
  text('■ Computational cost', chartX + 90, chartY - 16);
}

function drawDescriptionCard(level) {
  const cardX = canvasWidth * 0.48, cardY = 40, cardW = canvasWidth - cardX - 20, cardH = drawHeight - 90;
  noStroke(); fill(240, 245, 255);
  stroke(168, 200, 255); strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 8);
  noStroke(); fill(30); textAlign(LEFT, TOP); textSize(11.5);
  text(level.desc, cardX + 14, cardY + 14, cardW - 28);
  fill(90, 62, 237); textAlign(LEFT, TOP); textSize(11); textStyle(BOLD);
  text('Typical use:', cardX + 14, cardY + cardH * 0.62);
  textStyle(NORMAL); fill(40);
  text(level.use, cardX + 14, cardY + cardH * 0.62 + 16, cardW - 28);
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
