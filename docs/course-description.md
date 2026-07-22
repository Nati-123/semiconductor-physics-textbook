---
title: Course Description for Course Semiconductor Physics
description: A detailed course description for Semiconductor Physics including overview, topics covered and learning objectives in the format of the 2001 Bloom Taxonomy
quality_score: 100
---

# Semiconductor Physics

**Title:** Semiconductor Physics

**Target Audience:** College undergraduate — junior-level Electrical Engineering and Applied/Engineering Physics majors

**Prerequisites:**

- Calculus-based general physics (mechanics and electricity & magnetism)
- Ordinary differential equations
- Introductory modern/quantum physics (wave-particle duality, the Schrödinger equation at an introductory level)
- Basic linear circuit analysis (Ohm's law, Kirchhoff's laws) is helpful but not required

## Course Overview

Semiconductor Physics introduces the quantum-mechanical and statistical foundations that explain how semiconductor materials behave and how that behavior is engineered into the diodes, transistors, and integrated circuits that underlie modern electronics. Students move from the atomic structure of crystalline solids, through energy band theory and carrier statistics, to the transport and junction physics that govern real devices.

This course bridges introductory physics and device-level electrical engineering. Where a circuits course treats a diode or transistor as a black-box component defined by its terminal behavior, this course opens the box: it derives *why* a p-n junction rectifies, *why* doping controls conductivity over many orders of magnitude, and *why* a MOS capacitor can invert its surface charge. This physical grounding is essential for anyone who will later design, fabricate, model, or push the limits of semiconductor devices — from power electronics to microprocessors to solar cells.

The course emphasizes building physical intuition alongside quantitative modeling: students learn to read and construct band diagrams, apply carrier statistics to predict conductivity and Fermi level position, and derive the current-voltage behavior of a p-n junction from first principles.

## Main Topics Covered

- Crystal structure and bonding in solids (unit cells, Miller indices, covalent bonding in silicon/germanium)
- Quantum mechanics foundations for solids (Schrödinger equation, particle in a box, tunneling)
- Energy band theory (Kronig-Penney model, formation of bands and band gaps, direct vs. indirect gap materials)
- Semiconductors in thermal equilibrium (intrinsic vs. extrinsic material, donors and acceptors, ionization)
- Carrier statistics (density of states, Fermi-Dirac distribution, Fermi level position, carrier concentration equations)
- Carrier transport (drift, mobility, conductivity, diffusion, the Einstein relation)
- Non-equilibrium excess carriers (optical/thermal generation, recombination mechanisms, minority carrier lifetime, continuity equations)
- The p-n junction (built-in potential, depletion approximation, junction capacitance, the ideal diode equation)
- Metal-semiconductor junctions (Schottky barriers vs. ohmic contacts)
- The MOS capacitor and semiconductor surfaces (accumulation, depletion, inversion — the physical basis of the MOSFET)
- Optical and thermal properties of semiconductors (absorption, photogeneration, photodiodes/solar cells as an application)

## Topics Not Covered

- Semiconductor device fabrication and process technology (photolithography, ion implantation, etch/deposition processes)
- Full transistor circuit design and analog/digital circuit theory (covered in a separate circuits/devices course)
- Advanced quantum transport and mesoscopic/nanoscale device physics (ballistic transport, quantum dots, spintronics)
- TCAD and detailed numerical device simulation tools
- Compound and exotic semiconductor material systems in depth (III-V heterostructures, wide-bandgap materials) beyond brief mention
- Semiconductor manufacturing economics and industry/business topics

## Learning Outcomes

After completing this course, students will be able to:

### Remember
*Retrieving, recognizing, and recalling relevant knowledge from long-term memory.*

- State the postulates of quantum mechanics relevant to solids and define key terms (wavefunction, eigenstate, energy band, band gap)
- Recall the standard notation and typical values for silicon material properties (band gap, intrinsic carrier concentration, effective mass, dielectric constant)
- List the types of dopant atoms used to create n-type and p-type silicon and identify their group in the periodic table
- Identify the defining equations for drift current, diffusion current, and the ideal diode current-voltage relationship

### Understand
*Constructing meaning from instructional messages, including oral, written, and graphic communication.*

- Explain, in physical terms, why crystalline solids form energy bands rather than discrete atomic energy levels
- Explain the difference between intrinsic and extrinsic semiconductors and how doping shifts the Fermi level
- Describe the physical origin of the built-in potential at a p-n junction and interpret an equilibrium band diagram
- Summarize the roles of generation and recombination in determining minority carrier concentration under illumination or injection

### Apply
*Carrying out or using a procedure in a given situation.*

- Apply the Fermi-Dirac distribution and density-of-states function to calculate electron and hole concentrations at a given temperature and doping level
- Use the mass-action law and charge neutrality condition to solve for majority and minority carrier concentrations in doped semiconductors
- Apply drift-diffusion equations to compute current density in a semiconductor under an applied field and/or concentration gradient
- Calculate the built-in potential, depletion width, and junction capacitance of a p-n junction from doping concentrations

### Analyze
*Breaking material into constituent parts and determining how the parts relate to one another and to an overall structure or purpose.*

- Analyze a semiconductor band diagram to determine doping type, relative doping level, and bias condition
- Differentiate between direct-gap and indirect-gap semiconductors and analyze the implications for optical absorption and emission
- Analyze the continuity equation for excess minority carriers to determine steady-state carrier profiles near a junction or surface
- Compare drift-dominated versus diffusion-dominated transport regimes in a given device structure

### Evaluate
*Making judgments based on criteria and standards through checking and critiquing.*

- Evaluate whether the depletion (abrupt-junction) approximation is appropriate for a given p-n junction and justify the assessment
- Critique a proposed doping profile or material choice against target electrical specifications (e.g., breakdown voltage, switching speed)
- Assess the trade-offs between direct and indirect band gap materials for a specific optoelectronic application (LED vs. silicon photodiode)
- Judge the validity of simplifying assumptions (e.g., low-level injection, quasi-neutral regions) used in a given device derivation

### Create
*Putting elements together to form a coherent or functional whole; reorganizing elements into a new pattern or structure.*

- Derive the ideal diode equation from the minority carrier diffusion equations and boundary conditions at a p-n junction
- Design a doping profile (type and concentration) to achieve a target built-in potential, depletion width, or breakdown voltage
- Construct a complete equilibrium and non-equilibrium band diagram for a novel junction structure given its doping and bias
- **Capstone project:** Model and report on the physics of a real semiconductor device (e.g., solar cell, LED, or power diode), including band diagrams, carrier concentration calculations, and derivation of its key I-V or efficiency characteristic, connecting the physics to a real-world performance metric

## Course Importance

Semiconductor physics is the physical foundation underneath nearly every modern electronic and photonic technology — microprocessors, memory, power converters, solar cells, LEDs, and sensors. Engineers who understand the underlying physics can reason about *why* devices behave as they do, diagnose failures at a fundamental level, and contribute to the design of next-generation devices, rather than treating components purely as circuit-level abstractions. This course is typically a prerequisite for upper-division device and VLSI courses and for research or industry work in semiconductor devices, photonics, and nanotechnology.
