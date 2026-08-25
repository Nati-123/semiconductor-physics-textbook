// Exact vs. Approximate Carrier Solution Explorer MicroSim
// Plots the percent error of the common shortcut n0~ND-NA against the
// exact n0 = [(ND-NA)+sqrt((ND-NA)^2+4ni^2)]/2, as a function of ND (log
// scale) at a fixed NA/material/temperature, with a selectable tolerance
// (1/5/10%) and a live marker/crossover readout.
// Physics note: the approximation's error is set entirely by how (ND-NA)
// compares to ni -- once net doping exceeds ni by roughly a factor of 10,
// the square-root term collapses to |ND-NA| and the error becomes
// negligible; the error is largest exactly where net doping is
// comparable to ni.
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 170;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, tempSlider, naExpSlider, ndExpSlider, toleranceSelect;

function compact() { return canvasWidth < 480; }
function concFromSlider(v) { return v < 0.3 ? 0 : Math.pow(10, v); }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  Object.keys(SML_MATERIALS).forEach(k => materialSelect.option(k));
  materialSelect.selected('Silicon');
  materialSelect.attribute('aria-label', 'Material selection');
  materialSelect.changed(function () { redraw(); });

  tempSlider = createSlider(150, 600, 300, 5);
  tempSlider.attribute('aria-label', 'Temperature in kelvin');
  tempSlider.input(function () { redraw(); });

  naExpSlider = createSlider(0, 16, 0, 0.1);
  naExpSlider.attribute('aria-label', 'Fixed acceptor concentration exponent, power of 10 per cm cubed');
  naExpSlider.input(function () { redraw(); });

  ndExpSlider = createSlider(6, 19, 15, 0.05);
  ndExpSlider.attribute('aria-label', 'Donor concentration exponent, power of 10 per cm cubed');
  ndExpSlider.input(function () { redraw(); });

  toleranceSelect = createSelect();
  toleranceSelect.option('1%');
  toleranceSelect.option('5%');
  toleranceSelect.option('10%');
  toleranceSelect.selected('5%');
  toleranceSelect.attribute('aria-label', 'Acceptable approximation error tolerance');
  toleranceSelect.changed(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Exact versus approximate carrier solution explorer: plots the percent error of the n0 approximately ND minus NA shortcut against the exact carrier concentration equation as a function of donor concentration, with a selectable error tolerance and a live crossover reading', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function toleranceFraction() {
  const v = toleranceSelect.value();
  return v === '1%' ? 0.01 : (v === '10%' ? 0.10 : 0.05);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 95 : 150;
  const sw = min(canvasWidth - lbl - 30, 300);
  materialSelect.position(bx + lbl, by + drawHeight + 12);
  tempSlider.position(bx + lbl, by + drawHeight + 50); tempSlider.size(sw);
  naExpSlider.position(bx + lbl, by + drawHeight + 88); naExpSlider.size(sw);
  ndExpSlider.position(bx + lbl, by + drawHeight + 126); ndExpSlider.size(sw);
  toleranceSelect.position(bx + lbl, by + drawHeight + 164);
}

