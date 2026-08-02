---
title: Chapter 6 Problems - Band Structure and the Fermi Level
description: Practice problems for direct and indirect band gaps, effective mass, density of states, the Fermi level and Fermi energy, and band-structure classification
---

<div class="problems-styled" markdown>

# End-of-Chapter Problems: Band Structure and the Fermi Level

Work through these problems to reinforce your understanding of band structure, effective mass, density of states, and the Fermi level covered in Chapter 6.

---

## Easy

### Problem 1

Define, in one sentence each, a direct bandgap and an indirect bandgap.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">A direct bandgap material has its conduction-band minimum and valence-band maximum at the same crystal momentum <span class="arithmatex">\(k\)</span>. An indirect bandgap material has them at different crystal momenta.</p>
</div>
</details>

---

### Problem 2

State the formula defining effective mass in terms of band curvature.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(\dfrac{1}{m^*} = \dfrac{1}{\hbar^2}\dfrac{d^2E}{dk^2}\)</span>.</p>
</div>
</details>

---

### Problem 3

What physical question does the density of states \(g(E)\) answer?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">How many allowed electron states exist per unit volume in a small energy range near <span class="arithmatex">\(E\)</span> — <span class="arithmatex">\(g(E)\,dE\)</span> is the number of states per unit volume between <span class="arithmatex">\(E\)</span> and <span class="arithmatex">\(E+dE\)</span>.</p>
</div>
</details>

---

### Problem 4

State the Fermi-Dirac distribution.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(f(E) = \dfrac{1}{1+\exp\left(\frac{E-E_F}{k_BT}\right)}\)</span>.</p>
</div>
</details>

---

### Problem 5

Distinguish the Fermi level from the Fermi energy in one or two sentences.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">The Fermi level <span class="arithmatex">\(E_F\)</span> is the general parameter in the Fermi-Dirac distribution at any temperature, and can lie inside a band gap where no states exist. The Fermi energy is specifically its <span class="arithmatex">\(T=0\)</span> value, equal to the energy of the highest occupied state.</p>
</div>
</details>

---

### Problem 6

List the four material categories produced by band-structure classification.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Metal, insulator, semiconductor, and semimetal.</p>
</div>
</details>

---

### Problem 7

Is silicon a direct or indirect bandgap material? What about GaAs?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Silicon is indirect (conduction-band minimum away from <span class="arithmatex">\(k=0\)</span>, valence-band maximum at <span class="arithmatex">\(k=0\)</span>). GaAs is direct (both extrema at <span class="arithmatex">\(k=0\)</span>).</p>
</div>
</details>

---

### Problem 8

What condition on the Fermi level defines a metal band structure?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">The Fermi level lies inside a band that is only partially filled (or inside a region where two bands overlap in energy), so there are empty states immediately adjacent in energy to filled ones.</p>
</div>
</details>

---

## Medium

### Problem 9

A valence band near its maximum is described by \(E(k) = E_v - \beta k^2\), with \(\beta = 1.2\times10^{-37}\ \text{J}\cdot\text{m}^2\). Find the hole effective mass \(m_h^*\) in units of \(m_0=9.11\times10^{-31}\) kg.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Comparing to <span class="arithmatex">\(E(k)=E_v-\hbar^2k^2/(2m_h^*)\)</span> gives <span class="arithmatex">\(\beta=\hbar^2/(2m_h^*)\)</span>, so <span class="arithmatex">\(m_h^*=\hbar^2/(2\beta) = (1.055\times10^{-34})^2/(2\times1.2\times10^{-37}) \approx 4.63\times10^{-32}\ \text{kg} \approx 0.051\,m_0\)</span>.</p>
</div>
</details>

---

### Problem 10

Two conduction bands have effective masses \(m_A^*=0.10\,m_0\) and \(m_B^*=0.40\,m_0\). Find the ratio \(g_{c,B}(E)/g_{c,A}(E)\) at the same energy above their respective band edges.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Since <span class="arithmatex">\(g_c(E)\propto(m^*)^{3/2}\)</span>: <span class="arithmatex">\(g_{c,B}/g_{c,A} = (0.40/0.10)^{3/2} = 4^{1.5} = 8\)</span>. Band B has 8 times more available states at the same energy above its edge.</p>
</div>
</details>

