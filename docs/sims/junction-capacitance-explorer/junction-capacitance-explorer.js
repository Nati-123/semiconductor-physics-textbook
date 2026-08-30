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
  textAlign(CENTER, TOP); textSize(compact() ? 11.5 : 15);
  // x must be the wrap box's LEFT edge (not its center) once a width
  // is passed to text().
  text(compact() ? 'C_j = εA / W(V_R)' : 'C_j = εA / W(V_R),   W(V_R) = √[2ε(V_bi+V_R)/q · (1/N_A+1/N_D)]', 10, 8, canvasWidth - 20);

  const stacked = compact();
  if (stacked) {
    const splitY = 40 + (drawHeight - 40) * 0.52;
    drawCjCurve(NA, ND, Vbi, A, VR, Cj, 10, 40, canvasWidth - 20, splitY - 40 - 10);
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
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11.5);
  text('C_j vs. Reverse Bias V_R', chartX, chartY - 20);
  smlDrawLineChart(chartX, chartY, chartW, chartH - 20, 0, 10, 0, cjMax * 1.15,
    [{ points: pts, color: color(90, 62, 237) }],
    { marker: { x: VR, y: CjNow * 1e12 }, xLabel: 'V_R (V)', yLabel: 'C_j (pF)', yLabelOffset: compact() ? 32 : 40 });
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

function drawControlLabels(NA, ND, A, VR) {
  const rows = controlRows();
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 12 : 13);
  if (rows.stacked) {
    text('N_A = ' + NA.toExponential(1) + ' cm⁻³', 10, drawHeight + rows.na);
    text('N_D = ' + ND.toExponential(1) + ' cm⁻³', 10, drawHeight + rows.nd);
    text('A = ' + A.toExponential(1) + ' cm²', 10, drawHeight + rows.area);
    text('V_R = ' + VR.toFixed(1) + ' V', 10, drawHeight + rows.vr);
  } else {
    text('N_A', 10, drawHeight + rows.na + 9);
    text('N_D', 10, drawHeight + rows.nd + 9);
    text('Area A', 10, drawHeight + rows.area + 9);
    text('Reverse bias V_R', 10, drawHeight + rows.vr + 9);
    textAlign(RIGHT, TOP);
    text(NA.toExponential(1) + ' cm⁻³', canvasWidth - 10, drawHeight + rows.na + 9);
    text(ND.toExponential(1) + ' cm⁻³', canvasWidth - 10, drawHeight + rows.nd + 9);
    text(A.toExponential(1) + ' cm²', canvasWidth - 10, drawHeight + rows.area + 9);
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

  noStroke(); fill(90, 62, 237); textAlign(LEFT, TOP); textStyle(BOLD); textSize(compact() ? 14 : 16);
  text('C_j = ' + (Cj * 1e12).toFixed(3) + ' pF', cardX + 14, cardY + 10);
  textStyle(NORMAL);
  fill(30); textSize(compact() ? 10.5 : 12);
  text('V_bi = ' + Vbi.toFixed(3) + ' V      W = ' + (W * 1e4).toFixed(3) + ' μm      V_R = ' + VR.toFixed(1) + ' V',
    cardX + 14, cardY + 10 + (compact() ? 26 : 26), cardW - 28);
  fill(90); textSize(compact() ? 9.5 : 10.5);
  text('Reverse bias widens W and lowers C_j — the basis of the varactor diode, an electronically-tunable capacitor.',
    cardX + 14, cardY + 10 + (compact() ? 52 : 50), cardW - 28);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  minDrawHeight = compact() ? 620 : 420;
  // Compact mode needs extra room in the info card: its narrower width
  // wraps the "Reverse bias widens..." note onto two lines, which the
  // original budget here didn't leave space for (it clipped off the
  // bottom of the card).
  controlHeight = compact() ? 360 : 230;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  drawHeight = Math.max(drawHeight, minDrawHeight);
}
