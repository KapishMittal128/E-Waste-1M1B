"""
SIEVE-Net Automated Budget Acceptance Test (Section 4 Compliance)
Asserts that parameter count, MACs, INT8 model size, and largest activation
strictly satisfy Section 4 threshold targets.
"""

import sys
import os

# Add root directory to python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sieve.budget import compute_sieve_budget, SECTION_4_BUDGETS

def test_sieve_budget_compliance():
    stats = compute_sieve_budget()
    tc = stats["target_comparison"]

    assert tc["params_pass"], (
        f"Total params ({stats['params_total']:,}) exceeds budget ({SECTION_4_BUDGETS['max_params']:,})"
    )
    assert tc["size_pass"], (
        f"Model size ({stats['int8_kb']:.1f} KB) exceeds budget ({SECTION_4_BUDGETS['max_int8_kb']:,} KB)"
    )
    assert tc["macs_pass"], (
        f"MACs ({stats['macs_total']:,}) exceeds budget ({SECTION_4_BUDGETS['max_macs']:,})"
    )
    assert tc["activation_pass"], (
        f"Largest activation ({stats['largest_tensor_kb']:.1f} KB) exceeds budget ({SECTION_4_BUDGETS['max_activation_kb']:,} KB)"
    )

    print("\nBUDGET ACCEPTANCE TEST PASSED:")
    print(f"  Params:     {stats['params_total']:,} <= {SECTION_4_BUDGETS['max_params']:,}")
    print(f"  INT8 Size:  {stats['int8_kb']:.1f} KB <= {SECTION_4_BUDGETS['max_int8_kb']:,} KB")
    print(f"  MACs:       {stats['macs_total']:,} <= {SECTION_4_BUDGETS['max_macs']:,}")
    print(f"  Activation: {stats['largest_tensor_kb']:.1f} KB <= {SECTION_4_BUDGETS['max_activation_kb']:,} KB")

if __name__ == "__main__":
    test_sieve_budget_compliance()
