---
title: Chapter 14 Quiz - The P-N Junction at Equilibrium
description: Test your understanding of the metallurgical junction, the depletion region and depletion approximation, built-in potential, Poisson's equation, depletion charge density, junction electric field, depletion width, and junction capacitance
hide:
  - toc
---

<div class="problems-styled" markdown>

<h1 style="color: #5A3EED !important; border-bottom: 3px solid #5A3EED; padding-bottom: 0.4rem; font-weight: 800; margin-bottom: 1.5rem;">Quiz: The P-N Junction at Equilibrium</h1>

<p style="color: #555; line-height: 1.85; font-size: 1.05rem; margin-bottom: 2rem;">
Test your understanding of the equilibrium p-n junction covered in Chapter 14 with these 20 questions.
</p>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 1</p>

<p style="color: #333; line-height: 1.75;">What is a p-n junction?</p>

<div class="upper-alpha" markdown>
1. A semiconductor structure formed by joining a p-type region and an n-type region within a single crystal
2. Two separate crystals glued together
3. A resistor made of doped silicon
4. A region containing only intrinsic semiconductor material
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">A p-n junction is formed when a p-type region and an n-type region exist within the same single crystal, joined at a common interface.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> P-N Junction</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 2</p>

<p style="color: #333; line-height: 1.75;">What defines the metallurgical junction?</p>

<div class="upper-alpha" markdown>
1. The plane where the net doping concentration switches from p-type to n-type
2. The center of the depletion region
3. The location of the maximum carrier mobility
4. The edge of the semiconductor wafer
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">The metallurgical junction, conventionally at x=0, is the geometric plane where doping type switches from p to n.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Metallurgical Junction</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 3</p>

<p style="color: #333; line-height: 1.75;">What physically causes the depletion region to form?</p>

<div class="upper-alpha" markdown>
1. Diffusion of carriers across the junction, followed by recombination near the interface
2. An externally applied magnetic field
3. Cooling the junction to absolute zero
4. Adding extra dopant atoms directly at x=0
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Carriers diffuse across the junction and recombine near the interface, sweeping mobile carriers out and forming the depletion region.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Depletion Region</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 4</p>

<p style="color: #333; line-height: 1.75;">What is left behind inside the depletion region after mobile carriers are swept out?</p>

<div class="upper-alpha" markdown>
1. Extra mobile electrons and holes
2. Fixed, ionized dopant atoms with no mobile carriers to neutralize them
3. Nothing; the region is completely empty
4. Free-floating photons
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">The ionized acceptors and donors are fixed in the crystal lattice and cannot diffuse away — only the mobile carriers that once neutralized them are gone.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Depletion Region</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 5</p>

<p style="color: #333; line-height: 1.75;">Under the depletion approximation, how is the semiconductor treated outside the depletion edges -xp and xn?</p>

<div class="upper-alpha" markdown>
1. As fully depleted, just like the interior
2. As fully charge-neutral
3. As containing only donor ions
4. As having infinite conductivity
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Outside the depletion edges, the depletion approximation treats the semiconductor as fully charge-neutral, exactly as in the uniformly-doped chapters.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Depletion Approximation</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 6</p>

<p style="color: #333; line-height: 1.75;">How does the depletion approximation treat the boundaries of the depletion region?</p>

<div class="upper-alpha" markdown>
1. As gradual, smoothly-varying transitions
2. As sharp, abrupt boundaries
3. As oscillating in position over time
4. As always coinciding with the contacts at the ends of the device
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">The depletion approximation idealizes the transition between depleted and neutral regions as abrupt rather than the smooth, continuous transition of a real device.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Depletion Approximation</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 7</p>

<p style="color: #333; line-height: 1.75;">Which equation gives the built-in potential of a p-n junction?</p>

