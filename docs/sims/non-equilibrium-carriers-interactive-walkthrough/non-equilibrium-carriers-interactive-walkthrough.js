// Non-Equilibrium Carriers Interactive Walkthrough MicroSim
// A step-by-step guided tour of Chapter 13's storyline: equilibrium vs.
// non-equilibrium, generation, the four recombination mechanisms,
// lifetime/recombination rate, injection level, the continuity equation
// and diffusion length, and quasi-Fermi levels. Canvas-based Prev/Next
// buttons advance through a fixed sequence of small illustrations.
// Bloom Level: Remember / Understand (L1-L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 134;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let currentStep = 0;
let prevBtn = { x: 0, y: 0, w: 90, h: 36 };
let nextBtn = { x: 0, y: 0, w: 90, h: 36 };
let restartBtn = { x: 0, y: 0, w: 120, h: 32 };

const STEPS = [
  {
    title: '1. From Equilibrium to Non-Equilibrium',
    text: 'At equilibrium, n0 and p0 are set by doping. Shine light or apply bias, and concentrations rise above these values by Δn — this excess is what the rest of the chapter is about.',
    draw: drawStepEquilibrium
  },
  {
    title: '2. Carrier Generation',
    text: 'A photon (or thermal energy) can break a bond, promoting an electron to the conduction band and leaving a hole behind. Optical and thermal generation both create excess electron-hole pairs in equal numbers.',
    draw: drawStepGeneration
  },
  {
    title: '3. Four Recombination Mechanisms',
    text: 'Direct recombination is fast in direct-gap materials. Indirect recombination needs a phonon assist. Trap-assisted (SRH) recombination dominates in silicon. Auger recombination (∝Δn³) only matters at very high injection.',
    draw: drawStepMechanisms
  },
  {
    title: '4. Minority Carrier Lifetime & Recombination Rate',
    text: 'Once generation stops, excess carriers decay exponentially with time constant τ: Δn(t)=Δn(0)e^(-t/τ). The instantaneous recombination rate is simply R=Δn/τ.',
    draw: drawStepLifetime
  },
  {
    title: '5. Low-Level vs. High-Level Injection',
    text: 'When Δn≪N (doping), only the minority carrier population is significantly perturbed — low-level injection. When Δn is comparable to or exceeds N, both populations are perturbed — high-level injection.',
    draw: drawStepInjection
  },
  {
    title: '6. Continuity Equation & Diffusion Length',
    text: 'The continuity equation tracks Δn in space and time. Its steady-state solution for carriers injected at a boundary is a decaying exponential, Δp(x)=Δp(0)e^(-x/Lp), with diffusion length Lp=√(Dpτp).',
    draw: drawStepDiffusionLength
  },
  {
    title: '7. Quasi-Fermi Levels',
    text: 'A single Fermi level can no longer describe both carrier types once np≠ni². Separate quasi-Fermi levels EFn and EFp describe electrons and holes independently, splitting apart as injection increases.',
    draw: drawStepQuasiFermi
  },
  {
    title: '8. Putting It All Together',
    text: 'This chain of eight stages is the foundation for Chapter 15\'s injected-carrier analysis of the p-n junction under bias.',
    draw: drawStepSummary
  }
];

