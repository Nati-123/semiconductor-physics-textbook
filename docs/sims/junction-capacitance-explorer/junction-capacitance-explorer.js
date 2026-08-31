// Junction Capacitance Explorer MicroSim
// Computes Cj = eps*A/W for a silicon step junction, with W(VR) widening
// under reverse bias per W(VR) = sqrt(2*eps*(Vbi+VR)/q * (1/NA+1/ND)).
// Plots Cj vs. VR live and draws a parallel-plate capacitor schematic
// whose plate separation tracks W, making explicit that increasing
// reverse bias -> larger W -> smaller Cj.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 230;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let naSlider, ndSlider, areaSlider, vrSlider;

const Q = 1.602e-19;      // C
const EPS = 1.035e-12;    // F/cm  (Si, er=11.7)
const NI = 1.5e10;        // cm^-3 (Si, 300K)
const KT_Q = 0.0259;      // V (300K)

function compact() { return canvasWidth < 640; }

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
  naSlider.attribute('aria-label', 'Acceptor doping concentration exponent, N_A');
  naSlider.input(function () { redraw(); });
  ndSlider = createSlider(15, 19, 16, 0.1);
  ndSlider.attribute('aria-label', 'Donor doping concentration exponent, N_D');
  ndSlider.input(function () { redraw(); });
  areaSlider = createSlider(-5, -2, -4, 0.1);
  areaSlider.attribute('aria-label', 'Junction area exponent, base 10, in square centimeters');
  areaSlider.input(function () { redraw(); });
  vrSlider = createSlider(0, 10, 0, 0.1);
  vrSlider.attribute('aria-label', 'Reverse bias voltage');
  vrSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Junction capacitance explorer: computes junction capacitance from doping, area, and reverse bias for a silicon step junction, plotting capacitance versus reverse bias and a parallel-plate capacitor schematic whose plate separation tracks the depletion width', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function controlRows() {
  const stacked = compact();
  const rowH = stacked ? 54 : 36;
  const topPad = 10;
  return {
    stacked: stacked, rowH: rowH,
    na: topPad, nd: topPad + rowH, area: topPad + 2 * rowH, vr: topPad + 3 * rowH,
    cardTop: topPad + 4 * rowH + 8
  };
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const rows = controlRows();
  const widgetX = rows.stacked ? 16 : 150;
  const widgetOffsetY = rows.stacked ? 20 : 8;
  const sw = rows.stacked ? Math.min(canvasWidth - 32, 360) : Math.min(canvasWidth - 150 - 30, 320);

  naSlider.position(bx + widgetX, by + drawHeight + rows.na + widgetOffsetY);
  naSlider.size(sw);
  ndSlider.position(bx + widgetX, by + drawHeight + rows.nd + widgetOffsetY);
  ndSlider.size(sw);
  areaSlider.position(bx + widgetX, by + drawHeight + rows.area + widgetOffsetY);
  areaSlider.size(sw);
  vrSlider.position(bx + widgetX, by + drawHeight + rows.vr + widgetOffsetY);
  vrSlider.size(sw);
}

function draw() {
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
  smlMathText(canvasWidth / 2, 8, compact() ? 'C_j = εA / W(V_R)' : 'C_j = εA / W(V_R),   W(V_R) = √[2ε(V_bi+V_R)/q · (1/N_A+1/N_D)]', { size: compact() ? 11.5 : 15, align: 'center' });

  const stacked = compact();
  if (stacked) {
    const splitY = 40 + (drawHeight - 40) * 0.52;
    // chartX needs room for the y-axis tick numbers (e.g. "3.0") to
    // their left -- 10px left almost none, and they were clipped off
    // the canvas entirely.
    drawCjCurve(NA, ND, Vbi, A, VR, Cj, 34, 40, canvasWidth - 44, splitY - 40 - 10);
    drawCapacitorSchematic(W, VR, 10, splitY + 10, canvasWidth - 20, drawHeight - splitY - 20);
  } else {
    drawCjCurve(NA, ND, Vbi, A, VR, Cj, 70, 40, canvasWidth * 0.55 - 70, drawHeight - 70);
    drawCapacitorSchematic(W, VR, canvasWidth * 0.58, 40, canvasWidth * 0.42 - 20, drawHeight - 70);
  }

  drawControlLabels(NA, ND, A, VR);
  drawInfoCard(NA, ND, A, Vbi, VR, W, Cj);
}

