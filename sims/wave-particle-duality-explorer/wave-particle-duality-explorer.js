// Wave-Particle Duality Explorer MicroSim
// Fires single "particles" one at a time at a one- or two-slit barrier.
// Each particle's landing position on the screen is sampled from the
// Fraunhofer diffraction intensity pattern, so individual hits appear
// random but the accumulated pattern reveals interference fringes only
// when both slits are open -- the classic demonstration that quantum
// particles are detected individually (particle behavior) yet build up
// a wave-interference pattern collectively (wave behavior).
// Schematic dimensionless units (not literal nanometer-scale optics).
// Bloom Level: Understand / Apply (L2-L3) - observe, predict, explain
// MicroSim template version 2026.02 (first animated MicroSim in this project)

let containerWidth;
let canvasWidth = 750;
let drawHeight = 420;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 24;
let sliderLeftMargin = 220;

let startButton, clearButton, twoSlitsCheckbox;
let dSlider, lambdaSlider;
let isRunning = false;

// --- schematic physics constants (dimensionless) ---
const SCREEN_L = 10;      // source-to-screen distance
// Single-slit width. Wide enough that sinc^2 visibly rolls off to its first
// minimum within +/-Y_RANGE for the default wavelength -- too narrow a slit
// (e.g. the previous 0.15) keeps the curve pinned near I=1 across the whole
// screen, which looks like a rendering bug rather than a diffraction envelope.
const SLIT_WIDTH = 0.9;
const Y_RANGE = 6;        // screen half-height, schematic units

// --- accumulated-pattern buffer (persistent, off-screen) ---
let patternBuffer;
let patternStripW = 60;   // recomputed responsively; wide enough that the
                           // accumulated dots read as a fuzzy build-up band,
                           // not a single hard-to-see pixel-wide line
let particleCount = 0;

// --- current in-flight particle (one at a time) ---
let flight = null; // { t, landingY }
const FLIGHT_STEP = 0.045;

const COLOR_DETECTED = '#1565C0';   // landed particles (actual data)
const COLOR_FLIGHT = '#2E7D32';     // particle currently in transit
const COLOR_PREDICTED = '#E67E22';  // theoretical intensity curve

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  patternBuffer = createGraphics(patternStripW, drawHeight);

  startButton = createButton('Start');
  startButton.mousePressed(toggleRunning);

  clearButton = createButton('↺ Clear Pattern');
  clearButton.mousePressed(clearPattern);

  twoSlitsCheckbox = createCheckbox('Two slits open', true);
  twoSlitsCheckbox.changed(clearPattern);

  dSlider = createSlider(1, 6, 3, 0.1);
  dSlider.input(clearPattern);
  dSlider.attribute('aria-label', 'Slit separation d');

  lambdaSlider = createSlider(0.3, 1.5, 0.6, 0.05);
  lambdaSlider.input(clearPattern);
  lambdaSlider.attribute('aria-label', 'Wavelength lambda');

  positionUIElements();

  describe('Double-slit particle-buildup demonstration: individual particles land at random-looking positions on a screen, but the accumulated pattern shows interference fringes only when two slits are open, illustrating wave-particle duality', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

let checkboxStacked = false; // shared with drawControlLabels() for the caption row

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;

  startButton.position(bx + 10, by + drawHeight + 8);
  clearButton.position(bx + 90, by + drawHeight + 8);

  const clearRight = 90 + clearButton.elt.getBoundingClientRect().width + 16;
  const checkboxW = twoSlitsCheckbox.elt.getBoundingClientRect().width;
  checkboxStacked = (clearRight + checkboxW + 10) > canvasWidth;

  const sliderRowY = checkboxStacked ? [72, 106] : [42, 76];
  if (checkboxStacked) {
    twoSlitsCheckbox.position(bx + 10, by + drawHeight + 40);
  } else {
    twoSlitsCheckbox.position(bx + clearRight, by + drawHeight + 11);
  }

  const sliderW = Math.max(80, canvasWidth - sliderLeftMargin - margin);
  dSlider.position(bx + sliderLeftMargin, by + drawHeight + sliderRowY[0]);
  dSlider.size(sliderW);

  lambdaSlider.position(bx + sliderLeftMargin, by + drawHeight + sliderRowY[1]);
  lambdaSlider.size(sliderW);
}

function toggleRunning() {
  isRunning = !isRunning;
  startButton.html(isRunning ? 'Stop' : 'Start');
}

function clearPattern() {
  patternBuffer.clear();
  particleCount = 0;
  flight = null;
}

// ---------- physics ----------
function sinc(x) {
  return x === 0 ? 1 : Math.sin(x) / x;
}

function intensityTwoSlit(y, d, lambda) {
  return Math.pow(Math.cos((Math.PI * d * y) / (lambda * SCREEN_L)), 2);
}

function intensityOneSlit(y, lambda) {
  const beta = (Math.PI * SLIT_WIDTH * y) / (lambda * SCREEN_L);
  return Math.pow(sinc(beta), 2);
}

