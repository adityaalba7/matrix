from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas import PanicRequest, PanicResponse
from app.services.panic_service import get_panic_questions
from db.database import get_db

router = APIRouter()

@router.post("/", response_model=PanicResponse)
def panic_mode(req: PanicRequest, db: Session = Depends(get_db)):
    """
    Generate rapid-fire MCQs for the user's weakest subject (or a
    specified subject) using Gemini — perfect for last-minute revision.
    """
    return get_panic_questions(req, db)
