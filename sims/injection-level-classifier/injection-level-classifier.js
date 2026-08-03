// Injection Level Classifier MicroSim
// Compares excess carrier concentration Δn to majority carrier (doping)
// concentration N, classifying the result as low-level injection
// (Δn << N, roughly Δn < 0.1N) or high-level injection (Δn >= 0.1N).
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 380;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let dopingExpSlider, dnExpSlider;

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  dopingExpSlider = createSlider(14, 18, 16, 0.1);
  dopingExpSlider.attribute('aria-label', 'Doping concentration exponent');
  dnExpSlider = createSlider(12, 19, 14, 0.1);
  dnExpSlider.attribute('aria-label', 'Excess carrier concentration exponent');

  positionUIElements();
  describe('Injection level classifier: compares excess carrier concentration to doping concentration, classifying low-level versus high-level injection', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  dopingExpSlider.position(bx + 230, by + drawHeight + 14);
  dopingExpSlider.size(min(canvasWidth - 250 - 30, 320));
  dnExpSlider.position(bx + 230, by + drawHeight + 52);
  dnExpSlider.size(min(canvasWidth - 250 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const N = Math.pow(10, dopingExpSlider.value());
  const dn = Math.pow(10, dnExpSlider.value());
  const ratio = dn / N;
  const isHigh = ratio >= 0.1;

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Doping Concentration vs. Excess Carrier Injection', canvasWidth / 2, 8);

  // two horizontal bars on a shared log scale, EXP 10..19
  const barX = 140, barW = canvasWidth - barX - 60;
  const logMin = 10, logMax = 19;
  function xFor(exp) { return map(exp, logMin, logMax, barX, barX + barW); }

  const y1 = 100, y2 = 190, barH = 46;
  noStroke(); fill(60, 60, 200);
  rect(barX, y1, xFor(dopingExpSlider.value()) - barX, barH, 4);
  fill(230, 90, 60);
  rect(barX, y2, xFor(dnExpSlider.value()) - barX, barH, 4);

  fill(30); textAlign(RIGHT, CENTER); textSize(13);
  text('Doping N', barX - 10, y1 + barH / 2);
  text('Excess Δn', barX - 10, y2 + barH / 2);

  fill(255); textAlign(LEFT, CENTER); textSize(12);
  text('N = 10^' + dopingExpSlider.value().toFixed(1) + ' cm⁻³', barX + 8, y1 + barH / 2);
  text('Δn = 10^' + dnExpSlider.value().toFixed(1) + ' cm⁻³', barX + 8, y2 + barH / 2);

  // axis ticks
  stroke(180); strokeWeight(1);
  line(barX, y2 + barH + 20, barX + barW, y2 + barH + 20);
  noStroke(); fill(90); textAlign(CENTER, TOP); textSize(10);
  for (let e = logMin; e <= logMax; e++) {
    const xt = xFor(e);
    stroke(180); line(xt, y2 + barH + 16, xt, y2 + barH + 24);
    noStroke(); fill(90);
    text('10^' + e, xt, y2 + barH + 26);
  }

  // classification readout
  const boxY = 290;
  fill(isHigh ? color(255, 235, 235) : color(232, 250, 232));
  stroke(isHigh ? color(220, 90, 90) : color(90, 180, 100));
  strokeWeight(2);
  rect(barX, boxY, barW, 90, 8);
  noStroke();
  fill(isHigh ? color(190, 40, 40) : color(40, 130, 60));
  textAlign(CENTER, TOP); textSize(20);
  text(isHigh ? 'HIGH-LEVEL INJECTION' : 'LOW-LEVEL INJECTION', barX + barW / 2, boxY + 12);
  fill(50); textSize(13);
  text('Δn / N = ' + ratio.toExponential(2), barX + barW / 2, boxY + 42);
  textSize(12); fill(80);
  textAlign(CENTER, TOP);
  text(isHigh
    ? 'Δn is comparable to or exceeds N — minority AND majority carrier concentrations are both significantly perturbed.'
    : 'Δn ≪ N — majority carrier concentration is essentially unchanged; only the minority carrier population is significantly perturbed.',
    barX + 10, boxY + 56, barW - 20, 34);

  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(12);
  text('Convention used here: high-level injection when Δn ≥ 0.1×N (i.e., excess carriers exceed 10% of the doping concentration).', 10, drawHeight - 26);
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
