// Fermi Level Position vs. Doping Explorer MicroSim
// Draws a schematic band diagram with E_C, E_V, and the intrinsic Fermi
// level E_i fixed, and computes E_F's exact position from the doping-
// dependent n0 (via the same quadratic solution used in the exact
// carrier concentration calculator) and E_C-E_F = kT ln(NC/n0).
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, tempSlider, ndExpSlider, naExpSlider;

const KB_J = 1.381e-23, H_J = 6.626e-34, M0 = 9.109e-31, KB_EV = 8.617e-5;

const MATERIALS = {
  'Silicon': { me: 1.08, mh: 0.56, Eg0: 1.166, alpha: 4.73e-4, beta: 636 },
  'Germanium': { me: 0.55, mh: 0.37, Eg0: 0.7437, alpha: 4.77e-4, beta: 235 },
  'GaAs': { me: 0.067, mh: 0.48, Eg0: 1.519, alpha: 5.41e-4, beta: 204 }
};

function effDOS(mRatio, T) {
  const m = mRatio * M0;
  const val = 2 * Math.pow((2 * Math.PI * m * KB_J * T) / (H_J * H_J), 1.5);
  return val / 1e6;
}
function EgAt(mat, T) { return mat.Eg0 - (mat.alpha * T * T) / (T + mat.beta); }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  Object.keys(MATERIALS).forEach(k => materialSelect.option(k));
  materialSelect.selected('Silicon');
  materialSelect.attribute('aria-label', 'Material selection');

  tempSlider = createSlider(200, 500, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');

  ndExpSlider = createSlider(13, 19, 13, 0.1);
  ndExpSlider.attribute('aria-label', 'Donor concentration exponent');
  naExpSlider = createSlider(13, 19, 13, 0.1);
  naExpSlider.attribute('aria-label', 'Acceptor concentration exponent');

  positionUIElements();
  describe('Fermi level position versus doping explorer: draws a band diagram showing the exact Fermi level position computed from donor and acceptor concentration, with the intrinsic Fermi level marked as reference', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  materialSelect.position(bx + 90, by + drawHeight + 12);
  tempSlider.position(bx + 150, by + drawHeight + 50);
  tempSlider.size(min(canvasWidth - 170 - 30, 280));
  ndExpSlider.position(bx + 150, by + drawHeight + 88);
  ndExpSlider.size(min(canvasWidth - 170 - 30, 280));
  naExpSlider.position(bx + 150, by + drawHeight + 126);
  naExpSlider.size(min(canvasWidth - 170 - 30, 280));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const mat = MATERIALS[materialSelect.value()];
  const T = tempSlider.value();
  const kT = KB_EV * T;
  const ND = Math.pow(10, ndExpSlider.value());
  const NA = Math.pow(10, naExpSlider.value());
  const Nc = effDOS(mat.me, T), Nv = effDOS(mat.mh, T);
  const Eg = EgAt(mat, T);
  const ni = Math.sqrt(Nc * Nv) * Math.exp(-Eg / (2 * kT));

  const netD = ND - NA;
  const n0 = (netD + Math.sqrt(netD * netD + 4 * ni * ni)) / 2;

  const ecMinusEf = kT * Math.log(Nc / n0);
  const eiOffsetFromMid = (kT / 2) * Math.log(Nv / Nc); // Ei = midgap + this offset

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text(materialSelect.value() + ': E_C − E_F = k_BT·ln(N_C/n₀)', canvasWidth / 2, 8);

  drawBandDiagram(Eg, ecMinusEf, eiOffsetFromMid);
  drawReadout(n0, ecMinusEf, Eg, eiOffsetFromMid);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Material:', 10, drawHeight + 18);
  text('Temperature: ' + T + ' K', 10, drawHeight + 56);
  text('N_D = 10^' + ndExpSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 94);
  text('N_A = 10^' + naExpSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 132);
}

function drawBandDiagram(Eg, ecMinusEf, eiOffsetFromMid) {
  const diagX0 = 60, diagX1 = canvasWidth * 0.46;
  const plotY0 = 44, plotY1 = drawHeight - 50;
  const EC_POS = 0.3; // top margin in eV-equivalent units
  const EMAX = EC_POS + Eg + 0.3;
  function eToPx(eV) { return map(eV, -0.3, EMAX, plotY0, plotY1); }

  noStroke(); fill(230, 245, 255);
  rect(diagX0, plotY0, diagX1 - diagX0, eToPx(EC_POS) - plotY0);
  fill(220, 235, 220);
  rect(diagX0, eToPx(EC_POS + Eg), diagX1 - diagX0, eToPx(EC_POS + Eg + 0.3) - eToPx(EC_POS + Eg));
  fill(255);
  rect(diagX0, eToPx(EC_POS), diagX1 - diagX0, eToPx(EC_POS + Eg) - eToPx(EC_POS));

  stroke(90, 62, 237); strokeWeight(2.5);
  line(diagX0, eToPx(EC_POS), diagX1, eToPx(EC_POS));
  stroke(90, 180, 120);
  line(diagX0, eToPx(EC_POS + Eg), diagX1, eToPx(EC_POS + Eg));

  noStroke(); fill(90, 62, 237);
  textAlign(LEFT, BOTTOM); textSize(12);
  text('E_C', diagX1 + 6, eToPx(EC_POS) + 4);
  fill(90, 180, 120);
  text('E_V', diagX1 + 6, eToPx(EC_POS + Eg) + 4);

  // intrinsic Fermi level Ei (dashed gray)
  const midgap = EC_POS + Eg / 2;
  const eiPos = midgap + eiOffsetFromMid;
  stroke(140); strokeWeight(1.5);
  drawingContext.setLineDash([2, 4]);
  line(diagX0, eToPx(eiPos), diagX1, eToPx(eiPos));
  drawingContext.setLineDash([]);
  noStroke(); fill(100);
  textAlign(LEFT, BOTTOM); textSize(11);
  text('E_i (intrinsic)', diagX1 + 6, eToPx(eiPos) + 3);

  // Fermi level EF (solid red)
  const efPos = EC_POS + ecMinusEf;
  stroke(200, 30, 30); strokeWeight(2.5);
  line(diagX0, eToPx(efPos), diagX1, eToPx(efPos));
  noStroke(); fill(200, 30, 30);
  textAlign(LEFT, TOP); textSize(12);
  text('E_F', diagX1 + 6, eToPx(efPos) - 14);
}

function drawReadout(n0, ecMinusEf, Eg, eiOffsetFromMid) {
  const cardX = canvasWidth * 0.56, cardW = canvasWidth - cardX - 30, cardY = 50, cardH = drawHeight - 110;
  noStroke();
  fill(240, 245, 255);
  stroke(168, 200, 255);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke();
  fill(30);
  textAlign(LEFT, TOP);
  textSize(12.5);
  const lines = [
    'E_C − E_F = ' + ecMinusEf.toFixed(3) + ' eV',
    'E_F − E_V = ' + (Eg - ecMinusEf).toFixed(3) + ' eV',
    'E_i offset from exact midgap:',
    (eiOffsetFromMid >= 0 ? '+' : '') + (eiOffsetFromMid * 1000).toFixed(1) + ' meV',
    'n₀ = ' + n0.toExponential(2) + ' cm⁻³'
  ];
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cardX + 16, cardY + 14 + i * 24, cardW - 32);
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
