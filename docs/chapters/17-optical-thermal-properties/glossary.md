<div class="problems-styled" markdown>

# Chapter 17 Glossary

Terms introduced in [Chapter 17 — Optical and Thermal Properties of Semiconductors](index.md). See the [full site Glossary](../../glossary.md) for terms across all chapters.

#### Absorption Coefficient

The material- and wavelength-dependent parameter \(\alpha\), in \(\text{cm}^{-1}\), governing the exponential decay rate of light intensity with depth in the Beer-Lambert law.

**Example:** Direct-gap materials like GaAs have a much larger \(\alpha\) near the band edge than indirect-gap materials like silicon, since no phonon assist is needed for absorption.

See also: [Optical Absorption](#optical-absorption), [Photon Absorption](#photon-absorption).

#### Light-Emitting Diode

A forward-biased p-n junction, built from a direct-gap material, that converts injected current into emitted light via radiative recombination.

**Example:** An LED's emission wavelength is set by its material's band gap, \(\lambda\approx1240/E_g(\text{eV})\ \text{nm}\), which is why different compound semiconductors are chosen to produce different colors.

See also: [Radiative Recombination](#radiative-recombination), [Photodiode](#photodiode).

#### Optical Absorption

The macroscopic decay of light intensity with depth into a semiconductor, resulting from many individual photon absorption events, described by the Beer-Lambert law \(I(x)=I_0e^{-\alpha x}\).

**Example:** A material's optical absorption strength, and hence how thick a solar cell absorber layer must be, is set entirely by its absorption coefficient.

See also: [Absorption Coefficient](#absorption-coefficient), [Photon Absorption](#photon-absorption).

#### Photoconductivity

The increase in a semiconductor's conductivity under illumination, \(\Delta\sigma=q(\Delta n\mu_n+\Delta p\mu_p)\), resulting from photogenerated excess carriers.

**Example:** A photoconductor is simply a semiconductor slab with ohmic contacts; its resistance change under illumination directly measures light intensity.

See also: [Photon Absorption](#photon-absorption), [Optical Absorption](#optical-absorption).

#### Photodiode

A p-n junction used to sense light, in which absorbed photons create carriers that are swept apart by the junction field to produce a photocurrent.

**Example:** A photodiode is typically operated under reverse bias to widen the depletion region and improve collection efficiency and response speed.

See also: [Solar Cell](#solar-cell), [Photon Absorption](#photon-absorption).

#### Photon Absorption

The microscopic event in which a photon with energy \(h\nu\geq E_g\) excites an electron from the valence band to the conduction band, creating an electron-hole pair.

**Example:** Photon absorption is the same fundamental process introduced as "optical generation" in Chapter 13, now examined as the source of the macroscopic optical absorption and photoconductivity effects.

See also: [Optical Absorption](#optical-absorption), [Absorption Coefficient](#absorption-coefficient).

#### Radiative Recombination

Recombination in which the released energy is emitted as a photon rather than heat, efficient in direct-gap materials.

**Example:** Radiative recombination is the same process as Chapter 13's direct recombination, viewed here as a useful light-emission mechanism rather than a loss channel.

See also: [Light-Emitting Diode](#light-emitting-diode), [Photon Absorption](#photon-absorption).

#### Solar Cell

A p-n junction operated near zero or forward bias, without an external power source, to convert absorbed light directly into electrical power.

**Example:** A solar cell's performance is summarized by its short-circuit current \(I_{sc}=I_L\) and open-circuit voltage \(V_{oc}=V_T\ln(I_L/I_0+1)\).

See also: [Photodiode](#photodiode), [Photon Absorption](#photon-absorption).

#### Thermal Conductivity

The material property \(\kappa\) governing how efficiently heat is conducted through a semiconductor, dominated by phonon transport rather than free carriers.

**Example:** Silicon's thermal conductivity of about \(150\ \text{W/(m·K)}\) makes it a reasonably good heat spreader, though power devices still require careful thermal design.

See also: [Thermal Generation Rate](#thermal-generation-rate).

#### Thermal Generation Rate

The rate per unit volume, \(G_{th}=n_i/\tau_0\), at which thermal fluctuations alone create electron-hole pairs.

**Example:** Inside a depletion region, thermal generation rate produces a real leakage current \(I_{gen}=qG_{th}WA\) in addition to the ideal diffusion-based saturation current of Chapter 15.

See also: [Thermal Conductivity](#thermal-conductivity).

</div>
