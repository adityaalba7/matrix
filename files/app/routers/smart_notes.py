from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from app.utils.llm_client import ask_llm
import json

router = APIRouter()

class NotesTextRequest(BaseModel):
    text: str
    subject: str = "General"

class NotesResponse(BaseModel):
    flashcards: list[dict]
    one_page_summary: str
    key_points: list[str]
    topics_covered: list[str]

def _process_notes(content: str, subject: str) -> NotesResponse:
    system = """You are an expert study material creator.
Given notes or document content, create flashcards and a concise 1-page summary.
Respond ONLY in valid JSON with this structure:
{
  "flashcards": [{"front": "Question or term", "back": "Answer or definition"}],
  "one_page_summary": "Comprehensive 1-page summary of all key content",
  "key_points": ["point1", "point2"],
  "topics_covered": ["topic1", "topic2"]
}
Create at least 10 flashcards. Only return JSON."""

    user_msg = f"Subject: {subject}\n\nNotes Content:\n{content[:15000]}"
    result = ask_llm(user_msg, system=system, max_tokens=3000)
    data = json.loads(result)
    return NotesResponse(**data)

@router.post("/summarize-text", response_model=NotesResponse)
def summarize_text_notes(request: NotesTextRequest):
    """Summarize text-based notes into flashcards and a 1-page summary."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    try:
        return _process_notes(request.text, request.subject)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")

@router.post("/summarize-pdf", response_model=NotesResponse)
async def summarize_pdf_notes(
    file: UploadFile = File(...),
    subject: str = "General"
):
    """Upload a PDF, extract its text, and get flashcards + summary via AI."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    try:
        import pypdf, io
        pdf_bytes = await file.read()
        pdf_reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        full_text = "\n".join(page.extract_text() for page in pdf_reader.pages)
        if not full_text.strip():
            raise ValueError("Could not extract any text from the PDF.")
        return _process_notes(full_text, subject)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF processing failed: {str(e)}")
