// Carrier Concentration and Fermi Level Explorer MicroSim
// Directly drags E_F through the band gap of a chosen material at a
// chosen temperature, and shows n0 = NC*exp(-(EC-EF)/kT) and
// p0 = NV*exp(-(EF-EV)/kT) responding on a band diagram (EC, EF, Ei, EV)
// and a pair of log-scale carrier gauges -- the forward direction from
// this chapter's own effective-density-of-states equations (as opposed
// to Chapter 10's doping-to-Fermi-level explorer, which goes the other
// way: doping -> n0 -> EF).
// Physics note: these formulas assume the non-degenerate (Boltzmann)
// approximation; once EF is dragged within 3kT of a band edge (or past
// it), the diagram flags the result as an estimate, matching the same
// non-degenerate/transition/degenerate convention Chapter 8's degenerate
// semiconductor explorer uses -- but driven directly by EF here instead
// of derived from doping.
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, tempSlider, efSlider;
const KB = 8.617e-5; // eV/K

function compact() { return canvasWidth < 480; }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  Object.keys(SML_MATERIALS).forEach(k => materialSelect.option(k));
  materialSelect.selected('Silicon');
  materialSelect.attribute('aria-label', 'Material selection');
  materialSelect.changed(function () { redraw(); });

  tempSlider = createSlider(150, 600, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');
  tempSlider.input(function () { redraw(); });

  // E_F - E_V, in eV; range covers all three materials' gaps plus a
  // margin on each side so the student can drag EF past either edge
  // into the degenerate regime.
  efSlider = createSlider(-0.15, 1.75, 0.56, 0.01);
  efSlider.attribute('aria-label', 'Fermi level position, E_F minus E_V, in eV');
  efSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Carrier concentration and Fermi level explorer: drag the Fermi level through the band gap of a chosen material and temperature and observe electron and hole concentration respond via the effective-density-of-states equations, with a warning when the non-degenerate approximation breaks down', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 90 : 130;
  const sw = min(canvasWidth - lbl - 30, 300);
  materialSelect.position(bx + lbl, by + drawHeight + 12);
  tempSlider.position(bx + lbl, by + drawHeight + 50); tempSlider.size(sw);
  efSlider.position(bx + lbl, by + drawHeight + 88); efSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1); line(0, drawHeight, canvasWidth, drawHeight);

  const mat = SML_MATERIALS[materialSelect.value()];
  const T = tempSlider.value();
  const kT = KB * T;
  const Eg = smlEgVarshni(mat, T);
  const Nc = smlEffDOS(mat.me, T), Nv = smlEffDOS(mat.mh, T);
  const Ei = Eg / 2 + (kT / 2) * Math.log(Nv / Nc); // measured from EV, matches Chapter 10's Ei formula

  const efFromEV = efSlider.value();
  const ecMinusEf = Eg - efFromEV;
  const efMinusEv = efFromEV;
  const n0 = Nc * Math.exp(-ecMinusEf / kT);
  const p0 = Nv * Math.exp(-efMinusEv / kT);

  const distToBand = Math.min(ecMinusEf, efMinusEv);
  const zone = distToBand > 3 * kT ? 'non' : (distToBand > 0 ? 'transition' : 'degenerate');

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 12.5 : 15);
  text('n₀ = N_C·e^(−(E_C−E_F)/kT)   |   p₀ = N_V·e^(−(E_F−E_V)/kT)', canvasWidth / 2, 8);

  const leftW = compact() ? canvasWidth : Math.round(canvasWidth * 0.44);
  drawBandDiagram(mat, T, Eg, Ei, efFromEV, zone, leftW);
  drawRightPanel(compact() ? 0 : leftW, compact() ? drawHeight * 0.54 : 0, compact() ? canvasWidth : canvasWidth - leftW, compact() ? drawHeight * 0.46 : drawHeight,
    mat, T, kT, Eg, Nc, Nv, n0, p0, ecMinusEf, efMinusEv, zone);

  fill(30); noStroke(); textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 13);
  text('Material:', 10, drawHeight + 12 + 11);
  text('Temperature:', 10, drawHeight + 50 + 11);
  text('E_F position:', 10, drawHeight + 88 + 11);
}

