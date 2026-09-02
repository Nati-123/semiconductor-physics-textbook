// Threshold Voltage Calculator MicroSim
// Computes VT = VFB + 2*phiF + Qdepmax/Cox for a p-substrate (NMOS) MOS
// capacitor from gate material, substrate doping, and oxide thickness,
// drawing a labeled waterfall bar showing each term's contribution
// building up to the final VT, plus a results card with every
// intermediate quantity.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 190;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let gateSelect, naSlider, toxSlider;

const Q = 1.602e-19;
const EPS_S = 1.035e-12;
const EPS_OX = 3.9 * 8.85e-14;
const NI = 1.5e10, KT_Q = 0.0259;
const CHI = 4.05, EG = 1.12, NV = 1.04e19;
const GATES = { 'Aluminum (Φ=4.1V)': 4.1, 'n+ Polysilicon (Φ≈4.05V)': 4.05, 'p+ Polysilicon (Φ≈5.17V)': 5.17, 'Tungsten (Φ=4.55V)': 4.55 };

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  gateSelect = createSelect();
  Object.keys(GATES).forEach(k => gateSelect.option(k));
  gateSelect.selected('Aluminum (Φ=4.1V)');
  gateSelect.attribute('aria-label', 'Gate material');

  naSlider = createSlider(14, 18, 16, 0.1);
  naSlider.attribute('aria-label', 'Substrate doping concentration exponent');
  toxSlider = createSlider(2, 40, 20, 1);
  toxSlider.attribute('aria-label', 'Oxide thickness in nanometers');

  positionUIElements();
  describe('Threshold voltage calculator: computes MOS threshold voltage from gate material, substrate doping, and oxide thickness, with a labeled waterfall bar showing each term\'s contribution and a results card with every intermediate quantity', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const rowY = drawHeight + 14;
  gateSelect.position(bx + 150, rowY);
  naSlider.position(bx + 150, rowY + 38);
  naSlider.size(min(canvasWidth - 170 - 30, 320));
  toxSlider.position(bx + 150, rowY + 76);
  toxSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const PhiM = GATES[gateSelect.value()];
  const NA = Math.pow(10, naSlider.value());
  const toxCm = toxSlider.value() * 1e-7; // nm to cm

  const EfMinusEv = KT_Q * Math.log(NV / NA);
  const PhiS = CHI + (EG - EfMinusEv);
  const VFB = PhiM - PhiS;
  const phiF = KT_Q * Math.log(NA / NI);
  const Cox = EPS_OX / toxCm;
  const Qdepmax = Math.sqrt(4 * EPS_S * Q * NA * phiF);
  const term3 = Qdepmax / Cox;
  const VT = VFB + 2 * phiF + term3;

  const topSafe = 26;
  fill(20); noStroke(); textAlign(CENTER, TOP);
  let titleH;
  if (canvasWidth < 460) {
    textSize(13);
    smlMathText(canvasWidth / 2, topSafe + 4, 'V_T = V_FB + 2φ_F + Q_dep,max/C_ox', { size: 13, align: 'center' });
    titleH = 22;
  } else {
    smlMathText(canvasWidth / 2, topSafe + 6, 'V_T = V_FB + 2φ_F + Q_dep,max/C_ox', { size: 15.5, align: 'center' });
    titleH = 24;
  }
  const contentTop = topSafe + titleH + 8;

  const stacked = canvasWidth < 660;
  let chartBox, cardBox;
  if (stacked) {
    const midY = contentTop + (drawHeight - contentTop - 10) * 0.6;
    chartBox = { x: 20, y: contentTop, w: canvasWidth - 40, h: midY - contentTop - 10 };
    cardBox = { x: 20, y: midY + 6, w: canvasWidth - 40, h: drawHeight - (midY + 6) - 10 };
  } else {
    chartBox = { x: 20, y: contentTop, w: canvasWidth * 0.68 - 20, h: drawHeight - contentTop - 10 };
    cardBox = { x: canvasWidth * 0.68 + 6, y: contentTop, w: canvasWidth - (canvasWidth * 0.68 + 6) - 20, h: drawHeight - contentTop - 10 };
  }

  drawWaterfall(chartBox, VFB, 2 * phiF, term3, VT);
  drawResultsCard(cardBox, PhiM, PhiS, VFB, phiF, Cox, Qdepmax, VT);

  fill(30); noStroke();
  textAlign(LEFT, CENTER); textSize(13);
  const rowY = drawHeight + 14;
  text('Gate:', 10, rowY + 10);
  smlMathText(10, rowY + 48, 'N_A = ' + smlFormatPow10(naSlider.value()), { size: 13 });
  smlMathText(10, rowY + 86, 't_ox = ' + toxSlider.value() + ' nm', { size: 13 });
}

