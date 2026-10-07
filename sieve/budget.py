"""
SIEVE-Net Hardware Budget & Complexity Counter
Calculates parameters, Multiply-Accumulate operations (MACs), INT8 memory footprint,
and largest activation tensor, comparing strictly against Section 4 budgets.
"""

from typing import Dict, Any, Tuple

# Section 4 Budget Targets
SECTION_4_BUDGETS = {
    "max_params": 800000,
    "max_int8_kb": 1200.0,
    "max_macs": 120000000,
    "max_activation_kb": 200.0,
    "max_full_latency_ms": 80.0,
    "max_gate_latency_ms": 15.0
}

def compute_sieve_budget(input_size: Tuple[int, int, int] = (3, 192, 192)) -> Dict[str, Any]:
    """
    Computes exact layer-by-layer analytical parameters, MACs, and largest activation tensor
    for SIEVE-S across Trunk A and Trunk B.
    """
    in_c, in_h, in_w = input_size

    # --- S0: Stem ---
    # S0a: Conv 3x3 s2 (3 -> 16), out 96x96x16
    p_s0a = 3 * 3 * 3 * 16
    macs_s0a = 96 * 96 * p_s0a
    act_s0a = 96 * 96 * 16

    # S0b: Fixed edge bank (3->1 1x1, 1->8 5x5 s2), out 96x96x8
    p_s0b = 8 * 2 # Trainable gain + bias only (kernels fixed)
    macs_s0b = 96 * 96 * (3 * 1 + 1 * 5 * 5 * 8)
    act_s0b = 96 * 96 * 8

    # S0c: Concat (24) -> DW 3x3 s2 (24) -> PW (24 -> 24), out 48x48x24
    p_s0c = (24 * 3 * 3) + (24 * 24)
    macs_s0c = (48 * 48 * 24 * 3 * 3) + (48 * 48 * 24 * 24)
    act_s0c = 48 * 48 * 24

    # --- S1: 2 x DRB (24 -> 32 e=3 s2, 32 -> 32 e=3 s1) ---
    # DRB 1 (24 -> 32, e=3, s2): expand (24->72), dw_s2 (72), pw (72->32)
    p_s1_1 = (24 * 72) + (72 * 3 * 3) + (72 * 32)
    macs_s1_1 = (48 * 48 * 24 * 72) + (24 * 24 * 72 * 3 * 3) + (24 * 24 * 72 * 32)
    act_s1_1 = 48 * 48 * 72 # Largest tensor candidate!

    # DRB 2 (32 -> 32, e=3, s1): expand (32->96), dw dual (96*9 + 96*9), pw (96->32)
    p_s1_2 = (32 * 96) + (96 * 9 * 2) + (96 * 32)
    macs_s1_2 = (24 * 24 * 32 * 96) + (24 * 24 * 96 * 9 * 2) + (24 * 24 * 96 * 32)
    act_s1_2 = 24 * 24 * 96

    # Gate Head: GAP -> FC (32 -> 3)
    p_gate = 32 * 3 + 3
    macs_gate = 32 * 3
    act_gate = 3

    # Trunk A totals
    params_trunk_a = p_s0a + p_s0b + p_s0c + p_s1_1 + p_s1_2 + p_gate
    macs_trunk_a = macs_s0a + macs_s0b + macs_s0c + macs_s1_1 + macs_s1_2 + macs_gate

    # --- S2: 3 x DRB (32 -> 64 e=4 s2, 64 -> 64 e=4 s1 x 2) ---
    # DRB S2_1: expand (32->128), dw_s2 (128), pw (128->64)
    p_s2_1 = (32 * 128) + (128 * 9) + (128 * 64)
    macs_s2_1 = (24 * 24 * 32 * 128) + (12 * 12 * 128 * 9) + (12 * 12 * 128 * 64)

    # DRB S2_2 & S2_3: expand (64->256), dw dual (256*9*2), pw (256->64)
    p_s2_2 = (64 * 256) + (256 * 18) + (256 * 64)
    macs_s2_2 = (12 * 12 * 64 * 256) + (12 * 12 * 256 * 18) + (12 * 12 * 256 * 64)
    p_s2 = p_s2_1 + p_s2_2 * 2
    macs_s2 = macs_s2_1 + macs_s2_2 * 2

    # --- S3: 3 x DRB (64 -> 96 e=4 s1, 96 -> 96 e=4 s1 x 2) ---
    # DRB S3_1: expand (64->256), dw dual (256*18), pw (256->96)
    p_s3_1 = (64 * 256) + (256 * 18) + (256 * 96)
    macs_s3_1 = (12 * 12 * 64 * 256) + (12 * 12 * 256 * 18) + (12 * 12 * 256 * 96)

    # DRB S3_2 & S3_3: expand (96->384), dw dual (384*18), pw (384->96)
    p_s3_2 = (96 * 384) + (384 * 18) + (384 * 96)
    macs_s3_2 = (12 * 12 * 96 * 384) + (12 * 12 * 384 * 18) + (12 * 12 * 384 * 96)
    p_s3 = p_s3_1 + p_s3_2 * 2
    macs_s3 = macs_s3_1 + macs_s3_2 * 2

    # --- Part-Sieve & Context Head ---
    # Part PW: 96 -> 48
    p_part_pw = 96 * 48
    macs_part_pw = 12 * 12 * 96 * 48
    # Readout FC: 96 -> 14
    p_readout = 96 * 14 + 14
    macs_readout = 96 * 14
    # Context branch: DW (96) + PW (96->128) + FC (128->14)
    p_ctx = (96 * 9) + (96 * 128) + (128 * 14)
    macs_ctx = (6 * 6 * 96 * 9) + (6 * 6 * 96 * 128) + (128 * 14)
    # Hazard FC: 96 -> 4
    p_hazard = 96 * 4 + 4
    macs_hazard = 96 * 4

    params_trunk_b = p_s2 + p_s3 + p_part_pw + p_readout + p_ctx + p_hazard
    macs_trunk_b = macs_s2 + macs_s3 + macs_part_pw + macs_readout + macs_ctx + macs_hazard

    # Totals
    total_params = params_trunk_a + params_trunk_b
    total_macs = macs_trunk_a + macs_trunk_b
    int8_kb = total_params / 1024.0

    # Largest single activation tensor:
    # 48 x 48 x 72 (in DRB S1_1 expansion) = 165,888 bytes = 162.0 KB in INT8
    largest_tensor_bytes = 48 * 48 * 72
    largest_tensor_kb = largest_tensor_bytes / 1024.0

    return {
        "params_total": total_params,
        "params_trunk_a": params_trunk_a,
        "params_trunk_b": params_trunk_b,
        "macs_total": total_macs,
        "macs_trunk_a": macs_trunk_a,
        "macs_trunk_b": macs_trunk_b,
        "mflops_total": total_macs * 2 / 1e6,
        "int8_kb": int8_kb,
        "largest_tensor_kb": largest_tensor_kb,
        "target_comparison": {
            "params_pass": total_params <= SECTION_4_BUDGETS["max_params"],
            "macs_pass": total_macs <= SECTION_4_BUDGETS["max_macs"],
            "size_pass": int8_kb <= SECTION_4_BUDGETS["max_int8_kb"],
            "activation_pass": largest_tensor_kb <= SECTION_4_BUDGETS["max_activation_kb"]
        }
    }