function drawBandDiagram(mat, T, Eg, Ei, efFromEV, zone, panelW) {
  const diagX0 = compact() ? 60 : 70, diagX1 = panelW - (compact() ? 60 : 90);
  const plotY0 = 40, plotY1 = (compact() ? drawHeight * 0.54 : drawHeight) - 46;
  const HEAD = 0.22;
  // energy axis measured "depth below EC": 0 at EC, Eg at EV.
  function eToPx(depthBelowEc) { return map(depthBelowEc, -HEAD, Eg + HEAD, plotY0, plotY1); }

  const ecDepth = 0, evDepth = Eg, eiDepth = Eg - Ei;
  const efDepth = Eg - efFromEV;

  noStroke();
  fill(90, 62, 237, 28);
  rect(diagX0, plotY0, diagX1 - diagX0, eToPx(ecDepth) - plotY0);
  fill(200, 90, 90, 28);
  rect(diagX0, eToPx(evDepth), diagX1 - diagX0, eToPx(Eg + HEAD) - eToPx(evDepth));

  const kT = KB * T;
  noStroke(); fill(255, 160, 60, 55);
  rect(diagX0, eToPx(3 * kT), diagX1 - diagX0, eToPx(0) - eToPx(3 * kT));
  rect(diagX0, eToPx(evDepth), diagX1 - diagX0, eToPx(evDepth - 3 * kT) - eToPx(evDepth));

  stroke(90, 62, 237); strokeWeight(2.5);
  line(diagX0, eToPx(ecDepth), diagX1, eToPx(ecDepth));
  stroke(90, 180, 120); strokeWeight(1.5);
  drawingContext.setLineDash([3, 3]);
  line(diagX0, eToPx(eiDepth), diagX1, eToPx(eiDepth));
  drawingContext.setLineDash([]);
  stroke(200, 90, 90); strokeWeight(2.5);
  line(diagX0, eToPx(evDepth), diagX1, eToPx(evDepth));

  noStroke(); fill(90, 62, 237); textAlign(LEFT, BOTTOM); textSize(compact() ? 10.5 : 12);
  text('EC', diagX1 + 6, eToPx(ecDepth) + 4);
  fill(90, 150, 110); textAlign(LEFT, CENTER);
  text('Ei', diagX1 + 6, eToPx(eiDepth));
  fill(200, 90, 90); textAlign(LEFT, TOP);
  text('EV', diagX1 + 6, eToPx(evDepth) + 4);

  const efClamped = constrain(efDepth, -HEAD + 0.02, Eg + HEAD - 0.02);
  const zoneColor = zone === 'non' ? color(46, 125, 50) : (zone === 'transition' ? color(200, 140, 20) : color(200, 30, 30));
  stroke(zoneColor); strokeWeight(2.6);
  if (zone === 'degenerate') drawingContext.setLineDash([6, 4]); else drawingContext.setLineDash([]);
  line(diagX0, eToPx(efClamped), diagX1, eToPx(efClamped));
  drawingContext.setLineDash([]);
  noStroke(); fill(zoneColor); textAlign(LEFT, efDepth < 0 ? TOP : (efDepth > Eg ? BOTTOM : CENTER)); textSize(compact() ? 10.5 : 12);
  text('EF' + (zone === 'degenerate' ? ' (estimate)' : ''), diagX1 + 6, eToPx(efClamped));

  // draggable handle on the EF line for discoverability
  noStroke(); fill(zoneColor);
  circle(diagX0 - 10, eToPx(efClamped), 10);
}

