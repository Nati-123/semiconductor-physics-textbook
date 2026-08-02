// Hydrogenic Donor/Acceptor Ionization Energy Calculator MicroSim
// Computes E_D = 13.6 eV * (m*/m0) / er^2, the hydrogen-like model for a
// donor's (or acceptor's) ionization energy, from adjustable effective
// mass ratio and relative dielectric constant sliders, and draws a
// schematic Bohr-like orbit whose radius scales with er / (m*/m0).
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let massSlider, epsSlider;
const RY_H = 13.6; // hydrogen Rydberg energy, eV

const REAL_VALUES = [
  { label: 'P in Si (measured)', value: 0.045 },
  { label: 'B in Si (measured)', value: 0.045 },
  { label: 'P in Ge (measured)', value: 0.012 }
];

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  massSlider = createSlider(0.02, 1.0, 0.26, 0.01);
  massSlider.attribute('aria-label', 'Effective mass ratio m star over m0');

  epsSlider = createSlider(4, 20, 11.7, 0.1);
  epsSlider.attribute('aria-label', 'Relative dielectric constant');

  positionUIElements();
  describe('Hydrogenic donor and acceptor ionization energy calculator: computes ionization energy from effective mass and dielectric constant sliders, using the hydrogen-atom analogy', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  massSlider.position(bx + 190, by + drawHeight + 15);
  massSlider.size(min(canvasWidth - 210 - 30, 280));
  epsSlider.position(bx + 190, by + drawHeight + 55);
  epsSlider.size(min(canvasWidth - 210 - 30, 280));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const massRatio = massSlider.value();
  const eps = epsSlider.value();
  const ED = RY_H * massRatio / (eps * eps);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Hydrogenic Ionization Energy: E_D = 13.6 eV × (m*/m₀) / εr²', canvasWidth / 2, 8);

  drawOrbit(massRatio, eps);
  drawReadout(ED);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('m*/m₀: ' + massRatio.toFixed(2), 10, drawHeight + 20);
  text('εr: ' + eps.toFixed(1), 10, drawHeight + 60);
}

function drawOrbit(massRatio, eps) {
  const cx = canvasWidth * 0.28, cy = drawHeight * 0.5;
  // Bohr-like radius scales as er/(m*/m0); normalize for a reasonable pixel range
  const relRadius = eps / massRatio;
  const r = constrain(map(relRadius, 4, 1000, 30, min(160, drawHeight * 0.42)), 20, 200);

  noFill(); stroke(90, 62, 237); strokeWeight(1.5);
  drawingContext.setLineDash([3, 3]);
  circle(cx, cy, r * 2);
  drawingContext.setLineDash([]);

  noStroke(); fill(90, 62, 237);
  textAlign(CENTER, CENTER); textSize(13);
  circle(cx, cy, 14);
  fill(255); text('+', cx, cy - 1);

  smlDrawElectron(cx + r, cy, 9);

  fill(60); noStroke();
  textAlign(CENTER, TOP); textSize(11);
  text('Schematic orbit (radius grows with εr, shrinks with m*/m₀)', cx, cy + r + 14);
}

function drawReadout(ED) {
  const cardX = canvasWidth * 0.55, cardY = 50, cardW = canvasWidth - cardX - 30, cardH = drawHeight - 130;
  noStroke();
  fill(240, 245, 255);
  stroke(168, 200, 255);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke();
  fill('#5A3EED');
  textAlign(LEFT, TOP); textSize(15);
  text('Computed E_D = ' + (ED * 1000).toFixed(1) + ' meV', cardX + 16, cardY + 14);
  fill(50);
  textSize(12.5);
  text('(' + ED.toFixed(4) + ' eV)', cardX + 16, cardY + 40);

  fill(30);
  textSize(12);
  text('Compare to real measured values:', cardX + 16, cardY + 68);
  let yy = cardY + 88;
  for (const rv of REAL_VALUES) {
    text('• ' + rv.label + ': ' + (rv.value * 1000).toFixed(0) + ' meV', cardX + 16, yy);
    yy += 20;
  }
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
