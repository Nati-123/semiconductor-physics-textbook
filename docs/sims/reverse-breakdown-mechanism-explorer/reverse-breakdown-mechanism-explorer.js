// Reverse Breakdown Mechanism Explorer MicroSim
// Plots the estimated avalanche breakdown voltage BV = eps*Ecrit^2/(2*q*N)
// versus lightly-doped-side concentration N on a log-log chart (with tick
// gridlines and light red/green shading for the approximate Zener vs.
// avalanche regions), and shows schematic comparison panels for avalanche
// (impact ionization, wide depletion) versus Zener (tunneling, narrow
// depletion) breakdown, each with concrete labeled physical rows, an
// approximate one-sided depletion-width estimate, and a gently looping
// carrier-multiplication / tunneling-pulse animation. The currently-likely
// regime is highlighted based on doping level. Responsive: mechanism panels
// stack below the chart on narrow canvases instead of sitting beside it.
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 450;
let controlHeight = 175;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let nSlider;

const Q = 1.602e-19;
const EPS = 1.035e-12;
const ECRIT = 3e5; // V/cm, assumed critical field for this order-of-magnitude model
const ZENER_THRESHOLD_V = 6; // classic Si avalanche/Zener crossover -- an approximate guide, not a sharp threshold

// Kept short so each label+value fits on one line even in the narrowest
// (wide-layout, side-by-side) panel width -- the full physical picture
// ("impact-ionization chain reaction" / "quantum tunneling through a thin
// barrier") is spelled out in main.html's connects-to text and reinforced
// by each panel's own animation.
const AVALANCHE_ROWS = [
  ['Doping', 'Light–moderate'],
  ['Depletion W', 'Wide'],
  ['E-field', 'Moderate'],
  ['Process', 'Impact ionization']
];
const ZENER_ROWS = [
  ['Doping', 'Heavy'],
  ['Depletion W', 'Narrow'],
  ['E-field', 'Very strong'],
  ['Process', 'Direct tunneling']
];

function bvOf(N) {
  return EPS * ECRIT * ECRIT / (2 * Q * N);
}

// Order-of-magnitude one-sided abrupt-junction depletion width estimate at
// the breakdown voltage, W = sqrt(2*EPS*V/Q * (1/N)), in cm.
function depletionWidthCm(N, V) {
  return Math.sqrt((2 * EPS * V / Q) * (1 / N));
}

function compact() { return canvasWidth < 640; }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  nSlider = createSlider(14, 19, 16, 0.05);
  nSlider.attribute('aria-label', 'Lightly doped side concentration exponent, base 10');

  positionUIElements();
  describe('Reverse breakdown mechanism explorer: plots estimated avalanche breakdown voltage versus doping concentration on a shaded log-log chart, and compares avalanche and Zener breakdown mechanisms with labeled physical properties and looping animations', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const stacked = compact();
  if (stacked) {
    nSlider.position(bx + 16, by + drawHeight + 40);
    nSlider.size(Math.min(canvasWidth - 32, 340));
  } else {
    nSlider.position(bx + 230, by + drawHeight + 14);
    nSlider.size(Math.min(canvasWidth - 250 - 30, 400));
  }
}

// Central layout computation shared by draw() and its helpers, so every
// region (title, chart, panels, control rows) is derived from one set of
// numbers instead of duplicated magic constants scattered across functions.
function layout() {
  const stacked = compact();
  const topPad = 42; // clears the fullscreen-toggle button's ~4-34px top-right exclusion zone with margin
  let chartX, chartY, chartW, chartH, panelsX, panelsY, panelsW, panelH, panelGap;

  if (stacked) {
    chartX = 54; chartY = topPad; chartW = canvasWidth - chartX - 16; chartH = 200;
    panelGap = 12;
    panelH = 165;
    panelsX = 10; panelsY = chartY + chartH + 68; panelsW = canvasWidth - 20;
  } else {
    chartX = 64; chartY = topPad;
    const chartAreaW = canvasWidth * 0.55;
    chartW = chartAreaW - chartX - 14;
    chartH = drawHeight - chartY - 68;
    panelGap = 14;
    panelsX = chartAreaW + 14; panelsY = topPad;
    panelsW = canvasWidth - panelsX - 16;
    panelH = (drawHeight - topPad - panelGap - 10) / 2;
  }
  return { stacked, chartX, chartY, chartW, chartH, panelsX, panelsY, panelsW, panelH, panelGap };
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const N = Math.pow(10, nSlider.value());
  const BV = bvOf(N);
  const likelyZener = BV < ZENER_THRESHOLD_V;
  const Wcm = depletionWidthCm(N, BV);
  const Wum = Wcm * 1e4;

  const L = layout();

  // ---- title: short and LEFT-aligned so its right edge stays well clear
  // of the fullscreen-toggle button, which fullscreen-toggle.js paints at
  // top:4px;right:4px (~100-140px wide, ~26-28px tall, always ~75% opaque
  // when embedded in an iframe -- the deployed case). A centered
  // full-width title used to put its right edge under that button. ----
  fill(20); noStroke();
  textAlign(LEFT, TOP);
  const titleStr = compact() ? 'V_BR ≈ εE_crit²/(2qN)' : 'Avalanche Estimate:  V_BR ≈ εE_crit² / (2qN)';
  smlMathText(10, 8, titleStr, { size: compact() ? 12 : 14 });

  drawBvChart(N, BV, L);
  drawMechanismPanels(L, likelyZener);
  drawControls(N, BV, Wum, likelyZener, L);
}

