# Phase 2 Report: SIEVE-Net Architecture Implementation & Hardware Budget Audit

**Project:** SIEVE-Net (Staged Inference for E-waste Verification at the Edge)  
**Date:** 2026-10-05  
**Author:** Kapish Mittal  
**Status:** COMPLETE (Ready for User Confirmation)

---

## 1. What Was Built
1. **Stem (S0) — `sieve/stem.py`:**
   - **S0a:** Learned $3 \times 3$ convolution, stride 2 ($3 \rightarrow 16$), BN, ReLU6 ($96 \times 96 \times 16$).
   - **S0b:** Polarity-Split Fixed Edge Bank ($3 \rightarrow 1 \rightarrow 8$ ch) with 4 orientations ($0^\circ, 45^\circ, 90^\circ, 135^\circ$) $\times 2$ polarities (+ and - edges) keeping directional gradients through ReLU6. Fixed kernels (`trainable=False`) with trainable per-channel gain and bias.
   - **S0c:** Channel concatenation ($24\text{ ch}$) $\rightarrow$ DW $3 \times 3$ stride 2 $\rightarrow$ PW ($24 \rightarrow 24$), yielding $48 \times 48 \times 24$.
2. **Dual-Rate Block (DRB) — `sieve/blocks.py`:**
   - Inverted bottleneck with linear bottleneck projection (no activation on final projection).
   - Stride 1: Dual depthwise convolutions (rate 1 and rate 2) fused by addition: $\text{ReLU6}(a + b)$.
   - Stride 2: Single-rate depthwise convolution to guarantee 100% conversion to standard LiteRT operators.
3. **Auxiliary Heads — `sieve/heads.py`:**
   - **Gate Head:** GAP $\rightarrow$ FC ($32 \rightarrow 3$) on Stage 1 ($24 \times 24 \times 32$) for early-exit cascade.
   - **Hazard Head:** Multi-label FC ($96 \rightarrow 4$) on Part-Sieve evidence vector.
4. **Part-Sieve Evidence Head — `sieve/part_sieve.py`:**
   - Generates $12 \times 12 \times 48$ part prototype maps.
   - Evidence vector $E = [\text{GlobalMax} \parallel \text{GlobalAvg}] \in \mathbb{R}^{96}$.
   - Non-negative class readout matrix ($\mathbf{W} \ge 0$), guaranteeing parts only add positive evidence.
   - Context branch with context-dropout ($p=0.3$ in training) and learned scaling factor $\alpha$.
5. **Student Architecture — `sieve/student.py`:**
   - Integrates `SieveStudent` supporting both full monolithic forward pass and decoupled Trunk A / Trunk B cascade execution.
6. **Budget Counter & Shape Tests — `sieve/budget.py`, `tests/test_shapes.py`, `tests/test_budget.py`:**
   - Programmatically validates Section 4 budgets and Section 5.2 layer shapes.

---

## 2. Hardware Budget Audit Results (Section 4 Compliance)

```
======================================================================
SIEVE-S Hardware Budget Verification (Section 4 Compliance Audit)
======================================================================
Metric                  Measured Value      Target Limit      Status
----------------------------------------------------------------------
Student Parameters      330,229             <= 800,000        PASS
  - Trunk A (Gate)      13,891             
  - Trunk B (PartSieve) 316,338            
Model File Size (INT8)  322.5            KB <= 1,200.0 KB     PASS
Multiply-Accumulates    63,288,736          <= 120,000,000    PASS
  - Trunk A MACs        17,892,960          (Gate inference)
  - Trunk B MACs        45,395,776         
Computational Cost      126.58           MFLOPs
Largest Activation      162.0            KB <= 200.0 KB       PASS
======================================================================
```

---

## 3. Test Suite Verification
- `tests/test_provenance.py`: **PASS** (Zero forbidden model zoos detected).
- `tests/test_ops_allowed.py`: **PASS** (100% compliant with built-in LiteRT INT8 operators).
- `tests/test_shapes.py`: **PASS** (All 12 stages match exact I/O contract).
- `tests/test_budget.py`: **PASS** (All parameters, sizes, MACs, and activations strictly under budget).
