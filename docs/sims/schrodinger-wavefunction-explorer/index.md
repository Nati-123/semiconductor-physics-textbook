---
title: Schrödinger Wavefunction & Eigenstates Visualizer
description: Animate a complex plane-wave eigenstate and a multi-component Gaussian wave packet, contrasting flat vs. localized-and-spreading probability density
image: /sims/schrodinger-wavefunction-explorer/schrodinger-wavefunction-explorer.png
quality_score: 85
---

<h1 style="color: #5A3EED !important; border-bottom: 3px solid #5A3EED; padding-bottom: 0.4rem; font-weight: 800;">Schrödinger Wavefunction &amp; Eigenstates Visualizer</h1>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 18px; margin: 1.2rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<iframe src="main.html" height="640px" width="100%" scrolling="auto" style="border:none; border-radius:8px; overflow:hidden;"></iframe>
</div>

<a href="../../chapters/02-quantum-mechanics-foundations/index.md" style="color: #5A3EED; font-weight: 600; font-size: 0.95rem;">&#8592; Back to Chapter 2: Quantum Mechanics Foundations</a>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Description</h2>

<p style="color: #555; line-height: 1.85; font-size: 1.02rem; margin-bottom: 1.2rem;">
This MicroSim animates a complex wavefunction <span class="arithmatex">\(\psi(x,t)\)</span>, plotting its real part, imaginary part, and probability density <span class="arithmatex">\(|\psi|^2\)</span> together. In <strong>Eigenstate mode</strong> it renders a single plane wave <span class="arithmatex">\(\psi=Ae^{i(kx-\omega t)}\)</span> — the probability density stays perfectly flat and unchanging while only the complex phase rotates, the defining property of a stationary state. In <strong>Wave Packet mode</strong> it sums seven plane waves with Gaussian weights and the free-particle dispersion relation <span class="arithmatex">\(\omega\propto k^2\)</span> — the components dephase over time, so the probability density localizes into a hump that visibly drifts and spreads.
</p>

<div style="background: #FFF7DD; border: 2px solid #F0D87A; border-radius: 10px; padding: 20px 24px; margin: 1.2rem 0;">
<p style="color: #B8860B; font-weight: 700; font-size: 1.05rem; margin-top: 0; margin-bottom: 12px;">Key Features</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Start/Stop animation</strong> of ψ(x,t) with a dedicated stacked panel for Re[ψ]/Im[ψ] and |ψ|²</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Eigenstate / Wave Packet mode toggle</strong> contrasting a flat, time-independent density against a localized, evolving one</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Central k₀ and packet-width Δk sliders</strong> reshaping the wave packet's initial localization and spreading rate</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Adjustable animation speed</strong>, using an explicitly illustrative "phase-time," not real seconds</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">How to Use</h2>

<ol style="padding-left: 1.2rem; margin: 0.8rem 0 1.2rem 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Start in Eigenstate mode</strong> and press Start to see the flat, unchanging probability density</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Check "Wave packet"</strong> and press Start to see the density localize, drift, and spread</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Adjust Δk</strong> and compare the initial packet width and how quickly it spreads afterward</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Adjust k₀</strong> and observe how the spatial wavelength and phase speed change</li>
</ol>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Learning Objectives</h2>

<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(56,142,60,0.08);">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0; margin-bottom: 6px;">Bloom Level: Understand / Analyze (L2-L4) &nbsp;|&nbsp; Bloom Verb: Visualize, Contrast, Explain</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0.6rem;">After using this MicroSim, students will be able to:</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Distinguish the complex wavefunction ψ from the real, measurable probability density |ψ|²</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Explain why a single eigenstate is called a "stationary state" despite its visibly rotating phase</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Connect wave-packet spreading to the Heisenberg uncertainty tradeoff between Δk (momentum spread) and initial Δx (position spread)</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Lesson Plan</h2>

<h3 style="color: #5A3EED; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.6rem;">Before the Simulation (5 minutes)</h3>

<ul style="list-style: none; padding-left: 0.8rem; margin: 0.5rem 0 1rem 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.5rem;">&#9679;</span> Review the Born interpretation of |ψ|² and the complex nature of ψ from the chapter text</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.5rem;">&#9679;</span> Ask students to predict whether a "stationary state" means the wavefunction itself is frozen in time</li>
</ul>

<h3 style="color: #5A3EED; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.6rem;">During the Simulation (10 minutes)</h3>

<ol style="padding-left: 1.2rem; margin: 0.5rem 0 1rem 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;">Run Eigenstate mode and confirm the density panel never changes shape</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;">Switch to Wave Packet mode and let it run 20-30 seconds, noting both the drift and the widening of the hump</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;">Set Δk to its minimum and maximum in turn, comparing the initial packet width in each case</li>
</ol>

<h3 style="color: #5A3EED; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.6rem;">After the Simulation (5 minutes)</h3>

<ul style="list-style: none; padding-left: 0.8rem; margin: 0.5rem 0 1rem 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.5rem;">&#9679;</span> Discuss why the animation uses illustrative "phase-time" rather than real femtoseconds</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.5rem;">&#9679;</span> Preview how the very next section, Particle in a Box, produces eigenstates with *shape* by adding boundary conditions that this free-particle model lacks</li>
</ul>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">References</h2>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Wave_function" style="color: #5A3EED; font-weight: 600;">Wave Function</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Wave_packet" style="color: #5A3EED; font-weight: 600;">Wave Packet</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Stationary_state" style="color: #5A3EED; font-weight: 600;">Stationary State</a> — Wikipedia</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="../../chapters/02-quantum-mechanics-foundations/index.md" style="color: #5A3EED; font-weight: 600;">Chapter 2: Quantum Mechanics Foundations</a> — this textbook</li>
</ul>
</div>
