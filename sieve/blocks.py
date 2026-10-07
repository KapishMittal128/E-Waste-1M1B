"""
SIEVE-Net Dual-Rate Block (DRB)
Implements inverted bottleneck with dual depthwise dilation rates (d=1 and d=2)
fused by addition on stride=1, with linear bottleneck projection.
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
        Conv2d = _MockNNModule
        BatchNorm2d = _MockNNModule
    nn = _MockNN()
    class _MockF:
        @staticmethod
        def relu6(x): return x
    F = _MockF()


class DualRateBlock(nn.Module):
    """
    Dual-Rate Block (DRB).
    
    When stride == 1:
      - Expands channels: PW 1x1 (c_in -> c_in * e) + BN + ReLU6
      - Applies two parallel depthwise branches:
          Branch A: DW 3x3 (dilation = 1) + BN
          Branch B: DW 3x3 (dilation = 2) + BN
      - Dual-rate fusion: ReLU6(a + b)
      - Linear bottleneck: PW 1x1 (-> c_out) + BN (no activation)
      - Residual shortcut if c_in == c_out
      
    When stride == 2:
      - Single-rate depthwise conv with stride 2 to guarantee standard LiteRT op conversion.
    """
    def __init__(
        self,
        in_channels: int,
        out_channels: int,
        expansion: int = 4,
        stride: int = 1
    ):
        super().__init__()
        self.in_channels = in_channels
        self.out_channels = out_channels
        self.stride = stride
        self.use_residual = (stride == 1 and in_channels == out_channels)

        hidden_dim = in_channels * expansion

        # 1. Pointwise Expansion
        self.pw_expand = nn.Conv2d(in_channels, hidden_dim, kernel_size=1, bias=False)
        self.bn_expand = nn.BatchNorm2d(hidden_dim)

        # 2. Depthwise Convolutions
        if stride == 1:
            # Branch A: dilation 1
            self.dw_rate1 = nn.Conv2d(
                hidden_dim, hidden_dim, kernel_size=3, stride=1, padding=1,
                dilation=1, groups=hidden_dim, bias=False
            )
            self.bn_dw1 = nn.BatchNorm2d(hidden_dim)
            # Branch B: dilation 2
            self.dw_rate2 = nn.Conv2d(
                hidden_dim, hidden_dim, kernel_size=3, stride=1, padding=2,
                dilation=2, groups=hidden_dim, bias=False
            )
            self.bn_dw2 = nn.BatchNorm2d(hidden_dim)
        else:
            # Stride 2: single-rate depthwise
            self.dw_stride2 = nn.Conv2d(
                hidden_dim, hidden_dim, kernel_size=3, stride=2, padding=1,
                groups=hidden_dim, bias=False
            )
            self.bn_dw_s2 = nn.BatchNorm2d(hidden_dim)

        # 3. Linear Bottleneck Projection (no non-linearity)
        self.pw_project = nn.Conv2d(hidden_dim, out_channels, kernel_size=1, bias=False)
        self.bn_project = nn.BatchNorm2d(out_channels)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Expansion
        h = F.relu6(self.bn_expand(self.pw_expand(x)))

        # Depthwise
        if self.stride == 1:
            a = self.bn_dw1(self.dw_rate1(h))
            b = self.bn_dw2(self.dw_rate2(h))
            h = F.relu6(a + b)
        else:
            h = F.relu6(self.bn_dw_s2(self.dw_stride2(h)))

        # Linear projection
        y = self.bn_project(self.pw_project(h))

        # Residual shortcut
        if self.use_residual:
            return y + x
        return y
