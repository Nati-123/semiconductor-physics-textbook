// Semiconductor Devices and Applications Interactive Walkthrough MicroSim
// A step-by-step guided tour of Chapter 18's storyline, and the closing
// review of the entire course: the power diode, rectifier circuit,
// varactor diode, bipolar transistor and MOSFET basics, device modeling
// and simulation, band diagram construction, device design trade-offs,
// and the capstone device project. Canvas-based Prev/Next buttons
// advance through a fixed sequence of illustrations.
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
let nextBtn = { x: 0, y: 0, w: 100, h: 36 };
let dotsHit = null;

const STEPS = [
  {
    title: '1. Power Diode',
    text: 'A p-n junction engineered with a lightly-doped drift region to block high reverse voltage while still conducting large forward current — the avalanche breakdown physics of Chapter 15, deliberately engineered around.',
    draw: drawStepPowerDiode
  },
  {
    title: '2. Rectifier Circuit',
    text: 'Diodes arranged to convert AC to DC. Full-wave bridge rectification uses both half-cycles of the input, giving roughly double the average output of half-wave rectification.',
    draw: drawStepRectifier
  },
  {
    title: '3. Varactor Diode',
    text: 'A reverse-biased junction deliberately exploited for its voltage-tunable capacitance (Chapter 14), used to tune resonant frequency in RF circuits.',
    draw: drawStepVaractor
  },
  {
    title: '4. Bipolar Transistor & MOSFET Basics',
    text: 'A BJT amplifies current linearly (IC = β·IB) via two adjacent junctions; a MOSFET conducts through a voltage-controlled inversion channel, ID scaling quadratically with overdrive.',
    draw: drawStepTransistors
  },
  {
    title: '5. Device Modeling & Simulation',
    text: 'This course\'s equations are analytic models — fast, intuitive, idealized. Compact models and full numerical simulation trade speed for accuracy as design questions demand.',
    draw: drawStepModeling
  },
  {
    title: '6. Band Diagram Construction',
    text: 'One procedure — flat bands away from junctions, smooth bending at each junction, bias-dependent shifts — builds every band diagram used across this entire course.',
    draw: drawStepBandDiagram
  },
  {
    title: '7. Device Design Trade-Offs',
    text: 'Real devices balance competing requirements. Doubling a power diode\'s breakdown voltage roughly quadruples its specific on-resistance — no device optimizes every metric at once.',
    draw: drawStepTradeoff
  },
  {
    title: '8. Capstone Device Project',
    text: 'Chapters 11, 14, 15, and 17 combine into one power diode design: breakdown voltage sets doping and width, which set resistance and forward drop, which set power and temperature rise.',
    draw: drawStepCapstone
  },
  {
    title: '9. Course Complete',
    text: 'From crystal structure and quantum mechanics, through carrier statistics and transport, to junctions, bias, MOS electrostatics, optoelectronics, and now real devices — the whole physical chain, connected.',
    draw: drawStepCourseComplete
  }
];

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);
  describe('Semiconductor devices and applications interactive walkthrough: a step-by-step guided tour through the power diode, rectifier circuit, varactor diode, bipolar transistor and MOSFET basics, device modeling and simulation, band diagram construction, device design trade-offs, and the capstone device project closing the course', LABEL);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const step = STEPS[currentStep];

  // Title: left edge of the wrap box must be the LEFT edge (10), not the
  // horizontal center — p5's text(str,x,y,w) wraps within [x, x+w]
  // regardless of textAlign, so passing canvasWidth/2 here (a bug found
  // and fixed while auditing this file) shoved every title far to the
  // right, off-canvas and behind the fixed top-right fullscreen button.
  // The title is also pushed down to y=30 (below the ~28px-tall button)
  // so it never competes with it vertically either.
  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15.5);
  text(step.title, 10, 30, canvasWidth - 20);

  const illX = 20, illY = 68, illW = canvasWidth - 40, illH = drawHeight * 0.46;
  noStroke(); fill(255);
  stroke(210); strokeWeight(1);
  rect(illX, illY, illW, illH, 8);
  step.draw(illX, illY, illW, illH);

  const txtX = 20, txtY = illY + illH + 14, txtW = canvasWidth - 40, txtH = drawHeight - (txtY - 0) - 14;
  noStroke(); fill(255, 247, 221);
  stroke(240, 216, 122); strokeWeight(1);
  rect(txtX, txtY, txtW, txtH, 8);
  noStroke(); fill('#7a5c00');
  textAlign(LEFT, TOP); textSize(12.5);
  text(step.text, txtX + 14, txtY + 10, txtW - 28, txtH - 18);

  drawControls();
}

