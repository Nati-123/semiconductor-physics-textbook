// Metallurgical Junction and Depletion Formation Explorer MicroSim
// An 8-step guided tour of how joining a p-type and n-type region creates
// a metallurgical junction, drives majority-carrier diffusion, and settles
// into an equilibrium depletion region with exposed ionized dopants and a
// built-in electric field:
//   separate -> contact -> diffusion -> recombination -> uncovered ions ->
//   depletion region -> electric field -> equilibrium
// Mobile carriers (electrons, holes) are drawn as round filled/outlined
// dots; fixed ionized dopants (donors, acceptors) are drawn as square
// symbols at lattice-like positions that never move or disappear across
// steps -- only the carrier layer thins out near the junction as the
// steps advance, which is the physical point of the whole sequence.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let currentStep = 0;
let prevBtn = { x: 0, y: 0, w: 90, h: 36 };
let nextBtn = { x: 0, y: 0, w: 90, h: 36 };

// Depletion extent (fraction of each side's half-width that has been
// swept clear of mobile carriers) at each step, and which overlays to
// draw. depletion=0 means carriers fill the region right up to the
// junction; depletion=DEP_MAX is the "final" equilibrium extent.
const DEP_MAX = 0.62;
const STEPS = [
  {
    title: '1. Before Contact',
    text: 'A p-type region (mobile holes, fixed ionized acceptors) and an n-type region (mobile electrons, fixed ionized donors) exist separately. Each side is individually neutral: mobile carrier density equals fixed ion density, everywhere.',
    opts: { separated: true, depletion: 0 }
  },
  {
    title: '2. The Instant of Contact',
    text: 'The two regions are joined at a common interface: the metallurgical junction (x = 0). Nothing has moved yet, but a single crystal cannot have two different Fermi levels, so the system is no longer at equilibrium.',
    opts: { showJunction: true, depletion: 0 }
  },
  {
    title: '3. Majority-Carrier Diffusion',
    text: 'Holes see a steep concentration gradient and diffuse from the p-side into the n-side; electrons diffuse from the n-side into the p-side — ordinary diffusion current, driven purely by the concentration gradient.',
    opts: { showJunction: true, depletion: 0.08, showDiffusionArrows: true }
  },
  {
    title: '4. Recombination Near the Interface',
    text: 'A hole that crosses into the n-side is now a minority carrier surrounded by electrons, and recombines almost immediately — removing one mobile hole and one mobile electron as a pair. The same happens to electrons crossing into the p-side.',
    opts: { showJunction: true, depletion: 0.28, showRecombination: true }
  },
  {
    title: '5. Uncovered (Exposed) Ions',
    text: 'Near the junction, mobile carriers are now gone — but the fixed ionized dopants never moved. With no mobile carrier left to neutralize them, they are now "uncovered": exposed, uncompensated charge.',
    opts: { showJunction: true, depletion: 0.46, showUncoveredLabel: true }
  },
  {
    title: '6. The Depletion Region Forms',
    text: 'The swept-clean strip on each side of the junction is the depletion region, with sharp edges at x = −x_p and x = x_n in the depletion approximation. Inside it: only fixed charge. Outside it: fully neutral, exactly as before.',
    opts: { showJunction: true, depletion: DEP_MAX, showBoundaries: true }
  },
  {
    title: '7. The Built-In Electric Field',
    text: 'The exposed negative acceptor charge on the p-side and positive donor charge on the n-side create an internal electric field, pointing from the n-side toward the p-side — the direction that pushes holes back and electrons back, opposing further diffusion.',
    opts: { showJunction: true, depletion: DEP_MAX, showBoundaries: true, showField: true }
  },
  {
    title: '8. Equilibrium',
    text: 'The junction settles once the drift current driven by this built-in field exactly balances the diffusion current everywhere — no further net motion of either carrier type, even though both drift and diffusion are still happening continuously.',
    opts: { showJunction: true, depletion: DEP_MAX, showBoundaries: true, showField: true, showEquilibrium: true }
  }
];

