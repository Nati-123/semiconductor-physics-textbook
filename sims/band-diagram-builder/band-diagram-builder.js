// Band Diagram Builder MicroSim
// Lets the user select a device type (p-n junction, Schottky junction,
// or MOS capacitor) and a bias condition, drawing the resulting band
// diagram using the same general construction procedure: flat bands in
// each neutral region, smooth bending at each junction, and a physically
// consistent Fermi level.
// Bloom Level: Apply / Create (L3, L6)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 780;
let drawHeight = 480;
let minDrawHeight = 480;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let deviceSelect, biasSlider;

// ---- Shared representative silicon parameters (kept fixed since this
// "builder" sim has one bias slider, not separate doping sliders — the
// dedicated Chapter 14/15/16 explorers already let students vary doping).
// Values chosen so every derived quantity below is internally consistent:
// Vbi computed from NA/ND/ni matches the classic ~0.75 V used previously,
// and phi_n/phi_p (EC-EF, EF-EV in each neutral bulk) are real
// non-degenerate estimates rather than arbitrary pixel offsets. ----
const KT_Q = 0.0259;
const NI = 1.5e10;      // cm^-3, Si at 300K
const NC = 2.8e19, NV = 1.04e19; // cm^-3, Si effective DOS at 300K
const NA_PN = 1e17, ND_PN = 1e16;      // p-n junction doping (asymmetric, typical)
const ND_SCHOTTKY = 1e16;              // n-type semiconductor doping (Schottky, MOS)
const PHI_M = 4.8, CHI_SEMI = 4.05;    // eV: representative metal work function, Si electron affinity

const VBI_PN = KT_Q * Math.log((NA_PN * ND_PN) / (NI * NI));      // ≈ 0.754 V
const PHI_N = KT_Q * Math.log(NC / ND_PN);                        // EC-EF, n-side bulk, ≈ 0.206 eV
const PHI_P = KT_Q * Math.log(NV / NA_PN);                        // EF-EV, p-side bulk, ≈ 0.120 eV
const BANDGAP_EV = PHI_N + VBI_PN + PHI_P;                        // internal display scale, ≈ 1.08 eV

const PHI_B_SCHOTTKY = PHI_M - CHI_SEMI;                          // Schottky-Mott barrier height, ≈ 0.75 eV (bias-independent)
const PHI_N_SCH = KT_Q * Math.log(NC / ND_SCHOTTKY);              // EC-EF in n-type bulk, ≈ 0.206 eV
const VBI_SCHOTTKY = Math.max(PHI_B_SCHOTTKY - PHI_N_SCH, 0.05);  // built-in potential seen from semiconductor side

const PHI_F_MOS = KT_Q * Math.log(ND_SCHOTTKY / NI);              // bulk potential for p-type MOS body (reuse magnitude), ≈ 0.35 eV

// Bias slider range (volts) -- used below to size the vertical px/eV scale
// so EVERY energy level, at EVERY reachable bias, is guaranteed to stay
// inside the chart box (fixes an overflow found by testing the -1V
// extreme, where the n-side E_V curve was pushed past the chart border
// and collided with the "n-type" label).
const V_MIN = -1, V_MAX = 1;
// Worst-case (eV) over the full bias range for the p-n junction: EC,p is
// bias-independent (the fixed reference); EC,n = V + PHI_N moves with V,
// so its extremes occur at V_MIN/V_MAX. EV = EC - BANDGAP_EV throughout.
const PN_MAX_EV = Math.max(PHI_N + VBI_PN, V_MAX + PHI_N);
const PN_MIN_EV = Math.min(PHI_N + VBI_PN - BANDGAP_EV, V_MIN + PHI_N - BANDGAP_EV);
const PN_SPAN_EV = PN_MAX_EV - PN_MIN_EV;
// Schottky: EC,interface = Phi_B (fixed); EC,bulk = V + PHI_N_SCH (moves).
const SCH_GAP_EV = PHI_N_SCH + VBI_SCHOTTKY + 0.3;
const SCH_MAX_EV = Math.max(PHI_B_SCHOTTKY, V_MAX + PHI_N_SCH);
const SCH_MIN_EV = Math.min(PHI_B_SCHOTTKY - SCH_GAP_EV, V_MIN + PHI_N_SCH - SCH_GAP_EV);
const SCH_SPAN_EV = SCH_MAX_EV - SCH_MIN_EV;

