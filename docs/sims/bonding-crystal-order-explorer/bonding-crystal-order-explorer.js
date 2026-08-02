// Bonding and Crystal Order Explorer MicroSim
// Two linked views selected by a top-level dropdown:
//   "Bond Types"   -- schematic covalent, ionic, and metallic bonding
//   "Crystal Order" -- single crystal, polycrystalline, and amorphous
//                      arrangements, with optional point defects
// Bloom Level: Understand / Analyze (L2-L4)
// MicroSim template version 2026.02 (2D static/interactive variant)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 30;

// --- DOM controls ---
let viewSelect, bondTypeSelect, orderSelect, defectsCheckbox;

// --- deterministic "random" layouts, computed once per selection change ---
let metallicElectrons = [];
let amorphousAtoms = [];
let defectSites = {}; // { vacancy: {r,c}, interstitial: {r,c}, substitutional: {r,c} }

const GRID_N = 6; // atoms per side for crystal-order views

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  viewSelect = createSelect();
  viewSelect.option('Bond Types');
  viewSelect.option('Crystal Order');
  viewSelect.selected('Bond Types');
  viewSelect.changed(onViewChanged);
  viewSelect.attribute('aria-label', 'View selector');

  bondTypeSelect = createSelect();
  bondTypeSelect.option('Covalent');
  bondTypeSelect.option('Ionic');
  bondTypeSelect.option('Metallic');
  bondTypeSelect.selected('Covalent');
  bondTypeSelect.changed(regenerateLayouts);
  bondTypeSelect.attribute('aria-label', 'Bond type selector');

  orderSelect = createSelect();
  orderSelect.option('Single Crystal');
  orderSelect.option('Polycrystalline');
  orderSelect.option('Amorphous');
  orderSelect.selected('Single Crystal');
  orderSelect.changed(regenerateLayouts);
  orderSelect.attribute('aria-label', 'Crystal order selector');

  defectsCheckbox = createCheckbox('Show defects', false);
  defectsCheckbox.changed(regenerateLayouts);

  regenerateLayouts();
  positionUIElements();
  updateControlVisibility();

  describe('Interactive comparison of covalent, ionic, and metallic bonding, and of single-crystal, polycrystalline, and amorphous atomic order, with optional point defects', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function onViewChanged() {
  updateControlVisibility();
  regenerateLayouts();
}

function updateControlVisibility() {
  const view = viewSelect.value();
  if (view === 'Bond Types') {
    bondTypeSelect.show();
    orderSelect.hide();
    defectsCheckbox.hide();
  } else {
    bondTypeSelect.hide();
    orderSelect.show();
    defectsCheckbox.show();
  }
}

// deterministic pseudo-random in [0,1) from an integer seed (no drift between frames)
function seededRandom(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function regenerateLayouts() {
  // metallic electron sea: fixed pseudo-random positions, recomputed only on selection change
  metallicElectrons = [];
  for (let i = 0; i < 40; i++) {
    metallicElectrons.push({
      u: seededRandom(i * 3.1 + 1),
      v: seededRandom(i * 7.7 + 2)
    });
  }

  // amorphous atoms: jittered grid, fixed pseudo-random offsets
  amorphousAtoms = [];
  let idx = 0;
  for (let r = 0; r < GRID_N; r++) {
    for (let c = 0; c < GRID_N; c++) {
      const jx = (seededRandom(idx * 5.2 + 11) - 0.5) * 0.7;
      const jy = (seededRandom(idx * 9.4 + 17) - 0.5) * 0.7;
      amorphousAtoms.push({ r: r + jy, c: c + jx });
      idx++;
    }
  }

  // fixed defect sites (roughly centered, spaced apart)
  defectSites = {
    vacancy: { r: 2, c: 2 },
    interstitial: { r: 2, c: 4 },
    substitutional: { r: 4, c: 2 }
  };
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;

  viewSelect.position(bx + 10, by + drawHeight + 8);
  bondTypeSelect.position(bx + 190, by + drawHeight + 8);
  orderSelect.position(bx + 190, by + drawHeight + 8);
  defectsCheckbox.position(bx + 380, by + drawHeight + 12);
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

  const view = viewSelect.value();
  if (view === 'Bond Types') {
    drawBondTypes(bondTypeSelect.value());
  } else {
    drawCrystalOrder(orderSelect.value(), defectsCheckbox.checked());
  }

  drawControlLabels(view);
}

function drawControlLabels(view) {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text('View:', 10, drawHeight + 40);
  if (view === 'Bond Types') {
    text('Bond type:', 190, drawHeight + 40);
  } else {
    text('Order:', 190, drawHeight + 40);
  }
}

// ============================================================
// BOND TYPES VIEW
// ============================================================
function drawBondTypes(kind) {
  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Bond Types: ' + kind, canvasWidth / 2, 10);

  if (kind === 'Covalent') drawCovalent();
  else if (kind === 'Ionic') drawIonic();
  else drawMetallic();
}

function drawCovalent() {
  const cy = drawHeight / 2 + 10;
  const cx = canvasWidth / 2;
  const sep = min(160, canvasWidth * 0.22);
  const r = 32;

  // two atom nuclei
  noStroke();
  fill('#5A3EED');
  circle(cx - sep, cy, r * 2);
  circle(cx + sep, cy, r * 2);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text('Si', cx - sep, cy);
  text('Si', cx + sep, cy);

  // shared electron cloud between them
  noFill();
  stroke(90, 60, 220, 140);
  strokeWeight(2);
  ellipse(cx, cy, sep * 1.1, r * 1.6);

  // two shared electrons
  noStroke();
  fill('#E67E22');
  circle(cx - 8, cy - 6, 10);
  circle(cx + 8, cy + 6, 10);

  fill(20);
  textAlign(CENTER, TOP);
  textSize(13);
  text('Shared electron pair (covalent bond)', cx, cy + r + 30);

  drawInfoBox([
    'Each atom contributes 1 valence electron to the shared pair.',
    'The bond is directional — it points along the line',
    'connecting the two specific bonded nuclei.',
    'Example: every Si–Si bond in a silicon crystal.'
  ]);
}

function drawIonic() {
  const cy = drawHeight / 2 + 10;
  const cx = canvasWidth / 2;
  const sep = min(150, canvasWidth * 0.2);

  // cation (smaller, Na+)
  noStroke();
  fill('#2E7D32');
  circle(cx - sep, cy, 46);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  text('Na⁺', cx - sep, cy);

  // anion (larger, Cl-)
  fill('#B03A2E');
  circle(cx + sep, cy, 70);
  fill(255);
  text('Cl⁻', cx + sep, cy);

  // transferred electron arrow
  stroke('#E67E22');
  strokeWeight(2);
  drawArrow(cx - sep + 26, cy - 30, cx + sep - 40, cy - 30);
  noStroke();
  fill('#E67E22');
  textAlign(CENTER, BOTTOM);
  textSize(12);
  text('electron transferred', cx, cy - 38);

  // Coulomb attraction indicator
  stroke(90);
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  line(cx - sep + 26, cy, cx + sep - 38, cy);
  drawingContext.setLineDash([]);
  noStroke();
  fill(20);
  textAlign(CENTER, TOP);
  textSize(13);
  text('Coulomb attraction between ions', cx, cy + 46);

  drawInfoBox([
    'Sodium transfers its 1 valence electron to chlorine.',
    'Na⁺ and Cl⁻ are held together by Coulomb attraction:',
    'U(r) = −e²/(4πε₀r) — non-directional, unlike a covalent bond.'
  ]);
}

function drawMetallic() {
  const gx0 = canvasWidth / 2 - 150;
  const gx1 = canvasWidth / 2 + 150;
  const gy0 = 60;
  const gy1 = drawHeight - 90;
  const cols = 5, rows = 4;

  // fixed positive ion cores
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const x = lerp(gx0, gx1, c / cols);
      const y = lerp(gy0, gy1, r / rows);
      noStroke();
      fill('#5A3EED');
      circle(x, y, 22);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(11);
      text('+', x, y);
    }
  }

  // delocalized electron sea
  noStroke();
  fill('#E67E22');
  for (const e of metallicElectrons) {
    const x = lerp(gx0 - 20, gx1 + 20, e.u);
    const y = lerp(gy0 - 15, gy1 + 15, e.v);
    circle(x, y, 7);
  }

  fill(20);
  textAlign(CENTER, TOP);
  textSize(13);
  text('Fixed positive ion cores + mobile "electron sea"', canvasWidth / 2, gy1 + 30);

  drawInfoBox([
    'Valence electrons delocalize across the whole crystal.',
    'Mobile electrons → electrical conductivity.',
    'Non-directional bond → malleability (ions can slide',
    'past each other while the electron sea redistributes).'
  ]);
}

