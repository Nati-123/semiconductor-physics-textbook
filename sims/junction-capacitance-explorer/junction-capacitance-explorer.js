// Junction Capacitance Explorer MicroSim
// Computes Cj = eps*A/W for a silicon step junction, with W(VR) widening
// under reverse bias per W(VR) = sqrt(2*eps*(Vbi+VR)/q * (1/NA+1/ND)).
// Plots Cj vs. VR live and draws a parallel-plate capacitor schematic
// whose plate separation tracks W.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 190;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let naSlider, ndSlider, areaSlider, vrSlider;

const Q = 1.602e-19;      // C
const EPS = 1.035e-12;    // F/cm  (Si, er=11.7)
const NI = 1.5e10;        // cm^-3 (Si, 300K)
const KT_Q = 0.0259;      // V (300K)

function vbiOf(NA, ND) {
  return KT_Q * Math.log((NA * ND) / (NI * NI));
}

function widthAt(NA, ND, Vbi, VR) {
  return Math.sqrt((2 * EPS * (Vbi + VR) / Q) * (1 / NA + 1 / ND)); // cm
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
  areaSlider = createSlider(-5, -2, -4, 0.1);
  areaSlider.attribute('aria-label', 'Junction area exponent, base 10, in square centimeters');
  vrSlider = createSlider(0, 10, 0, 0.1);
  vrSlider.attribute('aria-label', 'Reverse bias voltage');

  positionUIElements();
  describe('Junction capacitance explorer: computes junction capacitance from doping, area, and reverse bias for a silicon step junction, plotting capacitance versus reverse bias and a parallel-plate capacitor schematic', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  naSlider.position(bx + 150, by + drawHeight + 12);
  naSlider.size(min(canvasWidth - 170 - 30, 320));
  ndSlider.position(bx + 150, by + drawHeight + 50);
  ndSlider.size(min(canvasWidth - 170 - 30, 320));
  areaSlider.position(bx + 150, by + drawHeight + 88);
  areaSlider.size(min(canvasWidth - 170 - 30, 320));
  vrSlider.position(bx + 150, by + drawHeight + 126);
  vrSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const NA = Math.pow(10, naSlider.value());
  const ND = Math.pow(10, ndSlider.value());
  const A = Math.pow(10, areaSlider.value());
  const VR = vrSlider.value();
  const Vbi = vbiOf(NA, ND);
  const W = widthAt(NA, ND, Vbi, VR);
  const Cj = EPS * A / W;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('C_j = εA / W(V_R),   W(V_R) = √[2ε(V_bi+V_R)/q · (1/NA+1/ND)]', canvasWidth / 2, 8, canvasWidth - 20);

  drawCjCurve(NA, ND, Vbi, A, VR, Cj);
  drawCapacitorSchematic(W, VR);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12.5);
  text('NA = ' + NA.toExponential(1) + ' cm⁻³   ND = ' + ND.toExponential(1) + ' cm⁻³   A = ' + A.toExponential(1) + ' cm²', 10, drawHeight + 18);
  text('V_bi = ' + Vbi.toFixed(3) + ' V   V_R = ' + VR.toFixed(1) + ' V   W = ' + (W * 1e4).toFixed(3) + ' μm', 10, drawHeight + 56);
  text('C_j = ' + (Cj * 1e12).toFixed(3) + ' pF', 10, drawHeight + 94);
  text('Reverse bias widens W and lowers Cj — the basis of the varactor diode.', 10, drawHeight + 132);
}

function drawCjCurve(NA, ND, Vbi, A, VR, CjNow) {
  const chartX = 90, chartY = 40, chartW = canvasWidth * 0.56 - chartX, chartH = drawHeight - 90;
  const pts = [];
  let cjMax = 0;
  for (let vr = 0; vr <= 10; vr += 0.1) {
    const w = widthAt(NA, ND, Vbi, vr);
    const cj = EPS * A / w;
    pts.push({ x: vr, y: cj * 1e12 });
    if (cj * 1e12 > cjMax) cjMax = cj * 1e12;
  }
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(11.5);
  text('C_j vs. Reverse Bias V_R', chartX, 24);
  const info = smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 10, 0, cjMax * 1.15,
    [{ points: pts, color: color(90, 62, 237) }],
    { marker: { x: VR, y: CjNow * 1e12 }, xLabel: 'V_R (V)', yLabel: 'C_j (pF)', yLabelOffset: 40 });
}

function drawCapacitorSchematic(W, VR) {
  const cx0 = canvasWidth * 0.60, cx1 = canvasWidth - 30, cy = 60, ch = drawHeight - 140;
  const midY = cy + ch / 2;
  const maxWUm = 3.0;
  const gapPx = map(constrain(W * 1e4, 0.05, maxWUm), 0.05, maxWUm, 18, (cx1 - cx0) * 0.7);
  const plateX0 = (cx0 + cx1) / 2 - gapPx / 2;
  const plateX1 = (cx0 + cx1) / 2 + gapPx / 2;

  noStroke(); fill(30); textAlign(CENTER, TOP); textSize(11.5);
  text('Depletion Region as a Capacitor', (cx0 + cx1) / 2, cy - 24);

  stroke(190, 30, 30); strokeWeight(4);
  line(plateX0, cy, plateX0, cy + ch);
  stroke(30, 60, 190);
  line(plateX1, cy, plateX1, cy + ch);

  noStroke(); fill(255, 235, 235, 200);
  rect(plateX0, cy, (plateX1 - plateX0) / 2, ch);
  fill(230, 240, 255, 200);
  rect((plateX0 + plateX1) / 2, cy, (plateX1 - plateX0) / 2, ch);

  stroke(160); strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(plateX0, midY - ch / 2 - 10, plateX1, midY - ch / 2 - 10);
  drawingContext.setLineDash([]);
  noStroke(); fill(90); textAlign(CENTER, BOTTOM); textSize(11);
  text('W = ' + (W * 1e4).toFixed(3) + ' μm', (plateX0 + plateX1) / 2, midY - ch / 2 - 14);

  fill(190, 30, 30); textAlign(CENTER, TOP); textSize(11);
  text('p-side', plateX0 - 24, cy + ch + 6);
  fill(30, 60, 190);
  text('n-side', plateX1 + 24, cy + ch + 6);

  if (VR > 0.05) {
    noStroke(); fill(60); textAlign(CENTER, TOP); textSize(10.5);
    text('reverse bias applied — depletion widened', (cx0 + cx1) / 2, cy + ch + 22);
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
