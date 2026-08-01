// de Broglie Wavelength Explorer MicroSim
// Lets students apply lambda = h/(mv) across a huge range of masses (electron
// to bowling ball) and velocities, and see on a log-scale ruler why matter
// waves are only detectable at quantum scales.
// Bloom Level: Apply (L3) - calculate, compare
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 380;
let minDrawHeight = 380;
let controlHeight = 175;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 30;
let objectSelect, massSlider, velocitySlider;
let presetElectronBtn, presetNeutronBtn, presetBaseballBtn;

const H = 6.626e-34; // Planck's constant, J*s

const MASS_PRESETS = {
  'Electron': 9.109e-31,
  'Proton': 1.673e-27,
  'Neutron': 1.675e-27,
  'Baseball': 0.145,
  'Bowling Ball': 7,
  'Custom': null
};

// Reference markers for the log-scale ruler: [label, wavelength in meters]
const REFERENCE_MARKERS = [
  { label: 'Atomic diameter', value: 0.1e-9 },
  { label: 'Visible light', value: 500e-9 },
  { label: 'Red blood cell', value: 7e-6 }
];

const RULER_MIN_EXP = -13; // 0.1 pm
const RULER_MAX_EXP = -3;  // 1 mm

function setup() {
  updateCanvasSize();
  var mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  objectSelect = createSelect();
  Object.keys(MASS_PRESETS).forEach(k => objectSelect.option(k));
  objectSelect.selected('Electron');
  objectSelect.changed(onObjectChanged);
  objectSelect.attribute('aria-label', 'Object (sets mass)');

  massSlider = createSlider(-31, 0, -30.04, 0.05);
  massSlider.size(160);
  massSlider.input(() => redraw());
  massSlider.attribute('aria-label', 'Custom mass, log10 kilograms');
  massSlider.hide();

  velocitySlider = createSlider(0, 1e7, 1e7, 1e5);
  velocitySlider.size(160);
  velocitySlider.input(() => redraw());
  velocitySlider.attribute('aria-label', 'Velocity in meters per second');

  presetElectronBtn = createButton('Electron at 1e7 m/s');
  presetElectronBtn.mousePressed(() => {
    objectSelect.selected('Electron');
    onObjectChanged();
    velocitySlider.value(1e7);
    redraw();
  });

  presetNeutronBtn = createButton('Thermal neutron (~2200 m/s)');
  presetNeutronBtn.mousePressed(() => {
    objectSelect.selected('Neutron');
    onObjectChanged();
    velocitySlider.value(2200);
    redraw();
  });

  presetBaseballBtn = createButton('Baseball (0.145 kg, 40 m/s)');
  presetBaseballBtn.mousePressed(() => {
    objectSelect.selected('Baseball');
    onObjectChanged();
    velocitySlider.value(40);
    redraw();
  });

  positionUIElements();

  describe('Explorer computing the de Broglie wavelength of objects ranging from an electron to a bowling ball, with a log-scale ruler comparing the result to atomic and everyday reference lengths', LABEL);

  noLoop(); // redraw only when a control changes, to save CPU/battery

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function onObjectChanged() {
  const sel = objectSelect.value();
  if (sel === 'Custom') {
    massSlider.show();
  } else {
    massSlider.hide();
  }
  redraw();
}

function currentMass() {
  const sel = objectSelect.value();
  if (sel === 'Custom') {
    return Math.pow(10, massSlider.value());
  }
  return MASS_PRESETS[sel];
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  objectSelect.position(mainRect.left + 150, mainRect.top + drawHeight + 12);
  massSlider.position(mainRect.left + 150, mainRect.top + drawHeight + 45);
  velocitySlider.position(mainRect.left + 150, mainRect.top + drawHeight + 78);
  presetElectronBtn.position(mainRect.left + 20, mainRect.top + drawHeight + 112);
  presetNeutronBtn.position(mainRect.left + 190, mainRect.top + drawHeight + 112);
  presetBaseballBtn.position(mainRect.left + 400, mainRect.top + drawHeight + 112);
}

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
  text('de Broglie Wavelength Explorer', canvasWidth / 2, 10);

  const m = currentMass();
  const v = max(velocitySlider.value(), 1); // avoid divide-by-zero
  const lambda = H / (m * v);

  drawReadout(m, v, lambda);
  drawRuler(lambda);
  drawControlLabels(m, v);
}