---

### Problem 11

Explain why an indirect band-to-band transition requires a phonon in addition to a photon.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">A photon carries negligible crystal momentum compared to typical electron crystal momenta, so it can only drive a nearly vertical (<span class="arithmatex">\(\Delta k\approx0\)</span>) transition. In an indirect-gap material, the conduction-band minimum and valence-band maximum are offset in <span class="arithmatex">\(k\)</span>, so completing the transition requires a phonon to supply or absorb the missing crystal momentum <span class="arithmatex">\(\Delta k\)</span>.</p>
</div>
</details>

---

### Problem 12

A crystal has a completely full valence band and completely empty conduction band at \(T=0\), separated by a gap of \(0.67\) eV. Classify this material.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">A full valence band and empty conduction band place it in the insulator/semiconductor category; a gap this small (<span class="arithmatex">\(0.67\)</span> eV, close to germanium's actual gap) is small enough for significant room-temperature thermal excitation, so this material is a semiconductor.</p>
</div>
</details>

---

### Problem 13

A conduction-band state sits \(0.10\) eV above the Fermi level at \(T=300\) K (\(k_BT\approx0.0259\) eV). Estimate its occupation probability.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Since <span class="arithmatex">\(E-E_F\gg k_BT\)</span>: <span class="arithmatex">\(f(E)\approx\exp(-0.10/0.0259)=\exp(-3.86)\approx0.021\)</span>. About 2 states in 100 at this energy are occupied.</p>
</div>
</details>

---

### Problem 14

