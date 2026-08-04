// Future Technology Roadmap Explorer MicroSim
// A step-by-step guided tour of Chapter 20's storyline, and the closing
// review of the entire course: technology scaling, short-channel effects,
// FinFET/GAA, SOI, wide-bandgap/compound semiconductors, optoelectronics,
// MEMS/NEMS, quantum devices, applications, and the capstone synthesis.
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
  { title: '1. Technology Scaling & Short-Channel Effects', text: 'Moore\'s Law shrinks the MOSFET until threshold roll-off and DIBL make planar electrostatics break down.', draw: drawStepScaling },
  { title: '2. FinFET & Gate-All-Around', text: 'Wrapping the gate around 2, 3, or 4 sides of the channel restores electrostatic control, λ ∝ 1/√n.', draw: drawStepFinGAA },
  { title: '3. Silicon-on-Insulator', text: 'A buried oxide layer isolates the channel from the substrate, removing parasitic junction capacitance.', draw: drawStepSOI },
  { title: '4. Wide-Bandgap: SiC & GaN', text: 'Larger band gap raises critical field; R_on,sp ∝ 1/Ecrit³ makes SiC/GaN dramatically more efficient than silicon.', draw: drawStepWideBandgap },
  { title: '5. Compound Semiconductors', text: 'GaAs and InP\'s high mobility and direct band gap serve high-frequency electronics and fiber optics.', draw: drawStepCompound },
  { title: '6. Optoelectronics & Laser Diodes', text: 'Above threshold current, population inversion turns spontaneous LED-like emission into coherent stimulated emission.', draw: drawStepOptoelectronics },
  { title: '7. MEMS, NEMS & Quantum Devices', text: 'Fabrication builds mechanical structures (MEMS) and confines electrons at the nanoscale (quantum dots), f ∝ √(k/m), E ∝ 1/L².', draw: drawStepMemsQuantum },
  { title: '8. Applications: AI, Power, Communications', text: 'Dense scaled transistors power AI hardware; wide-bandgap devices power EVs and 5G/6G — every device serves a real system.', draw: drawStepApplications },
  { title: '9. Capstone: Twenty Chapters, One Chain', text: 'Crystal structure → quantum mechanics → carriers → junctions → fabrication → advanced devices — one continuous physical story, complete.', draw: drawStepCapstone }
];

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);
  describe('Future technology roadmap explorer: a step-by-step guided tour through Chapter 20 and a capstone review of the entire twenty-chapter semiconductor physics course', LABEL);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const step = STEPS[currentStep];

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15.5);
  text(step.title, canvasWidth / 2, 10, canvasWidth - 20);

  const illX = 20, illY = 42, illW = canvasWidth - 40, illH = drawHeight * 0.48;
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

function drawStepScaling(x, y, w, h) {
  const chartX = x + 50, chartY = y + 16, chartW = w - 90, chartH = h - 46;
  const pts = [];
  for (let t = 0; t <= 20; t += 0.5) pts.push({ x: t, y: log(pow(2, t / 2)) / log(10) });
  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 20, 0, 4, [{ points: pts, color: color(90, 62, 237) }], { xLabel: 'years', yLabel: 'log10(N)' });
}

function drawStepFinGAA(x, y, w, h) {
  const items = ['Planar\nn=1', 'FinFET\nn=2-3', 'GAA\nn=4'];
  const colors = [color(200, 90, 90), color(230, 150, 30), color(40, 130, 70)];
  const n = items.length;
  const boxW = (w - 30) / n;
  for (let i = 0; i < n; i++) {
    const bx = x + i * (boxW + 15) + 15;
    const barH = map(i, 0, n - 1, h * 0.3, h * 0.7);
    noStroke(); fill(colors[i]);
    rect(bx, y + h - 30 - barH, boxW - 10, barH, 4);
    fill(30); textAlign(CENTER, TOP); textSize(10);
    text(items[i], bx + (boxW - 10) / 2, y + h - 24, boxW);
  }
  fill(60); textAlign(CENTER, TOP); textSize(10.5);
  text('more gate sides → shorter natural length →', x + w / 2, y + 8);
}

