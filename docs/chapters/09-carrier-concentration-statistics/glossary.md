<div class="problems-styled" markdown>

# Chapter 9 Glossary

Terms introduced in [Chapter 9 — Carrier Concentration Statistics](index.md). See the [full site Glossary](../../glossary.md) for terms across all chapters.

#### Charge Neutrality Condition

The requirement that a semiconductor crystal carry no net charge overall, expressed as \(n_0+N_A^-=p_0+N_D^+\), combined with the mass action law to solve exactly for carrier concentrations.

**Example:** In an n-type sample with negligible \(p_0\) and no acceptors, charge neutrality reduces to the familiar approximation \(n_0\approx N_D\).

See also: [Mass Action Law](#mass-action-law).

#### Density of States Function

The function \(g(E)\) counting allowed electron states per unit volume per unit energy, combined with the Fermi function and integrated to compute carrier concentration.

**Example:** The conduction-band density of states, \(g_c(E)\propto\sqrt{E-E_C}\), is the starting point for deriving the effective density of states \(N_C\).

See also: [Effective Density of States](#effective-density-of-states), [Fermi Function](#fermi-function).

#### Effective Density of States

A single constant, \(N_C\) (or \(N_V\)), that collapses the entire conduction- (or valence-) band density-of-states integral into one number, letting non-degenerate carrier concentration be written as \(n_0=N_Ce^{-(E_C-E_F)/k_BT}\).

**Example:** Silicon's \(N_C\approx2.8\times10^{19}\ \text{cm}^{-3}\) at 300 K, the same value used to define the degenerate-semiconductor criterion in Chapter 8.

See also: [Density of States Function](#density-of-states-function), [Intrinsic Carrier Concentration](#intrinsic-carrier-concentration).

#### Electron-Hole Pair

The free electron and hole created together by a single carrier-generation event, such as thermal bond-breaking or photon absorption.

**Example:** Every thermally-broken covalent bond in Chapter 7's intrinsic semiconductor discussion produces exactly one electron-hole pair.

See also: [Free Electron](#free-electron), [Hole](#hole).

#### Fermi Function

The specific mathematical formula \(f(E)=1/[1+e^{(E-E_F)/k_BT}]\) giving the probability that a state of energy \(E\) is occupied, used computationally to derive carrier concentration.

**Example:** Substituting the Boltzmann approximation for the Fermi function in the conduction-band integral produces the effective-density-of-states result for \(n_0\).

See also: [Fermi-Dirac Distribution](#fermi-dirac-distribution).

#### Fermi-Dirac Distribution

The general statistical law governing how fermions (including electrons, which obey the Pauli exclusion principle) populate available energy states in thermal equilibrium.

**Example:** The Fermi-Dirac distribution's specific formula, the Fermi function, was first introduced graphically in Chapter 6 and is used quantitatively throughout this chapter.

See also: [Fermi Function](#fermi-function).

#### Free Electron

A conduction-band electron free to move through the crystal and contribute to current.

**Example:** A donor atom's ionized fifth electron (Chapter 7) becomes a free electron in the conduction band.

See also: [Hole](#hole), [Electron-Hole Pair](#electron-hole-pair).

#### Hole

The vacancy left behind in the valence band by a missing electron, behaving as a mobile positive charge carrier with its own effective mass.

**Example:** An acceptor atom's incomplete bond (Chapter 7) creates a hole in the valence band once ionized.

See also: [Free Electron](#free-electron), [Electron-Hole Pair](#electron-hole-pair).

#### Intrinsic Carrier Concentration

The carrier concentration \(n_i=\sqrt{N_CN_V}\,e^{-E_g/2k_BT}\) in a pure semiconductor, where \(n_0=p_0=n_i\), and the anchor value for the mass action law.

**Example:** Silicon's \(n_i\approx9.65\times10^9\ \text{cm}^{-3}\) at 300 K; GaAs's much larger band gap gives it an \(n_i\) roughly four orders of magnitude smaller.

See also: [Mass Action Law](#mass-action-law), [Effective Density of States](#effective-density-of-states).

#### Mass Action Law

The relationship \(n_0p_0=n_i^2\), true at thermal equilibrium in any non-degenerate semiconductor regardless of doping, since the Fermi level cancels when the electron and hole concentration formulas are multiplied together.

**Example:** Heavy n-type doping that raises \(n_0\) far above \(n_i\) forces the minority hole concentration \(p_0\) correspondingly far below \(n_i\), keeping the product fixed.

See also: [Intrinsic Carrier Concentration](#intrinsic-carrier-concentration), [Charge Neutrality Condition](#charge-neutrality-condition).

</div>
