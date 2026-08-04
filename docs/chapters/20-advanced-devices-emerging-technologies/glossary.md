<div class="problems-styled" markdown>

# Chapter 20 Glossary

Terms introduced in [Chapter 20 — Advanced Semiconductor Devices and Emerging Technologies](index.md). See the [full site Glossary](../../glossary.md) for terms across all chapters.

#### Compound Semiconductor Devices

Devices built from compound semiconductor materials such as gallium arsenide and indium phosphide, chosen for higher carrier mobility or direct band gaps that silicon does not offer.

**Example:** GaAs and InP devices dominate high-frequency electronics and fiber-optic communication components precisely because of their high electron mobility and direct band gap.

See also: [Indium Phosphide](#indium-phosphide), [Optoelectronic Device Integration](#optoelectronic-device-integration).

#### FinFET Technology

A multi-gate MOSFET structure in which the channel is a thin vertical silicon "fin," with the gate wrapping around three of its four sides for stronger electrostatic control than a planar MOSFET.

**Example:** A FinFET's natural length is roughly \(1/\sqrt{2}\) that of an equivalent planar MOSFET, directly suppressing short-channel effects at the same body and oxide thickness.

See also: [Gate-All-Around Transistors](#gate-all-around-transistors), [Short-Channel Effects](#short-channel-effects).

#### Future Semiconductor Technologies

The anticipated continuation of two long-running trends: further multi-gate and 3D transistor scaling, and continued adoption of wide-bandgap, compound, and quantum materials wherever silicon's properties fall short.

**Example:** Combining GAA transistor scaling with wide-bandgap power materials in the same roadmap reflects both trends advancing together rather than independently.

See also: [Semiconductor Physics Capstone Synthesis](#semiconductor-physics-capstone-synthesis).

#### Gallium Nitride Devices

Wide-bandgap devices built from gallium nitride (\(E_g\approx3.4\ \text{eV}\)), valued for high critical field and high electron mobility, particularly in high-frequency power converters and RF amplifiers.

**Example:** GaN's higher electron mobility than silicon carbide supports faster switching frequencies, making it preferred for high-frequency power converters and 5G/6G RF amplifiers.

See also: [Wide-Bandgap Semiconductors](#wide-bandgap-semiconductors), [Silicon Carbide Devices](#silicon-carbide-devices).

#### Gate-All-Around Transistors

A multi-gate MOSFET structure using thin horizontal nanosheet channels with the gate wrapping completely around all four sides, giving the strongest electrostatic control available among common transistor geometries.

**Example:** A Gate-All-Around transistor's natural length is half that of an equivalent planar MOSFET, since its four gate-controlled sides quadruple \(n\) in the natural-length formula.

See also: [FinFET Technology](#finfet-technology), [Short-Channel Effects](#short-channel-effects).

#### Indium Phosphide

A compound semiconductor material with very high electron mobility and a directly-tunable band gap, used for the highest-speed optical communication devices such as laser diodes and photodetectors in fiber-optic networks.

**Example:** InP-based laser diodes and photodetectors are standard components in long-haul fiber-optic communication systems.

See also: [Compound Semiconductor Devices](#compound-semiconductor-devices), [Laser Diode](#laser-diode).

#### Laser Diode

An optoelectronic device that extends LED spontaneous emission to stimulated emission above a threshold current, producing coherent, narrow-linewidth light once a population inversion is established.

**Example:** Below threshold current, a laser diode's output power rises slowly like an LED; above threshold, output power rises steeply and linearly as stimulated emission dominates.

See also: [Optoelectronic Device Integration](#optoelectronic-device-integration).

#### MEMS and NEMS

Micro- and nano-electro-mechanical systems that use semiconductor fabrication techniques to build free-standing mechanical structures, such as cantilevers and membranes, instead of electrical junctions.

**Example:** A MEMS cantilever's resonant frequency, \(f=(1/2\pi)\sqrt{k/m}\), is set entirely by the dimensions the fabrication process defines.

See also: [Quantum Dots and Quantum Devices](#quantum-dots-and-quantum-devices).

#### Optoelectronic Device Integration

The connection of LEDs, laser diodes, and photodiodes into complete optical systems, where an emitter's wavelength (set by band gap) matches a receiver's detection range.

**Example:** A photodetector's responsivity, \(\mathcal{R}=\eta q/hf\), determines how efficiently it converts a laser diode's optical output back into usable photocurrent.

See also: [Laser Diode](#laser-diode).

#### Quantum Dots and Quantum Devices

Semiconductor nanocrystals small enough to confine electrons in all three dimensions, applying particle-in-a-box quantum mechanics at the nanoscale so that emission color becomes tunable by nanocrystal size.

**Example:** A 5 nm quantum dot with effective mass \(0.067m_0\) has a ground-state confinement energy of about 1.37 eV, added directly to the material's bulk band gap.

See also: [MEMS and NEMS](#mems-and-nems).

#### Semiconductor Applications in AI and Computing

The reliance of modern AI accelerators and high-performance computing hardware on dense, scaled transistor technology (FinFET and Gate-All-Around) to pack enormous transistor counts into a fixed die area.

**Example:** Higher transistor density from FinFET/GAA scaling increases raw AI accelerator compute capability but also raises power density, connecting directly to fabrication yield and thermal management.

See also: [Semiconductor Applications in Power Electronics and Communications](#semiconductor-applications-in-power-electronics-and-communications).

#### Semiconductor Applications in Power Electronics and Communications

The reliance of electric vehicle drivetrains, renewable energy converters, and 5G/6G communication systems on wide-bandgap and compound semiconductor devices.

**Example:** Electric vehicle drivetrains use SiC power devices for their lower conduction loss and higher thermal conductivity compared to equivalent silicon devices.

See also: [Wide-Bandgap Semiconductors](#wide-bandgap-semiconductors).

#### Semiconductor Physics Capstone Synthesis

The recognition that every advanced device in this chapter is an engineered application of physics derived in earlier chapters, connecting crystal structure through fabrication into one continuous chain of reasoning.

**Example:** A FinFET is still Chapter 16's MOS capacitor wrapped around the channel from more sides; a SiC power device is still Chapter 18's power diode built from a wider-bandgap material.

See also: [Future Semiconductor Technologies](#future-semiconductor-technologies).

#### Short-Channel Effects

Threshold voltage roll-off and drain-induced barrier lowering that appear once MOSFET channel length becomes comparable to the source and drain depletion widths, degrading sharp on/off switching.

**Example:** Drain-induced barrier lowering occurs because a short channel places the source and drain close enough that the drain's electric field reaches the source-channel barrier the gate is trying to control.

See also: [Technology Scaling and Moore's Law](#technology-scaling-and-moores-law), [FinFET Technology](#finfet-technology).

#### Silicon Carbide Devices

Wide-bandgap devices built from silicon carbide (\(E_g\approx3.3\ \text{eV}\)), valued for high critical field and high thermal conductivity in high-voltage power converters and electric vehicle drivetrains.

**Example:** At a 1200 V breakdown rating, SiC achieves roughly 400 times lower specific on-resistance than silicon, due to its much higher critical field entering the on-resistance formula cubed.

See also: [Wide-Bandgap Semiconductors](#wide-bandgap-semiconductors), [Gallium Nitride Devices](#gallium-nitride-devices).

#### Silicon-on-Insulator Technology

A transistor structure built on a buried oxide layer rather than directly on the bulk substrate, reducing parasitic junction capacitance and limiting the drain field's reach into the substrate.

**Example:** Replacing the substrate junction with a fixed buried oxide layer eliminates the associated junction capacitance that a bulk transistor must charge and discharge every switching cycle.

See also: [FinFET Technology](#finfet-technology).

#### Technology Scaling and Moore's Law

The decades-long industry practice of shrinking MOSFET gate length each process generation, informally summarized as transistor count doubling roughly every two years.

**Example:** A chip with \(1\times10^9\) transistors in 2010, scaled at a 2-year doubling period, reaches roughly \(2.56\times10^{11}\) transistors by 2026.

See also: [Short-Channel Effects](#short-channel-effects).

#### Wide-Bandgap Semiconductors

Semiconductor materials with a substantially larger band gap than silicon, giving a higher critical breakdown field and enabling much higher blocking voltage in a thinner drift region.

**Example:** Because specific on-resistance scales as \(1/E_{crit}^3\), even a modestly higher critical field dramatically lowers on-resistance at a fixed breakdown voltage.

See also: [Silicon Carbide Devices](#silicon-carbide-devices), [Gallium Nitride Devices](#gallium-nitride-devices).

</div>
