// Built-In Potential Calculator MicroSim
// Computes Vbi = (kT/q)*ln(NA*ND/ni(T)^2) for a chosen material and doping
// concentrations, with ni(T) computed from each material's 300K value and
// band gap using the standard ni(T) ~ T^1.5 * exp(-Eg/2kT) scaling. Draws
// a simple equilibrium band-bending diagram with a qVbi bracket.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 190;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, naSlider, ndSlider, tSlider;

const K_EV = 8.617e-5; // eV/K
const MATERIALS = {
  'Silicon (Si)': { ni300: 1.5e10, Eg: 1.12 },
  'Germanium (Ge)': { ni300: 2.4e13, Eg: 0.66 },
  'Gallium Arsenide (GaAs)': { ni300: 2.1e6, Eg: 1.42 }
};

function niAtT(mat, T) {
  const ratio = T / 300;
  const exponent = (mat.Eg / (2 * K_EV)) * (1 / 300 - 1 / T);
  return mat.ni300 * Math.pow(ratio, 1.5) * Math.exp(exponent);
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  Object.keys(MATERIALS).forEach(k => materialSelect.option(k));
  materialSelect.selected('Silicon (Si)');
  materialSelect.attribute('aria-label', 'Semiconductor material');

  naSlider = createSlider(14, 19, 17, 0.1);
  naSlider.attribute('aria-label', 'Acceptor doping concentration exponent NA');
  ndSlider = createSlider(14, 19, 16, 0.1);
  ndSlider.attribute('aria-label', 'Donor doping concentration exponent ND');
  tSlider = createSlider(250, 450, 300, 5);
  tSlider.attribute('aria-label', 'Temperature in kelvin');

  positionUIElements();
  describe('Built-in potential calculator: computes the equilibrium built-in potential of a p-n junction from doping concentrations, material, and temperature, with an equilibrium band diagram', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  materialSelect.position(bx + 150, by + drawHeight + 12);
  naSlider.position(bx + 150, by + drawHeight + 50);
  naSlider.size(min(canvasWidth - 170 - 30, 320));
  ndSlider.position(bx + 150, by + drawHeight + 88);
  ndSlider.size(min(canvasWidth - 170 - 30, 320));
  tSlider.position(bx + 150, by + drawHeight + 126);
  tSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const mat = MATERIALS[materialSelect.value()];
  const NA = Math.pow(10, naSlider.value());
  const ND = Math.pow(10, ndSlider.value());
  const T = tSlider.value();
  const ni = niAtT(mat, T);
  const kT_q = K_EV * T;
  const Vbi = kT_q * Math.log((NA * ND) / (ni * ni));

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('V_bi = (kT/q)·ln(NA·ND / ni²)', canvasWidth / 2, 8);

  drawBandDiagram(Vbi);
  drawResultCard(NA, ND, T, ni, kT_q, Vbi);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Material:', 10, drawHeight + 18);
  text('NA = 10^' + naSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 56);
  text('ND = 10^' + ndSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 94);
  text('T = ' + T + ' K', 10, drawHeight + 132);
}

function drawBandDiagram(Vbi) {
  const x0 = 40, x1 = canvasWidth * 0.56, chartY = 44, chartH = drawHeight - 130;
  const midX = (x0 + x1) / 2;
  const bendMaxV = 1.4;
  const bandGapPx = chartH * 0.42;
  const bendPx = map(constrain(Vbi, 0, bendMaxV), 0, bendMaxV, 0, chartH * 0.5);

  noFill(); stroke(210); strokeWeight(1);
  rect(x0 - 10, chartY - 6, x1 - x0 + 20, chartH + 12, 6);

  const ecFlatN = chartY + chartH * 0.5 - bandGapPx / 2 - bendPx;
  const evFlatN = ecFlatN + bandGapPx;
  const ecFlatP = chartY + chartH * 0.5 - bandGapPx / 2 + bendPx;
  const evFlatP = ecFlatP + bandGapPx;

  function bandCurve(yLeft, yRight) {
    beginShape();
    vertex(x0, yLeft);
    vertex(midX - 24, yLeft);
    bezierVertex(midX - 8, yLeft, midX - 8, yRight, midX + 8, yRight);
    vertex(x1, yRight);
    endShape();
  }

  stroke(90, 62, 237); strokeWeight(2.5); noFill();
  bandCurve(ecFlatP, ecFlatN);
  stroke(90, 180, 120);
  bandCurve(evFlatP, evFlatN);

  noStroke(); fill(90, 62, 237); textAlign(LEFT, BOTTOM); textSize(11);
  text('EC', x1 + 6, ecFlatN + 4);
  fill(90, 180, 120);
  text('EV', x1 + 6, evFlatN + 4);

  stroke(200); strokeWeight(1);
  drawingContext.setLineDash([2, 3]);
  line(x0, chartY - 2, x0, chartY + chartH + 4);
  line(x1, chartY - 2, x1, chartY + chartH + 4);
  drawingContext.setLineDash([]);

  noStroke(); fill(190, 40, 40); textAlign(CENTER, TOP); textSize(11); textStyle(BOLD);
  text('p-side (neutral)', x0, chartY + chartH + 8);
  fill(40, 40, 190);
  text('n-side (neutral)', x1, chartY + chartH + 8);
  textStyle(NORMAL);

  const bx = midX;
  stroke(230, 150, 30); strokeWeight(1.5);
  line(bx - 34, ecFlatP, bx - 34, ecFlatN);
  noStroke(); fill(230, 150, 30);
  triangle(bx - 34, ecFlatP, bx - 38, ecFlatP + 6, bx - 30, ecFlatP + 6);
  triangle(bx - 34, ecFlatN, bx - 38, ecFlatN - 6, bx - 30, ecFlatN - 6);
  fill(200, 120, 10); textAlign(LEFT, CENTER); textSize(11); textStyle(BOLD);
  text('qV_bi', bx - 26, (ecFlatP + ecFlatN) / 2);
  textStyle(NORMAL);
}

function drawResultCard(NA, ND, T, ni, kT_q, Vbi) {
  const cardX = canvasWidth * 0.60, cardY = 44, cardW = canvasWidth - cardX - 24, cardH = drawHeight - 90;
  noStroke(); fill(240, 245, 255);
  stroke(168, 200, 255); strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke(); fill(90, 62, 237); textAlign(CENTER, TOP); textSize(15); textStyle(BOLD);
  text('V_bi = ' + Vbi.toFixed(3) + ' V', cardX + cardW / 2, cardY + 14);
  textStyle(NORMAL);
  fill(30); textAlign(LEFT, TOP); textSize(11.5);
  const lines = [
    'kT/q = ' + kT_q.toFixed(4) + ' V',
    'n_i(T) = ' + ni.toExponential(2) + ' cm⁻³',
    'NA·ND = ' + (NA * ND).toExponential(2),
    'NA·ND/n_i² = ' + ((NA * ND) / (ni * ni)).toExponential(2)
  ];
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cardX + 14, cardY + 48 + i * 22, cardW - 28);
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
