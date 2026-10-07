# SIEVE-Net: Implementation Spec for Antigravity

**SIEVE** = *Staged Inference for E-waste Verification at the Edge* (working name; rename freely, but run a name-collision search first).

A from-scratch, int8-quantized, evidence-based vision model that detects e-waste and separates it from normal household goods on a phone with 2 GB of RAM, fully offline.

---

## 0. How to use this document

1. Create an empty project folder. Save this file in its root as `PROJECT_SPEC.md`.
2. Open the folder in Antigravity. If your version offers a planning mode, use it, and approve the plan one phase at a time.
3. Paste the kickoff prompt below as your first message.

### KICKOFF PROMPT (paste this)

```
You are the lead ML engineer for a project called SIEVE-Net. Read PROJECT_SPEC.md in full before doing anything else. It is the single source of truth.

Operating rules:
1. Execute Phases 0 to 8 in order. At the end of each phase: run that phase's acceptance tests, write reports/phase_<N>.md (what was built, what was measured, what failed), append every non-trivial choice to DECISIONS.md, and STOP for my approval before starting the next phase.
2. Do not guess. If the spec states a default, use it and log it in DECISIONS.md. If the spec is silent, pick the simplest option consistent with Sections 1, 2 and 6, log it, and continue. If an ambiguity would change the architecture, the budgets, the data policy or a claim I will make in public, STOP and ask me.
3. Never fabricate results. Every number in any report, README, model card or slide must be produced by a script from logged runs (see Section 2). Synthetic smoke-test data may only be used to test pipelines and must be labeled SYNTHETIC wherever it appears.
4. Never use pretrained weights, and never import or copy a model architecture definition from any library or repository (see Section 2).
5. Verify every library API, package name and version against current official documentation before using it. Tooling changes quickly; do not rely on memory.
6. Detect the available hardware in Phase 0 and adapt training scale. If no suitable GPU exists, make every training script runnable unchanged on a free cloud notebook GPU and tell me exactly how.
7. Keep everything reproducible: pinned dependencies, fixed seeds, config files for every run, git commits per phase.

Begin with Phase 0.
```

---

## 1. Mission and non-negotiables

**Mission.** Let anyone point a low-end phone camera at an object and learn, in under a second and with no internet, (a) whether it is e-waste, (b) what kind, (c) whether it carries a visible hazard (battery, mercury lamp, CRT glass), and (d) *why the model thinks so* (which parts it found). This will be presented to an international audience, so every claim must be defensible.

**Non-negotiables**

| # | Requirement |
|---|---|
| N1 | The network architecture is designed by us. No pretrained weights. No architecture definitions imported from `keras.applications`, TF Hub, torchvision, timm, Hugging Face or copied from any repo. |
| N2 | Weights are trained from random initialization on data we collect and document. |
| N3 | Quantization uses Google's stack: LiteRT (formerly TensorFlow Lite) with full-integer int8 via quantization-aware training (QAT) from the TensorFlow Model Optimization Toolkit, with post-training integer quantization as a fallback. Verify current API status first (see 6.4). |
| N4 | Runs on CPU only (no NPU/GPU assumptions) on a physical Android phone with 2 GB RAM. |
| N5 | 100% on-device inference. The demo app must not declare the INTERNET permission. |
| N6 | The inference graph uses only standard layers that convert to built-in int8 LiteRT ops. No Flex ops, no custom ops. |
| N7 | "Better than the alternatives" is a claim that must be proven with baselines and ablations (Section 10). |

**What is allowed.** Open-source *tooling* (TensorFlow/Keras, NumPy, OpenCV, pytest, Android SDK, CameraX, LiteRT runtime) is fine. Standard *training techniques* (augmentation, label smoothing, EMA, distillation, self-supervision, QAT) are fine; they are methods, not architectures. Document them as such.

**What is new (the honest claim).** The network design (Dual-Rate Blocks, Part-Sieve evidence head, polarity-split fixed edge prior, quantization-co-designed op set), the cascade split, the named-part supervision scheme and the trained weights. Individual primitives (depthwise convolution, inverted bottlenecks, early exit, prototype-style heads) have prior art; Section 5.7 and the Novelty Audit deliverable record exactly what is inherited and what is new.

---

## 2. Honesty, provenance and anti-hallucination rules

