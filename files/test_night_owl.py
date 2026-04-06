import pytest
from app.utils.time_utils import score_by_hour, best_hour_range, format_hour


def test_score_by_hour_groups_correctly():
    class FakeSession:
        def __init__(self, hour, score):
            from datetime import datetime
            self.taken_at = datetime(2024, 1, 1, hour)
            self.score = score

    sessions = [FakeSession(21, 80), FakeSession(21, 90), FakeSession(10, 60)]
    result = score_by_hour(sessions)
    assert result[21] == 85.0
    assert result[10] == 60.0


def test_best_hour_range_returns_highest_window():
    hour_scores = {9: 70, 10: 80, 21: 90, 22: 95}
    start, end = best_hour_range(hour_scores, window_size=2)
    assert start == 21
    assert end == 23


def test_best_hour_range_empty_returns_default():
    start, end = best_hour_range({})
    assert start == 20
    assert end == 22


def test_format_hour():
    assert format_hour(9)  == "9 AM"
    assert format_hour(21) == "9 PM"
    assert format_hour(0)  == "12 AM"
