// Excess Carrier Generation & Recombination Explorer MicroSim
// Plots excess minority carrier concentration Δn(t) rising toward a
// steady state under constant generation, then decaying exponentially
// once generation stops, with time constant τ (minority carrier lifetime).
//   Rise (t <= Ton):  Δn(t) = Δn_ss(1 - exp(-t/τ))
//   Decay (t > Ton):  Δn(t) = Δn_ss * exp(-(t-Ton)/τ)
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 180;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let genSourceSelect, dnssExpSlider, tauSlider, tMarkerSlider;

function dnOfT(t, Ton, tauS, dnss) {
  if (t <= Ton) return dnss * (1 - Math.exp(-t / tauS));
  return dnss * Math.exp(-(t - Ton) / tauS);
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  genSourceSelect = createSelect();
  genSourceSelect.option('Optical Generation (light pulse)');
  genSourceSelect.option('Thermal Generation (background)');
  genSourceSelect.selected('Optical Generation (light pulse)');
  genSourceSelect.attribute('aria-label', 'Generation source');

  dnssExpSlider = createSlider(13, 17, 15, 0.1);
  dnssExpSlider.attribute('aria-label', 'Steady-state excess carrier concentration exponent');
  tauSlider = createSlider(0.1, 20, 5, 0.1);
  tauSlider.attribute('aria-label', 'Minority carrier lifetime in microseconds');
  tMarkerSlider = createSlider(0, 100, 40, 1);
  tMarkerSlider.attribute('aria-label', 'Time marker percent of window');

  positionUIElements();
  describe('Excess carrier generation and recombination explorer: plots excess carrier concentration rising under generation then decaying exponentially with the minority carrier lifetime', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  genSourceSelect.position(bx + 130, by + drawHeight + 12);
  dnssExpSlider.position(bx + 250, by + drawHeight + 50);
  dnssExpSlider.size(min(canvasWidth - 270 - 30, 300));
  tauSlider.position(bx + 250, by + drawHeight + 86);
  tauSlider.size(min(canvasWidth - 270 - 30, 300));
  tMarkerSlider.position(bx + 250, by + drawHeight + 122);
  tMarkerSlider.size(min(canvasWidth - 270 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const tauUs = tauSlider.value();
  const tauS = tauUs * 1e-6;
  const dnss = Math.pow(10, dnssExpSlider.value());
  const TonUs = 3 * tauUs;
  const TtotalUs = 8 * tauUs;
  const tMarkerUs = (tMarkerSlider.value() / 100) * TtotalUs;
  const G = dnss / tauS;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Excess Carrier Concentration Δn(t)', canvasWidth / 2, 8);

  const chartX = 78, chartY = 44, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 100;

  const ptsRise = [], ptsDecay = [];
  for (let t = 0; t <= TonUs; t += TonUs / 60) {
    ptsRise.push({ x: t, y: dnOfT(t * 1e-6, TonUs * 1e-6, tauS, dnss) });
  }
  for (let t = TonUs; t <= TtotalUs; t += (TtotalUs - TonUs) / 60) {
    ptsDecay.push({ x: t, y: dnOfT(t * 1e-6, TonUs * 1e-6, tauS, dnss) });
  }

  const chartInfo = smlDrawLineChart(chartX, chartY, chartW, chartH, 0, TtotalUs, 0, dnss * 1.1, [
    { points: ptsRise, color: color(90, 62, 237) },
    { points: ptsDecay, color: color(230, 90, 60) }
  ], {
    marker: { x: tMarkerUs, y: dnOfT(tMarkerUs * 1e-6, TonUs * 1e-6, tauS, dnss) },
    xLabel: 'Time (μs)', yLabel: 'Δn (cm⁻³)', yLabelOffset: 60
  });

  // "light off" dashed marker line
  const xOff = chartInfo.xToPx(TonUs);
  stroke(150); strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(xOff, chartY, xOff, chartY + chartH);
  drawingContext.setLineDash([]);
  noStroke(); fill(100); textAlign(CENTER, BOTTOM); textSize(11);
  text('generation stops', xOff, chartY - 2);

  const dnMark = dnOfT(tMarkerUs * 1e-6, TonUs * 1e-6, tauS, dnss);
  const Rmark = dnMark / tauS;

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Source:', 10, drawHeight + 18);
  text('Δn_ss = 10^' + dnssExpSlider.value().toFixed(1) + ' cm⁻³   G = Δn_ss/τ ≈ ' + G.toExponential(2) + ' cm⁻³s⁻¹', 10, drawHeight + 56);
  text('τ = ' + tauUs.toFixed(1) + ' μs (minority carrier lifetime)', 10, drawHeight + 92);
  text('t = ' + tMarkerUs.toFixed(2) + ' μs  →  Δn = ' + dnMark.toExponential(2) + ' cm⁻³,  R = Δn/τ ≈ ' + Rmark.toExponential(2) + ' cm⁻³s⁻¹', 10, drawHeight + 128);
  text('Purple: generation (rise) phase.  Red: recombination (decay) phase after generation stops.', 10, drawHeight + 152);
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