1. **Provenance guard.** Create `tests/test_provenance.py` that fails CI if (a) any file imports `tf.keras.applications`, `tensorflow_hub`, `torchvision.models`, `timm`, `transformers` or similar model zoos inside `sieve/`, (b) any weight file is loaded that was not produced by our own training run (check by hashing against `runs/*/manifest.json`), or (c) the model graph contains layers outside the allowed list in 6.1.
2. **Baseline quarantine.** Standard architectures (e.g. a MobileNet-family or EfficientNet-Lite-family network) may exist ONLY under `benchmarks/baselines/` for apples-to-apples comparison, trained from scratch on our data by our pipeline, and are never imported by `sieve/`, `export/` or `android/`. Delete-safe: removing that folder must not break the product.
3. **Results ledger.** Every training/eval/benchmark run appends a row to `results/ledger.csv` (run id, git hash, config hash, seed, dataset version, metrics). Reports are generated from the ledger by script. Hand-typed numbers in docs are forbidden.
4. **Estimates are not results.** Parameter, MAC, size and latency figures in this document are *design estimates*. Measure the real values and never copy my estimates into any report.
5. **Seeds and variance.** Report every headline metric as mean ± std over 3 seeds, with bootstrap 95% confidence intervals on the locked test set.
6. **Targets are not edited after seeing results.** Section 4 targets are initial goals. If missed, report the miss and propose a fix; do not quietly relax them.
7. **Locked test set.** Created once in Phase 1, stored read-only with a SHA-256 manifest, evaluated only in Phase 6 and for the final report. Tuning on it is forbidden. Any accidental exposure must be logged in DECISIONS.md and the set re-collected.
8. **No claim without evidence.** "Runs on a 2 GB phone" requires measurements on a physical device with ≤ 2 GB RAM. Emulator numbers are labeled EMULATED and never stand in for it.
9. **Limits are reported.** Every report includes a "Known failures and limits" section populated from error analysis.

---

## 3. Problem definition and I/O contract

**Input.** One RGB camera frame, aspect-preserving center crop, resized to **192×192** (sweep 160/192/224 in Phase 3). Quantized uint8/int8 input; mean/scale normalization is folded into the input quantization parameters, not done in app code.

**Outputs (one forward pass produces all of them)**

| Output | Shape | Meaning |
|---|---|---|
| `gate` | 3 | {e-waste-likely, not-e-waste-likely, no-object/background} from the early tap |
| `logits` | C = 14 | class 0 = `not_ewaste`, classes 1..13 = e-waste categories (default taxonomy below) |
| `hazard` | H = 4 | multi-label logits |
| `part_maps` | 12×12×P (P = 48) | per-part presence maps, used for heatmaps and localization |
| derived in app | scalar | `p_ewaste = 1 − softmax(logits)[0]`, abstain flag, top-3 evidence parts |

**Default taxonomy** (editable in `configs/taxonomy.yaml`; all code must read class/hazard/part counts from this file, never hard-code them):

- Classes: `not_ewaste`, `phone_tablet`, `computer_equipment`, `display_tv_monitor`, `charger_adapter`, `cable_wire`, `battery_pack_powerbank`, `small_battery_cells`, `circuit_board_loose`, `audio_equipment`, `peripheral_input`, `small_appliance`, `large_appliance`, `lighting`
- Hazards: `lithium_battery_likely`, `mercury_lamp`, `crt_display`, `damaged_battery_visible`
- Named parts (supervised, 12): `charging_port`, `circuit_board`, `battery_cell`, `screen_panel`, `connector_pins`, `wire_bundle`, `lamp_tube_or_base`, `speaker_grille_or_cone`, `power_plug_pins`, `heatsink_or_fan`, `weee_crossed_bin_symbol`, `keyboard_key_grid`
- Free parts (unsupervised, 36): discovered by the model

**Hard negatives are first-class.** `not_ewaste` must contain at least 30 look-alike household categories (plastic toys, metal utensils, cardboard boxes, packaged food, books, glass, jars, clothes, steel tiffins, wooden items, ordinary plastic containers, decor with LEDs, toy phones, chocolate/medicine boxes shaped like electronics).

---

## 4. Budgets and initial targets

All are initial goals; see Section 2, rule 6.

