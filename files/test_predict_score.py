import pytest
from app.services.score_predictor import predict_score


def test_empty_scores_returns_default():
    low, high, confidence = predict_score([])
    assert low == 50.0
    assert high == 65.0
    assert confidence == "low"


def test_single_score():
    low, high, confidence = predict_score([80.0])
    assert low < 80.0 <= high
    assert confidence == "low"


def test_high_confidence_with_many_sessions():
    scores = [70, 72, 75, 74, 78, 76, 80]
    low, high, confidence = predict_score(scores)
    assert confidence == "high"
    assert low >= 0 and high <= 100


def test_recency_bias_pushes_prediction_up():
    # Later scores are much higher — prediction should trend upward
    low_base, _, _ = predict_score([50, 50, 50, 50, 50, 50, 50])
    low_trending, _, _ = predict_score([50, 55, 60, 65, 70, 75, 80])
    assert low_trending > low_base


def test_score_range_is_valid():
    low, high, _ = predict_score([60, 65, 70])
    assert low <= high
    assert 0 <= low <= 100
    assert 0 <= high <= 100
