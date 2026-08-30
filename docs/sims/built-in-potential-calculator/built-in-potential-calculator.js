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
let toggleBtnRect = null;

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

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13 : 16);
  text('V_bi = (kT/q)·ln(N_A·N_D / n_i²)', canvasWidth / 2, 8);

  // ---- toggle button ----
  const btnW = compact() ? canvasWidth - 20 : 300, btnH = 26;
  const btnX = compact() ? 10 : Math.round((canvasWidth - btnW) / 2), btnY = 30;
  smlDrawButton(btnX, btnY, btnW, btnH, showAfterContact ? 'Showing: After Contact (Equilibrium) — click for Before' : 'Showing: Before Contact (separate) — click for After', showAfterContact);
  toggleBtnRect = { x: btnX, y: btnY, w: btnW, h: btnH };

  const diagTop = btnY + btnH + 10;
  // On wide canvases the card sits beside the diagram (both get the
  // full drawHeight); on narrow canvases the card sits below the
  // diagram, so the diagram must leave room for it -- otherwise (the
  // original bug here) the diagram's own height formula filled the
  // entire drawHeight, leaving nothing for the card and pushing it
  // off the bottom of the canvas.
  const cardH = 150;
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
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 12 : 13);
  if (rows.stacked) {
    text('Material', 10, drawHeight + rows.material);
    text('N_A = 10' + toSup(naSlider.value().toFixed(1)) + ' cm⁻³', 10, drawHeight + rows.na);
    text('N_D = 10' + toSup(ndSlider.value().toFixed(1)) + ' cm⁻³', 10, drawHeight + rows.nd);
    text('T = ' + tSlider.value() + ' K', 10, drawHeight + rows.t);
  } else {
    text('Material', 10, drawHeight + rows.material + 9);
    text('N_A', 10, drawHeight + rows.na + 9);
    text('N_D', 10, drawHeight + rows.nd + 9);
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
  const bendPx = map(constrain(Vbi, 0, bendMaxV), 0, bendMaxV, 0, chartH * 0.5);

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
  noStroke(); fill(150, 60, 160); textAlign(LEFT, CENTER); textSize(compact() ? 10 : 11); textStyle(BOLD);
  text('E_F', x1 + 6, efPixel);
  textStyle(NORMAL);

  noStroke(); fill(90, 62, 237); textAlign(LEFT, BOTTOM); textSize(compact() ? 10 : 11);
  text('E_C', x1 + 6, ecFlatN + 4);
  fill(90, 180, 120);
  text('E_V', x1 + 6, evFlatN + 4);

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

  const bx = midX;
  stroke(230, 150, 30); strokeWeight(1.5);
  line(bx - 34, ecFlatP, bx - 34, ecFlatN);
  noStroke(); fill(230, 150, 30);
  triangle(bx - 34, ecFlatP, bx - 38, ecFlatP + 6, bx - 30, ecFlatP + 6);
  triangle(bx - 34, ecFlatN, bx - 38, ecFlatN - 6, bx - 30, ecFlatN - 6);
  fill(200, 120, 10); textAlign(LEFT, CENTER); textSize(compact() ? 10 : 11); textStyle(BOLD);
  text('qV_bi', bx - 26, (ecFlatP + ecFlatN) / 2);
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
  const bendPxMax = chartH * 0.5;
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
    noStroke(); fill(...color1); textAlign(CENTER, efY < midY ? BOTTOM : TOP); textSize(compact() ? 10 : 11); textStyle(BOLD);
    text(efLabel, (bx0 + bx1) / 2, efY + (efY < midY ? -4 : 4));
    textStyle(NORMAL);
    fill(90); textAlign(CENTER, TOP); textSize(compact() ? 9.5 : 10.5);
    text(sideLabel, (bx0 + bx1) / 2, chartY + chartH + 8);
  }

  box(pX0, pX1, [190, 40, 40], efP, 'E_Fp', 'p-side (isolated)');
  box(nX0, nX1, [40, 40, 190], efN, 'E_Fn', 'n-side (isolated)');

  noStroke(); fill(90, 62, 237); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11);
  text('E_C', pX1 - 24, ecY - 16);
  fill(90, 180, 120);
  text('E_V', pX1 - 24, evY + 4);

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
  text('qV_bi apart', 0, 0);
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
  const ch = wide ? drawHeight - cy - 10 : cardH - 10;

  noStroke(); fill(240, 245, 255);
  stroke(168, 200, 255); strokeWeight(1.5);
  rect(cx, cy, cw, ch, 10);
  noStroke(); fill(90, 62, 237); textAlign(CENTER, TOP); textSize(compact() ? 16 : 17); textStyle(BOLD);
  text('V_bi = ' + Vbi.toFixed(3) + ' V', cx + cw / 2, cy + 12);
  textStyle(NORMAL);
  fill(30); textAlign(LEFT, TOP); textSize(compact() ? 11 : 11.5);
  const lines = [
    'kT/q = ' + kT_q.toFixed(4) + ' V',
    'n_i(T) = ' + ni.toExponential(2) + ' cm⁻³',
    'N_A·N_D = ' + (NA * ND).toExponential(2) + ' cm⁻⁶',
    'N_A·N_D / n_i² = ' + ((NA * ND) / (ni * ni)).toExponential(2)
  ];
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cx + 14, cy + 44 + i * 22, cw - 28);
  }
}

function mousePressed() {
  if (toggleBtnRect && smlPointInRect(mouseX, mouseY, toggleBtnRect.x, toggleBtnRect.y, toggleBtnRect.w, toggleBtnRect.h)) {
    showAfterContact = !showAfterContact;
    redraw();
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
