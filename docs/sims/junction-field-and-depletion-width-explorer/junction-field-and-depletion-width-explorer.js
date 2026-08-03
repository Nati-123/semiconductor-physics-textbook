// Junction Electric Field and Depletion Width Explorer MicroSim
// Applies Poisson's equation to the depletion approximation for a silicon
// step junction: computes depletion charge density rho(x), the triangular
// junction electric field E(x), and the electrostatic potential psi(x) in
// closed form, and displays all three stacked and aligned, with a
// draggable position marker. NA and ND sliders update xp, xn, W, Emax,
// and Vbi live.
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 780;
let drawHeight = 520;
let minDrawHeight = 500;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let naSlider, ndSlider, xMarkSlider;

const Q = 1.602e-19;      // C
const EPS = 1.035e-12;    // F/cm  (Si, er=11.7)
const NI = 1.5e10;        // cm^-3 (Si, 300K)
const KT_Q = 0.0259;      // V (300K)

function junctionGeometry(NA, ND) {
  const Vbi = KT_Q * Math.log((NA * ND) / (NI * NI));
  const W = Math.sqrt((2 * EPS * Vbi / Q) * (1 / NA + 1 / ND)); // cm
  const xn = W * NA / (NA + ND);
  const xp = W * ND / (NA + ND);
  const Emax = Q * NA * xp / EPS; // V/cm
  return { Vbi, W, xn, xp, Emax };
}

function rhoOfX(xUm, NA, ND, xpUm, xnUm) {
  if (xUm < -xpUm || xUm > xnUm) return 0;
  return xUm < 0 ? -NA : ND;
}

function eFieldOfX(xUm, NA, ND, xpUm, xnUm) {
  const xCm = xUm * 1e-4;
  const xpCm = xpUm * 1e-4, xnCm = xnUm * 1e-4;
  if (xUm < -xpUm || xUm > xnUm) return 0;
  if (xUm <= 0) return -(Q * NA / EPS) * (xCm + xpCm);
  return (Q * ND / EPS) * (xCm - xnCm);
}

function psiOfX(xUm, NA, ND, xpUm, xnUm) {
  const xCm = xUm * 1e-4;
  const xpCm = xpUm * 1e-4, xnCm = xnUm * 1e-4;
  if (xUm < -xpUm) return 0;
  if (xUm > xnUm) return (Q / (2 * EPS)) * (NA * xpCm * xpCm + ND * xnCm * xnCm);
  if (xUm <= 0) return (Q * NA / (2 * EPS)) * (xCm + xpCm) * (xCm + xpCm);
  const psi0 = (Q * NA / (2 * EPS)) * xpCm * xpCm;
  return psi0 + (Q * ND / EPS) * (xnCm * xCm - xCm * xCm / 2);
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  naSlider = createSlider(15, 19, 17, 0.1);
  naSlider.attribute('aria-label', 'Acceptor doping concentration exponent NA');
  ndSlider = createSlider(15, 19, 16, 0.1);
  ndSlider.attribute('aria-label', 'Donor doping concentration exponent ND');
  xMarkSlider = createSlider(0, 1, 0.5, 0.01);
  xMarkSlider.attribute('aria-label', 'Position marker fraction across the depletion region');

  positionUIElements();
  describe('Junction electric field and depletion width explorer: shows depletion charge density, junction electric field, and electrostatic potential stacked together for a silicon step junction, with a draggable position marker', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  naSlider.position(bx + 150, by + drawHeight + 12);
  naSlider.size(min(canvasWidth - 170 - 30, 340));
  ndSlider.position(bx + 150, by + drawHeight + 50);
  ndSlider.size(min(canvasWidth - 170 - 30, 340));
  xMarkSlider.position(bx + 150, by + drawHeight + 88);
  xMarkSlider.size(min(canvasWidth - 170 - 30, 340));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const NA = Math.pow(10, naSlider.value());
  const ND = Math.pow(10, ndSlider.value());
  const geo = junctionGeometry(NA, ND);
  const xpUm = geo.xp * 1e4, xnUm = geo.xn * 1e4, WUm = geo.W * 1e4;
  const xMarkUm = -xpUm + xMarkSlider.value() * WUm;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15.5);
  text('Poisson’s Equation: ρ(x) → E(x) → ψ(x)   (silicon step junction)', canvasWidth / 2, 6);

  const chartX = 92, chartW = canvasWidth - chartX - 30;
  const rowH = (drawHeight - 40) / 3 - 10;
  const rowY1 = 32, rowY2 = rowY1 + rowH + 16, rowY3 = rowY2 + rowH + 16;
  const xMin = -xpUm * 1.15 - 1e-9, xMax = xnUm * 1.15 + 1e-9;

  const rhoPts = [], ePts = [], psiPts = [];
  const N = 140;
  for (let i = 0; i <= N; i++) {
    const xv = xMin + (xMax - xMin) * (i / N);
    rhoPts.push({ x: xv, y: rhoOfX(xv, NA, ND, xpUm, xnUm) });
    ePts.push({ x: xv, y: eFieldOfX(xv, NA, ND, xpUm, xnUm) });
    psiPts.push({ x: xv, y: psiOfX(xv, NA, ND, xpUm, xnUm) });
  }
  const rhoMax = Math.max(NA, ND) * 1.15;

  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(11.5);
  text('ρ(x) / q  (cm⁻³)', 10, rowY1);
  const info1 = smlDrawLineChart(chartX, rowY1, chartW, rowH, xMin, xMax, -rhoMax, rhoMax,
    [{ points: rhoPts, color: color(230, 90, 60) }],
    { marker: { x: xMarkUm, y: rhoOfX(xMarkUm, NA, ND, xpUm, xnUm) } });

  text('E(x)  (V/cm)', 10, rowY2);
  const info2 = smlDrawLineChart(chartX, rowY2, chartW, rowH, xMin, xMax, -geo.Emax * 1.15, geo.Emax * 0.15,
    [{ points: ePts, color: color(90, 62, 237) }],
    { marker: { x: xMarkUm, y: eFieldOfX(xMarkUm, NA, ND, xpUm, xnUm) } });

  text('ψ(x)  (V)', 10, rowY3);
  const info3 = smlDrawLineChart(chartX, rowY3, chartW, rowH, xMin, xMax, -geo.Vbi * 0.15, geo.Vbi * 1.15,
    [{ points: psiPts, color: color(40, 140, 90) }],
    { marker: { x: xMarkUm, y: psiOfX(xMarkUm, NA, ND, xpUm, xnUm) }, xLabel: 'Position x (μm)' });

  noStroke(); fill(30); textAlign(LEFT, TOP); textSize(12);
  text(
    'NA = ' + NA.toExponential(1) + ' cm⁻³   ND = ' + ND.toExponential(1) + ' cm⁻³    ' +
    'xp = ' + xpUm.toFixed(3) + ' μm   xn = ' + xnUm.toFixed(3) + ' μm   W = ' + WUm.toFixed(3) + ' μm',
    10, drawHeight + 126, canvasWidth - 20
  );
  text(
    'V_bi = ' + geo.Vbi.toFixed(3) + ' V   E_max = ' + geo.Emax.toExponential(2) + ' V/cm   at x = ' + xMarkUm.toFixed(3) + ' μm: E = ' +
    eFieldOfX(xMarkUm, NA, ND, xpUm, xnUm).toExponential(2) + ' V/cm, ψ = ' + psiOfX(xMarkUm, NA, ND, xpUm, xnUm).toFixed(3) + ' V',
    10, drawHeight + 144, canvasWidth - 20
  );
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
