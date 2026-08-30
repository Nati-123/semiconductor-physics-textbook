// P-N Junction Equilibrium Interactive Walkthrough MicroSim
// A step-by-step guided tour of Chapter 14's storyline: the metallurgical
// junction, the depletion region and depletion approximation, the built-in
// potential, Poisson's equation and depletion charge density, the junction
// electric field, the depletion width, and junction capacitance -- ending
// with a responsive "Putting It All Together" concept-flow diagram (Step
// 9), matching the pattern used in Chapter 13's walkthrough.
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
    title: '1. The Metallurgical Junction',
    text: 'Joining a p-type region (holes, N_A) and an n-type region (electrons, N_D) of the same crystal at a common interface creates a p-n junction; the plane where doping type switches is the metallurgical junction.',
    draw: drawStepMetallurgical
  },
  {
    title: '2. The Depletion Region',
    text: 'Carriers diffuse across the junction and recombine near the interface, sweeping mobile carriers out of a thin region on both sides and exposing fixed ionized dopant charge — the depletion region.',
    draw: drawStepDepletion
  },
  {
    title: '3. The Depletion Approximation',
    text: 'The depletion region is idealized as fully depleted with sharp edges at −x_p and x_n, and the semiconductor is treated as fully neutral everywhere outside those edges.',
    draw: drawStepApproximation
  },
  {
    title: '4. Built-In Potential',
    text: 'A single equilibrium Fermi level across the whole junction requires the bands to bend by qV_bi, where V_bi = (kT/q)ln(N_A·N_D/n_i²) — set entirely by doping and material, not device geometry.',
    draw: drawStepVbi
  },
  {
    title: '5. Poisson’s Equation & Depletion Charge Density',
    text: 'dE/dx = ρ(x)/ε. Inside the depletion approximation, ρ(x) is a step function: −qN_A on the p-side, +qN_D on the n-side, with total charge on each side equal and opposite.',
    draw: drawStepPoisson
  },
  {
    title: '6. Junction Electric Field',
    text: 'Integrating Poisson’s equation gives a triangular field profile E(x), peaking at the metallurgical junction and vanishing at the depletion edges, pointing from n-side to p-side.',
    draw: drawStepField
  },
  {
    title: '7. Depletion Width',
    text: 'Charge neutrality N_A·x_p = N_D·x_n, combined with V_bi, fixes W = x_n + x_p. The more lightly doped side always gets the larger share of W.',
    draw: drawStepWidth
  },
  {
    title: '8. Junction Capacitance',
    text: 'The depletion region behaves like a parallel-plate capacitor: C_j = εA/W. Reverse bias widens W and lowers C_j — the link to Chapter 15 and to varactor diodes.',
    draw: drawStepCapacitance
  },
  {
    title: '9. Putting It All Together',
    text: 'This chain of eight ideas is the complete equilibrium picture Chapter 15 disturbs with an applied bias, turning static electrostatics into the dynamic story of diode current.',
    draw: drawStepSummary
  }
];

const FLOW_ITEMS = [
  { label: 'Metallurgical Junction', sub: 'p-type + n-type joined', icon: 'junction', color: [90, 62, 237] },
  { label: 'Depletion Region', sub: 'mobile carriers swept out', icon: 'depletion', color: [220, 60, 60] },
  { label: 'Depletion Approx.', sub: 'abrupt edges, ρ(x) step', icon: 'approx', color: [230, 90, 60] },
  { label: 'Built-In Potential', sub: 'qV_bi bends the bands', icon: 'vbi', color: [200, 120, 10] },
  { label: 'Poisson’s Eq.', sub: 'dE/dx = ρ(x)/ε', icon: 'poisson', color: [90, 62, 237] },
  { label: 'Electric Field E(x)', sub: 'triangular, peaks at x=0', icon: 'field', color: [40, 130, 60] },
  { label: 'Depletion Width W', sub: 'N_A x_p = N_D x_n', icon: 'width', color: [90, 62, 237] },
  { label: 'Junction Capacitance', sub: 'C_j = εA/W', icon: 'cap', color: [30, 60, 190] }
];

