// MOS Surface Regime Explorer MicroSim
// Plots the surface minority-carrier (electron) concentration
// ns(psi_s) = np0 * exp(psi_s/VT) for a p-type substrate on a log scale
// against surface potential psi_s, with color-coded regime bands
// (accumulation, depletion, weak inversion, strong inversion), each
// labeled directly, boundaries at phi_F and 2*phi_F marked explicitly,
// and axis ticks on both axes.
// Bloom Level: Apply / Analyze (L3-L4)
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

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  psiSlider = createSlider(-0.2, 0.9, 0.3, 0.005);
  psiSlider.attribute('aria-label', 'Surface potential psi_s');
  naSlider = createSlider(14, 18, 16, 0.1);
  naSlider.attribute('aria-label', 'Substrate doping concentration exponent');

  positionUIElements();
  describe('MOS surface regime explorer: plots surface electron concentration versus surface potential, with color-coded accumulation, depletion, weak inversion, and strong inversion regimes each labeled directly in the chart', LABEL);
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

function regimeOf(psiS, phiF) {
  if (psiS < 0) return { name: 'Accumulation', color: color(220, 90, 60) };
  if (psiS < phiF) return { name: 'Depletion', color: color(90, 62, 237) };
  if (psiS < 2 * phiF) return { name: 'Weak Inversion', color: color(200, 140, 30) };
  return { name: 'Strong Inversion', color: color(40, 150, 90) };
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
  const np0 = NI * NI / NA;
  const r = regimeOf(psiS, phiF);

  // Title: kept off any wrap-width text() call (see Work Function Explorer
  // and MOS Band Bending Explorer notes) -- p5 anchors a wrap box at (x,y)
  // regardless of textAlign, so a "centered" box at canvasWidth/2 actually
  // starts there and grows right, straight into the fullscreen button.
  const topSafe = 26;
  fill(20); noStroke(); textAlign(CENTER, TOP);
  let titleH;
  if (canvasWidth < 560) {
    textSize(12.5);
    text('Surface Electron Concentration', canvasWidth / 2, topSafe + 4);
    text('ns(ψs) = np0 · e^(ψs/VT)', canvasWidth / 2, topSafe + 19);
    titleH = 38;
  } else {
    textSize(15.5);
    text('Surface Electron Concentration: ns(ψs) = np0 · e^(ψs/VT)', canvasWidth / 2, topSafe + 6);
    titleH = 24;
  }
  // Current-regime badge, right under the title -- each band is also
  // labeled directly in the chart, but this is the "you are here" summary.
  const badgeY = topSafe + titleH + 6;
  const badgeW = textWidth(r.name) + 28;
  noStroke(); fill(red(r.color), green(r.color), blue(r.color), 35);
  stroke(r.color); strokeWeight(1.5);
  rect(canvasWidth / 2 - badgeW / 2, badgeY, badgeW, 22, 11);
  noStroke(); fill(r.color); textAlign(CENTER, CENTER); textSize(12.5); textStyle(BOLD);
  text(r.name, canvasWidth / 2, badgeY + 12);
  textStyle(NORMAL);
  const contentTop = badgeY + 32;

  const chartX = 85, chartY = contentTop, chartW = canvasWidth - chartX - 30, chartH = drawHeight - contentTop - 60;
  const psiMin = -0.2, psiMax = 0.9;

  drawRegimeBands(chartX, chartY, chartW, chartH, psiMin, psiMax, phiF);

  const pts = [];
  for (let p = psiMin; p <= psiMax; p += 0.01) {
    const ns = np0 * Math.exp(p / KT_Q);
    pts.push({ x: p, y: Math.log10(max(ns, 1)) });
  }
  const xTicks = [-0.2, 0, phiF, 2 * phiF, 0.9].sort((a, b) => a - b);
  const info = smlDrawLineChart(chartX, chartY, chartW, chartH, psiMin, psiMax, 0, 22,
    [{ points: pts, color: color(20) }],
    {
      marker: { x: psiS, y: Math.log10(max(np0 * Math.exp(psiS / KT_Q), 1)) },
      xLabel: 'ψs (V)', yLabel: 'log10 ns (cm-3)', yLabelOffset: 48,
      xTicks: xTicks, xTickFormat: v => v.toFixed(2),
      yTicks: [0, 5, 10, 15, 20], yTickFormat: v => v.toFixed(0)
    });

  // Boundary markers at phi_F and 2*phi_F, the two regime thresholds --
  // drawn as explicit dashed verticals + labels, not just an implicit
  // color change between bands.
  [{ v: phiF, label: 'φF' }, { v: 2 * phiF, label: '2φF' }].forEach(b => {
    const bx = info.xToPx(b.v);
    stroke(80); strokeWeight(1.3); drawingContext.setLineDash([4, 3]);
    line(bx, chartY, bx, chartY + chartH);
    drawingContext.setLineDash([]);
    noStroke(); fill(40); textAlign(CENTER, BOTTOM); textSize(10.5); textStyle(BOLD);
    text(b.label, bx, chartY - 3);
    textStyle(NORMAL);
  });

  const naY = info.yToPx(Math.log10(NA));
  stroke(90); strokeWeight(1); drawingContext.setLineDash([3, 3]);
  line(chartX, naY, chartX + chartW, naY);
  drawingContext.setLineDash([]);
  noStroke(); fill(90); textAlign(LEFT, BOTTOM); textSize(9.5);
  text('NA (bulk hole conc.) -- reached at ψs=2φF', chartX + 4, naY - 3);

  // Physical explanation of the slope: the Boltzmann exponential means
  // every ~60 mV (=2.3*VT) of surface potential multiplies ns by 10x --
  // the reason the curve is a straight line on this log-linear axis.
  noStroke(); fill(70); textSize(9.5); textAlign(LEFT, TOP);
  const decadeV = 2.302585 * KT_Q;
  text('Straight line here = exponential growth: every Δψs ≈ ' + decadeV.toFixed(3) + ' V (= 2.3·VT) multiplies ns by 10x.',
    chartX, chartY + chartH + 34, chartW);

  drawRegimeLabelsInBands(chartX, chartY, chartH, info.xToPx, psiMin, psiMax, phiF);

  fill(30); noStroke();
  textAlign(LEFT, CENTER); textSize(13);
  const rowY = drawHeight + 14;
  text('ψs:', 10, rowY + 10);
  smlMathText(10, rowY + 48, 'N_A = ' + smlFormatPow10(naSlider.value()), { size: 13 });
  smlMathText(10, rowY + 78, 'ψ_s=' + psiS.toFixed(3) + ' V   φ_F=' + phiF.toFixed(3) + ' V   n_s=' + (np0 * Math.exp(psiS / KT_Q)).toExponential(2) + ' cm-3', { size: 12 });
}

