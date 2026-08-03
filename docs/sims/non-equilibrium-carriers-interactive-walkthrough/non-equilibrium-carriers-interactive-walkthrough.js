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
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let currentStep = 0;
let prevBtn = { x: 0, y: 0, w: 90, h: 36 };
let nextBtn = { x: 0, y: 0, w: 90, h: 36 };

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
    text: 'Generation creates excess carriers → recombination (via 4 mechanisms) removes them at rate R=Δn/τ → the size of Δn relative to doping classifies the injection level → the continuity equation tracks Δn in space, yielding diffusion length → quasi-Fermi levels describe the disturbed statistics. This full chain is the foundation for the p-n junction in Chapter 14.',
    draw: drawStepSummary
  }
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

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(17);
  text(step.title, canvasWidth / 2, 10);

  // illustration area
  const illX = 20, illY = 46, illW = canvasWidth - 40, illH = drawHeight * 0.52;
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
    text(labels[i], cx, y + h - 34, cellW - 8);
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
  const barX = x + 90, barW = w - 130;
  const y1 = y + h * 0.22, y2 = y + h * 0.55, barH = 26;
  noStroke(); fill(60, 60, 200);
  rect(barX, y1, barW * 0.85, barH, 4);
  fill(230, 90, 60);
  rect(barX, y2, barW * 0.08, barH, 4);
  fill(30); textAlign(RIGHT, CENTER); textSize(11.5);
  text('Doping N', barX - 8, y1 + barH / 2);
  text('Δn (low)', barX - 8, y2 + barH / 2);

  const y3 = y + h * 0.8;
  fill(230, 90, 60);
  rect(barX, y3, barW * 0.9, barH, 4);
  fill(30); textAlign(RIGHT, CENTER);
  text('Δn (high)', barX - 8, y3 + barH / 2);

  fill(40, 130, 60); textAlign(LEFT, CENTER); textSize(11);
  text('low-level: Δn ≪ N', barX + barW * 0.08 + 6, y2 + barH / 2);
  fill(190, 40, 40);
  text('high-level: Δn ≳ N', barX + barW * 0.9 + 6, y3 + barH / 2);
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
  const diagX0 = x + 50, diagX1 = x + w - 100;
  const ecY = y + 24, evY = y + h - 24;
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

  fill(40); textAlign(CENTER, TOP); textSize(12);
  text('n = ni·e^((EFn−Ei)/kT)      p = ni·e^((Ei−EFp)/kT)', x + w / 2 - 50, y + h - 4);
}

function drawStepSummary(x, y, w, h) {
  const items = ['Generation', 'Excess Carriers Δn', 'Recombination (4 types)', 'Lifetime τ / Rate R', 'Injection Level', 'Continuity Eq. → Lp', 'Quasi-Fermi Levels'];
  const n = items.length;
  const boxW = (w - 10 * (n - 1)) / n;
  for (let i = 0; i < n; i++) {
    const bx = x + i * (boxW + 10);
    const by = y + h * 0.28;
    const bh = h * 0.44;
    noStroke(); fill(90, 62, 237, 30 + i * 8);
    stroke(90, 62, 237); strokeWeight(1.2);
    rect(bx, by, boxW, bh, 5);
    noStroke(); fill(40); textAlign(CENTER, CENTER); textSize(9.5);
    text(items[i], bx + boxW / 2, by + bh / 2, boxW - 6, bh - 6);
    if (i < n - 1) {
      noStroke(); fill(120); textAlign(CENTER, CENTER); textSize(13);
      text('→', bx + boxW + 5, by + bh / 2);
    }
  }
  fill(60); textAlign(CENTER, TOP); textSize(11.5);
  text('This chain is exactly what drives the p-n junction in Chapter 14.', x + w / 2, y + h - 22);
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