function drawRightPanel(panelX, panelY, panelW, panelH, mat, T, kT, Eg, Nc, Nv, n0, p0, ecMinusEf, efMinusEv, zone) {
  const gaugeTop = panelY + (compact() ? 30 : 38);
  drawLogGauge(panelX + 16, gaugeTop, panelW - 32, 'n₀ (electrons)', n0, color(90, 62, 237));
  drawLogGauge(panelX + 16, gaugeTop + (compact() ? 46 : 52), panelW - 32, 'p₀ (holes)', p0, color(200, 90, 40));

  const badgeY = gaugeTop + (compact() ? 100 : 114);
  const info = {
    non: { name: 'NON-DEGENERATE', bg: color(222, 245, 225), bd: color(46, 125, 50), tx: color(30, 100, 40) },
    transition: { name: 'APPROACHING DEGENERATE', bg: color(255, 240, 210), bd: color(200, 140, 20), tx: color(150, 100, 10) },
    degenerate: { name: 'DEGENERATE — ESTIMATE ONLY', bg: color(255, 220, 220), bd: color(200, 30, 30), tx: color(180, 20, 20) }
  }[zone];
  noStroke(); fill(info.bg); stroke(info.bd); strokeWeight(1.5);
  rect(panelX + 16, badgeY, panelW - 32, compact() ? 24 : 26, 6);
  noStroke(); fill(info.tx); textAlign(CENTER, CENTER); textSize(compact() ? 11 : 13);
  text(info.name, panelX + panelW / 2, badgeY + (compact() ? 12 : 13));

  const readY = badgeY + (compact() ? 32 : 36);
  fill('#333'); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11.5);
  const lines = [
    'E_C − E_F = ' + ecMinusEf.toFixed(3) + ' eV   |   E_F − E_V = ' + efMinusEv.toFixed(3) + ' eV   |   k_BT = ' + kT.toFixed(4) + ' eV',
    'n₀ = ' + smlFormatConc(n0) + '   |   p₀ = ' + smlFormatConc(p0),
    'n₀·p₀ = ' + (n0 * p0).toExponential(2) + ' cm⁻⁶   (check: nᵢ² = ' + (smlNi(mat, T) * smlNi(mat, T)).toExponential(2) + ' cm⁻⁶)'
  ];
  for (let i = 0; i < lines.length; i++) text(lines[i], panelX + 16, readY + i * (compact() ? 16 : 18), panelW - 32);

  let nextY = readY + lines.length * (compact() ? 16 : 18) + 10;
  if (zone !== 'non') {
    // smlDrawInfoBox centers its box within [0, "canvasWidth"], so pass
    // 2*panelX+panelW (not just panelW) to center correctly within this
    // right-hand panel instead of within the whole canvas from x=0.
    smlDrawInfoBox(panelX * 2 + panelW, nextY, [
      zone === 'transition'
        ? 'E_F is within 3k_BT of a band edge -- the Boltzmann'
        : 'E_F has reached or crossed a band edge -- the',
      zone === 'transition'
        ? 'approximation is becoming inaccurate here.'
        : 'non-degenerate formula above is NO LONGER VALID.'
    ], { maxWidth: panelW - 40, margin: 20 });
    nextY += 44 + 12;
  }

  // Fill the rest of the panel with a n0(EF)/p0(EF) trend chart instead
  // of leaving it blank -- lets the student see the full sweep, not only
  // the single current point shown by the gauges above.
  const chartTop = nextY + 14;
  const chartBottom = panelY + panelH - 10;
  if (chartBottom - chartTop > 80) {
    drawTrendChart(mat, T, kT, Eg, panelX + 16, chartTop, panelW - 32, chartBottom - chartTop, efMinusEv);
  }
}

function drawTrendChart(mat, T, kT, Eg, x, y, w, h, currentEfMinusEv) {
  const Nc = smlEffDOS(mat.me, T), Nv = smlEffDOS(mat.mh, T);
  const ptsN = [], ptsP = [];
  for (let ef = 0; ef <= Eg; ef += Eg / 60) {
    ptsN.push({ x: ef, y: Math.log10(Nc * Math.exp(-(Eg - ef) / kT)) });
    ptsP.push({ x: ef, y: Math.log10(Nv * Math.exp(-ef / kT)) });
  }
  fill(60); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11);
  text('n₀ and p₀ across the full E_F sweep (E_V to E_C):', x, y - 14);
  smlDrawLineChart(x, y, w, h, 0, Eg, -4, 21, [
    { points: ptsN, color: color(90, 62, 237) },
    { points: ptsP, color: color(200, 90, 40) }
  ], {
    marker: { x: currentEfMinusEv, y: Math.log10(Nc * Math.exp(-(Eg - currentEfMinusEv) / kT)) },
    xLabel: 'E_F − E_V (eV)', yLabel: 'log₁₀ conc.', yLabelOffset: 30
  });
}

function drawLogGauge(x, y, w, label, value, col) {
  const EXP_MIN = 0, EXP_MAX = 21;
  const exp = Math.log10(Math.max(value, 1e-6));
  const frac = constrain((exp - EXP_MIN) / (EXP_MAX - EXP_MIN), 0, 1);
  fill(60); noStroke(); textAlign(LEFT, BOTTOM); textSize(compact() ? 10.5 : 11.5);
  text(label + ':  ' + smlFormatConc(value), x, y - 4);
  noStroke(); fill(230);
  rect(x, y, w, compact() ? 12 : 14, 4);
  noStroke(); fill(col);
  rect(x, y, w * frac, compact() ? 12 : 14, 4);
  stroke(180); strokeWeight(1); noFill();
  rect(x, y, w, compact() ? 12 : 14, 4);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 150 : 130;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 640);
}
