// Built-In Potential Calculator MicroSim
// Computes Vbi = (kT/q)*ln(NA*ND/ni(T)^2) for a chosen material and doping
// concentrations, with ni(T) computed from each material's 300K value and
// band gap using the standard ni(T) ~ T^1.5 * exp(-Eg/2kT) scaling.
// A toggle switches between two views:
//   Before Contact: the p-side and n-side as two separate, isolated
//     band diagrams, each with its own flat Fermi level positioned via
//     E_F - E_i = kT ln(N/ni) (the same midgap-referenced convention
//     used for the quasi-Fermi levels in Chapter 13). The vertical gap
//     between the two isolated E_F lines is, by construction, exactly
//     qV_bi -- the same qV_bi bracket shown after contact.
//   After Contact (Equilibrium): the standard bent-band diagram, with
//     a single flat E_F line drawn self-consistently (derived from the
//     same bending scale, so it lines up exactly on both sides).
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 210;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, naSlider, ndSlider, tSlider;
let showAfterContact = true;
let toggleBtnRects = [];

const K_EV = 8.617e-5; // eV/K
const MATERIALS = {
  'Silicon (Si)': { ni300: 1.5e10, Eg: 1.12 },
  'Germanium (Ge)': { ni300: 2.4e13, Eg: 0.66 },
  'Gallium Arsenide (GaAs)': { ni300: 2.1e6, Eg: 1.42 }
};

function compact() { return canvasWidth < 640; }

