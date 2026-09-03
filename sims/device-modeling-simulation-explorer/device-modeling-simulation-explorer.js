// Device Modeling and Simulation Hierarchy Explorer MicroSim
// Lets the user select one of three modeling levels (analytic, compact
// model, numerical simulation) and compares illustrative accuracy and
// computational cost via a bar chart, alongside a description card
// covering assumptions, typical use, and a concrete example.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let levelSelect;

// accuracy/cost are illustrative (0=low, 1=high) relative rankings for the
// qualitative bar chart below -- NOT measured percentages of any kind.
const LEVELS = {
  'Analytic (this course)': {
    accuracy: 0.3, cost: 0.08,
    desc: 'Closed-form hand equations under idealizing assumptions about the semiconductor physics (depletion approximation, long/short-base limits, square-law MOSFET model). Fast, and builds physical intuition, but only as accurate as its assumptions.',
    assumptions: 'Depletion approximation, abrupt junction, low-level injection, ideal square-law MOSFET behavior — real device geometry and non-idealities are ignored.',
    use: 'Hand calculation, first-pass design, building physical intuition',
    example: 'Example: the ideal diode equation I = I0(e^(V/VT) − 1) used throughout this course.'
  },
  'Compact Model (SPICE)': {
    accuracy: 0.68, cost: 0.32,
    desc: 'Circuit-simulator / SPICE-oriented device models: the same physical model family as the analytic level, but semi-empirically extended and fitted to match real measured or simulated device behavior.',
    assumptions: 'Adds fitting parameters, parasitic resistance/capacitance, and higher-order corrections on top of the analytic equations to track real device data.',
    use: 'Whole-circuit simulation, verifying circuit-level behavior quickly',
    example: 'Example: a SPICE diode or BSIM MOSFET model with junction capacitance and series-resistance parameters.'
  },
  'Numerical Device Simulation': {
    accuracy: 0.95, cost: 0.97,
    desc: "Numerical solution of the semiconductor equations — Poisson's equation and the carrier continuity (transport) equations — discretized on a mesh over the device's actual geometry and doping profile, as appropriate for this course.",
    assumptions: "Only Poisson's equation, carrier continuity equations, and material parameters — no simplifying assumptions about depletion width or velocity profiles.",
    use: 'Detailed design verification, non-ideal geometries, novel device exploration',
    example: "Example: TCAD simulation of a power MOSFET's exact doping profile and electric field near breakdown."
  }
};
const LEVEL_KEYS = Object.keys(LEVELS);

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  levelSelect = createSelect();
  LEVEL_KEYS.forEach(k => levelSelect.option(k));
  levelSelect.selected('Analytic (this course)');
  levelSelect.attribute('aria-label', 'Device modeling level');

  positionUIElements();
  describe('Device modeling and simulation hierarchy explorer: compares analytic, compact, and numerical simulation modeling levels by illustrative accuracy, computational cost, assumptions, typical use, and example', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  levelSelect.position(bx + 190, by + drawHeight + 14);
  levelSelect.size(min(canvasWidth - 210, 260));
}

// Shrinks textSize until `str` fits within maxWidth (never below minSize).
// Used so the title stays a single centered line that never reaches under
// the fixed top-right fullscreen button, at any canvas width.
function fitTextSize(str, maxWidth, maxSize, minSize) {
  let sz = maxSize;
  textSize(sz);
  while (textWidth(str) > maxWidth && sz > minSize) {
    sz -= 0.5;
    textSize(sz);
  }
  return sz;
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const selectedKey = levelSelect.value();
  const level = LEVELS[selectedKey];

  // ---------- Title, kept clear of the fixed top-right fullscreen button ----------
  const titleX0 = 10, titleX1 = canvasWidth - 110; // 110px reserved for the button + margin
  const titleCx = (titleX0 + titleX1) / 2, titleMaxW = max(titleX1 - titleX0 - 10, 80);
  fill(20); noStroke(); textAlign(CENTER, TOP); textStyle(NORMAL);
  const titleStr = 'Accuracy vs. Computational Cost Across Modeling Levels';
  fitTextSize(titleStr, titleMaxW, 15.5, 10.5);
  text(titleStr, titleCx, 8);
  textSize(12);

  drawComparisonChart(selectedKey);
  drawDescriptionCard(level);

  // ---------- Persistent educational takeaway (does not change with selection) ----------
  noStroke(); fill(60); textAlign(LEFT, TOP); textSize(11);
  text('Higher-fidelity models generally require greater computational effort — engineers pick the cheapest model that is still accurate enough for the design question at hand.',
    12, drawHeight - 40, canvasWidth - 24);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12);
  text('Modeling level:', 10, drawHeight + 20);
}

