// Injection Level Classifier MicroSim
// Compares excess carrier concentration Δn to the equilibrium majority
// carrier concentration n0 (set by doping), classifying the result on a
// CONTINUOUS spectrum from low-level injection (Δn << n0, roughly
// Δn/n0 < 0.1) through a transition band (0.1 <= Δn/n0 < 1) to
// high-level injection (Δn/n0 >= 1) -- not a binary flip.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 490;
let minDrawHeight = 490;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let dopingExpSlider, dnExpSlider;

// Meter spans the full exponent range reachable by the two sliders:
// doping exponent 14..18, Δn exponent 12..19 -> ratio exponent -6..5.
const LOG_MIN = -6, LOG_MAX = 5;
const LOG_LOW_HIGH = -1;   // ratio = 0.1: low-level / transition boundary
const LOG_HIGH_START = 0;  // ratio = 1:   transition / high-level boundary

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  dopingExpSlider = createSlider(14, 18, 16, 0.1);
  dopingExpSlider.attribute('aria-label', 'Doping concentration exponent, sets equilibrium majority carrier concentration n0');
  dnExpSlider = createSlider(12, 19, 14, 0.1);
  dnExpSlider.attribute('aria-label', 'Excess carrier concentration exponent, delta n');

  positionUIElements();
  describe('Injection level classifier: compares excess carrier concentration to the equilibrium majority carrier concentration n0, showing a continuous low-level, transition, high-level injection classification as the ratio delta n over n0 changes', LABEL);
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

