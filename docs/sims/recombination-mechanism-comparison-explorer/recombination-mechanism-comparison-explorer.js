// Recombination Mechanism Comparison Explorer MicroSim
// Compares SRH (trap-assisted), Auger, and direct (band-to-band)
// recombination rates as separate curves R(Δn) swept across a wide
// range of excess carrier concentration, on a log-log chart, for
// silicon (indirect gap) vs. GaAs (direct gap).
//   R_SRH    = Δn / τ_SRH
//   R_Auger  = C_Auger * Δn^3
//   R_direct = B * Δn * (n0 + p0 + Δn)
// A movable Δn marker shows the dominant mechanism at that injection
// level, with the numeric rates and the crossover points between
// mechanisms surfaced in a dedicated information card below the chart
// (kept fully separate from the DOM controls to avoid overlap).
// No temperature control: an honest T-dependence for τ_SRH and C_Auger
// at this textbook's level would require inventing coefficients not
// grounded in the text, so it is intentionally omitted.
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 420;
let minDrawHeight = 380;
let controlHeight = 340;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, dnExpSlider, dopingExpSlider;

const MATERIALS = {
  'Silicon (indirect gap)': { B: 1.0e-14, tauSRH: 1e-6, cAuger: 2.8e-31, n0: 1e10, isIndirect: true },
  'GaAs (direct gap)': { B: 1.0e-10, tauSRH: 5e-8, cAuger: 7e-30, n0: 2.1e6, isIndirect: false }
};

const SWEEP_MIN = 10, SWEEP_MAX = 20; // Δn exponent range for the curves
const CURVE_COLORS = { SRH: [90, 62, 237], Direct: [60, 160, 100], Auger: [230, 90, 60] };

function compact() { return canvasWidth < 560; }

function computeRates(mat, dn, Ndoping) {
  const p0 = Ndoping;
  const n0eff = (mat.n0 * mat.n0) / Ndoping;
  const RSRH = dn / mat.tauSRH;
  const RAuger = mat.cAuger * dn * dn * dn;
  const Rdirect = mat.B * dn * (n0eff + p0 + dn);
  return { RSRH: RSRH, RAuger: RAuger, Rdirect: Rdirect };
}

