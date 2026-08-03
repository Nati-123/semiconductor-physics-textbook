// Optical and Thermal Properties Interactive Walkthrough MicroSim
// A step-by-step guided tour of Chapter 17's storyline: photon
// absorption, optical absorption and the absorption coefficient,
// photoconductivity, the photodiode, the solar cell, radiative
// recombination and the LED, thermal conductivity, and thermal
// generation rate. Canvas-based Prev/Next buttons advance through a
// fixed sequence of illustrations.
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
    title: '1. Photon Absorption',
    text: 'A photon with hν ≥ Eg excites an electron across the gap, creating an electron-hole pair — the microscopic event behind everything in this chapter.',
    draw: drawStepPhoton
  },
  {
    title: '2. Optical Absorption & the Absorption Coefficient',
    text: 'Macroscopically, a beam of photons decays exponentially with depth: I(x) = I0·e^(−αx). Direct-gap materials absorb far more strongly (larger α) than indirect-gap materials near the band edge.',
    draw: drawStepAbsorption
  },
  {
    title: '3. Photoconductivity',
    text: 'Absorbed light creates excess carriers, Δn = Δp = Gτ, raising conductivity by Δσ = q(Δn·μn + Δp·μp) — the basis of a simple light sensor.',
    draw: drawStepPhotoconductivity
  },
  {
    title: '4. The Photodiode',
    text: 'Inside a p-n junction, absorbed photons create carriers swept apart by the field, adding a photocurrent IL: I = I0(e^(V/VT)−1) − IL.',
    draw: drawStepPhotodiode
  },
  {
    title: '5. The Solar Cell',
    text: 'Operated near zero bias, the same junction delivers power instead of sensing light, characterized by Voc and Isc.',
    draw: drawStepSolarCell
  },
  {
    title: '6. Radiative Recombination & the LED',
    text: 'Running the junction backward: forward bias in a direct-gap material drives radiative recombination, emitting photons of wavelength λ ≈ 1240/Eg(eV) nm.',
    draw: drawStepLED
  },
  {
    title: '7. Thermal Conductivity',
    text: 'κ governs how efficiently a device sheds heat: ΔT = Pt/(κA) — a critical factor in real device packaging.',
    draw: drawStepThermalConductivity
  },
  {
    title: '8. Thermal Generation Rate',
    text: 'Gth = ni/τ0 quantifies thermally-generated carriers; inside a depletion region this produces a real generation current Igen = qGthWA, often dominating ideal diffusion current.',
    draw: drawStepGenerationRate
  }
];

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);
  describe('Optical and thermal properties interactive walkthrough: a step-by-step guided tour through photon absorption, optical absorption, photoconductivity, the photodiode, the solar cell, radiative recombination, the LED, thermal conductivity, and thermal generation rate', LABEL);
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
  textAlign(LEFT, TOP); textSize(12.5);
  text(step.text, txtX + 14, txtY + 10, txtW - 28, txtH - 18);

  drawControls();
}

function drawStepPhoton(x, y, w, h) {
  const cx = x + w * 0.3, cy = y + h / 2;
  smlDrawLatticeGrid(cx - 45, cy - 45, 3, 3, 45, { atomLabel: 'Si', atomColor: color(150, 180, 230), atomR: 12 });
  stroke(230, 170, 30); strokeWeight(2.5);
  line(x + 20, y + 16, cx - 40, cy - 40);
  noStroke(); fill(230, 170, 30);
  triangle(cx - 40, cy - 40, cx - 48, cy - 34, cx - 40, cy - 28);
  fill(200, 140, 20); textAlign(LEFT, TOP); textSize(11);
  text('photon (hν ≥ Eg)', x + 16, y + 4);

  const arrowX = x + w * 0.62;
  stroke(120); strokeWeight(2);
  line(cx + 50, cy, arrowX - 15, cy);
  noStroke(); fill(120);
  triangle(arrowX - 15, cy - 6, arrowX - 15, cy + 6, arrowX - 5, cy);

  smlDrawElectron(arrowX + 40, cy - 30, 13);
  smlDrawHole(arrowX + 40, cy + 30, 13);
  noStroke(); fill(40, 40, 220); textAlign(LEFT, CENTER); textSize(10.5);
  text('e⁻', arrowX + 58, cy - 30);
  fill(220, 60, 60);
  text('h⁺', arrowX + 58, cy + 30);
}