function niAtT(mat, T) {
  const ratio = T / 300;
  const exponent = (mat.Eg / (2 * K_EV)) * (1 / 300 - 1 / T);
  return mat.ni300 * Math.pow(ratio, 1.5) * Math.exp(exponent);
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  Object.keys(MATERIALS).forEach(k => materialSelect.option(k));
  materialSelect.selected('Silicon (Si)');
  materialSelect.attribute('aria-label', 'Semiconductor material');
  materialSelect.changed(function () { redraw(); });

  naSlider = createSlider(14, 19, 17, 0.1);
  naSlider.attribute('aria-label', 'Acceptor doping concentration exponent, N_A');
  naSlider.input(function () { redraw(); });
  ndSlider = createSlider(14, 19, 16, 0.1);
  ndSlider.attribute('aria-label', 'Donor doping concentration exponent, N_D');
  ndSlider.input(function () { redraw(); });
  tSlider = createSlider(250, 450, 300, 5);
  tSlider.attribute('aria-label', 'Temperature in kelvin');
  tSlider.input(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Built-in potential calculator: computes the equilibrium built-in potential of a p-n junction from doping concentrations, material, and temperature, with a toggle between the separate pre-contact band diagrams (showing each side\'s own Fermi level) and the equilibrium post-contact bent-band diagram with a single flat Fermi level', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function controlRows() {
  const stacked = compact();
  const rowH = stacked ? 54 : 36;
  const topPad = 12;
  return {
    stacked: stacked, rowH: rowH,
    material: topPad, na: topPad + rowH, nd: topPad + 2 * rowH, t: topPad + 3 * rowH,
    bottom: topPad + 4 * rowH + 6
  };
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const rows = controlRows();
  const widgetX = rows.stacked ? 16 : 150;
  const widgetOffsetY = rows.stacked ? 20 : 8;
  const sw = rows.stacked ? Math.min(canvasWidth - 32, 340) : Math.min(canvasWidth - 150 - 30, 320);

  materialSelect.position(bx + widgetX, by + drawHeight + rows.material + widgetOffsetY);
  materialSelect.size(sw);
  naSlider.position(bx + widgetX, by + drawHeight + rows.na + widgetOffsetY);
  naSlider.size(sw);
  ndSlider.position(bx + widgetX, by + drawHeight + rows.nd + widgetOffsetY);
  ndSlider.size(sw);
  tSlider.position(bx + widgetX, by + drawHeight + rows.t + widgetOffsetY);
  tSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const mat = MATERIALS[materialSelect.value()];
  const NA = Math.pow(10, naSlider.value());
  const ND = Math.pow(10, ndSlider.value());
  const T = tSlider.value();
  const ni = niAtT(mat, T);
  const kT_q = K_EV * T;
  const Vbi = kT_q * Math.log((NA * ND) / (ni * ni));

  fill(20); noStroke(); textAlign(CENTER, TOP);
  smlMathText(canvasWidth / 2, 8, 'V_bi = (kT/q)·ln(N_A·N_D / n_i²)', { size: compact() ? 13 : 16, align: 'center' });

  // ---- toggle: a real two-segment switch (not a single button whose
  // label tries to describe both states in one long string, which
  // used to overflow its own fixed width and clip off-canvas). ----
  const btnW = compact() ? canvasWidth - 20 : 360, btnH = 28;
  const btnX = compact() ? 10 : Math.round((canvasWidth - btnW) / 2), btnY = 32;
  const halfW = (btnW - 4) / 2;
  smlDrawButton(btnX, btnY, halfW, btnH, 'Before Contact', !showAfterContact);
  smlDrawButton(btnX + halfW + 4, btnY, halfW, btnH, 'After Contact', showAfterContact);
  toggleBtnRects = [
    { x: btnX, y: btnY, w: halfW, h: btnH, after: false },
    { x: btnX + halfW + 4, y: btnY, w: halfW, h: btnH, after: true }
  ];

  const diagTop = btnY + btnH + 10;
  // On wide canvases the card sits beside the diagram (both get the
  // full drawHeight); on narrow canvases the card sits below the
  // diagram, so the diagram must leave room for it -- otherwise (the
  // original bug here) the diagram's own height formula filled the
  // entire drawHeight, leaving nothing for the card and pushing it
  // off the bottom of the canvas.
  const cardH = compact() ? 190 : 168;
  const diagAvailH = compact() ? (drawHeight - diagTop - cardH - 10) : (drawHeight - diagTop);
  if (showAfterContact) {
    drawAfterContact(diagTop, diagAvailH, mat, NA, ND, kT_q, ni, Vbi);
  } else {
    drawBeforeContact(diagTop, diagAvailH, mat, NA, ND, kT_q, ni, Vbi);
  }

  drawResultCard(diagTop, cardH, NA, ND, T, ni, kT_q, Vbi);
  drawControlLabels();
}

function drawControlLabels() {
  const rows = controlRows();
  fill(30); noStroke(); textSize(compact() ? 12 : 13);
  const sz = compact() ? 12 : 13;
  if (rows.stacked) {
    textAlign(LEFT, TOP);
    text('Material', 10, drawHeight + rows.material);
    smlMathText(10, drawHeight + rows.na, 'N_A = 10' + toSup(naSlider.value().toFixed(1)) + ' cm⁻³', { size: sz });
    smlMathText(10, drawHeight + rows.nd, 'N_D = 10' + toSup(ndSlider.value().toFixed(1)) + ' cm⁻³', { size: sz });
    text('T = ' + tSlider.value() + ' K', 10, drawHeight + rows.t);
  } else {
    textAlign(LEFT, TOP);
    text('Material', 10, drawHeight + rows.material + 9);
    smlDrawSubLabel(10, drawHeight + rows.na + 9 + sz * 0.36, 'N', 'A', { size: sz, baseline: CENTER });
    smlDrawSubLabel(10, drawHeight + rows.nd + 9 + sz * 0.36, 'N', 'D', { size: sz, baseline: CENTER });
    text('T', 10, drawHeight + rows.t + 9);
    textAlign(RIGHT, TOP);
    text('10' + toSup(naSlider.value().toFixed(1)) + ' cm⁻³', canvasWidth - 10, drawHeight + rows.na + 9);
    text('10' + toSup(ndSlider.value().toFixed(1)) + ' cm⁻³', canvasWidth - 10, drawHeight + rows.nd + 9);
    text(tSlider.value() + ' K', canvasWidth - 10, drawHeight + rows.t + 9);
  }
}

function toSup(exp) {
  const supDigits = { '-': '⁻', '.': '·', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return String(exp).split('').map(c => supDigits[c] || c).join('');
}

// ---- After Contact: bent-band equilibrium diagram with a single flat E_F ----
function drawAfterContact(top, availH, mat, NA, ND, kT_q, ni, Vbi) {
  const x0 = compact() ? 34 : 40, x1 = (compact() ? canvasWidth : canvasWidth * 0.58) - (compact() ? 34 : 0);
  const chartY = top, chartH = availH - 60;
  const midX = (x0 + x1) / 2;
  const bendMaxV = 1.4;
  const bandGapPx = chartH * 0.4;
  // bandGapPx/2 (0.2*chartH) plus the bend offset must stay within the
  // box's own half-height (chartH*0.5) with margin to spare, or the
  // p-side E_C curve (and the qV_bi arrow, which spans the same range)
  // overflow above the box at high V_bi (e.g. GaAs) -- 0.26*chartH
  // keeps 0.2 + 0.26 = 0.46 comfortably under 0.5.
  const bendPx = map(constrain(Vbi, 0, bendMaxV), 0, bendMaxV, 0, chartH * 0.26);

  noFill(); stroke(210); strokeWeight(1);
  rect(x0 - 10, chartY - 6, x1 - x0 + 20, chartH + 12, 6);

  // Physics check: at equilibrium the built-in field points from n to
  // p (n-side is at higher electrostatic potential, V_n > V_p), so an
  // electron's potential energy -qV(x) is LOWER on the n-side. Bands
  // must therefore sit HIGHER in energy (smaller pixel y) on the
  // p-side and LOWER (larger pixel y) on the n-side -- a downward
  // slope going left-to-right, p to n. (An earlier version of this
  // diagram had the two sides swapped.)
  const ecFlatP = chartY + chartH * 0.5 - bandGapPx / 2 - bendPx;
  const evFlatP = ecFlatP + bandGapPx;
  const ecFlatN = chartY + chartH * 0.5 - bandGapPx / 2 + bendPx;
  const evFlatN = ecFlatN + bandGapPx;
  const midgapP = ecFlatP + bandGapPx / 2;

  function bandCurve(yLeft, yRight) {
    beginShape();
    vertex(x0, yLeft);
    vertex(midX - 24, yLeft);
    bezierVertex(midX - 8, yLeft, midX - 8, yRight, midX + 8, yRight);
    vertex(x1, yRight);
    endShape();
  }

  stroke(90, 62, 237); strokeWeight(2.5); noFill();
  bandCurve(ecFlatP, ecFlatN);
  stroke(90, 180, 120);
  bandCurve(evFlatP, evFlatN);

  // Single flat equilibrium Fermi level, derived from the SAME
  // bending scale used above so it lines up exactly on both sides
  // (see derivation in the file header comment). E_Fp = E_i - kT
  // ln(NA/ni) is a LOWER physical energy than E_i, which is a LARGER
  // pixel y in this diagram's convention (smaller y = higher energy),
  // so the pixel offset is added, not subtracted.
  const pxPerVolt = Vbi > 0 ? (2 * bendPx) / Vbi : 0;
  const efPixel = midgapP + kT_q * Math.log(NA / ni) * pxPerVolt;
  stroke(150, 60, 160); strokeWeight(2); drawingContext.setLineDash([5, 4]);
  line(x0, efPixel, x1, efPixel);
  drawingContext.setLineDash([]);
  noStroke(); fill(150, 60, 160); textStyle(BOLD);
  smlDrawSubLabel(x1 + 6, efPixel, 'E', 'F', { size: compact() ? 11 : 12, baseline: CENTER });
  textStyle(NORMAL);

  noStroke(); fill(90, 62, 237);
  smlDrawSubLabel(x1 + 6, ecFlatN, 'E', 'C', { size: compact() ? 10.5 : 11.5, baseline: CENTER });
  fill(90, 180, 120);
  smlDrawSubLabel(x1 + 6, evFlatN, 'E', 'V', { size: compact() ? 10.5 : 11.5, baseline: CENTER });

  stroke(200); strokeWeight(1);
  drawingContext.setLineDash([2, 3]);
  line(x0, chartY - 2, x0, chartY + chartH + 4);
  line(x1, chartY - 2, x1, chartY + chartH + 4);
  drawingContext.setLineDash([]);

  noStroke(); fill(190, 40, 40); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11); textStyle(BOLD);
  text('p-side (neutral)', x0, chartY + chartH + 8);
  fill(40, 40, 190); textAlign(RIGHT, TOP);
  text('n-side (neutral)', x1, chartY + chartH + 8);
  textStyle(NORMAL);

  // Placed near x0 (the flat p-side, well clear of the bezier curve's
  // own bend, which happens near midX) rather than at the diagram's
  // horizontal center -- the bracket used to sit exactly where the
  // curves themselves were bending, so the label text overlapped them.
  const bx = x0 + 22;
  stroke(230, 150, 30); strokeWeight(1.5);
  line(bx, ecFlatP, bx, ecFlatN);
  noStroke(); fill(230, 150, 30);
  triangle(bx, ecFlatP, bx - 4, ecFlatP + 6, bx + 4, ecFlatP + 6);
  triangle(bx, ecFlatN, bx - 4, ecFlatN - 6, bx + 4, ecFlatN - 6);
  fill(200, 120, 10); textStyle(BOLD);
  smlDrawSubLabel(bx + 8, (ecFlatP + ecFlatN) / 2, 'qV', 'bi', { size: compact() ? 10 : 11, baseline: CENTER });
  textStyle(NORMAL);
}

// ---- Before Contact: two separate, isolated band diagrams, each with
// its own flat E_F, referenced to a shared vertical energy scale so the
// gap between the two E_F lines is visually exactly qV_bi. ----
function drawBeforeContact(top, availH, mat, NA, ND, kT_q, ni, Vbi) {
  const fullW = compact() ? canvasWidth - 20 : canvasWidth * 0.58 - 10;
  const gap = compact() ? 14 : 20;
  const boxW = (fullW - gap) / 2;
  const x0 = compact() ? 10 : 20;
  const pX0 = x0, pX1 = x0 + boxW;
  const nX0 = x0 + boxW + gap, nX1 = nX0 + boxW;
  const chartY = top, chartH = availH - 60;
  const bandGapPx = chartH * 0.4;
  const midY = chartY + chartH * 0.5;
  const ecY = midY - bandGapPx / 2, evY = midY + bandGapPx / 2;

  // Use the SAME bending pixel-per-volt scale as the after-contact
  // view (computed the same way) so switching the toggle keeps the
  // E_F positions visually consistent between the two views. E_Fp is a
  // LOWER physical energy than midgap (larger pixel y); E_Fn is a
  // HIGHER physical energy than midgap (smaller pixel y) -- see the
  // derivation in drawAfterContact.
  const bendMaxV = 1.4;
  const bendPxMax = chartH * 0.26; // matches drawAfterContact's bendPx scale
  const pxPerVolt = bendMaxV > 0 ? bendPxMax / bendMaxV : 0;
  const efP = midY + kT_q * Math.log(NA / ni) * pxPerVolt;
  const efN = midY - kT_q * Math.log(ND / ni) * pxPerVolt;

  function box(bx0, bx1, color1, efY, efLabel, sideLabel) {
    noFill(); stroke(210); strokeWeight(1);
    rect(bx0 - 6, chartY - 6, bx1 - bx0 + 12, chartH + 12, 6);
    stroke(90, 62, 237); strokeWeight(2.5);
    line(bx0, ecY, bx1, ecY);
    stroke(90, 180, 120);
    line(bx0, evY, bx1, evY);
    stroke(...color1); strokeWeight(2); drawingContext.setLineDash([5, 4]);
    line(bx0, efY, bx1, efY);
    drawingContext.setLineDash([]);
    const sz = compact() ? 10 : 11;
    noStroke(); fill(...color1); textStyle(BOLD);
    // Approximates the old BOTTOM/TOP anchoring: for a label placed
    // above its line, back off by roughly the text's own height so it
    // reads as sitting just above efY; below, start right at efY.
    smlMathText((bx0 + bx1) / 2, efY < midY ? efY - sz - 4 : efY + 4, efLabel, { size: sz, align: 'center' });
    textStyle(NORMAL);
    fill(90); textAlign(CENTER, TOP); textSize(compact() ? 9.5 : 10.5);
    text(sideLabel, (bx0 + bx1) / 2, chartY + chartH + 8);
  }

  box(pX0, pX1, [190, 40, 40], efP, 'E_Fp', 'p-side (isolated)');
  box(nX0, nX1, [40, 40, 190], efN, 'E_Fn', 'n-side (isolated)');

  noStroke(); fill(90, 62, 237);
  smlDrawSubLabel(pX1 - 30, ecY - 10, 'E', 'C', { size: compact() ? 10 : 11, baseline: CENTER });
  fill(90, 180, 120);
  smlDrawSubLabel(pX1 - 30, evY + 10, 'E', 'V', { size: compact() ? 10 : 11, baseline: CENTER });

  // qV_bi bracket between the two isolated E_F lines.
  const bxk = (pX1 + nX0) / 2;
  stroke(230, 150, 30); strokeWeight(1.5);
  line(bxk, efP, bxk, efN);
  noStroke(); fill(230, 150, 30);
  triangle(bxk, efP, bxk - 4, efP + 6, bxk + 4, efP + 6);
  triangle(bxk, efN, bxk - 4, efN - 6, bxk + 4, efN - 6);
  fill(200, 120, 10); textAlign(CENTER, CENTER); textSize(compact() ? 9.5 : 10.5); textStyle(BOLD);
  push();
  translate(bxk + (compact() ? 20 : 26), (efP + efN) / 2);
  rotate(-HALF_PI);
  smlMathText(0, -6, 'qV_bi apart', { size: compact() ? 9.5 : 10.5, align: 'center', color: color(200, 120, 10) });
  pop();
  textStyle(NORMAL);
}

function drawResultCard(diagTop, cardH, NA, ND, T, ni, kT_q, Vbi) {
  // On wide canvases the card sits to the right of the diagram, at the
  // same top as the toggle button; on narrow canvases it sits below
  // the (already full-width) diagram, in the space the diagram left
  // for it (see diagAvailH in draw()) instead of overlapping it.
  const wide = !compact();
  const cx = wide ? canvasWidth * 0.62 : 10;
  const cy = wide ? diagTop : drawHeight - cardH;
  const cw = wide ? canvasWidth - cx - 16 : canvasWidth - 20;
  const sz = compact() ? 11 : 11.5;
  const lineH = compact() ? 21 : 20;
  const nLines = 4;
  // Content-driven height instead of stretching to fill all remaining
  // vertical space, which previously left a large, mostly-empty box
  // below the four result lines on wide canvases.
  const ch = 12 + 26 + nLines * lineH + 14 + (compact() ? 0 : 40);

  noStroke(); fill(240, 245, 255);
  stroke(168, 200, 255); strokeWeight(1.5);
  rect(cx, cy, cw, ch, 10);
  noStroke(); fill(90, 62, 237); textAlign(CENTER, TOP); textStyle(BOLD);
  smlMathText(cx + cw / 2, cy + 12, 'V_bi = ' + Vbi.toFixed(3) + ' V', { size: compact() ? 16 : 17, align: 'center', color: color(90, 62, 237) });
  textStyle(NORMAL);
  fill(30);
  let ly = cy + 44;
  smlMathText(cx + 14, ly, 'kT/q = ' + kT_q.toFixed(4) + ' V', { size: sz }); ly += lineH;
  smlMathText(cx + 14, ly, 'n_i(T) = ' + ni.toExponential(2) + ' cm⁻³', { size: sz }); ly += lineH;
  smlMathText(cx + 14, ly, 'N_A·N_D = ' + (NA * ND).toExponential(2) + ' cm⁻⁶', { size: sz }); ly += lineH;
  smlMathText(cx + 14, ly, 'N_A·N_D / n_i² = ' + ((NA * ND) / (ni * ni)).toExponential(2), { size: sz }); ly += lineH;

  if (!compact()) {
    noStroke(); fill(90); textAlign(LEFT, TOP); textSize(10.5);
    text('The larger this ratio is above 1, the larger V_bi becomes — but only logarithmically: a 1000× bigger ratio only adds (kT/q)·ln(1000) ≈ 0.18 V.', cx + 14, ly + 6, cw - 28);
  }
}

function mousePressed() {
  for (const r of toggleBtnRects) {
    if (smlPointInRect(mouseX, mouseY, r.x, r.y, r.w, r.h)) {
      showAfterContact = r.after;
      redraw();
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  minDrawHeight = compact() ? 560 : 420;
  controlHeight = compact() ? 250 : 190;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  drawHeight = Math.max(drawHeight, minDrawHeight);
}
