"""Portfolio backend API.

Serves portfolio content (profile, experience, skills, projects, YouTube)
and handles contact-form submissions. Content lives in data/portfolio.json
so it can be edited without touching code.
"""

import json
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "portfolio.json"
MESSAGES_FILE = BASE_DIR / "data" / "messages.json"

app = FastAPI(title="Portfolio API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_data() -> dict:
    with DATA_FILE.open(encoding="utf-8") as f:
        return json.load(f)


class ContactMessage(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(min_length=1, max_length=4000)


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/api/portfolio")
def get_portfolio() -> dict:
    return load_data()


@app.get("/api/profile")
def get_profile() -> dict:
    return load_data()["profile"]


@app.get("/api/experience")
def get_experience() -> list:
    return load_data()["experience"]


@app.get("/api/skills")
def get_skills() -> list:
    return load_data()["skills"]


@app.get("/api/projects")
def get_projects() -> list:
    return load_data()["projects"]


@app.get("/api/youtube")
def get_youtube() -> dict:
    return load_data()["youtube"]


@app.post("/api/contact", status_code=201)
def submit_contact(payload: ContactMessage) -> dict:
    entry = {
        **payload.model_dump(),
        "received_at": datetime.now(timezone.utc).isoformat(),
    }
    try:
        existing = json.loads(MESSAGES_FILE.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        existing = []
    existing.append(entry)
    MESSAGES_FILE.write_text(json.dumps(existing, indent=2), encoding="utf-8")
    return {"ok": True, "message": "Thanks — your message has been received."}