function currentIntensity(y) {
  const d = dSlider.value();
  const lambda = lambdaSlider.value();
  return twoSlitsCheckbox.checked() ? intensityTwoSlit(y, d, lambda) : intensityOneSlit(y, lambda);
}

function sampleLandingY() {
  for (let tries = 0; tries < 200; tries++) {
    const y = random(-Y_RANGE, Y_RANGE);
    const I = currentIntensity(y);
    if (random(0, 1) < I) return y;
  }
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

  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(canvasWidth < 500 ? 14 : 18);
  text('Wave-Particle Duality Explorer', canvasWidth / 2, 8);

  const geom = computeGeometry();

  if (isRunning) {
    advanceSimulation(geom);
  }

  drawApparatus(geom);
  image(patternBuffer, geom.screenX + 4, 0);
  drawIntensityCurve(geom);
  if (flight) drawFlightParticle(geom);
  drawReadouts(geom);
  drawControlLabels();
}

// Fully responsive, percentage-of-canvasWidth geometry — the previous
// version used fixed pixel offsets from the edges, which left a huge empty
// gap in the middle at wide widths and crushed the intensity curve into a
// sliver against the right edge at narrow ones.
function computeGeometry() {
  const narrow = canvasWidth < 560;
  const plotTop = 40;
  const plotBottom = drawHeight - 16;
  const midY = plotTop + (plotBottom - plotTop) / 2;

  const sourceX = margin + 20;
  const barrierX = canvasWidth * (narrow ? 0.20 : 0.24);
  const screenX = canvasWidth * (narrow ? 0.46 : 0.58);

  patternStripW = constrain(canvasWidth * 0.09, 36, 90);
  const curveX0 = screenX + patternStripW + 22;
  const curveMaxW = Math.max(50, canvasWidth - margin - curveX0);

  const pxPerUnit = (plotBottom - plotTop) / 2 / Y_RANGE;

  return { sourceX, sourceY: midY, barrierX, screenX, curveX0, curveMaxW,
    pxPerUnit, midY, plotTop, plotBottom };
}

function yToPx(y, geom) {
  return geom.midY - y * geom.pxPerUnit;
}

function advanceSimulation(geom) {
  if (!flight) {
    flight = { t: 0, landingY: sampleLandingY() };
    return;
  }
  flight.t += FLIGHT_STEP;
  if (flight.t >= 1) {
    // particle lands: stamp it onto the persistent buffer, with a little
    // horizontal jitter so the strip reads as a scattered build-up (like
    // the real experiment) rather than a single hard line of dots
    const py = yToPx(flight.landingY, geom);
    patternBuffer.noStroke();
    patternBuffer.fill(21, 101, 192, 190);
    patternBuffer.circle(random(6, patternStripW - 6), py, 3.5);
    particleCount++;
    flight = null;
  }
}

function drawFlightParticle(geom) {
  let px, py;
  if (flight.t < 0.5) {
    const t2 = flight.t / 0.5;
    px = lerp(geom.sourceX, geom.barrierX, t2);
    py = geom.sourceY;
  } else {
    const t2 = (flight.t - 0.5) / 0.5;
    px = lerp(geom.barrierX, geom.screenX, t2);
    py = lerp(geom.sourceY, yToPx(flight.landingY, geom), t2);
  }
  noStroke();
  fill(COLOR_FLIGHT);
  circle(px, py, 9);
}

function drawApparatus(geom) {
  const twoSlits = twoSlitsCheckbox.checked();

  // source
  noStroke();
  fill('#5A3EED');
  circle(geom.sourceX, geom.sourceY, 14);
  fill(20);
  textAlign(CENTER, TOP);
  textSize(12);
  text('Source', geom.sourceX, geom.sourceY + 14);

  // barrier with slit gap(s), drawn as solid posts so the open slits read
  // clearly as gaps in an otherwise-opaque wall
  const barrierTop = geom.plotTop + 20;
  const barrierBottom = geom.plotBottom - 20;
  const d = dSlider.value();
  const gapPx = map(d, 1, 6, 14, 70);
  const slitHalf = gapPx / 2;
  const postW = 9;

  noStroke();
  fill('#4A4A4A');
  if (twoSlits) {
    const c1 = geom.midY - gapPx;
    const c2 = geom.midY + gapPx;
    rect(geom.barrierX - postW / 2, barrierTop, postW, (c1 - slitHalf) - barrierTop);
    rect(geom.barrierX - postW / 2, c1 + slitHalf, postW, (c2 - slitHalf) - (c1 + slitHalf));
    rect(geom.barrierX - postW / 2, c2 + slitHalf, postW, barrierBottom - (c2 + slitHalf));
  } else {
    rect(geom.barrierX - postW / 2, barrierTop, postW, (geom.midY - slitHalf) - barrierTop);
    rect(geom.barrierX - postW / 2, geom.midY + slitHalf, postW, barrierBottom - (geom.midY + slitHalf));
  }
  fill(20);
  textAlign(CENTER, TOP);
  textSize(12);
  text(twoSlits ? 'Barrier (2 slits)' : 'Barrier (1 slit)', geom.barrierX, barrierTop - 16);

  // screen line
  stroke(80);
  strokeWeight(3);
  line(geom.screenX, barrierTop, geom.screenX, barrierBottom);
  noStroke();
  fill(20);
  textAlign(CENTER, TOP);
  text('Screen', geom.screenX, barrierTop - 16);
}

