// Metal-Semiconductor Contact Classifier MicroSim
// Classifies a metal-semiconductor contact as ohmic or rectifying based
// on comparing Phi_M to Phi_S for the chosen doping type, and plots a
// thermionic-emission Schottky diode I-V curve alongside a reference
// p-n diode curve (J0 = 1.34e-11 A/cm^2, from Chapter 15) to compare
// turn-on voltages. When the contact is ohmic, plots the contact's own
// approximately-linear I-V instead of a meaningless bare reference curve.
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
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
const R_OHMIC = 0.15;   // ohm-cm^2, illustrative specific contact resistance

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
  const rowY = drawHeight + 14;
  metalSelect.position(bx + 150, rowY);
  typeSelect.position(bx + 150, rowY + 38);
  dopingSlider.position(bx + 150, rowY + 76);
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
  // Same [0, Eg] clamp as the Work Function Explorer: Phi_M - chi can
  // mathematically exceed Eg (e.g. Platinum), which would otherwise predict
  // a negative barrier height for the complementary carrier type.
  const PhiBnRaw = PhiM - CHI;
  const PhiBn = constrain(PhiBnRaw, 0, EG);
  const PhiB = (type === 'n-type') ? PhiBn : (EG - PhiBn);

  const topSafe = 26;
  fill(20); noStroke(); textAlign(CENTER, TOP);
  // Full title is ~390px wide at size 15.5 -- fine on desktop, but wider
  // than the whole canvas on a narrow phone, where it used to get clipped
  // by the canvas edge (and look like it was fighting the fullscreen
  // button, since both sit near the top). Split to two lines and shrink.
  let titleH;
  if (canvasWidth < 460) {
    textSize(13);
    text('Contact Classification', canvasWidth / 2, topSafe + 6);
    text('and Schottky Diode I-V', canvasWidth / 2, topSafe + 22);
    titleH = 40;
  } else {
    textSize(15.5);
    text('Contact Classification and Schottky Diode I-V', canvasWidth / 2, topSafe + 6);
    titleH = 28;
  }
  const contentTop = topSafe + titleH + 6;

  const stacked = canvasWidth < 640;
  let cardBox, chartBox;
  if (stacked) {
    // The classification card has more fixed content (title + 4 rows + an
    // explanatory paragraph) than the chart needs to stay legible, so it
    // gets the larger share of the stacked space.
    const midY = contentTop + (drawHeight - contentTop - 20) * 0.62;
    cardBox = { x: 16, y: contentTop, w: canvasWidth - 32, h: midY - contentTop - 10 };
    chartBox = { x: 16, y: midY + 6, w: canvasWidth - 32, h: drawHeight - (midY + 6) - 10 };
  } else {
    cardBox = { x: 20, y: contentTop, w: canvasWidth * 0.32, h: drawHeight - contentTop - 20 };
    chartBox = { x: canvasWidth * 0.40, y: contentTop, w: canvasWidth - canvasWidth * 0.40 - 24, h: drawHeight - contentTop - 20 };
  }

  drawClassificationCard(cardBox, PhiM, PhiS, isRectifying, PhiB, type);
  drawIVComparison(chartBox, isRectifying, PhiB);

  fill(30); noStroke();
  textAlign(LEFT, CENTER); textSize(13);
  const rowY = drawHeight + 14;
  text('Metal:', 10, rowY + 10);
  text('Doping type:', 10, rowY + 48);
  smlMathText(10, rowY + 78, 'N = ' + smlFormatPow10(dopingSlider.value()), { size: 13 });
}

