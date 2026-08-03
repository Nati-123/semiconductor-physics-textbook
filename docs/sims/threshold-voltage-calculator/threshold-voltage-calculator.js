// Threshold Voltage Calculator MicroSim
// Computes VT = VFB + 2*phiF + Qdepmax/Cox for a p-substrate MOS
// capacitor from gate material, substrate doping, and oxide thickness,
// drawing a labeled waterfall bar showing each term's contribution.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
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
  describe('Threshold voltage calculator: computes MOS threshold voltage from gate material, substrate doping, and oxide thickness, with a labeled waterfall bar showing each term\'s contribution', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  gateSelect.position(bx + 150, by + drawHeight + 12);
  naSlider.position(bx + 150, by + drawHeight + 50);
  naSlider.size(min(canvasWidth - 170 - 30, 320));
  toxSlider.position(bx + 150, by + drawHeight + 88);
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

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15.5);
  text('V_T = V_FB + 2φF + Qdep,max/Cox', canvasWidth / 2, 8);

  drawWaterfall(VFB, 2 * phiF, term3, VT);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Gate:', 10, drawHeight + 18);
  text('NA = 10^' + naSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 56);
  text('tox = ' + toxSlider.value() + ' nm', 10, drawHeight + 94);
  textSize(11.5); fill(60);
  text('Cox=' + Cox.toExponential(2) + ' F/cm²   Qdep,max=' + Qdepmax.toExponential(2) + ' C/cm²   φF=' + phiF.toFixed(3) + ' V', 10, drawHeight + 132);
  textSize(13); textStyle(BOLD); fill(20);
  text('V_T = ' + VT.toFixed(3) + ' V', 10, drawHeight + 156);
  textStyle(NORMAL);
}

function drawWaterfall(vfb, twoPhiF, term3, vt) {
  const chartX = 60, chartY = 44, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;
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
    { label: 'VFB', value: vfb, color: color(220, 90, 60) },
    { label: '2φF', value: twoPhiF, color: color(90, 62, 237) },
    { label: 'Qdep/Cox', value: term3, color: color(40, 150, 90) }
  ];
  const n = segs.length;
  const barW = chartW / (n + 1.4);
  let cum = 0;
  let x = chartX + barW * 0.5;
  for (let i = 0; i < n; i++) {
    const y0 = yOf(cum), y1 = yOf(cum + segs[i].value);
    noStroke(); fill(segs[i].color);
    rect(x, min(y0, y1), barW, abs(y1 - y0));
    fill(30); textAlign(CENTER, TOP); textSize(10.5);
    text(segs[i].label, x + barW / 2, chartY + chartH + 6);
    fill(60); textSize(10);
    text(segs[i].value.toFixed(3), x + barW / 2, min(y0, y1) - 14);
    cum += segs[i].value;
    x += barW * 1.2;
  }
  const yFinal = yOf(vt);
  noStroke(); fill(20);
  rect(x, min(yFinal, zeroY), barW, abs(yFinal - zeroY));
  stroke(20); strokeWeight(1.5); noFill();
  rect(x, min(yFinal, zeroY), barW, abs(yFinal - zeroY));
  noStroke(); fill(20); textAlign(CENTER, TOP); textSize(11); textStyle(BOLD);
  text('VT', x + barW / 2, chartY + chartH + 6);
  text(vt.toFixed(3) + ' V', x + barW / 2, min(yFinal, zeroY) - 16);
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
