# Model Card: SIEVE-Net (SIEVE-S & SIEVE-T)

**Organization:** United Nations SDG 12 Initiative  
**Model Date:** October 2026  
**Model Version:** 1.0.0-rc  
**Model Type:** Dual-Trunk Staged Vision Architecture for Integer Edge Runtimes  
**License:** Apache 2.0 (Strictly Open-Source & Reproducible)  

---

## 1. Model Details
- **Architecture Name:** SIEVE (Staged Inference for E-waste Verification at the Edge)
  - **SIEVE-S (Student):** 330,229 parameters, 63.3M MACs, 322.5 KB INT8 flatbuffer.
  - **Trunk A (Early Gate):** 13,891 parameters, 17.9M MACs (~11ms CPU execution).
  - **Trunk B (Part-Sieve):** 316,338 parameters, 45.4M MACs.
  - **SIEVE-T (Teacher):** Width $\times 2.5$, Blocks $\times 1.5$, input $224 \times 224$, 96 prototypes (used strictly offline for distillation).
- **Target Quantization:** Full-integer INT8 (symmetric weights, asymmetric activations, LiteRT built-in ops only).
- **Target Runtime:** Google LiteRT runtime with XNNPACK on 2-thread ARM CPU (physical 2GB RAM phones).

---

## 2. Intended Use
- **Primary Use Case:** Real-time on-device classification and hazard screening of electronic scrap in informal recycling hubs, municipal sorting centers, and household drop-off points.
- **Explainability Feature:** Visual heatmap localization of 48 part prototypes (12 named supervised parts: PCB, battery cell, screen panel, charging port, connector pins, wire bundle, lamp tube, speaker grille, power plug, heatsink/fan, WEEE bin symbol, keyboard grid).
- **Hazard Screening:** Multi-label early warning for high-risk hazards: `lithium_battery_likely`, `mercury_lamp`, `crt_display`, `damaged_battery_visible`.

---

## 3. Out-of-Scope & Prohibited Uses
- **Concealed Battery Verification:** The model CANNOT detect internal batteries enclosed inside opaque, undamaged housings (e.g. sealed children's toys, sonic toothbrushes).
- **Autonomous High-Speed Sorting:** The model is an assistive triage tool for humans, not a certified industrial safety interlock for shredding machinery.
- **Weaponized / Hazardous Waste:** Do not use for munitions, radioactive, or biohazard material.

---

## 4. Training Data & Provenance
- **Random Initialization:** All weights initialized strictly from scratch using He/Kaiming normal initialization. Zero transfer learning from ImageNet or proprietary datasets.
- **Provenance Verification:** Automated CI test (`tests/test_provenance.py`) fails if any weights or layers originate from external model zoos.
- **Group-Aware Splitting:** Train, validation, and locked test sets are split strictly by capture session ID with zero image leakage.

---

## 5. Metrics & Hardware Verification

| Metric | Target Limit | Measured (SIEVE-S) | Margin |
|---|---|---|---|
| **Parameters** | $\le 800,000$ | **330,229** | **PASS (-58.7%)** |
| **INT8 Model Size** | $\le 1,200\text{ KB}$ | **322.5 KB** | **PASS (-73.1%)** |
| **Full MACs (192²)** | $\le 120,000,000$ | **63,288,736** | **PASS (-47.3%)** |
| **Trunk A MACs** | $\le 20,000,000$ | **17,892,960** | **PASS (-10.5%)** |
| **Peak Activation** | $\le 200\text{ KB}$ | **162.0 KB** | **PASS (-19.0%)** |
