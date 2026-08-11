---
title: Density of States and Fermi Level Explorer
description: A side-by-side band-diagram and density-of-states MicroSim comparing Metal, Insulator, Semimetal, and Intrinsic/n-type/p-type Semiconductor presets, with a Temperature T (K) control (0/77/300/600 K presets), a legend, and a numeric readout of Eg, EF, and occupation probabilities
image: /sims/density-of-states-fermi-level-explorer/density-of-states-fermi-level-explorer.png
quality_score: 85
---

<h1 style="color: #5A3EED !important; border-bottom: 3px solid #5A3EED; padding-bottom: 0.4rem; font-weight: 800;">Density of States and Fermi Level Explorer</h1>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 18px; margin: 1.2rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<iframe src="main.html" height="660px" width="100%" scrolling="auto" style="border:none; border-radius:8px; overflow:hidden;"></iframe>
</div>

<a href="../../chapters/06-band-structure-fermi-level/index.md" style="color: #5A3EED; font-weight: 600; font-size: 0.95rem;">&#8592; Back to Chapter 6: Band Structure and the Fermi Level</a>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Description</h2>

<p style="color: #555; line-height: 1.85; font-size: 1.02rem; margin-bottom: 1.2rem;">
This MicroSim draws a valence-like density of states <span class="arithmatex">\(g_v(E)\propto\sqrt{E_v-E}\)</span> and a conduction-like density of states <span class="arithmatex">\(g_c(E)\propto\sqrt{E-E_c}\)</span> side by side with a matching band diagram, for six presets: Metal and Semimetal (where the two bands overlap in energy) and Intrinsic, n-type, and p-type Semiconductor and Insulator (where they are separated by a real gap of different sizes, and where the Fermi level EF shifts for doped semiconductors). Both panels are shaded by the Fermi-Dirac occupation probability <span class="arithmatex">\(f(E)=1/[1+\exp((E-E_F)/k_BT)]\)</span>, so changing the Temperature T (K) control visibly smears the sharp T=0 occupied/empty boundary near the dashed EF line. A legend and a numeric readout (kT, Eg, EF, f(Ec), f(Ev)) make every quantity explicit.
</p>

<div style="background: #FFF7DD; border: 2px solid #F0D87A; border-radius: 10px; padding: 20px 24px; margin: 1.2rem 0;">
<p style="color: #B8860B; font-weight: 700; font-size: 1.05rem; margin-top: 0; margin-bottom: 12px;">Key Features</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Six presets</strong>: Metal, Insulator, Semimetal, Intrinsic/n-type/p-type Semiconductor, all built from the same underlying model</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Clearly separated band-diagram and density-of-states panels</strong> sharing the same energy axis, with a divider line</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Live Fermi-Dirac shading</strong> with a legend distinguishing occupied vs. unoccupied states</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Temperature T (K) control</strong> with 0 K / 77 K / 300 K / 600 K presets, plus a fine slider</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Numeric readout</strong> of kT, Eg, EF, f(Ec), and f(Ev)</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Responsive canvas</strong> that resizes with the browser window, with fullscreen support</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">How to Use</h2>

<ol style="padding-left: 1.2rem; margin: 0.8rem 0 1.2rem 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Select "Insulator"</strong> and confirm EF sits in a wide pale-gray (empty) gap between the green and purple bands</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Switch to "Intrinsic Semiconductor"</strong> and compare the much narrower gap, with EF still inside it</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Switch to "n-type" and "p-type"</strong> and watch EF shift toward Ec and Ev respectively</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Switch to "Metal" then "Semimetal"</strong>, and step through the Temperature presets, to compare density of states and thermal smearing at EF</li>
</ol>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Learning Objectives</h2>

<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(56,142,60,0.08);">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0; margin-bottom: 6px;">Bloom Level: Understand / Analyze (L2-L4) &nbsp;|&nbsp; Bloom Verb: Interpret, Compare, Classify</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0.6rem;">After using this MicroSim, students will be able to:</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Interpret a density-of-states curve and identify where it is zero versus nonzero</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Compare Fermi-level position relative to the bands across metal, insulator, semimetal, and intrinsic/n-type/p-type semiconductor presets</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Classify a material from its band-structure and Fermi-level picture alone</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Connect temperature T (K) to thermal smearing of the Fermi-Dirac occupation boundary</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">References</h2>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Density_of_states" style="color: #5A3EED; font-weight: 600;">Density of States</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Fermi_level" style="color: #5A3EED; font-weight: 600;">Fermi Level</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Semimetal" style="color: #5A3EED; font-weight: 600;">Semimetal</a> — Wikipedia</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="../../chapters/06-band-structure-fermi-level/index.md" style="color: #5A3EED; font-weight: 600;">Chapter 6: Band Structure and the Fermi Level</a> — this textbook</li>
</ul>
</div>
