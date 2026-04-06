from sqlalchemy.orm import Session
from app.models import QuizSession
from app.schemas import NightOwlResponse
from app.utils.time_utils import score_by_hour, best_hour_range, format_hour


def get_night_owl_insight(user_id: int, db: Session) -> NightOwlResponse:
    sessions = (
        db.query(QuizSession)
        .filter(QuizSession.user_id == user_id)
        .all()
    )

    hour_scores = score_by_hour(sessions)
    start, end = best_hour_range(hour_scores)

    avg_in_window = 0.0
    if hour_scores:
        # Correctly handle 24-hour wrap-around for the window scores
        window_hours = [(start + i) % 24 for i in range(2)] # window_size is 2 in best_hour_range default
        window_scores = [hour_scores.get(h, 0.0) for h in window_hours]
        avg_in_window = round(sum(window_scores) / len(window_scores), 1) if window_scores else 0.0

    label = f"{format_hour(start)} – {format_hour(end)}"

    recommendation = (
        f"You perform best between {label}. "
        f"Schedule your hardest topics during this window for maximum retention."
        if hour_scores
        else "Complete more quizzes to unlock your peak performance window."
    )

    return NightOwlResponse(
        best_start_hour=start,
        best_end_hour=end,
        best_window_label=label,
        avg_score_in_window=avg_in_window,
        recommendation=recommendation,
    )
