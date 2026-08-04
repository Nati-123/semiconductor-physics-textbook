// Band Diagram Builder MicroSim
// Lets the user select a device type (p-n junction, Schottky junction,
// or MOS capacitor) and a bias condition, drawing the resulting band
// diagram using the same general construction procedure: flat bands in
// each neutral region, smooth bending at each junction, and Fermi-level
// shifts under applied bias.
// Bloom Level: Apply / Create (L3, L6)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let deviceSelect, biasSlider;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  deviceSelect = createSelect();
  deviceSelect.option('P-N Junction');
  deviceSelect.option('Schottky Junction');
  deviceSelect.option('MOS Capacitor');
  deviceSelect.selected('P-N Junction');
  deviceSelect.attribute('aria-label', 'Device type');

  biasSlider = createSlider(-1, 1, 0, 0.02);
  biasSlider.attribute('aria-label', 'Normalized bias, negative reverse/depletion, positive forward/accumulation');

  positionUIElements();
  describe('Band diagram builder: constructs an equilibrium or biased band diagram for a p-n junction, Schottky junction, or MOS capacitor', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  deviceSelect.position(bx + 170, by + drawHeight + 12);
  biasSlider.position(bx + 170, by + drawHeight + 50);
  biasSlider.size(min(canvasWidth - 190 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const device = deviceSelect.value();
  const bias = biasSlider.value();

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15.5);
  text(device + ' Band Diagram', canvasWidth / 2, 8);

  if (device === 'P-N Junction') drawPN(bias);
  else if (device === 'Schottky Junction') drawSchottky(bias);
  else drawMOS(bias);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12);
  text('Device type:', 10, drawHeight + 18);
  text('Bias:', 10, drawHeight + 56);
  textSize(11); fill(80);
  const label = device === 'MOS Capacitor'
    ? (bias < -0.05 ? 'accumulation' : (bias < 0.05 ? 'flat-band' : 'depletion/inversion'))
    : (bias > 0.05 ? 'forward bias' : (bias < -0.05 ? 'reverse bias' : 'equilibrium'));
  text('bias = ' + bias.toFixed(2) + '  (' + label + ')', 10, drawHeight + 94);
}

function bandCurve(x0, x1, midX, yLeft, yRight) {
  beginShape(); noFill();
  vertex(x0, yLeft); vertex(midX - 20, yLeft);
  bezierVertex(midX - 5, yLeft, midX - 5, yRight, midX + 5, yRight);
  vertex(x1, yRight);
  endShape();
}

function drawPN(bias) {
  const x0 = 50, x1 = canvasWidth - 50, midX = canvasWidth / 2;
  const chartY = 44, chartH = drawHeight - 130;
  const bandGapPx = chartH * 0.32;
  const Vbi = 0.75;
  const barrier = max(Vbi - bias * 0.7, 0.05);
  const bendPx = map(constrain(barrier, 0, 1.4), 0, 1.4, 0, chartH * 0.5);

  const ecP = chartY + chartH * 0.5 - bandGapPx / 2 + bendPx, ecN = chartY + chartH * 0.5 - bandGapPx / 2 - bendPx;
  const evP = ecP + bandGapPx, evN = ecN + bandGapPx;

  const col = bias > 0.05 ? color(40, 150, 90) : (bias < -0.05 ? color(220, 90, 60) : color(90, 62, 237));
  stroke(col); strokeWeight(2.5);
  bandCurve(x0, x1, midX, ecP, ecN);
  bandCurve(x0, x1, midX, evP, evN);

  noStroke(); fill(col); textAlign(LEFT, BOTTOM); textSize(11);
  text('EC', x1 + 6, ecN + 4);
  text('EV', x1 + 6, evN + 4);

  fill(190, 40, 40); textAlign(CENTER, TOP); textSize(11);
  text('p-type', x0, chartY + chartH + 8);
  fill(40, 40, 190);
  text('n-type', x1, chartY + chartH + 8);
}

function drawSchottky(bias) {
  const x0 = 50, x1 = canvasWidth - 50, midX = canvasWidth * 0.42;
  const chartY = 44, chartH = drawHeight - 130;
  const efMetalY = chartY + chartH * 0.35;
  const bandGapPx = chartH * 0.32;
  const barrier = max(0.9 - bias * 0.6, 0.05);
  const bendPx = map(constrain(barrier, 0, 1.4), 0, 1.4, 0, chartH * 0.5);

  stroke(90, 62, 237); strokeWeight(2.5);
  line(x0, efMetalY, midX - 6, efMetalY);
  noStroke(); fill(90, 62, 237); textAlign(LEFT, BOTTOM); textSize(11);
  text('metal EF', x0, efMetalY - 4);

  const ecNear = efMetalY - bendPx, ecFar = efMetalY - bendPx * 0.15;
  const evNear = ecNear + bandGapPx, evFar = ecFar + bandGapPx;
  const col = bias > 0.05 ? color(40, 150, 90) : (bias < -0.05 ? color(220, 90, 60) : color(90, 62, 237));
  stroke(col); strokeWeight(2.2);
  bandCurve(midX, x1, midX + (x1 - midX) * 0.3, ecNear, ecFar);
  bandCurve(midX, x1, midX + (x1 - midX) * 0.3, evNear, evFar);

  noStroke(); fill(col); textAlign(LEFT, BOTTOM); textSize(11);
  text('EC', x1 + 6, ecFar + 4);
  text('EV', x1 + 6, evFar + 4);

  fill(60); textAlign(CENTER, TOP); textSize(11);
  text('metal', x0 + (midX - x0) / 2, chartY + chartH + 8);
  text('n-type semiconductor', midX + (x1 - midX) / 2, chartY + chartH + 8);
}

function drawMOS(bias) {
  const x0 = 50, xOxL = canvasWidth * 0.38, xOxR = canvasWidth * 0.48, x1 = canvasWidth - 50;
  const chartY = 44, chartH = drawHeight - 130;
  const midY = chartY + chartH * 0.5;
  const bandGapPx = chartH * 0.30;

  noStroke(); fill(235, 235, 245);
  rect(xOxL, chartY, xOxR - xOxL, chartH);
  fill(60); textAlign(CENTER, TOP); textSize(10);
  text('oxide', (xOxL + xOxR) / 2, chartY + chartH + 6);
  text('gate', x0 + (xOxL - x0) / 2, chartY + chartH + 6);
  text('p-type semiconductor', xOxR + (x1 - xOxR) / 2, chartY + chartH + 6);

  stroke(90, 62, 237); strokeWeight(2.5);
  line(x0, midY, xOxL, midY);

  const psiS = bias * 0.7;
  const bendPx = psiS * chartH * 0.4;
  const ecBulk = midY - bandGapPx / 2, evBulk = ecBulk + bandGapPx;
  const ecSurf = ecBulk - bendPx, evSurf = evBulk - bendPx;

  const col = bias < -0.05 ? color(220, 90, 60) : (bias < 0.05 ? color(120) : (bias < 0.5 ? color(90, 62, 237) : color(40, 150, 90)));
  stroke(col); strokeWeight(2.2);
  bandCurve(xOxR, x1, xOxR + (x1 - xOxR) * 0.35, ecSurf, ecBulk);
  bandCurve(xOxR, x1, xOxR + (x1 - xOxR) * 0.35, evSurf, evBulk);

  noStroke(); fill(col); textAlign(LEFT, BOTTOM); textSize(11);
  text('EC', x1 + 6, ecBulk + 4);
  text('EV', x1 + 6, evBulk + 4);
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