const FLOW_ITEMS = [
  { label: 'Generation', sub: 'creates e⁻/h⁺ pairs', icon: 'generation', color: [230, 150, 30] },
  { label: 'Excess Carriers', sub: 'Δn, Δp above n0, p0', icon: 'excess', color: [90, 62, 237] },
  { label: 'Recombination', sub: '4 mechanisms remove them', icon: 'recombination', color: [220, 60, 60] },
  { label: 'Lifetime τ', sub: 'decay rate R = Δn/τ', icon: 'lifetime', color: [230, 90, 60] },
  { label: 'Injection Level', sub: 'Δn vs. doping N', icon: 'injection', color: [40, 130, 60] },
  { label: 'Continuity Eq.', sub: 'tracks Δn in space & time', icon: 'continuity', color: [60, 140, 220] },
  { label: 'Diffusion Length L', sub: 'L = √(Dτ)', icon: 'diffusion', color: [90, 62, 237] },
  { label: 'Quasi-Fermi Levels', sub: 'E_Fn, E_Fp split apart', icon: 'quasifermi', color: [220, 60, 60] }
];

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);
  describe('Non-equilibrium carriers interactive walkthrough: a step-by-step guided tour through excess carriers, generation, recombination mechanisms, lifetime, injection level, the continuity equation, diffusion length, and quasi-Fermi levels', LABEL);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const step = STEPS[currentStep];
  const isSummary = currentStep === STEPS.length - 1;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 15 : 17);
  text(step.title, canvasWidth / 2, 10);

  // illustration area (the Step 8 concept-flow diagram needs much more
  // room than the other steps' single small graphic, so it gets a
  // taller share of the draw area and a shorter caption below it).
  const illX = 20, illY = 46, illW = canvasWidth - 40;
  const illH = isSummary ? drawHeight * 0.78 : drawHeight * 0.52;
  noStroke(); fill(255);
  stroke(210); strokeWeight(1);
  rect(illX, illY, illW, illH, 8);
  step.draw(illX, illY, illW, illH);

  // explanation text box
  const txtX = 20, txtY = illY + illH + 14, txtW = canvasWidth - 40, txtH = drawHeight - (txtY - 0) - 14;
  noStroke(); fill(255, 247, 221);
  stroke(240, 216, 122); strokeWeight(1);
  rect(txtX, txtY, txtW, txtH, 8);
  noStroke(); fill('#7a5c00');
  textAlign(LEFT, TOP); textSize(13.5);
  text(step.text, txtX + 14, txtY + 12, txtW - 28, txtH - 20);

  drawControls();
}

function drawStepEquilibrium(x, y, w, h) {
  const midX = x + w / 2;
  noStroke(); fill(230, 240, 255);
  rect(x + 10, y + 10, w / 2 - 25, h - 20, 6);
  fill(255, 235, 235);
  rect(midX + 15, y + 10, w / 2 - 25, h - 20, 6);
  fill(50); textAlign(CENTER, TOP); textSize(12);
  text('Equilibrium (n0, p0)', x + 10 + (w / 2 - 25) / 2, y + 14);
  text('Non-Equilibrium (n0+Δn, p0+Δn)', midX + 15 + (w / 2 - 25) / 2, y + 14);

  const seedL = [[0.25, 0.4], [0.55, 0.6], [0.75, 0.35], [0.4, 0.75]];
  for (let i = 0; i < seedL.length; i++) {
    smlDrawElectron(x + 10 + seedL[i][0] * (w / 2 - 25), y + 34 + seedL[i][1] * (h - 44), 11);
  }
  const seedR = [[0.2, 0.35], [0.4, 0.55], [0.6, 0.3], [0.75, 0.6], [0.3, 0.75], [0.55, 0.8], [0.8, 0.4]];
  for (let i = 0; i < seedR.length; i++) {
    smlDrawElectron(midX + 15 + seedR[i][0] * (w / 2 - 25), y + 34 + seedR[i][1] * (h - 44), 11);
  }
  noStroke(); fill(200, 30, 30); textAlign(CENTER, BOTTOM); textSize(13); textStyle(BOLD);
  text('+Δn', midX + 15 + (w / 2 - 25) / 2, y + h - 6);
  textStyle(NORMAL);
}

function drawStepGeneration(x, y, w, h) {
  const cx = x + w * 0.32, cy = y + h / 2;
  smlDrawLatticeGrid(cx - 45, cy - 45, 3, 3, 45, { atomLabel: 'Si', atomColor: color(150, 180, 230), atomR: 12 });

  stroke(230, 170, 30); strokeWeight(2.5);
  line(x + 20, y + 16, cx - 40, cy - 40);
  noStroke(); fill(230, 170, 30);
  triangle(cx - 40, cy - 40, cx - 48, cy - 34, cx - 40, cy - 28);
  fill(200, 140, 20); textAlign(LEFT, TOP); textSize(12);
  text('photon (hν ≥ Eg)', x + 16, y + 4);

  const arrowX = x + w * 0.62;
  stroke(120); strokeWeight(2);
  line(cx + 50, cy, arrowX - 15, cy);
  noStroke(); fill(120);
  triangle(arrowX - 15, cy - 6, arrowX - 15, cy + 6, arrowX - 5, cy);

  smlDrawElectron(arrowX + 40, cy - 30, 13);
  smlDrawHole(arrowX + 40, cy + 30, 13);
  noStroke(); fill(40, 40, 220); textAlign(LEFT, CENTER); textSize(11);
  text('e⁻ generated', arrowX + 58, cy - 30);
  fill(220, 60, 60);
  text('h⁺ generated', arrowX + 58, cy + 30);
}

