// Compensated Semiconductor Explorer MicroSim
// A lattice with one donor and one acceptor atom present simultaneously,
// alongside log-scale N_D and N_A bars and a net-doping readout that
// determines majority carrier type (n-type if N_D > N_A, p-type if
// N_A > N_D).
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let ndExpSlider, naExpSlider;
const COLS = 5, ROWS = 3;
const DONOR_I = 1, DONOR_J = 1, ACC_I = 3, ACC_J = 1;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  ndExpSlider = createSlider(14, 18, 16, 0.1);
  ndExpSlider.attribute('aria-label', 'Donor concentration exponent');
  naExpSlider = createSlider(14, 18, 15.5, 0.1);
  naExpSlider.attribute('aria-label', 'Acceptor concentration exponent');

  positionUIElements();
  describe('Compensated semiconductor explorer: a lattice with both a donor and an acceptor atom present, with sliders for N_D and N_A and a net-doping readout determining majority carrier type', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  ndExpSlider.position(bx + 170, by + drawHeight + 15);
  ndExpSlider.size(min(canvasWidth - 190 - 30, 280));
  naExpSlider.position(bx + 170, by + drawHeight + 55);
  naExpSlider.size(min(canvasWidth - 190 - 30, 280));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const ND = Math.pow(10, ndExpSlider.value());
  const NA = Math.pow(10, naExpSlider.value());
  const net = ND - NA;
  const isN = net >= 0;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Compensated Silicon: Donor and Acceptor Both Present', canvasWidth / 2, 8);

  const spacing = min((canvasWidth * 0.55 - 40) / (COLS - 1), 75);
  const x0 = 30 + (canvasWidth * 0.55 - spacing * (COLS - 1)) / 2 - 15;
  const y0 = 55;

  smlDrawLatticeGrid(x0, y0, COLS, ROWS, spacing, {
    atomR: 13, bondColor: color(110), electronColor: color(40, 40, 220),
    labelFor: function (i, j) {
      if (i === DONOR_I && j === DONOR_J) return 'P';
      if (i === ACC_I && j === ACC_J) return 'B';
      return 'Si';
    },
    colorFor: function (i, j) {
      if (i === DONOR_I && j === DONOR_J) return color(90, 62, 237);
      if (i === ACC_I && j === ACC_J) return color(200, 90, 90);
      return color(150, 180, 220);
    }
  });

  drawNetPanel(ND, NA, net, isN);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('N_D = 10^' + ndExpSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 20);
  text('N_A = 10^' + naExpSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 60);
}

function drawNetPanel(ND, NA, net, isN) {
  const panelX = canvasWidth * 0.58, panelW = canvasWidth - panelX - 30, panelY = 55, panelH = drawHeight - 130;
  const yMax = Math.max(ND, NA) * 1.15;

  const series = [
    { label: 'N_D', value: ND, color: color(90, 62, 237) },
    { label: 'N_A', value: NA, color: color(200, 90, 90) }
  ];
  smlDrawBarChart(panelX, panelY, panelW, panelH * 0.55, series, yMax, {
    valueFormat: function (v) { return v.toExponential(1); }
  });

  const cardY = panelY + panelH * 0.55 + 30;
  noStroke();
  fill(isN ? color(230, 235, 255) : color(255, 230, 230));
  stroke(isN ? color(90, 62, 237) : color(200, 90, 90));
  strokeWeight(1.5);
  rect(panelX, cardY, panelW, panelH * 0.4, 10);
  noStroke();
  fill(isN ? color(90, 62, 237) : color(200, 90, 90));
  textAlign(CENTER, TOP); textSize(15);
  text((isN ? 'Net n-type' : 'Net p-type'), panelX + panelW / 2, cardY + 12);
  fill(50); textSize(12);
  text('|N_D − N_A| = ' + Math.abs(net).toExponential(2) + ' cm⁻³', panelX + panelW / 2, cardY + 38);
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
