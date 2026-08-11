---
title: Direct vs. Indirect Bandgap E-k Explorer
description: A two-band E-k diagram MicroSim comparing direct-gap (GaAs) and indirect-gap (Si, Ge) materials, with a switchable photon-only vs. phonon-assisted transition path, color-distinguished photon/phonon contributions, an adjustable electron effective-mass curvature slider, and a side-by-side hole effective-mass comparison
image: /sims/direct-indirect-bandgap-explorer/direct-indirect-bandgap-explorer.png
quality_score: 85
---

<h1 style="color: #5A3EED !important; border-bottom: 3px solid #5A3EED; padding-bottom: 0.4rem; font-weight: 800;">Direct vs. Indirect Bandgap E-k Explorer</h1>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 18px; margin: 1.2rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<iframe src="main.html" height="660px" width="100%" scrolling="auto" style="border:none; border-radius:8px; overflow:hidden;"></iframe>
</div>

<a href="../../chapters/06-band-structure-fermi-level/index.md" style="color: #5A3EED; font-weight: 600; font-size: 0.95rem;">&#8592; Back to Chapter 6: Band Structure and the Fermi Level</a>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Description</h2>

<p style="color: #555; line-height: 1.85; font-size: 1.02rem; margin-bottom: 1.2rem;">
This MicroSim plots simplified valence- and conduction-band parabolas on an E-k diagram, <span class="arithmatex">\(E_v(k)=-B_vk^2\)</span> and <span class="arithmatex">\(E_c(k)=E_g+a(k-k_0)^2\)</span>, for three material presets: direct-gap GaAs (<span class="arithmatex">\(k_0=0\)</span>) and indirect-gap Si and Ge (<span class="arithmatex">\(k_0\neq0\)</span>). A transition arrow shows either a vertical, photon-only jump at <span class="arithmatex">\(k=0\)</span>, or a diagonal path split into a vertical photon segment (energy <span class="arithmatex">\(E_g\)</span>) and a horizontal phonon segment (momentum <span class="arithmatex">\(k_0\)</span>) that together reach the true conduction-band minimum. An effective-mass slider adjusts the conduction band's curvature directly, making the inverse relationship between curvature and effective mass visible.
</p>

<div style="background: #FFF7DD; border: 2px solid #F0D87A; border-radius: 10px; padding: 20px 24px; margin: 1.2rem 0;">
<p style="color: #B8860B; font-weight: 700; font-size: 1.05rem; margin-top: 0; margin-bottom: 12px;">Key Features</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Three material presets</strong>: GaAs (direct), Si (indirect), Ge (indirect), with realistic band gaps</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Switchable transition arrow</strong>: vertical (photon only) vs. diagonal (phonon-assisted)</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Adjustable effective mass</strong> directly controls conduction-band curvature</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Labeled band extrema</strong> mark the valence-band maximum and conduction-band minimum, with a measured Eg bracket</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Color-coded photon (orange) vs. phonon (dashed teal)</strong> transition segments</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Electron vs. hole effective mass readout</strong> compares conduction- and valence-band curvature side by side</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Responsive canvas</strong> that resizes with the browser window, with fullscreen support</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">How to Use</h2>

<ol style="padding-left: 1.2rem; margin: 0.8rem 0 1.2rem 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Select "GaAs (Direct)"</strong> with "Vertical (photon only)" transition and confirm the arrow lands exactly on the conduction-band minimum</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Switch to "Si (Indirect)"</strong> and see the same vertical arrow now miss the true minimum, which has shifted to a nonzero k₀</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><strong style="color: #5A3EED;">Change Transition to "Diagonal (phonon-assisted)"</strong> and confirm the path now reaches the true minimum via a photon segment plus a phonon segment</li>
</ol>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Learning Objectives</h2>

<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(56,142,60,0.08);">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0; margin-bottom: 6px;">Bloom Level: Understand / Analyze (L2-L4) &nbsp;|&nbsp; Bloom Verb: Identify, Compare, Analyze</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0.6rem;">After using this MicroSim, students will be able to:</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Identify direct vs. indirect band gaps directly from an E-k diagram</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Explain why a photon-only transition can reach the conduction-band minimum only when k₀ = 0</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Connect conduction-band curvature to effective mass, and compare curvature across materials</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">References</h2>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Direct_and_indirect_band_gaps" style="color: #5A3EED; font-weight: 600;">Direct and Indirect Band Gaps</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Effective_mass_(solid-state_physics)" style="color: #5A3EED; font-weight: 600;">Effective Mass</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Electronic_band_structure" style="color: #5A3EED; font-weight: 600;">Electronic Band Structure</a> — Wikipedia</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="../../chapters/06-band-structure-fermi-level/index.md" style="color: #5A3EED; font-weight: 600;">Chapter 6: Band Structure and the Fermi Level</a> — this textbook</li>
</ul>
</div>
