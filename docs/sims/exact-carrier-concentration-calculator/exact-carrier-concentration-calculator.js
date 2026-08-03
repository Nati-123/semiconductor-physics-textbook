// Exact Carrier Concentration Calculator MicroSim
// Solves the mass action law + charge neutrality system exactly:
//   n0 = [(ND-NA) + sqrt((ND-NA)^2 + 4*ni^2)] / 2,   p0 = ni^2 / n0
// and displays n0, p0, ni together with a comparison bar chart, for an
// adjustable material, temperature, and donor/acceptor concentration.
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, tempSlider, ndExpSlider, naExpSlider;

const KB_J = 1.381e-23, H_J = 6.626e-34, M0 = 9.109e-31, KB_EV = 8.617e-5;

const MATERIALS = {
  'Silicon': { me: 1.08, mh: 0.56, Eg0: 1.166, alpha: 4.73e-4, beta: 636 },
  'Germanium': { me: 0.55, mh: 0.37, Eg0: 0.7437, alpha: 4.77e-4, beta: 235 },
  'GaAs': { me: 0.067, mh: 0.48, Eg0: 1.519, alpha: 5.41e-4, beta: 204 }
};

function effDOS(mRatio, T) {
  const m = mRatio * M0;
  const val = 2 * Math.pow((2 * Math.PI * m * KB_J * T) / (H_J * H_J), 1.5);
  return val / 1e6;
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

  tempSlider = createSlider(200, 500, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');

  ndExpSlider = createSlider(13, 19, 13, 0.1);
  ndExpSlider.attribute('aria-label', 'Donor concentration exponent');
  naExpSlider = createSlider(13, 19, 13, 0.1);
  naExpSlider.attribute('aria-label', 'Acceptor concentration exponent');

  positionUIElements();
  describe('Exact carrier concentration calculator: solves the mass action law and charge neutrality condition together for electron and hole concentration at any doping level', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  materialSelect.position(bx + 90, by + drawHeight + 12);
  tempSlider.position(bx + 150, by + drawHeight + 50);
  tempSlider.size(min(canvasWidth - 170 - 30, 280));
  ndExpSlider.position(bx + 150, by + drawHeight + 88);
  ndExpSlider.size(min(canvasWidth - 170 - 30, 280));
  naExpSlider.position(bx + 150, by + drawHeight + 126);
  naExpSlider.size(min(canvasWidth - 170 - 30, 280));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const mat = MATERIALS[materialSelect.value()];
  const T = tempSlider.value();
  const ND = Math.pow(10, ndExpSlider.value());
  const NA = Math.pow(10, naExpSlider.value());
  const ni = niAt(mat, T);
  const netD = ND - NA;
  const n0 = (netD + Math.sqrt(netD * netD + 4 * ni * ni)) / 2;
  const p0 = (ni * ni) / n0;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('n₀ = [(N_D−N_A) + √((N_D−N_A)² + 4nᵢ²)] / 2', canvasWidth / 2, 8);

  drawCard(ND, NA, ni, n0, p0);
  drawChart(ND, NA, ni, n0, p0);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Material:', 10, drawHeight + 18);
  text('Temperature: ' + T + ' K', 10, drawHeight + 56);
  text('N_D = 10^' + ndExpSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 94);
  text('N_A = 10^' + naExpSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 132);
}

function drawCard(ND, NA, ni, n0, p0) {
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
    'nᵢ = ' + ni.toExponential(2) + ' cm⁻³',
    'Net doping (N_D−N_A) = ' + (ND - NA).toExponential(2) + ' cm⁻³',
    'n₀ = ' + n0.toExponential(3) + ' cm⁻³',
    'p₀ = ' + p0.toExponential(3) + ' cm⁻³',
    'Check: n₀·p₀ = ' + (n0 * p0).toExponential(2),
    '(should equal nᵢ² = ' + (ni * ni).toExponential(2) + ')'
  ];
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cardX + 16, cardY + 14 + i * 24, cardW - 32);
  }
}

function drawChart(ND, NA, ni, n0, p0) {
  const chartX = canvasWidth * 0.52, chartY = 50, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;
  const series = [
    { label: 'n₀', value: Math.log10(n0), color: color(90, 62, 237) },
    { label: 'p₀', value: Math.log10(max(p0, 1)), color: color(200, 90, 90) },
    { label: 'nᵢ', value: Math.log10(ni), color: color(90, 180, 120) }
  ];
  smlDrawBarChart(chartX, chartY, chartW, chartH, series, 20, {
    valueFormat: function (v) { return v.toFixed(1); }
  });
  fill(30); noStroke();
  textAlign(CENTER, TOP); textSize(11);
  text('log₁₀ concentration (cm⁻³)', chartX + chartW / 2, chartY - 12);
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