function compact() { return canvasWidth < 480; }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);
  describe('Metallurgical junction and depletion formation explorer: an 8-step guided tour showing how joining p-type and n-type material creates a metallurgical junction, drives majority-carrier diffusion and recombination, uncovers fixed ionized dopant charge, and forms an equilibrium depletion region with a built-in electric field', LABEL);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const step = STEPS[currentStep];

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13.5 : 16.5);
  // x must be the LEFT edge of the wrap box (not the center) once a
  // width is passed to text() -- using canvasWidth/2 here previously
  // made the title start at the horizontal center and overflow off
  // the right edge of the canvas.
  text(step.title, 10, 10, canvasWidth - 20);

  const illX = 20, illY = compact() ? 34 : 40, illW = canvasWidth - 40, illH = drawHeight * 0.56;
  noStroke(); fill(255);
  stroke(210); strokeWeight(1);
  rect(illX, illY, illW, illH, 8);
  drawJunctionState(illX, illY, illW, illH, step.opts);

  const txtX = 20, txtY = illY + illH + 14, txtW = canvasWidth - 40, txtH = drawHeight - (txtY - 0) - 14;
  noStroke(); fill(255, 247, 221);
  stroke(240, 216, 122); strokeWeight(1);
  rect(txtX, txtY, txtW, txtH, 8);
  noStroke(); fill('#7a5c00');
  textAlign(LEFT, TOP); textSize(compact() ? 12 : 13.5);
  text(step.text, txtX + 14, txtY + 12, txtW - 28, txtH - 20);

  drawControls();
}

// ---- fixed-ion and mobile-carrier symbols ----
// Mobile carriers reuse the shared library's round electron/hole
// symbols. Fixed ionized dopants get their own square symbol so they
// read as "planted in the lattice" rather than "free to move" even at
// a glance -- the whole point of this MicroSim is that these two
// layers behave completely differently.
function drawAcceptorIon(x, y, r) {
  push();
  rectMode(CENTER);
  stroke(140, 20, 130); strokeWeight(1.8); fill(250, 235, 250);
  rect(x, y, r * 1.6, r * 1.6, 3);
  noStroke(); fill(140, 20, 130);
  textAlign(CENTER, CENTER); textSize(r * 0.85);
  text('−', x, y - 0.5);
  pop();
}
function drawDonorIon(x, y, r) {
  push();
  rectMode(CENTER);
  stroke(200, 110, 10); strokeWeight(1.8); fill(255, 245, 225);
  rect(x, y, r * 1.6, r * 1.6, 3);
  noStroke(); fill(200, 110, 10);
  textAlign(CENTER, CENTER); textSize(r * 0.85);
  text('+', x, y - 0.5);
  pop();
}

// Generates a row of evenly-spaced x positions spanning [x0, x0+w].
function rowXs(x0, w, n) {
  const xs = [];
  for (let i = 0; i < n; i++) xs.push(x0 + (i + 0.5) * (w / n));
  return xs;
}

