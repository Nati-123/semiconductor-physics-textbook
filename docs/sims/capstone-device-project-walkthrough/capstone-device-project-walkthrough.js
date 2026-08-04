// Capstone Device Project Walkthrough MicroSim
// A cascading power-diode design calculator: target breakdown voltage,
// current rating, die area, and thickness flow through drift doping and
// width (Ch. 14-15), specific on-resistance and forward drop (Ch. 11),
// and power dissipation and temperature rise (Ch. 17), all recomputed
// together and displayed as a connected chain.
// Bloom Level: Create (L6)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 480;
let minDrawHeight = 460;
let controlHeight = 190;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let bvSlider, iSlider, aSlider, tSlider;

const Q = 1.602e-19, EPS_S = 1.035e-12, ECRIT = 3e5, MU_N = 1350, KAPPA = 150, VF_JUNCTION = 0.8;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  bvSlider = createSlider(100, 1500, 500, 10);
  bvSlider.attribute('aria-label', 'Target breakdown voltage in volts');
  iSlider = createSlider(0.5, 20, 5, 0.5);
  iSlider.attribute('aria-label', 'Rated forward current in amps');
  aSlider = createSlider(0.02, 0.5, 0.1, 0.01);
  aSlider.attribute('aria-label', 'Die area in square centimeters');
  tSlider = createSlider(50, 500, 200, 10);
  tSlider.attribute('aria-label', 'Die thickness in micrometers');

  positionUIElements();
  describe('Capstone device project walkthrough: a cascading power diode design calculator computing drift doping, width, on-resistance, forward drop, power dissipation, and temperature rise from target specifications', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  bvSlider.position(bx + 150, by + drawHeight + 12);
  bvSlider.size(min(canvasWidth - 170 - 30, 320));
  iSlider.position(bx + 150, by + drawHeight + 50);
  iSlider.size(min(canvasWidth - 170 - 30, 320));
  aSlider.position(bx + 150, by + drawHeight + 88);
  aSlider.size(min(canvasWidth - 170 - 30, 320));
  tSlider.position(bx + 150, by + drawHeight + 126);
  tSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const BV = bvSlider.value();
  const I = iSlider.value();
  const A = aSlider.value();
  const tUm = tSlider.value();

  const ND = EPS_S * ECRIT * ECRIT / (2 * Q * BV);
  const W = 2 * BV / ECRIT;
  const RonSp = 4 * BV * BV / (MU_N * EPS_S * Math.pow(ECRIT, 3));
  const Ron = RonSp / A;
  const Vdrift = I * Ron;
  const VF = VF_JUNCTION + Vdrift;
  const P = I * VF;
  const tM = tUm * 1e-6, AM2 = A * 1e-4;
  const dT = P * tM / (KAPPA * AM2);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('Power Diode Design: from specification to temperature rise', canvasWidth / 2, 8);

  drawChain(ND, W, RonSp, Ron, Vdrift, VF, P, dT);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12);
  text('Target V_BR (V):', 10, drawHeight + 18);
  text('Rated I (A):', 10, drawHeight + 56);
  text('Die area A (cm²):', 10, drawHeight + 94);
  text('Die thickness (μm):', 10, drawHeight + 132);
}

function drawChain(ND, W, RonSp, Ron, Vdrift, VF, P, dT) {
  const boxes = [
    { label: 'ND (drift doping)', value: ND.toExponential(2) + ' cm⁻³', col: color(90, 62, 237) },
    { label: 'W (drift width)', value: (W * 1e4).toFixed(1) + ' μm', col: color(90, 62, 237) },
    { label: 'Ron,sp', value: RonSp.toFixed(4) + ' Ω·cm²', col: color(230, 150, 30) },
    { label: 'Ron', value: Ron.toFixed(4) + ' Ω', col: color(230, 150, 30) },
    { label: 'VF (total)', value: VF.toFixed(3) + ' V', col: color(230, 90, 60) },
    { label: 'P (dissipation)', value: P.toFixed(2) + ' W', col: color(220, 60, 100) },
    { label: 'ΔT (die)', value: dT.toFixed(2) + ' K', col: color(40, 150, 90) }
  ];
  const n = boxes.length;
  const cols = 4, rows = 2;
  const areaX = 20, areaY = 36, areaW = canvasWidth - 40, areaH = drawHeight - 60;
  const boxW = areaW / cols - 10, boxH = areaH / rows - 10;

  for (let i = 0; i < n; i++) {
    const col = i % cols, row = floor(i / cols);
    const bx = areaX + col * (boxW + 10), by = areaY + row * (boxH + 10);
    noStroke(); fill(red(boxes[i].col), green(boxes[i].col), blue(boxes[i].col), 35);
    stroke(boxes[i].col); strokeWeight(1.5);
    rect(bx, by, boxW, boxH, 6);
    noStroke(); fill(30); textAlign(CENTER, TOP); textSize(11);
    text(boxes[i].label, bx + boxW / 2, by + 8, boxW - 8);
    fill(boxes[i].col); textAlign(CENTER, CENTER); textSize(13); textStyle(BOLD);
    text(boxes[i].value, bx + boxW / 2, by + boxH / 2 + 8, boxW - 8);
    textStyle(NORMAL);

    if (col < cols - 1 && i < n - 1) {
      noStroke(); fill(120); textAlign(CENTER, CENTER); textSize(14);
      text('→', bx + boxW + 5, by + boxH / 2);
    }
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
