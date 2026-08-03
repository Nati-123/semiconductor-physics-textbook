---
title: Chapter 15 Problems - The P-N Junction Under Bias
description: Practice problems for forward and reverse bias, minority carrier injection, the short-base and long-base diode approximations, saturation current, the ideal diode equation, avalanche and Zener breakdown, and the junction I-V characteristic
---

<div class="problems-styled" markdown>

# End-of-Chapter Problems: The P-N Junction Under Bias

Work through these problems to reinforce your understanding of the biased p-n junction covered in Chapter 15.

---

## Easy

### Problem 1

State the law of the junction for injected holes at the depletion edge.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(p_n(x_n) = p_{n0}\,e^{V/V_T}\)</span>.</p>
</div>
</details>

---

### Problem 2

State the ideal diode equation.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(I = I_0\left(e^{V/V_T}-1\right)\)</span>.</p>
</div>
</details>

---

### Problem 3

What is the thermal voltage \(V_T\) at 300 K?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(V_T = kT/q \approx 0.0259\ \text{V}\)</span>.</p>
</div>
</details>

---

### Problem 4

What happens to diode current under reverse bias, once the reverse voltage exceeds a few \(V_T\)?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">It saturates at the small, nearly voltage-independent value \(-I_0\), the saturation current.</p>
</div>
</details>

---

### Problem 5

What shape does the excess minority carrier profile take in a long-base diode?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">An exponentially decaying profile, <span class="arithmatex">\(\Delta p_n(x')=p_{n0}(e^{V/V_T}-1)e^{-x'/L_p}\)</span>.</p>
</div>
</details>

---

### Problem 6

What shape does the excess minority carrier profile take in a short-base diode?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">A linear profile falling to zero at the nearby ohmic contact, <span class="arithmatex">\(\Delta p_n(x')=p_{n0}(e^{V/V_T}-1)(1-x'/W')\)</span>.</p>
</div>
</details>

---

### Problem 7

Name the two mechanisms of reverse breakdown.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Avalanche breakdown (impact-ionization chain reaction) and Zener breakdown (quantum tunneling).</p>
</div>
</details>

---

### Problem 8

True or False: Avalanche breakdown voltage increases with temperature.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">True. Increased lattice scattering at higher temperature means carriers need a higher field (and hence a higher voltage) to reach the energy needed for impact ionization. (Zener breakdown voltage has the opposite temperature dependence — it decreases with temperature.)</p>
</div>
</details>

---

## Medium

### Problem 9

