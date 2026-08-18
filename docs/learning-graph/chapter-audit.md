# Chapter Content Audit

Detailed per-chapter breakdown supplementing [Book Metrics](book-metrics.md) and
[Chapter Metrics](chapter-metrics.md). Generated as part of the DAG-integrity fix
and pre-expansion review for Chapters 9-20.

## Per-Chapter Table

| Ch | Chapter | Words | Concepts | Glossary Terms | Glossary Gaps | Quiz Qs | MicroSims (metadata) | MicroSims (actual) | Learning Objectives | Broken Links |
|----|---------|------:|---------:|---------------:|:--------------|--------:|---------------------:|--------------------:|:--------------------:|:------------:|
| 1 | Physics and Math Foundations | 16,720 | 26 | 26 | none | 20 | 8 | 8 | Yes | 0 |
| 2 | Quantum Mechanics Foundations | 16,330 | 12 | 16 | none | 20 | 7 | 7 | Yes | 0 |
| 3 | Crystal Lattices and Structures | 14,362 | 11 | 14 | none | 20 | 4 | 4 | Yes | 0 |
| 4 | Chemical Bonding in Semiconductor Crystals | 14,746 | 9 | 12 | none | 20 | 4 | **5** | Yes | 0 |
| 5 | Quantum Mechanics of Periodic Crystals | 13,794 | 12 | 12 | none | 20 | 2 | **3** | Yes | 0 |
| 6 | Band Structure and the Fermi Level | 15,077 | 11 | 11 | none | 20 | 2 | **4** | Yes | 0 |
| 7 | Intrinsic and Extrinsic Semiconductors | 14,143 | 9 | 9 | none | 20 | 10 | **16** | Yes | 0 |
| 8 | Doping, Ionization, and Temperature Regimes | 11,757 | 10 | 10 | none | 20 | 4 | **6** | Yes | 0 |
| 9 | Carrier Concentration Statistics | 11,537 | 10 | 10 | none | 20 | 3 | 3 | Yes | 0 |
| 10 | Fermi Level Position and Carrier Equations | 11,127 | 8 | 8 | none | 20 | 2 | 2 | Yes | 0 |
| 11 | Drift Current and Carrier Mobility | 10,680 | 10 | 10 | none | 20 | 3 | 3 | Yes | 0 |
| 12 | Diffusion and Advanced Transport Phenomena | 11,366 | 10 | 10 | none | 20 | 4 | 4 | Yes | 0 |
| 13 | Non-Equilibrium Carriers and Recombination | 12,201 | 19 | 19 | none | 20 | 6 | 6 | Yes | 0 |
| 14 | The P-N Junction at Equilibrium | 12,960 | 10 | 10 | none | 20 | 5 | 5 | Yes | 0 |
| 15 | The P-N Junction Under Bias | 13,288 | 11 | 11 | none | 20 | 5 | 5 | Yes | 0 |
| 16 | Metal-Semiconductor and MOS Junctions | 14,979 | 20 | 20 | none | 26 | 6 | 6 | Yes | 0 |
| 17 | Optical and Thermal Properties | 11,451 | 10 | 10 | none | 20 | 5 | **6** | Yes | 0 |
| 18 | Semiconductor Devices and Applications | 12,898 | 10 | 10 | none | 22 | 7 | 7 | Yes | 0 |
| 19 | Semiconductor Device Fabrication | 16,197 | 20 | 20 | none | 24 | 8 | **10** | Yes | 0 |
| 20 | Advanced Devices and Emerging Technologies | 14,506 | 18 | 18 | none | 22 | 8 | **12** | Yes | 0 |

**FAQ coverage**: not chapter-attributed. `docs/faq.md` has 9 questions total, organized under
"Getting Started", "Using the MicroSims", and "Technical Questions" — none map to per-chapter
content (e.g., no "What's the difference between drift and diffusion current?" style FAQ tied
to Ch11/Ch12). Chapter-level FAQ coverage is effectively **0/20**.

## Findings

### 1. `concept-metadata.json` under-reports MicroSims for 8 chapters
The **"MicroSims (metadata)"** column comes from the `microsims` field recorded per concept in
`concept-metadata.json`. The **"MicroSims (actual)"** column comes from scanning what's really
embedded in each chapter's `index.md`. Chapters 4, 5, 6, 7, 8, 17, 19, and 20 have MicroSims that
exist on disk and are linked into the chapter page, but were never added to the corresponding
concept's `microsims` array — likely metadata drift from the recent "Improve/expand Chapter N
MicroSims" commits, which touched chapter content but not the learning graph. This means the
learning graph currently *undercounts* interactive coverage for those chapters. Not a blocker,
but worth a metadata sync pass at some point (not done here — out of scope for this review).

### 2. Chapter 7 has a disproportionate MicroSim count (16 sims for 9 concepts)
Every other chapter runs 0.25–0.7 MicroSims per concept; Chapter 7 runs **1.78** — more than double
the next-highest chapter. Comparing the sim descriptions directly, two look genuinely redundant:

- `material-property-comparison-chart` — bar chart comparing bandgap, mobility, lattice constant,
  **and melting point** across Si/Ge/GaAs.
  `melting-point-processing-comparison` — a dedicated sim comparing the **same three materials'
  melting points**.

  These overlap on melting point specifically. The rest of Chapter 7's sims (ionization energy
  calculator vs. chart, structure comparer, material selector, etc.) serve distinct pedagogical
  purposes (empirical data vs. physics-model calculator vs. decision-support) and are not flagged.

  No changes made — flagging only, per your instruction not to touch MicroSims speculatively.

### 3. No chapter is "too thin" by word count
Word counts range from 10,680 (Ch 11) to 16,720 (Ch 1), median 13,541 — all comfortably above the
~1,000-word thin-content threshold used for these textbooks. Chapters 9–12 (11.5K, 11.1K, 10.7K,
11.4K) are the leanest in the book but are proportionate to their concept counts (8–10 concepts
each) and not thin relative to peers.

### 4. Glossary, quizzes, learning objectives, and links are all clean
- 100% of concepts have a resolvable glossary entry in their chapter (0 gaps).
- All 20 chapters have a `quiz.md` with 20+ questions.
- All 20 chapters have a "Learning Objectives" section in `index.md`.
- Zero broken relative/absolute markdown links across all chapter files.
