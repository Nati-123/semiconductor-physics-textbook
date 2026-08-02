<div class="problems-styled" markdown>

# Glossary of Terms

This glossary currently covers the concepts introduced in [Chapter 1: Physics and Math Foundations](chapters/01-physics-math-foundations/index.md), [Chapter 2: Quantum Mechanics Foundations](chapters/02-quantum-mechanics-foundations/index.md), [Chapter 3: Crystal Lattices and Structures](chapters/03-crystal-lattices-structures/index.md), and [Chapter 4: Chemical Bonding in Semiconductor Crystals](chapters/04-chemical-bonding-crystals/index.md). Entries for later chapters will be added as those chapters are written.

#### Algebra

The branch of mathematics dealing with symbolic manipulation of equations, including solving for an unknown variable and working with exponents and ratios.

**Example:** Rearranging the diode current equation \(I = I_0(e^{V/V_T}-1)\) to solve for \(V\) is an algebra skill applied to a physical law.

#### Amorphous Solid

A solid in which atoms preserve roughly the same local bonding environment a crystal would prefer, but with no long-range periodic order extending beyond a few atomic spacings.

**Example:** Amorphous silicon (a-Si) preserves silicon's approximate 4-fold local coordination but lacks the long-range periodicity of single-crystal silicon, and is used in low-cost thin-film solar cells.

