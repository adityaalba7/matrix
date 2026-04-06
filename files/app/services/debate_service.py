from app.schemas import DebateRequest, DebateResponse
from app.utils.llm_client import ask_llm

SYSTEM = """You are a sharp academic debate coach playing devil's advocate.
Your job is to challenge the student's argument so they think deeper.
Be concise, direct, and educational. Never agree outright — always push back."""

def run_debate(req: DebateRequest) -> DebateResponse:
    prompt = (
        f"Topic: {req.topic}\n"
        f"Subject: {req.subject or 'General'}\n"
        f"Student's argument: {req.user_argument}\n\n"
        "1. Give a strong counterargument (2-3 sentences).\n"
        "2. End with one follow-up question to deepen their thinking.\n"
        "Format:\nCOUNTER: <counterargument>\nFOLLOW_UP: <question>"
    )

    raw = ask_llm(prompt, system=SYSTEM, provider="groq")

    counter = ""
    follow_up = ""
    for line in raw.splitlines():
        if line.startswith("COUNTER:"):
            counter = line.replace("COUNTER:", "").strip()
        elif line.startswith("FOLLOW_UP:"):
            follow_up = line.replace("FOLLOW_UP:", "").strip()

    return DebateResponse(
        counterargument=counter or raw,
        follow_up_question=follow_up or "Can you defend your position further?",
    )