function drawStepMechanisms(x, y, w, h) {
  const cols = 4;
  const cellW = w / cols, cellH = h;
  const labels = ['Direct', 'Indirect', 'Trap-Assisted\n(SRH)', 'Auger'];
  const cols_colors = [color(90, 62, 237), color(60, 140, 220), color(230, 150, 50), color(230, 90, 60)];
  for (let i = 0; i < cols; i++) {
    const cx = x + i * cellW + cellW / 2, cy = y + h * 0.38;
    noStroke(); fill(cols_colors[i]);
    if (i === 0) {
      smlDrawElectron(cx, cy - 18, 11);
      smlDrawHole(cx, cy + 18, 11);
      stroke(cols_colors[i]); strokeWeight(2);
      line(cx, cy - 9, cx, cy + 9);
    } else if (i === 1) {
      smlDrawElectron(cx - 12, cy - 18, 11);
      smlDrawHole(cx + 12, cy + 18, 11);
      stroke(cols_colors[i]); strokeWeight(2);
      drawingContext.setLineDash([2, 3]);
      line(cx - 12, cy - 9, cx + 12, cy + 9);
      drawingContext.setLineDash([]);
      noStroke(); fill(90); textAlign(CENTER, TOP); textSize(9);
      text('+phonon', cx, cy + 30);
    } else if (i === 2) {
      noStroke(); fill(230, 150, 50);
      circle(cx, cy, 10);
      smlDrawElectron(cx, cy - 22, 10);
      smlDrawHole(cx, cy + 22, 10);
      stroke(230, 150, 50); strokeWeight(1.5);
      line(cx, cy - 5, cx, cy - 15);
      line(cx, cy + 5, cx, cy + 15);
    } else {
      smlDrawElectron(cx - 14, cy - 16, 10);
      smlDrawHole(cx + 14, cy - 16, 10);
      smlDrawElectron(cx, cy + 18, 10);
      stroke(230, 90, 60); strokeWeight(1.5);
      line(cx - 14, cy - 10, cx, cy + 12);
      line(cx + 14, cy - 10, cx, cy + 12);
      noStroke(); fill(90); textAlign(CENTER, TOP); textSize(9);
      text('3rd carrier excited', cx, cy + 30);
    }
    fill(30); textAlign(CENTER, TOP); textSize(11.5); textStyle(BOLD);
    // x must be the cell's LEFT edge (not its center) once a wrap width
    // is passed to text() — see the identical fix in drawStepSummary.
    text(labels[i], x + i * cellW + 4, y + h - 34, cellW - 8);
    textStyle(NORMAL);
    if (i > 0) { stroke(220); strokeWeight(1); line(x + i * cellW, y + 8, x + i * cellW, y + h - 8); }
  }
}

function drawStepLifetime(x, y, w, h) {
  const chartX = x + 50, chartY = y + 16, chartW = w - 90, chartH = h - 56;
  const pts = [];
  for (let t = 0; t <= 5; t += 0.1) pts.push({ x: t, y: Math.exp(-t) });
  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 5, 0, 1.05, [
    { points: pts, color: color(230, 90, 60) }
  ], { xLabel: 'Time (units of τ)', yLabel: 'Δn/Δn(0)', yLabelOffset: 34 });
  noStroke(); fill(40); textAlign(CENTER, TOP); textSize(12);
  text('Δn(t) = Δn(0)·e^(−t/τ)      R = Δn/τ', x + w / 2, y + h - 20);
}

