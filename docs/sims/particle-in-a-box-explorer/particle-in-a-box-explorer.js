// Particle in a Box Explorer MicroSim
// Lets students apply the infinite-square-well wavefunction and energy
// formulas, plotting psi_n(x) and |psi_n(x)|^2 across the box, plus an
// energy-level ladder diagram showing the n^2 scaling of E_n.
// Bloom Level: Apply / Analyze (L3-L4) - calculate, distinguish
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 420;
let minDrawHeight = 420;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 30;
let lSlider, nSlider;

const H = 6.626e-34;      // Planck's constant, J*s
const ME = 9.109e-31;     // electron mass, kg
const EV = 1.602e-19;     // 1 eV in joules
const NM = 1e-9;          // nanometers -> meters
const N_MAX = 6;

function setup() {
  updateCanvasSize();
  var mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  lSlider = createSlider(0.1, 5, 1, 0.05);
  lSlider.size(180);
  lSlider.input(() => redraw());
  lSlider.attribute('aria-label', 'Box width L in nanometers');

  nSlider = createSlider(1, N_MAX, 1, 1);
  nSlider.size(180);
  nSlider.input(() => redraw());
  nSlider.attribute('aria-label', 'Quantum number n');

  positionUIElements();

  describe('Explorer plotting the particle-in-a-box wavefunction and probability density for a selected quantum number, alongside an energy-level ladder diagram', LABEL);

  noLoop(); // redraw only when a control changes, to save CPU/battery

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  lSlider.position(mainRect.left + 170, mainRect.top + drawHeight + 15);
  nSlider.position(mainRect.left + 170, mainRect.top + drawHeight + 50);
}

function energyLevel(n, L) {
  // E_n = n^2 h^2 / (8 m_e L^2), L in meters
  return (n * n * H * H) / (8 * ME * L * L);
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
  text('Particle in a Box Explorer', canvasWidth / 2, 10);

  const Lnm = lSlider.value();
  const L = Lnm * NM;
  const n = nSlider.value();

  const plotRight = canvasWidth * 0.68;
  drawWavefunction(L, Lnm, n, plotRight);
  drawEnergyLadder(L, n, plotRight);
  drawControlLabels(Lnm, n);
}

function drawWavefunction(L, Lnm, n, plotRight) {
  const x0 = margin + 20;
  const x1 = plotRight - 20;
  const boxW = x1 - x0;
  const midY = 220;
  const ampScale = 70;

  // box walls
  stroke(90);
  strokeWeight(2);
  line(x0, 60, x0, drawHeight - 30);
  line(x1, 60, x1, drawHeight - 30);
  line(x0, drawHeight - 30, x1, drawHeight - 30);

  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(13);
  text('ψ' + subscript(n) + '(x)  (blue)   and   |ψ' + subscript(n) + '(x)|² (orange, shaded)', x0, 40);

  // normalization amplitude sqrt(2/L) -- for display we normalize the curve
  // to a fixed pixel amplitude so all n look comparable on screen.
  const nodesY = midY;

  // |psi|^2 shaded region (drawn first, underneath)
  noStroke();
  fill(255, 152, 0, 90);
  beginShape();
  vertex(x0, nodesY);
  for (let px = x0; px <= x1; px += 2) {
    const xFrac = (px - x0) / boxW;
    const psi = Math.sin(n * Math.PI * xFrac);
    const density = psi * psi; // 0..1
    vertex(px, nodesY - density * ampScale * 0.9);
  }
  vertex(x1, nodesY);
  endShape(CLOSE);

  // psi curve
  stroke('#1E88E5');
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (let px = x0; px <= x1; px += 2) {
    const xFrac = (px - x0) / boxW;
    const psi = Math.sin(n * Math.PI * xFrac);
    vertex(px, nodesY - psi * ampScale);
  }
  endShape();

  // zero line
  stroke(180);
  strokeWeight(1);
  line(x0, nodesY, x1, nodesY);

  // node markers (internal nodes only, n-1 of them)
  noStroke();
  fill('#C62828');
  for (let k = 1; k < n; k++) {
    const xFrac = k / n;
    const px = x0 + xFrac * boxW;
    circle(px, nodesY, 6);
  }
  if (n > 1) {
    fill(90);
    textAlign(CENTER, TOP);
    textSize(11);
    text((n - 1) + ' internal node' + (n - 1 > 1 ? 's' : ''), x0 + boxW / 2, drawHeight - 24);
  }

  noStroke();
  fill(20);
  textAlign(CENTER, TOP);
  textSize(12);
  text('x = 0', x0, drawHeight - 24);
  textAlign(CENTER, TOP);
  text('x = L = ' + Lnm.toFixed(2) + ' nm', x1, drawHeight - 24);
}

function subscript(n) {
  const subs = ['₀','₁','₂','₃','₄','₅','₆','₇','₈','₉'];
  return String(n).split('').map(d => subs[parseInt(d)]).join('');
}

function drawEnergyLadder(L, nSelected, plotLeft) {
  const x0 = plotLeft + 30;
  const x1 = canvasWidth - margin;
  const topY = 55;
  const bottomY = drawHeight - 40;

  const energies = [];
  for (let n = 1; n <= N_MAX; n++) energies.push(energyLevel(n, L));
  const maxE = energies[N_MAX - 1];

  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(13);
  text('Energy levels Eₙ', x0, 40);

  stroke(150);
  strokeWeight(1);
  line(x0, bottomY, x0, topY);

  for (let n = 1; n <= N_MAX; n++) {
    const frac = energies[n - 1] / maxE;
    const y = bottomY - frac * (bottomY - topY);
    const isSelected = (n === nSelected);
    stroke(isSelected ? '#E53935' : 100);
    strokeWeight(isSelected ? 3 : 1.5);
    line(x0, y, x1, y);

    noStroke();
    fill(isSelected ? '#E53935' : 60);
    textAlign(LEFT, BOTTOM);
    textSize(11);
    text('E' + subscript(n) + ' = ' + (energies[n - 1] / EV).toFixed(3) + ' eV', x0 + 4, y - 2);
  }
}

function drawControlLabels(Lnm, n) {
  fill('black');
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(13);
  text('Box width L:', 160, drawHeight + 27);
  text('Quantum number n:', 160, drawHeight + 62);

  textAlign(LEFT, CENTER);
  text(Lnm.toFixed(2) + ' nm', 360, drawHeight + 27);
  text('n = ' + n, 360, drawHeight + 62);
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
