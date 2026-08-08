// Bonding and Crystal Order Explorer MicroSim
// Two linked views selected by a top-level dropdown:
//   "Bond Types"    -- covalent, ionic, and metallic bonding, each shown as
//                      a small multi-atom cluster (not a single isolated
//                      pair), so students can see how the bonding pattern
//                      extends throughout a crystal, not just between two
//                      atoms.
//   "Crystal Order" -- single crystal, polycrystalline, and amorphous
//                      arrangements, with optional point defects
// Bloom Level: Understand / Analyze (L2-L4)
// MicroSim template version 2026.02 (2D static/interactive variant)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 24;

// --- DOM controls ---
let viewSelect, bondTypeSelect, orderSelect, defectsCheckbox;

// --- deterministic "random" layouts, computed once per selection change ---
let metallicElectrons = [];
let amorphousAtoms = [];
let defectSites = {}; // { vacancy: {r,c}, interstitial: {r,c}, substitutional: {r,c} }

const GRID_N = 7; // atoms per side for crystal-order views (denser than before)

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

  describe('Interactive comparison of covalent, ionic, and metallic bonding shown as small multi-atom clusters, and of single-crystal, polycrystalline, and amorphous atomic order, with optional point defects', LABEL);

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
  for (let i = 0; i < 55; i++) {
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
    interstitial: { r: 2, c: 5 },
    substitutional: { r: 5, c: 2 }
  };
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;

  viewSelect.position(bx + 10, by + drawHeight + 10);

  const viewW = viewSelect.elt.getBoundingClientRect().width;
  const secondX = 10 + viewW + 18;
  bondTypeSelect.position(bx + secondX, by + drawHeight + 10);
  orderSelect.position(bx + secondX, by + drawHeight + 10);

  const secondEl = viewSelect.value() === 'Bond Types' ? bondTypeSelect : orderSelect;
  const secondW = secondEl.elt.getBoundingClientRect().width;
  const thirdX = secondX + secondW + 18;
  const stacked = (bx + thirdX + 130) > (bx + canvasWidth - 10);
  if (stacked) {
    defectsCheckbox.position(bx + 10, by + drawHeight + 46);
  } else {
    defectsCheckbox.position(bx + thirdX, by + drawHeight + 13);
  }
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
  fill('#666');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(11);
  const stacked = defectsCheckbox.position && viewSelect.value() !== 'Bond Types' &&
    (document.querySelector('main').getBoundingClientRect().width < 560);
  const capY = stacked ? drawHeight + 78 : drawHeight + 46;
  text('Use the dropdowns above to switch views and compare bonding or crystal-order side by side.', 10, capY, canvasWidth - 20);
}

// ============================================================
// BOND TYPES VIEW
// ============================================================
function drawBondTypes(kind) {
  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 500 ? 14 : 18);
  text('Bond Types: ' + kind, canvasWidth / 2, 8);

  if (kind === 'Covalent') drawCovalent();
  else if (kind === 'Ionic') drawIonic();
  else drawMetallic();
}

// A small silicon cluster: one central atom bonded to 4 neighbors, each
// bond showing a shared electron pair, with short "stub" bonds hinting
// that every neighbor keeps bonding onward through the rest of the
// crystal -- the key improvement over a single isolated Si-Si pair.
function drawCovalent() {
  const smallText = canvasWidth < 500;
  const cx = canvasWidth / 2;
  const d = min(canvasWidth * 0.16, 130); // center-to-neighbor bond length
  const r = min(d * 0.42, 30);
  const cy = smallText ? (36 + d + r) : drawHeight * 0.46;

  const dirs = [
    { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
  ];
  const neighborPos = dirs.map((dir) => ({ x: cx + dir.x * d, y: cy + dir.y * d, dir }));

  // stub bonds from each neighbor, hinting the lattice continues
  stroke(90, 60, 220, 90);
  strokeWeight(2);
  neighborPos.forEach((p) => {
    const stubDirs = dirs.filter((dd) => !(dd.x === -p.dir.x && dd.y === -p.dir.y));
    stubDirs.forEach((sd) => {
      const sx = p.x + sd.x * d * 0.4;
      const sy = p.y + sd.y * d * 0.4;
      line(p.x, p.y, sx, sy);
    });
  });

  // 4 real bonds from the center atom, each with a shared electron pair
  neighborPos.forEach((p) => {
    drawSharedBond(cx, cy, p.x, p.y, r);
  });

  // atoms (draw after bonds so they sit on top)
  drawSiAtom(cx, cy, r, true);
  neighborPos.forEach((p) => drawSiAtom(p.x, p.y, r, false));

  drawInfoBox([
    'The central Si atom shares one electron with each of its 4 neighbors —',
    '4 bonds x 2 shared electrons = 8 electrons around each atom (octet).',
    'Faint stub lines show every neighbor bonding onward, the same way,',
    'throughout the rest of the crystal. Example: every Si–Si bond in silicon.'
  ]);
}

function drawSharedBond(x1, y1, x2, y2, r) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const ang = atan2(y2 - y1, x2 - x1);

  noFill();
  stroke(90, 60, 220, 150);
  strokeWeight(2);
  push();
  translate(mx, my);
  rotate(ang);
  ellipse(0, 0, dist(x1, y1, x2, y2) * 0.5, r * 1.1);
  pop();

  noStroke();
  fill('#E67E22');
  const ex = 6 * cos(ang + HALF_PI), ey = 6 * sin(ang + HALF_PI);
  circle(mx - ex * 0.6, my - ey * 0.6, 9);
  circle(mx + ex * 0.6, my + ey * 0.6, 9);
}

