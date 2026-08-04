// Photolithography Process Explorer MicroSim
// Computes minimum resolvable feature size (CD) and depth of focus from
// the Rayleigh criterion, and visualizes the printed line width shrinking
// as wavelength decreases or numerical aperture increases.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let wavelengthSlider, naSlider, k1Slider;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  wavelengthSlider = createSlider(150, 400, 248, 1);
  wavelengthSlider.attribute('aria-label', 'Exposure wavelength in nanometers');
  naSlider = createSlider(0.3, 1.4, 0.9, 0.01);
  naSlider.attribute('aria-label', 'Lens numerical aperture');
  k1Slider = createSlider(0.25, 0.6, 0.35, 0.01);
  k1Slider.attribute('aria-label', 'Process constant k1');

  positionUIElements();
  describe('Photolithography process explorer: computes minimum resolvable feature size from the Rayleigh criterion as exposure wavelength, numerical aperture, and process constant change', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  wavelengthSlider.position(bx + 220, by + drawHeight + 14);
  wavelengthSlider.size(min(canvasWidth - 240 - 30, 320));
  naSlider.position(bx + 220, by + drawHeight + 52);
  naSlider.size(min(canvasWidth - 240 - 30, 320));
  k1Slider.position(bx + 220, by + drawHeight + 90);
  k1Slider.size(min(canvasWidth - 240 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const lambda = wavelengthSlider.value();
  const NA = naSlider.value();
  const k1 = k1Slider.value();
  const k2 = 0.5;
  const CD = k1 * lambda / NA;
  const DOF = k2 * lambda / (NA * NA);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text('Photolithography Resolution: CD = k1·λ/NA', canvasWidth / 2, 8);

  // visualize mask pattern vs printed line width
  const cx = canvasWidth / 2;
  const maskY = 60, maskLineW = 60, maskH = 40;
  noStroke(); fill(230);
  rect(cx - maskLineW / 2 - 100, maskY, 200 + maskLineW, maskH);
  fill(90, 62, 237);
  rect(cx - maskLineW / 2, maskY, maskLineW, maskH);
  fill(30); textAlign(CENTER, BOTTOM); textSize(11);
  text('mask opening (fixed design width)', cx, maskY - 6);

  const printedY = maskY + maskH + 60;
  const printedW = map(constrain(CD, 20, 300), 20, 300, 15, 120);
  noStroke(); fill(230);
  rect(cx - 150, printedY, 300, maskH);
  fill(230, 90, 60);
  rect(cx - printedW / 2, printedY, printedW, maskH);
  fill(30); textAlign(CENTER, BOTTOM); textSize(11);
  text('printed minimum feature (CD = ' + nf(CD, 1, 1) + ' nm)', cx, printedY - 6);

  const infoY = printedY + maskH + 30;
  fill(20); noStroke(); textAlign(CENTER, TOP); textSize(13.5);
  text('CD = ' + nf(CD, 1, 1) + ' nm       DOF = ' + nf(DOF, 1, 1) + ' nm', cx, infoY);

  fill(DOF < 150 ? color(200, 60, 60) : color(40, 130, 70));
  textAlign(CENTER, TOP); textSize(12);
  text(DOF < 150 ? 'Tight depth of focus — precise wafer flatness and alignment required' : 'Comfortable depth of focus', cx, infoY + 22);

  drawControlLabels();
}

function drawControlLabels() {
  fill(30); noStroke(); textAlign(RIGHT, CENTER); textSize(13);
  text('Wavelength λ = ' + wavelengthSlider.value() + ' nm', 215, drawHeight + 14 + 9);
  text('Numerical aperture NA = ' + nf(naSlider.value(), 1, 2), 215, drawHeight + 52 + 9);
  text('Process constant k1 = ' + nf(k1Slider.value(), 1, 2), 215, drawHeight + 90 + 9);
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
