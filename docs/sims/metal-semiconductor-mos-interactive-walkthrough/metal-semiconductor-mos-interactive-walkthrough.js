// Metal-Semiconductor and MOS Junctions Interactive Walkthrough MicroSim
// A step-by-step guided tour of Chapter 16's two-part storyline: work
// function and electron affinity, barrier height, Schottky barriers,
// ohmic/rectifying contacts, the Schottky diode, the MOS capacitor,
// flat-band voltage, accumulation/depletion/inversion, and threshold
// voltage. Canvas-based Prev/Next buttons advance through a fixed
// sequence of illustrations.
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
    title: '1. Work Function & Electron Affinity',
    text: 'A metal\'s work function ΦM and a semiconductor\'s electron affinity χ (plus its doping-dependent Fermi level) are the two material constants that set what happens when they touch.',
    draw: drawStepWorkFunction
  },
  {
    title: '2. Barrier Height Forms',
    text: 'Contact forces a single flat Fermi level, bending the semiconductor bands near the surface. The barrier height ΦB = ΦM − χ (n-type) sets how hard it is for carriers to cross.',
    draw: drawStepBarrier
  },
  {
    title: '3. Schottky Barrier: A Rectifying Junction',
    text: 'When ΦM > ΦS on n-type material, a depleted, rectifying Schottky barrier forms — electrostatically similar to a p-n junction, but built from entirely different materials.',
    draw: drawStepSchottky
  },
  {
    title: '4. Ohmic vs. Rectifying Contacts',
    text: 'The same metal can be ohmic on one doping type and rectifying on the other. Heavy doping can also force an ohmic contact via tunneling, regardless of the metal.',
    draw: drawStepOhmicRectifying
  },
  {
    title: '5. The Schottky Diode',
    text: 'Thermionic emission over the barrier gives Schottky diodes a saturation current far larger than a p-n diode\'s — lower turn-on voltage, faster switching, no minority-carrier storage.',
    draw: drawStepSchottkyDiode
  },
  {
    title: '6. The MOS Capacitor & Gate Oxide',
    text: 'A gate, an insulating gate oxide, and a semiconductor stack into a MOS capacitor. No DC current flows — the gate voltage instead controls the semiconductor surface electrostatically.',
    draw: drawStepMOSCap
  },
  {
    title: '7. Flat-Band Voltage',
    text: 'VFB = ΦM − ΦS is the gate voltage that leaves the semiconductor bands perfectly flat, the zero-reference point for everything that follows.',
    draw: drawStepFlatBand
  },
  {
    title: '8. Accumulation → Depletion → Weak Inversion',
    text: 'Sweeping gate voltage away from VFB moves the surface through accumulation (majority carriers pile up), depletion (exposed fixed charge), and weak inversion (minority carriers start growing).',
    draw: drawStepRegimeSweep
  },
  {
    title: '9. Strong Inversion & the Inversion Layer',
    text: 'At ψs = 2φF, surface electron concentration equals bulk hole concentration NA — a thin inversion layer forms, the conducting channel of an n-channel MOSFET.',
    draw: drawStepStrongInversion
  },
  {
    title: '10. Threshold Voltage',
    text: 'VT = VFB + 2φF + Qdep,max/Cox is the gate voltage that switches on the channel — the single number that defines a MOSFET\'s on/off behavior, ahead in Chapter 18.',
    draw: drawStepThreshold
  }
];

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);
  describe('Metal-semiconductor and MOS junctions interactive walkthrough: a ten-step guided tour through work function, barrier height, Schottky barriers, ohmic and rectifying contacts, the Schottky diode, the MOS capacitor, flat-band voltage, accumulation, depletion, inversion, and threshold voltage', LABEL);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const step = STEPS[currentStep];

  // Keep clear of the fixed fullscreen button (top:4px;right:4px) with a
  // blank top margin, then auto-shrink the title to fit one line at any
  // canvas width -- titles here range 30-46 characters and previously used
  // a p5 text() wrap-width with CENTER align, which anchors the wrap box's
  // LEFT edge at x (not its center), so a "centered" box at canvasWidth/2
  // actually started there and grew rightward, straight under the button.
  const topSafe = 26;
  fill(20); noStroke(); textAlign(CENTER, TOP);
  let titleSize = 15.5;
  textSize(titleSize);
  const maxTitleW = canvasWidth - 24;
  if (textWidth(step.title) > maxTitleW) {
    titleSize = max(10, titleSize * maxTitleW / textWidth(step.title));
    textSize(titleSize);
  }
  text(step.title, canvasWidth / 2, topSafe + 6);
  const contentTop = topSafe + titleSize * 1.3 + 12;

  const illX = 20, illY = contentTop, illW = canvasWidth - 40, illH = drawHeight * 0.46;
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

