// Bipolar Transistor and MOSFET Comparison Explorer MicroSim
// Left panel: BJT collector current IC = beta*IB, linear in IB (current-controlled).
// Right panel: MOSFET drain current ID = (mu_n*Cox/2)(W/L)(VGS-VT)^2,
// quadratic in gate overdrive voltage VOV = VGS-VT (voltage-controlled).
// Layout: charts, live numeric readouts, and slider controls occupy three
// clearly separated regions so calculated text never sits on top of a slider.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 780;
let drawHeight = 530;
let minDrawHeight = 530;
let controlHeight = 160;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let betaSlider, ibSlider, vovSlider, wlSlider;

// mu_n*Cox for an illustrative discrete/IC n-channel MOSFET (~104 uA/V^2,
// within the typical 50-200 uA/V^2 range), built from Chapter 16-style
// Cox (F/cm^2) and channel mobility (cm^2/V-s).
const COX = 1.73e-7;   // F/cm^2
const MU_N = 600;      // cm^2/V-s
const KP = MU_N * COX; // A/V^2 (= mu_n*Cox)

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  betaSlider = createSlider(20, 300, 100, 5);
  betaSlider.attribute('aria-label', 'BJT current gain beta');
  ibSlider = createSlider(1, 50, 10, 1);
  ibSlider.attribute('aria-label', 'BJT base current in microamps');
  vovSlider = createSlider(0.05, 1.5, 0.5, 0.01);
  vovSlider.attribute('aria-label', 'MOSFET gate overdrive voltage, VGS minus VT');
  wlSlider = createSlider(1, 30, 10, 1);
  wlSlider.attribute('aria-label', 'MOSFET width to length ratio');

  positionUIElements();
  describe('Bipolar transistor and MOSFET comparison explorer: shows BJT collector current scaling linearly with base current (current-controlled), and MOSFET drain current scaling quadratically with gate overdrive voltage (voltage-controlled), with a side-by-side comparison table', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const sw = min(canvasWidth - 190 - 20, 300);
  betaSlider.position(bx + 170, by + drawHeight + 12); betaSlider.size(sw);
  ibSlider.position(bx + 170, by + drawHeight + 48); ibSlider.size(sw);
  vovSlider.position(bx + 170, by + drawHeight + 84); vovSlider.size(sw);
  wlSlider.position(bx + 170, by + drawHeight + 120); wlSlider.size(sw);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const beta = betaSlider.value();
  const IB = ibSlider.value() * 1e-6;
  const IC = beta * IB;
  const IE = IC + IB;

  const Vov = vovSlider.value();
  const WL = wlSlider.value();
  const ID = (KP / 2) * WL * Vov * Vov;

  const halfW = canvasWidth / 2;
  const chartH = 190;
  const chartY = 46;

  drawBjtPanel(0, halfW, chartY, chartH, beta, IB, IC, IE);
  stroke(210); strokeWeight(1); line(halfW, 26, halfW, chartY + chartH + 96);
  drawMosfetPanel(halfW, halfW, chartY, chartH, Vov, WL, ID);

  const compTop = chartY + chartH + 118;
  drawComparisonPanel(20, compTop, canvasWidth - 40, drawHeight - compTop - 10, IB, beta, Vov, WL);

  // ---------- Controls: label + LIVE VALUE beside every slider ----------
  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12);
  text('β (current gain) = ' + beta, 10, drawHeight + 18);
  text('I_B (base current) = ' + ibSlider.value() + ' μA', 10, drawHeight + 54);
  text('V_OV = V_GS − V_T = ' + Vov.toFixed(2) + ' V', 10, drawHeight + 90);
  text('W/L (channel ratio) = ' + WL, 10, drawHeight + 126);
}

function drawBjtPanel(x, w, chartY, chartH, beta, IB, IC, IE) {
  noStroke(); fill(20); textAlign(CENTER, TOP); textSize(12.5); textStyle(BOLD);
  text('BJT (current-controlled)', x + w / 2, 8);
  textStyle(NORMAL); textSize(11);
  smlMathText(x + w / 2, 24, 'I_C = β·I_B      I_E = I_C + I_B', { align: 'center', size: 11.5 });

  const chartX = x + 58, chartW = w - 90;
  const yMaxRaw = beta * 50e-6 * 1000;
  const yTicks = niceTicks(0, yMaxRaw * 1.05, 5);
  const yMax = yTicks[yTicks.length - 1];
  const pts = [];
  for (let ib = 0; ib <= 50; ib += 1) pts.push({ x: ib, y: beta * ib * 1e-6 * 1000 });

  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 50, 0, yMax, [
    { points: pts, color: color(90, 62, 237) }
  ], {
    marker: { x: IB * 1e6, y: IC * 1000 },
    xTicks: [0, 10, 20, 30, 40, 50], xTickFormat: v => v.toFixed(0),
    yTicks: yTicks, yTickFormat: v => v.toFixed(v < 1 ? 2 : 1),
    yLabel: 'I_C (mA)', yLabelOffset: 40
  });
  noStroke(); fill(40); textAlign(CENTER, TOP); textSize(11);
  text('I_B (μA)', chartX + chartW / 2, chartY + chartH + 20);

  // ---------- Live values box (separate from chart and from sliders) ----------
  const boxY = chartY + chartH + 42;
  stroke(225); strokeWeight(1); noFill();
  rect(x + 16, boxY, w - 32, 62, 4);
  noStroke(); fill(20); textAlign(LEFT, TOP); textSize(10.5);
  text('Live values:', x + 24, boxY + 6);
  fill(70); textSize(10.5);
  text('β = ' + beta + '      I_B = ' + (IB * 1e6).toFixed(0) + ' μA', x + 24, boxY + 20);
  fill(40, 100, 190);
  text('I_C = β·I_B = ' + (IC * 1000).toFixed(3) + ' mA', x + 24, boxY + 34);
  text('I_E = I_C + I_B = ' + (IE * 1000).toFixed(3) + ' mA', x + 24, boxY + 47);
}

