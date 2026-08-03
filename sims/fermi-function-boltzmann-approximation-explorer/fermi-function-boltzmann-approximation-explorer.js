// Fermi Function and Boltzmann Approximation Explorer MicroSim
// Overlays the exact Fermi-Dirac function f(E) with its Boltzmann
// approximation exp(-(E-EF)/kT), shading the energy range where they
// agree to within 5%, with an adjustable temperature slider and a
// movable energy marker.
// Bloom Level: Understand / Analyze (L2-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let tempSlider, markerSlider;
const KB = 8.617e-5; // eV/K

function fExact(dE, kT) { return 1 / (1 + Math.exp(dE / kT)); }
function fBoltz(dE, kT) { return Math.exp(-dE / kT); }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  tempSlider = createSlider(100, 700, 300, 10);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');

  markerSlider = createSlider(-0.2, 0.3, 0.05, 0.005);
  markerSlider.attribute('aria-label', 'Energy marker, E minus E_F, in eV');

  positionUIElements();
  describe('Fermi function and Boltzmann approximation explorer: overlays the exact Fermi-Dirac function with its Boltzmann approximation and shades the energy range where the approximation is accurate', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  tempSlider.position(bx + 170, by + drawHeight + 15);
  tempSlider.size(min(canvasWidth - 190 - 30, 300));
  markerSlider.position(bx + 170, by + drawHeight + 55);
  markerSlider.size(min(canvasWidth - 190 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const T = tempSlider.value();
  const kT = KB * T;
  const marker = markerSlider.value();

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('f(E) exact vs. Boltzmann approximation e^(-(E-E_F)/kT)', canvasWidth / 2, 8);

  const chartX = 70, chartY = 44, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;
  const XMIN = -0.2, XMAX = 0.3;

  function xToPx(dE) { return map(dE, XMIN, XMAX, chartX, chartX + chartW); }

  // shade good-approximation zone: relative error < 5%, i.e. dE > kT*ln(20) approx
  const boundary = kT * Math.log(19); // where exact=0.05 -> good approx region starts a bit before, use ln(19) as f=0.05 point
  noStroke(); fill(220, 250, 225, 180);
  const bx0 = constrain(xToPx(boundary), chartX, chartX + chartW);
  rect(bx0, chartY, chartX + chartW - bx0, chartH);

  const ptsExact = [], ptsBoltz = [];
  for (let dE = XMIN; dE <= XMAX; dE += 0.005) {
    ptsExact.push({ x: dE, y: fExact(dE, kT) });
    const yb = fBoltz(dE, kT);
    if (yb <= 1.3) ptsBoltz.push({ x: dE, y: min(yb, 1.3) });
  }

  const { xToPx: xpx, yToPx: ypx } = smlDrawLineChart(chartX, chartY, chartW, chartH, XMIN, XMAX, 0, 1.3, [
    { points: ptsExact, color: color(90, 62, 237) },
    { points: ptsBoltz, color: color(220, 150, 30) }
  ], {
    marker: { x: marker, y: fExact(marker, kT) },
    xLabel: 'E − E_F (eV)', yLabel: 'f(E)', yLabelOffset: 34
  });

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Temperature: ' + T + ' K  (k_BT = ' + kT.toFixed(4) + ' eV)', 10, drawHeight + 20);
  const fe = fExact(marker, kT), fb = fBoltz(marker, kT);
  const pctDiff = Math.abs(fb - fe) / fe * 100;
  text('At E−E_F=' + marker.toFixed(3) + ' eV: exact=' + fe.toFixed(4) + ', Boltzmann=' + fb.toFixed(4) + ' (' + pctDiff.toFixed(1) + '% diff)', 10, drawHeight + 60);
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
