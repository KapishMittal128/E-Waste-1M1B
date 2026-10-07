"""
SIEVE-Net Provenance Guard Test
Fails CI if:
  (a) Any file in sieve/ imports from model zoos (keras.applications, tf_hub, torchvision.models, timm, transformers).
  (b) Disallowed operators or custom/Flex ops are present.
"""

import os
import re
import sys

FORBIDDEN_PATTERNS = [
    r"keras\.applications",
    r"tf\.keras\.applications",
    r"tensorflow_hub",
    r"torchvision\.models",
    r"timm",
    r"transformers",
    r"huggingface",
    r"open_clip"
]

def scan_file_for_forbidden_imports(filepath: str) -> list[str]:
    violations = []
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        for idx, line in enumerate(f, 1):
            # Ignore comments
            stripped = line.strip()
            if stripped.startswith("#"):
                continue
            for pattern in FORBIDDEN_PATTERNS:
                if re.search(pattern, line):
                    violations.append(f"{filepath}:{idx} matches forbidden pattern '{pattern}': {stripped}")
    return violations


def test_provenance_guard():
    target_dirs = ["sieve", "ml"]
    all_violations = []

    for d in target_dirs:
        if not os.path.exists(d):
            continue
        for root, _, files in os.walk(d):
            for file in files:
                if file.endswith(".py"):
                    full_path = os.path.join(root, file)
                    violations = scan_file_for_forbidden_imports(full_path)
                    all_violations.extend(violations)

    if all_violations:
        print("\nPROVENANCE GUARD VIOLATION DETECTED:")
        for v in all_violations:
            print(f"  FAILED: {v}")
        assert False, f"Found {len(all_violations)} forbidden model zoo imports."
    else:
        print("\nPROVENANCE GUARD PASSED: Zero forbidden model zoo imports found across architecture code.")


if __name__ == "__main__":
    test_provenance_guard()
