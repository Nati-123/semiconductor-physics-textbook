// Quasi-Fermi Level Explorer MicroSim
// Draws a schematic silicon band diagram showing the electron and hole
// quasi-Fermi levels splitting apart from the equilibrium Fermi level
// (approximated at midgap plus doping offset) as excess carrier
// injection Δn increases.
//   n = n0 + Δn,  p = p0 + Δn
//   E_Fn − E_i = kT ln(n/ni)
//   E_i − E_Fp = kT ln(p/ni)
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let dopingTypeSelect, dopingExpSlider, dnExpSlider;

const KB_EV = 8.617e-5;
const T = 300;
const kT = KB_EV * T;
const NI = 1.5e10;
const EG = 1.12;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  dopingTypeSelect = createSelect();
  dopingTypeSelect.option('n-type');
  dopingTypeSelect.option('p-type');
  dopingTypeSelect.selected('n-type');
  dopingTypeSelect.attribute('aria-label', 'Doping type');

  dopingExpSlider = createSlider(14, 18, 16, 0.1);
  dopingExpSlider.attribute('aria-label', 'Doping concentration exponent');
  dnExpSlider = createSlider(0, 17, 0, 0.1);
  dnExpSlider.attribute('aria-label', 'Excess carrier concentration exponent, 0 means no injection');

  positionUIElements();
  describe('Quasi-Fermi level explorer: draws a silicon band diagram showing electron and hole quasi-Fermi levels splitting apart as excess carrier injection increases', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  dopingTypeSelect.position(bx + 100, by + drawHeight + 12);
  dopingExpSlider.position(bx + 210, by + drawHeight + 50);
  dopingExpSlider.size(min(canvasWidth - 230 - 30, 300));
  dnExpSlider.position(bx + 210, by + drawHeight + 88);
  dnExpSlider.size(min(canvasWidth - 230 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const isN = dopingTypeSelect.value() === 'n-type';
  const Ndope = Math.pow(10, dopingExpSlider.value());
  const dnRaw = dnExpSlider.value() <= 0.05 ? 0 : Math.pow(10, dnExpSlider.value());

  let n0, p0;
  if (isN) { n0 = Ndope; p0 = (NI * NI) / n0; }
  else { p0 = Ndope; n0 = (NI * NI) / p0; }

  const n = n0 + dnRaw, p = p0 + dnRaw;
  const efnMinusEi = kT * Math.log(n / NI);
  const eiMinusEfp = kT * Math.log(p / NI);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Quasi-Fermi Levels Under Carrier Injection (Silicon, 300 K)', canvasWidth / 2, 8);

  drawBandDiagram(efnMinusEi, eiMinusEfp);
  drawReadout(n, p, efnMinusEi, eiMinusEfp);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Doping type:', 10, drawHeight + 18);
  text('N = 10^' + dopingExpSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 56);
  text(dnRaw === 0 ? 'Δn = 0 (equilibrium, no injection)' : 'Δn = 10^' + dnExpSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 94);
  text('At Δn = 0, E_Fn and E_Fp coincide at the equilibrium Fermi level E_F.', 10, drawHeight + 128);
}

function drawBandDiagram(efnMinusEi, eiMinusEfp) {
  const diagX0 = 60, diagX1 = canvasWidth * 0.46;
  const plotY0 = 44, plotY1 = drawHeight - 50;
  const EC_POS = 0.3;
  const EMAX = EC_POS + EG + 0.3;
  function eToPx(eV) { return map(eV, -0.3, EMAX, plotY0, plotY1); }

  noStroke(); fill(230, 245, 255);
  rect(diagX0, plotY0, diagX1 - diagX0, eToPx(EC_POS) - plotY0);
  fill(220, 235, 220);
  rect(diagX0, eToPx(EC_POS + EG), diagX1 - diagX0, eToPx(EC_POS + EG + 0.3) - eToPx(EC_POS + EG));
  fill(255);
  rect(diagX0, eToPx(EC_POS), diagX1 - diagX0, eToPx(EC_POS + EG) - eToPx(EC_POS));

  stroke(90, 62, 237); strokeWeight(2.5);
  line(diagX0, eToPx(EC_POS), diagX1, eToPx(EC_POS));
  stroke(90, 180, 120);
  line(diagX0, eToPx(EC_POS + EG), diagX1, eToPx(EC_POS + EG));

  noStroke(); fill(90, 62, 237);
  textAlign(LEFT, BOTTOM); textSize(12);
  text('E_C', diagX1 + 6, eToPx(EC_POS) + 4);
  fill(90, 180, 120);
  text('E_V', diagX1 + 6, eToPx(EC_POS + EG) + 4);

  const midgap = EC_POS + EG / 2;
  stroke(140); strokeWeight(1.5);
  drawingContext.setLineDash([2, 4]);
  line(diagX0, eToPx(midgap), diagX1, eToPx(midgap));
  drawingContext.setLineDash([]);
  noStroke(); fill(100);
  textAlign(LEFT, BOTTOM); textSize(11);
  text('E_i (≈midgap)', diagX1 + 6, eToPx(midgap) + 3);

  const efnPos = midgap + efnMinusEi;
  const efpPos = midgap + eiMinusEfp;

  stroke(40, 40, 220); strokeWeight(2.5);
  line(diagX0, eToPx(efnPos), diagX1, eToPx(efnPos));
  noStroke(); fill(40, 40, 220);
  textAlign(LEFT, BOTTOM); textSize(12);
  text('E_Fn', diagX1 + 6, eToPx(efnPos) + 4);

  stroke(220, 60, 60); strokeWeight(2.5);
  line(diagX0, eToPx(efpPos), diagX1, eToPx(efpPos));
  noStroke(); fill(220, 60, 60);
  textAlign(LEFT, TOP); textSize(12);
  text('E_Fp', diagX1 + 6, eToPx(efpPos) - 14);
}

function drawReadout(n, p, efnMinusEi, eiMinusEfp) {
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
  const split = efnMinusEi + eiMinusEfp;
  const lines = [
    'n = ' + n.toExponential(2) + ' cm⁻³',
    'p = ' + p.toExponential(2) + ' cm⁻³',
    'E_Fn − E_i = ' + efnMinusEi.toFixed(3) + ' eV',
    'E_i − E_Fp = ' + eiMinusEfp.toFixed(3) + ' eV',
    'Quasi-Fermi splitting:',
    'E_Fn − E_Fp = ' + split.toFixed(3) + ' eV'
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
