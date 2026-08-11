// Degenerate Semiconductor Explorer MicroSim
// Computes E_C - E_F = kT*ln(N_C(T)/N_D) (n-type) or E_F - E_V =
// kT*ln(N_V(T)/N_A) (p-type) and draws the resulting Fermi level on a
// schematic band diagram (E_C, E_i, E_V) alongside a doping gauge whose
// three live-computed zones -- non-degenerate, transition, degenerate --
// show exactly where the non-degenerate Boltzmann approximation this
// chapter otherwise relies on stops being valid.
// Physics note: once E_C-E_F (or E_F-E_V) drops to zero or below, E_F is
// AT or INSIDE the band, and the Boltzmann formula above is no longer a
// valid description of n0/p0 -- the diagram flags this explicitly and
// clamps the drawn E_F line rather than implying false precision; the
// exact treatment requires full Fermi-Dirac statistics (Chapter 9).
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 210;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let typeSelect, dopeSlider, tempSlider;

const KB = 8.617e-5; // eV/K
const NC_300 = 2.8e19, NV_300 = 1.04e19; // cm^-3, silicon at 300 K
const EG = 1.12; // eV, treated as T-independent for this sim's scope

function compact() { return canvasWidth < 480; }
function isN() { return typeSelect.value() === 'n-type (Donor, ND)'; }

function NCat(T) { return NC_300 * Math.pow(T / 300, 1.5); }
function NVat(T) { return NV_300 * Math.pow(T / 300, 1.5); }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  typeSelect = createSelect();
  typeSelect.option('n-type (Donor, ND)');
  typeSelect.option('p-type (Acceptor, NA)');
  typeSelect.attribute('aria-label', 'Semiconductor type');
  typeSelect.changed(function () { redraw(); });

  dopeSlider = createSlider(14, 21, 16, 0.05);
  dopeSlider.attribute('aria-label', 'Doping concentration exponent (power of 10, per cm cubed)');
  dopeSlider.input(function () { redraw(); });

  tempSlider = createSlider(150, 600, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');
  tempSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Degenerate semiconductor explorer: computes and draws the Fermi level position relative to the conduction or valence band edge as a function of doping concentration and temperature, with live non-degenerate/transition/degenerate zones and a warning when the Boltzmann approximation becomes invalid', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function controlX() { return compact() ? 130 : 190; }

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const cx = controlX();
  const sw = min(canvasWidth - cx - 40, 300);
  typeSelect.position(bx + cx, by + drawHeight + 12);
  dopeSlider.position(bx + cx, by + drawHeight + 50); dopeSlider.size(sw);
  tempSlider.position(bx + cx, by + drawHeight + 88); tempSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  const donor = isN();
  const Ndope = Math.pow(10, dopeSlider.value());
  const T = tempSlider.value();
  const kT = KB * T;
  const Nband = donor ? NCat(T) : NVat(T); // NC for n-type, NV for p-type
  const delta = kT * Math.log(Nband / Ndope); // EC-EF (n-type) or EF-EV (p-type)
  const zone = delta > 3 * kT ? 'non' : (delta > 0 ? 'transition' : 'degenerate');

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 12.5 : 15);
  text(donor ? 'EC − EF = kT·ln(NC(T)/ND)' : 'EF − EV = kT·ln(NV(T)/NA)', canvasWidth / 2, 8);

  const leftW = compact() ? canvasWidth : Math.round(canvasWidth * 0.46);
  drawBandDiagram(donor, delta, zone, leftW);
  drawRightPanel(compact() ? 0 : leftW, compact() ? drawHeight * 0.56 : 0, compact() ? canvasWidth : canvasWidth - leftW, compact() ? drawHeight * 0.44 : drawHeight, donor, Ndope, Nband, T, kT, delta, zone);

  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(compact() ? 11 : 13);
  text('Type:', controlX() - 10, drawHeight + 24);
  text((donor ? 'ND' : 'NA') + ': ' + smlFormatPow10(dopeSlider.value(), { noUnit: true }), controlX() - 10, drawHeight + 62);
  text('T: ' + T + ' K', controlX() - 10, drawHeight + 100);
}

