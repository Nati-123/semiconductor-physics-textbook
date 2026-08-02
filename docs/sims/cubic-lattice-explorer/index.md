---
title: Crystal Structure Explorer
description: Rotatable 3D viewer covering all nine major crystal structures in solid-state and semiconductor physics -- SC, BCC, FCC, HCP, Diamond Cubic, Zinc Blende, Rock Salt, Cesium Chloride, and Wurtzite -- with live crystal-system, basis, coordination-number, and packing-factor readouts
image: /sims/cubic-lattice-explorer/cubic-lattice-explorer.png
quality_score: 90
---

<h1 style="color: #5A3EED !important; border-bottom: 3px solid #5A3EED; padding-bottom: 0.4rem; font-weight: 800;">Crystal Structure Explorer</h1>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 18px; margin: 1.2rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<iframe src="main.html" height="820px" width="100%" scrolling="auto" style="border:none; border-radius:8px; overflow:hidden;"></iframe>
</div>

<a href="../../chapters/03-crystal-lattices-structures/index.md" style="color: #5A3EED; font-weight: 600; font-size: 0.95rem;">&#8592; Back to Chapter 3: Crystal Lattices and Structures</a>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Description</h2>

<p style="color: #555; line-height: 1.85; font-size: 1.02rem; margin-bottom: 1.2rem;">
This MicroSim renders a fully rotatable, pannable, and zoomable 3D model of one conventional unit cell for each of the nine crystal structures most important to solid-state and semiconductor physics: <strong>Simple Cubic (SC)</strong>, <strong>Body-Centered Cubic (BCC)</strong>, <strong>Face-Centered Cubic (FCC)</strong>, <strong>Hexagonal Close-Packed (HCP)</strong>, <strong>Diamond Cubic</strong>, <strong>Zinc Blende</strong>, <strong>Rock Salt (NaCl)</strong>, <strong>Cesium Chloride (CsCl)</strong>, and <strong>Wurtzite</strong>. A dropdown switches between structures; atoms are drawn at their correct fractional positions with correct sharing/coordination, compound structures use a distinct color per species with a legend, and a live readout panel reports crystal system, Bravais lattice and basis, atoms per conventional cell, coordination number, nearest-neighbor distance, atomic packing factor, example materials, and semiconductor relevance for whichever structure is selected.
</p>

<p style="color: #555; line-height: 1.85; font-size: 1.02rem; margin-bottom: 1.2rem;">
This tool was expanded from an earlier "Cubic Lattice Explorer" that covered only SC, BCC, and FCC. Because HCP and the two hexagonal-family structures (Wurtzite) are not cubic, the tool and its title were generalized to <strong>Crystal Structure Explorer</strong> to accurately describe its full scope.
</p>

<div style="background: #FFF7DD; border: 2px solid #F0D87A; border-radius: 10px; padding: 20px 24px; margin: 1.2rem 0;">
<p style="color: #B8860B; font-weight: 700; font-size: 1.05rem; margin-top: 0; margin-bottom: 12px;">Key Features</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Nine structures</strong> in one tool: SC, BCC, FCC, HCP, Diamond Cubic, Zinc Blende, Rock Salt, CsCl, and Wurtzite</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Free 3D orbit, pan, and zoom</strong> via p5.js <span class="arithmatex">\(\texttt{orbitControl()}\)</span> — left-drag to rotate, right-drag to pan, scroll to zoom</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Color-coded species</strong> with a legend for every compound structure (Zinc Blende, Rock Salt, CsCl, Wurtzite)</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Toggleable atom labels, unit-cell edges, nearest-neighbor bonds, and primitive-vs-conventional cell</strong> so students can isolate exactly one variable at a time</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Adjustable atom size</strong> and a <strong>Reset Camera</strong> button</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Miller-index plane (h k l) and direction [u v w] overlay</strong> for the six cubic structures</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Fullscreen mode</strong> for closer inspection on smaller screens</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Live readout panel</strong> reporting crystal system, Bravais lattice/basis, atoms per cell, coordination number, nearest-neighbor distance, packing factor, examples, and semiconductor relevance</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Structure Reference Table</h2>

<p style="color: #555; line-height: 1.85; font-size: 1.02rem;">All lattice-parameter relationships below use <span class="arithmatex">\(a\)</span> for the cubic lattice constant and <span class="arithmatex">\(c\)</span> for the hexagonal out-of-plane constant (ideal <span class="arithmatex">\(c/a=\sqrt{8/3}\approx1.633\)</span>).</p>

