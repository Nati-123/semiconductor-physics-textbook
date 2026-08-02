// Schroedinger Wavefunction & Eigenstates Visualizer MicroSim
// Animates a complex wavefunction psi(x,t), showing Re[psi], Im[psi], and
// the probability density |psi|^2 = Re^2 + Im^2.
// Two modes:
//   Eigenstate  -- a single plane-wave component e^{i(kx-wt)}. |psi|^2 is
//                  flat and time-independent -- only the complex phase
//                  rotates -- the textbook meaning of a "stationary state,"
//                  contrasted against Particle in a Box's *shaped*
//                  eigenstates (whose shape comes from boundary conditions,
//                  absent here).
//   Wave packet -- a sum of 7 plane-wave components with Gaussian weights
//                  centered on k0. The components dephase over time
//                  (omega ~ k^2, the free-particle dispersion relation),
//                  so the packet visibly drifts and spreads -- the same
//                  physics behind the Heisenberg uncertainty tradeoff
//                  taught earlier in the chapter.
// Animation time is a dimensionless, dramatized "phase-time," NOT real
// seconds or femtoseconds -- stated explicitly in the sim's guided-
// exploration text so it is never mistaken for literal real-time playback.
// Bloom Level: Understand / Analyze (L2-L4) - visualize, contrast, explain
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 160;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 30;
let sliderLeftMargin = 220;

let startButton, packetModeCheckbox;
let k0Slider, sigmaKSlider, speedSlider;
let isRunning = false;
let simTime = 0;

// --- schematic (dimensionless) constants ---
const X_RANGE = 6;          // plotted x spans [-X_RANGE, X_RANGE]
const ANGULAR_UNIT = 0.01;  // reference angular-speed scale (illustrative, not real hbar/m)
const N_COMPONENTS = 7;
const SPACING_SCALE = 0.2;  // shrinks slider Delta k to a true k-space component spacing

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  startButton = createButton('Start');
  startButton.mousePressed(toggleRunning);

  packetModeCheckbox = createCheckbox('Wave packet (uncheck for single eigenstate)', true);
  packetModeCheckbox.changed(resetTime);

  k0Slider = createSlider(2, 10, 5, 0.5);
  k0Slider.input(resetTime);
  k0Slider.attribute('aria-label', 'Central wavenumber k0');

  sigmaKSlider = createSlider(0.3, 2.5, 1.0, 0.1);
  sigmaKSlider.input(resetTime);
  sigmaKSlider.attribute('aria-label', 'Packet width in k-space, delta k');

  speedSlider = createSlider(0.3, 3, 1, 0.1);
  speedSlider.attribute('aria-label', 'Animation speed');

  positionUIElements();

  describe('Animated complex wavefunction visualizer showing the real part, imaginary part, and probability density of either a single plane-wave eigenstate (flat, time-independent probability density) or a multi-component Gaussian wave packet (localized, drifting, and spreading probability density)', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;

  startButton.position(bx + 10, by + drawHeight + 5);
  packetModeCheckbox.position(bx + 90, by + drawHeight + 8);

  k0Slider.position(bx + sliderLeftMargin, by + drawHeight + 40);
  k0Slider.size(canvasWidth - sliderLeftMargin - margin);

  sigmaKSlider.position(bx + sliderLeftMargin, by + drawHeight + 75);
  sigmaKSlider.size(canvasWidth - sliderLeftMargin - margin);

  speedSlider.position(bx + sliderLeftMargin, by + drawHeight + 110);
  speedSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function toggleRunning() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Stop' : 'Start');
}

function resetTime() {
  simTime = 0;
}

// ---------- physics ----------
// Returns the list of {k, weight, omega} components for the current mode.
function currentComponents() {
  const k0 = k0Slider.value();
  if (!packetModeCheckbox.checked()) {
    return [{ k: k0, weight: 1, omega: ANGULAR_UNIT }];
  }
  // A discrete sum of only 7 plane waves is inherently periodic in x with
  // period 2*PI/spacing. SPACING_SCALE keeps that period much larger than
  // the plotted X_RANGE window (even at the slider's max Delta k) so only
  // one packet is ever visible, never a repeating "comb" of copies.
  const spacing = sigmaKSlider.value() * SPACING_SCALE;
  const comps = [];
  let weightSum = 0;
  for (let n = 0; n < N_COMPONENTS; n++) {
    const offset = n - (N_COMPONENTS - 1) / 2; // -3..3
    const k = k0 + offset * spacing;
    const weight = Math.exp(-(offset * offset) / 2);
    weightSum += weight;
    comps.push({ k, weight, offset });
  }
  // normalize weights to sum to 1, then attach dispersion omega ~ k^2/k0^2
  comps.forEach((c) => {
    c.weight = c.weight / weightSum;
    c.omega = ANGULAR_UNIT * (c.k * c.k) / (k0 * k0);
  });
  return comps;
}