function drawIntensityCurve(geom) {
  // With two slits, fringes can be closely spaced (fringe pitch = lambda*L/d
  // in screen units). If the curve's horizontal amplitude is larger than
  // the vertical pitch between fringes, each cycle draws as a wide loop and
  // the whole curve reads as a tangled spiral instead of a wave. Capping
  // the amplitude to a fraction of the fringe pitch keeps every cycle
  // legible regardless of how closely spaced the fringes are.
  let usedW = geom.curveMaxW;
  if (twoSlitsCheckbox.checked()) {
    const d = dSlider.value();
    const lambda = lambdaSlider.value();
    const fringePitchPx = ((lambda * SCREEN_L) / d) * geom.pxPerUnit;
    usedW = constrain(fringePitchPx * 0.42, 26, geom.curveMaxW);
  }

  stroke(COLOR_PREDICTED);
  strokeWeight(2);
  noFill();
  drawingContext.setLineDash([6, 4]);
  beginShape();
  for (let py = geom.plotTop; py <= geom.plotBottom; py += 2) {
    const y = (geom.midY - py) / geom.pxPerUnit;
    const I = currentIntensity(y);
    vertex(geom.curveX0 + I * usedW, py);
  }
  endShape();
  drawingContext.setLineDash([]);

  noStroke();
  fill(COLOR_PREDICTED);
  textAlign(LEFT, TOP);
  textSize(11);
  text('Predicted intensity I(y)', geom.curveX0, geom.plotTop + 4);
  textSize(10);
  fill(120);
  text('(theoretical, not measured)', geom.curveX0, geom.plotTop + 18);
}

// Legend lives inside the readout box (left side, never under the curve)
// instead of floating near the curve, where it risked being crossed by a
// fringe loop.
function drawReadouts(geom) {
  const d = dSlider.value();
  const lambda = lambdaSlider.value();
  const fringeSpacing = (lambda * SCREEN_L) / d;

  const boxW = Math.max(170, Math.min(240, geom.barrierX - margin - 6));
  const idle = !isRunning && particleCount === 0;
  const boxH = idle ? 112 : 92;
  const boxY = geom.plotBottom - boxH;
  fill(245);
  stroke(200);
  strokeWeight(1);
  rect(margin, boxY, boxW, boxH, 8);

  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  const fs = canvasWidth < 500 ? 11 : 12;
  textSize(fs);
  text('Particles detected: ' + particleCount, margin + 10, boxY + 8);
  text('Fringe spacing ∝ λL/d ≈ ' + fringeSpacing.toFixed(2), margin + 10, boxY + 27);

  textAlign(LEFT, CENTER);
  textSize(11);
  let ly = boxY + 54;
  fill(COLOR_DETECTED);
  circle(margin + 13, ly, 8);
  fill(20);
  text('Detected particle', margin + 24, ly);
  ly += 17;
  fill(COLOR_FLIGHT);
  circle(margin + 13, ly, 8);
  fill(20);
  text('Particle in flight', margin + 24, ly);

  // Placed inside the readout box (not floating over the diagram) so it
  // can never overlap the barrier or screen at any canvas width.
  if (idle) {
    fill('#5A3EED');
    textAlign(LEFT, TOP);
    textSize(fs);
    text('▶ Press Start to begin', margin + 10, boxY + boxH - 20, boxW - 20);
  }
}

function drawControlLabels() {
  const [row1, row2] = checkboxStacked ? [72, 106] : [42, 76];
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Slit separation d: ' + dSlider.value().toFixed(1), 10, drawHeight + row1 + 10);
  text('Wavelength λ: ' + lambdaSlider.value().toFixed(2), 10, drawHeight + row2 + 10);

  fill('#666');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Individual particles land randomly, but many together reveal the wave-interference pattern.', 10, drawHeight + row2 + 34, canvasWidth - 20);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  computeGeometry(); // refreshes patternStripW for the new canvasWidth
  // The strip width scales with canvasWidth, so old dot positions would no
  // longer line up with the new mapping -- start the pattern over.
  clearPattern();
  patternBuffer = createGraphics(patternStripW, drawHeight);
  positionUIElements();
}

function updateCanvasSize() {
  var mainEl = document.querySelector('main');
  containerWidth = Math.floor(mainEl.getBoundingClientRect().width);
  canvasWidth = containerWidth;
  canvasHeight = drawHeight + controlHeight;
  containerHeight = canvasHeight;
}
