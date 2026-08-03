// MOS Capacitor Band Bending Explorer MicroSim
// Draws a gate / oxide / semiconductor band diagram for a p-type MOS
// capacitor, with the semiconductor bands bending near the oxide
// interface according to a surface-potential slider (the qualitative
// stand-in for gate bias relative to flat-band). Flat-band (psi_s = 0)
// is marked explicitly.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let psiSlider, naSlider;

const KT_Q = 0.0259;
const NI = 1.5e10;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  psiSlider = createSlider(-0.6, 0.9, 0, 0.01);
  psiSlider.attribute('aria-label', 'Surface potential psi_s, standing in for gate bias relative to flat-band');
  naSlider = createSlider(14, 18, 16, 0.1);
  naSlider.attribute('aria-label', 'Substrate doping concentration exponent');

  positionUIElements();
  describe('MOS capacitor band bending explorer: shows a gate, oxide, and semiconductor band diagram bending at the surface as a function of surface potential', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  psiSlider.position(bx + 150, by + drawHeight + 12);
  psiSlider.size(min(canvasWidth - 170 - 30, 320));
  naSlider.position(bx + 150, by + drawHeight + 50);
  naSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const psiS = psiSlider.value();
  const NA = Math.pow(10, naSlider.value());
  const phiF = KT_Q * Math.log(NA / NI);

  let regime, regimeColor;
  if (psiS < -0.02) { regime = 'Accumulation'; regimeColor = color(220, 90, 60); }
  else if (psiS < 0.02) { regime = 'Flat-Band'; regimeColor = color(120); }
  else if (psiS < phiF) { regime = 'Depletion'; regimeColor = color(90, 62, 237); }
  else if (psiS < 2 * phiF) { regime = 'Weak Inversion'; regimeColor = color(200, 140, 30); }
  else { regime = 'Strong Inversion'; regimeColor = color(40, 150, 90); }

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15.5);
  text('Gate | Oxide | Semiconductor Band Diagram', canvasWidth / 2, 8);

  drawMosBandDiagram(psiS, regimeColor);

  noStroke(); fill(regimeColor); textAlign(CENTER, TOP); textSize(14); textStyle(BOLD);
  text(regime, canvasWidth / 2, drawHeight - 30);
  textStyle(NORMAL);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12.5);
  text('ψs (surface potential):', 10, drawHeight + 18);
  text('NA = 10^' + naSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 56);
  text('ψs = ' + psiS.toFixed(3) + ' V   φF = ' + phiF.toFixed(3) + ' V   2φF = ' + (2 * phiF).toFixed(3) + ' V', 10, drawHeight + 94);
}

function drawMosBandDiagram(psiS, regimeColor) {
  const x0 = 40, xOxL = canvasWidth * 0.36, xOxR = canvasWidth * 0.46, x1 = canvasWidth - 40;
  const chartY = 40, chartH = drawHeight - 100;
  const midY = chartY + chartH * 0.5;
  const bandGapPx = chartH * 0.32;

  noFill(); stroke(210); strokeWeight(1);
  rect(x0 - 10, chartY - 6, x1 - x0 + 20, chartH + 12, 6);

  noStroke(); fill(235, 235, 245);
  rect(xOxL, chartY, xOxR - xOxL, chartH);
  fill(90); textAlign(CENTER, TOP); textSize(10);
  text('oxide', (xOxL + xOxR) / 2, chartY + chartH + 6);
  textAlign(CENTER, TOP); fill(60);
  text('gate', x0 + (xOxL - x0) / 2, chartY + chartH + 6);
  text('semiconductor', xOxR + (x1 - xOxR) / 2, chartY + chartH + 6);

  const efGateY = midY;
  stroke(90, 62, 237); strokeWeight(2.5);
  line(x0, efGateY, xOxL, efGateY);

  const bendPx = constrain(psiS, -0.6, 0.9) * chartH * 0.35;
  const ecBulkY = midY - bandGapPx / 2;
  const evBulkY = midY + bandGapPx / 2;
  const ecSurfY = ecBulkY - bendPx;
  const evSurfY = evBulkY - bendPx;

  stroke(regimeColor); strokeWeight(2.2); noFill();
  beginShape();
  vertex(xOxR, ecSurfY);
  bezierVertex(xOxR + 40, ecSurfY, xOxR + 40, ecBulkY, xOxR + 80, ecBulkY);
  vertex(x1, ecBulkY);
  endShape();
  beginShape();
  vertex(xOxR, evSurfY);
  bezierVertex(xOxR + 40, evSurfY, xOxR + 40, evBulkY, xOxR + 80, evBulkY);
  vertex(x1, evBulkY);
  endShape();

  noStroke(); fill(regimeColor); textAlign(LEFT, BOTTOM); textSize(10.5);
  text('EC', x1 + 4, ecBulkY + 4);
  text('EV', x1 + 4, evBulkY + 4);

  stroke(140); strokeWeight(1); drawingContext.setLineDash([2, 3]);
  const eiBulkY = midY, eiSurfY = midY - bendPx;
  line(xOxR, eiSurfY, x1, eiBulkY);
  drawingContext.setLineDash([]);
  noStroke(); fill(100); textAlign(LEFT, TOP); textSize(9.5);
  text('Ei', x1 + 4, eiBulkY - 4);

  const efSemY = midY + bandGapPx * 0.28;
  stroke(90); strokeWeight(1.5); drawingContext.setLineDash([1, 3]);
  line(xOxR, efSemY, x1, efSemY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90); textAlign(LEFT, TOP); textSize(9.5);
  text('EF', x1 + 4, efSemY - 2);

  stroke(160); strokeWeight(1); drawingContext.setLineDash([3, 3]);
  line(xOxR + 78, chartY, xOxR + 78, chartY + chartH);
  drawingContext.setLineDash([]);
  noStroke(); fill(120); textAlign(CENTER, TOP); textSize(9);
  text('bulk', xOxR + 78, chartY - 12);
  fill(regimeColor); textAlign(CENTER, TOP); textSize(9);
  text('surface', xOxR + 6, chartY - 12);
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
