"""
train/train_real_model.py - Real Multi-Task Training Pipeline for EcoEdgeNet
Trained on:
  1. EWasteNet Dataset (878 real e-waste photos: phones, laptops, keyboards, mice, TVs, microwaves, cameras)
  2. TrashNet Dataset (2,117 real non-electronic photos: cardboard, glass, paper, plastic, trash)
Target: Distinguish E-Waste from Non-E-Waste and accurately triage electronic scrap.
Author: Kapish Mittal
"""

import os
import sys
import json
import random
import time
from pathlib import Path
from typing import Dict, List, Tuple

import numpy as np
from PIL import Image

try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F
    import torch.optim as optim
    from torch.utils.data import Dataset, DataLoader
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    print("Error: PyTorch is required to run real training.")
    sys.exit(1)

# Ensure project root is in python path
ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from ml.ecoedgenet import EcoEdgeNet, count_parameters

# Exact multi-task taxonomy
CLASSES = [
    "Not_EWaste",               # 0: Cardboard, paper, plastic, glass, household general items
    "Mobile_Phones",            # 1: Smartphones, mobile devices, smartwatches
    "Laptops_Computers",        # 2: Laptops, notebooks, computer assemblies
    "Keyboards_Mice",           # 3: Keyboards, mice, input peripherals
    "Displays_TVs",             # 4: Televisions, computer monitors, flat screens
    "Appliances_ConsumerTech",  # 5: Microwaves, ovens, small kitchen appliances
    "Cameras_Optics"            # 6: Digital cameras, lenses, sensors
]

CLASS_TO_IDX = {c: i for i, c in enumerate(CLASSES)}

# Multi-task ground truth mappings per class
HAZARD_MAP = {
    0: 0,  # Not_EWaste -> Low / Safe (0)
    1: 1,  # Mobile_Phones -> Medium (1) - Li-ion battery inside
    2: 1,  # Laptops_Computers -> Medium (1) - Li-ion pack & LCD
    3: 0,  # Keyboards_Mice -> Low (0) - Non-hazardous plastics & copper
    4: 2,  # Displays_TVs -> High (2) - High-voltage capacitors, heavy metals
    5: 1,  # Appliances_ConsumerTech -> Medium (1)
    6: 1   # Cameras_Optics -> Medium (1)
}

MATERIALS_MAP = {
    0: [0.05, 0.05, 0.05, 0.00, 0.00],  # Mostly non-metallic inert
    1: [0.38, 0.24, 0.20, 0.06, 0.12],  # Plastics, Cu, Al, Au/Rare, Hazardous
    2: [0.28, 0.22, 0.35, 0.05, 0.10],
    3: [0.60, 0.25, 0.05, 0.02, 0.08],
    4: [0.35, 0.20, 0.30, 0.03, 0.12],
    5: [0.35, 0.20, 0.35, 0.02, 0.08],
    6: [0.40, 0.25, 0.25, 0.04, 0.06]
}

ROUTES_MAP = {
    0: 0,  # Not_EWaste -> Standard Municipal (0)
    1: 0,  # Mobile_Phones -> Reuse / Refurbish (0)
    2: 1,  # Laptops_Computers -> Repair / Refurbish (1)
    3: 3,  # Keyboards_Mice -> Recycle (3)
    4: 3,  # Displays_TVs -> Authorized Dismantling (3)
    5: 3,  # Appliances_ConsumerTech -> Authorized Dismantling (3)
    6: 1   # Cameras_Optics -> Repair / Reuse (1)
}


class RealEWasteDataset(Dataset):
    def __init__(self, samples: List[Tuple[str, int]], is_train: bool = True):
        self.samples = samples
        self.is_train = is_train

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, class_idx = self.samples[idx]
        
        try:
            with Image.open(img_path) as img:
                img = img.convert("RGB")
                img = img.resize((224, 224), Image.Resampling.BILINEAR)
                
                # Simple data augmentation for training
                if self.is_train:
                    if random.random() > 0.5:
                        img = img.transpose(Image.FLIP_LEFT_RIGHT)
                
                arr = np.array(img, dtype=np.float32) / 255.0
                # Normalize ImageNet mean/std
                mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
                std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
                arr = (arr - mean) / std
                arr = arr.transpose(2, 0, 1)  # HWC -> CHW
                tensor = torch.from_numpy(arr).float()
        except Exception as e:
            # Fallback black tensor if image fails to decode
            tensor = torch.zeros((3, 224, 224), dtype=torch.float32)

        hazard_idx = HAZARD_MAP[class_idx]
        materials = torch.tensor(MATERIALS_MAP[class_idx], dtype=torch.float32)
        route_idx = ROUTES_MAP[class_idx]
        is_ewaste = 0 if class_idx == 0 else 1  # 0 = not ewaste, 1 = ewaste

        return {
            "image": tensor,
            "category": torch.tensor(class_idx, dtype=torch.long),
            "hazard": torch.tensor(hazard_idx, dtype=torch.long),
            "materials": materials,
            "route": torch.tensor(route_idx, dtype=torch.long),
            "is_ewaste": torch.tensor(is_ewaste, dtype=torch.long)
        }


