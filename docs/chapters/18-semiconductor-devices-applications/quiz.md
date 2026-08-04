---
title: Chapter 18 Quiz - Semiconductor Devices and Applications
description: Test your understanding of power diodes, rectifier circuits, varactor diodes, bipolar transistor and MOSFET basics, semiconductor device modeling, band diagram construction, device design trade-offs, and the capstone device project
hide:
  - toc
---

<div class="problems-styled" markdown>

<h1 style="color: #5A3EED !important; border-bottom: 3px solid #5A3EED; padding-bottom: 0.4rem; font-weight: 800; margin-bottom: 1.5rem;">Quiz: Semiconductor Devices and Applications</h1>

<p style="color: #555; line-height: 1.85; font-size: 1.05rem; margin-bottom: 2rem;">
Test your understanding of semiconductor devices and applications covered in Chapter 18 with these 22 questions.
</p>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 1</p>

<p style="color: #333; line-height: 1.75;">What distinguishes a power diode from an ordinary low-voltage p-n junction?</p>

<div class="upper-alpha" markdown>
1. A lightly-doped drift region engineered to block high reverse voltage
2. It has no depletion region
3. It cannot conduct forward current
4. It uses only metal, no semiconductor
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">A power diode adds a lightly-doped drift region so avalanche breakdown does not occur below the rated blocking voltage.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Power Diode</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 2</p>

<p style="color: #333; line-height: 1.75;">Why does a power diode's drift region use lighter doping than a typical low-voltage signal diode?</p>

<div class="upper-alpha" markdown>
1. Lighter doping is cheaper regardless of application
2. Lighter doping supports higher breakdown voltage, at the cost of higher on-resistance
3. Lighter doping has no effect on breakdown voltage
4. Heavier doping always gives better performance
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Avalanche breakdown voltage is inversely proportional to doping, so blocking hundreds of volts requires light doping, trading away forward-conduction efficiency.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Power Diode</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 3</p>

<p style="color: #333; line-height: 1.75;">What does a rectifier circuit do?</p>

<div class="upper-alpha" markdown>
1. Converts DC to AC
2. Converts AC to DC using one or more diodes
3. Amplifies a signal
4. Stores energy indefinitely
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">A rectifier circuit arranges diodes to convert alternating current into direct current.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Rectifier Circuit</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 4</p>

<p style="color: #333; line-height: 1.75;">Why does full-wave bridge rectification give roughly double the average DC output of half-wave rectification?</p>

<div class="upper-alpha" markdown>
1. It uses higher-voltage diodes</label>
2. It uses both half-cycles of the AC input instead of discarding one
3. It requires no diodes at all
4. It doubles the input voltage
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Full-wave rectification conducts on both half-cycles, using energy that half-wave rectification simply discards.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Rectifier Circuit</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 5</p>

<p style="color: #333; line-height: 1.75;">What is a varactor diode?</p>

<div class="upper-alpha" markdown>
1. A junction operated under reverse bias specifically to exploit its voltage-tunable capacitance
2. A diode with no capacitance at all
3. A forward-biased light-emitting junction
4. A diode used only for rectification
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">A varactor diode deliberately uses the junction capacitance derived in Chapter 14 as a tunable circuit element.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Varactor Diode</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 6</p>

<p style="color: #333; line-height: 1.75;">What is a varactor diode typically used for?</p>

<div class="upper-alpha" markdown>
1. Tuning the resonant frequency of an LC circuit
2. Blocking DC current permanently
3. Emitting light
4. Sensing temperature
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Since f = 1/(2π√(LCj)), varying the varactor's capacitance with reverse bias directly tunes resonant frequency.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Varactor Diode</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 7</p>

<p style="color: #333; line-height: 1.75;">What is the basic operating principle of a bipolar transistor?</p>

<div class="upper-alpha" markdown>
1. Two adjacent junctions sharing a thin base region, giving current amplification
2. A single junction with no base region
3. A purely resistive element
4. A voltage-controlled channel with no junctions
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">A BJT stacks two adjacent junctions sharing a thin base, giving current gain IC = β·IB.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Bipolar Transistor Basics</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 8</p>

<p style="color: #333; line-height: 1.75;">A BJT has β=150 and IB=8 μA. What is IC?</p>

<div class="upper-alpha" markdown>
1. 1.2 mA
2. 150 mA
3. 8 mA
4. 0.15 mA
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">IC = β·IB = 150 × 8 μA = 1200 μA = 1.2 mA.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Bipolar Transistor Basics</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 9</p>

<p style="color: #333; line-height: 1.75;">What is the basic operating principle of a MOSFET?</p>

