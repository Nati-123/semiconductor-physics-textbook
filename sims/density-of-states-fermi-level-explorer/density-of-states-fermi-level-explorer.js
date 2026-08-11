// Density of States and Fermi Level Explorer MicroSim
// Draws a valence-like band g_v(E) = C*sqrt(Ev-E) for E in [vBottom, Ev]
// and a conduction-like band g_c(E) = C*sqrt(E-Ec) for E in [Ec, cTop].
// If Ec < Ev the two bands overlap in energy (Metal, Semimetal presets);
// if Ec > Ev they are separated by a real gap (semiconductor, Insulator).
// Occupation is shaded using the Fermi-Dirac distribution f(E), driven by
// a Temperature T (K) control (with 0/77/300/600 K presets) converted to
// thermal energy kT = kB*T.
// Bloom Level: Understand / Analyze (L2-L4)
// MicroSim template version 2026.02 (2D static/interactive variant)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 230;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, tempPresetSelect, tSlider;

// wide enough that the Ev/Ec tick labels never run into the rotated y-axis title
function marginPx() { return compact() ? 66 : 76; }

const C = 40; // arbitrary DOS scale constant (visual only)
const KB = 8.617333e-5; // eV/K
const T_MIN = 1, T_MAX = 800;

// Each preset: Ev (valence band top), Ec (conduction band bottom),
// EF (Fermi level), and vDepth/cDepth (visual band depth for drawing).
const PRESETS = {
  'Intrinsic Semiconductor': { Ev: 0.0,  Ec: 1.12, EF: 0.56,  vDepth: 2.5, cDepth: 2.5 },
  'n-type Semiconductor':    { Ev: 0.0,  Ec: 1.12, EF: 0.92,  vDepth: 2.5, cDepth: 2.5 },
  'p-type Semiconductor':    { Ev: 0.0,  Ec: 1.12, EF: 0.20,  vDepth: 2.5, cDepth: 2.5 },
  'Metal':                   { Ev: 3.0,  Ec: -3.0, EF: 0.0,   vDepth: 4.0, cDepth: 4.0 },
  'Insulator':               { Ev: 0.0,  Ec: 5.5,  EF: 2.75,  vDepth: 2.5, cDepth: 2.5 },
  'Semimetal':               { Ev: 0.05, Ec: -0.05, EF: 0.0,  vDepth: 2.5, cDepth: 2.5 }
};

const TEMP_PRESETS = { '0 K (approx.)': 1, '77 K (liquid N₂)': 77, '300 K (room temp.)': 300, '600 K (hot)': 600 };

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  Object.keys(PRESETS).forEach(name => materialSelect.option(name));
  materialSelect.selected('Intrinsic Semiconductor');
  materialSelect.attribute('aria-label', 'Material / band-filling preset');

  tempPresetSelect = createSelect();
  Object.keys(TEMP_PRESETS).forEach(name => tempPresetSelect.option(name));
  tempPresetSelect.selected('300 K (room temp.)');
  tempPresetSelect.attribute('aria-label', 'Temperature preset');
  tempPresetSelect.changed(function () {
    tSlider.value(TEMP_PRESETS[tempPresetSelect.value()]);
  });

  tSlider = createSlider(T_MIN, T_MAX, 300, 1);
  tSlider.attribute('aria-label', 'Temperature T in kelvin');

  positionUIElements();

  describe('Density of states and Fermi level explorer: shows a band diagram and a density-of-states curve shaded by Fermi-Dirac occupation, for metal, insulator, semimetal, and intrinsic/n-type/p-type semiconductor presets, with an adjustable temperature control', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function controlX() {
  return canvasWidth < 480 ? 130 : 190;
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;
  const cx = controlX();

  materialSelect.position(bx + cx, by + drawHeight + 12);
  tempPresetSelect.position(bx + cx, by + drawHeight + 48);
  tSlider.position(bx + cx, by + drawHeight + 90);
  tSlider.size(min(canvasWidth - cx - marginPx() - 10, 300));
}

function fermi(E, EF, kT) {
  return 1 / (1 + Math.exp((E - EF) / kT));
}

function gv(E, p) {
  if (E <= p.Ev && E >= p.Ev - p.vDepth) return C * Math.sqrt(max(0, p.Ev - E));
  return 0;
}
function gc(E, p) {
  if (E >= p.Ec && E <= p.Ec + p.cDepth) return C * Math.sqrt(max(0, E - p.Ec));
  return 0;
}

function compact() { return canvasWidth < 480; }

// ---------- draw ----------
function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  fill('white');
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225);
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  const p = PRESETS[materialSelect.value()];
  const T = tSlider.value();
  const kT = max(KB * T, 1e-6);

  drawDiagram(p, kT, T);
  drawControlLabels(p, kT, T);
}