function drawBvChart(N, BV, L) {
  const { chartX: chartX0, chartY, chartW, chartH } = L;
  const logNmin = 14, logNmax = 19, yMin = -1, yMax = 3;

  // ---- light shading for the two regions, drawn UNDER the axis box and
  // data line so the crossover concept is visible on the chart itself,
  // not just as a dashed line. Below (more negative pixel-y is HIGHER V,
  // so "below the crossover" in V means the LARGER-y / lower part of the
  // chart) the ~6V line = Zener territory (red tint); above = avalanche-
  // dominant (green tint). ----
  const crossoverLogV = Math.log10(ZENER_THRESHOLD_V);
  const crossoverPxY = map(crossoverLogV, yMin, yMax, chartY + chartH, chartY);
  noStroke();
  fill(255, 210, 205, 100);
  rect(chartX0, crossoverPxY, chartW, (chartY + chartH) - crossoverPxY);
  fill(210, 240, 215, 100);
  rect(chartX0, chartY, chartW, crossoverPxY - chartY);

  // light gridlines at reference doping/voltage values, drawn before the
  // library's own axis box + data series so the series line stays legible
  const nTicks = [15, 16, 17, 18];
  const vTicks = [0, 1, 2]; // log10(1), log10(10), log10(100) volts
  stroke(225); strokeWeight(1);
  nTicks.forEach(function (nt) {
    const px = map(nt, logNmin, logNmax, chartX0, chartX0 + chartW);
    line(px, chartY, px, chartY + chartH);
  });
  vTicks.forEach(function (lv) {
    const py = map(lv, yMin, yMax, chartY + chartH, chartY);
    line(chartX0, py, chartX0 + chartW, py);
  });

  const pts = [];
  for (let ln = logNmin; ln <= logNmax; ln += 0.05) {
    const n = Math.pow(10, ln);
    pts.push({ x: ln, y: Math.log10(bvOf(n)) });
  }
  // Library's built-in xLabel/yLabel opts are intentionally NOT used here
  // -- their fixed "+6px below chart" offset would collide with our own
  // tick-value labels, which need that space. Axis titles are drawn by
  // hand below, with a controlled, non-overlapping vertical budget.
  const info = smlDrawLineChart(chartX0, chartY, chartW, chartH, logNmin, logNmax, yMin, yMax, [
    { points: pts, color: color(90, 62, 237) }
  ], {
    marker: { x: nSlider.value(), y: Math.log10(BV) }
  });

  // numeric tick labels, drawn on top so they read clearly against the
  // shaded bands and gridlines
  const tickSz = compact() ? 9 : 9.5;
  noStroke(); fill(100); textSize(tickSz);
  textAlign(CENTER, TOP);
  nTicks.forEach(function (nt) {
    const px = info.xToPx(nt);
    text('10' + smlSuperscript(nt), px, chartY + chartH + 4);
  });
  textAlign(RIGHT, CENTER);
  vTicks.forEach(function (lv) {
    const py = info.yToPx(lv);
    text(Math.pow(10, lv), chartX0 - 6, py);
  });

  // axis titles, hand-placed below the tick numbers
  noStroke(); fill(40); textAlign(CENTER, TOP);
  smlMathText(chartX0 + chartW / 2, chartY + chartH + 16, 'log10 N (cm⁻³)', { align: 'center', size: compact() ? 10 : 11 });
  push();
  translate(chartX0 - 38, chartY + chartH / 2);
  rotate(-HALF_PI);
  smlMathText(0, -6, 'log10 V_BR (V)', { align: 'center', size: compact() ? 10 : 11 });
  pop();

  // crossover dashed reference line, drawn last so it stays visible on top
  const thrY = info.yToPx(crossoverLogV);
  stroke(230, 90, 60); strokeWeight(1.3);
  drawingContext.setLineDash([3, 3]);
  line(chartX0, thrY, chartX0 + chartW, thrY);
  drawingContext.setLineDash([]);
  noStroke(); fill(230, 90, 60); textAlign(LEFT, BOTTOM); textSize(compact() ? 9.5 : 10.5);
  text('~' + ZENER_THRESHOLD_V + ' V approx. crossover', chartX0 + 4, thrY - 3);

  // short legend explaining the shaded regions -- the approximate-crossover
  // wording itself is reinforced again in the control strip below
  const legY = chartY + chartH + 32;
  noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 9 : 9.5);
  fill(60, 140, 90);
  text('■ green = avalanche-dominant region', chartX0, legY);
  fill(200, 80, 55);
  text('■ red = Zener territory (approximate)', chartX0, legY + 14);
}