function psiAt(x, comps) {
  let re = 0, im = 0;
  comps.forEach((c) => {
    const phase = c.k * x - c.omega * simTime;
    re += c.weight * Math.cos(phase);
    im += c.weight * Math.sin(phase);
  });
  return { re, im, prob: re * re + im * im };
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

  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  text('Schrödinger Wavefunction & Eigenstates Visualizer', canvasWidth / 2, 10);

  const isPacket = packetModeCheckbox.checked();
  fill(isPacket ? '#2E7D32' : '#5A3EED');
  textAlign(CENTER, TOP);
  textSize(13);
  text(isPacket ? 'Mode: Wave Packet (superposition of 7 components)' : 'Mode: Eigenstate (single plane wave)', canvasWidth / 2, 32);

  const comps = currentComponents();

  if (isRunning) {
    simTime += speedSlider.value();
  }

  const geom = computeGeometry();
  drawWavePanel(geom, comps);
  drawDensityPanel(geom, comps);
  drawControlLabels();

  if (!isRunning && simTime === 0) {
    fill(80);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(13);
    text('Press Start to animate ψ(x,t)  —  time shown is illustrative, not real seconds', canvasWidth / 2, drawHeight - 12);
  }
}

function computeGeometry() {
  const x0 = margin + 10;
  const x1 = canvasWidth - margin - 10;
  const waveTop = 45;
  const waveBottom = 225;
  const waveBaseline = (waveTop + waveBottom) / 2;
  const densTop = 240;
  const densBottom = 385;
  return { x0, x1, waveTop, waveBottom, waveBaseline, densTop, densBottom };
}

function xToPx(x, geom) {
  return map(x, -X_RANGE, X_RANGE, geom.x0, geom.x1);
}

function drawWavePanel(geom, comps) {
  const amp = (geom.waveBottom - geom.waveTop) / 2 - 10;

  stroke(210);
  strokeWeight(1);
  line(geom.x0, geom.waveBaseline, geom.x1, geom.waveBaseline);

  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(12);
  text('Re[ψ] and Im[ψ]', geom.x0, geom.waveTop - 18);

  // Re[psi] -- solid blue
  stroke('#1E88E5');
  strokeWeight(2.2);
  noFill();
  beginShape();
  for (let px = geom.x0; px <= geom.x1; px += 3) {
    const x = map(px, geom.x0, geom.x1, -X_RANGE, X_RANGE);
    const { re } = psiAt(x, comps);
    vertex(px, geom.waveBaseline - re * amp);
  }
  endShape();

  // Im[psi] -- dashed orange
  drawingContext.setLineDash([5, 4]);
  stroke('#E67E22');
  strokeWeight(2.2);
  noFill();
  beginShape();
  for (let px = geom.x0; px <= geom.x1; px += 3) {
    const x = map(px, geom.x0, geom.x1, -X_RANGE, X_RANGE);
    const { im } = psiAt(x, comps);
    vertex(px, geom.waveBaseline - im * amp);
  }
  endShape();
  drawingContext.setLineDash([]);

  noStroke();
  fill('#1E88E5');
  textSize(11);
  textAlign(LEFT, TOP);
  text('— Re[ψ]', geom.x1 - 110, geom.waveTop - 18);
  fill('#E67E22');
  text('- - Im[ψ]', geom.x1 - 50, geom.waveTop - 18);
}

function drawDensityPanel(geom, comps) {
  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(12);
  text('Probability density |ψ|²', geom.x0, geom.densTop - 18);

  stroke(210);
  strokeWeight(1);
  line(geom.x0, geom.densBottom, geom.x1, geom.densBottom);

  const heightScale = geom.densBottom - geom.densTop;

  fill(90, 40, 200, 70);
  noStroke();
  beginShape();
  vertex(geom.x0, geom.densBottom);
  for (let px = geom.x0; px <= geom.x1; px += 3) {
    const x = map(px, geom.x0, geom.x1, -X_RANGE, X_RANGE);
    const { prob } = psiAt(x, comps);
    vertex(px, geom.densBottom - prob * heightScale);
  }
  vertex(geom.x1, geom.densBottom);
  endShape(CLOSE);

  stroke('#5A3EED');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let px = geom.x0; px <= geom.x1; px += 3) {
    const x = map(px, geom.x0, geom.x1, -X_RANGE, X_RANGE);
    const { prob } = psiAt(x, comps);
    vertex(px, geom.densBottom - prob * heightScale);
  }
  endShape();
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Central k₀: ' + k0Slider.value().toFixed(1), 10, drawHeight + 50);
  text('Packet width Δk: ' + sigmaKSlider.value().toFixed(1), 10, drawHeight + 85);
  text('Animation speed: ' + speedSlider.value().toFixed(1) + '×', 10, drawHeight + 120);
}

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