function drawStepSOI(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  noStroke(); fill(230, 230, 240);
  rect(cx - 90, cy - 10, 180, 30);
  fill(180, 220, 255);
  rect(cx - 90, cy + 20, 180, 14);
  fill(225, 225, 235);
  rect(cx - 90, cy + 34, 180, 20);
  fill(60); textAlign(CENTER, TOP); textSize(10.5);
  text('buried oxide isolates channel from substrate', cx, cy + 58);
}

function drawStepWideBandgap(x, y, w, h) {
  const items = ['Si', 'SiC', 'GaN'];
  const vals = [0.3, 2.5, 3.3];
  const colors = [color(150, 150, 160), color(230, 150, 30), color(90, 62, 237)];
  const chartX = x + 50, chartY = y + 20, chartW = w - 90, chartH = h - 50;
  const series = items.map((label, i) => ({ label, value: vals[i], color: colors[i] }));
  smlDrawBarChart(chartX, chartY, chartW, chartH, series, 4);
  fill(60); noStroke(); textAlign(CENTER, TOP); textSize(10.5);
  text('critical field (MV/cm)', x + w / 2, y + 6);
}

function drawStepCompound(x, y, w, h) {
  const cx = x + w / 2;
  const items = ['Si', 'GaAs', 'InP'];
  const vals = [1350, 8500, 5400];
  const colors = [color(150, 150, 160), color(230, 150, 30), color(90, 62, 237)];
  const series = items.map((label, i) => ({ label, value: vals[i], color: colors[i] }));
  smlDrawBarChart(x + 50, y + 20, w - 90, h - 50, series, 9000);
  fill(60); noStroke(); textAlign(CENTER, TOP); textSize(10.5);
  text('electron mobility (cm²/V·s)', cx, y + 6);
}

function drawStepOptoelectronics(x, y, w, h) {
  const chartX = x + 50, chartY = y + 16, chartW = w - 90, chartH = h - 46;
  const pts = [];
  for (let i = 0; i <= 100; i += 1) pts.push({ x: i, y: i < 40 ? 0.002 * i : 0.002 * 40 + 0.09 * (i - 40) });
  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 100, 0, 6, [{ points: pts, color: color(90, 62, 237) }], { xLabel: 'current (mA)', yLabel: 'power' });
}

function drawStepMemsQuantum(x, y, w, h) {
  const halfW = w / 2, cx1 = x + halfW / 2, cx2 = x + halfW + halfW / 2, cy = y + h / 2;
  noStroke(); fill(180);
  rect(cx1 - 60, cy - 20, 15, 40);
  fill(150, 130, 220);
  rect(cx1 - 45, cy - 5, 90, 10);
  fill(60); textAlign(CENTER, TOP); textSize(9.5);
  text('MEMS cantilever', cx1, cy + 20);

  fill(90, 62, 237, 180);
  circle(cx2, cy, 40);
  fill(30); textAlign(CENTER, TOP); textSize(9.5);
  text('quantum dot: E ∝ 1/L²', cx2, cy + 30);
}

function drawStepApplications(x, y, w, h) {
  const items = ['AI /\nComputing', 'Power\nElectronics', 'Communi-\ncations'];
  const colors = [color(90, 62, 237), color(230, 150, 30), color(40, 130, 70)];
  const n = items.length;
  const boxW = (w - 30) / n;
  for (let i = 0; i < n; i++) {
    const bx = x + i * (boxW + 15) + 15;
    noStroke(); fill(colors[i]);
    rect(bx, y + h * 0.3, boxW - 10, h * 0.4, 4);
    fill(255); textAlign(CENTER, CENTER); textSize(10.5);
    text(items[i], bx + (boxW - 10) / 2, y + h * 0.5);
  }
}

function drawStepCapstone(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  noStroke(); fill(40, 150, 90); textAlign(CENTER, CENTER); textSize(15); textStyle(BOLD);
  text('Crystal Structure → Quantum Mechanics →', cx, cy - 30);
  text('Carriers → Junctions → Fabrication →', cx, cy);
  text('Advanced Devices — Course Complete', cx, cy + 30);
  textStyle(NORMAL);
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
  const totalDotsW = STEPS.length * 15;
  const dotsX0 = canvasWidth / 2 - totalDotsW / 2 + 7;
  for (let i = 0; i < STEPS.length; i++) {
    noStroke();
    fill(i === currentStep ? color(90, 62, 237) : color(210));
    circle(dotsX0 + i * 15, dotsY, 8);
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
