"""
SIEVE-Net Auxiliary Prediction Heads:
  1. Cascade Gate Head: Early exit classifier on Stage 1 (GAP -> FC 32 -> 3)
  2. Hazard Head: Multi-label logits from 96-d evidence (FC 96 -> 4)
"""

from __future__ import annotations
from typing import Any

try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
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
        Linear = _MockNNModule
    nn = _MockNN()
    class _MockF:
        @staticmethod
        def adaptive_avg_pool2d(x, s): return x
    F = _MockF()


class GateHead(nn.Module):
    """
    Cascade Gate Head evaluated at Stage 1 ($24 \\times 24 \\times 32$).
    Predicts 3 classes:
      0: e-waste-likely
      1: not-e-waste-likely
      2: no-object / background
    """
    def __init__(self, in_channels: int = 32, num_gate_classes: int = 3):
        super().__init__()
        self.fc = nn.Linear(in_channels, num_gate_classes)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        gap = F.adaptive_avg_pool2d(x, (1, 1)).flatten(1)
        return self.fc(gap)


class HazardHead(nn.Module):
    """
    Hazard Prediction Head evaluated on the 96-d Part-Sieve evidence vector.
    Predicts 4 multi-label hazard flags:
      0: lithium_battery_likely
      1: mercury_lamp
      2: crt_display
      3: damaged_battery_visible
    """
    def __init__(self, in_features: int = 96, num_hazards: int = 4):
        super().__init__()
        self.fc = nn.Linear(in_features, num_hazards)

    def forward(self, evidence: torch.Tensor) -> torch.Tensor:
        return self.fc(evidence)
