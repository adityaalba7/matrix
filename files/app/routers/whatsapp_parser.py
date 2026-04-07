from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.utils.llm_client import ask_llm
import json

router = APIRouter()

class WhatsAppChatRequest(BaseModel):
    chat_text: str

class WhatsAppChatResponse(BaseModel):
    exam_topics: list[str]
    study_plan: dict
    key_deadlines: list[str]
    summary: str

@router.post("/parse", response_model=WhatsAppChatResponse)
def parse_whatsapp_chat(request: WhatsAppChatRequest):
    """Parses a WhatsApp group chat export and extracts exam topics, deadlines, and builds a study plan."""
    if not request.chat_text.strip():
        raise HTTPException(status_code=400, detail="Chat text cannot be empty")

    system = """You are an academic assistant. Analyze WhatsApp group chat exports from student groups.
Extract exam-related information and build study plans.
Always respond in valid JSON with this exact structure:
{
  "exam_topics": ["topic1", "topic2"],
  "study_plan": {"week1": ["task1", "task2"], "week2": ["task1", "task2"]},
  "key_deadlines": ["deadline1", "deadline2"],
  "summary": "brief summary of what was found"
}
Only return JSON, no markdown, no preamble."""

    user_msg = f"Analyze this WhatsApp chat and extract study-relevant information:\n\n{request.chat_text[:8000]}"

    try:
        result = ask_llm(user_msg, system=system)
        data = json.loads(result)
        return WhatsAppChatResponse(**data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")
