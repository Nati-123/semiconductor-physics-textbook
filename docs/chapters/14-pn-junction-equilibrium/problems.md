---
title: Chapter 14 Problems - The P-N Junction at Equilibrium
description: Practice problems for the metallurgical junction, the depletion region and depletion approximation, built-in potential, Poisson's equation, depletion charge density, junction electric field, depletion width, and junction capacitance
---

<div class="problems-styled" markdown>

# End-of-Chapter Problems: The P-N Junction at Equilibrium

Work through these problems to reinforce your understanding of the equilibrium p-n junction covered in Chapter 14.

---

## Easy

### Problem 1

Define the metallurgical junction.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">The geometric plane, conventionally at \(x=0\), where the net doping concentration switches from p-type to n-type within a single crystal.</p>
</div>
</details>

---

### Problem 2

State the built-in potential formula.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(V_{bi} = \dfrac{kT}{q}\ln\!\left(\dfrac{N_AN_D}{n_i^2}\right)\)</span>.</p>
</div>
</details>

---

### Problem 3

State Poisson's equation in the one-dimensional form used in this chapter.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(\dfrac{dE}{dx} = \dfrac{\rho(x)}{\varepsilon}\)</span>.</p>
</div>
</details>

---

### Problem 4

State the depletion charge density \(\rho(x)\) under the depletion approximation.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(\rho(x)=-qN_A\)</span> for <span class="arithmatex">\(-x_p\le x<0\)</span>, <span class="arithmatex">\(\rho(x)=+qN_D\)</span> for <span class="arithmatex">\(0<x\le x_n\)</span>, and zero outside the depletion region.</p>
</div>
</details>

---

### Problem 5

