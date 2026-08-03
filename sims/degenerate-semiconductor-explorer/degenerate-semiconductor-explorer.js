// Degenerate Semiconductor Explorer MicroSim
// Computes E_C - E_F = kT*ln(N_C/N_D) for silicon at 300 K and draws the
// resulting Fermi level position on a schematic band diagram, warning
// when N_D approaches or exceeds N_C (the degenerate regime).
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 90;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let ndExpSlider;
const KT_300 = 0.0259; // eV
const NC_SI = 2.8e19;  // cm^-3, silicon effective conduction-band DOS

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  ndExpSlider = createSlider(14, 20.5, 16, 0.1);
  ndExpSlider.attribute('aria-label', 'Donor concentration exponent');

  positionUIElements();
  describe('Degenerate semiconductor explorer: computes and draws the Fermi level position relative to the conduction band edge as a function of donor concentration, warning when the material becomes degenerate', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  ndExpSlider.position(bx + 170, by + drawHeight + 15);
  ndExpSlider.size(min(canvasWidth - 190 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const ND = Math.pow(10, ndExpSlider.value());
  const ecMinusEf = KT_300 * Math.log(NC_SI / ND); // eV; negative if ND > NC
  const degenerate = ecMinusEf < 0.05; // warn as EF approaches/crosses EC

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('E_C − E_F = k_BT·ln(N_C/N_D) at T = 300 K', canvasWidth / 2, 8);

  drawBandDiagram(ecMinusEf, degenerate);
  drawReadout(ND, ecMinusEf, degenerate);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('N_D = 10^' + ndExpSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 20);
}

function drawBandDiagram(ecMinusEf, degenerate) {
  const diagX0 = 60, diagX1 = canvasWidth * 0.48;
  const plotY0 = 44, plotY1 = drawHeight - 50;
  // eV axis: 0 at top (well above EC) to 1.3 at bottom (below EV); EC at eV=0.3, EV at eV=0.3+1.12
  const EG = 1.12, EC_POS = 0.3;
  function eToPx(eV) { return map(eV, -0.3, EC_POS + EG + 0.2, plotY0, plotY1); }

  noStroke(); fill(230, 245, 255);
  rect(diagX0, plotY0, diagX1 - diagX0, eToPx(EC_POS) - plotY0);
  fill(220, 235, 220);
  rect(diagX0, eToPx(EC_POS + EG), diagX1 - diagX0, eToPx(EC_POS + EG + 0.2) - eToPx(EC_POS + EG));
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

  const efEv = EC_POS - ecMinusEf; // Fermi level position on same axis
  const efY = eToPx(efEv);
  stroke(degenerate ? color(210, 40, 40) : color(200, 30, 30)); strokeWeight(2);
  drawingContext.setLineDash([4, 3]);
  line(diagX0, efY, diagX1, efY);
  drawingContext.setLineDash([]);
  noStroke(); fill(degenerate ? color(210, 40, 40) : color(200, 30, 30));
  textAlign(LEFT, TOP); textSize(12);
  text('E_F', diagX1 + 6, efY - 14);
}

function drawReadout(ND, ecMinusEf, degenerate) {
  const cardX = canvasWidth * 0.54, cardW = canvasWidth - cardX - 30, cardY = 50, cardH = drawHeight - 110;
  noStroke();
  fill(degenerate ? color(255, 230, 230) : color(240, 245, 255));
  stroke(degenerate ? color(220, 90, 90) : color(168, 200, 255));
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke();
  fill(degenerate ? color(200, 40, 40) : color('#5A3EED'));
  textAlign(LEFT, TOP); textSize(15);
  text(degenerate ? 'Degenerate regime' : 'Non-degenerate', cardX + 16, cardY + 14);
  fill(50); textSize(12.5);
  text('E_C − E_F = ' + ecMinusEf.toFixed(3) + ' eV', cardX + 16, cardY + 44);
  text('N_C (silicon, 300 K) ≈ 2.8×10¹⁹ cm⁻³', cardX + 16, cardY + 68, cardW - 32);
  text(degenerate
    ? 'N_D is comparable to or exceeds N_C: the Fermi level has moved up to or above E_C, and the simple Boltzmann (non-degenerate) approximation used in Chapters 9-10 no longer applies.'
    : 'N_D is well below N_C: the Fermi level stays safely inside the gap, and the non-degenerate approximation is valid.',
    cardX + 16, cardY + 94, cardW - 32);
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
