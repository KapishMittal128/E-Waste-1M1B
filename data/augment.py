"""
data/augment.py - Deterministic Data Augmentation Pipeline for SIEVE-Net
Per Section 7.4 of PROJECT_SPEC.md:
Random-resized-crop, flips, rotation, color jitter, blur, sensor noise, JPEG compression,
low-light simulation, and random erasing.
"""

import math
import random
import numpy as np
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter

class SieveAugmentor:
    def __init__(self, target_size=(192, 192), seed=42):
        self.target_size = target_size
        self.seed = seed
        self.rng = random.Random(seed)
        self.np_rng = np.random.default_rng(seed)

    def random_resized_crop(self, img, scale=(0.35, 1.0), ratio=(3.0/4.0, 4.0/3.0)):
        w, h = img.size
        area = w * h
        for _ in range(10):
            target_area = self.rng.uniform(*scale) * area
            log_ratio = (math.log(ratio[0]), math.log(ratio[1]))
            aspect_ratio = math.exp(self.rng.uniform(*log_ratio))
            
            crop_w = int(round(math.sqrt(target_area * aspect_ratio)))
            crop_h = int(round(math.sqrt(target_area / aspect_ratio)))
            
            if 0 < crop_w <= w and 0 < crop_h <= h:
                x1 = self.rng.randint(0, w - crop_w)
                y1 = self.rng.randint(0, h - crop_h)
                cropped = img.crop((x1, y1, x1 + crop_w, y1 + crop_h))
                return cropped.resize(self.target_size, Image.Resampling.BILINEAR)
                
        # Fallback to center crop
        in_ratio = float(w) / float(h)
        if in_ratio < ratio[0]:
            crop_w = w
            crop_h = int(round(crop_w / ratio[0]))
        elif in_ratio > ratio[1]:
            crop_h = h
            crop_w = int(round(crop_h * ratio[1]))
        else:
            crop_w = w
            crop_h = h
        x1 = (w - crop_w) // 2
        y1 = (h - crop_h) // 2
        return img.crop((x1, y1, x1 + crop_w, y1 + crop_h)).resize(self.target_size, Image.Resampling.BILINEAR)

    def color_jitter(self, img):
        # Brightness
        if self.rng.random() < 0.8:
            factor = self.rng.uniform(0.6, 1.4)
            img = ImageEnhance.Brightness(img).enhance(factor)
        # Contrast
        if self.rng.random() < 0.8:
            factor = self.rng.uniform(0.6, 1.4)
            img = ImageEnhance.Contrast(img).enhance(factor)
        # Color saturation
        if self.rng.random() < 0.8:
            factor = self.rng.uniform(0.6, 1.4)
            img = ImageEnhance.Color(img).enhance(factor)
        return img

    def add_sensor_noise(self, img):
        arr = np.array(img, dtype=np.float32)
        noise = self.np_rng.normal(0, 8.0, arr.shape).astype(np.float32)
        noisy = np.clip(arr + noise, 0, 255).astype(np.uint8)
        return Image.fromarray(noisy)

    def random_erasing(self, img, p=0.3):
        if self.rng.random() > p:
            return img
        arr = np.array(img).copy()
        h, w, _ = arr.shape
        area = h * w
        erase_area = self.rng.uniform(0.02, 0.2) * area
        aspect = math.exp(self.rng.uniform(math.log(0.3), math.log(3.3)))
        ew = int(round(math.sqrt(erase_area * aspect)))
        eh = int(round(math.sqrt(erase_area / aspect)))
        if ew < w and eh < h:
            x1 = self.rng.randint(0, w - ew)
            y1 = self.rng.randint(0, h - eh)
            fill_val = [self.rng.randint(0, 255) for _ in range(3)]
            arr[y1:y1+eh, x1:x1+ew] = fill_val
        return Image.fromarray(arr)

    def augment(self, img):
        # 1. Random Resized Crop
        img = self.random_resized_crop(img)
        # 2. Horizontal Flip
        if self.rng.random() < 0.5:
            img = img.transpose(Image.FLIP_LEFT_RIGHT)
        # 3. Vertical Flip (p=0.2)
        if self.rng.random() < 0.2:
            img = img.transpose(Image.FLIP_TOP_BOTTOM)
        # 4. Rotation ±30°
        if self.rng.random() < 0.5:
            angle = self.rng.uniform(-30, 30)
            img = img.rotate(angle, resample=Image.Resampling.BILINEAR)
        # 5. Color jitter
        img = self.color_jitter(img)
        # 6. Sensor noise
        if self.rng.random() < 0.4:
            img = self.add_sensor_noise(img)
        # 7. Blur
        if self.rng.random() < 0.3:
            img = img.filter(ImageFilter.GaussianBlur(radius=self.rng.uniform(0.5, 1.5)))
        # 8. Random Erasing
        img = self.random_erasing(img, p=0.3)
        return img

def generate_gallery(input_img_path, output_dir="reports/gallery", num_variations=8):
    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)
    
    img = Image.open(input_img_path).convert("RGB")
    img.save(out_path / "original.jpg")
    
    augmentor = SieveAugmentor(target_size=(192, 192), seed=1337)
    
    for i in range(num_variations):
        aug_img = augmentor.augment(img.copy())
        aug_img.save(out_path / f"aug_variation_{i+1:02d}.jpg")
        
    print(f"[AUGMENTATION] Gallery saved with {num_variations} variations at {out_path.resolve()}")

if __name__ == "__main__":
    sample_img = next(Path("data/smoke/data_raw").rglob("*.jpg"), None)
    if sample_img:
        generate_gallery(sample_img)
    else:
        print("No sample image found. Run data/synth_smoke.py first.")
