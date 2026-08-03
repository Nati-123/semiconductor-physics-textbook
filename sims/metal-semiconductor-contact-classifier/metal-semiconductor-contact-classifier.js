// Metal-Semiconductor Contact Classifier MicroSim
// Classifies a metal-semiconductor contact as ohmic or rectifying based
// on comparing Phi_M to Phi_S for the chosen doping type, and plots a
// thermionic-emission Schottky diode I-V curve alongside a reference
// p-n diode curve (J0 = 1.34e-11 A/cm^2, from Chapter 15) to compare
// turn-on voltages.
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 430;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let metalSelect, typeSelect, dopingSlider;

const KT_Q = 0.0259;
const CHI = 4.05, EG = 1.12;
const NC = 2.8e19, NV = 1.04e19;
const METALS = { 'Aluminum (Al)': 4.1, 'Tungsten (W)': 4.55, 'Gold (Au)': 5.1, 'Platinum (Pt)': 5.65 };
const ASTAR = 110; // A/(cm^2 K^2)
const T = 300;
const J0_PN = 1.34e-11; // A/cm^2, reference from Chapter 15

function computePhiS(type, N) {
  if (type === 'n-type') {
    return CHI + KT_Q * Math.log(NC / N);
  }
  return CHI + (EG - KT_Q * Math.log(NV / N));
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  metalSelect = createSelect();
  Object.keys(METALS).forEach(k => metalSelect.option(k));
  metalSelect.selected('Aluminum (Al)');
  metalSelect.attribute('aria-label', 'Metal type');

  typeSelect = createSelect();
  typeSelect.option('n-type');
  typeSelect.option('p-type');
  typeSelect.selected('n-type');
  typeSelect.attribute('aria-label', 'Semiconductor doping type');

  dopingSlider = createSlider(14, 19, 16, 0.1);
  dopingSlider.attribute('aria-label', 'Doping concentration exponent');

  positionUIElements();
  describe('Metal-semiconductor contact classifier: classifies a metal-semiconductor contact as ohmic or rectifying, and compares a Schottky diode I-V curve to a p-n diode reference curve', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  metalSelect.position(bx + 150, by + drawHeight + 12);
  typeSelect.position(bx + 150, by + drawHeight + 50);
  dopingSlider.position(bx + 150, by + drawHeight + 88);
  dopingSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const PhiM = METALS[metalSelect.value()];
  const type = typeSelect.value();
  const N = Math.pow(10, dopingSlider.value());
  const PhiS = computePhiS(type, N);

  const isRectifying = (type === 'n-type') ? (PhiM > PhiS) : (PhiM < PhiS);
  const PhiBn = PhiM - CHI;
  const PhiB = (type === 'n-type') ? PhiBn : (EG - PhiBn);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15.5);
  text('Contact Classification and Schottky Diode I-V', canvasWidth / 2, 8);

  drawClassificationCard(PhiM, PhiS, isRectifying, PhiB, type);
  drawIVComparison(isRectifying, PhiB);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12.5);
  text('Metal:', 10, drawHeight + 18);
  text('Doping type:', 10, drawHeight + 56);
  text('N = 10^' + dopingSlider.value().toFixed(1) + ' cm⁻³   Φ_M=' + PhiM.toFixed(2) + ' V   Φ_S=' + PhiS.toFixed(3) + ' V', 10, drawHeight + 94);
}

function drawClassificationCard(PhiM, PhiS, isRectifying, PhiB, type) {
  const cardX = 20, cardY = 40, cardW = canvasWidth * 0.32, cardH = drawHeight - 90;
  const col = isRectifying ? color(220, 90, 60) : color(40, 150, 90);
  noStroke(); fill(isRectifying ? color(255, 240, 235) : color(235, 250, 240));
  stroke(col); strokeWeight(2.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke(); fill(col); textAlign(CENTER, TOP); textSize(15); textStyle(BOLD);
  text(isRectifying ? 'RECTIFYING' : 'OHMIC', cardX + cardW / 2, cardY + 14);
  textStyle(NORMAL);
  fill(30); textAlign(LEFT, TOP); textSize(11);
  const lines = [
    type + ' semiconductor',
    'Φ_M ' + (PhiM > PhiS ? '>' : '<') + ' Φ_S',
    isRectifying ? 'Schottky barrier forms' : 'No barrier; carriers accumulate',
    'Barrier height ≈ ' + PhiB.toFixed(3) + ' V'
  ];
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cardX + 12, cardY + 44 + i * 20, cardW - 24);
  }
}

function drawIVComparison(isRectifying, PhiB) {
  const chartX = canvasWidth * 0.40, chartY = 44, chartW = canvasWidth - chartX - 24, chartH = drawHeight - 100;
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(11.5);
  text('Forward I-V: Schottky vs. p-n reference (semi-log)', chartX, chartY - 4);

  const J0_schottky = isRectifying ? (ASTAR * T * T * Math.exp(-PhiB / KT_Q)) : null;
  const VMIN = 0, VMAX = 0.7;
  const series = [];
  const pnPts = [];
  for (let v = VMIN; v <= VMAX; v += 0.01) {
    pnPts.push({ x: v, y: Math.log10(max(J0_PN * (Math.exp(v / KT_Q) - 1), 1e-16)) });
  }
  series.push({ points: pnPts, color: color(90, 62, 237) });

  if (isRectifying) {
    const schPts = [];
    for (let v = VMIN; v <= VMAX; v += 0.01) {
      schPts.push({ x: v, y: Math.log10(max(J0_schottky * (Math.exp(v / KT_Q) - 1), 1e-16)) });
    }
    series.push({ points: schPts, color: color(230, 90, 60) });
  }

  smlDrawLineChart(chartX, chartY + 20, chartW - 20, chartH - 40, VMIN, VMAX, -12, 6, series,
    { xLabel: 'V (V)', yLabel: 'log10 J (A/cm²)', yLabelOffset: 44 });

  noStroke(); fill(90, 62, 237); textAlign(LEFT, TOP); textSize(10.5);
  text('— p-n diode (J0=1.34e-11)', chartX, chartY + 24);
  if (isRectifying) {
    fill(230, 90, 60);
    text('— Schottky diode (J0=' + J0_schottky.toExponential(2) + ')', chartX, chartY + 40);
  } else {
    fill(90); textAlign(LEFT, TOP); textSize(10.5);
    text('(No Schottky curve — this contact is ohmic, not rectifying)', chartX, chartY + 40);
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