function drawMosfetPanel(x, w, chartY, chartH, Vov, WL, ID) {
  noStroke(); fill(20); textAlign(CENTER, TOP); textSize(12.5); textStyle(BOLD);
  text('MOSFET (voltage-controlled)', x + w / 2, 8);
  textStyle(NORMAL); textSize(11);
  smlMathText(x + w / 2, 24, 'I_D = ½μnCox(W/L)V_OV²', { align: 'center', size: 11.5 });

  const chartX = x + 58, chartW = w - 90;
  const yMaxRaw = (KP / 2) * 30 * 1.5 * 1.5 * 1000;
  const yTicks = niceTicks(0, yMaxRaw * 1.05, 5);
  const yMax = yTicks[yTicks.length - 1];
  const pts = [];
  for (let v = 0; v <= 1.5; v += 0.02) pts.push({ x: v, y: (KP / 2) * WL * v * v * 1000 });

  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, 1.5, 0, yMax, [
    { points: pts, color: color(230, 90, 60) }
  ], {
    marker: { x: Vov, y: ID * 1000 },
    xTicks: [0, 0.3, 0.6, 0.9, 1.2, 1.5], xTickFormat: v => v.toFixed(1),
    yTicks: yTicks, yTickFormat: v => v.toFixed(v < 1 ? 2 : 1),
    yLabel: 'I_D (mA)', yLabelOffset: 40
  });
  noStroke(); fill(40); textAlign(CENTER, TOP); textSize(11);
  text('V_OV = V_GS − V_T (V)', chartX + chartW / 2, chartY + chartH + 20);

  // ---------- Live values box (separate from chart and from sliders) ----------
  const boxY = chartY + chartH + 42;
  stroke(225); strokeWeight(1); noFill();
  rect(x + 16, boxY, w - 32, 62, 4);
  noStroke(); fill(20); textAlign(LEFT, TOP); textSize(10.5);
  text('Live values:', x + 24, boxY + 6);
  fill(70); textSize(10.5);
  text('V_OV = ' + Vov.toFixed(2) + ' V      W/L = ' + WL, x + 24, boxY + 20);
  text('μnCox = ' + (KP * 1e6).toFixed(0) + ' μA/V²', x + 24, boxY + 33);
  fill(210, 80, 40);
  text('I_D = ' + (ID * 1000).toFixed(4) + ' mA', x + 24, boxY + 47);
}

// Evenly spaced "nice" ticks spanning [0,hi] with roughly `n` steps.
function niceTicks(lo, hi, n) {
  if (hi <= lo) hi = lo + 1;
  const raw = (hi - lo) / n;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10) * mag;
  const start = Math.ceil(lo / step) * step;
  const ticks = [];
  for (let v = start; v <= hi + 1e-9; v += step) ticks.push(Math.round(v * 1000) / 1000);
  if (ticks.length < 2) ticks.push(start + step);
  return ticks;
}

// Compact BJT-vs-MOSFET comparison table making the current-controlled vs
// voltage-controlled distinction, and the linear-vs-quadratic scaling, explicit.
function drawComparisonPanel(x, y, w, h, IB, beta, Vov, WL) {
  stroke(200); strokeWeight(1); fill(250, 250, 255);
  rect(x, y, w, h, 6);

  noStroke(); fill(20); textAlign(LEFT, TOP); textSize(11.5); textStyle(BOLD);
  text('BJT vs. MOSFET', x + 10, y + 6);
  textStyle(NORMAL);

  const col0 = x + 10, col1 = x + w * 0.34, col2 = x + w * 0.67;
  const rowH = (h - 24) / 5;
  const rows = [
    ['', 'BJT', 'MOSFET'],
    ['Controlling variable', 'Base current I_B', 'Gate voltage V_GS (V_OV = V_GS−V_T)'],
    ['Input current', 'I_B > 0 (must be supplied)', '≈ 0 in the ideal DC model'],
    ['Output current law', 'I_C = β·I_B  (linear)', 'I_D = ½μnCox(W/L)V_OV²  (quadratic)'],
    ['Typical use', 'Current amplifier, BJT logic/RF', 'Analog/digital ICs, power switching']
  ];
  textSize(10.2);
  for (let r = 0; r < rows.length; r++) {
    const ry = y + 22 + r * rowH;
    if (r === 0) { fill(90, 62, 237); textStyle(BOLD); } else { fill(50); textStyle(NORMAL); }
    text(rows[r][0], col0, ry, col1 - col0 - 6);
    text(rows[r][1], col1, ry, col2 - col1 - 6);
    text(rows[r][2], col2, ry, x + w - col2 - 8);
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
