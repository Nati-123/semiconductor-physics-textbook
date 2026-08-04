<div class="problems-styled" markdown>

# Glossary of Terms

This glossary currently covers the concepts introduced in [Chapter 1: Physics and Math Foundations](chapters/01-physics-math-foundations/index.md), [Chapter 2: Quantum Mechanics Foundations](chapters/02-quantum-mechanics-foundations/index.md), [Chapter 3: Crystal Lattices and Structures](chapters/03-crystal-lattices-structures/index.md), [Chapter 4: Chemical Bonding in Semiconductor Crystals](chapters/04-chemical-bonding-crystals/index.md), [Chapter 5: Quantum Mechanics of Periodic Crystals](chapters/05-quantum-mechanics-periodic-crystals/index.md), [Chapter 6: Band Structure and the Fermi Level](chapters/06-band-structure-fermi-level/index.md), [Chapter 7: Intrinsic and Extrinsic Semiconductors](chapters/07-intrinsic-extrinsic-semiconductors/index.md), [Chapter 8: Doping, Ionization, and Temperature Regimes](chapters/08-doping-ionization-temperature/index.md), [Chapter 9: Carrier Concentration Statistics](chapters/09-carrier-concentration-statistics/index.md), [Chapter 10: Fermi Level Position and Carrier Equations](chapters/10-fermi-level-carrier-equations/index.md), [Chapter 11: Drift Current and Carrier Mobility](chapters/11-drift-current-mobility/index.md), [Chapter 12: Diffusion and Advanced Transport Phenomena](chapters/12-diffusion-transport-phenomena/index.md), [Chapter 13: Non-Equilibrium Carriers and Recombination](chapters/13-non-equilibrium-carriers-recombination/index.md), [Chapter 14: The P-N Junction at Equilibrium](chapters/14-pn-junction-equilibrium/index.md), [Chapter 15: The P-N Junction Under Bias](chapters/15-pn-junction-under-bias/index.md), [Chapter 16: Metal-Semiconductor and MOS Junctions](chapters/16-metal-semiconductor-mos-junctions/index.md), [Chapter 17: Optical and Thermal Properties of Semiconductors](chapters/17-optical-thermal-properties/index.md), [Chapter 18: Semiconductor Devices and Applications](chapters/18-semiconductor-devices-applications/index.md), and [Chapter 19: Semiconductor Device Fabrication](chapters/19-semiconductor-device-fabrication/index.md). This glossary now covers all 19 chapters of the textbook.

#### Absorption Coefficient

The material- and wavelength-dependent parameter \(\alpha\), in \(\text{cm}^{-1}\), governing the exponential decay rate of light intensity with depth in the Beer-Lambert law.

**Example:** Direct-gap materials like GaAs have a much larger \(\alpha\) near the band edge than indirect-gap materials like silicon, since no phonon assist is needed for absorption.

