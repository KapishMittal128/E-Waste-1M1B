# SIEVE-Net: Reproducibility Makefile
# Per Section 12 & 15 of PROJECT_SPEC.md: "make reproduce"

.PHONY: all reproduce test smoke clean audit

PYTHON = .venv/Scripts/python.exe

all: reproduce

reproduce: smoke test audit
	@echo "================================================================="
	@echo "SIEVE-Net Pipeline Successfully Reproduced!"
	@echo "All guardrails, tests, and budgets verified."
	@echo "================================================================="

smoke:
	@echo "--> Generating Synthetic Smoke Dataset..."
	$(PYTHON) data/synth_smoke.py
	@echo "--> Validating Dataset..."
	$(PYTHON) data/validate.py
	@echo "--> Generating Group-Aware Splits..."
	$(PYTHON) data/splits.py
	@echo "--> Generating Augmentation Gallery..."
	$(PYTHON) data/augment.py

test:
	@echo "--> Running Provenance Guard..."
	$(PYTHON) tests/test_provenance.py
	@echo "--> Running Allowed Ops Test..."
	$(PYTHON) tests/test_ops_allowed.py
	@echo "--> Running Shape Contract Verification..."
	$(PYTHON) tests/test_shapes.py
	@echo "--> Running Split Leakage Test..."
	$(PYTHON) tests/test_split_leakage.py

audit:
	@echo "--> Running Hardware Budget Audit..."
	$(PYTHON) tests/test_budget.py

clean:
	@echo "--> Cleaning temporary files..."
	rm -rf data/smoke data/splits reports/gallery