function drawArrow(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
  const angle = atan2(y2 - y1, x2 - x1);
  push();
  translate(x2, y2);
  rotate(angle);
  line(0, 0, -10, -5);
  line(0, 0, -10, 5);
  pop();
}

function drawInfoBox(lines) {
  const boxW = min(420, canvasWidth - 2 * margin);
  const boxX = canvasWidth / 2 - boxW / 2;
  const boxY = drawHeight - 12 - lines.length * 16 - 10;
  noStroke();
  fill(255, 247, 221, 230);
  stroke(240, 216, 122);
  strokeWeight(1);
  rect(boxX, boxY, boxW, lines.length * 16 + 14, 8);
  noStroke();
  fill('#7a5c00');
  textAlign(LEFT, TOP);
  textSize(12);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], boxX + 12, boxY + 8 + i * 16);
  }
}

// ============================================================
// CRYSTAL ORDER VIEW
// ============================================================
function drawCrystalOrder(order, showDefects) {
  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Crystal Order: ' + order, canvasWidth / 2, 10);

  const gx0 = margin + 40;
  const gx1 = canvasWidth - margin - 40;
  const gy0 = 50;
  const gy1 = drawHeight - 60;

  if (order === 'Single Crystal') {
    drawSingleCrystal(gx0, gx1, gy0, gy1, showDefects);
  } else if (order === 'Polycrystalline') {
    drawPolycrystalline(gx0, gx1, gy0, gy1);
  } else {
    drawAmorphous(gx0, gx1, gy0, gy1);
  }
}

