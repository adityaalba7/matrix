from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    predict_score,
    debate_mode,
    teach_back,
    night_owl,
    panic_mode,
    mind_map,
)
from db.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Matrix Study API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_score.router, prefix="/api/predict-score", tags=["Predict Score"])
app.include_router(debate_mode.router,   prefix="/api/debate",        tags=["Debate Mode"])
app.include_router(teach_back.router,    prefix="/api/teach-back",    tags=["Teach It Back"])
app.include_router(night_owl.router,     prefix="/api/night-owl",     tags=["Night Owl"])
app.include_router(panic_mode.router,    prefix="/api/panic",         tags=["Panic Mode"])
app.include_router(mind_map.router,      prefix="/api/mind-map",      tags=["Mind Map"])

@app.get("/")
def root():
    return {"message": "Matrix Study API is running"}
