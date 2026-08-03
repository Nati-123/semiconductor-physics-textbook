// Effective Density of States and Intrinsic Carrier Concentration
// Calculator MicroSim
// Computes N_C, N_V, E_g(T) (Varshni), and n_i(T) from first principles
// for Si, Ge, or GaAs, and plots log10(n_i) vs. T with a live marker.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, tempSlider;

const KB_J = 1.381e-23, H_J = 6.626e-34, M0 = 9.109e-31, KB_EV = 8.617e-5;

const MATERIALS = {
  'Silicon': { me: 1.08, mh: 0.56, Eg0: 1.166, alpha: 4.73e-4, beta: 636 },
  'Germanium': { me: 0.55, mh: 0.37, Eg0: 0.7437, alpha: 4.77e-4, beta: 235 },
  'GaAs': { me: 0.067, mh: 0.48, Eg0: 1.519, alpha: 5.41e-4, beta: 204 }
};

function effDOS(mRatio, T) {
  const m = mRatio * M0;
  const val = 2 * Math.pow((2 * Math.PI * m * KB_J * T) / (H_J * H_J), 1.5); // m^-3
  return val / 1e6; // cm^-3
}
function EgAt(mat, T) { return mat.Eg0 - (mat.alpha * T * T) / (T + mat.beta); }
function niAt(mat, T) {
  const Nc = effDOS(mat.me, T), Nv = effDOS(mat.mh, T);
  return Math.sqrt(Nc * Nv) * Math.exp(-EgAt(mat, T) / (2 * KB_EV * T));
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  Object.keys(MATERIALS).forEach(k => materialSelect.option(k));
  materialSelect.selected('Silicon');
  materialSelect.attribute('aria-label', 'Material selection');

  tempSlider = createSlider(150, 600, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');

  positionUIElements();
  describe('Effective density of states and intrinsic carrier concentration calculator: computes N_C, N_V, band gap, and intrinsic carrier concentration for silicon, germanium, or GaAs at an adjustable temperature', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  materialSelect.position(bx + 90, by + drawHeight + 12);
  tempSlider.position(bx + 150, by + drawHeight + 52);
  tempSlider.size(min(canvasWidth - 170 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const mat = MATERIALS[materialSelect.value()];
  const T = tempSlider.value();
  const Nc = effDOS(mat.me, T), Nv = effDOS(mat.mh, T), Eg = EgAt(mat, T), ni = niAt(mat, T);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text(materialSelect.value() + ': Nc, Nv, and Intrinsic Carrier Concentration', canvasWidth / 2, 8);

  drawCard(mat, T, Nc, Nv, Eg, ni);
  drawCurve(mat, T, ni);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Material:', 10, drawHeight + 18);
  text('Temperature: ' + T + ' K', 10, drawHeight + 58);
}

function drawCard(mat, T, Nc, Nv, Eg, ni) {
  const cardX = 30, cardY = 44, cardW = canvasWidth * 0.44, cardH = drawHeight - 90;
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
    'm_e*/m0 = ' + mat.me + ',  m_h*/m0 = ' + mat.mh,
    'E_g(' + T + ' K) = ' + Eg.toFixed(3) + ' eV',
    'N_C = ' + Nc.toExponential(2) + ' cm⁻³',
    'N_V = ' + Nv.toExponential(2) + ' cm⁻³',
    'n_i = √(N_C·N_V)·e^(−Eg/2kT)',
    'n_i = ' + ni.toExponential(2) + ' cm⁻³'
  ];
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cardX + 16, cardY + 14 + i * 24, cardW - 32);
  }
}

function drawCurve(mat, T, ni) {
  const chartX = canvasWidth * 0.52, chartY = 50, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;
  const pts = [];
  for (let t = 150; t <= 600; t += 10) pts.push({ x: t, y: Math.log10(niAt(mat, t)) });
  smlDrawLineChart(chartX, chartY, chartW, chartH, 150, 600, 5, 17, [{ points: pts, color: color(90, 62, 237) }], {
    marker: { x: T, y: Math.log10(ni) },
    xLabel: 'Temperature (K)', yLabel: 'log₁₀ nᵢ (cm⁻³)', yLabelOffset: 34
  });
  fill(30); noStroke();
  textAlign(CENTER, TOP); textSize(11);
  text('nᵢ(T) grows by orders of magnitude over this range', chartX + chartW / 2, chartY - 12);
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
