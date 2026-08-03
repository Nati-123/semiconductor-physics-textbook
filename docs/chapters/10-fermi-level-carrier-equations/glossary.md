<div class="problems-styled" markdown>

# Chapter 10 Glossary

Terms introduced in [Chapter 10 — Fermi Level Position and Carrier Equations](index.md). See the [full site Glossary](../../glossary.md) for terms across all chapters.

#### Boltzmann Approximation

The approximation \(f(E)\approx e^{-(E-E_F)/k_BT}\), valid whenever \(E-E_F\gg k_BT\), that makes the carrier-concentration integral solvable in closed form.

**Example:** Every equation in this chapter — the exact carrier concentration formula, the Fermi level position formula — rests on this single approximation being valid.

See also: [Nondegenerate Semiconductor](#nondegenerate-semiconductor).

#### Carrier Concentration Equation

The final, most-used form of the electron and hole concentration equations, referenced to the intrinsic Fermi level: \(n_0=n_ie^{(E_F-E_i)/k_BT}\) and \(p_0=n_ie^{(E_i-E_F)/k_BT}\).

**Example:** The p-n junction chapters ahead compute built-in potential almost entirely in terms of how far \(E_F\) sits from \(E_i\) on each side of the junction, using this equation form.

See also: [Intrinsic Fermi Level](#intrinsic-fermi-level), [Electron Concentration](#electron-concentration).

#### Carrier Temperature Dependence

The behavior of carrier concentration as a function of temperature, explained by the exact electron concentration equation smoothly transitioning between the extrinsic and intrinsic limits as \(n_i(T)\) changes.

**Example:** At low-to-moderate temperature, \(n_0\approx N_D-N_A\) (extrinsic); at high temperature, \(n_0\approx n_i(T)\) (intrinsic) — the same formula describes both.

See also: [Electron Concentration](#electron-concentration).

#### Electron Concentration

The exact equilibrium electron concentration, \(n_0=\big[(N_D-N_A)+\sqrt{(N_D-N_A)^2+4n_i^2}\big]/2\), obtained by solving the mass action law and charge neutrality condition together.

**Example:** For heavily n-type-doped silicon, this formula reduces to the familiar \(n_0\approx N_D\); for a perfectly compensated sample, it reduces to \(n_0=n_i\).

See also: [Hole Concentration](#hole-concentration), [Carrier Concentration Equation](#carrier-concentration-equation).

#### Fermi Level Position

The exact energy location of the Fermi level, computed from a known carrier concentration via \(E_C-E_F=k_BT\ln(N_C/n_0)\).

**Example:** Heavier n-type doping raises \(n_0\), which shrinks \(E_C-E_F\), moving the Fermi level closer to the conduction band edge.

See also: [Intrinsic Fermi Level](#intrinsic-fermi-level).

#### Hole Concentration

The exact equilibrium hole concentration, \(p_0=\big[(N_A-N_D)+\sqrt{(N_A-N_D)^2+4n_i^2}\big]/2\), the mirror image of the electron concentration equation.

**Example:** For heavily p-type-doped silicon, this formula reduces to the familiar \(p_0\approx N_A\).

See also: [Electron Concentration](#electron-concentration).

#### Intrinsic Fermi Level

The Fermi level position \(E_i\) that results when a material is purely intrinsic (\(n_0=p_0=n_i\)), given by \(E_i=(E_C+E_V)/2+(k_BT/2)\ln(N_V/N_C)\), close to but not exactly at the middle of the band gap.

**Example:** Silicon's \(E_i\) sits about 13 meV below exact midgap at 300 K, since silicon's \(N_C\) exceeds its \(N_V\).

See also: [Fermi Level Position](#fermi-level-position), [Carrier Concentration Equation](#carrier-concentration-equation).

#### Nondegenerate Semiconductor

A semiconductor in which the Fermi level sits far enough inside the band gap that the Boltzmann approximation is valid throughout the band of interest.

**Example:** All the equations in this chapter assume a nondegenerate semiconductor; Chapter 8's degenerate semiconductors require the full Fermi-Dirac integral instead.

See also: [Boltzmann Approximation](#boltzmann-approximation).

</div>
