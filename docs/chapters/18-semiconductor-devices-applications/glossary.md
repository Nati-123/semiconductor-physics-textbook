<div class="problems-styled" markdown>

# Chapter 18 Glossary

Terms introduced in [Chapter 18 — Semiconductor Devices and Applications](index.md). See the [full site Glossary](../../glossary.md) for terms across all chapters.

#### Band Diagram Construction

The general procedure for drawing a device's energy band diagram: flat bands in each neutral region at the correct relative height, smooth bending at each junction to keep the Fermi level (or quasi-Fermi levels, under bias) continuous, and bias-dependent shifts.

**Example:** The same band diagram construction procedure produces the p-n junction, Schottky junction, and MOS capacitor diagrams used throughout this course, despite their different materials and structures.

See also: [Power Diode](#power-diode), [Semiconductor Device Modeling](#semiconductor-device-modeling).

#### Bipolar Transistor Basics

The operating principle of a bipolar junction transistor: two adjacent junctions sharing a thin base region, where forward-biasing the emitter-base junction injects minority carriers mostly collected by the reverse-biased base-collector junction, giving current gain \(I_C=\beta I_B\).

**Example:** A BJT with \(\beta=100\) and \(I_B=10\ \mu\text{A}\) produces \(I_C=1\ \text{mA}\), directly demonstrating current amplification.

See also: [MOSFET Basics](#mosfet-basics), [Power Diode](#power-diode).

#### Capstone Device Project

A complete device design exercise that deliberately combines physics and equations from multiple earlier chapters into a single, realistic device.

**Example:** Designing a power rectifier diode combines the breakdown voltage formula (Chapter 15), the depletion width formula (Chapter 14), drift-region resistance (Chapter 11), and thermal conductivity (Chapter 17) into one connected calculation.

See also: [Device Design Trade-Offs](#device-design-trade-offs), [Power Diode](#power-diode).

#### Device Design Trade-Offs

The engineering reality that improving one device performance metric typically costs another, since both often trace back to the same underlying physical parameter.

**Example:** A power diode's breakdown voltage and specific on-resistance both depend on drift region doping in opposite directions, giving the trade-off \(R_{on,sp}\propto V_{BR}^2\) — no single doping choice can simultaneously maximize breakdown voltage and minimize resistance.

See also: [Power Diode](#power-diode), [Capstone Device Project](#capstone-device-project).

#### Device Simulation Concept

The practice of numerically solving Poisson's equation and the continuity equations on a discretized mesh representing a device's actual geometry and doping, without the simplifying assumptions used in analytic models.

**Example:** Device simulation is reserved for situations where idealized analytic assumptions break down or where several effects interact too intricately for a closed-form solution.

See also: [Semiconductor Device Modeling](#semiconductor-device-modeling).

#### MOSFET Basics

The operating principle of a MOSFET: gate voltage exceeding threshold voltage forms an inversion-layer channel (Chapter 16) connecting source and drain, giving voltage-controlled drain current \(I_D=(\mu_nC_{ox}/2)(W/L)(V_{GS}-V_T)^2\) in saturation.

**Example:** Unlike a bipolar transistor, a MOSFET draws essentially no steady-state gate current, since the gate is separated from the channel by an insulating oxide.

See also: [Bipolar Transistor Basics](#bipolar-transistor-basics), [Band Diagram Construction](#band-diagram-construction).

#### Power Diode

A p-n junction engineered with a lightly-doped drift region specifically to block high reverse voltage while conducting large forward current.

**Example:** A power diode rated for 500 V requires roughly ten times lighter drift doping than a typical low-voltage signal diode, trading forward-conduction efficiency for blocking-voltage capability.

See also: [Rectifier Circuit](#rectifier-circuit), [Device Design Trade-Offs](#device-design-trade-offs).

#### Rectifier Circuit

A circuit arrangement of one or more diodes that converts alternating current into direct current.

**Example:** A full-wave bridge rectifier conducts on both half-cycles of an AC input, giving roughly double the average DC output of a half-wave rectifier for the same input amplitude.

See also: [Power Diode](#power-diode).

#### Semiconductor Device Modeling

A simplified, closed-form mathematical description of device behavior, built from physical first principles under a specific set of idealizing assumptions.

**Example:** Every equation derived throughout this course — the ideal diode equation, threshold voltage, the Beer-Lambert law — is an example of semiconductor device modeling.

See also: [Device Simulation Concept](#device-simulation-concept), [Band Diagram Construction](#band-diagram-construction).

#### Varactor Diode

A p-n junction operated under reverse bias specifically to exploit its voltage-dependent junction capacitance as a tunable circuit element.

**Example:** A varactor diode's capacitance change with reverse bias directly tunes the resonant frequency of an LC tank in a voltage-controlled oscillator.

See also: [Power Diode](#power-diode), [Rectifier Circuit](#rectifier-circuit).

</div>