function drawSiAtom(x, y, r, isCenter) {
  noStroke();
  fill(isCenter ? '#5A3EED' : '#7B68EE');
  circle(x, y, r * 2);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(r * 0.5);
  text('Si', x, y);
}

function drawIonic() {
  const smallText = canvasWidth < 500;
  const cx = canvasWidth / 2;
  const cols = 3, rows = 3;
  const spacing = min(canvasWidth * 0.16, 110);
  const cy = smallText ? (85 + spacing) : drawHeight * 0.44;
  const gx0 = cx - ((cols - 1) / 2) * spacing;
  const gy0 = cy - ((rows - 1) / 2) * spacing;

  // Coulomb attraction lines between every adjacent pair, forming the
  // extended ionic lattice (not just one isolated pair).
  stroke(150);
  strokeWeight(1);
  drawingContext.setLineDash([4, 4]);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = gx0 + c * spacing, y = gy0 + r * spacing;
      if (c < cols - 1) line(x, y, x + spacing, y);
      if (r < rows - 1) line(x, y, x, y + spacing);
    }
  }
  drawingContext.setLineDash([]);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isNa = (r + c) % 2 === 0;
      const x = gx0 + c * spacing, y = gy0 + r * spacing;
      drawIon(x, y, isNa);
    }
  }

  // Electron-transfer callout on the one representative pair at the center:
  // the center atom (row1,col1) is Na+, its right neighbor (row1,col2) is Cl-,
  // so the arrow must point from Na (electron donor) to Cl (electron acceptor).
  const midC = 1;
  const x0 = gx0 + midC * spacing;
  // Anchored above the top row (gy0), not the center row, so the label
  // clears the row-0 ion regardless of grid spacing.
  const arrowY = gy0 - 36, labelY = gy0 - 40;
  stroke('#E67E22');
  strokeWeight(2);
  drawArrow(x0 + 22, arrowY, x0 + spacing - 24, arrowY);
  noStroke();
  fill('#E67E22');
  textAlign(CENTER, BOTTOM);
  textSize(11);
  text('e⁻ transferred', x0 + spacing / 2, labelY);

  drawInfoBox([
    'Sodium transfers its 1 valence electron to chlorine, forming Na⁺ and Cl⁻.',
    'Each ion then attracts every oppositely-charged neighbor around it —',
    'U(r) = −e²/(4πε₀r) — non-directional, unlike a covalent bond, which is',
    'why ionic crystals form extended lattices like this instead of pairs.'
  ]);
}

function drawIon(x, y, isNa) {
  noStroke();
  if (isNa) {
    fill('#2E7D32');
    circle(x, y, 40);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Na⁺', x, y);
  } else {
    fill('#B03A2E');
    circle(x, y, 58);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Cl⁻', x, y);
  }
}

function drawMetallic() {
  const smallText = canvasWidth < 500;
  const gx0 = canvasWidth / 2 - min(canvasWidth * 0.34, 200);
  const gx1 = canvasWidth / 2 + min(canvasWidth * 0.34, 200);
  const gy0 = smallText ? 46 : 56;
  const gy1 = smallText ? (gy0 + 120) : drawHeight * 0.72;
  const cols = 6, rows = smallText ? 3 : 4;

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
  textSize(smallText ? 11 : 13);
  text(smallText ? 'Ion cores + mobile "electron sea"' : 'Fixed positive ion cores + mobile "electron sea"', canvasWidth / 2, gy1 + (smallText ? 12 : 26));

  drawInfoBox([
    'Valence electrons delocalize across the whole crystal, belonging to no',
    'single atom. Mobile electrons -> electrical conductivity.',
    'Non-directional bond -> malleability (ion cores can slide past each',
    'other while the electron sea simply redistributes around them).'
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

// Greedily wraps a single logical sentence into multiple lines that each
// fit within maxWidth, using the currently-set font/size for measurement.
function wrapTextLines(str, maxWidth) {
  const words = str.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (cur && textWidth(test) > maxWidth) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawInfoBox(rawLines) {
  const smallText = canvasWidth < 500;
  const boxW = smallText ? (canvasWidth - 2 * margin) : min(canvasWidth - 2 * margin, 560);
  const boxX = canvasWidth / 2 - boxW / 2;
  const lineH = smallText ? 14 : 16;
  const fs = smallText ? 10.5 : 12;

  textSize(fs);
  let lines = [];
  rawLines.forEach((l) => { lines = lines.concat(wrapTextLines(l, boxW - 24)); });

  const boxY = drawHeight - 12 - lines.length * lineH - 10;
  noStroke();
  fill(255, 247, 221, 235);
  stroke(240, 216, 122);
  strokeWeight(1);
  rect(boxX, boxY, boxW, lines.length * lineH + 14, 8);
  noStroke();
  fill('#7a5c00');
  textAlign(LEFT, TOP);
  textSize(fs);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], boxX + 12, boxY + 8 + i * lineH);
  }
}

// ============================================================
// CRYSTAL ORDER VIEW
// ============================================================
function drawCrystalOrder(order, showDefects) {
  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 500 ? 14 : 18);
  text('Crystal Order: ' + order, canvasWidth / 2, 8);

  const gx0 = margin + 20;
  const gx1 = canvasWidth - margin - 20;
  const gy0 = 46;
  const gy1 = drawHeight - 54;

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
  } else {
    drawWrappedCaption('One continuous, uniformly-oriented pattern extends across the whole crystal', gy1 + 16, 90);
  }
}

