// Recombination Mechanism Comparison Explorer MicroSim
// Compares SRH (trap-assisted), Auger, and direct (band-to-band)
// recombination rates as a function of excess carrier concentration
// and material (direct-gap vs indirect-gap), on a log-scaled bar chart.
//   R_SRH    = Δn / τ_SRH
//   R_Auger  = C_Auger * Δn^3
//   R_direct = B * Δn * (n0 + p0 + Δn)
// Bloom Level: Analyze / Evaluate (L4-L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let materialSelect, dnExpSlider, dopingExpSlider;

const MATERIALS = {
  'Silicon (indirect gap)': { B: 1.0e-14, tauSRH: 1e-6, cAuger: 2.8e-31, n0: 1e10, isIndirect: true },
  'GaAs (direct gap)': { B: 1.0e-10, tauSRH: 5e-8, cAuger: 7e-30, n0: 2.1e6, isIndirect: false }
};

function computeRates(mat, dn, Ndoping) {
  const p0 = Ndoping;
  const n0eff = (mat.n0 * mat.n0) / Ndoping;
  const RSRH = dn / mat.tauSRH;
  const RAuger = mat.cAuger * dn * dn * dn;
  const Rdirect = mat.B * dn * (n0eff + p0 + dn);
  return { RSRH: RSRH, RAuger: RAuger, Rdirect: Rdirect };
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  materialSelect = createSelect();
  Object.keys(MATERIALS).forEach(k => materialSelect.option(k));
  materialSelect.selected('Silicon (indirect gap)');
  materialSelect.attribute('aria-label', 'Material');

  dnExpSlider = createSlider(12, 19, 15, 0.1);
  dnExpSlider.attribute('aria-label', 'Excess carrier concentration exponent');
  dopingExpSlider = createSlider(14, 18, 16, 0.1);
  dopingExpSlider.attribute('aria-label', 'Doping concentration exponent');

  positionUIElements();
  describe('Recombination mechanism comparison explorer: compares SRH, Auger, and direct recombination rates on a log-scaled bar chart as excess carrier concentration and material change', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  materialSelect.position(bx + 90, by + drawHeight + 12);
  dnExpSlider.position(bx + 230, by + drawHeight + 52);
  dnExpSlider.size(min(canvasWidth - 250 - 30, 320));
  dopingExpSlider.position(bx + 230, by + drawHeight + 88);
  dopingExpSlider.size(min(canvasWidth - 250 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const mat = MATERIALS[materialSelect.value()];
  const dn = Math.pow(10, dnExpSlider.value());
  const Ndoping = Math.pow(10, dopingExpSlider.value());
  const rates = computeRates(mat, dn, Ndoping);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Recombination Rate by Mechanism (log scale)', canvasWidth / 2, 8);

  const chartX = 60, chartY = 40, chartW = canvasWidth - chartX - 40, chartH = drawHeight - 130;
  const FLOOR = 0, CEIL = 32;
  function logBar(R) { return constrain(Math.log10(Math.max(R, 1)), FLOOR, CEIL); }

  const series = [
    { label: 'SRH (trap-assisted)', value: logBar(rates.RSRH), color: color(90, 62, 237), raw: rates.RSRH },
    { label: 'Auger', value: logBar(rates.RAuger), color: color(230, 90, 60), raw: rates.RAuger },
    { label: 'Direct (band-to-band)', value: logBar(rates.Rdirect), color: color(60, 160, 100), raw: rates.Rdirect }
  ];

  smlDrawBarChart(chartX, chartY, chartW, chartH, series, CEIL, {
    valueFormat: function (v) {
      const idx = series.findIndex(s => s.value === v);
      return idx >= 0 ? series[idx].raw.toExponential(1) : v;
    }
  });

  noStroke(); fill(60); textAlign(LEFT, TOP); textSize(11);
  text('Bar height = log₁₀(rate); labels above bars show the actual rate in cm⁻³s⁻¹.', chartX, chartY + chartH + 34);

  let dominant = 'SRH';
  let maxR = rates.RSRH;
  if (rates.RAuger > maxR) { dominant = 'Auger'; maxR = rates.RAuger; }
  if (rates.Rdirect > maxR) { dominant = 'Direct'; maxR = rates.Rdirect; }

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(13);
  text('Material: ' + materialSelect.value() + '   Doping N = 10^' + dopingExpSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 18);
  text('Δn = 10^' + dnExpSlider.value().toFixed(1) + ' cm⁻³', 10, drawHeight + 54);
  fill(90, 62, 237);
  textStyle(BOLD);
  text('Dominant mechanism at this injection level: ' + dominant, 10, drawHeight + 90);
  textStyle(NORMAL);
  fill(80);
  text('Auger grows as Δn³ and becomes dominant only at very high injection; direct recombination is far stronger in GaAs than silicon.', 10, drawHeight + 118);
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
