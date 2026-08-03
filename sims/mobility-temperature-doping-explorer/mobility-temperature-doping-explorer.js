// Mobility vs. Temperature and Doping (Matthiessen's Rule) Explorer
// MicroSim
// Plots lattice-limited mobility (~T^-1.5), impurity-limited mobility
// (~T^1.5/N), and their Matthiessen's-rule combination, for an
// adjustable carrier type, doping concentration, and temperature
// marker. Calibration constants are illustrative, chosen to roughly
// match real silicon mobility at 300 K.
// Bloom Level: Analyze (L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let carrierSelect, ndExpSlider, tempSlider;

// Illustrative calibration: muL0 = lattice-limited mobility at 300K;
// muI0 = impurity-limited mobility at 300K, N=1e17 cm^-3.
const CARRIERS = {
  'Electrons (n-type)': { muL0: 1350, muI0: 1965 },
  'Holes (p-type)': { muL0: 480, muI0: 800 }
};

function muLattice(muL0, T) { return muL0 * Math.pow(T / 300, -1.5); }
function muImpurity(muI0, T, N) { return muI0 * Math.pow(T / 300, 1.5) * (1e17 / N); }
function muTotal(muL, muI) { return 1 / (1 / muL + 1 / muI); }

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

  tempSlider = createSlider(100, 600, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature marker in kelvin');

  positionUIElements();
  describe('Mobility versus temperature and doping explorer: plots lattice-limited, impurity-limited, and Matthiessen-rule combined mobility curves for an adjustable carrier type, doping level, and temperature marker', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  carrierSelect.position(bx + 110, by + drawHeight + 12);
  ndExpSlider.position(bx + 220, by + drawHeight + 50);
  ndExpSlider.size(min(canvasWidth - 240 - 30, 260));
  tempSlider.position(bx + 220, by + drawHeight + 88);
  tempSlider.size(min(canvasWidth - 240 - 30, 260));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const carrier = CARRIERS[carrierSelect.value()];
  const N = Math.pow(10, ndExpSlider.value());
  const Tmark = tempSlider.value();

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Matthiessen\'s Rule: 1/μ_total = 1/μ_L + 1/μ_I', canvasWidth / 2, 8);

  const chartX = 70, chartY = 44, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;
  const TMIN = 100, TMAX = 600, LOGMIN = 0, LOGMAX = 4.3; // log10(mobility), covers ~1 to ~20000

  const ptsL = [], ptsI = [], ptsT = [];
  for (let T = TMIN; T <= TMAX; T += 5) {
    const muL = muLattice(carrier.muL0, T);
    const muI = muImpurity(carrier.muI0, T, N);
    ptsL.push({ x: T, y: Math.log10(muL) });
    ptsI.push({ x: T, y: Math.log10(muI) });
    ptsT.push({ x: T, y: Math.log10(muTotal(muL, muI)) });
  }

  const muLm = muLattice(carrier.muL0, Tmark);
  const muIm = muImpurity(carrier.muI0, Tmark, N);
  const muTm = muTotal(muLm, muIm);

  smlDrawLineChart(chartX, chartY, chartW, chartH, TMIN, TMAX, LOGMIN, LOGMAX, [
    { points: ptsL, color: color(90, 180, 120) },
    { points: ptsI, color: color(230, 140, 60) },
    { points: ptsT, color: color(90, 62, 237) }
  ], {
    marker: { x: Tmark, y: Math.log10(muTm) },
    xLabel: 'Temperature (K)', yLabel: 'log₁₀ μ (cm²/V·s)', yLabelOffset: 34
  });

  fill(90, 180, 120); noStroke(); textAlign(LEFT, TOP); textSize(11);
  text('■ Lattice-limited μ_L', chartX + 10, chartY + 4);
  fill(230, 140, 60);
  text('■ Impurity-limited μ_I', chartX + 10, chartY + 20);
  fill(90, 62, 237);
  text('■ Total μ (Matthiessen)', chartX + 10, chartY + 36);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Carrier:', 10, drawHeight + 18);
  text('N = 10^' + ndExpSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 56);
  text('T marker = ' + Tmark + ' K  →  μ_total = ' + muTm.toFixed(0) + ' cm²/V·s', 10, drawHeight + 94);
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
