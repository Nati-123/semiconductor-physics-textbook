---
title: Chapter 19 Problems - Semiconductor Device Fabrication
description: Practice problems for crystal growth, wafer preparation, thermal oxidation, photolithography, thin-film deposition, diffusion, ion implantation, etching, metallization, CMOS process integration, and yield
---

<div class="problems-styled" markdown>

# End-of-Chapter Problems: Semiconductor Device Fabrication

Work through these problems to reinforce your understanding of semiconductor device fabrication covered in Chapter 19.

---

## Easy

### Problem 1

State the Deal-Grove thermal oxidation growth law in its general form.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(x_{ox}^2+Ax_{ox}=B(t+\tau)\)</span>.</p>
</div>
</details>

---

### Problem 2

State the Rayleigh criterion for minimum resolvable lithography feature size.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(CD=k_1\lambda/NA\)</span>.</p>
</div>
</details>

---

### Problem 3

Which crystal growth method — Czochralski or float-zone — produces higher-purity silicon, and why?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Float-zone, because the melt never contacts a crucible wall, avoiding the trace contamination Czochralski growth introduces.</p>
</div>
</details>

---

### Problem 4

State the etch selectivity formula.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(S=R_{film}/R_{mask}\)</span>.</p>
</div>
</details>

---

### Problem 5

Which type of etching (wet or dry) is inherently isotropic, and why?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Wet etching, because a liquid chemical reagent attacks the target material roughly equally in every direction, with no built-in directionality.</p>
</div>
</details>

---

### Problem 6

State the manufacturing yield formula under the simple Poisson model.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(Y=e^{-D_0A}\)</span>.</p>
</div>
</details>

---

### Problem 7

Name the three major thin-film deposition techniques introduced in this chapter.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Chemical vapor deposition (CVD), physical vapor deposition (PVD), and atomic layer deposition (ALD).</p>
</div>
</details>

---

### Problem 8

Why must an ion-implanted wafer be annealed before the implanted dopants can contribute free carriers?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Implantation knocks silicon atoms out of their lattice sites and leaves dopant atoms in non-substitutional positions; annealing repairs the lattice damage and moves the dopants onto substitutional sites where they can ionize.</p>
</div>
</details>

---

## Medium

### Problem 9

A thermal oxidation process has \(B=0.05\ \mu\text{m}^2/\text{hr}\) and is run for 6 hours in the parabolic regime. Find the resulting oxide thickness.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(x_{ox}\approx\sqrt{Bt}=\sqrt{(0.05)(6)}=\sqrt{0.3}\approx0.548\ \mu\text{m}\)</span>.</p>
</div>
</details>

---

### Problem 10

A DUV stepper uses \(\lambda=248\ \text{nm}\), \(NA=0.93\), and \(k_1=0.35\). Find the minimum resolvable feature size.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(CD=k_1\lambda/NA=(0.35)(248)/0.93\approx93.3\ \text{nm}\)</span>.</p>
</div>
</details>

---

### Problem 11

