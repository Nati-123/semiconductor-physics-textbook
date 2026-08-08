// Maxwell-Boltzmann Speed Distribution MicroSim
// Helps students interpret how raising temperature broadens and shifts the
// Maxwell-Boltzmann speed distribution, and connects this to the increase
// in average kinetic energy predicted by <KE> = (3/2) kB T.
// Bloom Level: Understand (L2) - interpret
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 700;
let drawHeight = 400;
let controlHeight = 118;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 44;
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

  // Min is 77 K (not 100 K) so the "Liquid Nitrogen (77 K)" preset button
  // below can actually reach its labeled value instead of being clamped.
  tempSlider = createSlider(77, 1000, 300, 1);
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

function buttonsFitSideBySide(mainRect) {
  const roomW = roomButton.elt.getBoundingClientRect().width;
  const ln2W = ln2Button.elt.getBoundingClientRect().width;
  return (mainRect.left + 150 + roomW + 15 + ln2W) <= mainRect.right - 10;
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const sliderW = constrain(mainRect.width - 150 - 20, 80, 220);
  tempSlider.size(sliderW);
  tempSlider.position(mainRect.left + 150, mainRect.top + drawHeight + 14);

  roomButton.position(mainRect.left + 150, mainRect.top + drawHeight + 46);
  const roomW = roomButton.elt.getBoundingClientRect().width;
  const ln2W = ln2Button.elt.getBoundingClientRect().width;
  const sideBySideX = mainRect.left + 150 + roomW + 15;
  // Stack the second button on its own row if there isn't room beside the first.
  if (sideBySideX + ln2W <= mainRect.right - 10) {
    ln2Button.position(sideBySideX, mainRect.top + drawHeight + 46);
  } else {
    ln2Button.position(mainRect.left + 150, mainRect.top + drawHeight + 78);
  }
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
  textSize(canvasWidth < 500 ? 13 : 18);
  text('Maxwell-Boltzmann Speed Distribution', canvasWidth / 2, 8);

  const T = tempSlider.value();

  const plotX = margin;
  const plotY = 38;
  const plotW = canvasWidth - 2 * margin;
  const plotH = drawHeight - plotY - 36;

  // axes
  stroke(80);
  strokeWeight(1.5);
  line(plotX, plotY, plotX, plotY + plotH);
  line(plotX, plotY + plotH, plotX + plotW, plotY + plotH);

  noStroke();
  fill(60);
  textAlign(CENTER, TOP);
  textSize(12);
  text('Particle speed v (m/s)', plotX + plotW / 2, plotY + plotH + 18);
  push();
  translate(plotX - 32, plotY + plotH / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Probability density (relative)', 0, 0);
  pop();

  // x tick labels
  textAlign(CENTER, TOP);
  textSize(10);
  for (let vTick = 0; vTick <= V_MAX; vTick += 400) {
    const x = plotX + (vTick / V_MAX) * plotW;
    stroke(210);
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

  // most probable speed and rms speed marker lines. Labels live in the
  // stats panel (color-matched) instead of crowding the plot itself, so
  // they never collide even when v_p and v_rms sit close together.
  const vrms = Math.sqrt(3 * KB * T / M_N2);
  drawVLine(vp, plotX, plotY, plotW, plotH, '#2E7D32');
  drawVLine(vrms, plotX, plotY, plotW, plotH, '#C62828');

  // numeric readout
  const avgKE_J = 1.5 * KB * T;
  const avgKE_eV = avgKE_J / EV;
  drawStatsPanel(plotX, plotY, plotW, T, vp, vrms, avgKE_J, avgKE_eV);

  drawControlLabels(T);
}

function drawStatsPanel(plotX, plotY, plotW, T, vp, vrms, avgKE_J, avgKE_eV) {
  const fs = canvasWidth < 500 ? 10.5 : 13;
  const lineH = fs * 2.0; // generous enough to tolerate an occasional line wrap
  const boxW = min(plotW * 0.62, 250);
  const px = plotX + plotW - boxW + 6;
  const py = plotY + 10;

  fill(255, 255, 255, 235);
  stroke(210);
  strokeWeight(1);
  rect(px - 10, py - 8, boxW, 5 * lineH + 10, 6);

  noStroke();
  textAlign(LEFT, TOP);
  textSize(fs);
  let y = py;
  fill(20);
  text('T = ' + T + ' K', px, y);
  y += lineH;
  fill('#2E7D32');
  text('vₚ (peak) = ' + vp.toFixed(0) + ' m/s', px, y, boxW - 16);
  y += lineH;
  fill('#C62828');
  text('v_rms = ' + vrms.toFixed(0) + ' m/s', px, y, boxW - 16);
  y += lineH;
  fill(20);
  text('⟨KE⟩ = 1.5 kBT = ' + avgKE_J.toExponential(2) + ' J', px, y, boxW - 16);
  y += lineH;
  text('        = ' + avgKE_eV.toFixed(4) + ' eV', px, y, boxW - 16);
}

function drawVLine(v, plotX, plotY, plotW, plotH, col) {
  const x = plotX + (v / V_MAX) * plotW;
  stroke(col);
  strokeWeight(1.5);
  drawingContext.setLineDash([5, 4]);
  line(x, plotY, x, plotY + plotH);
  drawingContext.setLineDash([]);
  noStroke();
  fill(col);
  triangle(x - 4, plotY - 6, x + 4, plotY - 6, x, plotY - 1);
}

function drawControlLabels(T) {
  fill('black');
  noStroke();
  textAlign(RIGHT, CENTER);
  textSize(13);
  text('Temperature: ' + T + ' K', 145, drawHeight + 26);

  // Caption, grouped with the controls below the graph.
  const stacked = !buttonsFitSideBySide(document.querySelector('main').getBoundingClientRect());
  const capY = drawHeight + (stacked ? 100 : 78);
  fill('#666');
  textAlign(LEFT, TOP);
  textSize(11);
  text('Higher T broadens the curve and shifts vₚ and v_rms to higher speeds.', 20, capY, canvasWidth - 40);
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
