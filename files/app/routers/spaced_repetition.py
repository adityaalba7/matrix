from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.llm_client import ask_llm
from datetime import datetime, timedelta
import json

router = APIRouter()

class FlashcardResult(BaseModel):
    card_id: str
    question: str
    was_correct: bool
    difficulty: int

class SpacedRepRequest(BaseModel):
    subject: str
    topic: str
    previous_results: list[FlashcardResult] = []

class SpacedRepCard(BaseModel):
    card_id: str
    question: str
    answer: str
    disguised_question: str
    next_review_date: str
    difficulty_level: str

class SpacedRepResponse(BaseModel):
    cards_to_review: list[SpacedRepCard]
    new_cards: list[SpacedRepCard]
    study_schedule: dict
    performance_summary: str

@router.post("/generate", response_model=SpacedRepResponse)
def generate_spaced_repetition(request: SpacedRepRequest):
    """Generates spaced repetition cards with disguised questions for wrong answers."""
    wrong_cards = [r for r in request.previous_results if not r.was_correct]

    system = """You are a spaced repetition learning expert.
Create flashcards with disguised versions of questions that were answered incorrectly.
The disguised version rephrases the question completely so students can't pattern-match.
Respond ONLY in valid JSON:
{
  "cards_to_review": [{"card_id": "card_001", "question": "Original question", "answer": "Correct answer", "disguised_question": "Rephrased version", "next_review_date": "2026-04-10", "difficulty_level": "hard"}],
  "new_cards": [{"card_id": "card_new_001", "question": "New concept question", "answer": "Answer", "disguised_question": "Alternative phrasing", "next_review_date": "2026-04-08", "difficulty_level": "medium"}],
  "study_schedule": {"2026-04-08": ["card_001"], "2026-04-11": ["card_002"]},
  "performance_summary": "Performance analysis paragraph"
}
Only return JSON."""

    today = datetime.now().strftime("%Y-%m-%d")
    review_in_3 = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")

    wrong_summary = ""
    if wrong_cards:
        wrong_summary = "Wrong answers to disguise:\n" + "\n".join(
            [f"- Q: {c.question} (difficulty rated: {c.difficulty}/5)" for c in wrong_cards]
        )

    user_msg = f"""Subject: {request.subject}
Topic: {request.topic}
Today's date: {today}
Review date (3 days): {review_in_3}

{wrong_summary}

Generate spaced repetition cards with disguised versions for wrong answers and new cards for this topic."""

    try:
        result = ask_llm(user_msg, system=system, max_tokens=3000)
        data = json.loads(result)
        return SpacedRepResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")
