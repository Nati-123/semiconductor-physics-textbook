// Work Function and Barrier Height Explorer MicroSim
// Computes the semiconductor work function Phi_S from doping type and
// concentration, then the Schottky barrier height Phi_B and built-in
// potential Vbi for a chosen metal, drawing a single combined
// before-contact / after-contact / barrier-formation band diagram.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let metalSelect, typeSelect, dopingSlider;

const KT_Q = 0.0259;
const CHI = 4.05; // eV, Si electron affinity
const EG = 1.12;  // eV
const NC = 2.8e19, NV = 1.04e19, NI = 1.5e10;
const METALS = { 'Aluminum (Al)': 4.1, 'Tungsten (W)': 4.55, 'Gold (Au)': 5.1, 'Platinum (Pt)': 5.65 };

function computePhiS(type, N) {
  if (type === 'n-type') {
    const EcMinusEf = KT_Q * Math.log(NC / N);
    return { PhiS: CHI + EcMinusEf, EcMinusEf: EcMinusEf };
  } else {
    const EfMinusEv = KT_Q * Math.log(NV / N);
    return { PhiS: CHI + (EG - EfMinusEv), EcMinusEf: EG - EfMinusEv };
  }
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  metalSelect = createSelect();
  Object.keys(METALS).forEach(k => metalSelect.option(k));
  metalSelect.selected('Gold (Au)');
  metalSelect.attribute('aria-label', 'Metal type');

  typeSelect = createSelect();
  typeSelect.option('n-type');
  typeSelect.option('p-type');
  typeSelect.selected('n-type');
  typeSelect.attribute('aria-label', 'Semiconductor doping type');

  dopingSlider = createSlider(14, 19, 16, 0.1);
  dopingSlider.attribute('aria-label', 'Doping concentration exponent');

  positionUIElements();
  describe('Work function and barrier height explorer: computes Schottky barrier height and built-in potential from a chosen metal and semiconductor doping, with a combined before/after-contact band diagram', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const rowY = drawHeight + 14;
  metalSelect.position(bx + 150, rowY);
  typeSelect.position(bx + 150, rowY + 38);
  dopingSlider.position(bx + 150, rowY + 76);
  dopingSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const PhiM = METALS[metalSelect.value()];
  const type = typeSelect.value();
  const N = Math.pow(10, dopingSlider.value());
  const r = computePhiS(type, N);
  // Schottky-Mott gives Phi_Bn = Phi_M - chi directly, but a barrier height
  // cannot physically be negative: if Phi_M - chi falls outside [0, Eg] (as
  // it does here for Platinum, whose Phi_M - chi = 1.60 V > Eg = 1.12 V),
  // one of the two carrier barriers has been driven to zero -- the contact
  // is essentially barrier-free (ohmic-like) for that carrier type.
  const PhiBnRaw = PhiM - CHI;
  const PhiBn = constrain(PhiBnRaw, 0, EG);
  const PhiBp = EG - PhiBn;
  const barrierClamped = Math.abs(PhiBnRaw - PhiBn) > 1e-6;
  const Vbi = Math.abs(PhiM - r.PhiS);

  const headerH = drawHeader();
  const stacked = canvasWidth < 640;
  let diagBox, cardBox;
  if (stacked) {
    const midY = headerH + (drawHeight - headerH - 24) * 0.58;
    diagBox = { x0: 14, x1: canvasWidth - 16, y0: headerH + 10, y1: midY };
    cardBox = { x: 14, y: midY + 14, w: canvasWidth - 28, h: drawHeight - (midY + 14) - 10 };
  } else {
    diagBox = { x0: 14, x1: canvasWidth * 0.60, y0: headerH + 10, y1: drawHeight - 34 };
    cardBox = { x: canvasWidth * 0.64, y: headerH + 10, w: canvasWidth - canvasWidth * 0.64 - 16, h: drawHeight - (headerH + 10) - 14 };
  }
  drawBandDiagram(PhiM, r, type, PhiBn, PhiBp, diagBox);
  drawResultCard(PhiM, r, PhiBn, PhiBp, Vbi, type, cardBox, barrierClamped, PhiBnRaw);

  fill(30); noStroke();
  textAlign(LEFT, CENTER); textSize(13);
  const rowY = drawHeight + 14;
  text('Metal:', 10, rowY + 10);
  text('Doping type:', 10, rowY + 48);
  smlMathText(10, rowY + 78, 'N = ' + smlFormatPow10(dopingSlider.value()), { size: 13 });
}

// Compact formula strip, kept clear of the top-right fullscreen button by a
// dedicated blank safe zone (topSafe) that spans the full canvas width. The
// four formulas are grouped onto 2-4 lines depending on canvasWidth so none
// of them ever run past the canvas edge and get clipped (the bug this used
// to have on phone-width screens).
function drawHeader() {
  const topSafe = 26;
  const lineH = 19;
  const f1 = 'Φ_S = χ + (E_C-E_F)/q', f2 = 'Φ_Bn = Φ_M - χ', f3 = 'Φ_Bp = E_g/q - Φ_Bn',
        f4 = 'V_bi = |Φ_M - Φ_S|  (same role as V_bi at a p-n junction)';
  let rows;
  if (canvasWidth >= 800) rows = [f1 + '      ' + f2 + '      ' + f3, f4];
  else if (canvasWidth >= 520) rows = [f1, f2 + '      ' + f3, f4];
  else rows = [f1, f2, f3, f4.replace('  (same role as V_bi at a p-n junction)', '')];

  noStroke(); fill(245, 247, 255);
  rect(0, topSafe, canvasWidth, lineH * rows.length + 10);
  stroke(225); line(0, topSafe + lineH * rows.length + 10, canvasWidth, topSafe + lineH * rows.length + 10);
  noStroke(); fill(50);
  for (let i = 0; i < rows.length; i++) {
    smlMathText(10, topSafe + 5 + lineH * i, rows[i], { size: 13.5 });
  }
  return topSafe + lineH * rows.length + 10;
}

// Single combined diagram: light dashed "before contact" reference bands
// (the isolated semiconductor, referenced to the same vacuum level) sit
// behind the solid "after contact" equilibrium picture, where a single flat
// E_F spans metal + semiconductor and the bands bend near the junction to
// open up the Schottky barrier. This is what used to be two disconnected,
// misaligned panels -- now derived from one self-consistent energy scale so
// "before -> after -> barrier" reads as one continuous story.
function drawBandDiagram(PhiM, r, type, PhiBn, PhiBp, box) {
  const x0 = box.x0, x1 = box.x1, chartTop = box.y0, chartBottom = box.y1 - 26;
  const chartH = chartBottom - chartTop;
  const xJ = x0 + (x1 - x0) * 0.32; // metal | semiconductor junction
  const vacY = chartTop + 14;
  const EcBulkE = r.EcMinusEf; // E_C - E_F in the undisturbed bulk (doping-set)
  // Scale to the depth this specific metal/doping combination actually needs
  // (vacuum down to the deepest E_V point), with headroom -- not a fixed
  // worst-case range -- so the plot always fills the box instead of leaving
  // a metal like Aluminum stranded in a mostly-empty top third of it.
  const depthNeeded = PhiM + EG - Math.min(PhiBn, EcBulkE);
  const pxPerEV = (chartH - 40) / (depthNeeded * 1.12);
  const EF_line_y = vacY + PhiM * pxPerEV;

  noFill(); stroke(210); strokeWeight(1);
  rect(x0 - 8, chartTop - 4, x1 - x0 + 16, chartBottom - chartTop + 8, 6);

  function ease(t) { return t * t * (3 - 2 * t); } // smoothstep
  function eC(t) { return PhiBn + (EcBulkE - PhiBn) * ease(t); }
  function yEC(t) { return EF_line_y - eC(t) * pxPerEV; }
  function yEV(t) { return EF_line_y - (eC(t) - EG) * pxPerEV; }
  function yVac(t) { return yEC(t) - CHI * pxPerEV; }

  // ---- "before contact" ghost: isolated semiconductor, undisturbed ----
  const ecBeforeY = vacY + CHI * pxPerEV;
  const evBeforeY = ecBeforeY + EG * pxPerEV;
  const efBeforeY = vacY + r.PhiS * pxPerEV;
  stroke(190); strokeWeight(1.3); drawingContext.setLineDash([3, 4]);
  line(xJ, ecBeforeY, x1, ecBeforeY);
  line(xJ, evBeforeY, x1, evBeforeY);
  line(xJ, efBeforeY, x1, efBeforeY);
  drawingContext.setLineDash([]);
  noStroke(); fill(140); textAlign(LEFT, BOTTOM); textSize(9.5);
  text('before contact (isolated semiconductor)', xJ + 4, ecBeforeY - 3);

  // ---- vacuum level: flat over the metal, bends with E_C in the s/c ----
  stroke(150); strokeWeight(1); drawingContext.setLineDash([2, 3]);
  line(x0, vacY, xJ, vacY);
  drawingContext.setLineDash([]);
  strokeWeight(1.2); noFill();
  beginShape();
  for (let t = 0; t <= 1.001; t += 0.05) vertex(xJ + t * (x1 - xJ), yVac(t));
  endShape();
  noStroke(); fill(90); textAlign(LEFT, BOTTOM); textSize(10);
  text('vacuum level', x0, vacY - 3);

  // ---- after-contact E_C / E_V bands (solid, bending at the junction) ----
  stroke(90, 180, 220); strokeWeight(2.4); noFill();
  beginShape();
  for (let t = 0; t <= 1.001; t += 0.05) vertex(xJ + t * (x1 - xJ), yEC(t));
  endShape();
  stroke(90, 180, 120); strokeWeight(2.4);
  beginShape();
  for (let t = 0; t <= 1.001; t += 0.05) vertex(xJ + t * (x1 - xJ), yEV(t));
  endShape();
  noStroke(); fill(60, 140, 180); textAlign(LEFT, BOTTOM); textSize(11);
  smlDrawSubLabel(x1 + 4, yEC(1), 'E', 'C', { size: 11 });
  fill(60, 140, 100);
  smlDrawSubLabel(x1 + 4, yEV(1), 'E', 'V', { size: 11 });

  // ---- common equilibrium E_F: one flat line, metal through bulk s/c ----
  stroke(90, 62, 237); strokeWeight(2.6);
  line(x0, EF_line_y, x1, EF_line_y);
  noStroke(); fill(90, 62, 237); textAlign(LEFT, BOTTOM); textSize(11);
  smlDrawSubLabel(x0, EF_line_y - 5, 'E', 'F', { size: 11 });

  // ---- barrier brackets at the junction. Labels sit at the OUTER end of
  // each arrow (away from the E_F line), not its midpoint, so a very small
  // barrier (Phi_Bn or Phi_Bp can each shrink toward 0, though never both at
  // once since they sum to E_g) never collapses its label onto the E_F line.
  const bx = xJ + (x1 - xJ) * 0.09;
  const yBn = yEC(0.03), yBp = yEV(0.03);
  stroke(190, 60, 60); strokeWeight(1.4);
  drawArrowV(bx, EF_line_y, yBn);
  noStroke(); fill(190, 60, 60); textAlign(LEFT, BOTTOM); textSize(10.5);
  smlDrawSubLabel(bx + 6, yBn - 2, 'Φ', 'Bn', { size: 10.5 });

  stroke(60, 110, 190); strokeWeight(1.4);
  drawArrowV(bx, EF_line_y, yBp);
  noStroke(); fill(60, 110, 190); textAlign(LEFT, TOP); textSize(10.5);
  smlDrawSubLabel(bx + 6, yBp + 2, 'Φ', 'Bp', { size: 10.5 });

  // ---- junction marker + region labels ----
  stroke(120); strokeWeight(1); drawingContext.setLineDash([1, 3]);
  line(xJ, chartTop, xJ, chartBottom);
  drawingContext.setLineDash([]);

  noStroke(); fill(60); textAlign(CENTER, TOP); textSize(11); textStyle(BOLD);
  text('Metal', x0 + (xJ - x0) / 2, chartBottom + 6);
  text('Semiconductor (' + type + ')', xJ + (x1 - xJ) / 2, chartBottom + 6);
  textStyle(NORMAL);
}

function drawArrowV(x, y1, y2) {
  line(x, y1, x, y2);
  const dir = y2 > y1 ? 1 : -1;
  line(x, y2, x - 3, y2 - dir * 5);
  line(x, y2, x + 3, y2 - dir * 5);
}

function drawResultCard(PhiM, r, PhiBn, PhiBp, Vbi, type, box, barrierClamped, PhiBnRaw) {
  const cardX = box.x, cardY = box.y, cardW = box.w, cardH = box.h;
  const narrow = cardW < 260;
  noStroke(); fill(240, 245, 255);
  stroke(168, 200, 255); strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);

  noStroke(); fill(90, 62, 237); textAlign(CENTER, TOP); textStyle(BOLD);
  smlMathText(cardX + cardW / 2, cardY + 10, 'Φ_S = ' + r.PhiS.toFixed(3) + ' V', { size: 14, align: 'center' });
  textStyle(NORMAL);

  fill(30); textAlign(LEFT, TOP);
  let y = cardY + 40;
  const lineH = narrow ? 34 : 24;
  const rows = [
    ['Φ_M', PhiM.toFixed(2) + ' V', false],
    ['χ', CHI.toFixed(2) + ' V', false],
    ['Φ_Bn', PhiBn.toFixed(3) + ' V', type === 'n-type'],
    ['Φ_Bp', PhiBp.toFixed(3) + ' V', type === 'p-type'],
    ['V_bi', Vbi.toFixed(3) + ' V', false],
  ];
  for (const [label, value, primary] of rows) {
    if (primary) { fill(255, 245, 225); noStroke(); rect(cardX + 8, y - 3, cardW - 16, lineH - 4, 4); fill(150, 90, 0); }
    else fill(30);
    smlMathText(cardX + 14, y, label + ' = ' + value, { size: 12.5 });
    if (primary) {
      fill(150, 90, 0); textSize(9);
      if (narrow) { textAlign(LEFT, TOP); text('relevant barrier for ' + type, cardX + 14, y + 15); }
      else { textAlign(RIGHT, TOP); text('relevant barrier for ' + type, cardX + cardW - 10, y + 1); }
      textAlign(LEFT, TOP);
    }
    y += lineH;
  }
  fill(70); textSize(11);
  text((PhiM > r.PhiS ? 'Φ_M > Φ_S ⇒ electrons flow metal→s/c until aligned' : 'Φ_M < Φ_S ⇒ electrons flow s/c→metal until aligned'), cardX + 14, y + 2, cardW - 24);
  y += 32;
  if (barrierClamped) {
    fill(150, 30, 30); textSize(10); textAlign(LEFT, TOP);
    const which = PhiBnRaw > EG ? 'the hole barrier (Φ_Bp)' : 'the electron barrier (Φ_Bn)';
    text('Note: Φ_M − χ = ' + PhiBnRaw.toFixed(2) + ' V is outside [0, E_g], so ' + which + ' saturates at 0 -- no barrier (ohmic-like) for that carrier.', cardX + 14, y, cardW - 24);
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