A silicon diode has \(N_A=5\times10^{17}\ \text{cm}^{-3}\), \(N_D=5\times10^{15}\ \text{cm}^{-3}\), \(n_i=1.5\times10^{10}\ \text{cm}^{-3}\). Find \(p_{n0}\) and \(n_{p0}\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(p_{n0}=n_i^2/N_D=(1.5\times10^{10})^2/(5\times10^{15})=4.5\times10^{4}\ \text{cm}^{-3}\)</span>. <span class="arithmatex">\(n_{p0}=n_i^2/N_A=4.5\times10^{2}\ \text{cm}^{-3}\)</span>.</p>
</div>
</details>

---

### Problem 10

A hole has \(D_p=12.4\ \text{cm}^2/\text{s}\) and \(\tau_p=0.5\ \mu\text{s}\). Find the diffusion length \(L_p\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(L_p=\sqrt{(12.4)(0.5\times10^{-6})}\approx2.49\times10^{-3}\ \text{cm}=24.9\ \mu\text{m}\)</span>.</p>
</div>
</details>

---

### Problem 11

Using \(p_{n0}=4.5\times10^{4}\ \text{cm}^{-3}\) from Problem 9 and \(L_p=24.9\ \mu\text{m}\) from Problem 10, find the long-base hole saturation current density \(J_{0,p}\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(J_{0,p}=\dfrac{qD_pp_{n0}}{L_p}=\dfrac{(1.6\times10^{-19})(12.4)(4.5\times10^{4})}{2.49\times10^{-3}}\approx3.59\times10^{-11}\ \text{A/cm}^2\)</span>.</p>
</div>
</details>

---

### Problem 12

Using \(J_0=3.59\times10^{-11}\ \text{A/cm}^2\) from Problem 11, find the forward current density at \(V=0.55\ \text{V}\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(J=J_0(e^{V/V_T}-1)=(3.59\times10^{-11})(e^{0.55/0.0259}-1)\approx5.99\times10^{-2}\ \text{A/cm}^2\)</span>.</p>
</div>
</details>

---

### Problem 13

If the same n-side from Problems 9-11 is instead fabricated short-base with \(W'=3\ \mu\text{m}\), find the new \(J_{0,p}\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(J_{0,p}^{short}=\dfrac{qD_pp_{n0}}{W'}=\dfrac{(1.6\times10^{-19})(12.4)(4.5\times10^{4})}{3\times10^{-4}}\approx2.98\times10^{-10}\ \text{A/cm}^2\)</span>, about \(L_p/W'\approx8.3\times\) larger than the long-base value.</p>
</div>
</details>

---

### Problem 14

Using \(p_{n0}=4.5\times10^{4}\ \text{cm}^{-3}\) from Problem 9, find the excess hole concentration injected at the depletion edge under \(V=0.45\ \text{V}\) forward bias.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(\Delta p_n(x_n)=p_{n0}(e^{V/V_T}-1)=(4.5\times10^{4})(e^{0.45/0.0259}-1)\approx1.58\times10^{12}\ \text{cm}^{-3}\)</span>.</p>
</div>
</details>

---

### Problem 15

Estimate the avalanche breakdown voltage for a silicon diode with lightly-doped-side concentration \(N_D=5\times10^{15}\ \text{cm}^{-3}\), using \(E_{crit}=3\times10^{5}\ \text{V/cm}\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(V_{BR}\approx\dfrac{(1.035\times10^{-12})(3\times10^5)^2}{2(1.6\times10^{-19})(5\times10^{15})}\approx58.2\ \text{V}\)</span>.</p>
</div>
</details>

---

### Problem 16

A diode has \(I_0=5\times10^{-14}\ \text{A}\). Find the forward voltage needed to reach \(I=1\ \text{mA}\) at 300 K.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Neglecting the \(-1\) term: <span class="arithmatex">\(V=V_T\ln(I/I_0)=(0.0259)\ln\!\left(\dfrac{1\times10^{-3}}{5\times10^{-14}}\right)\approx(0.0259)(23.72)\approx0.614\ \text{V}\)</span>.</p>
</div>
</details>

---

## Hard

### Problem 17

A silicon diode has \(N_A=2\times10^{17}\ \text{cm}^{-3}\), \(N_D=2\times10^{16}\ \text{cm}^{-3}\), \(D_p=12.4\ \text{cm}^2/\text{s}\), \(\tau_p=0.8\ \mu\text{s}\), \(D_n=35\ \text{cm}^2/\text{s}\), \(\tau_n=0.15\ \mu\text{s}\), long-base on both sides. Find the total saturation current density \(J_0\), and the total current \(I\) at \(V=0.6\ \text{V}\) for a junction area \(A=1\times10^{-3}\ \text{cm}^2\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(p_{n0}=1.125\times10^{4}\ \text{cm}^{-3}\)</span>, <span class="arithmatex">\(n_{p0}=1.125\times10^{3}\ \text{cm}^{-3}\)</span>. <span class="arithmatex">\(L_p=\sqrt{(12.4)(0.8\times10^{-6})}\approx31.5\ \mu\text{m}\)</span>, <span class="arithmatex">\(L_n=\sqrt{(35)(0.15\times10^{-6})}\approx22.9\ \mu\text{m}\)</span>. <span class="arithmatex">\(J_{0,p}\approx7.10\times10^{-12}\ \text{A/cm}^2\)</span>, <span class="arithmatex">\(J_{0,n}\approx2.75\times10^{-12}\ \text{A/cm}^2\)</span>, so <span class="arithmatex">\(J_0\approx9.85\times10^{-12}\ \text{A/cm}^2\)</span>. At \(V=0.6\ \text{V}\): <span class="arithmatex">\(J\approx J_0e^{V/V_T}\approx0.113\ \text{A/cm}^2\)</span>, so <span class="arithmatex">\(I=JA\approx1.13\times10^{-4}\ \text{A}\approx0.113\ \text{mA}\)</span>.</p>
</div>
</details>

---

### Problem 18

A diode has \(J_0=1.34\times10^{-11}\ \text{A/cm}^2\). Find the junction area needed to supply \(I=50\ \text{mA}\) at \(V=0.65\ \text{V}\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(J(0.65\ \text{V})=J_0(e^{0.65/0.0259}-1)\approx1.06\ \text{A/cm}^2\)</span>. <span class="arithmatex">\(A=I/J=0.05/1.06\approx4.71\times10^{-2}\ \text{cm}^2\)</span>, corresponding to a roughly square die about \(2.17\ \text{mm}\) on a side — a typical size for a small power-rectifier diode chip.</p>
</div>
</details>

---

### Problem 19

Estimate the avalanche breakdown voltage for silicon diodes with lightly-doped-side concentrations \(N_B=2\times10^{14}\ \text{cm}^{-3}\) and \(N_B=8\times10^{16}\ \text{cm}^{-3}\), and classify which breakdown mechanism is more plausible for each.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">At \(N_B=2\times10^{14}\ \text{cm}^{-3}\): <span class="arithmatex">\(V_{BR}\approx1454\ \text{V}\)</span> — far too large and lightly-doped for tunneling to matter; clearly avalanche-dominated, typical of high-voltage rectifier and power diodes. At \(N_B=8\times10^{16}\ \text{cm}^{-3}\): <span class="arithmatex">\(V_{BR}\approx3.6\ \text{V}\)</span> — below the ~5-6 V crossover, so this junction is heavily-doped enough that real breakdown would be dominated by Zener tunneling rather than the avalanche estimate.</p>
</div>
</details>

---

### Problem 20

The saturation current \(J_0\) is far more sensitive to temperature than the mobility (and hence diffusion coefficient) terms it contains. Explain why, referencing the dependence of \(J_0\) on \(n_i\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">\(J_0\propto n_i^2\), and \(n_i^2\propto T^3e^{-E_g/kT}\) (Chapter 7) — an exponential dependence on temperature through the Boltzmann factor. Diffusion coefficients depend on temperature only through mobility's much weaker power-law temperature dependence (Chapter 11) and the linear \(kT/q\) factor in the Einstein relation. Because exponential temperature dependence completely dominates any power-law dependence, \(J_0\) — and therefore the entire forward I-V curve at fixed voltage — is overwhelmingly set by \(n_i^2\)'s exponential sensitivity to temperature, which is why diode forward voltage at fixed current drops by a fairly predictable amount (roughly 2 mV/°C for silicon) as temperature rises.</p>
</div>
</details>

</div>
