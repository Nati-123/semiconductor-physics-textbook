---
title: Chapter 5 Problems - Quantum Mechanics of Periodic Crystals
description: Practice problems for Bloch's theorem, the Kronig-Penney model, the reciprocal lattice, the Brillouin zone, and band formation
---

<div class="problems-styled" markdown>

# End-of-Chapter Problems: Quantum Mechanics of Periodic Crystals

Work through these problems to reinforce your understanding of the periodic-potential band theory covered in Chapter 5.

---

## Easy

### Problem 1

State, in one sentence, why the potential an electron experiences in a crystal is periodic.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">The crystal lattice itself is a perfectly periodic arrangement of atoms (Chapter 3), so the combined electrostatic potential from every atomic core also repeats with the same spatial period, <span class="arithmatex">\(V(x+a)=V(x)\)</span>.</p>
</div>
</details>

---

### Problem 2

State Bloch's theorem in your own words.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Any solution to the Schrödinger equation in a periodic potential must have the form <span class="arithmatex">\(\psi_k(x)=e^{ikx}u_k(x)\)</span>, a plane wave multiplied by a function <span class="arithmatex">\(u_k(x)\)</span> that repeats with the same period as the lattice.</p>
</div>
</details>

---

### Problem 3

What periodic potential shape does the Kronig-Penney model use to make the problem exactly solvable?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">An infinite, repeating series of finite rectangular potential barriers of height <span class="arithmatex">\(V_0\)</span> and width <span class="arithmatex">\(b\)</span>, separated by free-electron wells.</p>
</div>
</details>

---

### Problem 4

Define, in one sentence each, an energy band and a band gap.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">An energy band is a continuous range of allowed electron energies produced by band formation. A band gap (forbidden energy gap) is a range of energy containing no allowed electron states, lying between two energy bands.</p>
</div>
</details>

---

### Problem 5

What is the reciprocal lattice spacing of a 1D chain with lattice constant \(a=0.25\) nm?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(2\pi/a = 2\pi/(0.25\times10^{-9}\ \text{m}) \approx 2.51\times10^{10}\ \text{m}^{-1}\)</span>.</p>
</div>
</details>

---

### Problem 6

State the first Brillouin zone boundary, in terms of \(a\), for a 1D chain.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(k=\pm\pi/a\)</span>.</p>
</div>
</details>

---

### Problem 7

Define, in one sentence each, the valence band and the conduction band.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">The valence band is the highest energy band that is completely filled with electrons at absolute zero. The conduction band is the next energy band above it, typically empty at absolute zero.</p>
</div>
</details>

---

### Problem 8

What Bravais lattice describes the reciprocal lattice of a simple cubic real-space lattice?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Simple cubic, with lattice constant <span class="arithmatex">\(2\pi/a\)</span>.</p>
</div>
</details>

---

## Medium

### Problem 9

In the Kronig-Penney model's transcendental equation, explain why the right-hand side, \(\cos(ka)\), being restricted to \([-1,1]\) is exactly what produces band gaps.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">For a given energy <span class="arithmatex">\(E\)</span> (through <span class="arithmatex">\(\alpha\)</span>), the left-hand side <span class="arithmatex">\(P\sin(\alpha a)/(\alpha a)+\cos(\alpha a)\)</span> takes some specific numerical value. If that value lies outside <span class="arithmatex">\([-1,1]\)</span>, no real <span class="arithmatex">\(k\)</span> can make <span class="arithmatex">\(\cos(ka)\)</span> equal it, since a cosine of a real number can never exceed that range — so that energy has no valid electron state and is forbidden.</p>
</div>
</details>

---

### Problem 10

A real-space crystal is body-centered cubic (BCC). What is the Bravais lattice of its reciprocal lattice?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Face-centered cubic (FCC) — BCC and FCC are reciprocal-lattice partners of each other.</p>
</div>
</details>

---

### Problem 11

Explain why the Kronig-Penney model's band gaps occur precisely at the Brillouin zone boundaries rather than at random energies.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">At the Brillouin zone boundaries, <span class="arithmatex">\(k=\pm n\pi/a\)</span>, the electron's wavelength satisfies a Bragg-like constructive-reflection condition against the periodic lattice, forcing a standing wave rather than a freely propagating one. This standing-wave condition is what opens an energy gap, and it only occurs at these specific, geometrically determined <span class="arithmatex">\(k\)</span> values.</p>
</div>
</details>

---

### Problem 12

A 1D crystal has lattice constant \(a=0.40\) nm. Find its first Brillouin zone boundary in m\(^{-1}\), and its reciprocal lattice spacing.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">First Brillouin zone boundary: <span class="arithmatex">\(\pi/a = \pi/(0.40\times10^{-9}\ \text{m}) \approx 7.85\times10^{9}\ \text{m}^{-1}\)</span>. Reciprocal lattice spacing: <span class="arithmatex">\(2\pi/a \approx 1.57\times10^{10}\ \text{m}^{-1}\)</span> — exactly twice the zone boundary, as expected.</p>
</div>
</details>

---

### Problem 13

Explain why "crystal momentum" \(\hbar k\) is a useful but imperfect analogy to true momentum.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">Crystal momentum behaves like true momentum in several respects (it governs group velocity and semiclassical equations of motion), but a Bloch electron's wavefunction is only a plane wave modulated by a periodic function, not a pure plane wave — and crystal momentum is only meaningful modulo a reciprocal lattice vector, unlike true momentum, which has no such ambiguity.</p>
</div>
</details>

