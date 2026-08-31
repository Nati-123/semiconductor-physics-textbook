// Semiconductor Materials Library — shared p5.js drawing helpers for
// Chapter 7 MicroSims (intrinsic/extrinsic, elemental/compound, Si/Ge/GaAs,
// donor/acceptor atoms). Loaded by each sim's main.html alongside p5.js.
// Every function is a plain drawing/computation helper: it reads the
// current p5 drawing state (fill/stroke are set by the caller before use
// where relevant) and draws directly onto the active canvas.
//
// Naming convention: every exported helper is prefixed "sml" (Semiconductor
// Materials Library) to avoid collisions with sim-specific globals.

// ---------- responsive canvas sizing ----------
function smlComputeCanvasSize(minDrawHeight, controlHeight) {
  var mainEl = document.querySelector('main');
  var containerWidth = Math.floor(mainEl.getBoundingClientRect().width);
  var availableHeight = window.innerHeight;
  var children = mainEl.children;
  for (var i = 0; i < children.length; i++) {
    if (children[i].tagName !== 'CANVAS') {
      availableHeight -= children[i].offsetHeight;
    }
  }
  var drawHeight = Math.max(minDrawHeight, availableHeight - controlHeight);
  return {
    width: containerWidth,
    drawHeight: drawHeight,
    height: drawHeight + controlHeight
  };
}

// ---------- atoms, bonds, carriers ----------
function smlDrawAtom(x, y, r, label, fillCol, strokeCol) {
  push();
  stroke(strokeCol || color(30));
  strokeWeight(1.5);
  fill(fillCol || color(90, 140, 220));
  circle(x, y, r * 2);
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(r * 0.72);
  text(label, x, y);
  pop();
}

function smlDrawBond(x1, y1, x2, y2, opts) {
  opts = opts || {};
  push();
  if (opts.broken) {
    stroke(opts.color || color(200, 90, 90));
    strokeWeight(2);
    drawingContext.setLineDash([5, 5]);
    line(x1, y1, x2, y2);
    drawingContext.setLineDash([]);
  } else {
    stroke(opts.color || color(110));
    strokeWeight(2.2);
    line(x1, y1, x2, y2);
    // shared electron-pair dots at the bond midpoint, offset perpendicular
    if (opts.showElectrons !== false) {
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      var dx = x2 - x1, dy = y2 - y1;
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      var px = -dy / len, py = dx / len;
      noStroke();
      fill(opts.electronColor || color(40, 40, 220));
      circle(mx + px * 3, my + py * 3, 4.5);
      circle(mx - px * 3, my - py * 3, 4.5);
    }
  }
  pop();
}

function smlDrawElectron(x, y, r) {
  push();
  noStroke();
  fill(40, 40, 220);
  circle(x, y, r || 9);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize((r || 9) * 0.8);
  text('−', x, y - 0.5);
  pop();
}

function smlDrawHole(x, y, r) {
  push();
  noFill();
  stroke(220, 60, 60);
  strokeWeight(2);
  circle(x, y, r || 9);
  noStroke();
  fill(220, 60, 60);
  textAlign(CENTER, CENTER);
  textSize((r || 9) * 0.85);
  text('+', x, y - 0.5);
  pop();
}

// Draws a simplified 2D schematic lattice: a cols x rows grid of atoms,
// each bonded to its right and lower neighbor (so interior atoms show
// 4 bonds total once neighboring rows/cols are drawn). Returns the atom
// coordinate grid so callers can highlight/replace individual atoms.
//
// opts:
//   atomR, atomColor, bondColor, electronColor
//   labelFor(i,j) -> string label for atom at grid position (i,j)
//   colorFor(i,j)  -> fill color override for atom at (i,j)
//   brokenBondSet  -> Set of "i1,j1-i2,j2" strings for bonds to draw broken
function smlDrawLatticeGrid(x0, y0, cols, rows, spacing, opts) {
  opts = opts || {};
  var atomR = opts.atomR || 13;
  var atoms = [];
  for (var j = 0; j < rows; j++) {
    var row = [];
    for (var i = 0; i < cols; i++) {
      row.push({ x: x0 + i * spacing, y: y0 + j * spacing });
    }
    atoms.push(row);
  }
  function bondKey(i1, j1, i2, j2) { return i1 + ',' + j1 + '-' + i2 + ',' + j2; }

  // bonds first (so atoms draw on top)
  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var a = atoms[j][i];
      if (i < cols - 1) {
        var b = atoms[j][i + 1];
        var broken = opts.brokenBondSet && opts.brokenBondSet.has(bondKey(i, j, i + 1, j));
        smlDrawBond(a.x, a.y, b.x, b.y, { broken: broken, color: opts.bondColor, electronColor: opts.electronColor });
      }
      if (j < rows - 1) {
        var c = atoms[j + 1][i];
        var broken2 = opts.brokenBondSet && opts.brokenBondSet.has(bondKey(i, j, i, j + 1));
        smlDrawBond(a.x, a.y, c.x, c.y, { broken: broken2, color: opts.bondColor, electronColor: opts.electronColor });
      }
    }
  }
  // atoms on top
  for (var jj = 0; jj < rows; jj++) {
    for (var ii = 0; ii < cols; ii++) {
      var p = atoms[jj][ii];
      var label = opts.labelFor ? opts.labelFor(ii, jj) : (opts.atomLabel || 'Si');
      var fillCol = opts.colorFor ? opts.colorFor(ii, jj) : opts.atomColor;
      smlDrawAtom(p.x, p.y, atomR, label, fillCol, opts.atomStroke);
    }
  }
  return atoms;
}

