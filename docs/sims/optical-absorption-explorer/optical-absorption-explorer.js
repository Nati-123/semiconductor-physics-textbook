// Optical Absorption and Beer-Lambert Explorer MicroSim
// Plots I(x) = I0 * exp(-alpha*x), the Beer-Lambert law. The absorption
// coefficient alpha is NOT a free abstract slider: it is derived from a
// chosen real material's band gap (via the shared SML_MATERIALS Varshni
// model) and a chosen illumination wavelength, using the standard
// textbook near-edge absorption-edge forms
//   direct gap:   alpha = A_dir * sqrt(hv - Eg)      (hv > Eg)
//   indirect gap: alpha = A_ind * (hv - Eg)^2         (hv > Eg)
// with A_dir/A_ind calibrated (illustrative, like the Chapter 11 mobility
// model) so alpha lands in the correct order of magnitude for each
// material's known near-edge absorption. Below the gap (hv <= Eg) the
// material is treated as nearly transparent (alpha floor).
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 445;
let controlHeight = 176;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, lambdaSlider;

// hv > Eg calibration constants (illustrative near-edge model, see header).
const A_DIRECT = 1.8e4;   // cm^-1 / sqrt(eV)   -- GaAs-like direct gap
const A_INDIRECT = 5500;  // cm^-1 / eV^2       -- Si/Ge-like indirect gap
const ALPHA_FLOOR = 0.5;  // cm^-1, sub-gap "nearly transparent" value

const MATERIAL_KEYS = ['Silicon', 'Germanium', 'GaAs'];
const DIRECT_GAP = { 'Silicon': false, 'Germanium': false, 'GaAs': true };

function computeAlpha(matKey, lambdaNm) {
  const mat = SML_MATERIALS[matKey];
  const Eg = smlEgVarshni(mat, 300);
  const hv = 1240 / lambdaNm; // eV
  const dE = hv - Eg;
  let alpha;
  if (dE <= 0) {
    alpha = ALPHA_FLOOR;
  } else if (DIRECT_GAP[matKey]) {
    alpha = A_DIRECT * Math.sqrt(dE);
  } else {
    alpha = A_INDIRECT * dE * dE;
  }
  return { alpha, Eg, hv, dE };
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  MATERIAL_KEYS.forEach(k => materialSelect.option(k + (DIRECT_GAP[k] ? ' (direct gap)' : ' (indirect gap)'), k));
  materialSelect.selected('GaAs');
  materialSelect.attribute('aria-label', 'Material preset');

  lambdaSlider = createSlider(400, 1900, 650, 5);
  lambdaSlider.attribute('aria-label', 'Illumination wavelength in nanometers');

  positionUIElements();
  describe('Optical absorption and Beer-Lambert explorer: plots light intensity versus depth for an absorption coefficient computed from a chosen material band gap and illumination wavelength, with the penetration depth marked', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  materialSelect.position(bx + 150, by + drawHeight + 12);
  lambdaSlider.position(bx + 150, by + drawHeight + 50);
  lambdaSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const matKey = materialSelect.value();
  const lambdaNm = lambdaSlider.value();
  const { alpha, Eg, hv, dE } = computeAlpha(matKey, lambdaNm);
  const deltaUm = (1 / alpha) * 1e4;
  const transparent = dE <= 0;

  // Title, pushed clear of the fixed top-right fullscreen button.
  noStroke(); fill(20);
  smlMathText(canvasWidth / 2, 12, 'I(x) = I_0 e^(−αx)', { align: 'center', size: 17 });

  const chartX = 82, chartY = 60, chartW = canvasWidth - chartX - 30, chartH = drawHeight - chartY - 56;
  const XMAX_UM = transparent ? max(deltaUm, 20) : max(deltaUm * 5, 0.5);

  const pts = [];
  for (let xUm = 0; xUm <= XMAX_UM; xUm += XMAX_UM / 150) {
    const xCm = xUm * 1e-4;
    pts.push({ x: xUm, y: Math.exp(-alpha * xCm) });
  }
  const yTicks = [1.0, 0.5, 0.3679, 0.1];
  const xTicks = transparent ? [0, XMAX_UM] : [0, deltaUm, 2 * deltaUm, 3 * deltaUm, 4 * deltaUm, 5 * deltaUm];
  const info = smlDrawLineChart(chartX, chartY, chartW, chartH, 0, XMAX_UM, 0, 1.05, [
    { points: pts, color: color(230, 150, 30) }
  ], {
    xLabel: 'Depth x (μm)', yLabel: 'I(x) / I_0', yLabelOffset: 48,
    xTicks: xTicks, xTickFormat: v => v.toFixed(v < 1 ? 2 : 1),
    yTicks: yTicks, yTickFormat: v => v === 0.3679 ? '0.37' : v.toFixed(1)
  });

  if (!transparent && deltaUm <= XMAX_UM) {
    const xPx = info.xToPx(deltaUm);
    const yPx = info.yToPx(Math.exp(-1));
    stroke(90, 62, 237); strokeWeight(1);
    drawingContext.setLineDash([3, 3]);
    line(xPx, chartY, xPx, chartY + chartH);
    line(chartX, yPx, chartX + chartW, yPx);
    drawingContext.setLineDash([]);
    noStroke(); fill(90, 62, 237);
    circle(xPx, yPx, 6);
    textAlign(LEFT, BOTTOM); textSize(11);
    text('x = 1/α: I/I₀ = e⁻¹ ≈ 0.37 (37% remains)', min(xPx + 6, chartX + chartW - 210), chartY + 14);
  }

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12.5);
  text('Material:', 10, drawHeight + 18);
  text('λ = ' + lambdaNm + ' nm', 10, drawHeight + 56);

  textSize(12);
  const rowY = drawHeight + 90;
  text('E_g = ' + Eg.toFixed(2) + ' eV    hν = 1240/λ = ' + hv.toFixed(2) + ' eV    hν − E_g = ' + dE.toFixed(2) + ' eV', 10, rowY);
  if (transparent) {
    fill(140, 60, 20);
    text('hν ≤ E_g: photon energy too low to excite an electron across the gap — material is nearly transparent (α ≈ ' + alpha.toFixed(1) + ' cm⁻¹)', 10, rowY + 22, canvasWidth - 20);
  } else {
    text('α = ' + alpha.toExponential(2) + ' cm⁻¹   (' + (DIRECT_GAP[matKey] ? 'direct gap: α ∝ √(hν−E_g)' : 'indirect gap: α ∝ (hν−E_g)²') + ')', 10, rowY + 22);
    text('Penetration depth 1/α = ' + deltaUm.toFixed(3) + ' μm    (86% absorbed within 2/α = ' + (deltaUm * 2).toFixed(3) + ' μm)', 10, rowY + 44);
  }
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
