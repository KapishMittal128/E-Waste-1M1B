"""
SIEVE-S: Complete Student Architecture Definition
Implements monolithic forward pass and decoupled Trunk A / Trunk B cascade graph.
"""

from __future__ import annotations
from typing import Dict, Any, Tuple

try:
    import torch
    import torch.nn as nn
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    class _MockTorch: Tensor = Any
    torch = _MockTorch()
    class _MockNNModule:
        def __init__(self, *args, **kwargs): pass
        def __call__(self, *args, **kwargs): return self
    class _MockNN:
        Module = _MockNNModule
        Sequential = _MockNNModule
    nn = _MockNN()

from sieve.stem import SieveStem
from sieve.blocks import DualRateBlock
from sieve.heads import GateHead, HazardHead
from sieve.part_sieve import PartSieveHead


class SieveStudent(nn.Module):
    """
    SIEVE-S Student Model.
    
    Stages:
      - Stem S0: 192x192x3 -> 48x48x24 (Learned Conv + Fixed Edge Bank)
      - Stage S1: 48x48x24 -> 24x24x32 (2 x DRB, e=3)
      - Gate Head: 24x24x32 -> 3 (e-waste, not-e-waste, no-object)
      --- Split Point ---
      - Stage S2: 24x24x32 -> 12x12x64 (3 x DRB, e=4, first s2)
      - Stage S3: 12x12x64 -> 12x12x96 (3 x DRB, e=4, s1)
      - Part-Sieve Head: 12x12x96 -> 12x12x48 part maps -> 96-d evidence -> 14 class logits
      - Hazard Head: 96-d evidence -> 4 hazard logits
    """
    def __init__(
        self,
        num_classes: int = 14,
        num_hazards: int = 4,
        num_prototypes: int = 48,
        context_dim: int = 128
    ):
        super().__init__()
        # Stem S0
        self.stem = SieveStem()

        # Stage S1 (Trunk A)
        self.s1_block1 = DualRateBlock(24, 32, expansion=3, stride=2)
        self.s1_block2 = DualRateBlock(32, 32, expansion=3, stride=1)
        self.gate_head = GateHead(in_channels=32, num_gate_classes=3)

        # Stage S2 (Trunk B)
        self.s2_block1 = DualRateBlock(32, 64, expansion=4, stride=2)
        self.s2_block2 = DualRateBlock(64, 64, expansion=4, stride=1)
        self.s2_block3 = DualRateBlock(64, 64, expansion=4, stride=1)

        # Stage S3 (Trunk B)
        self.s3_block1 = DualRateBlock(64, 96, expansion=4, stride=1)
        self.s3_block2 = DualRateBlock(96, 96, expansion=4, stride=1)
        self.s3_block3 = DualRateBlock(96, 96, expansion=4, stride=1)

        # Part-Sieve & Hazard Heads
        self.part_sieve = PartSieveHead(
            in_channels=96,
            num_prototypes=num_prototypes,
            num_classes=num_classes,
            context_dim=context_dim
        )
        self.hazard_head = HazardHead(in_features=num_prototypes * 2, num_hazards=num_hazards)

    def forward_trunk_a(self, x: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        """Runs Model A: Stem + S1 + Gate Head. Emits gate logits and 24x24x32 features."""
        x = self.stem(x)
        x = self.s1_block1(x)
        features_s1 = self.s1_block2(x)
        gate_logits = self.gate_head(features_s1)
        return gate_logits, features_s1

    def forward_trunk_b(self, features_s1: torch.Tensor) -> Dict[str, torch.Tensor]:
        """Runs Model B: S2 + S3 + Part-Sieve + Hazard Head."""
        x = self.s2_block1(features_s1)
        x = self.s2_block2(x)
        x = self.s2_block3(x)

        x = self.s3_block1(x)
        x = self.s3_block2(x)
        f = self.s3_block3(x)

        class_logits, part_maps, evidence = self.part_sieve(f)
        hazard_logits = self.hazard_head(evidence)

        return {
            "logits": class_logits,
            "hazard": hazard_logits,
            "part_maps": part_maps,
            "evidence": evidence
        }

    def forward(self, x: torch.Tensor) -> Dict[str, torch.Tensor]:
        """Full monolithic forward pass."""
        gate_logits, features_s1 = self.forward_trunk_a(x)
        out = self.forward_trunk_b(features_s1)
        out["gate"] = gate_logits
        return out
