<div class="problems-styled" markdown>

# Chapter 19 Glossary

Terms introduced in [Chapter 19 — Semiconductor Device Fabrication](index.md). See the [full site Glossary](../../glossary.md) for terms across all chapters.

#### Annealing

A high-temperature heat treatment applied after diffusion or ion implantation that repairs crystal lattice damage and moves dopant atoms onto substitutional lattice sites where they can ionize and contribute free carriers.

**Example:** Without annealing, an ion-implanted region remains both crystallographically damaged and electrically inactive, regardless of how precisely the implant dose and energy were controlled.

See also: [Ion Implantation](#ion-implantation), [Diffusion Doping](#diffusion-doping).

#### CMOS Process Integration

The specific, carefully ordered sequence of oxidation, lithography, deposition, doping, etching, and metallization steps required to fabricate a complete complementary MOS transistor.

**Example:** Patterning the gate before implanting source/drain regions lets the gate itself block the implant beneath it, self-aligning the source and drain to the gate edge with no separate alignment step.

See also: [Metallization and Interconnects](#metallization-and-interconnects), [Ion Implantation](#ion-implantation).

#### Czochralski Crystal Growth

A crystal growth method in which a rotating seed crystal is slowly withdrawn from a crucible of molten silicon, solidifying the melt onto the seed to produce a large single-crystal ingot.

**Example:** Czochralski growth produces the large-diameter (up to 300 mm), moderately pure ingots used for most commercial silicon wafers.

See also: [Float-Zone Refining](#float-zone-refining), [Wafer Slicing and Polishing](#wafer-slicing-and-polishing).

#### Diffusion Doping

A doping technique that places dopant atoms by thermal random-walk motion into the crystal from a surface source, producing a Gaussian or complementary-error-function concentration profile depending on the source condition.

**Example:** A limited-source (Gaussian) boron diffusion with total dose \(Q=1\times10^{14}\ \text{cm}^{-2}\) and \(Dt=2\times10^{-9}\ \text{cm}^2\) reaches a junction depth of about 1.97 μm against a \(10^{16}\ \text{cm}^{-3}\) background.

See also: [Ion Implantation](#ion-implantation), [Annealing](#annealing).

#### Dry Etching

An etching technique using a reactive gas or plasma rather than a liquid reagent, capable of strongly anisotropic (directional) material removal.

**Example:** Dry etching's directionality, aided by ion bombardment, lets it reproduce a lithographic mask opening far more faithfully than an isotropic wet etch.

See also: [Plasma Etching](#plasma-etching), [Wet Etching](#wet-etching).

#### Float-Zone Refining

A crystal growth method that passes a narrow molten zone along a silicon rod without crucible contact, producing extremely pure but typically smaller-diameter single-crystal ingots.

**Example:** Float-zone silicon's crucible-free growth avoids the trace contamination Czochralski growth introduces, making it the material of choice for power devices and radiation detectors.

See also: [Czochralski Crystal Growth](#czochralski-crystal-growth).

#### Ion Implantation

A doping technique that accelerates dopant ions through an electric field and fires them directly into the wafer, producing a Gaussian concentration profile centered at a projected range set by ion energy.

**Example:** A phosphorus implant with projected range \(R_p=0.15\ \mu\text{m}\) and straggle \(\Delta R_p=0.05\ \mu\text{m}\) has its concentration fall by more than two orders of magnitude between its peak and the wafer surface.

See also: [Diffusion Doping](#diffusion-doping), [Annealing](#annealing).

#### Manufacturing Defects

Unavoidable atomic-scale imperfections — stray particles, misalignments, dislocations, incomplete etches — that occur statistically during fabrication at modern feature sizes.

**Example:** A single stray particle landing during lithography can misprint an entire die's pattern, directly reducing manufacturing yield.

See also: [Yield and Reliability](#yield-and-reliability).

#### Mask Alignment

The precise positional registration of a lithographic mask to the pattern already present on the wafer from previous process layers.

**Example:** As depth of focus shrinks with increasing numerical aperture, mask alignment tolerance must tighten correspondingly, since misaligned layers no longer connect correctly to one another.

See also: [Photolithography](#photolithography), [UV Exposure and Resolution](#uv-exposure-and-resolution).

#### Metallization and Interconnects

The deposition and patterning of metal layers that form ohmic contacts to source, drain, and gate regions and route electrical signals across a chip.

**Example:** Modern high-performance chips stack ten or more metal interconnect layers, each requiring its own deposition, lithography, and etch cycle.

See also: [CMOS Process Integration](#cmos-process-integration).

#### Photolithography

The process of transferring a two-dimensional geometric pattern from a mask onto a wafer using a light-sensitive photoresist and controlled exposure.

**Example:** An ArF immersion system with \(\lambda=193\ \text{nm}\), \(NA=1.35\), and \(k_1=0.3\) resolves a minimum feature size of about 42.9 nm.

See also: [Photoresist](#photoresist), [UV Exposure and Resolution](#uv-exposure-and-resolution), [Mask Alignment](#mask-alignment).

#### Photoresist

A light-sensitive polymer film coated onto a wafer that chemically changes solubility where it absorbs light, forming the pattern that develops into a lithographic stencil.

**Example:** Positive and negative photoresist produce exactly inverted patterns from an identical mask, since positive resist dissolves where exposed while negative resist dissolves where unexposed.

See also: [Photolithography](#photolithography), [UV Exposure and Resolution](#uv-exposure-and-resolution).

#### Plasma Etching

A dry etching technique in which an electric field ionizes a process gas into reactive ions and radicals that are accelerated toward the wafer, combining chemical reactivity with strong directionality.

**Example:** A plasma etch with vertical rate 200 nm/min and lateral rate 10 nm/min has an anisotropy factor of 0.95, indicating a highly directional, near-vertical profile.

See also: [Dry Etching](#dry-etching), [Wet Etching](#wet-etching).

#### Semiconductor Manufacturing Overview

The framing of the entire fabrication process as a repeating cycle: grow or deposit a layer, pattern it with photolithography, selectively modify or remove material through the pattern, and repeat.

**Example:** A modern CMOS chip requires several hundred individual process steps, nearly all of which are instances of this same repeating cycle applied to a different layer, material, or pattern.

See also: [CMOS Process Integration](#cmos-process-integration).

#### Thermal Oxidation

The growth of a silicon dioxide layer directly from a heated silicon wafer's surface, following the Deal-Grove linear-parabolic growth law.

**Example:** At \(B=0.045\ \mu\text{m}^2/\text{hr}\) in the parabolic regime, 4 hours of oxidation grows an oxide roughly 0.424 μm thick.

See also: [Photolithography](#photolithography).

#### Thin-Film Deposition

The addition of new material layers onto a wafer surface, typically by chemical vapor deposition (CVD), physical vapor deposition (PVD), or atomic layer deposition (ALD).

**Example:** Atomic layer deposition's sequential, self-limiting surface reactions give it the best sidewall conformality of the three methods, at the cost of much slower deposition rates.

See also: [Metallization and Interconnects](#metallization-and-interconnects).

#### UV Exposure and Resolution

The controlled illumination of photoresist through a mask using ultraviolet light, with minimum resolvable feature size set by the Rayleigh criterion \(CD=k_1\lambda/NA\).

**Example:** Shrinking exposure wavelength and increasing numerical aperture are the two principal levers the semiconductor industry has used to shrink minimum feature size over decades of scaling.

See also: [Photolithography](#photolithography), [Photoresist](#photoresist).

#### Wafer Slicing and Polishing

The process of cutting thin discs from a cylindrical crystal ingot and polishing them to an atomically flat, mirror-finish surface.

**Example:** A 1.5 m Czochralski ingot sliced into 775 μm wafers with a 150 μm saw kerf yields roughly 1600 wafers before accounting for the tapered seed and tail ends.

See also: [Czochralski Crystal Growth](#czochralski-crystal-growth), [Float-Zone Refining](#float-zone-refining).

#### Wet Etching

An etching technique using a liquid chemical reagent that dissolves the target material roughly equally in all directions, producing an inherently isotropic etch profile.

**Example:** Wet etching's isotropic undercut widens an etched feature well beyond the resist mask opening, limiting its use for the smallest modern feature sizes.

See also: [Dry Etching](#dry-etching), [Plasma Etching](#plasma-etching).

#### Yield and Reliability

The fraction of manufactured chips that function correctly, and how long the functioning chips continue to work; yield falls exponentially with defect density and die area under the Poisson model \(Y=e^{-D_0A}\).

**Example:** At a defect density of \(0.5\ \text{defects/cm}^2\), quadrupling die area from \(0.5\ \text{cm}^2\) to \(2\ \text{cm}^2\) drops yield from 77.9% to 36.8%.

See also: [Manufacturing Defects](#manufacturing-defects).

</div>
