// P-N Junction Under Bias Interactive Walkthrough MicroSim
// A step-by-step guided tour of Chapter 15's storyline: forward/reverse
// bias, minority carrier injection, short-base and long-base diodes,
// saturation current, the ideal diode equation, avalanche and Zener
// breakdown, and the complete junction I-V characteristic. Canvas-based
// Prev/Next buttons advance through a fixed sequence of illustrations.
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
    title: '1. Forward and Reverse Bias',
    text: 'Forward bias lowers the junction barrier from Vbi to Vbi−V, sharply increasing diffusion. Reverse bias raises it to Vbi+V, nearly shutting diffusion off and leaving only a tiny drift current.',
    draw: drawStepBias
  },
  {
    title: '2. Minority Carrier Injection',
    text: 'The law of the junction sets the injected minority carrier concentration at the depletion edge: pn(xn) = pn0·e^(V/VT). Forward bias injects enormous excess concentrations even for a fraction of a volt.',
    draw: drawStepInjection
  },
  {
    title: '3. Short-Base vs. Long-Base Diode',
    text: 'Injected carriers diffuse into the quasi-neutral region. If it is long compared to the diffusion length, the profile decays exponentially (long-base). If short, an ohmic contact forces it to zero, giving a linear profile (short-base).',
    draw: drawStepShortLongBase
  },
  {
    title: '4. Saturation Current',
    text: 'The carrier profile\'s gradient at the injection edge, via Fick\'s law, sets the saturation current J0 — small, fixed, and set by doping, diffusion coefficients, and base geometry.',
    draw: drawStepSaturation
  },
  {
    title: '5. The Ideal Diode Equation',
    text: 'J = J0(e^(V/VT) − 1). At V=0, J=0 (equilibrium). Forward bias gives exponential rise. Reverse bias gives J → −J0, the saturation current.',
    draw: drawStepIdealDiode
  },
  {
    title: '6. Avalanche Breakdown',
    text: 'At large reverse bias in lightly-doped junctions, carriers accelerate across the wide depletion region and gain enough energy to create new electron-hole pairs on impact — a multiplying chain reaction.',
    draw: drawStepAvalanche
  },
  {
    title: '7. Zener Breakdown',
    text: 'In heavily-doped junctions, the depletion region is thin enough for electrons to tunnel directly through the barrier — a purely quantum-mechanical process, dominant below about 5-6 V in silicon.',
    draw: drawStepZener
  },
  {
    title: '8. The Complete Junction I-V Characteristic',
    text: 'Forward exponential rise + reverse saturation at −I0 + breakdown at V_BR = the full diode I-V curve — the defining behavior of every diode and the foundation for the transistors ahead.',
    draw: drawStepSummary
  }
];

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);
  describe('P-N junction under bias interactive walkthrough: a step-by-step guided tour through forward and reverse bias, minority carrier injection, short-base and long-base diodes, saturation current, the ideal diode equation, avalanche breakdown, Zener breakdown, and the complete junction I-V characteristic', LABEL);
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

function drawStepBias(x, y, w, h) {
  const midX = x + w / 2;
  const panelW = w / 2 - 12;
  drawMiniBand(x + 6, y + 8, panelW, h - 16, 0.55, 'Forward', color(40, 150, 90));
  drawMiniBand(midX + 6, y + 8, panelW, h - 16, -0.45, 'Reverse', color(220, 90, 60));
}

function drawMiniBand(x, y, w, h, bendFrac, label, col) {
  noStroke(); fill(250); stroke(220); strokeWeight(1);
  rect(x, y, w, h, 6);
  const x0 = x + 14, x1 = x + w - 14, midX = (x0 + x1) / 2;
  const gapPx = h * 0.28;
  const bend = bendFrac * h * 0.22;
  const ecL = y + h * 0.3 + bend, ecR = y + h * 0.3 - bend;
  stroke(col); strokeWeight(2.2); noFill();
  beginShape(); vertex(x0, ecL); vertex(midX - 8, ecL); bezierVertex(midX, ecL, midX, ecR, midX + 8, ecR); vertex(x1, ecR); endShape();
  beginShape(); vertex(x0, ecL + gapPx); vertex(midX - 8, ecL + gapPx); bezierVertex(midX, ecL + gapPx, midX, ecR + gapPx, midX + 8, ecR + gapPx); vertex(x1, ecR + gapPx); endShape();
  noStroke(); fill(col); textAlign(CENTER, BOTTOM); textSize(11); textStyle(BOLD);
  text(label, x + w / 2, y + h - 6);
  textStyle(NORMAL);
}

function drawStepInjection(x, y, w, h) {
  const midX = x + w / 2, depW = 30;
  noStroke(); fill(240, 244, 255);
  rect(midX, y + 8, w / 2 - 8, h - 16, 6);
  fill(255, 240, 240);
  rect(x + 8, y + 8, w / 2 - 8, h - 16, 6);
  fill(255, 210, 210, 150);
  rect(midX - depW, y + 8, depW, h - 16);
  fill(210, 220, 255, 150);
  rect(midX, y + 8, depW, h - 16);

  const seeds = [[0.15, 0.3], [0.3, 0.6], [0.5, 0.4], [0.7, 0.7], [0.85, 0.3], [0.55, 0.8]];
  for (let i = 0; i < seeds.length; i++) {
    smlDrawHole(midX + depW + seeds[i][0] * (w / 2 - depW - 20), y + 30 + seeds[i][1] * (h - 60), 10);
  }
  noStroke(); fill(90, 62, 237); textAlign(CENTER, TOP); textSize(11); textStyle(BOLD);
  text('injected holes: pn(xn) = pn0·e^(V/VT)', midX, y + h - 20);
  textStyle(NORMAL);
}

