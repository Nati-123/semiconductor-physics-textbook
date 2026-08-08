// Finite Potential Well Explorer MicroSim
// Numerically solves for the bound-state energies of a symmetric finite
// square well of width L and depth V0, via bisection on the standard
// transcendental matching equations, then plots the well, the energy
// ladder, and the selected eigenfunction -- showing explicitly that the
// wavefunction penetrates into the classically forbidden region outside
// the well, unlike the particle-in-a-box's exact zero at infinite walls.
// Bloom Level: Apply / Analyze (L3-L4) - calculate, contrast
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 440;
let controlHeight = 145;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 30;
let sliderLeftMargin = 220;

let lSlider, v0Slider, stateSelect, compareCheckbox;

const HBAR = 1.0546e-34;
const ME = 9.109e-31;
const EV = 1.602e-19;
const NM = 1e-9;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  lSlider = createSlider(0.3, 1.5, 1.0, 0.05);
  lSlider.input(onParamsChanged);
  lSlider.attribute('aria-label', 'Well width L in nanometers');

  v0Slider = createSlider(0.2, 3.0, 1.0, 0.1);
  v0Slider.input(onParamsChanged);
  v0Slider.attribute('aria-label', 'Well depth V0 in electron-volts');

  stateSelect = createSelect();
  stateSelect.style('width', '190px');
  stateSelect.changed(() => redraw());

  compareCheckbox = createCheckbox('Compare to infinite well', false);
  compareCheckbox.changed(() => redraw());

  positionUIElements();
  rebuildStateSelector();

  describe('Finite square well explorer that solves for bound-state energies via bisection and plots the well, energy levels, and the selected eigenfunction, showing wavefunction penetration into the classically forbidden region outside the well', LABEL);

  noLoop();
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;

  stateSelect.position(bx + 10, by + drawHeight + 5);

  const selectW = stateSelect.elt.getBoundingClientRect().width;
  const checkboxW = compareCheckbox.elt.getBoundingClientRect().width;
  const stacked = (10 + selectW + 16 + checkboxW + 10) > canvasWidth;
  if (stacked) {
    compareCheckbox.position(bx + 10, by + drawHeight + 38);
  } else {
    compareCheckbox.position(bx + 10 + selectW + 16, by + drawHeight + 8);
  }

  const sliderRowY = stacked ? [70, 105] : [40, 75];
  const sliderW = Math.max(80, canvasWidth - sliderLeftMargin - margin);
  lSlider.position(bx + sliderLeftMargin, by + drawHeight + sliderRowY[0]);
  lSlider.size(sliderW);

  v0Slider.position(bx + sliderLeftMargin, by + drawHeight + sliderRowY[1]);
  v0Slider.size(sliderW);
}

function onParamsChanged() {
  rebuildStateSelector();
  redraw();
}

// ---------- physics: bisection on the transcendental matching equations ----------
function solveFiniteWell(Lnm, V0eV) {
  const L = Lnm * NM;
  const V0 = V0eV * EV;
  const z0 = (L / (2 * HBAR)) * Math.sqrt(2 * ME * V0);

  const states = [];
  const EPS = 1e-6;
  let n = 0;
  while ((n * Math.PI) / 2 < z0) {
    const lo = (n * Math.PI) / 2 + EPS;
    const hiRaw = Math.min(((n + 1) * Math.PI) / 2, z0) - EPS;
    if (hiRaw <= lo) break;
    const isEven = n % 2 === 0;

    const f = (z) => {
      const rhs = Math.sqrt(Math.max(z0 * z0 - z * z, 0));
      return isEven ? z * Math.tan(z) - rhs : z / Math.tan(z) + rhs;
    };

    const flo = f(lo);
    const fhi = f(hiRaw);
    if (isFinite(flo) && isFinite(fhi) && Math.sign(flo) !== Math.sign(fhi) && Math.sign(flo) !== 0) {
      const zRoot = bisect(f, lo, hiRaw, flo);
      const k = (2 * zRoot) / L;
      const E = (HBAR * HBAR * k * k) / (2 * ME);
      const kappa = Math.sqrt(2 * ME * (V0 - E)) / HBAR;
      states.push({
        n: states.length + 1,
        E_eV: E / EV,
        k,
        kappa,
        parity: isEven ? 'even' : 'odd',
        z: zRoot
      });
    }
    n++;
  }
  return states;
}

