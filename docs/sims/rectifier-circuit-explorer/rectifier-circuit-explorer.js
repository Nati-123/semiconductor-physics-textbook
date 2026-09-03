// Rectifier Circuit Explorer MicroSim
// Plots an AC input waveform and the resulting half-wave or full-wave
// rectified output, with average DC output voltage computed and marked,
// plus a simplified conduction-path schematic for each half-cycle.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 780;
let drawHeight = 585;
let minDrawHeight = 585;
let controlHeight = 175;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let typeSelect, vpeakSlider, vfSlider;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  typeSelect = createSelect();
  typeSelect.option('Half-Wave');
  typeSelect.option('Full-Wave (Bridge)');
  typeSelect.selected('Full-Wave (Bridge)');
  typeSelect.attribute('aria-label', 'Rectifier type');

  vpeakSlider = createSlider(20, 200, 170, 1);
  vpeakSlider.attribute('aria-label', 'Peak AC input voltage');
  vfSlider = createSlider(0, 1.5, 0.7, 0.05);
  vfSlider.attribute('aria-label', 'Diode forward voltage drop');

  positionUIElements();
  describe('Rectifier circuit explorer: plots an AC input waveform and the half-wave or full-wave rectified output, with average DC voltage computed and a conduction-path schematic for each half-cycle', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  typeSelect.position(bx + 170, by + drawHeight + 12);
  vpeakSlider.position(bx + 170, by + drawHeight + 50);
  vpeakSlider.size(min(canvasWidth - 190 - 30, 320));
  vfSlider.position(bx + 170, by + drawHeight + 88);
  vfSlider.size(min(canvasWidth - 190 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const isFull = typeSelect.value() === 'Full-Wave (Bridge)';
  const Vpeak = vpeakSlider.value();
  const VF = vfSlider.value();
  const nDiodes = isFull ? 2 : 1;
  const VoutPeak = max(Vpeak - nDiodes * VF, 0);
  const Vdc = isFull ? (2 * VoutPeak) / PI : VoutPeak / PI;

  // ---------- Title (kept clear of the fixed top-right fullscreen button) ----------
  noStroke();
  fill(isFull ? color(90, 62, 237) : color(210, 90, 30));
  textAlign(CENTER, TOP); textSize(16);
  text(isFull ? 'Full-Wave Bridge Rectifier' : 'Half-Wave Rectifier', canvasWidth / 2, 6);

  // ---------- Equation (symbolic only; substituted numbers live in Calculated Results) ----------
  fill(40);
  const eq = isFull
    ? 'V_DC ≈ 2(V_peak − 2V_F) / π'
    : 'V_DC ≈ (V_peak − V_F) / π';
  smlMathText(canvasWidth / 2, 26, eq, { align: 'center', size: 13 });

  // ---------- Waveform charts ----------
  const chartTop = 54;
  const chartX = 78, chartW = canvasWidth - chartX - 26;
  const rowH = 118;
  const VMIN_IN = -Vpeak * 1.2, VMAX_IN = Vpeak * 1.2;
  const VMIN_OUT = -Vpeak * 0.2, VMAX_OUT = Vpeak * 1.2;

  const angTicks = [
    { v: 0, label: '0' }, { v: PI, label: 'π' }, { v: 2 * PI, label: '2π' },
    { v: 3 * PI, label: '3π' }, { v: 4 * PI, label: '4π' }
  ];

  fill(30); noStroke(); textAlign(LEFT, BOTTOM); textSize(11.5);
  text('AC Input', chartX, chartTop - 4);
  const inPts = [];
  for (let px = 0; px <= 300; px++) {
    const t = map(px, 0, 300, 0, 4 * PI);
    inPts.push({ x: t, y: Vpeak * sin(t) });
  }
  const vTicksIn = niceTicks(VMIN_IN, VMAX_IN, 5);
  smlDrawLineChart(chartX, chartTop, chartW, rowH, 0, 4 * PI, VMIN_IN, VMAX_IN,
    [{ points: inPts, color: color(90, 62, 237) }],
    { xTicks: angTicks, yTicks: vTicksIn, yTickFormat: v => v.toFixed(0), yLabel: 'Voltage (V)', yLabelOffset: 44 });

  const outTop = chartTop + rowH + 40;
  fill(30); noStroke(); textAlign(LEFT, BOTTOM); textSize(11.5);
  text('Rectified Output', chartX, outTop - 4);
  const outPts = [];
  for (let px = 0; px <= 300; px++) {
    const t = map(px, 0, 300, 0, 4 * PI);
    const s = Vpeak * sin(t);
    let v;
    if (isFull) {
      v = max(abs(s) - nDiodes * VF, 0);
    } else {
      v = s <= 0 ? 0 : max(s - nDiodes * VF, 0);
    }
    outPts.push({ x: t, y: v });
  }
  const vTicksOut = niceTicks(VMIN_OUT, VMAX_OUT, 5);
  const outInfo = smlDrawLineChart(chartX, outTop, chartW, rowH, 0, 4 * PI, VMIN_OUT, VMAX_OUT,
    [{ points: outPts, color: color(230, 90, 60) }],
    {
      xTicks: angTicks,
      yTicks: vTicksOut, yTickFormat: v => v.toFixed(0), yLabel: 'Voltage (V)', yLabelOffset: 44
    });
  // Drawn manually (not via opts.xLabel) so it sits clear below the tick
  // row instead of overlapping the centered "2π" tick label.
  noStroke(); fill(40); textAlign(CENTER, TOP); textSize(11);
  text('Electrical angle ωt (rad)', chartX + chartW / 2, outTop + rowH + 20);

  stroke(40, 150, 90); strokeWeight(1.5); drawingContext.setLineDash([4, 3]);
  line(chartX, outInfo.yToPx(Vdc), chartX + chartW, outInfo.yToPx(Vdc));
  drawingContext.setLineDash([]);
  noStroke(); fill(40, 150, 90); textAlign(LEFT, BOTTOM); textSize(10.5);
  text('V_DC = ' + Vdc.toFixed(2) + ' V (average)', chartX + 4, outInfo.yToPx(Vdc) - 3);

  fill(120); noStroke(); textAlign(LEFT, TOP); textSize(10);
  const legendY = outTop + rowH + 38;
  text('— purple: AC input      — red: rectified output      ┄ green: average V_DC', chartX, legendY);

  // ---------- Conduction-path schematics ----------
  const schemLabelY = legendY + 22;
  const schemTop = schemLabelY + 16;
  const schemH = 132;
  const gap = 16;
  const panelW = (canvasWidth - 60 - gap) / 2;
  const px1 = 30, px2 = px1 + panelW + gap;

  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(12);
  text('Conduction path by half-cycle:', 30, schemLabelY);

  if (isFull) {
    drawBridgePanel(px1, schemTop, panelW, schemH, 'D1D4', 'Positive Half-Cycle (0 to π)',
      'D1 & D4 ON — current: AC→D1→Load(+)→Load(−)→D4→AC');
    drawBridgePanel(px2, schemTop, panelW, schemH, 'D2D3', 'Negative Half-Cycle (π to 2π)',
      'D2 & D3 ON — current: AC→D2→Load(+)→Load(−)→D3→AC');
  } else {
    drawHalfWavePanel(px1, schemTop, panelW, schemH, true, 'Positive Half-Cycle (0 to π)',
      'Diode ON — forward-biased, current flows to load');
    drawHalfWavePanel(px2, schemTop, panelW, schemH, false, 'Negative Half-Cycle (π to 2π)',
      'Diode OFF — reverse-biased, load voltage = 0');
  }

  // ---------- Dynamic explanation ----------
  const explTop = schemTop + schemH + 14;
  fill(50); noStroke(); textAlign(LEFT, TOP); textSize(11.5);
  const explanation = isFull
    ? 'A full-wave bridge uses four diodes so that two of them always conduct in series, routing both AC half-cycles through the load in the same polarity — this is why 2×V_F (not V_F) is subtracted from V_peak, and why the average output is roughly double that of half-wave rectification.'
    : 'A half-wave rectifier passes current only when the diode is forward-biased (positive half-cycle); during the negative half-cycle the diode blocks all current, so the load voltage is zero for half of every cycle — this "choppier" waveform has roughly half the average V_DC of a full-wave bridge for the same V_peak.';
  text(explanation, 30, explTop, canvasWidth - 60);

  // ---------- Controls (left of sliders) ----------
  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12.5);
  text('Type:', 10, drawHeight + 18);
  text('Vpeak = ' + Vpeak.toFixed(0) + ' V', 10, drawHeight + 56);
  text('VF (per diode) = ' + VF.toFixed(2) + ' V', 10, drawHeight + 94);

  // ---------- Calculated results (separated, full-width row below all sliders) ----------
  stroke(225); strokeWeight(1);
  line(10, drawHeight + 116, canvasWidth - 10, drawHeight + 116);
  noStroke(); fill(20); textAlign(LEFT, TOP); textSize(11.5);
  text('Calculated Results', 10, drawHeight + 122);
  textSize(11); fill(60);
  text('Diodes conducting at once: ' + nDiodes + '      Output peak V_out,peak = ' + VoutPeak.toFixed(2) + ' V',
    10, drawHeight + 140, canvasWidth - 20);
  fill(40, 150, 90);
  text('Average V_DC = ' + Vdc.toFixed(2) + ' V      (ripple frequency: ' + (isFull ? '2×' : '1×') + ' line frequency)',
    10, drawHeight + 156, canvasWidth - 20);
}

// Evenly spaced "nice-ish" ticks spanning [lo,hi] with roughly `n` steps.
function niceTicks(lo, hi, n) {
  const raw = (hi - lo) / n;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10) * mag;
  const start = Math.ceil(lo / step) * step;
  const ticks = [];
  for (let v = start; v <= hi + 1e-9; v += step) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}

