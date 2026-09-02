// Thermal Conductivity and Generation Rate Explorer MicroSim
// Two clearly-labeled, explicitly-linked panels sharing one temperature:
// Panel 1 (Thermal Conduction) computes the steady-state temperature
// rise dT = P*t/(kappa*A) across a slab of fixed thickness/area for a
// chosen power and material (thermal conductivity kappa). Panel 2
// (Thermal Generation Current) computes the thermal generation current
// Igen = q*(ni(T)/tau0)*W*A in a diode depletion region -- using the
// shared library's T-dependent intrinsic-carrier model smlNi(), so
// raising the SAME temperature T that panel 1 conducts away directly
// grows the leakage current here -- and compares it on a log-scale bar
// chart (with real decade tick labels) against a fixed reference
// diffusion-based I0 (from a Chapter 15 example).
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 490;
let controlHeight = 228;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let pSlider, kappaSelect, tempSlider, tau0Slider, wSlider;

const Q = 1.602e-19;
const I0_DIFFUSION = 1.34e-13; // A, reference from Chapter 15 example
const A_DIODE = 1e-2; // cm^2
const KAPPAS = { 'Silicon (150 W/m·K)': 150, 'GaAs (55 W/m·K)': 55, 'SiC (490 W/m·K)': 490 };
const T_SLAB = 5e-4, A_SLAB = 1e-6; // m (500 um thick, 1 mm^2)

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  pSlider = createSlider(0.1, 5, 1, 0.1);
  pSlider.attribute('aria-label', 'Power dissipation in watts');
  kappaSelect = createSelect();
  Object.keys(KAPPAS).forEach(k => kappaSelect.option(k));
  kappaSelect.selected('Silicon (150 W/m·K)');
  kappaSelect.attribute('aria-label', 'Substrate material thermal conductivity');

  tempSlider = createSlider(250, 450, 300, 5);
  tempSlider.attribute('aria-label', 'Device lattice temperature in kelvin, shared by both panels');

  tau0Slider = createSlider(0.1, 10, 1, 0.1);
  tau0Slider.attribute('aria-label', 'Generation lifetime in microseconds');
  wSlider = createSlider(0.1, 5, 1, 0.1);
  wSlider.attribute('aria-label', 'Depletion width in micrometers');

  positionUIElements();
  describe('Thermal conductivity and generation rate explorer: computes steady-state temperature rise across a slab and compares thermal generation current, which grows with the same shared temperature, to a reference diffusion current', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  pSlider.position(bx + 170, by + drawHeight + 12);
  pSlider.size(min(canvasWidth - 190 - 30, 300));
  kappaSelect.position(bx + 170, by + drawHeight + 50);
  tempSlider.position(bx + 170, by + drawHeight + 88);
  tempSlider.size(min(canvasWidth - 190 - 30, 300));
  tau0Slider.position(bx + 170, by + drawHeight + 126);
  tau0Slider.size(min(canvasWidth - 190 - 30, 300));
  wSlider.position(bx + 170, by + drawHeight + 164);
  wSlider.size(min(canvasWidth - 190 - 30, 300));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const P = pSlider.value();
  const kappa = KAPPAS[kappaSelect.value()];
  const T = tempSlider.value();
  const dT = (P * T_SLAB) / (kappa * A_SLAB);

  const tau0 = tau0Slider.value() * 1e-6;
  const WUm = wSlider.value();
  const Wcm = WUm * 1e-4;
  const ni = smlNi(SML_MATERIALS['Silicon'], T); // cm^-3, T-dependent
  const Gth = ni / tau0;
  const Igen = Q * Gth * Wcm * A_DIODE;

  const panelGap = 48;
  const halfH = (drawHeight - panelGap) / 2;
  drawThermalPanel(0, 0, canvasWidth, halfH, P, kappa, dT, T);
  drawLinkBand(0, halfH, canvasWidth, panelGap, T);
  drawGenerationPanel(0, halfH + panelGap, canvasWidth, halfH, Igen, ni, T);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12);
  text('P (W):', 10, drawHeight + 18);
  text('Material:', 10, drawHeight + 56);
  text('Shared T (K):', 10, drawHeight + 94);
  text('τ0 (μs):', 10, drawHeight + 132);
  text('W (μm):', 10, drawHeight + 170);
  textSize(10.5); fill(80);
  text('P=' + P.toFixed(1) + 'W  κ=' + kappa + 'W/mK  T=' + T + 'K  →  ΔT=' + dT.toFixed(2) + ' K     n_i(T)=' + ni.toExponential(2) + ' cm⁻³  τ0=' + (tau0 * 1e6).toFixed(1) + 'μs  W=' + WUm.toFixed(1) + 'μm  →  I_gen=' + Igen.toExponential(2) + ' A', 10, drawHeight + 194, canvasWidth - 20);
}

