# NOVELTY AUDIT: Technical Prior Art & Defensible Claims

**Project:** SIEVE-Net (Staged Inference for E-waste Verification at the Edge)  
**Author:** Kapish Mittal  
**Scope:** United Nations Presentation & Global Scientific Defense  
**Policy:** Zero Hyperbole, Empirical Honesty, Strict Provenance

---

## 1. Prior Art Dissection & Component Provenance

To ensure defensible academic and industrial credibility before the United Nations and peer review, every structural block of SIEVE-Net is categorized below into its historical antecedent and our specific novel composition.

| Component | Classical Prior Art | Prior Art Citations | Our Specific Contribution & Claim |
|---|---|---|---|
| **Depthwise-Separable Inverted Bottleneck** | Inverted Residuals with Linear Bottlenecks | MobileNetV2 (Sandler et al., 2018), EfficientNet (Tan & Le, 2019) | **Inherited Primitive:** We do not claim invention of inverted bottlenecks. Used as an established building block for efficient representation. |
| **Dual-Rate Depthwise Fusion (DRB)** | Atrous Convolution, Multi-Scale Spatial Receptive Fields | DeepLabv3+ (Chen et al., 2018), Dilated Residual Networks (Yu et al., 2017) | **Modest Variation:** Symmetrical dual-rate depthwise convolutions ($d=1, d=2$) fused by addition ($\text{ReLU6}(a+b)$) strictly at stride 1, dropping dilation at stride 2 to guarantee 100% LiteRT INT8 built-in operator compatibility without custom ops or kernel degradation. |
| **Early-Exit Viewfinder Cascade** | Multi-Branch Early Exit Architectures | BranchyNet (Teerapittayanon et al., 2016), MSDNet (Huang et al., 2017) | **Inherited Architectural Concept / Tailored Deployment:** Tailored into a physical dual-trunk INT8 cascade (`sieve_trunk_a_int8.tflite` vs `sieve_trunk_b_int8.tflite`) where the app halts at Stage 1 ($24 \times 24 \times 32$, 17.8M MACs) whenever non-object or non-e-waste is confirmed, preserving battery on 2GB phones. |
| **Part-Sieve Evidence Head** | Prototype Networks, Concept Bottleneck Models | ProtoPNet (Chen et al., 2019), Concept Bottleneck Models (Koh et al., 2020) | **New Integer-Only Formulation:** Prior prototype networks rely on L2 distance, cosine distances, or softmax attention over spatial locations, which suffer severe accuracy loss or runtime explosion under full INT8 quantization. Our Part-Sieve head utilizes a $1 \times 1$ pointwise projection ($96 \rightarrow 48$ prototypes) followed by bounded $[\text{GlobalMax} \parallel \text{GlobalAvg}]$ and a strictly non-negative readout matrix ($\mathbf{W} \ge 0$). This guarantees that micro-parts can only add evidence for a class, providing coarse heatmaps without detection bounding boxes. |
| **Polarity-Split Fixed Edge Bank (S0b)** | Oriented Wavelets, Gabor Filters, Scattering Networks | Mallat (2012) Scattering Transform, Classic Sobel Banks | **Tailored Int8 Adaptation:** A fixed 8-channel convolution (4 orientations $\times 2$ opposite polarities, `trainable=False`) preserving both positive and negative gradient excursions prior to ReLU6, relieving initial layers from relearning edge primitives from scratch. |
| **Composition for Ultra-Low-RAM Offline E-Waste Triage** | Mobile Waste Classification Apps | TrashNet (Yang & Thung, 2016), TACO (Proença & Simões, 2020), CleanSpot | **Defensible Core Claim:** Purpose-built edge vision system trained strictly from scratch with zero imported pretrained weights, executing dual-trunk e-waste and hazard triage in $\le 322\text{ KB}$ INT8 flatbuffers on physical 2GB RAM smartphones without internet access. |

---

## 2. Approved Wording for Public Disclosures

- **Approved Phrases:**
  - *"A purpose-built, int8-quantized edge architecture for evidence-based e-waste triage."*
  - *"A non-negative prototype evidence head co-designed specifically for low-end integer runtimes."*
  - *"An energy-conserving dual-trunk cascade saving up to 40% compute on continuous camera viewfinders."*
- **Disallowed Phrases:**
  - *"The world's first AI for e-waste"* (False: commercial and academic waste classifiers exist).
  - *"100% infallible hazard detection"* (False: obscured internal batteries cannot be visually detected).
  - *"Revolutionary replacement for all neural architectures"* (Hyperbole: built on sound, well-studied convolution primitives).

---

## 3. Verified Novelty Checklist
- [x] Zero external weights downloaded or imported.
- [x] Zero foreign architectures imported from `keras.applications`, `torchvision`, `timm`, or `huggingface`.
- [x] Verified 100% compliance with Google LiteRT built-in INT8 operators (no Flex ops, no custom kernels).
- [x] Reproducible scripts logging every parameter to `results/ledger.csv`.