function drawRegimeBands(x, y, w, h, psiMin, psiMax, phiF) {
  function xOf(p) { return map(p, psiMin, psiMax, x, x + w); }
  noStroke();
  fill(220, 90, 60, 40);
  rect(xOf(psiMin), y, xOf(0) - xOf(psiMin), h);
  fill(90, 62, 237, 35);
  rect(xOf(0), y, xOf(phiF) - xOf(0), h);
  fill(200, 140, 30, 40);
  rect(xOf(phiF), y, xOf(2 * phiF) - xOf(phiF), h);
  fill(40, 150, 90, 35);
  rect(xOf(2 * phiF), y, xOf(psiMax) - xOf(2 * phiF), h);
}

// Labels each colored band directly, rotated vertically when the band is
// too narrow for horizontal text (common for the Weak Inversion band,
// which is only phi_F wide).
function drawRegimeLabelsInBands(x, y, h, xToPx, psiMin, psiMax, phiF) {
  const bands = [
    { lo: psiMin, hi: 0, name: 'Accumulation', col: color(180, 60, 40) },
    { lo: 0, hi: phiF, name: 'Depletion', col: color(70, 45, 190) },
    { lo: phiF, hi: 2 * phiF, name: 'Weak Inversion', col: color(160, 110, 20) },
    { lo: 2 * phiF, hi: psiMax, name: 'Strong Inversion', col: color(25, 115, 70) },
  ];
  textAlign(CENTER, CENTER); textSize(10); textStyle(BOLD);
  bands.forEach(b => {
    const lo = max(b.lo, psiMin), hi = min(b.hi, psiMax);
    if (hi <= lo) return;
    const cx = xToPx((lo + hi) / 2), bw = xToPx(hi) - xToPx(lo);
    noStroke(); fill(b.col);
    if (bw > textWidth(b.name) + 8) {
      text(b.name, cx, y + 14);
    } else {
      push();
      translate(cx, y + h / 2);
      rotate(-HALF_PI);
      text(b.name, 0, 0);
      pop();
    }
  });
  textStyle(NORMAL);
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
