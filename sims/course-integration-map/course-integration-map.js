// Course Integration Map MicroSim
// Force-directed graph showing prerequisite connections between all 20
// chapters of this course, drawn from each chapter's own "Prerequisites"
// section. This is a chapter-level roadmap, deliberately kept separate
// from the 218-concept Learning Graph. Adapted from the EE2301 textbook's
// Course Integration Map, with hover tooltips, double-click navigation,
// and zoom/pan added.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 620;
let controlHeight = 82;
let canvasHeight = drawHeight + controlHeight;

// Chapter definitions: id, full title, one-line description (for hover
// tooltips), the directory slug (for direct navigation), and the
// thematic-phase category used for coloring.
let units = [
  { id: 1,  name: "Physics and Math Foundations",               desc: "Classical physics and math tools needed for semiconductor physics", slug: "01-physics-math-foundations", category: "foundations" },
  { id: 2,  name: "Quantum Mechanics Foundations",              desc: "Wave-particle duality, the Schrodinger equation, and quantum tunneling", slug: "02-quantum-mechanics-foundations", category: "foundations" },
  { id: 3,  name: "Crystal Lattices and Structures",            desc: "Crystal lattices, unit cells, and Miller indices", slug: "03-crystal-lattices-structures", category: "quantumCrystal" },
  { id: 4,  name: "Chemical Bonding in Semiconductor Crystals", desc: "Covalent/ionic/metallic bonding and silicon's diamond lattice", slug: "04-chemical-bonding-crystals", category: "quantumCrystal" },
  { id: 5,  name: "Quantum Mechanics of Periodic Crystals",     desc: "Bloch's theorem and the origin of energy bands", slug: "05-quantum-mechanics-periodic-crystals", category: "quantumCrystal" },
  { id: 6,  name: "Band Structure and the Fermi Level",         desc: "E-k diagrams, effective mass, density of states, Fermi level", slug: "06-band-structure-fermi-level", category: "quantumCrystal" },
  { id: 7,  name: "Intrinsic and Extrinsic Semiconductors",     desc: "Intrinsic vs. extrinsic material; donors and acceptors", slug: "07-intrinsic-extrinsic-semiconductors", category: "semiconductorFund" },
  { id: 8,  name: "Doping, Ionization, and Temperature Regimes", desc: "N-type/p-type doping and temperature regimes", slug: "08-doping-ionization-temperature", category: "semiconductorFund" },
  { id: 9,  name: "Carrier Concentration Statistics",           desc: "Fermi-Dirac statistics and carrier concentration", slug: "09-carrier-concentration-statistics", category: "semiconductorFund" },
  { id: 10, name: "Fermi Level Position and Carrier Equations", desc: "Carrier equations and Fermi level position", slug: "10-fermi-level-carrier-equations", category: "semiconductorFund" },
  { id: 11, name: "Drift Current and Carrier Mobility",         desc: "Drift current, mobility, and conductivity", slug: "11-drift-current-mobility", category: "junctionsDevices" },
  { id: 12, name: "Diffusion and Advanced Transport Phenomena", desc: "Hall effect, diffusion, and the Einstein relation", slug: "12-diffusion-transport-phenomena", category: "junctionsDevices" },
  { id: 13, name: "Non-Equilibrium Carriers and Recombination", desc: "Excess carriers, recombination, and carrier lifetime", slug: "13-non-equilibrium-carriers-recombination", category: "junctionsDevices" },
  { id: 14, name: "The P-N Junction at Equilibrium",            desc: "The p-n junction at thermal equilibrium", slug: "14-pn-junction-equilibrium", category: "junctionsDevices" },
  { id: 15, name: "The P-N Junction Under Bias",                desc: "The p-n junction under forward/reverse bias", slug: "15-pn-junction-under-bias", category: "junctionsDevices" },
  { id: 16, name: "Metal-Semiconductor and MOS Junctions",      desc: "Schottky and MOS junctions; threshold voltage", slug: "16-metal-semiconductor-mos-junctions", category: "junctionsDevices" },
  { id: 17, name: "Optical and Thermal Properties",             desc: "Optical absorption, LEDs, photodiodes, solar cells", slug: "17-optical-thermal-properties", category: "advancedDevices" },
  { id: 18, name: "Semiconductor Devices and Applications",     desc: "Real semiconductor devices and applications", slug: "18-semiconductor-devices-applications", category: "advancedDevices" },
  { id: 19, name: "Semiconductor Device Fabrication",           desc: "Wafer fabrication and CMOS process integration", slug: "19-semiconductor-device-fabrication", category: "fabrication" },
  { id: 20, name: "Advanced Devices and Emerging Technologies", desc: "Advanced devices and emerging technologies", slug: "20-advanced-devices-emerging-technologies", category: "fabrication" }
];

