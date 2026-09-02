// Photoconductivity Explorer MicroSim
// Computes excess carrier concentration Delta n = G*tau and the
// resulting photoconductivity increase Delta_sigma = q(Delta n * mu_n +
// Delta p * mu_p) for silicon, plotting Delta_sigma versus generation
// rate G on a log-log chart with a live marker and tick labels, plus an
// instructional photoconductor schematic: light generating electron-hole
// pairs inside a slab between two ohmic contacts, with G, tau, carrier
// concentration, mobility, and Delta_sigma all labeled.
// Bloom Level: Apply (L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 520;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let gSlider, tauSlider;

const Q = 1.602e-19;
const MU_N = 1350, MU_P = 480; // cm^2/V-s, Si

function deltaSigma(G, tauS) {
  const dn = G * tauS;
  return Q * dn * (MU_N + MU_P);
}

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  gSlider = createSlider(15, 20, 19, 0.05);
  gSlider.attribute('aria-label', 'Generation rate exponent, base 10, in per cubic centimeter per second');
  tauSlider = createSlider(0.1, 10, 1, 0.1);
  tauSlider.attribute('aria-label', 'Minority carrier lifetime in microseconds');

  positionUIElements();
  describe('Photoconductivity explorer: computes excess carrier concentration and photoconductivity increase from generation rate and lifetime, with a live log-log chart and an illuminated photoconductor schematic showing electron-hole pair generation', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  gSlider.position(bx + 150, by + drawHeight + 12);
  gSlider.size(min(canvasWidth - 170 - 30, 320));
  tauSlider.position(bx + 150, by + drawHeight + 50);
  tauSlider.size(min(canvasWidth - 170 - 30, 320));
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  const G = Math.pow(10, gSlider.value());
  const tauS = tauSlider.value() * 1e-6;
  const dn = G * tauS;
  const dSigma = deltaSigma(G, tauS);

  // Two-line equation block, pushed clear of the fixed top-right
  // fullscreen button (vertically, not just horizontally, so it stays
  // clear at any canvas width).
  noStroke(); fill(20);
  smlMathText(canvasWidth / 2, 10, 'Δn = Δp = G·τ', { align: 'center', size: 15 });
  smlMathText(canvasWidth / 2, 30, 'Δσ = q(μ_n·Δn + μ_p·Δp)', { align: 'center', size: 15 });

  const topY = 56;
  // Below a width breakpoint, the chart and schematic stack vertically
  // (each getting the full canvas width) instead of sitting side by side
  // -- at narrow (e.g. mobile) widths the side-by-side layout leaves each
  // panel too narrow for its fixed-size labels, causing text overlap.
  const STACK_BREAKPOINT = 640;
  if (canvasWidth < STACK_BREAKPOINT) {
    const chartBoxH = (drawHeight - topY) * 0.46;
    drawChart(G, tauS, 0, canvasWidth, topY, chartBoxH);
    drawPhotoconductorSchematic(0, canvasWidth, topY + chartBoxH + 24, drawHeight - (topY + chartBoxH + 24) - 6, dn, dSigma);
  } else {
    const chartW = canvasWidth * 0.53;
    drawChart(G, tauS, 0, chartW, topY, drawHeight - topY - 46);
    drawPhotoconductorSchematic(chartW + 14, canvasWidth - chartW - 14, topY, drawHeight - topY - 14, dn, dSigma);
  }

  fill(30); noStroke();
  textAlign(LEFT, TOP); textSize(12.5);
  text('G:', 10, drawHeight + 18);
  text('τ:', 10, drawHeight + 56);
  textSize(11.5);
  text('G = 10' + smlSuperscript(gSlider.value().toFixed(2)) + ' cm⁻³s⁻¹ = ' + G.toExponential(2) + ' cm⁻³s⁻¹     τ = ' + tauSlider.value().toFixed(1) + ' μs', 10, drawHeight + 94);
  text('Δn = Δp = ' + dn.toExponential(3) + ' cm⁻³      Δσ = ' + dSigma.toExponential(3) + ' S/cm', 10, drawHeight + 116);
}

function drawChart(G, tauS, originX, boxW, topY, boxH) {
  const chartX = originX + 68, chartY = topY, chartH = boxH - 6;
  fill(30); noStroke(); textAlign(LEFT, TOP); textSize(11.5);
  text('Δσ vs. Generation Rate G (fixed τ)', chartX, chartY - 14);

  const pts = [];
  for (let logG = 15; logG <= 20; logG += 0.05) {
    const g = Math.pow(10, logG);
    pts.push({ x: logG, y: Math.log10(deltaSigma(g, tauS)) });
  }
  const xTicks = [15, 16, 17, 18, 19, 20];
  const yTicks = [-8, -6, -4, -2, 0];
  smlDrawLineChart(chartX, chartY + 6, originX + boxW - chartX - 16, chartH - 6, 15, 20, -8, 0, [
    { points: pts, color: color(230, 150, 30) }
  ], {
    marker: { x: gSlider.value(), y: Math.log10(deltaSigma(G, tauS)) },
    xLabel: 'log₁₀ G (cm⁻³s⁻¹)', yLabel: 'log₁₀ Δσ (S/cm)', yLabelOffset: 42,
    xTicks: xTicks, xTickFormat: v => '10' + smlSuperscript(v),
    yTicks: yTicks, yTickFormat: v => '10' + smlSuperscript(v)
  });
}