function drawComparisonChart(selectedKey) {
  const chartX = 55, chartY = 42, chartW = canvasWidth * 0.42, chartH = drawHeight - 130;
  const n = LEVEL_KEYS.length;
  const groupW = chartW / n;

  stroke(200); strokeWeight(1); noFill();
  rect(chartX, chartY, chartW, chartH);

  // Qualitative y-axis: Low / Medium / High, not numeric percentages, since
  // these bar heights are illustrative rankings, not measured data.
  noStroke(); fill(120); textAlign(RIGHT, CENTER); textSize(9);
  [[0, 'Low'], [0.5, 'Medium'], [1, 'High']].forEach(([frac, lbl]) => {
    const ty = chartY + chartH - frac * chartH;
    stroke(220); strokeWeight(1);
    line(chartX - 3, ty, chartX, ty);
    noStroke(); fill(120);
    text(lbl, chartX - 6, ty);
  });

  for (let i = 0; i < n; i++) {
    const k = LEVEL_KEYS[i];
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

    if (selected) {
      noStroke(); fill(50); textAlign(CENTER, TOP);
      stroke(120); strokeWeight(1); noFill();
      rect(gx + 2, chartY + 2, groupW - 4, chartH - 4);
    }

    noStroke(); fill(30); textAlign(CENTER, TOP); textSize(9.5);
    const shortLabel = k.startsWith('Numerical') ? 'Numerical Sim.' : k.split(' (')[0];
    text(shortLabel, gx + groupW / 2, chartY + chartH + 6, groupW - 4);
  }

  noStroke(); fill(90, 62, 237); textAlign(LEFT, TOP); textSize(10.5);
  text('■ Accuracy', chartX, chartY - 18);
  fill(230, 90, 60);
  text('■ Computational cost', chartX + 90, chartY - 18);

  noStroke(); fill(130); textAlign(LEFT, TOP); textSize(8.5);
  text('(Illustrative/qualitative — not measured data)', chartX, chartY + chartH + 34, chartW + 20);
}

// Greedily word-wraps `str` at the CURRENT textSize/font to estimate how
// many lines text(str, x, y, w) will render as, so stacked text blocks of
// varying length can be spaced without fixed offsets overlapping at
// narrow canvas widths (where more text wraps onto more lines).
function countWrappedLines(str, w) {
  const words = str.split(' ');
  let line = '', lines = 1;
  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];
    if (textWidth(test) > w && line) {
      lines++;
      line = words[i];
    } else {
      line = test;
    }
  }
  return lines;
}

function drawDescriptionCard(level) {
  const cardX = canvasWidth * 0.48, cardY = 42, cardW = canvasWidth - cardX - 16, cardH = drawHeight - 130;
  noStroke(); fill(240, 245, 255);
  stroke(168, 200, 255); strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 8);

  const tx = cardX + 14, tw = cardW - 28;
  let y = cardY + 12;
  noStroke(); textAlign(LEFT, TOP);

  function block(headerText, bodyText, headerColor) {
    if (headerText) {
      fill(headerColor); textStyle(BOLD); textSize(10.5);
      text(headerText, tx, y, tw);
      y += 15;
    }
    textStyle(NORMAL); fill(headerText ? 40 : 30); textSize(headerText ? 10.5 : 11);
    text(bodyText, tx, y, tw);
    y += countWrappedLines(bodyText, tw) * (headerText ? 13 : 14) + 10;
  }

  block(null, level.desc, null);
  block('Key assumptions:', level.assumptions, color(90, 62, 237));
  block('Typical use:', level.use, color(90, 62, 237));
  block('Example:', level.example, color(90, 62, 237));
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
