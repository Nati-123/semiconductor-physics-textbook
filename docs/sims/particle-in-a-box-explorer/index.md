---
title: Particle in a Box Explorer
description: Interactive plot of the infinite-square-well wavefunction, probability density, and energy-level ladder for quantum numbers n = 1 to 6
image: /sims/particle-in-a-box-explorer/particle-in-a-box-explorer.png
quality_score: 85
---

<h1 style="color: #5A3EED !important; border-bottom: 3px solid #5A3EED; padding-bottom: 0.4rem; font-weight: 800;">Particle in a Box Explorer</h1>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 18px; margin: 1.2rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<iframe src="main.html" height="580px" width="100%" scrolling="auto" style="border:none; border-radius:8px; overflow:hidden;"></iframe>
</div>

<a href="../../chapters/02-quantum-mechanics-foundations/index.md" style="color: #5A3EED; font-weight: 600; font-size: 0.95rem;">&#8592; Back to Chapter 2: Quantum Mechanics Foundations</a>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Description</h2>

<p style="color: #555; line-height: 1.85; font-size: 1.02rem; margin-bottom: 1.2rem;">
This MicroSim lets students adjust the box width <span class="arithmatex">\(L\)</span> (0.1 nm to 5 nm) and quantum number <span class="arithmatex">\(n\)</span> (1 to 6) of an electron confined to an infinite square well, plotting the wavefunction <span class="arithmatex">\(\psi_n(x) = \sqrt{2/L}\sin(n\pi x/L)\)</span> and the probability density <span class="arithmatex">\(|\psi_n(x)|^2\)</span>. A side-panel energy-level ladder computed from <span class="arithmatex">\(E_n = n^2h^2/(8m_eL^2)\)</span> shows that energy levels are not evenly spaced — they scale as <span class="arithmatex">\(n^2\)</span>.
</p>

<div style="background: #FFF7DD; border: 2px solid #F0D87A; border-radius: 10px; padding: 20px 24px; margin: 1.2rem 0;">
<p style="color: #B8860B; font-weight: 700; font-size: 1.05rem; margin-top: 0; margin-bottom: 12px;">Key Features</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Box width slider</strong> from 0.1 nm to 5 nm</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Integer quantum-number slider</strong> for n = 1 through 6, extended down through n = 0 and to n = -6 for exploration</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Overlaid ψₙ(x) and |ψₙ(x)|² plots</strong> with internal nodes marked</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Energy-level ladder diagram</strong> for E₁ through E₆, with the selected level highlighted</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">How to Use</h2>

<ol style="padding-left: 1.2rem; margin: 0.8rem 0 1.2rem 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Drag the n slider</strong> and count how the number of internal nodes changes</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Drag the L slider</strong> and watch every level in the energy ladder shift</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Compare the highlighted level</strong> to the other five to see the n² spacing pattern</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Drag n below 1</strong> to see why n = 0 and negative n are excluded from (or redundant with) the physical spectrum</li>
</ol>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Learning Objectives</h2>

<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(56,142,60,0.08);">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0; margin-bottom: 6px;">Bloom Level: Apply / Analyze (L3-L4) &nbsp;|&nbsp; Bloom Verb: Calculate, Distinguish</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0.6rem;">After using this MicroSim, students will be able to:</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Apply <span class="arithmatex">\(\psi_n(x)=\sqrt{2/L}\sin(n\pi x/L)\)</span> to sketch stationary states of a confined particle</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Analyze how <span class="arithmatex">\(E_n \propto n^2/L^2\)</span> produces unevenly spaced energy levels</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Distinguish the wavefunction from the probability density it produces</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Lesson Plan</h2>

<h3 style="color: #5A3EED; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.6rem;">Before the Simulation (5 minutes)</h3>

<ul style="list-style: none; padding-left: 0.8rem; margin: 0.5rem 0 1rem 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.5rem;">&#9679;</span> Review the boxed particle-in-a-box wavefunction and energy formulas from the chapter</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.5rem;">&#9679;</span> Ask students to predict how many nodes ψ₄ will have before checking</li>
</ul>

<h3 style="color: #5A3EED; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.6rem;">During the Simulation (10 minutes)</h3>

<ol style="padding-left: 1.2rem; margin: 0.5rem 0 1rem 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;">Step n from 1 to 6 at fixed L and record each internal node count</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;">Fix n = 2 and shrink L from 5 nm to 0.1 nm, noting how quickly E₂ rises</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;">Compare the E₁-E₂ gap to the E₅-E₆ gap in the ladder diagram</li>
</ol>

<h3 style="color: #5A3EED; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.6rem;">After the Simulation (5 minutes)</h3>

<ul style="list-style: none; padding-left: 0.8rem; margin: 0.5rem 0 1rem 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.5rem;">&#9679;</span> Drag n to 0 live and discuss why it is not a valid state (it would mean no particle at all); drag to a negative n and discuss why it duplicates its positive counterpart rather than describing a new state</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.5rem;">&#9679;</span> Preview how this quantized-level structure foreshadows the energy bands built from many confined electrons later in the course</li>
</ul>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">References</h2>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Particle_in_a_box" style="color: #5A3EED; font-weight: 600;">Particle in a Box</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Wave_function" style="color: #5A3EED; font-weight: 600;">Wave Function</a> — Wikipedia</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="../../chapters/02-quantum-mechanics-foundations/index.md" style="color: #5A3EED; font-weight: 600;">Chapter 2: Quantum Mechanics Foundations</a> — this textbook</li>
</ul>
</div>
