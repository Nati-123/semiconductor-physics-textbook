// Metallurgical Junction and Depletion Formation Explorer MicroSim
// A step-by-step guided tour of how joining a p-type and n-type region
// creates a metallurgical junction, drives carrier diffusion, and settles
// into an equilibrium depletion region with exposed ionized dopants and
// a built-in electric field. Canvas-based Prev/Next buttons advance
// through a fixed sequence of illustrations.
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

const STEPS = [
  {
    title: '1. Before Contact',
    text: 'A p-type region (holes majority, ionized acceptors NA) and an n-type region (electrons majority, ionized donors ND) exist separately, each individually neutral and each at its own equilibrium Fermi level.',
    draw: drawStepBeforeContact
  },
  {
    title: '2. The Instant of Contact: The Metallurgical Junction',
    text: 'The two regions are joined at a common interface — the metallurgical junction. A single crystal cannot have two different Fermi levels, so the system is no longer at equilibrium the instant contact is made.',
    draw: drawStepContact
  },
  {
    title: '3. Diffusion and Recombination',
    text: 'Holes diffuse from the p-side into the n-side; electrons diffuse from the n-side into the p-side. Crossing carriers become minority carriers and recombine almost immediately near the interface.',
    draw: drawStepDiffusion
  },
  {
    title: '4. The Depletion Region Forms',
    text: 'Mobile carriers are swept out near the junction, but the fixed ionized dopant ions do not move — exposed acceptors (−) on the p-side and exposed donors (+) on the n-side create the depletion region.',
    draw: drawStepDepletionRegion
  },
  {
    title: '5. Equilibrium: Built-In Field Balances Diffusion',
    text: 'The exposed ionized charge creates a built-in electric field pointing from the n-side to the p-side. Equilibrium is reached once the resulting drift current exactly balances the diffusion current everywhere.',
    draw: drawStepEquilibrium
  }
];

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);
  describe('Metallurgical junction and depletion formation explorer: a step-by-step guided tour showing how joining p-type and n-type material creates a metallurgical junction, drives diffusion, and forms an equilibrium depletion region', LABEL);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const step = STEPS[currentStep];

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16.5);
  text(step.title, canvasWidth / 2, 10, canvasWidth - 20);

  const illX = 20, illY = 40, illW = canvasWidth - 40, illH = drawHeight * 0.52;
  noStroke(); fill(255);
  stroke(210); strokeWeight(1);
  rect(illX, illY, illW, illH, 8);
  step.draw(illX, illY, illW, illH);

  const txtX = 20, txtY = illY + illH + 14, txtW = canvasWidth - 40, txtH = drawHeight - (txtY - 0) - 14;
  noStroke(); fill(255, 247, 221);
  stroke(240, 216, 122); strokeWeight(1);
  rect(txtX, txtY, txtW, txtH, 8);
  noStroke(); fill('#7a5c00');
  textAlign(LEFT, TOP); textSize(13.5);
  text(step.text, txtX + 14, txtY + 12, txtW - 28, txtH - 20);

  drawControls();
}

function pRegionAtoms(x0, y0, w, h, n) {
  const pts = [];
  const cols = 4, rows = 3;
  let k = 0;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      if (k >= n) break;
      pts.push({ x: x0 + (i + 0.5) * (w / cols), y: y0 + (j + 0.5) * (h / rows) });
      k++;
    }
  }
  return pts;
}

function drawStepBeforeContact(x, y, w, h) {
  const midX = x + w / 2;
  const gap = 10;
  noStroke(); fill(255, 235, 235);
  rect(x + 8, y + 8, w / 2 - gap - 8, h - 16, 6);
  fill(230, 240, 255);
  rect(midX + gap, y + 8, w / 2 - gap - 8, h - 16, 6);

  fill(190, 40, 40); textAlign(CENTER, TOP); textSize(12); textStyle(BOLD);
  text('p-type (NA)', x + 8 + (w / 2 - gap - 8) / 2, y + 12);
  fill(40, 40, 190);
  text('n-type (ND)', midX + gap + (w / 2 - gap - 8) / 2, y + 12);
  textStyle(NORMAL);

  const pPts = pRegionAtoms(x + 14, y + 32, w / 2 - gap - 20, h - 46, 10);
  for (const p of pPts) smlDrawHole(p.x, p.y, 12);
  const nPts = pRegionAtoms(midX + gap + 6, y + 32, w / 2 - gap - 20, h - 46, 10);
  for (const p of nPts) smlDrawElectron(p.x, p.y, 12);

  fill(90); noStroke(); textAlign(CENTER, BOTTOM); textSize(10.5);
  text('separate, individually neutral', x + w / 2, y + h - 6);
}