function drawStepInjection(x, y, w, h) {
  // On narrow canvases there isn't room to the right of a nearly-full-
  // width bar for the "low-level"/"high-level" annotation, so it moves
  // below the bar instead of overflowing past the illustration box.
  const narrow = w < 480;
  const barX = x + (narrow ? 12 : 90), barW = w - (narrow ? 24 : 130);
  const rowH = narrow ? h * 0.30 : h * 0.26;
  const y1 = y + h * 0.14, y2 = y1 + rowH, barH = 24;
  noStroke(); fill(60, 60, 200);
  rect(barX, y1, barW * 0.85, barH, 4);
  fill(230, 90, 60);
  rect(barX, y2, barW * 0.08, barH, 4);
  fill(30); textSize(11.5);
  if (narrow) {
    textAlign(LEFT, BOTTOM);
    text('Doping N', barX, y1 - 4);
    text('Δn (low)', barX, y2 - 4);
  } else {
    textAlign(RIGHT, CENTER);
    text('Doping N', barX - 8, y1 + barH / 2);
    text('Δn (low)', barX - 8, y2 + barH / 2);
  }

  const y3 = y2 + rowH;
  fill(230, 90, 60);
  rect(barX, y3, barW * 0.9, barH, 4);
  fill(30);
  if (narrow) { textAlign(LEFT, BOTTOM); text('Δn (high)', barX, y3 - 4); }
  else { textAlign(RIGHT, CENTER); text('Δn (high)', barX - 8, y3 + barH / 2); }

  textSize(11);
  if (narrow) {
    fill(40, 130, 60); textAlign(LEFT, TOP);
    text('low-level: Δn ≪ N', barX, y2 + barH + 3);
    fill(190, 40, 40);
    text('high-level: Δn ≳ N', barX, y3 + barH + 3);
  } else {
    fill(40, 130, 60); textAlign(LEFT, CENTER);
    text('low-level: Δn ≪ N', barX + barW * 0.08 + 6, y2 + barH / 2);
    fill(190, 40, 40);
    text('high-level: Δn ≳ N', barX + barW * 0.9 + 6, y3 + barH / 2);
  }
}

function drawStepDiffusionLength(x, y, w, h) {
  const chartX = x + 55, chartY = y + 16, chartW = w - 90, chartH = h - 50;
  const pts = [];
  for (let xv = 0; xv <= 5; xv += 0.1) pts.push({ x: xv, y: Math.exp(-xv) });
  const info = smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 5, 0, 1.05, [
    { points: pts, color: color(90, 62, 237) }
  ], { xLabel: 'Position x / Lp', yLabel: 'Δp/Δp(0)', yLabelOffset: 34 });
  const xLp = info.xToPx(1);
  stroke(230, 90, 60); strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(xLp, chartY, xLp, chartY + chartH);
  drawingContext.setLineDash([]);
  noStroke(); fill(230, 90, 60); textAlign(LEFT, BOTTOM); textSize(11);
  text('x = Lp (37% point)', xLp + 4, chartY + 14);
  fill(40); textAlign(CENTER, TOP); textSize(12);
  text('Δp(x) = Δp(0)·e^(−x/Lp),   Lp = √(Dp·τp)', x + w / 2, y + h - 18);
}