function drawNodeDot(x, y) { noStroke(); fill(60); circle(x, y, 4); }

function drawDiodeSeg(x1, y1, x2, y2, conducting) {
  const ang = atan2(y2 - y1, x2 - x1);
  const midx = (x1 + x2) / 2, midy = (y1 + y2) / 2;
  const s = 8;
  const bx1 = midx - cos(ang) * s, by1 = midy - sin(ang) * s;
  const perpX = -sin(ang), perpY = cos(ang);
  const col = conducting ? color(40, 150, 90) : color(190);
  push();
  stroke(col); strokeWeight(conducting ? 2.4 : 1.2);
  line(x1, y1, bx1, by1);
  noStroke(); fill(col);
  triangle(
    bx1 + perpX * s * 0.8, by1 + perpY * s * 0.8,
    bx1 - perpX * s * 0.8, by1 - perpY * s * 0.8,
    midx + cos(ang) * s, midy + sin(ang) * s
  );
  const barX = midx + cos(ang) * s, barY = midy + sin(ang) * s;
  stroke(col); strokeWeight(conducting ? 2.4 : 1.2);
  line(barX + perpX * s * 0.9, barY + perpY * s * 0.9, barX - perpX * s * 0.9, barY - perpY * s * 0.9);
  line(barX, barY, x2, y2);
  pop();
}

