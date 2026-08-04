// LED Bandgap and Color Explorer MicroSim
// Adjusts band gap and shows the resulting emission wavelength and
// approximate visible color, reusing lambda = hc/Eg from Chapter 17.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let gapSlider;
const h = 4.1357e-15; // eV*s
const c = 3e17; // nm/s

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  gapSlider = createSlider(1.4, 3.4, 2.2, 0.01);
  gapSlider.attribute('aria-label', 'Band gap in electron volts');

  positionUIElements();
  describe('LED bandgap and color explorer: adjusts band gap and shows the resulting emission wavelength and approximate visible color', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  gapSlider.position(bx + 170, by + drawHeight + 16);
  gapSlider.size(min(canvasWidth - 190 - 30, 320));
}

function wavelengthToColor(lambda) {
  let r, g, b;
  if (lambda < 440) { r = -(lambda - 440) / (440 - 380); g = 0; b = 1; }
  else if (lambda < 490) { r = 0; g = (lambda - 440) / (490 - 440); b = 1; }
  else if (lambda < 510) { r = 0; g = 1; b = -(lambda - 510) / (510 - 490); }
  else if (lambda < 580) { r = (lambda - 510) / (580 - 510); g = 1; b = 0; }
  else if (lambda < 645) { r = 1; g = -(lambda - 645) / (645 - 580); b = 0; }
  else { r = 1; g = 0; b = 0; }
  return color(constrain(r, 0, 1) * 255, constrain(g, 0, 1) * 255, constrain(b, 0, 1) * 255);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const Eg = gapSlider.value();
  const lambda = (h * c) / Eg; // nm
  const inVisible = lambda >= 380 && lambda <= 750;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('LED Emission: Band Gap → Wavelength → Color', canvasWidth / 2, 8);

  const swatchX = canvasWidth / 2 - 90, swatchY = 60, swatchW = 180, swatchH = 140;
  noStroke();
  if (inVisible) {
    fill(wavelengthToColor(lambda));
  } else {
    fill(60);
  }
  rect(swatchX, swatchY, swatchW, swatchH, 10);
  stroke(180); strokeWeight(1); noFill();
  rect(swatchX, swatchY, swatchW, swatchH, 10);

  fill(30); noStroke(); textAlign(CENTER, TOP); textSize(13.5);
  text('E_g = ' + nf(Eg, 1, 2) + ' eV', canvasWidth / 2, swatchY + swatchH + 20);
  text('λ = hc/E_g ≈ ' + nf(lambda, 1, 0) + ' nm', canvasWidth / 2, swatchY + swatchH + 42);

  fill(inVisible ? color(40, 130, 70) : color(150));
  textAlign(CENTER, TOP); textSize(12);
  text(inVisible ? 'Visible light' : (lambda < 380 ? 'Ultraviolet (not visible)' : 'Infrared (not visible)'), canvasWidth / 2, swatchY + swatchH + 64);

  drawControlLabels();
}

function drawControlLabels() {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Band gap ' + nf(gapSlider.value(), 1, 2) + ' eV', 165, drawHeight + 16 + 9);
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
