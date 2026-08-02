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
let minDrawHeight = 420;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 30;
let sliderLeftMargin = 220;

let startButton, clearButton, twoSlitsCheckbox;
let dSlider, lambdaSlider;
let isRunning = false;

// --- schematic physics constants (dimensionless) ---
const SCREEN_L = 10;      // source-to-screen distance
const SLIT_WIDTH = 0.15;  // single-slit width (fixed, narrow)
const Y_RANGE = 6;        // screen half-height, schematic units
const PATTERN_STRIP_W = 20; // width of the persistent dot-pattern buffer strip

// --- accumulated-pattern buffer (persistent, off-screen) ---
let patternBuffer;
let particleCount = 0;

// --- current in-flight particle (one at a time) ---
let flight = null; // { t, y0, landingY }
const FLIGHT_STEP = 0.045;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  patternBuffer = createGraphics(PATTERN_STRIP_W, drawHeight);

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

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left;
  const by = mainRect.top;

  startButton.position(bx + 10, by + drawHeight + 5);
  clearButton.position(bx + 90, by + drawHeight + 5);
  twoSlitsCheckbox.position(bx + 230, by + drawHeight + 8);

  dSlider.position(bx + sliderLeftMargin, by + drawHeight + 40);
  dSlider.size(canvasWidth - sliderLeftMargin - margin);

  lambdaSlider.position(bx + sliderLeftMargin, by + drawHeight + 75);
  lambdaSlider.size(canvasWidth - sliderLeftMargin - margin);
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
  textSize(18);
  text('Wave-Particle Duality Explorer', canvasWidth / 2, 10);

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

function computeGeometry() {
  const sourceX = margin + 30;
  const sourceY = drawHeight / 2 + 20;
  const barrierX = margin + 200;
  const screenX = canvasWidth - 170;
  const pxPerUnit = (drawHeight / 2 - 60) / Y_RANGE;
  return { sourceX, sourceY, barrierX, screenX, pxPerUnit, midY: drawHeight / 2 + 20 };
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
    // particle lands: stamp it onto the persistent buffer
    const py = yToPx(flight.landingY, geom) ;
    patternBuffer.noStroke();
    patternBuffer.fill(30, 60, 200, 200);
    patternBuffer.circle(6, py, 4);
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
  fill('#E67E22');
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

  // barrier with slit gap(s)
  const barrierTop = 60;
  const barrierBottom = drawHeight - 60;
  const d = dSlider.value();
  const gapPx = map(d, 1, 6, 14, 70);
  const slitHalf = gapPx / 2;

  stroke('#555');
  strokeWeight(6);
  if (twoSlits) {
    const c1 = geom.midY - gapPx;
    const c2 = geom.midY + gapPx;
    line(geom.barrierX, barrierTop, geom.barrierX, c1 - slitHalf);
    line(geom.barrierX, c1 + slitHalf, geom.barrierX, c2 - slitHalf);
    line(geom.barrierX, c2 + slitHalf, geom.barrierX, barrierBottom);
  } else {
    line(geom.barrierX, barrierTop, geom.barrierX, geom.midY - slitHalf);
    line(geom.barrierX, geom.midY + slitHalf, geom.barrierX, barrierBottom);
  }
  noStroke();
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
  const curveX0 = geom.screenX + 40;
  const maxW = canvasWidth - margin - curveX0;
  stroke('#E67E22');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let py = 60; py <= drawHeight - 60; py += 2) {
    const y = (geom.midY - py) / geom.pxPerUnit;
    const I = currentIntensity(y);
    vertex(curveX0 + I * maxW, py);
  }
  endShape();
  noStroke();
  fill('#E67E22');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Predicted intensity I(y)', curveX0, 44);
}

function drawReadouts(geom) {
  const d = dSlider.value();
  const lambda = lambdaSlider.value();
  const fringeSpacing = (lambda * SCREEN_L) / d;

  const boxY = drawHeight - 66;
  fill(245);
  stroke(200);
  strokeWeight(1);
  rect(margin, boxY, 230, 56, 8);
  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(12);
  text('Particles detected: ' + particleCount, margin + 10, boxY + 8);
  text('Fringe spacing ∝ λL/d ≈ ' + fringeSpacing.toFixed(2), margin + 10, boxY + 28);

  if (!isRunning && particleCount === 0) {
    fill(80);
    textAlign(CENTER, CENTER);
    textSize(14);
    text('Press Start to fire particles one at a time', canvasWidth / 2, drawHeight - 90);
  }
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text('Slit separation d: ' + dSlider.value().toFixed(1), 10, drawHeight + 50);
  text('Wavelength λ: ' + lambdaSlider.value().toFixed(2), 10, drawHeight + 85);
}

function windowResized() {
  const prevDrawHeight = drawHeight;
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  if (drawHeight !== prevDrawHeight) {
    // vertical geometry changed -- old dot positions would no longer line
    // up with the new screen mapping, so start the pattern over
    clearPattern();
    patternBuffer = createGraphics(PATTERN_STRIP_W, drawHeight);
  }
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
