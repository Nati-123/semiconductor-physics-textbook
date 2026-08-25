// Fermi Function and Boltzmann Approximation Explorer MicroSim
// Overlays the exact Fermi-Dirac function f(E) with its Boltzmann
// approximation exp(-(E-EF)/kT), shading the energy range where they
// agree to within a student-selected tolerance, with temperature presets
// (77 K / 300 K / 500 K) plus a continuous slider, and a movable energy
// marker that reads off both curves' numeric values and their percent
// difference -- directly answering "how far above EF does the Boltzmann
// approximation become accurate to within X%?"
// Physics note: f(E) is the probability that an available state at
// energy E is occupied by an electron; only for E-EF >> kT (the
// non-degenerate regime, Chapters 8-9) does the "+1" in the Fermi
// function's denominator become negligible, letting it collapse to the
// simpler exponential form used to derive N_C in this chapter.
// Performance note: redraw is event-driven (noLoop + redraw-on-input),
// not a continuous 60fps loop, since nothing here animates on its own.
// Bloom Level: Understand / Analyze (L2-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let tempSlider, markerSlider, toleranceSelect;
const KB = 8.617e-5; // eV/K
const PRESETS = [77, 300, 500];

function fExact(dE, kT) { return 1 / (1 + Math.exp(dE / kT)); }
function fBoltz(dE, kT) { return Math.exp(-dE / kT); }
function compact() { return canvasWidth < 480; }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  tempSlider = createSlider(77, 700, 300, 1);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');
  tempSlider.input(function () { redraw(); });

  markerSlider = createSlider(-0.2, 0.3, 0.05, 0.005);
  markerSlider.attribute('aria-label', 'Energy marker, E minus E_F, in eV');
  markerSlider.input(function () { redraw(); });

  toleranceSelect = createSelect();
  toleranceSelect.option('1%');
  toleranceSelect.option('5%');
  toleranceSelect.option('10%');
  toleranceSelect.selected('5%');
  toleranceSelect.attribute('aria-label', 'Approximation error tolerance');
  toleranceSelect.changed(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Fermi function and Boltzmann approximation explorer: overlays the exact Fermi-Dirac function with its Boltzmann approximation, shades the energy range where the approximation meets a selectable error tolerance, and reports the exact boundary distance from E_F', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function toleranceFraction() {
  const v = toleranceSelect.value();
  return v === '1%' ? 0.01 : (v === '10%' ? 0.10 : 0.05);
}

// Row layout, compact-aware: on a narrow screen the temperature presets
// get their own row (below the temperature slider) instead of sharing
// the temperature row, which would otherwise overlap the slider track.
function rowY() {
  if (compact()) return { temp: 15, presets: 45, marker: 85, tolerance: 123, readout: 160 };
  return { temp: 15, presets: 15, marker: 55, tolerance: 95, readout: 118 };
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 100 : 170;
  const sw = min(canvasWidth - lbl - (compact() ? 30 : 220), 300);
  const rows = rowY();
  tempSlider.position(bx + lbl, by + drawHeight + rows.temp);
  tempSlider.size(sw);
  markerSlider.position(bx + lbl, by + drawHeight + rows.marker);
  markerSlider.size(min(canvasWidth - lbl - 30, 300));
  toleranceSelect.position(bx + lbl, by + drawHeight + rows.tolerance);
}

function presetButtons() {
  const bw = 56, bh = 24, gap = 8;
  const rows = rowY();
  if (compact()) {
    const startX = 10;
    return PRESETS.map((t, i) => ({ t: t, x: startX + i * (bw + gap), y: drawHeight + rows.presets, w: bw, h: bh }));
  }
  const startX = canvasWidth - (bw + gap) * PRESETS.length - 14;
  return PRESETS.map((t, i) => ({ t: t, x: startX + i * (bw + gap), y: drawHeight + rows.presets, w: bw, h: bh }));
}

