// MOS Capacitor Band Bending Explorer MicroSim
// Draws a gate / oxide / semiconductor band diagram for a p-type MOS
// capacitor, with the semiconductor bands bending near the oxide
// interface according to a surface-potential slider (the qualitative
// stand-in for gate bias relative to flat-band). Flat-band (psi_s = 0)
// is marked explicitly, and the surface charge appropriate to each
// regime (accumulated holes, depleted acceptors, or an inversion layer
// of electrons) is sketched at the oxide interface.
// Bloom Level: Understand (L2)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let psiSlider, naSlider;

const KT_Q = 0.0259;
const NI = 1.5e10;
const EG = 1.12;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  psiSlider = createSlider(-0.6, 0.9, 0, 0.01);
  psiSlider.attribute('aria-label', 'Surface potential psi_s, standing in for gate bias relative to flat-band');
  naSlider = createSlider(14, 18, 16, 0.1);
  naSlider.attribute('aria-label', 'Substrate doping concentration exponent');

  positionUIElements();
  describe('MOS capacitor band bending explorer: shows a gate, oxide, and semiconductor band diagram bending at the surface as a function of surface potential, with the accumulated, depleted, or inverted surface charge sketched at the interface', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const rowY = drawHeight + 14;
  psiSlider.position(bx + 150, rowY);
  psiSlider.size(min(canvasWidth - 170 - 30, 320));
  naSlider.position(bx + 150, rowY + 38);
  naSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const psiS = psiSlider.value();
  const NA = Math.pow(10, naSlider.value());
  const phiF = KT_Q * Math.log(NA / NI);

  let regime, regimeColor;
  if (psiS < -0.02) { regime = 'Accumulation'; regimeColor = color(220, 90, 60); }
  else if (psiS < 0.02) { regime = 'Flat-Band'; regimeColor = color(120); }
  else if (psiS < phiF) { regime = 'Depletion'; regimeColor = color(90, 62, 237); }
  else if (psiS < 2 * phiF) { regime = 'Weak Inversion'; regimeColor = color(200, 140, 30); }
  else { regime = 'Strong Inversion'; regimeColor = color(40, 150, 90); }

  // NOTE: p5's text() with a wrap-width argument treats (x,y) as the box's
  // TOP-LEFT corner for layout purposes, regardless of textAlign -- passing
  // canvasWidth/2 as x there (intending a centered anchor) actually starts
  // the box AT the midpoint and grows it rightward. So: shrink/split the
  // title to fit without ever needing that width argument.
  const topSafe = 26;
  fill(20); noStroke(); textAlign(CENTER, TOP);
  let titleH;
  if (canvasWidth < 460) {
    textSize(12.5);
    text('Gate | Oxide | Semiconductor', canvasWidth / 2, topSafe + 4);
    text('Band Diagram', canvasWidth / 2, topSafe + 19);
    titleH = 38;
  } else {
    textSize(15.5);
    text('Gate | Oxide | Semiconductor Band Diagram', canvasWidth / 2, topSafe + 6);
    titleH = 24;
  }
  const contentTop = topSafe + titleH + 6;

  // Regime badge, prominent, right under the title.
  const badgeW = textWidth(regime) + 28;
  noStroke(); fill(red(regimeColor), green(regimeColor), blue(regimeColor), 35);
  stroke(regimeColor); strokeWeight(1.5);
  rect(canvasWidth / 2 - badgeW / 2, contentTop, badgeW, 24, 12);
  noStroke(); fill(regimeColor); textAlign(CENTER, CENTER); textSize(13); textStyle(BOLD);
  text(regime, canvasWidth / 2, contentTop + 13);
  textStyle(NORMAL);

  drawMosBandDiagram(psiS, phiF, regime, regimeColor, contentTop + 34);

  fill(30); noStroke();
  textAlign(LEFT, CENTER); textSize(13);
  const rowY = drawHeight + 14;
  text('ψs (surface potential):', 10, rowY + 10);
  smlMathText(10, rowY + 48, 'N_A = ' + smlFormatPow10(naSlider.value()), { size: 13 });
  smlMathText(10, rowY + 78, 'ψ_s = ' + psiS.toFixed(3) + ' V     φ_F = ' + phiF.toFixed(3) + ' V     2φ_F = ' + (2 * phiF).toFixed(3) + ' V', { size: 12.5 });
}

