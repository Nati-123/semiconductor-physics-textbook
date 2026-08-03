---
title: Chapter 15 Quiz - The P-N Junction Under Bias
description: Test your understanding of forward and reverse bias, minority carrier injection, the short-base and long-base diode approximations, saturation current, the ideal diode equation, avalanche and Zener breakdown, and the junction I-V characteristic
hide:
  - toc
---

<div class="problems-styled" markdown>

<h1 style="color: #5A3EED !important; border-bottom: 3px solid #5A3EED; padding-bottom: 0.4rem; font-weight: 800; margin-bottom: 1.5rem;">Quiz: The P-N Junction Under Bias</h1>

<p style="color: #555; line-height: 1.85; font-size: 1.05rem; margin-bottom: 2rem;">
Test your understanding of the biased p-n junction covered in Chapter 15 with these 20 questions.
</p>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 1</p>

<p style="color: #333; line-height: 1.75;">What happens to the junction potential barrier under forward bias?</p>

<div class="upper-alpha" markdown>
1. It is lowered to Vbi − V
2. It is raised to Vbi + V
3. It stays exactly at Vbi
4. It becomes zero regardless of V
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Forward bias subtracts from the built-in potential, lowering the barrier to Vbi − V and sharply increasing diffusion current.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Forward Bias</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 2</p>

<p style="color: #333; line-height: 1.75;">Under forward bias, how does the depletion width compare to its equilibrium value?</p>

<div class="upper-alpha" markdown>
1. It widens
2. It narrows
3. It disappears entirely
4. It stays exactly the same
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Since W ∝ √(Vbi − V), lowering the effective voltage under forward bias narrows the depletion region.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Forward Bias</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 3</p>

<p style="color: #333; line-height: 1.75;">What happens to the junction potential barrier under reverse bias?</p>

<div class="upper-alpha" markdown>
1. It is lowered to Vbi − V
2. It is raised to Vbi + V
3. It stays exactly at Vbi
4. It reverses sign entirely
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Reverse bias adds to the built-in potential, raising the barrier to Vbi + V and suppressing diffusion current.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Reverse Bias</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 4</p>

<p style="color: #333; line-height: 1.75;">Why is current under reverse bias so small compared to forward bias?</p>

<div class="upper-alpha" markdown>
1. Reverse bias increases carrier mobility
2. The raised barrier makes diffusion exponentially smaller, leaving only a small drift-limited current
3. Reverse bias cools the junction
4. There is no current at all under reverse bias
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">The taller barrier suppresses diffusion exponentially, leaving only the small population of minority carriers within a diffusion length of the depletion edge, swept across by drift.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Reverse Bias</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 5</p>

<p style="color: #333; line-height: 1.75;">What does the law of the junction relate?</p>

<div class="upper-alpha" markdown>
1. Applied voltage to injected minority carrier concentration at the depletion edge
2. Doping concentration to intrinsic carrier concentration
3. Temperature to band gap
4. Junction area to capacitance
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">The law of the junction, pn(xn) = pn0·e^(V/VT), sets the boundary condition connecting applied voltage to the injected minority carrier concentration.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Minority Carrier Injection</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 6</p>

<p style="color: #333; line-height: 1.75;">At V=0.3 V forward bias (VT=0.0259 V), by roughly what factor does the injected minority carrier concentration exceed its equilibrium value?</p>

<div class="upper-alpha" markdown>
1. About 2 times
2. About 10 times
3. About 100,000 times
4. It is unchanged
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: C</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">e^(0.3/0.0259) ≈ 1.07×10⁵ — even a fraction of a volt of forward bias produces enormous minority carrier injection.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Minority Carrier Injection</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 7</p>

<p style="color: #333; line-height: 1.75;">What shape does the excess carrier profile take in a short-base diode?</p>

<div class="upper-alpha" markdown>
1. Exponential decay
2. A straight line falling to zero at the contact
3. A step function
4. A sine wave
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">The nearby ohmic contact forces the excess concentration to zero, giving a linear profile when recombination in the short region is negligible.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Short-Base Diode</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 8</p>

<p style="color: #333; line-height: 1.75;">Compared to a long-base diode with the same peak injected concentration, a short-base diode's saturation current is:</p>

<div class="upper-alpha" markdown>
1. Always smaller
2. Always larger, since the same concentration drop occurs over a shorter distance
3. Exactly identical
4. Independent of base width
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Since J0 ∝ 1/W' for the short-base case versus 1/Lp for long-base, and W' < Lp by definition, the short-base saturation current is always larger.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Short-Base Diode</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 9</p>

<p style="color: #333; line-height: 1.75;">What condition defines the long-base diode limit?</p>

<div class="upper-alpha" markdown>
1. Quasi-neutral region length is much longer than the minority carrier diffusion length
2. Quasi-neutral region length is much shorter than the diffusion length
3. The junction has no depletion region
4. The applied voltage exceeds the built-in potential
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">When the quasi-neutral region is much longer than Lp, the ohmic contact is effectively infinitely far away, giving the exponential long-base solution.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Long-Base Diode</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 10</p>

<p style="color: #333; line-height: 1.75;">What sets the saturation current J0?</p>

<div class="upper-alpha" markdown>
1. The peak electric field in the depletion region
2. The gradient of the injected minority carrier profile at the depletion edge
3. The applied voltage directly
4. The junction's color under illumination
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">By Fick's law, the diffusion current density is proportional to the carrier profile's gradient at the injection edge, which sets J0.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Saturation Current</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 11</p>

<p style="color: #333; line-height: 1.75;">Why is the saturation current J0 extremely sensitive to temperature?</p>

