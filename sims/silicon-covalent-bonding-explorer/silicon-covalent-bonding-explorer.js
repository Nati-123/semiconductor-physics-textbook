// Silicon Covalent Bonding Explorer MicroSim
// A rotatable 3D view of one central Si atom forming its four tetrahedral
// covalent bonds, built up one bond at a time so students can watch the
// octet complete: each formed bond shares an electron pair (one electron
// contributed by each atom), and the four bonds sit at the true tetrahedral
// angle of 109.5 degrees. This complements two other sims rather than
// repeating them: the Chapter 3 Diamond/Zincblende Explorer shows the full
// repeating unit cell (geometry, atoms-per-cell, coordination number) with
// no electron bookkeeping, and the Chapter 4 Bonding and Crystal Order
// Explorer gives only a quick flat comparison against ionic/metallic
// bonding. This sim's job is the electron count and the bond angle.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02 (3D / WEBGL variant)

let containerWidth;
let drawHeight = 480;
let minDrawHeight = 420;
let maxDrawHeight = 520;

let bondsSlider, angleCheckbox, playBtn;
let readoutDiv;
let playing = false;
let playStartMs = 0;
const PLAY_MS = 2400;

const BOND_LEN = 95; // rendered bond length, pixel-scale (not to real scale)
const ATOM_R = 22;