function drawStepPowerDiode(x, y, w, h) {
  const midX = x + w / 2, depW = w * 0.16;
  noStroke(); fill(255, 240, 240);
  rect(x + 8, y + 8, w / 2 - 8, h - 16, 6);
  fill(240, 244, 255);
  rect(midX, y + 8, w / 2 - 8, h - 16, 6);
  fill(210, 220, 255, 200);
  rect(midX, y + 8, depW, h - 16);
  noStroke(); fill(30); textAlign(CENTER, TOP); textSize(10.5);
  text('p+', x + 8 + (w / 2 - 8 - depW) / 2, y + 12);
  // textAlign(CENTER,...) with a text() width still wraps within [x, x+w],
  // so x must be that region's LEFT edge, not its center (same bug class
  // as the title above).
  text('lightly-doped n− drift region', midX + depW, y + 12, w / 2 - depW - 16);
  fill(90, 62, 237); textAlign(CENTER, BOTTOM); textSize(10.5);
  text('wide depletion region supports high V_BR', midX - w * 0.2, y + h - 8, w * 0.4);
  fill(40); textAlign(LEFT, TOP); textSize(10.5);
  smlMathText(x + 10, y + h - 34, 'N_D ≈ ε_sE_crit² / (2qV_BR)', { size: 10.5 });
}

function drawStepRectifier(x, y, w, h) {
  const chartX = x + 50, chartY = y + 16, chartW = w - 90, chartH = h - 84;
  const pts1 = [], pts2 = [];
  for (let px = 0; px <= chartW; px++) {
    const t = map(px, 0, chartW, 0, 4 * PI);
    pts1.push({ x: t, y: sin(t) });
    pts2.push({ x: t, y: abs(sin(t)) });
  }
  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 4 * PI, -1.2, 1.2, [
    { points: pts1, color: color(90, 62, 237) },
    { points: pts2, color: color(230, 90, 60) }
  ], { xLabel: 'time', yLabel: 'V' });
  noStroke(); fill(90, 62, 237); textAlign(LEFT, TOP); textSize(10);
  text('— AC input', chartX, chartY + 4);
  fill(230, 90, 60);
  text('— rectified output', chartX, chartY + 18);
  fill(40); textAlign(CENTER, TOP);
  smlMathText(x + w / 2, y + h - 18, 'V_DC ≈ 2(V_peak − 2V_F) / π  (full-wave bridge)', { align: 'center', size: 11 });
}

function drawStepVaractor(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  noStroke(); fill(255, 245, 230);
  rect(x + 20, y + 20, w - 40, h - 40, 8);
  fill(30); textAlign(CENTER, TOP); textSize(12);
  text('C_j varies with reverse bias  →  f = 1/(2π√(LC_j))', cx, y + 24);
  stroke(90, 62, 237); strokeWeight(2); noFill();
  const pts = [];
  for (let vv = 0; vv <= 10; vv += 0.2) pts.push({ x: vv, y: 1 / sqrt(vv + 1) });
  beginShape();
  for (const p of pts) vertex(x + 30 + (p.x / 10) * (w - 60), y + h - 30 - p.y * (h - 90));
  endShape();
  noStroke(); fill(60); textAlign(CENTER, TOP); textSize(10);
  text('capacitance (and frequency) tune smoothly with bias', cx, y + h - 20);
}

