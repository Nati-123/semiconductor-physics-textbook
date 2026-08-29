// Continuity Equation & Diffusion Length Explorer MicroSim
// Plots the steady-state solution of the minority carrier continuity
// equation for carriers injected at x=0 into a long field-free region:
//   Δp(x) = Δp(0) * exp(-x/Lp),   Lp = sqrt(Dp * τp)
// A movable position marker reads off Δp(x) and marks the diffusion
// length where the profile falls to 1/e of its peak value. An optional
// panel shows that this exponential exactly balances the steady-state
// continuity equation: D_p*d^2(Δp)/dx^2 = Δp/τp (diffusion in = recombination out).
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 210;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let dp0ExpSlider, dpSlider, tauSlider, xSlider;
let showTerms = false;
let termsBtnRect = null;

function compact() { return canvasWidth < 480; }

function rowY() {
  return { D0: 12, D: 50, T: 88, X: 126, Btn: 164 };
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  dp0ExpSlider = createSlider(13, 18, 15, 0.1);
  dp0ExpSlider.attribute('aria-label', 'Boundary excess hole concentration exponent, delta p at x=0, in per cubic centimeter');
  dpSlider = createSlider(1, 40, 12, 0.5);
  dpSlider.attribute('aria-label', 'Hole diffusion coefficient in centimeters squared per second');
  tauSlider = createSlider(0.1, 20, 5, 0.1);
  tauSlider.attribute('aria-label', 'Minority carrier lifetime in microseconds');
  xSlider = createSlider(0, 30, 6, 0.1);
  xSlider.attribute('aria-label', 'Position marker in micrometers');

  positionUIElements();
  describe('Continuity equation and diffusion length explorer: plots the steady-state exponential minority carrier profile, its diffusion length, and an optional view of the diffusion and recombination terms that balance in steady state', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 105 : 150;
  const sw = min(canvasWidth - lbl - 30, 320);
  const rows = rowY();
  dp0ExpSlider.position(bx + lbl, by + drawHeight + rows.D0); dp0ExpSlider.size(sw);
  dpSlider.position(bx + lbl, by + drawHeight + rows.D); dpSlider.size(sw);
  tauSlider.position(bx + lbl, by + drawHeight + rows.T); tauSlider.size(sw);
  xSlider.position(bx + lbl, by + drawHeight + rows.X); xSlider.size(sw);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const Dp = dpSlider.value();
  const tauUs = tauSlider.value();
  const tauS = tauUs * 1e-6;
  const LpCm = Math.sqrt(Dp * tauS);
  const LpUm = LpCm * 1e4;
  const dp0 = Math.pow(10, dp0ExpSlider.value());
  const xMarkUm = xSlider.value();

  function dpOfX(xUm) { return dp0 * Math.exp(-xUm / LpUm); }

  const dpAtMarker = dpOfX(xMarkUm);
  // Steady-state continuity-equation terms at the marker:
  //   d^2(Δp)/dx^2 = Δp(x)/Lp^2   =>   Dp * d^2(Δp)/dx^2 = Dp*Δp(x)/Lp^2 = Δp(x)/τp
  const xMarkCm = xMarkUm * 1e-4;
  const d2dx2 = dpAtMarker / (LpCm * LpCm); // cm^-5
  const diffusionTerm = Dp * d2dx2;          // cm^-3 / s
  const recombTerm = dpAtMarker / tauS;      // cm^-3 / s

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13 : 16);
  text('Steady-State Minority Carrier Profile: Δp(x) = Δp(0)e^(−x/Lp)', 10, 8, canvasWidth - 20);

  const chartX = compact() ? 58 : 78, chartY = compact() ? 40 : 44;
  const chartW = canvasWidth - chartX - 30, chartH = drawHeight - (compact() ? 90 : 100);
  const XMAX = 30;

  const pts = [];
  for (let x = 0; x <= XMAX; x += XMAX / 80) {
    pts.push({ x: x, y: dpOfX(x) });
  }

  const chartInfo = smlDrawLineChart(chartX, chartY, chartW, chartH, 0, XMAX, 0, dp0 * 1.1, [
    { points: pts, color: color(90, 62, 237) }
  ], {
    marker: { x: xMarkUm, y: dpAtMarker },
    xLabel: 'Position x (μm)', yLabel: 'Δp (cm⁻³)', yLabelOffset: compact() ? 46 : 60
  });

  // Lp reference line
  if (LpUm <= XMAX) {
    const xLp = chartInfo.xToPx(LpUm);
    stroke(230, 90, 60); strokeWeight(1);
    drawingContext.setLineDash([3, 3]);
    line(xLp, chartY, xLp, chartY + chartH);
    drawingContext.setLineDash([]);
    noStroke(); fill(230, 90, 60); textAlign(LEFT, BOTTOM); textSize(compact() ? 10 : 11);
    text('Lp = ' + LpUm.toFixed(2) + ' μm (37% point)', xLp + 4, chartY + 14);
  }

  // ---- control row labels + values (left label, right value) ----
  const rows = rowY();
  fill(30); noStroke(); textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 13);
  text('Δp(0):', 10, drawHeight + rows.D0 + 11);
  text('D_p:', 10, drawHeight + rows.D + 11);
  text('τ_p:', 10, drawHeight + rows.T + 11);
  text('Position x:', 10, drawHeight + rows.X + 11);
  textAlign(RIGHT, CENTER);
  text(smlFormatConc(dp0), canvasWidth - 10, drawHeight + rows.D0 + 11);
  text(Dp.toFixed(1) + ' cm²/s', canvasWidth - 10, drawHeight + rows.D + 11);
  text(tauUs.toFixed(1) + ' μs', canvasWidth - 10, drawHeight + rows.T + 11);
  text(xMarkUm.toFixed(1) + ' μm', canvasWidth - 10, drawHeight + rows.X + 11);

  // ---- toggle button ----
  const btnW = compact() ? canvasWidth - 20 : 260, btnH = 28;
  const btnX = compact() ? 10 : Math.round((canvasWidth - btnW) / 2), btnY = drawHeight + rows.Btn;
  smlDrawButton(btnX, btnY, btnW, btnH, showTerms ? 'Hide continuity-equation terms' : 'Show continuity-equation terms', showTerms);
  termsBtnRect = { x: btnX, y: btnY, w: btnW, h: btnH };

  // ---- results readout (below the button) ----
  const readY = drawHeight + rows.Btn + btnH + (compact() ? 14 : 12);
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 10.5 : 12.5);
  text('Diffusion length: Lp = √(Dp·τp) = ' + LpUm.toFixed(2) + ' μm     |     Δp(x) at marker = ' + smlFormatConc(dpAtMarker), 10, readY, canvasWidth - 20);

  if (showTerms) {
    const panelY = readY + (compact() ? 40 : 28);
    const panelH = compact() ? 118 : 66;
    fill(240, 245, 255); stroke(168, 200, 255); strokeWeight(1.5);
    rect(10, panelY, canvasWidth - 20, panelH, 10);
    noStroke(); fill(30); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11.5);
    const line1 = 'Diffusion term  Dp·d²(Δp)/dx²  =  ' + diffusionTerm.toExponential(2) + ' cm⁻³/s';
    const line2 = 'Recombination term  Δp/τp  =  ' + recombTerm.toExponential(2) + ' cm⁻³/s   (equal — this is why L=√(Dpτp) solves the equation)';
    const line3 = '∂(Δp)/∂t = 0 (steady state) and G = 0 (no bulk generation away from x=0 in this case)';
    text(line1, 20, panelY + 10, canvasWidth - 40);
    text(line2, 20, panelY + 10 + (compact() ? 32 : 20), canvasWidth - 40);
    text(line3, 20, panelY + 10 + (compact() ? 64 : 40), canvasWidth - 40);
  }
}

function mousePressed() {
  if (termsBtnRect && smlPointInRect(mouseX, mouseY, termsBtnRect.x, termsBtnRect.y, termsBtnRect.w, termsBtnRect.h)) {
    showTerms = !showTerms;
    updateCanvasSize();
    resizeCanvas(containerWidth, containerHeight);
    positionUIElements();
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
}

function updateCanvasSize() {
  controlHeight = showTerms ? (compact() ? 400 : 330) : (compact() ? 260 : 240);
  minDrawHeight = compact() ? 480 : 420;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
}