// ---------- charts ----------
// Simple vertical bar chart. series: [{label, value, color}], within a
// fixed pixel rectangle (x,y,w,h). yMax is the top of the value axis.
function smlDrawBarChart(x, y, w, h, series, yMax, opts) {
  opts = opts || {};
  push();
  noFill();
  stroke(200);
  strokeWeight(1);
  line(x, y + h, x + w, y + h);
  line(x, y, x, y + h);

  var n = series.length;
  var gap = w * 0.12 / n;
  var barW = (w - gap * (n + 1)) / n;
  for (var i = 0; i < n; i++) {
    var s = series[i];
    var barH = map(constrain(s.value, 0, yMax), 0, yMax, 0, h);
    var bx = x + gap + i * (barW + gap);
    var by = y + h - barH;
    noStroke();
    fill(s.color || color(90, 62, 237));
    rect(bx, by, barW, barH, 3);
    fill(30);
    textAlign(CENTER, BOTTOM);
    textSize(11);
    text(opts.valueFormat ? opts.valueFormat(s.value) : s.value, bx + barW / 2, by - 4);
    textAlign(CENTER, TOP);
    fill(60);
    textSize(11);
    text(s.label, bx + barW / 2, y + h + 6);
  }
  pop();
}

// Simple XY line chart for one or more series.
// series: [{points:[{x,y}], color, label}]
function smlDrawLineChart(x, y, w, h, xMin, xMax, yMin, yMax, series, opts) {
  opts = opts || {};
  push();
  stroke(210);
  strokeWeight(1);
  noFill();
  rect(x, y, w, h);

  function xToPx(xv) { return map(xv, xMin, xMax, x, x + w); }
  function yToPx(yv) { return map(yv, yMin, yMax, y + h, y); }

  for (var s = 0; s < series.length; s++) {
    var ser = series[s];
    stroke(ser.color || color(90, 62, 237));
    strokeWeight(2.2);
    noFill();
    beginShape();
    for (var i = 0; i < ser.points.length; i++) {
      vertex(xToPx(ser.points[i].x), yToPx(ser.points[i].y));
    }
    endShape();
  }

  if (opts.marker) {
    noStroke();
    fill(opts.markerColor || color(200, 30, 30));
    circle(xToPx(opts.marker.x), yToPx(opts.marker.y), 8);
  }

  if (opts.xLabel) {
    noStroke();
    fill(40);
    smlMathText(x + w / 2, y + h + 6, opts.xLabel, { align: 'center', size: 12 });
  }
  if (opts.yLabel) {
    push();
    translate(x - (opts.yLabelOffset || 34), y + h / 2);
    rotate(-HALF_PI);
    noStroke();
    fill(40);
    // smlMathText's y is the TOP of the text (not its vertical center),
    // so shift up by roughly half the font size to approximate the
    // CENTER,CENTER anchoring this rotated axis-title label needs.
    smlMathText(0, -6, opts.yLabel, { align: 'center', size: 12 });
    pop();
  }
  pop();
  return { xToPx: xToPx, yToPx: yToPx };
}