function drawWaterfall(box, vfb, twoPhiF, term3, vt) {
  const chartX = box.x + 46, chartY = box.y, chartW = box.w - 46 - 10, chartH = box.h - 34;
  const vMin = min(-1.2, vt - 0.3), vMax = max(1.2, vt + 0.3);
  function yOf(v) { return map(v, vMin, vMax, chartY + chartH, chartY); }

  stroke(200); strokeWeight(1); noFill();
  rect(chartX, chartY, chartW, chartH);
  stroke(150); strokeWeight(1); drawingContext.setLineDash([2, 3]);
  const zeroY = yOf(0);
  line(chartX, zeroY, chartX + chartW, zeroY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90); textAlign(RIGHT, CENTER); textSize(10);
  text('0 V', chartX - 6, zeroY);

  const segs = [
    { label: 'V_FB', value: vfb, color: color(220, 90, 60) },
    { label: '2φ_F', value: twoPhiF, color: color(90, 62, 237) },
    { label: 'Q_dep/C_ox', value: term3, color: color(40, 150, 90) },
    { label: 'V_T', value: null, color: color(20), isTotal: true }
  ];
  // Evenly spaced bars with a consistent gap -- generalized over ALL bars,
  // total (V_T) included, instead of hand-computing the total bar's offset
  // separately. That mismatch (sizing for 3 bars, then squeezing in a 4th)
  // was exactly what used to push V_T's bar off the right edge of the box.
  const n = segs.length;
  const gapRatio = 0.4;
  const barW = chartW / (n + (n + 1) * gapRatio);
  const gap = barW * gapRatio;
  let cum = 0;
  for (let i = 0; i < n; i++) {
    const x = chartX + gap + i * (barW + gap);
    let y0, y1, labelValue;
    if (segs[i].isTotal) {
      y0 = zeroY; y1 = yOf(vt); labelValue = vt;
    } else {
      y0 = yOf(cum); y1 = yOf(cum + segs[i].value); labelValue = segs[i].value;
      cum += segs[i].value;
    }
    noStroke(); fill(segs[i].color);
    rect(x, min(y0, y1), barW, max(abs(y1 - y0), 2));
    if (segs[i].isTotal) { stroke(20); strokeWeight(1.5); noFill(); rect(x, min(y0, y1), barW, max(abs(y1 - y0), 2)); }
    noStroke(); fill(30); textAlign(CENTER, TOP); textSize(min(10.5, barW / 6.5));
    smlMathText(x + barW / 2, chartY + chartH + 6, segs[i].label, { size: min(10.5, barW / 6.2), align: 'center' });
    fill(segs[i].isTotal ? 20 : 60); textSize(min(10, barW / 7));
    textStyle(segs[i].isTotal ? BOLD : NORMAL);
    text(labelValue.toFixed(3), x + barW / 2, min(y0, y1) - 14);
    textStyle(NORMAL);
  }
}

function drawResultsCard(box, PhiM, PhiS, VFB, phiF, Cox, Qdepmax, VT) {
  const cardX = box.x, cardY = box.y, cardW = box.w, cardH = box.h;
  noStroke(); fill(240, 245, 255);
  stroke(168, 200, 255); strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);

  const rows = [
    ['Φ_M', PhiM.toFixed(2) + ' V'],
    ['Φ_S', PhiS.toFixed(3) + ' V'],
    ['φ_F', phiF.toFixed(3) + ' V'],
    ['V_FB', VFB.toFixed(3) + ' V'],
    ['C_ox', Cox.toExponential(2) + ' F/cm2'],
    ['Q_dep,max', Qdepmax.toExponential(2) + ' C/cm2'],
  ];
  const compact = cardH < 220 || cardW < 220;
  const fs = compact ? 10.5 : 11.5;
  const rowH = compact ? 18 : 21;
  fill(30); textAlign(LEFT, TOP);
  let y = cardY + 12;
  for (const [label, value] of rows) {
    smlMathText(cardX + 12, y, label + ' = ' + value, { size: fs });
    y += rowH;
  }
  y += 4;
  noStroke(); fill(90, 62, 237, 25);
  stroke(90, 62, 237); strokeWeight(1.3);
  rect(cardX + 8, y, cardW - 16, compact ? 26 : 30, 6);
  noStroke(); fill(90, 62, 237); textAlign(CENTER, CENTER); textStyle(BOLD);
  smlMathText(cardX + cardW / 2, y + (compact ? 6 : 8), 'V_T = ' + VT.toFixed(3) + ' V', { size: compact ? 12.5 : 14, align: 'center' });
  textStyle(NORMAL);
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