function errorPct(ND, NA, ni) {
  const net = ND - NA;
  const exact = smlExactN0(ND, NA, ni);
  const approx = Math.max(net, 0);
  return Math.abs(approx - exact) / exact * 100;
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1); line(0, drawHeight, canvasWidth, drawHeight);

  const mat = SML_MATERIALS[materialSelect.value()];
  const T = tempSlider.value();
  const NA = concFromSlider(naExpSlider.value());
  const ni = smlNi(mat, T);
  const tol = toleranceFraction();
  const NDcur = Math.pow(10, ndExpSlider.value());
  const errCur = errorPct(NDcur, NA, ni);
  const exactCur = smlExactN0(NDcur, NA, ni);
  const approxCur = Math.max(NDcur - NA, 0);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 12.5 : 15);
  text('Approximation error: n₀ ≈ N_D−N_A  vs.  exact n₀', canvasWidth / 2, 8);
  textAlign(CENTER, TOP); textSize(11); fill(80);
  text('% error = |approx − exact| / exact,  at N_A = ' + smlFormatConc(NA) + ', ' + materialSelect.value() + ', ' + T + ' K', canvasWidth / 2, 28);

  // Compact mode needs a shorter chart to leave room below it for the
  // (4-line, wrapped-avoiding) readout text plus the chart's own x-axis
  // label without the two colliding.
  const chartX = compact() ? 55 : 70, chartY = 54, chartW = canvasWidth - chartX - 30, chartH = drawHeight - (compact() ? 240 : 150);
  const XMIN = 6, XMAX = 19, YMIN = 0, YMAX = 60;
  function xToPx(exp) { return map(exp, XMIN, XMAX, chartX, chartX + chartW); }
  function yToPx(pct) { return map(constrain(pct, YMIN, YMAX), YMIN, YMAX, chartY + chartH, chartY); }

  // shade the "acceptable" region below the tolerance line
  noStroke(); fill(220, 250, 225, 180);
  rect(chartX, yToPx(tol * 100), chartW, chartY + chartH - yToPx(tol * 100));

  const pts = [];
  for (let e = XMIN; e <= XMAX; e += 0.08) {
    const nd = Math.pow(10, e);
    pts.push({ x: e, y: errorPct(nd, NA, ni) });
  }
  smlDrawLineChart(chartX, chartY, chartW, chartH, XMIN, XMAX, YMIN, YMAX, [
    { points: pts, color: color(90, 62, 237) }
  ], {
    marker: { x: ndExpSlider.value(), y: constrain(errCur, YMIN, YMAX) },
    xLabel: 'N_D (log₁₀ cm⁻³)', yLabel: '% error', yLabelOffset: 32
  });

  // tolerance threshold line + label
  stroke(200, 90, 30); strokeWeight(1.5);
  drawingContext.setLineDash([4, 3]);
  line(chartX, yToPx(tol * 100), chartX + chartW, yToPx(tol * 100));
  drawingContext.setLineDash([]);
  noStroke(); fill(180, 80, 20); textAlign(LEFT, BOTTOM); textSize(compact() ? 10 : 11.5);
  text(toleranceSelect.value() + ' tolerance', chartX + 6, yToPx(tol * 100) - 4);

  // find crossover: smallest ND where error <= tolerance thereafter
  let crossExp = null;
  for (let e = XMIN; e <= XMAX; e += 0.02) {
    if (errorPct(Math.pow(10, e), NA, ni) <= tol * 100) { crossExp = e; break; }
  }

  drawReadoutText(NDcur, NA, ni, exactCur, approxCur, errCur, tol, crossExp);

  const rows = { mat: 12, temp: 50, na: 88, nd: 126, tol: 164 };
  fill(30); noStroke(); textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 13);
  text('Material:', 10, drawHeight + rows.mat + 11);
  text('Temperature:', 10, drawHeight + rows.temp + 11);
  text('N_A (fixed):', 10, drawHeight + rows.na + 11);
  text('N_D:', 10, drawHeight + rows.nd + 11);
  text('Tolerance:', 10, drawHeight + rows.tol + 11);
  textAlign(RIGHT, CENTER);
  text(smlFormatPow10(naExpSlider.value()), canvasWidth - 10, drawHeight + rows.na + 11);
  text(smlFormatPow10(ndExpSlider.value()), canvasWidth - 10, drawHeight + rows.nd + 11);
}

function drawReadoutText(ND, NA, ni, exact, approx, errPct, tol, crossExp) {
  // Chart bottom is at chartY+chartH = drawHeight-96, and smlDrawLineChart
  // draws its x-axis label just below that (through ~drawHeight-76) --
  // start the readout text well clear of it. Lines are kept short and
  // explicit (not one long string relying on p5's auto-wrap) so their
  // fixed line spacing never collides with itself at narrow widths.
  const y0 = drawHeight - (compact() ? 150 : 66);
  fill(20); noStroke(); textAlign(LEFT, TOP); textSize(compact() ? 10 : 12);
  const lineGap = compact() ? 15 : 18;
  const lines = compact() ? [
    'At N_D = ' + smlFormatConc(ND) + ':',
    'exact n₀ = ' + smlFormatConc(exact) + ',  approx ≈ ' + smlFormatConc(approx),
    'Error = ' + errPct.toFixed(2) + '%  ' + (errPct <= tol * 100 ? '(within tolerance)' : '(exceeds tolerance)'),
    crossExp !== null
      ? (tol * 100).toFixed(0) + '% tolerance first met at N_D ≈ ' + smlFormatConc(Math.pow(10, crossExp))
      : 'No N_D in this range meets the tolerance.'
  ] : [
    'At N_D = ' + smlFormatConc(ND) + ':  exact n₀ = ' + smlFormatConc(exact) + ',  approx n₀ ≈ N_D−N_A = ' + smlFormatConc(approx),
    'Error = ' + errPct.toFixed(2) + '%  ' + (errPct <= tol * 100 ? '(within tolerance)' : '(exceeds tolerance)'),
    crossExp !== null
      ? 'Approximation first meets ' + (tol * 100).toFixed(0) + '% tolerance at N_D ≈ ' + smlFormatConc(Math.pow(10, crossExp)) + ' (nᵢ = ' + smlFormatConc(ni) + ')'
      : 'No N_D in this range meets the selected tolerance at this N_A/T.'
  ];
  for (let i = 0; i < lines.length; i++) text(lines[i], 10, y0 + i * lineGap, canvasWidth - 20);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 200 : 170;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 620);
}