function drawStepWorkFunction(x, y, w, h) {
  const midX = x + w / 2;
  noStroke(); fill(230, 235, 250);
  rect(x + 8, y + 8, w / 2 - 8, h - 16, 6);
  fill(255, 245, 230);
  rect(midX, y + 8, w / 2 - 8, h - 16, 6);
  fill(30); textAlign(CENTER, TOP); textSize(11); textStyle(BOLD);
  smlDrawSubLabel(x + 8 + (w / 2 - 8) / 2 - 34, y + 12, 'Metal (Φ', 'M', { size: 11 });
  text(')', x + 8 + (w / 2 - 8) / 2 + 40, y + 12);
  text('Semiconductor (χ)', midX + (w / 2 - 8) / 2, y + 12);
  textStyle(NORMAL);

  // Vacuum-level line + a visible drop to E_F for the metal (its depth IS
  // Phi_M), and vacuum -> E_C -> E_F for the semiconductor (E_C at chi,
  // then a further drop set by doping) -- an actual mini band diagram
  // instead of two boxes of plain text.
  const vacY = y + 34, metalEfY = y + h - 26;
  const leftCx = x + 8 + (w / 2 - 8) / 2;
  stroke(140); strokeWeight(1); drawingContext.setLineDash([2, 3]);
  line(x + 24, vacY, midX - 24, vacY);
  drawingContext.setLineDash([]);
  noStroke(); fill(100); textAlign(LEFT, BOTTOM); textSize(9);
  text('vacuum', x + 24, vacY - 3);
  stroke(90, 62, 237); strokeWeight(2.2);
  line(leftCx - 40, metalEfY, leftCx + 40, metalEfY);
  stroke(150); strokeWeight(1);
  line(leftCx - 40, vacY, leftCx - 40, metalEfY);
  noStroke(); fill(90, 62, 237); textAlign(LEFT, TOP); textSize(9.5);
  smlDrawSubLabel(leftCx + 44, metalEfY - 6, 'E', 'F', { size: 9.5 });
  fill(90); textAlign(LEFT, CENTER); textSize(9);
  smlDrawSubLabel(leftCx - 34, (vacY + metalEfY) / 2, 'Φ', 'M', { size: 9 });

  const rightCx = midX + (w / 2 - 8) / 2;
  const ecY = y + h * 0.5, semEfY = y + h - 26;
  stroke(90, 180, 220); strokeWeight(2.2);
  line(rightCx - 45, ecY, rightCx + 45, ecY);
  stroke(150); strokeWeight(1);
  line(rightCx - 45, vacY, rightCx - 45, ecY);
  stroke(90); strokeWeight(1); drawingContext.setLineDash([1, 3]);
  line(rightCx - 20, ecY, rightCx - 20, semEfY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90, 140, 180); textAlign(LEFT, BOTTOM); textSize(9.5);
  smlDrawSubLabel(rightCx + 48, ecY + 3, 'E', 'C', { size: 9.5 });
  fill(90); textSize(9);
  smlDrawSubLabel(rightCx - 60, (vacY + ecY) / 2, 'χ', '', { size: 9 });
  fill(90); textAlign(LEFT, TOP);
  text('(doping)', rightCx - 16, ecY + 4);
}

function drawStepBarrier(x, y, w, h) {
  const midX = x + w / 2;
  const ecY = y + h * 0.35, evY = y + h * 0.75;
  stroke(90, 62, 237); strokeWeight(2.2); noFill();
  line(x + 20, y + h * 0.5, midX - 20, y + h * 0.5);
  beginShape();
  vertex(midX - 20, ecY - 20); vertex(midX, ecY - 20);
  bezierVertex(midX + 15, ecY - 20, midX + 15, ecY, midX + 30, ecY);
  vertex(x + w - 20, ecY);
  endShape();
  stroke(90, 180, 120);
  beginShape();
  vertex(midX - 20, evY - 20); vertex(midX, evY - 20);
  bezierVertex(midX + 15, evY - 20, midX + 15, evY, midX + 30, evY);
  vertex(x + w - 20, evY);
  endShape();
  stroke(230, 150, 30); strokeWeight(1.5);
  line(midX + 5, y + h * 0.5, midX + 5, ecY - 18);
  noStroke(); fill(200, 120, 10); textAlign(LEFT, CENTER); textSize(10.5); textStyle(BOLD);
  text('ΦB', midX + 10, (y + h * 0.5 + ecY - 18) / 2);
  textStyle(NORMAL);
}