function compact() { return canvasWidth < 620; }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  deviceSelect = createSelect();
  deviceSelect.option('P-N Junction');
  deviceSelect.option('Schottky Junction');
  deviceSelect.option('MOS Capacitor');
  deviceSelect.selected('P-N Junction');
  deviceSelect.attribute('aria-label', 'Device type');

  biasSlider = createSlider(-1, 1, 0, 0.01);
  biasSlider.attribute('aria-label', 'Normalized bias, negative reverse/depletion, positive forward/accumulation');

  positionUIElements();
  describe('Band diagram builder: constructs an equilibrium or biased band diagram for a p-n junction, Schottky junction, or MOS capacitor, with a physically consistent Fermi level and a saturating band-bending model that never overflows the chart', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  deviceSelect.position(bx + 150, by + drawHeight + 12);
  biasSlider.position(bx + 150, by + drawHeight + 50);
  biasSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const device = deviceSelect.value();
  const bias = biasSlider.value();

  // Title is LEFT-aligned (never centered) so it can never drift into the
  // fixed top-right fullscreen-toggle button's reserved corner regardless
  // of canvas width.
  fill(20); noStroke();
  textAlign(LEFT, TOP); textSize(compact() ? 13.5 : 15.5);
  text(device + ' Band Diagram', 10, 8);

  let regimeInfo;
  if (device === 'P-N Junction') regimeInfo = drawPN(bias);
  else if (device === 'Schottky Junction') regimeInfo = drawSchottky(bias);
  else regimeInfo = drawMOS(bias);

  drawRegimeBadge(regimeInfo);
  drawResultsPanel(device, bias, regimeInfo);
  drawControls(device, bias, regimeInfo);
}

// Badge in the top area, clear of both the title (left) and the
// fullscreen button (right): centered, but starting low enough (y>=30)
// that it never enters the fullscreen button's y<26 reserved band.
function drawRegimeBadge(info) {
  const y = 30;
  textSize(12.5); textStyle(BOLD);
  const w = textWidth(info.name) + 26;
  const x = canvasWidth / 2 - w / 2;
  noFill(); stroke(info.color); strokeWeight(1.5);
  fill(red(info.color), green(info.color), blue(info.color), 30);
  rect(x, y, w, 22, 11);
  noStroke(); fill(info.color); textAlign(CENTER, CENTER);
  text(info.name, canvasWidth / 2, y + 12);
  textStyle(NORMAL);
}

// Saturating bend fraction: bendFrac(barrier=Vbi) = 0.5 always, and
// bendFrac -> 1 only as barrier -> infinity, so the curve can approach
// but never reach bendPxMax regardless of how far reverse bias goes.
// (Same technique used to fix the reverse-bias overflow bug in the
// dedicated forward-reverse-bias-band-diagram-explorer MicroSim.)
function bendFraction(barrier, vbi) {
  return barrier / (barrier + vbi);
}

function bandCurve(x0, x1, midX, curveHalfW, yLeft, yRight) {
  const ctrlHalfW = curveHalfW / 3;
  beginShape(); noFill();
  vertex(x0, yLeft);
  vertex(midX - curveHalfW, yLeft);
  bezierVertex(midX - ctrlHalfW, yLeft, midX - ctrlHalfW, yRight, midX + ctrlHalfW, yRight);
  vertex(x1, yRight);
  endShape();
}

