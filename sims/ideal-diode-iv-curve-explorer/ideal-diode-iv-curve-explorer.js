// Ideal Diode I-V Curve Explorer MicroSim
// Plots J = J0*(exp(V/VT) - 1) for a chosen J0 and temperature, in either
// a linear view (showing the sharp forward "knee") or a semi-log view of
// |J| (showing the exponential forward region as a straight line and the
// reverse region flattening at J0).
//
// Three physically-distinct operating regions are labeled directly on the
// chart (shaded bands + a bracket/label strip under the x-axis):
//   Reverse Saturation        V well below 0   (V < -0.15 V here)
//   Near-Zero Bias             V close to 0     (-0.15 V <= V < 0.25 V)
//   Exponential Forward Conduction   V approaching/exceeding ~0.4-0.5 V
//     (V >= 0.25 V)
// These thresholds are fixed in volts (not re-derived from VT) so the
// band boundaries stay put as the student changes J0 or T -- only the
// curve itself moves.
//
// A "Compare 300K vs T2" mode overlays a second curve (in orange) at an
// independently-adjustable second temperature T2, alongside the primary
// curve fixed at the textbook's usual reference temperature of 300 K, so
// students can see how VT = kT/q and J0's temperature sensitivity shift
// the whole curve.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 520;
let minDrawHeight = 520;
let controlHeight = 180;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let j0Slider, tSlider, t2Slider, viewSelect, vSlider;
let compareMode = false;
let compareBtnRects = [];

const K_EV = 8.617e-5; // eV/K
const VMIN = -2, VMAX = 0.8;
const T_FIXED_COMPARE = 300; // "Compare 300K vs T2" always anchors curve 1 at 300 K

// Fixed voltage thresholds (volts) that delineate the three labeled
// operating regions. Kept as fixed volts (not multiples of VT) so the
// band boundaries stay visually stable while J0/T sliders move the curve.
const REV_END = -0.15, NEAR_END = 0.25;
const REGIONS = [
  { key: 'reverse', label: 'Reverse Saturation', shortLabel: 'Reverse Saturation', from: VMIN, to: REV_END, color: [196, 80, 80] },
  { key: 'near', label: 'Near-Zero Bias', shortLabel: 'Near-Zero', from: REV_END, to: NEAR_END, color: [196, 150, 30] },
  { key: 'forward', label: 'Exponential Forward Conduction', shortLabel: 'Forward Conduction', from: NEAR_END, to: VMAX, color: [50, 150, 90] }
];

function regionOf(V) {
  if (V < REV_END) return REGIONS[0];
  if (V < NEAR_END) return REGIONS[1];
  return REGIONS[2];
}

function compact() { return canvasWidth < 640; }

