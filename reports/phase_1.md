# Phase 1 Report: Taxonomy & Data Engine Acceptance

**Project:** SIEVE-Net (Staged Inference for E-waste Verification at the Edge)  
**Date:** 2026-10-05  
**Author:** Kapish Mittal  
**Status:** COMPLETE (Acceptance Criteria Passed)

---

## 1. What Was Built
1. **Taxonomy & Cost Matrix Specifications:**
   - `configs/taxonomy.yaml`: 14 classes (Class 0: `not_ewaste` + 13 e-waste), 4 hazard categories (`lithium_battery_likely`, `mercury_lamp`, `crt_display`, `damaged_battery_visible`), 12 named supervised parts, 36 free unsupervised parts (48 prototypes total).
   - `configs/costs.yaml`: Asymmetric penalty matrix (false negative on e-waste penalized $3\times$; false negative on visible hazard penalized $5\times$).
2. **Procedural Synthetic Smoke Generator (`data/synth_smoke.py`):**
   - Implements Section 7.1 specification.
   - Generates synthetic smoke images simulating e-waste circuit traces, chips, battery pouches, screens, wire bundles, alongside 30+ household non-e-waste hard negatives (wood, ceramic, paper box, cloth, plastic).
   - Populates `_meta/sessions.csv`, `_meta/hazards.csv`, and `_meta/parts_boxes.json`.
3. **Data Engine Validator (`data/validate.py`):**
   - Validates file integrity, dimensions, color channels, and session registration.
   - Generates dataset inventory tables.
4. **Group-Aware Leakage-Proof Splitting (`data/splits.py`):**
   - Splits strictly by capture session ID (`Train: 70%`, `Val: 15%`, `Test: 15%`), preventing cross-frame visual correlation.
   - Carves out the locked final test set and computes immutable SHA-256 hashes stored in `data/splits/locked_test_manifest.sha256`.
5. **Deterministic Data Augmentation Pipeline (`data/augment.py`):**
   - Implements Section 7.4 augmentations: random-resized crop, flips, rotation ($\pm 30^\circ$), color jitter, Gaussian blur, sensor noise, and random erasing ($p=0.3$).
   - Generates visual augmentation gallery under `reports/gallery/`.
6. **Split Leakage Acceptance Test (`tests/test_split_leakage.py`):**
   - Asserts mathematical disjointness across splits: zero session overlap and zero image path overlap.

---

## 2. Dataset Inventory (Phase 1 Gate Requirement)

### Real-World Data Inventory Notice
> [!IMPORTANT]
> Per Section 7.1 of `PROJECT_SPEC.md`, real image collection requires verified provenance and consent. Until the physical dataset is mounted or ingested from the Kaggle dataset repository, all pipeline tests run strictly on procedural **SYNTHETIC** smoke data.

### Synthetic Smoke Dataset Inventory (Generated & Validated)
- **Data Location:** `data/smoke/data_raw`
- **Total Images:** 280 (20 images per class across 14 classes)
- **Corrupted Images:** 0

| Class Name | Supervised Type | Synthetic Count |
|---|---|---|
| `not_ewaste` (Hard Negatives) | Background / Household | 20 |
| `phone_tablet` | E-Waste | 20 |
| `computer_equipment` | E-Waste | 20 |
| `display_tv_monitor` | E-Waste | 20 |
| `charger_adapter` | E-Waste | 20 |
| `cable_wire` | E-Waste | 20 |
| `battery_pack_powerbank` | E-Waste | 20 |
| `small_battery_cells` | E-Waste | 20 |
| `circuit_board_loose` | E-Waste | 20 |
| `audio_equipment` | E-Waste | 20 |
| `peripheral_input` | E-Waste | 20 |
| `small_appliance` | E-Waste | 20 |
| `large_appliance` | E-Waste | 20 |
| `lighting` | E-Waste | 20 |

### Session Allocation (Zero Leakage)
- **Train Split:** `SYNTH_SESSION_01`, `SYNTH_SESSION_04` (140 images)
- **Validation Split:** `SYNTH_SESSION_02` (70 images)
- **Locked Test Split:** `SYNTH_SESSION_03` (70 images, locked under SHA-256 manifest)

---

## 3. Acceptance Tests Status
- `tests/test_split_leakage.py`: **PASSED** (0 inter-split session overlap, 0 image overlap).
- Augmentation gallery generated at `reports/gallery/`.
- All Phase 1 criteria met.
