// Course Integration Map MicroSim
// Force-directed graph showing prerequisite connections between all 20
// chapters of this course, drawn from each chapter's own "Prerequisites"
// section. Adapted from the EE2301 textbook's Course Integration Map.

let containerWidth;
let canvasWidth = 400;
let drawHeight = 620;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;

// Chapter definitions
let units = [
  { id: 1,  name: "Physics and Math Foundations",                    category: "foundations" },
  { id: 2,  name: "Quantum Mechanics Foundations",                   category: "foundations" },
  { id: 3,  name: "Crystal Lattices and Structures",                 category: "structure" },
  { id: 4,  name: "Chemical Bonding in Semiconductor Crystals",      category: "structure" },
  { id: 5,  name: "Quantum Mechanics of Periodic Crystals",          category: "structure" },
  { id: 6,  name: "Band Structure and the Fermi Level",              category: "structure" },
  { id: 7,  name: "Intrinsic and Extrinsic Semiconductors",          category: "carriers" },
  { id: 8,  name: "Doping, Ionization, and Temperature Regimes",     category: "carriers" },
  { id: 9,  name: "Carrier Concentration Statistics",                category: "carriers" },
  { id: 10, name: "Fermi Level Position and Carrier Equations",      category: "carriers" },
  { id: 11, name: "Drift Current and Carrier Mobility",              category: "transport" },
  { id: 12, name: "Diffusion and Advanced Transport Phenomena",      category: "transport" },
  { id: 13, name: "Non-Equilibrium Carriers and Recombination",      category: "transport" },
  { id: 14, name: "The P-N Junction at Equilibrium",                 category: "transport" },
  { id: 15, name: "The P-N Junction Under Bias",                     category: "transport" },
  { id: 16, name: "Metal-Semiconductor and MOS Junctions",           category: "transport" },
  { id: 17, name: "Optical and Thermal Properties",                  category: "devices" },
  { id: 18, name: "Semiconductor Devices and Applications",          category: "devices" },
  { id: 19, name: "Semiconductor Device Fabrication",                category: "devices" },
  { id: 20, name: "Advanced Devices and Emerging Technologies",      category: "devices" }
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

// Category colors
let categoryColors = {
  foundations: '#2196F3',  // blue
  structure:   '#4CAF50',  // green
  carriers:    '#FF9800',  // orange
  transport:   '#9C27B0',  // purple
  devices:     '#F44336'   // red
};

let categoryLabels = {
  foundations: 'Foundations (Ch 1-2)',
  structure:   'Structure & Bands (Ch 3-6)',
  carriers:    'Carrier Statistics (Ch 7-10)',
  transport:   'Transport & Junctions (Ch 11-16)',
  devices:     'Devices & Applications (Ch 17-20)'
};

// Physics simulation
let nodes = [];
let nodeRadius = 18;

// Interaction state
let selectedNode = -1;
let draggedNode = -1;
let hoveredNode = -1;
let hoveredEdge = -1;
let dragOffsetX = 0;
let dragOffsetY = 0;

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
  describe('Force-directed graph showing prerequisite relationships between all 20 chapters of this course', LABEL);
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

function draw() {
  updateCanvasSize();
  background(245);

  if (!initialized) {
    initializeNodes();
  }

  applyForces();
  updatePositions();

  drawEdges();
  drawNodes();
  drawLegend();
  drawInfoPanel();
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
  // progression through the course
  for (let i = 0; i < nodes.length; i++) {
    let tier = getTier(i + 1);
    let targetY = cy - 260 + tier * 130;
    nodes[i].fy += (targetY - nodes[i].y) * 0.0015;
  }
}

function getTier(chapterId) {
  if (chapterId <= 2) return 0;
  if (chapterId <= 6) return 1;
  if (chapterId <= 10) return 2;
  if (chapterId <= 16) return 3;
  return 4;
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
    n.y = constrain(n.y, margin, drawHeight - margin - 66);
  }
}

