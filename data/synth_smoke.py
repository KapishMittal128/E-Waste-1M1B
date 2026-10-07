"""
data/synth_smoke.py - Procedural Synthetic Smoke Dataset Generator for SIEVE-Net
Per Section 2, Rule 3 and Section 7.1 of PROJECT_SPEC.md:
"Synthetic smoke-test data may only be used to test pipelines and must be labeled SYNTHETIC wherever it appears."
"""

import os
import csv
import json
import math
import random
import yaml
from pathlib import Path
from PIL import Image, ImageDraw

def load_taxonomy(config_path="configs/taxonomy.yaml"):
    with open(config_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def generate_synthetic_image(class_name, img_size=(192, 192), seed=42):
    random.seed(seed)
    img = Image.new("RGB", img_size, color=(random.randint(200, 240), random.randint(200, 240), random.randint(200, 240)))
    draw = ImageDraw.Draw(img)
    
    parts_present = []
    
    if class_name == "not_ewaste":
        # Draw household look-alikes: wooden textures, ceramic cups, paper boxes, cloth
        item_type = random.choice(["cardboard_box", "ceramic_mug", "plastic_bottle", "book", "apple"])
        if item_type == "cardboard_box":
            draw.rectangle([30, 30, 160, 160], fill=(190, 150, 100), outline=(140, 100, 60), width=3)
            draw.line([(30, 30), (160, 160)], fill=(160, 120, 80), width=2)
        elif item_type == "ceramic_mug":
            draw.ellipse([50, 40, 140, 150], fill=(240, 240, 250), outline=(180, 180, 200), width=3)
            draw.arc([130, 60, 170, 130], start=270, end=90, fill=(180, 180, 200), width=4)
        elif item_type == "plastic_bottle":
            draw.rectangle([70, 50, 120, 160], fill=(200, 230, 255), outline=(150, 190, 220), width=2)
            draw.rectangle([85, 30, 105, 50], fill=(50, 120, 220))
        elif item_type == "book":
            draw.rectangle([40, 40, 150, 150], fill=(180, 60, 60), outline=(100, 30, 30), width=3)
            draw.line([(55, 40), (55, 150)], fill=(230, 230, 230), width=2)
        else:
            draw.ellipse([50, 50, 140, 140], fill=(220, 50, 50), outline=(160, 30, 30), width=2)
    else:
        # Electronic item: draw main chassis
        draw.rectangle([35, 35, 155, 155], fill=(50, 55, 60), outline=(30, 30, 30), width=3)
        
        # Add e-waste micro-parts based on class
        if "battery" in class_name:
            # Cylindrical or pouch cell
            draw.rectangle([55, 60, 135, 130], fill=(40, 120, 60), outline=(20, 70, 30), width=2)
            draw.rectangle([85, 50, 105, 60], fill=(180, 180, 180)) # Terminal
            parts_present.append({"part": "battery_cell", "box": [55, 60, 135, 130]})
            parts_present.append({"part": "connector_pins", "box": [85, 50, 105, 60]})
        elif "circuit_board" in class_name or "computer" in class_name:
            # PCB green with gold pads and IC chips
            draw.rectangle([45, 45, 145, 145], fill=(20, 90, 40), outline=(10, 50, 20), width=2)
            # IC chip
            draw.rectangle([75, 75, 115, 115], fill=(20, 20, 20), outline=(180, 180, 180), width=1)
            # Traces
            for y in range(55, 140, 15):
                draw.line([(48, y), (142, y)], fill=(180, 160, 40), width=1)
            parts_present.append({"part": "circuit_board", "box": [45, 45, 145, 145]})
        elif "display" in class_name or "phone" in class_name:
            # Dark glass panel with bezel
            draw.rectangle([45, 45, 145, 145], fill=(15, 20, 25), outline=(100, 100, 100), width=2)
            draw.rectangle([85, 145, 105, 153], fill=(120, 120, 120)) # Charging port
            parts_present.append({"part": "screen_panel", "box": [45, 45, 145, 145]})
            parts_present.append({"part": "charging_port", "box": [85, 145, 105, 153]})
        elif "cable" in class_name or "charger" in class_name:
            # Wire bundle and plug pins
            draw.arc([40, 50, 150, 140], start=30, end=300, fill=(30, 30, 30), width=6)
            draw.rectangle([130, 70, 150, 100], fill=(200, 170, 40)) # Pins
            parts_present.append({"part": "wire_bundle", "box": [40, 50, 150, 140]})
            parts_present.append({"part": "power_plug_pins", "box": [130, 70, 150, 100]})
        else:
            # General e-waste: housing with heatsink/grille
            draw.rectangle([50, 50, 140, 140], fill=(70, 75, 80), outline=(40, 40, 40), width=2)
            for x in range(60, 130, 10):
                draw.line([(x, 70), (x, 120)], fill=(30, 30, 30), width=2)
            parts_present.append({"part": "heatsink_or_fan", "box": [60, 70, 130, 120]})

    return img, parts_present

def generate_smoke_dataset(output_dir="data/smoke/data_raw", samples_per_class=20):
    """
    Generates a full synthetic smoke dataset adhering strictly to Section 7.1 directory layout.
    """
    taxonomy = load_taxonomy()
    classes = taxonomy["classes"]
    hazards = taxonomy["hazards"]
    
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)
    meta_path = out_path / "_meta"
    meta_path.mkdir(parents=True, exist_ok=True)
    
    sessions_rows = []
    hazards_rows = []
    parts_boxes_dict = {}
    
    # 4 distinct capture sessions to test group-aware splitting
    session_ids = ["SYNTH_SESSION_01", "SYNTH_SESSION_02", "SYNTH_SESSION_03", "SYNTH_SESSION_04"]
    
    total_generated = 0
    for class_idx, class_name in enumerate(classes):
        class_dir = out_path / class_name
        class_dir.mkdir(parents=True, exist_ok=True)
        
        for i in range(samples_per_class):
            sess_id = session_ids[i % len(session_ids)]
            sess_dir = class_dir / sess_id
            sess_dir.mkdir(parents=True, exist_ok=True)
            
            img_filename = f"SYNTH_{class_name}_{i:04d}.jpg"
            img_path = sess_dir / img_filename
            rel_path = f"{class_name}/{sess_id}/{img_filename}"
            
            seed = class_idx * 1000 + i
            img, parts = generate_synthetic_image(class_name, seed=seed)
            img.save(img_path, format="JPEG", quality=90)
            
            if parts:
                parts_boxes_dict[rel_path] = parts
                
            # Hazards assignment
            img_hazards = [0] * len(hazards)
            if "battery" in class_name:
                img_hazards[0] = 1 # lithium_battery_likely
                if i % 4 == 0:
                    img_hazards[3] = 1 # damaged_battery_visible
            elif "lighting" in class_name and i % 2 == 0:
                img_hazards[1] = 1 # mercury_lamp
            elif "display" in class_name and i % 5 == 0:
                img_hazards[2] = 1 # crt_display
                
            hazards_rows.append([rel_path] + img_hazards)
            total_generated += 1
            
    # Write sessions metadata
    for sess_id in session_ids:
        sessions_rows.append({
            "session_id": sess_id,
            "date": "2026-10-05",
            "location_type": "SYNTHETIC_LAB",
            "lighting": "SIMULATED_STUDIO",
            "device_model": "VIRTUAL_SMOKE_CAMERA",
            "collector_id": "SYNTHETIC_GENERATOR",
            "consent_ok": "TRUE_SYNTHETIC"
        })
        
    with open(meta_path / "sessions.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(sessions_rows[0].keys()))
        writer.writeheader()
        writer.writerows(sessions_rows)
        
    with open(meta_path / "hazards.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["image_rel_path"] + hazards)
        writer.writerows(hazards_rows)
        
    with open(meta_path / "parts_boxes.json", "w", encoding="utf-8") as f:
        json.dump(parts_boxes_dict, f, indent=2)
        
    print(f"[SYNTH_SMOKE] Successfully generated {total_generated} synthetic smoke images across {len(classes)} classes.")
    print(f"[SYNTH_SMOKE] Output directory: {out_path.resolve()}")
    return total_generated

if __name__ == "__main__":
    generate_smoke_dataset()