function drawStepTransistors(x, y, w, h) {
  const halfW = w / 2;
  const chartX1 = x + 40, chartY = y + 34, chartW1 = halfW - 60, chartH = h - 64;
  const pts1 = [];
  for (let ib = 0; ib <= 10; ib += 0.5) pts1.push({ x: ib, y: 100 * ib });
  smlDrawLineChart(chartX1, chartY, chartW1, chartH, 0, 10, 0, 1000, [{ points: pts1, color: color(90, 62, 237) }], { xLabel: 'IB', yLabel: 'IC' });
  noStroke(); fill(90, 62, 237);
  smlMathText(chartX1 + chartW1 / 2, chartY - 18, 'BJT: I_C = β·I_B', { align: 'center', size: 10.5 });

  const chartX2 = x + halfW + 20, chartW2 = halfW - 60;
  const pts2 = [];
  for (let v = 0; v <= 1.5; v += 0.05) pts2.push({ x: v, y: v * v });
  smlDrawLineChart(chartX2, chartY, chartW2, chartH, 0, 1.5, 0, 2.25, [{ points: pts2, color: color(230, 90, 60) }], { xLabel: 'Vov', yLabel: 'ID' });
  noStroke(); fill(230, 90, 60);
  smlMathText(chartX2 + chartW2 / 2, chartY - 18, 'MOSFET: I_D ∝ (V_GS−V_T)²', { align: 'center', size: 10.5 });
}

function drawStepModeling(x, y, w, h) {
  const items = ['Analytic\n(this course)', 'Compact\nModel', 'Numerical\nSimulation'];
  const colors = [color(90, 62, 237), color(230, 150, 30), color(220, 60, 60)];
  const n = items.length;
  const boxW = (w - 30) / n;
  for (let i = 0; i < n; i++) {
    const bx = x + i * (boxW + 15) + 15;
    const barH = map(i, 0, n - 1, h * 0.3, h * 0.82);
    noStroke(); fill(colors[i]);
    rect(bx, y + h - 30 - barH, boxW - 10, barH, 4);
    fill(30); textAlign(CENTER, TOP); textSize(10);
    // x must be the bar's own LEFT edge (bx), matching its width (boxW-10)
    // passed as the wrap width — not the bar's center (same bug class as
    // the title/label fixes above), or the label shifts right and clips.
    text(items[i], bx, y + h - 24, boxW - 10);
  }
  noStroke(); fill(60); textAlign(CENTER, TOP); textSize(10.5);
  text('accuracy and cost both increase together →', x + 10, y + 8, w - 20);
  fill(140); textAlign(CENTER, TOP); textSize(9);
  text('(qualitative comparison, not measured data)', x + 10, y + 24, w - 20);
}

function drawStepBandDiagram(x, y, w, h) {
  const midX = x + w / 2;
  const ecY = y + h * 0.32, evY = y + h * 0.68;
  stroke(90, 62, 237); strokeWeight(2.2); noFill();
  beginShape();
  vertex(x + 20, ecY + 20); vertex(midX - 20, ecY + 20);
  bezierVertex(midX - 5, ecY + 20, midX - 5, ecY - 20, midX + 10, ecY - 20);
  vertex(x + w - 20, ecY - 20);
  endShape();
  beginShape();
  vertex(x + 20, evY + 20); vertex(midX - 20, evY + 20);
  bezierVertex(midX - 5, evY + 20, midX - 5, evY - 20, midX + 10, evY - 20);
  vertex(x + w - 20, evY - 20);
  endShape();
  noStroke(); fill(90, 62, 237); textAlign(LEFT, BOTTOM); textSize(10.5);
  text('EC', x + w - 15, ecY - 20);
  text('EV', x + w - 15, evY - 20);
  fill(60); textAlign(CENTER, TOP); textSize(10.5);
  text('same procedure: flat → bend at junction → flat', midX, y + h - 20);
}

function drawStepTradeoff(x, y, w, h) {
  const chartX = x + 55, chartY = y + 16, chartW = w - 90, chartH = h - 66;
  const pts = [];
  for (let bv = 0; bv <= 10; bv += 0.2) pts.push({ x: bv, y: bv * bv });
  // No xLabel passed to the chart itself (it would land only ~20px above
  // the caption below and collide with it) — the caption already names
  // the x-axis quantity (V_BR) as part of the proportionality statement.
  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 10, 0, 100, [{ points: pts, color: color(90, 62, 237) }], { yLabel: 'R_on,sp' });
  noStroke(); fill(60); textAlign(CENTER, TOP); textSize(10);
  text('V_BR', chartX + chartW / 2, chartY + chartH + 4);
  fill(40); textAlign(CENTER, TOP); textSize(11);
  text('R_on,sp ∝ V_BR²', x + w / 2, y + h - 18);
}

