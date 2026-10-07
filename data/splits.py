"""
data/splits.py - Group-Aware Session Splitter & Locked Test Set Generator
Per Section 2, Rule 7 and Section 7.3 of PROJECT_SPEC.md:
"Split by session/location group, never by image: train 70 / val 15 / test 15 -> then carve out a locked final test set from sessions that appear nowhere else."
"""

import os
import csv
import json
import hashlib
from pathlib import Path
import random

def compute_sha256(filepath):
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def create_group_splits(data_dir="data/smoke/data_raw", output_dir="data/splits", seed=42):
    random.seed(seed)
    data_path = Path(data_dir)
    meta_path = data_path / "_meta"
    sessions_file = meta_path / "sessions.csv"
    
    if not sessions_file.exists():
        raise FileNotFoundError(f"Missing {sessions_file}")
        
    sessions = []
    with open(sessions_file, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            sessions.append(row["session_id"])
            
    # Distinct session list
    sessions = sorted(list(set(sessions)))
    random.shuffle(sessions)
    
    # Session assignment: ensure at least 1 session in test and val
    n = len(sessions)
    if n < 3:
        raise ValueError(f"Need at least 3 distinct sessions for group-aware splitting, found {n}")
        
    # Allocate: Test gets at least 1 session (locked test set)
    locked_test_sessions = [sessions[0]]
    val_sessions = [sessions[1]]
    train_sessions = sessions[2:]
    
    splits = {
        "train": [],
        "val": [],
        "locked_test": []
    }
    
    session_mapping = {}
    for s in train_sessions:
        session_mapping[s] = "train"
    for s in val_sessions:
        session_mapping[s] = "val"
    for s in locked_test_sessions:
        session_mapping[s] = "locked_test"
        
    manifest_lines = []
    
    for class_folder in sorted(data_path.iterdir()):
        if class_folder.name == "_meta" or not class_folder.is_dir():
            continue
        class_name = class_folder.name
        
        for sess_folder in sorted(class_folder.iterdir()):
            if not sess_folder.is_dir():
                continue
            sess_id = sess_folder.name
            split_target = session_mapping.get(sess_id)
            if not split_target:
                continue
                
            for img_file in sorted(sess_folder.glob("*.jpg")):
                rel_path = f"{class_name}/{sess_id}/{img_file.name}"
                item_entry = {
                    "rel_path": rel_path,
                    "class_name": class_name,
                    "session_id": sess_id
                }
                splits[split_target].append(item_entry)
                
                if split_target == "locked_test":
                    sha = compute_sha256(img_file)
                    manifest_lines.append(f"{sha}  {rel_path}\n")
                    
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)
    
    splits_file = out_path / "splits.json"
    with open(splits_file, "w", encoding="utf-8") as f:
        json.dump(splits, f, indent=2)
        
    manifest_file = out_path / "locked_test_manifest.sha256"
    with open(manifest_file, "w", encoding="utf-8") as f:
        f.writelines(sorted(manifest_lines))
        
    print("=================================================================")
    print("SIEVE-Net Group-Aware Splits Created (Zero Leakage)")
    print("=================================================================")
    print(f"Train Sessions:       {train_sessions} ({len(splits['train'])} images)")
    print(f"Val Sessions:         {val_sessions} ({len(splits['val'])} images)")
    print(f"Locked Test Sessions: {locked_test_sessions} ({len(splits['locked_test'])} images)")
    print(f"SHA-256 Manifest:     {manifest_file.resolve()}")
    print("=================================================================")
    
    return splits

if __name__ == "__main__":
    create_group_splits()
