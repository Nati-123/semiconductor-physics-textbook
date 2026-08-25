// Conductivity, Resistivity, and Sheet Resistance Calculator MicroSim
// Computes sigma = q*N*mu, rho = 1/sigma, sheet resistance Rs = rho/t,
// and total resistance R = Rs*(L/W), drawing a "number of squares"
// resistor diagram. Mobility is computed via the shared Matthiessen's-
// rule model (semiconductor-materials-lib.js), evaluated at 300 K.
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let carrierSelect, ndExpSlider, thicknessSlider, squaresSlider, presetSelect;

const Q = 1.602e-19; // C
const PRESETS = {
  'Custom': null,
  'Lightly doped (N=10¹⁴)': { carrier: 'Electrons (n-type)', nd: 14, t: 1, sq: 3 },
  'Typical extrinsic (N=10¹⁶)': { carrier: 'Electrons (n-type)', nd: 16, t: 1, sq: 3 },
  'Heavily doped IC contact (N=10¹⁹)': { carrier: 'Electrons (n-type)', nd: 19, t: 0.2, sq: 3 },
  'Long, narrow IC resistor': { carrier: 'Electrons (n-type)', nd: 16, t: 0.5, sq: 10 }
};

function compact() { return canvasWidth < 480; }

function mobilityAt300(carrier, N) { return smlMobility(carrier, 300, N); }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  carrierSelect = createSelect();
  Object.keys(SML_MOBILITY_CARRIERS).forEach(k => carrierSelect.option(k));
  carrierSelect.selected('Electrons (n-type)');
  carrierSelect.attribute('aria-label', 'Carrier type');
  carrierSelect.changed(function () { presetSelect.selected('Custom'); redraw(); });

  ndExpSlider = createSlider(14, 20, 17, 0.1);
  ndExpSlider.attribute('aria-label', 'Doping concentration exponent');
  ndExpSlider.input(function () { presetSelect.selected('Custom'); redraw(); });

  thicknessSlider = createSlider(0.1, 10, 1, 0.1);
  thicknessSlider.attribute('aria-label', 'Film thickness in micrometers');
  thicknessSlider.input(function () { presetSelect.selected('Custom'); redraw(); });

  squaresSlider = createSlider(0.5, 10, 3, 0.5);
  squaresSlider.attribute('aria-label', 'Number of squares, length over width');
  squaresSlider.input(function () { presetSelect.selected('Custom'); redraw(); });

  presetSelect = createSelect();
  Object.keys(PRESETS).forEach(k => presetSelect.option(k));
  presetSelect.selected('Custom');
  presetSelect.attribute('aria-label', 'Design preset');
  presetSelect.changed(function () {
    const p = PRESETS[presetSelect.value()];
    if (p) {
      carrierSelect.selected(p.carrier);
      ndExpSlider.value(p.nd); thicknessSlider.value(p.t); squaresSlider.value(p.sq);
    }
    redraw();
  });

  positionUIElements();
  noLoop();
  describe('Conductivity, resistivity, and sheet resistance calculator: computes conductivity, resistivity, sheet resistance, and total resistance for a doped semiconductor film, with design presets and a number-of-squares resistor diagram', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 95 : 150;
  const sw = min(canvasWidth - lbl - 30, 300);
  presetSelect.position(bx + lbl, by + drawHeight + 12); presetSelect.size(sw);
  carrierSelect.position(bx + lbl, by + drawHeight + 50);
  ndExpSlider.position(bx + lbl, by + drawHeight + 88); ndExpSlider.size(sw);
  thicknessSlider.position(bx + lbl, by + drawHeight + 126); thicknessSlider.size(sw);
  squaresSlider.position(bx + lbl, by + drawHeight + 164); squaresSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1); line(0, drawHeight, canvasWidth, drawHeight);

  const carrier = SML_MOBILITY_CARRIERS[carrierSelect.value()];
  const N = Math.pow(10, ndExpSlider.value());
  const mu = mobilityAt300(carrier, N);
  const sigma = Q * N * mu; // S/cm
  const rho = 1 / sigma;    // ohm*cm
  const tUm = thicknessSlider.value();
  const tCm = tUm * 1e-4;
  const Rs = rho / tCm;     // ohm/square
  const squares = squaresSlider.value();
  const R = Rs * squares;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13 : 16);
  text('σ = qNμ,  ρ = 1/σ,  R_s = ρ/t,  R = R_s·(L/W)', canvasWidth / 2, 8);

  const leftW = compact() ? canvasWidth : Math.round(canvasWidth * 0.46);
  drawCard(N, mu, sigma, rho, Rs, R, squares, leftW);
  // Diagram panelX is 0 in compact mode (stacked below the card, full
  // width) but leftW in non-compact mode (to the right of the card) --
  // NOT leftW in both cases, which would place it off-screen when
  // leftW equals the full canvas width.
  const diagPanelX = compact() ? 0 : leftW;
  drawResistorDiagram(squares, diagPanelX, compact() ? drawHeight * 0.55 : 0, compact() ? canvasWidth : canvasWidth - leftW, compact() ? drawHeight * 0.45 : drawHeight);

  const rows = { preset: 12, carrier: 50, nd: 88, thick: 126, sq: 164 };
  fill(30); noStroke();
  textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 13);
  text('Preset:', 10, drawHeight + rows.preset + 11);
  text('Carrier:', 10, drawHeight + rows.carrier + 11);
  text('N:', 10, drawHeight + rows.nd + 11);
  text('Thickness t:', 10, drawHeight + rows.thick + 11);
  text('Squares (L/W):', 10, drawHeight + rows.sq + 11);
  textAlign(RIGHT, CENTER);
  text(smlFormatPow10(ndExpSlider.value()), canvasWidth - 10, drawHeight + rows.nd + 11);
  text(tUm.toFixed(1) + ' μm', canvasWidth - 10, drawHeight + rows.thick + 11);
  text(squares.toFixed(1), canvasWidth - 10, drawHeight + rows.sq + 11);
}

