// Electron Configuration Explorer MicroSim
// Bohr-model-style diagram of electron shell filling for atomic number
// Z = 1..36 (H through Kr), highlighting core electrons vs. valence
// electrons (those in the outermost occupied principal shell), with
// preset jump buttons for the elements this course actually uses:
// Na, Si, Cl (Chapter 4's bonding comparison) plus B, C, P, Ga, Ge, As
// (other semiconductor-relevant elements used later in the course).
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02 (2D static/interactive variant)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 440;
let controlHeight = 70;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 26;

let zSlider;
let presetButtons = {}; // Z -> p5.Element

// Subshells filled in standard Aufbau order for Z = 1..36 (H through Kr).
// This order (4s before 3d) is the correct ground-state filling order for
// every element in range except two well-known exceptions (Cr, Cu),
// handled separately in CONFIG_EXCEPTIONS below.
const SUBSHELLS = [
  { n: 1, l: 's', cap: 2 },
  { n: 2, l: 's', cap: 2 },
  { n: 2, l: 'p', cap: 6 },
  { n: 3, l: 's', cap: 2 },
  { n: 3, l: 'p', cap: 6 },
  { n: 4, l: 's', cap: 2 },
  { n: 3, l: 'd', cap: 10 },
  { n: 4, l: 'p', cap: 6 }
];

// Chromium and copper fill 4s only halfway (or not at all) so that 3d can
// reach a more stable half-filled (Cr) or completely-filled (Cu) subshell
// -- the two standard exceptions to naive Aufbau filling in this range.
const CONFIG_EXCEPTIONS = {
  24: [ // Cr: [Ar] 3d5 4s1
    { n: 1, l: 's', count: 2, cap: 2 }, { n: 2, l: 's', count: 2, cap: 2 }, { n: 2, l: 'p', count: 6, cap: 6 },
    { n: 3, l: 's', count: 2, cap: 2 }, { n: 3, l: 'p', count: 6, cap: 6 },
    { n: 3, l: 'd', count: 5, cap: 10 }, { n: 4, l: 's', count: 1, cap: 2 }
  ],
  29: [ // Cu: [Ar] 3d10 4s1
    { n: 1, l: 's', count: 2, cap: 2 }, { n: 2, l: 's', count: 2, cap: 2 }, { n: 2, l: 'p', count: 6, cap: 6 },
    { n: 3, l: 's', count: 2, cap: 2 }, { n: 3, l: 'p', count: 6, cap: 6 },
    { n: 3, l: 'd', count: 10, cap: 10 }, { n: 4, l: 's', count: 1, cap: 2 }
  ]
};

const SHELL_LETTER = { 1: 'K', 2: 'L', 3: 'M', 4: 'N' };

const ELEMENT_SYMBOLS = {
  1: 'H', 2: 'He', 3: 'Li', 4: 'Be', 5: 'B', 6: 'C', 7: 'N', 8: 'O', 9: 'F', 10: 'Ne',
  11: 'Na', 12: 'Mg', 13: 'Al', 14: 'Si', 15: 'P', 16: 'S', 17: 'Cl', 18: 'Ar',
  19: 'K', 20: 'Ca', 21: 'Sc', 22: 'Ti', 23: 'V', 24: 'Cr', 25: 'Mn', 26: 'Fe',
  27: 'Co', 28: 'Ni', 29: 'Cu', 30: 'Zn', 31: 'Ga', 32: 'Ge', 33: 'As', 34: 'Se',
  35: 'Br', 36: 'Kr'
};
const ELEMENT_NAMES = {
  1: 'Hydrogen', 2: 'Helium', 3: 'Lithium', 4: 'Beryllium', 5: 'Boron', 6: 'Carbon',
  7: 'Nitrogen', 8: 'Oxygen', 9: 'Fluorine', 10: 'Neon', 11: 'Sodium', 12: 'Magnesium',
  13: 'Aluminum', 14: 'Silicon', 15: 'Phosphorus', 16: 'Sulfur', 17: 'Chlorine', 18: 'Argon',
  19: 'Potassium', 20: 'Calcium', 21: 'Scandium', 22: 'Titanium', 23: 'Vanadium',
  24: 'Chromium', 25: 'Manganese', 26: 'Iron', 27: 'Cobalt', 28: 'Nickel', 29: 'Copper',
  30: 'Zinc', 31: 'Gallium', 32: 'Germanium', 33: 'Arsenic', 34: 'Selenium',
  35: 'Bromine', 36: 'Krypton'
};

// Preset buttons, grouped by relevance to this course.
const PRESET_GROUPS = [
  { label: 'Chapter 4 comparison:', items: [11, 14, 17] },       // Na, Si, Cl
  { label: 'Other semiconductor elements:', items: [5, 6, 15, 31, 32, 33] } // B, C, P, Ga, Ge, As
];

