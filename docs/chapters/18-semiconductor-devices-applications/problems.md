---
title: Chapter 18 Problems - Semiconductor Devices and Applications
description: Practice problems for power diodes, rectifier circuits, varactor diodes, bipolar transistor and MOSFET basics, semiconductor device modeling, band diagram construction, device design trade-offs, and the capstone device project
---

<div class="problems-styled" markdown>

# End-of-Chapter Problems: Semiconductor Devices and Applications

Work through these problems to reinforce your understanding of semiconductor devices and applications covered in Chapter 18.

---

## Easy

### Problem 1

State the power diode drift doping and drift width formulas.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(N_D\approx\varepsilon_sE_{crit}^2/(2qV_{BR})\)</span>, <span class="arithmatex">\(W\approx2V_{BR}/E_{crit}\)</span>.</p>
</div>
</details>

---

### Problem 2

State the full-wave bridge rectifier average DC output formula.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(V_{DC}\approx2(V_{peak}-2V_F)/\pi\)</span>.</p>
</div>
</details>

---

### Problem 3

State the LC tank resonant frequency formula used with a varactor diode.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(f=1/(2\pi\sqrt{LC_j})\)</span>.</p>
</div>
</details>

---

### Problem 4

State the bipolar transistor current gain relations.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(I_C=\beta I_B\)</span>, <span class="arithmatex">\(I_E=(\beta+1)I_B\)</span>.</p>
</div>
</details>

---

### Problem 5

State the MOSFET saturation drain current formula.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(I_D=(\mu_nC_{ox}/2)(W/L)(V_{GS}-V_T)^2\)</span>.</p>
</div>
</details>

---

### Problem 6

Name the three levels of the semiconductor device modeling hierarchy, from fastest/least accurate to slowest/most accurate.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Analytic (closed-form) models, compact models (used in SPICE), and numerical device simulation.</p>
</div>
</details>

---

### Problem 7

State the general band diagram construction procedure in one sentence.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Draw each material region's bands flat at the correct relative height away from junctions, then bend them smoothly at each junction to keep the Fermi level (or quasi-Fermi levels, under bias) continuous.</p>
</div>
</details>

---

### Problem 8

State the simplified specific on-resistance trade-off formula.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(R_{on,sp}\approx4V_{BR}^2/(\mu_n\varepsilon_sE_{crit}^3)\)</span>.</p>
</div>
</details>

---

## Medium

### Problem 9

