"""
eval/metrics.py - Evaluation Metrics Suite for SIEVE-Net
Per Section 2 (Rule 5) and Section 10 of PROJECT_SPEC.md:
- Macro-F1, per-class precision/recall, confusion matrix
- Binary e-waste recall at precision >= 90%
- Expected Calibration Error (ECE)
- Bootstrap 95% confidence intervals over 1,000 resamples
"""

import numpy as np

def compute_confusion_matrix(y_true, y_pred, num_classes=14):
    cm = np.zeros((num_classes, num_classes), dtype=np.int64)
    for t, p in zip(y_true, y_pred):
        cm[t, p] += 1
    return cm

def compute_classification_metrics(y_true, y_pred, num_classes=14):
    y_true = np.array(y_true)
    y_pred = np.array(y_pred)
    cm = compute_confusion_matrix(y_true, y_pred, num_classes)
    
    precisions = []
    recalls = []
    f1s = []
    
    for c in range(num_classes):
        tp = cm[c, c]
        fp = np.sum(cm[:, c]) - tp
        fn = np.sum(cm[c, :]) - tp
        
        prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = (2 * prec * rec) / (prec + rec) if (prec + rec) > 0 else 0.0
        
        precisions.append(prec)
        recalls.append(rec)
        f1s.append(f1)
        
    macro_f1 = float(np.mean(f1s))
    top1_acc = float(np.mean(y_true == y_pred)) * 100.0
    
    # Binary e-waste metric: Class 0 is not_ewaste, Classes 1..13 are e-waste
    bin_true = (y_true != 0).astype(int)
    bin_pred = (y_pred != 0).astype(int)
    tp_bin = np.sum((bin_true == 1) & (bin_pred == 1))
    fp_bin = np.sum((bin_true == 0) & (bin_pred == 1))
    fn_bin = np.sum((bin_true == 1) & (bin_pred == 0))
    
    bin_prec = tp_bin / (tp_bin + fp_bin) if (tp_bin + fp_bin) > 0 else 0.0
    bin_rec = tp_bin / (tp_bin + fn_bin) if (tp_bin + fn_bin) > 0 else 0.0
    
    return {
        "macro_f1": macro_f1,
        "top1_acc": top1_acc,
        "per_class_f1": f1s,
        "binary_ewaste_precision": float(bin_prec),
        "binary_ewaste_recall": float(bin_rec),
        "confusion_matrix": cm.tolist()
    }

def compute_ece(probs, y_true, n_bins=10):
    """
    Expected Calibration Error (ECE) with equal-width probability bins.
    Target per Section 4: ECE <= 0.05
    """
    confidences = np.max(probs, axis=1)
    predictions = np.argmax(probs, axis=1)
    accuracies = (predictions == y_true)

    bin_boundaries = np.linspace(0, 1, n_bins + 1)
    ece = 0.0
    total_samples = len(y_true)

    for i in range(n_bins):
        bin_lower = bin_boundaries[i]
        bin_upper = bin_boundaries[i + 1]
        
        in_bin = (confidences > bin_lower) & (confidences <= bin_upper)
        prop_in_bin = np.mean(in_bin)
        
        if prop_in_bin > 0:
            accuracy_in_bin = np.mean(accuracies[in_bin])
            avg_confidence_in_bin = np.mean(confidences[in_bin])
            ece += np.abs(avg_confidence_in_bin - accuracy_in_bin) * prop_in_bin

    return float(ece)

def bootstrap_confidence_interval(metric_fn, y_true, y_pred, n_bootstraps=1000, alpha=0.05, seed=42):
    """
    Computes 95% bootstrap confidence interval per Section 2, Rule 5.
    """
    rng = np.random.default_rng(seed)
    n = len(y_true)
    scores = []
    
    for _ in range(n_bootstraps):
        indices = rng.integers(0, n, size=n)
        sample_true = np.array(y_true)[indices]
        sample_pred = np.array(y_pred)[indices]
        score = metric_fn(sample_true, sample_pred)
        scores.append(score)
        
    lower = float(np.percentile(scores, 100 * (alpha / 2.0)))
    upper = float(np.percentile(scores, 100 * (1 - alpha / 2.0)))
    mean = float(np.mean(scores))
    std = float(np.std(scores))
    
    return {
        "mean": mean,
        "std": std,
        "ci_95_lower": lower,
        "ci_95_upper": upper
    }
