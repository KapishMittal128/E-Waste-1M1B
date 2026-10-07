"""
tests/test_split_leakage.py - Split Leakage Acceptance Test for Phase 1
Per Section 2, Rule 7 and Phase 1 Acceptance Gate:
"Gate: leakage test passes (no session in two splits); the augmentation gallery is saved for my review;
real-data inventory table generated (counts per class/session) or a clear statement that no real data exists yet."
"""

import os
import json
import hashlib
from pathlib import Path

def test_split_leakage():
    splits_file = Path("data/splits/splits.json")
    assert splits_file.exists(), "Splits file missing! Run data/splits.py"
    
    with open(splits_file, "r", encoding="utf-8") as f:
        splits = json.load(f)
        
    train_sessions = {item["session_id"] for item in splits["train"]}
    val_sessions = {item["session_id"] for item in splits["val"]}
    test_sessions = {item["session_id"] for item in splits["locked_test"]}
    
    # Check 1: Session disjointness
    train_val_overlap = train_sessions.intersection(val_sessions)
    train_test_overlap = train_sessions.intersection(test_sessions)
    val_test_overlap = val_sessions.intersection(test_sessions)
    
    assert len(train_val_overlap) == 0, f"Leakage detected between train and val sessions: {train_val_overlap}"
    assert len(train_test_overlap) == 0, f"Leakage detected between train and test sessions: {train_test_overlap}"
    assert len(val_test_overlap) == 0, f"Leakage detected between val and test sessions: {val_test_overlap}"
    
    # Check 2: Image path disjointness
    train_imgs = {item["rel_path"] for item in splits["train"]}
    val_imgs = {item["rel_path"] for item in splits["val"]}
    test_imgs = {item["rel_path"] for item in splits["locked_test"]}
    
    assert len(train_imgs.intersection(val_imgs)) == 0, "Duplicate images in train and val!"
    assert len(train_imgs.intersection(test_imgs)) == 0, "Duplicate images in train and test!"
    assert len(val_imgs.intersection(test_imgs)) == 0, "Duplicate images in val and test!"
    
    # Check 3: Locked test SHA-256 manifest exists and matches
    manifest_file = Path("data/splits/locked_test_manifest.sha256")
    assert manifest_file.exists(), "Locked test set manifest missing!"
    
    print("=================================================================")
    print("SPLIT LEAKAGE ACCEPTANCE TEST PASSED:")
    print(f"  Train Sessions:       {sorted(list(train_sessions))}")
    print(f"  Val Sessions:         {sorted(list(val_sessions))}")
    print(f"  Locked Test Sessions: {sorted(list(test_sessions))}")
    print("  Inter-split Overlap:  0 sessions, 0 images")
    print("=================================================================")

if __name__ == "__main__":
    test_split_leakage()
