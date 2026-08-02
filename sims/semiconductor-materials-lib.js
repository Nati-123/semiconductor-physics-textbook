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
    textAlign(CENTER, TOP);
    textSize(12);
    text(opts.xLabel, x + w / 2, y + h + 6);
  }
  if (opts.yLabel) {
    push();
    translate(x - (opts.yLabelOffset || 34), y + h / 2);
    rotate(-HALF_PI);
    noStroke();
    fill(40);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(opts.yLabel, 0, 0);
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
  textAlign(CENTER, CENTER);
  textSize(13);
  text(label, x + w / 2, y + h / 2);
  pop();
}

function smlPointInRect(px, py, x, y, w, h) {
  return px >= x && px <= x + w && py >= y && py <= y + h;
}