function drawCard(N, mu, sigma, rho, Rs, R, squares, panelW) {
  const cardX = compact() ? 20 : 30, cardY = compact() ? 32 : 44;
  const cardW = (compact() ? canvasWidth : panelW) - cardX - 16;
  const lines = [
    'μ (Matthiessen, 300 K) = ' + mu.toFixed(0) + ' cm²/V·s',
    'σ = ' + sigma.toExponential(2) + ' S/cm',
    'ρ = ' + rho.toExponential(2) + ' Ω·cm',
    'R_s = ' + Rs.toExponential(2) + ' Ω/square',
    'R = R_s × ' + squares.toFixed(1) + ' squares',
    '= ' + R.toExponential(2) + ' Ω'
  ];
  const lineH = compact() ? 22 : 24;
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
}

function drawResistorDiagram(squares, panelX, panelY, panelW, panelH) {
  const areaX = panelX + (compact() ? 20 : panelW * 0.08), areaY = panelY + 70, areaW = panelW - (areaX - panelX) - 30, areaH = panelH - 140;
  const maxSquaresWide = min(10, squares);
  const sqSize = min(areaW / maxSquaresWide, areaH);
  const totalW = sqSize * squares;
  const totalH = sqSize;
  const x0 = areaX + (areaW - min(totalW, areaW)) / 2;
  const y0 = areaY + (areaH - totalH) / 2;

  noStroke(); fill(90, 62, 237, 40);
  rect(x0, y0, min(totalW, areaW), totalH);

  stroke(90, 62, 237); strokeWeight(1.5); noFill();
  const fullSquares = Math.floor(squares);
  for (let i = 0; i <= fullSquares; i++) {
    const x = x0 + i * sqSize;
    if (x <= x0 + areaW + 1) line(x, y0, x, y0 + totalH);
  }
  rect(x0, y0, min(totalW, areaW), totalH);

  fill(30); noStroke();
  textAlign(CENTER, TOP); textSize(12);
  text('L', x0 + min(totalW, areaW) / 2, y0 + totalH + 8);
  push();
  translate(x0 - 14, y0 + totalH / 2);
  rotate(-HALF_PI);
  text('W', 0, 0);
  pop();
  textAlign(CENTER, BOTTOM); textSize(11); fill(90);
  text(squares.toFixed(1) + ' squares', x0 + min(totalW, areaW) / 2, y0 - 6);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 200 : 170;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 620);
}
