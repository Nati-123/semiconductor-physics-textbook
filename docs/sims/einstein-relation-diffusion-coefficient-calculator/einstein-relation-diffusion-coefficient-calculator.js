// Einstein Relation and Diffusion Coefficient Calculator MicroSim
// Computes mobility via the shared Matthiessen's-rule model (Chapter 11)
// then applies the Einstein relation D = mu*kT/q (with kT/q in volts
// numerically equal to kT in eV) to compute the diffusion coefficient,
// plotted against temperature with a live marker and an optional
// electron-vs-hole comparison mode.
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let carrierSelect, ndExpSlider, tempSlider, compareCheckbox;
const KB_EV = 8.617e-5;
const TEMP_PRESETS = [77, 300, 500];

function compact() { return canvasWidth < 480; }
function diffusionCoeff(mu, T) { return mu * (KB_EV * T); } // cm^2/s

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  carrierSelect = createSelect();
  Object.keys(SML_MOBILITY_CARRIERS).forEach(k => carrierSelect.option(k));
  carrierSelect.selected('Electrons (n-type)');
  carrierSelect.attribute('aria-label', 'Carrier type');
  carrierSelect.changed(function () { redraw(); });

  compareCheckbox = createCheckbox(' Compare electrons vs. holes', false);
  compareCheckbox.attribute('aria-label', 'Compare electrons and holes together');
  compareCheckbox.changed(function () { redraw(); });

  ndExpSlider = createSlider(14, 19, 16, 0.1);
  ndExpSlider.attribute('aria-label', 'Doping concentration exponent');
  ndExpSlider.input(function () { redraw(); });

  tempSlider = createSlider(77, 600, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');
  tempSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Einstein relation and diffusion coefficient calculator: computes mobility via Matthiessen\'s rule and the diffusion coefficient via the Einstein relation, plotted against temperature, with an option to compare electrons and holes together', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function rowY() {
  if (compact()) return { carrier: 12, compare: 50, nd: 88, presets: 126, temp: 164 };
  return { carrier: 12, compare: 50, nd: 88, presets: 126, temp: 126 };
}

function presetButtons() {
  const bw = 52, bh = 22, gap = 6;
  const rows = rowY();
  if (compact()) return TEMP_PRESETS.map((t, i) => ({ t: t, x: 10 + i * (bw + gap), y: drawHeight + rows.presets, w: bw, h: bh }));
  const startX = canvasWidth - (bw + gap) * TEMP_PRESETS.length - 14;
  return TEMP_PRESETS.map((t, i) => ({ t: t, x: startX + i * (bw + gap), y: drawHeight + rows.presets, w: bw, h: bh }));
}

function mousePressed() {
  for (const b of presetButtons()) {
    if (smlPointInRect(mouseX, mouseY, b.x, b.y, b.w, b.h)) { tempSlider.value(b.t); redraw(); return false; }
  }
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 95 : 150;
  const rows = rowY();
  const sw = min(canvasWidth - lbl - 30, 300);
  const tempSw = compact() ? sw : min(canvasWidth - lbl - 220, 300);
  carrierSelect.position(bx + lbl, by + drawHeight + rows.carrier);
  compareCheckbox.position(bx + lbl, by + drawHeight + rows.compare);
  ndExpSlider.position(bx + lbl, by + drawHeight + rows.nd); ndExpSlider.size(sw);
  tempSlider.position(bx + lbl, by + drawHeight + rows.temp); tempSlider.size(tempSw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1); line(0, drawHeight, canvasWidth, drawHeight);

  const compareMode = compareCheckbox.checked();
  const N = Math.pow(10, ndExpSlider.value());
  const T = tempSlider.value();
  const primaryCarrier = SML_MOBILITY_CARRIERS[carrierSelect.value()];
  const mu = smlMobility(primaryCarrier, T, N);
  const D = diffusionCoeff(mu, T);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13 : 16);
  text('Einstein Relation: D = μ·k_BT/q', canvasWidth / 2, 8);

  const leftW = compact() ? canvasWidth : Math.round(canvasWidth * 0.42);
  drawCard(mu, D, T, leftW);
  drawCurve(compareMode, N, T, D, leftW);

  for (const b of presetButtons()) smlDrawButton(b.x, b.y, b.w, b.h, b.t + 'K', T === b.t);

  const rows = rowY();
  fill(30); noStroke();
  textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 13);
  text('Carrier:', 10, drawHeight + rows.carrier + 11);
  text('N = ' + smlFormatPow10(ndExpSlider.value()), 10, drawHeight + rows.nd + 11);
  text('T = ' + T + ' K', 10, drawHeight + rows.temp + (compact() ? 34 : 11), canvasWidth - 20);
}

