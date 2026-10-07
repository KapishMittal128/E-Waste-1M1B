# E-Waste Field Data Collection Protocol & Volunteer Guide

**Project:** SIEVE-Net (Staged Inference for E-waste Verification at the Edge)  
**Standard:** Ethical Edge AI for UN SDG 12  
**Document:** `docs/DATA_COLLECTION_GUIDE.md`  

---

## 1. Objectives & Image Quotas

To achieve defensible accuracy without relying on pre-trained corporate foundation models, SIEVE-Net requires a well-documented, diverse dataset captured on low-cost devices.

| Category Type | Minimum Target (Phase 3 Baseline) | Production Target (Full Deployment) |
|---|---|---|
| **E-Waste Classes (13 Categories)** | $\ge 300$ images per class | $\ge 1,500$ images per class |
| **`not_ewaste` Hard Negatives** | $\ge 5,000$ images across $\ge 30$ household classes | $\ge 15,000$ images |
| **Micro-Part Annotations** | $\ge 50$ annotated boxes per named part | $\ge 300$ boxes per named part |

---

## 2. Capture Diversity Requirements

Volunteers and field enumerators must capture items under authentic, non-sterile conditions:
1. **Backgrounds:** Bare floor, wooden table, jute sacks, recycling bins, scrap dealer scales, plastic tarpaulins.
2. **Lighting:** Direct sunlight, shaded outdoor, fluorescent tube lights, dim scrap-shed corners, mobile LED flash.
3. **Condition:** Pristine devices, cracked casings, dusty/dirty discarded items, stripped wire bundles, water-damaged electronics.
4. **Angles & Distances:** Direct top-down ($90^\circ$), angled isometric ($45^\circ$), close-up micro-features (ports, labels, screws) within 15–25 cm.
5. **Video Walk-Around Protocol:**
   - Record a 30 to 60-second video orbiting the object at 2–3 feet distance.
   - Extract frames at 2–3 fps.
   - **Crucial Rule:** The entire video represents **one session ID**. Never split frames from the same video across training and test splits.

---

## 3. Privacy, Anonymity & PII Rules (Zero Tolerance)

- **No Faces:** Never capture faces of waste collectors, recyclers, or bystanders.
- **No Personal Data:** Never capture screens showing phone numbers, chats, emails, or government IDs.
- **No Vehicle Plates:** Obscure or re-frame any visible license plates on collection trucks.
- **Automated PII Verification:** Every ingested batch must run through `data/validate.py` before entry into `data_raw/`.

---

## 4. Metadata & Provenance Logging

Every session folder must be accompanied by an entry in `_meta/sessions.csv`:
```csv
session_id,date,location_type,lighting,device_model,collector_id,consent_ok
GWL_SCRAP_001,2026-10-15,INFORMAL_RECYCLER,TUBE_LIGHT,REDMI_9A,COLLECTOR_04,TRUE
```
Images lacking documented consent or collector attribution will be automatically rejected.
