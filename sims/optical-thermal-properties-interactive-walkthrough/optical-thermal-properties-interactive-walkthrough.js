// Optical and Thermal Properties Interactive Walkthrough MicroSim
// A step-by-step guided tour of Chapter 17's storyline: photon
// absorption, optical absorption and the absorption coefficient,
// photoconductivity, the photodiode, the solar cell, radiative
// recombination and the LED, thermal conductivity, and thermal
// generation rate. Canvas-based Prev/Next buttons advance through a
// fixed sequence of illustrations; the final step swaps Next for Restart.
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
let nextBtn = { x: 0, y: 0, w: 110, h: 36 };
let dotsX0 = 0, dotsY = 0;

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
    text: 'Operated near zero bias, the same junction delivers power instead of sensing light: the shaded region is where I×V is negative-times-positive, i.e. power flows OUT, characterized by Voc, Isc, and a max-power point.',
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
    title: '8. Thermal Generation Rate — Completing the Picture',
    text: 'Gth = ni(T)/τ0 quantifies thermally-generated carriers; inside a depletion region this produces a real generation current Igen = qGthWA. Since ni(T) rises steeply with the SAME temperature Step 7 conducts away, optical and thermal properties close the loop together.',
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

  // Title, pushed clear of the fixed top-right fullscreen button
  // (vertically below its ~26px-tall zone, not just horizontally).
  // NOTE: p5's text(str,x,y,w) treats x as the wrap-box's LEFT edge even
  // under textAlign(CENTER,*), not the box's center -- so a truly
  // centered, wrappable title needs x = canvasWidth/2 - boxW/2.
  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  const titleBoxW = canvasWidth - 20;
  text(step.title, canvasWidth / 2 - titleBoxW / 2, 30, titleBoxW);

  const illX = 20, illY = 54, illW = canvasWidth - 40, illH = drawHeight * 0.48;
  noStroke(); fill(255);
  stroke(210); strokeWeight(1);
  rect(illX, illY, illW, illH, 8);
  step.draw(illX, illY, illW, illH);

  const txtX = 20, txtY = illY + illH + 14, txtW = canvasWidth - 40, txtH = drawHeight - txtY - 14;
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
  const chartX = x + 50, chartY = y + 36, chartW = w - 90, chartH = h - 68;
  const pts1 = [], pts2 = [];
  for (let xv = 0; xv <= 5; xv += 0.1) { pts1.push({ x: xv, y: Math.exp(-xv) }); pts2.push({ x: xv, y: Math.exp(-xv * 0.15) }); }
  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 5, 0, 1.05, [
    { points: pts1, color: color(230, 90, 60) },
    { points: pts2, color: color(90, 62, 237) }
  ], { xLabel: 'depth x', yLabel: 'I(x)/I0', yLabelOffset: 34, yTicks: [1.0, 0.5, 0.0], xTicks: [0, 1, 2, 3, 4, 5] });

  noStroke(); fill(230, 90, 60); textAlign(LEFT, TOP); textSize(10.5);
  text('— direct gap (large α, e.g. GaAs)', chartX, y + 8);
  fill(90, 62, 237);
  text('— indirect gap (small α, e.g. Si)', chartX, y + 21);
}

function drawStepPhotoconductivity(x, y, w, h) {
  const barX = x + w * 0.18, barW = w * 0.64, barY = y + h * 0.16, barH = h * 0.34;
  stroke(230, 170, 30); strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    const rx = barX + (i + 0.5) * barW / 5;
    line(rx - 8, barY - 20, rx, barY - 2);
    noStroke(); fill(230, 170, 30);
    triangle(rx - 2, barY - 6, rx + 4, barY - 6, rx, barY);
    stroke(230, 170, 30); strokeWeight(2);
  }
  noStroke(); fill(255, 205, 90);
  rect(barX, barY, barW, barH, 6);
  stroke(120); strokeWeight(1); noFill();
  rect(barX, barY, barW, barH, 6);

  for (let i = 0; i < 4; i++) {
    const ex = barX + 16 + (i / 3) * (barW - 32);
    smlDrawElectron(ex, barY + barH * 0.32, 9);
    smlDrawHole(ex, barY + barH * 0.7, 9);
  }

  noStroke(); fill(30); textAlign(CENTER, TOP); textSize(11.5);
  text('illuminated photoconductor: e⁻/h⁺ pairs raise conductivity', x + w / 2, barY + barH + 12);
  fill(90); textAlign(CENTER, TOP); textSize(11);
  text('Δσ = q(Δn·μn + Δp·μp),   Δn = Δp = Gτ', x + w / 2, barY + barH + 32);
}

