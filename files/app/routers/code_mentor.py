from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.llm_client import ask_llm
import json

router = APIRouter()

class CodeMentorRequest(BaseModel):
    code_snippet: str
    language: str
    error_message: str = ""

class CodeMentorResponse(BaseModel):
    problem_explanation: str
    fixed_code: str
    lesson: str
    clean_code_tip: str

@router.post("/mentor", response_model=CodeMentorResponse)
def code_mentor(request: CodeMentorRequest):
    """Analyzes code snippets, explains errors, and suggests better practices."""
    system = """You are a senior software engineer and mentor.
Help the user understand their code or error.
Don't just fix it—teach the concept.
Provide a 'Pro Version' of the code.
Respond ONLY in valid JSON:
{
  "problem_explanation": "You have a SyntaxError because...",
  "fixed_code": "...",
  "lesson": "This is a concept called...",
  "clean_code_tip": "Always use..."
}
Only return JSON."""

    user_msg = f"""Language: {request.language}
Code:
{request.code_snippet}

Error (if any): {request.error_message}

Give me a breakdown of the problem, the fix, and the lesson."""

    try:
        result = ask_llm(user_msg, system=system, max_tokens=2500)
        data = json.loads(result)
        return CodeMentorResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code mentoring failed: {str(e)}")