// Labels a diode by pushing outward from the diamond's center (cx,cy) rather
// than perpendicular to the segment, so D1/D3 (which share node A) and
// D2/D4 (which share node B) land in visibly different spots instead of
// overlapping at their common node.
function drawDiodeLabel(x1, y1, x2, y2, cx, cy, label, conducting) {
  const midx = (x1 + x2) / 2, midy = (y1 + y2) / 2;
  let dx = midx - cx, dy = midy - cy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  dx /= len; dy /= len;
  noStroke(); fill(conducting ? color(20, 110, 65) : color(150));
  textAlign(CENTER, CENTER); textSize(9.5);
  text(label, midx + dx * 13, midy + dy * 13);
}

function drawSourceIcon(x, y, r, label) {
  push();
  stroke(90, 62, 237); strokeWeight(1.5); fill(255);
  circle(x, y, r * 2);
  noFill();
  beginShape();
  for (let a = -PI; a <= PI; a += 0.25) {
    vertex(x + a * (r * 0.42 / PI), y - sin(a * 2) * r * 0.32);
  }
  endShape();
  noStroke(); fill(70); textAlign(CENTER, TOP); textSize(9.5);
  text(label || 'AC', x, y + r + 3);
  pop();
}

function drawLoadIcon(x, y, w, h, label) {
  push();
  stroke(70); strokeWeight(1.5); fill(255, 245, 225);
  rect(x - w / 2, y - h / 2, w, h, 2);
  noStroke(); fill(90); textAlign(CENTER, CENTER); textSize(9);
  push(); translate(x, y); rotate(HALF_PI); text(label || 'RL', 0, 0); pop();
  pop();
}