// Edges (directed: from prerequisite to dependent), drawn directly from
// each chapter's own "Prerequisites" section in the chapter text.
let edges = [
  { from: 1, to: 2 },
  { from: 1, to: 3 }, { from: 2, to: 3 },
  { from: 1, to: 4 }, { from: 3, to: 4 },
  { from: 2, to: 5 }, { from: 3, to: 5 },
  { from: 2, to: 6 }, { from: 5, to: 6 },
  { from: 3, to: 7 }, { from: 4, to: 7 }, { from: 6, to: 7 },
  { from: 7, to: 8 },
  { from: 1, to: 9 }, { from: 5, to: 9 }, { from: 6, to: 9 }, { from: 7, to: 9 }, { from: 8, to: 9 },
  { from: 6, to: 10 }, { from: 8, to: 10 }, { from: 9, to: 10 },
  { from: 1, to: 11 }, { from: 8, to: 11 }, { from: 9, to: 11 }, { from: 10, to: 11 },
  { from: 1, to: 12 }, { from: 11, to: 12 },
  { from: 1, to: 13 }, { from: 4, to: 13 }, { from: 6, to: 13 }, { from: 9, to: 13 }, { from: 10, to: 13 }, { from: 12, to: 13 },
  { from: 1, to: 14 }, { from: 8, to: 14 }, { from: 9, to: 14 }, { from: 10, to: 14 },
  { from: 2, to: 15 }, { from: 8, to: 15 }, { from: 9, to: 15 }, { from: 12, to: 15 }, { from: 13, to: 15 }, { from: 14, to: 15 },
  { from: 6, to: 16 }, { from: 7, to: 16 }, { from: 8, to: 16 }, { from: 9, to: 16 }, { from: 14, to: 16 }, { from: 15, to: 16 },
  { from: 1, to: 17 }, { from: 3, to: 17 }, { from: 5, to: 17 }, { from: 7, to: 17 }, { from: 9, to: 17 }, { from: 11, to: 17 }, { from: 13, to: 17 }, { from: 15, to: 17 },
  { from: 6, to: 18 }, { from: 7, to: 18 }, { from: 11, to: 18 }, { from: 14, to: 18 }, { from: 15, to: 18 }, { from: 16, to: 18 }, { from: 17, to: 18 },
  { from: 1, to: 19 }, { from: 3, to: 19 }, { from: 7, to: 19 }, { from: 8, to: 19 }, { from: 16, to: 19 }, { from: 18, to: 19 },
  { from: 2, to: 20 }, { from: 6, to: 20 }, { from: 7, to: 20 }, { from: 15, to: 20 }, { from: 16, to: 20 }, { from: 17, to: 20 }, { from: 18, to: 20 }, { from: 19, to: 20 }
];

// Six thematic phases, derived from the actual chapter sequence rather
// than an arbitrary split.
let categoryColors = {
  foundations:       '#2196F3',  // blue
  quantumCrystal:     '#4CAF50', // green
  semiconductorFund:  '#FF9800', // orange
  junctionsDevices:   '#9C27B0', // purple
  advancedDevices:    '#F44336', // red
  fabrication:        '#009688'  // teal
};

let categoryLabels = {
  foundations:       'Foundations (Ch 1-2)',
  quantumCrystal:     'Quantum & Crystal Physics (Ch 3-6)',
  semiconductorFund:  'Semiconductor Fundamentals (Ch 7-10)',
  junctionsDevices:   'Junctions & Device Physics (Ch 11-16)',
  advancedDevices:    'Advanced Devices (Ch 17-18)',
  fabrication:        'Fabrication & Emerging Tech (Ch 19-20)'
};

// Physics simulation
let nodes = [];
let nodeRadius = 20;

// Interaction state
let selectedNode = -1;
let draggedNode = -1;
let hoveredNode = -1;
let hoveredEdge = -1;
let dragOffsetX = 0;
let dragOffsetY = 0;
let panning = false;
let panStartX = 0;
let panStartY = 0;

// View transform (zoom/pan), applied only to the graph area
let viewZoom = 1;
let viewPanX = 0;
let viewPanY = 0;