function drawMechanismPanels(L, likelyZener) {
  const { panelsX, panelsY, panelsW, panelH, panelGap } = L;
  drawMechanismPanel(panelsX, panelsY, panelsW, panelH, {
    name: 'Avalanche', active: !likelyZener,
    activeFill: color(230, 245, 235), activeStroke: color(40, 150, 90), activeText: color(30, 130, 80),
    rows: AVALANCHE_ROWS, kind: 'avalanche'
  });
  drawMechanismPanel(panelsX, panelsY + panelH + panelGap, panelsW, panelH, {
    name: 'Zener', active: likelyZener,
    activeFill: color(255, 240, 235), activeStroke: color(220, 90, 60), activeText: color(200, 80, 50),
    rows: ZENER_ROWS, kind: 'zener'
  });
}

function drawMechanismPanel(x, y, w, h, opt) {
  const stacked = compact();
  const titleH = stacked ? 15 : 17;
  const schemH = stacked ? 50 : 60;
  const rowH = stacked ? 18 : 20;
  const rowSize = stacked ? 9.5 : 10.5;

  noStroke(); fill(opt.active ? opt.activeFill : color(248));
  stroke(opt.active ? opt.activeStroke : color(210)); strokeWeight(opt.active ? 2.5 : 1);
  rect(x, y, w, h, 8);

  // panel title -- drawn well below the top-right fullscreen-button zone
  // (panel top y >= 42 always, so this never falls in the y<34 band)
  noStroke(); fill(opt.active ? opt.activeText : color(120));
  textAlign(LEFT, TOP); textSize(stacked ? 12 : 13); textStyle(BOLD);
  text(opt.name, x + 10, y + 6);
  if (opt.active) {
    textAlign(RIGHT, TOP); textSize(stacked ? 9 : 9.5);
    text('CURRENTLY FAVORED', x + w - 10, y + 8);
  }
  textStyle(NORMAL);

  const schemY = y + titleH + 12;
  if (opt.kind === 'avalanche') {
    drawAvalancheSchematic(x, schemY, w, schemH);
  } else {
    drawZenerSchematic(x, schemY, w, schemH);
  }

  // concrete labeled physical rows -- the actual fix for "needs a
  // stronger physical explanation": doping level, depletion width,
  // field strength, and dominant process, each spelled out rather than
  // left to a single caption line.
  let ry = schemY + schemH + 10;
  noStroke(); textAlign(LEFT, TOP);
  for (let i = 0; i < opt.rows.length; i++) {
    const row = opt.rows[i];
    textSize(rowSize); textStyle(BOLD); fill(70);
    text(row[0] + ':', x + 10, ry);
    const labelW = textWidth(row[0] + ': ');
    textStyle(NORMAL); fill(40);
    text(row[1], x + 10 + labelW, ry, w - 20 - labelW);
    ry += rowH;
  }
}