function gridToXY(r, c, gx0, gx1, gy0, gy1) {
  const x = lerp(gx0, gx1, c / (GRID_N - 1));
  const y = lerp(gy0, gy1, r / (GRID_N - 1));
  return { x, y };
}

function drawSingleCrystal(gx0, gx1, gy0, gy1, showDefects) {
  // grid lines
  stroke(180);
  strokeWeight(1);
  for (let r = 0; r < GRID_N; r++) {
    const p0 = gridToXY(r, 0, gx0, gx1, gy0, gy1);
    const p1 = gridToXY(r, GRID_N - 1, gx0, gx1, gy0, gy1);
    line(p0.x, p0.y, p1.x, p1.y);
  }
  for (let c = 0; c < GRID_N; c++) {
    const p0 = gridToXY(0, c, gx0, gx1, gy0, gy1);
    const p1 = gridToXY(GRID_N - 1, c, gx0, gx1, gy0, gy1);
    line(p0.x, p0.y, p1.x, p1.y);
  }

  for (let r = 0; r < GRID_N; r++) {
    for (let c = 0; c < GRID_N; c++) {
      const p = gridToXY(r, c, gx0, gx1, gy0, gy1);
      let kind = 'normal';
      if (showDefects) {
        if (r === defectSites.vacancy.r && c === defectSites.vacancy.c) kind = 'vacancy';
        if (r === defectSites.substitutional.r && c === defectSites.substitutional.c) kind = 'substitutional';
      }
      drawAtomMarker(p.x, p.y, kind);
    }
  }

  if (showDefects) {
    // interstitial: extra atom squeezed between four regular sites
    const r0 = defectSites.interstitial.r, c0 = defectSites.interstitial.c;
    const pA = gridToXY(r0, c0, gx0, gx1, gy0, gy1);
    const pB = gridToXY(r0 + 1, c0 + 1, gx0, gx1, gy0, gy1);
    const ix = (pA.x + pB.x) / 2;
    const iy = (pA.y + pB.y) / 2;
    drawAtomMarker(ix, iy, 'interstitial');

    drawDefectLegend();
  }
}

function drawAtomMarker(x, y, kind) {
  noStroke();
  if (kind === 'normal') {
    fill('#5A3EED');
    circle(x, y, 20);
  } else if (kind === 'vacancy') {
    noFill();
    stroke(180, 60, 60);
    strokeWeight(2);
    drawingContext.setLineDash([3, 3]);
    circle(x, y, 20);
    drawingContext.setLineDash([]);
  } else if (kind === 'substitutional') {
    fill('#2E7D32');
    circle(x, y, 20);
  } else if (kind === 'interstitial') {
    fill('#E67E22');
    circle(x, y, 13);
  }
}