function drawReadout(m, v, lambda) {
  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(14);
  const px = margin;
  let py = 45;
  const lineH = 24;
  text('Mass m = ' + formatSci(m) + ' kg', px, py); py += lineH;
  text('Velocity v = ' + formatSci(v) + ' m/s', px, py); py += lineH;

  fill(245);
  stroke(200);
  strokeWeight(1);
  rect(px - 10, py - 6, min(canvasWidth - 2 * margin, 420), 40, 8);
  noStroke();
  fill('#5A3EED');
  textSize(16);
  text('λ = h / (mv) = ' + formatWavelength(lambda), px, py + 2);
}

function drawRuler(lambda) {
  const rulerY = drawHeight - 90;
  const rulerX1 = margin + 10;
  const rulerX2 = canvasWidth - margin - 10;
  const span = RULER_MAX_EXP - RULER_MIN_EXP;

  stroke(120);
  strokeWeight(2);
  line(rulerX1, rulerY, rulerX2, rulerY);

  // decade tick marks
  noStroke();
  fill(90);
  textAlign(CENTER, TOP);
  textSize(10);
  for (let e = RULER_MIN_EXP; e <= RULER_MAX_EXP; e += 2) {
    const x = expToX(e, rulerX1, rulerX2, span);
    stroke(150);
    strokeWeight(1);
    line(x, rulerY - 5, x, rulerY + 5);
    noStroke();
    fill(90);
    text('10^' + e, x, rulerY + 8);
  }

  // reference markers
  REFERENCE_MARKERS.forEach((ref, i) => {
    const e = Math.log10(ref.value);
    const x = expToX(constrain(e, RULER_MIN_EXP, RULER_MAX_EXP), rulerX1, rulerX2, span);
    stroke('#2E7D32');
    strokeWeight(2);
    line(x, rulerY - 22, x, rulerY);
    noStroke();
    fill('#2E7D32');
    textAlign(CENTER, BOTTOM);
    textSize(11);
    text(ref.label, x, rulerY - 24 - (i % 2 === 0 ? 0 : 16));
  });

  // computed wavelength marker
  const eLambda = Math.log10(lambda);
  const onScale = eLambda >= RULER_MIN_EXP && eLambda <= RULER_MAX_EXP;
  const eClamped = constrain(eLambda, RULER_MIN_EXP, RULER_MAX_EXP);
  const xL = expToX(eClamped, rulerX1, rulerX2, span);

  stroke('#E53935');
  strokeWeight(3);
  line(xL, rulerY + 6, xL, rulerY + 34);
  noStroke();
  fill('#E53935');
  textAlign(CENTER, TOP);
  textSize(12);
  if (onScale) {
    text('λ (computed)', xL, rulerY + 36);
  } else if (eLambda < RULER_MIN_EXP) {
    text('◀ λ is far smaller than ruler range', xL, rulerY + 36);
  } else {
    text('λ is larger than ruler range ▶', xL, rulerY + 36);
  }
}

function expToX(e, x1, x2, span) {
  return x1 + ((e - RULER_MIN_EXP) / span) * (x2 - x1);
}

function drawControlLabels(m, v) {
  fill('black');
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(13);
  text('Object:', 145, drawHeight + 24);
  text('Custom mass:', 145, drawHeight + 57);
  text('Velocity:', 145, drawHeight + 90);

  textAlign(LEFT, CENTER);
  if (objectSelect.value() === 'Custom') {
    text(formatSci(m) + ' kg', 320, drawHeight + 57);
  }
  text(formatSci(v) + ' m/s', 320, drawHeight + 90);
}

function formatWavelength(lambdaMeters) {
  const abs = Math.abs(lambdaMeters);
  if (abs >= 1e-12 && abs < 1e-9) return (lambdaMeters * 1e12).toFixed(3) + ' pm';
  if (abs >= 1e-9 && abs < 1e-6) return (lambdaMeters * 1e9).toFixed(3) + ' nm';
  if (abs >= 1e-6 && abs < 1e-3) return (lambdaMeters * 1e6).toFixed(3) + ' µm';
  if (abs >= 1e-3 && abs < 1e3) return (lambdaMeters).toFixed(3) + ' m';
  return formatSci(lambdaMeters) + ' m';
}

function formatSci(x) {
  if (x === 0) return '0';
  const sign = x < 0 ? '-' : '';
  const ax = abs(x);
  const exp = Math.floor(Math.log10(ax));
  const mantissa = ax / Math.pow(10, exp);
  return sign + mantissa.toFixed(3) + ' x 10^' + exp;
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
