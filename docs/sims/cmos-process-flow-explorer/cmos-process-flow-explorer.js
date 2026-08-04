// CMOS Process Flow Explorer MicroSim
// Steps through a simplified CMOS transistor process flow, building up a
// transistor cross-section one process step at a time, highlighting how
// the patterned gate self-aligns the source/drain implants.
// Bloom Level: Understand/Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let currentStep = 0;
let prevBtn = { x: 0, y: 0, w: 90, h: 36 };
let nextBtn = { x: 0, y: 0, w: 90, h: 36 };

const STEPS = [
  { title: '1. Grow Gate Oxide', text: 'Thermal oxidation grows a thin gate oxide across the wafer surface.' },
  { title: '2. Deposit + Pattern Gate', text: 'Polysilicon is deposited and patterned by lithography and etching into the gate electrode.' },
  { title: '3. Implant LDD Extensions', text: 'A light source/drain extension implant is self-aligned to the gate — the gate itself blocks the implant beneath it.' },
  { title: '4. Deposit Sidewall Spacer', text: 'An insulating spacer is deposited and etched along the gate sidewalls.' },
  { title: '5. Implant Heavy Source/Drain', text: 'A heavier implant, offset by the spacer width, forms the low-resistance source and drain regions.' },
  { title: '6. Anneal', text: 'A high-temperature anneal activates all implants and repairs lattice damage simultaneously.' },
  { title: '7. Deposit ILD + Etch Contacts', text: 'An interlayer dielectric is deposited, then contact holes are etched down to source, drain, and gate.' },
  { title: '8. Metallization', text: 'The first metal interconnect layer is deposited and patterned, completing the transistor.' }
];

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);
  describe('CMOS process flow explorer: steps through a simplified CMOS transistor process flow, building a transistor cross-section one process step at a time', LABEL);
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

  const illX = 20, illY = 42, illW = canvasWidth - 40, illH = drawHeight * 0.55;
  noStroke(); fill(255);
  stroke(210); strokeWeight(1);
  rect(illX, illY, illW, illH, 8);
  drawCrossSection(illX, illY, illW, illH, currentStep);

  const txtX = 20, txtY = illY + illH + 14, txtW = canvasWidth - 40, txtH = drawHeight - (txtY - 0) - 14;
  noStroke(); fill(255, 247, 221);
  stroke(240, 216, 122); strokeWeight(1);
  rect(txtX, txtY, txtW, txtH, 8);
  noStroke(); fill('#7a5c00');
  textAlign(LEFT, TOP); textSize(12.5);
  text(step.text, txtX + 14, txtY + 10, txtW - 28, txtH - 18);

  drawControls();
}

function drawCrossSection(x, y, w, h, step) {
  const subX = x + w * 0.15, subW = w * 0.7, subY = y + h * 0.55, subH = h * 0.35;
  const cx = subX + subW / 2;

  // substrate
  noStroke(); fill(230, 230, 240);
  rect(subX, subY, subW, subH);
  fill(60); textAlign(LEFT, TOP); textSize(10);
  text('p-substrate', subX + 6, subY + subH - 16);

  // gate oxide (step >= 0)
  const oxY = subY - 6, oxH = 6, gateW = subW * 0.22;
  fill(180, 220, 255);
  rect(cx - gateW / 2, oxY, gateW, oxH);

  // gate (step >= 1)
  if (step >= 1) {
    fill(150, 130, 220);
    rect(cx - gateW / 2, oxY - 26, gateW, 26);
    noStroke(); fill(30); textAlign(CENTER, BOTTOM); textSize(9);
    text('gate', cx, oxY - 28);
  }

  // LDD implant (step >= 2)
  if (step >= 2) {
    fill(255, 200, 150, 200);
    rect(subX, subY, subW * 0.5 - gateW / 2, 10);
    rect(cx + gateW / 2, subY, subW * 0.5 - gateW / 2, 10);
  }

  // spacer (step >= 3)
  if (step >= 3) {
    fill(210, 210, 220);
    rect(cx - gateW / 2 - 8, oxY - 26, 8, 26 + 6);
    rect(cx + gateW / 2, oxY - 26, 8, 26 + 6);
  }

  // heavy S/D implant (step >= 4)
  if (step >= 4) {
    fill(230, 120, 90, 220);
    rect(subX, subY, subW * 0.35, subH * 0.45);
    rect(subX + subW * 0.65, subY, subW * 0.35, subH * 0.45);
    noStroke(); fill(255); textAlign(CENTER, CENTER); textSize(9);
    text('source', subX + subW * 0.175, subY + subH * 0.22);
    text('drain', subX + subW * 0.825, subY + subH * 0.22);
  }

  // anneal glow (step >= 5)
  if (step === 5) {
    noStroke(); fill(255, 210, 90, 100);
    rect(subX, subY - 10, subW, subH + 10);
    fill(180, 100, 0); textAlign(CENTER, TOP); textSize(10);
    text('annealing…', cx, y + 10);
  }

  // ILD + contacts (step >= 6)
  if (step >= 6) {
    noStroke(); fill(240, 245, 255, 220);
    rect(x + w * 0.1, oxY - 60, w * 0.8, 60);
    fill(255);
    rect(subX + subW * 0.12, oxY - 40, 14, 40);
    rect(subX + subW * 0.88 - 14, oxY - 40, 14, 40);
    fill(30); textAlign(CENTER, TOP); textSize(9);
    text('ILD', x + w * 0.15, oxY - 56);
  }

  // metal1 (step >= 7)
  if (step >= 7) {
    fill(255, 190, 60);
    rect(subX + subW * 0.12 - 4, oxY - 44, 22, 8);
    rect(subX + subW * 0.88 - 18, oxY - 44, 22, 8);
    fill(120, 80, 0); textAlign(CENTER, TOP); textSize(9);
    text('metal 1', cx, oxY - 56);
  }
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