function bisect(f, lo, hi, flo) {
  let a = lo, b = hi, fa = flo;
  for (let iter = 0; iter < 60; iter++) {
    const mid = (a + b) / 2;
    const fmid = f(mid);
    if (Math.abs(fmid) < 1e-9 || b - a < 1e-9) return mid;
    if (Math.sign(fmid) === Math.sign(fa)) {
      a = mid; fa = fmid;
    } else {
      b = mid;
    }
  }
  return (a + b) / 2;
}

function rebuildStateSelector() {
  const Lnm = lSlider.value();
  const V0eV = v0Slider.value();
  const states = solveFiniteWell(Lnm, V0eV);
  const prevIndex = stateSelect.selected() ? parseInt(stateSelect.selected(), 10) - 1 : 0;

  stateSelect.html('');
  states.forEach((s) => {
    stateSelect.option('n=' + s.n + ' (' + s.parity + ', E=' + s.E_eV.toFixed(3) + ' eV)', String(s.n));
  });
  if (states.length > 0) {
    const idx = constrain(prevIndex, 0, states.length - 1);
    stateSelect.selected(String(states[idx].n));
  }
}

// ---------- eigenfunctions ----------
function finiteEigenfunction(x_m, s, L, kappaScale) {
  const half = L / 2;
  if (Math.abs(x_m) <= half) {
    return s.parity === 'even' ? Math.cos(s.k * x_m) : Math.sin(s.k * x_m);
  }
  const edgeVal = s.parity === 'even' ? Math.cos(s.k * half) : Math.sin(s.k * half) * Math.sign(x_m);
  const decay = Math.exp(-s.kappa * (Math.abs(x_m) - half));
  return edgeVal * decay;
}

function infiniteEigenfunction(x_m, n, L) {
  const half = L / 2;
  if (Math.abs(x_m) > half) return 0;
  // standard infinite well shifted to be centered on 0: psi_n ~ sin(n*pi*(x+L/2)/L)
  return Math.sin((n * Math.PI * (x_m + half)) / L);
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

  const narrow = canvasWidth < 600;

  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(narrow ? 14 : 18);
  text('Finite Potential Well Explorer', canvasWidth / 2, 10);

  const Lnm = lSlider.value();
  const V0eV = v0Slider.value();
  const states = solveFiniteWell(Lnm, V0eV);

  const geom = computeGeometry(Lnm, V0eV, narrow);
  drawWell(geom, Lnm, V0eV);
  drawEnergyLevels(geom, states);

  const selectedN = stateSelect.selected() ? parseInt(stateSelect.selected(), 10) : null;
  const selected = states.find((s) => s.n === selectedN);
  if (selected) {
    drawEigenfunction(geom, selected, Lnm, states);
    if (compareCheckbox.checked()) {
      drawInfiniteOverlay(geom, selected, Lnm, states);
    }
  }

  drawReadout(geom, states, selected);
  drawControlLabels(Lnm, V0eV, states.length);
}

function computeGeometry(Lnm, V0eV, narrow) {
  const x0 = margin + 10;
  const x1 = canvasWidth - margin - 10;
  // Extra headroom on narrow canvases: the legend wraps under the title
  // instead of squeezing in above the plot.
  const top = narrow ? 78 : 45;
  const bottom = drawHeight - 20;
  const eMin = -0.3 * V0eV;
  const eMax = 1.15 * V0eV;
  const xHalfRangeNm = Lnm * 1.6;
  return { x0, x1, top, bottom, eMin, eMax, xHalfRangeNm, Lnm, V0eV, narrow };
}

function xToPx(xNm, geom) {
  return map(xNm, -geom.xHalfRangeNm, geom.xHalfRangeNm, geom.x0, geom.x1);
}
function eToPx(eV, geom) {
  return map(eV, geom.eMin, geom.eMax, geom.bottom, geom.top);
}

