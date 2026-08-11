// Intrinsic Carrier Excitation / Electron-Hole Pair Explorer MicroSim
// Shows a schematic energy-space band diagram (conduction band above a
// gap Eg above a valence band, NOT an E-k diagram). A fixed set of
// valence-band "electron sites" occasionally gets thermally excited:
// one bound electron jumps up into the conduction band, leaving a hole
// behind at its original site -- always exactly one electron AND one
// hole per event, which is why n = p = ni for an intrinsic semiconductor.
// Free electrons also recombine back into holes over time, producing a
// fluctuating dynamic equilibrium whose average pair count rises with
// Temperature T and falls with band gap Eg, echoing (without deriving)
// Chapter 9's n_i ~ exp(-Eg/2kT) result. Generation/recombination rates
// here are illustrative (visually rescaled), not physically exact.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02 (2D animated variant)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 210;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 50;

let tSlider, egSlider, startStopBtn, resetBtn;
let isAnimating = false;

const N_COLS = 8, N_ROWS = 4;
const N_SITES = N_COLS * N_ROWS;

const T_MIN = 100, T_MAX = 900, T_DEFAULT = 300;
const EG_MIN = 0.3, EG_MAX = 3.0, EG_DEFAULT = 1.12;

const K_EFF = 0.0011;      // eV/K, illustrative visualization scale (NOT physical kB)
const GEN_RATE_MAX = 3.0;  // events/sec at the fastest illustrative rate
const RECOMB_RATE = 0.45;  // recombinations/sec per existing free electron

const D_RISE = 0.55, D_FALL = 0.45; // seconds

let sites = [];       // {x, y, state: 'bound' | 'hole'}
let freeElectrons = []; // {x, y, state:'rising'|'resting'|'falling', sx,sy,tx,ty,t0,dur, targetSiteIndex, vx, vy}

let pairEMA = 0;
let lastMillis = 0;