function compact() { return canvasWidth < 480; }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);
  describe('P-N junction equilibrium interactive walkthrough: a nine-step guided tour through the metallurgical junction, depletion region, depletion approximation, built-in potential, Poisson\'s equation, depletion charge density, junction electric field, depletion width, and junction capacitance, ending with a responsive concept-flow summary diagram', LABEL);
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
  textAlign(CENTER, TOP); textSize(compact() ? 14 : 16);
  // x must be the wrap box's LEFT edge (not its center) once a width
  // is passed to text() -- using canvasWidth/2 here previously made
  // the title start at the horizontal center and overflow off the
  // right edge of the canvas.
  text(step.title, 10, 10, canvasWidth - 20);

  const illX = 20, illY = 42;
  const illW = canvasWidth - 40;
  const illH = isSummary ? drawHeight * 0.76 : drawHeight * 0.5;
  noStroke(); fill(255);
  stroke(210); strokeWeight(1);
  rect(illX, illY, illW, illH, 8);
  step.draw(illX, illY, illW, illH);

  const txtX = 20, txtY = illY + illH + 14, txtW = canvasWidth - 40, txtH = drawHeight - (txtY - 0) - 14;
  noStroke(); fill(255, 247, 221);
  stroke(240, 216, 122); strokeWeight(1);
  rect(txtX, txtY, txtW, txtH, 8);
  noStroke(); fill('#7a5c00');
  textAlign(LEFT, TOP); textSize(compact() ? 11.5 : 13);
  text(step.text, txtX + 14, txtY + 10, txtW - 28, txtH - 18);

  drawControls();
}

function drawStepMetallurgical(x, y, w, h) {
  const midX = x + w / 2;
  noStroke(); fill(255, 235, 235);
  rect(x + 8, y + 8, w / 2 - 8, h - 16, 6);
  fill(230, 240, 255);
  rect(midX, y + 8, w / 2 - 8, h - 16, 6);
  stroke(90, 62, 237); strokeWeight(2.5);
  drawingContext.setLineDash([4, 4]);
  line(midX, y + 8, midX, y + h - 8);
  drawingContext.setLineDash([]);
  noStroke(); fill(190, 40, 40); textAlign(CENTER, TOP); textSize(compact() ? 11 : 12); textStyle(BOLD);
  text('p-type (N_A)', x + 8 + (w / 2 - 8) / 2, y + 14);
  fill(40, 40, 190);
  text('n-type (N_D)', midX + (w / 2 - 8) / 2, y + 14);
  fill(90, 62, 237); textAlign(CENTER, BOTTOM); textSize(compact() ? 10 : 11);
  text('metallurgical junction, x = 0', midX, y + h - 8);
  textStyle(NORMAL);
}

function drawStepDepletion(x, y, w, h) {
  const midX = x + w / 2, depW = 45;
  noStroke(); fill(255, 240, 240);
  rect(x + 8, y + 8, w / 2 - 8, h - 16, 6);
  fill(240, 244, 255);
  rect(midX, y + 8, w / 2 - 8, h - 16, 6);
  fill(255, 205, 205, 200);
  rect(midX - depW, y + 8, depW, h - 16);
  fill(205, 215, 255, 200);
  rect(midX, y + 8, depW, h - 16);
  noStroke(); fill(190, 30, 30); textAlign(CENTER, CENTER); textSize(13); textStyle(BOLD);
  text('−', midX - depW * 0.6, y + h * 0.35);
  text('−', midX - depW * 0.6, y + h * 0.65);
  fill(30, 60, 190);
  text('+', midX + depW * 0.6, y + h * 0.35);
  text('+', midX + depW * 0.6, y + h * 0.65);
  textStyle(NORMAL);
  fill(90, 62, 237); textAlign(CENTER, BOTTOM); textSize(11);
  text('depletion region', midX, y + h - 8);
}

function drawStepApproximation(x, y, w, h) {
  const chartX = x + 50, chartY = y + 20, chartW = w - 90, chartH = h - 50;
  const xp = 0.3, xn = 0.6;
  const pts = [{ x: -1, y: 0 }, { x: -xp, y: 0 }, { x: -xp, y: -1 }, { x: 0, y: -1 }, { x: 0, y: 1 }, { x: xn, y: 1 }, { x: xn, y: 0 }, { x: 1, y: 0 }];
  smlDrawLineChart(chartX, chartY, chartW, chartH, -1, 1, -1.2, 1.2, [{ points: pts, color: color(90, 62, 237) }], { xLabel: 'Position x', yLabel: 'ρ(x)/q', yLabelOffset: 34 });
  noStroke(); fill(40); textAlign(CENTER, TOP); textSize(compact() ? 10 : 11.5);
  text('abrupt edges at −x_p and x_n; neutral outside, fully depleted inside', x + w / 2, y + h - 18);
}

