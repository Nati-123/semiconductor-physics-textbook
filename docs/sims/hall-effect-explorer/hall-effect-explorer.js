// Hall Effect Explorer MicroSim
// Draws a current-carrying bar in a perpendicular magnetic field, with
// carriers deflected toward one edge by the Lorentz force, and computes
// the resulting Hall voltage V_H = R_H*I*B/t, with R_H's sign flipping
// between hole (p-type) and electron (n-type) conduction.
// Bloom Level: Understand / Analyze (L2-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let carrierSelect, currentSlider, bSlider, ndExpSlider, thickSlider, presetSelect;
const Q = 1.602e-19;

const PRESETS = {
  'Custom': null,
  'Typical p-type Hall sensor': { carrier: 'p-type (holes)', nd: 15, i: 1, b: 0.5, t: 100 },
  'Typical n-type Hall sensor': { carrier: 'n-type (electrons)', nd: 15, i: 1, b: 0.5, t: 100 },
  'Heavily doped (weak signal)': { carrier: 'n-type (electrons)', nd: 18, i: 1, b: 0.5, t: 100 },
  'Lightly doped (strong signal)': { carrier: 'n-type (electrons)', nd: 14, i: 1, b: 0.5, t: 100 }
};

function compact() { return canvasWidth < 480; }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  carrierSelect = createSelect();
  carrierSelect.option('p-type (holes)');
  carrierSelect.option('n-type (electrons)');
  carrierSelect.selected('p-type (holes)');
  carrierSelect.attribute('aria-label', 'Carrier type');
  carrierSelect.changed(function () { presetSelect.selected('Custom'); redraw(); });

  currentSlider = createSlider(0.1, 5, 1, 0.1);
  currentSlider.attribute('aria-label', 'Current in milliamps');
  currentSlider.input(function () { presetSelect.selected('Custom'); redraw(); });
  bSlider = createSlider(-1, 1, 0.5, 0.05);
  bSlider.attribute('aria-label', 'Magnetic field in tesla');
  bSlider.input(function () { presetSelect.selected('Custom'); redraw(); });
  ndExpSlider = createSlider(14, 18, 15, 0.1);
  ndExpSlider.attribute('aria-label', 'Carrier concentration exponent');
  ndExpSlider.input(function () { presetSelect.selected('Custom'); redraw(); });
  thickSlider = createSlider(10, 500, 100, 10);
  thickSlider.attribute('aria-label', 'Bar thickness in micrometers');
  thickSlider.input(function () { presetSelect.selected('Custom'); redraw(); });

  presetSelect = createSelect();
  Object.keys(PRESETS).forEach(k => presetSelect.option(k));
  presetSelect.selected('Custom');
  presetSelect.attribute('aria-label', 'Design preset');
  presetSelect.changed(function () {
    const p = PRESETS[presetSelect.value()];
    if (p) {
      carrierSelect.selected(p.carrier);
      ndExpSlider.value(p.nd); currentSlider.value(p.i); bSlider.value(p.b); thickSlider.value(p.t);
    }
    redraw();
  });

  positionUIElements();
  noLoop();
  describe('Hall effect explorer: a current-carrying bar in a perpendicular magnetic field, showing carrier deflection and the resulting Hall voltage, whose sign identifies carrier type', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 95 : 150;
  const sw = min(canvasWidth - lbl - 30, 300);
  presetSelect.position(bx + lbl, by + drawHeight + 12); presetSelect.size(sw);
  carrierSelect.position(bx + lbl, by + drawHeight + 50);
  currentSlider.position(bx + lbl, by + drawHeight + 88); currentSlider.size(sw);
  bSlider.position(bx + lbl, by + drawHeight + 126); bSlider.size(sw);
  ndExpSlider.position(bx + lbl, by + drawHeight + 164); ndExpSlider.size(sw);
  thickSlider.position(bx + lbl, by + drawHeight + 202); thickSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1); line(0, drawHeight, canvasWidth, drawHeight);

  const isHole = carrierSelect.value().indexOf('p-type') >= 0;
  const I_mA = currentSlider.value();
  const I = I_mA * 1e-3;
  const B = bSlider.value();
  const N_cm3 = Math.pow(10, ndExpSlider.value());
  const N_m3 = N_cm3 * 1e6;
  const t_um = thickSlider.value();
  const t_m = t_um * 1e-6;

  const RH = isHole ? 1 / (Q * N_m3) : -1 / (Q * N_m3);
  const VH = RH * I * B / t_m;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13 : 16);
  text('V_H = R_H·I·B / t   (sign reveals carrier type)', canvasWidth / 2, 8);

  drawBarDiagram(isHole, B, VH);

  const rows = { preset: 12, carrier: 50, i: 88, b: 126, nd: 164, t: 202 };
  fill(30); noStroke();
  textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 13);
  text('Preset:', 10, drawHeight + rows.preset + 11);
  text('Carrier type:', 10, drawHeight + rows.carrier + 11);
  text('Current I:', 10, drawHeight + rows.i + 11);
  text('Field B:', 10, drawHeight + rows.b + 11);
  text('N:', 10, drawHeight + rows.nd + 11);
  text('t:', 10, drawHeight + rows.t + 11);
  textAlign(RIGHT, CENTER);
  text(I_mA.toFixed(1) + ' mA', canvasWidth - 10, drawHeight + rows.i + 11);
  text(B.toFixed(2) + ' T', canvasWidth - 10, drawHeight + rows.b + 11);
  text(smlFormatPow10(ndExpSlider.value()), canvasWidth - 10, drawHeight + rows.nd + 11);
  text(t_um.toFixed(0) + ' μm', canvasWidth - 10, drawHeight + rows.t + 11);
}

