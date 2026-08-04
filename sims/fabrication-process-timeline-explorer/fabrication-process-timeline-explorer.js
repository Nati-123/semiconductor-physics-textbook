// Fabrication Process Timeline Explorer MicroSim
// A step-by-step guided tour of Chapter 19's storyline: crystal growth
// and wafer preparation, oxidation, photolithography, deposition,
// doping, etching, metallization, CMOS process integration, and yield.
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
  { title: '1. Crystal Growth & Wafer Prep', text: 'A Czochralski or float-zone ingot is sliced and polished into a flat, mirror-smooth wafer.', draw: drawStepIngot },
  { title: '2. Thermal Oxidation', text: 'The Deal-Grove growth law governs oxide thickness: linear at first, then parabolic as oxide thickens and slows diffusion of oxidant.', draw: drawStepOxidation },
  { title: '3. Photolithography', text: 'Photoresist, UV exposure, and mask alignment print a pattern with resolution CD = k1·λ/NA.', draw: drawStepLitho },
  { title: '4. Thin-Film Deposition', text: 'CVD, PVD, or ALD adds new material layers, trading off deposition rate against conformality.', draw: drawStepDeposition },
  { title: '5. Diffusion & Implantation', text: 'Diffusion places dopants thermally from the surface; ion implantation fires them directly to a controlled depth.', draw: drawStepDoping },
  { title: '6. Etching', text: 'Wet etching is isotropic; dry and plasma etching use directional ion bombardment for anisotropic, near-vertical profiles.', draw: drawStepEtch },
  { title: '7. Metallization', text: 'Metal layers form ohmic contacts and route signals across the chip through multiple stacked interconnect layers.', draw: drawStepMetal },
  { title: '8. CMOS Process Integration', text: 'All of the above sequence together, with the patterned gate self-aligning the source/drain implants.', draw: drawStepCMOS },
  { title: '9. Yield & Reliability', text: 'Manufacturing defects are statistically inevitable; yield falls exponentially with defect density and die area, Y = e^(−D0·A).', draw: drawStepYield }
];

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);
  describe('Fabrication process timeline explorer: a step-by-step guided tour of Chapter 19, from crystal growth through oxidation, photolithography, deposition, doping, etching, metallization, CMOS integration, and yield', LABEL);
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

function drawStepIngot(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  noStroke(); fill(230, 100, 60, 200);
  ellipse(cx - w * 0.22, cy, w * 0.18, h * 0.5);
  fill(240, 245, 255);
  ellipse(cx + w * 0.22, cy, w * 0.22, h * 0.5);
  stroke(160, 200, 255); strokeWeight(1.5); noFill();
  ellipse(cx + w * 0.22, cy, w * 0.22, h * 0.5);
  noStroke(); fill(60); textAlign(CENTER, TOP); textSize(10.5);
  text('melt → ingot → polished wafer', cx, cy + h * 0.32);
}

function drawStepOxidation(x, y, w, h) {
  const chartX = x + 50, chartY = y + 16, chartW = w - 90, chartH = h - 46;
  const pts = [];
  for (let t = 0; t <= 8; t += 0.1) pts.push({ x: t, y: sqrt(0.045 * t) });
  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 8, 0, 0.6, [{ points: pts, color: color(90, 62, 237) }], { xLabel: 'time (hr)', yLabel: 'x_ox (μm)' });
}

function drawStepLitho(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  noStroke(); fill(230);
  rect(cx - 120, cy - 20, 240, 40);
  fill(90, 62, 237);
  rect(cx - 30, cy - 20, 60, 40);
  fill(60); textAlign(CENTER, TOP); textSize(10.5);
  text('CD = k1·λ/NA', cx, cy + 30);
}