function drawStepQuasiFermi(x, y, w, h) {
  // The equation caption needs two lines on narrow canvases (one line
  // there was wide enough to overflow past both edges of the box), so
  // reserve extra bottom margin for it and pull the band diagram up.
  const narrow = w < 480;
  const capH = narrow ? 42 : 22;
  const diagX0 = x + 50, diagX1 = x + w - 100;
  const ecY = y + 24, evY = y + h - capH - 10;
  stroke(90, 62, 237); strokeWeight(2.5);
  line(diagX0, ecY, diagX1, ecY);
  stroke(90, 180, 120);
  line(diagX0, evY, diagX1, evY);
  noStroke(); fill(90, 62, 237); textAlign(LEFT, BOTTOM); textSize(12);
  text('EC', diagX1 + 6, ecY + 4);
  fill(90, 180, 120);
  text('EV', diagX1 + 6, evY + 4);

  const midY = (ecY + evY) / 2;
  stroke(140); strokeWeight(1.5);
  drawingContext.setLineDash([2, 4]);
  line(diagX0, midY, diagX1, midY);
  drawingContext.setLineDash([]);
  noStroke(); fill(100); textAlign(LEFT, BOTTOM); textSize(11);
  text('Ei', diagX1 + 6, midY + 4);

  const efnY = midY - (midY - ecY) * 0.45;
  const efpY = midY + (evY - midY) * 0.45;
  stroke(40, 40, 220); strokeWeight(2.5);
  line(diagX0, efnY, diagX1, efnY);
  noStroke(); fill(40, 40, 220); textAlign(LEFT, BOTTOM); textSize(11);
  text('EFn', diagX1 + 6, efnY + 4);
  stroke(220, 60, 60); strokeWeight(2.5);
  line(diagX0, efpY, diagX1, efpY);
  noStroke(); fill(220, 60, 60); textAlign(LEFT, TOP); textSize(11);
  text('EFp', diagX1 + 6, efpY - 12);

  fill(40); textAlign(CENTER, TOP);
  if (narrow) {
    textSize(10.5);
    text('n = ni·e^((EFn−Ei)/kT)', x + w / 2, y + h - capH + 2);
    text('p = ni·e^((Ei−EFp)/kT)', x + w / 2, y + h - capH + 18);
  } else {
    textSize(12);
    text('n = ni·e^((EFn−Ei)/kT)      p = ni·e^((Ei−EFp)/kT)', x + w / 2, y + h - capH + 4);
  }
}

// Responsive concept-flow diagram: as many columns as comfortably fit
// (4 on wide canvases, 2 on medium, 1 stacked on narrow/mobile), each
// box holding a small icon, a short label, and a one-line explanation,
// with arrows showing the reading order (including a down-arrow where
// the flow wraps from the end of one row to the start of the next).
function drawStepSummary(x, y, w, h) {
  const n = FLOW_ITEMS.length;
  let cols;
  if (w >= 760) cols = 4;
  else if (w >= 360) cols = 2;
  else cols = 1;
  const rows = Math.ceil(n / cols);
  const gapX = 14, gapY = cols === 1 ? 8 : 22;
  const boxW = (w - gapX * (cols - 1)) / cols;
  const boxH = (h - gapY * (rows - 1)) / rows;
  const compactBox = boxH < 80 || boxW < 140;

  for (let i = 0; i < n; i++) {
    const item = FLOW_ITEMS[i];
    const col = i % cols, row = Math.floor(i / cols);
    const bx = x + col * (boxW + gapX);
    const by = y + row * (boxH + gapY);

    noStroke(); fill(255);
    stroke(item.color[0], item.color[1], item.color[2]); strokeWeight(1.4);
    rect(bx, by, boxW, boxH, 6);

    const iconR = Math.min(boxW, boxH) * (compactBox ? 0.15 : 0.16);
    const iconCy = by + boxH * (compactBox ? 0.24 : 0.26);
    drawFlowIcon(item.icon, bx + boxW / 2, iconCy, iconR, item.color);

    // Note: once a width is passed to text(), x is the LEFT edge of the
    // wrap box (not the center) even under textAlign(CENTER, ...), so
    // the box must start at bx+5, not bx+boxW/2 — using the center here
    // previously made every label wrap starting mid-box and overflow
    // past the right edge.
    noStroke(); fill(30); textAlign(CENTER, TOP); textStyle(BOLD);
    textSize(compactBox ? 10.5 : 12);
    text(item.label, bx + 5, by + boxH * (compactBox ? 0.46 : 0.5), boxW - 10);
    textStyle(NORMAL);
    fill(95); textSize(compactBox ? 9 : 10.5);
    text(item.sub, bx + 5, by + boxH * (compactBox ? 0.68 : 0.72), boxW - 10);

    if (i < n - 1) {
      const nextRow = Math.floor((i + 1) / cols);
      if (nextRow === row) {
        drawFlowArrow(bx + boxW + 2, by + boxH / 2, gapX - 4, 0);
      } else {
        // Row wraps: small down-arrow centered under this (last-in-row) box.
        drawFlowArrow(bx + boxW / 2, by + boxH + 2, 0, gapY - 4);
      }
    }
  }
}