// Force parameters
let repulsionStrength = 10000;
let attractionStrength = 0.004;
let centerStrength = 0.004;
let damping = 0.85;
let initialized = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, canvasHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);
  describe('Force-directed graph showing prerequisite relationships between all 20 chapters of this course. Click a chapter to highlight its connections, drag to rearrange, scroll to zoom, drag empty space to pan, and double-click a chapter to open it.', LABEL);
  initializeNodes();
}

function initializeNodes() {
  let cx = canvasWidth / 2;
  let cy = drawHeight / 2;
  let initRadius = min(canvasWidth, drawHeight) * 0.44;

  nodes = [];
  for (let i = 0; i < units.length; i++) {
    let angle = (i / units.length) * TWO_PI - HALF_PI;
    nodes.push({
      x: cx + cos(angle) * initRadius + random(-20, 20),
      y: cy + sin(angle) * initRadius + random(-20, 20),
      vx: 0,
      vy: 0
    });
  }
  initialized = true;
}

function resetView() {
  initializeNodes();
  selectedNode = -1;
  viewZoom = 1;
  viewPanX = 0;
  viewPanY = 0;
}

// ---------- screen <-> world coordinate conversion (for zoom/pan) ----------
function worldMouseX() { return (mouseX - viewPanX) / viewZoom; }
function worldMouseY() { return (mouseY - viewPanY) / viewZoom; }
function toScreen(wx, wy) { return { x: wx * viewZoom + viewPanX, y: wy * viewZoom + viewPanY }; }

function draw() {
  updateCanvasSize();
  background(245);

  if (!initialized) {
    initializeNodes();
  }

  applyForces();
  updatePositions();

  push();
  translate(viewPanX, viewPanY);
  scale(viewZoom);
  drawEdges();
  drawNodes();
  pop();

  drawLegend();
  drawInfoPanel();
  drawHoverTooltip();
  drawControlBar();
}

function applyForces() {
  let cx = canvasWidth / 2;
  let cy = drawHeight / 2 - 10;

  for (let n of nodes) {
    n.fx = 0;
    n.fy = 0;
  }

  // Repulsion between all pairs (Coulomb-like)
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let dx = nodes[j].x - nodes[i].x;
      let dy = nodes[j].y - nodes[i].y;
      let dist2 = dx * dx + dy * dy;
      let minDist = 36;
      if (dist2 < minDist * minDist) dist2 = minDist * minDist;
      let force = repulsionStrength / dist2;
      let d = sqrt(dist2);
      let fx = (dx / d) * force;
      let fy = (dy / d) * force;

      nodes[i].fx -= fx;
      nodes[i].fy -= fy;
      nodes[j].fx += fx;
      nodes[j].fy += fy;
    }
  }

  // Attraction along edges (spring-like)
  for (let edge of edges) {
    let ni = nodes[edge.from - 1];
    let nj = nodes[edge.to - 1];
    let dx = nj.x - ni.x;
    let dy = nj.y - ni.y;
    let d = sqrt(dx * dx + dy * dy);
    let targetDist = 130;
    let force = (d - targetDist) * attractionStrength;
    let fx = (dx / max(d, 1)) * force;
    let fy = (dy / max(d, 1)) * force;

    ni.fx += fx;
    ni.fy += fy;
    nj.fx -= fx;
    nj.fy -= fy;
  }

  // Centering force
  for (let n of nodes) {
    n.fx += (cx - n.x) * centerStrength;
    n.fy += (cy - n.y) * centerStrength;
  }

  // Gentle downward gravity by chapter number, for a rough top-to-bottom
  // progression through the six thematic phases
  for (let i = 0; i < nodes.length; i++) {
    let tier = getTier(i + 1);
    let targetY = cy - 260 + tier * 100;
    nodes[i].fy += (targetY - nodes[i].y) * 0.0015;
  }
}

function getTier(chapterId) {
  if (chapterId <= 2) return 0;
  if (chapterId <= 6) return 1;
  if (chapterId <= 10) return 2;
  if (chapterId <= 16) return 3;
  if (chapterId <= 18) return 4;
  return 5;
}

function updatePositions() {
  for (let i = 0; i < nodes.length; i++) {
    if (i === draggedNode) continue;

    let n = nodes[i];
    n.vx = (n.vx + n.fx) * damping;
    n.vy = (n.vy + n.fy) * damping;

    n.x += n.vx;
    n.y += n.vy;

    let margin = nodeRadius + 5;
    n.x = constrain(n.x, margin, canvasWidth - margin);
    n.y = constrain(n.y, margin, drawHeight - margin - 90);
  }
}

