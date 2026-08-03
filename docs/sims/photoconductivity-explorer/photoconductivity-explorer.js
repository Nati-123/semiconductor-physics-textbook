// Photoconductivity Explorer MicroSim
// Computes excess carrier concentration Delta n = G*tau and the
// resulting photoconductivity increase Delta_sigma = q(Delta n * mu_n +
// Delta p * mu_p) for silicon, plotting Delta_sigma versus generation
// rate G on a log-log chart with a live marker, plus a simple
// illuminated-photoresistor schematic whose glow tracks Delta_sigma.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let gSlider, tauSlider;

const Q = 1.602e-19;
const MU_N = 1350, MU_P = 480; // cm^2/V-s, Si

function deltaSigma(G, tauS) {
  const dn = G * tauS;
  return Q * dn * (MU_N + MU_P);
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  gSlider = createSlider(15, 20, 19, 0.05);
  gSlider.attribute('aria-label', 'Generation rate exponent, base 10, in per cubic centimeter per second');
  tauSlider = createSlider(0.1, 10, 1, 0.1);
  tauSlider.attribute('aria-label', 'Minority carrier lifetime in microseconds');

  positionUIElements();
  describe('Photoconductivity explorer: computes excess carrier concentration and photoconductivity increase from generation rate and lifetime, with a live chart and illuminated photoresistor schematic', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  gSlider.position(bx + 150, by + drawHeight + 12);
  gSlider.size(min(canvasWidth - 170 - 30, 320));
  tauSlider.position(bx + 150, by + drawHeight + 50);
  tauSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const G = Math.pow(10, gSlider.value());
  const tauS = tauSlider.value() * 1e-6;
  const dn = G * tauS;
  const dSigma = deltaSigma(G, tauS);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15.5);
  text('Δσ = q(Δn·μn + Δp·μp),   Δn = Δp = G·τ', canvasWidth / 2, 8, canvasWidth - 20);

  const chartW = canvasWidth * 0.56;
  drawChart(G, tauS, chartW);
  drawPhotoresistor(chartW, dSigma);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12.5);
  text('G = 10^' + gSlider.value().toFixed(2) + ' cm⁻³s⁻¹   τ = ' + tauSlider.value().toFixed(1) + ' μs', 10, drawHeight + 18);
  text('Δn = Δp = ' + dn.toExponential(3) + ' cm⁻³', 10, drawHeight + 56);
  text('Δσ = ' + dSigma.toExponential(3) + ' S/cm', 10, drawHeight + 94);
}

function drawChart(G, tauS, chartW) {
  const chartX = 70, chartY = 40, chartH = drawHeight - 90;
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(11.5);
  text('Δσ vs. Generation Rate G (fixed τ)', chartX, chartY - 6);

  const pts = [];
  for (let logG = 15; logG <= 20; logG += 0.05) {
    const g = Math.pow(10, logG);
    pts.push({ x: logG, y: Math.log10(deltaSigma(g, tauS)) });
  }
  const info = smlDrawLineChart(chartX, chartY + 16, chartW - chartX - 20, chartH - 16, 15, 20, -8, 0, [
    { points: pts, color: color(230, 150, 30) }
  ], {
    marker: { x: gSlider.value(), y: Math.log10(deltaSigma(G, tauS)) },
    xLabel: 'log10 G (cm⁻³s⁻¹)', yLabel: 'log10 Δσ (S/cm)', yLabelOffset: 44
  });
}

function drawPhotoresistor(chartW, dSigma) {
  const px = chartW + 10, pw = canvasWidth - px - 20;
  const barY = 60, barH = drawHeight - 150;
  const glow = constrain(map(Math.log10(max(dSigma, 1e-8)), -6, -2, 0, 1), 0, 1);
  noStroke();
  fill(lerpColor(color(60, 60, 90), color(255, 210, 90), glow));
  rect(px, barY, pw, barH, 8);
  stroke(120); strokeWeight(1.5); noFill();
  rect(px, barY, pw, barH, 8);
  noStroke(); fill(30); textAlign(CENTER, TOP); textSize(11);
  text('illuminated Si bar', px + pw / 2, barY + barH + 8);
  fill(glow > 0.5 ? 30 : 220); textAlign(CENTER, CENTER); textSize(11);
  text('brighter = larger Δσ', px + pw / 2, barY + barH / 2);
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
