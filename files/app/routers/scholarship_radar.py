from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.llm_client import ask_llm
import json

router = APIRouter()

class ScholarshipRequest(BaseModel):
    cgpa: float
    family_income_lpa: float
    category: str
    state: str
    college_type: str
    course: str
    year_of_study: int
    disabilities: bool = False
    gender: str = "Any"
    interests: list[str] = []

class Scholarship(BaseModel):
    name: str
    provider: str
    amount_per_year: str
    eligibility_match: str
    deadline: str
    apply_link_type: str
    requirements: list[str]

class ScholarshipResponse(BaseModel):
    scholarships: list[Scholarship]
    total_potential_amount: str
    priority_apply: list[str]
    tips: list[str]

@router.post("/find", response_model=ScholarshipResponse)
def find_scholarships(request: ScholarshipRequest):
    """Finds scholarships the student is likely eligible for based on their profile."""
    system = """You are a scholarship advisor for Indian students.
Find real, currently available scholarships based on student profile.
Only list scholarships that actually exist in India.
Respond ONLY in valid JSON:
{
  "scholarships": [{"name": "NSP Central Sector Scheme", "provider": "Ministry of Education", "amount_per_year": "₹12,000", "eligibility_match": "High", "deadline": "October 31 each year", "apply_link_type": "National Scholarship Portal (scholarships.gov.in)", "requirements": ["12th marks > 80%", "Family income < 8 LPA"]}],
  "total_potential_amount": "₹50,000 - ₹1,20,000 per year",
  "priority_apply": ["Scholarship Name 1"],
  "tips": ["tip1", "tip2"]
}
Only return JSON. Be accurate about real Indian scholarships."""

    user_msg = f"""Student Profile:
CGPA: {request.cgpa}/10
Family Income: {request.family_income_lpa} LPA
Category: {request.category}
State: {request.state}
College Type: {request.college_type}
Course: {request.course}
Year of Study: {request.year_of_study}
Disability: {request.disabilities}
Gender: {request.gender}
Interests/Achievements: {', '.join(request.interests) if request.interests else 'None'}

Find scholarships this student qualifies for."""

    try:
        result = ask_llm(user_msg, system=system, max_tokens=2500)
        data = json.loads(result)
        return ScholarshipResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")