function drawPN(bias) {
  const x0 = compact() ? 26 : 50, x1 = canvasWidth - (compact() ? 26 : 50), midX = canvasWidth / 2;
  const chartTop = 62, chartBottom = drawHeight - 60;
  const chartH = chartBottom - chartTop;
  const marginFrac = 0.06; // top/bottom safety margin, as a fraction of chartH
  const scale = (chartH * (1 - 2 * marginFrac)) / PN_SPAN_EV; // px per eV, safe at every reachable V
  const bandGapPx = BANDGAP_EV * scale;
  const V = bias; // slider IS the applied voltage in volts, no arbitrary scale factor
  const barrier = max(VBI_PN - V, 0.03);

  // Energies (eV), with E_F,p fixed at 0 as the reference and E_F,n = E_F,p
  // + V (derived below, not assumed): requiring barrier = EC,p - EC,n =
  // Vbi - V forces this relation. This is the fix for a real bug found by
  // screenshot testing: an earlier version shifted both quasi-Fermi levels
  // symmetrically by an amount unrelated to `barrier`, which produced a
  // visual gap that shrank exactly where it should have grown (forward
  // bias showed a WIDER EC-EV gap than reverse bias, backwards).
  //   EC,p = PHI_N + VBI_PN  (constant -- p-side is the fixed reference)
  //   EC,n = V + PHI_N       (moves with V, so EC,p - EC,n = VBI_PN - V ✓)
  const efP_eV = 0, efN_eV = V;
  const ecP_eV = PHI_N + VBI_PN, evP_eV = ecP_eV - BANDGAP_EV;
  const ecN_eV = V + PHI_N, evN_eV = ecN_eV - BANDGAP_EV;

  // Transition WIDTH (not height, which is now exact from the energies
  // above) still uses the saturating bendFraction so a larger barrier
  // reads as a visibly wider depletion region, never overflowing the box.
  const curveHalfW = Math.min(60, (x1 - x0) * 0.16) * (0.5 + bendFraction(barrier, VBI_PN) * 0.5);

  const regime = V > 0.01 ? { name: 'Forward Bias', color: color(40, 150, 90) }
    : (V < -0.01 ? { name: 'Reverse Bias', color: color(220, 90, 60) }
      : { name: 'Equilibrium', color: color(90, 62, 237) });

  noFill(); stroke(210); strokeWeight(1);
  rect(x0 - 10, chartTop - 6, x1 - x0 + 20, chartH + 12, 6);

  // efMidRef (the pixel representing eV=0) is placed so PN_MAX_EV lands at
  // chartTop+margin and PN_MIN_EV lands at chartBottom-margin, guaranteeing
  // every curve in the -1V..+1V range stays inside the box.
  const efMidY = chartTop + chartH * marginFrac + PN_MAX_EV * scale;
  const toPx = (eV) => efMidY - eV * scale;
  const efP = toPx(efP_eV), efN = toPx(efN_eV);
  const ecFlatP2 = toPx(ecP_eV), evFlatP2 = toPx(evP_eV);
  const ecFlatN = toPx(ecN_eV), evFlatN = toPx(evN_eV);

  stroke(regime.color); strokeWeight(2.5);
  bandCurve(x0, x1, midX, curveHalfW, ecFlatP2, ecFlatN);
  bandCurve(x0, x1, midX, curveHalfW, evFlatP2, evFlatN);

  noStroke(); fill(regime.color); textAlign(LEFT, CENTER); textSize(compact() ? 10 : 11); textStyle(BOLD);
  smlDrawSubLabel(x1 + 6, ecFlatN, 'E', 'C', { size: compact() ? 10 : 11, baseline: CENTER });
  smlDrawSubLabel(x1 + 6, evFlatN, 'E', 'V', { size: compact() ? 10 : 11, baseline: CENTER });
  textStyle(NORMAL);

  // Fermi level(s): one flat dashed line at equilibrium; two offset flat
  // dashed segments (still each flat within its own neutral region) under
  // bias, which is exactly what changes physically when V is applied.
  stroke(90); strokeWeight(1.4); drawingContext.setLineDash([2, 3]);
  line(x0, efP, midX - curveHalfW, efP);
  line(midX + curveHalfW, efN, x1, efN);
  if (Math.abs(V) > 0.01) line(midX - curveHalfW, efP, midX + curveHalfW, efN);
  drawingContext.setLineDash([]);
  noStroke(); fill(90); textAlign(LEFT, CENTER); textStyle(BOLD);
  smlDrawSubLabel(x1 + 6, efN, 'E', 'F', { size: compact() ? 10 : 11, baseline: CENTER });
  textStyle(NORMAL);

  // Junction/interface marker and depletion-region shading (width shrinks
  // toward the equilibrium curveHalfW under forward bias, widens under
  // reverse bias — same bendFrac driving the curve also drives this, so
  // the two visual cues always agree).
  const depHalfW = curveHalfW * (0.5 + bendFraction(barrier, VBI_PN));
  noStroke(); fill(230, 225, 250, 130);
  rect(midX - depHalfW, chartTop, depHalfW * 2, chartH);
  stroke(150, 140, 200); strokeWeight(1); drawingContext.setLineDash([3, 3]);
  line(midX, chartTop - 4, midX, chartBottom + 4);
  drawingContext.setLineDash([]);
  // Single combined label drawn INSIDE the top of the chart (not above it,
  // which collided with the regime badge; not below it, which collided
  // with the results panel at narrow widths).
  noStroke(); fill(110, 100, 160); textAlign(CENTER, TOP); textSize(9);
  text('depletion region (junction)', midX, chartTop + 6);

  // Built-in-potential / barrier annotation with an arrow, spelled out
  // per-regime so the sign of the change under bias is explicit.
  const barX = midX - depHalfW - 22;
  stroke(230, 150, 30); strokeWeight(1.5);
  line(barX, ecFlatP2, barX, ecFlatN);
  noStroke(); fill(230, 150, 30);
  triangle(barX, ecFlatP2, barX - 4, ecFlatP2 + 6, barX + 4, ecFlatP2 + 6);
  triangle(barX, ecFlatN, barX - 4, ecFlatN - 6, barX + 4, ecFlatN - 6);
  fill(200, 120, 10); textStyle(BOLD);
  const barrierLabel = V > 0.01 ? 'q(V_bi−V)' : (V < -0.01 ? 'q(V_bi+|V|)' : 'qV_bi');
  smlMathText(x0 + 4, chartTop + 4, barrierLabel + ' = ' + barrier.toFixed(3) + ' eV', { size: compact() ? 9.5 : 10.5 });
  textStyle(NORMAL);

  fill(190, 40, 40); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11); textStyle(BOLD);
  text('p-type', x0, chartBottom + 6);
  fill(40, 40, 190); textAlign(RIGHT, TOP);
  text('n-type', x1, chartBottom + 6);
  textStyle(NORMAL);

  return { name: regime.name, color: regime.color, vbi: VBI_PN, barrier: barrier, extra: 'V = ' + V.toFixed(2) + ' V' };
}

