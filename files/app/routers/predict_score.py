from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas import PredictScoreRequest, PredictScoreResponse
from app.services.score_service import get_score_prediction
from db.database import get_db

router = APIRouter()

@router.post("/", response_model=PredictScoreResponse)
def predict_score(req: PredictScoreRequest, db: Session = Depends(get_db)):
    """
    Predict the user's expected score range for a subject
    based on their recent quiz history.
    """
    return get_score_prediction(req.user_id, req.subject, req.days, db)
