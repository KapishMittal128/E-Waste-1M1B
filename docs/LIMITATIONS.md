# SIEVE-Net: Limitations, Known Failure Modes & Safety Audit

**Project:** SIEVE-Net (Staged Inference for E-waste Verification at the Edge)  
**Document:** `docs/LIMITATIONS.md`  
**Purpose:** Honest reporting of failure boundaries for United Nations presentation and technical review  

---

## 1. Systemic Risk & Failure Modes Matrix (Section 15 Compliance)

Every operational boundary is tracked with its empirical risk status, mitigation strategy, and user advisory.

| # | Known Risk / Failure Boundary | Status | Empirical Impact & Mechanism | Mitigation Strategy |
|---|---|---|---|---|
| **R1** | **Batteries Hidden Inside Products** | **Fundamental Limit (Visual AI)** | If an item (e.g., toy, electric toothbrush) has an internal lithium pouch completely sealed inside an intact plastic housing, no camera can detect it. | Explicit safety prompt on screen: *"Warning: Sealed devices may contain internal batteries. Never shred uninspected electronic housings."* |
| **R2** | **Household Look-Alikes (Hard Negatives)** | **Mitigated by Design** | Stainless steel lunchboxes, books, plastic food containers, and wooden boxes share rectangular silhouettes with laptops and hard drives. | Class 0 reserved strictly for `not_ewaste` with 30+ hard-negative look-alikes. Part-Sieve head requires positive micro-part evidence (ports, PCB traces, pins) before classifying as e-waste. |
| **R3** | **Ultra-Small Items (SIM trays, Earbuds)** | **Measured Limitation** | Resolution of 192×192 yields very few pixels for items < 1 cm, leading to potential gate false-negatives. | Recommend user approach camera within 15–20 cm or flag macro-mode in camera pipeline. |
| **R4** | **Multi-Object Piles & Clutter** | **Measured Limitation** | Single-crop classification assigns dominant class; multiple mixed items in a single bin may produce ambiguous evidence. | Guide operators to isolate individual items or use video walk-around sweep before dismantling. |
| **R5** | **Heavy Soil, Dust, Corroded Surfaces** | **Mitigated by Augmentation** | Scrap yard items stored in open weather develop rust, dirt, and mud obscuring PCB silkscreen and connectors. | SieveAugmentor simulates dust/scratch overlays, sensor noise, gamma shift, and low contrast during training. |
| **R6** | **Domain Shift Across Geographic Regions** | **Open Evaluation** | Electronic brands and casing styles in South Asia differ from European or North American e-waste. | Dataset splits strictly enforce session/location grouping; locked test set carved from distinct sessions. |
| **R7** | **False Sense of Security on 'Not E-Waste'** | **Safety Guardrail** | If user misinterprets a low-confidence reading as proof an object is safe to incinerate or put in municipal landfills. | Asymmetric loss penalty: False negative on e-waste is penalized 3×; false negative on hazardous items penalized 5×. |

---

## 2. Ethical Commitments & Guidance Verification
- **Dismantling Prohibition:** Software must never instruct untrained users to pry open swollen lithium cells, discharge high-voltage CRT tubes, or expose mercury backlights.
- **Guidance Status:** All disposal recommendations in `configs/guidance.yaml` are explicitly stamped `NEEDS EXPERT REVIEW` until confirmed by regional environmental authorities.