function drawSchottky(bias) {
  const x0 = compact() ? 26 : 50, x1 = canvasWidth - (compact() ? 26 : 50);
  const midX = canvasWidth * 0.4;
  const chartTop = 62, chartBottom = drawHeight - 60;
  const chartH = chartBottom - chartTop;
  const marginFrac = 0.06;
  const scale = (chartH * (1 - 2 * marginFrac)) / SCH_SPAN_EV; // px per eV, safe at every reachable V
  const bandGapPx = SCH_GAP_EV * scale;
  const V = bias;
  // Barrier as seen from the semiconductor (depletion) side changes with
  // bias, exactly like the p-n junction; the barrier as seen from the
  // METAL side (Phi_B) is a materials property and stays fixed — this is
  // the key physical distinction from a p-n junction, called out below.
  const barrier = max(VBI_SCHOTTKY - V, 0.03);
  const curveHalfW = Math.min(50, (x1 - midX) * 0.35) * (0.5 + bendFraction(barrier, VBI_SCHOTTKY) * 0.5);

  const regime = V > 0.01 ? { name: 'Forward Bias', color: color(40, 150, 90) }
    : (V < -0.01 ? { name: 'Reverse Bias', color: color(220, 90, 60) }
      : { name: 'Equilibrium', color: color(90, 62, 237) });

  noFill(); stroke(210); strokeWeight(1);
  rect(x0 - 10, chartTop - 6, x1 - x0 + 20, chartH + 12, 6);

  // Metal region: flat EF (metal has a continuum of states right up to
  // EF, no gap to draw) — shaded to read as a distinct conductor.
  noStroke(); fill(225, 225, 232);
  rect(x0, chartTop, midX - x0, chartH);

  // Energies (eV): EF,metal fixed at 0 (the metal is the physical
  // reference here, since Phi_B is a materials property pinned to it).
  // EC at the interface = EF,metal + Phi_B, so it is CONSTANT regardless
  // of bias -- exactly the point being taught. The semiconductor BULK
  // instead moves with bias: EF,bulk = EF,metal + V (derived the same way
  // as the p-n junction fix, so that EC,interface - EC,bulk = Vbi - V).
  const efMetal_eV = 0, ecInterface_eV = PHI_B_SCHOTTKY;
  const efBulk_eV = V, ecBulk_eV = V + PHI_N_SCH, evBulk_eV = ecBulk_eV - SCH_GAP_EV;
  const evInterface_eV = ecInterface_eV - SCH_GAP_EV;

  // efMidRef placed so SCH_MAX_EV lands at chartTop+margin and SCH_MIN_EV
  // lands at chartBottom-margin, guaranteeing every curve in the -1V..+1V
  // range stays inside the box (same technique as the p-n junction fix).
  const efMidRef = chartTop + chartH * marginFrac + SCH_MAX_EV * scale;
  const toPx = (eV) => efMidRef - eV * scale;
  const efMetalY = toPx(efMetal_eV);
  const ecNear = toPx(ecInterface_eV), evNear = toPx(evInterface_eV);
  const efBulk = toPx(efBulk_eV), ecBulk = toPx(ecBulk_eV), evBulk = toPx(evBulk_eV);

  stroke(90, 62, 237); strokeWeight(2.5);
  line(x0, efMetalY, midX, efMetalY);

  stroke(regime.color); strokeWeight(2.2);
  bandCurve(midX, x1, midX + (x1 - midX) * 0.32, curveHalfW, ecNear, ecBulk);
  bandCurve(midX, x1, midX + (x1 - midX) * 0.32, curveHalfW, evNear, evBulk);

  noStroke(); fill(regime.color); textAlign(LEFT, CENTER); textStyle(BOLD);
  smlDrawSubLabel(x1 + 6, ecBulk, 'E', 'C', { size: compact() ? 10 : 11, baseline: CENTER });
  smlDrawSubLabel(x1 + 6, evBulk, 'E', 'V', { size: compact() ? 10 : 11, baseline: CENTER });
  textStyle(NORMAL);

  stroke(90); strokeWeight(1.4); drawingContext.setLineDash([2, 3]);
  line(midX + (x1 - midX) * 0.32, efBulk, x1, efBulk);
  drawingContext.setLineDash([]);
  noStroke(); fill(90); textAlign(LEFT, CENTER); textStyle(BOLD);
  smlDrawSubLabel(x1 + 6, efBulk, 'E', 'F', { size: compact() ? 10 : 11, baseline: CENTER });
  textStyle(NORMAL);

  // Phi_B: fixed metal-side barrier, drawn from EF_metal up to EC at the
  // interface — this segment's HEIGHT never changes with bias, which is
  // the point being taught.
  stroke(230, 150, 30); strokeWeight(1.5);
  line(midX - 16, efMetalY, midX - 16, ecNear);
  noStroke(); fill(230, 150, 30);
  triangle(midX - 16, efMetalY, midX - 20, efMetalY - 6, midX - 12, efMetalY - 6);
  triangle(midX - 16, ecNear, midX - 20, ecNear + 6, midX - 12, ecNear + 6);
  fill(200, 120, 10); textStyle(BOLD); textAlign(LEFT, BOTTOM);
  smlMathText(x0 + 4, chartTop + 14, 'Φ_B = ' + PHI_B_SCHOTTKY.toFixed(2) + ' eV (fixed, bias-independent)', { size: compact() ? 9 : 10 });
  textStyle(NORMAL);

  noStroke(); fill(90, 62, 237); textAlign(LEFT, TOP);
  smlMathText(x0 + 4, chartTop + 30, 'Barrier (semiconductor side) = ' + barrier.toFixed(3) + ' eV', { size: compact() ? 9 : 10 });

  stroke(150); strokeWeight(1); drawingContext.setLineDash([3, 3]);
  line(midX, chartTop - 4, midX, chartBottom + 4);
  drawingContext.setLineDash([]);
  // Drawn INSIDE the top of the chart (not above it, which collided with
  // the regime badge) — same fix applied to the P-N junction's label.
  noStroke(); fill(90); textAlign(CENTER, TOP); textSize(9);
  text('metal-semiconductor interface', midX, chartTop + 6);

  fill(60); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11); textStyle(BOLD);
  text('metal', x0, chartBottom + 6);
  fill(40, 40, 190); textAlign(RIGHT, TOP);
  text('n-type semiconductor', x1, chartBottom + 6);
  textStyle(NORMAL);

  return { name: regime.name, color: regime.color, vbi: VBI_SCHOTTKY, barrier: barrier, extra: 'V = ' + V.toFixed(2) + ' V,  Φ_B = ' + PHI_B_SCHOTTKY.toFixed(2) + ' eV' };
}

