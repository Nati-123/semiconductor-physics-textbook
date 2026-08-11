// Carrier Concentration vs. Temperature (Three Regions) Explorer MicroSim
// Plots a simplified majority(T) = N_dope*f_ion(T) + n_i(T) curve on a
// log10(concentration) vs. linear T axis, shading the freeze-out,
// extrinsic, and intrinsic regions using region boundaries computed live
// from the actual doping/ionization-energy parameters (not fixed pixel
// positions). This is an illustrative combination consistent with the
// chapter's own framing, not the exact charge-neutrality solution (that
// is Chapters 9-10's subject).
// Performance note: redraw is event-driven (noLoop + redraw-on-input)
// since nothing here animates continuously; every slider/dropdown change
// calls redraw() once instead of running a 60fps draw loop.
// Bloom Level: Analyze (L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 340;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let typeSelect, presetSelect, dopeSlider, eSlider, tSlider;

const KB = 8.617e-5; // eV/K
const EG0 = 1.166, ALPHA = 4.73e-4, BETA = 636; // silicon Varshni
const NI_A = 4.7e15; // calibration constant, cm^-3 K^-1.5
const B_FREEZE = 0.02; // freeze-out sigmoid constant
const TMIN = 20, TMAX = 900;

const PRESETS = { 'Custom': null, '50 K (deep freeze-out)': 50, '77 K (liquid N₂)': 77, '300 K (room temp.)': 300, '500 K (hot)': 500, '800 K (intrinsic example)': 800 };

const CB_COLOR = '#5A3EED', VB_COLOR = '#C62828';
const FREEZE_COL = [210, 225, 255], EXTRINSIC_COL = [210, 250, 215], INTRINSIC_COL = [255, 210, 210];

function EgAt(T) { return EG0 - (ALPHA * T * T) / (T + BETA); }
function niAt(T) {
  const kT = KB * T;
  return NI_A * Math.pow(T, 1.5) * Math.exp(-EgAt(T) / (2 * kT));
}
function fIon(T, E) {
  const kT = KB * T;
  return 1 / (1 + B_FREEZE * Math.exp(E / kT));
}
function majorityAt(T, Ndope, E) { return Ndope * fIon(T, E) + niAt(T); }

function compact() { return canvasWidth < 480; }

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

  presetSelect = createSelect();
  Object.keys(PRESETS).forEach(name => presetSelect.option(name));
  presetSelect.attribute('aria-label', 'Temperature preset');
  presetSelect.changed(function () {
    const t = PRESETS[presetSelect.value()];
    if (t !== null) tSlider.value(t);
    redraw();
  });

  dopeSlider = createSlider(14, 19, 16, 0.1);
  dopeSlider.attribute('aria-label', 'Doping concentration exponent (power of 10, per cm cubed)');
  dopeSlider.input(function () { redraw(); });

  eSlider = createSlider(0.02, 0.15, 0.045, 0.005);
  eSlider.attribute('aria-label', 'Dopant ionization energy in eV');
  eSlider.input(function () { redraw(); });

  tSlider = createSlider(TMIN, TMAX, 300, 1);
  tSlider.attribute('aria-label', 'Operating temperature in kelvin');
  tSlider.input(function () { presetSelect.selected('Custom'); redraw(); });

  positionUIElements();
  noLoop();
  describe('Carrier concentration versus temperature explorer: plots the freeze-out, extrinsic, and intrinsic temperature regions on a log concentration versus temperature chart, with a movable temperature marker and live numeric readouts', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function controlX() { return compact() ? 130 : 190; }

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const cx = controlX();
  const sw = min(canvasWidth - cx - 40, 300);

  typeSelect.position(bx + cx, by + drawHeight + 12);
  presetSelect.position(bx + cx, by + drawHeight + 48);
  dopeSlider.position(bx + cx, by + drawHeight + 86); dopeSlider.size(sw);
  eSlider.position(bx + cx, by + drawHeight + 124); eSlider.size(sw);
  tSlider.position(bx + cx, by + drawHeight + 162); tSlider.size(sw);
}