| Metric | Target | Notes |
|---|---|---|
| Student parameters | ≤ 0.8 M | design estimate ≈ 0.4–0.6 M |
| Total int8 model files (trunk A + trunk B) | ≤ 1.2 MB | |
| MACs per full forward at 192² | ≤ 120 M | design estimate ≈ 70 M |
| Largest single activation tensor | ≤ 200 KB int8 | keeps the tensor arena tiny |
| p95 latency, full model, 2 CPU threads, physical 2 GB phone | ≤ 80 ms | |
| p95 latency, gate only | ≤ 15 ms | |
| Peak app memory (PSS) while scanning | ≤ 180 MB total, ≤ 25 MB attributable to model + buffers | camera + UI dominate |
| float → int8 accuracy drop (macro-F1) | ≤ 1.0 pt | |
| float vs int8 top-1 agreement | ≥ 98 % | |
| Binary e-waste recall at precision ≥ 90 % (locked test set) | aspirational ≥ 95 % | report the real number |
| Expected calibration error (after calibration) | ≤ 0.05 | |
| Average compute saved by the gate on live-stream test clips | ≥ 40 % at ≤ 0.5 pt recall loss | |

**Asymmetric cost.** Missing a hazardous e-waste item is worse than a false alarm. Threshold selection (gate, abstain, hazard) must use the cost matrix in `configs/costs.yaml` (default: false-negative on e-waste = 3× false-positive; false-negative on a hazard flag = 5×).

---

## 5. Architecture specification

### 5.1 Overview

```
 RGB 192×192
   │
 S0 Stem:  learned conv (16 ch)  ‖  fixed polarity-split edge bank (8 ch)   → 48×48×24
   │
 S1: 2 × DRB(e=3)                                                       → 24×24×32
   ├──► GATE head (GAP → FC 3)                         ┐  Model A: sieve_trunk_a_int8.tflite
   │                                                   ┘  (outputs: gate + 24×24×32 features)
 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ split point ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
   │
 S2: 3 × DRB(e=4), first stride 2                                       → 12×12×64   ┐ Model B:
 S3: 3 × DRB(e=4), stride 1                                             → 12×12×96   │ sieve_trunk_b_int8.tflite
   ├──► PART-SIEVE head: 1×1 conv → 48 part maps → max‖avg pool → 96-d evidence
   │        ├─► non-negative FC → class logits (evidence)
   │        └─► FC → hazard logits
   ├──► CONTEXT branch: DW s2 → PW 128 → GAP → FC → class logits (scaled, dropout in training)
   └──► part_maps (12×12×48) exported                                                    ┘
        final logits = evidence_logits + α · context_logits
```

At run time the app runs Model A on every sampled frame. If the gate says *no object* (or is confidently *not-e-waste* and the user is in fast-scan mode), it stops. Otherwise it feeds Model A's feature tensor to Model B. This is how a live viewfinder saves battery: most frames are background.

### 5.2 Layer-by-layer table (default student, "SIEVE-S")

| Stage | Op | Out shape | Notes |
|---|---|---|---|
| In | uint8/int8 image | 192×192×3 | normalization folded into input quant params |
| S0a | Conv 3×3, s2, 3→16, BN, ReLU6 | 96×96×16 | learned |
| S0b | Fixed 1×1 luminance conv (3→1), then fixed 5×5 s2 conv 1→8, then per-channel trainable gain + bias, ReLU6 | 96×96×8 | "polarity-split edge bank": 4 orientations × 2 polarities (+ and − edge) so ReLU keeps both signs; kernels `trainable=False` |
| S0c | Concat(S0a, S0b) → DW 3×3 s2 → BN → ReLU6 → PW 24→24 → BN → ReLU6 | 48×48×24 | |
| S1 | DRB(24→32, e=3, s2), DRB(32→32, e=3, s1) | 24×24×32 | |
| Gate | GAP → FC 32→3 | 3 | trained with its own loss |
| S2 | DRB(32→64, e=4, s2), 2 × DRB(64→64, e=4, s1) | 12×12×64 | |
| S3 | DRB(64→96, e=4, s1), 2 × DRB(96→96, e=4, s1) | 12×12×96 | |
| Part projection | PW 96→P(48), BN, ReLU6 | 12×12×48 | each output channel's kernel is a part prototype |
| Evidence | GlobalMax(48) ‖ GlobalAvg(48) | 96 | |
| Readout | FC 96→C, kernel constrained ≥ 0 (non-negative) | C | |
| Context | DW 3×3 s2, PW 96→128, BN, ReLU6, GAP, FC 128→C | C | |
| Hazard | FC 96→H | H | |

### 5.3 Dual-Rate Block (DRB)

