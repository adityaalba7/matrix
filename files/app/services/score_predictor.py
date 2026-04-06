"""
Score Predictor
---------------
Uses a weighted moving-average model over the user's recent quiz scores
for a given subject. No external ML library required — pure statistics.

Higher-weight is given to more recent sessions (recency bias).
"""

from __future__ import annotations
from typing import List
import math


def predict_score(scores: List[float]) -> tuple[float, float, str]:
    """
    Given a list of past scores (oldest first), return:
        (score_low, score_high, confidence)

    confidence: "high" if ≥7 sessions, "medium" if 3–6, "low" if <3.
    """
    n = len(scores)
    if n == 0:
        return (50.0, 65.0, "low")

    # Linearly increasing weights: most recent session has weight n, oldest has 1
    weights = list(range(1, n + 1))
    weighted_sum = sum(w * s for w, s in zip(weights, scores))
    total_weight = sum(weights)
    avg = weighted_sum / total_weight

    # Standard deviation of scores as a proxy for variance
    variance = sum((s - avg) ** 2 for s in scores) / n
    std = math.sqrt(variance)
    half_range = max(3.0, min(std * 1.2, 12.0))   # clamp to [3, 12]

    low  = round(max(0.0,   avg - half_range), 1)
    high = round(min(100.0, avg + half_range), 1)

    confidence = "high" if n >= 7 else ("medium" if n >= 3 else "low")
    return low, high, confidence
