// P-N Junction Equilibrium Interactive Walkthrough MicroSim
// A step-by-step guided tour of Chapter 14's storyline: the metallurgical
// junction, the depletion region and depletion approximation, the built-in
// potential, Poisson's equation and depletion charge density, the junction
// electric field, the depletion width, and junction capacitance. Canvas-
// based Prev/Next buttons advance through a fixed sequence of small
// illustrations.
// Bloom Level: Remember / Understand (L1-L2)
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

const STEPS = [
  {
    title: '1. The Metallurgical Junction',
    text: 'Joining a p-type region (holes, NA) and an n-type region (electrons, ND) of the same crystal at a common interface creates a p-n junction; the plane where doping type switches is the metallurgical junction.',
    draw: drawStepMetallurgical
  },
  {
    title: '2. The Depletion Region',
    text: 'Carriers diffuse across the junction and recombine near the interface, sweeping mobile carriers out of a thin region on both sides and exposing fixed ionized dopant charge — the depletion region.',
    draw: drawStepDepletion
  },
  {
    title: '3. The Depletion Approximation',
    text: 'The depletion region is idealized as fully depleted with sharp edges at -xp and xn, and the semiconductor is treated as fully neutral everywhere outside those edges.',
    draw: drawStepApproximation
  },
  {
    title: '4. Built-In Potential',
    text: 'A single equilibrium Fermi level across the whole junction requires the bands to bend by qVbi, where Vbi = (kT/q)ln(NA·ND/ni²) — set entirely by doping and material, not device geometry.',
    draw: drawStepVbi
  },
  {
    title: '5. Poisson’s Equation & Depletion Charge Density',
    text: 'dE/dx = ρ(x)/ε. Inside the depletion approximation, ρ(x) is a step function: -qNA on the p-side, +qND on the n-side, with total charge on each side equal and opposite.',
    draw: drawStepPoisson
  },
  {
    title: '6. Junction Electric Field',
    text: 'Integrating Poisson’s equation gives a triangular field profile E(x), peaking at the metallurgical junction and vanishing at the depletion edges, pointing from n-side to p-side.',
    draw: drawStepField
  },
  {
    title: '7. Depletion Width',
    text: 'Charge neutrality NA·xp = ND·xn, combined with Vbi, fixes W = xn + xp. The more lightly doped side always gets the larger share of W.',
    draw: drawStepWidth
  },
  {
    title: '8. Junction Capacitance',
    text: 'The depletion region behaves like a parallel-plate capacitor: Cj = εA/W. Reverse bias widens W and lowers Cj — the link to Chapter 15 and to varactor diodes.',
    draw: drawStepCapacitance
  }
];

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);
  describe('P-N junction equilibrium interactive walkthrough: a step-by-step guided tour through the metallurgical junction, depletion region, depletion approximation, built-in potential, Poisson\'s equation, depletion charge density, junction electric field, depletion width, and junction capacitance', LABEL);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const step = STEPS[currentStep];

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text(step.title, canvasWidth / 2, 10, canvasWidth - 20);

  const illX = 20, illY = 42, illW = canvasWidth - 40, illH = drawHeight * 0.5;
  noStroke(); fill(255);
  stroke(210); strokeWeight(1);
  rect(illX, illY, illW, illH, 8);
  step.draw(illX, illY, illW, illH);

  const txtX = 20, txtY = illY + illH + 14, txtW = canvasWidth - 40, txtH = drawHeight - (txtY - 0) - 14;
  noStroke(); fill(255, 247, 221);
  stroke(240, 216, 122); strokeWeight(1);
  rect(txtX, txtY, txtW, txtH, 8);
  noStroke(); fill('#7a5c00');
  textAlign(LEFT, TOP); textSize(13);
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
  noStroke(); fill(190, 40, 40); textAlign(CENTER, TOP); textSize(12); textStyle(BOLD);
  text('p-type (NA)', x + 8 + (w / 2 - 8) / 2, y + 14);
  fill(40, 40, 190);
  text('n-type (ND)', midX + (w / 2 - 8) / 2, y + 14);
  fill(90, 62, 237); textAlign(CENTER, BOTTOM); textSize(11);
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
  noStroke(); fill(40); textAlign(CENTER, TOP); textSize(11.5);
  text('abrupt edges at −xp and xn; neutral outside, fully depleted inside', x + w / 2, y + h - 18);
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
  stroke(90, 62, 237); strokeWeight(2.5);
  bandCurve(ecY + bend, ecY);
  stroke(90, 180, 120);
  bandCurve(evY + bend, evY);

  noStroke(); fill(90, 62, 237); textAlign(LEFT, BOTTOM); textSize(10.5);
  text('EC', x1 + 4, ecY + 4);
  fill(90, 180, 120);
  text('EV', x1 + 4, evY + 4);

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
  text('xp', midX - xpPx / 2, barY - 6);
  text('xn', midX + xnPx / 2, barY - 6);
  fill(90); textAlign(CENTER, TOP); textSize(11);
  text('NA·xp = ND·xn      W = xp + xn', midX, barY + barH + 12);
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
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
}
