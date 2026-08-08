---
title: Bond Energy vs. Atomic Separation Explorer
description: An interactive potential-energy-versus-separation graph decomposing a bond into attractive and repulsive components, with adjustable equilibrium separation and bond energy
image: /sims/bond-energy-separation-explorer/bond-energy-separation-explorer.png
quality_score: 80
---

<h1 style="color: #5A3EED !important; border-bottom: 3px solid #5A3EED; padding-bottom: 0.4rem; font-weight: 800;">Bond Energy vs. Atomic Separation Explorer</h1>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 18px; margin: 1.2rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<iframe src="main.html" height="810px" width="100%" scrolling="auto" style="border:none; border-radius:8px; overflow:hidden;"></iframe>
</div>

<a href="../../chapters/04-chemical-bonding-crystals/index.md" style="color: #5A3EED; font-weight: 600; font-size: 0.95rem;">&#8592; Back to Chapter 4: Chemical Bonding in Semiconductor Crystals</a>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Description</h2>

<p style="color: #555; line-height: 1.85; font-size: 1.02rem; margin-bottom: 1.2rem;">
This MicroSim graphs the total bonding potential energy <span class="arithmatex">\(U(r)\)</span> as a function of the separation <span class="arithmatex">\(r\)</span> between two atoms, decomposed into a longer-range attractive term and a short-range repulsive term. The curve is built so its single minimum sits exactly at the equilibrium separation <span class="arithmatex">\(r_0\)</span> (the bond length) with depth <span class="arithmatex">\(E_0\)</span> (the bond energy) — both directly adjustable with sliders. A third slider moves a marker along the curve and updates a two-atom diagram that shows, with arrows, whether the pair is currently under net attraction, net repulsion, or sitting at equilibrium.
</p>

<div style="background: #FFF7DD; border: 2px solid #F0D87A; border-radius: 10px; padding: 20px 24px; margin: 1.2rem 0;">
<p style="color: #B8860B; font-weight: 700; font-size: 1.05rem; margin-top: 0; margin-bottom: 12px;">Key Features</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Attractive and repulsive components</strong> plotted separately (dashed) alongside the total energy curve (solid)</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Adjustable r0 and E0</strong> sliders reshape the curve live, with guide lines marking the minimum</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Draggable separation marker</strong> shows the current point on the curve and its numeric U(r)</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Two-atom force diagram</strong> with arrows that flip direction at r0, showing attraction vs. repulsion</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Covalent Si–Si and Ionic Na–Cl presets</strong>, the second matching this chapter's own Worked Example 3 calculation</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Responsive layout</strong> that resizes with the browser window</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">How to Use</h2>

<ol style="padding-left: 1.2rem; margin: 0.8rem 0 1.2rem 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Drag the "Current separation r" slider</strong> across the full range and watch the marker trace the well shape</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Press "Snap r to r0"</strong> and confirm U(r) equals exactly &minus;E0</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Compare the two presets</strong> to see how equilibrium separation and bond depth differ between a covalent and an ionic bond</li>
</ol>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Learning Objectives</h2>

<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(56,142,60,0.08);">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0; margin-bottom: 6px;">Bloom Level: Understand / Analyze (L2-L4) &nbsp;|&nbsp; Bloom Verb: Explain, Predict, Interpret</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0.6rem;">After using this MicroSim, students will be able to:</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Explain why a stable bond distance exists as the balance of attractive and repulsive forces</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Predict whether the net force at a given separation is attractive, repulsive, or zero</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Interpret r0 and E0 as the equilibrium bond length and bond energy read directly off the curve</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">References</h2>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Bond-dissociation_energy" style="color: #5A3EED; font-weight: 600;">Bond-Dissociation Energy</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Lennard-Jones_potential" style="color: #5A3EED; font-weight: 600;">Lennard-Jones Potential</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Interatomic_potential" style="color: #5A3EED; font-weight: 600;">Interatomic Potential</a> — Wikipedia</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="../../chapters/04-chemical-bonding-crystals/index.md" style="color: #5A3EED; font-weight: 600;">Chapter 4: Chemical Bonding in Semiconductor Crystals</a> — this textbook</li>
</ul>
</div>