// Centered, word-wrapped caption line(s) below a diagram; used instead of a
// bare text() call so long captions wrap safely on narrow canvases.
function drawWrappedCaption(str, y, col) {
  const smallText = canvasWidth < 500;
  const fs = smallText ? 11 : 12;
  const maxW = canvasWidth - 2 * margin;
  noStroke();
  fill(col);
  textAlign(CENTER, TOP);
  textSize(fs);
  const lines = wrapTextLines(str, maxW);
  const lineH = fs + 4;
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], canvasWidth / 2, y + i * lineH);
  }
  return lines.length * lineH;
}

function drawAtomMarker(x, y, kind) {
  noStroke();
  if (kind === 'normal') {
    fill('#5A3EED');
    circle(x, y, 18);
  } else if (kind === 'vacancy') {
    noFill();
    stroke(180, 60, 60);
    strokeWeight(2);
    drawingContext.setLineDash([3, 3]);
    circle(x, y, 18);
    drawingContext.setLineDash([]);
  } else if (kind === 'substitutional') {
    fill('#2E7D32');
    circle(x, y, 18);
  } else if (kind === 'interstitial') {
    fill('#E67E22');
    circle(x, y, 12);
  }
}

function drawDefectLegend() {
  const lx = canvasWidth - margin - 190;
  const ly = 30;
  noStroke();
  fill(255);
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

  drawWrappedCaption('Each grain is internally periodic; bold lines mark grain boundaries where misaligned grains meet', gy1 + 16, 90);
}

function drawGrain(x0, y0, x1, y1, angleDeg) {
  const ctx = drawingContext;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x0, y0, x1 - x0, y1 - y0);
  ctx.clip();

  // Draw an oversized rotated grid, centered on the quadrant, so that after
  // clipping to the quadrant rectangle every corner is still filled --
  // rotating a grid sized to exactly fit the box would leave gaps at the
  // corners once the box is clipped to its (unrotated) rectangular bounds.
  push();
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  translate(cx, cy);
  rotate(radians(angleDeg));
  const spacing = (x1 - x0) * 0.19; // visual density of the lattice
  const extW = (x1 - x0) * 1.8;
  const extH = (y1 - y0) * 1.8;
  const nx = Math.ceil(extW / spacing);
  const ny = Math.ceil(extH / spacing);
  const w = nx * spacing;
  const h = ny * spacing;
  stroke(150);
  strokeWeight(1);
  for (let i = 0; i <= nx; i++) {
    const gx = lerp(-w / 2, w / 2, i / nx);
    line(gx, -h / 2, gx, h / 2);
  }
  for (let j = 0; j <= ny; j++) {
    const gy = lerp(-h / 2, h / 2, j / ny);
    line(-w / 2, gy, w / 2, gy);
  }
  noStroke();
  fill('#5A3EED');
  for (let i = 0; i <= nx; i++) {
    for (let j = 0; j <= ny; j++) {
      const gx = lerp(-w / 2, w / 2, i / nx);
      const gy = lerp(-h / 2, h / 2, j / ny);
      circle(gx, gy, 9);
    }
  }
  pop();

  ctx.restore();
}

function drawAmorphous(gx0, gx1, gy0, gy1) {
  noStroke();
  fill('#5A3EED');
  for (const a of amorphousAtoms) {
    const p = gridToXY(a.r, a.c, gx0, gx1, gy0, gy1);
    circle(p.x, p.y, 15);
  }

  drawWrappedCaption('No repeating pattern beyond a few atomic spacings — no long-range order', gy1 + 16, 90);
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
  drawHeight = canvasWidth < 500 ? 360 : 460;
  controlHeight = 100;
  canvasHeight = drawHeight + controlHeight;
  containerHeight = canvasHeight;
}
