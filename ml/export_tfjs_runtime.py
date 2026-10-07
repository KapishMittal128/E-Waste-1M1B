"""
ml/export_tfjs_runtime.py - Export folded EcoEdgeNet weights for TensorFlow.js
Author: Kapish Mittal
"""

import os
import sys
import json
import struct
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from ml.ecoedgenet import EcoEdgeNet


def fold_conv_bn(conv, bn):
    w = conv.weight
    gamma = bn.weight
    beta = bn.bias
    mean = bn.running_mean
    var = bn.running_var
    eps = bn.eps
    std = torch.sqrt(var + eps)
    w_folded = w * (gamma / std).view(-1, 1, 1, 1)
    b_folded = beta - mean * (gamma / std)
    return w_folded, b_folded


def main():
    print("=" * 60)
    print("Exporting EcoEdgeNet Folded Weights for Browser TensorFlow.js")
    print("=" * 60)

    model_path = ROOT_DIR / "release" / "ecoedgenet_best.pth"
    if not model_path.exists():
        print(f"Error: {model_path} not found.")
        sys.exit(1)

    m = EcoEdgeNet(7, 4, 5, 4)
    state = torch.load(model_path, map_location="cpu")
    m.load_state_dict(state)
    m.eval()

    tensors = {}

    # 1. Stem
    stem_w, stem_b = fold_conv_bn(m.stem[0], m.stem[1])
    # Conv2d in PyTorch: [out, in, H, W] -> TFJS Conv2d: [H, W, in, out]
    tensors["stem_w"] = stem_w.permute(2, 3, 1, 0).detach().numpy().astype(np.float32)
    tensors["stem_b"] = stem_b.detach().numpy().astype(np.float32)

    # 2. Stages 1-4
    stages = [m.stage1, m.stage2, m.stage3, m.stage4]
    for idx, stage in enumerate(stages, 1):
        prefix = f"stage{idx}_"
        
        # alpha_proj: Conv 1x1 [out, in, 1, 1] -> [1, 1, in, out]
        w_ap, b_ap = fold_conv_bn(stage.alpha_proj, stage.bn_alpha1)
        tensors[f"{prefix}alpha_proj_w"] = w_ap.permute(2, 3, 1, 0).detach().numpy().astype(np.float32)
        tensors[f"{prefix}alpha_proj_b"] = b_ap.detach().numpy().astype(np.float32)

        # alpha_dconv: DepthwiseConv 3x3 [in, 1, 3, 3] -> TFJS Depthwise: [3, 3, in, 1]
        w_ad, b_ad = fold_conv_bn(stage.alpha_dconv, stage.bn_alpha2)
        tensors[f"{prefix}alpha_dconv_w"] = w_ad.permute(2, 3, 0, 1).detach().numpy().astype(np.float32)
        tensors[f"{prefix}alpha_dconv_b"] = b_ad.detach().numpy().astype(np.float32)

        # beta_conv: Conv 1x1 [out, in, 1, 1] -> [1, 1, in, out]
        w_bc, b_bc = fold_conv_bn(stage.beta_conv, stage.bn_beta)
        tensors[f"{prefix}beta_conv_w"] = w_bc.permute(2, 3, 1, 0).detach().numpy().astype(np.float32)
        tensors[f"{prefix}beta_conv_b"] = b_bc.detach().numpy().astype(np.float32)

        # fusion_conv: Conv 1x1 [out, in, 1, 1] -> [1, 1, in, out]
        w_fc, b_fc = fold_conv_bn(stage.fusion_conv, stage.bn_fusion)
        tensors[f"{prefix}fusion_conv_w"] = w_fc.permute(2, 3, 1, 0).detach().numpy().astype(np.float32)
        tensors[f"{prefix}fusion_conv_b"] = b_fc.detach().numpy().astype(np.float32)

        # IGA fc1: Conv 1x1 [reduced, out, 1, 1] -> [1, 1, out, reduced]
        tensors[f"{prefix}iga_fc1_w"] = stage.iga.fc1.weight.permute(2, 3, 1, 0).detach().numpy().astype(np.float32)
        # IGA fc2: Conv 1x1 [out, reduced, 1, 1] -> [1, 1, reduced, out]
        tensors[f"{prefix}iga_fc2_w"] = stage.iga.fc2.weight.permute(2, 3, 1, 0).detach().numpy().astype(np.float32)

        # shortcut
        if len(stage.shortcut) > 0:
            w_sc, b_sc = fold_conv_bn(stage.shortcut[0], stage.shortcut[1])
            tensors[f"{prefix}shortcut_w"] = w_sc.permute(2, 3, 1, 0).detach().numpy().astype(np.float32)
            tensors[f"{prefix}shortcut_b"] = b_sc.detach().numpy().astype(np.float32)

    # 3. Heads: PyTorch Linear [out, in] -> TFJS MatMul [in, out]
    tensors["head_category_w"] = m.head_category.weight.t().detach().numpy().astype(np.float32)
    tensors["head_category_b"] = m.head_category.bias.detach().numpy().astype(np.float32)

    tensors["head_hazard_w"] = m.head_hazard.weight.t().detach().numpy().astype(np.float32)
    tensors["head_hazard_b"] = m.head_hazard.bias.detach().numpy().astype(np.float32)

    tensors["head_materials_w"] = m.head_materials.weight.t().detach().numpy().astype(np.float32)
    tensors["head_materials_b"] = m.head_materials.bias.detach().numpy().astype(np.float32)

    tensors["head_route_w"] = m.head_route.weight.t().detach().numpy().astype(np.float32)
    tensors["head_route_b"] = m.head_route.bias.detach().numpy().astype(np.float32)

    # Pack into single binary file + manifest JSON
    out_dir = ROOT_DIR / "public" / "models"
    out_dir.mkdir(parents=True, exist_ok=True)
    bin_path = out_dir / "ecoedgenet_weights.bin"
    manifest_path = out_dir / "ecoedgenet_weights_manifest.json"

    manifest = {}
    total_floats = 0
    all_bytes = bytearray()

    for name, arr in tensors.items():
        arr_flat = arr.flatten()
        offset = total_floats * 4
        byte_length = len(arr_flat) * 4
        manifest[name] = {
            "shape": list(arr.shape),
            "offset": offset,
            "length": len(arr_flat),
            "byteLength": byte_length
        }
        all_bytes.extend(arr_flat.tobytes())
        total_floats += len(arr_flat)

    with open(bin_path, "wb") as f:
        f.write(all_bytes)

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"Exported {len(tensors)} tensors ({total_floats:,} parameters)")
    print(f"Binary file: {bin_path} ({len(all_bytes) / 1024:.2f} KB)")
    print(f"Manifest JSON: {manifest_path}")

    # Verify consistency with test inference
    dummy = torch.randn(1, 3, 224, 224)
    with torch.no_grad():
        pt_out = m(dummy)
        cat_probs = F.softmax(pt_out["category_logits"], dim=-1)[0].tolist()
        mat_probs = pt_out["materials_fractions"][0].tolist()

    verification_data = {
        "test_input_shape": [1, 224, 224, 3],
        "test_category_probs": cat_probs,
        "test_materials_fractions": mat_probs
    }
    with open(out_dir / "ecoedgenet_test_vector.json", "w", encoding="utf-8") as f:
        json.dump(verification_data, f, indent=2)
    print("Saved test verification vector.")


if __name__ == "__main__":
    main()
