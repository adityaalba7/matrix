import pytest
from app.services.panic_generator import generate_panic_questions
from unittest.mock import patch


MOCK_GEMINI_RESPONSE = """[
  {
    "question": "What is a primary key?",
    "options": ["A. A key that locks the DB", "B. A unique identifier for a row", "C. A foreign reference", "D. An index"],
    "answer_index": 1,
    "explanation": "A primary key uniquely identifies each record in a table."
  }
]"""


@patch("app.services.panic_generator.ask_llm", return_value=MOCK_GEMINI_RESPONSE)
def test_generates_questions(mock_llm):
    questions = generate_panic_questions("DBMS", n=1)
    assert len(questions) == 1
    assert questions[0]["answer_index"] == 1
    assert len(questions[0]["options"]) == 4


@patch("app.services.panic_generator.ask_llm", return_value="invalid json {{")
def test_fallback_on_bad_json(mock_llm):
    questions = generate_panic_questions("DBMS", n=5)
    assert len(questions) == 1
    assert "question" in questions[0]
