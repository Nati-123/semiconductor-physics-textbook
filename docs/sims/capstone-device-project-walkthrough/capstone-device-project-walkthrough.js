// Capstone Device Project Walkthrough MicroSim
// A cascading power-diode design calculator drawn as a vertical design
// chain: target breakdown voltage -> drift doping/width (Ch. 14-15) ->
// specific and absolute on-resistance (Ch. 11) -> forward drop -> power
// dissipation -> temperature rise (Ch. 17). Each stage is a connected
// card with a downward arrow carrying the formula that produced it, so
// changing any input visibly propagates down the whole chain.
// Bloom Level: Create (L6)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 780;
let drawHeight = 555;
let minDrawHeight = 555;
let controlHeight = 190;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let bvSlider, iSlider, aSlider, tSlider;

// Illustrative silicon constants (textbook-typical, not a specific datasheet part).
const Q = 1.602e-19;       // C
const EPS_S = 1.035e-12;   // F/cm  (Si, eps_r=11.7)
const ECRIT = 3e5;         // V/cm  (Si avalanche critical field, illustrative)
const MU_N = 1350;         // cm^2/(V.s), Si electron mobility
const KAPPA = 150;         // W/(m.K), Si thermal conductivity near 300 K
const VF_JUNCTION = 0.8;   // V, illustrative built-in junction drop for a Si power diode

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
  describe('Capstone device project walkthrough: a vertical design chain showing how a target breakdown voltage propagates through drift doping, drift width, specific on-resistance, device resistance, forward voltage, power dissipation, and temperature rise', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  bvSlider.position(bx + 190, by + drawHeight + 12);
  bvSlider.size(min(canvasWidth - 210 - 30, 320));
  iSlider.position(bx + 190, by + drawHeight + 50);
  iSlider.size(min(canvasWidth - 210 - 30, 320));
  aSlider.position(bx + 190, by + drawHeight + 88);
  aSlider.size(min(canvasWidth - 210 - 30, 320));
  tSlider.position(bx + 190, by + drawHeight + 126);
  tSlider.size(min(canvasWidth - 210 - 30, 320));
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

  // ---- Design-chain physics (Si, illustrative constants above) ----
  const ND = EPS_S * ECRIT * ECRIT / (2 * Q * BV);                 // cm^-3
  const W = 2 * BV / ECRIT;                                         // cm
  const RonSp = 4 * BV * BV / (MU_N * EPS_S * Math.pow(ECRIT, 3));  // Ohm.cm^2
  const Ron = RonSp / A;                                            // Ohm
  const Vdrift = I * Ron;                                           // V
  const VF = VF_JUNCTION + Vdrift;                                  // V
  const P = I * VF;                                                 // W
  const tM = tUm * 1e-6, AM2 = A * 1e-4;                            // m, m^2
  const dT = P * tM / (KAPPA * AM2);                                // K (= degC rise)

  noStroke(); fill(20);
  textAlign(CENTER, TOP); textSize(15);
  text('Power Diode Design Chain: specification → temperature rise', canvasWidth / 2, 8);
  fill(90); textAlign(CENTER, TOP); textSize(10.5);
  text('Change any slider below and watch the change propagate down every stage.', canvasWidth / 2, 28);

  drawChain(BV, I, A, tUm, ND, W, RonSp, Ron, VF, P, dT);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12);
  text('Target V_BR = ' + BV + ' V', 10, drawHeight + 18);
  text('Rated I = ' + I.toFixed(1) + ' A', 10, drawHeight + 56);
  text('Die area A = ' + A.toFixed(2) + ' cm²', 10, drawHeight + 94);
  text('Die thickness t = ' + tUm + ' μm', 10, drawHeight + 132);
}

// One card in the vertical chain: colored left accent bar, label+value on
// one line, a short formula/assumption caption below.
function drawStage(x, y, w, h, label, value, note, col) {
  noStroke(); fill(red(col), green(col), blue(col), 28);
  rect(x, y, w, h, 5);
  noStroke(); fill(col);
  rect(x, y, 5, h, 3, 0, 0, 3);

  noStroke(); fill(30); textAlign(LEFT, TOP); textSize(12.5);
  smlMathText(x + 14, y + 6, label, { size: 12.5 });
  fill(col); textAlign(RIGHT, TOP); textSize(13);
  textStyle(BOLD);
  smlMathText(x + w - 10, y + 5, value, { size: 13, align: 'right', color: col, bold: true });
  textStyle(NORMAL);
  noStroke(); fill(100); textAlign(LEFT, TOP); textSize(9.5);
  text(note, x + 14, y + h - 22, w - 24);
}

