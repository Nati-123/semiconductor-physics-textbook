<div class="problems-styled" markdown>

# Chapter 6 Glossary

Terms introduced in [Chapter 6 — Band Structure and the Fermi Level](index.md). See the [full site Glossary](../../glossary.md) for terms across all chapters.

#### Density of States

The function \(g(E)\), defined so that \(g(E)\,dE\) is the number of allowed electron states per unit volume with energy between \(E\) and \(E+dE\).

**Example:** For a parabolic conduction band, \(g_c(E) = \frac{1}{2\pi^2}\left(\frac{2m_e^*}{\hbar^2}\right)^{3/2}\sqrt{E-E_c}\), growing as the square root of energy above the band edge.

See also: [Effective Mass](#effective-mass), [Energy Band](../05-quantum-mechanics-periodic-crystals/glossary.md#energy-band).

#### Direct Bandgap

A band structure in which the conduction-band minimum and valence-band maximum occur at the same crystal momentum \(k\).

**Example:** GaAs is a direct-gap material, so a photon alone can drive a vertical, momentum-conserving transition between its band edges — the physical basis for efficient LEDs and laser diodes.

See also: [Indirect Bandgap](#indirect-bandgap), [E-K Diagram](#e-k-diagram).

#### E-K Diagram

A plot of allowed electron energy \(E\) versus crystal momentum (Bloch wavevector) \(k\), showing the detailed shape of a material's energy bands.

**Example:** An E-k diagram immediately reveals whether a material is direct- or indirect-gap by comparing the k-location of the conduction-band minimum to that of the valence-band maximum.

See also: [Direct Bandgap](#direct-bandgap), [Indirect Bandgap](#indirect-bandgap), [Bloch Theorem](../05-quantum-mechanics-periodic-crystals/glossary.md#bloch-theorem).

#### Effective Mass

A quantity \(m^* = \hbar^2/(d^2E/dk^2)\), defined from the curvature of a band at an extremum, that lets an electron or hole there be treated with ordinary Newtonian mechanics.

**Example:** GaAs's sharply-curved conduction band gives it a small electron effective mass (\(m_e^*\approx0.067\,m_0\)), while silicon's more gently-curved conduction band gives it a larger one (\(m_e^*\approx0.26\,m_0\)).

See also: [E-K Diagram](#e-k-diagram), [Density of States](#density-of-states).

#### Fermi Energy

The zero-temperature value of the Fermi level, equal to the energy of the highest occupied electron state.

**Example:** In a metal at \(T=0\), every state below the Fermi energy is completely filled and every state above it is completely empty.

See also: [Fermi Level](#fermi-level).

#### Fermi Level

The parameter \(E_F\) in the Fermi-Dirac distribution \(f(E)=1/[1+\exp((E-E_F)/k_BT)]\) at any temperature, equal to the energy at which the occupation probability is exactly \(1/2\).

**Example:** In an intrinsic semiconductor, the Fermi level sits inside the band gap — where the density of states is zero — even though no electron actually has that exact energy.

See also: [Fermi Energy](#fermi-energy), [Density of States](#density-of-states).

#### Indirect Bandgap

A band structure in which the conduction-band minimum and valence-band maximum occur at different crystal momenta \(k\).

**Example:** Silicon is an indirect-gap material; a band-edge transition requires a phonon to supply the crystal-momentum difference \(\Delta k\) in addition to a photon, making silicon a much weaker light emitter than a direct-gap material.

See also: [Direct Bandgap](#direct-bandgap), [E-K Diagram](#e-k-diagram).

#### Insulator Band Structure

A band structure with a completely full valence band and completely empty conduction band at absolute zero, separated by a large band gap (roughly greater than 4 eV) that prevents significant thermal excitation of carriers.

**Example:** Diamond, with a band gap of about 5.5 eV, is classified as an insulator under this definition.

See also: [Semiconductor Band Structure](#semiconductor-band-structure), [Metal Band Structure](#metal-band-structure).

#### Metal Band Structure

A band structure in which the Fermi level lies inside a partially-filled band, or in which the valence and conduction bands overlap in energy so that electrons partially occupy both.

**Example:** Magnesium conducts well despite having two valence electrons per atom (which naive electron counting would fill exactly one band) because its bands overlap in energy, leaving the Fermi level inside a partially-filled band.

See also: [Insulator Band Structure](#insulator-band-structure), [Semimetal](#semimetal).

#### Semiconductor Band Structure

A band structure identical in kind to an insulator's — a completely full valence band and completely empty conduction band at absolute zero — but with a small enough band gap (roughly 0.1 to 3 eV) that a technologically significant number of carriers are thermally excited across it at room temperature.

**Example:** Silicon (\(E_g\approx1.12\) eV) and GaAs (\(E_g\approx1.42\) eV) are both classified as semiconductors under this definition.

See also: [Insulator Band Structure](#insulator-band-structure), [Fermi Level](#fermi-level).

#### Semimetal

A band structure in which the valence and conduction bands touch or slightly overlap in energy, but with very little density of states at the point of overlap, giving a much lower carrier density than a true metal.

**Example:** Bismuth and graphite are classified as semimetals: they conduct at all temperatures, unlike an insulator, but far more weakly than a true metal.

See also: [Metal Band Structure](#metal-band-structure), [Density of States](#density-of-states).

</div>
