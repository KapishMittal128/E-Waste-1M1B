# Data Card: SIEVE-Net Training & Evaluation Corpora

**Dataset Title:** SIEVE-Net E-Waste & Hard-Negative Benchmark Dataset  
**Standard:** Open Data Standards for UN SDG 12 & 3  
**Document:** `docs/DATA_CARD.md`  

---

## 1. Dataset Overview & Taxonomy

The SIEVE-Net dataset is partitioned across 14 mutually exclusive primary classes, 4 multi-label hazard flags, and 12 supervised micro-part classes.

### Primary Classes (14)
- **Class 0: `not_ewaste` (First-Class Hard Negatives):**
  $\ge 30$ everyday household categories that visually or materially resemble electronics (cardboard shipping boxes, ceramic mugs, plastic water bottles, hardcover books, stainless steel lunchboxes, plastic toys, clothing, wooden furniture).
- **Classes 1–13 (E-Waste Categories):**
  `phone_tablet`, `computer_equipment`, `display_tv_monitor`, `charger_adapter`, `cable_wire`, `battery_pack_powerbank`, `small_battery_cells`, `circuit_board_loose`, `audio_equipment`, `peripheral_input`, `small_appliance`, `large_appliance`, `lighting`.

### Hazard Annotations (4 Multi-Label Categories)
1. `lithium_battery_likely`: Found in smartphones, power banks, laptops, cordless tools.
2. `mercury_lamp`: Cold cathode fluorescent lamps (CCFL) in older LCD monitors and fluorescent bulbs.
3. `crt_display`: Cathode ray tubes with leaded funnel glass and high vacuum implosion risk.
4. `damaged_battery_visible`: Punctured, swollen, crushed, or corroded battery cells requiring immediate hazmat isolation.

### Supervised Named Parts (12)
`charging_port`, `circuit_board`, `battery_cell`, `screen_panel`, `connector_pins`, `wire_bundle`, `lamp_tube_or_base`, `speaker_grille_or_cone`, `power_plug_pins`, `heatsink_or_fan`, `weee_crossed_bin_symbol`, `keyboard_key_grid`.

---

## 2. Splits & Leakage Prevention (Section 7.3 Compliance)

To prevent visual correlation leakage (where sequential video frames or identical backgrounds appear in both train and test splits):
- **Grouping Key:** All images are clustered strictly by `session_id` (a single physical collection location, device model, and day).
- **Partition Ratio:**
  - **Train Split (70%):** Model training.
  - **Validation Split (15%):** Hyperparameter tuning, early stopping, and threshold calibration.
  - **Locked Test Set (15%):** Evaluated strictly once during final benchmark reporting.
- **Cryptographic Lock:** The locked test set is hashed with SHA-256 and locked under `data/splits/locked_test_manifest.sha256`.

---

## 3. Synthetic Smoke Dataset vs Real Data Policy

- **Synthetic Smoke Dataset (`data/smoke/data_raw`):** 280 procedural images generating controlled geometries, colors, and textures for automated CI/CD and pipeline validation without hallucinating real-world performance.
- **Kaggle External Dataset Integration:** When external real datasets are mounted (e.g. via `ml/download_kaggle_dataset.py`), they are automatically audited by `data/validate.py` to ensure zero class collisions and valid metadata before training.
- **Privacy & Anonymity:** Strict face-blurring and personal data removal protocols are enforced per `docs/DATA_COLLECTION_GUIDE.md`.
