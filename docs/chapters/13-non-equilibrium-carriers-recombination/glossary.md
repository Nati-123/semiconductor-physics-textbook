<div class="problems-styled" markdown>

# Chapter 13 Glossary

Terms introduced in [Chapter 13 — Non-Equilibrium Carriers and Recombination](index.md). See the [full site Glossary](../../glossary.md) for terms across all chapters.

#### Auger Recombination

A three-carrier recombination process in which the energy released by an electron-hole recombination event is transferred to a third carrier instead of being emitted as a photon or phonon; its rate scales as \(\Delta n^3\).

**Example:** Auger recombination is negligible at low injection but becomes the dominant loss mechanism in heavily-illuminated solar cells and high-current laser diodes.

See also: [Trap-Assisted Recombination](#trap-assisted-recombination), [Carrier Recombination](#carrier-recombination).

#### Carrier Generation

The creation of electron-hole pairs, promoting an electron from the valence band to the conduction band, via optical or thermal processes.

**Example:** A beam of above-bandgap light striking a semiconductor generates electron-hole pairs uniformly through the illuminated region.

See also: [Optical Generation](#optical-generation), [Thermal Generation](#thermal-generation), [Excess Carriers](#excess-carriers).

#### Carrier Injection

The general process of adding excess carriers to a semiconductor, by illumination, applied bias, or other means, classified as low-level or high-level depending on the excess concentration relative to doping.

**Example:** Forward-biasing a p-n junction (Chapter 15) injects minority carriers across the junction, a direct application of carrier injection.

See also: [Low-Level Injection](#low-level-injection), [High-Level Injection](#high-level-injection).

#### Carrier Recombination

The process by which an electron and hole recombine, returning excess carrier concentration toward its equilibrium value.

**Example:** Carrier recombination is the reverse process of carrier generation, and the two exactly balance at thermal equilibrium.

See also: [Direct Recombination](#direct-recombination), [Indirect Recombination](#indirect-recombination), [Minority Carrier Lifetime](#minority-carrier-lifetime).

#### Continuity Equation

The master equation governing how excess carrier concentration evolves in space and time, combining diffusion, drift, generation, and recombination.

**Example:** Solving the continuity equation at steady state for carriers injected at a boundary yields the exponential steady-state carrier profile characterized by the diffusion length.

See also: [Steady-State Carrier Profile](#steady-state-carrier-profile), [Diffusion Length](#diffusion-length).

#### Diffusion Length

The characteristic distance, \(L=\sqrt{D\tau}\), that a minority carrier diffuses, on average, before recombining.

**Example:** A solar cell's absorber layer must generally be no much thicker than the minority carrier diffusion length, or photogenerated carriers will recombine before reaching a collecting junction.

See also: [Continuity Equation](#continuity-equation), [Steady-State Carrier Profile](#steady-state-carrier-profile).

#### Direct Recombination

Band-to-band recombination in a direct-gap material, where the conduction band minimum and valence band maximum sit at the same crystal momentum, allowing an electron to recombine without a momentum-conserving assist.

**Example:** Direct recombination's efficiency in GaAs (a direct-gap material) is why GaAs and related compounds are used to make LEDs and laser diodes.

See also: [Indirect Recombination](#indirect-recombination).

#### Excess Carriers

Carrier concentrations above their equilibrium values, \(\Delta n=n-n_0\) and \(\Delta p=p-p_0\), created by carrier generation.

**Example:** Excess electrons and excess holes are always created in equal numbers by generation alone, so \(\Delta n=\Delta p\) whenever generation is the sole disturbance.

See also: [Carrier Generation](#carrier-generation), [Carrier Recombination](#carrier-recombination).

#### High-Level Injection

The injection regime in which excess carrier concentration is comparable to or exceeds the doping concentration, \(\Delta n\gtrsim N\), significantly perturbing both carrier populations.

**Example:** High-level injection requires more careful treatment than the simpler low-level injection equations, relevant in heavily-illuminated solar cells.

See also: [Low-Level Injection](#low-level-injection), [Carrier Injection](#carrier-injection).

#### Indirect Recombination

Band-to-band recombination in an indirect-gap material, where the conduction band minimum and valence band maximum sit at different crystal momenta, requiring a phonon to conserve momentum.

**Example:** Indirect recombination's inherent inefficiency in silicon (an indirect-gap material) is why silicon is a poor light emitter.

See also: [Direct Recombination](#direct-recombination), [Trap-Assisted Recombination](#trap-assisted-recombination).

#### Low-Level Injection

The injection regime in which excess carrier concentration is much smaller than the doping concentration, \(\Delta n\ll N\), leaving the majority carrier concentration essentially unperturbed.

**Example:** Nearly all of the simple device equations used in later chapters assume low-level injection.

See also: [High-Level Injection](#high-level-injection), [Carrier Injection](#carrier-injection).

#### Minority Carrier Lifetime

The exponential decay time constant \(\tau\) of excess carriers after generation stops, \(\Delta n(t)=\Delta n(0)e^{-t/\tau}\).

**Example:** A longer minority carrier lifetime means excess carriers persist longer before recombining, generally desirable in solar cells and bipolar transistors.

See also: [Recombination Rate](#recombination-rate), [Carrier Recombination](#carrier-recombination).

#### Optical Generation

Carrier generation by photon absorption, in which a photon with energy at or above the band gap excites an electron across the gap.

**Example:** Optical generation is the mechanism behind solar cells and photodetectors.

See also: [Carrier Generation](#carrier-generation), [Thermal Generation](#thermal-generation).

#### Quasi-Fermi Level

One of two separate energy levels, \(E_{Fn}\) for electrons and \(E_{Fp}\) for holes, describing carrier occupation statistics under non-equilibrium conditions where a single Fermi level no longer applies.

**Example:** The splitting \(E_{Fn}-E_{Fp}\) between the two quasi-Fermi levels under illumination sets the open-circuit voltage of a solar cell.

See also: [Excess Carriers](#excess-carriers), [Carrier Injection](#carrier-injection).

#### Recombination Rate

The number of carriers recombining per unit volume per unit time, \(R=\Delta n/\tau\) for a single dominant mechanism at low injection.

**Example:** At steady state, generation rate and recombination rate balance, \(G=R\), directly giving the steady-state excess concentration \(\Delta n_{ss}=G\tau\).

See also: [Minority Carrier Lifetime](#minority-carrier-lifetime), [Carrier Recombination](#carrier-recombination).

#### Shockley-Read-Hall Recombination

The quantitative theory of trap-assisted recombination, showing that traps located near midgap are the most effective recombination centers.

**Example:** Shockley-Read-Hall recombination is the standard model for recombination in silicon devices, where indirect band-to-band recombination is too inefficient to dominate.

See also: [Trap-Assisted Recombination](#trap-assisted-recombination), [Indirect Recombination](#indirect-recombination).

#### Steady-State Carrier Profile

The spatial distribution of excess carrier concentration once transients have died out, typically an exponentially decaying profile, \(\Delta p(x)=\Delta p(0)e^{-x/L_p}\), for carriers injected at a boundary.

**Example:** The steady-state carrier profile in a p-n junction's quasi-neutral region directly determines the diode current computed in Chapter 15.

See also: [Diffusion Length](#diffusion-length), [Continuity Equation](#continuity-equation).

#### Thermal Generation

Carrier generation by random thermal fluctuations alone, the same process responsible for equilibrium carrier concentrations \(n_0\) and \(p_0\).

**Example:** Under illumination or bias, optical or electrical generation typically dwarfs the thermal contribution, driving concentrations well above equilibrium.

See also: [Carrier Generation](#carrier-generation), [Optical Generation](#optical-generation).

#### Trap-Assisted Recombination

Recombination mediated by defect or impurity energy levels within the forbidden gap, capturing an electron and a hole in two separate steps rather than one direct jump.

**Example:** Trap-assisted recombination usually dominates over direct band-to-band recombination in indirect-gap materials like silicon.

See also: [Shockley-Read-Hall Recombination](#shockley-read-hall-recombination), [Indirect Recombination](#indirect-recombination).

</div>
