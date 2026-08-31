// Minority Carrier Injection Profile Explorer MicroSim
// Compares the long-base (exponential) and short-base (linear) excess
// minority carrier profiles injected at a p-n junction's depletion edge
// under forward bias, normalized to the peak injected concentration so
// their shapes can be compared directly regardless of applied voltage.
//   Long-base:  Δp(x') = Δp(0)·e^(-x'/Lp)          (contact effectively
//     infinitely far away; carriers decay via diffusion+recombination)
//   Short-base: Δp(x') = Δp(0)·(1 - x'/W')          (contact very close;
//     forced to zero there, negligible recombination -> straight line)
//   Δp(0) = pn0·(e^(V/VT) - 1)
// A regime badge classifies the current Lp/W' ratio as clearly
// short-base, clearly long-base, or a transition in between.
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 400;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let vSlider, lpSlider, wpSlider;

const KT_Q = 0.0259;
const PN0 = 2.25e4; // cm^-3, matches chapter worked examples
const XMAX = 80;

// Fixed layout constants shared by both compact and wide modes.
const TITLE_Y = 8;
const BADGE_Y = 36; // kept clear of the fullscreen-toggle button's y<34 zone
const BADGE_H = 26;
const RATIO_Y = 66;
const CHART_TOP = 104;
const XLABEL_GAP = 26; // room for smlDrawLineChart's own xLabel row

function compact() { return canvasWidth < 640; }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  vSlider = createSlider(0.1, 0.65, 0.5, 0.01);
  vSlider.attribute('aria-label', 'Applied forward bias voltage');
  vSlider.input(function () { redraw(); });
  lpSlider = createSlider(10, 60, 35, 1);
  lpSlider.attribute('aria-label', 'Minority carrier diffusion length Lp in micrometers');
  lpSlider.input(function () { redraw(); });
  wpSlider = createSlider(1, 60, 8, 1);
  wpSlider.attribute('aria-label', 'Short-base quasi-neutral width Wprime in micrometers');
  wpSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Minority carrier injection profile explorer: compares long-base exponential and short-base linear excess carrier profiles injected at a p-n junction depletion edge under forward bias, with a regime badge showing whether the current settings are short-base, long-base, or a transition case', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function controlRows() {
  const stacked = compact();
  const rowH = stacked ? 54 : 38;
  const topPad = 12;
  return {
    stacked: stacked, rowH: rowH,
    v: topPad, lp: topPad + rowH, wp: topPad + 2 * rowH,
    bottom: topPad + 3 * rowH + 6
  };
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const rows = controlRows();
  const widgetX = rows.stacked ? 16 : 170;
  const widgetOffsetY = rows.stacked ? 20 : 8;
  const sw = rows.stacked ? Math.min(canvasWidth - 32, 340) : Math.min(canvasWidth - 170 - 30, 320);

  vSlider.position(bx + widgetX, by + drawHeight + rows.v + widgetOffsetY);
  vSlider.size(sw);
  lpSlider.position(bx + widgetX, by + drawHeight + rows.lp + widgetOffsetY);
  lpSlider.size(sw);
  wpSlider.position(bx + widgetX, by + drawHeight + rows.wp + widgetOffsetY);
  wpSlider.size(sw);
}