function drawStepDeposition(x, y, w, h) {
  const items = ['CVD', 'PVD', 'ALD'];
  const colors = [color(90, 62, 237), color(230, 150, 30), color(40, 130, 70)];
  const n = items.length;
  const boxW = (w - 30) / n;
  for (let i = 0; i < n; i++) {
    const bx = x + i * (boxW + 15) + 15;
    noStroke(); fill(colors[i]);
    rect(bx, y + h * 0.3, boxW - 10, h * 0.4, 4);
    fill(255); textAlign(CENTER, CENTER); textSize(11);
    text(items[i], bx + (boxW - 10) / 2, y + h * 0.5);
  }
  fill(60); textAlign(CENTER, TOP); textSize(10.5);
  text('conformality: PVD < CVD < ALD', x + w / 2, y + h * 0.78);
}

function drawStepDoping(x, y, w, h) {
  const chartX = x + 50, chartY = y + 16, chartW = w - 90, chartH = h - 46;
  const pts1 = [], pts2 = [];
  for (let xu = 0; xu <= 2; xu += 0.02) {
    pts1.push({ x: xu, y: exp(-xu * xu / 0.4) });
    pts2.push({ x: xu, y: exp(-((xu - 1.0) * (xu - 1.0)) / 0.1) });
  }
  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 2, 0, 1, [
    { points: pts1, color: color(90, 62, 237) },
    { points: pts2, color: color(230, 90, 60) }
  ], { xLabel: 'depth (μm)', yLabel: 'N(x)' });
  fill(90, 62, 237); noStroke(); textAlign(LEFT, TOP); textSize(10);
  text('— diffusion', chartX, chartY + 2);
  fill(230, 90, 60);
  text('— implantation', chartX, chartY + 15);
}

function drawStepEtch(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  noStroke(); fill(225, 225, 235);
  rect(x + w * 0.15, cy - 10, w * 0.7, h * 0.35);
  fill(255);
  beginShape();
  vertex(cx - 40, cy - 10);
  vertex(cx - 60, cy + 5);
  vertex(cx - 45, cy + h * 0.25);
  vertex(cx + 45, cy + h * 0.25);
  vertex(cx + 60, cy + 5);
  vertex(cx + 40, cy - 10);
  endShape(CLOSE);
  fill(255, 210, 90);
  rect(cx - 40, cy - 24, 80, 14);
  fill(60); textAlign(CENTER, TOP); textSize(10.5);
  text('undercut vs. vertical anisotropic etch', cx, cy + h * 0.3);
}

function drawStepMetal(x, y, w, h) {
  const cx = x + w / 2;
  for (let i = 0; i < 4; i++) {
    noStroke(); fill(255, 190, 60, 220 - i * 30);
    rect(x + w * 0.2, y + h * 0.2 + i * 18, w * 0.6, 10);
  }
  fill(60); textAlign(CENTER, TOP); textSize(10.5);
  text('multiple stacked interconnect layers', cx, y + h * 0.2 + 4 * 18 + 8);
}

function drawStepCMOS(x, y, w, h) {
  const cx = x + w / 2, cy = y + h * 0.6;
  noStroke(); fill(230, 230, 240);
  rect(x + w * 0.2, cy, w * 0.6, h * 0.3);
  fill(150, 130, 220);
  rect(cx - 25, cy - 20, 50, 20);
  fill(230, 120, 90, 220);
  rect(x + w * 0.22, cy, w * 0.18, h * 0.2);
  rect(x + w * 0.6, cy, w * 0.18, h * 0.2);
  fill(60); textAlign(CENTER, TOP); textSize(10.5);
  text('gate self-aligns source/drain implants', cx, y + h * 0.06);
}

function drawStepYield(x, y, w, h) {
  const chartX = x + 50, chartY = y + 16, chartW = w - 90, chartH = h - 46;
  const pts = [];
  for (let a = 0; a <= 5; a += 0.1) pts.push({ x: a, y: exp(-0.5 * a) });
  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 5, 0, 1, [{ points: pts, color: color(90, 62, 237) }], { xLabel: 'die area (cm²)', yLabel: 'yield Y' });
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
