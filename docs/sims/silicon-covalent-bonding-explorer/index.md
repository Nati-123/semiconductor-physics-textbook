---
title: Silicon Covalent Bonding Explorer
description: A rotatable 3D view of one silicon atom forming its four tetrahedral covalent bonds, built up one bond at a time with a live electron-count readout and the 109.5-degree bond angle
image: /sims/silicon-covalent-bonding-explorer/silicon-covalent-bonding-explorer.png
quality_score: 80
---

<h1 style="color: #5A3EED !important; border-bottom: 3px solid #5A3EED; padding-bottom: 0.4rem; font-weight: 800;">Silicon Covalent Bonding Explorer</h1>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 18px; margin: 1.2rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<iframe src="main.html" height="760px" width="100%" scrolling="auto" style="border:none; border-radius:8px; overflow:hidden;"></iframe>
</div>

<a href="../../chapters/04-chemical-bonding-crystals/index.md" style="color: #5A3EED; font-weight: 600; font-size: 0.95rem;">&#8592; Back to Chapter 4: Chemical Bonding in Semiconductor Crystals</a>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Description</h2>

<p style="color: #555; line-height: 1.85; font-size: 1.02rem; margin-bottom: 1.2rem;">
This MicroSim renders one central silicon atom forming its four covalent bonds to neighboring silicon atoms, revealed one bond at a time with a "Bonds formed" slider or an automatic build animation. Each formed bond shows the shared electron pair as two small orange spheres, and a live readout panel tracks exactly how many electrons are counted around the center atom as bonding proceeds, from 4 (isolated atom, no bonds) up to 8 (a complete octet once all 4 bonds exist). An optional overlay marks the 109.5° angle between any two bonds, the true sp3 tetrahedral geometry.
</p>

<div style="background: #FFF7DD; border: 2px solid #F0D87A; border-radius: 10px; padding: 20px 24px; margin: 1.2rem 0;">
<p style="color: #B8860B; font-weight: 700; font-size: 1.05rem; margin-top: 0; margin-bottom: 12px;">Key Features</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Step-by-step bond formation</strong> from 0 to 4 bonds, with an automatic play animation</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Live electron-count readout</strong> showing the octet complete one shared pair at a time</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>True tetrahedral geometry</strong> (109.5° between any two bonds), with an optional angle-arc overlay</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Free 3D rotation</strong> via p5.js <span class="arithmatex">\(\texttt{orbitControl()}\)</span> — click-drag to spin, scroll to zoom</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Responsive canvas</strong> that resizes with the browser window</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">How to Use</h2>

<ol style="padding-left: 1.2rem; margin: 0.8rem 0 1.2rem 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Drag the "Bonds formed" slider</strong> from 0 to 4 and watch the electron count climb from 4 to 8</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Check "Show 109.5° bond angle"</strong> and rotate to see the angle marked between two bonds</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Press "Play build animation"</strong> for an automatic walkthrough of all 4 bonds forming</li>
</ol>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Learning Objectives</h2>

<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(56,142,60,0.08);">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0; margin-bottom: 6px;">Bloom Level: Understand / Apply (L2-L3) &nbsp;|&nbsp; Bloom Verb: Explain, Count, Identify</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0.6rem;">After using this MicroSim, students will be able to:</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Explain how silicon's 4 valence electrons produce exactly 4 covalent bonds</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Count the shared electrons contributing to an atom's octet at any stage of bonding</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Identify 109.5° as the tetrahedral (sp3) angle between covalent bonds</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">References</h2>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Orbital_hybridisation#sp3_hybrids" style="color: #5A3EED; font-weight: 600;">sp3 Hybridization</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Covalent_bond" style="color: #5A3EED; font-weight: 600;">Covalent Bond</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="../diamond-zincblende-explorer/index.md" style="color: #5A3EED; font-weight: 600;">Diamond / Zincblende Structure Explorer</a> — the full repeating 3D lattice this bonding pattern builds (Chapter 3)</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="../../chapters/04-chemical-bonding-crystals/index.md" style="color: #5A3EED; font-weight: 600;">Chapter 4: Chemical Bonding in Semiconductor Crystals</a> — this textbook</li>
</ul>
</div>