function drawControlLabels(p, kT, T) {
  fill('black');
  noStroke();
  const cx = controlX();
  textSize(compact() ? 11.5 : 13);

  textAlign(RIGHT, CENTER);
  text('Material:', cx - 10, drawHeight + 24);
  text('Temp. preset:', cx - 10, drawHeight + 60);
  text('T: ' + T.toFixed(0) + ' K', cx - 10, drawHeight + 100);

  // legend (two rows)
  const legendY1 = drawHeight + 136;
  const legendY2 = legendY1 + (compact() ? 20 : 22);
  textAlign(LEFT, CENTER);
  textSize(compact() ? 10 : 11.5);
  let lx = 12;

  noStroke(); fill(210, 210, 220);
  rect(lx, legendY1 - 5, 16, 10);
  fill(20); text('g(E) outline (all states)', lx + 22, legendY1);
  lx += (compact() ? 140 : 165);

  fill('#2E7D32'); rect(lx, legendY1 - 5, 16, 10);
  fill(20); text('Occupied (valence-like)', lx + 22, legendY1);
  lx += (compact() ? 150 : 175);

  fill('#5A3EED'); rect(lx, legendY1 - 5, 16, 10);
  fill(20); text('Occupied (conduction-like)', lx + 22, legendY1);

  lx = 12;
  fill(255); stroke(180); strokeWeight(1); rect(lx, legendY2 - 5, 16, 10); noStroke();
  fill(20); text('Unoccupied (empty states)', lx + 22, legendY2);
  lx += (compact() ? 165 : 190);

  stroke(200, 30, 30); strokeWeight(2);
  drawingContext.setLineDash([4, 3]);
  line(lx, legendY2, lx + 16, legendY2);
  drawingContext.setLineDash([]);
  noStroke(); fill(20);
  text('Fermi level EF', lx + 22, legendY2);

  // numeric readout
  const fEc = fermi(p.Ec, p.EF, kT);
  const fEv = fermi(p.Ev, p.EF, kT);
  const readY1 = legendY2 + (compact() ? 22 : 24);
  const readY2 = readY1 + (compact() ? 18 : 18);
  fill('#333'); noStroke();
  textAlign(LEFT, CENTER);
  textSize(compact() ? 10 : 11.5);
  text('kT = ' + kT.toFixed(4) + ' eV   |   Eg = ' + (p.Ec - p.Ev).toFixed(2) + ' eV   |   EF = ' + p.EF.toFixed(2) + ' eV', 12, readY1);
  text('f(Ec) = ' + fEc.toExponential(2) + '   |   f(Ev) = ' + fEv.toExponential(2), 12, readY2);
}