function drawStepContact(x, y, w, h) {
  const midX = x + w / 2;
  noStroke(); fill(255, 235, 235);
  rect(x + 8, y + 8, w / 2 - 8, h - 16, 6);
  fill(230, 240, 255);
  rect(midX, y + 8, w / 2 - 8, h - 16, 6);

  stroke(90, 62, 237); strokeWeight(2.5);
  drawingContext.setLineDash([4, 4]);
  line(midX, y + 8, midX, y + h - 8);
  drawingContext.setLineDash([]);
  noStroke(); fill(90, 62, 237); textAlign(CENTER, TOP); textSize(11); textStyle(BOLD);
  text('Metallurgical Junction (x = 0)', midX, y + h - 22);
  textStyle(NORMAL);

  const pPts = pRegionAtoms(x + 14, y + 30, w / 2 - 26, h - 44, 10);
  for (const p of pPts) smlDrawHole(p.x, p.y, 12);
  const nPts = pRegionAtoms(midX + 12, y + 30, w / 2 - 26, h - 44, 10);
  for (const p of nPts) smlDrawElectron(p.x, p.y, 12);

  stroke(190, 40, 40); strokeWeight(2);
  const ay = y + h * 0.5;
  line(midX - 60, ay, midX + 8, ay);
  noStroke(); fill(190, 40, 40);
  triangle(midX + 8, ay - 5, midX + 8, ay + 5, midX + 16, ay);

  stroke(40, 40, 190); strokeWeight(2);
  line(midX + 60, ay + 20, midX - 8, ay + 20);
  noStroke(); fill(40, 40, 190);
  triangle(midX - 8, ay + 15, midX - 8, ay + 25, midX - 16, ay + 20);
}

function drawStepDiffusion(x, y, w, h) {
  const midX = x + w / 2;
  noStroke(); fill(255, 240, 240);
  rect(x + 8, y + 8, w / 2 - 8, h - 16, 6);
  fill(240, 244, 255);
  rect(midX, y + 8, w / 2 - 8, h - 16, 6);

  const depW = 30;
  noStroke(); fill(255, 210, 210, 150);
  rect(midX - depW, y + 8, depW, h - 16);
  fill(210, 220, 255, 150);
  rect(midX, y + 8, depW, h - 16);

  const pPts = pRegionAtoms(x + 14, y + 30, w / 2 - depW - 26, h - 44, 8);
  for (const p of pPts) smlDrawHole(p.x, p.y, 12);
  const nPts = pRegionAtoms(midX + depW + 12, y + 30, w / 2 - depW - 26, h - 44, 8);
  for (const p of nPts) smlDrawElectron(p.x, p.y, 12);

  // carriers mid-crossing, fading (recombining)
  smlDrawHole(midX - depW * 0.4, y + h * 0.35, 11);
  smlDrawHole(midX + depW * 0.5, y + h * 0.65, 11);
  smlDrawElectron(midX + depW * 0.4, y + h * 0.35, 11);
  smlDrawElectron(midX - depW * 0.5, y + h * 0.65, 11);

  stroke(120); strokeWeight(2);
  line(midX - depW * 0.9, y + h * 0.35, midX + depW * 0.3, y + h * 0.35);
  noStroke(); fill(120);
  triangle(midX + depW * 0.3, y + h * 0.35 - 5, midX + depW * 0.3, y + h * 0.35 + 5, midX + depW * 0.5, y + h * 0.35);

  stroke(120); strokeWeight(2);
  line(midX + depW * 0.9, y + h * 0.65, midX - depW * 0.3, y + h * 0.65);
  noStroke(); fill(120);
  triangle(midX - depW * 0.3, y + h * 0.65 - 5, midX - depW * 0.3, y + h * 0.65 + 5, midX - depW * 0.5, y + h * 0.65);

  noStroke(); fill(90); textAlign(CENTER, BOTTOM); textSize(10.5);
  text('crossing carriers recombine near the interface', midX, y + h - 6);
}