function drawStepVbi(x, y, w, h) {
  const x0 = x + 40, x1 = x + w - 40, midX = (x0 + x1) / 2;
  const ecY = y + 24, evY = y + h - 30;
  const bend = (h - 54) * 0.3;

  function bandCurve(yLeft, yRight) {
    beginShape(); noFill();
    vertex(x0, yLeft); vertex(midX - 20, yLeft);
    bezierVertex(midX - 6, yLeft, midX - 6, yRight, midX + 6, yRight);
    vertex(x1, yRight); endShape();
  }
  // Physics check: the built-in field points from n to p (n-side is at
  // higher electrostatic potential), so an electron's energy -qV(x) is
  // LOWER on the n-side -- bands must sit HIGHER on the p-side (left)
  // and LOWER on the n-side (right), sloping downward left-to-right.
  // (bandCurve(yLeft, yRight) draws from x0=p-side to x1=n-side.)
  // ecY (near the top) anchors the p-side (high-energy) EC value;
  // evY (near the bottom) anchors the n-side (low-energy) EV value --
  // both stay at their natural extremes, and "bend" pushes the
  // opposite side's value inward toward the middle, so nothing
  // overflows the illustration box.
  stroke(90, 62, 237); strokeWeight(2.5);
  bandCurve(ecY, ecY + bend);
  stroke(90, 180, 120);
  bandCurve(evY - bend, evY);

  noStroke(); fill(90, 62, 237); textAlign(LEFT, BOTTOM); textSize(10.5);
  text('E_C', x1 + 4, ecY + bend + 4);
  fill(90, 180, 120);
  text('E_V', x1 + 4, evY + 4);

  stroke(230, 150, 30); strokeWeight(1.5);
  line(midX, ecY + bend, midX, ecY);
  noStroke(); fill(200, 120, 10); textAlign(LEFT, CENTER); textSize(11); textStyle(BOLD);
  text('qV_bi', midX + 6, ecY + bend / 2);
  textStyle(NORMAL);
}

function drawStepPoisson(x, y, w, h) {
  const chartX = x + 50, chartY = y + 20, chartW = w - 90, chartH = h - 50;
  const xp = 0.35, xn = 0.55;
  const pts = [{ x: -1, y: 0 }, { x: -xp, y: 0 }, { x: -xp, y: -1 }, { x: 0, y: -1 }, { x: 0, y: 1 }, { x: xn, y: 1 }, { x: xn, y: 0 }, { x: 1, y: 0 }];
  smlDrawLineChart(chartX, chartY, chartW, chartH, -1, 1, -1.2, 1.2, [{ points: pts, color: color(230, 90, 60) }], { xLabel: 'Position x', yLabel: 'ρ(x)/q', yLabelOffset: 34 });
  noStroke(); fill(40); textAlign(CENTER, TOP); textSize(12);
  text('dE/dx = ρ(x)/ε', x + w / 2, y + h - 18);
}

function drawStepField(x, y, w, h) {
  const chartX = x + 50, chartY = y + 20, chartW = w - 90, chartH = h - 50;
  const xp = 0.35, xn = 0.55;
  const pts = [{ x: -xp, y: 0 }, { x: 0, y: -1 }, { x: xn, y: 0 }];
  smlDrawLineChart(chartX, chartY, chartW, chartH, -1, 1, -1.2, 0.2, [{ points: pts, color: color(90, 62, 237) }], { xLabel: 'Position x', yLabel: 'E(x)', yLabelOffset: 34 });
  noStroke(); fill(40); textAlign(CENTER, TOP); textSize(12);
  text('triangular field, peak at x = 0', x + w / 2, y + h - 18);
}

function drawStepWidth(x, y, w, h) {
  const midX = x + w / 2;
  const xpPx = w * 0.16, xnPx = w * 0.32;
  const barY = y + h / 2 - 12, barH = 24;
  noStroke(); fill(230, 90, 60);
  rect(midX - xpPx, barY, xpPx, barH);
  fill(90, 62, 237);
  rect(midX, barY, xnPx, barH);
  stroke(120); strokeWeight(1);
  drawingContext.setLineDash([2, 3]);
  line(midX - xpPx, y + 16, midX - xpPx, y + h - 16);
  line(midX, y + 16, midX, y + h - 16);
  line(midX + xnPx, y + 16, midX + xnPx, y + h - 16);
  drawingContext.setLineDash([]);
  noStroke(); fill(30); textAlign(CENTER, BOTTOM); textSize(11);
  text('x_p', midX - xpPx / 2, barY - 6);
  text('x_n', midX + xnPx / 2, barY - 6);
  fill(90); textAlign(CENTER, TOP); textSize(11);
  text('N_A·x_p = N_D·x_n      W = x_p + x_n', midX, barY + barH + 12);
}