function drawCjCurve(NA, ND, Vbi, A, VR, CjNow, chartX, chartY, chartW, chartH) {
  const pts = [];
  let cjMax = 0;
  for (let vr = 0; vr <= 10; vr += 0.1) {
    const w = widthAt(NA, ND, Vbi, vr);
    const cj = EPS * A / w;
    pts.push({ x: vr, y: cj * 1e12 });
    if (cj * 1e12 > cjMax) cjMax = cj * 1e12;
  }
  fill(30); noStroke();
  smlMathText(chartX, chartY - 20, 'C_j vs. Reverse Bias V_R', { size: compact() ? 10 : 11.5 });
  const info = smlDrawLineChart(chartX, chartY, chartW, chartH - 20, 0, 10, 0, cjMax * 1.15,
    [{ points: pts, color: color(90, 62, 237) }],
    { marker: { x: VR, y: CjNow * 1e12 }, yLabel: 'C_j (pF)', yLabelOffset: compact() ? 32 : 40 });

  // Numerical tick marks + gridlines on both axes -- smlDrawLineChart
  // draws none on its own. The "V_R (V)" caption is drawn manually
  // below the tick row (instead of via opts.xLabel, which sits right
  // where the tick numbers go and would overlap them).
  const plotBottom = chartY + chartH - 20;
  const yStep = Math.max(1, Math.ceil(cjMax * 1.15 / 5));
  noStroke(); fill(90); textAlign(RIGHT, CENTER); textSize(compact() ? 8 : 9);
  for (let cv = 0; cv <= cjMax * 1.15; cv += yStep) {
    const py = info.yToPx(cv);
    stroke(225); strokeWeight(1); line(chartX, py, chartX + chartW, py);
    noStroke(); fill(90);
    text(cv.toFixed(cv < 10 ? 1 : 0), chartX - 5, py);
  }
  textAlign(CENTER, TOP);
  for (let vr = 0; vr <= 10; vr += 2) {
    const px = info.xToPx(vr);
    noStroke(); fill(90);
    text(vr, px, plotBottom + 3);
  }
  noStroke(); fill(40);
  smlMathText(chartX + chartW / 2, plotBottom + (compact() ? 15 : 16), 'V_R (V)', { size: compact() ? 9.5 : 10.5, align: 'center' });
}

function drawCapacitorSchematic(W, VR, x0, y0, w, h) {
  // cy is pushed down further from y0 than it first looks like it
  // needs to be, specifically to clear the "Depletion Region..." title
  // above it plus the W label's own text height sitting just above cy
  // -- ch is shrunk by the same amount so the bottom margin (p-side/
  // n-side labels, reverse-bias note) is unaffected.
  const cx0 = x0, cx1 = x0 + w, cy = y0 + 44, ch = h - 74;
  const midY = cy + ch / 2;
  const maxWUm = 3.0;
  const gapPx = map(constrain(W * 1e4, 0.05, maxWUm), 0.05, maxWUm, 14, w * 0.7);
  const plateX0 = (cx0 + cx1) / 2 - gapPx / 2;
  const plateX1 = (cx0 + cx1) / 2 + gapPx / 2;

  noStroke(); fill(30); textAlign(CENTER, TOP); textSize(compact() ? 10.5 : 11.5);
  text('Depletion Region as a Capacitor', x0 + w / 2, y0);

  stroke(190, 30, 30); strokeWeight(4);
  line(plateX0, cy, plateX0, cy + ch);
  stroke(30, 60, 190);
  line(plateX1, cy, plateX1, cy + ch);

  noStroke(); fill(255, 235, 235, 200);
  rect(plateX0, cy, (plateX1 - plateX0) / 2, ch);
  fill(230, 240, 255, 200);
  rect((plateX0 + plateX1) / 2, cy, (plateX1 - plateX0) / 2, ch);

  // W label sits ABOVE the plates, clear of the "Depletion Region..."
  // title above it (which ends around y0+16); the dashed tick line
  // sits just above the plates themselves.
  const wLabelY = cy - 10;
  stroke(160); strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(plateX0, wLabelY, plateX1, wLabelY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90); textAlign(CENTER, BOTTOM); textSize(compact() ? 10 : 11);
  text('W = ' + (W * 1e4).toFixed(3) + ' μm', (plateX0 + plateX1) / 2, wLabelY - 4);

  fill(190, 30, 30); textAlign(CENTER, TOP); textSize(compact() ? 10 : 11);
  text('p-side', plateX0 - (compact() ? 20 : 24), cy + ch + 6);
  fill(30, 60, 190);
  text('n-side', plateX1 + (compact() ? 20 : 24), cy + ch + 6);

  if (VR > 0.05) {
    noStroke(); fill(60); textAlign(CENTER, TOP); textSize(compact() ? 9.5 : 10.5);
    // x must be the wrap box's LEFT edge (not its center) once a width
    // is passed to text().
    text('reverse bias applied — depletion widened', x0, cy + ch + 24, w);
  }
}

// Formats a small area value (cm²) as "1.0×10⁻⁴ cm²" -- smlFormatConc
// is specifically for concentrations (always appends "cm⁻³"), so area
// needs its own thin wrapper around the same smlSuperscript machinery.
function formatArea(value) {
  const exp = Math.floor(Math.log10(value));
  const mant = value / Math.pow(10, exp);
  return mant.toFixed(1) + '×10' + smlSuperscript(exp) + ' cm²';
}

