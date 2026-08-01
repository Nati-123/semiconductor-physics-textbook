// Maxwell-Boltzmann Speed Distribution MicroSim
// Helps students interpret how raising temperature broadens and shifts the
// Maxwell-Boltzmann speed distribution, and connects this to the increase
// in average kinetic energy predicted by <KE> = (3/2) kB T.
// Bloom Level: Understand (L2) - interpret
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 700;
let drawHeight = 380;
let minDrawHeight = 380;
let controlHeight = 110;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 50;
let tempSlider, roomButton, ln2Button;

const KB = 1.381e-23;      // Boltzmann constant, J/K
const M_N2 = 4.65e-26;      // mass of an N2 molecule, kg (representative gas particle)
const EV = 1.602e-19;       // joules per eV
const V_MAX = 1600;         // m/s, fixed x-axis range for the plot

function setup() {
  updateCanvasSize();
  var mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  tempSlider = createSlider(100, 1000, 300, 1);
  tempSlider.size(220);
  tempSlider.input(() => redraw());
  tempSlider.attribute('aria-label', 'Temperature in kelvin');

  roomButton = createButton('Room Temperature (300 K)');
  roomButton.mousePressed(() => { tempSlider.value(300); redraw(); });

  ln2Button = createButton('Liquid Nitrogen (77 K)');
  ln2Button.mousePressed(() => { tempSlider.value(77); redraw(); });

  positionUIElements();

  describe('Maxwell-Boltzmann speed distribution curve that broadens and shifts as temperature increases', LABEL);

  noLoop(); // redraw only when a control changes, to save CPU/battery

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  tempSlider.position(mainRect.left + 150, mainRect.top + drawHeight + 15);
  roomButton.position(mainRect.left + 150, mainRect.top + drawHeight + 50);
  ln2Button.position(mainRect.left + 340, mainRect.top + drawHeight + 50);
}

function speedDist(v, T) {
  // Maxwell-Boltzmann speed probability density (unnormalized shape is fine
  // since we rescale to a fixed plot height; proportionality constant cancels).
  const a = M_N2 / (2 * PI * KB * T);
  return Math.pow(a, 1.5) * 4 * PI * v * v * Math.exp(-M_N2 * v * v / (2 * KB * T));
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
  text('Maxwell-Boltzmann Speed Distribution', canvasWidth / 2, 10);

  const T = tempSlider.value();

  const plotX = margin;
  const plotY = 45;
  const plotW = canvasWidth - 2 * margin;
  const plotH = drawHeight - plotY - 40;

  // axes
  stroke(80);
  strokeWeight(1.5);
  line(plotX, plotY, plotX, plotY + plotH);
  line(plotX, plotY + plotH, plotX + plotW, plotY + plotH);

  noStroke();
  fill(60);
  textAlign(CENTER, TOP);
  textSize(12);
  text('Particle speed v (m/s)', plotX + plotW / 2, plotY + plotH + 20);
  push();
  translate(plotX - 35, plotY + plotH / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Probability density (relative)', 0, 0);
  pop();

  // x tick labels
  textAlign(CENTER, TOP);
  textSize(10);
  for (let vTick = 0; vTick <= V_MAX; vTick += 400) {
    const x = plotX + (vTick / V_MAX) * plotW;
    stroke(200);
    line(x, plotY, x, plotY + plotH);
    noStroke();
    fill(80);
    text(vTick, x, plotY + plotH + 4);
  }

  // find peak value for normalization (peak occurs at most probable speed v_p)
  const vp = Math.sqrt(2 * KB * T / M_N2);
  const peakVal = speedDist(vp, T);

  // draw curve
  stroke('#1565C0');
  strokeWeight(2.5);
  noFill();
  beginShape();
  for (let i = 0; i <= 200; i++) {
    const v = (i / 200) * V_MAX;
    const f = speedDist(v, T) / peakVal;
    const x = plotX + (v / V_MAX) * plotW;
    const y = plotY + plotH - f * plotH * 0.92;
    vertex(x, y);
  }
  endShape();

  // most probable speed line
  const vrms = Math.sqrt(3 * KB * T / M_N2);
  drawVLine(vp, plotX, plotY, plotW, plotH, '#2E7D32', 'v_p');
  drawVLine(vrms, plotX, plotY, plotW, plotH, '#C62828', 'v_rms');

  // numeric readout
  const avgKE_J = 1.5 * KB * T;
  const avgKE_eV = avgKE_J / EV;

  noStroke();
  fill(20);
  textAlign(LEFT, TOP);
  textSize(13);
  text('T = ' + T + ' K', plotX + plotW - 230, plotY + 6);
  text('Most probable speed v_p = ' + vp.toFixed(0) + ' m/s', plotX + plotW - 230, plotY + 24);
  text('RMS speed v_rms = ' + vrms.toFixed(0) + ' m/s', plotX + plotW - 230, plotY + 42);
  text('<KE> = 1.5 kB T = ' + avgKE_J.toExponential(2) + ' J', plotX + plotW - 230, plotY + 60);
  text('       = ' + avgKE_eV.toFixed(4) + ' eV', plotX + plotW - 230, plotY + 78);

  // control labels
  fill('black');
  textAlign(RIGHT, CENTER);
  textSize(13);
  text('Temperature: ' + T + ' K', 145, drawHeight + 27);
}

function drawVLine(v, plotX, plotY, plotW, plotH, col, label) {
  const x = plotX + (v / V_MAX) * plotW;
  stroke(col);
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  line(x, plotY, x, plotY + plotH);
  drawingContext.setLineDash([]);
  noStroke();
  fill(col);
  textAlign(CENTER, BOTTOM);
  textSize(11);
  text(label, x, plotY - 2);
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
