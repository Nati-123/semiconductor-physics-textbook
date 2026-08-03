---
title: Chapter 13 Problems - Non-Equilibrium Carriers and Recombination
description: Practice problems for excess carriers, carrier generation, recombination mechanisms, minority carrier lifetime, injection level, the continuity equation, diffusion length, and quasi-Fermi levels
---

<div class="problems-styled" markdown>

# End-of-Chapter Problems: Non-Equilibrium Carriers and Recombination

Work through these problems to reinforce your understanding of non-equilibrium carriers and recombination covered in Chapter 13.

---

## Easy

### Problem 1

Define excess carriers in terms of \(n\) and \(n_0\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(\Delta n = n - n_0\)</span>, the carrier concentration above the equilibrium value.</p>
</div>
</details>

---

### Problem 2

Name the two processes responsible for carrier generation.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Optical generation (photon absorption) and thermal generation (thermal fluctuations).</p>
</div>
</details>

---

### Problem 3

State the recombination rate formula for a single dominant mechanism.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(R = \Delta n/\tau\)</span>.</p>
</div>
</details>

---

### Problem 4

Which recombination mechanism is efficient in direct-gap materials but not indirect-gap materials?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Direct (band-to-band) recombination.</p>
</div>
</details>

---

### Problem 5

State the diffusion length formula.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(L_p = \sqrt{D_p\tau_p}\)</span>.</p>
</div>
</details>

---

### Problem 6

What distinguishes low-level from high-level injection?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Low-level injection has Δn much smaller than the doping concentration N; high-level injection has Δn comparable to or exceeding N.</p>
</div>
</details>

---

### Problem 7

How does Auger recombination's rate scale with excess carrier concentration?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">As <span class="arithmatex">\(\Delta n^3\)</span> (cubic).</p>
</div>
</details>

---

### Problem 8

At equilibrium (Δn=0), how do the two quasi-Fermi levels relate to each other?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">They coincide: <span class="arithmatex">\(E_{Fn}=E_{Fp}=E_F\)</span>, the single equilibrium Fermi level.</p>
</div>
</details>

---

## Medium

### Problem 9

A sample is illuminated with generation rate \(G=5\times10^{19}\ \text{cm}^{-3}\text{s}^{-1}\) and has \(\tau=3\ \mu\text{s}\). Find the steady-state excess concentration.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(\Delta n_{ss}=G\tau=(5\times10^{19})(3\times10^{-6})=1.5\times10^{14}\ \text{cm}^{-3}\)</span>.</p>
</div>
</details>

---

### Problem 10

Using \(\Delta n_{ss}=1.5\times10^{14}\ \text{cm}^{-3}\) and \(\tau=3\ \mu\text{s}\) from Problem 9, find Δn at \(t=6\ \mu\text{s}\) after generation stops.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(\Delta n(6\ \mu\text{s})=(1.5\times10^{14})e^{-6/3}=(1.5\times10^{14})e^{-2}\approx2.03\times10^{13}\ \text{cm}^{-3}\)</span>.</p>
</div>
</details>

---

### Problem 11

A hole has \(D_p=10\ \text{cm}^2/\text{s}\) and \(\tau_p=2\ \mu\text{s}\). Find the diffusion length in micrometers.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(L_p=\sqrt{(10)(2\times10^{-6})}=\sqrt{2\times10^{-5}}\approx4.47\times10^{-3}\ \text{cm}=44.7\ \mu\text{m}\)</span>.</p>
</div>
</details>

---

### Problem 12

Using \(L_p=44.7\ \mu\text{m}\) from Problem 11 and \(\Delta p(0)=8\times10^{14}\ \text{cm}^{-3}\), find \(\Delta p\) at \(x=44.7\ \mu\text{m}\) (i.e., \(x=L_p\)).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">At <span class="arithmatex">\(x=L_p\)</span>: <span class="arithmatex">\(\Delta p=\Delta p(0)e^{-1}=(8\times10^{14})(0.368)\approx2.94\times10^{14}\ \text{cm}^{-3}\)</span>.</p>
</div>
</details>

---

### Problem 13

A sample doped at \(N_D=2\times10^{16}\ \text{cm}^{-3}\) is injected with \(\Delta n=1\times10^{15}\ \text{cm}^{-3}\). Classify the injection level.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(\Delta n/N_D = 1\times10^{15}/2\times10^{16}=0.05\)</span>, below the 0.1 threshold — low-level injection.</p>
</div>
</details>

---

### Problem 14

At \(\Delta n=5\times10^{16}\ \text{cm}^{-3}\), with \(\tau_{SRH}=0.5\ \mu\text{s}\), find \(R_{SRH}\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(R_{SRH}=\Delta n/\tau_{SRH}=(5\times10^{16})/(5\times10^{-7})=1\times10^{23}\ \text{cm}^{-3}\text{s}^{-1}\)</span>.</p>
</div>
</details>

---

### Problem 15

Explain why silicon (an indirect-gap material) is a poor light emitter compared to GaAs.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">In silicon, the conduction band minimum and valence band maximum sit at different crystal momenta, so band-to-band (radiative) recombination requires a momentum-conserving phonon assist, making it far less probable than the direct recombination available in GaAs, where the band extrema coincide in momentum.</p>
</div>
</details>

---

### Problem 16

Why do traps located near midgap make the most effective recombination centers in SRH theory?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Traps near midgap are equally likely to capture an electron from the conduction band or a hole from the valence band, so a captured carrier is likely to be followed by capture of the opposite carrier type (completing recombination) rather than being re-emitted back to its original band, as tends to happen for traps near the band edges.</p>
</div>
</details>

---

## Difficult

### Problem 17

In silicon at \(\Delta n=8\times10^{16}\ \text{cm}^{-3}\), with \(\tau_{SRH}=0.8\ \mu\text{s}\) and Auger coefficient \(C=2.8\times10^{-31}\ \text{cm}^6/\text{s}\), compute \(R_{SRH}\) and \(R_{Auger}\) and identify the dominant mechanism.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(R_{SRH}=(8\times10^{16})/(8\times10^{-7})=1\times10^{23}\ \text{cm}^{-3}\text{s}^{-1}\)</span>. <span class="arithmatex">\(R_{Auger}=(2.8\times10^{-31})(8\times10^{16})^3=(2.8\times10^{-31})(5.12\times10^{50})\approx1.43\times10^{20}\ \text{cm}^{-3}\text{s}^{-1}\)</span>. SRH dominates by roughly three orders of magnitude at this injection level.</p>
</div>
</details>

---

### Problem 18

An n-type sample has \(n_0=5\times10^{15}\ \text{cm}^{-3}\), \(n_i=1.5\times10^{10}\ \text{cm}^{-3}\), \(k_BT=0.0259\) eV, and is injected with \(\Delta n=2\times10^{14}\ \text{cm}^{-3}\). Find \(E_{Fn}-E_i\) and \(E_i-E_{Fp}\) (use \(p\approx\Delta n\) since \(p_0\) is negligible by comparison).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(n\approx n_0+\Delta n=5.2\times10^{15}\)</span>. <span class="arithmatex">\(E_{Fn}-E_i=(0.0259)\ln(5.2\times10^{15}/1.5\times10^{10})=(0.0259)(12.76)\approx0.330\ \text{eV}\)</span>. <span class="arithmatex">\(E_i-E_{Fp}=(0.0259)\ln(2\times10^{14}/1.5\times10^{10})=(0.0259)(9.50)\approx0.246\ \text{eV}\)</span>.</p>
</div>
</details>

---

### Problem 19

Using the results of Problem 18, find the quasi-Fermi level splitting \(E_{Fn}-E_{Fp}\), and comment on which quasi-Fermi level moved further from \(E_i\) and why.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Splitting: <span class="arithmatex">\(E_{Fn}-E_{Fp}=0.330+0.246=0.576\ \text{eV}\)</span>. \(E_{Fn}\) moved further from \(E_i\) (0.330 eV vs. 0.246 eV) because electrons are the majority carrier in this n-type sample, and n itself is larger relative to \(n_i\) than p is — even though holes (the minority carrier) are proportionally far more perturbed by the injection, the quasi-Fermi level formula depends on the absolute concentration ratio to \(n_i\), which is larger for electrons here.</p>
</div>
</details>

---

### Problem 20

A solar cell absorber has minority carrier diffusion length \(L_p=80\ \mu\text{m}\). If the absorber is only \(20\ \mu\text{m}\) thick, roughly what fraction of carriers generated at the illuminated surface survive (via the exponential steady-state profile) to reach the back contact at \(x=20\ \mu\text{m}\), and what does this suggest about absorber thickness relative to \(L_p\)?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Fraction surviving <span class="arithmatex">\(=e^{-x/L_p}=e^{-20/80}=e^{-0.25}\approx0.779\)</span>, so about 78% of carriers survive to that depth without recombining. Since the absorber (20 μm) is much thinner than the diffusion length (80 μm), most photogenerated carriers should be collected — this confirms the general design rule that absorber thickness should be kept well below the diffusion length to minimize recombination losses.</p>
</div>
</details>

</div>