function mousePressed() {
  const btns = presetButtons();
  for (const b of btns) {
    if (smlPointInRect(mouseX, mouseY, b.x, b.y, b.w, b.h)) {
      tempSlider.value(b.t);
      redraw();
      return false;
    }
  }
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1); line(0, drawHeight, canvasWidth, drawHeight);

  const T = tempSlider.value();
  const kT = KB * T;
  const marker = markerSlider.value();
  const tol = toleranceFraction();

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13 : 16);
  text('f(E): exact Fermi-Dirac vs. Boltzmann approximation e^(−(E−E_F)/kT)', canvasWidth / 2, 8);
  textAlign(CENTER, TOP); textSize(11); fill(80);
  text('f(E) = probability that an available state at energy E is occupied by an electron', canvasWidth / 2, 28);

  const chartX = 70, chartY = 58, chartW = canvasWidth - chartX - 30, chartH = drawHeight - 118;
  const XMIN = -0.2, XMAX = 0.3;
  function xToPx(dE) { return map(dE, XMIN, XMAX, chartX, chartX + chartW); }

  // Boundary where the exact and Boltzmann curves diverge by more than
  // `tol`: solve |fBoltz-fExact|/fExact = tol for dE > 0. Since
  // fExact = fBoltz/(1+fBoltz), the relative error is exactly fBoltz,
  // so the boundary is at fBoltz(dE)=tol, i.e. dE = kT*ln(1/tol).
  const boundary = kT * Math.log(1 / tol);
  noStroke(); fill(220, 250, 225, 180);
  const bx0 = constrain(xToPx(boundary), chartX, chartX + chartW);
  rect(bx0, chartY, chartX + chartW - bx0, chartH);

  const ptsExact = [], ptsBoltz = [];
  for (let dE = XMIN; dE <= XMAX; dE += 0.005) {
    ptsExact.push({ x: dE, y: fExact(dE, kT) });
    const yb = fBoltz(dE, kT);
    if (yb <= 1.3) ptsBoltz.push({ x: dE, y: min(yb, 1.3) });
  }

  smlDrawLineChart(chartX, chartY, chartW, chartH, XMIN, XMAX, 0, 1.3, [
    { points: ptsExact, color: color(90, 62, 237) },
    { points: ptsBoltz, color: color(220, 150, 30) }
  ], {
    marker: { x: marker, y: fExact(marker, kT) },
    xLabel: 'E − E_F (eV)', yLabel: 'f(E)', yLabelOffset: 34
  });

  // legend
  const legX = chartX + 10, legY = chartY + 8;
  noStroke(); fill(255, 255, 255, 220); rect(legX - 6, legY - 6, compact() ? 150 : 190, 44, 6);
  stroke(90, 62, 237); strokeWeight(2.5); line(legX, legY + 4, legX + 18, legY + 4);
  noStroke(); fill(30); textAlign(LEFT, CENTER); textSize(compact() ? 10 : 11.5);
  text('Exact Fermi-Dirac f(E)', legX + 24, legY + 4);
  stroke(220, 150, 30); strokeWeight(2.5); line(legX, legY + 24, legX + 18, legY + 24);
  noStroke(); fill(30);
  text('Boltzmann approx.  e^(−(E−E_F)/kT)', legX + 24, legY + 24);

  // preset buttons
  const btns = presetButtons();
  for (const b of btns) {
    smlDrawButton(b.x, b.y, b.w, b.h, b.t + ' K', T === b.t);
  }

  const rows = rowY();
  fill(30); noStroke();
  textAlign(LEFT, CENTER); textSize(compact() ? 11 : 13);
  text('Temperature:', 10, drawHeight + rows.temp + 12);
  text('Energy marker:', 10, drawHeight + rows.marker + 12);
  text('Tolerance:', 10, drawHeight + rows.tolerance + 12);

  const fe = fExact(marker, kT), fb = fBoltz(marker, kT);
  const pctDiff = Math.abs(fb - fe) / fe * 100;
  const readY = drawHeight + rows.readout;
  const lineGap = compact() ? 30 : 20;
  fill(20); textAlign(LEFT, TOP); textSize(compact() ? 10.5 : 12.5);
  text('T = ' + T + ' K  (k_BT = ' + kT.toFixed(4) + ' eV)', 10, readY, canvasWidth - 20);
  text('At E−E_F = ' + marker.toFixed(3) + ' eV: exact f = ' + fe.toFixed(4) + ', Boltzmann f = ' + fb.toFixed(4) + '  (' + pctDiff.toFixed(1) + '% diff)',
    10, readY + lineGap, canvasWidth - 20);
  text('Boundary for ' + toleranceSelect.value() + ' accuracy: E − E_F ≥ k_BT·ln(1/' + tol.toFixed(2) + ') ≈ ' + boundary.toFixed(3) + ' eV',
    10, readY + lineGap * 2, canvasWidth - 20);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 250 : 190;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
}