function drawStepCapstone(x, y, w, h) {
  const items = ['V_BR', 'ND, W', 'Ron', 'VF', 'P, ΔT'];
  const n = items.length;
  const boxW = (w - 8 * (n - 1)) / n;
  for (let i = 0; i < n; i++) {
    const bx = x + i * (boxW + 8);
    const by = y + h * 0.18;
    const bh = h * 0.58;
    noStroke(); fill(90, 62, 237, 30 + i * 15);
    stroke(90, 62, 237); strokeWeight(1.2);
    rect(bx, by, boxW, bh, 5);
    noStroke(); fill(30); textAlign(CENTER, CENTER); textSize(11);
    text(items[i], bx + boxW / 2, by + bh / 2);
    if (i < n - 1) {
      noStroke(); fill(120); textAlign(CENTER, CENTER); textSize(13);
      text('→', bx + boxW + 4, by + bh / 2);
    }
  }
  fill(60); textAlign(CENTER, TOP); textSize(10.5);
  text('four chapters, one connected chain', x + w / 2, y + h - 24);
}

function drawStepCourseComplete(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  noStroke(); fill(40, 150, 90); textAlign(CENTER, CENTER); textSize(16); textStyle(BOLD);
  text('Physics and Math → Quantum Mechanics → Crystals →', cx, cy - 30);
  text('Bands → Carriers → Transport → Junctions → Bias →', cx, cy);
  text('MOS → Optics/Thermal → Devices', cx, cy + 30);
  textStyle(NORMAL);
}

function drawControls() {
  const cy = drawHeight + (controlHeight - prevBtn.h) / 2;
  prevBtn.x = 20; prevBtn.y = cy;
  nextBtn.x = canvasWidth - 20 - nextBtn.w; nextBtn.y = cy;

  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  // Prev is disabled (dimmed, inert) on step 1 rather than wrapping to
  // step 9 — a walkthrough shouldn't silently loop past its ends.
  push();
  if (isFirst) drawingContext.globalAlpha = 0.35;
  smlDrawButton(prevBtn.x, prevBtn.y, prevBtn.w, prevBtn.h, '◀ Prev', false);
  pop();

  // On the final step, Next becomes Restart instead of wrapping to step 1.
  smlDrawButton(nextBtn.x, nextBtn.y, nextBtn.w, nextBtn.h, isLast ? 'Restart ↺' : 'Next ▶', isLast);

  noStroke(); fill(30); textAlign(CENTER, CENTER); textSize(13);
  text('Step ' + (currentStep + 1) + ' of ' + STEPS.length, canvasWidth / 2, cy + prevBtn.h / 2);

  const dotsY = cy + prevBtn.h + 12;
  const totalDotsW = STEPS.length * 15;
  const dotsX0 = canvasWidth / 2 - totalDotsW / 2 + 7;
  for (let i = 0; i < STEPS.length; i++) {
    noStroke();
    fill(i === currentStep ? color(90, 62, 237) : color(210));
    circle(dotsX0 + i * 15, dotsY, 8);
  }
  // Dots double as a step index: clicking one jumps straight to that step
  // (documented in this MicroSim's learning panel as "use the step dots to
  // jump back to any concept" — previously undocumented behavior with no
  // actual click handler).
  dotsHit = { y: dotsY, x0: dotsX0, spacing: 15, r: 8 };
}

function mousePressed() {
  const isLast = currentStep === STEPS.length - 1;
  if (smlPointInRect(mouseX, mouseY, prevBtn.x, prevBtn.y, prevBtn.w, prevBtn.h)) {
    if (currentStep > 0) currentStep -= 1; // no-op (disabled) on step 1
  } else if (smlPointInRect(mouseX, mouseY, nextBtn.x, nextBtn.y, nextBtn.w, nextBtn.h)) {
    currentStep = isLast ? 0 : currentStep + 1; // Restart on the final step
  } else if (dotsHit) {
    for (let i = 0; i < STEPS.length; i++) {
      const dx = dotsHit.x0 + i * dotsHit.spacing;
      if (dist(mouseX, mouseY, dx, dotsHit.y) <= dotsHit.r) { currentStep = i; break; }
    }
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