function drawWell(geom, Lnm, V0eV) {
  const halfL = Lnm / 2;
  const xLeftWall = xToPx(-halfL, geom);
  const xRightWall = xToPx(halfL, geom);
  const yFloor = eToPx(0, geom);
  const yCeil = eToPx(V0eV, geom);

  // Tint the classically-forbidden region (inside the barrier, outside the
  // well) so wavefunction penetration there reads as physically meaningful,
  // not just an odd wiggle near the wall.
  noStroke();
  fill(141, 110, 99, 28);
  rect(geom.x0, yCeil, xLeftWall - geom.x0, yFloor - yCeil);
  rect(xRightWall, yCeil, geom.x1 - xRightWall, yFloor - yCeil);

  stroke('#8D6E63');
  strokeWeight(3);
  noFill();
  line(geom.x0, yCeil, xLeftWall, yCeil);
  line(xLeftWall, yCeil, xLeftWall, yFloor);
  line(xLeftWall, yFloor, xRightWall, yFloor);
  line(xRightWall, yFloor, xRightWall, yCeil);
  line(xRightWall, yCeil, geom.x1, yCeil);

  noStroke();
  fill('#8D6E63');
  textAlign(LEFT, BOTTOM);
  textSize(geom.narrow ? 10.5 : 12);
  text((geom.narrow ? 'V₀ = ' : 'V(x): barrier height V₀ = ') + V0eV.toFixed(2) + ' eV', geom.x0, yCeil - 4);
  textAlign(CENTER, TOP);
  text('L = ' + Lnm.toFixed(2) + ' nm', (xLeftWall + xRightWall) / 2, yFloor + 6);

  // The "classically forbidden" captions need real room to avoid colliding
  // with each other or the energy labels -- skip them on narrow canvases,
  // where the shaded region alone still carries the meaning.
  if (!geom.narrow) {
    fill(141, 110, 99, 200);
    textAlign(LEFT, TOP);
    textSize(10.5);
    text('classically forbidden (V > E)', geom.x0 + 4, yCeil + 6);
    textAlign(RIGHT, TOP);
    text('classically forbidden (V > E)', geom.x1 - 4, yCeil + 6);
  }
}

function drawEnergyLevels(geom, states) {
  states.forEach((s) => {
    const y = eToPx(s.E_eV, geom);
    stroke(150);
    strokeWeight(1);
    drawingContext.setLineDash([4, 3]);
    line(geom.x0, y, geom.x1, y);
    drawingContext.setLineDash([]);

    noStroke();
    fill('#B8860B');
    textAlign(LEFT, BOTTOM);
    textSize(geom.narrow ? 9.5 : 11);
    const label = geom.narrow
      ? 'E' + s.n + '=' + s.E_eV.toFixed(2)
      : 'E' + s.n + ' = ' + s.E_eV.toFixed(3) + ' eV (' + s.parity + ')';
    const labelW = textWidth(label);
    text(label, geom.x1 - labelW - 6, y - 3);
  });
}

function drawEigenfunction(geom, selected, Lnm, states) {
  const baseY = eToPx(selected.E_eV, geom);
  const levelGapPx = estimateLevelGapPx(geom, states, selected);
  const amp = Math.min(levelGapPx * 0.42, 55);
  const L = Lnm * NM;
  const halfL = Lnm / 2;
  const xLeftWall = xToPx(-halfL, geom);
  const xRightWall = xToPx(halfL, geom);

  // Shade the area under the curve specifically in the penetration tails
  // (outside the well) so the "wavefunction is nonzero here" fact is
  // impossible to miss, not just a thin line lost against the baseline.
  noStroke();
  fill(30, 136, 229, 55);
  const drawTailFill = (pxStart, pxEnd) => {
    beginShape();
    vertex(pxStart, baseY);
    for (let px = pxStart; px <= pxEnd; px += 2) {
      const xNm = map(px, geom.x0, geom.x1, -geom.xHalfRangeNm, geom.xHalfRangeNm);
      const psi = finiteEigenfunction(xNm * NM, selected, L);
      vertex(px, baseY - psi * amp);
    }
    vertex(pxEnd, baseY);
    endShape(CLOSE);
  };
  drawTailFill(geom.x0, xLeftWall);
  drawTailFill(xRightWall, geom.x1);

  stroke('#1E88E5');
  strokeWeight(2.4);
  noFill();
  beginShape();
  for (let px = geom.x0; px <= geom.x1; px += 3) {
    const xNm = map(px, geom.x0, geom.x1, -geom.xHalfRangeNm, geom.xHalfRangeNm);
    const psi = finiteEigenfunction(xNm * NM, selected, L);
    vertex(px, baseY - psi * amp);
  }
  endShape();

  noStroke();
  fill('#1E88E5');
  textAlign(LEFT, TOP);
  textSize(geom.narrow ? 10 : 11);
  text('ψ' + selected.n + '(x)  (shaded tail = penetration)', geom.x0, geom.narrow ? 34 : geom.top - 30);
}

