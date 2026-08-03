<div class="problems-styled" markdown>

# Chapter 15 Glossary

Terms introduced in [Chapter 15 — The P-N Junction Under Bias](index.md). See the [full site Glossary](../../glossary.md) for terms across all chapters.

#### Avalanche Breakdown

A reverse-breakdown mechanism in which carriers accelerated by the junction electric field gain enough energy between collisions to generate new electron-hole pairs on impact, multiplying into a runaway chain reaction.

**Example:** Avalanche breakdown dominates in lightly-doped junctions, where the depletion region is wide enough for carriers to accelerate over a long distance before colliding.

See also: [Reverse Breakdown](#reverse-breakdown), [Zener Breakdown](#zener-breakdown).

#### Forward Bias

An applied voltage, positive on the p-side relative to the n-side, that subtracts from the built-in potential, lowering the junction barrier to \(V_{bi}-V\) and sharply increasing diffusion current.

**Example:** Under forward bias, the depletion width narrows and injected minority carrier concentration at the depletion edge can exceed its equilibrium value by many orders of magnitude.

See also: [Reverse Bias](#reverse-bias), [Minority Carrier Injection](#minority-carrier-injection).

#### Ideal Diode Equation

The equation \(I=I_0(e^{V/V_T}-1)\) giving diode current as a function of applied voltage, derived by combining the law of the junction with the saturation current.

**Example:** At forward voltages a few \(V_T\) above zero, the ideal diode equation predicts current rising exponentially, doubling roughly every \(V_T\ln2\approx18\ \text{mV}\).

See also: [Saturation Current](#saturation-current), [Junction I-V Characteristic](#junction-i-v-characteristic).

#### Junction I-V Characteristic

The complete current-voltage relationship of a p-n junction, combining the ideal diode equation's forward exponential rise and reverse saturation current with reverse breakdown at large reverse bias.

**Example:** The junction I-V characteristic's exponential forward rise and roughly-constant forward voltage drop is the basis of the familiar "0.7 V diode drop" approximation used in circuit analysis.

See also: [Ideal Diode Equation](#ideal-diode-equation), [Reverse Breakdown](#reverse-breakdown).

#### Long-Base Diode

A diode geometry in which the quasi-neutral region is much longer than the minority carrier diffusion length, giving an exponentially-decaying injected carrier profile.

**Example:** Discrete diodes with thick substrates are typically long-base, in contrast to the short-base diodes common in integrated circuits.

See also: [Short-Base Diode](#short-base-diode), [Minority Carrier Injection](#minority-carrier-injection).

#### Minority Carrier Injection

The process by which forward bias drives majority carriers across the junction, where they become injected minority carriers in the neutral region on the far side, with a boundary concentration set by the law of the junction.

**Example:** Minority carrier injection under forward bias is the direct analog of the excess-carrier generation studied in Chapter 13, except carriers are injected by crossing the junction rather than created by photon absorption.

See also: [Forward Bias](#forward-bias), [Long-Base Diode](#long-base-diode).

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

#### Short-Base Diode

A diode geometry in which the quasi-neutral region is much shorter than the minority carrier diffusion length, giving a linear injected carrier profile forced to zero at the nearby ohmic contact.

**Example:** Short-base diodes give a larger saturation current than an equivalent long-base diode, since the same concentration drop occurs over a shorter distance, producing a steeper gradient.

See also: [Long-Base Diode](#long-base-diode), [Saturation Current](#saturation-current).

#### Zener Breakdown

A reverse-breakdown mechanism in which valence electrons tunnel quantum-mechanically directly through a thin depletion-region barrier into the conduction band, with no collision involved.

**Example:** Zener breakdown dominates in heavily-doped junctions, typically at doping levels above roughly \(10^{17}\)-\(10^{18}\ \text{cm}^{-3}\) in silicon, where breakdown voltage is only a few volts.

See also: [Avalanche Breakdown](#avalanche-breakdown), [Reverse Breakdown](#reverse-breakdown).

</div>