<div class="upper-alpha" markdown>
1. Vbi = (kT/q)·ln(NA·ND/ni²)
2. Vbi = qNA·ND/ε
3. Vbi = IR
4. Vbi = (kT/q)(NA+ND)
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Vbi = (kT/q)ln(NA·ND/ni²) follows from requiring a single equilibrium Fermi level to describe both sides of the junction.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Built-In Potential</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 8</p>

<p style="color: #333; line-height: 1.75;">Does the built-in potential depend on the junction's physical cross-sectional area?</p>

<div class="upper-alpha" markdown>
1. Yes, a larger area always produces a larger Vbi
2. No, Vbi depends only on doping, intrinsic carrier concentration, and temperature
3. Yes, but only under reverse bias
4. No, Vbi is always exactly zero regardless of doping
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Vbi is an intensive quantity set entirely by NA, ND, ni, and T; it does not depend on device geometry or area.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Built-In Potential</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 9</p>

<p style="color: #333; line-height: 1.75;">What does Poisson's equation relate, as used in this chapter?</p>

<div class="upper-alpha" markdown>
1. Current density and voltage
2. The derivative of electric field to local charge density
3. Temperature and doping concentration
4. Carrier mobility and electric field
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Poisson's equation, dE/dx = ρ(x)/ε, links the derivative of the electric field to the local charge density.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Poisson's Equation</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 10</p>

<p style="color: #333; line-height: 1.75;">Under the depletion approximation, what is ρ(x) on the p-side of the depletion region?</p>

<div class="upper-alpha" markdown>
1. +qND
2. -qNA
3. Zero
4. -qni
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">On the p-side of the depletion region, the exposed ionized acceptors give ρ(x) = -qNA.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Depletion Charge Density</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 11</p>

<p style="color: #333; line-height: 1.75;">What condition must the total exposed charge on each side of the depletion region satisfy?</p>

<div class="upper-alpha" markdown>
1. NA·xp = ND·xn (equal, opposite total charge)
2. NA must always equal ND
3. xp must always equal xn, regardless of doping
4. The n-side charge must always exceed the p-side charge
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Charge neutrality across the whole depletion region requires the exposed charge on each side to be equal and opposite: NA·xp = ND·xn.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Depletion Charge Density</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 12</p>

<p style="color: #333; line-height: 1.75;">What shape does the junction electric field E(x) take under the depletion approximation?</p>

<div class="upper-alpha" markdown>
1. Constant across the entire depletion region
2. A triangular profile peaking at the metallurgical junction
3. A sinusoidal profile
4. Exponentially increasing without bound
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Integrating Poisson's equation over the step-function charge density gives a triangular field profile, peaking at x=0 and vanishing at the depletion edges.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Junction Electric Field</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 13</p>

<p style="color: #333; line-height: 1.75;">In which direction does the junction electric field point at equilibrium?</p>

<div class="upper-alpha" markdown>
1. From the p-side toward the n-side
2. From the n-side toward the p-side
3. Parallel to the metallurgical junction plane
4. It has no defined direction
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">The field points from the n-side toward the p-side, exactly the direction needed to oppose further diffusion of holes and electrons across the junction.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Junction Electric Field</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 14</p>

<p style="color: #333; line-height: 1.75;">What relation determines how the depletion width splits between the p-side and n-side?</p>

<div class="upper-alpha" markdown>
1. Charge neutrality, NA·xp = ND·xn
2. The Boltzmann constant
3. The electron's rest mass
4. The area of the junction
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Combined with Vbi, the charge-neutrality condition NA·xp = ND·xn determines xn, xp, and their split within W.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Depletion Width</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 15</p>

<p style="color: #333; line-height: 1.75;">In a one-sided junction with NA much greater than ND, where does most of the depletion width reside?</p>

<div class="upper-alpha" markdown>
1. Mostly in the heavily doped p-side
2. Mostly in the lightly doped n-side
3. Split exactly evenly regardless of doping
4. There is no depletion region in this case
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Since NA·xp = ND·xn, if NA is much larger than ND, xn must be much larger than xp — the depletion width lies almost entirely in the lightly doped n-side, the standard one-sided junction approximation.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Depletion Width</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 16</p>