function drawStepAbsorption(x, y, w, h) {
  const chartX = x + 50, chartY = y + 16, chartW = w - 90, chartH = h - 50;
  const pts1 = [], pts2 = [];
  for (let xv = 0; xv <= 5; xv += 0.1) { pts1.push({ x: xv, y: Math.exp(-xv) }); pts2.push({ x: xv, y: Math.exp(-xv * 0.15) }); }
  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 5, 0, 1.05, [
    { points: pts1, color: color(230, 90, 60) },
    { points: pts2, color: color(90, 62, 237) }
  ], { xLabel: 'depth x', yLabel: 'I(x)/I0', yLabelOffset: 34 });
  noStroke(); fill(230, 90, 60); textAlign(LEFT, TOP); textSize(10);
  text('— direct gap (large α)', chartX, chartY + 4);
  fill(90, 62, 237);
  text('— indirect gap (small α)', chartX, chartY + 18);
}

function drawStepPhotoconductivity(x, y, w, h) {
  const midX = x + w / 2;
  noStroke(); fill(255, 210, 90);
  rect(x + 20, y + h * 0.3, w - 40, h * 0.4, 6);
  fill(30); textAlign(CENTER, CENTER); textSize(12);
  text('illuminated bar: brighter → higher Δσ', midX, y + h * 0.5);
  fill(90); textAlign(CENTER, TOP); textSize(11);
  text('Δσ = q(Δn·μn + Δp·μp),  Δn = Δp = Gτ', midX, y + h * 0.75);
}

function drawStepPhotodiode(x, y, w, h) {
  const chartX = x + 50, chartY = y + 16, chartW = w - 90, chartH = h - 50;
  const pts = [];
  for (let v = -0.1; v <= 0.5; v += 0.01) pts.push({ x: v, y: max(-1, Math.min(0.3, (Math.exp(v / 0.15) - 1) - 0.5)) });
  smlDrawLineChart(chartX, chartY, chartW, chartH, -0.1, 0.5, -1, 0.3, [
    { points: pts, color: color(90, 62, 237) }
  ], { xLabel: 'V', yLabel: 'I (norm.)', yLabelOffset: 34 });
  noStroke(); fill(40); textAlign(CENTER, TOP); textSize(11);
  text('I = I0(e^(V/VT)−1) − IL', x + w / 2, y + h - 18);
}

function drawStepSolarCell(x, y, w, h) {
  const cx = x + w / 2;
  noStroke(); fill(230, 245, 235);
  rect(x + 30, y + 10, w - 60, h - 20, 6);
  fill(40, 150, 90); textAlign(CENTER, CENTER); textSize(12); textStyle(BOLD);
  text('power-generating region\n(V > 0, I < 0)', cx, y + h * 0.4);
  textStyle(NORMAL);
  fill(30); textAlign(CENTER, TOP); textSize(11);
  text('Voc, Isc mark the axis crossings', cx, y + h * 0.7);
}

function drawStepLED(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  noStroke(); fill(220, 60, 60);
  circle(cx, cy, 50);
  stroke(230, 170, 30); strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    const ang = -PI / 2 + (i - 2) * 0.35;
    line(cx + 30 * cos(ang), cy + 30 * sin(ang), cx + 55 * cos(ang), cy + 55 * sin(ang));
  }
  noStroke(); fill(30); textAlign(CENTER, TOP); textSize(11);
  text('λ ≈ 1240 / Eg(eV) nm', cx, y + h - 26);
}

function drawStepThermalConductivity(x, y, w, h) {
  const slabX = x + w * 0.4, slabY = y + h * 0.2, slabW = w * 0.2, slabH = h * 0.6;
  noStroke(); fill(200, 210, 230);
  rect(slabX, slabY, slabW, slabH);
  stroke(230, 90, 60); strokeWeight(2.5);
  for (let i = 0; i < 3; i++) {
    const ay = slabY + (i + 0.5) * slabH / 3;
    line(slabX - 40, ay, slabX - 6, ay);
    noStroke(); fill(230, 90, 60);
    triangle(slabX - 6, ay - 5, slabX - 6, ay + 5, slabX + 2, ay);
    stroke(230, 90, 60); strokeWeight(2.5);
  }
  noStroke(); fill(30); textAlign(CENTER, TOP); textSize(11);
  text('ΔT = P·t / (κ·A)', x + w / 2, y + h - 24);
}

function drawStepGenerationRate(x, y, w, h) {
  const items = [{ label: 'Igen', val: 0.9, col: color(230, 90, 60) }, { label: 'I0 (diffusion)', val: 0.15, col: color(90, 62, 237) }];
  const barX = x + w * 0.3, barW = w * 0.4;
  items.forEach((it, i) => {
    const by = y + 20 + i * 40;
    noStroke(); fill(it.col);
    rect(barX, by, barW * it.val, 22, 3);
    fill(30); textAlign(LEFT, CENTER); textSize(11);
    text(it.label, barX + barW + 8, by + 11);
  });
  noStroke(); fill(90); textAlign(CENTER, TOP); textSize(10.5);
  text('generation current often dominates real diode leakage', x + w / 2, y + h - 20);
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
