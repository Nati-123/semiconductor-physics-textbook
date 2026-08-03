// Conductivity, Resistivity, and Sheet Resistance Calculator MicroSim
// Computes sigma = q*N*mu, rho = 1/sigma, sheet resistance Rs = rho/t,
// and total resistance R = Rs*(L/W), drawing a "number of squares"
// resistor diagram. Mobility is computed via the same Matthiessen's-rule
// model as the mobility explorer sim, evaluated at 300 K.
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let carrierSelect, ndExpSlider, thicknessSlider, squaresSlider;

const Q = 1.602e-19; // C
const CARRIERS = {
  'Electrons (n-type)': { muL0: 1350, muI0: 1965 },
  'Holes (p-type)': { muL0: 480, muI0: 800 }
};

function mobilityAt300(carrier, N) {
  const muL = carrier.muL0; // T=300K, (T/300)^-1.5 = 1
  const muI = carrier.muI0 * (1e17 / N);
  return 1 / (1 / muL + 1 / muI);
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  carrierSelect = createSelect();
  Object.keys(CARRIERS).forEach(k => carrierSelect.option(k));
  carrierSelect.selected('Electrons (n-type)');
  carrierSelect.attribute('aria-label', 'Carrier type');

  ndExpSlider = createSlider(14, 19, 17, 0.1);
  ndExpSlider.attribute('aria-label', 'Doping concentration exponent');

  thicknessSlider = createSlider(0.1, 10, 1, 0.1);
  thicknessSlider.attribute('aria-label', 'Film thickness in micrometers');

  squaresSlider = createSlider(0.5, 10, 3, 0.5);
  squaresSlider.attribute('aria-label', 'Number of squares, length over width');

  positionUIElements();
  describe('Conductivity, resistivity, and sheet resistance calculator: computes conductivity, resistivity, sheet resistance, and total resistance for a doped semiconductor film, with a number-of-squares resistor diagram', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  carrierSelect.position(bx + 110, by + drawHeight + 12);
  ndExpSlider.position(bx + 220, by + drawHeight + 50);
  ndExpSlider.size(min(canvasWidth - 240 - 30, 260));
  thicknessSlider.position(bx + 220, by + drawHeight + 88);
  thicknessSlider.size(min(canvasWidth - 240 - 30, 260));
  squaresSlider.position(bx + 220, by + drawHeight + 126);
  squaresSlider.size(min(canvasWidth - 240 - 30, 260));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const carrier = CARRIERS[carrierSelect.value()];
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
  textAlign(CENTER, TOP); textSize(16);
  text('σ = qNμ,  ρ = 1/σ,  R_s = ρ/t,  R = R_s·(L/W)', canvasWidth / 2, 8);

  drawCard(N, mu, sigma, rho, Rs, R, squares);
  drawResistorDiagram(squares);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Carrier:', 10, drawHeight + 18);
  text('N = 10^' + ndExpSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 56);
  text('Thickness t = ' + tUm.toFixed(1) + ' μm', 10, drawHeight + 94);
  text('Squares (L/W) = ' + squares.toFixed(1), 10, drawHeight + 132);
}

function drawCard(N, mu, sigma, rho, Rs, R, squares) {
  const cardX = 30, cardY = 44, cardW = canvasWidth * 0.46, cardH = drawHeight - 90;
  noStroke();
  fill(240, 245, 255);
  stroke(168, 200, 255);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke();
  fill(30);
  textAlign(LEFT, TOP);
  textSize(12.5);
  const lines = [
    'μ (Matthiessen, 300 K) = ' + mu.toFixed(0) + ' cm²/V·s',
    'σ = ' + sigma.toExponential(2) + ' S/cm',
    'ρ = ' + rho.toExponential(2) + ' Ω·cm',
    'R_s = ' + Rs.toExponential(2) + ' Ω/square',
    'R = R_s × ' + squares.toFixed(1) + ' squares',
    '= ' + R.toExponential(2) + ' Ω'
  ];
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cardX + 16, cardY + 14 + i * 24, cardW - 32);
  }
}

function drawResistorDiagram(squares) {
  const areaX = canvasWidth * 0.54, areaY = 60, areaW = canvasWidth - areaX - 30, areaH = drawHeight - 140;
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
}

function updateCanvasSize() {
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
}
