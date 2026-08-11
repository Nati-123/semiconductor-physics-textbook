// Dopant Ionization Fraction vs. Temperature Explorer MicroSim
// Plots f_ion(T) = 1/(1 + B*exp(E/kT)), a simplified sigmoid model of the
// fraction of ionized dopant atoms, alongside a small companion
// energy-level diagram (EC + donor level ED, or EV + acceptor level EA)
// that animates a few representative carriers escaping into the band as
// the ionized fraction rises -- connecting the math curve directly to the
// physical picture.
// Performance note: redraw is event-driven (noLoop + redraw-on-input);
// the only continuous animation is a short-lived tween that runs for
// ~0.4s after a control change and then stops itself (no perpetual loop).
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 300;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let typeSelect, dopantSelect, eSlider, tempSlider;

const KB = 8.617e-5;
const B_FREEZE = 0.02;
const TMIN = 20, TMAX = 600;
const N_SHOWN = 6; // representative dopant sites drawn in the mini diagram

const DONOR_PRESETS = { 'Custom': null, 'Antimony (Sb), 39 meV': 0.039, 'Phosphorus (P), 45 meV': 0.045, 'Arsenic (As), 54 meV': 0.054 };
const ACCEPTOR_PRESETS = { 'Custom': null, 'Boron (B), 45 meV': 0.045, 'Aluminum (Al), 57 meV': 0.057, 'Gallium (Ga), 65 meV': 0.065 };

let ionStates = []; // one entry per shown site: {frac (0=bound,1=free), target}
let animT0 = 0, animating = false;

function fIon(T, E) {
  const kT = KB * T;
  return 1 / (1 + B_FREEZE * Math.exp(E / kT));
}

function compact() { return canvasWidth < 480; }
function isDonor() { return typeSelect.value() === 'Donor (n-type)'; }

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);

  typeSelect = createSelect();
  typeSelect.option('Donor (n-type)');
  typeSelect.option('Acceptor (p-type)');
  typeSelect.attribute('aria-label', 'Dopant type');
  typeSelect.changed(function () { rebuildDopantOptions(); syncIonStates(true); redraw(); });

  dopantSelect = createSelect();
  dopantSelect.attribute('aria-label', 'Dopant species preset');
  dopantSelect.changed(function () {
    const presets = isDonor() ? DONOR_PRESETS : ACCEPTOR_PRESETS;
    const v = presets[dopantSelect.value()];
    if (v !== null && v !== undefined) eSlider.value(v);
    syncIonStates(false);
    redraw();
  });

  eSlider = createSlider(0.02, 0.15, 0.045, 0.001);
  eSlider.attribute('aria-label', 'Dopant ionization energy in eV');
  eSlider.input(function () { dopantSelect.selected('Custom'); syncIonStates(false); redraw(); });

  tempSlider = createSlider(TMIN, TMAX, 150, 5);
  tempSlider.attribute('aria-label', 'Temperature marker in kelvin');
  tempSlider.input(function () { syncIonStates(false); redraw(); });

  rebuildDopantOptions();
  for (let i = 0; i < N_SHOWN; i++) ionStates.push({ frac: 0, target: 0 });
  syncIonStates(true);

  positionUIElements();
  noLoop();
  describe('Dopant ionization fraction versus temperature explorer: plots the fraction of ionized dopant atoms as a function of temperature, with a companion energy-level diagram showing electrons or holes escaping into the band as ionization proceeds', LABEL);
  setTimeout(function () { windowResized(); }, 50);
}

function rebuildDopantOptions() {
  dopantSelect.html('');
  const presets = isDonor() ? DONOR_PRESETS : ACCEPTOR_PRESETS;
  Object.keys(presets).forEach(name => dopantSelect.option(name));
}

// Deterministically decide which of the N_SHOWN sites are ionized at the
// current f_ion, so the diagram always shows round(f_ion*N_SHOWN) escaped
// carriers; kicks off a short tween for any site whose state just flipped.
function syncIonStates(instant) {
  const f = fIon(tempSlider.value(), eSlider.value());
  const nIonized = Math.round(f * N_SHOWN);
  let changed = false;
  for (let i = 0; i < N_SHOWN; i++) {
    const shouldBeFree = i < nIonized ? 1 : 0;
    if (ionStates[i].target !== shouldBeFree) { ionStates[i].target = shouldBeFree; changed = true; }
    if (instant) ionStates[i].frac = shouldBeFree;
  }
  if (changed && !instant) {
    animating = true;
    animT0 = millis();
    loop();
  }
}

function controlX() { return compact() ? 130 : 190; }

function positionUIElements() {
  let mainRect = document.querySelector('main').getBoundingClientRect();
  const bx = mainRect.left, by = mainRect.top;
  const cx = controlX();
  const sw = min(canvasWidth - cx - 40, 300);

  typeSelect.position(bx + cx, by + drawHeight + 12);
  dopantSelect.position(bx + cx, by + drawHeight + 48);
  eSlider.position(bx + cx, by + drawHeight + 86); eSlider.size(sw);
  tempSlider.position(bx + cx, by + drawHeight + 124); tempSlider.size(sw);
}