function drawMOS(bias) {
  const x0 = compact() ? 26 : 50, xOxL = canvasWidth * (compact() ? 0.34 : 0.38), xOxR = xOxL + (compact() ? 26 : 34), x1 = canvasWidth - (compact() ? 26 : 50);
  const chartTop = 62, chartBottom = drawHeight - 60;
  const chartH = chartBottom - chartTop;
  const midY = chartTop + chartH * 0.5;
  const bandGapPx = chartH * 0.28;

  const psiS = bias >= 0 ? bias * 0.9 : bias * 0.6; // maps [-1,1] -> [-0.6, +0.9] V, matching the dedicated MOS explorer's range

  let regime, regimeColor;
  if (psiS < -0.02) { regime = 'Accumulation'; regimeColor = color(220, 90, 60); }
  else if (psiS < 0.02) { regime = 'Flat-Band'; regimeColor = color(120); }
  else if (psiS < PHI_F_MOS) { regime = 'Depletion'; regimeColor = color(90, 62, 237); }
  else if (psiS < 2 * PHI_F_MOS) { regime = 'Weak Inversion'; regimeColor = color(200, 140, 30); }
  else { regime = 'Strong Inversion'; regimeColor = color(40, 150, 90); }

  noFill(); stroke(210); strokeWeight(1);
  rect(x0 - 10, chartTop - 6, x1 - x0 + 20, chartH + 12, 6);

  noStroke(); fill(225, 225, 232);
  rect(x0, chartTop, xOxL - x0, chartH);
  stroke(200); strokeWeight(1);
  for (let hx = x0 + 6; hx < xOxL - 2; hx += 10) line(hx, chartTop + 2, hx, chartBottom - 2);

  noStroke(); fill(235, 235, 245);
  rect(xOxL, chartTop, xOxR - xOxL, chartH);

  const efGateY = midY;
  stroke(90, 62, 237); strokeWeight(2.5);
  line(x0, efGateY, xOxL, efGateY);

  const bendPxMax = chartH * 0.4;
  const bendPx = constrain(psiS / 0.9, -1, 1) * bendPxMax;
  const ecBulkY = midY - bandGapPx / 2, evBulkY = ecBulkY + bandGapPx;
  const ecSurfY = ecBulkY - bendPx, evSurfY = evBulkY - bendPx;
  const curveHalfW = Math.min(40, (x1 - xOxR) * 0.3);

  stroke(regimeColor); strokeWeight(2.2);
  bandCurve(xOxR, x1, xOxR + curveHalfW * 1.6, curveHalfW, ecSurfY, ecBulkY);
  bandCurve(xOxR, x1, xOxR + curveHalfW * 1.6, curveHalfW, evSurfY, evBulkY);

  noStroke(); fill(regimeColor); textAlign(LEFT, CENTER); textStyle(BOLD);
  smlDrawSubLabel(x1 + 6, ecBulkY, 'E', 'C', { size: compact() ? 10 : 11, baseline: CENTER });
  smlDrawSubLabel(x1 + 6, evBulkY, 'E', 'V', { size: compact() ? 10 : 11, baseline: CENTER });
  textStyle(NORMAL);

  // E_F in the semiconductor bulk sits phi_F below midgap for a p-type
  // body (non-degenerate) — flat, the equilibrium reference the bands
  // bend around, unaffected by the gate bias itself (only band bending
  // near the surface changes with V_G).
  const pxPerEV = bandGapPx / 1.12;
  const efSemY = midY + PHI_F_MOS * pxPerEV;
  stroke(90); strokeWeight(1.4); drawingContext.setLineDash([2, 3]);
  line(xOxR, efSemY, x1, efSemY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90); textAlign(LEFT, CENTER); textStyle(BOLD);
  smlDrawSubLabel(x1 + 6, efSemY, 'E', 'F', { size: compact() ? 10 : 11, baseline: CENTER });
  textStyle(NORMAL);

  fill(60); textAlign(LEFT, TOP); textSize(compact() ? 9.5 : 10.5);
  text('gate', x0, chartBottom + 6);
  textAlign(CENTER, TOP); fill(90);
  text('oxide', (xOxL + xOxR) / 2, chartBottom + 6);
  fill(40, 40, 190); textAlign(RIGHT, TOP);
  text('p-type semiconductor', x1, chartBottom + 6);

  drawSurfaceCharge(regime, xOxR, midY, chartH);

  return { name: regime, color: regimeColor, vbi: null, barrier: null, extra: 'ψ_s = ' + psiS.toFixed(3) + ' V,  φ_F = ' + PHI_F_MOS.toFixed(3) + ' V' };
}

