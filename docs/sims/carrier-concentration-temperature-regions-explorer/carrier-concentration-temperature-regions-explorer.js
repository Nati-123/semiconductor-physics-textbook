// Carrier Concentration vs. Temperature (Three Regions) Explorer MicroSim
// Plots a simplified n(T) = N_D*f_ion(T) + n_i(T) curve on a log10(n) vs.
// linear T axis, shading the freeze-out, extrinsic (saturation), and
// intrinsic regions. This is an illustrative combination, not the exact
// charge-neutrality solution (that is Chapters 9-10's subject).
// Bloom Level: Analyze (L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let ndExpSlider, edSlider;
const KB = 8.617e-5; // eV/K
const EG0 = 1.166, ALPHA = 4.73e-4, BETA = 636; // silicon Varshni
const NI_A = 4.7e15; // calibration constant, cm^-3 K^-1.5
const B_FREEZE = 0.02; // freeze-out sigmoid constant

function EgAt(T) { return EG0 - (ALPHA * T * T) / (T + BETA); }
function niAt(T) {
  const kT = KB * T;
  return NI_A * Math.pow(T, 1.5) * Math.exp(-EgAt(T) / (2 * kT));
}
function fIon(T, ED) {
  const kT = KB * T;
  return 1 / (1 + B_FREEZE * Math.exp(ED / kT));
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  ndExpSlider = createSlider(14, 18, 16, 0.1);
  ndExpSlider.attribute('aria-label', 'Donor concentration exponent (power of 10, per cm cubed)');

  edSlider = createSlider(0.02, 0.15, 0.045, 0.005);
  edSlider.attribute('aria-label', 'Donor ionization energy in eV');

  positionUIElements();
  describe('Carrier concentration versus temperature explorer: plots the freeze-out, extrinsic, and intrinsic temperature regions on a log concentration versus temperature chart', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  ndExpSlider.position(bx + 200, by + drawHeight + 15);
  ndExpSlider.size(min(canvasWidth - 220 - 30, 280));
  edSlider.position(bx + 200, by + drawHeight + 55);
  edSlider.size(min(canvasWidth - 220 - 30, 280));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const ND = Math.pow(10, ndExpSlider.value());
  const ED = edSlider.value();

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('n(T) ≈ N_D · f_ion(T) + n_i(T)  (silicon, illustrative model)', canvasWidth / 2, 8);

  const chartX = 70, chartY = 40, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 96;
  const TMIN = 50, TMAX = 700, YMIN = 8, YMAX = 19;

  function tToPx(T) { return map(T, TMIN, TMAX, chartX, chartX + chartW); }

  // region shading
  const steps = 130;
  noStroke();
  for (let i = 0; i < steps; i++) {
    const T0 = TMIN + (i / steps) * (TMAX - TMIN);
    const T1 = TMIN + ((i + 1) / steps) * (TMAX - TMIN);
    const Tm = (T0 + T1) / 2;
    const f = fIon(Tm, ED);
    const ni = niAt(Tm);
    let col;
    if (ni > 0.5 * ND) col = color(255, 210, 210, 160);      // intrinsic
    else if (f < 0.9) col = color(210, 225, 255, 160);       // freeze-out
    else col = color(210, 250, 215, 160);                    // extrinsic
    fill(col);
    rect(tToPx(T0), chartY, tToPx(T1) - tToPx(T0) + 1, chartH);
  }

  // build curve points
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const T = TMIN + (i / steps) * (TMAX - TMIN);
    const n = ND * fIon(T, ED) + niAt(T);
    pts.push({ x: T, y: constrain(Math.log10(n), YMIN, YMAX) });
  }

  smlDrawLineChart(chartX, chartY, chartW, chartH, TMIN, TMAX, YMIN, YMAX, [{ points: pts, color: color(90, 62, 237) }], {
    xLabel: 'Temperature (K)', yLabel: 'log₁₀ n (cm⁻³)', yLabelOffset: 34
  });

  // N_D reference line
  const ndLogY = map(constrain(Math.log10(ND), YMIN, YMAX), YMIN, YMAX, chartY + chartH, chartY);
  stroke(120); strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(chartX, ndLogY, chartX + chartW, ndLogY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90);
  textAlign(LEFT, BOTTOM); textSize(11);
  text('N_D', chartX + 4, ndLogY - 3);

  // region labels
  fill(60); noStroke(); textAlign(CENTER, TOP); textSize(11);
  text('Freeze-Out', tToPx(120), chartY + 6);
  text('Extrinsic', tToPx(350), chartY + 6);
  text('Intrinsic', tToPx(620), chartY + 6);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('N_D = 10^' + ndExpSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 20);
  text('E_D = ' + ED.toFixed(3) + ' eV', 10, drawHeight + 60);
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
