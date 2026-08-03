// Forward and Reverse Bias Band Diagram Explorer MicroSim
// Shows how an applied bias V modifies the equilibrium band diagram,
// barrier height (Vbi - V), and depletion width W(V) = sqrt((2*eps*(Vbi-V)/q)
// * (1/NA + 1/ND)) of a silicon p-n junction. Positive V is forward bias,
// negative V is reverse bias.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 190;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let naSlider, ndSlider, vSlider;

const Q = 1.602e-19;      // C
const EPS = 1.035e-12;    // F/cm  (Si, er=11.7)
const NI = 1.5e10;        // cm^-3 (Si, 300K)
const KT_Q = 0.0259;      // V (300K)

function vbiOf(NA, ND) {
  return KT_Q * Math.log((NA * ND) / (NI * NI));
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  naSlider = createSlider(15, 19, 17, 0.1);
  naSlider.attribute('aria-label', 'Acceptor doping concentration exponent NA');
  ndSlider = createSlider(15, 19, 16, 0.1);
  ndSlider.attribute('aria-label', 'Donor doping concentration exponent ND');
  vSlider = createSlider(-10, 0.7, 0, 0.01);
  vSlider.attribute('aria-label', 'Applied bias voltage, positive is forward');

  positionUIElements();
  describe('Forward and reverse bias band diagram explorer: shows how applied bias modifies the equilibrium band diagram, barrier height, and depletion width of a p-n junction', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  naSlider.position(bx + 150, by + drawHeight + 12);
  naSlider.size(min(canvasWidth - 170 - 30, 320));
  ndSlider.position(bx + 150, by + drawHeight + 50);
  ndSlider.size(min(canvasWidth - 170 - 30, 320));
  vSlider.position(bx + 150, by + drawHeight + 88);
  vSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const NA = Math.pow(10, naSlider.value());
  const ND = Math.pow(10, ndSlider.value());
  const Vbi = vbiOf(NA, ND);
  const V = vSlider.value();
  const barrier = max(Vbi - V, 0.01 * Vbi);
  const W = Math.sqrt((2 * EPS * barrier / Q) * (1 / NA + 1 / ND));
  const regime = V > 0.001 ? 'Forward Bias' : (V < -0.001 ? 'Reverse Bias' : 'Equilibrium');

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Barrier = V_bi − V,   W(V) = √[2ε(V_bi−V)/q · (1/NA+1/ND)]', canvasWidth / 2, 8, canvasWidth - 20);

  drawBandDiagram(Vbi, barrier, regime);
  drawResultCard(NA, ND, Vbi, V, barrier, W, regime);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('NA = 10^' + naSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 18);
  text('ND = 10^' + ndSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 56);
  text('Applied bias V = ' + V.toFixed(2) + ' V   (' + regime + ')', 10, drawHeight + 94);
}

function drawBandDiagram(Vbi, barrier, regime) {
  const x0 = 40, x1 = canvasWidth * 0.56, chartY = 44, chartH = drawHeight - 130;
  const midX = (x0 + x1) / 2;
  const bendMaxV = 1.4;
  const bandGapPx = chartH * 0.42;
  const bendPx = map(constrain(barrier, 0, bendMaxV), 0, bendMaxV, 0, chartH * 0.5);

  noFill(); stroke(210); strokeWeight(1);
  rect(x0 - 10, chartY - 6, x1 - x0 + 20, chartH + 12, 6);

  const ecFlatN = chartY + chartH * 0.5 - bandGapPx / 2 - bendPx;
  const ecFlatP = chartY + chartH * 0.5 - bandGapPx / 2 + bendPx;
  const evFlatN = ecFlatN + bandGapPx;
  const evFlatP = ecFlatP + bandGapPx;

  function bandCurve(yLeft, yRight) {
    beginShape();
    vertex(x0, yLeft);
    vertex(midX - 24, yLeft);
    bezierVertex(midX - 8, yLeft, midX - 8, yRight, midX + 8, yRight);
    vertex(x1, yRight);
    endShape();
  }

  const bendColor = regime === 'Forward Bias' ? color(40, 150, 90) : (regime === 'Reverse Bias' ? color(220, 90, 60) : color(90, 62, 237));
  stroke(bendColor); strokeWeight(2.5); noFill();
  bandCurve(ecFlatP, ecFlatN);
  bandCurve(evFlatP, evFlatN);

  noStroke(); fill(bendColor); textAlign(LEFT, BOTTOM); textSize(11);
  text('EC', x1 + 6, ecFlatN + 4);
  text('EV', x1 + 6, evFlatN + 4);

  stroke(200); strokeWeight(1);
  drawingContext.setLineDash([2, 3]);
  line(x0, chartY - 2, x0, chartY + chartH + 4);
  line(x1, chartY - 2, x1, chartY + chartH + 4);
  drawingContext.setLineDash([]);

  noStroke(); fill(190, 40, 40); textAlign(CENTER, TOP); textSize(11); textStyle(BOLD);
  text('p-side (neutral)', x0, chartY + chartH + 8);
  fill(40, 40, 190);
  text('n-side (neutral)', x1, chartY + chartH + 8);
  textStyle(NORMAL);

  const bx = midX;
  stroke(230, 150, 30); strokeWeight(1.5);
  line(bx - 34, ecFlatP, bx - 34, ecFlatN);
  noStroke(); fill(230, 150, 30);
  triangle(bx - 34, ecFlatP, bx - 38, ecFlatP + 6, bx - 30, ecFlatP + 6);
  triangle(bx - 34, ecFlatN, bx - 38, ecFlatN - 6, bx - 30, ecFlatN - 6);
  fill(200, 120, 10); textAlign(LEFT, CENTER); textSize(11); textStyle(BOLD);
  text('q(V_bi−V)', bx - 26, (ecFlatP + ecFlatN) / 2);
  textStyle(NORMAL);
}

function drawResultCard(NA, ND, Vbi, V, barrier, W, regime) {
  const cardX = canvasWidth * 0.60, cardY = 44, cardW = canvasWidth - cardX - 24, cardH = drawHeight - 90;
  const regimeColor = regime === 'Forward Bias' ? color(40, 150, 90) : (regime === 'Reverse Bias' ? color(220, 90, 60) : color(90, 62, 237));
  noStroke(); fill(240, 245, 255);
  stroke(168, 200, 255); strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke(); fill(regimeColor); textAlign(CENTER, TOP); textSize(14); textStyle(BOLD);
  text(regime, cardX + cardW / 2, cardY + 12);
  textStyle(NORMAL);
  fill(30); textAlign(LEFT, TOP); textSize(11.5);
  const lines = [
    'V_bi = ' + Vbi.toFixed(3) + ' V',
    'Barrier = V_bi − V = ' + barrier.toFixed(3) + ' V',
    'W(V) = ' + (W * 1e4).toFixed(3) + ' μm',
    'W(0) equilibrium ref. shown below'
  ];
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cardX + 14, cardY + 44 + i * 22, cardW - 28);
  }
  const W0 = Math.sqrt((2 * EPS * Vbi / Q) * (1 / NA + 1 / ND));
  noStroke(); fill(90); textAlign(LEFT, TOP); textSize(11);
  text('W(V=0) = ' + (W0 * 1e4).toFixed(3) + ' μm', cardX + 14, cardY + 44 + 4 * 22 + 6);
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