// ---------- animation state ----------
let prevZ = null;
let animStartMs = 0;
const ANIM_MS = 400;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  zSlider = createSlider(1, 36, 14, 1);
  zSlider.attribute('aria-label', 'Atomic number Z');
  zSlider.input(onZChanged);

  PRESET_GROUPS.forEach((group) => {
    const row = createDiv('');
    row.class('control-panel');
    row.parent(mainElement);
    const lbl = createSpan(group.label);
    lbl.class('ctrl-label');
    lbl.parent(row);
    group.items.forEach((z) => {
      const btn = createButton(ELEMENT_SYMBOLS[z] + ' (Z=' + z + ')');
      btn.class('preset-btn');
      btn.parent(row);
      btn.mousePressed(() => { zSlider.value(z); onZChanged(); });
      presetButtons[z] = btn;
    });
  });

  positionUIElements();

  describe('Bohr-model diagram of electron shell filling for atomic number Z from 1 to 36, distinguishing core electrons from valence electrons in the outermost occupied shell, with an animated transition when Z changes', LABEL);

  prevZ = zSlider.value();
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function onZChanged() {
  const Z = zSlider.value();
  if (Z !== prevZ) {
    prevZ = Z;
    animStartMs = millis();
    loop(); // resume the draw loop for the duration of the animation
  }
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;
  zSlider.position(bx + 190, by + drawHeight + 22);
  zSlider.size(Math.max(120, Math.min(canvasWidth - 190 - margin, 320)));
}

