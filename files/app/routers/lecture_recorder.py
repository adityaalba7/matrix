from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from app.utils.llm_client import ask_llm
from groq import Groq
from app.config import settings
import json

router = APIRouter()

class LectureTextRequest(BaseModel):
    transcript: str
    subject: str = "General"

class LectureResponse(BaseModel):
    notes: list[str]
    quiz: list[dict]
    key_concepts: list[str]
    summary: str

def _process_lecture_content(content: str, subject: str) -> LectureResponse:
    """Core logic to generate study material from lecture text."""
    system = """You are an expert academic note-taker and quiz creator.
Given a lecture transcript, create structured notes and quiz questions.
Respond ONLY in valid JSON with this structure:
{
  "notes": ["note1", "note2", "note3"],
  "quiz": [
    {"question": "Q?", "options": ["A", "B", "C", "D"], "answer": "A"}
  ],
  "key_concepts": ["concept1", "concept2"],
  "summary": "one paragraph summary"
}
Generate at least 5 notes and 5 quiz questions. Only return JSON."""

    user_msg = f"Subject: {subject}\n\nLecture Content:\n{content[:15000]}"
    try:
        result = ask_llm(user_msg, system=system, max_tokens=3000)
        data = json.loads(result)
        return LectureResponse(**data)
    except Exception as e:
        raise Exception(f"AI generation failed: {str(e)}")


def _transcribe_audio(file_tuple: tuple) -> str:
    """Transcribes audio bytes using Groq's Whisper API."""
    if not settings.groq_api_key:
        raise ValueError("GROQ_API_KEY is not configured.")
    client = Groq(api_key=settings.groq_api_key)
    transcription = client.audio.transcriptions.create(
        file=file_tuple,
        model="whisper-large-v3-turbo",
        response_format="text"
    )
    return transcription


@router.post("/process-transcript", response_model=LectureResponse)
def process_lecture_transcript(request: LectureTextRequest):
    """Process raw text transcript."""
    if not request.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript cannot be empty")
    try:
        return _process_lecture_content(request.transcript, request.subject)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")


@router.post("/process-audio", response_model=LectureResponse)
async def process_lecture_audio(
    file: UploadFile = File(...),
    subject: str = "General"
):
    """Upload audio, transcribe via Whisper, and generate study material."""
    try:
        audio_bytes = await file.read()
        transcript = _transcribe_audio((file.filename, audio_bytes))
        if not transcript.strip():
            raise ValueError("Whisper returned an empty transcript.")
        return _process_lecture_content(transcript, subject)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio processing failed: {str(e)}")