function draw_J(V, J0, VT) {
  return J0 * (Math.exp(V / VT) - 1);
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  j0Slider = createSlider(-14, -8, -11, 0.1);
  j0Slider.attribute('aria-label', 'Saturation current density exponent, base 10, in amps per square centimeter');
  j0Slider.input(function () { redraw(); });

  tSlider = createSlider(250, 400, 300, 5);
  tSlider.attribute('aria-label', 'Temperature in kelvin');
  tSlider.input(function () { redraw(); });

  t2Slider = createSlider(250, 450, 380, 5);
  t2Slider.attribute('aria-label', 'Second temperature T2 in kelvin, for compare mode');
  t2Slider.input(function () { redraw(); });

  viewSelect = createSelect();
  viewSelect.option('Linear View');
  viewSelect.option('Semi-Log View');
  viewSelect.selected('Linear View');
  viewSelect.attribute('aria-label', 'Chart view mode');
  viewSelect.changed(function () { redraw(); });

  vSlider = createSlider(-2, 0.8, 0.5, 0.01);
  vSlider.attribute('aria-label', 'Voltage marker position');
  vSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Ideal diode I-V curve explorer: plots diode current density versus voltage from the ideal diode equation, in linear or semi-log view, with adjustable saturation current and temperature, labeled reverse-saturation / near-zero-bias / forward-conduction regions, and an optional two-temperature comparison mode', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

// ---- control row layout: fixed 4-row slot list regardless of compare
// mode (the T row's slider is simply swapped for T2's when comparing, so
// toggling compare mode never changes the vertical layout of the other
// three rows -- avoids re-deriving controlHeight on every toggle click). ----
function controlRows() {
  const stacked = compact();
  const rowH = stacked ? 50 : 34;
  const markerRowH = stacked ? 100 : 64;
  const topPad = 10;
  const rows = { stacked: stacked, rowH: rowH, markerRowH: markerRowH };
  rows.j0 = topPad;
  rows.t = topPad + rowH;
  rows.view = topPad + 2 * rowH;
  rows.v = topPad + 3 * rowH;
  rows.bottom = rows.v + markerRowH + 8;
  return rows;
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const rows = controlRows();
  const widgetX = rows.stacked ? 16 : 150;
  const widgetOffsetY = rows.stacked ? 20 : 6;
  const sw = rows.stacked ? Math.min(canvasWidth - 32, 340) : Math.min(canvasWidth - 150 - 30, 320);

  j0Slider.position(bx + widgetX, by + drawHeight + rows.j0 + widgetOffsetY);
  j0Slider.size(sw);

  tSlider.position(bx + widgetX, by + drawHeight + rows.t + widgetOffsetY);
  tSlider.size(sw);
  t2Slider.position(bx + widgetX, by + drawHeight + rows.t + widgetOffsetY);
  t2Slider.size(sw);
  if (compareMode) { tSlider.hide(); t2Slider.show(); } else { t2Slider.hide(); tSlider.show(); }

  viewSelect.position(bx + widgetX, by + drawHeight + rows.view + widgetOffsetY);
  viewSelect.size(sw);

  vSlider.position(bx + widgetX, by + drawHeight + rows.v + widgetOffsetY);
  vSlider.size(sw);
}

// ---------- small formatting helpers ----------
function toSup(exp) {
  const supDigits = { '-': '⁻', '.': '·', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return String(exp).split('').map(c => supDigits[c] || c).join('');
}

function formatSci(v, decimals) {
  if (v === 0) return '0';
  const neg = v < 0;
  const av = Math.abs(v);
  let exp = Math.floor(Math.log10(av));
  let mant = av / Math.pow(10, exp);
  if (mant >= 9.995) { mant /= 10; exp += 1; }
  return (neg ? '−' : '') + mant.toFixed(decimals === undefined ? 2 : decimals) + '×10' + toSup(exp);
}

function niceLinearTicks(minV, maxV, count) {
  if (maxV <= minV) return [minV];
  const range = maxV - minV;
  const roughStep = range / count;
  const mag = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const norm = roughStep / mag;
  let niceNorm = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
  const step = niceNorm * mag;
  const start = Math.ceil(minV / step) * step;
  const ticks = [];
  for (let t = start; t <= maxV + step * 1e-6; t += step) {
    ticks.push(Math.abs(t) < step * 1e-9 ? 0 : t);
  }
  return ticks;
}

function drawRegionBadge(x, y, region, opts) {
  opts = opts || {};
  const sz = opts.size || 11;
  const align = opts.align || 'left';
  push();
  textSize(sz);
  textStyle(BOLD);
  const label = opts.short ? region.shortLabel : region.label;
  const tw = textWidth(label);
  const padX = 8, h = sz + 10;
  let bx;
  if (align === 'center') bx = x - (tw + padX * 2) / 2;
  else if (align === 'right') bx = x - (tw + padX * 2);
  else bx = x;
  noStroke();
  fill(region.color[0], region.color[1], region.color[2]);
  rect(bx, y, tw + padX * 2, h, h / 2);
  fill(255);
  textAlign(CENTER, CENTER);
  text(label, bx + (tw + padX * 2) / 2, y + h / 2 + 1);
  textStyle(NORMAL);
  pop();
  return { x: bx, w: tw + padX * 2, h: h };
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const J0 = Math.pow(10, j0Slider.value());
  const T = tSlider.value();
  const T2 = t2Slider.value();
  const T1 = compareMode ? T_FIXED_COMPARE : T;
  const VT1 = K_EV * T1;
  const VT2 = K_EV * T2;
  const V = vSlider.value();
  const isLog = viewSelect.value() === 'Semi-Log View';
  const Jmark = draw_J(V, J0, VT1);
  const region = regionOf(V);
  const stacked = compact();

  // ---- reserve the top y < 34 strip as blank margin so nothing here
  // collides with the fullscreen-toggle overlay button at top:4px;right:4px
  // when embedded in an iframe. All content below starts at y >= 40. ----
  const TOP = 40;

  fill(20); noStroke(); textAlign(CENTER, TOP);
  smlMathText(canvasWidth / 2, TOP, 'J = J_0(e^(V/V_T) − 1)', { size: stacked ? 13 : 16, align: 'center' });

  // ---- mode toggle: segmented switch, same pattern as Chapter 14's
  // Before/After Contact control. ----
  const btnW = stacked ? canvasWidth - 20 : 400, btnH = 28;
  const btnX = stacked ? 10 : Math.round((canvasWidth - btnW) / 2), btnY = TOP + 26;
  const halfW = (btnW - 4) / 2;
  smlDrawButton(btnX, btnY, halfW, btnH, 'Single Temperature', !compareMode);
  smlDrawButton(btnX + halfW + 4, btnY, halfW, btnH, 'Compare 300K vs T_2', compareMode);
  compareBtnRects = [
    { x: btnX, y: btnY, w: halfW, h: btnH, compare: false },
    { x: btnX + halfW + 4, y: btnY, w: halfW, h: btnH, compare: true }
  ];

  // ---- legend / caption row (blank when not comparing, so chart
  // geometry never has to shift between modes) ----
  const legendY = btnY + btnH + 8;
  if (compareMode) {
    noStroke(); fill(90, 62, 237);
    circle(stacked ? 18 : canvasWidth / 2 - 130, legendY + 8, 9);
    fill(30); textAlign(LEFT, TOP); textSize(stacked ? 10.5 : 11.5);
    smlMathText(stacked ? 28 : canvasWidth / 2 - 118, legendY, 'T_1 = 300 K  (V_T1 = ' + VT1.toFixed(4) + ' V)', { size: stacked ? 10.5 : 11.5 });
    noStroke(); fill(225, 120, 30);
    circle(stacked ? 18 : canvasWidth / 2 + 20, legendY + 26, 9);
    fill(30);
    smlMathText(stacked ? 28 : canvasWidth / 2 + 32, legendY + 18, 'T_2 = ' + T2 + ' K  (V_T2 = ' + VT2.toFixed(4) + ' V)', { size: stacked ? 10.5 : 11.5 });
  }

  // ---- chart geometry ----
  const chartX = stacked ? 58 : 92;
  const chartY = legendY + (compareMode ? 40 : 4);
  const chartW = canvasWidth - chartX - (stacked ? 16 : 28);
  const bottomReserve = stacked ? 92 : 78;
  const chartH = Math.max(120, drawHeight - chartY - bottomReserve);

  // Local coordinate mappers matching what smlDrawLineChart will use
  // internally (same map() formula), computed BEFORE the library call so
  // region bands and the V=0 reference line can be drawn underneath the
  // curve rather than on top of it.
  let yMinView, yMaxView, yBotDecade, yTopDecade;
  const points1 = [], points2 = [];
  if (isLog) {
    for (let v = VMIN; v <= VMAX; v += (VMAX - VMIN) / 220) {
      points1.push({ x: v, y: Math.log10(max(Math.abs(draw_J(v, J0, VT1)), 1e-20)) });
      if (compareMode) points2.push({ x: v, y: Math.log10(max(Math.abs(draw_J(v, J0, VT2)), 1e-20)) });
    }
    const Jmax1 = J0 * Math.exp(VMAX / VT1);
    const Jmax2 = compareMode ? J0 * Math.exp(VMAX / VT2) : Jmax1;
    yTopDecade = Math.ceil(Math.log10(Math.max(Jmax1, Jmax2)) + 1);
    yBotDecade = Math.floor(Math.log10(J0) - 1);
    yMinView = yBotDecade; yMaxView = yTopDecade;
  } else {
    for (let v = VMIN; v <= VMAX; v += (VMAX - VMIN) / 220) {
      points1.push({ x: v, y: draw_J(v, J0, VT1) });
      if (compareMode) points2.push({ x: v, y: draw_J(v, J0, VT2) });
    }
    const Jmax1 = J0 * (Math.exp(VMAX / VT1) - 1);
    const Jmax2 = compareMode ? J0 * (Math.exp(VMAX / VT2) - 1) : Jmax1;
    yMaxView = Math.max(Jmax1, Jmax2) * 1.1;
    yMinView = -J0 * 3;
  }

  function localXToPx(v) { return map(v, VMIN, VMAX, chartX, chartX + chartW); }
  function localYToPx(v) { return map(constrain(v, yMinView, yMaxView), yMinView, yMaxView, chartY + chartH, chartY); }

  // ---- shaded region bands, drawn first so the curve renders on top ----
  noStroke();
  for (const r of REGIONS) {
    const x1 = localXToPx(r.from), x2 = localXToPx(r.to);
    fill(r.color[0], r.color[1], r.color[2], 28);
    rect(x1, chartY, x2 - x1, chartH);
  }
  // reference dashed line at V = 0
  stroke(140); strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(localXToPx(0), chartY, localXToPx(0), chartY + chartH);
  drawingContext.setLineDash([]);

  // ---- linear-view callout: the reverse/near-zero current is real but
  // physically tiny (~J0) next to the forward current, so on a linear
  // axis it is honestly drawn as a flat line -- call that out rather
  // than distorting the axis to fake visibility. ----
  if (!isLog) {
    const boxW = stacked ? chartW - 16 : Math.min(260, chartW - 16);
    const boxX = chartX + 8, boxY = chartY + 8;
    noStroke(); fill(255, 250, 225, 235); stroke(225, 195, 120); strokeWeight(1);
    rect(boxX, boxY, boxW, stacked ? 46 : 40, 6);
    noStroke(); fill(140, 105, 10); textAlign(LEFT, TOP); textSize(stacked ? 9.5 : 10);
    text('Reverse/near-zero current ≈ −J₀, too small to see at\nthis scale. Switch to Semi-Log View to see it clearly.', boxX + 8, boxY + 6, boxW - 16);
  }

  const series = [{ points: points1, color: color(90, 62, 237) }];
  if (compareMode) series.push({ points: points2, color: color(225, 120, 30) });

  const mapping = smlDrawLineChart(chartX, chartY, chartW, chartH, VMIN, VMAX, yMinView, yMaxView, series, {
    marker: { x: V, y: isLog ? Math.log10(max(Math.abs(Jmark), 1e-20)) : Jmark },
    markerColor: color(200, 30, 30)
  });

  // ---- axis ticks + numeric labels (the previous version had none) ----
  noStroke(); fill(50); textSize(stacked ? 9 : 10);
  // x-axis (voltage) ticks at fixed, pedagogically meaningful values
  const vTicks = [-2, -1, 0, 0.5, 0.8].filter(v => v >= VMIN - 1e-9 && v <= VMAX + 1e-9);
  stroke(140); strokeWeight(1);
  textAlign(CENTER, TOP);
  for (const vt of vTicks) {
    const px = mapping.xToPx(vt);
    line(px, chartY + chartH, px, chartY + chartH + 5);
    noStroke();
    text(vt.toFixed(vt === 0 ? 0 : (Number.isInteger(vt) ? 0 : 1)), px, chartY + chartH + 7);
    stroke(140);
  }
  noStroke(); textAlign(CENTER, TOP); fill(40); textSize(stacked ? 10 : 11);
  text('Voltage V (V)', chartX + chartW / 2, chartY + chartH + 20);

  // y-axis (current) ticks
  textAlign(RIGHT, CENTER);
  if (isLog) {
    for (let d = yBotDecade; d <= yTopDecade; d++) {
      const py = mapping.yToPx(d);
      stroke(140); strokeWeight(1);
      line(chartX - 5, py, chartX, py);
      noStroke(); fill(50); textSize(stacked ? 8.5 : 9.5);
      text('10' + toSup(d), chartX - 8, py);
    }
  } else {
    const jTicks = niceLinearTicks(yMinView, yMaxView, 4);
    for (const jt of jTicks) {
      const py = mapping.yToPx(jt);
      stroke(140); strokeWeight(1);
      line(chartX - 5, py, chartX, py);
      noStroke(); fill(50); textSize(stacked ? 8.5 : 9.5);
      text(jt === 0 ? '0' : formatSci(jt, 1), chartX - 8, py);
    }
  }
  push();
  translate(stacked ? 16 : 22, chartY + chartH / 2);
  rotate(-HALF_PI);
  noStroke(); fill(40); textAlign(CENTER, CENTER); textSize(stacked ? 10 : 11);
  text(isLog ? 'log₁₀ |J| (A/cm²)' : 'J (A/cm²)', 0, 0);
  pop();

  // ---- region bracket / label strip under the x-axis ----
  const bracketY = chartY + chartH + 34;
  textSize(stacked ? 8.5 : 9.5);
  for (const r of REGIONS) {
    const x1 = constrain(localXToPx(r.from), chartX, chartX + chartW);
    const x2 = constrain(localXToPx(r.to), chartX, chartX + chartW);
    if (x2 - x1 < 2) continue;
    stroke(r.color[0], r.color[1], r.color[2]); strokeWeight(1.5);
    line(x1 + 2, bracketY, x2 - 2, bracketY);
    line(x1 + 2, bracketY, x1 + 2, bracketY - 4);
    line(x2 - 2, bracketY, x2 - 2, bracketY - 4);
    noStroke(); fill(r.color[0], r.color[1], r.color[2]); textAlign(CENTER, TOP); textStyle(BOLD);
    // text(str,x,y,w) treats x as the wrap box's LEFT edge (not its
    // center) regardless of textAlign, so the box must be built from
    // x1 directly -- passing a center x here (as an earlier version of
    // this line did) pushes the whole box, and the text drawn inside
    // it, off toward/past the chart's right edge.
    const labelW = Math.max(40, x2 - x1);
    const labelX = constrain((x1 + x2) / 2 - labelW / 2, chartX + 2, chartX + chartW - 2 - labelW);
    text(r.shortLabel, labelX, bracketY + 4, labelW);
    textStyle(NORMAL);
  }

  // ---- control-area labels/readouts ----
  drawControlLabels(J0, T, T2, T1, VT1, VT2, V, Jmark, region, stacked);
}

function drawControlLabels(J0, T, T2, T1, VT1, VT2, V, Jmark, region, stacked) {
  const rows = controlRows();
  const sz = stacked ? 12 : 12.5;
  noStroke();

  // J0 row
  fill(30);
  if (stacked) {
    textAlign(LEFT, TOP);
    smlMathText(10, drawHeight + rows.j0, 'J_0 = ' + formatSci(J0) + ' A/cm²', { size: sz });
  } else {
    textAlign(LEFT, TOP);
    smlDrawSubLabel(10, drawHeight + rows.j0 + 9, 'J', '0', { size: sz, baseline: CENTER });
    textAlign(RIGHT, TOP);
    text(formatSci(J0) + ' A/cm²', canvasWidth - 10, drawHeight + rows.j0 + 9);
  }

  // T / T2 row
  fill(30);
  if (!compareMode) {
    if (stacked) {
      textAlign(LEFT, TOP);
      smlMathText(10, drawHeight + rows.t, 'T = ' + T + ' K   (V_T = ' + VT1.toFixed(4) + ' V)', { size: sz });
    } else {
      textAlign(LEFT, TOP);
      text('T', 10, drawHeight + rows.t + 9);
      textAlign(RIGHT, TOP);
      smlMathText(canvasWidth - 10, drawHeight + rows.t + 9, T + ' K   (V_T = ' + VT1.toFixed(4) + ' V)', { size: sz, align: 'right' });
    }
  } else {
    if (stacked) {
      textAlign(LEFT, TOP);
      smlMathText(10, drawHeight + rows.t, 'T_2 = ' + T2 + ' K   (V_T2 = ' + VT2.toFixed(4) + ' V)', { size: sz });
    } else {
      textAlign(LEFT, TOP);
      smlDrawSubLabel(10, drawHeight + rows.t + 9, 'T', '2', { size: sz, baseline: CENTER });
      textAlign(RIGHT, TOP);
      smlMathText(canvasWidth - 10, drawHeight + rows.t + 9, T2 + ' K   (V_T2 = ' + VT2.toFixed(4) + ' V)', { size: sz, align: 'right' });
    }
  }

  // View row
  fill(30); textAlign(LEFT, TOP);
  text('View:', 10, drawHeight + rows.view + 9);

  // V marker row (label/value line + region badge underneath)
  fill(30);
  const markerLineY = drawHeight + rows.v;
  if (stacked) {
    textAlign(LEFT, TOP);
    smlMathText(10, markerLineY, 'V = ' + V.toFixed(2) + ' V  →  J = ' + formatSci(Jmark, 3) + ' A/cm²', { size: sz });
    drawRegionBadge(10, markerLineY + rows.markerRowH - 26, region, { size: stacked ? 10.5 : 11, align: 'left' });
  } else {
    textAlign(LEFT, TOP);
    text('V marker', 10, markerLineY + 9);
    textAlign(RIGHT, TOP);
    smlMathText(canvasWidth - 10, markerLineY + 9, V.toFixed(2) + ' V → J = ' + formatSci(Jmark, 3) + ' A/cm²', { size: sz, align: 'right' });
    drawRegionBadge(10, markerLineY + rows.markerRowH - 24, region, { size: 10.5, align: 'left' });
  }
}

function mousePressed() {
  for (const r of compareBtnRects) {
    if (smlPointInRect(mouseX, mouseY, r.x, r.y, r.w, r.h)) {
      if (compareMode !== r.compare) {
        compareMode = r.compare;
        positionUIElements();
        redraw();
      }
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  minDrawHeight = compact() ? 660 : 520;
  controlHeight = compact() ? 285 : 200;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = Math.max(sz.drawHeight, minDrawHeight);
  canvasHeight = drawHeight + controlHeight; containerHeight = canvasHeight;
}