function drawThermalPanel(x, y, w, h, P, kappa, dT, T) {
  noStroke(); fill(235, 240, 250);
  rect(x + 6, y + 2, w - 12, h - 6, 6);
  // Title pushed clear of the fixed top-right fullscreen button (this is
  // the top-of-canvas panel, so it needs the same vertical clearance the
  // main title gets in every other Chapter 17 MicroSim). NOTE: p5's
  // text(str,x,y,w) uses x as the wrap box's LEFT edge even under CENTER
  // align, so a centered wrapped box needs x = center - boxW/2.
  const titleBoxW = w - 40;
  noStroke(); fill(20); textAlign(CENTER, TOP); textSize(13); textStyle(BOLD);
  text('Panel 1 — Thermal Conduction', x + w / 2 - titleBoxW / 2, y + 28, titleBoxW);
  textStyle(NORMAL); fill(70); textSize(10);
  text('ΔT = P·t / (κ·A)   —  1D steady-state Fourier conduction across a slab of fixed thickness t and cross-section A', x + w / 2 - titleBoxW / 2, y + 48, titleBoxW);

  const slabX = x + w * 0.30, slabY = y + 78, slabW = w * 0.16, slabH = h - 116;
  noStroke(); fill(200, 210, 230);
  rect(slabX, slabY, slabW, slabH);
  stroke(120); strokeWeight(1); noFill();
  rect(slabX, slabY, slabW, slabH);
  noStroke(); fill(60); textAlign(CENTER, TOP); textSize(10);
  text('slab: t = 500 μm\nA = 1 mm²', slabX + slabW / 2, slabY + slabH + 6);

  stroke(230, 90, 60); strokeWeight(2.5);
  const nArrows = 4;
  for (let i = 0; i < nArrows; i++) {
    const ay = slabY + (i + 0.5) * slabH / nArrows;
    line(slabX - 30, ay, slabX - 4, ay);
    noStroke(); fill(230, 90, 60);
    triangle(slabX - 4, ay - 5, slabX - 4, ay + 5, slabX + 4, ay);
    stroke(230, 90, 60); strokeWeight(2.5);
  }
  noStroke(); fill(230, 90, 60); textAlign(CENTER, BOTTOM); textSize(10.5);
  text('heat, P', slabX - 20, slabY - 6);

  const cardX = x + w * 0.58, cardY = y + 74, cardW = w * 0.38, cardH = h - 108;
  noStroke(); fill(240, 245, 255);
  stroke(168, 200, 255); strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 8);
  noStroke(); fill(90, 62, 237); textAlign(CENTER, TOP); textSize(16); textStyle(BOLD);
  text('ΔT = ' + dT.toFixed(2) + ' K', cardX + cardW / 2, cardY + 14);
  textStyle(NORMAL);
  const s = constrain(cardH / 118, 0.55, 1);
  const lineH = constrain(14 * s, 10, 14);
  const fs = constrain(10.5 * s, 8, 10.5);
  fill(30); textAlign(LEFT, TOP); textSize(fs); noStroke();
  // Deliberately short, individually-fitting lines (no reliance on
  // auto-wrap) so no line's own wrap can collide with the next line's
  // fixed y position, which is what broke this card at narrow widths.
  text('P = ' + P.toFixed(1) + ' W', cardX + 14, cardY + 38);
  text('κ = ' + kappa + ' W/(m·K)', cardX + 14, cardY + 38 + lineH);
  text('ambient T = ' + T + ' K', cardX + 14, cardY + 38 + lineH * 2);
  fill(110); textSize(constrain(fs - 1, 7, 9.5));
  text('boundary: fixed cold face, all P through slab', cardX + 14, cardY + 38 + lineH * 3 + 6, cardW - 28);
}

