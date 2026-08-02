// Intrinsic vs. Extrinsic Semiconductor Comparison MicroSim
// Compares a pure silicon lattice (rare thermally-broken bonds only) to a
// lattice with one substitutional donor atom (a free carrier present
// without any thermal excitation), alongside a log-scale bar chart of
// realistic room-temperature carrier concentrations.
// Bloom Level: Understand / Analyze (L2-L4)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 440;
let controlHeight = 100;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 40;
let typeSelect;
const COLS = 4, ROWS = 3;
const DOPANT_I = 2, DOPANT_J = 1; // position of donor atom in extrinsic view

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  typeSelect = createSelect();
  typeSelect.option('Intrinsic (Pure)');
  typeSelect.option('Extrinsic (Doped)');
  typeSelect.selected('Intrinsic (Pure)');
  typeSelect.attribute('aria-label', 'Semiconductor type');

  positionUIElements();
  describe('Intrinsic versus extrinsic semiconductor comparison: a pure silicon lattice compared to a lattice with one donor atom, alongside a log-scale carrier concentration bar chart', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  typeSelect.position(bx + 130, by + drawHeight + 12);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const isExtrinsic = typeSelect.value().indexOf('Extrinsic') >= 0;
  const latticeW = canvasWidth * 0.52;
  const spacing = min((latticeW - 40) / (COLS - 1), 80);
  const x0 = 30 + (latticeW - spacing * (COLS - 1)) / 2 - 10;
  const y0 = 60;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(15);
  text(isExtrinsic ? 'Extrinsic: Si Doped with One Donor Atom' : 'Intrinsic: Pure Silicon Lattice', latticeW / 2 + 20, 8);

  const brokenSet = new Set();
  if (!isExtrinsic) brokenSet.add('1,0-2,0'); // one baseline thermally-broken bond for realism

  smlDrawLatticeGrid(x0, y0, COLS, ROWS, spacing, {
    atomR: 15, bondColor: color(110), electronColor: color(40, 40, 220),
    labelFor: function (i, j) {
      if (isExtrinsic && i === DOPANT_I && j === DOPANT_J) return 'P';
      return 'Si';
    },
    colorFor: function (i, j) {
      if (isExtrinsic && i === DOPANT_I && j === DOPANT_J) return color(230, 140, 60);
      return color(90, 140, 220);
    },
    brokenBondSet: brokenSet
  });

  if (!isExtrinsic) {
    const p1x = x0 + 1 * spacing, p1y = y0 + 0 * spacing;
    const p2x = x0 + 2 * spacing, p2y = y0 + 0 * spacing;
    smlDrawHole((p1x + p2x) / 2 - 14, (p1y + p2y) / 2, 9);
    smlDrawElectron((p1x + p2x) / 2 + 22, (p1y + p2y) / 2 - 18, 9);
  } else {
    const dx = x0 + DOPANT_I * spacing, dy = y0 + DOPANT_J * spacing;
    smlDrawElectron(dx + spacing * 0.55, dy - spacing * 0.4, 10);
    stroke(230, 140, 60); strokeWeight(1); noFill();
    drawingContext.setLineDash([2, 3]);
    line(dx, dy, dx + spacing * 0.5, dy - spacing * 0.38);
    drawingContext.setLineDash([]);
  }

  drawCarrierChart(isExtrinsic, latticeW);

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Semiconductor type:', 10, drawHeight + 16);
}

function drawCarrierChart(isExtrinsic, latticeW) {
  const chartX = latticeW + 50;
  const chartW = canvasWidth - chartX - 30;
  const chartY = 70;
  const chartH = drawHeight - 140;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(13);
  text('Room-Temperature Carrier Concentration (log scale)', chartX + chartW / 2, chartY - 30);

  // log-scale bars: intrinsic ~1e10, extrinsic ~1e16 (cm^-3), axis 1e8..1e18
  const logMin = 8, logMax = 18;
  function valToH(logv) { return map(constrain(logv, logMin, logMax), logMin, logMax, 0, chartH); }

  stroke(200); strokeWeight(1); noFill();
  line(chartX, chartY + chartH, chartX + chartW, chartY + chartH);

  const barW = chartW * 0.28;
  const iX = chartX + chartW * 0.22 - barW / 2;
  const eX = chartX + chartW * 0.72 - barW / 2;

  const iH = valToH(10), eH = valToH(16);
  noStroke();
  fill(isExtrinsic ? color(200) : color(90, 62, 237));
  rect(iX, chartY + chartH - iH, barW, iH, 3);
  fill(isExtrinsic ? color(230, 140, 60) : color(200));
  rect(eX, chartY + chartH - eH, barW, eH, 3);

  fill(30); textAlign(CENTER, BOTTOM); textSize(11);
  text('n_i ≈ 10¹⁰ cm⁻³', iX + barW / 2, chartY + chartH - iH - 4);
  text('N_D ≈ 10¹⁶ cm⁻³', eX + barW / 2, chartY + chartH - eH - 4);
  textAlign(CENTER, TOP);
  text('Intrinsic', iX + barW / 2, chartY + chartH + 4);
  text('Extrinsic', eX + barW / 2, chartY + chartH + 4);

  smlDrawInfoBox(canvasWidth, drawHeight - 58, [
    'Doping typically adds ~10⁵–⁸× more carriers than',
    'thermal generation alone provides in pure silicon.',
    'Exact n_i(T) formula derived in Chapter 9.'
  ]);
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