A limited-source Gaussian diffusion has surface concentration \(N(0)=5\times10^{18}\ \text{cm}^{-3}\) and \(Dt=1\times10^{-9}\ \text{cm}^2\). Find the concentration at \(x=0.1\ \mu\text{m}\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Converting <span class="arithmatex">\(x=0.1\ \mu\text{m}=1\times10^{-5}\ \text{cm}\)</span>: <span class="arithmatex">\(N(x)=N(0)\exp(-x^2/4Dt)=(5\times10^{18})\exp(-(1\times10^{-5})^2/(4\times10^{-9}))=(5\times10^{18})\exp(-0.025)\approx4.88\times10^{18}\ \text{cm}^{-3}\)</span>.</p>
</div>
</details>

---

### Problem 12

An implant has projected range \(R_p=0.2\ \mu\text{m}\), straggle \(\Delta R_p=0.06\ \mu\text{m}\), and dose \(2\times10^{13}\ \text{cm}^{-2}\). Find the peak concentration.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(N_{peak}=\text{Dose}/(\sqrt{2\pi}\Delta R_p)=(2\times10^{13})/[(2.507)(0.06\times10^{-4}\ \text{cm})]\approx1.33\times10^{18}\ \text{cm}^{-3}\)</span>.</p>
</div>
</details>

---

### Problem 13

A wet etch removes a film isotropically at 150 nm/min in every direction. Find its anisotropy factor, and explain what that value means physically.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Isotropic means <span class="arithmatex">\(R_{lateral}=R_{vertical}=150\ \text{nm/min}\)</span>, so <span class="arithmatex">\(A_f=1-150/150=0\)</span> — the etch removes material equally sideways and downward, with no directional preference.</p>
</div>
</details>

---

### Problem 14

A contact etch must clear 400 nm of dielectric while removing at most 20 nm of the underlying contact layer. Find the minimum required selectivity.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(S_{min}=400/20=20\)</span>.</p>
</div>
</details>

---

### Problem 15

A process has defect density \(D_0=0.3\ \text{defects/cm}^2\). Find the yield for a \(1.5\ \text{cm}^2\) die.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(Y=e^{-(0.3)(1.5)}=e^{-0.45}\approx0.638\)</span>, or 63.8%.</p>
</div>
</details>

---

### Problem 16

Explain why the gate in a CMOS process is patterned before the source/drain implant, rather than after.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Patterning the gate first lets it act as an implantation mask, blocking dopants directly beneath it. This self-aligns the source and drain edges to the gate with no separate alignment step, which would otherwise introduce registration error.</p>
</div>
</details>

---

### Problem 17

An ingot 2.0 m long is sliced into 700 μm wafers with a 140 μm saw kerf. Estimate the number of wafers produced.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Each wafer consumes <span class="arithmatex">\(700+140=840\ \mu\text{m}=0.84\ \text{mm}\)</span> of ingot length. Number of wafers <span class="arithmatex">\(\approx2000/0.84\approx2381\)</span> wafers.</p>
</div>
</details>

---

## Hard

### Problem 18

A limited-source Gaussian diffusion has dose \(Q=5\times10^{13}\ \text{cm}^{-2}\) and \(Dt=8\times10^{-10}\ \text{cm}^2\). The background doping is \(N_B=5\times10^{15}\ \text{cm}^{-3}\). Find the junction depth \(x_j\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Surface concentration: <span class="arithmatex">\(N(0)=Q/\sqrt{\pi Dt}=(5\times10^{13})/\sqrt{\pi(8\times10^{-10})}\approx9.98\times10^{17}\ \text{cm}^{-3}\)</span>. Junction depth: <span class="arithmatex">\(x_j=\sqrt{4Dt\ln(N(0)/N_B)}=\sqrt{4(8\times10^{-10})\ln(199.6)}=\sqrt{(3.2\times10^{-9})(5.30)}\approx1.30\times10^{-4}\ \text{cm}\approx1.30\ \mu\text{m}\)</span>.</p>
</div>
</details>

---

### Problem 19

An oxidation process has \(B=0.045\ \mu\text{m}^2/\text{hr}\) and \(B/A=0.5\ \mu\text{m/hr}\). At what oxide thickness does the linear-regime and parabolic-regime prediction cross (i.e., \(x_{ox}=A\), the point where the two growth-rate terms in the Deal-Grove equation contribute equally)? Use \(A=B/(B/A)\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(A=B/(B/A)=0.045/0.5=0.09\ \mu\text{m}\)</span>. This is the characteristic thickness at which oxidation transitions from linear-regime (reaction-limited) to parabolic-regime (diffusion-limited) behavior — oxides thinner than about 0.09 μm are dominated by the linear term, and oxides thicker than this are dominated by the parabolic term.</p>
</div>
</details>

---

### Problem 20

A designer compares two options for a fixed total silicon area of \(6\ \text{cm}^2\) at defect density \(D_0=0.4\ \text{defects/cm}^2\): one die of \(6\ \text{cm}^2\), or three independent dies of \(2\ \text{cm}^2\) each (each usable individually, so a defective one is simply discarded rather than failing the whole unit). Compare expected total good area produced from a fixed batch, per unit starting area, for each option.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Single large die: <span class="arithmatex">\(Y=e^{-(0.4)(6)}=e^{-2.4}\approx0.0907\)</span>; expected good area per die <span class="arithmatex">\(\approx0.0907\times6\approx0.544\ \text{cm}^2\)</span>. Three small dies: <span class="arithmatex">\(Y=e^{-(0.4)(2)}=e^{-0.8}\approx0.449\)</span> each; since each is usable independently, expected good area <span class="arithmatex">\(\approx3\times0.449\times2\approx2.69\ \text{cm}^2\)</span> — nearly five times more usable silicon from the same total starting area, illustrating why splitting a large function into smaller independently-usable dies (when architecturally possible) is a powerful yield-improvement strategy.</p>
</div>
</details>

---

### Problem 21

A process engineer must choose between diffusion and ion implantation to place a very shallow (50 nm deep), tightly controlled dopant profile for a modern short-channel MOSFET source/drain extension. Which technique should they choose, and justify your answer using the physical placement mechanisms described in this chapter.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Ion implantation. Because its depth is set directly by ion energy rather than by a thermal diffusion process, it can be tuned to place a very shallow, tightly controlled profile (low energy, small projected range and straggle) independently of dose. Diffusion depth and dose are coupled through the same thermal budget (temperature and time), making it much harder to achieve a shallow profile without also limiting dose, which is why implantation displaced diffusion for modern short-channel doping.</p>
</div>
</details>

---

### Problem 22

An etch process has \(R_{vertical}=180\ \text{nm/min}\) and must achieve an anisotropy factor of at least 0.9 to reproduce the required feature profile. Find the maximum allowable lateral etch rate.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">From <span class="arithmatex">\(A_f=1-R_{lateral}/R_{vertical}\geq0.9\)</span>: <span class="arithmatex">\(R_{lateral}/R_{vertical}\leq0.1\)</span>, so <span class="arithmatex">\(R_{lateral}\leq(0.1)(180)=18\ \text{nm/min}\)</span>.</p>
</div>
</details>

---

### Problem 23

Explain, using the Rayleigh criterion and depth-of-focus relationships together, why increasing numerical aperture to improve resolution creates a manufacturing challenge that mask alignment and wafer preparation must both address.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Resolution improves linearly with <span class="arithmatex">\(NA\)</span> (<span class="arithmatex">\(CD=k_1\lambda/NA\)</span>), but depth of focus shrinks with the *square* of <span class="arithmatex">\(NA\)</span> (<span class="arithmatex">\(DOF=k_2\lambda/NA^2\)</span>) — so every resolution gain costs a disproportionately larger loss of focus tolerance. This is why wafer preparation's polishing step (which produces the flat surface every part of the wafer needs to sit within the shrinking focus window) and precise mask alignment (which keeps every layer's pattern correctly registered despite that same tight tolerance) both become more critical, not less, as lithography pushes toward smaller features.</p>
</div>
</details>

---

### Problem 24

A CMOS fabrication run has a defect density of \(0.6\ \text{defects/cm}^2\) contributed by lithography defects and an additional, independent \(0.2\ \text{defects/cm}^2\) contributed by etch defects. For a \(3\ \text{cm}^2\) die, find the overall yield, treating the two defect sources as combining additively in the Poisson exponent.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Total defect density: <span class="arithmatex">\(D_0=0.6+0.2=0.8\ \text{defects/cm}^2\)</span>. Yield: <span class="arithmatex">\(Y=e^{-(0.8)(3)}=e^{-2.4}\approx0.0907\)</span>, or about 9.1% — illustrating how independent defect sources from different process steps combine multiplicatively in yield (additively in the exponent), so even two individually modest defect densities can compound into a very low overall yield.</p>
</div>
</details>

---

</div>
