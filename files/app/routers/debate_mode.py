from fastapi import APIRouter
from app.schemas import DebateRequest, DebateResponse
from app.services.debate_service import run_debate

router = APIRouter()

@router.post("/", response_model=DebateResponse)
def debate(req: DebateRequest):
    """
    Submit a topic + your argument. Gemini plays devil's advocate
    and returns a counterargument + follow-up question.
    """
    return run_debate(req)
