"""
sieve/teacher.py - Teacher Model (SIEVE-T) for Knowledge Distillation
Per Section 5.5 of PROJECT_SPEC.md:
"Teacher (SIEVE-T, also from scratch)
Same family, larger: width x2.5, blocks x1.5, input 224, P = 96, float32 only, trained longer.
Used offline to distill into SIEVE-S. The teacher is our own architecture trained on our data,
so the 'no external models' rule still holds. Teacher never ships."
"""

try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

from sieve.stem import SieveStem
from sieve.blocks import DualRateBlock
from sieve.part_sieve import PartSieveHead
from sieve.heads import GateHead, HazardHead

if TORCH_AVAILABLE:
    class SieveTeacher(nn.Module):
        """
        SIEVE-T: Purpose-built Teacher Architecture
        Trained strictly from scratch on our own data for offline knowledge distillation.
        Zero pretrained weights; zero external model zoo code.
        """
        def __init__(self, num_classes=14, num_hazards=4, num_prototypes=96):
            super().__init__()
            self.num_classes = num_classes
            self.num_hazards = num_hazards
            self.num_prototypes = num_prototypes

            # Stem: S0a width x2.5 = 40 ch, S0c = 60 ch
            # For clean modularity, standard SieveStem with width scaled
            self.stem_conv = nn.Conv2d(3, 40, kernel_size=3, stride=2, padding=1, bias=False)
            self.stem_bn = nn.BatchNorm2d(40)
            self.stem_relu = nn.ReLU6(inplace=True)
            self.stem_dw = nn.Conv2d(40, 40, kernel_size=3, stride=2, padding=1, groups=40, bias=False)
            self.stem_dw_bn = nn.BatchNorm2d(40)
            self.stem_pw = nn.Conv2d(40, 60, kernel_size=1, stride=1, bias=False)
            self.stem_pw_bn = nn.BatchNorm2d(60)

            # Stage 1: 3 DRB blocks (2 * 1.5 = 3), 60 -> 80
            self.s1_block1 = DualRateBlock(60, 80, expansion=3, stride=2)
            self.s1_block2 = DualRateBlock(80, 80, expansion=3, stride=1)
            self.s1_block3 = DualRateBlock(80, 80, expansion=3, stride=1)

            # Stage 2: 5 DRB blocks (3 * 1.5 = 4.5 -> 5), 80 -> 160
            self.s2_block1 = DualRateBlock(80, 160, expansion=4, stride=2)
            self.s2_blocks = nn.ModuleList([
                DualRateBlock(160, 160, expansion=4, stride=1) for _ in range(4)
            ])

            # Stage 3: 5 DRB blocks, 160 -> 240
            self.s3_block1 = DualRateBlock(160, 240, expansion=4, stride=1)
            self.s3_blocks = nn.ModuleList([
                DualRateBlock(240, 240, expansion=4, stride=1) for _ in range(4)
            ])

            # Part-Sieve Head with 96 prototypes
            self.part_sieve = PartSieveHead(
                in_channels=240,
                num_classes=num_classes,
                num_prototypes=num_prototypes,
                context_dim=320,
                context_dropout_rate=0.3
            )
            self.hazard_head = HazardHead(in_features=num_prototypes * 2, num_hazards=num_hazards)

        def forward(self, x):
            # Input: 224x224x3
            x = self.stem_relu(self.stem_bn(self.stem_conv(x)))     # 112x112x40
            x = self.stem_relu(self.stem_dw_bn(self.stem_dw(x)))     # 56x56x40
            x = self.stem_relu(self.stem_pw_bn(self.stem_pw(x)))     # 56x56x60

            # S1 -> 28x28x80
            x = self.s1_block1(x)
            x = self.s1_block2(x)
            x = self.s1_block3(x)

            # S2 -> 14x14x160
            x = self.s2_block1(x)
            for b in self.s2_blocks:
                x = b(x)

            # S3 -> 14x14x240
            x = self.s3_block1(x)
            for b in self.s3_blocks:
                x = b(x)

            # Part-Sieve Output
            logits, part_maps, evidence = self.part_sieve(x)
            hazard_logits = self.hazard_head(evidence)

            return {
                "logits": logits,
                "part_maps": part_maps,
                "evidence": evidence,
                "hazard": hazard_logits
            }
else:
    class SieveTeacher:
        def __init__(self, *args, **kwargs):
            pass
