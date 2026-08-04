// Wide-Bandgap Material Comparison Explorer MicroSim
// Computes specific on-resistance at a chosen breakdown voltage for
// silicon, SiC, or GaN, showing how critical field differences translate
// into large on-resistance differences at the same voltage rating.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, vbrSlider;

const MATERIALS = {
  'Silicon (Si)': { Eg: 1.12, Ecrit: 3e5, mu: 1350, eps: 1.035e-12 },
  'Silicon Carbide (SiC)': { Eg: 3.3, Ecrit: 2.5e6, mu: 900, eps: 0.917e-12 },
  'Gallium Nitride (GaN)': { Eg: 3.4, Ecrit: 3.3e6, mu: 1250, eps: 0.855e-12 }
};

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  for (const k in MATERIALS) materialSelect.option(k);
  materialSelect.selected('Silicon Carbide (SiC)');
  materialSelect.attribute('aria-label', 'Semiconductor material');

  vbrSlider = createSlider(100, 2000, 1200, 50);
  vbrSlider.attribute('aria-label', 'Breakdown voltage in volts');

  positionUIElements();
  describe('Wide-bandgap material comparison explorer: computes specific on-resistance at a chosen breakdown voltage for silicon, SiC, or GaN', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  materialSelect.position(bx + 200, by + drawHeight + 16);
  vbrSlider.position(bx + 200, by + drawHeight + 58);
  vbrSlider.size(min(canvasWidth - 220 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const key = materialSelect.value();
  const m = MATERIALS[key];
  const Vbr = vbrSlider.value();
  const Ron = (4 * Vbr * Vbr) / (m.mu * m.eps * pow(m.Ecrit, 3));

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('Specific On-Resistance vs. Breakdown Voltage: ' + key, canvasWidth / 2, 8);

  const series = [
    { label: 'Band Gap (eV)', value: m.Eg, color: color(90, 62, 237) },
    { label: 'Ecrit (MV/cm)', value: m.Ecrit / 1e6, color: color(230, 150, 30) },
    { label: 'Mobility (÷1000)', value: m.mu / 1000, color: color(40, 130, 70) }
  ];
  smlDrawBarChart(70, 40, canvasWidth - 140, 180, series, 4);

  fill(30); noStroke(); textAlign(CENTER, TOP); textSize(13.5);
  text('At V_BR = ' + Vbr + ' V:  R_on,sp ≈ ' + nfs(Ron, 0, 6) + ' Ω·cm²', canvasWidth / 2, 240);

  fill(90); textAlign(CENTER, TOP); textSize(11.5);
  text('R_on,sp = 4·V_BR² / (μn·εs·Ecrit³)', canvasWidth / 2, 262);

  drawControlLabels();
}

function drawControlLabels() {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Material', 190, drawHeight + 16 + 10);
  text('V_BR = ' + vbrSlider.value() + ' V', 190, drawHeight + 58 + 9);
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
