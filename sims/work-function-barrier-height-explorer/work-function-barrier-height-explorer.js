// Work Function and Barrier Height Explorer MicroSim
// Computes the semiconductor work function Phi_S from doping type and
// concentration, then the Schottky barrier height Phi_B and built-in
// potential Vbi for a chosen metal, drawing a metal + semiconductor band
// diagram before and after contact.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 190;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let metalSelect, typeSelect, dopingSlider;

const KT_Q = 0.0259;
const CHI = 4.05; // eV, Si electron affinity
const EG = 1.12;  // eV
const NC = 2.8e19, NV = 1.04e19, NI = 1.5e10;
const METALS = { 'Aluminum (Al)': 4.1, 'Tungsten (W)': 4.55, 'Gold (Au)': 5.1, 'Platinum (Pt)': 5.65 };

function computePhiS(type, N) {
  if (type === 'n-type') {
    const EcMinusEf = KT_Q * Math.log(NC / N);
    return { PhiS: CHI + EcMinusEf, EcMinusEf: EcMinusEf, EfMinusEv: null };
  } else {
    const EfMinusEv = KT_Q * Math.log(NV / N);
    return { PhiS: CHI + (EG - EfMinusEv), EcMinusEf: EG - EfMinusEv, EfMinusEv: EfMinusEv };
  }
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  metalSelect = createSelect();
  Object.keys(METALS).forEach(k => metalSelect.option(k));
  metalSelect.selected('Gold (Au)');
  metalSelect.attribute('aria-label', 'Metal type');

  typeSelect = createSelect();
  typeSelect.option('n-type');
  typeSelect.option('p-type');
  typeSelect.selected('n-type');
  typeSelect.attribute('aria-label', 'Semiconductor doping type');

  dopingSlider = createSlider(14, 19, 16, 0.1);
  dopingSlider.attribute('aria-label', 'Doping concentration exponent');

  positionUIElements();
  describe('Work function and barrier height explorer: computes Schottky barrier height and built-in potential from a chosen metal and semiconductor doping, with a band diagram', LABEL);
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
  const r = computePhiS(type, N);
  const PhiBn = PhiM - CHI;
  const PhiBp = EG - PhiBn;
  const Vbi = Math.abs(PhiM - r.PhiS);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15.5);
  text('Φ_S = χ + (EC−EF)/q,   Φ_B = Φ_M − χ  (n-type),   V_bi = |Φ_M − Φ_S|', canvasWidth / 2, 8, canvasWidth - 20);

  drawBandDiagram(PhiM, r, type);
  drawResultCard(PhiM, r, PhiBn, PhiBp, Vbi, type);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Metal:', 10, drawHeight + 18);
  text('Doping type:', 10, drawHeight + 56);
  text('N = 10^' + dopingSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 94);
}

function drawBandDiagram(PhiM, r, type) {
  const x0 = 30, x1 = canvasWidth * 0.56, chartY = 44, chartH = drawHeight - 130;
  const midX = (x0 + x1) / 2;
  const vacY = chartY + 10;
  const scale = chartH * 0.55;

  noFill(); stroke(210); strokeWeight(1);
  rect(x0 - 10, chartY - 6, x1 - x0 + 20, chartH + 12, 6);

  stroke(150); strokeWeight(1); drawingContext.setLineDash([2, 3]);
  line(x0, vacY, x1, vacY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90); textAlign(LEFT, BOTTOM); textSize(10);
  text('vacuum level', x0, vacY - 2);

  const efMetalY = vacY + PhiM * scale * 0.6;
  stroke(90, 62, 237); strokeWeight(2.5);
  line(x0, efMetalY, midX - 4, efMetalY);
  noStroke(); fill(90, 62, 237); textAlign(LEFT, BOTTOM); textSize(10.5);
  text('metal EF', x0, efMetalY - 4);

  const ecY = vacY + CHI * scale * 0.6;
  const bandGapPx = EG * scale * 0.6;
  const evY = ecY + bandGapPx;
  const efSemY = vacY + r.PhiS * scale * 0.6;

  const bend = (type === 'n-type') ? 1 : -1;
  const bendAmt = 22;
  stroke(90, 180, 220); strokeWeight(2.2); noFill();
  beginShape();
  vertex(midX + 4, ecY - bend * bendAmt);
  vertex(midX + 30, ecY - bend * bendAmt);
  bezierVertex(midX + 45, ecY - bend * bendAmt, midX + 45, ecY, midX + 60, ecY);
  vertex(x1, ecY);
  endShape();
  stroke(90, 180, 120);
  beginShape();
  vertex(midX + 4, evY - bend * bendAmt);
  vertex(midX + 30, evY - bend * bendAmt);
  bezierVertex(midX + 45, evY - bend * bendAmt, midX + 45, evY, midX + 60, evY);
  vertex(x1, evY);
  endShape();

  noStroke(); fill(90, 180, 220); textAlign(LEFT, BOTTOM); textSize(10.5);
  text('EC', x1 + 4, ecY + 4);
  fill(90, 180, 120);
  text('EV', x1 + 4, evY + 4);

  stroke(160); strokeWeight(1.3); drawingContext.setLineDash([2, 4]);
  line(midX + 4, efSemY, x1, efSemY);
  drawingContext.setLineDash([]);
  noStroke(); fill(120); textAlign(LEFT, TOP); textSize(10);
  text('EF (semiconductor, far from contact)', midX + 8, efSemY + 3);

  stroke(90, 62, 237); strokeWeight(2.5);
  line(midX - 4, efMetalY, midX + 4, efMetalY);

  noStroke(); fill(60); textAlign(CENTER, TOP); textSize(11); textStyle(BOLD);
  text('Metal', x0 + (midX - x0) / 2, chartY + chartH + 8);
  text('Semiconductor (' + type + ')', midX + (x1 - midX) / 2, chartY + chartH + 8);
  textStyle(NORMAL);
}

function drawResultCard(PhiM, r, PhiBn, PhiBp, Vbi, type) {
  const cardX = canvasWidth * 0.60, cardY = 44, cardW = canvasWidth - cardX - 24, cardH = drawHeight - 90;
  noStroke(); fill(240, 245, 255);
  stroke(168, 200, 255); strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke(); fill(90, 62, 237); textAlign(CENTER, TOP); textSize(13); textStyle(BOLD);
  text('Φ_S = ' + r.PhiS.toFixed(3) + ' V', cardX + cardW / 2, cardY + 12);
  textStyle(NORMAL);
  fill(30); textAlign(LEFT, TOP); textSize(11.5);
  const lines = [
    'Φ_M = ' + PhiM.toFixed(2) + ' V',
    'χ = ' + CHI.toFixed(2) + ' V',
    'Φ_Bn (electron barrier) = ' + PhiBn.toFixed(3) + ' V',
    'Φ_Bp (hole barrier) = ' + PhiBp.toFixed(3) + ' V',
    'V_bi = ' + Vbi.toFixed(3) + ' V',
    (PhiM > r.PhiS ? 'Φ_M > Φ_S' : 'Φ_M < Φ_S')
  ];
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cardX + 14, cardY + 44 + i * 22, cardW - 28);
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