function drawBandDiagram(donor, delta, zone, panelW) {
  const diagX0 = compact() ? 60 : 70, diagX1 = panelW - (compact() ? 60 : 90);
  const plotY0 = 40, plotY1 = (compact() ? drawHeight * 0.56 : drawHeight) - 46;
  // energy axis: 0 at EC (n-type ref) down to EG at EV; drawn with extra
  // headroom above EC so a degenerate EF can be shown INSIDE the band.
  const HEAD = 0.22;
  function eToPx(eV) { return map(eV, -HEAD, EG + 0.12, plotY0, plotY1); }

  const ecE = 0, evE = EG, eiE = EG / 2;

  // band fills
  noStroke();
  fill(90, 62, 237, 28);
  rect(diagX0, plotY0, diagX1 - diagX0, eToPx(ecE) - plotY0);
  fill(200, 90, 90, 28);
  rect(diagX0, eToPx(evE), diagX1 - diagX0, eToPx(EG + 0.12) - eToPx(evE));

  // degenerate-zone shading: within 3kT of the relevant band edge
  const kT = KB * tempSlider.value();
  noStroke(); fill(255, 160, 60, 55);
  if (donor) rect(diagX0, eToPx(3 * kT), diagX1 - diagX0, eToPx(0) - eToPx(3 * kT));
  else rect(diagX0, eToPx(evE), diagX1 - diagX0, eToPx(evE - 3 * kT) - eToPx(evE));

  stroke(90, 62, 237); strokeWeight(2.5);
  line(diagX0, eToPx(ecE), diagX1, eToPx(ecE));
  stroke(90, 180, 120); strokeWeight(1.5);
  drawingContext.setLineDash([3, 3]);
  line(diagX0, eToPx(eiE), diagX1, eToPx(eiE));
  drawingContext.setLineDash([]);
  stroke(200, 90, 90); strokeWeight(2.5);
  line(diagX0, eToPx(evE), diagX1, eToPx(evE));

  noStroke(); fill(90, 62, 237); textAlign(LEFT, BOTTOM); textSize(compact() ? 10.5 : 12);
  text('EC', diagX1 + 6, eToPx(ecE) + 4);
  fill(90, 150, 110); textAlign(LEFT, CENTER);
  text('Ei', diagX1 + 6, eToPx(eiE));
  fill(200, 90, 90); textAlign(LEFT, TOP);
  text('EV', diagX1 + 6, eToPx(evE) + 4);

  // EF position: for n-type, EF = EC - delta; for p-type, EF = EV - delta.
  // Clamp the DRAWN position so an extreme estimate never flies off the
  // diagram -- the readout/badge carry the "estimate only" warning instead
  // of implying a precise position once degenerate.
  // Coordinate convention here is "depth below EC" (ecE=0, evE=EG), so a
  // LARGER coordinate is a LOWER true energy. For n-type, delta = EC-EF
  // IS that depth directly (efE = delta): non-degenerate light doping
  // gives a large positive delta, correctly placing EF deep below EC. For
  // p-type, delta = EF-EV, so EF's depth below EC is EG-delta (evE-delta).
  const efE = donor ? delta : (evE - delta);
  const efClamped = constrain(efE, -HEAD + 0.02, EG + 0.10);
  const zoneColor = zone === 'non' ? color(46, 125, 50) : (zone === 'transition' ? color(200, 140, 20) : color(200, 30, 30));
  stroke(zoneColor); strokeWeight(2.2);
  if (zone === 'degenerate') drawingContext.setLineDash([6, 4]); else drawingContext.setLineDash([]);
  line(diagX0, eToPx(efClamped), diagX1, eToPx(efClamped));
  drawingContext.setLineDash([]);
  noStroke(); fill(zoneColor); textAlign(LEFT, efE < 0 ? TOP : (efE > EG ? BOTTOM : CENTER)); textSize(compact() ? 10.5 : 12);
  text('EF' + (zone === 'degenerate' ? ' (estimate)' : ''), diagX1 + 6, eToPx(efClamped));
}

