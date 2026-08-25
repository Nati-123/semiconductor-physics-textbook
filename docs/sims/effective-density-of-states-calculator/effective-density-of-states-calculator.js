// Effective Density of States Explorer MicroSim
// Computes N_C, N_V, E_g(T) (Varshni), and n_i(T) for Si, Ge, or GaAs from
// the shared semiconductor-materials-lib physics helpers, and plots one of
// three views: n_i(T) for the selected material, N_C(T) & N_V(T) together
// (both scaling as T^1.5), or a three-material n_i(T) comparison overlay.
// Physics note: N_C is not a literal state count -- it is a single
// constant that collapses the entire conduction-band density-of-states
// integral into one number, as if every conduction-band state were
// collapsed onto E_C with an effective "degeneracy" of N_C.
// Performance note: redraw is event-driven (noLoop + redraw-on-input).
// Bloom Level: Apply / Analyze (L3-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 460;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, tempSlider, viewSelect;
const VIEWS = ['nᵢ(T) — single material', 'N_C(T) & N_V(T) — power law', 'Compare nᵢ(T) — Si vs Ge vs GaAs'];

function compact() { return canvasWidth < 480; }

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

  viewSelect = createSelect();
  VIEWS.forEach(v => viewSelect.option(v));
  viewSelect.selected(VIEWS[0]);
  viewSelect.attribute('aria-label', 'Chart view mode');
  viewSelect.changed(function () { redraw(); });

  positionUIElements();
  noLoop();
  describe('Effective density of states explorer: computes N_C, N_V, band gap, and intrinsic carrier concentration for silicon, germanium, or GaAs at an adjustable temperature, with views for a single material\'s n_i vs temperature, N_C and N_V vs temperature together, and a three-material n_i comparison', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const lbl = compact() ? 68 : 100;
  const sw = min(canvasWidth - lbl - 30, 300);
  materialSelect.position(bx + lbl, by + drawHeight + 12);
  tempSlider.position(bx + lbl, by + drawHeight + 50); tempSlider.size(sw);
  viewSelect.position(bx + lbl, by + drawHeight + 88);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1); line(0, drawHeight, canvasWidth, drawHeight);

  const mat = SML_MATERIALS[materialSelect.value()];
  const T = tempSlider.value();
  const Nc = smlEffDOS(mat.me, T), Nv = smlEffDOS(mat.mh, T), Eg = smlEgVarshni(mat, T), ni = smlNi(mat, T);
  const view = viewSelect.value();

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13 : 16);
  text(materialSelect.value() + ': Effective Density of States and Intrinsic Carrier Concentration', canvasWidth / 2, 8);

  // Card height is content-driven (6 text lines + info box + padding),
  // not stretched to fill the drawing area -- a tall, mostly-empty card
  // reads as unfinished.
  const cardW = compact() ? canvasWidth - 40 : canvasWidth * 0.42;
  const cardH = compact() ? 238 : 250;
  const cardX = compact() ? 20 : 30;
  const cardY = compact() ? 32 : 44;
  drawCard(mat, T, Nc, Nv, Eg, ni, cardX, cardY, cardW, cardH);

  const chartX = compact() ? 20 : canvasWidth * 0.50;
  const chartY = compact() ? cardY + cardH + 14 : 50;
  const chartW = compact() ? canvasWidth - 40 : canvasWidth - chartX - 30;
  const chartH = compact() ? drawHeight - chartY - 10 : drawHeight - 100;

  if (view === VIEWS[0]) drawNiCurve(mat, T, ni, chartX, chartY, chartW, chartH);
  else if (view === VIEWS[1]) drawNcNvCurve(mat, T, Nc, Nv, chartX, chartY, chartW, chartH);
  else drawCompareCurve(mat, T, chartX, chartY, chartW, chartH);

  fill(30); noStroke();
  textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 13);
  text('Material:', 10, drawHeight + 12 + 11);
  text('Temperature:', 10, drawHeight + 50 + 11);
  text('View:', 10, drawHeight + 88 + 11);
}

function drawCard(mat, T, Nc, Nv, Eg, ni, cardX, cardY, cardW, cardH) {
  noStroke();
  fill(240, 245, 255);
  stroke(168, 200, 255);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, cardH, 10);
  noStroke();
  fill(30);
  textAlign(LEFT, TOP);
  textSize(compact() ? 11.5 : 12.5);
  const lines = [
    'm_e*/m0 = ' + mat.me + ',  m_h*/m0 = ' + mat.mh,
    'E_g(' + T + ' K) = ' + Eg.toFixed(3) + ' eV  (Varshni)',
    'N_C = 2(2π m_e* k_BT/h²)^1.5 = ' + smlFormatConc(Nc),
    'N_V = 2(2π m_h* k_BT/h²)^1.5 = ' + smlFormatConc(Nv),
    'n_i = √(N_C·N_V)·e^(−Eg/2k_BT)',
    'n_i = ' + smlFormatConc(ni)
  ];
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cardX + 16, cardY + 14 + i * (compact() ? 22 : 24), cardW - 32);
  }
  const boxY = cardY + 14 + lines.length * (compact() ? 22 : 24) + 6;
  if (boxY < cardY + cardH - 30) {
    // smlDrawInfoBox centers within [0, "canvasWidth"], so pass
    // 2*cardX+cardW (not just cardX+cardW) to center within this card.
    smlDrawInfoBox(cardX * 2 + cardW, boxY, [
      'N_C is not a literal count of states --',
      'it collapses the whole conduction-band',
      'density-of-states integral into one',
      'number, "as if" all states sat at E_C.'
    ], { maxWidth: cardW - 20, margin: 0 });
  }
}

