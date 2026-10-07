"""
SIEVE-Net Stem (S0): Learned Conv + Polarity-Split Fixed Edge Bank
Produces 48x48x24 output tensor from 192x192x3 input image.
"""

from __future__ import annotations
import math
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
        Parameter = _MockNNModule
    nn = _MockNN()
    class _MockF:
        @staticmethod
        def relu6(x): return x
    F = _MockF()


class PolaritySplitEdgeBank(nn.Module):
    """
    Fixed Polarity-Split Edge Bank (S0b).
    Applies fixed luminance projection and 4 directional edge filters (0, 45, 90, 135 deg)
    with positive and negative polarities (8 channels total), followed by trainable gain & bias.
    Kernels are non-trainable (trainable=False).
    """
    def __init__(self):
        super().__init__()
        # Luminance weights: 0.299 R + 0.587 G + 0.114 B
        self.lum_conv = nn.Conv2d(3, 1, kernel_size=1, bias=False)
        # 5x5 stride-2 directional edge bank
        self.edge_conv = nn.Conv2d(1, 8, kernel_size=5, stride=2, padding=2, bias=False)
        
        # Per-channel trainable gain and bias
        if TORCH_AVAILABLE:
            self.gain = nn.Parameter(torch.ones(1, 8, 1, 1))
            self.bias = nn.Parameter(torch.zeros(1, 8, 1, 1))
            self._init_fixed_kernels()
        else:
            self.gain = None
            self.bias = None

    def _init_fixed_kernels(self):
        with torch.no_grad():
            # Fix luminance weights
            self.lum_conv.weight.data = torch.tensor([[[[0.299]], [[0.587]], [[0.114]]]], dtype=torch.float32)
            self.lum_conv.weight.requires_grad = False

            # Construct 4 orientations x 2 polarities (8 kernels of 5x5)
            # 0 deg (horizontal), 90 deg (vertical), 45 deg, 135 deg
            kernels = torch.zeros(8, 1, 5, 5, dtype=torch.float32)
            
            # Horizontal (+ and -)
            h_edge = torch.tensor([[-1, -2, -4, -2, -1],
                                   [-1, -2, -4, -2, -1],
                                   [ 0,  0,  0,  0,  0],
                                   [ 1,  2,  4,  2,  1],
                                   [ 1,  2,  4,  2,  1]], dtype=torch.float32) / 16.0
            kernels[0, 0] =  h_edge
            kernels[1, 0] = -h_edge

            # Vertical (+ and -)
            v_edge = h_edge.t()
            kernels[2, 0] =  v_edge
            kernels[3, 0] = -v_edge

            # 45 deg diagonal (+ and -)
            d45_edge = torch.tensor([[-2, -2, -1,  0,  1],
                                     [-2, -3,  0,  1,  2],
                                     [-1,  0,  0,  0,  1],
                                     [ 0,  1,  0,  3,  2],
                                     [ 1,  0,  1,  2,  2]], dtype=torch.float32) / 16.0
            kernels[4, 0] =  d45_edge
            kernels[5, 0] = -d45_edge

            # 135 deg diagonal (+ and -)
            d135_edge = torch.flip(d45_edge, dims=[1])
            kernels[6, 0] =  d135_edge
            kernels[7, 0] = -d135_edge

            self.edge_conv.weight.data = kernels
            self.edge_conv.weight.requires_grad = False

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        lum = self.lum_conv(x)
        edges = self.edge_conv(lum)
        if TORCH_AVAILABLE and self.gain is not None:
            return F.relu6(edges * self.gain + self.bias)
        return F.relu6(edges)


class SieveStem(nn.Module):
    """
    Complete SIEVE Stem (S0):
      S0a: Learned Conv 3x3 s2 (3->16) -> 96x96x16
      S0b: Polarity-Split Edge Bank (3->8) -> 96x96x8
      S0c: Concat(S0a, S0b) -> DW 3x3 s2 -> BN -> ReLU6 -> PW 24->24 -> BN -> ReLU6 -> 48x48x24
    """
    def __init__(self):
        super().__init__()
        # S0a: Learned 3x3 conv
        self.conv_learned = nn.Conv2d(3, 16, kernel_size=3, stride=2, padding=1, bias=False)
        self.bn_learned = nn.BatchNorm2d(16)
        
        # S0b: Fixed edge bank
        self.edge_bank = PolaritySplitEdgeBank()

        # S0c: Concat (24 ch) -> DW s2 -> PW
        self.dw_conv = nn.Conv2d(24, 24, kernel_size=3, stride=2, padding=1, groups=24, bias=False)
        self.bn_dw = nn.BatchNorm2d(24)
        self.pw_conv = nn.Conv2d(24, 24, kernel_size=1, bias=False)
        self.bn_pw = nn.BatchNorm2d(24)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # S0a & S0b run in parallel on input image
        s0a = F.relu6(self.bn_learned(self.conv_learned(x)))
        s0b = self.edge_bank(x)

        # Concat along channels -> 96x96x24
        fused = torch.cat([s0a, s0b], dim=1) if TORCH_AVAILABLE else s0a

        # S0c: Downsample to 48x48x24
        out = F.relu6(self.bn_dw(self.dw_conv(fused)))
        out = F.relu6(self.bn_pw(self.pw_conv(out)))
        return out
