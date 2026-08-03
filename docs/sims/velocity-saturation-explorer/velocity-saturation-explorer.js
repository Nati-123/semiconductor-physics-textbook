// Velocity Saturation Explorer MicroSim
// Plots the saturating drift-velocity curve
//   v_d(E) = mu*E / sqrt(1 + (mu*E/v_sat)^2)
// against the naive linear prediction v_d=mu*E, using a low-field
// mobility computed via the Chapter 11 Matthiessen's-rule model.
// Bloom Level: Understand / Analyze (L2-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let carrierSelect, ndExpSlider, tempSlider, eSlider;

const CARRIERS = {
  'Electrons (n-type)': { muL0: 1350, muI0: 1965, vsat: 1.0e7 },
  'Holes (p-type)': { muL0: 480, muI0: 800, vsat: 0.8e7 }
};

function muLattice(muL0, T) { return muL0 * Math.pow(T / 300, -1.5); }
function muImpurity(muI0, T, N) { return muI0 * Math.pow(T / 300, 1.5) * (1e17 / N); }
function mobility(carrier, T, N) {
  const muL = muLattice(carrier.muL0, T), muI = muImpurity(carrier.muI0, T, N);
  return 1 / (1 / muL + 1 / muI);
}
function vDrift(mu, vsat, E) {
  const linear = mu * E;
  return linear / Math.sqrt(1 + (linear / vsat) * (linear / vsat));
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

  ndExpSlider = createSlider(14, 19, 16, 0.1);
  ndExpSlider.attribute('aria-label', 'Doping concentration exponent');
  tempSlider = createSlider(150, 500, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');
  eSlider = createSlider(0, 50000, 5000, 500);
  eSlider.attribute('aria-label', 'Electric field marker in volts per centimeter');

  positionUIElements();
  describe('Velocity saturation explorer: plots the saturating drift velocity curve against the naive linear mobility prediction as a function of electric field', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  carrierSelect.position(bx + 90, by + drawHeight + 12);
  ndExpSlider.position(bx + 150, by + drawHeight + 52);
  ndExpSlider.size(min(canvasWidth - 170 - 30, 300));
  tempSlider.position(bx + 150, by + drawHeight + 88);
  tempSlider.size(min(canvasWidth - 170 - 30, 300));
  eSlider.position(bx + 150, by + drawHeight + 124);
  eSlider.size(min(canvasWidth - 170 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const carrier = CARRIERS[carrierSelect.value()];
  const N = Math.pow(10, ndExpSlider.value());
  const T = tempSlider.value();
  const Emark = eSlider.value();
  const mu = mobility(carrier, T, N);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Drift Velocity: v_d = μE / √(1+(μE/v_sat)²)', canvasWidth / 2, 8);

  const chartX = 70, chartY = 44, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;
  const EMAX = 50000;

  const ptsActual = [], ptsLinear = [];
  for (let E = 0; E <= EMAX; E += 500) {
    ptsActual.push({ x: E, y: vDrift(mu, carrier.vsat, E) });
    ptsLinear.push({ x: E, y: min(mu * E, carrier.vsat * 1.6) });
  }
  const yMax = carrier.vsat * 1.5;

  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, EMAX, 0, yMax, [
    { points: ptsLinear, color: color(200) },
    { points: ptsActual, color: color(90, 62, 237) }
  ], {
    marker: { x: Emark, y: vDrift(mu, carrier.vsat, Emark) },
    xLabel: 'Electric field E (V/cm)', yLabel: 'Drift velocity (cm/s)', yLabelOffset: 46
  });

  // v_sat reference line
  const vsatY = map(carrier.vsat, 0, yMax, chartY + chartH, chartY);
  stroke(90, 180, 120); strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(chartX, vsatY, chartX + chartW, vsatY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90, 180, 120); textAlign(LEFT, BOTTOM); textSize(11);
  text('v_sat = ' + carrier.vsat.toExponential(1) + ' cm/s', chartX + 4, vsatY - 3);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Carrier:', 10, drawHeight + 18);
  text('N = 10^' + ndExpSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 58);
  text('T = ' + T + ' K,  low-field μ = ' + mu.toFixed(0) + ' cm²/V·s', 10, drawHeight + 94);
  text('E marker = ' + Emark + ' V/cm  →  v_d = ' + vDrift(mu, carrier.vsat, Emark).toExponential(2) + ' cm/s', 10, drawHeight + 130);
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