function drawFlowArrow(x0, y0, dx, dy) {
  stroke(140); strokeWeight(1.6);
  const x1 = x0 + dx, y1 = y0 + dy;
  line(x0, y0, x1, y1);
  noStroke(); fill(140);
  push();
  translate(x1, y1);
  rotate(Math.atan2(dy, dx));
  triangle(0, 0, -6, -4, -6, 4);
  pop();
}

// Small, self-contained icon for each pipeline stage. Kept deliberately
// simple (a handful of primitives) so it reads clearly even at the
// small sizes used in a 4-column desktop layout.
function drawFlowIcon(kind, cx, cy, r, col) {
  push();
  translate(cx, cy);
  stroke(col[0], col[1], col[2]); strokeWeight(1.8);
  noFill();
  if (kind === 'generation') {
    line(-r * 1.4, -r * 1.4, -r * 0.2, -r * 0.2);
    noStroke(); fill(col[0], col[1], col[2]);
    triangle(-r * 0.2, -r * 0.2, -r * 0.7, r * 0.05, -r * 0.05, -r * 0.7);
    fill(40, 40, 220); circle(r * 0.3, -r * 0.3, r * 0.7);
    fill(220, 60, 60); circle(r * 0.3, r * 0.5, r * 0.7);
  } else if (kind === 'excess') {
    fill(40, 40, 220); noStroke(); circle(-r * 0.35, 0, r * 0.75);
    fill(220, 60, 60); circle(r * 0.35, 0, r * 0.75);
    fill(col[0], col[1], col[2]); textAlign(CENTER, BOTTOM); textSize(r * 0.9); textStyle(BOLD);
    text('+Δ', 0, -r * 0.5);
    textStyle(NORMAL);
  } else if (kind === 'recombination') {
    noStroke(); fill(40, 40, 220); circle(-r * 0.8, -r * 0.5, r * 0.6);
    fill(220, 60, 60); circle(r * 0.8, -r * 0.5, r * 0.6);
    stroke(col[0], col[1], col[2]); strokeWeight(1.6);
    line(-r * 0.8, -r * 0.5, 0, r * 0.5);
    line(r * 0.8, -r * 0.5, 0, r * 0.5);
    noStroke(); fill(col[0], col[1], col[2]);
    circle(0, r * 0.5, r * 0.5);
  } else if (kind === 'lifetime') {
    beginShape();
    for (let t = -r; t <= r; t += r / 6) vertex(t, -Math.exp(-(t + r) / (r * 0.9)) * r * 1.1 + r * 0.5);
    endShape();
  } else if (kind === 'injection') {
    noStroke(); fill(40, 130, 60);
    rect(-r, -r * 0.55, r * 1.1, r * 0.4, 2);
    fill(190, 40, 40);
    rect(-r, r * 0.15, r * 1.8, r * 0.4, 2);
  } else if (kind === 'continuity') {
    noStroke(); fill(col[0], col[1], col[2]); circle(0, 0, r * 0.4);
    stroke(col[0], col[1], col[2]); strokeWeight(1.6);
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const d of dirs) {
      line(0, 0, d[0] * r * 0.9, d[1] * r * 0.9);
      push(); translate(d[0] * r * 0.9, d[1] * r * 0.9); rotate(Math.atan2(d[1], d[0]));
      noStroke(); fill(col[0], col[1], col[2]); triangle(0, 0, -5, -3, -5, 3); pop();
    }
  } else if (kind === 'diffusion') {
    beginShape();
    for (let t = -r; t <= r; t += r / 6) vertex(t, -Math.exp(-(t + r) / (r * 1.0)) * r * 1.1 + r * 0.5);
    endShape();
    stroke(150); strokeWeight(1); drawingContext.setLineDash([2, 2]);
    line(0, -r * 0.6, 0, r * 0.6);
    drawingContext.setLineDash([]);
  } else if (kind === 'quasifermi') {
    stroke(40, 40, 220); strokeWeight(2);
    line(-r, -r * 0.4, r, -r * 0.4);
    stroke(220, 60, 60);
    line(-r, r * 0.4, r, r * 0.4);
  }
  pop();
}

