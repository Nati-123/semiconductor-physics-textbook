// Reverse Breakdown Mechanism Explorer MicroSim
// Plots the estimated avalanche breakdown voltage BV = eps*Ecrit^2/(2*q*N)
// versus lightly-doped-side concentration N on a log-log chart, and shows
// schematic comparison panels for avalanche (impact ionization, wide
// depletion) versus Zener (tunneling, narrow depletion) breakdown, with
// the currently-likely regime highlighted based on doping level.
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let nSlider;

const Q = 1.602e-19;
const EPS = 1.035e-12;
const ECRIT = 3e5; // V/cm
const ZENER_THRESHOLD_V = 6; // classic Si avalanche/Zener crossover, approximate

function bvOf(N) {
  return EPS * ECRIT * ECRIT / (2 * Q * N);
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  nSlider = createSlider(14, 19, 16, 0.05);
  nSlider.attribute('aria-label', 'Lightly doped side concentration exponent, base 10');

  positionUIElements();
  describe('Reverse breakdown mechanism explorer: plots estimated avalanche breakdown voltage versus doping concentration, and compares avalanche and Zener breakdown mechanisms schematically', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  nSlider.position(bx + 230, by + drawHeight + 14);
  nSlider.size(min(canvasWidth - 250 - 30, 400));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const N = Math.pow(10, nSlider.value());
  const BV = bvOf(N);
  const likelyZener = BV < ZENER_THRESHOLD_V;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15.5);
  text('Avalanche Estimate: V_BR ≈ εE_crit² / (2qN)', canvasWidth / 2, 8, canvasWidth - 20);

  const chartW = canvasWidth * 0.56;
  drawBvChart(N, BV, chartW);
  drawMechanismPanels(chartW, likelyZener);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12.5);
  text('Lightly-doped side N =', 10, drawHeight + 20);
  text('N = ' + N.toExponential(2) + ' cm⁻³   V_BR(estimate) = ' + BV.toFixed(2) + ' V   →  ' + (likelyZener ? 'Zener territory (heavy doping, thin barrier)' : 'Avalanche-dominated (light doping, wide depletion)'), 10, drawHeight + 60);
}

function drawBvChart(N, BV, chartW) {
  const chartX = 70, chartY = 40, chartH = drawHeight - 90;
  const logNmin = 14, logNmax = 19;

  const pts = [];
  for (let ln = logNmin; ln <= logNmax; ln += 0.05) {
    const n = Math.pow(10, ln);
    pts.push({ x: ln, y: Math.log10(bvOf(n)) });
  }
  const info = smlDrawLineChart(chartX, chartY, chartW - chartX - 20, chartH, logNmin, logNmax, -1, 3, [
    { points: pts, color: color(90, 62, 237) }
  ], {
    marker: { x: nSlider.value(), y: Math.log10(BV) },
    xLabel: 'log10 N (cm⁻³)', yLabel: 'log10 V_BR (V)', yLabelOffset: 42
  });

  const thrY = info.yToPx(Math.log10(ZENER_THRESHOLD_V));
  stroke(230, 90, 60); strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(chartX, thrY, chartX + (chartW - chartX - 20), thrY);
  drawingContext.setLineDash([]);
  noStroke(); fill(230, 90, 60); textAlign(LEFT, BOTTOM); textSize(10.5);
  text('~' + ZENER_THRESHOLD_V + ' V crossover', chartX + 4, thrY - 3);
}

function drawMechanismPanels(chartW, likelyZener) {
  const px = chartW + 10, pw = canvasWidth - px - 20;
  const ph = (drawHeight - 60) / 2;
  drawAvalanchePanel(px, 40, pw, ph, !likelyZener);
  drawZenerPanel(px, 40 + ph + 16, pw, ph, likelyZener);
}

function drawAvalanchePanel(x, y, w, h, active) {
  noStroke(); fill(active ? color(230, 245, 235) : color(248));
  stroke(active ? color(40, 150, 90) : color(210)); strokeWeight(active ? 2.5 : 1);
  rect(x, y, w, h, 8);
  noStroke(); fill(active ? color(40, 150, 90) : color(120)); textAlign(CENTER, TOP); textSize(12); textStyle(BOLD);
  text('Avalanche', x + w / 2, y + 6);
  textStyle(NORMAL);
  const depW = w * 0.55;
  const dx0 = x + (w - depW) / 2, dy0 = y + 26, dh = h - 44;
  noStroke(); fill(230, 240, 255, 200);
  rect(dx0, dy0, depW, dh);
  const seeds = [[0.2, 0.2], [0.4, 0.4], [0.3, 0.65], [0.6, 0.3], [0.7, 0.6], [0.5, 0.8]];
  for (let i = 0; i < seeds.length; i++) {
    const px2 = dx0 + seeds[i][0] * depW, py2 = dy0 + seeds[i][1] * dh;
    smlDrawElectron(px2, py2, 8);
  }
  noStroke(); fill(90); textAlign(CENTER, BOTTOM); textSize(10);
  text('wide W, carriers accelerate\nand multiply by impact ionization', x + w / 2, y + h - 6);
}

function drawZenerPanel(x, y, w, h, active) {
  noStroke(); fill(active ? color(255, 240, 235) : color(248));
  stroke(active ? color(220, 90, 60) : color(210)); strokeWeight(active ? 2.5 : 1);
  rect(x, y, w, h, 8);
  noStroke(); fill(active ? color(220, 90, 60) : color(120)); textAlign(CENTER, TOP); textSize(12); textStyle(BOLD);
  text('Zener', x + w / 2, y + 6);
  textStyle(NORMAL);
  const depW = w * 0.18;
  const dx0 = x + (w - depW) / 2, dy0 = y + 26, dh = h - 44;
  noStroke(); fill(255, 220, 210, 200);
  rect(dx0, dy0, depW, dh);
  stroke(220, 90, 60); strokeWeight(2);
  const midY = dy0 + dh / 2;
  line(dx0 - 16, midY, dx0 + depW + 16, midY);
  noStroke(); fill(220, 90, 60);
  triangle(dx0 + depW + 16, midY - 5, dx0 + depW + 16, midY + 5, dx0 + depW + 24, midY);
  noStroke(); fill(90); textAlign(CENTER, BOTTOM); textSize(10);
  text('narrow W, electrons tunnel\ndirectly through the thin barrier', x + w / 2, y + h - 6);
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
