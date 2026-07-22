# Learning Graph Generator Session Log

- **Skill Version:** 0.03
- **Date:** 2026-07-22
- **Course:** Semiconductor Physics (undergrad junior EE/Applied Physics)

## Steps Performed

1. **Course description assessment** — skipped re-analysis; existing `quality_score: 100` in `docs/course-description.md` frontmatter was above the 85 threshold.
2. **Concept generation** — generated 200 Title Case concept labels (max 32 chars each), organized across 12 pedagogical topic clusters. Saved to `concept-list.md`.
3. **Dependency graph** — hand-authored a 200-node DAG in `learning-graph.csv`. Every dependency references a strictly smaller `ConceptID` than its dependent, which mathematically guarantees acyclicity by construction (verified programmatically — zero violations).
4. **Quality validation** — ran `analyze-graph.py` (script version unlabeled, as shipped in skill v0.03).
   - Cycles detected: 0 (verified independently via DFS)
   - **Known script bug:** the "Valid DAG Structure" check in `verify_dag()` seeds Kahn's-algorithm queue using an inverted indegree calculation (it starts from orphaned/leaf nodes instead of foundational/root nodes), so it always reports "❌ No" even on a provably acyclic graph. This was confirmed by manually checking that every `Dependencies` entry references a smaller `ConceptID`, which makes a cycle impossible. Treated as a false negative, not a data defect.
   - 4 foundational (zero-dependency) concepts; 1 connected component (all 200 nodes reachable); longest chain 32 concepts.
   - Did one manual pass adding 8 extra cross-links to reduce orphaned (never-referenced) nodes from 60 → 51, connecting concepts like Silicon, Germanium, Gallium Arsenide, Insulator Band Structure, E-K Diagram, Einstein Relation, Indirect Recombination, and Sheet Resistance forward into later device/application concepts.
5. **Taxonomy** — created 12 categories (`concept-taxonomy.md`), all within 4.0%–11.5% of the 200 concepts (well under the 30% over-representation threshold). Ran `taxonomy-distribution.py` to confirm.
6. **JSON generation** — patched the local copy of `csv-to-json.py` to add `classifierName` entries for this course's 12 TaxonomyIDs (`CRYS`, `QMBT`, `MATL`, `STAT`, `TRAN`, `NEQ`, `PNJ`, `MSJ`, `MOS`, `OPT`, `DEV`, plus `FOUND`), since the shipped script's default name/color maps only covered a different skill's taxonomy set and numeric IDs — without the patch, groups would have rendered with raw abbreviations instead of descriptive names. Created `color-config.json` mapping each TaxonomyID to a distinct named pastel color. Ran `csv-to-json.py learning-graph.csv learning-graph.json color-config.json metadata.json` (script version 0.02) → 200 nodes, 329 edges, 12 groups.
7. **Schema validation** — ran `validate-learning-graph.py`; it failed because the bundled `learning-graph-schema.json` expects `groups.*.color` to be a nested object with a lowercase-only color-name pattern, while both the SKILL.md documentation and the `csv-to-json.py` generator itself produce a flat string (e.g. `"color": "LightCoral"`). This looks like a stale/out-of-sync schema file in the skill package rather than an error in the generated data. Kept the flat format that matches the documented spec and the generator's actual output.
8. **Taxonomy distribution report** — generated via `taxonomy-distribution.py`, no script issues.
9. **Index page** — generated `index.md` from `index-template.md`, filled in actual metrics (4 foundational concepts, 100% connectivity, chain length 32, 12 categories).

## Files Created

- `docs/course-description.md` (metadata already present from prior session)
- `docs/learning-graph/concept-list.md`
- `docs/learning-graph/learning-graph.csv`
- `docs/learning-graph/quality-metrics.md`
- `docs/learning-graph/concept-taxonomy.md`
- `docs/learning-graph/metadata.json`
- `docs/learning-graph/color-config.json`
- `docs/learning-graph/learning-graph.json`
- `docs/learning-graph/taxonomy-distribution.md`
- `docs/learning-graph/index.md`
- `docs/learning-graph/logs/learning-graph-generator-0.03-2026-07-22.md` (this file)

## Known Issues to Revisit

- `analyze-graph.py`'s DAG-validity check has an inverted-indegree bug (false negative on a provably acyclic graph).
- `learning-graph-schema.json` disagrees with `csv-to-json.py`'s actual output format for the `groups.*.color` field.
- 51 concepts remain orphaned (nothing depends on them) — the majority are legitimately terminal/applied leaf concepts (e.g., breakdown mechanisms, specific devices, contrast facts like Ionic/Metallic Bond), which is expected for a well-formed graph, but worth a second look during chapter-outline generation.
