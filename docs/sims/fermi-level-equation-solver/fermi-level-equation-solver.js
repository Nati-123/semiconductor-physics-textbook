// Fermi-Level Equation Visual Solver MicroSim
// An equation-practice tool (as opposed to the free-exploration sims
// elsewhere in this chapter): pick what is known -- doping, n0, or p0 --
// and the solver shows the equation being used, substitutes the current
// numbers into it step by step, and plots the result on a band diagram.
// The fourth direction, "given EF, find n0 and p0", is deliberately kept
// minimal here (a single-step substitution) and cross-linked to Chapter
// 9's Carrier Concentration and Fermi Level Explorer, which already
// covers that direction in depth with a continuous drag interaction and
// trend chart -- this sim's job is equation practice, not duplicating it.
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 480;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let modeSelect, materialSelect, tempSlider;
let ndExpSlider, naExpSlider, nExpSlider, pExpSlider, efSlider;
const KB = 8.617e-5;
const MODES = [
  'Given N_D, N_A → find E_F',
  'Given n₀ → find E_F',
  'Given p₀ → find E_F',
  'Given E_F → find n₀, p₀'
];

function compact() { return canvasWidth < 480; }
function concFromSlider(v) { return v < 0.3 ? 0 : Math.pow(10, v); }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  modeSelect = createSelect();
  MODES.forEach(m => modeSelect.option(m));
  modeSelect.selected(MODES[0]);
  modeSelect.attribute('aria-label', 'Solver mode: what is known and what to find');
  modeSelect.changed(function () { positionUIElements(); redraw(); });

  materialSelect = createSelect();
  Object.keys(SML_MATERIALS).forEach(k => materialSelect.option(k));
  materialSelect.selected('Silicon');
  materialSelect.attribute('aria-label', 'Material selection');
  materialSelect.changed(function () { redraw(); });

  tempSlider = createSlider(150, 600, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');
  tempSlider.input(function () { redraw(); });

  ndExpSlider = createSlider(0, 19, 16, 0.05);
  ndExpSlider.attribute('aria-label', 'Donor concentration exponent');
  ndExpSlider.input(function () { redraw(); });
  naExpSlider = createSlider(0, 19, 0, 0.05);
  naExpSlider.attribute('aria-label', 'Acceptor concentration exponent');
  naExpSlider.input(function () { redraw(); });

  nExpSlider = createSlider(0, 20, 16, 0.05);
  nExpSlider.attribute('aria-label', 'Given electron concentration exponent');
  nExpSlider.input(function () { redraw(); });

  pExpSlider = createSlider(0, 20, 16, 0.05);
  pExpSlider.attribute('aria-label', 'Given hole concentration exponent');
  pExpSlider.input(function () { redraw(); });

  efSlider = createSlider(-0.15, 1.75, 0.56, 0.01);
  efSlider.attribute('aria-label', 'Given Fermi level position, E_F minus E_V, in eV');
  efSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Fermi level equation visual solver: choose what is known (doping, electron concentration, hole concentration, or Fermi level) and see the corresponding equation substituted step by step and plotted on a band diagram', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function mode() { return modeSelect.value(); }

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 95 : 150;
  const sw = min(canvasWidth - lbl - 30, 300);
  modeSelect.position(bx + lbl, by + drawHeight + 12); modeSelect.size(sw);
  materialSelect.position(bx + lbl, by + drawHeight + 50);
  tempSlider.position(bx + lbl, by + drawHeight + 88); tempSlider.size(sw);

  const m = mode();
  ndExpSlider.position(bx + lbl, by + drawHeight + 126); ndExpSlider.size(sw);
  naExpSlider.position(bx + lbl, by + drawHeight + 164); naExpSlider.size(sw);
  nExpSlider.position(bx + lbl, by + drawHeight + 126); nExpSlider.size(sw);
  pExpSlider.position(bx + lbl, by + drawHeight + 126); pExpSlider.size(sw);
  efSlider.position(bx + lbl, by + drawHeight + 126); efSlider.size(sw);

  ndExpSlider.style('display', m === MODES[0] ? 'block' : 'none');
  naExpSlider.style('display', m === MODES[0] ? 'block' : 'none');
  nExpSlider.style('display', m === MODES[1] ? 'block' : 'none');
  pExpSlider.style('display', m === MODES[2] ? 'block' : 'none');
  efSlider.style('display', m === MODES[3] ? 'block' : 'none');
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
  const Nc = smlEffDOS(mat.me, T), Nv = smlEffDOS(mat.mh, T);
  const Eg = smlEgVarshni(mat, T);
  const ni = smlNi(mat, T);

  const m = mode();
  let n0, p0, ecMinusEf, efMinusEv, steps;

  if (m === MODES[0]) {
    const ND = concFromSlider(ndExpSlider.value()), NA = concFromSlider(naExpSlider.value());
    n0 = smlExactN0(ND, NA, ni); p0 = smlExactP0(ND, NA, ni);
    ecMinusEf = smlEcMinusEf(Nc, n0, kT); efMinusEv = Eg - ecMinusEf;
    steps = [
      'Given: N_D = ' + smlFormatConc(ND) + ',  N_A = ' + smlFormatConc(NA),
      '1) nᵢ = √(N_C·N_V)·e^(−Eg/2k_BT) = ' + smlFormatConc(ni),
      '2) n₀ = [(N_D−N_A) + √((N_D−N_A)²+4nᵢ²)] / 2 = ' + smlFormatConc(n0),
      '3) E_C − E_F = k_BT·ln(N_C/n₀) = (' + kT.toFixed(4) + ')·ln(' + Nc.toExponential(2) + '/' + n0.toExponential(2) + ') = ' + ecMinusEf.toFixed(3) + ' eV'
    ];
  } else if (m === MODES[1]) {
    n0 = concFromSlider(nExpSlider.value()) || 1e-6;
    p0 = (ni * ni) / n0;
    ecMinusEf = smlEcMinusEf(Nc, n0, kT); efMinusEv = Eg - ecMinusEf;
    steps = [
      'Given: n₀ = ' + smlFormatConc(n0),
      '1) E_C − E_F = k_BT·ln(N_C/n₀)',
      '2) = (' + kT.toFixed(4) + ')·ln(' + Nc.toExponential(2) + '/' + n0.toExponential(2) + ')',
      '3) = ' + ecMinusEf.toFixed(3) + ' eV     (so E_F − E_V = ' + efMinusEv.toFixed(3) + ' eV)'
    ];
  } else if (m === MODES[2]) {
    p0 = concFromSlider(pExpSlider.value()) || 1e-6;
    n0 = (ni * ni) / p0;
    efMinusEv = smlEfMinusEv(Nv, p0, kT); ecMinusEf = Eg - efMinusEv;
    steps = [
      'Given: p₀ = ' + smlFormatConc(p0),
      '1) E_F − E_V = k_BT·ln(N_V/p₀)',
      '2) = (' + kT.toFixed(4) + ')·ln(' + Nv.toExponential(2) + '/' + p0.toExponential(2) + ')',
      '3) = ' + efMinusEv.toFixed(3) + ' eV     (so E_C − E_F = ' + ecMinusEf.toFixed(3) + ' eV)'
    ];
  } else {
    const efFromEV = efSlider.value();
    efMinusEv = efFromEV; ecMinusEf = Eg - efFromEV;
    n0 = Nc * Math.exp(-ecMinusEf / kT);
    p0 = Nv * Math.exp(-efMinusEv / kT);
    steps = [
      'Given: E_F − E_V = ' + efFromEV.toFixed(3) + ' eV   (so E_C − E_F = ' + ecMinusEf.toFixed(3) + ' eV)',
      '1) n₀ = N_C·e^(−(E_C−E_F)/k_BT) = ' + smlFormatConc(n0),
      '2) p₀ = N_V·e^(−(E_F−E_V)/k_BT) = ' + smlFormatConc(p0),
      'For a continuous drag-and-observe view of this exact direction, see Chapter 9\'s Carrier Concentration and Fermi Level Explorer.'
    ];
  }

  const eiOffset = smlEiOffsetFromMidgap(Nc, Nv, kT);
  const distToBand = Math.min(ecMinusEf, efMinusEv);
  const zone = smlDegeneracyZone(distToBand, kT);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 12.5 : 15);
  text(m, canvasWidth / 2, 8);

  const leftW = compact() ? canvasWidth : Math.round(canvasWidth * 0.42);
  drawBandDiagram(Eg, ecMinusEf, efMinusEv, eiOffset, zone, kT, leftW);
  drawSteps(steps, zone, compact() ? 0 : leftW, compact() ? drawHeight * 0.52 : 0, compact() ? canvasWidth : canvasWidth - leftW, compact() ? drawHeight * 0.48 : drawHeight);

  const rows = { mode: 12, mat: 50, temp: 88, in1: 126, in2: 164 };
  fill(30); noStroke(); textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 13);
  text('Mode:', 10, drawHeight + rows.mode + 11);
  text('Material:', 10, drawHeight + rows.mat + 11);
  text('Temperature:', 10, drawHeight + rows.temp + 11);
  if (m === MODES[0]) {
    text('N_D:', 10, drawHeight + rows.in1 + 11);
    text('N_A:', 10, drawHeight + rows.in2 + 11);
    textAlign(RIGHT, CENTER);
    text(smlFormatPow10(ndExpSlider.value()), canvasWidth - 10, drawHeight + rows.in1 + 11);
    text(smlFormatPow10(naExpSlider.value()), canvasWidth - 10, drawHeight + rows.in2 + 11);
  } else if (m === MODES[1]) {
    text('n₀:', 10, drawHeight + rows.in1 + 11);
    textAlign(RIGHT, CENTER);
    text(smlFormatPow10(nExpSlider.value()), canvasWidth - 10, drawHeight + rows.in1 + 11);
  } else if (m === MODES[2]) {
    text('p₀:', 10, drawHeight + rows.in1 + 11);
    textAlign(RIGHT, CENTER);
    text(smlFormatPow10(pExpSlider.value()), canvasWidth - 10, drawHeight + rows.in1 + 11);
  } else {
    text('E_F − E_V:', 10, drawHeight + rows.in1 + 11);
    textAlign(RIGHT, CENTER);
    text(efSlider.value().toFixed(2) + ' eV', canvasWidth - 10, drawHeight + rows.in1 + 11);
  }
}

