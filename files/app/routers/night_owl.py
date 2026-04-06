from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.schemas import NightOwlResponse
from app.services.night_owl_service import get_night_owl_insight
from db.database import get_db

router = APIRouter()

@router.get("/", response_model=NightOwlResponse)
def night_owl(user_id: int = Query(...), db: Session = Depends(get_db)):
    """
    Analyse quiz timestamps to find the user's peak performance window
    and recommend when to study hardest topics.
    """
    return get_night_owl_insight(user_id, db)
