// Quasi-Fermi Level Explorer MicroSim
// Draws a schematic silicon band diagram showing the electron and hole
// quasi-Fermi levels splitting apart from the equilibrium Fermi level
// (computed relative to the intrinsic level, then offset by doping) as
// excess carrier injection Δn increases.
//   n = n0 + Δn,  p = p0 + Δn
//   E_Fn − E_i = kT ln(n/ni)
//   E_i − E_Fp = kT ln(p/ni)
// At equilibrium (Δn=0) both reduce to the same E_F, drawn as a single
// combined line/label instead of two coincident, overlapping ones.
// The two levels animate smoothly toward their target positions each
// frame so dragging Δn visibly shows the splitting happen, rather than
// jumping instantly.
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 220;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let dopingTypeSelect, dopingExpSlider, dnExpSlider;

const KB_EV = 8.617e-5;
const T = 300;
const kT = KB_EV * T;
const NI = 1.5e10;
const EG = 1.12;

// Animated (eased) display positions for the two quasi-Fermi lines, in
// eV-above-E_i units (same convention as efnMinusEi/eiMinusEfp below).
let animEfn = 0, animEfp = 0, animInit = false;

function compact() { return canvasWidth < 640; }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  dopingTypeSelect = createSelect();
  dopingTypeSelect.option('n-type');
  dopingTypeSelect.option('p-type');
  dopingTypeSelect.selected('n-type');
  dopingTypeSelect.attribute('aria-label', 'Doping type');
  dopingTypeSelect.changed(function () { redraw(); });

  dopingExpSlider = createSlider(14, 18, 16, 0.1);
  dopingExpSlider.attribute('aria-label', 'Doping concentration exponent');
  dopingExpSlider.input(function () { redraw(); });
  dnExpSlider = createSlider(0, 17, 0, 0.1);
  dnExpSlider.attribute('aria-label', 'Excess carrier concentration exponent, 0 means no injection');
  dnExpSlider.input(function () { redraw(); });

  positionUIElements();
  describe('Quasi-Fermi level explorer: draws a silicon band diagram showing electron and hole quasi-Fermi levels splitting apart as excess carrier injection increases, with an animated split, a bracket showing the splitting energy, and an information card showing n, p, the quasi-Fermi levels, and the injection regime', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function controlRows() {
  const stacked = compact();
  const rowH = stacked ? 54 : 36;
  const topPad = 12;
  return {
    stacked: stacked,
    rowH: rowH,
    type: topPad,
    doping: topPad + rowH,
    dn: topPad + 2 * rowH,
    bottom: topPad + 3 * rowH + 8
  };
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const rows = controlRows();
  const widgetX = rows.stacked ? 16 : 150;
  const widgetOffsetY = rows.stacked ? 20 : 8;
  const sw = rows.stacked ? Math.min(canvasWidth - 32, 340) : Math.min(canvasWidth - 150 - 30, 300);

  dopingTypeSelect.position(bx + widgetX, by + drawHeight + rows.type + widgetOffsetY);
  dopingExpSlider.position(bx + widgetX, by + drawHeight + rows.doping + widgetOffsetY);
  dopingExpSlider.size(sw);
  dnExpSlider.position(bx + widgetX, by + drawHeight + rows.dn + widgetOffsetY);
  dnExpSlider.size(sw);
}

function injectionRegime(dnRaw, Ndope) {
  if (dnRaw === 0) return { label: 'Equilibrium', color: [40, 130, 70] };
  const ratio = dnRaw / Ndope;
  if (ratio < 0.1) return { label: 'Low-level injection', color: [40, 130, 70] };
  if (ratio < 1) return { label: 'Transition', color: [170, 120, 10] };
  return { label: 'High-level injection', color: [190, 40, 40] };
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const isN = dopingTypeSelect.value() === 'n-type';
  const Ndope = Math.pow(10, dopingExpSlider.value());
  const dnRaw = dnExpSlider.value() <= 0.05 ? 0 : Math.pow(10, dnExpSlider.value());

  let n0, p0;
  if (isN) { n0 = Ndope; p0 = (NI * NI) / n0; }
  else { p0 = Ndope; n0 = (NI * NI) / p0; }

  const n = n0 + dnRaw, p = p0 + dnRaw;
  const efnMinusEi = kT * Math.log(n / NI);
  const eiMinusEfp = kT * Math.log(p / NI);
  const split = efnMinusEi + eiMinusEfp;
  const regime = injectionRegime(dnRaw, Ndope);

  // Ease the animated display positions toward their true targets.
  if (!animInit) { animEfn = efnMinusEi; animEfp = eiMinusEfp; animInit = true; }
  animEfn += (efnMinusEi - animEfn) * 0.15;
  animEfp += (eiMinusEfp - animEfp) * 0.15;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13.5 : 16);
  text(compact() ? 'Quasi-Fermi Levels (Si, 300 K)' : 'Quasi-Fermi Levels Under Carrier Injection (Silicon, 300 K)', canvasWidth / 2, 8);

  const stacked = compact();
  const diagTop = 40;
  const diagBottom = stacked ? Math.round(drawHeight * 0.58) : drawHeight - 12;

  if (stacked) {
    // Reserve room on the right for the E_C/E_Fn/E_i/E_Fp/E_V labels so
    // they never run off the edge of a narrow canvas.
    drawBandDiagram(10, canvasWidth - 62, diagTop, diagBottom, animEfn, animEfp, split, dnRaw === 0);
    drawReadout(10, canvasWidth - 10, diagBottom + 14, drawHeight - diagBottom - 22, n, p, dnRaw, efnMinusEi, eiMinusEfp, split, regime);
  } else {
    const diagX1 = Math.round(canvasWidth * 0.40);
    drawBandDiagram(50, diagX1, diagTop, diagBottom, animEfn, animEfp, split, dnRaw === 0);
    const cardX = Math.max(diagX1 + 175, Math.round(canvasWidth * 0.58));
    drawReadout(cardX, canvasWidth - 16, diagTop + 4, diagBottom - diagTop - 4, n, p, dnRaw, efnMinusEi, eiMinusEfp, split, regime);
  }

  drawControlLabels(regime);
}