// ---------- periodic table cell ----------
function smlDrawPeriodicCell(x, y, size, symbol, number, groupColor, selected) {
  push();
  stroke(selected ? color(90, 62, 237) : color(160));
  strokeWeight(selected ? 3 : 1);
  fill(groupColor || color(230));
  rect(x, y, size, size, 4);
  noStroke();
  fill(30);
  textAlign(LEFT, TOP);
  textSize(size * 0.20);
  text(number, x + 3, y + 2);
  textAlign(CENTER, CENTER);
  textSize(size * 0.40);
  text(symbol, x + size / 2, y + size * 0.6);
  pop();
}

// ---------- misc UI ----------
function smlDrawThermometer(x, y, w, h, valueFrac, label) {
  push();
  noFill();
  stroke(120);
  strokeWeight(1.5);
  rect(x, y, w, h, w / 2);
  var fillH = constrain(valueFrac, 0, 1) * (h - 6);
  noStroke();
  fill(220, 90, 60);
  rect(x + 3, y + h - 3 - fillH, w - 6, fillH, (w - 6) / 2);
  fill(30);
  textAlign(CENTER, TOP);
  textSize(11);
  text(label, x + w / 2, y + h + 4);
  pop();
}

function smlDrawInfoBox(canvasWidth, boxTop, lines, opts) {
  opts = opts || {};
  push();
  var boxW = min(opts.maxWidth || 520, canvasWidth - 2 * (opts.margin || 40));
  var boxX = canvasWidth / 2 - boxW / 2;
  noStroke();
  fill(255, 247, 221, 235);
  stroke(240, 216, 122);
  strokeWeight(1);
  rect(boxX, boxTop, boxW, lines.length * 15 + 14, 8);
  noStroke();
  fill('#7a5c00');
  textAlign(LEFT, TOP);
  textSize(11);
  for (var i = 0; i < lines.length; i++) {
    text(lines[i], boxX + 12, boxTop + 8 + i * 15);
  }
  pop();
}

// Rectangle-based Reset button. Caller draws it each frame and checks
// smlPointInRect(mouseX, mouseY, ...) inside mousePressed().
function smlDrawButton(x, y, w, h, label, active) {
  push();
  stroke(90, 62, 237);
  strokeWeight(1.5);
  fill(active ? color(90, 62, 237) : color(245, 245, 255));
  rect(x, y, w, h, 6);
  noStroke();
  fill(active ? 255 : color(90, 62, 237));
  // smlMathText so any "N_A"-style subscript notation in a button label
  // (e.g. preset buttons like "Symmetric (N_A=N_D)") renders as a real
  // subscript instead of a literal underscore; plain labels ("Next ▶")
  // pass through unchanged since they contain no "_".
  smlMathText(x + w / 2, y + h / 2 - 6.5, label, { align: 'center', size: 13 });
  pop();
}

function smlPointInRect(px, py, x, y, w, h) {
  return px >= x && px <= x + w && py >= y && py <= y + h;
}

// ---------- math text formatting (Chapter 8+) ----------
// Converts an integer (or one-decimal-place float) to Unicode superscript
// digits, e.g. smlSuperscript(16) -> "¹⁶", smlSuperscript(-3) -> "⁻³".
// Used so canvas text can show "10¹⁶" instead of raw "10^16" text.
var SML_SUP_MAP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '.': '˙' };
function smlSuperscript(n) {
  var s = String(n);
  var out = '';
  for (var i = 0; i < s.length; i++) out += (SML_SUP_MAP[s[i]] !== undefined ? SML_SUP_MAP[s[i]] : s[i]);
  return out;
}

// Formats a concentration value (cm^-3) as "1.0×10¹⁶ cm⁻³"-style text,
// or, for a value already known as a power of ten, use smlFormatPow10.
function smlFormatConc(value, opts) {
  opts = opts || {};
  if (value <= 0 || !isFinite(value)) return opts.noUnit ? '0' : '0 cm⁻³';
  var exp = Math.floor(Math.log10(value));
  var mant = value / Math.pow(10, exp);
  if (mant >= 9.95) { mant /= 10; exp += 1; }
  var mantStr = mant.toFixed(opts.mantDecimals !== undefined ? opts.mantDecimals : 1);
  return mantStr + '×10' + smlSuperscript(exp) + (opts.noUnit ? '' : ' cm⁻³');
}

// Formats a slider exponent value (e.g. 16.5) as "10¹⁶·⁵ cm⁻³", used for
// the log-scale doping-concentration sliders common in Chapter 7/8 sims.
function smlFormatPow10(exponent, opts) {
  opts = opts || {};
  var expStr = (Math.round(exponent * 10) % 10 === 0) ? exponent.toFixed(0) : exponent.toFixed(1);
  return '10' + smlSuperscript(expStr) + (opts.noUnit ? '' : ' cm⁻³');
}

