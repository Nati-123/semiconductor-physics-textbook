// Miller Indices Explorer MicroSim
// Lets students set integer Miller indices (h k l) and see the corresponding
// crystal plane sliced through a wireframe unit cell in 3D. The plane is
// computed from the general plane equation h*X + k*Y + l*Z = 1 (in
// fractional cell coordinates), clipped against the unit cube -- this
// single formula naturally handles h=0/k=0/l=0 (plane parallel to that
// axis, i.e. intercept at infinity) as well as negative indices.
// Bloom Level: Apply (L3) - compute, construct
// MicroSim template version 2026.02 (3D / WEBGL variant)

let containerWidth;
let drawHeight = 480;
let minDrawHeight = 420;
let maxDrawHeight = 520;

let hSlider, kSlider, lSlider;
let readoutDiv;

const A = 200; // rendered lattice constant, in pixel-scale units (not to real scale)

// Unit cube corners in fractional coordinates (0..1) and the 12 edges
// connecting them, used both for the wireframe cube and for clipping the
// Miller-index plane against the cell boundary.
const CORNERS = [
  [0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1],
  [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1]
];
const EDGES = [
  [0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 4],
  [2, 6], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7]
];

function toWorld(p) {
  const h = A / 2;
  return { x: p[0] * A - h, y: p[1] * A - h, z: p[2] * A - h };
}