// Draws the full junction illustration for one step. All positions are
// computed fresh each call (cheap enough at this scale) so ion/carrier
// grids stay perfectly aligned across steps, making it visually obvious
// that only the carrier layer changes.
function drawJunctionState(x, y, w, h, opts) {
  const gap = opts.separated ? Math.max(14, w * 0.03) : 0;
  const midX = x + w / 2;
  const halfW = w / 2 - gap / 2;
  const pX0 = x, pX1 = x + halfW;
  const nX0 = x + w - halfW, nX1 = x + w;
  // Reserve dedicated vertical margins for each optional annotation so
  // they stack instead of overlapping: the field arrow gets its own
  // strip above the p/n boxes (not drawn above the illustration box
  // into the title, as it originally was), and the boundary label /
  // equilibrium caption get separate stacked rows below.
  const topMargin = 8 + (opts.showField ? 22 : 0);
  const bottomMargin = 8 + (opts.showUncoveredLabel || opts.showBoundaries ? 30 : 0) + (opts.showEquilibrium ? 18 : 0);
  const boxY0 = y + topMargin, boxY1 = y + h - bottomMargin;

  noStroke(); fill(255, 235, 235);
  rect(pX0 + 4, boxY0, halfW - 8, boxY1 - boxY0, 6);
  fill(230, 240, 255);
  rect(nX0 + 4, boxY0, halfW - 8, boxY1 - boxY0, 6);

  fill(190, 40, 40); textAlign(CENTER, TOP); textSize(compact() ? 10.5 : 12); textStyle(BOLD);
  text('p-type (N_A)', pX0 + halfW / 2, boxY0 + 4);
  fill(40, 40, 190);
  text('n-type (N_D)', nX0 + halfW / 2, boxY0 + 4);
  textStyle(NORMAL);

  if (opts.showJunction) {
    stroke(90, 62, 237); strokeWeight(2.5);
    drawingContext.setLineDash([4, 4]);
    line(midX, boxY0, midX, boxY1);
    drawingContext.setLineDash([]);
  }

  // ---- fixed ion grid: identical positions on every step ----
  const ionRowY = [boxY0 + (boxY1 - boxY0) * 0.32, boxY0 + (boxY1 - boxY0) * 0.5];
  const nIonsPerRow = compact() ? 4 : 6;
  const pIonXs = rowXs(pX0 + 10, halfW - 20, nIonsPerRow);
  const nIonXs = rowXs(nX0 + 10, halfW - 20, nIonsPerRow);
  const ionR = compact() ? 12 : 14;
  for (const ry of ionRowY) {
    for (const ix of pIonXs) drawAcceptorIon(ix, ry, ionR);
    for (const ix of nIonXs) drawDonorIon(ix, ry, ionR);
  }

  // ---- mobile carrier grid: same x positions as the ion grid, one
  // row below it, but a carrier is only drawn if its distance from the
  // junction exceeds the current depletion extent for that step. ----
  const carrierRowY = boxY0 + (boxY1 - boxY0) * 0.75;
  const carrierR = compact() ? 12 : 13;
  const depX = w / 2 * (opts.depletion || 0); // depleted half-width, in px, from the junction

  for (const ix of pIonXs) {
    const distFromJunction = pX1 - ix; // measured toward p-side from the junction plane at midX... approx using box edge
    const distFromRealJunction = midX - ix;
    if (!opts.separated && distFromRealJunction < depX) continue; // carrier absent: depleted
    smlDrawHole(ix, carrierRowY, carrierR);
  }
  for (const ix of nIonXs) {
    const distFromRealJunction = ix - midX;
    if (!opts.separated && distFromRealJunction < depX) continue;
    smlDrawElectron(ix, carrierRowY, carrierR);
  }

  // ---- diffusion arrows: a couple of carriers mid-crossing ----
  if (opts.showDiffusionArrows) {
    const ay1 = boxY0 + (boxY1 - boxY0) * 0.68;
    stroke(190, 40, 40); strokeWeight(2);
    line(midX - 46, ay1, midX + 6, ay1);
    noStroke(); fill(190, 40, 40);
    triangle(midX + 6, ay1 - 5, midX + 6, ay1 + 5, midX + 15, ay1);
    smlDrawHole(midX - 30, ay1, carrierR);

    const ay2 = boxY0 + (boxY1 - boxY0) * 0.88;
    stroke(40, 40, 190); strokeWeight(2);
    line(midX + 46, ay2, midX - 6, ay2);
    noStroke(); fill(40, 40, 190);
    triangle(midX - 6, ay2 - 5, midX - 6, ay2 + 5, midX - 15, ay2);
    smlDrawElectron(midX + 30, ay2, carrierR);
  }

  // ---- recombination marks: a hole and electron meeting and vanishing ----
  if (opts.showRecombination) {
    const ry1 = boxY0 + (boxY1 - boxY0) * 0.68;
    drawRecombinationBurst(midX - 12, ry1);
    const ry2 = boxY0 + (boxY1 - boxY0) * 0.88;
    drawRecombinationBurst(midX + 12, ry2);
  }

  // ---- depletion-region boundary lines + labels ----
  // Bottom annotations stack top-to-bottom using a running cursor,
  // rather than fixed offsets, so the boundary label and the
  // equilibrium caption never land on top of each other even when
  // both are shown together (as they are on the final step).
  let bottomCursor = boxY1 + 3;
  if (opts.showBoundaries) {
    const xpPx = midX - depX, xnPx = midX + depX;
    stroke(120); strokeWeight(1.3); drawingContext.setLineDash([2, 3]);
    line(xpPx, boxY0, xpPx, boxY1);
    line(xnPx, boxY0, xnPx, boxY1);
    drawingContext.setLineDash([]);
    noStroke(); fill(80); textAlign(CENTER, TOP); textSize(compact() ? 9.5 : 10.5);
    text('−x_p', xpPx, bottomCursor);
    text('x_n', xnPx, bottomCursor);
    bottomCursor += compact() ? 13 : 14;
    fill(90, 62, 237); textAlign(CENTER, TOP); textStyle(BOLD); textSize(compact() ? 10 : 11);
    text('Depletion Region', midX, bottomCursor);
    bottomCursor += compact() ? 15 : 16;
    textStyle(NORMAL);
  } else if (opts.showUncoveredLabel) {
    noStroke(); fill(90, 62, 237); textAlign(CENTER, TOP); textStyle(BOLD); textSize(compact() ? 10 : 11);
    text('Uncovered fixed charge — no mobile carrier left to balance it', x + 10, bottomCursor, w - 20);
    textStyle(NORMAL);
  }

  // ---- built-in field arrow (drawn in the reserved top margin, inside
  // the illustration box's own area -- never above it into the title) ----
  if (opts.showField) {
    const fy = y + topMargin - 14;
    stroke(230, 150, 30); strokeWeight(2.5);
    line(midX + depX - 4, fy, midX - depX + 4, fy);
    noStroke(); fill(230, 150, 30);
    triangle(midX - depX + 4, fy - 6, midX - depX + 4, fy + 6, midX - depX - 5, fy);
    fill(200, 120, 10); textAlign(CENTER, BOTTOM); textSize(compact() ? 10 : 11); textStyle(BOLD);
    text('Built-in field E (n → p)', midX, fy - 4);
    textStyle(NORMAL);
  }

  // ---- equilibrium caption ----
  if (opts.showEquilibrium) {
    noStroke(); fill(40); textAlign(CENTER, TOP); textSize(compact() ? 10.5 : 11.5);
    // x must be the wrap box's LEFT edge (not its center) once a width
    // is passed to text() -- see the identical fix for the step title.
    text('Drift current  =  Diffusion current   (everywhere — equilibrium)', x + 10, bottomCursor, w - 20);
  }

  if (opts.separated) {
    noStroke(); fill(90); textAlign(CENTER, BOTTOM); textSize(compact() ? 9.5 : 10.5);
    text('separate, individually neutral', midX, y + h - 4);
  }
}