function drawMosBandDiagram(psiS, phiF, regime, regimeColor, top) {
  const x0 = 40, xOxL = canvasWidth * 0.36, xOxR = canvasWidth * 0.46, x1 = canvasWidth - 40;
  const chartY = top, chartH = drawHeight - top - 60;
  const midY = chartY + chartH * 0.5;
  const bandGapPx = chartH * 0.32;
  const pxPerEV = bandGapPx / EG;

  noFill(); stroke(210); strokeWeight(1);
  rect(x0 - 10, chartY - 6, x1 - x0 + 20, chartH + 12, 6);

  // Gate (metal) region: a light hatched fill so it visually reads as a
  // distinct material, not empty background -- the same treatment the
  // oxide already got, extended for symmetry and to fill the previously
  // bare left third of the box.
  noStroke(); fill(225, 225, 232);
  rect(x0, chartY, xOxL - x0, chartH);
  stroke(200); strokeWeight(1);
  for (let hx = x0 + 6; hx < xOxL - 2; hx += 10) line(hx, chartY + 2, hx, chartY + chartH - 2);

  noStroke(); fill(235, 235, 245);
  rect(xOxL, chartY, xOxR - xOxL, chartH);
  const narrowLabels = canvasWidth < 500;
  const labelY = chartY + chartH + (narrowLabels ? 4 : 6);
  fill(90); textAlign(CENTER, TOP); textSize(narrowLabels ? 8.5 : 10);
  text(narrowLabels ? 'oxide' : 'oxide (SiO2)', (xOxL + xOxR) / 2, labelY);
  textAlign(CENTER, TOP); fill(60);
  text(narrowLabels ? 'gate' : 'gate (metal)', x0 + (xOxL - x0) / 2, labelY);
  text(narrowLabels ? 'semiconductor' : 'semiconductor (p-type)', xOxR + (x1 - xOxR) / 2, labelY);

  const efGateY = midY;
  stroke(90, 62, 237); strokeWeight(2.5);
  line(x0, efGateY, xOxL, efGateY);

  const bendPx = constrain(psiS, -0.6, 0.9) * chartH * 0.35;
  const ecBulkY = midY - bandGapPx / 2;
  const evBulkY = midY + bandGapPx / 2;
  const ecSurfY = ecBulkY - bendPx;
  const evSurfY = evBulkY - bendPx;

  stroke(regimeColor); strokeWeight(2.2); noFill();
  beginShape();
  vertex(xOxR, ecSurfY);
  bezierVertex(xOxR + 40, ecSurfY, xOxR + 40, ecBulkY, xOxR + 80, ecBulkY);
  vertex(x1, ecBulkY);
  endShape();
  beginShape();
  vertex(xOxR, evSurfY);
  bezierVertex(xOxR + 40, evSurfY, xOxR + 40, evBulkY, xOxR + 80, evBulkY);
  vertex(x1, evBulkY);
  endShape();

  noStroke(); fill(regimeColor); textAlign(LEFT, BOTTOM); textSize(10.5);
  smlDrawSubLabel(x1 + 4, ecBulkY + 4, 'E', 'C', { size: 10.5 });
  smlDrawSubLabel(x1 + 4, evBulkY + 4, 'E', 'V', { size: 10.5 });

  stroke(140); strokeWeight(1); drawingContext.setLineDash([2, 3]);
  const eiBulkY = midY, eiSurfY = midY - bendPx;
  line(xOxR, eiSurfY, x1, eiBulkY);
  drawingContext.setLineDash([]);
  noStroke(); fill(100); textAlign(LEFT, TOP); textSize(9.5);
  smlDrawSubLabel(x1 + 4, eiBulkY - 10, 'E', 'i', { size: 9.5 });

  // E_F sits phi_F below midgap in the bulk (E_i - E_F = phi_F for p-type,
  // non-degenerate) -- previously a fixed pixel offset independent of N_A,
  // so it never actually reflected the phi_F/2*phi_F values shown in the
  // readout. It's flat because it's the same equilibrium reference the
  // bands bend around, same convention as the Work Function Explorer.
  const efSemY = midY + phiF * pxPerEV;
  stroke(90); strokeWeight(1.5); drawingContext.setLineDash([1, 3]);
  line(xOxR, efSemY, x1, efSemY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90); textAlign(LEFT, TOP); textSize(9.5);
  smlDrawSubLabel(x1 + 4, efSemY - 12, 'E', 'F', { size: 9.5 });

  stroke(160); strokeWeight(1); drawingContext.setLineDash([3, 3]);
  line(xOxR + 78, chartY, xOxR + 78, chartY + chartH);
  drawingContext.setLineDash([]);
  noStroke(); fill(120); textAlign(CENTER, TOP); textSize(9);
  text('bulk', xOxR + 78, chartY - 12);
  fill(regimeColor); textAlign(CENTER, TOP); textSize(9);
  text('surface', xOxR + 6, chartY - 12);

  drawSurfaceCharge(regime, xOxR, midY, chartH);
}

// Sketches the surface charge appropriate to each regime right at the
// oxide/semiconductor interface, so accumulation/depletion/inversion are
// something the student sees forming, not just a name in a badge.
function drawSurfaceCharge(regime, xOxR, midY, chartH) {
  const laneX = xOxR + 10;
  noStroke();
  if (regime === 'Accumulation') {
    fill(220, 90, 60);
    for (let i = 0; i < 6; i++) {
      const yy = midY - chartH * 0.32 + i * (chartH * 0.64 / 5);
      text('+', laneX, yy);
    }
    fill(90); textSize(8.5); textAlign(LEFT, TOP);
    text('holes pile up\nat the surface', laneX + 12, midY - chartH * 0.34);
  } else if (regime === 'Depletion') {
    stroke(140, 120, 220); strokeWeight(1);
    fill(230, 225, 250);
    rect(xOxR, midY - chartH * 0.42, 26, chartH * 0.84);
    noStroke(); fill(90, 62, 237); textSize(11); textAlign(CENTER, CENTER);
    for (let i = 0; i < 4; i++) {
      const yy = midY - chartH * 0.26 + i * (chartH * 0.52 / 3);
      text('–', xOxR + 13, yy);
    }
    fill(90); textSize(8.5); textAlign(LEFT, TOP);
    text('ionized acceptors\n(depletion region)', xOxR + 32, midY - chartH * 0.34);
  } else if (regime === 'Weak Inversion' || regime === 'Strong Inversion') {
    const n = regime === 'Strong Inversion' ? 7 : 3;
    fill(40, 150, 90); textSize(11); textAlign(CENTER, CENTER);
    for (let i = 0; i < n; i++) {
      const yy = midY - chartH * 0.30 + i * (chartH * 0.60 / max(n - 1, 1));
      text('–', laneX, yy);
    }
    fill(90); textSize(8.5); textAlign(LEFT, TOP);
    text((n === 7 ? 'strong' : 'thin, forming') + ' electron\ninversion layer', laneX + 12, midY - chartH * 0.34);
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