function drawBandDiagram(Eg, ecMinusEf, efMinusEv, eiOffset, zone, kT, panelW) {
  const diagX0 = compact() ? 60 : 70, diagX1 = panelW - (compact() ? 60 : 90);
  const plotY0 = 40, plotY1 = (compact() ? drawHeight * 0.52 : drawHeight) - 46;
  const HEAD = 0.22;
  function eToPx(depthBelowEc) { return map(depthBelowEc, -HEAD, Eg + HEAD, plotY0, plotY1); }

  const ecDepth = 0, evDepth = Eg;
  const eiDepth = Eg / 2 - eiOffset;
  const efDepth = ecMinusEf;

  noStroke();
  fill(90, 62, 237, 28);
  rect(diagX0, plotY0, diagX1 - diagX0, eToPx(ecDepth) - plotY0);
  fill(200, 90, 90, 28);
  rect(diagX0, eToPx(evDepth), diagX1 - diagX0, eToPx(Eg + HEAD) - eToPx(evDepth));

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
  text('E_C', diagX1 + 6, eToPx(ecDepth) + 4);
  fill(90, 150, 110); textAlign(LEFT, CENTER);
  text('E_i', diagX1 + 6, eToPx(eiDepth));
  fill(200, 90, 90); textAlign(LEFT, TOP);
  text('E_V', diagX1 + 6, eToPx(evDepth) + 4);

  const efClamped = constrain(efDepth, -HEAD + 0.02, Eg + HEAD - 0.02);
  const zoneColor = zone === 'non' ? color(46, 125, 50) : (zone === 'transition' ? color(200, 140, 20) : color(200, 30, 30));
  stroke(zoneColor); strokeWeight(2.6);
  if (zone === 'degenerate') drawingContext.setLineDash([6, 4]); else drawingContext.setLineDash([]);
  line(diagX0, eToPx(efClamped), diagX1, eToPx(efClamped));
  drawingContext.setLineDash([]);
  noStroke(); fill(zoneColor); textAlign(LEFT, efDepth < 0 ? TOP : (efDepth > Eg ? BOTTOM : CENTER)); textSize(compact() ? 10.5 : 12);
  text('E_F' + (zone === 'degenerate' ? ' (estimate)' : ''), diagX1 + 6, eToPx(efClamped));
}

