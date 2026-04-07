from fastapi import APIRouter
from app.schemas import TeachBackRequest, TeachBackResponse
from app.services.teach_back_service import evaluate_explanation

router = APIRouter()

@router.post("/", response_model=TeachBackResponse)
def teach_back(req: TeachBackRequest):
    """
    Submit your explanation of a topic.
    Gemini grades it, highlights strengths and gaps,
    and gives a model-answer hint.
    """
    return evaluate_explanation(req)
