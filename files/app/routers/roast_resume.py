from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.llm_client import ask_llm
import json

router = APIRouter()

class RoastResumeRequest(BaseModel):
    resume_text: str
    target_role: str = "Software Engineer"
    roast_intensity: str = "medium"

class RoastItem(BaseModel):
    section: str
    roast: str
    actionable_fix: str
    severity: str

class RoastResumeResponse(BaseModel):
    overall_roast: str
    roast_score: int
    roast_items: list[RoastItem]
    what_works: list[str]
    priority_fixes: list[str]
    final_verdict: str

@router.post("/roast", response_model=RoastResumeResponse)
def roast_resume(request: RoastResumeRequest):
    """Gives savage but actionable AI feedback on a resume."""
    if not request.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty")

    intensity_instructions = {
        "light": "Be gently humorous but mostly constructive.",
        "medium": "Be witty and sharp, use humor but always pair roasts with fixes.",
        "savage": "Be brutally honest and savage like a Twitter roast, but every roast MUST have an actionable fix."
    }

    system = f"""You are a no-nonsense career coach who gives brutally honest resume feedback.
{intensity_instructions.get(request.roast_intensity, intensity_instructions['medium'])}
Your feedback is funny but ALWAYS actionable. Every roast has a fix.
Respond ONLY in valid JSON:
{{
  "overall_roast": "One punchy paragraph roasting the resume overall",
  "roast_score": 65,
  "roast_items": [{{"section": "Work Experience", "roast": "Witty roast", "actionable_fix": "Specific fix", "severity": "cringe"}}],
  "what_works": ["thing that's actually good"],
  "priority_fixes": ["fix this first", "then this"],
  "final_verdict": "Closing savage/encouraging statement"
}}
Only return JSON."""

    user_msg = f"""Target Role: {request.target_role}
Roast Intensity: {request.roast_intensity}

Resume:
{request.resume_text[:8000]}

Roast this resume."""

    try:
        result = ask_llm(user_msg, system=system, max_tokens=2500)
        data = json.loads(result)
        return RoastResumeResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")
