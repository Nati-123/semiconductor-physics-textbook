// Majority and Minority Carrier Explorer MicroSim
// A single slider s = log10(n/ni) parametrizes doping continuously from
// strongly p-type (s << 0) through intrinsic (s = 0) to strongly n-type
// (s >> 0). Because n = ni*10^s and p = ni^2/n = ni*10^-s by construction,
// n*p = ni^2 EXACTLY at every slider position -- a direct, always-true
// demonstration of the mass-action relationship (Chapter 9 derives why
// this holds; this MicroSim only previews the consequence).
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let presetSelect, sSlider;
const NI = 1.0e10; // cm^-3, silicon at 300 K
const S_MAX = 6;

const PRESETS = { 'Custom': null, 'Strongly p-type': -5, 'Lightly p-type': -2, 'Intrinsic': 0, 'Lightly n-type': 2, 'Strongly n-type': 5 };

function compact() { return canvasWidth < 480; }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  presetSelect = createSelect();
  Object.keys(PRESETS).forEach(name => presetSelect.option(name));
  presetSelect.selected('Intrinsic');
  presetSelect.attribute('aria-label', 'Doping preset');
  presetSelect.changed(function () {
    const v = PRESETS[presetSelect.value()];
    if (v !== null && v !== undefined) sSlider.value(v);
    redraw();
  });

  sSlider = createSlider(-S_MAX, S_MAX, 0, 0.05);
  sSlider.attribute('aria-label', 'log base 10 of electron concentration over intrinsic concentration');
  sSlider.input(function () { presetSelect.selected('Custom'); redraw(); });

  positionUIElements();
  noLoop();
  describe('Majority and minority carrier explorer: a single slider sweeps doping continuously from strongly p-type through intrinsic to strongly n-type, showing electron and hole concentrations that always satisfy n times p equals ni squared', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function controlX() { return compact() ? 130 : 190; }

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const cx = controlX();
  const sw = min(canvasWidth - cx - 40, 320);
  presetSelect.position(bx + cx, by + drawHeight + 12);
  sSlider.position(bx + cx, by + drawHeight + 50); sSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  const s = sSlider.value();
  const n = NI * Math.pow(10, s);
  const p = (NI * NI) / n;
  const majority = s > 0.05 ? 'n' : (s < -0.05 ? 'p' : 'intrinsic');

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 12.5 : 15);
  text('n × p = ni² = ' + smlFormatConc(NI * NI, { noUnit: true }) + ' cm⁻⁶  (always, at equilibrium)', canvasWidth / 2, 8);

  const leftW = compact() ? canvasWidth : Math.round(canvasWidth * 0.5);
  drawBars(n, p, leftW);
  drawPopulation(compact() ? 0 : leftW, compact() ? drawHeight * 0.48 : 0, compact() ? canvasWidth : canvasWidth - leftW, compact() ? drawHeight * 0.52 : drawHeight, n, p, majority);

  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(compact() ? 11 : 13);
  text('Preset:', controlX() - 10, drawHeight + 24);
  text('log₁₀(n/ni): ' + s.toFixed(2), controlX() - 10, drawHeight + 62);
}

function drawBars(n, p, panelW) {
  const barX = 60, barY = 40, barW = panelW - 100, barH = (compact() ? drawHeight * 0.48 : drawHeight) - 110;
  const yMax = 6, yMin = -6; // decades above/below ni

  noFill(); stroke(210); strokeWeight(1);
  rect(barX, barY, barW, barH);
  stroke(150); strokeWeight(1);
  drawingContext.setLineDash([2, 2]);
  const niY = map(0, yMin, yMax, barY + barH, barY);
  line(barX, niY, barX + barW, niY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90); textAlign(LEFT, CENTER); textSize(compact() ? 9 : 10);
  text('ni', barX + 4, niY - 8);

  const nLog = constrain(Math.log10(n / NI), yMin, yMax);
  const pLog = constrain(Math.log10(p / NI), yMin, yMax);
  const barSpacing = barW / 3;

  drawOneBar(barX + barSpacing * 0.8, niY, barSpacing * 0.55, nLog, yMin, yMax, barY, barH, color(90, 62, 237), 'n');
  drawOneBar(barX + barSpacing * 2.1, niY, barSpacing * 0.55, pLog, yMin, yMax, barY, barH, color(200, 90, 90), 'p');

  fill(20); noStroke(); textAlign(CENTER, TOP); textSize(compact() ? 10 : 11.5);
  text('n = ' + smlFormatConc(n), barX + barSpacing * 0.8, barY + barH + 8);
  text('p = ' + smlFormatConc(p), barX + barSpacing * 2.1, barY + barH + 8);

  fill(20); textAlign(CENTER, TOP); textSize(compact() ? 10 : 12);
  text('Carrier concentration (log scale, decades from ni)', barX + barW / 2, barY + barH + 30);
}

