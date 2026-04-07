from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.llm_client import ask_llm
import json

router = APIRouter()

class ResumeGapRequest(BaseModel):
    resume_text: str
    target_company: str
    target_role: str = "Software Engineer"

class ResumeGapResponse(BaseModel):
    gaps: list[dict]
    strengths: list[str]
    roadmap: list[dict]
    match_score: int
    summary: str

@router.post("/analyze", response_model=ResumeGapResponse)
def analyze_resume_gap(request: ResumeGapRequest):
    """Compares a resume against a target company's requirements and generates a 30-day roadmap."""
    if not request.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty")

    system = """You are a senior technical recruiter and career coach.
Analyze resumes against target company requirements and create actionable roadmaps.
Respond ONLY in valid JSON with this structure:
{
  "gaps": [{"skill": "skill name", "priority": "high/medium/low", "how_to_fill": "specific action"}],
  "strengths": ["strength1", "strength2"],
  "roadmap": [{"day": "Day 1-3", "task": "specific task", "resource": "resource or link type"}],
  "match_score": 75,
  "summary": "Overall assessment paragraph"
}
Be specific and actionable. Only return JSON."""

    user_msg = f"""Target Company: {request.target_company}
Target Role: {request.target_role}

Resume:
{request.resume_text[:8000]}"""

    try:
        result = ask_llm(user_msg, system=system, max_tokens=3000)
        data = json.loads(result)
        return ResumeGapResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")