function drawEdges() {
  // First pass: compute each edge's on-screen endpoints and find the single
  // closest edge under the mouse (not just the last one checked), so at
  // most one tooltip ever renders even when many edges cross near the
  // cursor.
  let endpoints = [];
  hoveredEdge = -1;
  let bestDist = 8;

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

    let edgeDist = distToSegment(mouseX, mouseY, x1, y1, x2, y2);
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
    let isHovered = (hoveredEdge === ei);

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
    strokeWeight(isHighlighted || isHovered ? 2.5 : 1);
    line(x1, y1, x2, y2);

    let arrowSize = isHighlighted || isHovered ? 9 : 6;
    let angle = atan2(y2 - y1, x2 - x1);
    fill(edgeColor);
    noStroke();
    push();
    translate(x2, y2);
    rotate(angle);
    triangle(0, 0, -arrowSize, -arrowSize / 2, -arrowSize, arrowSize / 2);
    pop();

    if (isHovered) {
      let midX = (x1 + x2) / 2;
      let midY = (y1 + y2) / 2;
      let tooltipText = "Ch" + edge.from + " -> Ch" + edge.to;

      fill(0, 0, 0, 200);
      noStroke();
      let tw = textWidth(tooltipText) + 16;
      rect(midX - tw / 2, midY - 22, tw, 20, 4);

      fill(255);
      textSize(10);
      textAlign(CENTER, CENTER);
      text(tooltipText, midX, midY - 12);
    }
  }
}

function drawNodes() {
  hoveredNode = -1;

  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    let unit = units[i];

    let isHover = dist(mouseX, mouseY, n.x, n.y) < nodeRadius;
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
    strokeWeight(isSelected ? 3 : (isHover ? 2.5 : 1.5));
    ellipse(n.x, n.y, nodeRadius * 2, nodeRadius * 2);

    fill(255, 255, 255, alpha);
    noStroke();
    textSize(11);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(unit.id, n.x, n.y);
    textStyle(NORMAL);

    if ((isHover || isSelected) && !isDimmed) {
      fill(0, 0, 0, 190);
      noStroke();
      textSize(10);
      let nameW = min(textWidth(unit.name) + 12, 220);
      rect(n.x - nameW / 2, n.y + nodeRadius + 4, nameW, 18, 4);

      fill(255);
      textSize(10);
      textAlign(CENTER, CENTER);
      text(unit.name, n.x, n.y + nodeRadius + 13, nameW - 6);
    }
  }
}

function drawLegend() {
  let legendX = 10;
  let dotSize = 10;
  let gap = 5;
  let rowH = 16;

  textSize(9);
  textAlign(LEFT, CENTER);

  let categories = Object.keys(categoryColors);

  // First pass: simulate wrapping to count how many rows are needed, so
  // the legend can be anchored to the bottom of the draw area without
  // ever overflowing into the control bar, regardless of canvas width.
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

  // Second pass: draw using the same wrapping logic.
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
  let panelW = 220;
  let panelH = 90;
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
  text("Prereqs: " + (prereqs.length > 0 ? prereqs.join(", ") : "None"), panelX + 8, panelY + 46, panelW - 16);
  text("Leads to: " + (dependents.length > 0 ? dependents.join(", ") : "None"), panelX + 8, panelY + 64, panelW - 16);
}

function drawControlBar() {
  fill(230);
  noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  let btnW = 110;
  let btnH = 30;
  let btnX = canvasWidth / 2 - btnW / 2;
  let btnY = drawHeight + 10;

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
}

function mousePressed() {
  let btnW = 110;
  let btnH = 30;
  let btnX = canvasWidth / 2 - btnW / 2;
  let btnY = drawHeight + 10;

  if (mouseX > btnX && mouseX < btnX + btnW &&
      mouseY > btnY && mouseY < btnY + btnH) {
    initializeNodes();
    selectedNode = -1;
    return;
  }

  for (let i = 0; i < nodes.length; i++) {
    if (dist(mouseX, mouseY, nodes[i].x, nodes[i].y) < nodeRadius) {
      draggedNode = i;
      dragOffsetX = nodes[i].x - mouseX;
      dragOffsetY = nodes[i].y - mouseY;

      if (selectedNode === i) {
        selectedNode = -1;
      } else {
        selectedNode = i;
      }
      return;
    }
  }

  if (mouseY < drawHeight) {
    selectedNode = -1;
  }
}

function mouseDragged() {
  if (draggedNode >= 0) {
    nodes[draggedNode].x = mouseX + dragOffsetX;
    nodes[draggedNode].y = mouseY + dragOffsetY;
    nodes[draggedNode].vx = 0;
    nodes[draggedNode].vy = 0;

    let margin = nodeRadius + 5;
    nodes[draggedNode].x = constrain(nodes[draggedNode].x, margin, canvasWidth - margin);
    nodes[draggedNode].y = constrain(nodes[draggedNode].y, margin, drawHeight - margin - 66);
  }
}

function mouseReleased() {
  draggedNode = -1;
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