function drawOneBar(cx, baseY, w, logVal, yMin, yMax, barY, barH, col, label) {
  const topY = map(logVal, yMin, yMax, barY + barH, barY);
  const y0 = min(baseY, topY), h = abs(baseY - topY);
  noStroke(); fill(col);
  rect(cx - w / 2, y0, w, max(h, 1.5));
}

// Illustrative population cartoon: NOT to literal scale (real n:p ratios
// can span 12+ orders of magnitude and cannot be drawn as literal dot
// counts). A fixed pool of icons is split by relative dominance so
// students still see "more electrons" vs "more holes" qualitatively.
function drawPopulation(panelX, panelY, panelW, panelH, n, p, majority) {
  // extra top margin on the non-compact (side-by-side) layout, where this
  // panel's top otherwise falls directly under the title text drawn at y=8
  const topGap = compact() ? 6 : 30;
  noStroke(); fill(248); stroke(210); strokeWeight(1);
  rect(panelX + 10, panelY + topGap, panelW - 20, panelH - (compact() ? 60 : 94));

  const s = Math.log10(n / p) / 2; // symmetric dominance measure
  const dominance = constrain(0.5 + 0.45 * constrain(s / S_MAX, -1, 1), 0.05, 0.95);
  const TOTAL = 16;
  const nCount = majority === 'p' ? Math.max(1, Math.round(TOTAL * (1 - dominance))) : Math.round(TOTAL * dominance);
  const pCount = TOTAL - nCount;

  const cols = 4, rows = 4;
  const cellW = (panelW - 40) / cols, cellH = (panelH - (compact() ? 90 : 124)) / rows;
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = panelX + 20 + cellW * (c + 0.5), cy = panelY + topGap + 10 + cellH * (r + 0.5);
      if (idx < nCount) smlDrawElectron(cx, cy, compact() ? 11 : 13);
      else smlDrawHole(cx, cy, compact() ? 11 : 13);
      idx++;
    }
  }

  fill(90); noStroke(); textAlign(CENTER, TOP); textSize(compact() ? 8.5 : 9.5);
  text('Schematic only -- not to scale (real ratios span many orders of magnitude)', panelX + panelW / 2, panelY + topGap + 10 + cellH * rows + 4);

  const badgeY = panelY + panelH - (compact() ? 46 : 54);
  const info = {
    n: { name: 'n-type: electrons are majority', bg: color(230, 235, 255), bd: color(90, 62, 237), tx: color(90, 62, 237) },
    p: { name: 'p-type: holes are majority', bg: color(255, 230, 230), bd: color(200, 90, 90), tx: color(200, 90, 90) },
    intrinsic: { name: 'Intrinsic: n = p = ni', bg: color(240, 240, 245), bd: color(130, 130, 150), tx: color(90, 90, 110) }
  }[majority];
  noStroke(); fill(info.bg); stroke(info.bd); strokeWeight(1.5);
  rect(panelX + 16, badgeY, panelW - 32, compact() ? 26 : 30, 6);
  noStroke(); fill(info.tx); textAlign(CENTER, CENTER); textSize(compact() ? 11.5 : 13.5);
  text(info.name, panelX + panelW / 2, badgeY + (compact() ? 13 : 15));
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 160 : 150;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 640);
}
