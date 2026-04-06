from pydantic import BaseModel, Field
from typing import Optional


# ── Predict Score ──────────────────────────────────────────────────────────────

class PredictScoreRequest(BaseModel):
    user_id: int
    subject: str = Field(..., example="DBMS")
    days: int = Field(14, ge=1, le=90, description="How many past days to analyse")

class PredictScoreResponse(BaseModel):
    subject: str
    score_low: float
    score_high: float
    confidence: str           # "high" | "medium" | "low"
    based_on_sessions: int
    insight: str              # one-line human explanation


# ── Debate Mode ────────────────────────────────────────────────────────────────

class DebateRequest(BaseModel):
    topic: str = Field(..., example="Normalisation always improves database performance")
    user_argument: str
    subject: Optional[str] = None

class DebateResponse(BaseModel):
    counterargument: str
    follow_up_question: str
    verdict: Optional[str] = None   # filled after user replies


# ── Teach It Back ──────────────────────────────────────────────────────────────

class TeachBackRequest(BaseModel):
    topic: str = Field(..., example="Recursion base case")
    user_explanation: str
    subject: Optional[str] = None

class TeachBackResponse(BaseModel):
    grade: str                  # e.g. "B+"
    score: int                  # 0–100
    strengths: list[str]
    gaps: list[str]
    model_answer_hint: str


# ── Night Owl Insight ──────────────────────────────────────────────────────────

class NightOwlResponse(BaseModel):
    best_start_hour: int
    best_end_hour: int
    best_window_label: str       # e.g. "9 PM – 11 PM"
    avg_score_in_window: float
    recommendation: str


# ── Panic Mode ─────────────────────────────────────────────────────────────────

class PanicRequest(BaseModel):
    user_id: int
    subject: str
    num_questions: int = Field(10, ge=5, le=20)

class PanicQuestion(BaseModel):
    question: str
    options: list[str]           # always 4 options
    answer_index: int            # 0-based correct option
    explanation: str

class PanicResponse(BaseModel):
    subject: str
    questions: list[PanicQuestion]


# ── Concept Mind Map ───────────────────────────────────────────────────────────

class MindMapRequest(BaseModel):
    topic: str = Field(..., example="Operating Systems")

class MindMapNode(BaseModel):
    id: str
    label: str
    type: str                   # "root" | "subtopic" | "leaf"

class MindMapEdge(BaseModel):
    source: str
    target: str
    label: Optional[str] = None

class MindMapResponse(BaseModel):
    topic: str
    nodes: list[MindMapNode]
    edges: list[MindMapEdge]
