---
title: Heisenberg Uncertainty Principle Explorer
description: Interactive visualization of the inverse relationship between position uncertainty and momentum uncertainty for an electron or proton
image: /sims/heisenberg-uncertainty-explorer/heisenberg-uncertainty-explorer.png
quality_score: 85
---

<h1 style="color: #5A3EED !important; border-bottom: 3px solid #5A3EED; padding-bottom: 0.4rem; font-weight: 800;">Heisenberg Uncertainty Principle Explorer</h1>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 18px; margin: 1.2rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<iframe src="main.html" height="560px" width="100%" scrolling="auto" style="border:none; border-radius:8px; overflow:hidden;"></iframe>
</div>

<a href="../../chapters/02-quantum-mechanics-foundations/index.md" style="color: #5A3EED; font-weight: 600; font-size: 0.95rem;">&#8592; Back to Chapter 2: Quantum Mechanics Foundations</a>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Description</h2>

<p style="color: #555; line-height: 1.85; font-size: 1.02rem; margin-bottom: 1.2rem;">
This MicroSim lets students adjust the position uncertainty <span class="arithmatex">\(\Delta x\)</span> of an electron or proton and see the resulting minimum momentum uncertainty <span class="arithmatex">\(\Delta p_{min} = \hbar/(2\Delta x)\)</span> and velocity uncertainty <span class="arithmatex">\(\Delta v_{min} = \Delta p_{min}/m\)</span>, computed from <span class="arithmatex">\(\hbar = 1.0546\times10^{-34}\)</span> J·s. Two Gaussian curves — a position wave packet and a momentum spread — visually narrow and widen in opposite directions as the slider moves, making the trade-off in <span class="arithmatex">\(\Delta x\,\Delta p \geq \hbar/2\)</span> immediately visible.
</p>

<div style="background: #FFF7DD; border: 2px solid #F0D87A; border-radius: 10px; padding: 20px 24px; margin: 1.2rem 0;">
<p style="color: #B8860B; font-weight: 700; font-size: 1.05rem; margin-top: 0; margin-bottom: 12px;">Key Features</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Log-scale &Delta;x slider</strong> spanning 1 pm to 1 µm</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Particle-type dropdown</strong> (electron or proton) converting \(\Delta p\) into \(\Delta v\)</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Two linked Gaussian curves</strong> showing the position wave packet and momentum spread narrowing/widening inversely</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Live numeric readouts</strong> of \(\Delta x\), \(\Delta p\), and \(\Delta v\)</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">How to Use</h2>

<ol style="padding-left: 1.2rem; margin: 0.8rem 0 1.2rem 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Drag the \(\Delta x\) slider</strong> and watch the position curve narrow while the momentum curve widens</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Switch the particle dropdown</strong> between electron and proton to compare \(\Delta v_{min}\)</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Read the numeric panel</strong> to see the exact computed uncertainties</li>
</ol>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Learning Objectives</h2>

<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(56,142,60,0.08);">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0; margin-bottom: 6px;">Bloom Level: Understand / Apply (L2-L3) &nbsp;|&nbsp; Bloom Verb: Interpret, Calculate</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0.6rem;">After using this MicroSim, students will be able to:</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Apply \(\Delta x\,\Delta p \geq \hbar/2\) to compute a minimum momentum uncertainty</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Interpret the inverse relationship between position and momentum uncertainty visually</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Explain why lighter particles (electrons) show larger velocity uncertainty than heavier ones (protons) for the same confinement</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Lesson Plan</h2>

<h3 style="color: #5A3EED; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.6rem;">Before the Simulation (5 minutes)</h3>

<ul style="list-style: none; padding-left: 0.8rem; margin: 0.5rem 0 1rem 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.5rem;">&#9679;</span> Review the boxed Heisenberg Uncertainty Principle from the chapter</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.5rem;">&#9679;</span> Ask students to predict what happens to <span class="arithmatex">\(\Delta p\)</span> if <span class="arithmatex">\(\Delta x\)</span> is cut in half</li>
</ul>

<h3 style="color: #5A3EED; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.6rem;">During the Simulation (10 minutes)</h3>

<ol style="padding-left: 1.2rem; margin: 0.5rem 0 1rem 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;">Set <span class="arithmatex">\(\Delta x\)</span> to 0.1 nm (roughly atomic scale) and record <span class="arithmatex">\(\Delta p\)</span> and <span class="arithmatex">\(\Delta v\)</span> for the electron</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;">Switch to the proton at the same <span class="arithmatex">\(\Delta x\)</span> and compare <span class="arithmatex">\(\Delta v\)</span></li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;">Drag <span class="arithmatex">\(\Delta x\)</span> to its smallest value and observe both curves at their most extreme widths</li>
</ol>

<h3 style="color: #5A3EED; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.6rem;">After the Simulation (5 minutes)</h3>

<ul style="list-style: none; padding-left: 0.8rem; margin: 0.5rem 0 1rem 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.5rem;">&#9679;</span> Discuss why this is a fundamental property of nature, not a limitation of measurement instruments</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.5rem;">&#9679;</span> Connect this to why confined electrons in a particle-in-a-box have nonzero minimum kinetic energy</li>
</ul>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">References</h2>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Uncertainty_principle" style="color: #5A3EED; font-weight: 600;">Uncertainty Principle</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Wave_packet" style="color: #5A3EED; font-weight: 600;">Wave Packet</a> — Wikipedia</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="../../chapters/02-quantum-mechanics-foundations/index.md" style="color: #5A3EED; font-weight: 600;">Chapter 2: Quantum Mechanics Foundations</a> — this textbook</li>
</ul>
</div>