function drawSteps(steps, zone, panelX, panelY, panelW, panelH) {
  // Non-compact layout shares the top row with the page title (drawn
  // separately at y=8..~30), so cardY must clear it. Card height is
  // sized to its content (steps + optional warning line), not stretched
  // to fill the whole panel -- a tall, mostly-empty card reads as
  // unfinished.
  const topPad = compact() ? 16 : 40;
  const cardX = panelX + 16, cardY = panelY + topPad, cardW = panelW - 32;
  const lineGap = compact() ? 34 : 40; // generous: long substituted-number lines can wrap to 2 lines
  const warnLines = zone !== 'non' ? 1 : 0;
  const cardH = min(panelH - topPad - 16, 28 + steps.length * lineGap + warnLines * 34);
  noStroke(); fill(240, 245, 255); stroke(168, 200, 255); strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke(); fill(30); textAlign(LEFT, TOP); textSize(compact() ? 10.5 : 12.5);
  let y = cardY + 14;
  for (const s of steps) {
    text(s, cardX + 14, y, cardW - 28);
    y += lineGap;
  }
  if (zone !== 'non') {
    fill(180, 90, 10); textSize(compact() ? 9.5 : 11);
    text('Note: within 3k_BT of (or past) a band edge — non-degenerate formulas are approximate here.', cardX + 14, y + 4, cardW - 28);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 200 : 170;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 640);
}
