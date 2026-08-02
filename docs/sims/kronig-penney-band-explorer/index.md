---
title: Kronig-Penney Band Formation Explorer
description: A two-mode MicroSim plotting the Kronig-Penney transcendental equation with shaded forbidden band gaps, and the resulting E-k band diagram with Brillouin zone boundaries marked
image: /sims/kronig-penney-band-explorer/kronig-penney-band-explorer.png
quality_score: 85
---

<h1 style="color: #5A3EED !important; border-bottom: 3px solid #5A3EED; padding-bottom: 0.4rem; font-weight: 800;">Kronig-Penney Band Formation Explorer</h1>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 18px; margin: 1.2rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<iframe src="main.html" height="660px" width="100%" scrolling="auto" style="border:none; border-radius:8px; overflow:hidden;"></iframe>
</div>

<a href="../../chapters/05-quantum-mechanics-periodic-crystals/index.md" style="color: #5A3EED; font-weight: 600; font-size: 0.95rem;">&#8592; Back to Chapter 5: Quantum Mechanics of Periodic Crystals</a>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Description</h2>

<p style="color: #555; line-height: 1.85; font-size: 1.02rem; margin-bottom: 1.2rem;">
This MicroSim has two linked views of the same underlying Kronig-Penney transcendental equation, <span class="arithmatex">\(P\sin(\alpha a)/(\alpha a)+\cos(\alpha a)=\cos(ka)\)</span>. The <strong>Transcendental Equation</strong> view plots the left-hand side directly against <span class="arithmatex">\(x=\alpha a\)</span> (proportional to <span class="arithmatex">\(\sqrt{E}\)</span>), shading in red every region where the curve exceeds <span class="arithmatex">\(\pm1\)</span> — these shaded regions are exactly the forbidden band gaps, since no real Bloch wavevector <span class="arithmatex">\(k\)</span> can produce a cosine outside that range. The <strong>E-k Diagram</strong> view inverts the same equation (using <span class="arithmatex">\(\arccos\)</span>, with no iterative root-finding required) to plot the resulting allowed energy bands directly against <span class="arithmatex">\(k\)</span>, with Brillouin zone boundaries marked as dashed vertical lines, making visible the chapter's central result: band gaps open exactly at those boundaries.
</p>

<div style="background: #FFF7DD; border: 2px solid #F0D87A; border-radius: 10px; padding: 20px 24px; margin: 1.2rem 0;">
<p style="color: #B8860B; font-weight: 700; font-size: 1.05rem; margin-top: 0; margin-bottom: 12px;">Key Features</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Two linked views</strong> of the same equation: raw transcendental plot and E-k band diagram</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Live-shaded forbidden regions</strong> wherever <span class="arithmatex">\(|{\rm LHS}|>1\)</span></li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Adjustable barrier strength P</strong> spanning the free-electron limit (P=0) to strongly gapped bands</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Brillouin zone boundaries</strong> marked in both views for direct visual correlation</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Responsive canvas</strong> that resizes with the browser window</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">How to Use</h2>

<ol style="padding-left: 1.2rem; margin: 0.8rem 0 1.2rem 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Drag P to 0</strong> in "Transcendental Equation" view and confirm all shading disappears</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Increase P</strong> and watch the forbidden (shaded) regions widen around each zone boundary</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Switch to "E-k Diagram"</strong> and confirm the band-curve gaps line up with the same zone boundaries</li>
</ol>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Learning Objectives</h2>

<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(56,142,60,0.08);">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0; margin-bottom: 6px;">Bloom Level: Understand / Analyze (L2-L4) &nbsp;|&nbsp; Bloom Verb: Interpret, Predict, Analyze</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0.6rem;">After using this MicroSim, students will be able to:</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Interpret the Kronig-Penney transcendental equation and identify forbidden energy regions directly from its plot</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Predict how increasing barrier strength affects band gap width</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Analyze an E-k band diagram to locate band gaps relative to Brillouin zone boundaries</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">References</h2>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Particle_in_a_one-dimensional_lattice_(periodic_potential)" style="color: #5A3EED; font-weight: 600;">Kronig-Penney Model</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Bloch%27s_theorem" style="color: #5A3EED; font-weight: 600;">Bloch's Theorem</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Electronic_band_structure" style="color: #5A3EED; font-weight: 600;">Electronic Band Structure</a> — Wikipedia</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="../../chapters/05-quantum-mechanics-periodic-crystals/index.md" style="color: #5A3EED; font-weight: 600;">Chapter 5: Quantum Mechanics of Periodic Crystals</a> — this textbook</li>
</ul>
</div>
