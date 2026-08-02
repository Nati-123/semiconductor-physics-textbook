// Semiconductor Material Selector for Applications MicroSim
// Click an application button to see which material (Si, Ge, or GaAs) is
// typically used and the engineering reasoning behind that choice.
// Bloom Level: Evaluate (L5)
// MicroSim template version 2026.02

let containerWidth;
let canvasWidth = 750;
let drawHeight = 460;
let minDrawHeight = 420;
let controlHeight = 30;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

const APPS = [
  {
    name: 'Digital Logic / Microprocessors', material: 'Silicon', col: [90, 140, 220],
    reason: 'Silicon dominates digital ICs because of its mature, low-cost fabrication ecosystem and its excellent native oxide (SiO2), which makes high-quality MOSFETs possible at massive scale.'
  },
  {
    name: 'LEDs and Laser Diodes', material: 'GaAs', col: [230, 140, 60],
    reason: 'GaAs is direct-gap, so a photon alone can drive efficient band-edge light emission — silicon\'s indirect gap makes it a poor light emitter by comparison.'
  },
  {
    name: 'Terrestrial Solar Cells', material: 'Silicon', col: [90, 140, 220],
    reason: 'Despite its indirect gap requiring thicker wafers to absorb light, silicon\'s low cost and mature manufacturing make it the dominant terrestrial solar cell material.'
  },
  {
    name: 'High-Frequency RF/Microwave', material: 'GaAs', col: [230, 140, 60],
    reason: 'GaAs\'s much higher electron mobility (~8500 cm²/V·s vs. silicon\'s ~1350) lets carriers respond fast enough for high-frequency amplifiers and RF front-ends.'
  },
  {
    name: 'Historical First Transistors (1947)', material: 'Germanium', col: [90, 180, 120],
    reason: 'The first point-contact transistors (1947) used germanium because it could be purified and processed to sufficient quality earlier than silicon, and its higher carrier mobility eased early device operation.'
  }
];

let selectedIdx = 0;
let buttons = [];

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(mainElement);
  describe('Semiconductor material selector for applications: click an application to see the recommended material (silicon, germanium, or GaAs) and the engineering reasoning', LABEL);
  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function draw() {
  updateCanvasSize();
  fill('aliceblue'); stroke('silver'); strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white'); noStroke();
  rect(0, drawHeight, canvasWidth, controlHeight);

  fill(20); noStroke();
  textAlign(CENTER, TOP); textSize(16);
  text('Choose an Application', canvasWidth / 2, 8);

  buttons = [];
  const btnW = canvasWidth - 60, btnH = 34, gap = 8;
  let y = 44;
  for (let i = 0; i < APPS.length; i++) {
    const a = APPS[i];
    const x = 30;
    const active = i === selectedIdx;
    push();
    stroke(90, 62, 237); strokeWeight(active ? 2.5 : 1);
    fill(active ? color(90, 62, 237) : color(250));
    rect(x, y, btnW, btnH, 6);
    noStroke();
    fill(active ? 255 : color(40));
    textAlign(LEFT, CENTER); textSize(13);
    text(a.name, x + 14, y + btnH / 2);
    pop();
    buttons.push({ x, y, w: btnW, h: btnH });
    y += btnH + gap;
  }

  drawResultCard(y + 6);
}

function drawResultCard(cardY) {
  const app = APPS[selectedIdx];
  const cardW = canvasWidth - 60, cardX = 30;
  const cardH = drawHeight - cardY - 12;
  noStroke();
  fill(240, 245, 255);
  stroke(168, 200, 255);
  strokeWeight(1.5);
  rect(cardX, cardY, cardW, max(90, cardH), 10);
  noStroke();
  fill(app.col[0], app.col[1], app.col[2]);
  textAlign(LEFT, TOP); textSize(16);
  text('Recommended: ' + app.material, cardX + 16, cardY + 12);
  fill(50); textSize(12.5);
  text(app.reason, cardX + 16, cardY + 38, cardW - 32);
}

function mousePressed() {
  for (let i = 0; i < buttons.length; i++) {
    const b = buttons[i];
    if (smlPointInRect(mouseX, mouseY, b.x, b.y, b.w, b.h)) {
      selectedIdx = i;
      return;
    }
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
}

function updateCanvasSize() {
  const sz = smlComputeCanvasSize(minDrawHeight, controlHeight);
  containerWidth = sz.width; canvasWidth = sz.width;
  drawHeight = sz.drawHeight; canvasHeight = sz.height; containerHeight = sz.height;
}