function draw() {
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke(225); strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);

  // advance the short tween, then stop the loop once everything settles
  if (animating) {
    const t = constrain((millis() - animT0) / 400, 0, 1);
    let stillMoving = false;
    for (const s of ionStates) {
      s.frac = lerp(s.frac, s.target, 0.18);
      if (Math.abs(s.frac - s.target) > 0.01) stillMoving = true; else s.frac = s.target;
    }
    if (!stillMoving) { animating = false; noLoop(); }
  }

  const donor = isDonor();
  const E = eSlider.value();
  const T = tempSlider.value();
  const f = fIon(T, E);

  const chartW = compact() ? canvasWidth : Math.round(canvasWidth * 0.62);
  drawCurve(donor, E, T, f, 0, chartW);
  drawLevelDiagram(donor, E, T, f, compact() ? 0 : chartW, compact() ? drawHeight * 0.62 : 0, compact() ? canvasWidth : canvasWidth - chartW, compact() ? drawHeight * 0.38 : drawHeight);
  drawControlLabels(donor, E, T, f);
}

function drawCurve(donor, E, T, f, panelX, panelW) {
  const chartX = panelX + (compact() ? 52 : 66);
  const chartY = 40;
  const chartW = panelW - (chartX - panelX) - (compact() ? 14 : 20);
  const chartH = (compact() ? drawHeight * 0.62 : drawHeight) - 92;

  function tToPx(Tv) { return map(Tv, TMIN, TMAX, chartX, chartX + chartW); }
  function fToPx(fv) { return map(fv, 0, 1, chartY + chartH, chartY); }

  fill(20); noStroke(); textAlign(CENTER, TOP); textSize(compact() ? 12 : 14);
  text('Ionization Fraction: f_ion(T) = 1 / (1 + B·e^(E/kT))', panelX + panelW / 2, 6);

  noFill(); stroke(210); strokeWeight(1);
  rect(chartX, chartY, chartW, chartH);

  // x ticks
  const xStep = compact() ? 200 : 100;
  textAlign(CENTER, TOP); textSize(compact() ? 8.5 : 10); fill(90);
  for (let Tt = TMIN; Tt <= TMAX; Tt += xStep) {
    const x = tToPx(Tt);
    stroke(200); strokeWeight(1);
    line(x, chartY + chartH, x, chartY + chartH + 4);
    noStroke(); text(Tt, x, chartY + chartH + 6);
  }
  // y ticks (0-100%)
  textAlign(RIGHT, CENTER); textSize(compact() ? 8.5 : 10);
  for (let p = 0; p <= 1.001; p += 0.25) {
    const y = fToPx(p);
    stroke(200); strokeWeight(1);
    line(chartX - 4, y, chartX, y);
    noStroke(); fill(90);
    text(Math.round(p * 100) + '%', chartX - 7, y);
  }

  // curve
  const pts = [];
  for (let T2 = TMIN; T2 <= TMAX; T2 += 4) pts.push({ x: tToPx(T2), y: fToPx(fIon(T2, E)) });
  noFill(); stroke(donor ? '#5A3EED' : '#C62828'); strokeWeight(2.5);
  beginShape(); for (const p of pts) vertex(p.x, p.y); endShape();

  // 50% reference
  stroke(150); strokeWeight(1);
  drawingContext.setLineDash([3, 3]);
  line(chartX, fToPx(0.5), chartX + chartW, fToPx(0.5));
  drawingContext.setLineDash([]);

  // temperature marker + point on curve
  const mx = tToPx(T);
  stroke(30); strokeWeight(2);
  drawingContext.setLineDash([5, 3]);
  line(mx, chartY, mx, chartY + chartH);
  drawingContext.setLineDash([]);
  noStroke(); fill(30);
  circle(mx, fToPx(f), 8);
  textAlign(mx < chartX + chartW * 0.7 ? LEFT : RIGHT, BOTTOM);
  textSize(compact() ? 9 : 10.5);
  text('T = ' + T + ' K', mx + (mx < chartX + chartW * 0.7 ? 6 : -6), chartY + 12);

  // axis titles
  fill(20); textAlign(CENTER, TOP); textSize(compact() ? 10 : 11.5);
  text('Temperature (K)', chartX + chartW / 2, chartY + chartH + 20);
  push();
  translate(chartX - (compact() ? 40 : 50), chartY + chartH / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  text('Ionized fraction', 0, 0);
  pop();
}

// Small companion band diagram: EC (or EV) plus the dopant level, with
// N_SHOWN representative carriers drawn bound-at-level or free-in-band
// according to ionStates[i].frac. The EC-ED (or EA-EV) gap is drawn much
// larger than true scale so it stays visible -- flagged in the caption.
function drawLevelDiagram(donor, E, T, f, panelX, panelY, panelW, panelH) {
  noStroke(); fill(245); stroke(210); strokeWeight(1);
  rect(panelX + 8, panelY + 4, panelW - 16, panelH - (compact() ? 8 : 34));

  const diagX0 = panelX + 20, diagX1 = panelX + panelW - 20;
  const topY = panelY + 20, botY = panelY + panelH - (compact() ? 26 : 50);

  // donor mode: CB region on top, EC line, ED line just below it, VB band-edge line at bottom (unlabeled context)
  // acceptor mode: mirror -- VB region on bottom, EV line, EA line just above it
  const bandY = donor ? topY + (botY - topY) * 0.28 : botY - (botY - topY) * 0.28; // EC or EV
  const levelY = donor ? bandY + (botY - topY) * 0.16 : bandY - (botY - topY) * 0.16; // ED or EA

  // shade the free-carrier band region
  noStroke();
  fill(donor ? color(90, 62, 237, 30) : color(198, 40, 40, 30));
  if (donor) rect(diagX0, topY, diagX1 - diagX0, bandY - topY);
  else rect(diagX0, bandY, diagX1 - diagX0, botY - bandY);

  stroke(donor ? '#5A3EED' : '#C62828'); strokeWeight(2.2);
  line(diagX0, bandY, diagX1, bandY);
  stroke(150); strokeWeight(1.5);
  drawingContext.setLineDash([4, 3]);
  line(diagX0, levelY, diagX1, levelY);
  drawingContext.setLineDash([]);

  noStroke(); fill(donor ? '#5A3EED' : '#C62828');
  textAlign(LEFT, donor ? BOTTOM : TOP); textSize(compact() ? 10 : 11.5);
  text(donor ? 'EC' : 'EV', diagX1 + 4, bandY + (donor ? 2 : -2));
  fill(90); textAlign(LEFT, donor ? TOP : BOTTOM);
  text(donor ? 'ED' : 'EA', diagX1 + 4, levelY + (donor ? -2 : 2));

  // representative carrier sites along the level; frac 0 = bound at level, 1 = free in band
  const siteSpacing = (diagX1 - diagX0 - 20) / (N_SHOWN - 1);
  for (let i = 0; i < N_SHOWN; i++) {
    const sx = diagX0 + 10 + i * siteSpacing;
    const frac = ionStates[i].frac;
    const freeY = donor ? topY + (bandY - topY) * 0.4 : botY - (botY - topY) * 0.4;
    const sy = lerp(levelY, freeY, frac);
    if (donor) smlDrawElectron(sx, sy, compact() ? 8 : 9);
    else smlDrawHole(sx, sy, compact() ? 8 : 9);
  }

  noStroke(); fill(60); textAlign(CENTER, TOP); textSize(compact() ? 9 : 10.5);
  const nFree = ionStates.filter(s => s.target === 1).length;
  text((donor ? nFree + ' of ' + N_SHOWN + ' donor electrons freed' : nFree + ' of ' + N_SHOWN + ' acceptor holes freed'), panelX + panelW / 2, botY + 6);
  fill(120); textSize(compact() ? 8 : 9);
  text('(EC−ED gap exaggerated for visibility; not to scale)', panelX + panelW / 2, botY + (compact() ? 20 : 22));
}

function drawControlLabels(donor, E, T, f) {
  fill('black'); noStroke();
  const cx = controlX();
  textSize(compact() ? 11 : 13);
  textAlign(RIGHT, CENTER);
  text('Type:', cx - 10, drawHeight + 24);
  text('Dopant:', cx - 10, drawHeight + 60);
  text((donor ? 'ED' : 'EA') + ': ' + E.toFixed(3) + ' eV', cx - 10, drawHeight + 98);
  text('T: ' + T + ' K', cx - 10, drawHeight + 136);

  const readY = drawHeight + (compact() ? 172 : 172);
  fill('#333'); noStroke(); textAlign(LEFT, CENTER); textSize(compact() ? 10 : 11.5);
  text('T = ' + T + ' K   |   ' + (donor ? 'ED' : 'EA') + ' = ' + E.toFixed(3) + ' eV   |   f_ion = ' + f.toFixed(3) + ' (' + (f * 100).toFixed(1) + '%)', 12, readY);

  const explainY = readY + (compact() ? 22 : 24);
  const explainW = min(canvasWidth - 24, 640);
  const physText = donor
    ? 'When a donor atom ionizes, its weakly-bound fifth electron gains enough thermal energy (kBT) to escape the donor site entirely and enter the conduction band as a free electron, leaving behind a fixed, immobile positive ion. No covalent bond is broken in this process.'
    : 'When an acceptor atom ionizes, it captures an electron from a neighboring valence bond, completing its own fourth bond and leaving behind a mobile hole in the valence band, plus a fixed, immobile negative ion at the acceptor site.';
  fill(50); textAlign(LEFT, TOP); textSize(compact() ? 10 : 11.5);
  text(physText, 12, explainY, explainW, compact() ? 90 : 60);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  positionUIElements();
  redraw();
}

function updateCanvasSize() {
  controlHeight = compact() ? 340 : 300;
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
  if (compact()) drawHeight = Math.max(drawHeight, 560); // room to stack curve + diagram
}