function drawLinkBand(x, y, w, h, T) {
  const iconY = y + 4, iconH = 18;
  stroke(210); strokeWeight(1);
  line(20, iconY + iconH / 2, x + w * 0.42, iconY + iconH / 2);
  line(x + w * 0.58 + 90, iconY + iconH / 2, w - 20, iconY + iconH / 2);
  smlDrawThermometer(x + w * 0.5 - 7, iconY, 14, iconH, constrain(map(T, 250, 450, 0.05, 0.95), 0, 1), '');

  // Text sits BELOW the connector/thermometer row (not centered on top of
  // it) so the icon never overlaps the wrapped sentence. NOTE: p5's
  // text(str,x,y,w) uses x as the wrap-box's LEFT edge even under CENTER
  // align, so a centered box needs x = center - boxW/2.
  noStroke(); fill(90); textAlign(CENTER, TOP); textSize(10.5);
  const linkBoxW = w - 40;
  text('both panels share device temperature T = ' + T + ' K — heat conducted away in Panel 1 is set by the same T that drives thermally-generated leakage in Panel 2', x + w / 2 - linkBoxW / 2, iconY + iconH + 6, linkBoxW);
}

function drawGenerationPanel(x, y, w, h, Igen, ni, T) {
  noStroke(); fill(255, 245, 235);
  rect(x + 6, y + 2, w - 12, h - 6, 6);
  // NOTE: p5's text(str,x,y,w) uses x as the wrap box's LEFT edge even
  // under CENTER align, so a centered wrapped box needs x = center - boxW/2.
  const p2TitleBoxW = w - 40;
  noStroke(); fill(20); textAlign(CENTER, TOP); textSize(13); textStyle(BOLD);
  text('Panel 2 — Thermal Generation Current', x + w / 2 - p2TitleBoxW / 2, y + 10, p2TitleBoxW);
  textStyle(NORMAL); fill(70); textSize(10);
  text('G_th = n_i(T)/τ0   I_gen = q·G_th·W·A   —  n_i(T) rises steeply with the shared T above, so leakage worsens as the device heats up', x + w / 2 - p2TitleBoxW / 2, y + 30, p2TitleBoxW);

  // Bottom of panel is reserved for two lines of numeric readout below
  // smlDrawBarChart's own per-bar labels (drawn ~18px under the bars) --
  // chartH is sized to leave that space clear rather than overlap it.
  const captionH = 40;
  const chartX = x + 90, chartY = y + 62, chartW = w - 220, chartH = h - 102 - captionH;
  const logIgen = Math.log10(Igen);
  const logI0 = Math.log10(I0_DIFFUSION);
  const yMin = Math.floor(min(logI0, logIgen)) - 1, yMax = Math.ceil(max(logI0, logIgen)) + 1;

  drawLogAxisTicks(chartX, chartY, chartW, chartH, yMin, yMax);

  const series = [
    { label: 'I_gen', value: logIgen, color: color(230, 90, 60) },
    { label: 'I0 (diffusion)', value: logI0, color: color(90, 62, 237) }
  ];
  smlDrawBarChart(chartX, chartY, chartW, chartH, series.map(s => ({
    label: s.label, value: s.value - yMin, color: s.color
  })), yMax - yMin, { valueFormat: v => '' });

  const capY = chartY + chartH + 24; // clear of the bar-chart's own label row
  noStroke(); fill(30); textAlign(LEFT, TOP); textSize(10);
  text('I_gen = ' + Igen.toExponential(2) + ' A  (n_i = ' + ni.toExponential(2) + ' cm⁻³ at T=' + T + 'K)', chartX - 10, capY, w - 20);
  fill(90);
  text('I0 = ' + I0_DIFFUSION.toExponential(2) + ' A (fixed reference, room-T diffusion current)', chartX - 10, capY + 16, w - 20);
}

// Local helper: draws "10^n" decade gridlines/labels for a log-scale bar
// chart whose bars are already plotted in (value - yMin) space against a
// yMax-yMin total range. Kept local to this MicroSim (not added to the
// shared library) since it is specific to this chart's coordinate setup.
function drawLogAxisTicks(x, y, w, h, yMin, yMax) {
  push();
  textAlign(RIGHT, CENTER); textSize(9.5);
  for (let dec = Math.ceil(yMin); dec <= Math.floor(yMax); dec++) {
    const ty = map(dec, yMin, yMax, y + h, y);
    stroke(222); strokeWeight(1);
    line(x, ty, x + w, ty); // faint gridline spanning just the chart width
    stroke(150); strokeWeight(1);
    line(x - 5, ty, x, ty);
    noStroke(); fill(70);
    text('10' + smlSuperscript(dec), x - 8, ty);
  }
  pop();
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
