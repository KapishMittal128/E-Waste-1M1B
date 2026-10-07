"""
SIEVE-Net Part-Sieve Evidence Head
Implements:
  1. Part map projection: 12x12xP (P=48)
  2. Evidence aggregation: [GlobalMax || GlobalAvg] -> 96-d vector
  3. Non-negative Readout Matrix: Parts can only add evidence for a class
  4. Context Branch with Context-Dropout
"""

from __future__ import annotations
from typing import Tuple, Dict, Any

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
        Conv2d = _MockNNModule
        BatchNorm2d = _MockNNModule
        Linear = _MockNNModule
        Dropout = _MockNNModule
        Parameter = _MockNNModule
    nn = _MockNN()
    class _MockF:
        @staticmethod
        def relu6(x): return x
        @staticmethod
        def adaptive_avg_pool2d(x, s): return x
        @staticmethod
        def adaptive_max_pool2d(x, s): return x
    F = _MockF()


class PartSieveHead(nn.Module):
    """
    Part-Sieve Evidence Head.
    
    Generates 48 part presence maps (12 named + 36 free), pools them into
    a 96-d evidence vector [GlobalMax || GlobalAvg], and projects through
    a non-negative linear readout matrix.
    
    Context branch:
      DW 3x3 s2 -> PW 128 -> GAP -> FC 128 -> C
      Gated by learned alpha and context dropout (p=0.3 in training).
    """
    def __init__(
        self,
        in_channels: int = 96,
        num_prototypes: int = 48,
        num_classes: int = 14,
        context_dim: int = 128,
        context_dropout_rate: float = 0.3
    ):
        super().__init__()
        self.num_prototypes = num_prototypes
        self.num_classes = num_classes

        # 1. Part Projection (PW 96 -> 48)
        self.part_pw = nn.Conv2d(in_channels, num_prototypes, kernel_size=1, bias=False)
        self.bn_part = nn.BatchNorm2d(num_prototypes)

        # 2. Non-negative Readout FC (96 -> C)
        # Weights are clamped >= 0 during forward/training
        self.fc_readout = nn.Linear(num_prototypes * 2, num_classes, bias=True)

        # 3. Context Branch (global cues, downsamples 12x12 -> 6x6 -> GAP)
        self.context_dw = nn.Conv2d(in_channels, in_channels, kernel_size=3, stride=2, padding=1, groups=in_channels, bias=False)
        self.context_pw = nn.Conv2d(in_channels, context_dim, kernel_size=1, bias=False)
        self.bn_context = nn.BatchNorm2d(context_dim)
        self.fc_context = nn.Linear(context_dim, num_classes, bias=False)

        # Learned alpha scaling factor for context branch
        if TORCH_AVAILABLE:
            self.alpha = nn.Parameter(torch.tensor(0.5, dtype=torch.float32))
            self.dropout = nn.Dropout(p=context_dropout_rate)
        else:
            self.alpha = None
            self.dropout = None

    def get_constrained_readout_weight(self):
        """Clamps readout weights to non-negative (>= 0)."""
        if TORCH_AVAILABLE:
            return F.relu(self.fc_readout.weight)
        return self.fc_readout.weight

    def forward(self, f: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        """
        Returns:
          final_logits: (B, C) = evidence_logits + alpha * context_logits
          part_maps: (B, 48, 12, 12)
          evidence_vector: (B, 96)
        """
        # 1. Compute Part Maps (12x12x48)
        part_maps = F.relu6(self.bn_part(self.part_pw(f)))

        # 2. Aggregate Evidence: GlobalMax || GlobalAvg
        max_pool = F.adaptive_max_pool2d(part_maps, (1, 1)).flatten(1)
        avg_pool = F.adaptive_avg_pool2d(part_maps, (1, 1)).flatten(1)
        evidence = torch.cat([max_pool, avg_pool], dim=1) if TORCH_AVAILABLE else max_pool

        # 3. Non-negative Class Readout
        if TORCH_AVAILABLE:
            w_nonneg = self.get_constrained_readout_weight()
            evidence_logits = F.linear(evidence, w_nonneg, self.fc_readout.bias)
        else:
            evidence_logits = self.fc_readout(evidence)

        # 4. Context Branch
        ctx = F.relu6(self.bn_context(self.context_pw(self.context_dw(f))))
        ctx_gap = F.adaptive_avg_pool2d(ctx, (1, 1)).flatten(1)
        if TORCH_AVAILABLE and self.dropout is not None:
            ctx_gap = self.dropout(ctx_gap)
        context_logits = self.fc_context(ctx_gap)

        # 5. Final Logit Combination
        alpha_val = torch.clamp(self.alpha, 0.0, 1.0) if (TORCH_AVAILABLE and self.alpha is not None) else 0.5
        final_logits = evidence_logits + alpha_val * context_logits

        return final_logits, part_maps, evidence