function drawEdges() {
  // First pass: compute each edge's on-screen (world-space) endpoints and
  // find the single closest edge under the mouse, so at most one tooltip
  // ever renders even when many edges cross near the cursor.
  let endpoints = [];
  hoveredEdge = -1;
  let bestDist = 8 / viewZoom;
  let wmx = worldMouseX(), wmy = worldMouseY();

  for (let ei = 0; ei < edges.length; ei++) {
    let edge = edges[ei];
    let ni = nodes[edge.from - 1];
    let nj = nodes[edge.to - 1];

    let dx = nj.x - ni.x;
    let dy = nj.y - ni.y;
    let d = sqrt(dx * dx + dy * dy);
    let nx = dx / max(d, 1);
    let ny = dy / max(d, 1);

    let x1 = ni.x + nx * nodeRadius;
    let y1 = ni.y + ny * nodeRadius;
    let x2 = nj.x - nx * nodeRadius;
    let y2 = nj.y - ny * nodeRadius;

    endpoints.push({ x1, y1, x2, y2 });

    let edgeDist = distToSegment(wmx, wmy, x1, y1, x2, y2);
    if (edgeDist < bestDist) {
      bestDist = edgeDist;
      hoveredEdge = ei;
    }
  }

  for (let ei = 0; ei < edges.length; ei++) {
    let edge = edges[ei];
    let { x1, y1, x2, y2 } = endpoints[ei];

    let isHighlighted = (selectedNode >= 0 &&
      (edge.from === selectedNode + 1 || edge.to === selectedNode + 1));
    let isDimmed = (selectedNode >= 0 && !isHighlighted);
    let isHovered = (hoveredEdge === ei) && draggedNode < 0 && !panning;

    let alpha = isDimmed ? 30 : (isHighlighted || isHovered ? 255 : 90);
    let edgeColor;
    if (isHighlighted) {
      edgeColor = color(edge.from === selectedNode + 1 ? '#FF5722' : '#2196F3');
    } else if (isHovered) {
      edgeColor = color('#FF9800');
    } else {
      edgeColor = color(150, 150, 150, alpha);
    }

    stroke(edgeColor);
    strokeWeight((isHighlighted || isHovered ? 2.5 : 1) / viewZoom);
    line(x1, y1, x2, y2);

    let arrowSize = (isHighlighted || isHovered ? 9 : 6) / viewZoom;
    let angle = atan2(y2 - y1, x2 - x1);
    fill(edgeColor);
    noStroke();
    push();
    translate(x2, y2);
    rotate(angle);
    triangle(0, 0, -arrowSize, -arrowSize / 2, -arrowSize, arrowSize / 2);
    pop();
  }
}

function drawNodes() {
  hoveredNode = -1;
  let wmx = worldMouseX(), wmy = worldMouseY();

  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    let unit = units[i];

    let isHover = dist(wmx, wmy, n.x, n.y) < nodeRadius && draggedNode < 0 && !panning;
    if (isHover) hoveredNode = i;

    let isSelected = (selectedNode === i);
    let isConnected = false;

    if (selectedNode >= 0 && selectedNode !== i) {
      for (let edge of edges) {
        if ((edge.from === selectedNode + 1 && edge.to === i + 1) ||
            (edge.to === selectedNode + 1 && edge.from === i + 1)) {
          isConnected = true;
          break;
        }
      }
    }

    let isDimmed = (selectedNode >= 0 && !isSelected && !isConnected);

    let baseColor = color(categoryColors[unit.category]);
    let alpha = isDimmed ? 60 : 255;

    fill(red(baseColor), green(baseColor), blue(baseColor), alpha);
    stroke(isSelected ? '#333' : (isHover ? '#666' : 255));
    strokeWeight((isSelected ? 3 : (isHover ? 2.5 : 1.5)) / viewZoom);
    ellipse(n.x, n.y, nodeRadius * 2, nodeRadius * 2);

    fill(255, 255, 255, alpha);
    noStroke();
    textSize(9.5 / viewZoom);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text('Ch' + unit.id, n.x, n.y);
    textStyle(NORMAL);
  }
}