function regimeOf(logRatio) {
  if (logRatio < LOG_LOW_HIGH) return 'low';
  if (logRatio < LOG_HIGH_START) return 'transition';
  return 'high';
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const n0 = Math.pow(10, dopingExpSlider.value());       // equilibrium majority carrier concentration
  const dn = Math.pow(10, dnExpSlider.value());            // excess carrier concentration
  const ratio = dn / n0;
  const logRatio = Math.log10(ratio);
  const regime = regimeOf(logRatio);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(compact() ? 13 : 16);
  text('Injection Level: comparing Δn to n₀', canvasWidth / 2, 8);

  // two horizontal bars on a shared log scale, EXP 10..19
  const barX = compact() ? 100 : 140, barW = canvasWidth - barX - 60;
  const logMin = 10, logMax = 19;
  function xFor(exp) { return map(exp, logMin, logMax, barX, barX + barW); }

  const y1 = 42, y2 = 96, barH = 38;
  noStroke(); fill(60, 60, 200);
  rect(barX, y1, xFor(dopingExpSlider.value()) - barX, barH, 4);
  fill(230, 90, 60);
  rect(barX, y2, xFor(dnExpSlider.value()) - barX, barH, 4);

  fill(30); textAlign(RIGHT, CENTER); textSize(compact() ? 11 : 13);
  text('n₀', barX - 10, y1 + barH / 2);
  text('Δn', barX - 10, y2 + barH / 2);

  fill(255); textAlign(LEFT, CENTER); textSize(compact() ? 10.5 : 12);
  text('n₀ = 10^' + dopingExpSlider.value().toFixed(1) + ' cm⁻³', barX + 8, y1 + barH / 2);
  text('Δn = 10^' + dnExpSlider.value().toFixed(1) + ' cm⁻³', barX + 8, y2 + barH / 2);

  // axis ticks for the two bars
  const barsAxisY = y2 + barH + 14;
  stroke(180); strokeWeight(1);
  line(barX, barsAxisY, barX + barW, barsAxisY);
  noStroke(); fill(90); textAlign(CENTER, TOP); textSize(9.5);
  for (let e = logMin; e <= logMax; e++) {
    const xt = xFor(e);
    stroke(180); line(xt, barsAxisY - 4, xt, barsAxisY + 4);
    noStroke(); fill(90);
    text('10^' + e, xt, barsAxisY + 6);
  }

  // continuous injection-level meter (log ratio Δn/n0)
  const meterY = 210, meterH = 34;
  const meterX = barX, meterW = barW;
  function xForLog(lg) { return map(constrain(lg, LOG_MIN, LOG_MAX), LOG_MIN, LOG_MAX, meterX, meterX + meterW); }

  noStroke();
  fill(215, 240, 220); rect(meterX, meterY, xForLog(LOG_LOW_HIGH) - meterX, meterH, 4, 0, 0, 4);
  fill(255, 235, 195); rect(xForLog(LOG_LOW_HIGH), meterY, xForLog(LOG_HIGH_START) - xForLog(LOG_LOW_HIGH), meterH);
  fill(255, 218, 218); rect(xForLog(LOG_HIGH_START), meterY, meterX + meterW - xForLog(LOG_HIGH_START), meterH, 0, 4, 4, 0);

  stroke(120); strokeWeight(1.5);
  line(xForLog(LOG_LOW_HIGH), meterY, xForLog(LOG_LOW_HIGH), meterY + meterH);
  line(xForLog(LOG_HIGH_START), meterY, xForLog(LOG_HIGH_START), meterY + meterH);
  noStroke(); rect(meterX, meterY, meterW, meterH); // reset (no-op, keeps consistent state)

  // zone labels. Low-level/High-level sit inside their (wide) bands and are
  // skipped only if that band renders too narrow to hold them legibly.
  // Transition is inherently narrow (it is exactly 1 of the meter's 11
  // decades) so its label is always drawn as a callout ABOVE the meter with
  // a leader line, rather than centered inside a band that is almost never
  // wide enough.
  textAlign(CENTER, CENTER); textSize(compact() ? 9.5 : 11);
  const minLabelW = compact() ? 60 : 78;
  const zoneMid = (lo, hi) => (xForLog(lo) + xForLog(hi)) / 2;
  fill(40, 120, 60);
  if (xForLog(LOG_LOW_HIGH) - xForLog(LOG_MIN) >= minLabelW) text('Low-level', zoneMid(LOG_MIN, LOG_LOW_HIGH), meterY + meterH / 2);
  fill(180, 50, 50);
  if (xForLog(LOG_MAX) - xForLog(LOG_HIGH_START) >= minLabelW) text('High-level', zoneMid(LOG_HIGH_START, LOG_MAX), meterY + meterH / 2);

  const transMidX = zoneMid(LOG_LOW_HIGH, LOG_HIGH_START);
  stroke(170, 120, 20); strokeWeight(1);
  line(transMidX, meterY - 2, transMidX, meterY - 14);
  noStroke(); fill(160, 110, 20);
  textAlign(CENTER, BOTTOM); textSize(compact() ? 9 : 10.5);
  text('Transition', transMidX, meterY - 15);
  textAlign(CENTER, CENTER); textSize(compact() ? 9.5 : 11);

  // needle marking the current Δn/n0 ratio
  const needleX = xForLog(logRatio);
  stroke(20); strokeWeight(2.5);
  line(needleX, meterY - 12, needleX, meterY + meterH + 12);
  noStroke(); fill(20);
  triangle(needleX - 6, meterY - 12, needleX + 6, meterY - 12, needleX, meterY - 2);

  // meter scale ticks (ratio powers of 10)
  stroke(170); strokeWeight(1);
  noStroke(); fill(90); textAlign(CENTER, TOP); textSize(9);
  for (let e = LOG_MIN; e <= LOG_MAX; e++) {
    const xt = xForLog(e);
    stroke(170); line(xt, meterY + meterH, xt, meterY + meterH + 4);
    noStroke(); fill(90);
    if (e % 2 === (LOG_MIN % 2 + 2) % 2) text('10^' + e, xt, meterY + meterH + 6);
  }
  fill(30); textAlign(LEFT, TOP); textSize(compact() ? 9.5 : 10.5);
  text('Δn / n₀ (log scale)', meterX, meterY + meterH + 20);

  // numeric readout: n0, Δn, ratio
  fill(20); textAlign(LEFT, TOP); textSize(compact() ? 11 : 12.5);
  const readY = meterY + meterH + 40;
  text('n₀ = ' + n0.toExponential(2) + ' cm⁻³      Δn = ' + dn.toExponential(2) + ' cm⁻³      Δn/n₀ = ' + ratio.toExponential(2), meterX, readY);

  // classification / explanation box
  const boxY = readY + 30;
  const boxH = compact() ? 150 : 118;
  const regimeColor = regime === 'high' ? color(190, 40, 40) : (regime === 'transition' ? color(170, 120, 10) : color(40, 130, 60));
  const regimeBg = regime === 'high' ? color(255, 235, 235) : (regime === 'transition' ? color(255, 245, 222) : color(232, 250, 232));
  fill(regimeBg);
  stroke(regimeColor); strokeWeight(2);
  rect(meterX, boxY, meterW, boxH, 8);
  noStroke();
  fill(regimeColor);
  textAlign(CENTER, TOP); textSize(compact() ? 15 : 18);
  const regimeLabel = regime === 'high' ? 'HIGH-LEVEL INJECTION' : (regime === 'transition' ? 'TRANSITION REGION' : 'LOW-LEVEL INJECTION');
  text(regimeLabel, meterX + meterW / 2, boxY + 10);

  fill(60); textSize(compact() ? 11 : 12.5);
  textAlign(CENTER, TOP);
  let explain;
  if (regime === 'low') {
    explain = 'Δn ≪ n₀: majority carrier concentration stays essentially at n₀ (unperturbed). Only the minority carrier population is significantly disturbed. τ can be treated as a constant material parameter, independent of injection level — the assumption behind most simple device equations.';
  } else if (regime === 'transition') {
    explain = 'Δn is becoming comparable to n₀: the low-level approximation (majority ≈ n₀, constant τ) is starting to break down, but Δn is not yet large enough that Δn ≈ Δp is a safe simplification either. Predictions in this band need the full equations, not the low- or high-level shortcuts.';
  } else {
    explain = 'Δn ≳ n₀: BOTH carrier populations are significantly perturbed, and Δn ≈ Δp (ambipolar transport) becomes the useful approximation instead. τ itself may become injection-level-dependent (e.g. through Auger recombination) rather than a fixed constant.';
  }
  text(explain, meterX + 12, boxY + (compact() ? 34 : 38), meterW - 24, boxH - 40);
}

function compact() { return canvasWidth < 480; }

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
}

function updateCanvasSize() {
  controlHeight = compact() ? 150 : 130;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
}