function drawStepDepletionRegion(x, y, w, h) {
  const midX = x + w / 2;
  const depW = 55;
  noStroke(); fill(255, 240, 240);
  rect(x + 8, y + 8, w / 2 - 8, h - 16, 6);
  fill(240, 244, 255);
  rect(midX, y + 8, w / 2 - 8, h - 16, 6);
  fill(255, 205, 205, 200);
  rect(midX - depW, y + 8, depW, h - 16);
  fill(205, 215, 255, 200);
  rect(midX, y + 8, depW, h - 16);

  const pPts = pRegionAtoms(x + 14, y + 30, w / 2 - depW - 26, h - 44, 7);
  for (const p of pPts) smlDrawHole(p.x, p.y, 12);
  const nPts = pRegionAtoms(midX + depW + 12, y + 30, w / 2 - depW - 26, h - 44, 7);
  for (const p of nPts) smlDrawElectron(p.x, p.y, 12);

  noStroke(); fill(190, 30, 30); textAlign(CENTER, CENTER); textSize(14); textStyle(BOLD);
  for (let i = 0; i < 3; i++) {
    text('−', midX - depW * 0.75, y + 40 + i * ((h - 60) / 2));
    text('−', midX - depW * 0.3, y + 40 + i * ((h - 60) / 2));
  }
  fill(30, 60, 190);
  for (let i = 0; i < 3; i++) {
    text('+', midX + depW * 0.3, y + 40 + i * ((h - 60) / 2));
    text('+', midX + depW * 0.75, y + 40 + i * ((h - 60) / 2));
  }
  textStyle(NORMAL);

  noStroke(); fill(90, 62, 237); textAlign(CENTER, TOP); textSize(11); textStyle(BOLD);
  text('Depletion Region', midX, y + h - 22, depW * 2 + 40);
  textStyle(NORMAL);
}

function drawStepEquilibrium(x, y, w, h) {
  const midX = x + w / 2;
  const depW = 55;
  noStroke(); fill(255, 240, 240);
  rect(x + 8, y + 8, w / 2 - 8, h - 16, 6);
  fill(240, 244, 255);
  rect(midX, y + 8, w / 2 - 8, h - 16, 6);
  fill(255, 205, 205, 200);
  rect(midX - depW, y + 8, depW, h - 16);
  fill(205, 215, 255, 200);
  rect(midX, y + 8, depW, h - 16);

  noStroke(); fill(190, 30, 30); textAlign(CENTER, CENTER); textSize(13); textStyle(BOLD);
  text('−', midX - depW * 0.6, y + h * 0.32);
  text('−', midX - depW * 0.6, y + h * 0.68);
  fill(30, 60, 190);
  text('+', midX + depW * 0.6, y + h * 0.32);
  text('+', midX + depW * 0.6, y + h * 0.68);
  textStyle(NORMAL);

  const ay = y + h * 0.5;
  stroke(230, 150, 30); strokeWeight(2.5);
  line(midX + depW - 6, ay, midX - depW + 6, ay);
  noStroke(); fill(230, 150, 30);
  triangle(midX - depW + 6, ay - 6, midX - depW + 6, ay + 6, midX - depW - 4, ay);
  fill(200, 120, 10); textAlign(CENTER, BOTTOM); textSize(11); textStyle(BOLD);
  text('Built-in Electric Field', midX, ay - 12);
  textStyle(NORMAL);

  noStroke(); fill(40); textAlign(CENTER, TOP); textSize(11.5);
  text('Drift current  =  Diffusion current   (equilibrium)', midX, y + h - 20);
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
