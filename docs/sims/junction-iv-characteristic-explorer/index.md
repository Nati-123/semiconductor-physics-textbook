---
title: Complete Junction I-V Characteristic Explorer
description: A MicroSim synthesizing forward exponential conduction, reverse saturation, and reverse breakdown into one log-current-density-versus-voltage chart, with a live voltage marker and an updating junction cross-section diagram
image: /sims/junction-iv-characteristic-explorer/junction-iv-characteristic-explorer.png
quality_score: 85
---

<h1 style="color: #5A3EED !important; border-bottom: 3px solid #5A3EED; padding-bottom: 0.4rem; font-weight: 800;">Complete Junction I-V Characteristic Explorer</h1>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 18px; margin: 1.2rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<iframe src="main.html" height="720px" width="100%" scrolling="auto" style="border:none; border-radius:8px; overflow:hidden;"></iframe>
</div>

<a href="../../chapters/15-pn-junction-under-bias/index.md" style="color: #5A3EED; font-weight: 600; font-size: 0.95rem;">&#8592; Back to Chapter 15: The P-N Junction Under Bias</a>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Description</h2>

<p style="color: #555; line-height: 1.85; font-size: 1.02rem; margin-bottom: 1.2rem;">
This MicroSim is the chapter's single synthesis view of the <strong>complete junction I-V characteristic</strong>: \(I(V)\approx I_0(e^{V/V_T}-1)\) for \(V>-V_{BR}\), and a rapid, illustrative breakdown current increase for \(V\le-V_{BR}\). A single lightly-doped-side concentration slider \(N\) drives both the estimated breakdown voltage \(V_{BR}\approx\varepsilon E_{crit}^2/(2qN)\) and the saturation current \(J_0\); a voltage-marker slider — whose range is recomputed live from \(V_{BR}\) — sweeps a dot across a log\(|J|\) chart spanning all three regions (<strong>reverse breakdown</strong>, <strong>reverse saturation current</strong>, and <strong>forward conduction</strong>), while a small junction cross-section diagram updates its depletion width, barrier height, current-direction arrow, and dominant mechanism label to match.
</p>

<div style="background: #FFF3E0; border: 2px solid #F0C27A; border-radius: 10px; padding: 16px 20px; margin: 1.2rem 0;">
<p style="color: #A05A00; font-weight: 700; font-size: 0.98rem; margin-top: 0; margin-bottom: 6px;">A Note on Simplifications</p>
<p style="color: #6b4700; line-height: 1.7; font-size: 0.95rem; margin: 0;">The saturation current \(J_0\) is held near the same order of magnitude used elsewhere in this chapter's MicroSims and only scales mildly (and illustratively) with \(N\). The breakdown-region curve is a smooth, continuous, monotonically-increasing extension of the ideal diode equation chosen to match the chapter's own "rapid breakdown current increase" language — it is <em>not</em> a rigorous avalanche-multiplication (Miller) model. The mini-diagram's depletion width uses a fixed representative \(V_{bi}=0.7\ \text{V}\). These simplifications keep the whole picture numerically consistent with the sibling Ideal Diode I-V Curve Explorer and Reverse Breakdown Mechanism Explorer while staying legible across many orders of magnitude of doping and voltage.</p>
</div>

<div style="background: #FFF7DD; border: 2px solid #F0D87A; border-radius: 10px; padding: 20px 24px; margin: 1.2rem 0;">
<p style="color: #B8860B; font-weight: 700; font-size: 1.05rem; margin-top: 0; margin-bottom: 12px;">Key Features</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>One log|J|-vs-V chart</strong> showing forward exponential conduction, reverse saturation, and reverse breakdown together, with labeled regions and numeric axis ticks</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Single doping slider</strong> that drives both the breakdown voltage estimate and the saturation current together</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Live voltage-marker slider</strong> with a dynamically recomputed range spanning deep breakdown through forward bias</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Junction cross-section mini-diagram</strong> showing depletion width, barrier height, current direction, and the dominant mechanism at the current voltage</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Colored region badge</strong> (forward = green, reverse = red-orange, breakdown = purple) plus full numeric readouts</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <strong>Responsive canvas</strong> that stacks the chart, diagram, and readout card vertically on narrow screens</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">Learning Objectives</h2>

<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(56,142,60,0.08);">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0; margin-bottom: 6px;">Bloom Level: Analyze / Evaluate (L4-L5) &nbsp;|&nbsp; Bloom Verb: Synthesize, Compare, Predict</p>
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Synthesize forward conduction, reverse saturation, and reverse breakdown into a single unified I-V picture</li>
<li style="margin-bottom: 0.5rem; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Predict which of the three regions a given voltage falls into, and identify the dominant physical mechanism there</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333; padding-left: 1.4rem; text-indent: -1.4rem;"><span style="color: #2E7D32; font-weight: 700; margin-right: 0.4rem;">&#10003;</span> Evaluate how doping concentration jointly shifts the breakdown voltage and the depletion width shown in the junction diagram</li>
</ul>
</div>

<h2 style="color: #5A3EED !important; border-bottom: 2px solid #5A3EED; padding-bottom: 0.3rem; font-weight: 700; margin-top: 2rem;">References</h2>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 20px 24px; margin: 1rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);">
<ul style="list-style: none; padding-left: 0; margin: 0;">
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/P%E2%80%93n_junction" style="color: #5A3EED; font-weight: 600;">P-n junction</a> — Wikipedia</li>
<li style="margin-bottom: 0.6rem; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="https://en.wikipedia.org/wiki/Diode" style="color: #5A3EED; font-weight: 600;">Diode</a> — Wikipedia</li>
<li style="margin-bottom: 0; line-height: 1.75; color: #333;"><span style="color: #5A3EED; font-weight: 700; margin-right: 0.4rem;">&#9679;</span> <a href="../../chapters/15-pn-junction-under-bias/index.md" style="color: #5A3EED; font-weight: 600;">Chapter 15: The P-N Junction Under Bias</a> — this textbook</li>
</ul>
</div>
