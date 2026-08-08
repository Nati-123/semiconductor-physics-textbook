// de Broglie Wavelength Explorer MicroSim
// Lets students apply lambda = h/(mv) across a huge range of masses (electron
// to bowling ball) and velocities, and see on a log-scale ruler why matter
// waves are only detectable at quantum scales.
// Bloom Level: Apply (L3) - calculate, compare
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 296;
let controlHeight = 214;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 30;
let objectSelect, massSlider, velocitySlider;
let presetElectronBtn, presetNeutronBtn, presetBaseballBtn;
let buttonsStacked = false;

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
  { label: 'Red blood cell', value: 7e-6 },
  { label: 'Grain of sand', value: 0.5e-3 }
];

const RULER_MIN_EXP = -13; // 0.1 pm
const RULER_MAX_EXP = -3;  // 1 mm

const SUPERSCRIPT_DIGITS = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
function superscript(n) {
  return String(n).split('').map((ch) => SUPERSCRIPT_DIGITS[ch] || ch).join('');
}

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

  presetElectronBtn = createButton('Electron @ 1e7 m/s');
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
  const bx = mainRect.left;
  const by = mainRect.top;

  objectSelect.position(bx + 150, by + drawHeight + 12);
  massSlider.position(bx + 150, by + drawHeight + 45);
  velocitySlider.position(bx + 150, by + drawHeight + 78);

  // Lay the three preset buttons out in one row if they fit; otherwise
  // stack them so nothing runs off narrow canvases.
  const w1 = presetElectronBtn.elt.getBoundingClientRect().width;
  const w2 = presetNeutronBtn.elt.getBoundingClientRect().width;
  const w3 = presetBaseballBtn.elt.getBoundingClientRect().width;
  const gap = 14;
  buttonsStacked = (20 + w1 + gap + w2 + gap + w3 + 10) > canvasWidth;

  if (buttonsStacked) {
    presetElectronBtn.position(bx + 20, by + drawHeight + 112);
    presetNeutronBtn.position(bx + 20, by + drawHeight + 144);
    presetBaseballBtn.position(bx + 20, by + drawHeight + 176);
  } else {
    presetElectronBtn.position(bx + 20, by + drawHeight + 112);
    presetNeutronBtn.position(bx + 20 + w1 + gap, by + drawHeight + 112);
    presetBaseballBtn.position(bx + 20 + w1 + gap + w2 + gap, by + drawHeight + 112);
  }
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

  const smallText = canvasWidth < 500;

  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(smallText ? 14 : 18);
  text('de Broglie Wavelength Explorer', canvasWidth / 2, 8);

  const m = currentMass();
  const v = max(velocitySlider.value(), 1); // avoid divide-by-zero
  const lambda = H / (m * v);

  const readoutBottom = drawReadout(m, v, lambda, smallText);
  drawRuler(lambda, readoutBottom);
  drawControlLabels(m, v);
}

function drawReadout(m, v, lambda, smallText) {
  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(smallText ? 11.5 : 13);
  const px = margin;
  const py = 34;
  if (smallText) {
    // Stacked on two lines -- a single wrapped line breaks awkwardly
    // between a number and its "× 10^n" exponent at narrow widths.
    text('Mass m = ' + formatSci(m) + ' kg', px, py);
    text('Velocity v = ' + formatSci(v) + ' m/s', px, py + 17);
  } else {
    text('Mass m = ' + formatSci(m) + ' kg      Velocity v = ' + formatSci(v) + ' m/s', px, py);
  }

  const boxY = py + (smallText ? 42 : 24);
  fill(245);
  stroke('#5A3EED');
  strokeWeight(1.5);
  rect(px, boxY, min(canvasWidth - 2 * margin, 460), 40, 8);
  noStroke();
  fill('#5A3EED');
  textAlign(LEFT, CENTER);
  textSize(smallText ? 14 : 17);
  text('λ = h / (mv) = ' + formatWavelength(lambda), px + 12, boxY + 21);

  return boxY + 40;
}

function drawRuler(lambda, readoutBottom) {
  const rulerTop = readoutBottom + 40;
  const rulerY = rulerTop + 70;
  const rulerX1 = margin + 12;
  const rulerX2 = canvasWidth - margin - 12;
  const span = RULER_MAX_EXP - RULER_MIN_EXP;
  const barH = 10;

  noStroke();
  fill(60);
  textAlign(LEFT, TOP);
  textSize(12);
  text('Where λ falls on a logarithmic length scale (meters)', margin, rulerTop - 22);

  // A filled, gradient-tinted bar (not just a thin line) so the log scale
  // itself reads as the dominant visual element of the sim.
  const barCtx = drawingContext;
  const grad = barCtx.createLinearGradient(rulerX1, 0, rulerX2, 0);
  grad.addColorStop(0, '#B39DFF');
  grad.addColorStop(1, '#FFD9A0');
  barCtx.fillStyle = grad;
  noStroke();
  rect(rulerX1, rulerY - barH / 2, rulerX2 - rulerX1, barH, barH / 2);

  // decade tick marks
  fill(90);
  textAlign(CENTER, TOP);
  textSize(11);
  for (let e = RULER_MIN_EXP; e <= RULER_MAX_EXP; e += 2) {
    const x = expToX(e, rulerX1, rulerX2, span);
    stroke(255);
    strokeWeight(2);
    line(x, rulerY - barH / 2, x, rulerY + barH / 2);
    noStroke();
    fill(90);
    text('10' + superscript(e), x, rulerY + barH / 2 + 6);
  }

  // reference markers, staggered so labels never collide
  REFERENCE_MARKERS.forEach((ref, i) => {
    const e = Math.log10(ref.value);
    const x = expToX(constrain(e, RULER_MIN_EXP, RULER_MAX_EXP), rulerX1, rulerX2, span);
    const stagger = (i % 2 === 0) ? 0 : 16;
    stroke('#2E7D32');
    strokeWeight(2);
    line(x, rulerY - barH / 2 - 8 - stagger, x, rulerY - barH / 2);
    noStroke();
    fill('#2E7D32');
    textAlign(CENTER, BOTTOM);
    textSize(11);
    text(ref.label, x, rulerY - barH / 2 - 10 - stagger);
  });

  // computed wavelength marker -- larger and more prominent than the
  // reference markers so it's unmistakably "the answer"
  const eLambda = Math.log10(lambda);
  const onScale = eLambda >= RULER_MIN_EXP && eLambda <= RULER_MAX_EXP;
  const eClamped = constrain(eLambda, RULER_MIN_EXP, RULER_MAX_EXP);
  const xL = expToX(eClamped, rulerX1, rulerX2, span);

  stroke('#E53935');
  strokeWeight(3.5);
  line(xL, rulerY - barH / 2 - 4, xL, rulerY + 34);
  noStroke();
  fill('#E53935');
  triangle(xL - 6, rulerY - barH / 2 - 4, xL + 6, rulerY - barH / 2 - 4, xL, rulerY - barH / 2 + 4);
  textAlign(CENTER, TOP);
  textSize(12);
  if (onScale) {
    text('▲ λ (computed)', xL, rulerY + 36);
  } else if (eLambda < RULER_MIN_EXP) {
    text('◀ λ far smaller than ruler range', xL, rulerY + 36, 160);
  } else {
    text('λ larger than ruler range ▶', xL, rulerY + 36, 160);
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
  return sign + mantissa.toFixed(3) + ' × 10' + superscript(exp);
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
