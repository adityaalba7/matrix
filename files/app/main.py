from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    predict_score,
    debate_mode,
    teach_back,
    night_owl,
    panic_mode,
    mind_map,
    # AI Student Tools
    whatsapp_parser,
    lecture_recorder,
    smart_notes,
    resume_gap,
    roast_resume,
    mood_session,
    spaced_repetition,
    cgpa_estimator,
    scholarship_radar,
    sleep_study,
    monthly_wrap,
    student_twin,
    code_mentor,
)
from db.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Matrix Study API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Original Study Tools ──
app.include_router(predict_score.router, prefix="/api/predict-score", tags=["Predict Score"])
app.include_router(debate_mode.router,   prefix="/api/debate",        tags=["Debate Mode"])
app.include_router(teach_back.router,    prefix="/api/teach-back",    tags=["Teach It Back"])
app.include_router(night_owl.router,     prefix="/api/night-owl",     tags=["Night Owl"])
app.include_router(panic_mode.router,    prefix="/api/panic",         tags=["Panic Mode"])
app.include_router(mind_map.router,      prefix="/api/mind-map",      tags=["Mind Map"])

# ── AI Student Tools ──
app.include_router(whatsapp_parser.router,    prefix="/api/whatsapp",      tags=["WhatsApp Chat Parser"])
app.include_router(lecture_recorder.router,   prefix="/api/lecture",       tags=["Lecture Recorder"])
app.include_router(smart_notes.router,        prefix="/api/notes",         tags=["Smart Notes Summarizer"])
app.include_router(resume_gap.router,         prefix="/api/resume-gap",    tags=["Resume Gap Detector"])
app.include_router(roast_resume.router,       prefix="/api/roast",         tags=["Roast My Resume"])
app.include_router(mood_session.router,       prefix="/api/mood",          tags=["Mood Adaptive Session"])
app.include_router(spaced_repetition.router,  prefix="/api/spaced-rep",    tags=["Spaced Repetition Engine"])
app.include_router(cgpa_estimator.router,     prefix="/api/cgpa",          tags=["CGPA to Package Estimator"])
app.include_router(scholarship_radar.router,  prefix="/api/scholarship",   tags=["Scholarship Radar"])
app.include_router(sleep_study.router,        prefix="/api/sleep",         tags=["Sleep & Study Correlation"])
app.include_router(monthly_wrap.router,       prefix="/api/monthly-wrap",  tags=["Monthly Wrap"])
app.include_router(student_twin.router,       prefix="/api/student-twin",  tags=["Student Twin Match"])
app.include_router(code_mentor.router,        prefix="/api/code",          tags=["Code Mentor"])

@app.get("/")
def root():
    return {"message": "Matrix Study API is running", "version": "2.0.0", "docs": "/docs"}

@app.get("/health")
def health():
    return {"status": "ok"}