// ---------- electron configuration logic ----------
function computeConfig(Z) {
  const source = CONFIG_EXCEPTIONS[Z];
  let filled;
  if (source) {
    filled = source.map((f) => ({ n: f.n, l: f.l, count: f.count, cap: f.cap }));
  } else {
    let remaining = Z;
    filled = [];
    for (const sub of SUBSHELLS) {
      if (remaining <= 0) break;
      const count = Math.min(remaining, sub.cap);
      filled.push({ n: sub.n, l: sub.l, count, cap: sub.cap });
      remaining -= count;
    }
  }
  const highestN = filled.length ? Math.max(...filled.map((f) => f.n)) : 1;
  let valence = 0, core = 0;
  for (const f of filled) {
    if (f.n === highestN) valence += f.count;
    else core += f.count;
  }
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

function shellPopString(shellCounts) {
  const ns = Object.keys(shellCounts).map(Number).sort((a, b) => a - b);
  return ns.map((n) => (SHELL_LETTER[n] || n) + '=' + shellCounts[n]).join(', ');
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
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

  const smallText = canvasWidth < 500;
  const Z = zSlider.value();
  const cfg = computeConfig(Z);
  const symbol = ELEMENT_SYMBOLS[Z];
  const name = ELEMENT_NAMES[Z];

  const animT = constrain((millis() - animStartMs) / ANIM_MS, 0, 1);
  const animEase = easeOutCubic(animT);
  if (animT >= 1) noLoop(); // settle once the transition finishes

  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(smallText ? 13 : 18);
  const titleStr = smallText
    ? name + ' (' + symbol + ', Z=' + Z + ')'
    : 'Electron Configuration: ' + name + ' (' + symbol + ', Z=' + Z + ')';
  text(titleStr, canvasWidth / 2, 8);

  const layout = computeLayout(symbol === 'Si');

  updatePresetHighlight(Z);
  drawBohrDiagram(cfg, Z, animEase, layout);
  drawReadouts(cfg, symbol, layout);
  drawControlLabels(Z);
}

// All positions computed up front from one place, so the narrow-canvas
// layout (readout box full-width, stacked above the diagram) and the wide
// layout (readout box beside the diagram) never fight over the same space.
function computeLayout(hasSiNote) {
  const smallText = canvasWidth < 500;
  const legendW = 168, legendH = 62, legendX = margin, legendY = 38;

  if (smallText) {
    // No separate legend panel on narrow canvases -- core vs. valence is
    // already conveyed by ring color, dashed-vs-solid ring style, and the
    // per-shell "(core)"/"(valence)" labels, so skipping it here reclaims
    // real vertical room for the diagram itself, which matters more.
    const boxX = margin;
    const boxY = 34;
    const boxW = canvasWidth - 2 * margin;
    const boxH = hasSiNote ? 128 : 90;
    const diagramTop = boxY + boxH + 16;
    // Reserve room below the circle for the outermost shell's label (~26px)
    // and require the circle's top edge to start exactly at diagramTop, so
    // the whole diagram -- rings, electrons, and label -- is guaranteed to
    // fit within the remaining draw-area height, never spilling into the
    // control row below.
    const availH = drawHeight - diagramTop - 14;
    const bottomLabelSpace = 26;
    const maxShellRadius = min((availH - bottomLabelSpace) / 2, canvasWidth / 2 - margin - 10);
    return {
      smallText, legendX, legendY, legendW, legendH,
      boxX, boxY, boxW, boxH,
      cx: canvasWidth / 2, cy: diagramTop + maxShellRadius + 8, maxShellRadius
    };
  }

  const boxW = min(canvasWidth * 0.42, canvasWidth - 2 * margin);
  const boxX = canvasWidth - margin - boxW;
  const boxY = 38;
  const boxH = hasSiNote ? 96 : 74;
  return {
    smallText, legendX, legendY, legendW, legendH,
    boxX, boxY, boxW, boxH,
    cx: canvasWidth * 0.36, cy: drawHeight / 2 + 14,
    maxShellRadius: min(canvasWidth * 0.62, drawHeight - 70) * 0.46
  };
}

function updatePresetHighlight(Z) {
  Object.keys(presetButtons).forEach((zKey) => {
    const btn = presetButtons[zKey];
    if (Number(zKey) === Z) btn.addClass('active');
    else btn.removeClass('active');
  });
}

function drawBohrDiagram(cfg, Z, animEase, layout) {
  const cx = layout.cx;
  const cy = layout.cy;
  const maxShellRadius = layout.maxShellRadius;
  const shellNs = Object.keys(cfg.shellCounts).map(Number).sort((a, b) => a - b);
  const nShells = shellNs.length;

  // nucleus
  noStroke();
  fill('#5A3EED');
  circle(cx, cy, 40);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(13);
  text('+' + Z, cx, cy);

  for (let i = 0; i < nShells; i++) {
    const n = shellNs[i];
    const radius = maxShellRadius * ((i + 1) / nShells);
    const count = cfg.shellCounts[n];
    const isValenceShell = (n === cfg.highestN);
    const shellCol = isValenceShell ? '#E67E22' : '#2E7D32';

    // Valence shell gets a visibly distinct ring style (thicker, colored,
    // dashed) so "this is the important one" is obvious at a glance.
    noFill();
    if (isValenceShell) {
      stroke('#E67E22');
      strokeWeight(2.5);
      drawingContext.setLineDash([6, 4]);
    } else {
      stroke(170);
      strokeWeight(1.5);
      drawingContext.setLineDash([]);
    }
    circle(cx, cy, radius * 2);
    drawingContext.setLineDash([]);

    // electron dot size shrinks a little for crowded shells so they don't overlap
    const dotD = count > 12 ? 8 : count > 6 ? 10 : 13;
    noStroke();
    fill(shellCol);
    for (let k = 0; k < count; k++) {
      const angle = (TWO_PI / count) * k - HALF_PI;
      // Electrons in the outermost (valence) shell "fly out" from the
      // nucleus into position whenever Z changes, animating the update.
      const grow = isValenceShell ? animEase : 1;
      const rr = radius * grow;
      const ex = cx + rr * cos(angle);
      const ey = cy + rr * sin(angle);
      circle(ex, ey, dotD);
    }

    // Shell label anchored at the bottom of each ring: since outer rings
    // always reach further down than inner ones, labels stack top-to-bottom
    // (K, L, M, ...) without ever colliding with each other or with the
    // legend/readout boxes in the top corners.
    noStroke();
    fill(shellCol);
    textAlign(CENTER, TOP);
    textSize(11.5);
    text((SHELL_LETTER[n] || n) + ' shell: ' + count + (isValenceShell ? ' (valence)' : ' (core)'), cx, cy + radius + 6);
  }

  if (!layout.smallText) drawLegend(layout);
}

function drawLegend(layout) {
  const lx = layout.legendX, ly = layout.legendY;
  noStroke();
  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(lx, ly, layout.legendW, layout.legendH, 8);
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

function drawReadouts(cfg, symbol, layout) {
  const boxX = layout.boxX, boxY = layout.boxY, boxW = layout.boxW, boxH = layout.boxH;
  const hasSiNote = symbol === 'Si';

  noStroke();
  fill(255, 247, 221, 235);
  stroke(240, 216, 122);
  strokeWeight(1);
  rect(boxX, boxY, boxW, boxH, 8);

  noStroke();
  fill('#7a5c00');
  textAlign(LEFT, TOP);
  const fs = layout.smallText ? 11.5 : 12.5;
  textSize(fs);
  textWrap(WORD);
  const lineH = layout.smallText ? 24 : 20;
  let ty = boxY + 8;
  text('Configuration: ' + configString(cfg.filled), boxX + 10, ty, boxW - 20);
  ty += lineH;
  text('Shell populations: ' + shellPopString(cfg.shellCounts), boxX + 10, ty, boxW - 20);
  ty += lineH;
  text('Core: ' + cfg.core + '   Valence: ' + cfg.valence, boxX + 10, ty, boxW - 20);

  if (hasSiNote) {
    ty += lineH;
    fill('#B03A2E');
    text('Silicon’s 4 valence electrons → 4 covalent bonds (Chapter 4)', boxX + 10, ty, boxW - 20);
  }
}

function drawControlLabels(Z) {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Atomic number Z: ' + Z, 10, drawHeight + 30);
}

// ---------- responsive sizing ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  var mainEl = document.querySelector('main');
  containerWidth = Math.floor(mainEl.getBoundingClientRect().width);
  canvasWidth = containerWidth;
  canvasHeight = drawHeight + controlHeight;
  containerHeight = canvasHeight;
}
