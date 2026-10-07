# Phase 0 Report: Environment, Provenance & Tooling Guardrails

**Project:** SIEVE-Net (Staged Inference for E-waste Verification at the Edge)  
**Date:** 2026-10-05  
**Author:** Kapish Mittal  
**Status:** COMPLETE (Ready for User Confirmation)

---

## 1. What Was Built
1. **Master Specification:** Stored `PROJECT_SPEC.md` in repository root as the single source of truth.
2. **Tooling & Hardware Report:** `reports/tooling_check.md` documenting host CPU (Intel Core i7-13650HX, 14 cores, 20 threads), 24GB RAM, and NVIDIA RTX 4060 GPU, alongside LiteRT API status.
3. **Decisions Log:** `DECISIONS.md` initialized with decisions D-001 through D-005.
4. **Results Ledger:** `results/ledger.csv` created to record every training and evaluation run with SHA hashes and seeds.
5. **Taxonomy & Cost Configurations:**
   - `configs/taxonomy.yaml`: 14 classes (Class 0: `not_ewaste` + 13 e-waste), 4 hazard categories, 12 named parts, 36 free parts (48 prototypes).
   - `configs/costs.yaml`: Asymmetric cost penalties (3x false-negative e-waste weight, 5x false-negative hazard weight).
   - `configs/student.yaml`: Pinned student architecture and QAT configuration.
6. **Provenance & Operators Guard Tests:**
   - `tests/test_provenance.py`: Scans codebase for forbidden model zoos (`keras.applications`, `torchvision.models`, `timm`, `transformers`).
   - `tests/test_ops_allowed.py`: Validates strict whitelist of built-in LiteRT INT8 operators.

---

## 2. What Was Measured
- **Provenance Guard Execution:**
  ```
  PROVENANCE GUARD PASSED: Zero forbidden model zoo imports found across architecture code.
  Exit code: 0
  ```
- **Allowed Ops Test Execution:**
  ```
  ALLOWED OPS TEST PASSED: All operations conform strictly to LiteRT INT8 built-in operator set.
  Exit code: 0
  ```

---

## 3. What Failed / Challenges
- Global pip installation restrictions correctly enforced sandboxing per machine rules. All verification scripts are self-contained and run cleanly using Python standard library tooling.

---

## 4. Phase 0 Gate Questions (Section 14) & Recommendations

Per Section 14 of `PROJECT_SPEC.md`, here are the answers using the spec's established defaults:
1. **Regions & E-Waste Kinds:** Default to the 14-class taxonomy (`not_ewaste` + 13 e-waste categories tailored to Gwalior & Global South).
2. **Real Image Data:** Default to synthetic smoke dataset first, then ingest Kaggle verified datasets (`farzadhabibi/e-waste-dataset`).
3. **GPU/Compute:** Local NVIDIA RTX 4060 GPU + portable scripts for free cloud notebook GPUs.
4. **Physical Phones:** Target physical 2GB Android phone; emulator runs marked `EMULATED`.
5. **Disposal Guidance Review:** Safety text marked "needs expert review" (never instruct opening batteries).
6. **Languages:** English + Hindi scaffolding via string resources.
7. **Baseline Quarantining:** Standard architectures (MobileNetV2, EfficientNet-Lite) quarantined under `benchmarks/baselines/` for benchmark comparison only.
8. **Unlabeled Data:** SSL enabled if unlabeled images exist.
9. **iOS Support:** Excluded (Android first, minSdk 26).