A hypothetical direct-gap material has \(E_g=2.0\) eV. Find the maximum wavelength of light that can be absorbed by a direct band-edge transition.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(\lambda = hc/E_g = (4.136\times10^{-15}\ \text{eV}\cdot\text{s})(3.0\times10^8\ \text{m/s})/2.0\ \text{eV} \approx 6.2\times10^{-7}\ \text{m} = 620\ \text{nm}</span> (visible red light).</p>
</div>
</details>

---

### Problem 15

Explain, physically, why a semimetal conducts electricity at all temperatures (including near absolute zero) while an insulator does not.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">In a semimetal, the valence and conduction bands touch or slightly overlap in energy, so a small number of states above the nominal band edge are genuinely, permanently occupied (and a small number below are genuinely, permanently empty) even at <span class="arithmatex">\(T=0\)</span> — no thermal excitation across a gap is required. An insulator has a real gap with zero density of states in between, so at <span class="arithmatex">\(T=0\)</span> the valence band is exactly full and the conduction band is exactly empty, with no carriers available at all.</p>
</div>
</details>

---

### Problem 16

Band X has curvature \(d^2E/dk^2\) four times larger than Band Y's. Which band has electrons that respond more sluggishly to an applied electric field, and why?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Band Y, with the smaller curvature, has the larger effective mass (<span class="arithmatex">\(m^*=\hbar^2/(d^2E/dk^2)\)</span> is inversely proportional to curvature), and a larger effective mass means the electron accelerates more slowly under the same applied force, <span class="arithmatex">\(F=m^*a\)</span> — so Band Y's electrons respond more sluggishly.</p>
</div>
</details>

---

## Difficult

### Problem 17

Starting from the k-space counting argument \(g(k)\,dk = k^2\,dk/\pi^2\) (states per unit volume, including spin) and the parabolic relation \(E-E_c=\hbar^2k^2/2m_e^*\), derive the conduction-band density of states \(g_c(E)\), showing each substitution step.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">From <span class="arithmatex">\(E-E_c=\hbar^2k^2/2m_e^*\)</span>, solve for <span class="arithmatex">\(k=\sqrt{2m_e^*(E-E_c)}/\hbar\)</span> and differentiate to get <span class="arithmatex">\(dk/dE = \sqrt{2m_e^*}/(2\hbar\sqrt{E-E_c})\)</span>. Requiring <span class="arithmatex">\(g(k)\,dk=g_c(E)\,dE\)</span> gives <span class="arithmatex">\(g_c(E)=\frac{k^2}{\pi^2}\cdot\frac{dk}{dE}\)</span>. Substituting both expressions and simplifying the algebra yields <span class="arithmatex">\(g_c(E)=\frac{1}{2\pi^2}\left(\frac{2m_e^*}{\hbar^2}\right)^{3/2}\sqrt{E-E_c}\)</span>, matching the chapter's result.</p>
</div>
</details>

---

### Problem 18

A metal's electrons can be modeled, at \(T=0\), as filling a free-electron-like conduction band up to the Fermi energy, with electron density \(n\) related to \(E_F\) by \(n=\int_0^{E_F}g_c(E)\,dE\) using \(m_e^*=m_0\). Show that this integral gives \(E_F=\dfrac{\hbar^2}{2m_0}(3\pi^2n)^{2/3}\), and evaluate \(E_F\) for copper, \(n\approx8.5\times10^{28}\ \text{m}^{-3}\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Integrating <span class="arithmatex">\(g_c(E)=\frac{1}{2\pi^2}(2m_0/\hbar^2)^{3/2}\sqrt{E}\)</span> from 0 to <span class="arithmatex">\(E_F\)</span> gives <span class="arithmatex">\(n=\frac{1}{3\pi^2}(2m_0E_F/\hbar^2)^{3/2}\)</span>; solving for <span class="arithmatex">\(E_F\)</span> gives <span class="arithmatex">\(E_F=\frac{\hbar^2}{2m_0}(3\pi^2n)^{2/3}\)</span>. For copper: <span class="arithmatex">\(3\pi^2n\approx2.52\times10^{30}\ \text{m}^{-3}</span>, so <span class="arithmatex">\((3\pi^2n)^{2/3}\approx1.83\times10^{20}\ \text{m}^{-2}\)</span>, and <span class="arithmatex">\(E_F=\frac{(1.055\times10^{-34})^2}{2(9.11\times10^{-31})}(1.83\times10^{20})\approx1.11\times10^{-18}\ \text{J}\approx6.9\ \text{eV}</span>, close to copper's textbook Fermi energy of about 7 eV.</p>
</div>
</details>

---

### Problem 19

A semiconductor's conduction band actually has two equivalent "valleys" (band minima at symmetry-related k-points) rather than one, each with the same effective mass. Explain, qualitatively, how this changes the total conduction-band density of states compared to a single-valley model with the same per-valley effective mass, and why real silicon's conduction band (which has six equivalent valleys) requires this correction.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Each equivalent valley independently contributes its own set of parabolic states near the conduction-band edge, so the total density of states is simply the single-valley result multiplied by the number of equivalent valleys, <span class="arithmatex">\(g_c^{\text{total}}(E) = M_c\,g_c^{\text{single valley}}(E)\)</span>. Real silicon's conduction band has <span class="arithmatex">\(M_c=6\)</span> equivalent valleys along the <span class="arithmatex">\(\langle100\rangle\)</span> directions, so any quantitative carrier-concentration calculation (Chapters 9-10) must include this valley-degeneracy factor rather than using the single-valley formula alone.</p>
</div>
</details>

---

### Problem 20

A hypothetical semiconductor has \(E_g=1.5\) eV, an electron effective mass \(m_e^*=0.09\,m_0\), and is direct-gap. (a) Find the threshold wavelength for direct optical absorption. (b) If the conduction-band curvature were instead four times smaller (larger effective mass), how would the density of states near the band edge change? (c) Would this material be classified as a semiconductor or an insulator, and why?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">(a) <span class="arithmatex">\(\lambda=hc/E_g=(4.136\times10^{-15})(3.0\times10^8)/1.5 \approx 8.3\times10^{-7}\ \text{m}=830\ \text{nm}</span>. (b) A curvature four times smaller means an effective mass four times larger (<span class="arithmatex">\(m^*\propto1/\text{curvature}\)</span>), and since <span class="arithmatex">\(g_c(E)\propto(m^*)^{3/2}\)</span>, the density of states near the band edge would increase by a factor of <span class="arithmatex">\(4^{1.5}=8\)</span>. (c) With <span class="arithmatex">\(E_g=1.5\)</span> eV — a completely full valence band and empty conduction band separated by a gap well under the roughly 4 eV insulator threshold — this material is a semiconductor, comparable to real materials like GaAs (1.42 eV) and CdTe (1.5 eV).</p>
</div>
</details>

</div>