function drawClassificationCard(box, PhiM, PhiS, isRectifying, PhiB, type) {
  const cardX = box.x, cardY = box.y, cardW = box.w, cardH = box.h;
  const compact = cardH < 200;
  const fs = compact ? 10.5 : 11.5;
  const col = isRectifying ? color(220, 90, 60) : color(40, 150, 90);
  noStroke(); fill(isRectifying ? color(255, 240, 235) : color(235, 250, 240));
  stroke(col); strokeWeight(2.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke(); fill(col); textAlign(CENTER, TOP); textSize(compact ? 13 : 15); textStyle(BOLD);
  text(isRectifying ? 'RECTIFYING' : 'OHMIC', cardX + cardW / 2, cardY + (compact ? 10 : 14));
  textStyle(NORMAL);
  fill(30); textAlign(LEFT, TOP); textSize(fs);
  let y = cardY + (compact ? 32 : 44);
  const rowH = compact ? 17 : 21;
  text(type + ' semiconductor', cardX + 12, y, cardW - 24); y += rowH;
  smlMathText(cardX + 12, y, 'Φ_M ' + (PhiM > PhiS ? '>' : '<') + ' Φ_S   (' + PhiM.toFixed(2) + (PhiM > PhiS ? ' > ' : ' < ') + PhiS.toFixed(3) + ' V)', { size: fs }); y += rowH;
  text(isRectifying ? 'Schottky barrier forms' : 'No barrier; majority carriers accumulate at the surface', cardX + 12, y, cardW - 24); y += (isRectifying ? rowH : rowH * 2);
  smlMathText(cardX + 12, y, 'Φ_B ≈ ' + PhiB.toFixed(3) + ' V', { size: fs }); y += rowH + (compact ? 3 : 6);

  noStroke(); fill(90); textSize(compact ? 9 : 10);
  text(isRectifying
    ? (compact ? 'Barrier blocks majority-carrier flow at low bias -- strongly asymmetric (rectifying) I-V.' : 'The barrier blocks majority-carrier flow at low bias, so current is dominated by thermionic emission over Φ_B -- strongly asymmetric (rectifying) I-V.')
    : (compact ? 'No barrier to cross: carriers move freely both directions, an approximately linear resistor, not a diode.' : 'With no barrier to cross, carriers move freely both directions: the contact behaves as an approximately linear resistor, not a diode.'),
    cardX + 12, y, cardW - 24);
}

function drawIVComparison(box, isRectifying, PhiB) {
  // Row layout: [0] chart title, [1] legend line(s), [2..] the chart itself.
  // Below ~500px the title and (especially the ohmic) legend text no longer
  // fit on one line each at full size, so both shrink and the two-curve
  // legend stacks vertically instead of sitting side by side.
  const narrow = box.w < 500;
  const chartX = box.x, chartW = box.w;
  const legendY = box.y + (narrow ? 30 : 18);
  const chartY = box.y + (narrow ? (isRectifying ? 66 : 56) : 40);
  const chartH = box.h - (chartY - box.y) - 20;
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(narrow ? 11 : 11.5);
  text(narrow ? 'Forward I-V: Schottky vs. p-n' : 'Forward I-V: Schottky vs. p-n reference (semi-log)', chartX, box.y, box.w);

  const J0_schottky = isRectifying ? (ASTAR * T * T * Math.exp(-PhiB / KT_Q)) : null;
  const VMIN = 0, VMAX = 0.7;
  const series = [];
  const pnPts = [];
  for (let v = VMIN; v <= VMAX; v += 0.01) {
    pnPts.push({ x: v, y: Math.log10(max(J0_PN * (Math.exp(v / KT_Q) - 1), 1e-16)) });
  }

  let yMinAxis = -12, yMaxAxis = 6;
  if (isRectifying) {
    series.push({ points: pnPts, color: color(90, 62, 237) });
    const schPts = [];
    for (let v = VMIN; v <= VMAX; v += 0.01) {
      schPts.push({ x: v, y: Math.log10(max(J0_schottky * (Math.exp(v / KT_Q) - 1), 1e-16)) });
    }
    series.push({ points: schPts, color: color(230, 90, 60) });
    const yTicks = [];
    for (let e = Math.ceil(yMinAxis); e <= yMaxAxis; e += 3) yTicks.push(e);
    const xTicks = [0, 0.2, 0.4, 0.6];
    smlDrawLineChart(chartX, chartY, chartW - 20, chartH - 20, VMIN, VMAX, yMinAxis, yMaxAxis, series,
      {
        xLabel: 'V (V)', yLabel: 'log10 J (A/cm2)', yLabelOffset: 40,
        xTicks: xTicks, xTickFormat: v => v.toFixed(1),
        yTicks: yTicks, yTickFormat: v => v.toFixed(0)
      });
    noStroke(); textAlign(LEFT, TOP); textSize(narrow ? 9.5 : 10.5);
    fill(90, 62, 237);
    text('— p-n diode (J0=' + J0_PN.toExponential(2) + ')', chartX, legendY);
    fill(230, 90, 60);
    if (narrow) text('— Schottky diode (J0=' + J0_schottky.toExponential(2) + ')', chartX, legendY + 15);
    else text('— Schottky diode (J0=' + J0_schottky.toExponential(2) + ')', chartX + chartW / 2, legendY);
  } else {
    // Ohmic contact: no exponential diode behavior at all -- plotting it on
    // the same log|J| axis as the diodes would visually disguise the point.
    // Instead show J = V / (specific contact resistance) on its own LINEAR
    // axis, so "approximately linear contact behavior" is what the curve
    // literally looks like, not just a caption.
    const yMaxLin = VMAX / R_OHMIC * 1.08;
    const ohmicPts = [];
    for (let v = -VMAX; v <= VMAX; v += 0.01) ohmicPts.push({ x: v, y: v / R_OHMIC });
    series.push({ points: ohmicPts, color: color(40, 150, 90) });

    const xTicks = [-0.6, -0.3, 0, 0.3, 0.6];
    const yTicks = [-4, -2, 0, 2, 4];
    smlDrawLineChart(chartX, chartY, chartW - 20, chartH - 20, -VMAX, VMAX, -yMaxLin, yMaxLin, series,
      {
        xLabel: 'V (V)', yLabel: 'J (A/cm2), linear', yLabelOffset: 40,
        xTicks: xTicks, xTickFormat: v => v.toFixed(1),
        yTicks: yTicks, yTickFormat: v => v.toFixed(0)
      });
    noStroke(); fill(40, 150, 90); textAlign(LEFT, TOP); textSize(narrow ? 9.5 : 10.5);
    text(narrow ? '— Ohmic: J = V / ρc  (linear axis, not log)' : '— Ohmic contact: J = V / ρc  (ρc ≈ ' + R_OHMIC.toFixed(2) + ' Ω·cm2, illustrative) -- linear axis, not log', chartX, legendY, chartW);
    if (!narrow) {
      fill(90); textSize(9.5);
      text('No rectifying barrier here: current is approximately linear and symmetric in V, unlike the p-n/Schottky diode curves.', chartX, chartY + chartH - 6, chartW);
    }
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