// Four tetrahedral directions -- unit vectors to alternating cube corners.
// The angle between any two is arccos(-1/3) = 109.47 deg, the sp3 angle.
const RAW_DIRS = [
  [1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]
];
const DIRS = RAW_DIRS.map((v) => {
  const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return [v[0] / len, v[1] / len, v[2] / len];
});

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, drawHeight, WEBGL);
  canvas.parent(mainElement);

  const controlPanel = createDiv('');
  controlPanel.class('control-panel');
  controlPanel.parent(mainElement);

  const wrap = createDiv('');
  wrap.class('slider-field');
  wrap.parent(controlPanel);
  const label = createSpan('Bonds formed:');
  label.class('ctrl-label');
  label.parent(wrap);
  bondsSlider = createSlider(0, 4, 4, 1);
  bondsSlider.class('index-slider');
  bondsSlider.parent(wrap);
  bondsSlider.input(() => { playing = false; updateReadout(); });
  bondsSlider.attribute('aria-label', 'Number of bonds formed');
  const valueSpan = createSpan(' 4');
  valueSpan.class('slider-value');
  valueSpan.parent(wrap);
  bondsSlider.valueSpan = valueSpan;

  playBtn = createButton('Play build animation');
  playBtn.class('preset-btn');
  playBtn.parent(controlPanel);
  playBtn.mousePressed(startPlay);

  const angleWrap = createDiv('');
  angleWrap.class('slider-field');
  angleWrap.parent(controlPanel);
  angleCheckbox = createCheckbox(' Show 109.5° bond angle', false);
  angleCheckbox.parent(angleWrap);
  angleCheckbox.changed(updateReadout);

  const hint = createSpan('Drag to rotate · Scroll to zoom');
  hint.class('ctrl-hint');
  hint.parent(controlPanel);

  readoutDiv = createDiv('');
  readoutDiv.class('readout-panel');
  readoutDiv.parent(mainElement);

  updateReadout();

  describe('A rotatable 3D diagram of one silicon atom forming four tetrahedral covalent bonds to neighboring silicon atoms, revealed one bond at a time with a live electron count and an optional 109.5 degree bond-angle annotation', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function startPlay() {
  playing = true;
  playStartMs = millis();
  bondsSlider.value(0);
  updateReadout();
}

function updateReadout() {
  const n = bondsSlider.value();
  bondsSlider.valueSpan.html(' ' + n);

  const electronsCounted = 4 + n;
  const shared = n * 2;

  let html = '<div class="readout-row"><strong>' + n + ' of 4 covalent bonds formed</strong></div>';
  html += '<div class="readout-row">Each bond shares 1 electron from the center atom with 1 electron from a neighbor — ' +
          '<span class="readout-value">' + shared + '</span> electrons shared so far.</div>';
  html += '<div class="readout-row">Electrons counted around the center Si atom: <span class="readout-value">' + electronsCounted + ' / 8</span>' +
          (electronsCounted === 8 ? ' — octet complete' : ' — ' + (4 - n) + ' valence electron(s) still unshared') + '</div>';
  html += '<div class="readout-row">Every bond sits at the same tetrahedral angle: <span class="readout-value">109.5&deg;</span></div>';
  readoutDiv.html(html);
}

function draw() {
  background(250);
  orbitControl(1, 1, 0.15);

  ambientLight(150);
  directionalLight(255, 255, 255, 0.4, 0.8, -0.6);
  directionalLight(90, 90, 100, -0.4, -0.6, 0.7);

  let n = bondsSlider.value();
  let partial = 1;

  if (playing) {
    const t = (millis() - playStartMs) / PLAY_MS;
    const totalBonds = 4;
    const progress = constrain(t, 0, 1) * totalBonds;
    n = Math.min(totalBonds, Math.floor(progress));
    partial = progress - n;
    if (t >= 1) {
      playing = false;
      n = 4;
      partial = 1;
      bondsSlider.value(4);
      updateReadout();
    }
  }

  drawCenterAtom();

  for (let i = 0; i < DIRS.length; i++) {
    if (i < n) {
      drawBond(DIRS[i], 1);
    } else if (i === n && playing && partial > 0) {
      drawBond(DIRS[i], partial);
    }
  }

  if (angleCheckbox.checked() && n + (playing ? partial : 0) >= 2) {
    drawAngleArc(DIRS[0], DIRS[1]);
  }
}

function drawCenterAtom() {
  noStroke();
  ambientMaterial('#3B2FA0');
  push();
  sphere(ATOM_R, 20, 16);
  pop();
}

function drawBond(dir, extend) {
  const end = [dir[0] * BOND_LEN * extend, dir[1] * BOND_LEN * extend, dir[2] * BOND_LEN * extend];

  stroke(120);
  strokeWeight(3);
  line(0, 0, 0, end[0], end[1], end[2]);

  if (extend > 0.5) {
    noStroke();
    ambientMaterial('#7B68EE');
    push();
    translate(end[0], end[1], end[2]);
    sphere(ATOM_R * 0.85, 18, 14);
    pop();
  }

  if (extend >= 0.95) {
    drawSharedPair(dir);
  }
}

function drawSharedPair(dir) {
  // two small electron spheres near the bond midpoint, offset along an
  // arbitrary perpendicular so they sit visibly beside the bond line
  const mid = [dir[0] * BOND_LEN * 0.5, dir[1] * BOND_LEN * 0.5, dir[2] * BOND_LEN * 0.5];
  let perp = Math.abs(dir[1]) < 0.9 ? crossProd(dir, [0, 1, 0]) : crossProd(dir, [1, 0, 0]);
  const plen = Math.sqrt(perp[0] * perp[0] + perp[1] * perp[1] + perp[2] * perp[2]);
  perp = [perp[0] / plen * 9, perp[1] / plen * 9, perp[2] / plen * 9];

  noStroke();
  ambientMaterial('#E67E22');
  push();
  translate(mid[0] + perp[0], mid[1] + perp[1], mid[2] + perp[2]);
  sphere(6, 10, 8);
  pop();
  push();
  translate(mid[0] - perp[0], mid[1] - perp[1], mid[2] - perp[2]);
  sphere(6, 10, 8);
  pop();
}

function crossProd(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function drawAngleArc(d1, d2) {
  const r = BOND_LEN * 0.4;
  const steps = 24;
  const dot = d1[0] * d2[0] + d1[1] * d2[1] + d1[2] * d2[2];
  const theta = Math.acos(constrain(dot, -1, 1));

  stroke('#2E7D32');
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = slerp(d1, d2, t, theta);
    vertex(p[0] * r, p[1] * r, p[2] * r);
  }
  endShape();

  const mid = slerp(d1, d2, 0.5, theta);
  noStroke();
  fill('#2E7D32');
  push();
  translate(mid[0] * r * 1.25, mid[1] * r * 1.25, mid[2] * r * 1.25);
  // billboard-ish label: small sphere marker plus text is unreliable in
  // WEBGL at arbitrary 3D angles, so mark the arc midpoint and rely on the
  // readout panel for the numeric value instead of in-scene 3D text.
  sphere(3, 8, 8);
  pop();
}

function slerp(a, b, t, theta) {
  if (theta < 1e-6) return a;
  const s = Math.sin(theta);
  const w1 = Math.sin((1 - t) * theta) / s;
  const w2 = Math.sin(t * theta) / s;
  return [a[0] * w1 + b[0] * w2, a[1] * w1 + b[1] * w2, a[2] * w1 + b[2] * w2];
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, drawHeight);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  containerWidth = Math.floor(mainEl.getBoundingClientRect().width);
  drawHeight = Math.max(minDrawHeight, Math.min(maxDrawHeight, Math.floor(containerWidth * 0.62)));
}