function drawStepPhotodiode(x, y, w, h) {
  const chartX = x + 50, chartY = y + 20, chartW = w - 90, chartH = h - 60;
  const pts = [];
  for (let v = -0.1; v <= 0.5; v += 0.01) pts.push({ x: v, y: max(-1, Math.min(0.3, (Math.exp(v / 0.15) - 1) - 0.5)) });
  smlDrawLineChart(chartX, chartY, chartW, chartH, -0.1, 0.5, -1, 0.3, [
    { points: pts, color: color(90, 62, 237) }
  ], { xLabel: 'V', yLabel: 'I (norm.)', yLabelOffset: 34, xTicks: [0, 0.3], yTicks: [0, -0.5, -1] });
  noStroke(); fill(230, 90, 60); textAlign(LEFT, TOP); textSize(10);
  text('IL shifts the whole curve down', chartX, chartY - 14);
  fill(40); textAlign(CENTER, TOP); textSize(11);
  text('I = I0(e^(V/VT)−1) − IL', x + w / 2, y + h - 16);
}

function drawStepSolarCell(x, y, w, h) {
  const chartX = x + 50, chartY = y + 20, chartW = w - 90, chartH = h - 56;
  const IL = 0.5;
  const pts = [];
  for (let v = -0.1; v <= 0.5; v += 0.01) pts.push({ x: v, y: (Math.exp(v / 0.15) - 1) - IL });
  const info = smlDrawLineChart(chartX, chartY, chartW, chartH, -0.1, 0.5, -1, 0.3, [], {});
  noStroke(); fill(230, 245, 235, 200);
  const x0 = info.xToPx(0), y0 = info.yToPx(0);
  rect(x0, chartY, info.xToPx(0.3) - x0, y0 - chartY);
  smlDrawLineChart(chartX, chartY, chartW, chartH, -0.1, 0.5, -1, 0.3, [
    { points: pts.map(p => ({ x: p.x, y: max(-1, Math.min(0.3, p.y)) })), color: color(40, 150, 90) }
  ], { xLabel: 'V', yLabel: 'I (norm.)', yLabelOffset: 34, xTicks: [0, 0.3], yTicks: [0, -0.5] });
  noStroke(); fill(40, 150, 90); textAlign(LEFT, TOP); textSize(10.5); textStyle(BOLD);
  text('shaded: power out (V>0, I<0)', chartX + 4, chartY + 4);
  textStyle(NORMAL); fill(30); textAlign(CENTER, TOP); textSize(11);
  text('Voc, Isc mark the axis crossings; max power lies strictly between', x + w / 2, y + h - 14);
}

function drawStepLED(x, y, w, h) {
  const cx = x + w * 0.32, cy = y + h / 2;
  noStroke(); fill(220, 60, 60);
  circle(cx, cy, min(h * 0.5, 60));
  stroke(230, 170, 30); strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    const ang = -PI / 2 + (i - 2) * 0.35;
    const r0 = min(h * 0.5, 60) * 0.55, r1 = min(h * 0.5, 60) * 1.0;
    line(cx + r0 * cos(ang), cy + r0 * sin(ang), cx + r1 * cos(ang), cy + r1 * sin(ang));
  }
  const specX = x + w * 0.56, specW = w * 0.38, specY = cy - 16, specH = 32;
  for (let px = 0; px < specW; px++) {
    const t = px / specW;
    stroke(lerpColor(color(140, 0, 0), color(255, 210, 0), t));
    line(specX + px, specY, specX + px, specY + specH);
  }
  noFill(); stroke(120); strokeWeight(1);
  rect(specX, specY, specW, specH);
  const markX = specX + specW * 0.22;
  stroke(0); strokeWeight(2); line(markX, specY - 8, markX, specY + specH + 8);
  noStroke(); fill(30); textAlign(CENTER, TOP); textSize(10.5);
  text('red LED', specX + specW / 2, specY + specH + 12);
  fill(30); textAlign(CENTER, BOTTOM); textSize(11);
  text('λ ≈ 1240 / Eg(eV) nm', x + w / 2, y + h - 8);
}