function drawDiagram(p, kT, T) {
  const EMin = min(p.Ev - p.vDepth, p.Ec) - 0.5;
  const EMax = max(p.Ec + p.cDepth, p.Ev) + 0.5;

  const plotY0 = 50;
  const plotY1 = drawHeight - 50;

  const bandX0 = marginPx() + 10;
  const bandX1 = bandX0 + (compact() ? 90 : 120);
  const dosX0 = bandX1 + (compact() ? 55 : 75);
  const dosX1 = canvasWidth - marginPx();

  function eToPx(E) { return map(E, EMin, EMax, plotY1, plotY0); }

  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(compact() ? 13 : 16);
  text(materialSelect.value() + ' — Band Structure', canvasWidth / 2, 8);

  // ---- panel divider ----
  stroke(215); strokeWeight(1);
  line(bandX1 + (compact() ? 27 : 37), plotY0 - 10, bandX1 + (compact() ? 27 : 37), plotY1 + 26);

  // ---- left panel: band diagram (occupation-shaded) ----
  fill(250);
  stroke(180);
  strokeWeight(1);
  rect(bandX0, plotY0, bandX1 - bandX0, plotY1 - plotY0);

  noStroke();
  const rows = Math.max(1, Math.floor(plotY1 - plotY0));
  for (let i = 0; i < rows; i++) {
    const py = plotY0 + i;
    const E = map(py, plotY0, plotY1, EMax, EMin);
    const gvv = gv(E, p);
    const gcc = gc(E, p);
    const f = fermi(E, p.EF, kT);
    if (gvv > 0 || gcc > 0) {
      let r, g, b;
      if (gvv >= gcc) {
        r = lerp(255, 46, f); g = lerp(255, 125, f); b = lerp(255, 50, f);
      } else {
        r = lerp(255, 90, f); g = lerp(255, 62, f); b = lerp(255, 237, f);
      }
      fill(r, g, b);
      rect(bandX0, py, bandX1 - bandX0, 1.2);
    }
  }
  stroke(180);
  noFill();
  rect(bandX0, plotY0, bandX1 - bandX0, plotY1 - plotY0);

  // ---- right panel: density of states curves ----
  const gMax = C * Math.sqrt(max(p.vDepth, p.cDepth)) * 1.05;
  function gToPx(gval) { return map(gval, 0, gMax, dosX0, dosX1); }

  noStroke();
  for (let i = 0; i < rows; i++) {
    const py = plotY0 + i;
    const E = map(py, plotY0, plotY1, EMax, EMin);
    const gvv = gv(E, p);
    const gcc = gc(E, p);
    const gTotal = gvv + gcc;
    const f = fermi(E, p.EF, kT);
    const occupied = gTotal * f;

    if (gTotal > 0) {
      // full density-of-states outline (unoccupied portion, pale)
      fill(210, 210, 220, 200);
      rect(dosX0, py, gToPx(gTotal) - dosX0, 1.2);
      // occupied portion (colored by dominant band)
      let r, g2, b;
      if (gvv >= gcc) { r = 46; g2 = 125; b = 50; } else { r = 90; g2 = 62; b = 237; }
      fill(r, g2, b, 235);
      rect(dosX0, py, gToPx(occupied) - dosX0, 1.2);
    }
  }

  // axes for right panel
  stroke(150);
  strokeWeight(1);
  line(dosX0, plotY0, dosX0, plotY1);
  line(dosX0, plotY1, dosX1, plotY1);

  // Fermi level line across both panels
  stroke(200, 30, 30);
  strokeWeight(1.5);
  drawingContext.setLineDash([4, 3]);
  line(bandX0, eToPx(p.EF), dosX1, eToPx(p.EF));
  drawingContext.setLineDash([]);
  noStroke();
  fill(200, 30, 30);
  textAlign(LEFT, BOTTOM);
  textSize(compact() ? 10.5 : 12);
  text('EF = ' + p.EF.toFixed(2) + ' eV', dosX0 + 4, eToPx(p.EF) - 4);

  // band-edge labels (Ec, Ev) -- when the two band edges sit within a few
  // pixels of each other (Metal/Semimetal overlap presets), separate the
  // TEXT vertically while keeping each tick mark at its true position, so
  // the two labels never overlap.
  const pxEv = eToPx(p.Ev), pxEc = eToPx(p.Ec);
  const closeEdges = Math.abs(pxEv - pxEc) < 14;
  const midEdgeY = (pxEv + pxEc) / 2;
  const evLabelY = closeEdges ? midEdgeY - 8 : pxEv;
  const ecLabelY = closeEdges ? midEdgeY + 8 : pxEc;

  fill(20);
  textAlign(RIGHT, CENTER);
  textSize(compact() ? 9 : 10.5);
  text('Ev=' + p.Ev.toFixed(2), bandX0 - 6, evLabelY);
  text('Ec=' + p.Ec.toFixed(2), bandX0 - 6, ecLabelY);
  stroke(120); strokeWeight(1);
  line(bandX0 - 4, pxEv, bandX0, pxEv);
  line(bandX0 - 4, pxEc, bandX0, pxEc);

  // panel titles
  noStroke();
  textAlign(CENTER, TOP);
  fill(60);
  textSize(compact() ? 10.5 : 12);
  text('Band Diagram', (bandX0 + bandX1) / 2, plotY1 + 8);
  text('Density of States g(E)', (dosX0 + dosX1) / 2, plotY1 + 8);

  push();
  translate(10, (plotY0 + plotY1) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  textSize(compact() ? 10 : 12);
  text('Energy (eV)', 0, 0);
  pop();

  drawGapLabel(p, eToPx, bandX1);
}

function drawGapLabel(p, eToPx, bandX1) {
  // Anchored just below the EF line (which is drawn with a BOTTOM-aligned
  // label just above it) rather than at the Ev/Ec midpoint, since for
  // symmetric presets (intrinsic, insulator) EF sits exactly at that
  // midpoint and the two labels would otherwise collide.
  const gapVal = p.Ec - p.Ev;
  const midX = bandX1 + 8;
  const labelY = eToPx(p.EF) + 12;
  fill('#7a5c00');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(compact() ? 10 : 11);
  if (gapVal > 0) {
    text('Eg=' + gapVal.toFixed(2), midX, labelY);
  } else {
    text('overlap', midX, labelY);
  }
}

// ---------- responsive sizing ----------
function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
}

function updateCanvasSize() {
  var mainEl = document.querySelector('main');
  containerWidth = Math.floor(mainEl.getBoundingClientRect().width);
  canvasWidth = containerWidth;
  controlHeight = compact() ? 260 : 230;

  var availableHeight = window.innerHeight;
  var children = mainEl.children;
  for (var i = 0; i < children.length; i++) {
    if (children[i].tagName !== 'CANVAS') {
      availableHeight -= children[i].offsetHeight;
    }
  }
  drawHeight = Math.max(minDrawHeight, availableHeight - controlHeight);
  canvasHeight = drawHeight + controlHeight;
  containerHeight = canvasHeight;
}