See also: [Optical Absorption](#optical-absorption), [Photon Absorption](#photon-absorption).

#### Acceptor Atom

A Group III element substituted into a Group IV semiconductor lattice, completing only 3 of the 4 required covalent bonds and leaving a hole that ionizes into a mobile positive carrier, becoming a fixed negative ion.

**Example:** Boron, aluminum, gallium, and indium are common acceptor dopants in silicon; boron's measured ionization energy in silicon is about 45 meV.

See also: [Donor Atom](#donor-atom), [Extrinsic Semiconductor](#extrinsic-semiconductor).

#### Accumulation Region

The MOS surface regime, occurring when \(\psi_s<0\) (\(V_G<V_{FB}\) for a p-type substrate), in which majority carriers are attracted to and pile up at the semiconductor surface.

**Example:** In accumulation, the surface becomes even more strongly p-type than the bulk, and the MOS capacitor behaves electrically much like a simple parallel-plate capacitor with the oxide as its dielectric.

See also: [Flat-Band Voltage](#flat-band-voltage), [Depletion Mode](#depletion-mode).

#### Algebra

The branch of mathematics dealing with symbolic manipulation of equations, including solving for an unknown variable and working with exponents and ratios.

**Example:** Rearranging the diode current equation \(I = I_0(e^{V/V_T}-1)\) to solve for \(V\) is an algebra skill applied to a physical law.

#### Allowed Energy States

The specific, continuously-varying \((E,k)\) pairs that satisfy the periodic Schrödinger equation within an energy band.

**Example:** Within a single energy band, \(k\) can vary continuously, so allowed energy states form a dense, quasi-continuous range rather than the widely-separated discrete levels of an isolated atom.

See also: [Energy Band](#energy-band), [Band Formation](#band-formation).

#### Amorphous Solid

A solid in which atoms preserve roughly the same local bonding environment a crystal would prefer, but with no long-range periodic order extending beyond a few atomic spacings.

**Example:** Amorphous silicon (a-Si) preserves silicon's approximate 4-fold local coordination but lacks the long-range periodicity of single-crystal silicon, and is used in low-cost thin-film solar cells.

See also: [Polycrystalline Solid](#polycrystalline-solid), [Crystal Lattice](#crystal-lattice).

#### Annealing

A high-temperature heat treatment applied after diffusion or ion implantation that repairs crystal lattice damage and moves dopant atoms onto substitutional lattice sites where they can ionize and contribute free carriers.

**Example:** Without annealing, an ion-implanted region remains both crystallographically damaged and electrically inactive, regardless of how precisely the implant dose and energy were controlled.

See also: [Ion Implantation](#ion-implantation), [Diffusion Doping](#diffusion-doping).

#### Auger Recombination

A three-carrier recombination process in which the energy released by an electron-hole recombination event is transferred to a third carrier instead of being emitted as a photon or phonon; its rate scales as \(\Delta n^3\).

**Example:** Auger recombination is negligible at low injection but becomes the dominant loss mechanism in heavily-illuminated solar cells and high-current laser diodes.

See also: [Trap-Assisted Recombination](#trap-assisted-recombination), [Carrier Recombination](#carrier-recombination).

#### Avalanche Breakdown

A reverse-breakdown mechanism in which carriers accelerated by the junction electric field gain enough energy between collisions to generate new electron-hole pairs on impact, multiplying into a runaway chain reaction.

**Example:** Avalanche breakdown dominates in lightly-doped junctions, where the depletion region is wide enough for carriers to accelerate over a long distance before colliding.

See also: [Reverse Breakdown](#reverse-breakdown), [Zener Breakdown](#zener-breakdown).

#### Band Diagram Construction

The general procedure for drawing a device's energy band diagram: flat bands in each neutral region at the correct relative height, smooth bending at each junction to keep the Fermi level (or quasi-Fermi levels, under bias) continuous, and bias-dependent shifts.

**Example:** The same band diagram construction procedure produces the p-n junction, Schottky junction, and MOS capacitor diagrams used throughout this course, despite their different materials and structures.

See also: [Power Diode](#power-diode), [Semiconductor Device Modeling](#semiconductor-device-modeling).

#### Band Formation

The splitting of a free particle's continuous energy spectrum into alternating allowed energy bands and forbidden band gaps, caused by the periodicity of the crystal potential.

**Example:** In the Kronig-Penney model, band formation appears as soon as the barrier strength \(P>0\); at \(P=0\) (no periodicity) the spectrum is one continuous band with no gaps.

See also: [Energy Band](#energy-band), [Band Gap](#band-gap), [Kronig-Penney Model](#kronig-penney-model).

#### Band Gap

A range of energy, also called a forbidden energy gap, containing no allowed electron states, lying between two energy bands.

**Example:** In the Kronig-Penney model, band gaps occur wherever \(P\sin(\alpha a)/(\alpha a)+\cos(\alpha a)\) falls outside \([-1,1]\), and these gaps are centered on the Brillouin zone boundaries \(k=\pm n\pi/a\).

See also: [Forbidden Energy Gap](#forbidden-energy-gap), [Energy Band](#energy-band), [Brillouin Zone](#brillouin-zone).

#### Barrier Height

The energy barrier \(q\Phi_B=q(\Phi_M-\chi)\) that carriers must overcome to cross a metal-semiconductor junction, set by the metal's work function and the semiconductor's electron affinity.

**Example:** Electron and hole barrier heights on the same junction always sum to the band gap, \(\Phi_{Bn}+\Phi_{Bp}=E_g/q\), since together they span the full distance from \(E_C\) to \(E_V\) at the interface.

See also: [Work Function](#work-function), [Electron Affinity](#electron-affinity).

#### Basis

The atom, or small group of atoms, attached to every point of a crystal lattice to produce a crystal structure.

**Example:** The zincblende structure attaches a two-atom basis (one atom of each species, such as gallium and arsenic) to the underlying lattice geometry it shares with diamond.

See also: [Crystal Lattice](#crystal-lattice), [Diamond Lattice Structure](#diamond-lattice-structure).

#### Bipolar Transistor Basics

The operating principle of a bipolar junction transistor: two adjacent junctions sharing a thin base region, where forward-biasing the emitter-base junction injects minority carriers mostly collected by the reverse-biased base-collector junction, giving current gain \(I_C=\beta I_B\).

**Example:** A BJT with \(\beta=100\) and \(I_B=10\ \mu\text{A}\) produces \(I_C=1\ \text{mA}\), directly demonstrating current amplification.

See also: [MOSFET Basics](#mosfet-basics), [Power Diode](#power-diode).

#### Bloch Theorem

The theorem stating that any solution to the Schrödinger equation in a periodic potential must take the form \(\psi_k(x)=e^{ikx}u_k(x)\), where \(u_k(x)\) has the same periodicity as the lattice.

**Example:** Bloch's theorem introduces the Bloch wavevector \(k\) and the associated crystal momentum \(\hbar k\).

See also: [Periodic Potential](#periodic-potential), [Kronig-Penney Model](#kronig-penney-model).

#### Body-Centered Cubic

A cubic crystal structure with atoms at the 8 corners of the conventional cell plus one additional whole atom at the body center, giving 2 atoms per cell, coordination number 8, and packing fraction \(\sqrt3\pi/8\approx0.680\).

**Example:** The touching condition for BCC, \(4r=\sqrt3\,a\), comes from atoms touching along the cube's body diagonal.

See also: [Simple Cubic Structure](#simple-cubic-structure), [Face-Centered Cubic](#face-centered-cubic), [Coordination Number](#coordination-number).

#### Boltzmann Approximation

The approximation \(f(E)\approx e^{-(E-E_F)/k_BT}\), valid whenever \(E-E_F\gg k_BT\), that makes the carrier-concentration integral solvable in closed form.

**Example:** Every carrier-concentration equation derived in Chapters 9-10 rests on this single approximation being valid — the nondegenerate semiconductor condition.

See also: [Nondegenerate Semiconductor](#nondegenerate-semiconductor).

#### Boltzmann Constant

A fundamental physical constant, \(k_B = 1.381\times10^{-23}\) J/K, that relates the absolute temperature of a system to the average thermal energy of its particles.

See also: [Kinetic Theory of Gases](#kinetic-theory-of-gases), [Thermal Equilibrium](#thermal-equilibrium).

#### Boundary Conditions

Constraints imposed on a wavefunction (or its derivative) at the edges of a spatial region, required for a solution of the Schrödinger equation to be physically acceptable.

**Example:** The particle-in-a-box conditions \(\psi(0)=\psi(L)=0\) force the wavefunction to vanish at the infinitely high walls, and this requirement alone forces the allowed energies to be quantized.

See also: [Eigenvalue](#eigenvalue), [Particle in a Box](#particle-in-a-box).

#### Brillouin Zone

The primitive cell of the reciprocal lattice, constructed by the Wigner-Seitz procedure; the first Brillouin zone of a 1D chain with lattice constant \(a\) is the interval \(-\pi/a \leq k \leq \pi/a\).

**Example:** The Kronig-Penney model's band gaps open precisely at the first, second, and higher Brillouin zone boundaries, \(k=\pm n\pi/a\).

See also: [Reciprocal Lattice](#reciprocal-lattice), [Band Gap](#band-gap).

#### Built-In Potential

The equilibrium electrostatic potential difference across a p-n junction, \(V_{bi}=(kT/q)\ln(N_AN_D/n_i^2)\), required so that a single Fermi level can describe carrier concentrations on both sides.

**Example:** A silicon junction with \(N_A=1\times10^{17}\ \text{cm}^{-3}\) and \(N_D=1\times10^{16}\ \text{cm}^{-3}\) has \(V_{bi}\approx0.754\ \text{V}\) at 300 K, independent of the junction's physical area.

See also: [P-N Junction](#p-n-junction), [Depletion Width](#depletion-width).

#### Capstone Device Project

A complete device design exercise that deliberately combines physics and equations from multiple earlier chapters into a single, realistic device.

**Example:** Designing a power rectifier diode combines the breakdown voltage formula (Chapter 15), the depletion width formula (Chapter 14), drift-region resistance (Chapter 11), and thermal conductivity (Chapter 17) into one connected calculation.

See also: [Device Design Trade-Offs](#device-design-trade-offs), [Power Diode](#power-diode).

#### Carrier Concentration Equation

The final, most-used form of the electron and hole concentration equations, referenced to the intrinsic Fermi level: \(n_0=n_ie^{(E_F-E_i)/k_BT}\) and \(p_0=n_ie^{(E_i-E_F)/k_BT}\).

**Example:** The p-n junction chapters ahead compute built-in potential almost entirely in terms of how far \(E_F\) sits from \(E_i\) on each side of the junction, using this equation form.

See also: [Intrinsic Fermi Level](#intrinsic-fermi-level), [Electron Concentration](#electron-concentration).

#### Carrier Generation

The creation of electron-hole pairs, promoting an electron from the valence band to the conduction band, via optical or thermal processes.

**Example:** A beam of above-bandgap light striking a semiconductor generates electron-hole pairs uniformly through the illuminated region.

See also: [Optical Generation](#optical-generation), [Thermal Generation](#thermal-generation), [Excess Carriers](#excess-carriers).

#### Carrier Injection

The general process of adding excess carriers to a semiconductor, by illumination, applied bias, or other means, classified as low-level or high-level depending on the excess concentration relative to doping.

**Example:** Forward-biasing a p-n junction injects minority carriers across the junction, a direct application of carrier injection.

See also: [Low-Level Injection](#low-level-injection), [High-Level Injection](#high-level-injection).

#### Carrier Mobility

The proportionality constant \(\mu\) relating drift velocity to electric field, \(v_d=\mu E\), capturing how efficiently an applied field converts into net carrier motion given the scattering environment.

**Example:** GaAs's much smaller electron effective mass gives it a higher intrinsic mobility than silicon, useful for high-frequency devices.

See also: [Drift Velocity](#drift-velocity), [Scattering Mechanism](#scattering-mechanism).

#### Carrier Recombination

The process by which an electron and hole recombine, returning excess carrier concentration toward its equilibrium value.

**Example:** Carrier recombination is the reverse process of carrier generation, and the two exactly balance at thermal equilibrium.

See also: [Direct Recombination](#direct-recombination), [Indirect Recombination](#indirect-recombination), [Minority Carrier Lifetime](#minority-carrier-lifetime).

#### Carrier Temperature Dependence

The behavior of carrier concentration as a function of temperature, explained by the exact electron concentration equation smoothly transitioning between the extrinsic and intrinsic limits as \(n_i(T)\) changes.

**Example:** At low-to-moderate temperature, \(n_0\approx N_D-N_A\) (extrinsic); at high temperature, \(n_0\approx n_i(T)\) (intrinsic) — the same formula describes both.

See also: [Electron Concentration](#electron-concentration).

#### Charge Neutrality Condition

The requirement that a semiconductor crystal carry no net charge overall, expressed as \(n_0+N_A^-=p_0+N_D^+\), combined with the mass action law to solve exactly for carrier concentrations.

**Example:** In an n-type sample with negligible \(p_0\) and no acceptors, charge neutrality reduces to the familiar approximation \(n_0\approx N_D\).

See also: [Mass Action Law](#mass-action-law).

#### CMOS Process Integration

The specific, carefully ordered sequence of oxidation, lithography, deposition, doping, etching, and metallization steps required to fabricate a complete complementary MOS transistor.

**Example:** Patterning the gate before implanting source/drain regions lets the gate itself block the implant beneath it, self-aligning the source and drain to the gate edge with no separate alignment step.

See also: [Metallization and Interconnects](#metallization-and-interconnects), [Ion Implantation](#ion-implantation).

#### Compensated Semiconductor

A semiconductor containing both donor and acceptor atoms simultaneously, whose majority carrier type and concentration are set by the net doping, \(N_D-N_A\) or \(N_A-N_D\), rather than either concentration alone.

**Example:** A sample with \(N_D=8\times10^{15}\ \text{cm}^{-3}\) and \(N_A=5\times10^{15}\ \text{cm}^{-3}\) is net n-type, with majority electron concentration approximately \(3\times10^{15}\ \text{cm}^{-3}\).

See also: [N-Type Doping](#n-type-doping), [P-Type Doping](#p-type-doping).

#### Complex Numbers

Numbers of the form \(a+bi\), with real part \(a\) and imaginary part \(b\) where \(i=\sqrt{-1}\), used to represent oscillations, phase, and quantum-mechanical wavefunctions.

**Example:** Euler's formula, \(e^{i\theta}=\cos\theta+i\sin\theta\), rewrites an oscillation as a complex exponential.

#### Compound Semiconductor

A semiconductor built from two or more different atomic species alternating on the lattice, most commonly a Group III + Group V pairing (III-V) or a Group II + Group VI pairing (II-VI), whose average valence electron count equals 4.

**Example:** Gallium arsenide (GaAs) alternates Ga (Group III) and As (Group V) atoms, each bond joining one atom of each species.

See also: [Elemental Semiconductor](#elemental-semiconductor), [Gallium Arsenide](#gallium-arsenide).

#### Concentration Gradient

The spatial rate of change of carrier concentration, \(dn/dx\) or \(dp/dx\), that drives diffusion current via Fick's law.

**Example:** A steeper concentration gradient near an injection point drives a larger diffusion current than a shallow, gradual one.

See also: [Diffusion Current](#diffusion-current).

#### Conduction Band

The energy band immediately above the valence band, typically empty (or nearly so) of electrons at absolute zero.

**Example:** Whether a material conducts electricity well depends heavily on how easily electrons can be excited from the valence band into the conduction band across the band gap.

See also: [Valence Band](#valence-band), [Band Gap](#band-gap).

#### Conductivity

The quantity \(\sigma=q(n\mu_n+p\mu_p)\) summarizing how easily a doped semiconductor conducts current, combining carrier concentration and mobility.

**Example:** Even though heavier doping reduces mobility through impurity scattering, conductivity still rises with doping because the carrier concentration increase dominates.

See also: [Resistivity](#resistivity), [Carrier Mobility](#carrier-mobility).

#### Continuity Equation

The master equation governing how excess carrier concentration evolves in space and time, combining diffusion, drift, generation, and recombination.

**Example:** Solving the continuity equation at steady state for carriers injected at a boundary yields the exponential steady-state carrier profile characterized by the diffusion length.

See also: [Steady-State Carrier Profile](#steady-state-carrier-profile), [Diffusion Length](#diffusion-length).

#### Coordination Number

The number of nearest-neighbor atoms surrounding any given atom in a crystal structure.

**Example:** Simple cubic has coordination number 6, body-centered cubic has 8, face-centered cubic has 12, and diamond cubic has 4.

See also: [Simple Cubic Structure](#simple-cubic-structure), [Body-Centered Cubic](#body-centered-cubic), [Face-Centered Cubic](#face-centered-cubic), [Diamond Lattice Structure](#diamond-lattice-structure).

#### Coulomb's Law

A physical law stating that the electrostatic force between two point charges is proportional to the product of their magnitudes and inversely proportional to the square of the distance separating them.

**Example:** Two charges separated by 1 nm exert a measurable attractive or repulsive force depending on whether their signs match.

See also: [Electric Field](#electric-field), [Electric Charge](#electric-charge).

#### Covalent Bond

A chemical bond formed when two atoms each contribute one valence electron to a shared electron pair that is electrostatically attracted to both nuclei; directional, and the bond type used by silicon and germanium.

**Example:** Each silicon atom forms 4 covalent bonds, one to each of 4 tetrahedrally-arranged neighbors, satisfying its octet by counting the 8 total electrons shared across those 4 bonds.

See also: [Valence Electron](#valence-electron), [Tetrahedral Bonding](#tetrahedral-bonding).

Contrast with: [Ionic Bond](#ionic-bond), which transfers electrons completely rather than sharing them, and [Metallic Bond](#metallic-bond), which delocalizes electrons across the entire crystal.

#### Crystal Defect

Any local disruption of the ideal, perfectly periodic crystal lattice, including point defects such as vacancies (missing atoms), interstitials (extra atoms between regular sites), and substitutional impurities (foreign atoms replacing host atoms).

**Example:** A phosphorus atom occupying a silicon lattice site is a substitutional defect — the same mechanism deliberately exploited during doping.

See also: [Amorphous Solid](#amorphous-solid), [Polycrystalline Solid](#polycrystalline-solid).

#### Crystal Lattice

An infinite, perfectly periodic array of points in space, with every point having an environment identical to every other point; a purely geometric object containing no atoms until a basis is attached.

**Example:** Attaching a single-atom basis to every point of a face-centered cubic lattice produces the FCC crystal structure of many common metals.

See also: [Basis](#basis), [Unit Cell](#unit-cell).

#### Crystal Plane

Any flat plane passing through a set of points within a crystal lattice, labeled using Miller indices; physically relevant to cleavage, surface properties, and device fabrication.

**Example:** Silicon wafers are commonly cut along the \((100)\) crystal plane, while silicon cleaves most readily along \((111)\) planes.

See also: [Miller Indices](#miller-indices).

#### Curl

A vector-calculus operator that measures the tendency of a vector field to circulate, or rotate, around a given point.

**Example:** The curl of a static electric field is always zero, which is why such fields can always be written as the gradient of a potential.

Contrast with: [Divergence](#divergence), [Gradient](#gradient).

#### Czochralski Crystal Growth

A crystal growth method in which a rotating seed crystal is slowly withdrawn from a crucible of molten silicon, solidifying the melt onto the seed to produce a large single-crystal ingot.

**Example:** Czochralski growth produces the large-diameter (up to 300 mm), moderately pure ingots used for most commercial silicon wafers.

See also: [Float-Zone Refining](#float-zone-refining), [Wafer Slicing and Polishing](#wafer-slicing-and-polishing).

#### de Broglie Wavelength

The wavelength associated with any particle of momentum \(p\), given by \(\lambda = h/p = h/(mv)\), extending wave behavior from light to all matter.

**Example:** An electron accelerated through 100 V has a de Broglie wavelength of about 0.123 nm, comparable to the spacing between atoms in a crystal.

See also: [Wave-Particle Duality](#wave-particle-duality), [Wavefunction](#wavefunction).

#### Degenerate Semiconductor

A semiconductor doped so heavily that the Fermi level is pushed to or past a band edge, invalidating the non-degenerate (Boltzmann) approximation used in standard carrier-statistics equations.

**Example:** Silicon doped above \(N_D\approx2.8\times10^{19}\ \text{cm}^{-3}\) (its effective conduction-band density of states) becomes degenerate, as used deliberately in low-resistance transistor contacts.

See also: [Doping Concentration](#doping-concentration).

#### Density of States

The function \(g(E)\), defined so that \(g(E)\,dE\) is the number of allowed electron states per unit volume with energy between \(E\) and \(E+dE\).

**Example:** For a parabolic conduction band, \(g_c(E) = \frac{1}{2\pi^2}\left(\frac{2m_e^*}{\hbar^2}\right)^{3/2}\sqrt{E-E_c}\), growing as the square root of energy above the band edge.

See also: [Effective Mass](#effective-mass), [Energy Band](#energy-band).

#### Density of States Function

The function \(g(E)\) counting allowed electron states per unit volume per unit energy, combined with the Fermi function and integrated to compute carrier concentration.

**Example:** The conduction-band density of states, \(g_c(E)\propto\sqrt{E-E_C}\), is the starting point for deriving the effective density of states \(N_C\).

See also: [Effective Density of States](#effective-density-of-states), [Fermi Function](#fermi-function).

#### Depletion Approximation

An idealization of the depletion region as fully depleted of mobile carriers with sharp, abrupt edges, and fully charge-neutral everywhere outside those edges.

**Example:** Under the depletion approximation, mobile carrier concentration is treated as exactly zero for \(-x_p\le x\le x_n\), even though the real transition is a smooth, continuous falloff.

See also: [Depletion Region](#depletion-region), [Depletion Charge Density](#depletion-charge-density).

#### Depletion Charge Density

The net charge density \(\rho(x)\) within the depletion region under the depletion approximation: \(-qN_A\) on the p-side and \(+qN_D\) on the n-side, zero elsewhere.

**Example:** Integrating \(\rho(x)\) across the full depletion width gives the charge-neutrality condition \(N_Ax_p=N_Dx_n\).

See also: [Poisson's Equation](#poissons-equation), [Junction Electric Field](#junction-electric-field).

#### Depletion Mode

The MOS surface regime, occurring when \(0<\psi_s<\phi_F\), in which majority carriers are repelled from the surface, exposing a region of fixed ionized dopant charge analogous to a p-n junction's depletion region.

**Example:** In depletion mode, \(Q_{dep}(\psi_s)=\sqrt{2\varepsilon_sqN_A\psi_s}\), a formula with exactly the same functional form as the one-sided p-n junction depletion charge from Chapter 14.

See also: [Accumulation Region](#accumulation-region), [Weak Inversion](#weak-inversion).

#### Depletion Region

The region on either side of a metallurgical junction that has been swept nearly clean of mobile carriers by diffusion and recombination, exposing fixed ionized dopant charge.

**Example:** The depletion region is often called the space-charge region because the only charge present within it is the fixed, uncompensated ionized dopant charge.

See also: [Metallurgical Junction](#metallurgical-junction), [Depletion Approximation](#depletion-approximation).

#### Depletion Width

The total extent \(W=x_n+x_p\) of the depletion region, set by doping concentrations and the built-in potential, \(W=\sqrt{(2\varepsilon V_{bi}/q)(1/N_A+1/N_D)}\).

**Example:** In a one-sided junction with \(N_A\gg N_D\), the depletion width lies almost entirely in the lightly doped n-side, since charge neutrality forces \(x_p\ll x_n\).

See also: [Built-In Potential](#built-in-potential), [Junction Capacitance](#junction-capacitance).

#### Device Design Trade-Offs

The engineering reality that improving one device performance metric typically costs another, since both often trace back to the same underlying physical parameter.

**Example:** A power diode's breakdown voltage and specific on-resistance both depend on drift region doping in opposite directions, giving the trade-off \(R_{on,sp}\propto V_{BR}^2\) — no single doping choice can simultaneously maximize breakdown voltage and minimize resistance.

See also: [Power Diode](#power-diode), [Capstone Device Project](#capstone-device-project).

#### Device Simulation Concept

The practice of numerically solving Poisson's equation and the continuity equations on a discretized mesh representing a device's actual geometry and doping, without the simplifying assumptions used in analytic models.

**Example:** Device simulation is reserved for situations where idealized analytic assumptions break down or where several effects interact too intricately for a closed-form solution.

See also: [Semiconductor Device Modeling](#semiconductor-device-modeling).

#### Diamond Lattice Structure

A crystal structure formed from two interpenetrating face-centered cubic lattices offset by \((1/4,1/4,1/4)a\) along the body diagonal, giving 8 atoms per conventional cell and tetrahedral (4-fold) coordination.

**Example:** Silicon (\(a=0.543\) nm) and germanium (\(a=0.566\) nm) both crystallize in the diamond lattice structure, with nearest-neighbor distance \(d=\sqrt3\,a/4\).

See also: [Face-Centered Cubic](#face-centered-cubic), [Zincblende Structure](#zincblende-structure), [Coordination Number](#coordination-number).

Contrast with: [Zincblende Structure](#zincblende-structure), which shares the same geometry but places two different atomic species on the two sublattices.

#### Differentiation

The mathematical operation of finding the instantaneous rate of change of a function with respect to one of its variables.

**Example:** Differentiating position with respect to time gives velocity.

See also: [Partial Derivatives](#partial-derivatives), [Integration](#integration).

#### Diffusion Coefficient

The proportionality constant \(D\) relating diffusion current to concentration gradient in Fick's law, directly tied to mobility through the Einstein relation.

**Example:** Silicon's electron diffusion coefficient (\(D_n\approx35\ \text{cm}^2/\text{s}\) at 300 K) is much smaller than GaAs's, tracking the same ratio as their mobilities.

See also: [Einstein Relation](#einstein-relation), [Diffusion Current](#diffusion-current).

#### Diffusion Current

Current driven by a carrier concentration gradient rather than an electric field, \(J_{n,\text{diff}}=qD_n(dn/dx)\).

**Example:** Carriers injected at one edge of a semiconductor region diffuse toward regions of lower concentration, exactly like ink spreading in water.

See also: [Drift Current](#drift-current).

#### Diffusion Doping

A doping technique that places dopant atoms by thermal random-walk motion into the crystal from a surface source, producing a Gaussian or complementary-error-function concentration profile depending on the source condition.

**Example:** A limited-source (Gaussian) boron diffusion with total dose \(Q=1\times10^{14}\ \text{cm}^{-2}\) and \(Dt=2\times10^{-9}\ \text{cm}^2\) reaches a junction depth of about 1.97 μm against a \(10^{16}\ \text{cm}^{-3}\) background.

See also: [Ion Implantation](#ion-implantation), [Annealing](#annealing).

#### Diffusion Length

The characteristic distance, \(L=\sqrt{D\tau}\), that a minority carrier diffuses, on average, before recombining.

**Example:** A solar cell's absorber layer must generally be kept well below the minority carrier diffusion length, or photogenerated carriers will recombine before reaching a collecting junction.

See also: [Continuity Equation](#continuity-equation), [Steady-State Carrier Profile](#steady-state-carrier-profile).

#### Direct Bandgap

A band structure in which the conduction-band minimum and valence-band maximum occur at the same crystal momentum \(k\).

**Example:** GaAs is a direct-gap material, so a photon alone can drive a vertical, momentum-conserving transition between its band edges — the physical basis for efficient LEDs and laser diodes.

See also: [Indirect Bandgap](#indirect-bandgap), [E-K Diagram](#e-k-diagram).

#### Direct Recombination

Band-to-band recombination in a direct-gap material, where the conduction band minimum and valence band maximum sit at the same crystal momentum, allowing an electron to recombine without a momentum-conserving assist.

**Example:** Direct recombination's efficiency in GaAs (a direct-gap material) is why GaAs and related compounds are used to make LEDs and laser diodes.

See also: [Indirect Recombination](#indirect-recombination).

#### Divergence

A vector-calculus operator that measures the net outward flow of a vector field per unit volume at a point, indicating whether the point behaves as a source or a sink.

**Example:** The divergence of the electric field at a point is proportional to the local electric charge density there.

See also: [Gauss's Law](#gausss-law), [Curl](#curl).

#### Donor Atom

A Group V element substituted into a Group IV semiconductor lattice, completing 4 covalent bonds like the host atom and contributing a 5th, weakly-bound electron that ionizes into a free electron, becoming a fixed positive ion.

**Example:** Phosphorus, arsenic, and antimony are common donor dopants in silicon; phosphorus's measured ionization energy in silicon is about 45 meV.

See also: [Acceptor Atom](#acceptor-atom), [Extrinsic Semiconductor](#extrinsic-semiconductor).

#### Dopant Ionization

The temperature-dependent process by which a donor releases its weakly-bound electron, or an acceptor captures a neighboring electron and releases a hole, becoming a fixed charged ion.

**Example:** At liquid nitrogen temperature (77 K), phosphorus donors in silicon are only partially ionized, since \(k_BT\approx6.6\) meV is much smaller than phosphorus's 45 meV ionization energy.

See also: [Ionization Energy](#ionization-energy), [Freeze-Out Regime](#freeze-out-regime).

#### Doping Concentration

The number density of donor (\(N_D\)) or acceptor (\(N_A\)) atoms introduced into a semiconductor, typically expressed in atoms per cm\(^3\), which sets majority carrier concentration once dopants are fully ionized.

**Example:** In the extrinsic temperature region, an n-type sample doped at \(N_D=2\times10^{16}\ \text{cm}^{-3}\) has majority electron concentration \(n_0\approx2\times10^{16}\ \text{cm}^{-3}\).

See also: [Extrinsic Temperature Region](#extrinsic-temperature-region), [Dopant Ionization](#dopant-ionization).

#### Drift Current

Current produced when an applied electric field superimposes a net drift velocity on carriers' random thermal motion, \(J_{\text{drift}}=q(n\mu_n+p\mu_p)E\).

**Example:** Drift current is the dominant current mechanism inside a resistor or the quasi-neutral regions of a biased diode.

See also: [Drift Velocity](#drift-velocity), [Diffusion Current](#diffusion-current).

#### Drift Velocity

The small, steady net velocity, \(v_d=\mu E\), that an applied electric field adds to a carrier's much larger random thermal motion.

**Example:** Even at typical operating fields, drift velocity is usually far smaller than a carrier's random thermal speed — it is a small bias, not a replacement for thermal motion.

See also: [Carrier Mobility](#carrier-mobility), [Drift Current](#drift-current).

#### Dry Etching

An etching technique using a reactive gas or plasma rather than a liquid reagent, capable of strongly anisotropic (directional) material removal.

**Example:** Dry etching's directionality, aided by ion bombardment, lets it reproduce a lithographic mask opening far more faithfully than an isotropic wet etch.

See also: [Plasma Etching](#plasma-etching), [Wet Etching](#wet-etching).

#### E-K Diagram

A plot of allowed electron energy \(E\) versus crystal momentum (Bloch wavevector) \(k\), showing the detailed shape of a material's energy bands.

**Example:** An E-k diagram immediately reveals whether a material is direct- or indirect-gap by comparing the k-location of the conduction-band minimum to that of the valence-band maximum.

See also: [Direct Bandgap](#direct-bandgap), [Indirect Bandgap](#indirect-bandgap), [Bloch Theorem](#bloch-theorem).

#### Effective Density of States

A single constant, \(N_C\) (or \(N_V\)), that collapses the entire conduction- (or valence-) band density-of-states integral into one number, letting non-degenerate carrier concentration be written as \(n_0=N_Ce^{-(E_C-E_F)/k_BT}\).

**Example:** Silicon's \(N_C\approx2.8\times10^{19}\ \text{cm}^{-3}\) at 300 K, the same value used to define the degenerate-semiconductor criterion in Chapter 8.

See also: [Density of States Function](#density-of-states-function), [Intrinsic Carrier Concentration](#intrinsic-carrier-concentration).

#### Effective Mass

A quantity \(m^* = \hbar^2/(d^2E/dk^2)\), defined from the curvature of a band at an extremum, that lets an electron or hole there be treated with ordinary Newtonian mechanics.

**Example:** GaAs's sharply-curved conduction band gives it a small electron effective mass (\(m_e^*\approx0.067\,m_0\)), while silicon's more gently-curved conduction band gives it a larger one (\(m_e^*\approx0.26\,m_0\)).

See also: [E-K Diagram](#e-k-diagram), [Density of States](#density-of-states).

#### Eigenstate

A specific wavefunction that solves the Schrödinger equation for a given potential while satisfying the system's boundary conditions; also called a stationary state.

**Example:** The particle-in-a-box eigenstates are \(\psi_n(x) = \sqrt{2/L}\sin(n\pi x/L)\), each labeled by a quantum number \(n\).

See also: [Eigenvalue](#eigenvalue), [Boundary Conditions](#boundary-conditions).

#### Eigenvalue

One of the discrete, allowed total energies of a bound quantum system, paired with its corresponding eigenstate.

**Example:** The particle-in-a-box eigenvalues are \(E_n = n^2h^2/(8mL^2)\), forming a discrete ladder of allowed energies rather than a continuum.

See also: [Eigenstate](#eigenstate), [Quantum Number](#quantum-number).

#### Einstein Relation

The relationship \(D=\mu k_BT/q\) tying the diffusion coefficient directly to mobility, since both drift and diffusion are governed by the same carrier-scattering environment.

**Example:** At 300 K, since \(k_BT/q\approx0.0259\) V, the Einstein relation lets \(D\) be computed directly from \(\mu\) with no separate measurement needed.

See also: [Diffusion Coefficient](#diffusion-coefficient), [Carrier Mobility](#carrier-mobility).

#### Electric Charge

A fundamental, conserved property of matter that occurs in two signs and is quantized in integer multiples of the elementary charge, \(e = 1.602\times10^{-19}\) C.

**Example:** An electron carries charge \(-e\); an ionized donor atom carries charge \(+e\).

#### Electric Field

The force per unit charge that a small positive test charge would experience at a given point in space, created by nearby source charges.

**Example:** Doubling the distance from a point charge reduces the electric field it produces to one-quarter of its original value.

See also: [Coulomb's Law](#coulombs-law), [Electric Potential](#electric-potential).

#### Electric Flux

A measure of the total electric field passing through a given surface, computed as the field's component perpendicular to the surface integrated over its area.

See also: [Gauss's Law](#gausss-law).

#### Electric Potential

The electrostatic potential energy per unit charge at a point in space, commonly called voltage; only differences in potential are physically meaningful.

**Example:** The 0.7 V forward-bias voltage across a silicon diode is a difference in electric potential.

See also: [Electrostatic Potential Energy](#electrostatic-potential-energy), [Gradient](#gradient).

#### Electron Affinity

The energy \(q\chi\) from the vacuum level down to a semiconductor's conduction band edge \(E_C\), a fixed material property independent of doping.

**Example:** Silicon's electron affinity is about 4.05 eV; combined with doping-dependent Fermi level position, it sets the semiconductor's own work function \(\Phi_S\).

See also: [Work Function](#work-function), [Barrier Height](#barrier-height).

#### Electron Concentration

The exact equilibrium electron concentration, \(n_0=\big[(N_D-N_A)+\sqrt{(N_D-N_A)^2+4n_i^2}\big]/2\), obtained by solving the mass action law and charge neutrality condition together.

**Example:** For heavily n-type-doped silicon, this formula reduces to the familiar \(n_0\approx N_D\); for a perfectly compensated sample, it reduces to \(n_0=n_i\).

See also: [Hole Concentration](#hole-concentration), [Carrier Concentration Equation](#carrier-concentration-equation).

#### Electron-Hole Pair

The free electron and hole created together by a single carrier-generation event, such as thermal bond-breaking or photon absorption.

**Example:** Every thermally-broken covalent bond in an intrinsic semiconductor produces exactly one electron-hole pair.

See also: [Free Electron](#free-electron), [Hole](#hole).

#### Electronegativity

A measure of how strongly an atom's nucleus attracts electrons in a chemical bond, used together with valence electron count to predict whether a bond will be covalent, ionic, or metallic.

**Example:** Chlorine's high electronegativity and sodium's low electronegativity together favor complete electron transfer, producing the ionic bond in NaCl.

See also: [Valence Electron](#valence-electron), [Ionic Bond](#ionic-bond).

#### Electrostatic Potential Energy

The potential energy stored in a configuration of two charges held at a fixed separation, equal to one charge's magnitude times the electric potential created by the other.

**Example:** Moving two like charges closer together increases their electrostatic potential energy.

See also: [Electric Potential](#electric-potential), [Coulomb's Law](#coulombs-law).

#### Elemental Semiconductor

A semiconductor built from a single chemical element repeated throughout the crystal.

**Example:** Silicon and germanium are both elemental semiconductors, each bonded only to atoms of its own species.

See also: [Compound Semiconductor](#compound-semiconductor), [Silicon](#silicon), [Germanium](#germanium).

#### Energy Band

A continuous range of allowed electron energies produced by band formation in a periodic potential.

**Example:** The Kronig-Penney model produces a sequence of energy bands of increasing width as energy increases, separated by narrowing band gaps.

See also: [Allowed Energy States](#allowed-energy-states), [Band Gap](#band-gap), [Band Formation](#band-formation).

#### Excess Carriers

Carrier concentrations above their equilibrium values, \(\Delta n=n-n_0\) and \(\Delta p=p-p_0\), created by carrier generation.

**Example:** Excess electrons and excess holes are always created in equal numbers by generation alone, so \(\Delta n=\Delta p\) whenever generation is the sole disturbance.

See also: [Carrier Generation](#carrier-generation), [Carrier Recombination](#carrier-recombination).

#### Exponentials and Logarithms

A pair of inverse mathematical functions, \(e^x\) and \(\ln x\), used to describe quantities that grow, decay, or accumulate multiplicatively rather than additively.

**Example:** Carrier concentration in a semiconductor depends exponentially on energy divided by thermal energy, \(k_BT\).

#### Extrinsic Semiconductor

A semiconductor deliberately doped with donor or acceptor atoms, whose carrier population is dominated by the dopant rather than by thermal generation alone.

**Example:** Silicon doped with phosphorus at \(10^{16}\ \text{cm}^{-3}\) has roughly a million times more carriers than pure (intrinsic) silicon at room temperature.

See also: [Intrinsic Semiconductor](#intrinsic-semiconductor), [Donor Atom](#donor-atom), [Acceptor Atom](#acceptor-atom).

#### Extrinsic Temperature Region

The moderate-temperature range in which dopant atoms are essentially fully ionized but intrinsic thermal generation is still negligible, so carrier concentration levels off at approximately the doping concentration.

**Example:** Most semiconductor devices are designed to operate within the extrinsic temperature region, where carrier concentration is stable and set by design rather than by small temperature fluctuations.

See also: [Freeze-Out Regime](#freeze-out-regime), [Intrinsic Temperature Region](#intrinsic-temperature-region).

#### Face-Centered Cubic

A cubic crystal structure with atoms at the 8 corners and at the center of each of the 6 faces of the conventional cell, giving 4 atoms per cell, coordination number 12, and packing fraction \(\sqrt2\pi/6\approx0.740\), the highest of the three cubic Bravais lattices.

**Example:** The touching condition for FCC, \(4r=\sqrt2\,a\), comes from atoms touching along the face diagonal.

See also: [Simple Cubic Structure](#simple-cubic-structure), [Body-Centered Cubic](#body-centered-cubic), [Packing Fraction](#packing-fraction).

#### Fermi Energy

The zero-temperature value of the Fermi level, equal to the energy of the highest occupied electron state.

**Example:** In a metal at \(T=0\), every state below the Fermi energy is completely filled and every state above it is completely empty.

See also: [Fermi Level](#fermi-level).

#### Fermi Function

The specific mathematical formula \(f(E)=1/[1+e^{(E-E_F)/k_BT}]\) giving the probability that a state of energy \(E\) is occupied, used computationally to derive carrier concentration.

**Example:** Substituting the Boltzmann approximation for the Fermi function in the conduction-band integral produces the effective-density-of-states result for \(n_0\).

See also: [Fermi-Dirac Distribution](#fermi-dirac-distribution).

#### Fermi Level

The parameter \(E_F\) in the Fermi-Dirac distribution \(f(E)=1/[1+\exp((E-E_F)/k_BT)]\) at any temperature, equal to the energy at which the occupation probability is exactly \(1/2\).

**Example:** In an intrinsic semiconductor, the Fermi level sits inside the band gap — where the density of states is zero — even though no electron actually has that exact energy.

See also: [Fermi Energy](#fermi-energy), [Density of States](#density-of-states).

#### Fermi Level Position

The exact energy location of the Fermi level, computed from a known carrier concentration via \(E_C-E_F=k_BT\ln(N_C/n_0)\).

**Example:** Heavier n-type doping raises \(n_0\), which shrinks \(E_C-E_F\), moving the Fermi level closer to the conduction band edge.

See also: [Intrinsic Fermi Level](#intrinsic-fermi-level).

#### Fermi-Dirac Distribution

The general statistical law governing how fermions (including electrons, which obey the Pauli exclusion principle) populate available energy states in thermal equilibrium.

**Example:** The Fermi-Dirac distribution's specific formula, the Fermi function, was introduced graphically in Chapter 6 and used quantitatively in Chapter 9.

See also: [Fermi Function](#fermi-function).

#### Fick's Law

The law stating that diffusion current density is directly proportional to the concentration gradient, \(J_{n,\text{diff}}=qD_n(dn/dx)\).

**Example:** Fick's law explains why carriers injected at one edge of a semiconductor region spread toward areas of lower concentration, exactly like ink diffusing in water.

See also: [Concentration Gradient](#concentration-gradient), [Diffusion Coefficient](#diffusion-coefficient).

#### Flat-Band Voltage

The gate voltage \(V_{FB}=\Phi_M-\Phi_S\) at which a MOS capacitor's semiconductor bands show no bending at all, the zero-reference point for surface potential.

**Example:** Because \(\Phi_M\) and \(\Phi_S\) rarely match exactly, most MOS capacitors have a nonzero (often negative) flat-band voltage even before accounting for any fixed oxide charge.

See also: [Surface Potential](#surface-potential), [MOS Capacitor](#mos-capacitor).

#### Float-Zone Refining

A crystal growth method that passes a narrow molten zone along a silicon rod without crucible contact, producing extremely pure but typically smaller-diameter single-crystal ingots.

**Example:** Float-zone silicon's crucible-free growth avoids the trace contamination Czochralski growth introduces, making it the material of choice for power devices and radiation detectors.

See also: [Czochralski Crystal Growth](#czochralski-crystal-growth).

#### Forbidden Energy Gap

An alternate name for a band gap, emphasizing that no electron states exist within this energy range.

**Example:** The forbidden energy gap between the valence and conduction bands is the single most important number in determining whether a material behaves as an insulator, semiconductor, or conductor.

See also: [Band Gap](#band-gap).

#### Force

A push or pull that, if unopposed, changes an object's velocity; related to mass and acceleration by Newton's second law, \(\vec{F}=m\vec{a}\).

**Example:** An electric field exerts a force on a charged carrier equal to the charge times the field, \(\vec{F}=q\vec{E}\).

#### Forward Bias

An applied voltage, positive on the p-side relative to the n-side, that subtracts from the built-in potential, lowering the junction barrier to \(V_{bi}-V\) and sharply increasing diffusion current.

**Example:** Under forward bias, the depletion width narrows and injected minority carrier concentration at the depletion edge can exceed its equilibrium value by many orders of magnitude.

See also: [Reverse Bias](#reverse-bias), [Minority Carrier Injection](#minority-carrier-injection).

#### Free Electron

A conduction-band electron free to move through the crystal and contribute to current.

**Example:** A donor atom's ionized fifth electron becomes a free electron in the conduction band.

See also: [Hole](#hole), [Electron-Hole Pair](#electron-hole-pair).

#### Freeze-Out Regime

The low-temperature range in which most dopant atoms have not yet ionized, so carrier concentration is well below the doping concentration and rises steeply as temperature increases.

**Example:** A donor-doped silicon sample cooled to 77 K shows significant freeze-out if the donor's ionization energy is much larger than \(k_BT\) at that temperature.

See also: [Dopant Ionization](#dopant-ionization), [Extrinsic Temperature Region](#extrinsic-temperature-region).

#### Fundamental Physical Constants

Fixed numerical quantities, such as the elementary charge, the permittivity of free space, and Planck's constant, that appear throughout the equations of physics and do not vary between experiments.

See also: [SI Units](#si-units), [Boltzmann Constant](#boltzmann-constant).

#### Gallium Arsenide

A III-V compound semiconductor (GaAs) with a direct band gap of about 1.42 eV at room temperature and high electron mobility, widely used in LEDs, laser diodes, and high-frequency RF electronics.

**Example:** GaAs's direct band gap allows efficient photon-only light emission, unlike silicon's indirect gap.

See also: [Compound Semiconductor](#compound-semiconductor), [Direct Bandgap](#direct-bandgap).

#### Gate Oxide

The thin insulating layer, typically silicon dioxide, separating a MOS capacitor's gate from its semiconductor substrate.

**Example:** The gate oxide blocks essentially all DC current between gate and substrate while still transmitting the electric field, letting the gate control the surface electrostatically.

See also: [MOS Capacitor](#mos-capacitor), [Oxide Capacitance](#oxide-capacitance).

#### Gauss's Law

A law of electrostatics stating that the total electric flux through any closed surface is proportional to the total electric charge enclosed by that surface.

**Example:** Gauss's Law lets the electric field inside a uniformly charged depletion region be computed without directly integrating Coulomb's Law.

See also: [Electric Flux](#electric-flux), [Divergence](#divergence).

#### Germanium

An elemental semiconductor (Ge) with an indirect band gap of about 0.66 eV at room temperature, historically the material of the first practical transistors (1947).

**Example:** Germanium's higher carrier mobility than silicon's is offset by its much lower melting point (938°C), which limits its thermal processing budget.

See also: [Elemental Semiconductor](#elemental-semiconductor), [Silicon](#silicon).

#### Gradient

A vector-calculus operator that converts a scalar field into a vector field pointing in the direction of the scalar field's steepest increase.

**Example:** The electric field is the negative gradient of the electric potential, \(\vec{E}=-\nabla V\).

See also: [Divergence](#divergence), [Curl](#curl).

#### Grain Boundary

The thin, disordered boundary region separating two differently-oriented single-crystal grains within a polycrystalline solid.

**Example:** In polycrystalline silicon ("polysilicon"), grain boundaries scatter charge carriers and degrade electronic performance relative to single-crystal silicon.

See also: [Polycrystalline Solid](#polycrystalline-solid).

#### Hall Coefficient

The proportionality constant \(R_H\) relating Hall voltage to current and field, equal to \(1/(qp)\) for holes or \(-1/(qn)\) for electrons; its sign directly identifies majority carrier type.

**Example:** A positive measured Hall coefficient (using the standard sign convention) indicates a p-type sample; a negative one indicates n-type.

See also: [Hall Effect](#hall-effect), [Hall Voltage](#hall-voltage).

#### Hall Effect

The sideways deflection of moving carriers by the Lorentz force in a magnetic field, building up a measurable transverse voltage across a current-carrying bar.

**Example:** The Hall effect is one of the only direct experimental probes of carrier type and concentration, independent of any assumptions about doping.

See also: [Hall Coefficient](#hall-coefficient), [Hall Voltage](#hall-voltage).

#### Hall Voltage

The steady transverse voltage, \(V_H=R_HIB/t\), that develops across a current-carrying bar in a perpendicular magnetic field once magnetic deflection and the resulting transverse electric field balance.

**Example:** Reversing the magnetic field direction flips the sign of the Hall voltage for a given carrier type, a useful experimental check.

See also: [Hall Effect](#hall-effect), [Hall Coefficient](#hall-coefficient).

#### Heisenberg Uncertainty Principle

A fundamental limit stating that the uncertainties in a particle's position and momentum cannot both be made arbitrarily small at the same time, expressed as \(\Delta x\,\Delta p \geq \hbar/2\).

**Example:** Confining an electron to a region the size of an atom forces a minimum momentum uncertainty corresponding to a velocity of roughly \(6\times10^5\) m/s.

See also: [Wavefunction](#wavefunction).

Contrast with: [de Broglie Wavelength](#de-broglie-wavelength), which assigns a definite wavelength to a particle rather than describing a fundamental limit on simultaneous knowledge.

#### High-Level Injection

The injection regime in which excess carrier concentration is comparable to or exceeds the doping concentration, \(\Delta n\gtrsim N\), significantly perturbing both carrier populations.

**Example:** High-level injection requires more careful treatment than the simpler low-level injection equations, relevant in heavily-illuminated solar cells.

See also: [Low-Level Injection](#low-level-injection), [Carrier Injection](#carrier-injection).

#### Hole

The vacancy left behind in the valence band by a missing electron, behaving as a mobile positive charge carrier with its own effective mass.

**Example:** An acceptor atom's incomplete bond creates a hole in the valence band once ionized.

See also: [Free Electron](#free-electron), [Electron-Hole Pair](#electron-hole-pair).

#### Hole Concentration

The exact equilibrium hole concentration, \(p_0=\big[(N_A-N_D)+\sqrt{(N_A-N_D)^2+4n_i^2}\big]/2\), the mirror image of the electron concentration equation.

**Example:** For heavily p-type-doped silicon, this formula reduces to the familiar \(p_0\approx N_A\).

See also: [Electron Concentration](#electron-concentration).

#### Ideal Diode Equation

The equation \(I=I_0(e^{V/V_T}-1)\) giving diode current as a function of applied voltage, derived by combining the law of the junction with the saturation current.

**Example:** At forward voltages a few \(V_T\) above zero, the ideal diode equation predicts current rising exponentially, doubling roughly every \(V_T\ln2\approx18\ \text{mV}\).

See also: [Saturation Current](#saturation-current), [Junction I-V Characteristic](#junction-i-v-characteristic).

#### Impurity Scattering

Scattering of a carrier by the Coulomb field of an ionized donor or acceptor atom, worse at low temperature (slow carriers are deflected more) and high doping (more impurities present).

**Example:** Impurity scattering typically dominates mobility at low temperature or very heavy doping, following approximately \(\mu_I\propto T^{3/2}/N\).

See also: [Lattice Scattering](#lattice-scattering), [Scattering Mechanism](#scattering-mechanism).

#### Indirect Bandgap

A band structure in which the conduction-band minimum and valence-band maximum occur at different crystal momenta \(k\).

**Example:** Silicon is an indirect-gap material; a band-edge transition requires a phonon to supply the crystal-momentum difference \(\Delta k\) in addition to a photon, making silicon a much weaker light emitter than a direct-gap material.

See also: [Direct Bandgap](#direct-bandgap), [E-K Diagram](#e-k-diagram).

#### Indirect Recombination

Band-to-band recombination in an indirect-gap material, where the conduction band minimum and valence band maximum sit at different crystal momenta, requiring a phonon to conserve momentum.

**Example:** Indirect recombination's inherent inefficiency in silicon (an indirect-gap material) is why silicon is a poor light emitter.

See also: [Direct Recombination](#direct-recombination), [Trap-Assisted Recombination](#trap-assisted-recombination).

#### Insulator Band Structure

A band structure with a completely full valence band and completely empty conduction band at absolute zero, separated by a large band gap (roughly greater than 4 eV) that prevents significant thermal excitation of carriers.

**Example:** Diamond, with a band gap of about 5.5 eV, is classified as an insulator under this definition.

See also: [Semiconductor Band Structure](#semiconductor-band-structure), [Metal Band Structure](#metal-band-structure).

#### Integration

The mathematical operation, inverse to differentiation, that computes the accumulated total of a continuously varying quantity or the area under a curve.

**Example:** Integrating the electric field along a path from infinity to a point gives the electric potential at that point.

See also: [Differentiation](#differentiation).

#### Intrinsic Carrier Concentration

The carrier concentration \(n_i=\sqrt{N_CN_V}\,e^{-E_g/2k_BT}\) in a pure semiconductor, where \(n_0=p_0=n_i\), and the anchor value for the mass action law.

**Example:** Silicon's \(n_i\approx9.65\times10^9\ \text{cm}^{-3}\) at 300 K; GaAs's much larger band gap gives it an \(n_i\) roughly four orders of magnitude smaller.

See also: [Mass Action Law](#mass-action-law), [Effective Density of States](#effective-density-of-states).

#### Intrinsic Fermi Level

The Fermi level position \(E_i\) that results when a material is purely intrinsic (\(n_0=p_0=n_i\)), given by \(E_i=(E_C+E_V)/2+(k_BT/2)\ln(N_V/N_C)\), close to but not exactly at the middle of the band gap.

**Example:** Silicon's \(E_i\) sits about 13 meV below exact midgap at 300 K, since silicon's \(N_C\) exceeds its \(N_V\).

See also: [Fermi Level Position](#fermi-level-position), [Carrier Concentration Equation](#carrier-concentration-equation).

#### Intrinsic Semiconductor

A chemically pure semiconductor whose only carriers come from thermally-broken covalent bonds, each producing one free electron and one hole together.

**Example:** Pure silicon's intrinsic carrier concentration at room temperature is only about \(n_i\approx10^{10}\ \text{cm}^{-3}\), tiny compared to its atomic density of \(5\times10^{22}\ \text{cm}^{-3}\).

See also: [Extrinsic Semiconductor](#extrinsic-semiconductor).

#### Intrinsic Temperature Region

The high-temperature range in which thermally-generated intrinsic carriers exceed the fixed doping concentration, so the material behaves as if intrinsic regardless of its doping.

**Example:** Because intrinsic carrier concentration grows exponentially with temperature, every doped semiconductor eventually enters the intrinsic temperature region if heated enough.

See also: [Extrinsic Temperature Region](#extrinsic-temperature-region), [Intrinsic Semiconductor](#intrinsic-semiconductor).

#### Inversion Layer

The thin layer of minority carriers that forms at a MOS capacitor's semiconductor surface once strong inversion is reached, serving as the conducting channel of a MOSFET.

**Example:** In an n-channel MOSFET, the inversion layer consists of mobile electrons at the surface of a p-type substrate, formed once \(\psi_s\) reaches \(2\phi_F\).

See also: [Strong Inversion](#strong-inversion), [Threshold Voltage](#threshold-voltage).

#### Ion Implantation

A doping technique that accelerates dopant ions through an electric field and fires them directly into the wafer, producing a Gaussian concentration profile centered at a projected range set by ion energy.

**Example:** A phosphorus implant with projected range \(R_p=0.15\ \mu\text{m}\) and straggle \(\Delta R_p=0.05\ \mu\text{m}\) has its concentration fall by more than two orders of magnitude between its peak and the wafer surface.

See also: [Diffusion Doping](#diffusion-doping), [Annealing](#annealing).

#### Ionic Bond

A chemical bond formed when one atom transfers one or more valence electrons completely to another, producing oppositely charged ions held together by Coulomb attraction; non-directional.

**Example:** Sodium transfers its single valence electron to chlorine, forming \(\text{Na}^+\) and \(\text{Cl}^-\) ions bound by \(U(r) = -e^2/(4\pi\varepsilon_0 r)\).

See also: [Valence Electron](#valence-electron), [Electronegativity](#electronegativity).

Contrast with: [Covalent Bond](#covalent-bond), which shares electrons rather than transferring them.

#### Ionization Energy

The energy required to ionize a donor or acceptor atom, well modeled by the hydrogenic model and typically tens of meV in silicon and germanium.

**Example:** A dopant with a larger ionization energy requires a higher temperature before its ionization fraction becomes significant.

See also: [Dopant Ionization](#dopant-ionization).

#### Junction Capacitance

The voltage-dependent capacitance \(C_j=\varepsilon A/W\) of a p-n junction's depletion region, arising from its geometry as an insulating gap of width \(W\) between two conductive neutral regions.

**Example:** Because reverse bias widens \(W\), it lowers \(C_j\) — the operating principle of a varactor diode used as a voltage-tunable capacitor.

See also: [Depletion Width](#depletion-width), [P-N Junction](#p-n-junction).

#### Junction Electric Field

The internal electric field \(E(x)\) created by exposed depletion-region charge, following a triangular profile that peaks at the metallurgical junction and vanishes at the depletion edges.

**Example:** The junction electric field points from the n-side toward the p-side, opposing further carrier diffusion until drift and diffusion currents balance at equilibrium.

See also: [Depletion Charge Density](#depletion-charge-density), [Poisson's Equation](#poissons-equation).

#### Junction I-V Characteristic

The complete current-voltage relationship of a p-n junction, combining the ideal diode equation's forward exponential rise and reverse saturation current with reverse breakdown at large reverse bias.

**Example:** The junction I-V characteristic's exponential forward rise and roughly-constant forward voltage drop is the basis of the familiar "0.7 V diode drop" approximation used in circuit analysis.

See also: [Ideal Diode Equation](#ideal-diode-equation), [Reverse Breakdown](#reverse-breakdown).

#### Kinetic Theory of Gases

A model that treats a gas as a large collection of particles in constant random motion, whose average kinetic energy depends only on absolute temperature.

**Example:** Doubling a gas's absolute temperature increases the average kinetic energy of its particles proportionally.

See also: [Boltzmann Constant](#boltzmann-constant), [Thermal Equilibrium](#thermal-equilibrium).

#### Kronig-Penney Model

An idealized, exactly solvable periodic potential — an infinite array of finite rectangular barriers — used to demonstrate band formation explicitly via a transcendental equation relating energy to the Bloch wavevector.

**Example:** The Kronig-Penney transcendental equation, \(P\sin(\alpha a)/(\alpha a)+\cos(\alpha a)=\cos(ka)\), has no real solution for \(k\) whenever its left-hand side falls outside \([-1,1]\), directly producing band gaps.

See also: [Bloch Theorem](#bloch-theorem), [Periodic Potential](#periodic-potential), [Band Formation](#band-formation).

#### Lattice Constant

The edge length \(a\) of the conventional cubic unit cell, setting the fundamental length scale of a crystal.

**Example:** Silicon has lattice constant \(a=0.543\) nm; gallium arsenide has \(a=0.565\) nm.

See also: [Unit Cell](#unit-cell), [Crystal Lattice](#crystal-lattice).

#### Lattice Scattering

Scattering of a carrier by the thermally-vibrating atoms of the crystal lattice, worse at high temperature.

**Example:** Lattice scattering typically dominates mobility at room temperature and above in lightly-doped material, following approximately \(\mu_L\propto T^{-3/2}\).

See also: [Impurity Scattering](#impurity-scattering), [Scattering Mechanism](#scattering-mechanism).

#### Light-Emitting Diode

A forward-biased p-n junction, built from a direct-gap material, that converts injected current into emitted light via radiative recombination.

**Example:** An LED's emission wavelength is set by its material's band gap, \(\lambda\approx1240/E_g(\text{eV})\ \text{nm}\), which is why different compound semiconductors are chosen to produce different colors.

See also: [Radiative Recombination](#radiative-recombination), [Photodiode](#photodiode).

#### Long-Base Diode

A diode geometry in which the quasi-neutral region is much longer than the minority carrier diffusion length, giving an exponentially-decaying injected carrier profile.

**Example:** Discrete diodes with thick substrates are typically long-base, in contrast to the short-base diodes common in integrated circuits.

See also: [Short-Base Diode](#short-base-diode), [Minority Carrier Injection](#minority-carrier-injection).

#### Low-Level Injection

The injection regime in which excess carrier concentration is much smaller than the doping concentration, \(\Delta n\ll N\), leaving the majority carrier concentration essentially unperturbed.

**Example:** Nearly all of the simple device equations used in later chapters assume low-level injection.

See also: [High-Level Injection](#high-level-injection), [Carrier Injection](#carrier-injection).

#### Manufacturing Defects

Unavoidable atomic-scale imperfections — stray particles, misalignments, dislocations, incomplete etches — that occur statistically during fabrication at modern feature sizes.

**Example:** A single stray particle landing during lithography can misprint an entire die's pattern, directly reducing manufacturing yield.

See also: [Yield and Reliability](#yield-and-reliability).

#### Mask Alignment

The precise positional registration of a lithographic mask to the pattern already present on the wafer from previous process layers.

**Example:** As depth of focus shrinks with increasing numerical aperture, mask alignment tolerance must tighten correspondingly, since misaligned layers no longer connect correctly to one another.

See also: [Photolithography](#photolithography), [UV Exposure and Resolution](#uv-exposure-and-resolution).

#### Mass Action Law

The relationship \(n_0p_0=n_i^2\), true at thermal equilibrium in any non-degenerate semiconductor regardless of doping, since the Fermi level cancels when the electron and hole concentration formulas are multiplied together.

**Example:** Heavy n-type doping that raises \(n_0\) far above \(n_i\) forces the minority hole concentration \(p_0\) correspondingly far below \(n_i\), keeping the product fixed.

See also: [Intrinsic Carrier Concentration](#intrinsic-carrier-concentration), [Charge Neutrality Condition](#charge-neutrality-condition).

#### Mechanical Energy

The combined kinetic and potential energy of an object due to its motion and position, conserved in an isolated system with no external forces.

**Example:** A charged particle accelerating through an electric field converts electrostatic potential energy into kinetic energy.

#### Metal Band Structure

A band structure in which the Fermi level lies inside a partially-filled band, or in which the valence and conduction bands overlap in energy so that electrons partially occupy both.

**Example:** Magnesium conducts well despite having two valence electrons per atom (which naive electron counting would fill exactly one band) because its bands overlap in energy, leaving the Fermi level inside a partially-filled band.

See also: [Insulator Band Structure](#insulator-band-structure), [Semimetal](#semimetal).

#### Metal-Semiconductor Junction

A junction formed wherever a metal is brought into intimate contact with a semiconductor, behaving as either a rectifying Schottky barrier or a low-resistance ohmic contact.

**Example:** Every bond pad, gate electrode, and wire contact in a real semiconductor device is a metal-semiconductor junction.

See also: [Schottky Barrier](#schottky-barrier), [Ohmic Contact](#ohmic-contact).

#### Metallic Bond

A chemical bond in which the valence electrons of every atom in a crystal delocalize into a shared, mobile "electron sea" surrounding fixed positive ion cores; non-directional and responsible for metals' electrical conductivity and malleability.

**Example:** Copper's single, loosely-bound valence electron delocalizes readily, producing an electron sea that explains copper's high conductivity and malleability.

See also: [Valence Electron](#valence-electron).

Contrast with: [Covalent Bond](#covalent-bond) and [Ionic Bond](#ionic-bond), in which electrons remain localized to a specific bond or ion rather than delocalizing across the whole crystal.

#### Metallization and Interconnects

The deposition and patterning of metal layers that form ohmic contacts to source, drain, and gate regions and route electrical signals across a chip.

**Example:** Modern high-performance chips stack ten or more metal interconnect layers, each requiring its own deposition, lithography, and etch cycle.

See also: [CMOS Process Integration](#cmos-process-integration).

#### Metallurgical Junction

The geometric plane, conventionally at \(x=0\), where the net doping concentration of a semiconductor crystal switches from p-type to n-type.

**Example:** Away from the metallurgical junction, each side of the crystal behaves like the uniformly-doped semiconductors analyzed in earlier chapters.

See also: [P-N Junction](#p-n-junction), [Depletion Region](#depletion-region).

#### Miller Indices

A set of three integers \((hkl)\), used to label a crystal plane, found by taking the reciprocals of the plane's axis intercepts (in units of the lattice constant) and clearing fractions to the smallest integers.

**Example:** A plane intercepting all three axes at \(1a\) has Miller indices \((111)\); a plane parallel to the \(z\) axis intercepting \(x\) and \(y\) at \(1a\) has Miller indices \((110)\).

See also: [Crystal Plane](#crystal-plane).

#### Minority Carrier Injection

The process by which forward bias drives majority carriers across the junction, where they become injected minority carriers in the neutral region on the far side, with a boundary concentration set by the law of the junction.

**Example:** Minority carrier injection under forward bias is the direct analog of the excess-carrier generation studied in Chapter 13, except carriers are injected by crossing the junction rather than created by photon absorption.

See also: [Forward Bias](#forward-bias), [Long-Base Diode](#long-base-diode).

#### Minority Carrier Lifetime

The exponential decay time constant \(\tau\) of excess carriers after generation stops, \(\Delta n(t)=\Delta n(0)e^{-t/\tau}\).

**Example:** A longer minority carrier lifetime means excess carriers persist longer before recombining, generally desirable in solar cells and bipolar transistors.

See also: [Recombination Rate](#recombination-rate), [Carrier Recombination](#carrier-recombination).

#### Mobility Temperature Dependence

The variation of mobility with temperature via Matthiessen's rule, combining lattice scattering (\(\mu_L\propto T^{-3/2}\)) and impurity scattering (\(\mu_I\propto T^{3/2}/N\)).

**Example:** Since \(D=\mu k_BT/q\), the diffusion coefficient inherits mobility's temperature dependence, in addition to the direct \(T\) factor from \(k_BT\).

See also: [Lattice Scattering](#lattice-scattering), [Impurity Scattering](#impurity-scattering), [Einstein Relation](#einstein-relation).

#### MOS Capacitor

A layered structure stacking a conductive gate, an insulating gate oxide, and a semiconductor substrate, used to electrostatically control the semiconductor surface.

**Example:** The MOS capacitor is the structure at the heart of every MOSFET, with its gate voltage determining whether the channel underneath is off, partially on, or fully on.

See also: [Gate Oxide](#gate-oxide), [Semiconductor Surface](#semiconductor-surface).

#### MOSFET Basics

The operating principle of a MOSFET: gate voltage exceeding threshold voltage forms an inversion-layer channel (Chapter 16) connecting source and drain, giving voltage-controlled drain current \(I_D=(\mu_nC_{ox}/2)(W/L)(V_{GS}-V_T)^2\) in saturation.

**Example:** Unlike a bipolar transistor, a MOSFET draws essentially no steady-state gate current, since the gate is separated from the channel by an insulating oxide.

See also: [Bipolar Transistor Basics](#bipolar-transistor-basics), [Threshold Voltage](#threshold-voltage).

#### N-Type Doping

Doping a semiconductor predominantly with donor atoms, making free electrons the majority carrier and holes the minority carrier.

**Example:** Silicon doped with phosphorus is n-type, with majority electron concentration approximately equal to the phosphorus concentration in the extrinsic region.

See also: [P-Type Doping](#p-type-doping), [Donor Atom](#donor-atom).

#### Nondegenerate Semiconductor

A semiconductor in which the Fermi level sits far enough inside the band gap that the Boltzmann approximation is valid throughout the band of interest.

**Example:** All the exact carrier-concentration and Fermi-level-position equations in Chapter 10 assume a nondegenerate semiconductor; Chapter 8's degenerate semiconductors require the full Fermi-Dirac integral instead.

See also: [Boltzmann Approximation](#boltzmann-approximation).

#### Normalization

The requirement that the total probability of finding a particle somewhere in space equals exactly 1, expressed as \(\int_{-\infty}^{\infty}|\psi(x)|^2\,dx = 1\).

**Example:** Normalizing \(\psi(x)=A\sin(\pi x/L)\) on \(0<x<L\) determines the constant \(A=\sqrt{2/L}\).

See also: [Probability Density](#probability-density), [Wavefunction](#wavefunction).

#### Ohmic Contact

A low-resistance metal-semiconductor connection with essentially symmetric, linear current-voltage behavior, engineered to avoid rectification.

**Example:** Ohmic contacts are most reliably achieved in practice by doping the semiconductor extremely heavily right at the contact, so carriers can tunnel through the thin barrier regardless of the metal used.

See also: [Rectifying Contact](#rectifying-contact), [Metal-Semiconductor Junction](#metal-semiconductor-junction).

#### Optical Absorption

The macroscopic decay of light intensity with depth into a semiconductor, resulting from many individual photon absorption events, described by the Beer-Lambert law \(I(x)=I_0e^{-\alpha x}\).

**Example:** A material's optical absorption strength, and hence how thick a solar cell absorber layer must be, is set entirely by its absorption coefficient.

See also: [Absorption Coefficient](#absorption-coefficient), [Photon Absorption](#photon-absorption).

#### Optical Generation

Carrier generation by photon absorption, in which a photon with energy at or above the band gap excites an electron across the gap.

**Example:** Optical generation is the mechanism behind solar cells and photodetectors.

See also: [Carrier Generation](#carrier-generation), [Thermal Generation](#thermal-generation).

#### Oxide Capacitance

The gate oxide's capacitance per unit area, \(C_{ox}=\varepsilon_{ox}/t_{ox}\), converting charge stored at the semiconductor surface into a voltage across the oxide.

**Example:** Thinner gate oxides give larger \(C_{ox}\), which reduces the depletion-charge contribution to threshold voltage — a key driver of decades of transistor oxide scaling.

See also: [Gate Oxide](#gate-oxide), [Threshold Voltage](#threshold-voltage).

#### P-N Junction

A semiconductor structure formed by joining a p-type region and an n-type region within a single continuous crystal.

**Example:** The p-n junction is the foundational building block of the diode, and is embedded inside nearly every transistor, solar cell, and LED covered in later chapters.

See also: [Metallurgical Junction](#metallurgical-junction), [Built-In Potential](#built-in-potential).

#### P-Type Doping

Doping a semiconductor predominantly with acceptor atoms, making holes the majority carrier and free electrons the minority carrier.

**Example:** Silicon doped with boron is p-type, with majority hole concentration approximately equal to the boron concentration in the extrinsic region.

See also: [N-Type Doping](#n-type-doping), [Acceptor Atom](#acceptor-atom).

#### Packing Fraction

The fraction of a unit cell's volume actually occupied by atoms, treating each atom as a hard sphere whose radius is set by the structure's geometric touching condition.

**Example:** Simple cubic has packing fraction \(\pi/6\approx0.524\); face-centered cubic has the highest packing fraction of the cubic structures, \(\sqrt2\pi/6\approx0.740\).

See also: [Simple Cubic Structure](#simple-cubic-structure), [Body-Centered Cubic](#body-centered-cubic), [Face-Centered Cubic](#face-centered-cubic).

#### Partial Derivatives

The rate of change of a function of several variables with respect to one variable, computed while holding all other variables constant.

**Example:** For \(V(x,y,z)=x^2y\), the partial derivative \(\partial V/\partial x = 2xy\) treats \(y\) as fixed.

See also: [Gradient](#gradient), [Differentiation](#differentiation).

#### Particle in a Box

An idealized quantum system in which a particle is confined between two infinitely high potential walls; the simplest system for which the Schrödinger equation can be solved exactly.

**Example:** An electron confined to a 1 nm box has a ground-state energy of about 0.376 eV.

See also: [Potential Well](#potential-well), [Boundary Conditions](#boundary-conditions), [Eigenvalue](#eigenvalue).

#### Periodic Potential

A potential energy function that repeats with the same spatial period as the crystal lattice, \(V(x+a)=V(x)\).

**Example:** The electrostatic potential an electron experiences from every atomic core in a crystal is periodic because the crystal lattice itself is periodic.

See also: [Bloch Theorem](#bloch-theorem), [Crystal Lattice](#crystal-lattice).

#### Photoconductivity

The increase in a semiconductor's conductivity under illumination, \(\Delta\sigma=q(\Delta n\mu_n+\Delta p\mu_p)\), resulting from photogenerated excess carriers.

**Example:** A photoconductor is simply a semiconductor slab with ohmic contacts; its resistance change under illumination directly measures light intensity.

See also: [Photon Absorption](#photon-absorption), [Carrier Mobility](#carrier-mobility).

#### Photodiode

A p-n junction used to sense light, in which absorbed photons create carriers that are swept apart by the junction field to produce a photocurrent.

**Example:** A photodiode is typically operated under reverse bias to widen the depletion region and improve collection efficiency and response speed.

See also: [Solar Cell](#solar-cell), [Photon Absorption](#photon-absorption).

#### Photolithography

The process of transferring a two-dimensional geometric pattern from a mask onto a wafer using a light-sensitive photoresist and controlled exposure.

**Example:** An ArF immersion system with \(\lambda=193\ \text{nm}\), \(NA=1.35\), and \(k_1=0.3\) resolves a minimum feature size of about 42.9 nm.

See also: [Photoresist](#photoresist), [UV Exposure and Resolution](#uv-exposure-and-resolution), [Mask Alignment](#mask-alignment).

#### Photon Absorption

The microscopic event in which a photon with energy \(h\nu\geq E_g\) excites an electron from the valence band to the conduction band, creating an electron-hole pair.

**Example:** Photon absorption is the same fundamental process introduced as "optical generation" in Chapter 13, now examined as the source of the macroscopic optical absorption and photoconductivity effects.

See also: [Optical Absorption](#optical-absorption), [Absorption Coefficient](#absorption-coefficient).

#### Photon Energy

The energy carried by a single discrete packet of electromagnetic radiation, directly proportional to the radiation's frequency.

**Example:** A photon of red light (650 nm) carries about 1.9 eV of energy.

#### Photoresist

A light-sensitive polymer film coated onto a wafer that chemically changes solubility where it absorbs light, forming the pattern that develops into a lithographic stencil.

**Example:** Positive and negative photoresist produce exactly inverted patterns from an identical mask, since positive resist dissolves where exposed while negative resist dissolves where unexposed.

See also: [Photolithography](#photolithography), [UV Exposure and Resolution](#uv-exposure-and-resolution).

#### Plasma Etching

A dry etching technique in which an electric field ionizes a process gas into reactive ions and radicals that are accelerated toward the wafer, combining chemical reactivity with strong directionality.

**Example:** A plasma etch with vertical rate 200 nm/min and lateral rate 10 nm/min has an anisotropy factor of 0.95, indicating a highly directional, near-vertical profile.

See also: [Dry Etching](#dry-etching), [Wet Etching](#wet-etching).

#### Poisson's Equation

The electrostatic relation \(dE/dx=\rho(x)/\varepsilon\) linking the derivative of electric field to local charge density.

**Example:** Applying Poisson's equation to the depletion approximation's charge density yields the triangular junction electric field profile.

See also: [Depletion Charge Density](#depletion-charge-density), [Junction Electric Field](#junction-electric-field).

#### Polycrystalline Solid

A solid composed of many small single-crystal regions, called grains, each internally periodic but oriented at a different angle relative to its neighbors, separated by grain boundaries.

**Example:** Polycrystalline silicon ("polysilicon") is widely used for gate electrodes and interconnects in integrated-circuit fabrication.

See also: [Grain Boundary](#grain-boundary), [Amorphous Solid](#amorphous-solid).

Contrast with: [Amorphous Solid](#amorphous-solid), which lacks long-range order even within small regions, and a single crystal, which has no grain boundaries at all.

#### Potential Well

A region of space where the potential energy is lower than in the surrounding region, tending to confine a particle; may have infinitely high walls (an idealized box) or finite walls (a realistic well).

**Example:** A finite potential well allows the wavefunction to decay smoothly into the classically forbidden region outside the well, unlike the idealized particle-in-a-box.

See also: [Particle in a Box](#particle-in-a-box), [Quantum Tunneling](#quantum-tunneling).

#### Power Diode

A p-n junction engineered with a lightly-doped drift region specifically to block high reverse voltage while conducting large forward current.

**Example:** A power diode rated for 500 V requires roughly ten times lighter drift doping than a typical low-voltage signal diode, trading forward-conduction efficiency for blocking-voltage capability.

See also: [Rectifier Circuit](#rectifier-circuit), [Device Design Trade-Offs](#device-design-trade-offs).

#### Primitive Cell

The smallest possible unit cell, containing exactly one lattice point (counting shared points by the fraction actually inside the cell).

**Example:** For a simple cubic lattice, the conventional unit cell and the primitive cell coincide, but for body-centered and face-centered cubic lattices the true primitive cell is smaller and non-cubic.

See also: [Unit Cell](#unit-cell), [Crystal Lattice](#crystal-lattice).

#### Probability Density

The squared magnitude of the wavefunction, \(|\psi(x)|^2\), giving the probability per unit length of finding a particle near position \(x\).

**Example:** For the ground state of a particle in a box, \(|\psi_1(x)|^2\) is largest at the center of the box and zero at the walls.

See also: [Wavefunction](#wavefunction), [Normalization](#normalization).

#### Quantum Number

An integer label (such as \(n\) in \(\psi_n(x)\) and \(E_n\)) that distinguishes the different allowed eigenstates and eigenvalues of a bound quantum system.

**Example:** The particle-in-a-box quantum number \(n=1,2,3,\ldots\) determines both the number of nodes in \(\psi_n(x)\) and the energy \(E_n\).

See also: [Eigenstate](#eigenstate), [Eigenvalue](#eigenvalue).

#### Quantum Tunneling

The phenomenon in which a particle has a nonzero probability of being found on the far side of a potential barrier even when its energy is less than the barrier height.

**Example:** An electron with energy 0.5 eV incident on a 1 nm barrier of height 1.0 eV has a tunneling transmission probability of roughly 0.07%.

See also: [Potential Well](#potential-well), [Transmission Coefficient](#transmission-coefficient).

#### Quasi-Fermi Level

One of two separate energy levels, \(E_{Fn}\) for electrons and \(E_{Fp}\) for holes, describing carrier occupation statistics under non-equilibrium conditions where a single Fermi level no longer applies.

**Example:** The splitting \(E_{Fn}-E_{Fp}\) between the two quasi-Fermi levels under illumination sets the open-circuit voltage of a solar cell.

See also: [Excess Carriers](#excess-carriers), [Carrier Injection](#carrier-injection).

#### Radiative Recombination

Recombination in which the released energy is emitted as a photon rather than heat, efficient in direct-gap materials.

**Example:** Radiative recombination is the same process as Chapter 13's direct recombination, viewed here as a useful light-emission mechanism rather than a loss channel.

See also: [Light-Emitting Diode](#light-emitting-diode), [Direct Recombination](#direct-recombination).

#### Reciprocal Lattice

A lattice constructed in k-space (momentum space) from a real-space lattice, via the condition \(\vec a_i\cdot\vec b_j=2\pi\delta_{ij}\); generally distinct in geometry from the real-space lattice.

**Example:** The reciprocal lattice of a simple cubic lattice with constant \(a\) is itself simple cubic with constant \(2\pi/a\), while the reciprocal lattice of FCC is BCC.

See also: [Brillouin Zone](#brillouin-zone), [Bloch Theorem](#bloch-theorem).

#### Recombination Rate

The number of carriers recombining per unit volume per unit time, \(R=\Delta n/\tau\) for a single dominant mechanism at low injection.

**Example:** At steady state, generation rate and recombination rate balance, \(G=R\), directly giving the steady-state excess concentration \(\Delta n_{ss}=G\tau\).

See also: [Minority Carrier Lifetime](#minority-carrier-lifetime), [Carrier Recombination](#carrier-recombination).

#### Rectifier Circuit

A circuit arrangement of one or more diodes that converts alternating current into direct current.

**Example:** A full-wave bridge rectifier conducts on both half-cycles of an AC input, giving roughly double the average DC output of a half-wave rectifier for the same input amplitude.

See also: [Power Diode](#power-diode).

#### Rectifying Contact

A metal-semiconductor junction that impedes current flow in one direction, behaving like a diode, formed when a Schottky barrier is present.

**Example:** Whether a given metal-semiconductor pairing forms a rectifying or ohmic contact depends on comparing work functions, and the deciding rule flips between n-type and p-type material.

See also: [Ohmic Contact](#ohmic-contact), [Schottky Barrier](#schottky-barrier).

#### Resistivity

The reciprocal of conductivity, \(\rho=1/\sigma\), with units of \(\Omega\cdot\text{cm}\), commonly measured directly on a doped wafer using a four-point probe.

**Example:** A lightly-doped silicon wafer has much higher resistivity than a heavily-doped one, even though both are the same base material.

See also: [Conductivity](#conductivity), [Sheet Resistance](#sheet-resistance).

#### Reverse Bias

An applied voltage, negative on the p-side relative to the n-side, that adds to the built-in potential, raising the junction barrier to \(V_{bi}+V\) and suppressing diffusion to a small drift-limited current.

**Example:** Under reverse bias, the depletion width widens and current saturates at the small, nearly voltage-independent value \(-I_0\).

See also: [Forward Bias](#forward-bias), [Saturation Current](#saturation-current).

#### Reverse Breakdown

The dramatic increase in reverse current beyond a critical reverse voltage \(V_{BR}\), occurring via avalanche or Zener mechanisms.

**Example:** Practical circuits using reverse breakdown deliberately (voltage-reference diodes) must limit current with a series resistor to avoid exceeding the diode's power rating.

See also: [Avalanche Breakdown](#avalanche-breakdown), [Zener Breakdown](#zener-breakdown).

#### Saturation Current

The small, nearly fixed reverse current \(I_0\) (or current density \(J_0\)) that a p-n junction approaches under reverse bias, set by the injected minority carrier profile's gradient at the depletion edge.

**Example:** Because \(J_0\propto n_i^2\), saturation current is extremely temperature-sensitive, roughly doubling for every 8-10°C rise in silicon.

See also: [Ideal Diode Equation](#ideal-diode-equation), [Long-Base Diode](#long-base-diode).

#### Scattering Mechanism

Any collision process that randomizes a carrier's direction of motion, ultimately limiting mobility.

**Example:** Lattice scattering and impurity scattering are the two dominant scattering mechanisms in a doped semiconductor, combined via Matthiessen's rule.

See also: [Lattice Scattering](#lattice-scattering), [Impurity Scattering](#impurity-scattering).

#### Schottky Barrier

The rectifying depletion region that forms at a metal-semiconductor junction when the work-function alignment (for the given doping type) produces a barrier to carrier flow.

**Example:** A Schottky barrier's depletion width and peak field follow the same one-sided-junction formulas as a p-n junction, treating the metal as an infinitely-doped "other side."

See also: [Barrier Height](#barrier-height), [Schottky Diode](#schottky-diode).

#### Schottky Diode

A two-terminal rectifying device built from a Schottky barrier, conducting via thermionic emission of majority carriers over the barrier rather than minority-carrier diffusion.

**Example:** Schottky diodes typically turn on at a much lower forward voltage (0.2-0.3 V) than silicon p-n diodes (0.6-0.7 V), and switch faster since there is no minority-carrier storage to remove.

See also: [Schottky Barrier](#schottky-barrier), [Barrier Height](#barrier-height).

#### Schrodinger Equation

The fundamental equation of motion of non-relativistic quantum mechanics; in its time-independent form, \(-\frac{\hbar^2}{2m}\frac{d^2\psi}{dx^2}+V(x)\psi=E\psi\), it determines the allowed wavefunctions and energies of a particle in a given potential.

**Example:** Solving the Schrodinger equation for the infinite square well yields the particle-in-a-box eigenstates and eigenvalues.

See also: [Wavefunction](#wavefunction), [Eigenstate](#eigenstate), [Eigenvalue](#eigenvalue).

#### Semiconductor Band Structure

A band structure identical in kind to an insulator's — a completely full valence band and completely empty conduction band at absolute zero — but with a small enough band gap (roughly 0.1 to 3 eV) that a technologically significant number of carriers are thermally excited across it at room temperature.

**Example:** Silicon (\(E_g\approx1.12\) eV) and GaAs (\(E_g\approx1.42\) eV) are both classified as semiconductors under this definition.

See also: [Insulator Band Structure](#insulator-band-structure), [Fermi Level](#fermi-level).

#### Semiconductor Device Modeling

A simplified, closed-form mathematical description of device behavior, built from physical first principles under a specific set of idealizing assumptions.

**Example:** Every equation derived throughout this course — the ideal diode equation, threshold voltage, the Beer-Lambert law — is an example of semiconductor device modeling.

See also: [Device Simulation Concept](#device-simulation-concept), [Band Diagram Construction](#band-diagram-construction).

#### Semiconductor Manufacturing Overview

The framing of the entire fabrication process as a repeating cycle: grow or deposit a layer, pattern it with photolithography, selectively modify or remove material through the pattern, and repeat.

**Example:** A modern CMOS chip requires several hundred individual process steps, nearly all of which are instances of this same repeating cycle applied to a different layer, material, or pattern.

See also: [CMOS Process Integration](#cmos-process-integration).

#### Semiconductor Surface

The region of a semiconductor directly beneath a MOS capacitor's gate oxide, whose electrostatic state (accumulation, depletion, or inversion) is controlled by gate voltage.

**Example:** Because no current flows through the gate oxide, the semiconductor surface's condition is set entirely by electrostatics, exactly like the plates of a capacitor.

See also: [MOS Capacitor](#mos-capacitor), [Surface Potential](#surface-potential).

#### Semimetal

A band structure in which the valence and conduction bands touch or slightly overlap in energy, but with very little density of states at the point of overlap, giving a much lower carrier density than a true metal.

**Example:** Bismuth and graphite are classified as semimetals: they conduct at all temperatures, unlike an insulator, but far more weakly than a true metal.

See also: [Metal Band Structure](#metal-band-structure), [Density of States](#density-of-states).

#### Sheet Resistance

The thin-film form of resistivity, \(R_s=\rho/t\) (units \(\Omega/\square\)), letting a rectangular film's resistance be computed as \(R=R_s\times(L/W)\), the number of unit squares the film forms.

**Example:** Doubling both a resistor's length and width leaves its resistance unchanged, since the number of squares (L/W) is unaffected.

See also: [Resistivity](#resistivity).

#### Shockley-Read-Hall Recombination

The quantitative theory of trap-assisted recombination, showing that traps located near midgap are the most effective recombination centers.

**Example:** Shockley-Read-Hall recombination is the standard model for recombination in silicon devices, where indirect band-to-band recombination is too inefficient to dominate.

See also: [Trap-Assisted Recombination](#trap-assisted-recombination), [Indirect Recombination](#indirect-recombination).

#### Short-Base Diode

A diode geometry in which the quasi-neutral region is much shorter than the minority carrier diffusion length, giving a linear injected carrier profile forced to zero at the nearby ohmic contact.

**Example:** Short-base diodes give a larger saturation current than an equivalent long-base diode, since the same concentration drop occurs over a shorter distance, producing a steeper gradient.

See also: [Long-Base Diode](#long-base-diode), [Saturation Current](#saturation-current).

#### SI Units

The Système International system of standardized physical units, including the meter, kilogram, second, and ampere, used to express all quantities in this course.

See also: [Fundamental Physical Constants](#fundamental-physical-constants).

#### Silicon

An elemental semiconductor (Si) with an indirect band gap of about 1.12 eV at room temperature, the dominant material in digital integrated circuits due to its low cost, high melting point, and excellent native oxide (SiO\(_2\)).

**Example:** Silicon's diamond-cubic crystal structure, introduced in Chapter 3, gives every atom 4 tetrahedrally-arranged covalent bonds.

See also: [Elemental Semiconductor](#elemental-semiconductor), [Germanium](#germanium).

#### Silicon Atom Structure

The electron configuration of a neutral silicon atom (atomic number 14), \(1s^2\,2s^2\,2p^6\,3s^2\,3p^2\), consisting of 10 chemically inert core electrons and 4 valence electrons.

**Example:** Silicon's group-14 position in the periodic table directly reflects its 4 valence electrons, the same count germanium (also group 14) shares.

See also: [Valence Electron](#valence-electron).

#### Simple Cubic Structure

A cubic crystal structure with atoms only at the 8 corners of the conventional cell, giving 1 atom per cell, coordination number 6, and packing fraction \(\pi/6\approx0.524\), the lowest of the three cubic Bravais lattices.

**Example:** The touching condition for SC, \(2r=a\), comes from atoms touching directly along the cube edge.

See also: [Body-Centered Cubic](#body-centered-cubic), [Face-Centered Cubic](#face-centered-cubic), [Packing Fraction](#packing-fraction).

#### Solar Cell

A p-n junction operated near zero or forward bias, without an external power source, to convert absorbed light directly into electrical power.

**Example:** A solar cell's performance is summarized by its short-circuit current \(I_{sc}=I_L\) and open-circuit voltage \(V_{oc}=V_T\ln(I_L/I_0+1)\).

See also: [Photodiode](#photodiode), [Photon Absorption](#photon-absorption).

#### sp3 Hybridization

The quantum-mechanical combination of one \(s\) orbital and three \(p\) orbitals into four new, equivalent hybrid orbitals that point toward the corners of a regular tetrahedron.

**Example:** Silicon's \(3s\) and three \(3p\) valence orbitals hybridize into 4 sp3 orbitals, each forming one covalent bond, producing the tetrahedral bond angle of \(109.5°\).

See also: [Tetrahedral Bonding](#tetrahedral-bonding), [Valence Electron](#valence-electron).

#### Steady-State Carrier Profile

The spatial distribution of excess carrier concentration once transients have died out, typically an exponentially decaying profile, \(\Delta p(x)=\Delta p(0)e^{-x/L_p}\), for carriers injected at a boundary.

**Example:** The steady-state carrier profile in a p-n junction's quasi-neutral region directly determines the diode current in a biased junction.

See also: [Diffusion Length](#diffusion-length), [Continuity Equation](#continuity-equation).

#### Strong Inversion

The MOS surface regime, occurring when \(\psi_s\geq2\phi_F\), in which the surface minority-carrier concentration reaches the bulk majority-carrier concentration, forming a conducting inversion layer.

**Example:** Strong inversion, \(\psi_s=2\phi_F\), is the defining condition used to derive the threshold voltage.

See also: [Weak Inversion](#weak-inversion), [Inversion Layer](#inversion-layer).

#### Surface Potential

The band bending \(\psi_s\) at a MOS capacitor's semiconductor surface, measured relative to the bulk, with \(\psi_s=0\) defined at flat-band.

**Example:** Surface potential increases (for a p-type substrate) as gate voltage sweeps positive, moving the surface through depletion and eventually inversion.

See also: [Flat-Band Voltage](#flat-band-voltage), [Depletion Mode](#depletion-mode).

#### Tetrahedral Bonding

The bonding geometry in which an atom's four covalent bonds point toward the corners of a regular tetrahedron, at a bond angle of \(109.5°\), produced by sp3 hybridization.

**Example:** Silicon's tetrahedral bonding directly produces the diamond lattice structure's coordination number of 4.

See also: [sp3 Hybridization](#sp3-hybridization), [Diamond Lattice Structure](#diamond-lattice-structure).

#### Thermal Conductivity

The material property \(\kappa\) governing how efficiently heat is conducted through a semiconductor, dominated by phonon transport rather than free carriers.

**Example:** Silicon's thermal conductivity of about \(150\ \text{W/(m·K)}\) makes it a reasonably good heat spreader, though power devices still require careful thermal design.

See also: [Thermal Generation Rate](#thermal-generation-rate).

#### Thermal Equilibrium

A state in which a system has a single, well-defined temperature throughout and experiences no net exchange of energy with its surroundings.

**Example:** A semiconductor crystal left undisturbed at room temperature, with no applied voltage or light, reaches thermal equilibrium.

See also: [Kinetic Theory of Gases](#kinetic-theory-of-gases).

#### Thermal Generation

Carrier generation by random thermal fluctuations alone, the same process responsible for equilibrium carrier concentrations \(n_0\) and \(p_0\).

**Example:** Under illumination or bias, optical or electrical generation typically dwarfs the thermal contribution, driving concentrations well above equilibrium.

See also: [Carrier Generation](#carrier-generation), [Optical Generation](#optical-generation).

#### Thermal Generation Rate

The rate per unit volume, \(G_{th}=n_i/\tau_0\), at which thermal fluctuations alone create electron-hole pairs.

**Example:** Inside a depletion region, thermal generation rate produces a real leakage current \(I_{gen}=qG_{th}WA\) in addition to the ideal diffusion-based saturation current of Chapter 15.

See also: [Thermal Generation](#thermal-generation), [Thermal Conductivity](#thermal-conductivity).

#### Thermal Oxidation

The growth of a silicon dioxide layer directly from a heated silicon wafer's surface, following the Deal-Grove linear-parabolic growth law.

**Example:** At \(B=0.045\ \mu\text{m}^2/\text{hr}\) in the parabolic regime, 4 hours of oxidation grows an oxide roughly 0.424 μm thick.

See also: [Photolithography](#photolithography).

#### Thin-Film Deposition

The addition of new material layers onto a wafer surface, typically by chemical vapor deposition (CVD), physical vapor deposition (PVD), or atomic layer deposition (ALD).

**Example:** Atomic layer deposition's sequential, self-limiting surface reactions give it the best sidewall conformality of the three methods, at the cost of much slower deposition rates.

See also: [Metallization and Interconnects](#metallization-and-interconnects).

#### Threshold Voltage

The gate voltage \(V_T=V_{FB}+2\phi_F+Q_{dep,max}/C_{ox}\) at which a MOS capacitor's surface reaches strong inversion, defining a MOSFET's on/off switching point.

**Example:** Real fabrication processes tune gate material, substrate doping, and oxide thickness — plus a dedicated threshold-adjustment implant — to land \(V_T\) at a specific target value.

See also: [Strong Inversion](#strong-inversion), [Oxide Capacitance](#oxide-capacitance).

#### Total Current Density

The sum of drift and diffusion current density at a point in a semiconductor, \(J=J_{\text{drift}}+J_{\text{diffusion}}\), the master transport equation used throughout the device chapters.

**Example:** Inside a p-n junction's depletion region at equilibrium, drift and diffusion current densities are equal and opposite, so the total current density is zero.

See also: [Fick's Law](#ficks-law), [Drift Current](#drift-current).

#### Transmission Coefficient

The fraction of incident particles (or incident wave intensity) that pass through a potential barrier, approximated for a rectangular barrier by \(T\approx e^{-2\kappa L}\) with \(\kappa = \sqrt{2m(V_0-E)}/\hbar\).

**Example:** Doubling a barrier's width roughly squares its (small) transmission coefficient, an exponential sensitivity exploited by the scanning tunneling microscope.

See also: [Quantum Tunneling](#quantum-tunneling).

#### Trap-Assisted Recombination

Recombination mediated by defect or impurity energy levels within the forbidden gap, capturing an electron and a hole in two separate steps rather than one direct jump.

**Example:** Trap-assisted recombination usually dominates over direct band-to-band recombination in indirect-gap materials like silicon.

See also: [Shockley-Read-Hall Recombination](#shockley-read-hall-recombination), [Indirect Recombination](#indirect-recombination).

#### Trigonometry

The branch of mathematics describing the relationships between angles and the sides of triangles, used to model periodic and oscillatory phenomena.

**Example:** Sines and cosines describe the alternating voltage waveform in an AC circuit.

#### Unit Cell

A repeating volume that tiles all of space by simple translation to reproduce an entire crystal lattice; the conventional choice for a cubic crystal is a cube with edge length equal to the lattice constant.

**Example:** The conventional unit cell of face-centered cubic contains 4 atoms, even though its true primitive cell contains only 1 lattice point.

See also: [Primitive Cell](#primitive-cell), [Lattice Constant](#lattice-constant).

#### UV Exposure and Resolution

The controlled illumination of photoresist through a mask using ultraviolet light, with minimum resolvable feature size set by the Rayleigh criterion \(CD=k_1\lambda/NA\).

**Example:** Shrinking exposure wavelength and increasing numerical aperture are the two principal levers the semiconductor industry has used to shrink minimum feature size over decades of scaling.

See also: [Photolithography](#photolithography), [Photoresist](#photoresist).

#### Valence Band

The highest energy band that is completely filled with electrons at absolute zero.

**Example:** Electrons in the valence band, closest in energy to the band gap, are the ones that can be thermally or optically excited into the conduction band.

See also: [Conduction Band](#conduction-band), [Band Gap](#band-gap).

#### Valence Electron

An electron in an atom's outermost occupied shell, available for participation in chemical bonding; the count and behavior of these electrons determines which bonding type an atom prefers.

**Example:** Silicon has 4 valence electrons (from \(3s^2\,3p^2\)), the single number that determines its preference for covalent, tetrahedral bonding.

See also: [Silicon Atom Structure](#silicon-atom-structure), [Covalent Bond](#covalent-bond).

#### Varactor Diode

A p-n junction operated under reverse bias specifically to exploit its voltage-dependent junction capacitance as a tunable circuit element.

**Example:** A varactor diode's capacitance change with reverse bias directly tunes the resonant frequency of an LC tank in a voltage-controlled oscillator.

See also: [Power Diode](#power-diode), [Junction Capacitance](#junction-capacitance).

#### Vectors

Quantities possessing both magnitude and direction, in contrast to scalars, which have magnitude only; combined using operations such as the dot product.

**Example:** Electric field and force are vectors; electric potential and energy are scalars.

See also: [Gradient](#gradient).

#### Velocity Saturation

The leveling-off of drift velocity at high electric field, as increased carrier energy triggers more effective scattering, following \(v_d(E)=\mu E/\sqrt{1+(\mu E/v_{sat})^2}\).

**Example:** In a short-channel transistor, carriers can spend much of their transit time in the velocity-saturation regime, fundamentally limiting switching speed.

See also: [Carrier Mobility](#carrier-mobility), [Mobility Temperature Dependence](#mobility-temperature-dependence).

#### Wafer Slicing and Polishing

The process of cutting thin discs from a cylindrical crystal ingot and polishing them to an atomically flat, mirror-finish surface.

**Example:** A 1.5 m Czochralski ingot sliced into 775 μm wafers with a 150 μm saw kerf yields roughly 1600 wafers before accounting for the tapered seed and tail ends.

See also: [Czochralski Crystal Growth](#czochralski-crystal-growth), [Float-Zone Refining](#float-zone-refining).

#### Wave Packet

A localized wave formed by superposing many individual waves of different wavelengths (or momenta); the spatial width of a wave packet and the spread of momenta needed to build it are linked by the Heisenberg uncertainty principle.

**Example:** Narrowing a wave packet's spatial width to more precisely localize a particle requires combining a broader range of momenta, increasing \(\Delta p\).

See also: [Heisenberg Uncertainty Principle](#heisenberg-uncertainty-principle), [de Broglie Wavelength](#de-broglie-wavelength).

#### Wave-Particle Duality

The principle that both light and matter exhibit wave-like behavior (interference, diffraction) and particle-like behavior (discrete, localized quanta), depending on the experiment performed.

**Example:** The Davisson-Germer experiment showed electrons producing a diffraction pattern, direct evidence of their wave character.

See also: [de Broglie Wavelength](#de-broglie-wavelength).

#### Wavefunction

The complex-valued function \(\psi(x)\) that describes a particle's quantum state and evolves according to the Schrodinger equation; not itself directly observable, but the source of the observable probability density.

**Example:** A free particle's wavefunction is often written \(\psi(x)=Ae^{ikx}\), with wavevector \(k=2\pi/\lambda\) tied to the particle's de Broglie wavelength.

See also: [Probability Density](#probability-density), [Schrodinger Equation](#schrodinger-equation).

#### Weak Inversion

The MOS surface regime, occurring when \(\phi_F<\psi_s<2\phi_F\), in which minority-carrier concentration at the surface is growing rapidly but has not yet reached the bulk majority concentration.

**Example:** Weak inversion is responsible for subthreshold conduction in real MOSFETs, where the device is not yet fully "on" but is not perfectly off either.

See also: [Depletion Mode](#depletion-mode), [Strong Inversion](#strong-inversion).

#### Wet Etching

An etching technique using a liquid chemical reagent that dissolves the target material roughly equally in all directions, producing an inherently isotropic etch profile.

**Example:** Wet etching's isotropic undercut widens an etched feature well beyond the resist mask opening, limiting its use for the smallest modern feature sizes.

See also: [Dry Etching](#dry-etching), [Plasma Etching](#plasma-etching).

#### Work Function

The energy \(q\Phi\) required to remove an electron from a material's Fermi level to the vacuum level just outside its surface.

**Example:** Metal work functions vary widely by material (aluminum about 4.1 eV, gold about 5.1 eV), while a semiconductor's work function additionally depends on its doping.

See also: [Electron Affinity](#electron-affinity), [Barrier Height](#barrier-height).

#### Yield and Reliability

The fraction of manufactured chips that function correctly, and how long the functioning chips continue to work; yield falls exponentially with defect density and die area under the Poisson model \(Y=e^{-D_0A}\).

**Example:** At a defect density of \(0.5\ \text{defects/cm}^2\), quadrupling die area from \(0.5\ \text{cm}^2\) to \(2\ \text{cm}^2\) drops yield from 77.9% to 36.8%.

See also: [Manufacturing Defects](#manufacturing-defects).

#### Zener Breakdown

A reverse-breakdown mechanism in which valence electrons tunnel quantum-mechanically directly through a thin depletion-region barrier into the conduction band, with no collision involved.

**Example:** Zener breakdown dominates in heavily-doped junctions, typically at doping levels above roughly \(10^{17}\)-\(10^{18}\ \text{cm}^{-3}\) in silicon, where breakdown voltage is only a few volts.

See also: [Avalanche Breakdown](#avalanche-breakdown), [Reverse Breakdown](#reverse-breakdown).

#### Zincblende Structure

A crystal structure geometrically identical to the diamond lattice structure — two interpenetrating face-centered cubic sublattices offset by \((1/4,1/4,1/4)a\), 8 atoms per cell, tetrahedral coordination — but with two different atomic species occupying the two sublattices, which removes the inversion symmetry present in pure diamond.

**Example:** Gallium arsenide (GaAs) crystallizes in the zincblende structure, with gallium atoms on one sublattice and arsenic atoms on the other.

See also: [Diamond Lattice Structure](#diamond-lattice-structure).

Contrast with: [Diamond Lattice Structure](#diamond-lattice-structure), which uses a single atomic species on both sublattices and retains inversion symmetry.

</div>
