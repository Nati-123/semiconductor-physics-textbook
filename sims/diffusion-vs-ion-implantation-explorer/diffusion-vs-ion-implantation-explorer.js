// Diffusion vs Ion Implantation Explorer MicroSim
// Compares the Gaussian diffusion profile (peaked at the surface) to the
// Gaussian implantation profile (peaked at a buried projected range),
// letting students see the fundamentally different depth-profile shapes.
// Bloom Level: Apply/Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let methodSelect, param1Slider, param2Slider;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  methodSelect = createSelect();
  methodSelect.option('Diffusion');
  methodSelect.option('Ion Implantation');
  methodSelect.selected('Diffusion');
  methodSelect.attribute('aria-label', 'Doping method');

  param1Slider = createSlider(0.2, 5, 2, 0.1);
  param1Slider.attribute('aria-label', 'First profile parameter');
  param2Slider = createSlider(0.05, 1.5, 0.5, 0.05);
  param2Slider.attribute('aria-label', 'Second profile parameter');

  positionUIElements();
  describe('Diffusion versus ion implantation explorer: compares the Gaussian diffusion profile peaked at the surface to the Gaussian implantation profile peaked at a buried projected range', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  methodSelect.position(bx + 190, by + drawHeight + 14);
  param1Slider.position(bx + 190, by + drawHeight + 56);
  param1Slider.size(min(canvasWidth - 210 - 30, 300));
  param2Slider.position(bx + 190, by + drawHeight + 96);
  param2Slider.size(min(canvasWidth - 210 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const isDiffusion = methodSelect.value() === 'Diffusion';
  const xMax = 2.0; // microns

  let pts = [];
  let peakX = 0;
  if (isDiffusion) {
    const Dt = param1Slider.value() * 1e-9; // cm^2, scaled by slider (0.2-5 -> 0.2e-9 to 5e-9)
    const N0 = 1e18;
    for (let xu = 0; xu <= xMax; xu += xMax / 300) {
      const xcm = xu * 1e-4;
      const N = N0 * exp(-(xcm * xcm) / (4 * Dt));
      pts.push({ x: xu, y: N });
    }
    peakX = 0;
  } else {
    const Rp = param1Slider.value() * 0.3; // microns, scaled
    const dRp = param2Slider.value();
    const N0 = 1e18;
    for (let xu = 0; xu <= xMax; xu += xMax / 300) {
      const N = N0 * exp(-((xu - Rp) * (xu - Rp)) / (2 * dRp * dRp));
      pts.push({ x: xu, y: N });
    }
    peakX = Rp;
  }

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('Dopant Concentration Profile: ' + methodSelect.value(), canvasWidth / 2, 8);

  const chartX = 70, chartY = 40, chartW = canvasWidth - 110, chartH = drawHeight - 100;
  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, xMax, 0, 1e18,
    [{ points: pts, color: isDiffusion ? color(90, 62, 237) : color(230, 90, 60) }],
    { xLabel: 'depth x (μm)', yLabel: 'N(x) (cm⁻³)', marker: { x: peakX, y: pts.reduce((m, p) => max(m, p.y), 0) }, markerColor: color(40, 130, 70) }
  );

  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(12.5);
  const info = isDiffusion
    ? 'Profile always peaks at the surface (x = 0) and decays monotonically with depth.'
    : 'Profile peaks at the projected range Rp ≈ ' + nf(peakX, 1, 2) + ' μm, buried below the surface.';
  text(info, chartX, chartY + chartH + 22, chartW);

  drawControlLabels(isDiffusion);
}

function drawControlLabels(isDiffusion) {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Method', 185, drawHeight + 14 + 9);
  if (isDiffusion) {
    text('Dt (×10⁻⁹ cm²) = ' + nf(param1Slider.value(), 1, 1), 185, drawHeight + 56 + 9);
    fill(180); text('(unused for diffusion)', 185, drawHeight + 96 + 9);
  } else {
    text('Projected range factor = ' + nf(param1Slider.value(), 1, 1), 185, drawHeight + 56 + 9);
    fill(30); text('Straggle ΔRp (μm) = ' + nf(param2Slider.value(), 1, 2), 185, drawHeight + 96 + 9);
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