A power diode targets \(V_{BR}=800\ \text{V}\). Find the required drift doping \(N_D\) and drift width \(W\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(N_D=\dfrac{(1.035\times10^{-12})(3\times10^5)^2}{2(1.6\times10^{-19})(800)}\approx3.63\times10^{14}\ \text{cm}^{-3}\)</span>. <span class="arithmatex">\(W=\dfrac{2(800)}{3\times10^5}\approx5.33\times10^{-3}\ \text{cm}=53.3\ \mu\text{m}\)</span>.</p>
</div>
</details>

---

### Problem 10

Using \(V_{BR}=800\ \text{V}\) from Problem 9, find the specific on-resistance.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(R_{on,sp}\approx\dfrac{4(800)^2}{(1350)(1.035\times10^{-12})(3\times10^5)^3}\approx0.0679\ \Omega\cdot\text{cm}^2\)</span>.</p>
</div>
</details>

---

### Problem 11

A full-wave bridge rectifier has \(V_{peak}=100\ \text{V}\) and \(V_F=0.6\ \text{V}\) per diode. Find \(V_{DC}\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(V_{DC}=\dfrac{2(100-2(0.6))}{\pi}\approx62.9\ \text{V}\)</span>.</p>
</div>
</details>

---

### Problem 12

A varactor-tuned tank has \(L=5\ \mu\text{H}\) and \(C_j=10\ \text{pF}\). Find the resonant frequency.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(f=1/(2\pi\sqrt{(5\times10^{-6})(10\times10^{-12})})\approx22.5\ \text{MHz}\)</span>.</p>
</div>
</details>

---

### Problem 13

A BJT has \(\beta=80\) and \(I_B=15\ \mu\text{A}\). Find \(I_C\) and \(I_E\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(I_C=(80)(15\ \mu\text{A})=1.2\ \text{mA}\)</span>. <span class="arithmatex">\(I_E=(81)(15\ \mu\text{A})\approx1.215\ \text{mA}\)</span>.</p>
</div>
</details>

---

### Problem 14

A MOSFET has \(C_{ox}=2\times10^{-7}\ \text{F/cm}^2\), \(\mu_n=500\ \text{cm}^2/\text{V}\cdot\text{s}\), \(W/L=20\), \(V_{GS}-V_T=0.4\ \text{V}\). Find \(I_D\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(I_D=\dfrac{(500)(2\times10^{-7})}{2}(20)(0.4)^2\approx1.60\times10^{-4}\ \text{A}=0.160\ \text{mA}\)</span>.</p>
</div>
</details>

---

### Problem 15

Find the specific on-resistance for a power diode rated at \(V_{BR}=300\ \text{V}\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(R_{on,sp}\approx\dfrac{4(300)^2}{(1350)(1.035\times10^{-12})(3\times10^5)^3}\approx0.00954\ \Omega\cdot\text{cm}^2\)</span>.</p>
</div>
</details>

---

### Problem 16

A device dissipates \(P=3\ \text{W}\) through a die of thickness \(t=150\ \mu\text{m}\) and area \(A=0.05\ \text{cm}^2\), \(\kappa=150\ \text{W/(m·K)}\). Find the temperature rise.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(\Delta T=\dfrac{(3)(1.5\times10^{-4})}{(150)(5\times10^{-6})}\approx0.6\ \text{K}\)</span>.</p>
</div>
</details>

---

## Hard

### Problem 17

Design the drift region of a power diode rated at \(V_{BR}=700\ \text{V}\): find \(N_D\), \(W\), and \(R_{on,sp}\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(N_D\approx4.15\times10^{14}\ \text{cm}^{-3}\)</span>, <span class="arithmatex">\(W\approx46.7\ \mu\text{m}\)</span>, <span class="arithmatex">\(R_{on,sp}\approx0.0520\ \Omega\cdot\text{cm}^2\)</span>.</p>
</div>
</details>

---

### Problem 18

Continuing Problem 17, with die area \(A=0.15\ \text{cm}^2\) and rated current \(I=8\ \text{A}\), find \(R_{on}\), the drift voltage drop, and total forward voltage drop (using a \(0.8\ \text{V}\) junction drop) and power dissipation.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(R_{on}=R_{on,sp}/A\approx0.346\ \Omega\)</span>. <span class="arithmatex">\(V_{drift}=IR_{on}\approx2.77\ \text{V}\)</span>. <span class="arithmatex">\(V_F=0.8+2.77\approx3.57\ \text{V}\)</span>. <span class="arithmatex">\(P=IV_F\approx28.6\ \text{W}\)</span> — a substantial power loss, illustrating how demanding this particular combination of high current and high blocking voltage is on a single small die.</p>
</div>
</details>

---

### Problem 19

Continuing Problem 18, with die thickness \(t=250\ \mu\text{m}\) and \(\kappa=150\ \text{W/(m·K)}\), find the temperature rise across the die.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(\Delta T=\dfrac{(28.6)(2.5\times10^{-4})}{(150)(1.5\times10^{-5})}\approx3.17\ \text{K}\)</span> — again, only the silicon die's own contribution; a real package would need a heat sink to keep total temperature rise manageable at this power level.</p>
</div>
</details>

---

### Problem 20

Compare specific on-resistance at \(V_{BR}=800\ \text{V}\) versus \(V_{BR}=200\ \text{V}\), and confirm the ratio matches the expected \(V_{BR}^2\) scaling.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Since \(R_{on,sp}\propto V_{BR}^2\), and \((800/200)^2=16\), \(R_{on,sp}(800\ \text{V})\) should be exactly 16 times \(R_{on,sp}(200\ \text{V})\) — direct calculation confirms this ratio, verifying the quadratic scaling law.</p>
</div>
</details>

---

### Problem 21

Compare how BJT collector current and MOSFET drain current each scale if base current (BJT) and gate overdrive (MOSFET) are both tripled.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">BJT: since \(I_C=\beta I_B\) is linear, tripling \(I_B\) exactly triples \(I_C\) (ratio = 3.00). MOSFET: since \(I_D\propto(V_{GS}-V_T)^2\) is quadratic, tripling the overdrive voltage multiplies \(I_D\) by \(3^2=9\) (ratio = 9.00) — a direct numeric confirmation of the linear-vs-quadratic contrast discussed throughout this chapter.</p>
</div>
</details>

---

### Problem 22

Explain why real power device design cannot simply "optimize" breakdown voltage and on-resistance independently, using the trade-off relationship derived in this chapter.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Both quantities trace back to the same underlying variable — drift region doping \(N_D\) — through the avalanche breakdown formula (Chapter 15) and the drift-region resistance formula (Chapter 11). Lighter doping raises breakdown voltage but also raises resistance (fewer majority carriers to conduct current), while heavier doping does the opposite. Because a single physical parameter controls both outcomes in opposite directions, an engineer cannot independently choose "high breakdown voltage" and "low on-resistance" — every design decision moves along the same fixed \(R_{on,sp}\propto V_{BR}^2\) curve, and improving one metric necessarily costs the other.</p>
</div>
</details>

</div>