// Scan for the two region-boundary temperatures: where f_ion crosses 0.9
// (freeze-out -> extrinsic) and where n_i crosses half the doping level
// (extrinsic -> intrinsic). Computed live from current parameters so the
// shaded regions and labels are never "decorative." For extreme slider
// combinations (very high ionization energy with very heavy doping) these
// two criteria can cross, so there is no real extrinsic plateau -- that
// is flagged explicitly (collapsed=true) rather than silently clamped,
// which previously produced shading that contradicted the region badge.
function findBoundaries(Ndope, E) {
  const steps = 400;
  let tFE = TMAX, tEI = TMAX;
  let foundFE = false, foundEI = false;
  for (let i = 0; i <= steps; i++) {
    const T = TMIN + (i / steps) * (TMAX - TMIN);
    if (!foundFE && fIon(T, E) >= 0.9) { tFE = T; foundFE = true; }
    if (!foundEI && niAt(T) >= 0.5 * Ndope) { tEI = T; foundEI = true; }
    if (foundFE && foundEI) break;
  }
  // "collapsed" only applies when BOTH criteria were actually met somewhere
  // in range and they cross (tEI <= tFE) -- an extreme-parameter case with
  // no true extrinsic plateau. If one or both criteria were never reached
  // within [TMIN,TMAX] (both default to TMAX), the sample simply never
  // leaves freeze-out (or never reaches intrinsic) in the visible range,
  // and must NOT be reported as "intrinsic" merely because both defaults
  // happen to coincide at TMAX.
  const collapsed = foundFE && foundEI && tEI <= tFE;
  const crossover = collapsed ? (tFE + tEI) / 2 : null;
  return { tFE, tEI, foundFE, foundEI, collapsed, crossover };
}

function currentRegion(T, b) {
  if (b.collapsed) return T < b.crossover ? 'freeze' : 'intrinsic';
  if (!b.foundFE) return 'freeze'; // never reaches 90% ionized within range
  if (T < b.tFE) return 'freeze';
  if (!b.foundEI) return 'extrinsic'; // ionized, but ni never catches up within range
  if (T < b.tEI) return 'extrinsic';
  return 'intrinsic';
}

function isN() { return typeSelect.value().indexOf('n-type') === 0; }

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  const nType = isN();
  const Ndope = Math.pow(10, dopeSlider.value());
  const E = eSlider.value();
  const T = tSlider.value();
  const b = findBoundaries(Ndope, E);
  const region = currentRegion(T, b);

  drawChart(nType, Ndope, E, T, b, region);
  drawRegionBadge(region, T, Ndope, E, b);
  drawControlLabels(nType, Ndope, E, T, region);
}