// Classifies the current Lp/W' ratio. Both "clean-cut" limiting cases
// (clearly short-base, clearly long-base) get the same green treatment
// used elsewhere in the chapter for a well-defined regime; the messy
// in-between case gets the neutral/purple "transition" treatment.
function regimeInfo(ratio) {
  if (ratio > 3) {
    return { label: 'Short-base regime', fill: [231, 247, 231], border: [76, 175, 80], text: [27, 94, 32] };
  }
  if (ratio < 0.5) {
    return { label: 'Long-base regime', fill: [231, 247, 231], border: [76, 175, 80], text: [27, 94, 32] };
  }
  return { label: 'Transition regime', fill: [240, 235, 255], border: [144, 97, 249], text: [90, 62, 237] };
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const V = vSlider.value();
  const Lp = lpSlider.value();
  const Wp = wpSlider.value();
  const peak = PN0 * (Math.exp(V / KT_Q) - 1);
  const ratio = Lp / Wp;

  fill(20); noStroke(); textAlign(CENTER, TOP);
  smlMathText(canvasWidth / 2, TITLE_Y,
    compact() ? 'Excess Carrier Profile (normalized to Δp(0))' : 'Excess Minority Carrier Profile, normalized to Δp(0)',
    { size: compact() ? 12 : 15, align: 'center' });

  drawRegimeBadge(ratio);

  const wide = !compact();
  let chartX, chartW, cardX, cardW;
  if (wide) {
    const colSplit = Math.round(canvasWidth * 0.60);
    chartX = 55;
    chartW = colSplit - chartX - 15;
    cardX = colSplit + 15;
    cardW = canvasWidth - cardX - 16;
  } else {
    chartX = 50;
    chartW = canvasWidth - chartX - 20;
    cardX = 10;
    cardW = canvasWidth - 20;
  }

  const cardH = resultCardHeight();
  const captionH = compact() ? 46 : 40;
  let chartH;
  if (wide) {
    chartH = drawHeight - CHART_TOP - XLABEL_GAP - captionH - 10;
  } else {
    chartH = drawHeight - CHART_TOP - XLABEL_GAP - captionH - 12 - cardH - 12;
  }
  chartH = Math.max(chartH, 140);

  const chartY = CHART_TOP;
  drawChart(chartX, chartY, chartW, chartH, Lp, Wp);
  drawCaption(chartX, chartY + chartH + XLABEL_GAP, chartW, captionH);

  const cardY = wide ? CHART_TOP : (chartY + chartH + XLABEL_GAP + captionH + 12);
  drawResultCard(cardX, cardY, cardW, cardH, V, peak);

  drawControlLabels(V, Lp, Wp);
}

function resultCardHeight() {
  const lineH = compact() ? 20 : 19;
  const nLines = 3;
  const noteH = compact() ? 0 : 34;
  return 12 + 26 + nLines * lineH + 14 + noteH;
}

function drawRegimeBadge(ratio) {
  const info = regimeInfo(ratio);
  textSize(compact() ? 12 : 12.5);
  const label = info.label;
  const pillW = textWidth(label) + 34;
  const pillH = BADGE_H;
  const px = canvasWidth / 2 - pillW / 2;
  const py = BADGE_Y;

  stroke(info.border); strokeWeight(1.5);
  fill(info.fill);
  rect(px, py, pillW, pillH, pillH / 2);

  noStroke(); fill(info.border);
  circle(px + 14, py + pillH / 2, 8);

  noStroke(); fill(info.text); textStyle(BOLD);
  textAlign(LEFT, CENTER);
  text(label, px + 24, py + pillH / 2 + 1);
  textStyle(NORMAL);

  noStroke(); fill(90); textAlign(CENTER, TOP);
  smlMathText(canvasWidth / 2, RATIO_Y, 'L_p / W\' = ' + ratio.toFixed(2), { size: compact() ? 10 : 10.5, align: 'center' });
}

function drawChart(chartX, chartY, chartW, chartH, Lp, Wp) {
  const longPts = [], shortPts = [];
  for (let x = 0; x <= XMAX; x += XMAX / 120) {
    longPts.push({ x: x, y: Math.exp(-x / Lp) });
    shortPts.push({ x: x, y: max(0, 1 - x / Wp) });
  }

  smlDrawLineChart(chartX, chartY, chartW, chartH, 0, XMAX, 0, 1.08, [
    { points: longPts, color: color(90, 62, 237) },
    { points: shortPts, color: color(230, 90, 60) }
  ], {
    xLabel: "Distance from injection edge, x' (μm)",
    yLabel: "Δp(x') / Δp(0)",
    yLabelOffset: compact() ? 38 : 44,
    marker: { x: 0, y: 1 },
    markerColor: color(60)
  });

  // ---- injection-edge callout: a short dashed tick above the chart's
  // top-left corner (where x'=0 sits) plus a small downward-pointing
  // triangle and label, so the meaning of x'=0 is explicit on the chart
  // itself instead of only implied by the axis label. ----
  stroke(120); strokeWeight(1); drawingContext.setLineDash([3, 3]);
  line(chartX, chartY - 14, chartX, chartY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90);
  triangle(chartX - 3, chartY - 7, chartX + 3, chartY - 7, chartX, chartY - 1);
  textAlign(LEFT, BOTTOM); textSize(compact() ? 9.5 : 10.5);
  text(compact() ? "x' = 0 (edge)" : "injection edge (x' = 0)", chartX + 6, chartY - 2);

  // ---- legend, drawn as a small readable card inside the chart's
  // top-right corner (instead of raw corner text with no context),
  // using smlMathText so Lp renders with a real subscript. ----
  const legW = compact() ? Math.min(chartW - 16, 180) : 200;
  const legH = 46;
  const legX = chartX + chartW - legW - 8;
  const legY = chartY + 8;
  noStroke(); fill(255, 255, 255, 235); stroke(220); strokeWeight(1);
  rect(legX - 8, legY - 6, legW + 16, legH, 6);
  noStroke();
  fill(90, 62, 237); rect(legX, legY + 4, 12, 3);
  smlMathText(legX + 18, legY - 2, "Long-base: e^(−x'/L_p)", { size: compact() ? 10 : 10.5, color: color(90, 62, 237) });
  fill(230, 90, 60); rect(legX, legY + 24, 12, 3);
  smlMathText(legX + 18, legY + 18, "Short-base: 1 − x'/W'", { size: compact() ? 10 : 10.5, color: color(230, 90, 60) });
}