function drawStepSchottky(x, y, w, h) {
  const midX = x + w / 2, depW = 40;
  noStroke(); fill(230, 235, 250);
  rect(x + 8, y + 8, w / 2 - 8, h - 16, 6);
  fill(255, 245, 230);
  rect(midX, y + 8, w / 2 - 8, h - 16, 6);
  fill(210, 220, 255, 200);
  rect(midX, y + 8, depW, h - 16);
  noStroke(); fill(30, 60, 190); textAlign(CENTER, CENTER); textSize(12); textStyle(BOLD);
  for (let i = 0; i < 3; i++) text('+', midX + depW / 2, y + 30 + i * ((h - 60) / 2));
  textStyle(NORMAL);
  fill(90, 62, 237); textAlign(CENTER, BOTTOM); textSize(10.5);
  text('depletion region (n-type)', midX + depW / 2, y + h - 8);
}

function drawStepOhmicRectifying(x, y, w, h) {
  const cols = 2, cellW = w / cols;
  const labels = ['Rectifying', 'Ohmic'];
  const cols_colors = [color(220, 90, 60), color(40, 150, 90)];
  for (let i = 0; i < cols; i++) {
    const cx = x + i * cellW + cellW / 2;
    noStroke(); fill(cols_colors[i]); textAlign(CENTER, TOP); textSize(12); textStyle(BOLD);
    text(labels[i], cx, y + 10);
    textStyle(NORMAL);
    stroke(cols_colors[i]); strokeWeight(2);
    if (i === 0) {
      noFill();
      rect(cx - 40, y + h * 0.4, 80, h * 0.35);
      noStroke(); fill(cols_colors[i]); textAlign(CENTER, CENTER); textSize(10);
      text('barrier blocks\none direction', cx, y + h * 0.575);
    } else {
      line(cx - 40, y + h * 0.575, cx + 40, y + h * 0.575);
      noStroke(); fill(cols_colors[i]); textAlign(CENTER, TOP); textSize(10);
      text('current flows freely,\nboth directions', cx, y + h * 0.62);
    }
    if (i > 0) { stroke(220); strokeWeight(1); line(x + i * cellW, y + 8, x + i * cellW, y + h - 8); }
  }
}

function drawStepSchottkyDiode(x, y, w, h) {
  const chartX = x + 55, chartY = y + 16, chartW = w - 90, chartH = h - 46;
  const pts1 = [], pts2 = [];
  for (let v = 0; v <= 0.7; v += 0.02) {
    pts1.push({ x: v, y: Math.log10(max(1.34e-11 * (Math.exp(v / 0.0259) - 1), 1e-16)) });
    pts2.push({ x: v, y: Math.log10(max(3.8e-7 * (Math.exp(v / 0.0259) - 1), 1e-16)) });
  }
  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 0.7, -12, 6, [
    { points: pts1, color: color(90, 62, 237) },
    { points: pts2, color: color(230, 90, 60) }
  ], { xLabel: 'V (V)', yLabel: 'log10 J', yLabelOffset: 34 });
  noStroke(); fill(90, 62, 237); textAlign(LEFT, TOP); textSize(10);
  text('— p-n diode', chartX, chartY + 4);
  fill(230, 90, 60);
  text('— Schottky diode', chartX, chartY + 18);
}

