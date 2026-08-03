<div class="problems-styled" markdown>

# Chapter 11 Glossary

Terms introduced in [Chapter 11 — Drift Current and Carrier Mobility](index.md). See the [full site Glossary](../../glossary.md) for terms across all chapters.

#### Carrier Mobility

The proportionality constant \(\mu\) relating drift velocity to electric field, \(v_d=\mu E\), capturing how efficiently an applied field converts into net carrier motion given the scattering environment.

**Example:** GaAs's much smaller electron effective mass gives it a higher intrinsic mobility than silicon, useful for high-frequency devices.

See also: [Drift Velocity](#drift-velocity), [Scattering Mechanism](#scattering-mechanism).

#### Conductivity

The quantity \(\sigma=q(n\mu_n+p\mu_p)\) summarizing how easily a doped semiconductor conducts current, combining carrier concentration and mobility.

**Example:** Even though heavier doping reduces mobility through impurity scattering, conductivity still rises with doping because the carrier concentration increase dominates.

See also: [Resistivity](#resistivity), [Carrier Mobility](#carrier-mobility).

#### Diffusion Current

Current driven by a carrier concentration gradient rather than an electric field, \(J_{n,\text{diff}}=qD_n(dn/dx)\).

**Example:** Carriers injected at one edge of a semiconductor region diffuse toward regions of lower concentration, exactly like ink spreading in water.

See also: [Drift Current](#drift-current).

#### Drift Current

Current produced when an applied electric field superimposes a net drift velocity on carriers' random thermal motion, \(J_{\text{drift}}=q(n\mu_n+p\mu_p)E\).

**Example:** Drift current is the dominant current mechanism inside a resistor or the quasi-neutral regions of a biased diode.

See also: [Drift Velocity](#drift-velocity), [Diffusion Current](#diffusion-current).

#### Drift Velocity

The small, steady net velocity, \(v_d=\mu E\), that an applied electric field adds to a carrier's much larger random thermal motion.

**Example:** Even at typical operating fields, drift velocity is usually far smaller than a carrier's random thermal speed — it is a small bias, not a replacement for thermal motion.

See also: [Carrier Mobility](#carrier-mobility), [Drift Current](#drift-current).

#### Impurity Scattering

Scattering of a carrier by the Coulomb field of an ionized donor or acceptor atom, worse at low temperature (slow carriers are deflected more) and high doping (more impurities present).

**Example:** Impurity scattering typically dominates mobility at low temperature or very heavy doping, following approximately \(\mu_I\propto T^{3/2}/N\).

See also: [Lattice Scattering](#lattice-scattering), [Scattering Mechanism](#scattering-mechanism).

#### Lattice Scattering

Scattering of a carrier by the thermally-vibrating atoms of the crystal lattice, worse at high temperature.

**Example:** Lattice scattering typically dominates mobility at room temperature and above in lightly-doped material, following approximately \(\mu_L\propto T^{-3/2}\).

See also: [Impurity Scattering](#impurity-scattering), [Scattering Mechanism](#scattering-mechanism).

#### Resistivity

The reciprocal of conductivity, \(\rho=1/\sigma\), with units of \(\Omega\cdot\text{cm}\), commonly measured directly on a doped wafer using a four-point probe.

**Example:** A lightly-doped silicon wafer has much higher resistivity than a heavily-doped one, even though both are the same base material.

See also: [Conductivity](#conductivity), [Sheet Resistance](#sheet-resistance).

#### Scattering Mechanism

Any collision process that randomizes a carrier's direction of motion, ultimately limiting mobility.

**Example:** Lattice scattering and impurity scattering are the two dominant scattering mechanisms in a doped semiconductor, combined via Matthiessen's rule.

See also: [Lattice Scattering](#lattice-scattering), [Impurity Scattering](#impurity-scattering).

#### Sheet Resistance

The thin-film form of resistivity, \(R_s=\rho/t\) (units \(\Omega/\square\)), letting a rectangular film's resistance be computed as \(R=R_s\times(L/W)\), the number of unit squares the film forms.

**Example:** Doubling both a resistor's length and width leaves its resistance unchanged, since the number of squares (L/W) is unaffected.

See also: [Resistivity](#resistivity).

</div>
