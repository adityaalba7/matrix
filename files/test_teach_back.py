import pytest
from app.services.teach_back_service import _letter_grade


def test_grade_a_plus():
    assert _letter_grade(95) == "A+"

def test_grade_a():
    assert _letter_grade(85) == "A"

def test_grade_b_plus():
    assert _letter_grade(75) == "B+"

def test_grade_b():
    assert _letter_grade(65) == "B"

def test_grade_c():
    assert _letter_grade(55) == "C"

def test_grade_d():
    assert _letter_grade(40) == "D"

def test_grade_boundary_90():
    assert _letter_grade(90) == "A+"

def test_grade_boundary_80():
    assert _letter_grade(80) == "A"