function drawPhotoconductorSchematic(px, pw, topY, avail, dn, dSigma) {
  // Every vertical gap below is a FRACTION of avail (not a fixed pixel
  // offset) via a running cursor `cy`, so the whole schematic compresses
  // cleanly instead of overlapping when avail shrinks (narrow/stacked
  // layouts, short iframes) -- fixed-px gaps broke down exactly there.
  const barX = px + pw * 0.14, barW = pw * 0.72;
  const s = avail / 460; // scale factor relative to the desktop-tuned design height
  let cy = topY;

  fill(30); noStroke(); textAlign(CENTER, TOP); textSize(constrain(11.5 * s, 9, 11.5));
  text('Illuminated Photoconductor', px + pw / 2, cy);
  cy += 18 * s + 10;

  const rayH = 26 * s;
  const barY = cy + rayH, barH = avail * 0.24;
  const glow = constrain(map(Math.log10(max(dSigma, 1e-8)), -8, 0, 0, 1), 0, 1);

  stroke(230, 170, 30); strokeWeight(2);
  for (let i = 0; i < 5; i++) {
    const rx = barX + (i + 0.5) * barW / 5;
    line(rx - 8, barY - rayH, rx, barY - 4);
    noStroke(); fill(230, 170, 30);
    triangle(rx - 2, barY - 9, rx + 4, barY - 9, rx, barY - 2);
    stroke(230, 170, 30); strokeWeight(2);
  }
  noStroke(); fill(180, 120, 10); textAlign(CENTER, TOP); textSize(constrain(10 * s, 8.5, 10));
  text('light → generation rate G', barX + barW / 2, cy);

  // semiconductor slab, glowing with Delta_sigma
  noStroke();
  fill(lerpColor(color(70, 75, 100), color(255, 205, 90), glow));
  rect(barX, barY, barW, barH, 4);
  stroke(110); strokeWeight(1.5); noFill();
  rect(barX, barY, barW, barH, 4);

  // ohmic contacts on each end
  noStroke(); fill(90);
  rect(barX - 10, barY - 6, 10, barH + 12);
  rect(barX + barW, barY - 6, 10, barH + 12);
  fill(30); textAlign(CENTER, TOP); textSize(constrain(9.5 * s, 8, 9.5));
  text('contact', barX - 5, barY + barH + 6);
  text('contact', barX + barW + 5, barY + barH + 6);

  // electron-hole pairs generated inside the slab, count scales with log(dn)
  const nPairs = round(map(constrain(Math.log10(max(dn, 1)), 8, 15), 8, 15, 1, 7));
  for (let i = 0; i < nPairs; i++) {
    const ex = barX + 16 + (i / max(nPairs - 1, 1)) * (barW - 32);
    const ey = barY + barH * 0.32;
    const hy = barY + barH * 0.68;
    smlDrawElectron(ex, ey, min(10, barH * 0.14));
    smlDrawHole(ex, hy, min(10, barH * 0.14));
  }

  cy = barY + barH + 20 * s + 8;
  fill(30); noStroke(); textAlign(CENTER, TOP); textSize(constrain(10.5 * s, 8.5, 10.5));
  // NOTE: p5's text(str,x,y,w) uses x as the wrap box's LEFT edge even
  // under CENTER align, so a centered wrapped box needs x = center - w/2.
  text('e⁻/h⁺ pairs generated at rate G, survive average lifetime τ', barX, cy, barW);
  cy += 16 * s + 12;

  // steady-state generation/recombination balance diagram
  stroke(90, 62, 237); strokeWeight(2);
  line(barX, cy, barX + barW * 0.42, cy);
  noStroke(); fill(90, 62, 237);
  triangle(barX + barW * 0.42, cy - 5, barX + barW * 0.42, cy + 5, barX + barW * 0.42 + 8, cy);
  fill(60, 50, 160); textAlign(LEFT, CENTER); textSize(constrain(10 * s, 8.5, 10));
  text('generation: G in', barX, cy + 14 * s);

  stroke(200, 90, 60); strokeWeight(2);
  line(barX + barW * 0.58, cy, barX + barW, cy);
  noStroke(); fill(200, 90, 60);
  triangle(barX + barW - 8, cy - 5, barX + barW - 8, cy + 5, barX + barW, cy);
  fill(160, 60, 30); textAlign(RIGHT, CENTER); textSize(constrain(10 * s, 8.5, 10));
  text('recomb.: Δn/τ out', barX + barW, cy + 14 * s);

  cy += 14 * s + 12 * s + 8;
  fill(60); textAlign(CENTER, TOP); textSize(constrain(10 * s, 8.5, 10));
  text('steady state ⇒ G = Δn/τ  ⇒  Δn = Gτ', barX + barW / 2, cy);
  cy += 14 * s + 12;

  const cardX = px + 4, cardW = pw - 8;
  const cardH = constrain(topY + avail - 8 - cy, 56, 90);
  noStroke(); fill(255, 247, 221); stroke(240, 216, 122); strokeWeight(1);
  rect(cardX, cy, cardW, cardH, 6);
  noStroke(); fill('#7a5c00'); textAlign(LEFT, TOP); textSize(constrain(10.5 * s, 8.5, 10.5));
  const lineH = constrain(17 * s, 13, 17);
  text('carrier concentration:  Δn = Δp = ' + dn.toExponential(2) + ' cm⁻³', cardX + 10, cy + 8, cardW - 20);
  text('mobility (Si):  μ_n = ' + MU_N + '  μ_p = ' + MU_P + ' cm²/V·s', cardX + 10, cy + 8 + lineH, cardW - 20);
  fill(90, 62, 237); textStyle(BOLD);
  text('Δσ = q(μ_n·Δn + μ_p·Δp) = ' + dSigma.toExponential(2) + ' S/cm', cardX + 10, cy + 8 + lineH * 2, cardW - 20);
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
