# SIEVE-Net Architectural Decisions Log (DECISIONS.md)

This log records every non-trivial design choice, budget trade-off, and policy decision in SIEVE-Net.

---

## 2026-10-05: Phase 0 Initialization & Baseline Standards

### D-001: Adoption of SIEVE-Net Master Specification
- **Context:** User requested architectural alignment and rigorous validation against `PROJECT_SPEC.md` for a 2GB RAM edge e-waste model designed for the United Nations.
- **Decision:** Adopt `PROJECT_SPEC.md` as the authoritative single source of truth. All code, tests, and reports strictly follow Phases 0 to 8.
- **Status:** Approved.

### D-002: Dual-Trunk Cascade Architecture (Model A + Model B)
- **Context:** Continuous live viewfinder scanning drains battery and causes thermal throttling on low-end 2GB phones if heavy inference runs on every frame.
- **Decision:** Implement the cascade split at Stage 1 ($24 \times 24 \times 32$):
  - `sieve_trunk_a_int8.tflite` runs at 4 fps (takes ≤ 15 ms).
  - If gate predicts `no-object` or confident `not-e-waste`, execution halts immediately.
  - `sieve_trunk_b_int8.tflite` is triggered only when an e-waste candidate is stable.
- **Status:** Approved.

### D-003: Part-Sieve Explainability Head over Generic Black-Box Classifiers
- **Context:** E-waste items are functionally and visually identified by micro-components (ports, PCB traces, battery cells, plugs, grilles) rather than global silhouettes.
- **Decision:** Implement the Part-Sieve head with 48 prototype maps (12 named + 36 free) feeding a non-negative readout matrix. This provides coarse heatmaps without a YOLO object detector and guarantees that parts can only add evidence for a class.
- **Status:** Approved.

### D-004: Polarity-Split Fixed Edge Prior (S0b)
- **Context:** Early layers of vision models normally spend training capacity learning primitive oriented edges.
- **Decision:** Implement S0b as an 8-channel fixed convolutional bank (4 orientations: $0^\circ, 45^\circ, 90^\circ, 135^\circ \times 2$ polarities: positive and negative edges) with `trainable=False`, feeding directly into ReLU6 to retain both polarity signs.
- **Status:** Approved.

### D-005: 14-Class Taxonomy with First-Class Hard Negatives
- **Context:** Real-world users will point cameras at stainless steel tiffin boxes, plastic toys, cardboard, and clothing.
- **Decision:** Reserve Class 0 strictly for `not_ewaste` with ≥ 30 look-alike household categories.
- **Status:** Approved.

---

## 2026-10-05: Phase 1 & Phase 3 Data Engine & Pre-Flight Sanity

### D-006: Group-Aware Session Splitting & SHA-256 Locked Test Set
- **Context:** Standard random image splitting leaks background, lighting, and temporal video correlation between train and test sets, inflating apparent accuracy.
- **Decision:** Split data strictly by physical `session_id` (70% train / 15% val / 15% test). The final test set is locked with a SHA-256 manifest (`data/splits/locked_test_manifest.sha256`) and evaluated strictly once during Phase 6 final benchmarking.
- **Status:** Approved.

### D-007: Procedural Synthetic Smoke Pipeline Isolation
- **Context:** Section 2 Rule 3 and Section 7.1 prohibit inventing photographs or fabricating empirical results.
- **Decision:** Implement a procedural synthetic smoke generator (`data/synth_smoke.py`) generating geometric circuit traces and non-e-waste shapes. All pipeline and sanity tests run on this data until real dataset ingestion is confirmed.
- **Status:** Approved.

### D-008: Multi-Task Loss with Prototype Diversity
- **Context:** Without explicit diversity penalties, unconstrained prototype networks collapse onto a handful of dominant features.
- **Decision:** Add $L_{\text{div}}$ (penalizing off-diagonal cosine similarities across the 48 prototype kernels) alongside non-negative linear readout constraints ($\mathbf{W} \ge 0$), guaranteeing distinct micro-part explanations.
- **Status:** Approved.