function drawDefectLegend() {
  const lx = canvasWidth - margin - 190;
  const ly = 40;
  noStroke();
  fill(255, 255, 255, 235);
  stroke(200);
  strokeWeight(1);
  rect(lx, ly, 190, 88, 8);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(12);

  fill(180, 60, 60);
  noFill();
  stroke(180, 60, 60);
  drawingContext.setLineDash([3, 3]);
  circle(lx + 16, ly + 20, 14);
  drawingContext.setLineDash([]);
  noStroke();
  fill(20);
  text('Vacancy', lx + 30, ly + 20);

  fill('#E67E22');
  circle(lx + 16, ly + 44, 10);
  fill(20);
  text('Interstitial', lx + 30, ly + 44);

  fill('#2E7D32');
  circle(lx + 16, ly + 68, 14);
  fill(20);
  text('Substitutional', lx + 30, ly + 68);
}

function drawPolycrystalline(gx0, gx1, gy0, gy1) {
  // four grain quadrants, each with its own rotated grid, separated by bold boundaries
  const midX = (gx0 + gx1) / 2;
  const midY = (gy0 + gy1) / 2;
  const grains = [
    { x0: gx0, y0: gy0, x1: midX, y1: midY, angle: 0 },
    { x0: midX, y0: gy0, x1: gx1, y1: midY, angle: 22 },
    { x0: gx0, y0: midY, x1: midX, y1: gy1, angle: -18 },
    { x0: midX, y0: midY, x1: gx1, y1: gy1, angle: 35 }
  ];

  for (const g of grains) {
    drawGrain(g.x0, g.y0, g.x1, g.y1, g.angle);
  }

  // bold grain boundaries
  stroke(30);
  strokeWeight(3);
  line(midX, gy0, midX, gy1);
  line(gx0, midY, gx1, midY);

  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(13);
  text('Each grain is internally periodic; grain boundaries separate misaligned grains', canvasWidth / 2, gy1 + 20);
}

function drawGrain(x0, y0, x1, y1, angleDeg) {
  push();
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  translate(cx, cy);
  rotate(radians(angleDeg));
  const w = (x1 - x0) * 0.95;
  const h = (y1 - y0) * 0.95;
  const n = 4;
  stroke(150);
  strokeWeight(1);
  for (let i = 0; i <= n; i++) {
    const gx = lerp(-w / 2, w / 2, i / n);
    line(gx, -h / 2, gx, h / 2);
  }
  for (let i = 0; i <= n; i++) {
    const gy = lerp(-h / 2, h / 2, i / n);
    line(-w / 2, gy, w / 2, gy);
  }
  noStroke();
  fill('#5A3EED');
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= n; j++) {
      const gx = lerp(-w / 2, w / 2, i / n);
      const gy = lerp(-h / 2, h / 2, j / n);
      circle(gx, gy, 10);
    }
  }
  pop();
}

function drawAmorphous(gx0, gx1, gy0, gy1) {
  noStroke();
  fill('#5A3EED');
  for (const a of amorphousAtoms) {
    const p = gridToXY(a.r, a.c, gx0, gx1, gy0, gy1);
    circle(p.x, p.y, 16);
  }

  fill(20);
  textAlign(CENTER, TOP);
  textSize(13);
  text('No repeating pattern beyond a few atomic spacings — no long-range order', canvasWidth / 2, gy1 + 20);
}

// ---------- responsive sizing ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
}

function updateCanvasSize() {
  var mainEl = document.querySelector('main');
  containerWidth = Math.floor(mainEl.getBoundingClientRect().width);
  canvasWidth = containerWidth;

  var availableHeight = window.innerHeight;
  var children = mainEl.children;
  for (var i = 0; i < children.length; i++) {
    if (children[i].tagName !== 'CANVAS') {
      availableHeight -= children[i].offsetHeight;
    }
  }
  drawHeight = Math.max(minDrawHeight, availableHeight - controlHeight);
  canvasHeight = drawHeight + controlHeight;
  containerHeight = canvasHeight;
}
