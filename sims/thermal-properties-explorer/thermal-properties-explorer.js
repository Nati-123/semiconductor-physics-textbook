// Thermal Conductivity and Generation Rate Explorer MicroSim
// Top panel: computes steady-state temperature rise dT = P*t/(kappa*A)
// across a slab for a chosen power, material (thermal conductivity),
// fixed thickness and area. Bottom panel: computes thermal generation
// current Igen = q*(ni/tau0)*W*A in a diode depletion region and
// compares it on a log-scale bar chart against a fixed reference
// diffusion-based I0 (from a Chapter 15 example).
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 190;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let pSlider, kappaSelect, tau0Slider, wSlider;

const Q = 1.602e-19, NI = 1.5e10;
const I0_DIFFUSION = 1.34e-13; // A, reference from Chapter 15 example
const A_DIODE = 1e-2; // cm^2
const KAPPAS = { 'Silicon (150 W/m·K)': 150, 'GaAs (55 W/m·K)': 55, 'SiC (490 W/m·K)': 490 };
const T_SLAB = 5e-4, A_SLAB = 1e-6; // m (500 um thick, 1 mm^2)

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  pSlider = createSlider(0.1, 5, 1, 0.1);
  pSlider.attribute('aria-label', 'Power dissipation in watts');
  kappaSelect = createSelect();
  Object.keys(KAPPAS).forEach(k => kappaSelect.option(k));
  kappaSelect.selected('Silicon (150 W/m·K)');
  kappaSelect.attribute('aria-label', 'Substrate material thermal conductivity');

  tau0Slider = createSlider(0.1, 10, 1, 0.1);
  tau0Slider.attribute('aria-label', 'Generation lifetime in microseconds');
  wSlider = createSlider(0.1, 5, 1, 0.1);
  wSlider.attribute('aria-label', 'Depletion width in micrometers');

  positionUIElements();
  describe('Thermal conductivity and generation rate explorer: computes temperature rise across a slab and compares thermal generation current to a reference diffusion current', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  pSlider.position(bx + 170, by + drawHeight + 12);
  pSlider.size(min(canvasWidth - 190 - 30, 300));
  kappaSelect.position(bx + 170, by + drawHeight + 50);
  tau0Slider.position(bx + 170, by + drawHeight + 88);
  tau0Slider.size(min(canvasWidth - 190 - 30, 300));
  wSlider.position(bx + 170, by + drawHeight + 126);
  wSlider.size(min(canvasWidth - 190 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const P = pSlider.value();
  const kappa = KAPPAS[kappaSelect.value()];
  const dT = (P * T_SLAB) / (kappa * A_SLAB);

  const tau0 = tau0Slider.value() * 1e-6;
  const WUm = wSlider.value();
  const Wcm = WUm * 1e-4;
  const Gth = NI / tau0;
  const Igen = Q * Gth * Wcm * A_DIODE;

  const halfH = drawHeight / 2;
  drawThermalPanel(0, 0, canvasWidth, halfH, P, kappa, dT);
  stroke(210); line(20, halfH, canvasWidth - 20, halfH);
  drawGenerationPanel(0, halfH, canvasWidth, halfH, Igen);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12);
  text('P (W):', 10, drawHeight + 18);
  text('Material:', 10, drawHeight + 56);
  text('τ0 (μs):', 10, drawHeight + 94);
  text('W (μm):', 10, drawHeight + 132);
  textSize(11); fill(80);
  text('P=' + P.toFixed(1) + 'W  κ=' + kappa + 'W/mK  →  ΔT=' + dT.toFixed(2) + ' K     τ0=' + (tau0 * 1e6).toFixed(1) + 'μs  W=' + WUm.toFixed(1) + 'μm  →  Igen=' + Igen.toExponential(2) + ' A', 10, drawHeight + 168, canvasWidth - 20);
}

function drawThermalPanel(x, y, w, h, P, kappa, dT) {
  noStroke(); fill(20); textAlign(CENTER, TOP); textSize(13); textStyle(BOLD);
  text('Thermal Conductivity: ΔT = P·t / (κ·A)', x + w / 2, y + 6);
  textStyle(NORMAL);

  const slabX = x + w * 0.30, slabY = y + 34, slabW = w * 0.16, slabH = h - 70;
  noStroke(); fill(200, 210, 230);
  rect(slabX, slabY, slabW, slabH);
  stroke(120); strokeWeight(1); noFill();
  rect(slabX, slabY, slabW, slabH);
  noStroke(); fill(60); textAlign(CENTER, TOP); textSize(10);
  text('slab\n(500 μm, 1 mm²)', slabX + slabW / 2, slabY + slabH + 6);

  stroke(230, 90, 60); strokeWeight(2.5);
  const nArrows = 4;
  for (let i = 0; i < nArrows; i++) {
    const ay = slabY + (i + 0.5) * slabH / nArrows;
    line(slabX - 30, ay, slabX - 4, ay);
    noStroke(); fill(230, 90, 60);
    triangle(slabX - 4, ay - 5, slabX - 4, ay + 5, slabX + 4, ay);
    stroke(230, 90, 60); strokeWeight(2.5);
  }
  noStroke(); fill(230, 90, 60); textAlign(CENTER, BOTTOM); textSize(10.5);
  text('heat, P', slabX - 20, slabY - 6);

  const cardX = x + w * 0.58, cardY = y + 30, cardW = w * 0.38, cardH = h - 60;
  noStroke(); fill(240, 245, 255);
  stroke(168, 200, 255); strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 8);
  noStroke(); fill(90, 62, 237); textAlign(CENTER, TOP); textSize(15); textStyle(BOLD);
  text('ΔT = ' + dT.toFixed(2) + ' K', cardX + cardW / 2, cardY + 14);
  textStyle(NORMAL);
  fill(30); textAlign(LEFT, TOP); textSize(11);
  text('P = ' + P.toFixed(1) + ' W\nκ = ' + kappa + ' W/(m·K)', cardX + 14, cardY + 44, cardW - 28);
}

function drawGenerationPanel(x, y, w, h, Igen) {
  noStroke(); fill(20); textAlign(CENTER, TOP); textSize(13); textStyle(BOLD);
  text('Thermal Generation Current vs. Diffusion Current (log scale)', x + w / 2, y + 6);
  textStyle(NORMAL);

  const chartX = x + 90, chartY = y + 32, chartW = w - 130, chartH = h - 60;
  const logIgen = Math.log10(Igen);
  const logI0 = Math.log10(I0_DIFFUSION);
  const yMin = min(logI0, logIgen) - 1, yMax = max(logI0, logIgen) + 1;

  const series = [
    { label: 'Igen', value: logIgen, color: color(230, 90, 60) },
    { label: 'I0 (diffusion)', value: logI0, color: color(90, 62, 237) }
  ];
  smlDrawBarChart(chartX, chartY, chartW, chartH, series.map(s => ({
    label: s.label, value: s.value - yMin, color: s.color
  })), yMax - yMin, { valueFormat: v => '' });

  noStroke(); fill(30); textAlign(LEFT, TOP); textSize(10.5);
  text('Igen = ' + Igen.toExponential(2) + ' A', chartX, chartY - 4);
  fill(90); textAlign(RIGHT, TOP);
  text('I0 = ' + I0_DIFFUSION.toExponential(2) + ' A (fixed reference)', chartX + chartW, chartY - 4);
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