// Draws the band diagram between diagX0..diagX1 (horizontal) and
// diagTop..diagBottom (vertical). efnEv/efpEv are the (possibly eased)
// E_Fn-E_i and E_i-E_Fp values in eV. When atEquilibrium is true, the
// two levels are drawn as one combined line+label instead of two
// overlapping ones.
function drawBandDiagram(diagX0, diagX1, diagTop, diagBottom, efnEv, efpEv, split, atEquilibrium) {
  // Tight headroom above E_C / below E_V (just enough to read as "band
  // continuum") instead of the original 0.3 eV, which wasted a third of
  // the diagram's height with no information in it.
  const PAD = 0.14;
  const EC_POS = PAD;
  const EMAX = EC_POS + EG + PAD;
  function eToPx(eV) { return map(eV, -PAD * 0.5, EMAX + PAD * 0.5, diagTop, diagBottom); }

  noStroke(); fill(230, 245, 255);
  rect(diagX0, diagTop, diagX1 - diagX0, eToPx(EC_POS) - diagTop);
  fill(220, 235, 220);
  rect(diagX0, eToPx(EC_POS + EG), diagX1 - diagX0, eToPx(EC_POS + EG + PAD) - eToPx(EC_POS + EG));
  fill(255);
  rect(diagX0, eToPx(EC_POS), diagX1 - diagX0, eToPx(EC_POS + EG) - eToPx(EC_POS));

  stroke(90, 62, 237); strokeWeight(2.5);
  line(diagX0, eToPx(EC_POS), diagX1, eToPx(EC_POS));
  stroke(90, 180, 120);
  line(diagX0, eToPx(EC_POS + EG), diagX1, eToPx(EC_POS + EG));

  noStroke(); fill(90, 62, 237);
  textAlign(LEFT, BOTTOM); textSize(compact() ? 11 : 12);
  text('E_C', diagX1 + 6, eToPx(EC_POS) + 4);
  fill(90, 180, 120);
  text('E_V', diagX1 + 6, eToPx(EC_POS + EG) + 4);

  const midgap = EC_POS + EG / 2;
  stroke(140); strokeWeight(1.5);
  drawingContext.setLineDash([2, 4]);
  line(diagX0, eToPx(midgap), diagX1, eToPx(midgap));
  drawingContext.setLineDash([]);
  noStroke(); fill(100);
  textAlign(LEFT, TOP); textSize(compact() ? 10 : 11);
  text('E_i', diagX1 + 6, eToPx(midgap) + 3);

  // Display coordinate convention: eToPx() maps SMALLER "eV" values to
  // the TOP of the diagram (toward E_C). E_Fn − E_i > 0 means E_Fn sits
  // ABOVE E_i (toward E_C), so its display coordinate is midgap minus
  // the value; E_Fp is the mirror case (midgap plus the value).
  const efnPos = midgap - efnEv;
  const efpPos = midgap + efpEv;
  const efnPx = eToPx(efnPos), efpPx = eToPx(efpPos);

  if (atEquilibrium) {
    // Single combined equilibrium line — avoids drawing (and labeling)
    // two lines that sit exactly on top of each other.
    stroke(90, 40, 160); strokeWeight(3);
    line(diagX0, efnPx, diagX1, efnPx);
    noStroke(); fill(90, 40, 160);
    textAlign(LEFT, CENTER); textSize(compact() ? 11 : 13);
    text(compact() ? 'E_F' : 'E_Fn = E_Fp = E_F', diagX1 + 6, efnPx);
  } else {
    stroke(40, 40, 220); strokeWeight(2.5);
    line(diagX0, efnPx, diagX1, efnPx);
    stroke(220, 60, 60); strokeWeight(2.5);
    line(diagX0, efpPx, diagX1, efpPx);

    // Keep the two labels from visually overlapping even when the
    // lines are close: enforce a minimum pixel gap between label
    // baselines, nudging both labels apart symmetrically. The lines
    // themselves are never moved, so this only affects label placement.
    const minGap = compact() ? 20 : 24;
    let efnLabelY = efnPx, efpLabelY = efpPx;
    const gap = efpLabelY - efnLabelY;
    if (Math.abs(gap) < minGap) {
      const mid = (efnLabelY + efpLabelY) / 2;
      efnLabelY = mid - minGap / 2;
      efpLabelY = mid + minGap / 2;
    }

    noStroke(); fill(40, 40, 220);
    textAlign(LEFT, CENTER); textSize(compact() ? 11 : 12);
    text('E_Fn', diagX1 + 6, efnLabelY);
    fill(220, 60, 60);
    text('E_Fp', diagX1 + 6, efpLabelY);

    // ΔE_F bracket: a vertical double-headed arrow between the two
    // lines with the split value labeled, placed clear of the E_Fn/E_Fp
    // text so it never collides with it. Skipped on narrow/stacked
    // layouts where there isn't room for a third column.
    if (!compact()) {
      const bx = diagX1 + 74;
      stroke(90); strokeWeight(1.5);
      line(bx, efnPx, bx, efpPx);
      line(bx - 5, efnPx, bx + 5, efnPx);
      line(bx - 5, efpPx, bx + 5, efpPx);
      // arrowheads
      line(bx, efnPx, bx - 4, efnPx + 7); line(bx, efnPx, bx + 4, efnPx + 7);
      line(bx, efpPx, bx - 4, efpPx - 7); line(bx, efpPx, bx + 4, efpPx - 7);
      noStroke(); fill(60);
      textAlign(LEFT, CENTER); textSize(11);
      push();
      translate(bx + 14, (efnPx + efpPx) / 2);
      rotate(-HALF_PI);
      textAlign(CENTER, BOTTOM);
      text('ΔE_F = ' + split.toFixed(3) + ' eV', 0, 0);
      pop();
    }
  }
}