// Downward arrow between two stacked stages, with a short formula label.
function drawArrowDown(cx, y, h, formula) {
  stroke(140); strokeWeight(1.6); noFill();
  line(cx, y, cx, y + h - 5);
  noStroke(); fill(140);
  triangle(cx - 4, y + h - 5, cx + 4, y + h - 5, cx, y + h);
  if (formula) {
    noStroke(); fill(110); textAlign(LEFT, CENTER); textSize(9.5);
    text(formula, cx + 10, y + h / 2);
  }
}

function drawChain(BV, I, A, tUm, ND, W, RonSp, Ron, VF, P, dT) {
  const colBlock = color(90, 62, 237);   // voltage-blocking stages (Ch 14-15)
  const colRes = color(230, 150, 30);    // resistance stages (Ch 11)
  const colLoss = color(220, 70, 90);    // electrical-loss stages
  const colTherm = color(40, 150, 90);   // thermal stage (Ch 17)

  const x = 24, w = canvasWidth - 48;
  const rowH = 48, arrowH = 15;
  let y = 46;

  drawStage(x, y, w, rowH, 'Target V_BR (breakdown voltage spec)', BV + ' V',
    'Design input, set by the slider below.', color(70, 70, 70));
  y += rowH; drawArrowDown(x + w / 2, y, arrowH, 'N_D = εs·Ecrit² / (2qV_BR)'); y += arrowH;

  drawStage(x, y, w, rowH, 'N_D (drift-region doping)', smlFormatConc(ND),
    'Lighter doping supports a wider depletion region → higher blocking voltage.', colBlock);
  y += rowH; drawArrowDown(x + w / 2, y, arrowH, 'W = 2V_BR / Ecrit'); y += arrowH;

  drawStage(x, y, w, rowH, 'W (drift-region width)', (W * 1e4).toFixed(1) + ' μm',
    'Depletion width needed to support V_BR without avalanche breakdown.', colBlock);
  y += rowH; drawArrowDown(x + w / 2, y, arrowH, 'R_on,sp = 4V_BR² / (μn·εs·Ecrit³)'); y += arrowH;

  drawStage(x, y, w, rowH, 'R_on,sp (specific on-resistance)', RonSp.toFixed(4) + ' Ω·cm²',
    'Intrinsic resistance-per-area of the drift region alone (the "silicon limit").', colRes);
  y += rowH; drawArrowDown(x + w / 2, y, arrowH, 'R_on = R_on,sp / Area'); y += arrowH;

  drawStage(x, y, w, rowH, 'R_on (device on-resistance)', Ron.toFixed(4) + ' Ω',
    'Larger die area A = more parallel current paths → lower R_on, at the cost of more silicon.', colRes);
  y += rowH; drawArrowDown(x + w / 2, y, arrowH, 'V_F = V_junction + I·R_on'); y += arrowH;

  drawStage(x, y, w, rowH, 'V_F (total forward voltage)', VF.toFixed(3) + ' V',
    'Built-in junction drop (' + VF_JUNCTION.toFixed(1) + ' V, assumed) plus the I·R_on drift-region drop.', colLoss);
  y += rowH; drawArrowDown(x + w / 2, y, arrowH, 'P = I·V_F'); y += arrowH;

  drawStage(x, y, w, rowH, 'P (conduction power dissipation)', P.toFixed(2) + ' W',
    'Forward conduction loss at the rated current I.', colLoss);
  y += rowH; drawArrowDown(x + w / 2, y, arrowH, 'ΔT = P·t / (κ·Area)'); y += arrowH;

  drawStage(x, y, w, rowH, 'ΔT (die temperature rise)', dT.toFixed(1) + ' °C',
    '1-D conduction through the die thickness t to a fixed-temperature backside (κ = ' + KAPPA + ' W/m·K, Si).', colTherm);
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