---

### Problem 14

A hypothetical 1D crystal has bands I (lowest), II, and III (highest) from a Kronig-Penney-type calculation. At absolute zero, band I is full and bands II and III are empty. Identify the valence band and conduction band.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">The valence band is band I (the highest completely-filled band). The conduction band is band II (the next band up).</p>
</div>
</details>

---

### Problem 15

Two 1D crystals have lattice constants \(a_1=0.30\) nm and \(a_2=0.60\) nm. Compare their first Brillouin zone widths.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">First Brillouin zone width is <span class="arithmatex">\(2\pi/a\)</span> (from <span class="arithmatex">\(-\pi/a\)</span> to <span class="arithmatex">\(+\pi/a\)</span>). Since <span class="arithmatex">\(a_2=2a_1\)</span>, crystal 2's zone is half as wide as crystal 1's — a larger real-space lattice constant produces a narrower Brillouin zone.</p>
</div>
</details>

---

### Problem 16

Explain, in your own words, why increasing the Kronig-Penney barrier strength \(P\) widens the band gaps.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">A larger <span class="arithmatex">\(P\)</span> makes the left-hand side of the transcendental equation swing further outside <span class="arithmatex">\([-1,1]\)</span> over a wider range of energies near each zone boundary, so more energies have no valid real-<span class="arithmatex">\(k\)</span> solution — widening the forbidden band gap. As <span class="arithmatex">\(P\to0\)</span>, this effect vanishes entirely and the gaps close.</p>
</div>
</details>

---

## Difficult

### Problem 17

Starting from the Kronig-Penney transcendental equation, explain what happens in the limit of very large \(P\) (very strong, tightly binding barriers) to the allowed energy bands, and connect this to the isolated-atom limit.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">As <span class="arithmatex">\(P\to\infty\)</span>, the transcendental equation can only be satisfied when <span class="arithmatex">\(\sin(\alpha a)\to0\)</span>, i.e. <span class="arithmatex">\(\alpha a = n\pi\)</span> — the same quantized energy condition as an isolated infinite square well (Chapter 2's particle-in-a-box). In this limit, the allowed energy bands narrow to essentially discrete levels, recovering the isolated-atom picture where wells are so strongly separated that they no longer communicate — the opposite extreme from the free-electron limit (<span class="arithmatex">\(P\to0\)</span>), where the bands widen into one continuous spectrum.</p>
</div>
</details>

---

### Problem 18

A 1D crystal has lattice constant \(a=0.50\) nm. Find the electron energy, in eV, corresponding to a wavevector exactly at the first Brillouin zone boundary, assuming (for this estimate only) a free-electron dispersion \(E=\hbar^2k^2/2m\).

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(k=\pi/a = \pi/(0.50\times10^{-9}) = 6.28\times10^{9}\ \text{m}^{-1}\)</span>. Then <span class="arithmatex">\(E = \dfrac{\hbar^2k^2}{2m} = \dfrac{(1.055\times10^{-34})^2(6.28\times10^{9})^2}{2(9.11\times10^{-31})} = 2.41\times10^{-19}\ \text{J} \approx 1.50\ \text{eV}\)</span>. (The true Kronig-Penney energy near the zone boundary would deviate from this free-electron estimate precisely because a gap opens there.)</p>
</div>
</details>

---

### Problem 19

Explain why the reciprocal lattice vector \(\vec G_{hkl}\) associated with a real-space \((hkl)\) crystal plane (Chapter 3) is a natural, physically meaningful object to define, rather than an arbitrary mathematical convenience.

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;"><span class="arithmatex">\(\vec G_{hkl}\)</span> points exactly perpendicular to the real-space <span class="arithmatex">\((hkl)\)</span> plane, with a magnitude inversely proportional to the spacing between adjacent planes of that family. This is not a coincidence of notation — it directly connects the momentum-space description used by Bloch's theorem to the same Miller-index planes that determine wafer cutting and cleavage in Chapter 3, and (in more advanced treatments) to the diffraction conditions used to experimentally measure crystal structures.</p>
</div>
</details>

---

### Problem 20

A hypothetical 1D crystal's Kronig-Penney calculation gives allowed bands I: 0–2 eV, II: 3–5 eV, III: 7–11 eV (with gaps in between). At absolute zero, exactly enough electrons are present to fill band I completely and leave bands II and III empty. A photon promotes one electron from band I to band II. (a) What is the minimum photon energy required? (b) After this excitation, is band I still, by the chapter's strict definition, the valence band?

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Solution</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #333; line-height: 1.85; margin: 0;">(a) The minimum photon energy must bridge the gap between the top of band I (2 eV) and the bottom of band II (3 eV): <span class="arithmatex">\(\Delta E = 3-2 = 1\)</span> eV. (b) Strictly, the valence-band/conduction-band labels describe the equilibrium, absolute-zero filling; the single promoted electron leaves band I with one vacancy (a hole) rather than completely full, but band I is still conventionally called the valence band and band II the conduction band, since these names describe the bands' equilibrium roles, not the instantaneous, temporarily-perturbed occupation after one excitation — the same convention Chapter 7 uses when discussing thermally-excited carriers.</p>
</div>
</details>

</div>
