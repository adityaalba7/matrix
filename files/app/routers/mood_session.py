from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.llm_client import ask_llm
import json

router = APIRouter()

class MoodSessionRequest(BaseModel):
    mood: str
    energy_level: int
    available_hours: float
    subjects: list[str]

class MoodSessionResponse(BaseModel):
    session_plan: list[dict]
    mood_tips: list[str]
    recommended_technique: str
    motivational_message: str
    breaks: list[dict]

@router.post("/plan", response_model=MoodSessionResponse)
def plan_mood_session(request: MoodSessionRequest):
    """Creates a personalized study session plan based on current mood and energy level."""
    system = """You are an expert learning coach and psychologist.
Create adaptive study session plans based on student mood and energy.
Respond ONLY in valid JSON:
{
  "session_plan": [{"time": "0-25 min", "activity": "Active reading", "subject": "Math", "technique": "Pomodoro"}],
  "mood_tips": ["tip1", "tip2"],
  "recommended_technique": "Pomodoro/Feynman/Active Recall/etc",
  "motivational_message": "personalized motivational message",
  "breaks": [{"after_minutes": 25, "break_duration": 5, "break_activity": "stretch"}]
}
Be empathetic and realistic based on the mood. Only return JSON."""

    user_msg = f"""Current mood: {request.mood}
Energy level: {request.energy_level}/10
Available time: {request.available_hours} hours
Subjects to cover: {', '.join(request.subjects)}

Create an adaptive study session plan."""

    try:
        result = ask_llm(user_msg, system=system, max_tokens=2000)
        data = json.loads(result)
        return MoodSessionResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")