| Structure | Crystal system | Bravais lattice + basis | Atoms/cell | Coord. number | Nearest-neighbor distance | Packing factor | Example materials |
|---|---|---|---|---|---|---|---|
| Simple Cubic (SC) | Cubic | Simple cubic (P); 1 atom at (0,0,0) | 1 | 6 | \(a\) | 0.524 | Polonium |
| Body-Centered Cubic (BCC) | Cubic | Body-centered cubic (I); (0,0,0) + (½,½,½) | 2 | 8 | \(\tfrac{\sqrt3}{2}a\) | 0.680 | α-Fe, Cr, W, Na |
| Face-Centered Cubic (FCC) | Cubic | Face-centered cubic (F); (0,0,0) + 3 face centers | 4 | 12 | \(\tfrac{a}{\sqrt2}\) | 0.740 | Al, Cu, Au, Ag |
| Hexagonal Close-Packed (HCP) | Hexagonal | Simple hexagonal + 2-atom basis, ABAB stacking | 6 | 12 | \(a\) | 0.740 | Mg, Zn, Ti, Co, Be |
| Diamond Cubic | Cubic | FCC + 2-atom basis (0,0,0), (¼,¼,¼), same element | 8 | 4 | \(\tfrac{\sqrt3}{4}a\) | 0.340 | Si (a=0.543 nm), Ge (a=0.566 nm), C |
| Zinc Blende | Cubic | FCC + 2-atom basis (0,0,0), (¼,¼,¼), two species | 8 | 4 | \(\tfrac{\sqrt3}{4}a\) | varies with ionic/atomic radii | GaAs (a=0.565 nm), GaP, InP, InAs, ZnS |
| Rock Salt (NaCl) | Cubic | Two interpenetrating FCC lattices offset by (½,0,0)a | 8 | 6 | \(\tfrac{a}{2}\) | varies with ionic radii | NaCl, MgO |
| Cesium Chloride (CsCl) | Cubic | Simple cubic (P) + 2-atom basis (0,0,0), (½,½,½), two species | 2 | 8 | \(\tfrac{\sqrt3}{2}a\) | varies with ionic radii | CsCl, CsBr, CsI |
| Wurtzite | Hexagonal | Two HCP-type sublattices offset along c by u (ideal u=3/8), two species | 12 | 4 | \(u\cdot c \approx 0.612a\) | varies with ionic/atomic radii | GaN, AlN, ZnO, CdS |

<div style="background: #FDEDEC; border: 2px solid #F1948A; border-radius: 12px; padding: 20px 24px; margin: 1.2rem 0;">
<p style="color: #B03A2E; font-weight: 700; font-size: 1.05rem; margin-top: 0; margin-bottom: 12px;">Special Focus: Diamond Cubic and Zinc Blende</p>
<p style="color: #333; line-height: 1.8; margin-bottom: 0.8rem;">These two structures are geometrically identical — both are built from two interpenetrating FCC sublattices offset by <span class="arithmatex">\((1/4,1/4,1/4)a\)</span> along the body diagonal, giving every atom exactly 4 nearest neighbors arranged tetrahedrally (coordination number 4, far lower than the 12 of a simple FCC lattice). The <em>only</em> difference is chemistry:</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #B03A2E; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Diamond Cubic</strong> places the <em>same</em> element on both sublattices. <strong>Silicon</strong> and <strong>germanium</strong> — the two workhorse elemental semiconductors — both crystallize this way, with covalent Si&ndash;Si or Ge&ndash;Ge bonds arranged tetrahedrally.</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #B03A2E; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Zinc Blende</strong> places <em>two different</em> elements, one per sublattice. <strong>GaAs</strong> is the canonical example — most III&ndash;V compound semiconductors (GaAs, GaP, InP, InAs) used in LEDs, laser diodes, solar cells, and high-frequency transistors adopt this structure. The two-species arrangement breaks the inversion symmetry that pure Diamond Cubic has, which is why compound semiconductors can be piezoelectric while silicon and germanium cannot.</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">How to Use</h2>