<div class="upper-alpha" markdown>
1. J0 is proportional to ni², which depends exponentially on temperature
2. J0 is proportional to the applied voltage
3. J0 does not depend on temperature at all
4. J0 is proportional to the junction area only
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">J0 ∝ ni², and ni² depends exponentially on temperature through the Boltzmann factor, completely dominating the weaker power-law temperature dependence of mobility.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Saturation Current</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 12</p>

<p style="color: #333; line-height: 1.75;">Which equation is the ideal diode equation?</p>

<div class="upper-alpha" markdown>
1. I = I0(e^(V/VT) − 1)
2. I = V/R
3. I = I0·V²
4. I = I0·ln(V)
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">The ideal diode equation combines the law of the junction with the saturation current to give I = I0(e^(V/VT) − 1).</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Ideal Diode Equation</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 13</p>

<p style="color: #333; line-height: 1.75;">At V=0, what does the ideal diode equation predict for the current?</p>

<div class="upper-alpha" markdown>
1. I = I0
2. I = 0
3. I approaches infinity
4. I = −I0/2
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">At V=0, e^(V/VT)=1, so I=I0(1−1)=0 — correctly recovering the zero-net-current equilibrium result of Chapter 14.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Ideal Diode Equation</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 14</p>

<p style="color: #333; line-height: 1.75;">At 300 K, roughly how does forward diode current change for each additional 18 mV of forward voltage?</p>

<div class="upper-alpha" markdown>
1. It stays the same
2. It roughly doubles
3. It is cut in half
4. It increases by a fixed amount, not a ratio
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Since J ∝ e^(V/VT), increasing V by VT·ln2 ≈ 18 mV multiplies current by e^(ln2) = 2 — current roughly doubles.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Ideal Diode Equation</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 15</p>

<p style="color: #333; line-height: 1.75;">What happens to reverse current once the reverse voltage exceeds the breakdown voltage VBR?</p>

<div class="upper-alpha" markdown>
1. It stays pinned at −I0
2. It increases dramatically
3. It becomes exactly zero
4. It reverses back into forward conduction
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Beyond VBR, one of the reverse breakdown mechanisms takes over and current rises sharply, unless limited by external circuitry.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Reverse Breakdown</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 16</p>

<p style="color: #333; line-height: 1.75;">What physical process drives avalanche breakdown?</p>

<div class="upper-alpha" markdown>
1. Quantum-mechanical tunneling
2. An impact-ionization chain reaction as accelerated carriers create new electron-hole pairs
3. Thermal generation alone
4. Recombination at midgap trap states
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Carriers accelerated by the junction field gain enough energy between collisions to knock a valence electron across the gap, generating new electron-hole pairs in a multiplying chain reaction.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Avalanche Breakdown</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 17</p>

<p style="color: #333; line-height: 1.75;">In which type of junction does avalanche breakdown dominate?</p>

<div class="upper-alpha" markdown>
1. Heavily-doped junctions with narrow depletion regions
2. Lightly-doped junctions with wide depletion regions
3. Junctions with zero net doping
4. Junctions only at absolute zero temperature
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">A wide depletion region gives carriers room to accelerate over a long distance before colliding, favoring the impact-ionization chain reaction.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Avalanche Breakdown</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 18</p>

<p style="color: #333; line-height: 1.75;">What physical process drives Zener breakdown?</p>

<div class="upper-alpha" markdown>
1. Quantum-mechanical tunneling directly through a thin depletion barrier
2. Impact ionization
3. Avalanche multiplication
4. Ohmic heating of the contacts
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">In heavily-doped junctions, the depletion region is thin enough for electrons to tunnel quantum-mechanically straight through the barrier, with no collision involved.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Zener Breakdown</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 19</p>

<p style="color: #333; line-height: 1.75;">How does Zener breakdown voltage change as temperature increases?</p>

<div class="upper-alpha" markdown>
1. It increases
2. It decreases
3. It stays exactly constant
4. It becomes negative
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">The band gap narrows slightly with rising temperature, easing tunneling and lowering Zener breakdown voltage — the opposite trend from avalanche breakdown.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Zener Breakdown</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 20</p>

<p style="color: #333; line-height: 1.75;">Which three regimes together make up the complete junction I-V characteristic?</p>

<div class="upper-alpha" markdown>
1. Forward exponential rise, reverse saturation current, and reverse breakdown
2. Only forward conduction
3. Only reverse breakdown
4. A constant linear resistance throughout
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">The complete characteristic combines the ideal diode equation's forward exponential rise and flat reverse saturation with the sharp current increase at reverse breakdown.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Junction I-V Characteristic</p>
</div>
</details>

</div>

---

<h2 style="color: #5A3EED !important; border-left: none !important; border-bottom: 2px solid #5A3EED; padding-left: 0 !important; padding-bottom: 0.4rem; font-weight: 800; margin-top: 2.2rem; margin-bottom: 0.8rem;">Answers Summary</h2>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

| Question | Answer | Concept |
|----------|--------|---------|
| 1 | A | Forward Bias |
| 2 | B | Forward Bias |
| 3 | B | Reverse Bias |
| 4 | B | Reverse Bias |
| 5 | A | Minority Carrier Injection |
| 6 | C | Minority Carrier Injection |
| 7 | B | Short-Base Diode |
| 8 | B | Short-Base Diode |
| 9 | A | Long-Base Diode |
| 10 | B | Saturation Current |
| 11 | A | Saturation Current |
| 12 | A | Ideal Diode Equation |
| 13 | B | Ideal Diode Equation |
| 14 | B | Ideal Diode Equation |
| 15 | B | Reverse Breakdown |
| 16 | B | Avalanche Breakdown |
| 17 | B | Avalanche Breakdown |
| 18 | A | Zener Breakdown |
| 19 | B | Zener Breakdown |
| 20 | A | Junction I-V Characteristic |

</div>

</div>
