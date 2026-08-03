---
title: Chapter 10 Problems - Fermi Level Position and Carrier Equations
description: Practice problems for the Boltzmann approximation, exact electron/hole concentration equations, Fermi level position, the intrinsic Fermi level, and the carrier concentration equations
---

<div class="problems-styled" markdown>

# End-of-Chapter Problems: Fermi Level Position and Carrier Equations

Work through these problems to reinforce your understanding of the exact carrier-concentration and Fermi-level equations covered in Chapter 10.

---

## Easy

### Problem 1

State the exact electron concentration equation.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(n_0 = \dfrac{(N_D-N_A)+\sqrt{(N_D-N_A)^2+4n_i^2}}{2}\)</span>.</p>
</div>
</details>

---

### Problem 2

What does the exact electron concentration equation give for n0 when N_D = N_A?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(n_0=n_i\)</span> — a perfectly compensated sample behaves as if intrinsic.</p>
</div>
</details>

---

### Problem 3

State the Fermi level position formula in terms of n0.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(E_C-E_F = k_BT\ln(N_C/n_0)\)</span>.</p>
</div>
</details>

---

### Problem 4

State the two general carrier concentration equations referenced to E_i.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(n_0=n_ie^{(E_F-E_i)/k_BT}\)</span> and <span class="arithmatex">\(p_0=n_ie^{(E_i-E_F)/k_BT}\)</span>.</p>
</div>
</details>

---

### Problem 5

What condition defines the intrinsic Fermi level E_i?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">E_i is the Fermi level position where <span class="arithmatex">\(n_0=p_0=n_i\)</span> (the purely intrinsic case).</p>
</div>
</details>

---

### Problem 6

What approximation does every equation in this chapter depend on?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">The Boltzmann approximation (equivalently, the nondegenerate semiconductor assumption).</p>
</div>
</details>

---

### Problem 7

In the extrinsic limit (N_D − N_A ≫ n_i), what does the exact electron concentration equation reduce to?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(n_0\approx N_D-N_A\)</span>.</p>
</div>
</details>

---

### Problem 8

Is the intrinsic Fermi level always exactly at the middle of the band gap? Why or why not?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">No — it is offset from exact midgap by <span class="arithmatex">\((k_BT/2)\ln(N_V/N_C)\)</span>, a small correction that is nonzero whenever N_C ≠ N_V.</p>
</div>
</details>

---

## Medium

### Problem 9

A silicon sample has \(N_D=8\times10^{16}\ \text{cm}^{-3}\), \(N_A=0\), at 300 K (\(n_i\approx9.65\times10^9\ \text{cm}^{-3}\)). Use the exact formula to find n0, and compare to the simple approximation.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Since <span class="arithmatex">\(N_D\gg n_i\)</span>, the square root term is essentially N_D itself, giving <span class="arithmatex">\(n_0\approx(8\times10^{16}+8\times10^{16})/2=8\times10^{16}\ \text{cm}^{-3}\)</span> — matching the simple approximation n0≈N_D almost exactly.</p>
</div>
</details>

---

### Problem 10

Using n0 = 8×10^16 cm^-3 from Problem 9 and N_C ≈ 2.8×10^19 cm^-3 (silicon, 300 K), find E_C − E_F.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(E_C-E_F=(0.0259)\ln(2.8\times10^{19}/8\times10^{16})=(0.0259)\ln(350)\approx(0.0259)(5.86)\approx0.152\ \text{eV}\)</span>.</p>
</div>
</details>

---

### Problem 11

Explain why the exact carrier concentration equation reduces to n0 ≈ n_i at very high temperature, regardless of doping level.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">At very high temperature, n_i(T) grows exponentially and eventually becomes much larger than the fixed doping (N_D−N_A). In that limit, the sqrt((ND-NA)^2 + 4ni^2) term is dominated by the 4ni^2 term, so n0 ≈ [(ND-NA) + 2ni]/2 ≈ ni, since ni itself dwarfs (ND-NA).</p>
</div>
</details>

---

### Problem 12

Using silicon's N_C≈2.8×10^19 cm^-3 and N_V≈1.04×10^19 cm^-3 at 300 K, compute E_i's offset from exact midgap in meV.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(\Delta E_i=(0.0259/2)\ln(1.04\times10^{19}/2.8\times10^{19})=(0.01295)\ln(0.371)\approx(0.01295)(-0.991)\approx-12.8\ \text{meV}\)</span> — E_i sits about 12.8 meV below exact midgap.</p>
</div>
</details>

---

### Problem 13

A silicon sample has \(E_F-E_i=0.25\) eV at 300 K. Using n_i≈9.65×10^9 cm^-3, find n0.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(n_0=n_ie^{0.25/0.0259}=(9.65\times10^9)e^{9.65}\approx(9.65\times10^9)(1.55\times10^4)\approx1.5\times10^{14}\ \text{cm}^{-3}\)</span>.</p>
</div>
</details>

---

### Problem 14

Explain, in words, why the exact carrier concentration equation does not correctly describe the freeze-out region from Chapter 8.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">The exact formula was derived assuming complete ionization (N_D^+ ≈ N_D, N_A^- ≈ N_A), an assumption that fails at low temperature in the freeze-out regime, where a significant fraction of dopants are not yet ionized. Capturing freeze-out correctly would require combining charge neutrality with a temperature-dependent ionization fraction instead of assuming full ionization.</p>
</div>
</details>