function drawChart(nType, Ndope, E, T, b, region) {
  const chartX = compact() ? 56 : 70, chartY = 40;
  const chartW = canvasWidth - chartX - (compact() ? 16 : 30);
  const chartH = drawHeight - (compact() ? 108 : 96);
  const YMIN = 8, YMAX = 19;

  function tToPx(Tv) { return map(Tv, TMIN, TMAX, chartX, chartX + chartW); }
  function yToPx(logv) { return map(constrain(logv, YMIN, YMAX), YMIN, YMAX, chartY + chartH, chartY); }

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 12 : 15);
  const majSym = nType ? 'n' : 'p';
  text(majSym + '(T) ≈ N' + (nType ? 'D' : 'A') + '·f_ion(T) + n_i(T)  (silicon, illustrative model)', canvasWidth / 2, 6);

  // region shading using LIVE boundaries. In the rare "collapsed" case
  // (extreme E + doping, where the freeze-out and intrinsic criteria
  // cross with no true extrinsic plateau between them), skip the green
  // band entirely rather than clamping it into a misleading full-width
  // freeze-out fill that would contradict the region badge.
  noStroke();
  if (b.collapsed) {
    // both criteria were met, but crossed: no true extrinsic plateau
    fill(FREEZE_COL[0], FREEZE_COL[1], FREEZE_COL[2], 160);
    rect(chartX, chartY, tToPx(b.crossover) - chartX, chartH);
    fill(INTRINSIC_COL[0], INTRINSIC_COL[1], INTRINSIC_COL[2], 160);
    rect(tToPx(b.crossover), chartY, chartX + chartW - tToPx(b.crossover), chartH);
  } else if (!b.foundFE) {
    // never reaches 90% ionized anywhere in the visible range
    fill(FREEZE_COL[0], FREEZE_COL[1], FREEZE_COL[2], 160);
    rect(chartX, chartY, chartW, chartH);
  } else if (!b.foundEI) {
    // ionizes normally, but n_i never catches up within the visible range
    fill(FREEZE_COL[0], FREEZE_COL[1], FREEZE_COL[2], 160);
    rect(chartX, chartY, tToPx(b.tFE) - chartX, chartH);
    fill(EXTRINSIC_COL[0], EXTRINSIC_COL[1], EXTRINSIC_COL[2], 160);
    rect(tToPx(b.tFE), chartY, chartX + chartW - tToPx(b.tFE), chartH);
  } else {
    fill(FREEZE_COL[0], FREEZE_COL[1], FREEZE_COL[2], 160);
    rect(chartX, chartY, tToPx(b.tFE) - chartX, chartH);
    fill(EXTRINSIC_COL[0], EXTRINSIC_COL[1], EXTRINSIC_COL[2], 160);
    rect(tToPx(b.tFE), chartY, tToPx(b.tEI) - tToPx(b.tFE), chartH);
    fill(INTRINSIC_COL[0], INTRINSIC_COL[1], INTRINSIC_COL[2], 160);
    rect(tToPx(b.tEI), chartY, chartX + chartW - tToPx(b.tEI), chartH);
  }

  // chart border
  noFill(); stroke(200); strokeWeight(1);
  rect(chartX, chartY, chartW, chartH);

  // x ticks (temperature)
  const xTickStep = compact() ? 200 : 100;
  textAlign(CENTER, TOP); textSize(compact() ? 9 : 10); fill(90);
  for (let Tt = TMIN; Tt <= TMAX; Tt += xTickStep) {
    const x = tToPx(Tt);
    stroke(190); strokeWeight(1);
    line(x, chartY + chartH, x, chartY + chartH + 4);
    noStroke();
    text(Tt, x, chartY + chartH + 6);
  }

  // y ticks (log concentration, proper 10^n formatting)
  textAlign(RIGHT, CENTER);
  for (let yl = YMIN; yl <= YMAX; yl += compact() ? 2 : 1) {
    const y = yToPx(yl);
    stroke(190); strokeWeight(1);
    line(chartX - 4, y, chartX, y);
    noStroke(); fill(90); textSize(compact() ? 8.5 : 9.5);
    text('10' + smlSuperscript(yl), chartX - 7, y);
  }

  // curve
  const pts = [];
  const steps = 200;
  for (let i = 0; i <= steps; i++) {
    const Tv = TMIN + (i / steps) * (TMAX - TMIN);
    pts.push({ x: tToPx(Tv), y: yToPx(Math.log10(majorityAt(Tv, Ndope, E))) });
  }
  noFill(); stroke(nType ? CB_COLOR : VB_COLOR); strokeWeight(2.5);
  beginShape();
  for (const p of pts) vertex(p.x, p.y);
  endShape();

  // Ndope reference line
  const ndY = yToPx(Math.log10(Ndope));
  stroke(120); strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(chartX, ndY, chartX + chartW, ndY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90); textAlign(LEFT, BOTTOM); textSize(compact() ? 9.5 : 11);
  text((nType ? 'ND' : 'NA') + ' = ' + smlFormatPow10(dopeSlider.value(), { noUnit: true }), chartX + 4, ndY - 3);

  // movable temperature marker + point on curve
  const mx = tToPx(T);
  stroke(30, 30, 30); strokeWeight(2);
  drawingContext.setLineDash([5, 3]);
  line(mx, chartY, mx, chartY + chartH);
  drawingContext.setLineDash([]);
  const curY = yToPx(Math.log10(majorityAt(T, Ndope, E)));
  noStroke(); fill(30);
  circle(mx, curY, 9);
  fill(255); textSize(compact() ? 9 : 10);
  textAlign(mx < chartX + chartW * 0.75 ? LEFT : RIGHT, BOTTOM);
  fill(30);
  text('T = ' + T + ' K', mx + (mx < chartX + chartW * 0.75 ? 6 : -6), chartY + 12);

  // region name labels centered on their LIVE region (not fixed positions).
  // Placed near the BOTTOM of the chart (inside the border) so they never
  // collide with the temperature-marker label, which lives near the top.
  noStroke(); fill(60); textAlign(CENTER, BOTTOM); textSize(compact() ? 9 : 11);
  const regionLabelY = chartY + chartH - 6;
  if (b.collapsed) {
    const freezeCx = (chartX + tToPx(b.crossover)) / 2;
    const intrinsicCx = (tToPx(b.crossover) + chartX + chartW) / 2;
    if (tToPx(b.crossover) - chartX > 30) text(compact() ? 'Freeze' : 'Freeze-Out', freezeCx, regionLabelY);
    if (chartX + chartW - tToPx(b.crossover) > 30) text('Intrinsic', intrinsicCx, regionLabelY);
  } else if (!b.foundFE) {
    text(compact() ? 'Freeze' : 'Freeze-Out', chartX + chartW / 2, regionLabelY);
  } else if (!b.foundEI) {
    const freezeCx = (chartX + tToPx(b.tFE)) / 2;
    const extrinsicCx = (tToPx(b.tFE) + chartX + chartW) / 2;
    if (tToPx(b.tFE) - chartX > 30) text(compact() ? 'Freeze' : 'Freeze-Out', freezeCx, regionLabelY);
    if (chartX + chartW - tToPx(b.tFE) > 30) text('Extrinsic', extrinsicCx, regionLabelY);
  } else {
    const freezeCx = (chartX + tToPx(b.tFE)) / 2;
    const extrinsicCx = (tToPx(b.tFE) + tToPx(b.tEI)) / 2;
    const intrinsicCx = (tToPx(b.tEI) + chartX + chartW) / 2;
    if (tToPx(b.tFE) - chartX > 30) text(compact() ? 'Freeze' : 'Freeze-Out', freezeCx, regionLabelY);
    if (tToPx(b.tEI) - tToPx(b.tFE) > 30) text('Extrinsic', extrinsicCx, regionLabelY);
    if (chartX + chartW - tToPx(b.tEI) > 30) text('Intrinsic', intrinsicCx, regionLabelY);
  }

  // axis titles
  fill(20); textAlign(CENTER, TOP); textSize(compact() ? 10 : 12);
  text('Temperature (K)', chartX + chartW / 2, chartY + chartH + (compact() ? 20 : 22));
  push();
  translate(compact() ? 14 : 20, chartY + chartH / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Concentration (cm⁻³, log scale)', 0, 0);
  pop();
}