function drawCard(mu, D, T, panelW) {
  const cardX = compact() ? 20 : 30, cardY = compact() ? 32 : 44;
  const cardW = (compact() ? canvasWidth : panelW) - cardX - 16;
  const lines = [
    'μ (Matthiessen, ' + T + ' K) = ' + mu.toFixed(0) + ' cm²/V·s',
    'k_BT/q = ' + (KB_EV * T).toFixed(4) + ' V',
    'D = μ × (k_BT/q)',
    'D = ' + D.toFixed(2) + ' cm²/s'
  ];
  const lineH = compact() ? 24 : 26;
  const cardH = 14 + lines.length * lineH + 10;
  noStroke();
  fill(240, 245, 255);
  stroke(168, 200, 255);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke();
  fill(30);
  textAlign(LEFT, TOP);
  textSize(compact() ? 11.5 : 12.5);
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cardX + 16, cardY + 14 + i * lineH, cardW - 32);
  }

  // Fixed 300 K reference checkpoint, distinct from the live (slider-driven) kT/q line above.
  const refY = cardY + cardH + 10;
  const refH = compact() ? 34 : 30;
  noStroke();
  fill(255, 247, 224);
  stroke(230, 190, 110);
  strokeWeight(1.5);
  rect(cardX, refY, cardW, refH, 8);
  noStroke();
  fill(120, 80, 10);
  textAlign(LEFT, CENTER);
  textSize(compact() ? 10.5 : 11.5);
  text('Reference (300 K): k_BT/q ≈ 0.0259 V', cardX + 12, refY + refH / 2, cardW - 24);
}

function drawCurve(compareMode, N, Tmark, Dmark, panelW) {
  const chartX = compact() ? canvasWidth * 0.06 : panelW, chartY = compact() ? drawHeight * 0.52 : 50;
  const chartW = (compact() ? canvasWidth * 0.88 : canvasWidth - chartX - 30);
  const chartH = compact() ? drawHeight - chartY - 10 : drawHeight - 100;

  const carriersToShow = compareMode ? Object.keys(SML_MOBILITY_CARRIERS) : [carrierSelect.value()];
  const series = [];
  let maxD = 0;
  for (const name of carriersToShow) {
    const carrier = SML_MOBILITY_CARRIERS[name];
    const pts = [];
    for (let T = 77; T <= 600; T += 10) {
      const d = diffusionCoeff(smlMobility(carrier, T, N), T);
      pts.push({ x: T, y: d });
      maxD = max(maxD, d);
    }
    series.push({ points: pts, color: color(...carrier.color) });
  }
  const chartMap = smlDrawLineChart(chartX, chartY, chartW, chartH, 77, 600, 0, maxD * 1.15, series, {
    marker: { x: Tmark, y: Dmark },
    xLabel: 'Temperature (K)', yLabel: 'D (cm²/s)', yLabelOffset: 40
  });

  // 300 K reference checkpoint (kT/q ≈ 0.0259 V) marked directly on the axis.
  const ref300x = chartMap.xToPx(300);
  push();
  stroke(230, 170, 60);
  strokeWeight(1.25);
  drawingContext.setLineDash([4, 3]);
  line(ref300x, chartY, ref300x, chartY + chartH);
  drawingContext.setLineDash([]);
  noStroke();
  fill(140, 95, 10);
  textAlign(CENTER, BOTTOM);
  textSize(compact() ? 9.5 : 10.5);
  text('300 K ref.', ref300x, chartY - 2);
  pop();

  if (compareMode) {
    const legX = chartX + 10, legY = chartY + 8;
    noStroke(); fill(255, 255, 255, 220); rect(legX - 6, legY - 6, 110, 44, 6);
    fill(...SML_MOBILITY_CARRIERS['Electrons (n-type)'].color); textAlign(LEFT, CENTER); textSize(10.5);
    stroke(...SML_MOBILITY_CARRIERS['Electrons (n-type)'].color); strokeWeight(2.5); line(legX, legY + 4, legX + 16, legY + 4);
    noStroke(); text('D_n (electrons)', legX + 22, legY + 4);
    stroke(...SML_MOBILITY_CARRIERS['Holes (p-type)'].color); strokeWeight(2.5); line(legX, legY + 24, legX + 16, legY + 24);
    noStroke(); fill(...SML_MOBILITY_CARRIERS['Holes (p-type)'].color); text('D_p (holes)', legX + 22, legY + 24);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 210 : 150;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 620);
}