function drawStepShortLongBase(x, y, w, h) {
  const chartX = x + 50, chartY = y + 16, chartW = w - 90, chartH = h - 50;
  const longPts = [], shortPts = [];
  for (let xv = 0; xv <= 3; xv += 0.05) {
    longPts.push({ x: xv, y: Math.exp(-xv) });
    shortPts.push({ x: xv, y: max(0, 1 - xv / 1.2) });
  }
  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 3, 0, 1.05, [
    { points: longPts, color: color(90, 62, 237) },
    { points: shortPts, color: color(230, 90, 60) }
  ], { xLabel: "x' / Lp", yLabel: 'Δp/Δp(0)', yLabelOffset: 34 });
  noStroke(); fill(90, 62, 237); textAlign(LEFT, TOP); textSize(10.5);
  text('— long-base (exponential)', chartX + 6, chartY + 4);
  fill(230, 90, 60);
  text('— short-base (linear)', chartX + 6, chartY + 18);
}

function drawStepSaturation(x, y, w, h) {
  const chartX = x + 50, chartY = y + 16, chartW = w - 90, chartH = h - 50;
  const pts = [];
  for (let xv = 0; xv <= 3; xv += 0.05) pts.push({ x: xv, y: Math.exp(-xv) });
  const info = smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 3, 0, 1.05, [
    { points: pts, color: color(90, 62, 237) }
  ], { xLabel: "x' / Lp", yLabel: 'Δp/Δp(0)', yLabelOffset: 34 });
  const x0 = info.xToPx(0), y0 = info.yToPx(1);
  const x1 = info.xToPx(0.7), y1 = info.yToPx(Math.exp(-0.7));
  stroke(230, 90, 60); strokeWeight(2);
  line(x0, y0, x1, y1 - 20);
  noStroke(); fill(230, 90, 60); textAlign(LEFT, BOTTOM); textSize(11);
  text('slope at x\'=0 → J0', x1 + 4, y1 - 20);
}

function drawStepIdealDiode(x, y, w, h) {
  const chartX = x + 50, chartY = y + 16, chartW = w - 90, chartH = h - 50;
  const pts = [];
  for (let v = -1; v <= 0.7; v += 0.02) pts.push({ x: v, y: Math.max(-1, Math.min(3, (Math.exp(v / 0.15) - 1))) });
  smlDrawLineChart(chartX, chartY, chartW, chartH, -1, 0.7, -1.2, 3, [
    { points: pts, color: color(90, 62, 237) }
  ], { xLabel: 'V', yLabel: 'J (norm.)', yLabelOffset: 34 });
  noStroke(); fill(40); textAlign(CENTER, TOP); textSize(12);
  text('J = J0(e^(V/VT) − 1)', x + w / 2, y + h - 18);
}

function drawStepAvalanche(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  const depW = w * 0.5, depH = h * 0.6;
  noStroke(); fill(230, 240, 255, 200);
  rect(cx - depW / 2, cy - depH / 2, depW, depH);
  stroke(120); strokeWeight(2);
  const steps = 3;
  let px = cx - depW / 2 + 10, py = cy;
  for (let i = 0; i < steps; i++) {
    const nx = px + depW / (steps + 1);
    line(px, py, nx, py);
    noStroke(); fill(230, 90, 60);
    circle(nx, py, 9 + i * 3);
    smlDrawElectron(nx, py - 14 - i * 4, 9);
    smlDrawHole(nx, py + 14 + i * 4, 9);
    stroke(120); strokeWeight(2);
    px = nx;
  }
  noStroke(); fill(90); textAlign(CENTER, BOTTOM); textSize(10.5);
  text('each impact creates a new electron-hole pair', cx, y + h - 6);
}

function drawStepZener(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  const depW = w * 0.14, depH = h * 0.55;
  noStroke(); fill(255, 220, 210, 200);
  rect(cx - depW / 2, cy - depH / 2, depW, depH);
  stroke(220, 90, 60); strokeWeight(2.5);
  line(cx - depW * 2, cy, cx + depW * 2, cy);
  noStroke(); fill(220, 90, 60);
  triangle(cx + depW * 2, cy - 6, cx + depW * 2, cy + 6, cx + depW * 2 + 10, cy);
  noStroke(); fill(90); textAlign(CENTER, BOTTOM); textSize(10.5);
  text('electron tunnels directly through the thin barrier', cx, y + h - 6);
}

function drawStepSummary(x, y, w, h) {
  const items = ['Forward/Reverse\nBias', 'Minority Carrier\nInjection', 'Short/Long-Base\nProfile', 'Saturation\nCurrent J0', 'Ideal Diode\nEquation', 'Reverse\nBreakdown'];
  const n = items.length;
  const boxW = (w - 8 * (n - 1)) / n;
  for (let i = 0; i < n; i++) {
    const bx = x + i * (boxW + 8);
    const by = y + h * 0.28;
    const bh = h * 0.46;
    noStroke(); fill(90, 62, 237, 30 + i * 6);
    stroke(90, 62, 237); strokeWeight(1.2);
    rect(bx, by, boxW, bh, 5);
    noStroke(); fill(40); textAlign(CENTER, CENTER); textSize(9);
    text(items[i], bx + boxW / 2, by + bh / 2, boxW - 4, bh - 4);
    if (i < n - 1) {
      noStroke(); fill(120); textAlign(CENTER, CENTER); textSize(12);
      text('→', bx + boxW + 4, by + bh / 2);
    }
  }
  fill(60); textAlign(CENTER, TOP); textSize(11);
  text('Together, this chain gives the complete junction I-V characteristic.', x + w / 2, y + h - 22);
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