// Finds where the dominant (largest-rate) mechanism changes across the
// swept Δn range, by walking the pre-sampled curves and recording every
// argmax swap. Returns a small list of {x: exponent, from, to} points.
function findDominantTransitions(srhPts, dirPts, augPts) {
  const labels = ['SRH', 'Direct', 'Auger'];
  const transitions = [];
  let prevIdx = null;
  for (let i = 0; i < srhPts.length; i++) {
    const ys = [srhPts[i].y, dirPts[i].y, augPts[i].y];
    let idx = 0;
    for (let k = 1; k < 3; k++) if (ys[k] > ys[idx]) idx = k;
    if (prevIdx !== null && idx !== prevIdx) {
      // Linear-interpolate the crossing exponent between samples i-1 and i
      // using the two curves that are actually swapping rank.
      const yA0 = [srhPts[i - 1].y, dirPts[i - 1].y, augPts[i - 1].y][prevIdx];
      const yB0 = [srhPts[i - 1].y, dirPts[i - 1].y, augPts[i - 1].y][idx];
      const yA1 = ys[prevIdx], yB1 = ys[idx];
      const d0 = yA0 - yB0, d1 = yA1 - yB1;
      let frac = 0.5;
      if (d1 !== d0) frac = constrain(d0 / (d0 - d1), 0, 1);
      const x = srhPts[i - 1].x + frac * (srhPts[i].x - srhPts[i - 1].x);
      transitions.push({ x: x, from: labels[prevIdx], to: labels[idx] });
    }
    prevIdx = idx;
  }
  return transitions;
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  Object.keys(MATERIALS).forEach(k => materialSelect.option(k));
  materialSelect.selected('Silicon (indirect gap)');
  materialSelect.attribute('aria-label', 'Material preset: silicon or GaAs');
  materialSelect.changed(function () { redraw(); });

  dnExpSlider = createSlider(SWEEP_MIN + 0.5, SWEEP_MAX - 0.5, 15, 0.1);
  dnExpSlider.attribute('aria-label', 'Excess carrier concentration marker exponent');
  dnExpSlider.input(function () { redraw(); });
  dopingExpSlider = createSlider(14, 18, 16, 0.1);
  dopingExpSlider.attribute('aria-label', 'Doping concentration exponent');
  dopingExpSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Recombination mechanism comparison explorer: plots SRH, Auger, and direct recombination rate curves against excess carrier concentration on a log-log chart, with a movable marker, an information card showing numeric rates and the dominant mechanism, and markers for where the dominant mechanism changes', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

// Vertical layout of the DOM control rows, measured from drawHeight.
// Two modes: inline (label left of widget) on wide canvases, and
// stacked (label above widget) on narrow ones, so label text never has
// to share a row with a widget it doesn't have room next to.
function controlRows() {
  const stacked = compact();
  const rowH = stacked ? 54 : 36;
  const topPad = 12;
  return {
    stacked: stacked,
    rowH: rowH,
    material: topPad,
    dn: topPad + rowH,
    doping: topPad + 2 * rowH,
    bottom: topPad + 3 * rowH + 8
  };
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const rows = controlRows();
  const labelW = rows.stacked ? 0 : 150;
  const widgetX = rows.stacked ? 16 : labelW;
  const widgetOffsetY = rows.stacked ? 20 : 8;
  const sw = rows.stacked ? Math.min(canvasWidth - 32, 340) : Math.min(canvasWidth - labelW - 30, 300);

  materialSelect.position(bx + widgetX, by + drawHeight + rows.material + widgetOffsetY);
  materialSelect.size(sw);
  dnExpSlider.position(bx + widgetX, by + drawHeight + rows.dn + widgetOffsetY);
  dnExpSlider.size(sw);
  dopingExpSlider.position(bx + widgetX, by + drawHeight + rows.doping + widgetOffsetY);
  dopingExpSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const mat = MATERIALS[materialSelect.value()];
  const dnMarkerExp = dnExpSlider.value();
  const dnMarker = Math.pow(10, dnMarkerExp);
  const Ndoping = Math.pow(10, dopingExpSlider.value());

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13 : 16);
  text(compact() ? 'Recombination Rate vs. Δn (log-log)' : 'Recombination Rate vs. Excess Carrier Concentration (log-log)', canvasWidth / 2, 8);

  // Sample the three rate curves across the sweep range.
  const N_PTS = 120;
  const srhPts = [], augerPts = [], directPts = [];
  let yLo = Infinity, yHi = -Infinity;
  for (let i = 0; i <= N_PTS; i++) {
    const xExp = SWEEP_MIN + (SWEEP_MAX - SWEEP_MIN) * (i / N_PTS);
    const dn = Math.pow(10, xExp);
    const r = computeRates(mat, dn, Ndoping);
    const ySRH = Math.log10(Math.max(r.RSRH, 1e-6));
    const yAug = Math.log10(Math.max(r.RAuger, 1e-6));
    const yDir = Math.log10(Math.max(r.Rdirect, 1e-6));
    srhPts.push({ x: xExp, y: ySRH });
    augerPts.push({ x: xExp, y: yAug });
    directPts.push({ x: xExp, y: yDir });
    yLo = Math.min(yLo, ySRH, yAug, yDir);
    yHi = Math.max(yHi, ySRH, yAug, yDir);
  }
  yLo = Math.floor(yLo) - 0.5;
  yHi = Math.ceil(yHi) + 0.5;

  const chartX = compact() ? 46 : 58, chartY = 40;
  const chartW = canvasWidth - chartX - 24;
  const chartH = drawHeight - (compact() ? 78 : 88);

  const { xToPx, yToPx } = smlDrawLineChart(chartX, chartY, chartW, chartH, SWEEP_MIN, SWEEP_MAX, yLo, yHi, [
    { points: srhPts, color: color(...CURVE_COLORS.SRH) },
    { points: directPts, color: color(...CURVE_COLORS.Direct) },
    { points: augerPts, color: color(...CURVE_COLORS.Auger) }
  ], {
    yLabel: 'Recombination rate (cm⁻³s⁻¹, log scale)', yLabelOffset: compact() ? 34 : 42
  });

  // Manual axis tick labels (log-log chart: shared lib draws no ticks).
  // The x-axis caption is drawn on its own row BELOW these tick numbers
  // (not via opts.xLabel, which would land on the same row and collide
  // with them) so the two never overlap.
  noStroke(); fill(70); textAlign(CENTER, TOP); textSize(compact() ? 9 : 10);
  for (let xe = Math.ceil(SWEEP_MIN / 2) * 2; xe <= SWEEP_MAX; xe += 2) {
    const px = xToPx(xe);
    stroke(225); line(px, chartY, px, chartY + chartH); noStroke();
    text('10' + toSuperscript(xe), px, chartY + chartH + 6);
  }
  const yStep = Math.max(2, Math.round((yHi - yLo) / 6));
  textAlign(RIGHT, CENTER);
  for (let ye = Math.ceil(yLo / yStep) * yStep; ye <= yHi; ye += yStep) {
    const py = yToPx(ye);
    stroke(225); line(chartX, py, chartX + chartW, py); noStroke();
    text('10' + toSuperscript(ye), chartX - 6, py);
  }
  noStroke(); fill(40); textAlign(CENTER, TOP); textSize(compact() ? 10.5 : 12);
  text('Δn (cm⁻³, log scale)', chartX + chartW / 2, chartY + chartH + 20);

  // Legend (top-left corner of the chart, clear of the curves which rise
  // left-to-right, so it never sits on top of a line).
  const legX = chartX + 10, legY = chartY + 8;
  noStroke(); fill(255, 255, 255, 235); stroke(210); strokeWeight(1);
  rect(legX - 6, legY - 6, compact() ? 90 : 100, 58, 4);
  noStroke();
  drawLegendSwatch(legX, legY + 6, color(...CURVE_COLORS.SRH), 'SRH');
  drawLegendSwatch(legX, legY + 24, color(...CURVE_COLORS.Direct), 'Direct');
  drawLegendSwatch(legX, legY + 42, color(...CURVE_COLORS.Auger), 'Auger');

  // Crossover markers: small triangles on the axis where the dominant
  // mechanism changes, so the transition is visible on the chart itself
  // (numeric values are listed in the info card below).
  const transitions = findDominantTransitions(srhPts, directPts, augerPts);
  for (const t of transitions) {
    const tx = xToPx(t.x);
    stroke(120); strokeWeight(1); drawingContext.setLineDash([2, 3]);
    line(tx, chartY, tx, chartY + chartH);
    drawingContext.setLineDash([]);
    noStroke(); fill(90);
    triangle(tx - 5, chartY + chartH + 2, tx + 5, chartY + chartH + 2, tx, chartY + chartH - 6);
  }

  // Marker: vertical solid line at the chosen Δn, with a dot on each curve.
  const rates = computeRates(mat, dnMarker, Ndoping);
  const mx = xToPx(dnMarkerExp);
  stroke(20); strokeWeight(1.5); drawingContext.setLineDash([4, 3]);
  line(mx, chartY, mx, chartY + chartH);
  drawingContext.setLineDash([]);
  noStroke();
  fill(...CURVE_COLORS.SRH); circle(mx, yToPx(Math.log10(Math.max(rates.RSRH, 1e-6))), 8);
  fill(...CURVE_COLORS.Direct); circle(mx, yToPx(Math.log10(Math.max(rates.Rdirect, 1e-6))), 8);
  fill(...CURVE_COLORS.Auger); circle(mx, yToPx(Math.log10(Math.max(rates.RAuger, 1e-6))), 8);

  drawControlLabels();
  drawInfoCard(mat, rates, dnMarker, dnMarkerExp, Ndoping, transitions);
}

