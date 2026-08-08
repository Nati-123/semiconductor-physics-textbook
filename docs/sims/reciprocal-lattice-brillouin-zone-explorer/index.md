---
title: Reciprocal Lattice and Brillouin Zone Explorer
description: A two-mode MicroSim comparing a real-space lattice to its reciprocal lattice, with primitive vectors, an overlaid first Brillouin zone, optional rotation, and a Wigner-Seitz construction of the first Brillouin zone
image: /sims/reciprocal-lattice-brillouin-zone-explorer/reciprocal-lattice-brillouin-zone-explorer.png
quality_score: 85
---

<h1 style="color: #5A3EED !important; border-bottom: 3px solid #5A3EED; padding-bottom: 0.4rem; font-weight: 800;">Reciprocal Lattice and Brillouin Zone Explorer</h1>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 18px; margin: 1.2rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<iframe src="main.html" height="815px" width="100%" scrolling="auto" style="border:none; border-radius:8px; overflow:hidden;"></iframe>
</div>

<a href="../../chapters/05-quantum-mechanics-periodic-crystals/index.md" style="color: #5A3EED; font-weight: 600; font-size: 0.95rem;">&#8592; Back to Chapter 5: Quantum Mechanics of Periodic Crystals</a>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Description</h2>

<p style="color: #555; line-height: 1.85; font-size: 1.02rem; margin-bottom: 1.2rem;">
This MicroSim has two linked views. The <strong>Real vs. Reciprocal Lattice</strong> view renders a real-space 2D lattice side by side with its reciprocal lattice, each with its primitive vectors (<span class="arithmatex">\(\vec a_1,\vec a_2\)</span> and <span class="arithmatex">\(\vec b_1,\vec b_2\)</span>) drawn from a highlighted origin point, and the first Brillouin zone boundary overlaid directly on the reciprocal panel. Lattice constants <span class="arithmatex">\(a_x, a_y\)</span> (in nanometers) are independently adjustable, an optional rotation slider turns both lattices together, and numerical real-space and reciprocal-space spacing values (in both nm<sup>-1</sup> and m<sup>-1</sup>) update live and animate smoothly, making the inverse relationship <span class="arithmatex">\(2\pi/a\)</span> directly visible rather than just stated. The <strong>Wigner-Seitz Construction</strong> view zooms in on the first Brillouin zone construction itself — drawing the perpendicular bisector lines to the nearest reciprocal lattice points and shading the enclosed region — with a small real-space Wigner-Seitz inset for direct comparison to Chapter 3's primitive-cell construction.
</p>

<div style="background: #FFF7DD; border: 2px solid #F0D87A; border-radius: 10px; padding: 20px 24px; margin: 1.2rem 0;">
<p style="color: #B8860B; font-weight: 700; font-size: 1.05rem; margin-top: 0; margin-bottom: 12px;">Key Features</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Primitive vectors</strong> a₁, a₂ and reciprocal vectors b₁, b₂ drawn from a highlighted origin, with nearest-neighbor lattice points highlighted</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>First Brillouin zone boundary</strong> overlaid directly on the reciprocal lattice panel, not just in a separate view</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Independently adjustable a_x, a_y</strong> (nm) plus an optional rotation slider that turns both lattices together</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Live numerical readout</strong> of real-space and reciprocal-space spacing in nm⁻¹ and m⁻¹, animated toward each new value</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Wigner-Seitz construction</strong> with dashed perpendicular-bisector lines, a shaded first Brillouin zone, and a real-space comparison inset</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Responsive canvas</strong> that resizes with the browser window</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">How to Use</h2>

<ol style="padding-left: 1.2rem; margin: 0.8rem 0 1.2rem 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">In "Real vs. Reciprocal Lattice" view,</strong> drag a_x and watch the numerical readout and reciprocal spacing shrink together as real-space spacing grows</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Select "Rectangular lattice"</strong> and stretch a_x independently of a_y</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Drag the rotation slider</strong> and confirm the primitive vectors, reciprocal vectors, and Brillouin zone all rotate together</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Switch to "Wigner-Seitz Construction"</strong> and compare the real-space inset to the reciprocal-space construction</li>
</ol>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Learning Objectives</h2>

<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(56,142,60,0.08);">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0; margin-bottom: 6px;">Bloom Level: Understand / Apply (L2-L3) &nbsp;|&nbsp; Bloom Verb: Compare, Construct, Predict</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0.6rem;">After using this MicroSim, students will be able to:</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Compute reciprocal lattice spacing from a real-space lattice constant</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Predict how an anisotropic real-space lattice affects the reciprocal lattice and Brillouin zone shape</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Construct the first Brillouin zone from a reciprocal lattice using the Wigner-Seitz procedure</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">References</h2>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Reciprocal_lattice" style="color: #5A3EED; font-weight: 600;">Reciprocal Lattice</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Brillouin_zone" style="color: #5A3EED; font-weight: 600;">Brillouin Zone</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Wigner%E2%80%93Seitz_cell" style="color: #5A3EED; font-weight: 600;">Wigner-Seitz Cell</a> — Wikipedia</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="../../chapters/05-quantum-mechanics-periodic-crystals/index.md" style="color: #5A3EED; font-weight: 600;">Chapter 5: Quantum Mechanics of Periodic Crystals</a> — this textbook</li>
</ul>
</div>