function drawRecombinationBurst(x, y) {
  push();
  noFill(); stroke(150, 100, 20); strokeWeight(1.6);
  const r = 9;
  for (let a = 0; a < TWO_PI; a += PI / 4) {
    line(x + cos(a) * r * 0.5, y + sin(a) * r * 0.5, x + cos(a) * r, y + sin(a) * r);
  }
  pop();
}

function drawControls() {
  const cy = drawHeight + (controlHeight - prevBtn.h) / 2;
  prevBtn.x = 20; prevBtn.y = cy;
  nextBtn.x = canvasWidth - 20 - nextBtn.w; nextBtn.y = cy;

  smlDrawButton(prevBtn.x, prevBtn.y, prevBtn.w, prevBtn.h, '◀ Prev', false);
  smlDrawButton(nextBtn.x, nextBtn.y, nextBtn.w, nextBtn.h, 'Next ▶', false);

  noStroke(); fill(30); textAlign(CENTER, CENTER); textSize(13);
  text('Step ' + (currentStep + 1) + ' of ' + STEPS.length, canvasWidth / 2, cy + prevBtn.h / 2);

  const dotsY = cy + prevBtn.h + 12;
  const totalDotsW = STEPS.length * 16;
  const dotsX0 = canvasWidth / 2 - totalDotsW / 2 + 8;
  for (let i = 0; i < STEPS.length; i++) {
    noStroke();
    fill(i === currentStep ? color(90, 62, 237) : color(210));
    circle(dotsX0 + i * 16, dotsY, 8);
  }
}

function mousePressed() {
  if (smlPointInRect(mouseX, mouseY, prevBtn.x, prevBtn.y, prevBtn.w, prevBtn.h)) {
    currentStep = (currentStep - 1 + STEPS.length) % STEPS.length;
  } else if (smlPointInRect(mouseX, mouseY, nextBtn.x, nextBtn.y, nextBtn.w, nextBtn.h)) {
    currentStep = (currentStep + 1) % STEPS.length;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  minDrawHeight = compact() ? 520 : 440;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  drawHeight = Math.max(drawHeight, minDrawHeight);
}
