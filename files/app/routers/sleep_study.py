from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.llm_client import ask_llm
import json

router = APIRouter()

class SleepEntry(BaseModel):
    date: str
    sleep_hours: float
    sleep_quality: int
    study_hours: float
    productivity_rating: int
    subjects_studied: list[str] = []

class SleepStudyRequest(BaseModel):
    entries: list[SleepEntry]
    goal: str = "Maximize study productivity"

class SleepStudyResponse(BaseModel):
    peak_performance_window: str
    optimal_sleep_hours: float
    correlation_insights: list[str]
    weekly_pattern: dict
    recommendations: list[str]
    sleep_schedule: dict
    performance_trend: str

@router.post("/analyze", response_model=SleepStudyResponse)
def analyze_sleep_study(request: SleepStudyRequest):
    """Analyzes sleep logs and study sessions to find peak performance patterns."""
    if len(request.entries) < 3:
        raise HTTPException(status_code=400, detail="At least 3 entries required for analysis")

    system = """You are a sleep science and productivity expert.
Analyze sleep patterns and their correlation with study performance.
Respond ONLY in valid JSON:
{
  "peak_performance_window": "After 7-8 hours of sleep",
  "optimal_sleep_hours": 7.5,
  "correlation_insights": ["insight1", "insight2"],
  "weekly_pattern": {"Monday": 8, "Tuesday": 6, "Wednesday": 9},
  "recommendations": ["recommendation1", "recommendation2"],
  "sleep_schedule": {"wake_time": "6:30 AM", "sleep_time": "11:00 PM", "nap_recommendation": "20-minute nap at 2 PM if needed"},
  "performance_trend": "Analysis of overall trend paragraph"
}
Be data-driven and specific. Only return JSON."""

    entries_text = "\n".join([
        f"Date: {e.date}, Sleep: {e.sleep_hours}h (quality: {e.sleep_quality}/5), "
        f"Study: {e.study_hours}h, Productivity: {e.productivity_rating}/10, "
        f"Subjects: {', '.join(e.subjects_studied)}"
        for e in request.entries
    ])

    user_msg = f"""Goal: {request.goal}

Sleep & Study Log:
{entries_text}

Analyze patterns and provide personalized recommendations."""

    try:
        result = ask_llm(user_msg, system=system, max_tokens=2000)
        data = json.loads(result)
        return SleepStudyResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")