function drawStepMOSCap(x, y, w, h) {
  const barH = h * 0.62, barY = y + (h - barH) / 2 - 6;
  const seg = w / 3;
  noStroke(); fill(120); rect(x, barY, seg, barH);
  stroke(170); strokeWeight(1);
  for (let hx = x + 6; hx < x + seg - 2; hx += 9) line(hx, barY + 2, hx, barY + barH - 2);
  noStroke(); fill(230, 230, 245); rect(x + seg, barY, seg, barH);
  fill(255, 245, 230); rect(x + 2 * seg, barY, seg, barH);
  fill(255); textAlign(CENTER, TOP); textSize(11); textStyle(BOLD);
  text('Gate', x + seg / 2, barY + 8);
  fill(60);
  text('Oxide', x + seg + seg / 2, barY + 8);
  text('Semiconductor', x + 2 * seg + seg / 2, barY + 8);
  textStyle(NORMAL);
  stroke(90); strokeWeight(1); noFill();
  for (let i = 0; i < 3; i++) rect(x, barY, seg, barH);

  // Applied field lines through the oxide, connecting a charge sign on the
  // gate to the induced opposite charge at the semiconductor surface --
  // this is the actual electrostatic action a MOS capacitor performs.
  noStroke(); fill(230, 90, 60); textAlign(CENTER, CENTER); textSize(13); textStyle(BOLD);
  for (let i = 0; i < 3; i++) text('+', x + seg - 12, barY + barH * 0.35 + i * barH * 0.28);
  stroke(120, 130, 220); strokeWeight(1.3);
  for (let i = 0; i < 3; i++) {
    const fy = barY + barH * 0.35 + i * barH * 0.28;
    line(x + seg - 2, fy, x + 2 * seg + 2, fy);
  }
  noStroke(); fill(60, 90, 200); textAlign(CENTER, CENTER); textSize(13); textStyle(BOLD);
  for (let i = 0; i < 3; i++) text('–', x + 2 * seg + 12, barY + barH * 0.35 + i * barH * 0.28);
  textStyle(NORMAL);
  fill(90); textAlign(CENTER, TOP); textSize(9);
  text('field penetrates the oxide -- no DC current crosses it', x + w / 2, barY + barH + 8);
}

function drawStepFlatBand(x, y, w, h) {
  // Same gate | oxide | semiconductor structure as step 6, so this reads
  // as "the same capacitor, now at the one gate voltage where the
  // semiconductor bands are flat" rather than two disconnected lines.
  const barH = h * 0.46, barY = y + 8, seg = w / 3;
  noStroke(); fill(225, 225, 232); rect(x, barY, seg, barH);
  fill(235, 235, 245); rect(x + seg, barY, seg, barH);
  fill(255, 245, 230); rect(x + 2 * seg, barY, seg, barH);
  stroke(180); strokeWeight(1); noFill();
  for (let i = 0; i < 3; i++) rect(x, barY, seg, barH);
  fill(80); noStroke(); textAlign(CENTER, TOP); textSize(9);
  text('gate', x + seg / 2, barY + barH + 4);
  text('oxide', x + seg + seg / 2, barY + barH + 4);
  text('semiconductor', x + 2 * seg + seg / 2, barY + barH + 4);

  const chartX = x + 2 * seg + 8, chartY = barY + barH * 0.28, chartW = (x + w) - chartX - 12;
  const chartY2 = barY + barH * 0.72;
  stroke(90, 62, 237); strokeWeight(2.4);
  line(chartX, chartY, chartX + chartW, chartY);
  line(chartX, chartY2, chartX + chartW, chartY2);
  noStroke(); fill(90, 62, 237); textAlign(LEFT, BOTTOM); textSize(10.5); textStyle(BOLD);
  smlDrawSubLabel(chartX, chartY - 4, 'E', 'C', { size: 10.5 });
  smlDrawSubLabel(chartX, chartY2 - 4, 'E', 'V', { size: 10.5 });
  textStyle(NORMAL);
  noStroke(); fill(60); textAlign(CENTER, TOP); textSize(11); textStyle(BOLD);
  text('flat bands at ψs = 0  (VG = VFB)', x + w / 2, barY + barH + 22);
  textStyle(NORMAL);
}

function drawStepRegimeSweep(x, y, w, h) {
  const zones = ['Accum.', 'Depletion', 'Weak Inv.'];
  const colors = [color(220, 90, 60), color(90, 62, 237), color(200, 140, 30)];
  const zw = w / zones.length;
  for (let i = 0; i < zones.length; i++) {
    noStroke(); fill(colors[i]); fill(red(colors[i]), green(colors[i]), blue(colors[i]), 60);
    rect(x + i * zw, y + 10, zw - 4, h - 20);
    fill(colors[i]); textAlign(CENTER, CENTER); textSize(11); textStyle(BOLD);
    text(zones[i], x + i * zw + zw / 2, y + h / 2);
    textStyle(NORMAL);
  }
  noStroke(); fill(60); textAlign(CENTER, BOTTOM); textSize(10);
  text('increasing gate voltage →', x + w / 2, y + h - 4);
}