// ---------- carrier-statistics physics (Chapter 9+) ----------
// Shared Si/Ge/GaAs constants and formulas so every Chapter 9-10 MicroSim
// (effective density of states, mass action law, carrier-concentration/
// Fermi-level, intrinsic-ni-vs-T) computes N_C, N_V, E_g(T), and n_i from
// the same single source of truth instead of duplicating (and risking
// drift in) four separate copies of these constants.
// m_e*/m_h* are density-of-states effective masses (already include
// valley-degeneracy corrections); Eg0/alpha/beta are Varshni parameters.
const SML_KB_J = 1.381e-23, SML_H_J = 6.626e-34, SML_M0 = 9.109e-31, SML_KB_EV = 8.617e-5;

const SML_MATERIALS = {
  'Silicon': { symbol: 'Si', me: 1.08, mh: 0.56, Eg0: 1.166, alpha: 4.73e-4, beta: 636, color: [90, 62, 237] },
  'Germanium': { symbol: 'Ge', me: 0.55, mh: 0.37, Eg0: 0.7437, alpha: 4.77e-4, beta: 235, color: [200, 100, 40] },
  'GaAs': { symbol: 'GaAs', me: 0.067, mh: 0.48, Eg0: 1.519, alpha: 5.41e-4, beta: 204, color: [30, 150, 130] }
};

// N_C = 2(2*pi*m*kB*T/h^2)^1.5, in cm^-3. mRatio is m*/m0.
function smlEffDOS(mRatio, T) {
  const m = mRatio * SML_M0;
  const val = 2 * Math.pow((2 * Math.PI * m * SML_KB_J * T) / (SML_H_J * SML_H_J), 1.5); // m^-3
  return val / 1e6; // cm^-3
}
// Varshni equation: Eg(T) = Eg0 - alpha*T^2/(T+beta), in eV.
function smlEgVarshni(mat, T) { return mat.Eg0 - (mat.alpha * T * T) / (T + mat.beta); }
// n_i = sqrt(NC*NV) * exp(-Eg/2kT), in cm^-3.
function smlNi(mat, T) {
  const Nc = smlEffDOS(mat.me, T), Nv = smlEffDOS(mat.mh, T);
  return Math.sqrt(Nc * Nv) * Math.exp(-smlEgVarshni(mat, T) / (2 * SML_KB_EV * T));
}

// ---------- exact carrier-concentration / Fermi-level (Chapter 10) ----------
// Solves the mass action law (n0*p0=ni^2) and charge neutrality condition
// (n0+NA=p0+ND, complete ionization assumed) together: n0^2-(ND-NA)n0-ni^2=0.
// Keeps only the physically meaningful positive root.
function smlExactN0(ND, NA, ni) {
  const net = ND - NA;
  return (net + Math.sqrt(net * net + 4 * ni * ni)) / 2;
}
function smlExactP0(ND, NA, ni) {
  const net = NA - ND;
  return (net + Math.sqrt(net * net + 4 * ni * ni)) / 2;
}
// E_C-E_F = kT*ln(NC/n0); E_F-E_V = kT*ln(NV/p0). Both valid only in the
// non-degenerate (Boltzmann) regime -- see smlDegeneracyZone below.
function smlEcMinusEf(Nc, n0, kT) { return kT * Math.log(Nc / n0); }
function smlEfMinusEv(Nv, p0, kT) { return kT * Math.log(Nv / p0); }
// Intrinsic Fermi level's offset from exact midgap: Ei = midgap + this.
function smlEiOffsetFromMidgap(Nc, Nv, kT) { return (kT / 2) * Math.log(Nv / Nc); }
// Shared non-degenerate/transition/degenerate classification: 'dist' is
// whichever of E_C-E_F or E_F-E_V is smaller (distance to the nearer band
// edge). Matches the 3*kT convention used throughout Chapters 8-10.
function smlDegeneracyZone(dist, kT) {
  return dist > 3 * kT ? 'non' : (dist > 0 ? 'transition' : 'degenerate');
}