// Greedily wraps a single logical line into multiple lines that each fit
// within maxWidth, using the currently-set font/size for measurement.
function wrapTextLines(str, maxWidth) {
  const words = str.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (cur && textWidth(test) > maxWidth) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawHoverTooltip() {
  if (hoveredNode < 0 || draggedNode >= 0 || panning) return;

  const unit = units[hoveredNode];
  const s = toScreen(nodes[hoveredNode].x, nodes[hoveredNode].y);
  const title = 'Chapter ' + unit.id + ': ' + unit.name;
  const screenR = nodeRadius * viewZoom;
  const boxW = min(280, canvasWidth - 10);
  const innerW = boxW - 20;
  const hintStr = 'Double-click to open this chapter';

  textStyle(BOLD);
  textSize(11);
  const titleLines = wrapTextLines(title, innerW);
  textStyle(NORMAL);
  textSize(10);
  const descLines = wrapTextLines(unit.desc, innerW);
  textSize(8.5);
  const hintLines = wrapTextLines(hintStr, innerW);

  const titleLineH = 13, descLineH = 13, hintLineH = 11;
  const boxH = 10 + titleLines.length * titleLineH + 4 +
               descLines.length * descLineH + 4 +
               hintLines.length * hintLineH + 6;

  let bx = constrain(s.x - boxW / 2, 5, canvasWidth - boxW - 5);
  let by = s.y + screenR + 8;
  if (by + boxH > drawHeight - 5) by = s.y - screenR - 8 - boxH;

  fill(255, 255, 255, 250);
  stroke(categoryColors[unit.category]);
  strokeWeight(2);
  rect(bx, by, boxW, boxH, 6);

  noStroke();
  textAlign(LEFT, TOP);
  let ty = by + 8;

  fill(20);
  textStyle(BOLD);
  textSize(11);
  for (const line of titleLines) { text(line, bx + 10, ty); ty += titleLineH; }
  textStyle(NORMAL);
  ty += 4;

  fill(90);
  textSize(10);
  for (const line of descLines) { text(line, bx + 10, ty); ty += descLineH; }
  ty += 4;

  fill(150);
  textSize(8.5);
  for (const line of hintLines) { text(line, bx + 10, ty); ty += hintLineH; }
}

function drawLegend() {
  let legendX = 10;
  let dotSize = 10;
  let gap = 5;
  let rowH = 16;

  textSize(9);
  textAlign(LEFT, CENTER);

  let categories = Object.keys(categoryColors);

  let rows = 1;
  let x = legendX;
  for (let cat of categories) {
    let labelW = textWidth(categoryLabels[cat]);
    if (x + dotSize + gap + labelW + 15 > canvasWidth - 10) {
      rows++;
      x = legendX;
    }
    x += dotSize + gap + labelW + 15;
  }

  let legendY = drawHeight - 12 - rows * rowH;

  x = legendX;
  let y = legendY;
  for (let cat of categories) {
    let labelW = textWidth(categoryLabels[cat]);
    if (x + dotSize + gap + labelW + 15 > canvasWidth - 10) {
      x = legendX;
      y += rowH;
    }
    let col = color(categoryColors[cat]);
    fill(col);
    noStroke();
    ellipse(x + dotSize / 2, y + dotSize / 2, dotSize, dotSize);

    fill(80);
    text(categoryLabels[cat], x + dotSize + gap, y + dotSize / 2);

    x += dotSize + gap + labelW + 15;
  }
}

function drawInfoPanel() {
  if (selectedNode < 0) return;

  let unit = units[selectedNode];
  let panelW = 230;
  let panelH = 96;
  let panelX = canvasWidth - panelW - 10;
  let panelY = 10;

  fill(255, 255, 255, 245);
  stroke(categoryColors[unit.category]);
  strokeWeight(2);
  rect(panelX, panelY, panelW, panelH, 5);

  fill(categoryColors[unit.category]);
  noStroke();
  textSize(12);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("Ch " + unit.id + ": " + unit.name, panelX + 8, panelY + 8, panelW - 16);
  textStyle(NORMAL);

  let prereqs = [];
  let dependents = [];
  for (let edge of edges) {
    if (edge.to === unit.id) prereqs.push("Ch" + edge.from);
    if (edge.from === unit.id) dependents.push("Ch" + edge.to);
  }

  fill(80);
  textSize(10);
  text("Prereqs: " + (prereqs.length > 0 ? prereqs.join(", ") : "None"), panelX + 8, panelY + 48, panelW - 16);
  text("Leads to: " + (dependents.length > 0 ? dependents.join(", ") : "None"), panelX + 8, panelY + 66, panelW - 16);
}

function drawControlBar() {
  fill(230);
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  let btnW = 110;
  let btnH = 30;
  let btnX = canvasWidth / 2 - btnW / 2;
  let btnY = drawHeight + 8;

  let isHover = mouseX > btnX && mouseX < btnX + btnW &&
                mouseY > btnY && mouseY < btnY + btnH;

  fill(isHover ? '#1565C0' : '#2196F3');
  stroke('#0D47A1');
  strokeWeight(1);
  rect(btnX, btnY, btnW, btnH, 5);

  fill(255);
  noStroke();
  textSize(12);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("Reset Layout", btnX + btnW / 2, btnY + btnH / 2);
  textStyle(NORMAL);

  fill(110);
  textSize(10);
  textAlign(CENTER, TOP);
  // when a width is passed, (x,y) is the box's top-left corner, not its
  // center -- even with CENTER alignment -- so the box itself must be
  // positioned explicitly to stay centered on the canvas.
  text("Scroll to zoom · drag empty space to pan · double-click a chapter to open it", 10, btnY + btnH + 6, canvasWidth - 20);
}

function mousePressed() {
  let btnW = 110;
  let btnH = 30;
  let btnX = canvasWidth / 2 - btnW / 2;
  let btnY = drawHeight + 8;

  if (mouseX > btnX && mouseX < btnX + btnW &&
      mouseY > btnY && mouseY < btnY + btnH) {
    resetView();
    return;
  }

  if (mouseY >= drawHeight) return;

  const wmx = worldMouseX(), wmy = worldMouseY();
  for (let i = 0; i < nodes.length; i++) {
    if (dist(wmx, wmy, nodes[i].x, nodes[i].y) < nodeRadius) {
      draggedNode = i;
      dragOffsetX = nodes[i].x - wmx;
      dragOffsetY = nodes[i].y - wmy;

      if (selectedNode === i) {
        selectedNode = -1;
      } else {
        selectedNode = i;
      }
      return;
    }
  }

  selectedNode = -1;
  panning = true;
  panStartX = mouseX - viewPanX;
  panStartY = mouseY - viewPanY;
}

function mouseDragged() {
  if (draggedNode >= 0) {
    const wmx = worldMouseX(), wmy = worldMouseY();
    nodes[draggedNode].x = wmx + dragOffsetX;
    nodes[draggedNode].y = wmy + dragOffsetY;
    nodes[draggedNode].vx = 0;
    nodes[draggedNode].vy = 0;

    let margin = nodeRadius + 5;
    nodes[draggedNode].x = constrain(nodes[draggedNode].x, margin, canvasWidth - margin);
    nodes[draggedNode].y = constrain(nodes[draggedNode].y, margin, drawHeight - margin - 90);
  } else if (panning) {
    viewPanX = mouseX - panStartX;
    viewPanY = mouseY - panStartY;
  }
}

function mouseReleased() {
  draggedNode = -1;
  panning = false;
}

function mouseWheel(event) {
  if (mouseY >= drawHeight) return;

  const zoomFactor = event.delta > 0 ? 0.9 : 1 / 0.9;
  const wx = worldMouseX();
  const wy = worldMouseY();
  const newZoom = constrain(viewZoom * zoomFactor, 0.5, 2.5);
  viewPanX = mouseX - wx * newZoom;
  viewPanY = mouseY - wy * newZoom;
  viewZoom = newZoom;
  return false;
}

function doubleClicked() {
  if (mouseY >= drawHeight) return;

  const wmx = worldMouseX(), wmy = worldMouseY();
  for (let i = 0; i < nodes.length; i++) {
    if (dist(wmx, wmy, nodes[i].x, nodes[i].y) < nodeRadius) {
      // Resolve against this file's own (always-fixed) location rather
      // than the embedding page's location -- the same relative path
      // would otherwise land in the wrong place depending on whether
      // this iframe is embedded on the Course Description page, on this
      // sim's own index.md page, or opened standalone.
      const target = new URL('../../chapters/' + units[i].slug + '/', window.location.href).href;
      window.top.location.href = target;
      return;
    }
  }
}

function distToSegment(px, py, x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return dist(px, py, x1, y1);

  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = constrain(t, 0, 1);

  let projX = x1 + t * dx;
  let projY = y1 + t * dy;
  return dist(px, py, projX, projY);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, canvasHeight);
  initializeNodes();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}