function drawReadout(x0, x1, y0, availH, n, p, dnRaw, efnMinusEi, eiMinusEfp, split, regime) {
  const cardW = x1 - x0;
  const lineH = compact() ? 22 : 21;
  const pad = 12;
  const lines = [
    { label: 'n', value: n.toExponential(2) + ' cm⁻³' },
    { label: 'p', value: p.toExponential(2) + ' cm⁻³' },
    { label: 'Δn', value: dnRaw === 0 ? '0 (equilibrium)' : dnRaw.toExponential(2) + ' cm⁻³' },
    { label: 'E_Fn − E_i', value: efnMinusEi.toFixed(3) + ' eV' },
    { label: 'E_i − E_Fp', value: eiMinusEfp.toFixed(3) + ' eV' },
    { label: 'E_Fn − E_Fp', value: split.toFixed(3) + ' eV', bold: true }
  ];
  const h = pad + lines.length * lineH + lineH + pad + 8;

  fill(240, 245, 255); stroke(168, 200, 255); strokeWeight(1.5);
  rect(x0, y0, cardW, h, 10);

  let y = y0 + pad;
  noStroke();
  for (const ln of lines) {
    fill(30); textAlign(LEFT, TOP); textSize(compact() ? 12 : 12.5);
    textStyle(ln.bold ? BOLD : NORMAL);
    text(ln.label, x0 + 14, y);
    textAlign(RIGHT, TOP);
    text(ln.value, x0 + cardW - 14, y);
    textStyle(NORMAL);
    y += lineH;
  }
  y += 6;
  fill(...regime.color); textStyle(BOLD); textAlign(LEFT, TOP); textSize(compact() ? 12 : 12.5);
  text('Regime: ' + regime.label, x0 + 14, y, cardW - 28);
  textStyle(NORMAL);
}