function drawSurfaceCharge(regime, xOxR, midY, chartH) {
  const laneX = xOxR + 8;
  noStroke(); textSize(11); textAlign(CENTER, CENTER);
  if (regime === 'Accumulation') {
    fill(220, 90, 60);
    for (let i = 0; i < 5; i++) text('+', laneX, midY - chartH * 0.28 + i * (chartH * 0.56 / 4));
  } else if (regime === 'Depletion') {
    fill(90, 62, 237);
    for (let i = 0; i < 4; i++) text('−', laneX, midY - chartH * 0.24 + i * (chartH * 0.48 / 3));
  } else if (regime === 'Weak Inversion' || regime === 'Strong Inversion') {
    const n = regime === 'Strong Inversion' ? 6 : 3;
    fill(40, 150, 90);
    for (let i = 0; i < n; i++) text('−', laneX, midY - chartH * 0.28 + i * (chartH * 0.56 / max(n - 1, 1)));
  }
}

function drawResultsPanel(device, bias, info) {
  const y = drawHeight - 34;
  stroke(220); strokeWeight(1);
  line(10, y - 8, canvasWidth - 10, y - 8);
  noStroke(); fill(30); textAlign(LEFT, TOP); textSize(compact() ? 10.5 : 11.5);
  let line1;
  if (device === 'MOS Capacitor') {
    line1 = 'Regime: ' + info.name + '     ' + info.extra;
  } else {
    line1 = 'Regime: ' + info.name + '     V_bi = ' + info.vbi.toFixed(3) + ' V     Barrier = ' + info.barrier.toFixed(3) + ' eV';
  }
  text(line1, 10, y, canvasWidth - 20);
}

function drawControls(device, bias, info) {
  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12.5);
  text('Device type:', 10, drawHeight + 18);
  const label = device === 'MOS Capacitor'
    ? (bias < -0.05 ? 'accumulation' : (bias < 0.05 ? 'flat-band' : 'depletion/inversion'))
    : (bias > 0.05 ? 'forward bias' : (bias < -0.05 ? 'reverse bias' : 'equilibrium'));
  text('Bias:  ' + bias.toFixed(2) + '  (' + label + ')', 10, drawHeight + 56);
  fill(90); textSize(10.5);
  text(device === 'MOS Capacitor'
    ? 'Negative = accumulation, zero = flat-band, positive = depletion → inversion'
    : 'Negative = reverse bias, zero = equilibrium, positive = forward bias', 10, drawHeight + 78, canvasWidth - 20);
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
