<div class="problems-styled" markdown>

# Glossary of Terms

This glossary currently covers the concepts introduced in [Chapter 1: Physics and Math Foundations](chapters/01-physics-math-foundations/index.md) and [Chapter 2: Quantum Mechanics Foundations](chapters/02-quantum-mechanics-foundations/index.md). Entries for later chapters will be added as those chapters are written.

#### Algebra

The branch of mathematics dealing with symbolic manipulation of equations, including solving for an unknown variable and working with exponents and ratios.

**Example:** Rearranging the diode current equation \(I = I_0(e^{V/V_T}-1)\) to solve for \(V\) is an algebra skill applied to a physical law.

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

#### Coulomb's Law

A physical law stating that the electrostatic force between two point charges is proportional to the product of their magnitudes and inversely proportional to the square of the distance separating them.

**Example:** Two charges separated by 1 nm exert a measurable attractive or repulsive force depending on whether their signs match.

See also: [Electric Field](#electric-field), [Electric Charge](#electric-charge).

#### Curl

A vector-calculus operator that measures the tendency of a vector field to circulate, or rotate, around a given point.

**Example:** The curl of a static electric field is always zero, which is why such fields can always be written as the gradient of a potential.

Contrast with: [Divergence](#divergence), [Gradient](#gradient).

#### de Broglie Wavelength

The wavelength associated with any particle of momentum \(p\), given by \(\lambda = h/p = h/(mv)\), extending wave behavior from light to all matter.

**Example:** An electron accelerated through 100 V has a de Broglie wavelength of about 0.123 nm, comparable to the spacing between atoms in a crystal.

See also: [Wave-Particle Duality](#wave-particle-duality), [Wavefunction](#wavefunction).

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

#### Electrostatic Potential Energy

The potential energy stored in a configuration of two charges held at a fixed separation, equal to one charge's magnitude times the electric potential created by the other.

**Example:** Moving two like charges closer together increases their electrostatic potential energy.

See also: [Electric Potential](#electric-potential), [Coulomb's Law](#coulombs-law).

#### Exponentials and Logarithms

A pair of inverse mathematical functions, \(e^x\) and \(\ln x\), used to describe quantities that grow, decay, or accumulate multiplicatively rather than additively.

**Example:** Carrier concentration in a semiconductor depends exponentially on energy divided by thermal energy, \(k_BT\).

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

#### Heisenberg Uncertainty Principle

A fundamental limit stating that the uncertainties in a particle's position and momentum cannot both be made arbitrarily small at the same time, expressed as \(\Delta x\,\Delta p \geq \hbar/2\).

**Example:** Confining an electron to a region the size of an atom forces a minimum momentum uncertainty corresponding to a velocity of roughly \(6\times10^5\) m/s.

See also: [Wavefunction](#wavefunction).

Contrast with: [de Broglie Wavelength](#de-broglie-wavelength), which assigns a definite wavelength to a particle rather than describing a fundamental limit on simultaneous knowledge.

#### Integration

The mathematical operation, inverse to differentiation, that computes the accumulated total of a continuously varying quantity or the area under a curve.

**Example:** Integrating the electric field along a path from infinity to a point gives the electric potential at that point.

See also: [Differentiation](#differentiation).

#### Kinetic Theory of Gases

A model that treats a gas as a large collection of particles in constant random motion, whose average kinetic energy depends only on absolute temperature.

**Example:** Doubling a gas's absolute temperature increases the average kinetic energy of its particles proportionally.

See also: [Boltzmann Constant](#boltzmann-constant), [Thermal Equilibrium](#thermal-equilibrium).

#### Mechanical Energy

The combined kinetic and potential energy of an object due to its motion and position, conserved in an isolated system with no external forces.

**Example:** A charged particle accelerating through an electric field converts electrostatic potential energy into kinetic energy.

#### Normalization

The requirement that the total probability of finding a particle somewhere in space equals exactly 1, expressed as \(\int_{-\infty}^{\infty}|\psi(x)|^2\,dx = 1\).

**Example:** Normalizing \(\psi(x)=A\sin(\pi x/L)\) on \(0<x<L\) determines the constant \(A=\sqrt{2/L}\).

See also: [Probability Density](#probability-density), [Wavefunction](#wavefunction).

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

#### Potential Well

A region of space where the potential energy is lower than in the surrounding region, tending to confine a particle; may have infinitely high walls (an idealized box) or finite walls (a realistic well).

**Example:** A finite potential well allows the wavefunction to decay smoothly into the classically forbidden region outside the well, unlike the idealized particle-in-a-box.

See also: [Particle in a Box](#particle-in-a-box), [Quantum Tunneling](#quantum-tunneling).

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

</div>