function drawCaption(x, y, w, h) {
  noStroke(); textAlign(LEFT, TOP);
  const sz = compact() ? 10 : 10.5;
  fill(90, 62, 237); textSize(sz);
  text('● Long-base: far contact → exponential decay.', x, y, w);
  fill(230, 90, 60);
  text('● Short-base: near contact → zero there, linear.', x, y + h / 2, w);
}

function drawResultCard(cx, cy, cw, ch, V, peak) {
  const sz = compact() ? 11 : 11.5;
  const lineH = compact() ? 20 : 19;

  noStroke(); fill(240, 245, 255);
  stroke(168, 200, 255); strokeWeight(1.5);
  rect(cx, cy, cw, ch, 10);

  noStroke(); fill(90, 62, 237); textAlign(CENTER, TOP); textStyle(BOLD);
  smlMathText(cx + cw / 2, cy + 12, 'Δp(0) = ' + peak.toExponential(2) + ' cm⁻³',
    { size: compact() ? 15 : 16, align: 'center', color: color(90, 62, 237) });
  textStyle(NORMAL);

  fill(30);
  let ly = cy + 44;
  smlMathText(cx + 14, ly, 'Δp(0) = pn0·(e^(V/V_T) − 1)', { size: sz }); ly += lineH;
  smlMathText(cx + 14, ly, 'pn0 = ' + PN0.toExponential(2) + ' cm⁻³', { size: sz }); ly += lineH;
  smlMathText(cx + 14, ly, 'V = ' + V.toFixed(2) + ' V,  V_T = ' + KT_Q.toFixed(4) + ' V', { size: sz }); ly += lineH;

  if (!compact()) {
    noStroke(); fill(90); textAlign(LEFT, TOP); textSize(10);
    text('Δp(0) grows exponentially with V — each +60 mV roughly multiplies it by 10× (since kT/q ≈ 25.9 mV).', cx + 14, ly + 6, cw - 28);
  }
}

function drawControlLabels(V, Lp, Wp) {
  const rows = controlRows();
  const sz = compact() ? 12 : 13;
  fill(30); noStroke(); textSize(sz);
  if (rows.stacked) {
    textAlign(LEFT, TOP);
    text('V = ' + V.toFixed(2) + ' V', 10, drawHeight + rows.v);
    smlMathText(10, drawHeight + rows.lp, 'L_p = ' + Lp + ' μm', { size: sz });
    text('W\' = ' + Wp + ' μm', 10, drawHeight + rows.wp);
  } else {
    textAlign(LEFT, TOP);
    text('V', 10, drawHeight + rows.v + 9);
    smlDrawSubLabel(10, drawHeight + rows.lp + 9 + sz * 0.36, 'L', 'p', { size: sz, baseline: CENTER });
    text('W\'', 10, drawHeight + rows.wp + 9);
    textAlign(RIGHT, TOP);
    text(V.toFixed(2) + ' V', canvasWidth - 10, drawHeight + rows.v + 9);
    text(Lp + ' μm', canvasWidth - 10, drawHeight + rows.lp + 9);
    text(Wp + ' μm', canvasWidth - 10, drawHeight + rows.wp + 9);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  minDrawHeight = compact() ? 480 : 400;
  controlHeight = compact() ? 200 : 150;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  drawHeight = Math.max(drawHeight, minDrawHeight);
}
