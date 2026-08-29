// Excess Carrier Generation & Recombination Explorer MicroSim
// Plots excess minority carrier concentration Δn(t) (and Δp(t), equal to
// Δn(t) under low-level-injection charge neutrality) rising toward a
// steady state under constant generation, and decaying exponentially
// once generation is turned off:
//   Generation ON  (t <= Ton):  Δn(t) = Δn_ss(1 - exp(-t/τ))
//   Generation OFF (t >  Ton):  Δn(t) = Δn(Ton) * exp(-(t-Ton)/τ)
// where the steady-state value is derived FORWARD from the generation
// rate and lifetime, as in the continuity equation: Δn_ss = G·τ.
// Generation ON/OFF is a real toggle the student clicks; when ON, the
// curve simply approaches steady state over the visible window. When
// OFF, an "off at" slider sets when generation stopped, and the decay
// phase is plotted from that point, with one lifetime τ marked on it.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 300;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let genSourceSelect, gExpSlider, tauSlider, nExpSlider, offAtSlider, tMarkerSlider;
let genOn = true; // generation currently on (true) or off (false)
let toggleBtnRect = null;

function compact() { return canvasWidth < 480; }

// Δn(t) given generation-off time Ton (Infinity if generation never turns off)
function dnOfT(t, Ton, tauS, dnss) {
  if (t <= Ton) return dnss * (1 - Math.exp(-t / tauS));
  const dnAtTon = dnss * (1 - Math.exp(-Ton / tauS));
  return dnAtTon * Math.exp(-(t - Ton) / tauS);
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
  genSourceSelect.attribute('aria-label', 'Generation source preset: sets a representative generation rate');
  genSourceSelect.changed(function () {
    const isOptical = genSourceSelect.value().indexOf('Optical') === 0;
    gExpSlider.value(isOptical ? 20 : 13);
    redraw();
  });

  gExpSlider = createSlider(12, 22, 20, 0.1);
  gExpSlider.attribute('aria-label', 'Generation rate G exponent, carriers per cubic centimeter per second');
  gExpSlider.input(function () { redraw(); });

  tauSlider = createSlider(0.1, 20, 5, 0.1);
  tauSlider.attribute('aria-label', 'Minority carrier lifetime in microseconds');
  tauSlider.input(function () { redraw(); });

  nExpSlider = createSlider(14, 19, 16, 0.1);
  nExpSlider.attribute('aria-label', 'Background majority doping concentration exponent, for reference only');
  nExpSlider.input(function () { redraw(); });

  offAtSlider = createSlider(0.5, 5, 2, 0.1);
  offAtSlider.attribute('aria-label', 'Time, in multiples of the lifetime, at which generation turns off');
  offAtSlider.input(function () { redraw(); });

  tMarkerSlider = createSlider(0, 100, 40, 1);
  tMarkerSlider.attribute('aria-label', 'Time marker percent of window');
  tMarkerSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Excess carrier generation and recombination explorer: plots excess electron and hole concentration rising under generation then, once a generation off/on toggle is switched off, decaying exponentially with the minority carrier lifetime, with one lifetime marked on the decay curve', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function rowY() {
  return { src: 10, g: 46, tau: 82, n: 118, toggle: 154, off: 196, t: 236 };
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 110 : 170;
  const sw = min(canvasWidth - lbl - 30, 300);
  const rows = rowY();

  genSourceSelect.position(bx + lbl, by + drawHeight + rows.src - 2);
  genSourceSelect.size(sw);
  gExpSlider.position(bx + lbl, by + drawHeight + rows.g);
  gExpSlider.size(sw);
  tauSlider.position(bx + lbl, by + drawHeight + rows.tau);
  tauSlider.size(sw);
  nExpSlider.position(bx + lbl, by + drawHeight + rows.n);
  nExpSlider.size(sw);

  offAtSlider.position(bx + lbl, by + drawHeight + rows.off);
  offAtSlider.size(sw);
  tMarkerSlider.position(bx + lbl, by + drawHeight + rows.t);
  tMarkerSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const tauUs = tauSlider.value();
  const tauS = tauUs * 1e-6;
  const G = Math.pow(10, gExpSlider.value()); // cm^-3 s^-1
  const dnss = G * tauS;                      // Δn_ss = G·τ, derived forward
  const N = Math.pow(10, nExpSlider.value());
  const offAtTau = offAtSlider.value();

  const TonUs = genOn ? Infinity : offAtTau * tauUs;
  const TtotalUs = genOn ? 5 * tauUs : offAtTau * tauUs + 5 * tauUs;
  const tMarkerUs = (tMarkerSlider.value() / 100) * TtotalUs;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13.5 : 16);
  text('Excess Carrier Concentration Δn(t), Δp(t)', canvasWidth / 2, 8);
  textAlign(CENTER, TOP); textSize(11); fill(80);
  text('Δn_ss = G·τ = ' + dnss.toExponential(2) + ' cm⁻³   (G = ' + G.toExponential(2) + ' cm⁻³s⁻¹, τ = ' + tauUs.toFixed(1) + ' μs)', canvasWidth / 2, 30);

  const chartX = 78, chartY = 52, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 108;

  const pts = [];
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * TtotalUs;
    pts.push({ x: t, y: dnOfT(t, TonUs, tauS, dnss) });
  }

  const chartInfo = smlDrawLineChart(chartX, chartY, chartW, chartH, 0, TtotalUs, 0, dnss * 1.15, [
    { points: pts, color: color(90, 62, 237) }
  ], {
    marker: { x: tMarkerUs, y: dnOfT(tMarkerUs, TonUs, tauS, dnss) },
    xLabel: 'Time (μs)', yLabel: 'Δn, Δp (cm⁻³)', yLabelOffset: compact() ? 46 : 60
  });

  // Δp(t): identical to Δn(t) under low-level-injection charge neutrality,
  // drawn as a dashed overlay so the equality itself is the visible point.
  stroke(230, 90, 60); strokeWeight(2);
  drawingContext.setLineDash([5, 4]);
  noFill();
  beginShape();
  for (const p of pts) vertex(chartInfo.xToPx(p.x), chartInfo.yToPx(p.y));
  endShape();
  drawingContext.setLineDash([]);

  noStroke(); textAlign(LEFT, TOP); textSize(11);
  fill(90, 62, 237); text('Δn(t)', chartX + 6, chartY + 4);
  fill(230, 90, 60); text('Δp(t)  (= Δn: charge neutrality)', chartX + 54, chartY + 4);

  if (!genOn) {
    const xOff = chartInfo.xToPx(TonUs);
    stroke(150); strokeWeight(1);
    drawingContext.setLineDash([3, 3]);
    line(xOff, chartY, xOff, chartY + chartH);
    drawingContext.setLineDash([]);
    noStroke(); fill(100); textAlign(CENTER, BOTTOM); textSize(11);
    text('generation off', xOff, chartY - 2);

    // Mark exactly one lifetime on the decay curve.
    const tTauUs = TonUs + tauUs;
    if (tTauUs <= TtotalUs) {
      const dnAtTon = dnss * (1 - Math.exp(-TonUs / tauS));
      const dnAtTau = dnAtTon / Math.E;
      const xTau = chartInfo.xToPx(tTauUs), yTau = chartInfo.yToPx(dnAtTau);
      stroke(20, 140, 80); strokeWeight(1.5);
      drawingContext.setLineDash([2, 3]);
      line(xTau, chartY, xTau, chartY + chartH);
      drawingContext.setLineDash([]);
      noStroke(); fill(20, 110, 60); circle(xTau, yTau, 7);
      textAlign(LEFT, BOTTOM); textSize(compact() ? 10 : 11);
      text('one lifetime τ later: Δn ≈ Δn₀/e ≈ ' + (dnAtTau).toExponential(1) + ' cm⁻³ (37% left)', min(xTau + 6, chartX + chartW - 210), yTau - 4);
    }
  } else {
    noStroke(); fill(100); textAlign(CENTER, BOTTOM); textSize(11);
    text('generation ON — approaching steady state', canvasWidth / 2, chartY - 2);
  }

  // Toggle button
  const rows = rowY();
  const btnX = compact() ? 10 : (170), btnY = drawHeight + rows.toggle, btnW = compact() ? canvasWidth - 20 : 220, btnH = 30;
  smlDrawButton(btnX, btnY, btnW, btnH, genOn ? 'Turn Generation OFF' : 'Turn Generation ON', genOn);
  toggleBtnRect = { x: btnX, y: btnY, w: btnW, h: btnH };

  fill(30); noStroke(); textAlign(LEFT, CENTER); textSize(compact() ? 11 : 13);
  text('Source:', 10, drawHeight + rows.src + 9);
  text('G (generation rate):', 10, drawHeight + rows.g + 9);
  text('τ (lifetime):', 10, drawHeight + rows.tau + 9);
  text('N (background doping, ref.):', 10, drawHeight + rows.n + 9);
  if (!genOn) text('Turns off at:', 10, drawHeight + rows.off + 9);
  text('Time marker:', 10, drawHeight + rows.t + 9);
  textAlign(RIGHT, CENTER);
  text(smlFormatPow10(gExpSlider.value()) + ' cm⁻³s⁻¹', canvasWidth - 10, drawHeight + rows.g + 9);
  text(tauUs.toFixed(1) + ' μs', canvasWidth - 10, drawHeight + rows.tau + 9);
  text(smlFormatPow10(nExpSlider.value()) + ' cm⁻³', canvasWidth - 10, drawHeight + rows.n + 9);
  text(tMarkerUs.toFixed(2) + ' μs', canvasWidth - 10, drawHeight + rows.t + 9);
  if (!genOn) text(offAtTau.toFixed(1) + ' τ', canvasWidth - 10, drawHeight + rows.off + 9);

  const dnMark = dnOfT(tMarkerUs, TonUs, tauS, dnss);
  const Rmark = dnMark / tauS;
  const injectionRatio = dnMark / N;
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 10.5 : 12);
  const readY = drawHeight + rows.t + 34;
  text('At t = ' + tMarkerUs.toFixed(2) + ' μs:  Δn = Δp ≈ ' + dnMark.toExponential(2) + ' cm⁻³   R = Δn/τ ≈ ' + Rmark.toExponential(2) + ' cm⁻³s⁻¹   Δn/N ≈ ' + injectionRatio.toExponential(2) + ' (injection level, next section)',
    10, readY, canvasWidth - 20);
}

function mousePressed() {
  if (toggleBtnRect && smlPointInRect(mouseX, mouseY, toggleBtnRect.x, toggleBtnRect.y, toggleBtnRect.w, toggleBtnRect.h)) {
    genOn = !genOn;
    redraw();
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 350 : 320;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
}
