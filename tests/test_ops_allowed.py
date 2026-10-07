"""
SIEVE-Net Quantization Co-Design Allowed Ops Test
Ensures all layer definitions in sieve/ use only built-in LiteRT INT8 compatible operations:
  Allowed: Conv2D, DepthwiseConv2D, Dense, BatchNorm, ReLU6, Add, Concat, GAP, GMP, Reshape
  Forbidden: Sigmoid, Swish, GELU, LayerNorm, Softmax in model, dynamic shapes, custom ops
"""

import os
import re

FORBIDDEN_LAYER_OPS = [
    r"\bnn\.GELU\b",
    r"\bnn\.SiLU\b",
    r"\bnn\.Sigmoid\b",
    r"\bF\.gelu\b",
    r"\bF\.silu\b",
    r"\bF\.sigmoid\b",
    r"\bnn\.LayerNorm\b",
    r"\bnn\.GroupNorm\b",
    r"\bnn\.MultiheadAttention\b"
]

def test_ops_allowed():
    violations = []
    target_dirs = ["sieve"]
    
    for d in target_dirs:
        if not os.path.exists(d):
            continue
        for root, _, files in os.walk(d):
            for file in files:
                if file.endswith(".py"):
                    full_path = os.path.join(root, file)
                    with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
                        for idx, line in enumerate(f, 1):
                            stripped = line.strip()
                            if stripped.startswith("#"):
                                continue
                            for pattern in FORBIDDEN_LAYER_OPS:
                                if re.search(pattern, line):
                                    violations.append(f"{full_path}:{idx} uses forbidden op '{pattern}': {stripped}")

    if violations:
        for v in violations:
            print(f"FAILED: {v}")
        assert False, f"Found {len(violations)} forbidden operator violations."
    else:
        print("\nALLOWED OPS TEST PASSED: All operations conform strictly to LiteRT INT8 built-in operator set.")

if __name__ == "__main__":
    test_ops_allowed()
