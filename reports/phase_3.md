# Phase 3 Report: Float Training Pre-Flight Sanity & Dataset Gate

**Project:** SIEVE-Net (Staged Inference for E-waste Verification at the Edge)  
**Date:** 2026-10-05  
**Author:** Kapish Mittal  
**Status:** SANITY CHECKS PASSED — STOPPED AT DATA GATE (Requesting Real Data)

---

## 1. What Was Built
1. **Multi-Task Training Loss (`train/losses.py`):**
   - Implements Section 8.2 formulation:
     $$L = 1.0 \cdot L_{\text{cls}} + 0.3 \cdot L_{\text{gate}} + 0.5 \cdot L_{\text{hazard}} + 0.5 \cdot L_{\text{part}} + 0.05 \cdot L_{\text{div}} + 10^{-4} \cdot L_1 + 0.5 \cdot L_{\text{KD}}$$
   - Non-negative readout constraint ($\mathbf{W} \ge 0$).
   - Prototype diversity loss ($L_{\text{div}}$) penalizing off-diagonal cosine similarities across 48 prototype kernels.
2. **Pre-Flight Sanity Verification Harness (`train/train_float.py`):**
   - Implements all 4 mandatory sanity tests from Section 8.4.

---

## 2. What Was Measured (Section 8.4 Sanity Check Results)

```
=================================================================
SIEVE-Net Section 8.4 Pre-Flight Sanity Checks
=================================================================
Using Compute Device: CPU (Intel Core i7-13650HX)

[PASS] Check 1: Random-init determinism confirmed
       First-batch loss diff = 0.00e+00 < 1e-6 (Identical outputs on identical seeds)

[PASS] Check 2a: Polarity-split edge bank has zero trainable kernel params
       m1.stem.edge_bank.edge_conv.weight.requires_grad = False
       Gradient is strictly None.

[PASS] Check 2b: Gradient flow confirmed across all active trainable layers
       Zero vanishing gradients detected across stem, DRB blocks, and Part-Sieve head.

[PASS] Check 3: Overfitting 64-sample batch
       Step  50/150: Loss = 0.6156, Top-1 Accuracy = 100.0%
       Step 100/150: Loss = 0.5594, Top-1 Accuracy = 100.0%
       Step 150/150: Loss = 0.5517, Top-1 Accuracy = 100.0%
       Capacity verified: Model readily memorizes batch to 100.0% accuracy.

[PASS] Check 4: Label-shuffle behavior verified
=================================================================
ALL SECTION 8.4 SANITY CHECKS PASSED CLEANLY (Exit Code 0).
=================================================================
```

---

## 3. Phase 3 Stop Gate (Section 7.1 & Section 13 Mandate)

> [!IMPORTANT]
> **GATE TRIGGERED:** Per Section 7.1 and Section 13 of `PROJECT_SPEC.md`:
> *"Run Section 8.4 checks on the smoke data, then **STOP and request real data**."*
>
> All pipeline code, data engine validators, leak-proof splitting, augmentations, and architectural pre-flight checks are verified and passing. To train real weights for UN demonstration without synthetic artifacts, we require real e-waste image ingestion.

### Real Data Ingestion Options:
1. **Kaggle Ingestion:** Run `ml/download_kaggle_dataset.py` to ingest the verified open-source e-waste benchmark dataset (`farzadhabibi/e-waste-dataset`).
2. **Local Scrap Dataset:** Provide path to locally collected field sessions adhering to `docs/DATA_COLLECTION_GUIDE.md`.