function drawControlLabels(NA, ND, A, VR) {
  const rows = controlRows();
  const sz = compact() ? 12 : 13;
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(sz);
  if (rows.stacked) {
    smlMathText(10, drawHeight + rows.na, 'N_A = ' + smlFormatConc(NA), { size: sz });
    smlMathText(10, drawHeight + rows.nd, 'N_D = ' + smlFormatConc(ND), { size: sz });
    text('A = ' + formatArea(A), 10, drawHeight + rows.area);
    smlMathText(10, drawHeight + rows.vr, 'V_R = ' + VR.toFixed(1) + ' V', { size: sz });
  } else {
    smlDrawSubLabel(10, drawHeight + rows.na + 9 + sz * 0.36, 'N', 'A', { size: sz, baseline: CENTER });
    smlDrawSubLabel(10, drawHeight + rows.nd + 9 + sz * 0.36, 'N', 'D', { size: sz, baseline: CENTER });
    text('Area A', 10, drawHeight + rows.area + 9);
    smlDrawSubLabel(10, drawHeight + rows.vr + 9 + sz * 0.36, 'Reverse bias V', 'R', { size: sz, baseline: CENTER });
    textAlign(RIGHT, TOP);
    text(smlFormatConc(NA), canvasWidth - 10, drawHeight + rows.na + 9);
    text(smlFormatConc(ND), canvasWidth - 10, drawHeight + rows.nd + 9);
    text(formatArea(A), canvasWidth - 10, drawHeight + rows.area + 9);
    text(VR.toFixed(1) + ' V', canvasWidth - 10, drawHeight + rows.vr + 9);
  }
}

function drawInfoCard(NA, ND, A, Vbi, VR, W, Cj) {
  const rows = controlRows();
  const cardY = drawHeight + rows.cardTop;
  const cardX = 10, cardW = canvasWidth - 20;
  const cardH = controlHeight - rows.cardTop - 8;

  fill(247, 249, 255); stroke(200, 215, 245); strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);

  noStroke(); fill(90, 62, 237); textStyle(BOLD); textSize(compact() ? 14 : 16);
  smlMathText(cardX + 14, cardY + 10, 'C_j = ' + (Cj * 1e12).toFixed(3) + ' pF', { size: compact() ? 14 : 16 });
  textStyle(NORMAL);
  fill(30);
  const sz = compact() ? 10.5 : 12;
  const lineH = compact() ? 20 : 19;
  let ly = cardY + 10 + (compact() ? 24 : 26);
  if (compact()) {
    smlMathText(cardX + 14, ly, 'N_A = ' + smlFormatConc(NA), { size: sz }); ly += lineH;
    smlMathText(cardX + 14, ly, 'N_D = ' + smlFormatConc(ND), { size: sz }); ly += lineH;
    smlMathText(cardX + 14, ly, 'A = ' + formatArea(A), { size: sz }); ly += lineH;
    smlMathText(cardX + 14, ly, 'V_bi = ' + Vbi.toFixed(3) + ' V     W = ' + (W * 1e4).toFixed(3) + ' μm', { size: sz }); ly += lineH;
    smlMathText(cardX + 14, ly, 'V_R = ' + VR.toFixed(1) + ' V', { size: sz }); ly += lineH;
  } else {
    smlMathText(cardX + 14, ly, 'N_A = ' + smlFormatConc(NA) + '      N_D = ' + smlFormatConc(ND) + '      A = ' + formatArea(A), { size: sz }); ly += lineH;
    smlMathText(cardX + 14, ly, 'V_bi = ' + Vbi.toFixed(3) + ' V      W = ' + (W * 1e4).toFixed(3) + ' μm      V_R = ' + VR.toFixed(1) + ' V', { size: sz }); ly += lineH;
  }
  fill(90); textSize(compact() ? 9.5 : 10.5);
  if (compact()) {
    smlMathText(cardX + 14, ly + 4, 'Reverse bias widens W and lowers C_j — the basis of', { size: compact() ? 9.5 : 10.5 }); ly += 14;
    smlMathText(cardX + 14, ly + 4, 'the varactor diode, an electronically-tunable capacitor.', { size: compact() ? 9.5 : 10.5 });
  } else {
    smlMathText(cardX + 14, ly + 4, 'Reverse bias widens W and lowers C_j — the basis of the varactor diode, an electronically-tunable capacitor.', { size: 10.5 });
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  minDrawHeight = compact() ? 620 : 420;
  // The info card now shows N_A, N_D, A, V_bi, W, and V_R (not just
  // C_j, V_bi, W, V_R), so it needs more vertical room than a single
  // summary line -- both budgets here were sized for the shorter card.
  controlHeight = compact() ? 420 : 270;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  drawHeight = Math.max(drawHeight, minDrawHeight);
}
