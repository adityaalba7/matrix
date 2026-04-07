from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.llm_client import ask_llm
import json

router = APIRouter()

class MonthlyActivity(BaseModel):
    month: str
    subjects_studied: list[str]
    total_study_hours: float
    quizzes_taken: int
    quizzes_passed: int
    flashcards_reviewed: int
    streak_days: int
    goals_set: list[str]
    goals_achieved: list[str]
    mood_entries: list[str] = []

class MonthlyWrapResponse(BaseModel):
    headline: str
    top_achievement: str
    study_personality: str
    stats_story: str
    subject_breakdown: dict
    next_month_goals: list[str]
    motivational_theme: str
    shareable_summary: dict

@router.post("/generate", response_model=MonthlyWrapResponse)
def generate_monthly_wrap(request: MonthlyActivity):
    """Generates a Spotify Wrapped-style monthly recap for a student's learning journey."""
    system = """You are a creative storyteller creating Spotify Wrapped-style monthly recaps for students.
Make it engaging, fun, and shareable. Use emojis. Give them a personality.
Respond ONLY in valid JSON:
{
  "headline": "🔥 March 2026: The Month You Became Unstoppable",
  "top_achievement": "You studied 12 days straight without breaking your streak!",
  "study_personality": "The Midnight Warrior 🌙",
  "stats_story": "Engaging narrative about their month in 2-3 paragraphs",
  "subject_breakdown": {"Data Structures": 24, "DBMS": 12, "OS": 8},
  "next_month_goals": ["goal1", "goal2"],
  "motivational_theme": "Theme or quote for next month",
  "shareable_summary": {"title": "My March 2026 Study Wrap", "hours": 44, "streak": 12, "top_subject": "Data Structures", "personality": "Midnight Warrior", "badge": "🏆 Consistency King"}
}
Only return JSON. Make it fun and Instagram-worthy."""

    user_msg = f"""Month: {request.month}
Total Study Hours: {request.total_study_hours}
Subjects: {', '.join(request.subjects_studied)}
Quizzes: {request.quizzes_passed}/{request.quizzes_taken} passed
Flashcards reviewed: {request.flashcards_reviewed}
Streak: {request.streak_days} days
Goals set: {', '.join(request.goals_set)}
Goals achieved: {', '.join(request.goals_achieved)}
Moods recorded: {', '.join(request.mood_entries) if request.mood_entries else 'Not tracked'}

Generate an engaging monthly wrap."""

    try:
        result = ask_llm(user_msg, system=system, max_tokens=2000)
        data = json.loads(result)
        return MonthlyWrapResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")
