<div class="problems-styled" markdown>

# Chapter 14 Glossary

Terms introduced in [Chapter 14 — The P-N Junction at Equilibrium](index.md). See the [full site Glossary](../../glossary.md) for terms across all chapters.

#### Built-In Potential

The equilibrium electrostatic potential difference across a p-n junction, \(V_{bi}=(kT/q)\ln(N_AN_D/n_i^2)\), required so that a single Fermi level can describe carrier concentrations on both sides.

**Example:** A silicon junction with \(N_A=1\times10^{17}\ \text{cm}^{-3}\) and \(N_D=1\times10^{16}\ \text{cm}^{-3}\) has \(V_{bi}\approx0.754\ \text{V}\) at 300 K, independent of the junction's physical area.

See also: [P-N Junction](#p-n-junction), [Depletion Width](#depletion-width).

#### Depletion Approximation

An idealization of the depletion region as fully depleted of mobile carriers with sharp, abrupt edges, and fully charge-neutral everywhere outside those edges.

**Example:** Under the depletion approximation, mobile carrier concentration is treated as exactly zero for \(-x_p\le x\le x_n\), even though the real transition is a smooth, continuous falloff.

See also: [Depletion Region](#depletion-region), [Depletion Charge Density](#depletion-charge-density).

#### Depletion Charge Density

The net charge density \(\rho(x)\) within the depletion region under the depletion approximation: \(-qN_A\) on the p-side and \(+qN_D\) on the n-side, zero elsewhere.

**Example:** Integrating \(\rho(x)\) across the full depletion width gives the charge-neutrality condition \(N_Ax_p=N_Dx_n\).

See also: [Poisson's Equation](#poissons-equation), [Junction Electric Field](#junction-electric-field).

#### Depletion Region

The region on either side of a metallurgical junction that has been swept nearly clean of mobile carriers by diffusion and recombination, exposing fixed ionized dopant charge.

**Example:** The depletion region is often called the space-charge region because the only charge present within it is the fixed, uncompensated ionized dopant charge.

See also: [Metallurgical Junction](#metallurgical-junction), [Depletion Approximation](#depletion-approximation).

#### Depletion Width

The total extent \(W=x_n+x_p\) of the depletion region, set by doping concentrations and the built-in potential, \(W=\sqrt{(2\varepsilon V_{bi}/q)(1/N_A+1/N_D)}\).

**Example:** In a one-sided junction with \(N_A\gg N_D\), the depletion width lies almost entirely in the lightly doped n-side, since charge neutrality forces \(x_p\ll x_n\).

See also: [Built-In Potential](#built-in-potential), [Junction Capacitance](#junction-capacitance).

#### Junction Capacitance

The voltage-dependent capacitance \(C_j=\varepsilon A/W\) of a p-n junction's depletion region, arising from its geometry as an insulating gap of width \(W\) between two conductive neutral regions.

**Example:** Because reverse bias widens \(W\), it lowers \(C_j\) — the operating principle of a varactor diode used as a voltage-tunable capacitor.

See also: [Depletion Width](#depletion-width), [P-N Junction](#p-n-junction).

#### Junction Electric Field

The internal electric field \(E(x)\) created by exposed depletion-region charge, following a triangular profile that peaks at the metallurgical junction and vanishes at the depletion edges.

**Example:** The junction electric field points from the n-side toward the p-side, opposing further carrier diffusion until drift and diffusion currents balance at equilibrium.

See also: [Depletion Charge Density](#depletion-charge-density), [Poisson's Equation](#poissons-equation).

#### Metallurgical Junction

The geometric plane, conventionally at \(x=0\), where the net doping concentration of a semiconductor crystal switches from p-type to n-type.

**Example:** Away from the metallurgical junction, each side of the crystal behaves like the uniformly-doped semiconductors analyzed in earlier chapters.

See also: [P-N Junction](#p-n-junction), [Depletion Region](#depletion-region).

#### P-N Junction

A semiconductor structure formed by joining a p-type region and an n-type region within a single continuous crystal.

**Example:** The p-n junction is the foundational building block of the diode, and is embedded inside nearly every transistor, solar cell, and LED covered in later chapters.

See also: [Metallurgical Junction](#metallurgical-junction), [Built-In Potential](#built-in-potential).

#### Poisson's Equation

The electrostatic relation \(dE/dx=\rho(x)/\varepsilon\) linking the derivative of electric field to local charge density.

**Example:** Applying Poisson's equation to the depletion approximation's charge density yields the triangular junction electric field profile.

See also: [Depletion Charge Density](#depletion-charge-density), [Junction Electric Field](#junction-electric-field).

</div>