```
DRB(c_in, c_out, e, stride):
    h = PW1x1(x: c_in → c_in·e) + BN + ReLU6
    if stride == 1:
        a = DW3x3(h, dilation=1) + BN
        b = DW3x3(h, dilation=2) + BN          # second receptive-field rate
        h = ReLU6(a + b)                       # dual-rate fusion
    else:
        h = ReLU6(DW3x3(h, stride=2) + BN)     # single rate when striding
    y = PW1x1(h: → c_out) + BN                 # linear bottleneck, no activation
    if stride == 1 and c_in == c_out: y = y + x
    return y
```

### 5.4 Part-Sieve head: the central idea

Electronic waste is recognized by its *parts* (ports, boards, cells, connectors), not by overall shape. The head makes that explicit:

1. Part maps `M = ReLU6(BN(PW(F)))`, 12×12×48. Channel *k* is "how strongly is part-type *k* present at each location".
2. Evidence `E = [GlobalMax(M) ‖ GlobalAvg(M)]` (96-d): max says "is the part anywhere", avg says "how much of the object is it".
3. Class evidence = non-negative FC on E. Parts can only add evidence for a class, which keeps the explanation honest ("found circuit_board + battery_cell → battery_pack"). Class 0 (`not_ewaste`) gets its evidence mostly from the context branch and its bias; this is expected.
4. Context branch supplies global shape/material cues, scaled by α ∈ [0,1] (learned in training, folded into FC weights at export) and **context-dropout** (zero the context path with p = 0.3 per sample in training) so the head cannot ignore part evidence.
5. The first 12 part channels are *named* and supervised by box annotations; the other 36 are free and regularized for diversity. A per-image heatmap is simply a chosen channel of `M` upsampled: free coarse localization, no detection head.

Why this is quantization-friendly: it is built only from 1×1 convs, max/mean pooling and a fully-connected layer on bounded (ReLU6) activations. No L2 distance, cosine normalization, softmax attention or log operations inside the network.

### 5.5 Teacher ("SIEVE-T", also from scratch)

Same family, larger: width ×2.5, blocks ×1.5, input 224, P = 96, float32 only, trained longer. Used offline to distill into SIEVE-S. The teacher is our own architecture trained on our data, so the "no external models" rule still holds. Teacher never ships.

### 5.6 Ablation switches

`edge_bank`, `dual_rate`, `part_sieve`, `nonneg_readout`, `context_dropout`, `named_part_supervision`, `cascade_gate`, `distillation`, `range_regularizer`, `qat`, `width_mult`, `input_res`, `num_prototypes`.

### 5.7 Inherited vs. new (feeds `docs/NOVELTY_AUDIT.md`)

| Component | Prior art to cite and compare against | What we claim |
|---|---|---|
| Depthwise-separable inverted bottleneck | MobileNetV2-style blocks | inherited |
| Dual dilation rates fused by addition | multi-rate / atrous designs | modest variation, claim only if ablation shows benefit |
| Early-exit cascade | BranchyNet, MSDNet-style early exit | inherited idea; ours is exported as two int8 graphs with an app-side decision |
| Prototype/part-evidence heads | ProtoPNet-family, concept-bottleneck models | inherited idea; ours is integer-only, 1×1-conv based, with named-part supervision and context-dropout |
| Fixed oriented-edge prior | classic Gabor/Sobel filters, scattering-style priors | inherited idea; polarity-split int8 version |
| Quantization-aware range regularizer | QAT/range-regularization literature | experimental; claim only if ablation shows benefit |
| **Composition for e-waste triage under a 2 GB budget with measured on-device results** | to be established by literature search | the claim we can defend if evidence supports it |

---

## 6. Quantization co-design rules (hard constraints)

### 6.1 Allowed inference-graph ops
`Conv2D`, `DepthwiseConv2D` (dilation allowed only where verified), `Dense/FullyConnected`, `BatchNormalization` (folded), `ReLU6`, `Add`, `Concatenate`, `GlobalAveragePooling2D`, `GlobalMaxPooling2D`/`MaxPool`, `Reshape`, `Softmax` only outside the model (apply in app code on dequantized logits).

### 6.2 Forbidden in the inference graph
Swish/GELU/sigmoid activations, squeeze-excite, LayerNorm/GroupNorm, softmax attention, L2/cosine normalization, `tf.math.log/exp`, dynamic shapes, transposes in the hot path, custom ops, Flex ops, batch size ≠ 1.
