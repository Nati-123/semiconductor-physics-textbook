<div class="problems-styled" markdown>

# Chapter 12 Glossary

Terms introduced in [Chapter 12 — Diffusion and Advanced Transport Phenomena](index.md). See the [full site Glossary](../../glossary.md) for terms across all chapters.

#### Concentration Gradient

The spatial rate of change of carrier concentration, \(dn/dx\) or \(dp/dx\), that drives diffusion current via Fick's law.

**Example:** A steeper concentration gradient near an injection point drives a larger diffusion current than a shallow, gradual one.

See also: [Fick's Law](#ficks-law), [Diffusion Coefficient](#diffusion-coefficient).

#### Diffusion Coefficient

The proportionality constant \(D\) relating diffusion current to concentration gradient in Fick's law, directly tied to mobility through the Einstein relation.

**Example:** Silicon's electron diffusion coefficient (\(D_n\approx35\ \text{cm}^2/\text{s}\) at 300 K) is much smaller than GaAs's, tracking the same ratio as their mobilities.

See also: [Einstein Relation](#einstein-relation), [Fick's Law](#ficks-law).

#### Einstein Relation

The relationship \(D=\mu k_BT/q\) tying the diffusion coefficient directly to mobility, since both drift and diffusion are governed by the same carrier-scattering environment.

**Example:** At 300 K, since \(k_BT/q\approx0.0259\) V, the Einstein relation lets \(D\) be computed directly from \(\mu\) with no separate measurement needed.

See also: [Diffusion Coefficient](#diffusion-coefficient), [Mobility Temperature Dependence](#mobility-temperature-dependence).

#### Fick's Law

The law stating that diffusion current density is directly proportional to the concentration gradient, \(J_{n,\text{diff}}=qD_n(dn/dx)\).

**Example:** Fick's law explains why carriers injected at one edge of a semiconductor region spread toward areas of lower concentration, exactly like ink diffusing in water.

See also: [Concentration Gradient](#concentration-gradient), [Total Current Density](#total-current-density).

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

#### Mobility Temperature Dependence

The variation of mobility with temperature via Matthiessen's rule, combining lattice scattering (\(\mu_L\propto T^{-3/2}\)) and impurity scattering (\(\mu_I\propto T^{3/2}/N\)), first introduced in Chapter 11 and used throughout this chapter's temperature-dependent quantities.

**Example:** Since \(D=\mu k_BT/q\), the diffusion coefficient inherits mobility's temperature dependence, in addition to the direct \(T\) factor from \(k_BT\).

See also: [Einstein Relation](#einstein-relation).

#### Total Current Density

The sum of drift and diffusion current density at a point in a semiconductor, \(J=J_{\text{drift}}+J_{\text{diffusion}}\), the master transport equation used throughout the remaining chapters.

**Example:** Inside a p-n junction's depletion region at equilibrium, drift and diffusion current densities are equal and opposite, so the total current density is zero.

See also: [Fick's Law](#ficks-law).

#### Velocity Saturation

The leveling-off of drift velocity at high electric field, as increased carrier energy triggers more effective scattering, following \(v_d(E)=\mu E/\sqrt{1+(\mu E/v_{sat})^2}\).

**Example:** In a short-channel transistor, carriers can spend much of their transit time in the velocity-saturation regime, fundamentally limiting switching speed.

See also: [Mobility Temperature Dependence](#mobility-temperature-dependence).

</div>