function drawControls() {
  const isLast = currentStep === STEPS.length - 1;
  const cy = drawHeight + 16;
  prevBtn.x = 20; prevBtn.y = cy;
  nextBtn.x = canvasWidth - 20 - nextBtn.w; nextBtn.y = cy;

  smlDrawButton(prevBtn.x, prevBtn.y, prevBtn.w, prevBtn.h, '◀ Prev', false);
  if (isLast) {
    // Next is disabled on the final step: drawn greyed-out and inert
    // (mousePressed below skips it), since there is nowhere to advance.
    push();
    stroke(200); strokeWeight(1.5); fill(238);
    rect(nextBtn.x, nextBtn.y, nextBtn.w, nextBtn.h, 6);
    noStroke(); fill(170); textAlign(CENTER, CENTER); textSize(13);
    text('Next ▶', nextBtn.x + nextBtn.w / 2, nextBtn.y + nextBtn.h / 2);
    pop();
  } else {
    smlDrawButton(nextBtn.x, nextBtn.y, nextBtn.w, nextBtn.h, 'Next ▶', false);
  }

  noStroke(); fill(30); textAlign(CENTER, CENTER); textSize(13);
  text('Step ' + (currentStep + 1) + ' of ' + STEPS.length, canvasWidth / 2, cy + prevBtn.h / 2);

  const restartY = cy + prevBtn.h + 14;
  restartBtn.x = canvasWidth / 2 - restartBtn.w / 2; restartBtn.y = restartY;
  // Restart is prominently highlighted (filled) on the final step, since
  // it's the natural next action once the tour is complete.
  smlDrawButton(restartBtn.x, restartBtn.y, restartBtn.w, restartBtn.h, '⟲ Restart', isLast);

  const dotsY = restartY + restartBtn.h + 16;
  const totalDotsW = STEPS.length * 16;
  const dotsX0 = canvasWidth / 2 - totalDotsW / 2 + 8;
  for (let i = 0; i < STEPS.length; i++) {
    noStroke();
    fill(i === currentStep ? color(90, 62, 237) : color(210));
    circle(dotsX0 + i * 16, dotsY, 8);
  }
}

function mousePressed() {
  const isLast = currentStep === STEPS.length - 1;
  const prevStep = currentStep;
  if (smlPointInRect(mouseX, mouseY, prevBtn.x, prevBtn.y, prevBtn.w, prevBtn.h)) {
    currentStep = (currentStep - 1 + STEPS.length) % STEPS.length;
  } else if (!isLast && smlPointInRect(mouseX, mouseY, nextBtn.x, nextBtn.y, nextBtn.w, nextBtn.h)) {
    currentStep = (currentStep + 1) % STEPS.length;
  } else if (smlPointInRect(mouseX, mouseY, restartBtn.x, restartBtn.y, restartBtn.w, restartBtn.h)) {
    currentStep = 0;
  }
  // Step 8's concept-flow diagram needs a different canvas height than
  // the other steps (see updateCanvasSize), so any step change that
  // enters or leaves it must actually resize the canvas, not just
  // recompute the drawHeight variable.
  if (currentStep !== prevStep) {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function compact() { return canvasWidth < 480; }

function updateCanvasSize() {
  // Step 8's concept-flow diagram needs more vertical room as it drops
  // from 4 columns to 2 to 1 (using canvasWidth from the previous frame
  // as a stable proxy for the upcoming layout, same pattern used to
  // decide column count in drawStepSummary).
  const isSummary = currentStep === STEPS.length - 1;
  if (isSummary) {
    const illWGuess = canvasWidth - 40;
    minDrawHeight = illWGuess < 360 ? 800 : (illWGuess < 760 ? 560 : 440);
  } else {
    minDrawHeight = 440;
  }
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  drawHeight = Math.max(drawHeight, minDrawHeight);
}