function drawBridgePanel(x, y, w, h, activePair, headline, caption) {
  noStroke(); fill(30); textAlign(CENTER, TOP); textSize(10.5);
  text(headline, x, y, w);

  const cy = y + h * 0.5, dh = 24, dw = w * 0.12;
  const cx = x + w * 0.5;
  const P = { x: cx, y: cy - dh };
  const N = { x: cx, y: cy + dh };
  const A = { x: cx - dw, y: cy };
  const B = { x: cx + dw, y: cy };

  const srcX = x + w * 0.14, srcR = 12;
  const loadX = x + w * 0.86, loadW = 15, loadH = 24;

  stroke(150); strokeWeight(1.1); noFill();
  line(srcX + srcR, A.y, A.x, A.y);
  const topRailY = cy - dh - 22;
  line(srcX, cy - srcR, srcX, topRailY);
  line(srcX, topRailY, B.x, topRailY);
  line(B.x, topRailY, B.x, B.y);
  const pRailY = cy - dh - 11;
  line(P.x, P.y, P.x, pRailY);
  line(P.x, pRailY, loadX, pRailY);
  line(loadX, pRailY, loadX, cy - loadH / 2);
  const nRailY = cy + dh + 11;
  line(N.x, N.y, N.x, nRailY);
  line(N.x, nRailY, loadX, nRailY);
  line(loadX, nRailY, loadX, cy + loadH / 2);

  drawSourceIcon(srcX, cy, srcR, 'AC');
  drawLoadIcon(loadX, cy, loadW, loadH, 'RL');

  const d1 = activePair === 'D1D4', d2 = activePair === 'D2D3';
  drawDiodeSeg(A.x, A.y, P.x, P.y, d1);
  drawDiodeSeg(B.x, B.y, P.x, P.y, d2);
  drawDiodeSeg(N.x, N.y, A.x, A.y, d2);
  drawDiodeSeg(N.x, N.y, B.x, B.y, d1);
  drawDiodeLabel(A.x, A.y, P.x, P.y, cx, cy, 'D1', d1);
  drawDiodeLabel(B.x, B.y, P.x, P.y, cx, cy, 'D2', d2);
  drawDiodeLabel(N.x, N.y, A.x, A.y, cx, cy, 'D3', d2);
  drawDiodeLabel(N.x, N.y, B.x, B.y, cx, cy, 'D4', d1);
  [P, N, A, B].forEach(function (pt) { drawNodeDot(pt.x, pt.y); });

  noStroke(); textAlign(CENTER, BOTTOM); textSize(9);
  fill(40, 150, 90); text('+', P.x + 10, P.y - 1);
  fill(210, 60, 60); textAlign(CENTER, TOP); text('−', N.x + 10, N.y + 2);

  noStroke(); fill(60); textAlign(CENTER, TOP); textSize(9);
  text(caption, x + 3, y + h - 30, w - 6);
}

function drawHalfWavePanel(x, y, w, h, conducting, headline, caption) {
  noStroke(); fill(30); textAlign(CENTER, TOP); textSize(10.5);
  text(headline, x, y, w);

  const cy = y + h * 0.5;
  const srcX = x + w * 0.14, srcR = 12;
  const loadX = x + w * 0.82, loadW = 15, loadH = 24;
  const topY = cy - 24, botY = cy + 24;
  const dX1 = x + w * 0.38, dX2 = x + w * 0.6;

  stroke(150); strokeWeight(1.1); noFill();
  line(srcX, cy - srcR, srcX, topY);
  line(srcX, topY, dX1, topY);
  line(dX2, topY, loadX, topY);
  line(loadX, topY, loadX, cy - loadH / 2);
  line(srcX, cy + srcR, srcX, botY);
  line(srcX, botY, loadX, botY);
  line(loadX, botY, loadX, cy + loadH / 2);

  drawSourceIcon(srcX, cy, srcR, 'AC');
  drawLoadIcon(loadX, cy, loadW, loadH, 'RL');
  drawDiodeSeg(dX1, topY, dX2, topY, conducting);
  noStroke(); fill(conducting ? color(20, 110, 65) : color(150));
  textAlign(CENTER, BOTTOM); textSize(9.5);
  text('D1', (dX1 + dX2) / 2, topY - 8);
  drawNodeDot(dX1, topY); drawNodeDot(dX2, topY);

  noStroke(); fill(60); textAlign(CENTER, TOP); textSize(9);
  text(caption, x + 3, y + h - 30, w - 6);
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
