from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import QuizSession
from app.schemas import PredictScoreResponse
from app.services.score_predictor import predict_score


def get_score_prediction(user_id: int, subject: str, days: int, db: Session) -> PredictScoreResponse:
    cutoff = datetime.utcnow() - timedelta(days=days)

    sessions = (
        db.query(QuizSession)
        .filter(
            QuizSession.user_id == user_id,
            QuizSession.subject.ilike(subject),
            QuizSession.taken_at >= cutoff,
        )
        .order_by(QuizSession.taken_at.asc())
        .all()
    )

    scores = [s.score for s in sessions]
    low, high, confidence = predict_score(scores)

    insight = (
        f"Based on {len(sessions)} session(s) over the last {days} days — "
        f"you'll likely score {low}–{high} in {subject}."
        if sessions
        else f"No recent data for {subject}. Complete a quiz to get a prediction."
    )

    return PredictScoreResponse(
        subject=subject,
        score_low=low,
        score_high=high,
        confidence=confidence,
        based_on_sessions=len(sessions),
        insight=insight,
    )