function drawInfiniteOverlay(geom, selected, Lnm, states) {
  const baseY = eToPx(selected.E_eV, geom);
  const levelGapPx = estimateLevelGapPx(geom, states, selected);
  const amp = Math.min(levelGapPx * 0.42, 55);
  const L = Lnm * NM;

  drawingContext.setLineDash([6, 4]);
  stroke('#E67E22');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let px = geom.x0; px <= geom.x1; px += 3) {
    const xNm = map(px, geom.x0, geom.x1, -geom.xHalfRangeNm, geom.xHalfRangeNm);
    const psi = infiniteEigenfunction(xNm * NM, selected.n, L);
    vertex(px, baseY - psi * amp);
  }
  endShape();
  drawingContext.setLineDash([]);

  noStroke();
  fill('#E67E22');
  textAlign(LEFT, TOP);
  textSize(geom.narrow ? 10 : 11);
  const label = geom.narrow
    ? '- - infinite well (zero at walls)'
    : '- - infinite-well ψ' + selected.n + '(x) (zero exactly at walls)';
  text(label, geom.x0, geom.narrow ? 50 : geom.top - 16);
}

function estimateLevelGapPx(geom, states, selected) {
  if (states.length < 2) return 70;
  const idx = states.findIndex((s) => s.n === selected.n);
  const neighborIdx = idx === states.length - 1 ? idx - 1 : idx + 1;
  const gapE = Math.abs(states[neighborIdx].E_eV - selected.E_eV);
  const gapPx = Math.abs(eToPx(selected.E_eV, geom) - eToPx(selected.E_eV + gapE, geom));
  return gapPx || 70;
}

function drawReadout(geom, states, selected) {
  const boxY = drawHeight - 66;
  fill(245);
  stroke(200);
  strokeWeight(1);
  rect(margin, boxY, 260, 56, 8);
  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(12);
  text('Bound states found: ' + states.length, margin + 10, boxY + 8);
  if (selected) {
    text('κ (decay rate outside well): ' + formatSci(selected.kappa) + ' m⁻¹', margin + 10, boxY + 28);
  }
}

function formatSci(x) {
  if (x === 0) return '0';
  const exp = Math.floor(Math.log10(Math.abs(x)));
  const mantissa = x / Math.pow(10, exp);
  return mantissa.toFixed(2) + ' x 10^' + exp;
}

function drawControlLabels(Lnm, V0eV, count) {
  const selectW = stateSelect.elt.getBoundingClientRect().width;
  const checkboxW = compareCheckbox.elt.getBoundingClientRect().width;
  const stacked = (10 + selectW + 16 + checkboxW + 10) > canvasWidth;
  const [row1, row2] = stacked ? [70, 105] : [40, 75];

  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Well width L: ' + Lnm.toFixed(2) + ' nm', 10, drawHeight + row1 + 10);
  text('Well depth V₀: ' + V0eV.toFixed(2) + ' eV', 10, drawHeight + row2 + 10);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  var mainEl = document.querySelector('main');
  containerWidth = Math.floor(mainEl.getBoundingClientRect().width);
  canvasWidth = containerWidth;
  canvasHeight = drawHeight + controlHeight;
  containerHeight = canvasHeight;
}
