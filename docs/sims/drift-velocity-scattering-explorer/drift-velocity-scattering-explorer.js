// Drift Velocity and Carrier Scattering Explorer MicroSim
// An electron undergoes a random-walk "thermal" motion, randomly
// re-scattering direction at fixed time intervals, with a small,
// constant rightward drift velocity superimposed proportional to the
// electric field slider. Tracks total (unwrapped) displacement to
// estimate drift velocity and effective mobility v_d/E.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 145;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let fieldSlider;
let isAnimating = false;
let startStopBtn = { x: 10, y: 0, w: 90, h: 32 };
let resetBtn = { x: 110, y: 0, w: 90, h: 32 };
const FIELD_PRESETS = [{ label: 'No field', v: 0 }, { label: 'Weak', v: 3 }, { label: 'Strong', v: 8 }];

function compact() { return canvasWidth < 480; }

let ex, ey;          // electron wrapped display position
let unwrappedX;       // unwrapped x for displacement tracking
let vx, vy;           // current thermal velocity components
let framesSinceScatter = 0;
let scatterInterval = 18;
let trail = [];
let elapsedFrames = 0;
let startX = 0;

const THERMAL_SPEED = 2.4;
const DRIFT_SCALE = 0.06; // pixels/frame per field-slider unit

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  fieldSlider = createSlider(0, 10, 3, 0.5);
  fieldSlider.attribute('aria-label', 'Applied electric field strength');

  resetState();
  positionUIElements();
  describe('Drift velocity and carrier scattering explorer: an electron undergoes random thermal motion with scattering, biased by an applied electric field into a net drift', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function resetState() {
  ex = canvasWidth / 2; ey = drawHeight / 2;
  unwrappedX = ex; startX = ex;
  vx = random(-1, 1) * THERMAL_SPEED; vy = random(-1, 1) * THERMAL_SPEED;
  trail = [];
  elapsedFrames = 0;
  isAnimating = false;
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 95 : 150;
  fieldSlider.position(bx + lbl, by + drawHeight + 15);
  fieldSlider.size(min(canvasWidth - lbl - 30, 280));
  startStopBtn.x = 10; startStopBtn.y = drawHeight + 98;
  resetBtn.x = 110; resetBtn.y = drawHeight + 98;
}

function presetButtons() {
  const bw = 62, bh = 22, gap = 8;
  return FIELD_PRESETS.map((p, i) => ({ p: p, x: 10 + i * (bw + gap), y: drawHeight + 56, w: bw, h: bh }));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const E = fieldSlider.value();

  drawLatticeDots();

  if (isAnimating) stepPhysics(E);

  drawTrail();
  drawElectron();

  const driftVel = elapsedFrames > 0 ? (unwrappedX - startX) / elapsedFrames : 0;
  const mobilityEst = E > 0 ? driftVel / E : 0;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 12.5 : 16);
  text(compact() ? 'Electron Motion: Scattering + Drift' : 'Electron Motion: Random Scattering + Field-Driven Drift', canvasWidth / 2, 8);

  smlDrawInfoBox(canvasWidth, drawHeight - 58, [
    'Avg drift velocity (px/frame): ' + driftVel.toFixed(4),
    'Estimated mobility μ = v_d/E: ' + mobilityEst.toFixed(4) + ' (arbitrary units)',
    'Elapsed frames: ' + elapsedFrames
  ]);

  drawControls(E);
}

function drawLatticeDots() {
  noStroke(); fill(200, 210, 225);
  const spacing = 46;
  for (let x = spacing / 2; x < canvasWidth; x += spacing) {
    for (let y = spacing / 2; y < drawHeight; y += spacing) {
      circle(x, y, 5);
    }
  }
}

function stepPhysics(E) {
  framesSinceScatter++;
  if (framesSinceScatter >= scatterInterval) {
    const angle = random(TWO_PI);
    vx = cos(angle) * THERMAL_SPEED;
    vy = sin(angle) * THERMAL_SPEED;
    framesSinceScatter = 0;
  }

  const driftX = E * DRIFT_SCALE;
  ex += vx + driftX;
  ey += vy;
  unwrappedX += vx + driftX;
  elapsedFrames++;

  if (ey < 10) { ey = 10; vy = abs(vy); }
  if (ey > drawHeight - 10) { ey = drawHeight - 10; vy = -abs(vy); }
  if (ex > canvasWidth - 5) { ex = 5; trail = []; }
  if (ex < 5) { ex = canvasWidth - 5; trail = []; }

  trail.push({ x: ex, y: ey });
  if (trail.length > 140) trail.shift();
}

function drawTrail() {
  noFill();
  for (let i = 1; i < trail.length; i++) {
    const alpha = map(i, 0, trail.length, 20, 200);
    stroke(90, 62, 237, alpha);
    strokeWeight(2);
    line(trail[i - 1].x, trail[i - 1].y, trail[i].x, trail[i].y);
  }
}

function drawElectron() {
  noStroke(); fill(40, 40, 220);
  circle(ex, ey, 14);
  fill(255); textAlign(CENTER, CENTER); textSize(11);
  text('−', ex, ey - 0.5);
}

function drawControls(E) {
  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Electric field E: ' + E.toFixed(1), 10, drawHeight + 20);
  for (const b of presetButtons()) smlDrawButton(b.x, b.y, b.w, b.h, b.p.label, E === b.p.v);
  smlDrawButton(startStopBtn.x, startStopBtn.y, startStopBtn.w, startStopBtn.h, isAnimating ? 'Stop' : 'Start', isAnimating);
  smlDrawButton(resetBtn.x, resetBtn.y, resetBtn.w, resetBtn.h, 'Reset', false);
}

function mousePressed() {
  if (smlPointInRect(mouseX, mouseY, startStopBtn.x, startStopBtn.y, startStopBtn.w, startStopBtn.h)) {
    isAnimating = !isAnimating;
    return;
  }
  if (smlPointInRect(mouseX, mouseY, resetBtn.x, resetBtn.y, resetBtn.w, resetBtn.h)) {
    resetState();
    return;
  }
  for (const b of presetButtons()) {
    if (smlPointInRect(mouseX, mouseY, b.x, b.y, b.w, b.h)) {
      fieldSlider.value(b.p.v);
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
}

function updateCanvasSize() {
  controlHeight = compact() ? 175 : 145;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
}
