// Wafer Fabrication Explorer MicroSim
// Step-through tour from a cylindrical crystal ingot through slicing,
// lapping, and polishing to a finished, mirror-smooth wafer.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let currentStep = 0;
let prevBtn = { x: 0, y: 0, w: 90, h: 36 };
let nextBtn = { x: 0, y: 0, w: 90, h: 36 };

const STEPS = [
  { title: '1. Single-Crystal Ingot', text: 'A cylindrical single-crystal ingot, grown by Czochralski or float-zone methods, arrives ready for slicing.', draw: drawIngot },
  { title: '2. Wafer Slicing', text: 'A diamond wire saw slices the ingot into thin discs. Each cut consumes a "kerf" width of ingot material as sawdust.', draw: drawSlicing },
  { title: '3. Lapping', text: 'Lapping mechanically grinds both wafer faces flat, removing the rough surface and sawing damage left by the wire saw.', draw: drawLapping },
  { title: '4. Chemical-Mechanical Polishing', text: 'CMP combines a chemical slurry with mechanical polishing to produce an atomically flat, mirror-smooth surface.', draw: drawPolishing },
  { title: '5. Finished Wafer', text: 'The polished wafer is ready for thermal oxidation, photolithography, and every later process step in this chapter.', draw: drawFinished }
];

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);
  describe('Wafer fabrication explorer: a step-by-step guided tour from a cylindrical crystal ingot through slicing, lapping, and polishing to a finished wafer', LABEL);
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

function drawIngot(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  noStroke(); fill(220, 220, 230);
  rectMode(CENTER);
  rect(cx, cy, w * 0.75, h * 0.32, 10);
  rectMode(CORNER);
  fill(60); textAlign(CENTER, TOP); textSize(11);
  text('cylindrical single-crystal ingot', cx, cy + h * 0.2);
}

function drawSlicing(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  const n = 8;
  const totalW = w * 0.7;
  const sliceW = totalW / n * 0.7;
  const gap = totalW / n * 0.3;
  for (let i = 0; i < n; i++) {
    const sx = x + w * 0.15 + i * (sliceW + gap);
    noStroke(); fill(220, 220, 230);
    rect(sx, cy - h * 0.16, sliceW, h * 0.32);
    stroke(200, 90, 60); strokeWeight(1);
    line(sx + sliceW + gap / 2, cy - h * 0.2, sx + sliceW + gap / 2, cy + h * 0.2);
  }
  noStroke(); fill(60); textAlign(CENTER, TOP); textSize(11);
  text('wire saw cuts leave a kerf gap between each wafer', cx, cy + h * 0.28);
}

function drawLapping(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  noStroke(); fill(225, 225, 235);
  rectMode(CENTER);
  rect(cx, cy, w * 0.5, h * 0.14, 4);
  rectMode(CORNER);
  fill(150, 150, 160, 150);
  for (let i = 0; i < 12; i++) {
    const px = cx - w * 0.22 + (i / 11) * w * 0.44;
    ellipse(px, cy - h * 0.09 - 4, 6, 6);
  }
  fill(60); textAlign(CENTER, TOP); textSize(11);
  text('mechanical grinding removes saw damage from both faces', cx, cy + h * 0.16);
}

function drawPolishing(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  noStroke();
  for (let i = 0; i < 20; i++) {
    const t = i / 19;
    fill(lerpColor(color(225, 225, 235), color(250, 250, 255), t));
    rectMode(CENTER);
    rect(cx, cy, w * 0.5, h * 0.14 * (1 - t * 0.15), 4);
  }
  rectMode(CORNER);
  stroke(120, 200, 255, 150); strokeWeight(1);
  noFill();
  ellipse(cx, cy - h * 0.07, w * 0.42, h * 0.05);
  noStroke(); fill(60); textAlign(CENTER, TOP); textSize(11);
  text('CMP slurry + mechanical polish produces a mirror-smooth surface', cx, cy + h * 0.16);
}

function drawFinished(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  noStroke();
  fill(240, 245, 255);
  ellipse(cx, cy, w * 0.55, h * 0.55);
  stroke(160, 200, 255); strokeWeight(2); noFill();
  ellipse(cx, cy, w * 0.55, h * 0.55);
  noStroke(); fill(90, 62, 237); textAlign(CENTER, CENTER); textSize(13);
  text('finished, polished wafer', cx, cy);
  fill(60); textAlign(CENTER, TOP); textSize(11);
  text('ready for thermal oxidation and photolithography', cx, cy + h * 0.32);
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