function drawRightPanel(panelX, panelY, panelW, panelH, donor, Ndope, Nband, T, kT, delta, zone) {
  // doping gauge: log scale 10^14 .. 10^21 with live zone boundaries
  const gaugeY = panelY + (compact() ? 38 : 46);
  const gaugeX0 = panelX + 22, gaugeX1 = panelX + panelW - 22;
  const gaugeW = gaugeX1 - gaugeX0;
  const EXP_MIN = 14, EXP_MAX = 21;
  function expToPx(e) { return map(e, EXP_MIN, EXP_MAX, gaugeX0, gaugeX1); }

  const boundNonTrans = Math.log10(Nband / Math.exp(3)); // delta = 3kT
  const boundTransDeg = Math.log10(Nband);                // delta = 0

  fill(60); noStroke(); textAlign(CENTER, TOP); textSize(compact() ? 10 : 11.5);
  text('Doping level ' + (donor ? 'ND' : 'NA') + ' (log scale) — zones update live with T', panelX + panelW / 2, gaugeY - (compact() ? 16 : 18));

  noStroke();
  fill(200, 230, 205); rect(gaugeX0, gaugeY, expToPx(boundNonTrans) - gaugeX0, compact() ? 14 : 16);
  fill(255, 224, 178); rect(expToPx(boundNonTrans), gaugeY, expToPx(boundTransDeg) - expToPx(boundNonTrans), compact() ? 14 : 16);
  fill(255, 205, 205); rect(expToPx(boundTransDeg), gaugeY, gaugeX1 - expToPx(boundTransDeg), compact() ? 14 : 16);
  noFill(); stroke(180); strokeWeight(1);
  rect(gaugeX0, gaugeY, gaugeW, compact() ? 14 : 16);

  const markerX = constrain(expToPx(dopeSlider.value()), gaugeX0, gaugeX1);
  noStroke(); fill(30);
  triangle(markerX, gaugeY - 2, markerX - 6, gaugeY - 10, markerX + 6, gaugeY - 10);

  fill(90); textAlign(LEFT, TOP); textSize(compact() ? 8.5 : 9.5);
  text('10¹⁴', gaugeX0, gaugeY + (compact() ? 18 : 20));
  textAlign(RIGHT, TOP);
  text('10²¹', gaugeX1, gaugeY + (compact() ? 18 : 20));

  // region badge
  const badgeY = gaugeY + (compact() ? 42 : 48);
  const info = {
    non: { name: 'NON-DEGENERATE', bg: color(222, 245, 225), bd: color(46, 125, 50), tx: color(30, 100, 40) },
    transition: { name: 'APPROACHING DEGENERATE', bg: color(255, 240, 210), bd: color(200, 140, 20), tx: color(150, 100, 10) },
    degenerate: { name: 'DEGENERATE', bg: color(255, 220, 220), bd: color(200, 30, 30), tx: color(180, 20, 20) }
  }[zone];
  noStroke(); fill(info.bg); stroke(info.bd); strokeWeight(1.5);
  rect(panelX + 16, badgeY, panelW - 32, compact() ? 26 : 28, 6);
  noStroke(); fill(info.tx); textAlign(CENTER, CENTER); textSize(compact() ? 12 : 14);
  text(info.name, panelX + panelW / 2, badgeY + (compact() ? 13 : 14));

  // physics explanation / validity warning
  const explainY = badgeY + (compact() ? 32 : 36);
  let explain;
  if (zone === 'non') {
    explain = (donor ? 'EC − EF' : 'EF − EV') + ' = ' + delta.toFixed(3) + ' eV, well above 3kT (' + (3 * kT).toFixed(3) + ' eV). The non-degenerate Boltzmann approximation used in Chapters 9-10 is accurate here.';
  } else if (zone === 'transition') {
    explain = (donor ? 'EC − EF' : 'EF − EV') + ' = ' + delta.toFixed(3) + ' eV, within 3kT (' + (3 * kT).toFixed(3) + ' eV) of the band edge. The Boltzmann approximation is becoming inaccurate — treat this reading as approximate.';
  } else {
    explain = 'The formula now predicts ' + (donor ? 'EC − EF' : 'EF − EV') + ' = ' + delta.toFixed(3) + ' eV (≤ 0): EF has reached or entered the band. The non-degenerate Boltzmann approximation is NO LONGER VALID here — exact carrier statistics require the full Fermi-Dirac integral (Chapter 9), not this formula.';
  }
  fill(50); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11.5);
  text(explain, panelX + 16, explainY, panelW - 32, compact() ? 95 : 85);

  // numeric readout
  const readY = explainY + (compact() ? 100 : 92);
  fill('#333'); textAlign(LEFT, CENTER); textSize(compact() ? 10 : 11.5);
  text((donor ? 'EC − EF' : 'EF − EV') + ' ≈ ' + delta.toFixed(3) + ' eV   |   T = ' + T + ' K', panelX + 16, readY);
  text((donor ? 'NC' : 'NV') + '(T) = ' + smlFormatConc(Nband) + '   |   ' + (donor ? 'ND' : 'NA') + ' = ' + smlFormatConc(Ndope), panelX + 16, readY + (compact() ? 18 : 18));
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 250 : 210;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 660);
}
