"""
Panic Question Generator
------------------------
Uses Gemini to produce rapid-fire MCQs for a given subject.
Returns structured JSON that maps to PanicQuestion schema.
"""

import json
import re
from app.utils.llm_client import ask_llm


SYSTEM = """You are an expert exam question generator.
Always respond with ONLY valid JSON — no markdown, no explanation outside the JSON.
"""

PROMPT_TEMPLATE = """Generate {n} multiple-choice questions for the subject: "{subject}".

Rules:
- Each question must have exactly 4 options (A, B, C, D).
- One option is correct.
- Questions should test core concepts, not trivia.
- Keep questions concise (one sentence max).

Respond with a JSON array. Each element must have:
{{
  "question": "...",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "answer_index": 0,          // 0-based index of the correct option
  "explanation": "One sentence explaining why the answer is correct."
}}
"""


def generate_panic_questions(subject: str, n: int = 10) -> list[dict]:
    prompt = PROMPT_TEMPLATE.format(n=n, subject=subject)
    raw = ask_llm(prompt, system=SYSTEM, provider="groq")

    # Strip any accidental markdown fences
    raw = re.sub(r"```json|```", "", raw).strip()

    try:
        questions = json.loads(raw)
        return questions[:n]
    except json.JSONDecodeError:
        # Fallback: return a single placeholder so the API doesn't crash
        return [{
            "question": f"What is a fundamental concept in {subject}?",
            "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
            "answer_index": 0,
            "explanation": "Could not generate questions — please retry.",
        }]