const CB_COLOR = '#5A3EED';
const VB_COLOR = '#2E7D32';
const ELECTRON_COLOR = '#1565C0';
const HOLE_COLOR = '#C62828';

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  tSlider = createSlider(T_MIN, T_MAX, T_DEFAULT, 5);
  tSlider.attribute('aria-label', 'Temperature T in kelvin');

  egSlider = createSlider(EG_MIN, EG_MAX, EG_DEFAULT, 0.01);
  egSlider.attribute('aria-label', 'Band gap Eg in electron volts');

  startStopBtn = createButton('Start');
  startStopBtn.attribute('aria-label', 'Start or stop the animation');
  startStopBtn.mousePressed(function () {
    isAnimating = !isAnimating;
    startStopBtn.html(isAnimating ? 'Stop' : 'Start');
    lastMillis = millis();
  });

  resetBtn = createButton('Reset');
  resetBtn.attribute('aria-label', 'Reset all sites to bound and stop the animation');
  resetBtn.mousePressed(resetSim);

  initSites();
  positionUIElements();

  describe('Intrinsic carrier excitation explorer: a schematic band diagram where valence-band electrons occasionally jump to the conduction band, leaving a hole behind, illustrating electron-hole pair generation with n equal to p', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function initSites() {
  sites = [];
  for (let i = 0; i < N_SITES; i++) {
    sites.push({ col: i % N_COLS, row: Math.floor(i / N_COLS), state: 'bound' });
  }
  freeElectrons = [];
  pairEMA = 0;
}

function resetSim() {
  isAnimating = false;
  startStopBtn.html('Start');
  initSites();
}

function controlX() {
  return canvasWidth < 480 ? 130 : 190;
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;
  const cx = controlX();

  tSlider.position(bx + cx, by + drawHeight + 12);
  tSlider.size(min(canvasWidth - cx - margin - 10, 300));

  egSlider.position(bx + cx, by + drawHeight + 50);
  egSlider.size(min(canvasWidth - cx - margin - 10, 300));

  startStopBtn.position(bx + 10, by + drawHeight + 90);
  resetBtn.position(bx + 90, by + drawHeight + 90);
}

function compact() { return canvasWidth < 480; }

function genRatePerSecond(Eg, T) {
  const exponent = Eg / (2 * K_EFF * T);
  return GEN_RATE_MAX * Math.exp(-exponent);
}

// ---------- geometry ----------
function bandGeometry() {
  const plotY0 = 48;
  const cbY0 = plotY0 + 10, cbY1 = cbY0 + 78;
  const gapY0 = cbY1, gapY1 = gapY0 + 88;
  const vbY0 = gapY1, vbY1 = vbY0 + 118;
  const plotX0 = margin + 10, plotX1 = canvasWidth - margin;
  return { plotX0, plotX1, cbY0, cbY1, gapY0, gapY1, vbY0, vbY1 };
}

function siteXY(site, geo) {
  const padX = 24;
  const usableW = (geo.plotX1 - geo.plotX0) - 2 * padX;
  const colSpacing = usableW / (N_COLS - 1);
  const rowSpacing = (geo.vbY1 - geo.vbY0 - 30) / (N_ROWS - 1);
  const x = geo.plotX0 + padX + site.col * colSpacing;
  const y = geo.vbY0 + 18 + site.row * rowSpacing;
  return { x, y };
}

// ---------- simulation step ----------
function stepSimulation(dt) {
  const T = tSlider.value();
  const Eg = egSlider.value();
  const rate = genRatePerSecond(Eg, T);
  const geo = bandGeometry();

  // generation: excite one bound electron to the conduction band
  const pGen = 1 - Math.exp(-rate * dt);
  if (Math.random() < pGen) {
    const boundIdx = [];
    for (let i = 0; i < sites.length; i++) if (sites[i].state === 'bound') boundIdx.push(i);
    if (boundIdx.length > 0) {
      const idx = boundIdx[Math.floor(Math.random() * boundIdx.length)];
      sites[idx].state = 'hole';
      const p0 = siteXY(sites[idx], geo);
      const tx = random(geo.plotX0 + 30, geo.plotX1 - 30);
      const ty = random(geo.cbY0 + 14, geo.cbY1 - 14);
      freeElectrons.push({
        x: p0.x, y: p0.y, state: 'rising',
        sx: p0.x, sy: p0.y, tx: tx, ty: ty,
        t0: millis(), dur: D_RISE * 1000,
        vx: random(-6, 6), vy: random(-4, 4),
        siteIndex: idx
      });
    }
  }

  // recombination: a resting free electron falls back into an available hole
  const pRecomb = 1 - Math.exp(-RECOMB_RATE * dt);
  for (let i = 0; i < freeElectrons.length; i++) {
    const e = freeElectrons[i];
    if (e.state !== 'resting') continue;
    if (Math.random() < pRecomb) {
      const holeIdx = [];
      for (let j = 0; j < sites.length; j++) if (sites[j].state === 'hole') holeIdx.push(j);
      if (holeIdx.length > 0) {
        const target = holeIdx[Math.floor(Math.random() * holeIdx.length)];
        const p1 = siteXY(sites[target], geo);
        e.state = 'falling';
        e.sx = e.x; e.sy = e.y;
        e.tx = p1.x; e.ty = p1.y;
        e.t0 = millis(); e.dur = D_FALL * 1000;
        e.targetSiteIndex = target;
        sites[target].state = 'pending-fill'; // reserve so no double target
      }
    }
  }

  // advance animated electrons
  for (let i = freeElectrons.length - 1; i >= 0; i--) {
    const e = freeElectrons[i];
    if (e.state === 'rising' || e.state === 'falling') {
      const tNorm = constrain((millis() - e.t0) / e.dur, 0, 1);
      e.x = lerp(e.sx, e.tx, tNorm);
      e.y = lerp(e.sy, e.ty, tNorm);
      if (tNorm >= 1) {
        if (e.state === 'rising') {
          e.state = 'resting';
        } else {
          sites[e.targetSiteIndex].state = 'bound';
          freeElectrons.splice(i, 1);
        }
      }
    } else if (e.state === 'resting') {
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      if (e.x < geo.plotX0 + 20 || e.x > geo.plotX1 - 20) e.vx *= -1;
      if (e.y < geo.cbY0 + 12 || e.y > geo.cbY1 - 12) e.vy *= -1;
      e.x = constrain(e.x, geo.plotX0 + 20, geo.plotX1 - 20);
      e.y = constrain(e.y, geo.cbY0 + 12, geo.cbY1 - 12);
    }
  }

  const pairCount = freeElectrons.length;
  pairEMA = pairEMA === 0 ? pairCount : lerp(pairEMA, pairCount, 0.02);
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
  stroke(225);
  strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  const now = millis();
  const dt = lastMillis === 0 ? 0 : constrain((now - lastMillis) / 1000, 0, 0.1);
  lastMillis = now;

  if (isAnimating) stepSimulation(dt);

  drawDiagram();
  drawControlLabels();
}

function drawDiagram() {
  const geo = bandGeometry();

  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(compact() ? 13 : 16);
  text('Intrinsic Carrier Excitation: Electron-Hole Pair Generation', canvasWidth / 2, 8);

  // conduction band region
  fill(90, 62, 237, 30);
  stroke(CB_COLOR);
  strokeWeight(1.5);
  rect(geo.plotX0, geo.cbY0, geo.plotX1 - geo.plotX0, geo.cbY1 - geo.cbY0, 4);

  // valence band region
  fill(46, 125, 50, 30);
  stroke(VB_COLOR);
  rect(geo.plotX0, geo.vbY0, geo.plotX1 - geo.plotX0, geo.vbY1 - geo.vbY0, 4);

  // band labels
  noStroke();
  fill(CB_COLOR);
  textAlign(LEFT, BOTTOM);
  textSize(compact() ? 11 : 12);
  text('Conduction Band (Ec)', geo.plotX0 + 8, geo.cbY0 - 3);
  fill(VB_COLOR);
  text('Valence Band (Ev)', geo.plotX0 + 8, geo.vbY0 - 3);

  // Eg bracket, right side of the gap
  const bx_ = geo.plotX1 - 14;
  stroke(120); strokeWeight(1.2);
  line(bx_, geo.cbY1, bx_, geo.vbY0);
  line(bx_ - 4, geo.cbY1, bx_ + 4, geo.cbY1);
  line(bx_ - 4, geo.vbY0, bx_ + 4, geo.vbY0);
  noStroke(); fill(60);
  textAlign(RIGHT, CENTER);
  textSize(compact() ? 10 : 11);
  text('Eg = ' + egSlider.value().toFixed(2) + ' eV', bx_ - 8, (geo.cbY1 + geo.vbY0) / 2);

  // valence-band sites: bound electrons (filled) or holes (open ring with +)
  for (let i = 0; i < sites.length; i++) {
    const s = sites[i];
    const p = siteXY(s, geo);
    if (s.state === 'bound') {
      noStroke();
      fill(ELECTRON_COLOR);
      circle(p.x, p.y, 11);
    } else {
      // hole (includes 'hole' and transient 'pending-fill')
      noFill();
      stroke(HOLE_COLOR);
      strokeWeight(1.8);
      circle(p.x, p.y, 11);
      noStroke();
      fill(HOLE_COLOR);
      textAlign(CENTER, CENTER);
      textSize(10);
      text('+', p.x, p.y + 0.5);
    }
  }

  // free / animating electrons
  for (let i = 0; i < freeElectrons.length; i++) {
    const e = freeElectrons[i];
    if (e.state === 'rising' || e.state === 'falling') {
      stroke(e.state === 'rising' ? '#E67E22' : '#00897B');
      strokeWeight(1.5);
      drawingContext.setLineDash([3, 3]);
      line(e.sx, e.sy, e.x, e.y);
      drawingContext.setLineDash([]);
    }
    noStroke();
    fill(ELECTRON_COLOR);
    circle(e.x, e.y, 11);
  }

  // legend
  drawLegend(geo);
}

function drawLegend(geo) {
  const legendY = geo.vbY1 + (compact() ? 18 : 22);
  textAlign(LEFT, CENTER);
  textSize(compact() ? 10 : 11);
  let lx = geo.plotX0;

  noStroke(); fill(ELECTRON_COLOR);
  circle(lx + 6, legendY, 10);
  fill(20); text('Electron', lx + 16, legendY);
  lx += (compact() ? 80 : 95);

  noFill(); stroke(HOLE_COLOR); strokeWeight(1.5);
  circle(lx + 6, legendY, 10);
  noStroke(); fill(20); text('Hole', lx + 16, legendY);
  lx += (compact() ? 65 : 78);

  stroke('#E67E22'); strokeWeight(2);
  drawingContext.setLineDash([3, 3]);
  line(lx, legendY, lx + 16, legendY);
  drawingContext.setLineDash([]);
  noStroke(); fill(20); text('Generation', lx + 22, legendY);
  lx += (compact() ? 105 : 120);

  stroke('#00897B'); strokeWeight(2);
  drawingContext.setLineDash([3, 3]);
  line(lx, legendY, lx + 16, legendY);
  drawingContext.setLineDash([]);
  noStroke(); fill(20); text('Recombination', lx + 22, legendY);
}

function drawControlLabels() {
  fill('black');
  noStroke();
  const cx = controlX();
  textSize(compact() ? 11.5 : 13);

  const T = tSlider.value();
  const Eg = egSlider.value();

  textAlign(RIGHT, CENTER);
  text('T: ' + T.toFixed(0) + ' K', cx - 10, drawHeight + 24);
  text('Eg: ' + Eg.toFixed(2) + ' eV', cx - 10, drawHeight + 62);

  // readout row (below buttons)
  const readY1 = drawHeight + 128;
  const readY2 = readY1 + (compact() ? 18 : 20);
  const n = freeElectrons.length;
  const p = n; // enforced equal by construction: one hole per free electron
  textAlign(LEFT, CENTER);
  fill('#333');
  textSize(compact() ? 10.5 : 12);
  text('Free electrons n = ' + n + '   |   Holes p = ' + p + '   (always n = p = ni)', 12, readY1);
  text('Running average pairs ≈ ' + pairEMA.toFixed(1) + (isAnimating ? '' : '   [Start to animate]'), 12, readY2);

  // relative generation-activity meter
  const rate = genRatePerSecond(Eg, T);
  const frac = constrain(rate / GEN_RATE_MAX, 0, 1);
  const meterY = readY2 + (compact() ? 20 : 22);
  const meterX = 12, meterW = min(canvasWidth - 24, 260);
  noStroke(); fill(225);
  rect(meterX, meterY - 5, meterW, 10, 5);
  fill('#E67E22');
  rect(meterX, meterY - 5, meterW * frac, 10, 5);
  fill('#333'); textSize(compact() ? 9.5 : 10.5);
  textAlign(LEFT, TOP);
  text('Generation activity (illustrative, not to physical scale)', meterX, meterY + 8);
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
  controlHeight = compact() ? 240 : 210;

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