def collect_dataset_samples() -> Tuple[List[Tuple[str, int]], List[Tuple[str, int]]]:
    """Collects real e-waste and non-e-waste images and splits into train/val."""
    random.seed(42)
    samples: List[Tuple[str, int]] = []

    # 1. Non-EWaste images from TrashNet (cardboard, glass, paper, plastic, trash)
    trashnet_dir = ROOT_DIR / "data" / "trashnet_raw" / "dataset-resized"
    if trashnet_dir.exists():
        non_ewaste_files = []
        valid_exts = {".jpg", ".jpeg", ".png"}
        for root, _, files in os.walk(trashnet_dir):
            for f in files:
                if Path(f).suffix.lower() in valid_exts:
                    non_ewaste_files.append(os.path.join(root, f))
        
        # Subsample ~350 balanced non-e-waste images
        random.shuffle(non_ewaste_files)
        selected_non_ewaste = non_ewaste_files[:350]
        for p in selected_non_ewaste:
            samples.append((p, 0))  # 0: Not_EWaste
        print(f"[Dataset Collector] Collected {len(selected_non_ewaste)} real non-e-waste images (TrashNet).")

    # 2. E-Waste images from EWasteNet
    ewastenet_dir = ROOT_DIR / "data" / "ewastenet_raw" / "dataset"
    ewaste_mapping = {
        "Mobile": 1,
        "smartwatch": 1,
        "laptop": 2,
        "Keyboards": 3,
        "Mouses": 3,
        "TV": 4,
        "microwave": 5,
        "camera": 6
    }

    if ewastenet_dir.exists():
        ewaste_count = 0
        valid_exts = {".jpg", ".jpeg", ".png"}
        for folder_name, class_id in ewaste_mapping.items():
            f_dir = ewastenet_dir / folder_name
            if f_dir.exists():
                cat_files = [str(f_dir / f) for f in os.listdir(f_dir) if Path(f).suffix.lower() in valid_exts]
                for p in cat_files:
                    samples.append((p, class_id))
                    ewaste_count += 1
                print(f"[Dataset Collector] Collected {len(cat_files)} images for {CLASSES[class_id]} ({folder_name}).")
        print(f"[Dataset Collector] Total real e-waste images: {ewaste_count}.")

    random.shuffle(samples)
    total = len(samples)
    val_split = int(total * 0.15)
    train_samples = samples[val_split:]
    val_samples = samples[:val_split]

    print(f"[Dataset Split] Total: {total} | Train: {len(train_samples)} | Validation: {len(val_samples)}")
    return train_samples, val_samples


