# UNITED NATIONS EXECUTIVE BRIEF: SIEVE-NET
## Decentralized, Offline AI for E-Waste Segregation & Hazard Mitigation on Low-Cost Hardware

**Presented Under:** United Nations Sustainable Development Goal 12 (Responsible Consumption & Production) & Goal 3 (Good Health & Well-Being)  
**Author:** Kapish Mittal  
**Deployment Target:** Global South, Municipal E-Waste Sorting Facilities, Informal Sector Recyclers  

---

### 1. The Global Challenge: The E-Waste Crisis in the Informal Sector
According to the UN Global E-waste Monitor, the world produces over 62 million metric tonnes of electronic waste annually, with less than 22.3% documented as formally collected and recycled. In developing economies across Africa, South Asia, and Latin America:
- **Informal Recyclers & Scrap Workers** manually dismantle equipment without protective equipment, risking acute exposure to neurotoxic mercury, lead, and carcinogenic flame retardants.
- **Lithium-Ion Battery Fires** occur frequently in municipal waste streams due to improper sorting of damaged power banks and electronic toys into domestic garbage trucks and shredders.
- **Cloud AI Fails the People on the Frontline:** Standard commercial artificial intelligence solutions rely on high-bandwidth cloud APIs or high-end smartphones ($400+) with dedicated NPUs, rendering them completely inaccessible to informal waste pickers and regional recycling centers who operate $50 Android devices with 2GB RAM and intermittent or zero internet access.

---

### 2. The Solution: Purpose-Built Edge AI (SIEVE-Net)
SIEVE-Net (*Staged Inference for E-waste Verification at the Edge*) is a from-scratch, integer-quantized vision architecture co-designed from the silicon up to solve this triage crisis locally on the device:

1. **100% Offline & Private:** Operates entirely without an internet connection. The application does not declare or require network permissions, guaranteeing data sovereignty and functionality in remote scrap yards.
2. **Dual-Trunk Energy Saving:** Employs an early-exit gate (`Model A`) taking under 15 milliseconds. When scanning background or everyday objects, inference halts immediately—conserving battery life and preventing thermal throttling on ultra-low-cost phones.
3. **Explainable Part-Evidence:** Rather than functioning as an uninterpretable "black box," SIEVE-Net verifies e-waste based on visible subcomponents (charging ports, printed circuit boards, battery cells, CRT display funnels) and highlights heatmaps directly on the operator's screen.
4. **Asymmetric Hazard Alerts:** Missing a hazardous lithium cell is weighted $5\times$ more critically than a false alarm, triggering immediate visual alerts: *"Damaged Battery Detected — Do Not Puncture or Dismantle."*

---

### 3. Empirical Hardware & Budget Validation
Every metric below was empirically measured on our test harness and validated against strict hardware ceilings:

| Hardware Metric | Budget Ceiling | Measured Performance | Margin |
|---|---|---|---|
| **Model Size (INT8)** | $\le 1,200\text{ KB}$ | **322.5 KB** | **73.1% below budget** |
| **Active Parameters** | $\le 800,000$ | **330,229** | **58.7% below budget** |
| **Compute Complexity (MACs)** | $\le 120\text{ M}$ | **63.3 M** | **47.3% below budget** |
| **Early-Exit Gate Complexity** | $\le 20\text{ M}$ | **17.9 M** | **11.2ms CPU execution** |
| **Peak Tensor Activation** | $\le 200\text{ KB}$ | **162.0 KB** | **Fits in cache / tiny arena** |
| **Target Hardware** | Physical Android (2GB RAM) | CPU-only, 2 threads | Real-time on low-end chips |

---

### 4. Ethical Commitments & Limitations
- **Safety First:** The system never instructs untrained workers to crack open batteries or solder electronics.
- **Limits of Computer Vision:** Vision models cannot detect internal, punctured, or obscured batteries hidden inside intact plastic shells. The system clearly flags this limitation in its user guidance.
- **Decentralized Reproduction:** The entire architecture, training harness, and quantization pipeline are provided with a single reproducible command (`make reproduce`), free of proprietary model zoo weights.
