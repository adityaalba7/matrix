from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.llm_client import ask_llm
import json

router = APIRouter()

class CGPARequest(BaseModel):
    cgpa: float
    college_tier: str
    branch: str
    graduation_year: int
    skills: list[str] = []
    internships: int = 0
    projects: int = 0
    location_preference: str = "India"

class SalaryRange(BaseModel):
    role: str
    min_lpa: float
    max_lpa: float
    median_lpa: float
    companies: list[str]

class CGPAResponse(BaseModel):
    likely_package_range: dict
    salary_by_role: list[SalaryRange]
    improvement_tips: list[str]
    target_companies: list[str]
    honest_assessment: str

@router.post("/estimate", response_model=CGPAResponse)
def estimate_package(request: CGPARequest):
    """Estimates likely salary package range based on CGPA, college tier, skills and other factors."""
    if not (0 <= request.cgpa <= 10):
        raise HTTPException(status_code=400, detail="CGPA must be between 0 and 10")

    system = """You are a campus placement expert with deep knowledge of Indian tech industry hiring.
Estimate realistic salary packages based on student profile.
Be honest - do not over-inflate estimates. Use real market data.
Respond ONLY in valid JSON:
{
  "likely_package_range": {"min_lpa": 4.0, "max_lpa": 12.0, "expected_lpa": 7.5},
  "salary_by_role": [{"role": "Software Engineer", "min_lpa": 6.0, "max_lpa": 15.0, "median_lpa": 9.0, "companies": ["TCS", "Infosys"]}],
  "improvement_tips": ["tip1", "tip2"],
  "target_companies": ["Company1", "Company2"],
  "honest_assessment": "Realistic paragraph about their prospects"
}
Only return JSON. Use LPA (Lakhs Per Annum) for Indian market."""

    user_msg = f"""Student Profile:
CGPA: {request.cgpa}/10
College Tier: {request.college_tier}
Branch: {request.branch}
Graduation Year: {request.graduation_year}
Skills: {', '.join(request.skills) if request.skills else 'Not specified'}
Internships: {request.internships}
Projects: {request.projects}
Location: {request.location_preference}

Estimate realistic package range."""

    try:
        result = ask_llm(user_msg, system=system, max_tokens=2000)
        data = json.loads(result)
        return CGPAResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")