<ol style="padding-left: 1.2rem; margin: 0.8rem 0 1.2rem 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Choose a structure</strong> from the Crystal structure dropdown (9 options, grouped from simplest to most complex)</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Left-click and drag</strong> to orbit the structure; <strong>right-click and drag</strong> to pan; <strong>scroll or pinch</strong> to zoom</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Toggle</strong> atom labels, unit-cell edges, nearest-neighbor bonds, and the primitive-cell overlay to isolate what you want to inspect</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Enable the plane/direction overlay</strong> and enter Miller indices (h k l) or a direction [u v w] to see crystallographic planes and directions for the cubic structures</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Use Reset Camera</strong> to return to the default view, or the fullscreen button (top-right of the canvas) to enlarge the whole tool</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Read the panel</strong> below the canvas for crystal system, Bravais lattice/basis, atoms per cell, coordination number, nearest-neighbor distance, packing factor, examples, and semiconductor relevance</li>
</ol>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Learning Objectives</h2>

<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(56,142,60,0.08);">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0; margin-bottom: 6px;">Bloom Level: Understand / Apply / Analyze (L2-L4) &nbsp;|&nbsp; Bloom Verb: Identify, Calculate, Compare, Explain</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0.6rem;">After using this MicroSim, students will be able to:</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Identify the atom positions that define all nine major crystal structures used in solid-state and semiconductor physics</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Calculate atoms per unit cell using corner, face, edge, and body-center sharing fractions</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Compare coordination number and atomic packing factor across cubic, hexagonal, and compound structures</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Explain why Silicon and Germanium adopt Diamond Cubic while III&ndash;V compounds such as GaAs adopt the geometrically identical Zinc Blende structure</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Distinguish a true Bravais lattice from a lattice-plus-basis description, using CsCl (Simple Cubic + 2-atom basis, not BCC) as a concrete counterexample</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Lesson Plan</h2>

<h3 style="color: #5A3EED; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.6rem;">Before the Simulation (5 minutes)</h3>

<ul style="list-style: none; padding-left: 0.8rem; margin: 0.5rem 0 1rem 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.5rem;">&#9679;</span> Review unit cell, lattice constant, basis, and coordination number from the chapter</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.5rem;">&#9679;</span> Ask students to predict which structures pack atoms most and least efficiently</li>
</ul>

<h3 style="color: #5A3EED; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.6rem;">During the Simulation (15 minutes)</h3>

<ol style="padding-left: 1.2rem; margin: 0.5rem 0 1rem 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;">Cycle through SC → BCC → FCC → HCP and record atoms/cell, coordination number, and packing factor for each</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;">Switch to Diamond Cubic, enable bonds, and count the 4 tetrahedral bonds leaving an interior atom; compare to FCC's coordination of 12</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;">Switch to Zinc Blende and observe that every bond connects a blue and an orange atom, never two of the same color</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;">Compare Rock Salt (CN=6, octahedral) and CsCl (CN=8, cubic) to Zinc Blende (CN=4, tetrahedral) to see how coordination geometry differs by structure</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;">Switch to Wurtzite (GaN) and compare its two-sublattice hexagonal geometry to plain HCP</li>
</ol>

<h3 style="color: #5A3EED; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.6rem;">After the Simulation (5 minutes)</h3>

<ul style="list-style: none; padding-left: 0.8rem; margin: 0.5rem 0 1rem 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.5rem;">&#9679;</span> Have students derive the packing-fraction formulas for SC, BCC, and FCC on paper and compare to the readout values</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.5rem;">&#9679;</span> Discuss why silicon (Diamond Cubic) and GaAs (Zinc Blende) share identical geometry but different electrical and optical properties, previewing the covalent-bonding discussion in Chapter 4</li>
</ul>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">References</h2>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Cubic_crystal_system" style="color: #5A3EED; font-weight: 600;">Cubic Crystal System</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Close-packing_of_equal_spheres" style="color: #5A3EED; font-weight: 600;">Close-Packing of Equal Spheres</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Diamond_cubic" style="color: #5A3EED; font-weight: 600;">Diamond Cubic Crystal Structure</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Zincblende_crystal_structure" style="color: #5A3EED; font-weight: 600;">Zinc Blende Crystal Structure</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Rock_salt_structure" style="color: #5A3EED; font-weight: 600;">Rock Salt (NaCl) Structure</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Wurtzite_crystal_structure" style="color: #5A3EED; font-weight: 600;">Wurtzite Crystal Structure</a> — Wikipedia</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="../../chapters/03-crystal-lattices-structures/index.md" style="color: #5A3EED; font-weight: 600;">Chapter 3: Crystal Lattices and Structures</a> — this textbook</li>
</ul>
</div>