function drawRegionBadge(region, T, Ndope, E, b) {
  const y0 = drawHeight + 200;
  const badgeW = min(canvasWidth - 24, 360);
  const info = {
    freeze: { name: 'FREEZE-OUT', col: [70, 100, 200], bg: [225, 232, 255] },
    extrinsic: { name: 'EXTRINSIC', col: [40, 130, 70], bg: [222, 245, 225] },
    intrinsic: { name: 'INTRINSIC', col: [180, 40, 40], bg: [255, 225, 225] }
  }[region];

  noStroke(); fill(info.bg[0], info.bg[1], info.bg[2]);
  stroke(info.col[0], info.col[1], info.col[2]); strokeWeight(1.5);
  rect(12, y0, badgeW, compact() ? 26 : 28, 6);
  noStroke(); fill(info.col[0], info.col[1], info.col[2]);
  textAlign(CENTER, CENTER); textSize(compact() ? 13 : 15);
  text('Current region: ' + info.name, 12 + badgeW / 2, y0 + (compact() ? 13 : 14));

  // WHY explanation, dynamically generated from actual numbers
  const kT_meV = (KB * T * 1000).toFixed(1);
  const E_meV = (E * 1000).toFixed(0);
  const fion = (fIon(T, E) * 100).toFixed(0);
  const ni = niAt(T);
  let why;
  if (region === 'freeze') {
    why = 'kBT ≈ ' + kT_meV + ' meV is small compared to the ionization energy (' + E_meV + ' meV), so only ' + fion + '% of dopants are ionized. Carrier concentration is still well below N' + (isN() ? 'D' : 'A') + '.';
  } else if (region === 'extrinsic') {
    why = 'Dopants are ' + fion + '% ionized (kBT ≈ ' + kT_meV + ' meV comfortably exceeds ' + E_meV + ' meV), and thermal generation (ni ≈ ' + smlFormatConc(ni) + ') is still far below N' + (isN() ? 'D' : 'A') + '. Carrier concentration ≈ doping level.';
  } else {
    why = 'Thermally-generated carriers (ni ≈ ' + smlFormatConc(ni) + ') now exceed N' + (isN() ? 'D' : 'A') + ' (' + smlFormatConc(Ndope) + '), so the material behaves as if intrinsic regardless of doping.';
  }
  fill(50); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 10.5 : 12);
  text(why, 12, y0 + (compact() ? 34 : 38), badgeW, compact() ? 90 : 70);
}

