<div class="problems-styled" markdown>

# Chapter 16 Glossary

Terms introduced in [Chapter 16 — Metal-Semiconductor and MOS Junctions](index.md). See the [full site Glossary](../../glossary.md) for terms across all chapters.

#### Accumulation Region

The MOS surface regime, occurring when \(\psi_s<0\) (\(V_G<V_{FB}\) for a p-type substrate), in which majority carriers are attracted to and pile up at the semiconductor surface.

**Example:** In accumulation, the surface becomes even more strongly p-type than the bulk, and the MOS capacitor behaves electrically much like a simple parallel-plate capacitor with the oxide as its dielectric.

See also: [Flat-Band Voltage](#flat-band-voltage), [Depletion Mode](#depletion-mode).

#### Barrier Height

The energy barrier \(q\Phi_B=q(\Phi_M-\chi)\) that carriers must overcome to cross a metal-semiconductor junction, set by the metal's work function and the semiconductor's electron affinity.

**Example:** Electron and hole barrier heights on the same junction always sum to the band gap, \(\Phi_{Bn}+\Phi_{Bp}=E_g/q\), since together they span the full distance from \(E_C\) to \(E_V\) at the interface.

See also: [Work Function](#work-function), [Electron Affinity](#electron-affinity).

#### Depletion Mode

The MOS surface regime, occurring when \(0<\psi_s<\phi_F\), in which majority carriers are repelled from the surface, exposing a region of fixed ionized dopant charge analogous to a p-n junction's depletion region.

**Example:** In depletion mode, \(Q_{dep}(\psi_s)=\sqrt{2\varepsilon_sqN_A\psi_s}\), a formula with exactly the same functional form as the one-sided p-n junction depletion charge from Chapter 14.

See also: [Accumulation Region](#accumulation-region), [Weak Inversion](#weak-inversion).

#### Electron Affinity

The energy \(q\chi\) from the vacuum level down to a semiconductor's conduction band edge \(E_C\), a fixed material property independent of doping.

**Example:** Silicon's electron affinity is about 4.05 eV; combined with doping-dependent Fermi level position, it sets the semiconductor's own work function \(\Phi_S\).

See also: [Work Function](#work-function), [Barrier Height](#barrier-height).

#### Flat-Band Voltage

The gate voltage \(V_{FB}=\Phi_M-\Phi_S\) at which a MOS capacitor's semiconductor bands show no bending at all, the zero-reference point for surface potential.

**Example:** Because \(\Phi_M\) and \(\Phi_S\) rarely match exactly, most MOS capacitors have a nonzero (often negative) flat-band voltage even before accounting for any fixed oxide charge.

See also: [Surface Potential](#surface-potential), [MOS Capacitor](#mos-capacitor).

#### Gate Oxide

The thin insulating layer, typically silicon dioxide, separating a MOS capacitor's gate from its semiconductor substrate.

**Example:** The gate oxide blocks essentially all DC current between gate and substrate while still transmitting the electric field, letting the gate control the surface electrostatically.

See also: [MOS Capacitor](#mos-capacitor), [Oxide Capacitance](#oxide-capacitance).

#### Inversion Layer

The thin layer of minority carriers that forms at a MOS capacitor's semiconductor surface once strong inversion is reached, serving as the conducting channel of a MOSFET.

**Example:** In an n-channel MOSFET, the inversion layer consists of mobile electrons at the surface of a p-type substrate, formed once \(\psi_s\) reaches \(2\phi_F\).

See also: [Strong Inversion](#strong-inversion), [Threshold Voltage](#threshold-voltage).

#### Metal-Semiconductor Junction

A junction formed wherever a metal is brought into intimate contact with a semiconductor, behaving as either a rectifying Schottky barrier or a low-resistance ohmic contact.

**Example:** Every bond pad, gate electrode, and wire contact in a real semiconductor device is a metal-semiconductor junction.

See also: [Schottky Barrier](#schottky-barrier), [Ohmic Contact](#ohmic-contact).

#### MOS Capacitor

A layered structure stacking a conductive gate, an insulating gate oxide, and a semiconductor substrate, used to electrostatically control the semiconductor surface.

**Example:** The MOS capacitor is the structure at the heart of every MOSFET, with its gate voltage determining whether the channel underneath is off, partially on, or fully on.

See also: [Gate Oxide](#gate-oxide), [Semiconductor Surface](#semiconductor-surface).

#### Ohmic Contact

A low-resistance metal-semiconductor connection with essentially symmetric, linear current-voltage behavior, engineered to avoid rectification.

**Example:** Ohmic contacts are most reliably achieved in practice by doping the semiconductor extremely heavily right at the contact, so carriers can tunnel through the thin barrier regardless of the metal used.

See also: [Rectifying Contact](#rectifying-contact), [Metal-Semiconductor Junction](#metal-semiconductor-junction).

#### Oxide Capacitance

The gate oxide's capacitance per unit area, \(C_{ox}=\varepsilon_{ox}/t_{ox}\), converting charge stored at the semiconductor surface into a voltage across the oxide.

**Example:** Thinner gate oxides give larger \(C_{ox}\), which reduces the depletion-charge contribution to threshold voltage — a key driver of decades of transistor oxide scaling.

See also: [Gate Oxide](#gate-oxide), [Threshold Voltage](#threshold-voltage).

#### Rectifying Contact

A metal-semiconductor junction that impedes current flow in one direction, behaving like a diode, formed when a Schottky barrier is present.

**Example:** Whether a given metal-semiconductor pairing forms a rectifying or ohmic contact depends on comparing work functions, and the deciding rule flips between n-type and p-type material.

See also: [Ohmic Contact](#ohmic-contact), [Schottky Barrier](#schottky-barrier).

#### Schottky Barrier

The rectifying depletion region that forms at a metal-semiconductor junction when the work-function alignment (for the given doping type) produces a barrier to carrier flow.

**Example:** A Schottky barrier's depletion width and peak field follow the same one-sided-junction formulas as a p-n junction, treating the metal as an infinitely-doped "other side."

See also: [Barrier Height](#barrier-height), [Schottky Diode](#schottky-diode).

#### Schottky Diode

A two-terminal rectifying device built from a Schottky barrier, conducting via thermionic emission of majority carriers over the barrier rather than minority-carrier diffusion.

**Example:** Schottky diodes typically turn on at a much lower forward voltage (0.2-0.3 V) than silicon p-n diodes (0.6-0.7 V), and switch faster since there is no minority-carrier storage to remove.

See also: [Schottky Barrier](#schottky-barrier), [Barrier Height](#barrier-height).

#### Semiconductor Surface

The region of a semiconductor directly beneath a MOS capacitor's gate oxide, whose electrostatic state (accumulation, depletion, or inversion) is controlled by gate voltage.

**Example:** Because no current flows through the gate oxide, the semiconductor surface's condition is set entirely by electrostatics, exactly like the plates of a capacitor.

See also: [MOS Capacitor](#mos-capacitor), [Surface Potential](#surface-potential).

#### Strong Inversion

The MOS surface regime, occurring when \(\psi_s\geq2\phi_F\), in which the surface minority-carrier concentration reaches the bulk majority-carrier concentration, forming a conducting inversion layer.

**Example:** Strong inversion, \(\psi_s=2\phi_F\), is the defining condition used to derive the threshold voltage.

See also: [Weak Inversion](#weak-inversion), [Inversion Layer](#inversion-layer).

#### Surface Potential

The band bending \(\psi_s\) at a MOS capacitor's semiconductor surface, measured relative to the bulk, with \(\psi_s=0\) defined at flat-band.

**Example:** Surface potential increases (for a p-type substrate) as gate voltage sweeps positive, moving the surface through depletion and eventually inversion.

See also: [Flat-Band Voltage](#flat-band-voltage), [Depletion Mode](#depletion-mode).

#### Threshold Voltage

The gate voltage \(V_T=V_{FB}+2\phi_F+Q_{dep,max}/C_{ox}\) at which a MOS capacitor's surface reaches strong inversion, defining a MOSFET's on/off switching point.

**Example:** Real fabrication processes tune gate material, substrate doping, and oxide thickness — plus a dedicated threshold-adjustment implant — to land \(V_T\) at a specific target value.

See also: [Strong Inversion](#strong-inversion), [Oxide Capacitance](#oxide-capacitance).

#### Weak Inversion

The MOS surface regime, occurring when \(\phi_F<\psi_s<2\phi_F\), in which minority-carrier concentration at the surface is growing rapidly but has not yet reached the bulk majority concentration.

**Example:** Weak inversion is responsible for subthreshold conduction in real MOSFETs, where the device is not yet fully "on" but is not perfectly off either.

See also: [Depletion Mode](#depletion-mode), [Strong Inversion](#strong-inversion).

#### Work Function

The energy \(q\Phi\) required to remove an electron from a material's Fermi level to the vacuum level just outside its surface.

**Example:** Metal work functions vary widely by material (aluminum about 4.1 eV, gold about 5.1 eV), while a semiconductor's work function additionally depends on its doping.

See also: [Electron Affinity](#electron-affinity), [Barrier Height](#barrier-height).

</div>