// ---------- Matthiessen's-rule mobility model (Chapter 11) ----------
// Illustrative lattice/impurity scattering model, calibrated to roughly
// match real silicon mobility at 300 K (muL0/muI0 are each carrier's
// lattice-limited and impurity-limited mobility at T=300K, N=1e17 cm^-3
// respectively). Shared so every Chapter 11 MicroSim computes mobility
// from one source of truth instead of three duplicated local copies.
const SML_MOBILITY_CARRIERS = {
  'Electrons (n-type)': { muL0: 1350, muI0: 1965, symbol: 'n', color: [90, 62, 237] },
  'Holes (p-type)': { muL0: 480, muI0: 800, symbol: 'p', color: [200, 90, 40] }
};
function smlMuLattice(muL0, T) { return muL0 * Math.pow(T / 300, -1.5); }
function smlMuImpurity(muI0, T, N) { return muI0 * Math.pow(T / 300, 1.5) * (1e17 / N); }
function smlMuTotal(muL, muI) { return 1 / (1 / muL + 1 / muI); }
function smlMobility(carrier, T, N) {
  return smlMuTotal(smlMuLattice(carrier.muL0, T), smlMuImpurity(carrier.muI0, T, N));
}

// Draws "main" immediately followed by a smaller, lower "sub" glyph run,
// approximating a true typographic subscript on an HTML5 canvas (which has
// no rich-text API). Honors the caller's current fill/textAlign(LEFT,*)
// for the main text; sub is always drawn in the same fill color. Returns
// the total pixel width consumed, so callers can continue drawing more
// plain text immediately after (e.g. smlDrawSubLabel(...) then text(' = 1.2 eV', x+w, y)).
function smlDrawSubLabel(x, y, main, sub, opts) {
  opts = opts || {};
  var mainSize = opts.size || 13;
  var subSize = mainSize * 0.68;
  var subDy = mainSize * 0.28;
  push();
  textAlign(LEFT, opts.baseline || CENTER);
  textSize(mainSize);
  var mainW = textWidth(main);
  text(main, x, y);
  var subW = 0;
  if (sub) {
    textSize(subSize);
    subW = textWidth(sub);
    text(sub, x + mainW, y + subDy);
  }
  pop();
  return mainW + subW;
}

// Renders a full string containing inline "_subscript" markers (e.g.
// "V_bi = 0.754 V", "N_A·x_p = N_D·x_n") as mixed-size text,
// approximating real math typesetting on a canvas: each "X_yy" run
// becomes normal-size "X" immediately followed by a smaller, lowered
// "yy". Everything else is drawn at normal size on the same baseline.
// This is the general form of smlDrawSubLabel, for a whole sentence
// with several subscripted quantities embedded in running text rather
// than a single isolated "main+sub" pair.
//   x, y   - position; y is the TOP of the normal-size text (matches
//            the textAlign(*, TOP) convention used everywhere else in
//            this library), regardless of align.
//   align  - 'left' (default), 'center', or 'right'; 'center' takes x
//            as the horizontal center of the string, 'right' takes x
//            as its right edge.
//   opts   - { size, color, bold, maxWidth } (maxWidth wraps onto a
//            second centered/left-aligned line if exceeded; omit for
//            single-line labels, which is the common case here)
// Returns the total rendered width in px (single-line case).
function smlMathText(x, y, str, opts) {
  opts = opts || {};
  var size = opts.size || 13;
  var subSize = size * 0.66;
  var subDy = size * 0.32;
  var baseline = y + size * 0.82;

  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var us = str.indexOf('_', i);
    if (us === -1) { tokens.push({ t: str.slice(i), sub: false }); break; }
    if (us > i) tokens.push({ t: str.slice(i, us), sub: false });
    var j = us + 1;
    while (j < str.length && /[A-Za-z0-9]/.test(str[j])) j++;
    if (j === us + 1) { tokens.push({ t: '_', sub: false }); i = j; continue; } // lone underscore, no subscript run
    tokens.push({ t: str.slice(us + 1, j), sub: true });
    i = j;
  }

  push();
  if (opts.bold) textStyle(BOLD);
  textAlign(LEFT, BASELINE);
  var totalW = 0;
  for (var k = 0; k < tokens.length; k++) {
    textSize(tokens[k].sub ? subSize : size);
    totalW += textWidth(tokens[k].t);
  }

  var cx = x;
  if (opts.align === 'center') cx = x - totalW / 2;
  else if (opts.align === 'right') cx = x - totalW;
  if (opts.color) fill(opts.color);
  noStroke();
  for (var m = 0; m < tokens.length; m++) {
    textSize(tokens[m].sub ? subSize : size);
    text(tokens[m].t, cx, tokens[m].sub ? baseline + subDy : baseline);
    cx += textWidth(tokens[m].t);
  }
  pop();
  return totalW;
}