function setup() {
  updateCanvasSize();
  var mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, drawHeight, WEBGL);
  canvas.parent(mainElement);

  const controlPanel = createDiv('');
  controlPanel.class('control-panel');
  controlPanel.parent(mainElement);

  hSlider = makeIndexSlider(controlPanel, 'h');
  kSlider = makeIndexSlider(controlPanel, 'k');
  lSlider = makeIndexSlider(controlPanel, 'l');

  const presetRow = createDiv('');
  presetRow.class('control-panel');
  presetRow.parent(mainElement);

  const presetLabel = createSpan('Presets:');
  presetLabel.class('ctrl-label');
  presetLabel.parent(presetRow);

  addPresetButton(presetRow, '(100)', 1, 0, 0);
  addPresetButton(presetRow, '(110)', 1, 1, 0);
  addPresetButton(presetRow, '(111)', 1, 1, 1);
  addPresetButton(presetRow, '(200)', 2, 0, 0);

  const hint = createSpan('Drag to rotate · Scroll to zoom');
  hint.class('ctrl-hint');
  hint.parent(presetRow);

  readoutDiv = createDiv('');
  readoutDiv.class('readout-panel');
  readoutDiv.parent(mainElement);

  setIndices(1, 1, 1);

  describe('Rotatable 3D wireframe unit cell with a shaded plane showing the crystal plane corresponding to adjustable Miller indices h k l', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function makeIndexSlider(parent, name) {
  const wrap = createDiv('');
  wrap.class('slider-field');
  wrap.parent(parent);

  const label = createSpan(name + ':');
  label.class('ctrl-label');
  label.parent(wrap);

  const slider = createSlider(-3, 3, 1, 1);
  slider.class('index-slider');
  slider.parent(wrap);
  slider.input(updateReadout);
  slider.attribute('aria-label', 'Miller index ' + name);

  const valueSpan = createSpan(' 1');
  valueSpan.class('slider-value');
  valueSpan.parent(wrap);
  slider.valueSpan = valueSpan;

  return slider;
}

function addPresetButton(parent, label, h, k, l) {
  const btn = createButton(label);
  btn.class('preset-btn');
  btn.parent(parent);
  btn.mousePressed(() => setIndices(h, k, l));
}

function setIndices(h, k, l) {
  hSlider.value(h);
  kSlider.value(k);
  lSlider.value(l);
  updateReadout();
}

function updateReadout() {
  hSlider.valueSpan.html(' ' + hSlider.value());
  kSlider.valueSpan.html(' ' + kSlider.value());
  lSlider.valueSpan.html(' ' + lSlider.value());

  const h = hSlider.value();
  const k = kSlider.value();
  const l = lSlider.value();

  const interceptStr = (idx) => (idx === 0 ? '&infin; (parallel to axis)' : formatFraction(1 / idx) + ' a');

  let html = '<div class="readout-row"><strong>Miller indices (h k l) = (' + h + ' ' + k + ' ' + l + ')</strong></div>';
  html += '<div class="readout-row">x-intercept: <span class="readout-value">' + interceptStr(h) + '</span>' +
          ' &nbsp;&nbsp; y-intercept: <span class="readout-value">' + interceptStr(k) + '</span>' +
          ' &nbsp;&nbsp; z-intercept: <span class="readout-value">' + interceptStr(l) + '</span></div>';

  if (h === 0 && k === 0 && l === 0) {
    html += '<div class="readout-row warn">At least one index must be nonzero to define a plane.</div>';
  } else {
    const poly = computeIntersectionPolygon(h, k, l);
    if (!poly) {
      html += '<div class="readout-row warn">This plane does not cross the shaded unit cell shown (it lies in a neighboring cell along the negative axis direction). Try a preset button, or flip a sign.</div>';
    }
  }
  html += '<div class="readout-row legend"><span class="swatch" style="background:#4C6FE7"></span> x-axis intercept &nbsp; <span class="swatch" style="background:#2E9E5B"></span> y-axis intercept &nbsp; <span class="swatch" style="background:#E67E22"></span> z-axis intercept</div>';

  readoutDiv.html(html);
}

function formatFraction(v) {
  if (Math.abs(v - Math.round(v)) < 1e-9) return Math.round(v).toString();
  return v.toFixed(3);
}

// --- Geometry: intersect the plane h*X + k*Y + l*Z = 1 with the unit cube ---

function vecSub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
function vecCross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function vecDot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function vecLen(a) { return Math.sqrt(vecDot(a, a)); }
function vecNorm(a) {
  const len = vecLen(a);
  return len < 1e-12 ? [0, 0, 0] : [a[0] / len, a[1] / len, a[2] / len];
}
function pointDist(a, b) { return vecLen(vecSub(a, b)); }

function computeIntersectionPolygon(h, k, l) {
  if (h === 0 && k === 0 && l === 0) return null;

  const f = (p) => h * p[0] + k * p[1] + l * p[2] - 1;
  const EPS = 1e-9;
  let pts = [];

  EDGES.forEach(([i, j]) => {
    const pi = CORNERS[i], pj = CORNERS[j];
    const fi = f(pi), fj = f(pj);
    if (Math.abs(fi) < EPS) pts.push(pi.slice());
    if (Math.abs(fj) < EPS) pts.push(pj.slice());
    if ((fi > EPS && fj < -EPS) || (fi < -EPS && fj > EPS)) {
      const t = fi / (fi - fj);
      pts.push([
        pi[0] + t * (pj[0] - pi[0]),
        pi[1] + t * (pj[1] - pi[1]),
        pi[2] + t * (pj[2] - pi[2])
      ]);
    }
  });

  // de-duplicate near-identical points (can occur when the plane passes
  // exactly through a cube vertex, reported by multiple adjacent edges)
  const uniq = [];
  pts.forEach((p) => {
    if (!uniq.some((q) => pointDist(q, p) < 1e-4)) uniq.push(p);
  });

  if (uniq.length < 3) return null;

  // order the points into a convex polygon by angle around the centroid,
  // measured in a 2D basis (u, v) that spans the cutting plane
  const centroid = [0, 0, 0];
  uniq.forEach((p) => { centroid[0] += p[0] / uniq.length; centroid[1] += p[1] / uniq.length; centroid[2] += p[2] / uniq.length; });

  const normal = vecNorm([h, k, l]);
  let ref = Math.abs(normal[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  const u = vecNorm(vecCross(normal, ref));
  const v = vecNorm(vecCross(normal, u));

  uniq.sort((p, q) => {
    const dp = vecSub(p, centroid);
    const dq = vecSub(q, centroid);
    const angleP = Math.atan2(vecDot(dp, v), vecDot(dp, u));
    const angleQ = Math.atan2(vecDot(dq, v), vecDot(dq, u));
    return angleP - angleQ;
  });

  return uniq;
}

function draw() {
  background(250);
  orbitControl(1, 1, 0.15);

  ambientLight(140);
  directionalLight(255, 255, 255, 0.4, 0.8, -0.6);
  directionalLight(80, 80, 95, -0.4, -0.6, 0.7);

  drawWireCube();

  const h = hSlider.value();
  const k = kSlider.value();
  const l = lSlider.value();

  drawAxes();
  drawInterceptMarkers(h, k, l);

  const poly = (h === 0 && k === 0 && l === 0) ? null : computeIntersectionPolygon(h, k, l);
  if (poly) drawPlanePolygon(poly);
}

function drawWireCube() {
  const worldCorners = CORNERS.map(toWorld);
  stroke(90);
  strokeWeight(1.5);
  noFill();
  EDGES.forEach(([i, j]) => {
    line(worldCorners[i].x, worldCorners[i].y, worldCorners[i].z, worldCorners[j].x, worldCorners[j].y, worldCorners[j].z);
  });
}

function drawAxes() {
  const o = toWorld([0, 0, 0]);
  const xAx = toWorld([1.15, 0, 0]);
  const yAx = toWorld([0, 1.15, 0]);
  const zAx = toWorld([0, 0, 1.15]);

  strokeWeight(2.5);
  stroke('#4C6FE7');
  line(o.x, o.y, o.z, xAx.x, xAx.y, xAx.z);
  stroke('#2E9E5B');
  line(o.x, o.y, o.z, yAx.x, yAx.y, yAx.z);
  stroke('#E67E22');
  line(o.x, o.y, o.z, zAx.x, zAx.y, zAx.z);

  noStroke();
  fill(80);
  push();
  translate(o.x, o.y, o.z);
  sphere(4, 8, 8);
  pop();
}

function drawInterceptMarkers(h, k, l) {
  noStroke();
  if (h !== 0) drawMarker([1 / h, 0, 0], [76, 111, 231]);
  if (k !== 0) drawMarker([0, 1 / k, 0], [46, 158, 91]);
  if (l !== 0) drawMarker([0, 0, 1 / l], [230, 126, 34]);
}

function drawMarker(fracPos, col) {
  const w = toWorld(fracPos);
  ambientMaterial(col[0], col[1], col[2]);
  push();
  translate(w.x, w.y, w.z);
  sphere(7, 10, 10);
  pop();
}

function drawPlanePolygon(poly) {
  const worldPts = poly.map(toWorld);

  noStroke();
  fill(90, 110, 240, 130);
  beginShape();
  worldPts.forEach((p) => vertex(p.x, p.y, p.z));
  endShape(CLOSE);

  stroke('#5A3EED');
  strokeWeight(2.5);
  noFill();
  beginShape();
  worldPts.forEach((p) => vertex(p.x, p.y, p.z));
  endShape(CLOSE);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, drawHeight);
}

function updateCanvasSize() {
  var mainEl = document.querySelector('main');
  containerWidth = Math.floor(mainEl.getBoundingClientRect().width);
  drawHeight = Math.max(minDrawHeight, Math.min(maxDrawHeight, Math.floor(containerWidth * 0.62)));
}
