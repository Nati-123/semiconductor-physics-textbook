// Density of States and Fermi Level Explorer MicroSim
// Draws a valence-like band g_v(E) = C*sqrt(Ev-E) for E in [vBottom, Ev]
// and a conduction-like band g_c(E) = C*sqrt(E-Ec) for E in [Ec, cTop].
// If Ec < Ev the two bands overlap in energy (Metal, Semimetal presets);
// if Ec > Ev they are separated by a real gap (Semiconductor, Insulator).
// Occupation is shaded using the Fermi-Dirac distribution f(E), with an
// adjustable thermal energy kT slider showing the T=0 step smear out.
// Bloom Level: Understand / Analyze (L2-L4)
// MicroSim template version 2026.02 (2D static/interactive variant)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 46;

let materialSelect, kTSlider;

const C = 40; // arbitrary DOS scale constant (visual only)

// Each preset: Ev (valence band top), Ec (conduction band bottom),
// EF (Fermi level), and vDepth/cDepth (visual band depth for drawing).
const PRESETS = {
  'Metal':         { Ev: 3.0,  Ec: -3.0, EF: 0.0,  vDepth: 4.0, cDepth: 4.0 },
  'Semimetal':     { Ev: 0.05, Ec: -0.05, EF: 0.0, vDepth: 2.5, cDepth: 2.5 },
  'Semiconductor': { Ev: 0.0,  Ec: 1.12, EF: 0.56, vDepth: 2.5, cDepth: 2.5 },
  'Insulator':     { Ev: 0.0,  Ec: 5.5,  EF: 2.75, vDepth: 2.5, cDepth: 2.5 }
};

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  Object.keys(PRESETS).forEach(name => materialSelect.option(name));
  materialSelect.selected('Semiconductor');
  materialSelect.attribute('aria-label', 'Material preset');

  kTSlider = createSlider(0.001, 0.4, 0.05, 0.001);
  kTSlider.attribute('aria-label', 'Thermal energy kT');

  positionUIElements();

  describe('Density of states and Fermi level explorer: shows valence and conduction band density-of-states curves shaded by Fermi-Dirac occupation, for metal, insulator, semiconductor, and semimetal presets', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;

  materialSelect.position(bx + 10, by + drawHeight + 10);
  kTSlider.position(bx + 10, by + drawHeight + 55);
  kTSlider.size(min(canvasWidth - 20 - margin, 320));
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

  const p = PRESETS[materialSelect.value()];
  const kT = kTSlider.value();

  drawDiagram(p, kT);
  drawControlLabels(p, kT);
}

function drawControlLabels(p, kT) {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Material:', 10, drawHeight + 32);
  text('Thermal energy kT: ' + kT.toFixed(3) + ' eV', 10, drawHeight + 77);
}

function drawDiagram(p, kT) {
  const EMin = min(p.Ev - p.vDepth, p.Ec) - 0.5;
  const EMax = max(p.Ec + p.cDepth, p.Ev) + 0.5;

  const plotY0 = 44;
  const plotY1 = drawHeight - 46;

  const bandX0 = margin + 10;
  const bandX1 = bandX0 + 110;
  const dosX0 = bandX1 + 70;
  const dosX1 = canvasWidth - margin;

  function eToPx(E) { return map(E, EMin, EMax, plotY1, plotY0); }

  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(16);
  text(materialSelect.value() + ' Band Structure', canvasWidth / 2, 8);

  // ---- left panel: band occupation bar ----
  fill(245);
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
      // full density-of-states outline (light)
      fill(200, 200, 210, 130);
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
  textSize(12);
  text('E_F = ' + p.EF.toFixed(2) + ' eV', dosX1 - 118, eToPx(p.EF) - 4);

  // band-edge labels
  fill(20);
  textAlign(RIGHT, CENTER);
  textSize(11);
  text('E_v = ' + p.Ev.toFixed(2), bandX0 - 6, eToPx(p.Ev));
  text('E_c = ' + p.Ec.toFixed(2), bandX0 - 6, eToPx(p.Ec));

  // panel titles
  textAlign(CENTER, TOP);
  fill(60);
  textSize(12);
  text('Band occupation', (bandX0 + bandX1) / 2, plotY1 + 8);
  text('Density of states g(E)  (shaded = occupied)', (dosX0 + dosX1) / 2, plotY1 + 8);

  push();
  translate(margin - 34, (plotY0 + plotY1) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Energy (eV)', 0, 0);
  pop();

  drawGapLabel(p, eToPx);
}

function drawGapLabel(p, eToPx) {
  const bandX1 = margin + 10 + 110;
  const gapVal = p.Ec - p.Ev;
  const midX = bandX1 + 20;
  fill('#7a5c00');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(11);
  if (gapVal > 0) {
    text('gap E_g = ' + gapVal.toFixed(2) + ' eV', midX, (eToPx(p.Ev) + eToPx(p.Ec)) / 2);
  } else {
    text('overlap = ' + (-gapVal).toFixed(2) + ' eV', midX, (eToPx(p.Ev) + eToPx(p.Ec)) / 2);
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