See also: [Polycrystalline Solid](#polycrystalline-solid), [Crystal Lattice](#crystal-lattice).

#### Basis

The atom, or small group of atoms, attached to every point of a crystal lattice to produce a crystal structure.

**Example:** The zincblende structure attaches a two-atom basis (one atom of each species, such as gallium and arsenic) to the underlying lattice geometry it shares with diamond.

See also: [Crystal Lattice](#crystal-lattice), [Diamond Lattice Structure](#diamond-lattice-structure).

#### Body-Centered Cubic

A cubic crystal structure with atoms at the 8 corners of the conventional cell plus one additional whole atom at the body center, giving 2 atoms per cell, coordination number 8, and packing fraction \(\sqrt3\pi/8\approx0.680\).

**Example:** The touching condition for BCC, \(4r=\sqrt3\,a\), comes from atoms touching along the cube's body diagonal.

See also: [Simple Cubic Structure](#simple-cubic-structure), [Face-Centered Cubic](#face-centered-cubic), [Coordination Number](#coordination-number).

#### Boltzmann Constant

A fundamental physical constant, \(k_B = 1.381\times10^{-23}\) J/K, that relates the absolute temperature of a system to the average thermal energy of its particles.

See also: [Kinetic Theory of Gases](#kinetic-theory-of-gases), [Thermal Equilibrium](#thermal-equilibrium).

#### Boundary Conditions

Constraints imposed on a wavefunction (or its derivative) at the edges of a spatial region, required for a solution of the Schrödinger equation to be physically acceptable.

**Example:** The particle-in-a-box conditions \(\psi(0)=\psi(L)=0\) force the wavefunction to vanish at the infinitely high walls, and this requirement alone forces the allowed energies to be quantized.

See also: [Eigenvalue](#eigenvalue), [Particle in a Box](#particle-in-a-box).

#### Complex Numbers

Numbers of the form \(a+bi\), with real part \(a\) and imaginary part \(b\) where \(i=\sqrt{-1}\), used to represent oscillations, phase, and quantum-mechanical wavefunctions.

**Example:** Euler's formula, \(e^{i\theta}=\cos\theta+i\sin\theta\), rewrites an oscillation as a complex exponential.

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

#### de Broglie Wavelength

The wavelength associated with any particle of momentum \(p\), given by \(\lambda = h/p = h/(mv)\), extending wave behavior from light to all matter.

**Example:** An electron accelerated through 100 V has a de Broglie wavelength of about 0.123 nm, comparable to the spacing between atoms in a crystal.

See also: [Wave-Particle Duality](#wave-particle-duality), [Wavefunction](#wavefunction).

#### Diamond Lattice Structure

A crystal structure formed from two interpenetrating face-centered cubic lattices offset by \((1/4,1/4,1/4)a\) along the body diagonal, giving 8 atoms per conventional cell and tetrahedral (4-fold) coordination.

**Example:** Silicon (\(a=0.543\) nm) and germanium (\(a=0.566\) nm) both crystallize in the diamond lattice structure, with nearest-neighbor distance \(d=\sqrt3\,a/4\).

See also: [Face-Centered Cubic](#face-centered-cubic), [Zincblende Structure](#zincblende-structure), [Coordination Number](#coordination-number).

Contrast with: [Zincblende Structure](#zincblende-structure), which shares the same geometry but places two different atomic species on the two sublattices.

#### Differentiation

The mathematical operation of finding the instantaneous rate of change of a function with respect to one of its variables.

**Example:** Differentiating position with respect to time gives velocity.

See also: [Partial Derivatives](#partial-derivatives), [Integration](#integration).

#### Divergence

A vector-calculus operator that measures the net outward flow of a vector field per unit volume at a point, indicating whether the point behaves as a source or a sink.

**Example:** The divergence of the electric field at a point is proportional to the local electric charge density there.

See also: [Gauss's Law](#gausss-law), [Curl](#curl).

#### Eigenstate

A specific wavefunction that solves the Schrödinger equation for a given potential while satisfying the system's boundary conditions; also called a stationary state.

**Example:** The particle-in-a-box eigenstates are \(\psi_n(x) = \sqrt{2/L}\sin(n\pi x/L)\), each labeled by a quantum number \(n\).

See also: [Eigenvalue](#eigenvalue), [Boundary Conditions](#boundary-conditions).

#### Eigenvalue

One of the discrete, allowed total energies of a bound quantum system, paired with its corresponding eigenstate.

**Example:** The particle-in-a-box eigenvalues are \(E_n = n^2h^2/(8mL^2)\), forming a discrete ladder of allowed energies rather than a continuum.

See also: [Eigenstate](#eigenstate), [Quantum Number](#quantum-number).

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

#### Electronegativity

A measure of how strongly an atom's nucleus attracts electrons in a chemical bond, used together with valence electron count to predict whether a bond will be covalent, ionic, or metallic.

**Example:** Chlorine's high electronegativity and sodium's low electronegativity together favor complete electron transfer, producing the ionic bond in NaCl.

See also: [Valence Electron](#valence-electron), [Ionic Bond](#ionic-bond).

#### Electrostatic Potential Energy

The potential energy stored in a configuration of two charges held at a fixed separation, equal to one charge's magnitude times the electric potential created by the other.

**Example:** Moving two like charges closer together increases their electrostatic potential energy.

See also: [Electric Potential](#electric-potential), [Coulomb's Law](#coulombs-law).

#### Exponentials and Logarithms

A pair of inverse mathematical functions, \(e^x\) and \(\ln x\), used to describe quantities that grow, decay, or accumulate multiplicatively rather than additively.

**Example:** Carrier concentration in a semiconductor depends exponentially on energy divided by thermal energy, \(k_BT\).

#### Face-Centered Cubic

A cubic crystal structure with atoms at the 8 corners and at the center of each of the 6 faces of the conventional cell, giving 4 atoms per cell, coordination number 12, and packing fraction \(\sqrt2\pi/6\approx0.740\), the highest of the three cubic Bravais lattices.

**Example:** The touching condition for FCC, \(4r=\sqrt2\,a\), comes from atoms touching along the face diagonal.

See also: [Simple Cubic Structure](#simple-cubic-structure), [Body-Centered Cubic](#body-centered-cubic), [Packing Fraction](#packing-fraction).

#### Force

A push or pull that, if unopposed, changes an object's velocity; related to mass and acceleration by Newton's second law, \(\vec{F}=m\vec{a}\).

**Example:** An electric field exerts a force on a charged carrier equal to the charge times the field, \(\vec{F}=q\vec{E}\).

#### Fundamental Physical Constants

Fixed numerical quantities, such as the elementary charge, the permittivity of free space, and Planck's constant, that appear throughout the equations of physics and do not vary between experiments.

See also: [SI Units](#si-units), [Boltzmann Constant](#boltzmann-constant).

#### Gauss's Law

A law of electrostatics stating that the total electric flux through any closed surface is proportional to the total electric charge enclosed by that surface.

**Example:** Gauss's Law lets the electric field inside a uniformly charged depletion region be computed without directly integrating Coulomb's Law.

See also: [Electric Flux](#electric-flux), [Divergence](#divergence).

#### Gradient

A vector-calculus operator that converts a scalar field into a vector field pointing in the direction of the scalar field's steepest increase.

**Example:** The electric field is the negative gradient of the electric potential, \(\vec{E}=-\nabla V\).

See also: [Divergence](#divergence), [Curl](#curl).

#### Grain Boundary

The thin, disordered boundary region separating two differently-oriented single-crystal grains within a polycrystalline solid.

**Example:** In polycrystalline silicon ("polysilicon"), grain boundaries scatter charge carriers and degrade electronic performance relative to single-crystal silicon.

See also: [Polycrystalline Solid](#polycrystalline-solid).

#### Heisenberg Uncertainty Principle

A fundamental limit stating that the uncertainties in a particle's position and momentum cannot both be made arbitrarily small at the same time, expressed as \(\Delta x\,\Delta p \geq \hbar/2\).

**Example:** Confining an electron to a region the size of an atom forces a minimum momentum uncertainty corresponding to a velocity of roughly \(6\times10^5\) m/s.

See also: [Wavefunction](#wavefunction).

Contrast with: [de Broglie Wavelength](#de-broglie-wavelength), which assigns a definite wavelength to a particle rather than describing a fundamental limit on simultaneous knowledge.

#### Integration

The mathematical operation, inverse to differentiation, that computes the accumulated total of a continuously varying quantity or the area under a curve.

**Example:** Integrating the electric field along a path from infinity to a point gives the electric potential at that point.

See also: [Differentiation](#differentiation).

#### Ionic Bond

A chemical bond formed when one atom transfers one or more valence electrons completely to another, producing oppositely charged ions held together by Coulomb attraction; non-directional.

**Example:** Sodium transfers its single valence electron to chlorine, forming \(\text{Na}^+\) and \(\text{Cl}^-\) ions bound by \(U(r) = -e^2/(4\pi\varepsilon_0 r)\).

See also: [Valence Electron](#valence-electron), [Electronegativity](#electronegativity).

Contrast with: [Covalent Bond](#covalent-bond), which shares electrons rather than transferring them.

#### Kinetic Theory of Gases

A model that treats a gas as a large collection of particles in constant random motion, whose average kinetic energy depends only on absolute temperature.

**Example:** Doubling a gas's absolute temperature increases the average kinetic energy of its particles proportionally.

See also: [Boltzmann Constant](#boltzmann-constant), [Thermal Equilibrium](#thermal-equilibrium).

#### Lattice Constant

The edge length \(a\) of the conventional cubic unit cell, setting the fundamental length scale of a crystal.

**Example:** Silicon has lattice constant \(a=0.543\) nm; gallium arsenide has \(a=0.565\) nm.

See also: [Unit Cell](#unit-cell), [Crystal Lattice](#crystal-lattice).

#### Mechanical Energy

The combined kinetic and potential energy of an object due to its motion and position, conserved in an isolated system with no external forces.

**Example:** A charged particle accelerating through an electric field converts electrostatic potential energy into kinetic energy.

#### Metallic Bond

A chemical bond in which the valence electrons of every atom in a crystal delocalize into a shared, mobile "electron sea" surrounding fixed positive ion cores; non-directional and responsible for metals' electrical conductivity and malleability.

**Example:** Copper's single, loosely-bound valence electron delocalizes readily, producing an electron sea that explains copper's high conductivity and malleability.

See also: [Valence Electron](#valence-electron).

Contrast with: [Covalent Bond](#covalent-bond) and [Ionic Bond](#ionic-bond), in which electrons remain localized to a specific bond or ion rather than delocalizing across the whole crystal.

#### Miller Indices

A set of three integers \((hkl)\), used to label a crystal plane, found by taking the reciprocals of the plane's axis intercepts (in units of the lattice constant) and clearing fractions to the smallest integers.

**Example:** A plane intercepting all three axes at \(1a\) has Miller indices \((111)\); a plane parallel to the \(z\) axis intercepting \(x\) and \(y\) at \(1a\) has Miller indices \((110)\).

See also: [Crystal Plane](#crystal-plane).

#### Normalization

The requirement that the total probability of finding a particle somewhere in space equals exactly 1, expressed as \(\int_{-\infty}^{\infty}|\psi(x)|^2\,dx = 1\).

**Example:** Normalizing \(\psi(x)=A\sin(\pi x/L)\) on \(0<x<L\) determines the constant \(A=\sqrt{2/L}\).

See also: [Probability Density](#probability-density), [Wavefunction](#wavefunction).

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

#### Photon Energy

The energy carried by a single discrete packet of electromagnetic radiation, directly proportional to the radiation's frequency.

**Example:** A photon of red light (650 nm) carries about 1.9 eV of energy.

#### Polycrystalline Solid

A solid composed of many small single-crystal regions, called grains, each internally periodic but oriented at a different angle relative to its neighbors, separated by grain boundaries.

**Example:** Polycrystalline silicon ("polysilicon") is widely used for gate electrodes and interconnects in integrated-circuit fabrication.

See also: [Grain Boundary](#grain-boundary), [Amorphous Solid](#amorphous-solid).

Contrast with: [Amorphous Solid](#amorphous-solid), which lacks long-range order even within small regions, and a single crystal, which has no grain boundaries at all.

#### Potential Well

A region of space where the potential energy is lower than in the surrounding region, tending to confine a particle; may have infinitely high walls (an idealized box) or finite walls (a realistic well).

**Example:** A finite potential well allows the wavefunction to decay smoothly into the classically forbidden region outside the well, unlike the idealized particle-in-a-box.

See also: [Particle in a Box](#particle-in-a-box), [Quantum Tunneling](#quantum-tunneling).

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

#### Schrodinger Equation

The fundamental equation of motion of non-relativistic quantum mechanics; in its time-independent form, \(-\frac{\hbar^2}{2m}\frac{d^2\psi}{dx^2}+V(x)\psi=E\psi\), it determines the allowed wavefunctions and energies of a particle in a given potential.

**Example:** Solving the Schrodinger equation for the infinite square well yields the particle-in-a-box eigenstates and eigenvalues.

See also: [Wavefunction](#wavefunction), [Eigenstate](#eigenstate), [Eigenvalue](#eigenvalue).

#### SI Units

The Système International system of standardized physical units, including the meter, kilogram, second, and ampere, used to express all quantities in this course.

See also: [Fundamental Physical Constants](#fundamental-physical-constants).

#### Silicon Atom Structure

The electron configuration of a neutral silicon atom (atomic number 14), \(1s^2\,2s^2\,2p^6\,3s^2\,3p^2\), consisting of 10 chemically inert core electrons and 4 valence electrons.

**Example:** Silicon's group-14 position in the periodic table directly reflects its 4 valence electrons, the same count germanium (also group 14) shares.

See also: [Valence Electron](#valence-electron).

#### Simple Cubic Structure

A cubic crystal structure with atoms only at the 8 corners of the conventional cell, giving 1 atom per cell, coordination number 6, and packing fraction \(\pi/6\approx0.524\), the lowest of the three cubic Bravais lattices.

**Example:** The touching condition for SC, \(2r=a\), comes from atoms touching directly along the cube edge.

See also: [Body-Centered Cubic](#body-centered-cubic), [Face-Centered Cubic](#face-centered-cubic), [Packing Fraction](#packing-fraction).

#### sp3 Hybridization

The quantum-mechanical combination of one \(s\) orbital and three \(p\) orbitals into four new, equivalent hybrid orbitals that point toward the corners of a regular tetrahedron.

**Example:** Silicon's \(3s\) and three \(3p\) valence orbitals hybridize into 4 sp3 orbitals, each forming one covalent bond, producing the tetrahedral bond angle of \(109.5°\).

See also: [Tetrahedral Bonding](#tetrahedral-bonding), [Valence Electron](#valence-electron).

#### Tetrahedral Bonding

The bonding geometry in which an atom's four covalent bonds point toward the corners of a regular tetrahedron, at a bond angle of \(109.5°\), produced by sp3 hybridization.

**Example:** Silicon's tetrahedral bonding directly produces the diamond lattice structure's coordination number of 4.

See also: [sp3 Hybridization](#sp3-hybridization), [Diamond Lattice Structure](#diamond-lattice-structure).

#### Thermal Equilibrium

A state in which a system has a single, well-defined temperature throughout and experiences no net exchange of energy with its surroundings.

**Example:** A semiconductor crystal left undisturbed at room temperature, with no applied voltage or light, reaches thermal equilibrium.

See also: [Kinetic Theory of Gases](#kinetic-theory-of-gases).

#### Transmission Coefficient

The fraction of incident particles (or incident wave intensity) that pass through a potential barrier, approximated for a rectangular barrier by \(T\approx e^{-2\kappa L}\) with \(\kappa = \sqrt{2m(V_0-E)}/\hbar\).

**Example:** Doubling a barrier's width roughly squares its (small) transmission coefficient, an exponential sensitivity exploited by the scanning tunneling microscope.

See also: [Quantum Tunneling](#quantum-tunneling).

#### Trigonometry

The branch of mathematics describing the relationships between angles and the sides of triangles, used to model periodic and oscillatory phenomena.

**Example:** Sines and cosines describe the alternating voltage waveform in an AC circuit.

#### Unit Cell

A repeating volume that tiles all of space by simple translation to reproduce an entire crystal lattice; the conventional choice for a cubic crystal is a cube with edge length equal to the lattice constant.

**Example:** The conventional unit cell of face-centered cubic contains 4 atoms, even though its true primitive cell contains only 1 lattice point.

See also: [Primitive Cell](#primitive-cell), [Lattice Constant](#lattice-constant).

#### Valence Electron

An electron in an atom's outermost occupied shell, available for participation in chemical bonding; the count and behavior of these electrons determines which bonding type an atom prefers.

**Example:** Silicon has 4 valence electrons (from \(3s^2\,3p^2\)), the single number that determines its preference for covalent, tetrahedral bonding.

See also: [Silicon Atom Structure](#silicon-atom-structure), [Covalent Bond](#covalent-bond).

#### Vectors

Quantities possessing both magnitude and direction, in contrast to scalars, which have magnitude only; combined using operations such as the dot product.

**Example:** Electric field and force are vectors; electric potential and energy are scalars.

See also: [Gradient](#gradient).

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

#### Zincblende Structure

A crystal structure geometrically identical to the diamond lattice structure — two interpenetrating face-centered cubic sublattices offset by \((1/4,1/4,1/4)a\), 8 atoms per cell, tetrahedral coordination — but with two different atomic species occupying the two sublattices, which removes the inversion symmetry present in pure diamond.

**Example:** Gallium arsenide (GaAs) crystallizes in the zincblende structure, with gallium atoms on one sublattice and arsenic atoms on the other.

See also: [Diamond Lattice Structure](#diamond-lattice-structure).

Contrast with: [Diamond Lattice Structure](#diamond-lattice-structure), which uses a single atomic species on both sublattices and retains inversion symmetry.

</div>