function drawBarDiagram(isHole, B, VH) {
  const barX0 = canvasWidth * 0.18, barX1 = canvasWidth * 0.68;
  const barY0 = drawHeight * 0.35, barY1 = drawHeight * 0.65;
  const barW = barX1 - barX0, barH = barY1 - barY0;

  // magnetic field symbol
  noStroke(); fill(60);
  textAlign(CENTER, CENTER); textSize(13);
  const bx = (barX0 + barX1) / 2, by = barY0 - 46;
  stroke(90); strokeWeight(1.5); noFill();
  circle(bx, by, 30);
  noStroke(); fill(90);
  if (B >= 0) { circle(bx, by, 7); } else {
    stroke(90); strokeWeight(2);
    line(bx - 7, by - 7, bx + 7, by + 7);
    line(bx - 7, by + 7, bx + 7, by - 7);
  }
  noStroke(); fill(60); textSize(12);
  text('B ' + (B >= 0 ? '(out of page)' : '(into page)'), bx, by - 24);

  // bar
  stroke(120); strokeWeight(1.5); fill(235, 238, 250);
  rect(barX0, barY0, barW, barH);

  // current arrow
  stroke(90, 62, 237); strokeWeight(2.5); fill(90, 62, 237);
  const arrY = barY0 - 14;
  line(barX0, arrY, barX1, arrY);
  triangle(barX1, arrY, barX1 - 10, arrY - 5, barX1 - 10, arrY + 5);
  noStroke(); textAlign(CENTER, BOTTOM); textSize(12);
  text('Conventional current I →', (barX0 + barX1) / 2, arrY - 6);

  // carriers inside bar
  const n = 4;
  for (let i = 0; i < n; i++) {
    const cx = barX0 + barW * (0.15 + 0.7 * i / (n - 1));
    const cy = (barY0 + barY1) / 2;
    if (isHole) {
      noStroke(); fill(200, 90, 90);
      circle(cx, cy, 14);
      fill(255); textSize(11); text('+', cx, cy - 0.5);
      stroke(200, 90, 90); strokeWeight(1.5);
      line(cx + 8, cy, cx + 16, cy);
      noStroke(); fill(200, 90, 90); triangle(cx + 18, cy, cx + 13, cy - 3, cx + 13, cy + 3);
    } else {
      noStroke(); fill(40, 40, 220);
      circle(cx, cy, 14);
      fill(255); textSize(11); text('−', cx, cy - 0.5);
      stroke(40, 40, 220); strokeWeight(1.5);
      line(cx - 8, cy, cx - 16, cy);
      noStroke(); fill(40, 40, 220); triangle(cx - 18, cy, cx - 13, cy - 3, cx - 13, cy + 3);
    }
  }

  // accumulation edges: bottom edge sign = sign(VH); top edge opposite
  const bottomSign = VH >= 0 ? '+' : '−';
  const topSign = VH >= 0 ? '−' : '+';
  const bottomCol = VH >= 0 ? color(200, 40, 40) : color(40, 40, 220);
  const topCol = VH >= 0 ? color(40, 40, 220) : color(200, 40, 40);

  noStroke();
  for (let i = 0; i < 6; i++) {
    const xx = barX0 + barW * (0.1 + 0.8 * i / 5);
    fill(topCol); textAlign(CENTER, CENTER); textSize(13);
    text(topSign, xx, barY0 - 2);
    fill(bottomCol);
    text(bottomSign, xx, barY1 + 12);
  }

  // voltmeter
  const vmX = barX1 + 55, vmY = (barY0 + barY1) / 2;
  stroke(90); strokeWeight(1); drawingContext.setLineDash([2, 3]);
  line(barX1, barY0 + 3, vmX, barY0 + 3);
  line(barX1, barY1 - 3, vmX, barY1 - 3);
  line(vmX, barY0 + 3, vmX, barY1 - 3);
  drawingContext.setLineDash([]);
  noFill(); stroke(90); strokeWeight(1.5);
  circle(vmX, vmY, 26);
  noStroke(); fill(90); textAlign(CENTER, CENTER); textSize(12);
  text('V', vmX, vmY);

  noStroke(); fill(20); textAlign(LEFT, TOP); textSize(compact() ? 11.5 : 13);
  text('V_H = ' + (VH * 1000).toFixed(2) + ' mV  (' + (VH >= 0 ? 'positive → p-type signature' : 'negative → n-type signature') + ')',
    canvasWidth * 0.08, barY1 + 40, canvasWidth * 0.86);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 240 : 230;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 480);
}
