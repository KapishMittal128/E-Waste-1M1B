"""
data/validate.py - Data Engine Validator for SIEVE-Net
Validates image files, metadata schema, and session provenance per Section 7.1 and 7.2.
"""

import os
import csv
import json
import yaml
from pathlib import Path
from PIL import Image

def validate_dataset(data_dir="data/smoke/data_raw", taxonomy_path="configs/taxonomy.yaml"):
    with open(taxonomy_path, "r", encoding="utf-8") as f:
        taxonomy = yaml.safe_load(f)
        
    expected_classes = set(taxonomy["classes"])
    data_path = Path(data_dir)
    
    if not data_path.exists():
        raise FileNotFoundError(f"Data directory {data_dir} does not exist.")
        
    meta_path = data_path / "_meta"
    sessions_file = meta_path / "sessions.csv"
    hazards_file = meta_path / "hazards.csv"
    parts_file = meta_path / "parts_boxes.json"
    
    # 1. Validate metadata existence
    if not sessions_file.exists():
        raise FileNotFoundError(f"Missing {sessions_file}")
        
    sessions = {}
    with open(sessions_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            sessions[row["session_id"]] = row
            
    # 2. Scan class folders and sessions
    class_counts = {c: 0 for c in expected_classes}
    session_counts = {s: 0 for s in sessions}
    corrupted_images = []
    total_images = 0
    
    for class_folder in data_path.iterdir():
        if class_folder.name == "_meta" or not class_folder.is_dir():
            continue
            
        class_name = class_folder.name
        if class_name not in expected_classes:
            print(f"[WARNING] Unexpected class folder: {class_name}")
            continue
            
        for sess_folder in class_folder.iterdir():
            if not sess_folder.is_dir():
                continue
            sess_id = sess_folder.name
            if sess_id not in sessions:
                print(f"[WARNING] Session folder {sess_id} not registered in sessions.csv")
                
            for img_file in sess_folder.glob("*.jpg"):
                total_images += 1
                try:
                    with Image.open(img_file) as im:
                        im.verify()
                    class_counts[class_name] += 1
                    session_counts[sess_id] = session_counts.get(sess_id, 0) + 1
                except Exception as e:
                    corrupted_images.append((str(img_file), str(e)))
                    
    # 3. Print Inventory Table
    print("=================================================================")
    print("SIEVE-Net Dataset Inventory & Validation Report")
    print("=================================================================")
    print(f"Data Path: {data_path.resolve()}")
    print(f"Total Images Validated: {total_images}")
    print(f"Corrupted Images: {len(corrupted_images)}")
    print("-----------------------------------------------------------------")
    print("Class Distribution:")
    for c, cnt in sorted(class_counts.items()):
        print(f"  - {c:<25}: {cnt} images")
    print("-----------------------------------------------------------------")
    print("Session Distribution:")
    for s, cnt in sorted(session_counts.items()):
        print(f"  - {s:<25}: {cnt} images")
    print("=================================================================")
    
    if corrupted_images:
        raise ValueError(f"Validation failed with {len(corrupted_images)} corrupted images.")
        
    return {
        "total_images": total_images,
        "class_counts": class_counts,
        "session_counts": session_counts
    }

if __name__ == "__main__":
    validate_dataset()
