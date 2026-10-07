# Phase 0 Tooling & Hardware Verification Report

**Date:** 2026-10-05  
**Project:** SIEVE-Net (Staged Inference for E-waste Verification at the Edge)  
**Host Hardware:**
- **CPU:** 13th Gen Intel(R) Core(TM) i7-13650HX (14 cores, 20 logical threads)
- **Host RAM:** 23.78 GB
- **GPU:** NVIDIA GeForce RTX 4060 Laptop GPU (CUDA capable)
- **OS:** Windows 11 (build-compliant for LiteRT/TensorFlow tooling)

---

## 1. LiteRT & Quantization Tooling Verification (Section 6.4)

### Current API Status
1. **LiteRT (Formerly TensorFlow Lite):**
   - Package: `ai-edge-litert` (official successor to `tflite-runtime` under Google AI Edge).
   - Python converter: `tf.lite.TFLiteConverter` / `ai_edge_litert.interpreter.Interpreter`.
   - Android runtime: `com.google.ai.edge.litert:litert:1.0.1` (or `org.tensorflow:tensorflow-lite:2.16.1` with XNNPACK delegate).
2. **TensorFlow Model Optimization Toolkit (TF-MOT) QAT Compatibility:**
   - Keras 3 compatibility: TF-MOT QAT (`tfmot.quantization.keras.quantize_model`) historically requires `tf_keras` (Keras 2 emulation) when paired with modern TensorFlow 2.16+.
   - Fallback ladder verified:
     - **Rung 1 (Primary):** Keras QAT via `tf_keras` or built-in standard integer operations.
     - **Rung 2 (Reliable Fallback):** Post-Training Full Integer Quantization (PTQ) with representative calibration dataset (≥ 500 samples), guaranteeing built-in int8 ops.
     - **Rung 3 (Self-contained):** Standalone zero-dependency integer quantization packager (already verified in `ml/export_quantized_tflite.py`).

---

## 2. In-Browser & Native Deployment Target
- **In-Browser WebAssembly:** LiteRT / TFLite WebAssembly runtime with SIMD support (XNNPACK CPU, thread count = 1 or 2).
- **Physical Device Target:** Android phone with ≤ 2 GB RAM (e.g. Android Go edition), Cortex-A53, CPU only, no GPU/NPU assumption, zero INTERNET permission.
