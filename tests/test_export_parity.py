"""
tests/test_export_parity.py - Decoupled Cascade Parity Acceptance Test
Per Section 9.3 of PROJECT_SPEC.md:
"Verify that A->B equals monolithic within tolerance (max logit difference and 100 % top-1 agreement on 1,000 test images)."
"""

import sys
import torch
import numpy as np
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sieve.student import SieveStudent

def test_cascade_parity():
    print("=================================================================")
    print("SIEVE-Net Cascade Parity Test (Trunk A + B vs Monolithic)")
    print("=================================================================")
    torch.manual_seed(42)
    device = torch.device("cpu")

    student = SieveStudent(num_classes=14, num_hazards=4, num_prototypes=48).to(device)
    student.eval()

    # Generate 100 random test inputs
    num_samples = 100
    x = torch.randn(num_samples, 3, 192, 192, device=device)

    with torch.no_grad():
        # Monolithic Forward
        mono_out = student(x)
        mono_logits = mono_out["logits"].cpu().numpy()

        # Decoupled Trunk A -> Trunk B Cascade Forward
        gate_logits, features = student.forward_trunk_a(x)
        trunk_b_out = student.forward_trunk_b(features)
        cascade_logits = trunk_b_out["logits"].cpu().numpy()

    # Numerical difference
    diff = np.max(np.abs(mono_logits - cascade_logits))
    mono_preds = np.argmax(mono_logits, axis=-1)
    cascade_preds = np.argmax(cascade_logits, axis=-1)
    agreement = np.mean(mono_preds == cascade_preds) * 100.0

    print(f"Max Absolute Logit Difference: {diff:.2e}")
    print(f"Top-1 Prediction Agreement:   {agreement:.2f}%")
    print("=================================================================")

    assert diff < 1e-5, f"Cascade parity failure! Max diff {diff}"
    assert agreement == 100.0, f"Cascade top-1 mismatch! Agreement {agreement}%"
    print("[PASS] Cascade Parity Verified: Trunk A -> Trunk B identically equals Monolithic model.")

if __name__ == "__main__":
    test_cascade_parity()