function drawStepStrongInversion(x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2;
  noStroke(); fill(255, 245, 230);
  rect(x + 20, y + 10, w - 40, h - 20, 6);
  fill(40, 150, 90, 100);
  rect(x + 20, y + h - 30, w - 40, 16);
  const seeds = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9];
  for (let i = 0; i < seeds.length; i++) {
    smlDrawElectron(x + 20 + seeds[i] * (w - 40), y + h - 22, 8);
  }
  noStroke(); fill(40, 150, 90); textAlign(CENTER, TOP); textSize(10.5); textStyle(BOLD);
  text('inversion layer (electrons) at surface', cx, y + h - 46);
  textStyle(NORMAL);
}

function drawStepThreshold(x, y, w, h) {
  const items = ['V_FB', '2φ_F', 'Q_dep,max/C_ox'];
  const colors = [color(220, 90, 60), color(90, 62, 237), color(40, 150, 90)];
  const n = items.length;
  // n term boxes + 1 V_T box = n+1 boxes; (n-1) "+" signs + 1 "=" sign = n
  // connector symbols. Both box count AND symbol count were previously
  // missing from the width budget (only n boxes were sized for for n+1
  // actually drawn, and the "+"/"=" gaps were extra on top of that), which
  // is exactly what pushed the final V_T box off the right edge.
  const symbolW = min(30, w * 0.06);
  const boxW = (w - n * symbolW) / (n + 1);
  const midY = y + h * 0.5, boxH = h * 0.36;
  let cx = x;
  const fs = min(10.5, boxW / 8.5);
  for (let i = 0; i < n; i++) {
    noStroke(); fill(colors[i]);
    rect(cx, midY - boxH / 2, boxW, boxH, 4);
    fill(255); textAlign(CENTER, CENTER);
    smlMathText(cx + boxW / 2, midY - fs / 2, items[i], { size: fs, align: 'center', color: 255 });
    cx += boxW;
    noStroke(); fill(60); textAlign(CENTER, CENTER);
    textSize(i < n - 1 ? min(15, symbolW * 0.55) : min(17, symbolW * 0.6));
    if (i < n - 1) { text('+', cx + symbolW / 2, midY); }
    else { textStyle(BOLD); text('=', cx + symbolW / 2, midY); textStyle(NORMAL); }
    cx += symbolW;
  }
  noStroke(); fill(20);
  rect(cx, midY - h * 0.22, boxW, h * 0.44, 4);
  fill(255); textAlign(CENTER, CENTER);
  smlDrawSubLabel(cx + boxW / 2 - 10, midY, 'V', 'T', { size: min(13, boxW / 6), baseline: CENTER });
}

function drawControls() {
  const isLastStep = currentStep === STEPS.length - 1;
  const cy = drawHeight + (controlHeight - prevBtn.h) / 2;
  prevBtn.x = 20; prevBtn.y = cy;
  nextBtn.x = canvasWidth - 20 - nextBtn.w; nextBtn.y = cy;

  smlDrawButton(prevBtn.x, prevBtn.y, prevBtn.w, prevBtn.h, '◀ Prev', false);
  // On the last step there's nowhere for "Next" to go -- replace it with a
  // prominent, filled "Restart" button instead of leaving a dead-end button
  // that wraps silently back to step 1.
  if (isLastStep) {
    smlDrawButton(nextBtn.x, nextBtn.y, nextBtn.w, nextBtn.h, '⟲ Restart', true);
  } else {
    smlDrawButton(nextBtn.x, nextBtn.y, nextBtn.w, nextBtn.h, 'Next ▶', false);
  }

  noStroke(); fill(30); textAlign(CENTER, CENTER); textSize(12.5);
  text('Step ' + (currentStep + 1) + ' of ' + STEPS.length, canvasWidth / 2, cy + prevBtn.h / 2);

  const dotsY = cy + prevBtn.h + 12;
  const totalDotsW = STEPS.length * 14;
  const dotsX0 = canvasWidth / 2 - totalDotsW / 2 + 7;
  for (let i = 0; i < STEPS.length; i++) {
    noStroke();
    fill(i === currentStep ? color(90, 62, 237) : color(210));
    circle(dotsX0 + i * 14, dotsY, 7);
  }
}

function mousePressed() {
  if (smlPointInRect(mouseX, mouseY, prevBtn.x, prevBtn.y, prevBtn.w, prevBtn.h)) {
    currentStep = (currentStep - 1 + STEPS.length) % STEPS.length;
  } else if (smlPointInRect(mouseX, mouseY, nextBtn.x, nextBtn.y, nextBtn.w, nextBtn.h)) {
    // On the last step this button is drawn/labeled as Restart.
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