function drawControlLabels() {
  const rows = controlRows();
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 12 : 13);
  if (rows.stacked) {
    text('Material', 10, drawHeight + rows.material);
    text('Δn marker: 10' + toSuperscript(dnExpSlider.value().toFixed(1)) + ' cm⁻³', 10, drawHeight + rows.dn);
    text('Doping N: 10' + toSuperscript(dopingExpSlider.value().toFixed(1)) + ' cm⁻³', 10, drawHeight + rows.doping);
  } else {
    text('Material', 10, drawHeight + rows.material + 9);
    text('Δn marker', 10, drawHeight + rows.dn + 9);
    text('Doping N', 10, drawHeight + rows.doping + 9);
    textAlign(RIGHT, TOP);
    text('10' + toSuperscript(dnExpSlider.value().toFixed(1)) + ' cm⁻³', canvasWidth - 10, drawHeight + rows.dn + 9);
    text('10' + toSuperscript(dopingExpSlider.value().toFixed(1)) + ' cm⁻³', canvasWidth - 10, drawHeight + rows.doping + 9);
  }
}

function drawInfoCard(mat, rates, dnMarker, dnMarkerExp, Ndoping, transitions) {
  const rows = controlRows();
  const cardY = drawHeight + rows.bottom;
  const cardX = 10, cardW = canvasWidth - 20;
  const lineH = compact() ? 21 : 20;
  const pad = 12;

  let dominant = 'SRH', domColor = CURVE_COLORS.SRH;
  let maxR = rates.RSRH;
  if (rates.Rdirect > maxR) { dominant = 'Direct'; domColor = CURVE_COLORS.Direct; maxR = rates.Rdirect; }
  if (rates.RAuger > maxR) { dominant = 'Auger'; domColor = CURVE_COLORS.Auger; maxR = rates.RAuger; }

  // Build the card content as a list of typed rows so height can be
  // computed once and the background rect sized exactly to fit — this
  // is what keeps the card from either clipping text or leaving a slab
  // of unused space below it.
  const items = [
    { type: 'header', text: 'Dominant mechanism at Δn = 10' + toSuperscript(dnMarkerExp.toFixed(1)) + ' cm⁻³:  ' + dominant, color: domColor },
    { type: 'rate', label: 'R_SRH', value: rates.RSRH, color: CURVE_COLORS.SRH },
    { type: 'rate', label: 'R_Direct', value: rates.Rdirect, color: CURVE_COLORS.Direct },
    { type: 'rate', label: 'R_Auger', value: rates.RAuger, color: CURVE_COLORS.Auger }
  ];
  for (const t of transitions) {
    items.push({ type: 'small', text: t.from + ' → ' + t.to + ' crossover at Δn ≈ 10' + toSuperscript(t.x.toFixed(1)) + ' cm⁻³' });
  }
  const whyText = mat.isIndirect
    ? 'Why: SRH is linear in Δn and dominates at low-to-moderate injection because indirect-gap silicon has weak direct recombination; Auger (∝Δn³) grows fastest and always wins eventually at high enough Δn.'
    : 'Why: direct recombination is strong in GaAs (direct-gap) and often dominates at low-to-moderate injection; Auger (∝Δn³) still grows fastest and overtakes it at high enough Δn.';
  items.push({ type: 'why', text: whyText });

  // Measure required height.
  let h = pad;
  for (const it of items) {
    if (it.type === 'header') h += lineH + 4;
    else if (it.type === 'rate') h += lineH;
    else if (it.type === 'small') h += lineH - 2;
    else if (it.type === 'why') h += (compact() ? 3 : 2) * (lineH - 3) + 4;
  }
  h += pad;

  fill(247, 249, 255); stroke(200, 215, 245); strokeWeight(1.5);
  rect(cardX, cardY, cardW, h, 10);

  let y = cardY + pad;
  noStroke();
  for (const it of items) {
    if (it.type === 'header') {
      fill(...it.color); textStyle(BOLD); textAlign(LEFT, TOP); textSize(compact() ? 12.5 : 13.5);
      text(it.text, cardX + 14, y, cardW - 28);
      textStyle(NORMAL);
      y += lineH + 4;
    } else if (it.type === 'rate') {
      fill(...it.color); textAlign(LEFT, TOP); textSize(compact() ? 11.5 : 12.5);
      text('●', cardX + 14, y);
      fill(40); text(it.label + ' =', cardX + 30, y);
      textAlign(RIGHT, TOP);
      text(formatSci(it.value) + ' cm⁻³s⁻¹', cardX + cardW - 14, y);
      y += lineH;
    } else if (it.type === 'small') {
      fill(90); textAlign(LEFT, TOP); textSize(compact() ? 10.5 : 11);
      text(it.text, cardX + 14, y, cardW - 28);
      y += lineH - 2;
    } else if (it.type === 'why') {
      fill(80); textAlign(LEFT, TOP); textSize(compact() ? 10.5 : 11);
      text(it.text, cardX + 14, y, cardW - 28);
      y += (compact() ? 3 : 2) * (lineH - 3) + 4;
    }
  }
}

