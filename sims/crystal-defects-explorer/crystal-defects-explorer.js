// Crystal Defects Explorer MicroSim
// Zooms in on a small neighborhood of an otherwise-perfect lattice to show
// exactly one of the chapter's three point defect types at a time --
// vacancy, interstitial, or substitutional -- large and unambiguous. This
// complements the Bonding and Crystal Order Explorer, whose "Show defects"
// toggle scatters all three defects thinly across a large 7x7 grid for a
// quick side-by-side comparison; this sim's job is a close, one-at-a-time
// look with the mechanism spelled out for each type, tied directly to this
// chapter's Worked Examples 7 and 8. The chapter's own defect table lists
// only these three types (no Frenkel pairing), so this sim is scoped to
// match.
// Bloom Level: Understand / Apply (L2-L3)
// MicroSim template version 2026.02 (2D static/interactive variant)

let containerWidth;
let drawHeight = 380;

let typeSelect;
let readoutDiv;

const GRID_N = 5; // odd, so there is a true center cell
const MID = Math.floor(GRID_N / 2);

const DEFECTS = {
  Vacancy: {
    tagline: 'A lattice site where an atom is simply missing.',
    detail: 'The site that should hold a host atom is empty. Every neighboring bond that used to reach this site is now broken, locally raising the crystal\'s energy. (Chapter 4, Worked Example 8.)'
  },
  Interstitial: {
    tagline: 'An extra atom squeezed into the space between regular lattice sites.',
    detail: 'This atom does not belong to the regular lattice pattern at all -- it is wedged into a gap between correctly-occupied sites, straining the surrounding bonds outward.'
  },
  Substitutional: {
    tagline: 'A foreign atom occupying a regular lattice site in place of the host atom.',
    detail: 'The site itself is filled, just by the wrong element -- for example, a phosphorus atom sitting where a silicon atom belongs. (Chapter 4, Worked Example 7.) This is also exactly the mechanism used deliberately in doping (Chapter 8).'
  }
};

function setup() {
  updateCanvasSize();
  const mainElement = document.querySelector('main');

  const canvas = createCanvas(containerWidth, drawHeight);
  canvas.parent(mainElement);

  const controlPanel = createDiv('');
  controlPanel.class('control-panel');
  controlPanel.parent(mainElement);

  const wrap = createDiv('');
  wrap.class('slider-field');
  wrap.parent(controlPanel);
  const label = createSpan('Defect type:');
  label.class('ctrl-label');
  label.parent(wrap);

  typeSelect = createSelect();
  typeSelect.option('Vacancy');
  typeSelect.option('Interstitial');
  typeSelect.option('Substitutional');
  typeSelect.selected('Vacancy');
  typeSelect.parent(wrap);
  typeSelect.changed(updateReadout);
  typeSelect.attribute('aria-label', 'Defect type selector');

  readoutDiv = createDiv('');
  readoutDiv.class('readout-panel');
  readoutDiv.parent(mainElement);

  updateReadout();

  describe('A zoomed-in view of a small atomic grid showing one point defect at a time -- vacancy, interstitial, or substitutional -- selected from a dropdown, each with an explanation of how it disrupts the perfect lattice', LABEL);

  setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
}

function updateReadout() {
  const kind = typeSelect.value();
  const info = DEFECTS[kind];
  let html = '<div class="readout-row"><strong>' + kind + ' defect:</strong> ' + info.tagline + '</div>';
  html += '<div class="readout-row">' + info.detail + '</div>';
  readoutDiv.html(html);
}

function draw() {
  background(255);
  const kind = typeSelect.value();

  const margin = 30;
  const smallText = containerWidth < 500;
  const titleH = smallText ? 30 : 36;

  fill(20);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(smallText ? 15 : 18);
  text(kind + ' Defect', containerWidth / 2, 8);

  const captionReserve = smallText ? 58 : 50;
  const gx0 = margin, gx1 = containerWidth - margin;
  const gy0 = titleH + 10, gy1 = drawHeight - captionReserve;

  // lattice grid lines
  stroke(190);
  strokeWeight(1);
  for (let r = 0; r < GRID_N; r++) {
    const y = lerp(gy0, gy1, r / (GRID_N - 1));
    line(gx0, y, gx1, y);
  }
  for (let c = 0; c < GRID_N; c++) {
    const x = lerp(gx0, gx1, c / (GRID_N - 1));
    line(x, gy0, x, gy1);
  }

  const atomR = min((gx1 - gx0) / GRID_N, (gy1 - gy0) / GRID_N) * 0.36;

  for (let r = 0; r < GRID_N; r++) {
    for (let c = 0; c < GRID_N; c++) {
      const x = lerp(gx0, gx1, c / (GRID_N - 1));
      const y = lerp(gy0, gy1, r / (GRID_N - 1));
      const isCenter = (r === MID && c === MID);

      if (isCenter && kind === 'Vacancy') {
        drawVacancy(x, y, atomR);
      } else if (isCenter && kind === 'Substitutional') {
        drawAtom(x, y, atomR, '#2E7D32', 'P');
      } else {
        drawAtom(x, y, atomR, '#5A3EED', null);
      }
    }
  }

  if (kind === 'Interstitial') {
    // squeezed between the center cell and its lower-right neighbor
    const x0 = lerp(gx0, gx1, MID / (GRID_N - 1));
    const y0 = lerp(gy0, gy1, MID / (GRID_N - 1));
    const x1 = lerp(gx0, gx1, (MID + 1) / (GRID_N - 1));
    const y1 = lerp(gy0, gy1, (MID + 1) / (GRID_N - 1));
    drawAtom((x0 + x1) / 2, (y0 + y1) / 2, atomR * 0.7, '#E67E22', null);
  }

  drawWrappedCaption(smallText ? 11 : 12);
}

function drawAtom(x, y, r, col, label) {
  noStroke();
  fill(col);
  circle(x, y, r * 2);
  if (label) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(r * 0.8);
    text(label, x, y);
  }
}

function drawVacancy(x, y, r) {
  noFill();
  stroke(180, 60, 60);
  strokeWeight(2.5);
  drawingContext.setLineDash([5, 4]);
  circle(x, y, r * 2);
  drawingContext.setLineDash([]);
  noStroke();
  fill(180, 60, 60);
  textAlign(CENTER, CENTER);
  textSize(r * 1.1);
  text('×', x, y);
}

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

function drawWrappedCaption(fs) {
  const kind = typeSelect.value();
  const captions = {
    Vacancy: 'The red dashed circle marks the empty site -- an atom that should be here is missing.',
    Interstitial: 'The small orange atom is squeezed into a gap between regular sites -- it is not part of the normal pattern.',
    Substitutional: 'The green "P" atom occupies a regular site, replacing the host atom that normally belongs there.'
  };
  const maxW = containerWidth - 60;
  textSize(fs);
  const lines = wrapTextLines(captions[kind], maxW);
  const lineH = fs + 5;
  noStroke();
  fill(90);
  textAlign(CENTER, TOP);
  const startY = drawHeight - lines.length * lineH - 6;
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], containerWidth / 2, startY + i * lineH);
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, drawHeight);
}

function updateCanvasSize() {
  const mainEl = document.querySelector('main');
  containerWidth = Math.floor(mainEl.getBoundingClientRect().width);
  drawHeight = containerWidth < 500 ? 340 : 380;
}