function drawNiCurve(mat, T, ni, chartX, chartY, chartW, chartH) {
  const pts = [];
  for (let t = 150; t <= 600; t += 10) pts.push({ x: t, y: Math.log10(smlNi(mat, t)) });
  smlDrawLineChart(chartX, chartY, chartW, chartH, 150, 600, 5, 17, [{ points: pts, color: color(...mat.color) }], {
    marker: { x: T, y: Math.log10(ni) },
    xLabel: 'Temperature (K)', yLabel: 'log₁₀ nᵢ (cm⁻³)', yLabelOffset: 34
  });
  fill(30); noStroke();
  textAlign(CENTER, TOP); textSize(11);
  text('nᵢ(T) grows by orders of magnitude over this range', chartX + chartW / 2, chartY - 12);
}

function drawNcNvCurve(mat, T, Nc, Nv, chartX, chartY, chartW, chartH) {
  const ptsC = [], ptsV = [];
  for (let t = 150; t <= 600; t += 10) {
    ptsC.push({ x: t, y: smlEffDOS(mat.me, t) / 1e19 });
    ptsV.push({ x: t, y: smlEffDOS(mat.mh, t) / 1e19 });
  }
  const yMax = Math.max(...ptsC.map(p => p.y), ...ptsV.map(p => p.y)) * 1.15;
  smlDrawLineChart(chartX, chartY, chartW, chartH, 150, 600, 0, yMax, [
    { points: ptsC, color: color(90, 62, 237) },
    { points: ptsV, color: color(220, 150, 30) }
  ], {
    marker: { x: T, y: Nc / 1e19 },
    xLabel: 'Temperature (K)', yLabel: 'N (×10¹⁹ cm⁻³)', yLabelOffset: 40
  });
  const legX = chartX + 10, legY = chartY + 8;
  noStroke(); fill(255, 255, 255, 220); rect(legX - 6, legY - 6, 100, 44, 6);
  stroke(90, 62, 237); strokeWeight(2.5); line(legX, legY + 4, legX + 16, legY + 4);
  noStroke(); fill(30); textAlign(LEFT, CENTER); textSize(10.5);
  text('N_C(T)', legX + 22, legY + 4);
  stroke(220, 150, 30); strokeWeight(2.5); line(legX, legY + 24, legX + 16, legY + 24);
  noStroke(); fill(30);
  text('N_V(T)', legX + 22, legY + 24);
  fill(30); textAlign(CENTER, TOP); textSize(11);
  text('Both scale as T^1.5 -- a modest power law, unlike nᵢ\'s exponential growth', chartX + chartW / 2, chartY - 12);
}

function drawCompareCurve(mat, T, chartX, chartY, chartW, chartH) {
  const names = Object.keys(SML_MATERIALS);
  const series = names.map(name => {
    const m = SML_MATERIALS[name];
    const pts = [];
    for (let t = 150; t <= 600; t += 10) pts.push({ x: t, y: Math.log10(smlNi(m, t)) });
    return { points: pts, color: color(...m.color), name: name };
  });
  smlDrawLineChart(chartX, chartY, chartW, chartH, 150, 600, -2, 17, series, {
    marker: { x: T, y: Math.log10(smlNi(mat, T)) },
    xLabel: 'Temperature (K)', yLabel: 'log₁₀ nᵢ (cm⁻³)', yLabelOffset: 34
  });
  const legX = chartX + 10, legY = chartY + 8;
  noStroke(); fill(255, 255, 255, 220); rect(legX - 6, legY - 6, 96, 62, 6);
  series.forEach((s, i) => {
    stroke(s.color); strokeWeight(2.5); line(legX, legY + 4 + i * 20, legX + 16, legY + 4 + i * 20);
    noStroke(); fill(30); textAlign(LEFT, CENTER); textSize(10.5);
    text(names[i], legX + 22, legY + 4 + i * 20);
  });
  fill(30); noStroke(); textAlign(CENTER, TOP); textSize(11);
  text('Wider band gap → smaller nᵢ at every temperature (note the log scale)', chartX + chartW / 2, chartY - 12);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = 130;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 520);
}