<div class="upper-alpha" markdown>
1. Gate voltage above threshold forms a voltage-controlled inversion-layer channel
2. Two adjacent p-n junctions amplify base current
3. A metal-only structure with no semiconductor
4. Light absorption drives channel conduction
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">A MOSFET uses the MOS capacitor's inversion layer (Chapter 16) as a voltage-controlled conducting channel between source and drain.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> MOSFET Basics</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 10</p>

<p style="color: #333; line-height: 1.75;">Why does a MOSFET draw essentially no steady-state gate current, unlike a BJT's base current?</p>

<div class="upper-alpha" markdown>
1. The gate is separated from the channel by an insulating oxide, blocking DC current
2. The gate has no electrical connection at all
3. MOSFETs cannot be turned on
4. The gate current is always exactly equal to the drain current
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">The gate oxide (Chapter 16) blocks DC current entirely; the gate only needs to charge to a voltage, not sustain current.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> MOSFET Basics</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 11</p>

<p style="color: #333; line-height: 1.75;">What is semiconductor device modeling?</p>

<div class="upper-alpha" markdown>
1. A simplified, closed-form mathematical description of device behavior built from physical first principles
2. A physical prototype built in a lab
3. A marketing description of a device
4. A random-number simulation with no physics basis
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Every equation derived across this course is an example of semiconductor device modeling — a closed-form, idealized description.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Semiconductor Device Modeling</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 12</p>

<p style="color: #333; line-height: 1.75;">What is the device simulation concept?</p>

<div class="upper-alpha" markdown>
1. Numerically solving Poisson's and the continuity equations on a discretized mesh, without idealizing assumptions
2. Guessing device behavior without any equations
3. A synonym for analytic modeling
4. Only used for optical devices
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Numerical device simulation solves the same underlying physics equations on a mesh representing the device's real geometry, without this course's simplifying assumptions.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Device Simulation Concept</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 13</p>

<p style="color: #333; line-height: 1.75;">Why don't engineers always use full numerical device simulation, if it is the most accurate modeling option?</p>

<div class="upper-alpha" markdown>
1. It comes with much higher computational cost, often unnecessary for the design question at hand
2. Numerical simulation is actually the least accurate option
3. Numerical simulation cannot be used for any real device
4. It requires no assumptions and no computer
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Engineers use the simplest model adequate for a given design question, reserving expensive numerical simulation for cases that truly need it.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Device Simulation Concept</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 14</p>

<p style="color: #333; line-height: 1.75;">What is the general procedure behind band diagram construction?</p>

<div class="upper-alpha" markdown>
1. Flat bands away from junctions, smooth bending at each junction to keep Fermi level(s) continuous, with bias-dependent shifts
2. Random placement of energy levels
3. Bands are always perfectly flat everywhere
4. Only metals have band diagrams
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">This single general procedure produces every band diagram used across the course.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Band Diagram Construction</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 15</p>

<p style="color: #333; line-height: 1.75;">Which three device types were shown to follow the exact same band diagram construction procedure in this chapter?</p>

<div class="upper-alpha" markdown>
1. P-n junction, Schottky junction, and MOS capacitor
2. Only p-n junctions
3. Only metals
4. Rectifiers, varactors, and LEDs only
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Despite looking different, all three follow the same four-step construction procedure.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Band Diagram Construction</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 16</p>

<p style="color: #333; line-height: 1.75;">What does the specific on-resistance trade-off Ron,sp ∝ VBR² imply?</p>

<div class="upper-alpha" markdown>
1. Breakdown voltage and on-resistance can both be minimized simultaneously
2. Doubling breakdown voltage roughly quadruples specific on-resistance
3. On-resistance is completely independent of breakdown voltage
4. Higher breakdown voltage always means lower on-resistance
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Since Ron,sp scales as the square of VBR, doubling breakdown voltage roughly quadruples specific on-resistance.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Device Design Trade-Offs</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 17</p>

<p style="color: #333; line-height: 1.75;">Without changing doping, what is the most direct way to lower a power diode's forward voltage drop while keeping the same breakdown voltage rating?</p>

<div class="upper-alpha" markdown>
1. Increase the die area A</label>
2. Decrease the die area A
3. Increase the operating temperature
4. There is no way to change forward drop without changing doping
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Since Ron = Ron,sp/A, a larger die area directly reduces resistance and forward drop for the same specific on-resistance, at the cost of a larger, more expensive die.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Device Design Trade-Offs</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 18</p>

<p style="color: #333; line-height: 1.75;">What defines a capstone device project?</p>

<div class="upper-alpha" markdown>
1. A design exercise combining physics and equations from multiple earlier chapters into one device
2. A project using only Chapter 18's equations
3. A purely qualitative essay with no calculations
4. A project unrelated to any course content
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: A</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">A capstone device project deliberately synthesizes physics from across the course into a single, complete device design.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Capstone Device Project</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 19</p>

