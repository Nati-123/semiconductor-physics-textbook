// Photodetector Explorer MicroSim
// Computes photocurrent and responsivity from incident optical power,
// quantum efficiency, and photon energy.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let powerSlider, etaSlider, energySlider;
const q = 1.6e-19;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  powerSlider = createSlider(0.1, 5, 1, 0.1);
  powerSlider.attribute('aria-label', 'Incident optical power in milliwatts');
  etaSlider = createSlider(0.1, 1.0, 0.8, 0.05);
  etaSlider.attribute('aria-label', 'Quantum efficiency');
  energySlider = createSlider(0.5, 2.0, 1.0, 0.05);
  energySlider.attribute('aria-label', 'Photon energy in electron volts');

  positionUIElements();
  describe('Photodetector explorer: computes photocurrent and responsivity from incident optical power, quantum efficiency, and photon energy', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  powerSlider.position(bx + 220, by + drawHeight + 14);
  powerSlider.size(min(canvasWidth - 240 - 30, 300));
  etaSlider.position(bx + 220, by + drawHeight + 52);
  etaSlider.size(min(canvasWidth - 240 - 30, 300));
  energySlider.position(bx + 220, by + drawHeight + 90);
  energySlider.size(min(canvasWidth - 240 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const Popt = powerSlider.value(); // mW
  const eta = etaSlider.value();
  const hf = energySlider.value(); // eV

  const responsivity = (eta * q) / (hf * q); // A/W  = eta/hf(eV) since q cancels
  const Iph = responsivity * (Popt / 1000) * 1000; // mA

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('Photodetector: Responsivity and Photocurrent', canvasWidth / 2, 8);

  const chartX = 70, chartY = 40, chartW = canvasWidth - 110, chartH = drawHeight - 100;
  const pts = [];
  for (let p = 0; p <= 5; p += 0.1) pts.push({ x: p, y: responsivity * p });
  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 5, 0, responsivity * 5 * 1.1,
    [{ points: pts, color: color(90, 62, 237) }],
    { xLabel: 'optical power (mW)', yLabel: 'photocurrent (mA)', marker: { x: Popt, y: Iph }, markerColor: color(230, 90, 60) }
  );

  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(13);
  text('Responsivity R = ηq/hf ≈ ' + nf(responsivity, 1, 3) + ' A/W', chartX, chartY + chartH + 20);
  text('Photocurrent at ' + nf(Popt, 1, 1) + ' mW ≈ ' + nf(Iph, 1, 2) + ' mA', chartX, chartY + chartH + 42);

  drawControlLabels();
}

function drawControlLabels() {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Optical power ' + nf(powerSlider.value(), 1, 1) + ' mW', 215, drawHeight + 14 + 9);
  text('Quantum efficiency η = ' + nf(etaSlider.value(), 1, 2), 215, drawHeight + 52 + 9);
  text('Photon energy hf = ' + nf(energySlider.value(), 1, 2) + ' eV', 215, drawHeight + 90 + 9);
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
