import re
from app.schemas import TeachBackRequest, TeachBackResponse
from app.utils.llm_client import ask_llm

SYSTEM = """You are a strict but fair professor grading a student's explanation.
Be specific about what they got right and wrong. Keep feedback actionable."""

GRADE_MAP = {
    range(90, 101): "A+", range(80, 90): "A", range(70, 80): "B+",
    range(60, 70): "B",  range(50, 60): "C", range(0, 50): "D",
}


def _letter_grade(score: int) -> str:
    for r, g in GRADE_MAP.items():
        if score in r:
            return g
    return "D"


def evaluate_explanation(req: TeachBackRequest) -> TeachBackResponse:
    prompt = (
        f"Topic: {req.topic}\n"
        f"Subject: {req.subject or 'General'}\n"
        f"Student explanation:\n{req.user_explanation}\n\n"
        "Evaluate and respond in this exact format:\n"
        "SCORE: <0-100>\n"
        "STRENGTHS: <bullet1> | <bullet2> | <bullet3>\n"
        "GAPS: <bullet1> | <bullet2>\n"
        "HINT: <one sentence model answer hint>"
    )

    raw = ask_llm(prompt, system=SYSTEM, provider="groq")

    score = 50
    strengths: list[str] = []
    gaps: list[str] = []
    hint = ""

    for line in raw.splitlines():
        if line.startswith("SCORE:"):
            m = re.search(r"\d+", line)
            if m:
                score = min(100, max(0, int(m.group())))
        elif line.startswith("STRENGTHS:"):
            strengths = [s.strip() for s in line.replace("STRENGTHS:", "").split("|") if s.strip()]
        elif line.startswith("GAPS:"):
            gaps = [g.strip() for g in line.replace("GAPS:", "").split("|") if g.strip()]
        elif line.startswith("HINT:"):
            hint = line.replace("HINT:", "").strip()

    return TeachBackResponse(
        grade=_letter_grade(score),
        score=score,
        strengths=strengths or ["Good attempt"],
        gaps=gaps or ["Could be more detailed"],
        model_answer_hint=hint or "Review the core definition of this topic.",
    )