function drawControlLabels(regime) {
  const rows = controlRows();
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 12 : 13);
  if (rows.stacked) {
    text('Doping type', 10, drawHeight + rows.type);
    text('N: 10' + toSup(dopingExpSlider.value().toFixed(1)) + ' cm⁻³', 10, drawHeight + rows.doping);
    text('Δn: ' + (dnExpSlider.value() <= 0.05 ? '0' : '10' + toSup(dnExpSlider.value().toFixed(1))) + ' cm⁻³', 10, drawHeight + rows.dn);
  } else {
    text('Doping type', 10, drawHeight + rows.type + 9);
    text('N', 10, drawHeight + rows.doping + 9);
    text('Δn', 10, drawHeight + rows.dn + 9);
    textAlign(RIGHT, TOP);
    text('10' + toSup(dopingExpSlider.value().toFixed(1)) + ' cm⁻³', canvasWidth - 10, drawHeight + rows.doping + 9);
    text(dnExpSlider.value() <= 0.05 ? '0 (equilibrium)' : '10' + toSup(dnExpSlider.value().toFixed(1)) + ' cm⁻³', canvasWidth - 10, drawHeight + rows.dn + 9);
  }
  fill(...regime.color); textStyle(BOLD); textAlign(LEFT, TOP); textSize(compact() ? 11.5 : 12.5);
  text(regime.label === 'Equilibrium' ? '✓ Equilibrium: E_Fn = E_Fp = E_F' : '⚡ Non-equilibrium: E_Fn ≠ E_Fp (' + regime.label + ')', 10, drawHeight + rows.bottom);
  textStyle(NORMAL);
}

function toSup(exp) {
  const supDigits = { '-': '⁻', '.': '·', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return String(exp).split('').map(c => supDigits[c] || c).join('');
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  minDrawHeight = compact() ? 560 : 420;
  controlHeight = compact() ? 220 : 170;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  drawHeight = Math.max(drawHeight, minDrawHeight);
}
