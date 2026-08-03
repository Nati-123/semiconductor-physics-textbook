// LED Emission Wavelength Explorer MicroSim
// Computes LED emission wavelength lambda = 1240/Eg(eV) nm from a band
// gap slider, showing where it falls on the visible spectrum with an
// approximate color swatch (or "infrared"/"ultraviolet" label outside
// the visible range).
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 400;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let egSlider;

// Approximate wavelength (nm, 380-750) to RGB, classic Bruton algorithm.
function wavelengthToColor(nm) {
  let r = 0, g = 0, b = 0;
  if (nm >= 380 && nm < 440) { r = -(nm - 440) / (440 - 380); g = 0; b = 1; }
  else if (nm >= 440 && nm < 490) { r = 0; g = (nm - 440) / (490 - 440); b = 1; }
  else if (nm >= 490 && nm < 510) { r = 0; g = 1; b = -(nm - 510) / (510 - 490); }
  else if (nm >= 510 && nm < 580) { r = (nm - 510) / (580 - 510); g = 1; b = 0; }
  else if (nm >= 580 && nm < 645) { r = 1; g = -(nm - 645) / (645 - 580); b = 0; }
  else if (nm >= 645 && nm <= 750) { r = 1; g = 0; b = 0; }
  return color(constrain(r, 0, 1) * 255, constrain(g, 0, 1) * 255, constrain(b, 0, 1) * 255);
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  egSlider = createSlider(0.7, 3.2, 1.9, 0.01);
  egSlider.attribute('aria-label', 'LED material band gap in electron volts');

  positionUIElements();
  describe('LED emission wavelength explorer: computes LED emission wavelength from band gap and shows the approximate perceived color on the visible spectrum', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  egSlider.position(bx + 150, by + drawHeight + 12);
  egSlider.size(min(canvasWidth - 170 - 30, 400));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const Eg = egSlider.value();
  const lambda = 1240 / Eg;
  const visible = lambda >= 380 && lambda <= 750;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('λ = 1240 / Eg(eV)  nm', canvasWidth / 2, 8);

  drawSpectrum(lambda, visible);
  drawSwatch(lambda, visible, Eg);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Eg = ' + Eg.toFixed(2) + ' eV', 10, drawHeight + 18);
  text('λ = ' + lambda.toFixed(0) + ' nm  (' + (visible ? 'visible' : (lambda > 750 ? 'infrared — invisible' : 'ultraviolet — invisible')) + ')', 10, drawHeight + 56);
}

function drawSpectrum(lambda, visible) {
  const x0 = 40, x1 = canvasWidth - 40, y0 = 60, barH = 60;
  const specMin = 380, specMax = 750;
  for (let px = x0; px < x1; px++) {
    const nm = map(px, x0, x1, specMin, specMax);
    stroke(wavelengthToColor(nm));
    line(px, y0, px, y0 + barH);
  }
  noFill(); stroke(120); strokeWeight(1);
  rect(x0, y0, x1 - x0, barH);
  noStroke(); fill(30); textAlign(LEFT, TOP); textSize(10);
  text('380 nm (violet)', x0, y0 + barH + 6);
  textAlign(RIGHT, TOP);
  text('750 nm (red)', x1, y0 + barH + 6);

  if (visible) {
    const mx = map(lambda, specMin, specMax, x0, x1);
    stroke(0); strokeWeight(2);
    line(mx, y0 - 10, mx, y0 + barH + 10);
    noStroke(); fill(0); textAlign(CENTER, BOTTOM); textSize(11); textStyle(BOLD);
    text(lambda.toFixed(0) + ' nm', mx, y0 - 12);
    textStyle(NORMAL);
  } else {
    fill(90); textAlign(CENTER, TOP); textSize(12);
    text(lambda < specMin ? '← emission is ultraviolet, off this scale' : 'emission is infrared, off this scale →', canvasWidth / 2, y0 + barH + 26);
  }
}

function drawSwatch(lambda, visible, Eg) {
  const cx = canvasWidth / 2, cy = drawHeight * 0.62, r = drawHeight * 0.18;
  noStroke();
  fill(visible ? wavelengthToColor(lambda) : color(60));
  circle(cx, cy, r * 2);
  stroke(150); strokeWeight(1); noFill();
  circle(cx, cy, r * 2);
  noStroke(); fill(visible ? 20 : 220); textAlign(CENTER, CENTER); textSize(12);
  text(visible ? approxColorName(lambda) : (lambda > 750 ? 'IR' : 'UV'), cx, cy);

  fill(30); textAlign(CENTER, TOP); textSize(11.5);
  text('LED emission color (approximate)', cx, cy + r + 10);
}

function approxColorName(nm) {
  if (nm < 450) return 'Violet';
  if (nm < 485) return 'Blue';
  if (nm < 500) return 'Cyan';
  if (nm < 565) return 'Green';
  if (nm < 590) return 'Yellow';
  if (nm < 625) return 'Orange';
  return 'Red';
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
}

function updateCanvasSize() {
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
}