function drawStepCapacitance(x, y, w, h) {
  const midX = x + w / 2, gap = 40;
  const plateY0 = y + 24, plateY1 = y + h - 24;
  stroke(190, 30, 30); strokeWeight(4);
  line(midX - gap / 2, plateY0, midX - gap / 2, plateY1);
  stroke(30, 60, 190);
  line(midX + gap / 2, plateY0, midX + gap / 2, plateY1);
  noStroke(); fill(90); textAlign(CENTER, BOTTOM); textSize(11);
  text('W', midX, plateY0 - 6);
  fill(30); textAlign(CENTER, TOP); textSize(12);
  text('C_j = εA / W', midX, plateY1 + 12);
}

// Responsive concept-flow diagram: as many columns as comfortably fit
// (4 on wide canvases, 2 on medium, 1 stacked on narrow/mobile), each
// box holding a small icon, a short label, and a one-line explanation,
// with arrows showing the reading order (including a down-arrow where
// the flow wraps from the end of one row to the start of the next).
// Mirrors the pattern validated in Chapter 13's walkthrough.
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

    noStroke(); fill(30); textAlign(CENTER, TOP); textStyle(BOLD);
    textSize(compactBox ? 10 : 11.5);
    // x must be the box's LEFT edge (not its center) once a width is
    // passed to text() -- see the identical note in Chapter 13.
    text(item.label, bx + 5, by + boxH * (compactBox ? 0.46 : 0.5), boxW - 10);
    textStyle(NORMAL);
    fill(95); textSize(compactBox ? 8.5 : 10);
    text(item.sub, bx + 5, by + boxH * (compactBox ? 0.68 : 0.72), boxW - 10);

    if (i < n - 1) {
      const nextRow = Math.floor((i + 1) / cols);
      if (nextRow === row) {
        drawFlowArrow(bx + boxW + 2, by + boxH / 2, gapX - 4, 0);
      } else {
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

// Small, self-contained icon for each pipeline stage.
function drawFlowIcon(kind, cx, cy, r, col) {
  push();
  translate(cx, cy);
  stroke(col[0], col[1], col[2]); strokeWeight(1.8);
  noFill();
  if (kind === 'junction') {
    fill(255, 220, 220); noStroke(); rect(-r, -r * 0.6, r, r * 1.2);
    fill(220, 225, 255); rect(0, -r * 0.6, r, r * 1.2);
    stroke(col[0], col[1], col[2]); strokeWeight(1.6); drawingContext.setLineDash([2, 2]);
    line(0, -r * 0.6, 0, r * 0.6);
    drawingContext.setLineDash([]);
  } else if (kind === 'depletion') {
    noStroke(); fill(255, 210, 210); rect(-r * 0.9, -r * 0.6, r * 0.7, r * 1.2);
    fill(210, 220, 255); rect(0.2 * r, -r * 0.6, r * 0.7, r * 1.2);
    fill(col[0], col[1], col[2]); textAlign(CENTER, CENTER); textSize(r * 0.7); textStyle(BOLD);
    text('−', -r * 0.5, 0); text('+', r * 0.5, 0);
    textStyle(NORMAL);
  } else if (kind === 'approx') {
    beginShape();
    vertex(-r, 0); vertex(-r * 0.3, 0); vertex(-r * 0.3, -r * 0.6); vertex(r * 0.3, -r * 0.6);
    vertex(r * 0.3, r * 0.6); vertex(r, r * 0.6);
    endShape();
  } else if (kind === 'vbi') {
    line(-r, -r * 0.4, -r * 0.1, -r * 0.4);
    line(r * 0.1, r * 0.4, r, r * 0.4);
    stroke(200, 120, 10); strokeWeight(1.3); drawingContext.setLineDash([2, 2]);
    line(0, -r * 0.4, 0, r * 0.4);
    drawingContext.setLineDash([]);
  } else if (kind === 'poisson') {
    noStroke(); fill(col[0], col[1], col[2]); rect(-r, -r * 0.3, r * 0.6, r * 0.6);
    stroke(col[0], col[1], col[2]); strokeWeight(1.6);
    line(-r * 0.3, 0, r * 0.5, 0);
    noStroke(); triangle(r * 0.5, 0, r * 0.3, -r * 0.25, r * 0.3, r * 0.25);
  } else if (kind === 'field') {
    beginShape();
    vertex(-r, 0); vertex(0, -r * 0.8); vertex(r, 0);
    endShape();
  } else if (kind === 'width') {
    line(-r, 0, r, 0);
    noStroke(); fill(col[0], col[1], col[2]);
    triangle(-r, 0, -r + 6, -4, -r + 6, 4);
    triangle(r, 0, r - 6, -4, r - 6, 4);
  } else if (kind === 'cap') {
    line(-r * 0.35, -r * 0.7, -r * 0.35, r * 0.7);
    line(r * 0.35, -r * 0.7, r * 0.35, r * 0.7);
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
  if (currentStep !== prevStep) {
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
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
