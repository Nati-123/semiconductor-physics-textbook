<div class="problems-styled" markdown>

# Chapter 5 Glossary

Terms introduced in [Chapter 5 — Quantum Mechanics of Periodic Crystals](index.md). See the [full site Glossary](../../glossary.md) for terms across all chapters.

#### Allowed Energy States

The specific, continuously-varying \((E,k)\) pairs that satisfy the periodic Schrödinger equation within an energy band.

**Example:** Within a single energy band, \(k\) can vary continuously, so allowed energy states form a dense, quasi-continuous range rather than the widely-separated discrete levels of an isolated atom.

See also: [Energy Band](#energy-band), [Band Formation](#band-formation).

#### Band Formation

The splitting of a free particle's continuous energy spectrum into alternating allowed energy bands and forbidden band gaps, caused by the periodicity of the crystal potential.

**Example:** In the Kronig-Penney model, band formation appears as soon as the barrier strength \(P>0\); at \(P=0\) (no periodicity) the spectrum is one continuous band with no gaps.

See also: [Energy Band](#energy-band), [Band Gap](#band-gap), [Kronig-Penney Model](#kronig-penney-model).

#### Band Gap

A range of energy, also called a forbidden energy gap, containing no allowed electron states, lying between two energy bands.

**Example:** In the Kronig-Penney model, band gaps occur wherever \(P\sin(\alpha a)/(\alpha a)+\cos(\alpha a)\) falls outside \([-1,1]\), and these gaps are centered on the Brillouin zone boundaries \(k=\pm n\pi/a\).

See also: [Forbidden Energy Gap](#forbidden-energy-gap), [Energy Band](#energy-band), [Brillouin Zone](#brillouin-zone).

#### Bloch Theorem

The theorem stating that any solution to the Schrödinger equation in a periodic potential must take the form \(\psi_k(x)=e^{ikx}u_k(x)\), where \(u_k(x)\) has the same periodicity as the lattice.

**Example:** Bloch's theorem introduces the Bloch wavevector \(k\) and the associated crystal momentum \(\hbar k\), used throughout this chapter and Chapter 6.

See also: [Periodic Potential](#periodic-potential), [Kronig-Penney Model](#kronig-penney-model).

#### Brillouin Zone

The primitive cell of the reciprocal lattice, constructed by the Wigner-Seitz procedure; the first Brillouin zone of a 1D chain with lattice constant \(a\) is the interval \(-\pi/a \leq k \leq \pi/a\).

**Example:** The Kronig-Penney model's band gaps open precisely at the first, second, and higher Brillouin zone boundaries, \(k=\pm n\pi/a\).

See also: [Reciprocal Lattice](#reciprocal-lattice), [Band Gap](#band-gap).

#### Conduction Band

The energy band immediately above the valence band, typically empty (or nearly so) of electrons at absolute zero.

**Example:** Whether a material conducts electricity well depends heavily on how easily electrons can be excited from the valence band into the conduction band across the band gap.

See also: [Valence Band](#valence-band), [Band Gap](#band-gap).

#### Energy Band

A continuous range of allowed electron energies produced by band formation in a periodic potential.

**Example:** The Kronig-Penney model produces a sequence of energy bands of increasing width as energy increases, separated by narrowing band gaps.

See also: [Allowed Energy States](#allowed-energy-states), [Band Gap](#band-gap), [Band Formation](#band-formation).

#### Forbidden Energy Gap

An alternate name for a band gap, emphasizing that no electron states exist within this energy range.

**Example:** The forbidden energy gap between the valence and conduction bands is the single most important number in determining whether a material behaves as an insulator, semiconductor, or conductor.

See also: [Band Gap](#band-gap).

#### Kronig-Penney Model

An idealized, exactly solvable periodic potential — an infinite array of finite rectangular barriers — used to demonstrate band formation explicitly via a transcendental equation relating energy to the Bloch wavevector.

**Example:** The Kronig-Penney transcendental equation, \(P\sin(\alpha a)/(\alpha a)+\cos(\alpha a)=\cos(ka)\), has no real solution for \(k\) whenever its left-hand side falls outside \([-1,1]\), directly producing band gaps.

See also: [Bloch Theorem](#bloch-theorem), [Periodic Potential](#periodic-potential), [Band Formation](#band-formation).

#### Periodic Potential

A potential energy function that repeats with the same spatial period as the crystal lattice, \(V(x+a)=V(x)\).

**Example:** The electrostatic potential an electron experiences from every atomic core in a crystal is periodic because the crystal lattice itself (Chapter 3) is periodic.

See also: [Bloch Theorem](#bloch-theorem), [Crystal Lattice](../03-crystal-lattices-structures/glossary.md#crystal-lattice).

#### Reciprocal Lattice

A lattice constructed in k-space (momentum space) from a real-space lattice, via the condition \(\vec a_i\cdot\vec b_j=2\pi\delta_{ij}\); generally distinct in geometry from the real-space lattice.

**Example:** The reciprocal lattice of a simple cubic lattice with constant \(a\) is itself simple cubic with constant \(2\pi/a\), while the reciprocal lattice of FCC is BCC.

See also: [Brillouin Zone](#brillouin-zone), [Bloch Theorem](#bloch-theorem).

#### Valence Band

The highest energy band that is completely filled with electrons at absolute zero.

**Example:** Electrons in the valence band, closest in energy to the band gap, are the ones that can be thermally or optically excited into the conduction band.

See also: [Conduction Band](#conduction-band), [Band Gap](#band-gap).

</div>
