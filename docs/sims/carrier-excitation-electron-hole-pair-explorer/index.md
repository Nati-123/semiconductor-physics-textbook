---
title: Intrinsic Carrier Excitation / Electron-Hole Pair Explorer
description: An animated energy-space band diagram MicroSim showing electrons thermally excited across the band gap Eg into the conduction band, each leaving exactly one hole behind, with live n = p = ni counts and Temperature/Eg controls
image: /sims/carrier-excitation-electron-hole-pair-explorer/carrier-excitation-electron-hole-pair-explorer.png
quality_score: 82
---

<h1 style="color: #5A3EED !important; border-bottom: 3px solid #5A3EED; padding-bottom: 0.4rem; font-weight: 800;">Intrinsic Carrier Excitation / Electron-Hole Pair Explorer</h1>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 18px; margin: 1.2rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<iframe src="main.html" height="670px" width="100%" scrolling="auto" style="border:none; border-radius:8px; overflow:hidden;"></iframe>
</div>

<a href="../../chapters/06-band-structure-fermi-level/index.md" style="color: #5A3EED; font-weight: 600; font-size: 0.95rem;">&#8592; Back to Chapter 6: Band Structure and the Fermi Level</a>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Description</h2>

<p style="color: #555; line-height: 1.85; font-size: 1.02rem; margin-bottom: 1.2rem;">
This MicroSim draws a schematic energy-space band diagram — a conduction band, a band gap <span class="arithmatex">\(E_g\)</span>, and a valence band populated with 32 electron sites. When animation is running, sites are occasionally thermally excited: a bound valence electron jumps across the gap into the conduction band, leaving exactly one hole behind at its original site. Free electrons later recombine back into available holes, producing a fluctuating dynamic equilibrium. Because generation always creates one electron and one hole together, and recombination always removes one of each, the live electron count n and hole count p shown in the readout are always exactly equal — the direct, animated demonstration of <span class="arithmatex">\(n=p=n_i\)</span> for an intrinsic semiconductor. Temperature and band-gap sliders control the (illustratively rescaled) generation rate, so students can see generation rise with T and fall sharply with Eg.
</p>

<div style="background: #FFF7DD; border: 2px solid #F0D87A; border-radius: 10px; padding: 20px 24px; margin: 1.2rem 0;">
<p style="color: #B8860B; font-weight: 700; font-size: 1.05rem; margin-top: 0; margin-bottom: 12px;">Key Features</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Animated generation and recombination</strong> on a labeled Ec/Eg/Ev band diagram</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Live n = p = ni readout</strong>, enforced by construction (one electron and one hole per event)</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Temperature T (K) and band gap Eg (eV) sliders</strong> with a generation-activity meter</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Start/Stop and Reset controls</strong>, defaulting to stopped so the initial state can be inspected first</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Responsive canvas</strong> that resizes with the browser window, with fullscreen support</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">How to Use</h2>

<ol style="padding-left: 1.2rem; margin: 0.8rem 0 1.2rem 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Click Start</strong> and watch orange dashed paths (generation) carry electrons up into the conduction band, leaving red hole rings behind</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Compare Eg values</strong> from 0.3 eV to 3.0 eV and watch the generation-activity meter and event frequency change</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Compare Temperature values</strong> from 100 K to 900 K and watch the running-average pair count rise</li>
</ol>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Learning Objectives</h2>

<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(56,142,60,0.08);">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0; margin-bottom: 6px;">Bloom Level: Understand / Apply (L2-L3) &nbsp;|&nbsp; Bloom Verb: Explain, Predict, Compare</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0.6rem;">After using this MicroSim, students will be able to:</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Explain why intrinsic electron-hole pair generation always produces equal numbers of electrons and holes</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Predict qualitatively how generation rate changes with temperature and band gap</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Compare the energy-space (band-diagram) picture of carrier generation to the real-space (bond-breaking) picture from Chapter 7</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">References</h2>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Electron_hole" style="color: #5A3EED; font-weight: 600;">Electron Hole</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Intrinsic_semiconductor" style="color: #5A3EED; font-weight: 600;">Intrinsic Semiconductor</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="../intrinsic-semiconductor-explorer/index.md" style="color: #5A3EED; font-weight: 600;">Intrinsic Semiconductor Explorer</a> (real-space bond-breaking view) — this textbook</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="../../chapters/06-band-structure-fermi-level/index.md" style="color: #5A3EED; font-weight: 600;">Chapter 6: Band Structure and the Fermi Level</a> — this textbook</li>
</ul>
</div>