---

### Problem 15

A silicon sample has N_A=3×10^16 cm^-3, N_D=0, at 300 K. Find p0 (exact formula) and E_F−E_V using N_V≈1.04×10^19 cm^-3.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Since N_A ≫ n_i, <span class="arithmatex">\(p_0\approx3\times10^{16}\ \text{cm}^{-3}\)</span>. Then <span class="arithmatex">\(E_F-E_V=(0.0259)\ln(1.04\times10^{19}/3\times10^{16})=(0.0259)\ln(346.7)\approx(0.0259)(5.85)\approx0.151\ \text{eV}\)</span>.</p>
</div>
</details>

---

### Problem 16

Show algebraically that setting E_F = E_i in the carrier concentration equations gives n0 = p0 = n_i.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Substituting E_F=E_i: <span class="arithmatex">\(n_0=n_ie^{(E_i-E_i)/k_BT}=n_ie^0=n_i\)</span>, and similarly <span class="arithmatex">\(p_0=n_ie^{(E_i-E_i)/k_BT}=n_i\)</span>. Both equal n_i, confirming E_F=E_i is exactly the intrinsic condition.</p>
</div>
</details>

---

## Difficult

### Problem 17

Starting from \(n_0+N_A=n_i^2/n_0+N_D\), derive the quadratic equation \(n_0^2-(N_D-N_A)n_0-n_i^2=0\) and then the exact electron concentration formula, showing each algebraic step.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Multiplying both sides by n0: <span class="arithmatex">\(n_0^2+N_An_0=n_i^2+N_Dn_0\)</span>. Rearranging: <span class="arithmatex">\(n_0^2+(N_A-N_D)n_0-n_i^2=0\)</span>, equivalently <span class="arithmatex">\(n_0^2-(N_D-N_A)n_0-n_i^2=0\)</span>. Applying the quadratic formula with a=1, b=-(N_D-N_A), c=-n_i^2: <span class="arithmatex">\(n_0=\dfrac{(N_D-N_A)\pm\sqrt{(N_D-N_A)^2+4n_i^2}}{2}\)</span>. Since concentration must be positive and the discriminant's square root is always larger in magnitude than |N_D-N_A|, only the "+" root gives a physically valid (positive) result.</p>
</div>
</details>

---

### Problem 18

A hypothetical semiconductor at a fixed temperature has N_C = N_V exactly. What does this imply about the location of E_i, and why?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">If N_C = N_V, then ln(N_V/N_C) = ln(1) = 0, so the correction term (k_BT/2)ln(N_V/N_C) vanishes entirely, placing E_i exactly at midgap, (E_C+E_V)/2. This would occur if the electron and hole effective masses were exactly equal (since N_C and N_V both depend on effective mass the same way), which is not generally the case for real semiconductors like silicon.</p>
</div>
</details>

---

### Problem 19

A silicon sample is doped with N_D = 2×10^13 cm^-3 (very lightly doped, comparable to n_i at 300 K). Compute n0 exactly, and determine what fraction of n0 comes from doping versus intrinsic generation by comparing to both the pure-doping estimate (N_D) and the pure-intrinsic estimate (n_i).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">With <span class="arithmatex">\(N_D=2\times10^{13}\)</span> and <span class="arithmatex">\(n_i\approx9.65\times10^9\)</span>: <span class="arithmatex">\(n_0=\dfrac{2\times10^{13}+\sqrt{(2\times10^{13})^2+4(9.65\times10^9)^2}}{2}\)</span>. Since <span class="arithmatex">\((2\times10^{13})^2=4\times10^{26}\)</span> and <span class="arithmatex">\(4(9.65\times10^9)^2\approx3.73\times10^{20}\)</span>, the second term under the root is over a million times smaller and negligible, so <span class="arithmatex">\(n_0\approx2\times10^{13}\ \text{cm}^{-3}\approx N_D\)</span>. Even at this very light doping level, N_D still exceeds n_i by roughly 2000×, so the extrinsic (doping-dominated) approximation remains excellent — the doping would need to approach within about an order of magnitude of n_i itself before the intrinsic contribution becomes significant, as seen in Worked Example 8 in the chapter text.</p>
</div>
</details>

---

### Problem 20

Explain why the carrier concentration equations \(n_0=n_ie^{(E_F-E_i)/k_BT}\) and \(p_0=n_ie^{(E_i-E_F)/k_BT}\) are described in the chapter as more useful for later chapters than the band-edge-referenced forms \(n_0=N_Ce^{-(E_C-E_F)/k_BT}\) and \(p_0=N_Ve^{-(E_F-E_V)/k_BT}\), even though both are mathematically equivalent.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">The E_i-referenced form requires knowing only two material/temperature-dependent numbers (n_i and E_i) plus the single quantity E_F−E_i that actually varies with doping and position — whereas the band-edge form separately requires N_C, N_V, E_C, and E_V. Since p-n junctions and other devices are fundamentally about how E_F (or equivalently n0/p0) differs between two regions of the same material at the same temperature, expressing everything relative to the single, material-fixed reference E_i makes comparing those regions — and computing quantities like built-in potential, which depend on the difference in E_F−E_i between the two sides — much more direct.</p>
</div>
</details>

</div>
