from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.llm_client import ask_llm
import json

router = APIRouter()

class StudentProfile(BaseModel):
    name: str
    branch: str
    year: int
    cgpa: float
    goals: list[str]
    skills: list[str]
    study_style: str
    weak_subjects: list[str]
    strong_subjects: list[str]
    interests: list[str]
    availability: str

class StudentTwinRequest(BaseModel):
    my_profile: StudentProfile
    candidate_profiles: list[StudentProfile] = []

class TwinMatch(BaseModel):
    student_name: str
    compatibility_score: int
    shared_goals: list[str]
    complementary_skills: list[str]
    why_good_match: str
    collaboration_ideas: list[str]

class StudentTwinResponse(BaseModel):
    best_match: TwinMatch
    all_matches: list[TwinMatch]
    profile_type: str
    study_buddy_tips: list[str]

@router.post("/find-match", response_model=StudentTwinResponse)
def find_student_twin(request: StudentTwinRequest):
    """Finds the best student study partner match based on complementary skills and shared goals."""
    system = """You are a student matching algorithm expert.
Find the best study partner matches based on complementary skills and shared goals.
If no candidates are provided, create 3 ideal fictional student profiles to match against.
Respond ONLY in valid JSON:
{
  "best_match": {"student_name": "Priya S.", "compatibility_score": 87, "shared_goals": ["FAANG", "DSA mastery"], "complementary_skills": ["System Design"], "why_good_match": "Explanation paragraph", "collaboration_ideas": ["Weekly mock interviews"]},
  "all_matches": [...],
  "profile_type": "The Systematic Problem Solver 🧩",
  "study_buddy_tips": ["tip1", "tip2"]
}
Only return JSON."""

    my = request.my_profile
    candidates_text = ""
    if request.candidate_profiles:
        candidates_text = "Candidate Profiles:\n" + "\n".join([
            f"- {p.name}: {p.branch}, Year {p.year}, CGPA {p.cgpa}, "
            f"Goals: {', '.join(p.goals)}, Skills: {', '.join(p.skills)}, "
            f"Weak in: {', '.join(p.weak_subjects)}, Strong in: {', '.join(p.strong_subjects)}"
            for p in request.candidate_profiles
        ])
    else:
        candidates_text = "No candidates provided. Generate 3 ideal fictional student profiles to match against."

    user_msg = f"""My Profile:
Name: {my.name}
Branch: {my.branch}, Year: {my.year}, CGPA: {my.cgpa}
Goals: {', '.join(my.goals)}
Skills: {', '.join(my.skills)}
Study Style: {my.study_style}
Weak Subjects: {', '.join(my.weak_subjects)}
Strong Subjects: {', '.join(my.strong_subjects)}
Interests: {', '.join(my.interests)}
Availability: {my.availability}

{candidates_text}

Find my best study partner matches."""

    try:
        result = ask_llm(user_msg, system=system, max_tokens=2500)
        data = json.loads(result)
        return StudentTwinResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")