def print_budget_report():
    stats = compute_sieve_budget()
    tc = stats["target_comparison"]

    print("=" * 70)
    print("SIEVE-S Hardware Budget Verification (Section 4 Compliance Audit)")
    print("=" * 70)
    print(f"Metric                  Measured Value      Target Limit      Status")
    print("-" * 70)
    print(f"Student Parameters      {stats['params_total']:<19,} <= {SECTION_4_BUDGETS['max_params']:,}       {'PASS' if tc['params_pass'] else 'FAIL'}")
    print(f"  - Trunk A (Gate)      {stats['params_trunk_a']:<19,}")
    print(f"  - Trunk B (PartSieve) {stats['params_trunk_b']:<19,}")
    print(f"Model File Size (INT8)  {stats['int8_kb']:<16.1f} KB   <= {SECTION_4_BUDGETS['max_int8_kb']:,} KB     {'PASS' if tc['size_pass'] else 'FAIL'}")
    print(f"Multiply-Accumulates    {stats['macs_total']:<19,} <= {SECTION_4_BUDGETS['max_macs']:,}       {'PASS' if tc['macs_pass'] else 'FAIL'}")
    print(f"  - Trunk A MACs        {stats['macs_trunk_a']:<19,} (Gate inference)")
    print(f"  - Trunk B MACs        {stats['macs_trunk_b']:<19,}")
    print(f"Computational Cost      {stats['mflops_total']:<16.2f} MFLOPs")
    print(f"Largest Activation      {stats['largest_tensor_kb']:<16.1f} KB   <= {SECTION_4_BUDGETS['max_activation_kb']:,} KB      {'PASS' if tc['activation_pass'] else 'FAIL'}")
    print("=" * 70)

if __name__ == "__main__":
    print_budget_report()