<p style="color: #333; line-height: 1.75;">Which formula gives the junction capacitance?</p>

<div class="upper-alpha" markdown>
1. Cj = εA/W
2. Cj = qN/ε
3. Cj = IV
4. Cj = Vbi/W
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">The depletion region behaves like a parallel-plate capacitor of separation W, giving Cj = εA/W.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Junction Capacitance</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 17</p>

<p style="color: #333; line-height: 1.75;">What happens to junction capacitance as reverse bias is increased?</p>

<div class="upper-alpha" markdown>
1. It increases, because W shrinks
2. It decreases, because W widens
3. It stays exactly constant
4. It becomes negative
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Reverse bias widens the depletion region, and since Cj = εA/W, a wider W means a smaller Cj — the basis of the varactor diode.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Junction Capacitance</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 18</p>

<p style="color: #333; line-height: 1.75;">Integrating Poisson's equation once across the depletion charge density directly gives which quantity?</p>

<div class="upper-alpha" markdown>
1. The junction electric field E(x)
2. The doping concentration directly
3. The minority carrier lifetime
4. The carrier mobility
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">A single integration of dE/dx = ρ(x)/ε, using E=0 at both depletion edges as boundary conditions, yields the triangular junction electric field E(x).</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Poisson's Equation</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 19</p>

<p style="color: #333; line-height: 1.75;">A silicon junction has NA=1×10¹⁷ cm⁻³, ND=1×10¹⁶ cm⁻³, and ni=1.5×10¹⁰ cm⁻³. Approximately what is Vbi at 300 K?</p>

<div class="upper-alpha" markdown>
1. 0.259 V
2. 0.754 V
3. 1.5 V
4. 0.026 V
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Vbi = 0.0259·ln[(1×10¹⁷)(1×10¹⁶)/(1.5×10¹⁰)²] ≈ 0.0259×29.12 ≈ 0.754 V.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Built-In Potential</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 20</p>

<p style="color: #333; line-height: 1.75;">Chapter 15 introduces an applied bias to the equilibrium junction analyzed in this chapter. Which term inside the depletion-width (and therefore junction-capacitance) formula does an applied bias directly modify?</p>

<div class="upper-alpha" markdown>
1. The elementary charge q
2. The permittivity ε
3. The built-in potential term, effectively replaced by Vbi minus (forward) or plus (reverse) the applied voltage
4. Nothing changes under an applied bias
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: C</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">An applied bias modifies the voltage term used in the depletion-width formula, changing W and therefore Cj — reverse bias widens W and lowers Cj, forward bias narrows W and raises Cj, exactly as Chapter 15 formalizes.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Junction Capacitance</p>
</div>
</details>

</div>

---

<h2 style="color: #5A3EED !important; border-left: none !important; border-bottom: 2px solid #5A3EED; padding-left: 0 !important; padding-bottom: 0.4rem; font-weight: 800; margin-top: 2.2rem; margin-bottom: 0.8rem;">Answers Summary</h2>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

| Question | Answer | Concept |
|----------|--------|---------|
| 1 | A | P-N Junction |
| 2 | A | Metallurgical Junction |
| 3 | A | Depletion Region |
| 4 | B | Depletion Region |
| 5 | B | Depletion Approximation |
| 6 | B | Depletion Approximation |
| 7 | A | Built-In Potential |
| 8 | B | Built-In Potential |
| 9 | B | Poisson's Equation |
| 10 | B | Depletion Charge Density |
| 11 | A | Depletion Charge Density |
| 12 | B | Junction Electric Field |
| 13 | B | Junction Electric Field |
| 14 | A | Depletion Width |
| 15 | B | Depletion Width |
| 16 | A | Junction Capacitance |
| 17 | B | Junction Capacitance |
| 18 | A | Poisson's Equation |
| 19 | B | Built-In Potential |
| 20 | C | Junction Capacitance |

</div>

</div>