function drawControlLabels(nType, Ndope, E, T, region) {
  fill('black'); noStroke();
  const cx = controlX();
  textSize(compact() ? 11 : 13);
  textAlign(RIGHT, CENTER);
  text('Type:', cx - 10, drawHeight + 24);
  text('Preset:', cx - 10, drawHeight + 60);
  text((nType ? 'ND' : 'NA') + ': ' + smlFormatPow10(dopeSlider.value(), { noUnit: true }), cx - 10, drawHeight + 98);
  text((nType ? 'ED' : 'EA') + ': ' + E.toFixed(3) + ' eV', cx - 10, drawHeight + 136);
  text('T: ' + T + ' K', cx - 10, drawHeight + 174);

  // numeric readout grid below the region badge/explanation. Split across
  // three short lines on narrow canvases so nothing runs past the edge.
  const ni = niAt(T);
  const majority = majorityAt(T, Ndope, E);
  const minority = (ni * ni) / majority; // mass-action preview (Chapter 9 makes this exact)
  const fion = fIon(T, E);
  const readY0 = drawHeight + (compact() ? 335 : 315);
  const lineGap = compact() ? 18 : 18;
  fill('#333'); noStroke(); textAlign(LEFT, CENTER); textSize(compact() ? 10 : 11.5);
  if (compact()) {
    text('T = ' + T + ' K   |   ' + (nType ? 'n' : 'p') + ' ≈ ' + smlFormatConc(majority), 12, readY0);
    text('ni = ' + smlFormatConc(ni) + '   |   ' + (nType ? 'ND' : 'NA') + ' = ' + smlFormatConc(Ndope), 12, readY0 + lineGap);
    text('ionized = ' + (fion * 100).toFixed(1) + '%   |   ' + (nType ? 'p' : 'n') + ' (minority) ≈ ' + smlFormatConc(minority), 12, readY0 + 2 * lineGap);
  } else {
    text('T = ' + T + ' K   |   ' + (nType ? 'n' : 'p') + ' ≈ ' + smlFormatConc(majority) + '   |   ni = ' + smlFormatConc(ni), 12, readY0);
    text((nType ? 'ND' : 'NA') + ' = ' + smlFormatConc(Ndope) + '   |   ionized fraction = ' + (fion * 100).toFixed(1) + '%   |   ' + (nType ? 'p' : 'n') + ' (minority, preview) ≈ ' + smlFormatConc(minority), 12, readY0 + lineGap);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 440 : 365;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
}