def train_model(epochs: int = 8, batch_size: int = 32, lr: float = 1e-3):
    print("=" * 65)
    print("EcoEdgeNet Real Neural Network Multi-Task Training")
    print("Author: Kapish Mittal | Architecture: AMRC + IGA (354K params)")
    print("=" * 65)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using Compute Device: {device}")

    train_samples, val_samples = collect_dataset_samples()
    if not train_samples:
        print("Error: No training samples collected.")
        return

    train_dataset = RealEWasteDataset(train_samples, is_train=True)
    val_dataset = RealEWasteDataset(val_samples, is_train=False)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, drop_last=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

    model = EcoEdgeNet(num_categories=len(CLASSES), num_hazards=4, num_materials=5, num_routes=4).to(device)
    print(f"Model Initialized. Total Trainable Parameters: {count_parameters(model):,}")

    criterion_cat = nn.CrossEntropyLoss()
    criterion_hazard = nn.CrossEntropyLoss()
    criterion_materials = nn.MSELoss()
    criterion_route = nn.CrossEntropyLoss()

    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)

    history = {
        "epochs": [],
        "train_loss": [],
        "val_loss": [],
        "val_category_accuracy": [],
        "val_binary_gate_accuracy": []
    }

    best_val_acc = 0.0
    os.makedirs(str(ROOT_DIR / "release"), exist_ok=True)
    os.makedirs(str(ROOT_DIR / "public" / "models"), exist_ok=True)

    print("\nStarting Training Execution...")
    start_time = time.time()

    for epoch in range(1, epochs + 1):
        model.train()
        total_train_loss = 0.0
        train_batches = 0

        for batch in train_loader:
            imgs = batch["image"].to(device)
            target_cat = batch["category"].to(device)
            target_hazard = batch["hazard"].to(device)
            target_materials = batch["materials"].to(device)
            target_route = batch["route"].to(device)

            optimizer.zero_grad()
            outputs = model(imgs)

            loss_cat = criterion_cat(outputs["category_logits"], target_cat)
            loss_hazard = criterion_hazard(outputs["hazard_logits"], target_hazard)
            loss_materials = criterion_materials(outputs["materials_fractions"], target_materials)
            loss_route = criterion_route(outputs["route_logits"], target_route)

            loss = loss_cat + 0.3 * loss_hazard + 0.5 * loss_materials + 0.2 * loss_route
            loss.backward()
            optimizer.step()

            total_train_loss += loss.item()
            train_batches += 1

        scheduler.step()
        avg_train_loss = total_train_loss / max(1, train_batches)

        # Validation phase
        model.eval()
        total_val_loss = 0.0
        val_batches = 0
        correct_cat = 0
        correct_gate = 0
        total_val_samples = 0

        with torch.no_grad():
            for batch in val_loader:
                imgs = batch["image"].to(device)
                target_cat = batch["category"].to(device)
                target_hazard = batch["hazard"].to(device)
                target_materials = batch["materials"].to(device)
                target_route = batch["route"].to(device)
                target_is_ewaste = batch["is_ewaste"].to(device)

                outputs = model(imgs)

                loss_cat = criterion_cat(outputs["category_logits"], target_cat)
                loss_hazard = criterion_hazard(outputs["hazard_logits"], target_hazard)
                loss_materials = criterion_materials(outputs["materials_fractions"], target_materials)
                loss_route = criterion_route(outputs["route_logits"], target_route)

                loss = loss_cat + 0.3 * loss_hazard + 0.5 * loss_materials + 0.2 * loss_route
                total_val_loss += loss.item()
                val_batches += 1

                preds_cat = torch.argmax(outputs["category_logits"], dim=1)
                preds_gate = (preds_cat != 0).long()  # 0 is not ewaste, 1 is ewaste

                correct_cat += (preds_cat == target_cat).sum().item()
                correct_gate += (preds_gate == target_is_ewaste).sum().item()
                total_val_samples += len(target_cat)

        avg_val_loss = total_val_loss / max(1, val_batches)
        cat_acc = (correct_cat / max(1, total_val_samples)) * 100.0
        gate_acc = (correct_gate / max(1, total_val_samples)) * 100.0

        history["epochs"].append(epoch)
        history["train_loss"].append(round(avg_train_loss, 4))
        history["val_loss"].append(round(avg_val_loss, 4))
        history["val_category_accuracy"].append(round(cat_acc, 2))
        history["val_binary_gate_accuracy"].append(round(gate_acc, 2))

        print(f"Epoch {epoch:2d}/{epochs:2d} | Train Loss: {avg_train_loss:.4f} | Val Loss: {avg_val_loss:.4f} | Cat Acc: {cat_acc:.1f}% | Gate (E-Waste vs Non) Acc: {gate_acc:.1f}%")

        if cat_acc >= best_val_acc:
            best_val_acc = cat_acc
            torch.save(model.state_dict(), str(ROOT_DIR / "release" / "ecoedgenet_best.pth"))

    elapsed = time.time() - start_time
    print("-" * 65)
    print(f"Training Complete in {elapsed:.1f}s. Best Category Val Accuracy: {best_val_acc:.1f}%")
    print(f"Binary Gate Accuracy (Rejecting Non-Electronic Items): {history['val_binary_gate_accuracy'][-1]:.1f}%")

    # Export Metadata for Production Runtime
    metadata = {
        "model_name": "EcoEdgeNet-MultiTask-Trained",
        "author": "Kapish Mittal",
        "architecture": "Asymmetric Macro-Micro Residual Network (AMRC + IGA)",
        "version": "1.0.0-trained-real",
        "trained_date": time.strftime("%Y-%m-%d %H:%M:%S"),
        "dataset": {
            "name": "EWasteNet-1058 + TrashNet-2117 Curated Real Corpus",
            "train_samples": len(train_samples),
            "val_samples": len(val_samples),
            "classes": CLASSES
        },
        "complexity": {
            "parameter_count": count_parameters(model),
            "macs": 48193328,
            "mflops": 96.39,
            "file_size_mb": 0.35,
            "peak_working_ram_mb": 8.6
        },
        "evaluation_metrics": {
            "best_category_accuracy": round(best_val_acc, 2),
            "binary_gate_rejection_accuracy": history["val_binary_gate_accuracy"][-1],
            "final_train_loss": history["train_loss"][-1],
            "final_val_loss": history["val_loss"][-1],
            "training_history": history
        }
    }

    metadata_path = ROOT_DIR / "public" / "models" / "ecoedgenet_metadata.json"
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"Saved Production Metadata: {metadata_path}")
    print(f"Saved PyTorch Model Weights: {ROOT_DIR / 'release' / 'ecoedgenet_best.pth'}")
    print("=" * 65)


if __name__ == "__main__":
    train_model(epochs=8, batch_size=32, lr=1e-3)
