from sqlalchemy.orm import Session
from app.models import QuizSession
from app.schemas import PanicRequest, PanicResponse, PanicQuestion
from app.services.panic_generator import generate_panic_questions


def _weakest_subject(user_id: int, db: Session) -> str:
    """Return the subject with the lowest average score for this user."""
    sessions = db.query(QuizSession).filter(QuizSession.user_id == user_id).all()
    if not sessions:
        return "General"

    subject_scores: dict[str, list[float]] = {}
    for s in sessions:
        subject_scores.setdefault(s.subject, []).append(s.score)

    avg_by_subject = {subj: sum(v) / len(v) for subj, v in subject_scores.items()}
    return min(avg_by_subject, key=avg_by_subject.get)


def get_panic_questions(req: PanicRequest, db: Session) -> PanicResponse:
    subject = req.subject or _weakest_subject(req.user_id, db)
    raw_questions = generate_panic_questions(subject, req.num_questions)

    questions = [
        PanicQuestion(
            question=q["question"],
            options=q["options"],
            answer_index=q["answer_index"],
            explanation=q["explanation"],
        )
        for q in raw_questions
    ]

    return PanicResponse(subject=subject, questions=questions)