function drawStepThermalConductivity(x, y, w, h) {
  const slabX = x + w * 0.4, slabY = y + h * 0.18, slabW = w * 0.16, slabH = h * 0.56;
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
  noStroke(); fill(30); textAlign(CENTER, TOP); textSize(10);
  text('heat, P →', slabX - 22, slabY - 14);

  const cardX = slabX + slabW + 30, cardW = min(w * 0.3, 180), cardH = 56, cardY = y + h / 2 - cardH / 2;
  noStroke(); fill(240, 245, 255); stroke(168, 200, 255); strokeWeight(1);
  rect(cardX, cardY, cardW, cardH, 6);
  noStroke(); fill(90, 62, 237); textAlign(CENTER, TOP); textSize(12); textStyle(BOLD);
  text('ΔT = P·t / (κ·A)', cardX + cardW / 2, cardY + 10);
  textStyle(NORMAL); fill(60); textSize(9.5);
  text('steady-state, 1D conduction', cardX + cardW / 2, cardY + 30);

  noStroke(); fill(30); textAlign(CENTER, TOP); textSize(10);
  text('slab: thickness t, area A, conductivity κ', x + w / 2, y + h - 18);
}

function drawStepGenerationRate(x, y, w, h) {
  const items = [{ label: 'I_gen (hot)', val: 0.95, col: color(230, 90, 60) }, { label: 'I0 (diffusion)', val: 0.12, col: color(90, 62, 237) }];
  const barX = x + w * 0.22, barW = w * 0.34;
  items.forEach((it, i) => {
    const by = y + h * 0.22 + i * (h * 0.24);
    noStroke(); fill(it.col);
    rect(barX, by, barW * it.val, h * 0.14, 3);
    fill(30); textAlign(LEFT, CENTER); textSize(11);
    text(it.label, barX + barW + 8, by + h * 0.07);
  });
  // Thermometer placed clear of both bars and their labels, on the right.
  smlDrawThermometer(x + w * 0.82, y + h * 0.2, 14, h * 0.5, 0.8, '');
  noStroke(); fill(60); textAlign(CENTER, TOP); textSize(9.5);
  text('T', x + w * 0.82 + 7, y + h * 0.2 + h * 0.5 + 4);

  noStroke(); fill(90); textAlign(CENTER, TOP); textSize(10.5);
  const capW = w - 30;
  text('G_th = n_i(T)/τ0 rises steeply with T → I_gen often dominates real diode leakage', x + w / 2 - capW / 2, y + h - 22, capW);
}

function drawControls() {
  const cy = drawHeight + (controlHeight - prevBtn.h) / 2;
  prevBtn.x = 20; prevBtn.y = cy;
  nextBtn.x = canvasWidth - 20 - nextBtn.w; nextBtn.y = cy;

  const isLast = currentStep === STEPS.length - 1;
  smlDrawButton(prevBtn.x, prevBtn.y, prevBtn.w, prevBtn.h, '◀ Prev', false);
  smlDrawButton(nextBtn.x, nextBtn.y, nextBtn.w, nextBtn.h, isLast ? '⟲ Restart' : 'Next ▶', isLast);

  noStroke(); fill(30); textAlign(CENTER, CENTER); textSize(13);
  text('Step ' + (currentStep + 1) + ' of ' + STEPS.length, canvasWidth / 2, cy + prevBtn.h / 2);

  dotsY = cy + prevBtn.h + 12;
  const totalDotsW = STEPS.length * 16;
  dotsX0 = canvasWidth / 2 - totalDotsW / 2 + 8;
  for (let i = 0; i < STEPS.length; i++) {
    noStroke();
    fill(i === currentStep ? color(90, 62, 237) : color(210));
    circle(dotsX0 + i * 16, dotsY, 8);
  }
}

function mousePressed() {
  if (smlPointInRect(mouseX, mouseY, prevBtn.x, prevBtn.y, prevBtn.w, prevBtn.h)) {
    currentStep = (currentStep - 1 + STEPS.length) % STEPS.length;
    return;
  }
  if (smlPointInRect(mouseX, mouseY, nextBtn.x, nextBtn.y, nextBtn.w, nextBtn.h)) {
    currentStep = (currentStep === STEPS.length - 1) ? 0 : currentStep + 1;
    return;
  }
  // Step dots: click to jump directly to any step (generous 12px hit radius).
  for (let i = 0; i < STEPS.length; i++) {
    if (dist(mouseX, mouseY, dotsX0 + i * 16, dotsY) <= 12) {
      currentStep = i;
      return;
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