<p style="color: #333; line-height: 1.75;">Which four chapters' physics were combined in this chapter's worked power-rectifier-diode capstone example?</p>

<div class="upper-alpha" markdown>
1. Chapters 1, 2, 3, and 4
2. Chapters 11, 14, 15, and 17
3. Only Chapter 18
4. Chapters 6, 7, 8, and 9
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">The design combined Chapter 14's depletion width, Chapter 15's breakdown voltage, Chapter 11's drift resistance, and Chapter 17's thermal conductivity.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Capstone Device Project</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 20</p>

<p style="color: #333; line-height: 1.75;">A MOSFET's gate overdrive voltage triples. Approximately how does drain current change?</p>

<div class="upper-alpha" markdown>
1. It triples
2. It increases ninefold
3. It stays the same
4. It is cut to a third
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Since ID ∝ (VGS−VT)², tripling the overdrive voltage multiplies drain current by 3² = 9.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> MOSFET Basics</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 21</p>

<p style="color: #333; line-height: 1.75;">Two power diodes are rated at 200 V and 800 V respectively (same material and process). Approximately how does the 800 V diode's specific on-resistance compare to the 200 V diode's?</p>

<div class="upper-alpha" markdown>
1. About 4 times larger
2. About 16 times larger
3. About the same
4. About 4 times smaller
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Since (800/200)² = 16, and Ron,sp ∝ VBR², the 800 V diode's specific on-resistance is about 16 times larger.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Device Design Trade-Offs</p>
</div>
</details>

</div>

---

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

<p style="color: #1565C0; font-weight: 700; font-size: 1.08rem; margin-top: 0; margin-bottom: 14px;">Question 22</p>

<p style="color: #333; line-height: 1.75;">This course moved from crystal structure and quantum mechanics through carrier statistics, transport, junctions, bias, MOS electrostatics, and optoelectronics before reaching this final chapter. What role does Chapter 18 play in that arc?</p>

<div class="upper-alpha" markdown>
1. It introduces entirely new physics unrelated to earlier chapters
2. It connects the course's physics to real devices and engineering practice, synthesizing prior chapters rather than deriving new physics from scratch
3. It replaces all earlier chapters' results
4. It only covers mathematical background
</div>

<details style="margin-top: 1rem;">
<summary style="color: #5A3EED; font-weight: 700; cursor: pointer;">Show Answer</summary>
<div style="background: #E7F7E7; border: 2px solid #81C784; border-radius: 10px; padding: 18px 22px; margin-top: 10px;">
<p style="color: #2E7D32; font-weight: 700; margin-top: 0;">Correct Answer: B</p>
<p style="color: #333; line-height: 1.75; margin-bottom: 0;">Chapter 18 is a capstone: every device and concept in it directly reuses physics derived in Chapters 6-17, connecting the whole course to real applications.</p>
<p style="color: #555; font-style: italic; margin-bottom: 0; margin-top: 8px;"><strong>Concept Tested:</strong> Capstone Device Project</p>
</div>
</details>

</div>

---

<h2 style="color: #5A3EED !important; border-left: none !important; border-bottom: 2px solid #5A3EED; padding-left: 0 !important; padding-bottom: 0.4rem; font-weight: 800; margin-top: 2.2rem; margin-bottom: 0.8rem;">Answers Summary</h2>

<div style="background: #EEF4FF; border: 2px solid #A8C8FF; border-radius: 12px; padding: 24px 28px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(90,61,237,0.07);" markdown>

| Question | Answer | Concept |
|----------|--------|---------|
| 1 | A | Power Diode |
| 2 | B | Power Diode |
| 3 | B | Rectifier Circuit |
| 4 | B | Rectifier Circuit |
| 5 | A | Varactor Diode |
| 6 | A | Varactor Diode |
| 7 | A | Bipolar Transistor Basics |
| 8 | A | Bipolar Transistor Basics |
| 9 | A | MOSFET Basics |
| 10 | A | MOSFET Basics |
| 11 | A | Semiconductor Device Modeling |
| 12 | A | Device Simulation Concept |
| 13 | A | Device Simulation Concept |
| 14 | A | Band Diagram Construction |
| 15 | A | Band Diagram Construction |
| 16 | B | Device Design Trade-Offs |
| 17 | A | Device Design Trade-Offs |
| 18 | A | Capstone Device Project |
| 19 | B | Capstone Device Project |
| 20 | B | MOSFET Basics |
| 21 | B | Device Design Trade-Offs |
| 22 | B | Capstone Device Project |

</div>

</div>
