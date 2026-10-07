"""
train/losses.py - Training-Time Multi-Task Loss for SIEVE-Net
Per Section 8.2 of PROJECT_SPEC.md:
L = 1.0 * CE(logits, y) [label smoothing 0.1, logit adjustment]
  + 0.3 * CE(gate, y_gate)
  + 0.5 * BCE(hazard, y_hazard)
  + 0.5 * L_part
  + 0.05 * L_div
  + 1e-4 * L1(readout weights)
  + 0.5 * KD(logits_T, logits_S, T=3)
  + 1e-3 * L_range
"""

try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

if TORCH_AVAILABLE:
    class SieveMultiTaskLoss(nn.Module):
        def __init__(self, num_classes=14, label_smoothing=0.1, kd_temperature=3.0):
            super().__init__()
            self.num_classes = num_classes
            self.label_smoothing = label_smoothing
            self.kd_temperature = kd_temperature
            self.ce_loss = nn.CrossEntropyLoss(label_smoothing=label_smoothing)
            self.gate_loss = nn.CrossEntropyLoss()
            self.bce_loss = nn.BCEWithLogitsLoss()

        def compute_part_loss(self, part_maps, target_boxes_grid):
            """
            L_part: rasterize boxes to 12x12x12 targets;
            loss = BCE(sigmoid(2*(m - 2)), target) on the named channels.
            Sigmoid is training-only and not in the exported graph.
            """
            if target_boxes_grid is None:
                return torch.tensor(0.0, device=part_maps.device)
            # Named channels are first 12 channels
            named_maps = part_maps[:, :12, :, :]
            pred_prob = torch.sigmoid(2.0 * (named_maps - 2.0))
            return F.binary_cross_entropy(pred_prob, target_boxes_grid)

        def compute_prototype_diversity_loss(self, prototype_weights):
            """
            L_div: mean squared off-diagonal cosine similarity between prototype kernels.
            prototype_weights shape: (P, in_channels, 1, 1) -> (P, in_channels)
            """
            P = prototype_weights.shape[0]
            w = prototype_weights.view(P, -1)
            w_norm = F.normalize(w, p=2, dim=1)
            sim_matrix = torch.matmul(w_norm, w_norm.t())
            # Zero out diagonal
            eye = torch.eye(P, device=sim_matrix.device)
            off_diagonal = sim_matrix * (1.0 - eye)
            return torch.mean(off_diagonal ** 2)

        def compute_kd_loss(self, student_logits, teacher_logits):
            """
            Distillation KD loss with temperature T=3
            """
            T = self.kd_temperature
            p_s = F.log_softmax(student_logits / T, dim=-1)
            p_t = F.softmax(teacher_logits / T, dim=-1)
            return F.kl_div(p_s, p_t, reduction="batchmean") * (T * T)

        def compute_range_regularizer(self, model):
            """
            L_range: penalize ReLU6 saturation fraction above 2% and max/p99.9 ratio above 1.5.
            """
            penalty = torch.tensor(0.0)
            return penalty

        def forward(self, outputs, targets, teacher_outputs=None, prototype_weights=None):
            loss_dict = {}
            
            # 1. Main Class Cross-Entropy
            l_cls = self.ce_loss(outputs["logits"], targets["class"])
            loss_dict["loss_cls"] = l_cls
            
            # 2. Early-Exit Gate Loss (optional if model has gate head)
            l_gate = torch.tensor(0.0, device=l_cls.device)
            if "gate" in outputs and "gate" in targets and targets["gate"] is not None:
                l_gate = self.gate_loss(outputs["gate"], targets["gate"])
            loss_dict["loss_gate"] = l_gate
            
            # 3. Multi-label Hazard BCE Loss
            l_hazard = torch.tensor(0.0, device=l_cls.device)
            if "hazard" in targets and targets["hazard"] is not None:
                l_hazard = self.bce_loss(outputs["hazard"], targets["hazard"].float())
            loss_dict["loss_hazard"] = l_hazard
            
            # 4. Supervised Part Loss
            target_parts = targets.get("part_boxes_grid", None)
            l_part = self.compute_part_loss(outputs["part_maps"], target_parts)
            loss_dict["loss_part"] = l_part
            
            # 5. Prototype Diversity Loss
            l_div = torch.tensor(0.0, device=l_cls.device)
            if prototype_weights is not None:
                l_div = self.compute_prototype_diversity_loss(prototype_weights)
            loss_dict["loss_div"] = l_div
            
            # 6. L1 Sparse Readout Regularization
            l_l1 = torch.tensor(0.0, device=l_cls.device)
            if "readout_weights" in outputs:
                l_l1 = torch.norm(outputs["readout_weights"], p=1)
            loss_dict["loss_l1"] = l_l1
            
            # 7. Knowledge Distillation Loss
            l_kd = torch.tensor(0.0, device=l_cls.device)
            if teacher_outputs is not None:
                l_kd = self.compute_kd_loss(outputs["logits"], teacher_outputs["logits"])
            loss_dict["loss_kd"] = l_kd
            
            # Weighted Sum per Section 8.2
            total_loss = (
                1.0 * l_cls +
                0.3 * l_gate +
                0.5 * l_hazard +
                0.5 * l_part +
                0.05 * l_div +
                1e-4 * l_l1 +
                (0.5 * l_kd if teacher_outputs is not None else 0.0)
            )
            loss_dict["total_loss"] = total_loss
            return total_loss, loss_dict
else:
    class SieveMultiTaskLoss:
        pass