function formatSci(v) {
  if (!isFinite(v) || v <= 0) return '0';
  const s = v.toExponential(2); // e.g. "1.23e+21"
  const parts = s.split('e');
  const exp = parseInt(parts[1], 10);
  return parts[0] + '×10' + toSuperscript(exp);
}

function toSuperscript(exp) {
  const supDigits = { '-': '⁻', '.': '·', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '' };
  return String(exp).split('').map(c => supDigits[c] !== undefined ? supDigits[c] : c).join('');
}

function drawLegendSwatch(x, y, col, label) {
  stroke(col); strokeWeight(2.5); line(x, y + 5, x + 16, y + 5);
  noStroke(); fill(30); textAlign(LEFT, CENTER); textSize(10.5);
  text(label, x + 20, y + 5);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

// Card height varies with content (number of crossover points found and
// whether labels wrap), so controlHeight is computed the same way the
// card itself is measured, keeping the reserved space and the drawn
// content in lock-step instead of relying on a guessed constant.
function estimateControlHeight() {
  const rows = controlRows();
  const lineH = compact() ? 21 : 20;
  const pad = 12;
  // Worst case: header + 3 rates + up to 2 crossovers + 3-line why text.
  let h = pad + (lineH + 4) + 3 * lineH + 2 * (lineH - 2) + (compact() ? 3 : 2) * (lineH - 3) + 4 + pad;
  return rows.bottom + h + 16;
}

function updateCanvasSize() {
  minDrawHeight = compact() ? 380 : 380;
  controlHeight = estimateControlHeight();
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  drawHeight = Math.max(drawHeight, minDrawHeight);
}