State the charge-neutrality condition relating \(x_p\) and \(x_n\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(N_Ax_p = N_Dx_n\)</span>.</p>
</div>
</details>

---

### Problem 6

State the depletion width formula \(W\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(W = \sqrt{\dfrac{2\varepsilon V_{bi}}{q}\left(\dfrac{1}{N_A}+\dfrac{1}{N_D}\right)}\)</span>.</p>
</div>
</details>

---

### Problem 7

State the junction capacitance formula.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(C_j = \varepsilon A/W\)</span>.</p>
</div>
</details>

---

### Problem 8

True or False: The built-in potential \(V_{bi}\) depends on the physical cross-sectional area of the junction.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">False. \(V_{bi}\) depends only on \(N_A\), \(N_D\), \(n_i\), and \(T\) — all intensive material properties, not device geometry. (Junction capacitance, by contrast, does depend on area.)</p>
</div>
</details>

---

## Medium

### Problem 9

A silicon p-n junction has \(N_A=5\times10^{16}\ \text{cm}^{-3}\) and \(N_D=2\times10^{16}\ \text{cm}^{-3}\), with \(n_i=1.5\times10^{10}\ \text{cm}^{-3}\). Find \(V_{bi}\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(V_{bi}=0.0259\ln\!\left(\dfrac{(5\times10^{16})(2\times10^{16})}{(1.5\times10^{10})^2}\right)\approx0.754\ \text{V}\)</span>.</p>
</div>
</details>

---

### Problem 10

Using \(V_{bi}=0.754\ \text{V}\) from Problem 9 and \(\varepsilon=1.035\times10^{-12}\ \text{F/cm}\), find the total depletion width \(W\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(W=\sqrt{\dfrac{2(1.035\times10^{-12})(0.754)}{1.6\times10^{-19}}\left(\dfrac{1}{5\times10^{16}}+\dfrac{1}{2\times10^{16}}\right)}\approx2.61\times10^{-5}\ \text{cm}=261.2\ \text{nm}\)</span>.</p>
</div>
</details>

---

### Problem 11

Using \(W=261.2\ \text{nm}\) from Problem 10, find \(x_n\) and \(x_p\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(x_n=W\dfrac{N_A}{N_A+N_D}=261.2\left(\dfrac{5}{7}\right)\approx186.6\ \text{nm}\)</span>, <span class="arithmatex">\(x_p=261.2\left(\dfrac{2}{7}\right)\approx74.6\ \text{nm}\)</span>.</p>
</div>
</details>

---

### Problem 12

Using \(x_p=74.6\ \text{nm}\) from Problem 11, find the peak electric field \(E_{max}\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(E_{max}=\dfrac{qN_Ax_p}{\varepsilon}=\dfrac{(1.6\times10^{-19})(5\times10^{16})(7.46\times10^{-6})}{1.035\times10^{-12}}\approx5.78\times10^{4}\ \text{V/cm}\)</span>.</p>
</div>
</details>

---

### Problem 13

Using \(W=261.2\ \text{nm}\) from Problem 10 and a junction area \(A=1\times10^{-4}\ \text{cm}^2\), find the junction capacitance \(C_j\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(C_j=\dfrac{\varepsilon A}{W}=\dfrac{(1.035\times10^{-12})(1\times10^{-4})}{2.612\times10^{-5}}\approx3.96\times10^{-12}\ \text{F}=3.96\ \text{pF}\)</span>.</p>
</div>
</details>

---

### Problem 14

A symmetric silicon junction has \(N_A=N_D=1\times10^{16}\ \text{cm}^{-3}\). Find \(V_{bi}\), and state how \(W\) splits between the two sides.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(V_{bi}=0.0259\ln\!\left(\dfrac{(1\times10^{16})^2}{(1.5\times10^{10})^2}\right)\approx0.695\ \text{V}\)</span>, giving <span class="arithmatex">\(W\approx423.7\ \text{nm}\)</span>. Because \(N_A=N_D\), the charge-neutrality condition \(N_Ax_p=N_Dx_n\) forces \(x_p=x_n\) — the depletion width splits exactly 50/50, \(x_n=x_p\approx211.8\ \text{nm}\).</p>
</div>
</details>

---

### Problem 15

A one-sided silicon junction has \(N_A=1\times10^{18}\ \text{cm}^{-3}\) and \(N_D=1\times10^{15}\ \text{cm}^{-3}\). Find \(V_{bi}\) and \(W\), and identify which side holds nearly all of the depletion width.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(V_{bi}\approx0.754\ \text{V}\)</span>, <span class="arithmatex">\(W\approx987.7\ \text{nm}\)</span>. Since \(N_A\gg N_D\), charge neutrality forces \(x_p\ll x_n\): \(x_n\approx986.7\ \text{nm}\) (about 99.9% of \(W\)) while \(x_p\approx0.99\ \text{nm}\) — nearly all the depletion width lies in the lightly doped n-side.</p>
</div>
</details>

---

### Problem 16

A symmetric junction with \(N_A=N_D=5\times10^{16}\ \text{cm}^{-3}\) is made first in GaAs (\(n_i=2.1\times10^{6}\ \text{cm}^{-3}\)) and then in silicon (\(n_i=1.5\times10^{10}\ \text{cm}^{-3}\)). Find \(V_{bi}\) for both and state which is larger and why.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">GaAs: <span class="arithmatex">\(V_{bi}=0.0259\ln\!\left(\dfrac{(5\times10^{16})^2}{(2.1\times10^{6})^2}\right)\approx1.238\ \text{V}\)</span>. Silicon: <span class="arithmatex">\(V_{bi}=0.0259\ln\!\left(\dfrac{(5\times10^{16})^2}{(1.5\times10^{10})^2}\right)\approx0.778\ \text{V}\)</span>. GaAs's built-in potential is substantially larger because its much smaller \(n_i\) (a consequence of its larger band gap) makes the ratio \(N_AN_D/n_i^2\) — and hence the logarithm — much bigger, at the same doping.</p>
</div>
</details>

---

## Hard

### Problem 17

A silicon junction has \(N_A=2\times10^{18}\ \text{cm}^{-3}\) and \(N_D=2\times10^{15}\ \text{cm}^{-3}\). Find \(V_{bi}\), \(W\), \(x_n\), and \(x_p\), and confirm that this junction satisfies the one-sided (step) junction approximation.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(V_{bi}=0.0259\ln\!\left(\dfrac{(2\times10^{18})(2\times10^{15})}{(1.5\times10^{10})^2}\right)\approx0.790\ \text{V}\)</span>. <span class="arithmatex">\(W\approx714.9\ \text{nm}\)</span>. Since \(N_A/N_D=1000\), charge neutrality gives <span class="arithmatex">\(x_n\approx714.1\ \text{nm}\)</span> and <span class="arithmatex">\(x_p\approx0.71\ \text{nm}\)</span> — \(x_p\) is roughly 1000 times smaller than \(x_n\), so \(W\approx x_n\) to better than 0.1% accuracy, confirming the one-sided approximation is excellent here.</p>
</div>
</details>

---

### Problem 18

A varactor diode design requires \(C_j=1.5\ \text{pF}\) at zero bias, using a symmetric silicon junction with \(N_A=N_D=8\times10^{15}\ \text{cm}^{-3}\). Find the required junction area.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(V_{bi}=0.0259\ln\!\left(\dfrac{(8\times10^{15})^2}{(1.5\times10^{10})^2}\right)\approx0.683\ \text{V}\)</span>, giving <span class="arithmatex">\(W\approx469.7\ \text{nm}\)</span>. Solving <span class="arithmatex">\(A=\dfrac{C_jW}{\varepsilon}=\dfrac{(1.5\times10^{-12})(4.697\times10^{-5})}{1.035\times10^{-12}}\approx6.81\times10^{-5}\ \text{cm}^2\)</span>, corresponding to a roughly square junction about \(82.5\ \mu\text{m}\) on a side.</p>
</div>
</details>

---

### Problem 19

A symmetric silicon junction has \(N_A=N_D=3\times10^{16}\ \text{cm}^{-3}\) and area \(A=1.5\times10^{-4}\ \text{cm}^2\). Find \(C_j\) at zero bias and at \(3\ \text{V}\) reverse bias (use \(V_{bi}+V_R\) in place of \(V_{bi}\) in the depletion-width formula), and comment on the trend.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(V_{bi}\approx0.752\ \text{V}\)</span>. At zero bias: <span class="arithmatex">\(W_0\approx254.4\ \text{nm}\)</span>, <span class="arithmatex">\(C_{j0}\approx6.10\ \text{pF}\)</span>. At \(V_R=3\ \text{V}\): <span class="arithmatex">\(W\approx568.5\ \text{nm}\)</span>, <span class="arithmatex">\(C_j\approx2.73\ \text{pF}\)</span>. Reverse bias more than doubled \(W\) and cut \(C_j\) to less than half its zero-bias value — the depletion width grows only as the square root of \((V_{bi}+V_R)\), so capacitance falls off steeply at first and then more gradually as \(V_R\) increases further.</p>
</div>
</details>

---

### Problem 20

The depletion approximation assumes the mobile carrier concentration drops to exactly zero at the depletion edges \(x=-x_p\) and \(x=x_n\), with sharp, abrupt boundaries. Explain physically why this cannot be exactly true, and describe qualitatively how the real carrier concentration profile differs from the idealized step-function picture near those edges.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Carrier concentration is a continuous function of the local electrostatic potential (via Boltzmann statistics), so it cannot jump discontinuously from its full neutral-region value to exactly zero at a sharp boundary — real carrier concentrations fall off smoothly and exponentially over a distance of a few Debye lengths on either side of the idealized edges, rather than dropping instantly to zero. The depletion approximation is accurate when this transition width is small compared to the total depletion width \(W\) (true for the moderate-to-heavy doping levels used throughout this chapter), which is why it reproduces \(V_{bi}\), \(W\), and \(C_j\) to good accuracy despite being a simplification of the true, smoothly-varying carrier and field profiles.</p>
</div>
</details>

</div>
