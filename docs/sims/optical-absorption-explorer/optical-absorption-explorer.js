// Optical Absorption and Beer-Lambert Explorer MicroSim
// Plots I(x) = I0 * exp(-alpha*x), the Beer-Lambert law, for a chosen
// absorption coefficient (either set directly or via a material preset
// illustrating direct- vs. indirect-gap absorption strength), with the
// penetration depth 1/alpha marked.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, alphaSlider;

const PRESETS = {
  'GaAs near band edge (direct)': 4,
  'Si well above band edge (indirect)': 4,
  'Si near band edge (indirect)': 2,
  'Custom': null
};

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  Object.keys(PRESETS).forEach(k => materialSelect.option(k));
  materialSelect.selected('GaAs near band edge (direct)');
  materialSelect.attribute('aria-label', 'Material preset');
  materialSelect.changed(onMaterialChange);

  alphaSlider = createSlider(1, 5, 4, 0.05);
  alphaSlider.attribute('aria-label', 'Absorption coefficient exponent, base 10, in inverse centimeters');

  positionUIElements();
  describe('Optical absorption and Beer-Lambert explorer: plots light intensity versus depth for a chosen absorption coefficient, with the penetration depth marked', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function onMaterialChange() {
  const preset = PRESETS[materialSelect.value()];
  if (preset !== null) alphaSlider.value(preset);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  materialSelect.position(bx + 190, by + drawHeight + 12);
  alphaSlider.position(bx + 190, by + drawHeight + 50);
  alphaSlider.size(min(canvasWidth - 210 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const alpha = Math.pow(10, alphaSlider.value()); // cm^-1
  const deltaUm = (1 / alpha) * 1e4;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('I(x) = I0 · e^(−αx)', canvasWidth / 2, 8);

  const chartX = 78, chartY = 44, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;
  const XMAX_UM = max(deltaUm * 5, 1);

  const pts = [];
  for (let xUm = 0; xUm <= XMAX_UM; xUm += XMAX_UM / 150) {
    const xCm = xUm * 1e-4;
    pts.push({ x: xUm, y: Math.exp(-alpha * xCm) });
  }
  const info = smlDrawLineChart(chartX, chartY, chartW, chartH, 0, XMAX_UM, 0, 1.05, [
    { points: pts, color: color(230, 150, 30) }
  ], { xLabel: 'Depth x (μm)', yLabel: 'I(x) / I0', yLabelOffset: 48 });

  if (deltaUm <= XMAX_UM) {
    const xPx = info.xToPx(deltaUm);
    stroke(90, 62, 237); strokeWeight(1);
    drawingContext.setLineDash([3, 3]);
    line(xPx, chartY, xPx, chartY + chartH);
    drawingContext.setLineDash([]);
    noStroke(); fill(90, 62, 237); textAlign(LEFT, BOTTOM); textSize(11);
    text('1/α = ' + deltaUm.toFixed(3) + ' μm (37% point)', xPx + 4, chartY + 14);
  }

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Material:', 10, drawHeight + 18);
  text('α = 10^' + alphaSlider.value().toFixed(2) + ' cm⁻¹ = ' + alpha.toExponential(2) + ' cm⁻¹', 10, drawHeight + 56);
  text('Penetration depth 1/α = ' + deltaUm.toFixed(3) + ' μm', 10, drawHeight + 94);
  text('86% absorbed within ' + (deltaUm * 2).toFixed(2) + ' μm  (2 penetration depths)', 10, drawHeight + 118);
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