function drawAvalancheSchematic(x, y, w, h) {
  const depW = w * 0.55;
  const dx0 = x + (w - depW) / 2, dy0 = y, dh = h;
  noStroke(); fill(230, 240, 255, 200);
  rect(dx0, dy0, depW, dh);

  // looping avalanche-multiplication animation: a primary carrier steps
  // across the depletion region, and staggered secondary electron/hole
  // pairs fade in behind it to sketch the impact-ionization chain
  // reaction, then the cycle resets.
  const cycle = 110;
  const phase = (frameCount % cycle) / cycle;
  const seeds = [
    { pos: [0.22, 0.22], t: 0.10 }, { pos: [0.40, 0.62], t: 0.22 },
    { pos: [0.32, 0.40], t: 0.34 }, { pos: [0.58, 0.28], t: 0.46 },
    { pos: [0.68, 0.68], t: 0.58 }, { pos: [0.50, 0.82], t: 0.70 }
  ];
  for (let i = 0; i < seeds.length; i++) {
    const s = seeds[i];
    const reveal = constrain((phase - s.t) / 0.18, 0, 1);
    if (reveal <= 0) continue;
    const px2 = dx0 + s.pos[0] * depW, py2 = dy0 + s.pos[1] * dh;
    push();
    drawingContext.globalAlpha = reveal;
    smlDrawElectron(px2, py2, 7);
    pop();
  }
  // primary carrier sweeping left-to-right through the region each cycle
  const primaryX = dx0 + phase * depW;
  const primaryY = dy0 + dh * 0.5;
  smlDrawElectron(primaryX, primaryY, 8);
}

function drawZenerSchematic(x, y, w, h) {
  const depW = w * 0.18;
  const dx0 = x + (w - depW) / 2, dy0 = y, dh = h;
  noStroke(); fill(255, 220, 210, 200);
  rect(dx0, dy0, depW, dh);
  const midY = dy0 + dh / 2;
  stroke(220, 90, 60); strokeWeight(2);
  line(dx0 - 16, midY, dx0 + depW + 16, midY);

  // animated tunneling pulse: an arrow sweeps across the thin barrier
  // with a pulsing glow, looping continuously, to make the direct
  // (instantaneous, field-driven) nature of tunneling visually distinct
  // from the avalanche panel's stepwise carrier motion.
  const cycle = 70;
  const phase = (frameCount % cycle) / cycle;
  const arrowX = map(phase, 0, 1, dx0 - 16, dx0 + depW + 16);
  const glow = 0.55 + 0.45 * Math.sin(frameCount * 0.15);
  noStroke(); fill(220, 90, 60);
  push();
  drawingContext.globalAlpha = glow;
  triangle(arrowX, midY - 5, arrowX, midY + 5, arrowX + 9, midY);
  pop();
}

function drawControls(N, BV, Wum, likelyZener, L) {
  const stacked = compact();
  const sz = stacked ? 11 : 11.5;
  fill(30); noStroke(); textAlign(LEFT, TOP);

  if (!stacked) {
    textSize(sz);
    text('Lightly-doped side N =', 10, drawHeight + 20);
  } else {
    textSize(sz);
    text('Lightly-doped side N (slider below)', 10, drawHeight + 18);
  }

  let ry = stacked ? drawHeight + 78 : drawHeight + 50;
  const lineH = stacked ? 20 : 22;

  textSize(sz);
  fill(30);
  text('N = ' + N.toExponential(2) + ' cm⁻³      V_BR (approx.) ≈ ' + BV.toFixed(2) + ' V', 10, ry); ry += lineH;
  text('W (est., one-sided abrupt junction) ≈ ' + (Wum < 0.01 ? Wum.toExponential(2) : Wum.toFixed(3)) + ' µm', 10, ry); ry += lineH;
  text('E_crit (assumed, constant for this model) = 3×10⁵ V/cm', 10, ry); ry += lineH;

  textStyle(BOLD);
  fill(30); text('Dominant mechanism:', 10, ry);
  const labelW = textWidth('Dominant mechanism: ');
  textStyle(NORMAL);
  if (likelyZener) {
    fill(220, 90, 60); text('Zener (tunneling) — approximate crossover region', 10 + labelW, ry);
  } else {
    fill(40, 150, 90); text('Avalanche (impact ionization)', 10 + labelW, ry);
  }
  ry += lineH;

  fill(90); textSize(stacked ? 9.5 : 10);
  text('Reminder: the ~' + ZENER_THRESHOLD_V + ' V crossover is an approximate guide, not a sharp universal threshold — real diodes transition gradually between mechanisms.', 10, ry, canvasWidth - 20);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
}

function updateCanvasSize() {
  minDrawHeight = compact() ? 700 : 450;
  controlHeight = compact() ? 235 : 175;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  drawHeight = Math.max(drawHeight, minDrawHeight);
}
