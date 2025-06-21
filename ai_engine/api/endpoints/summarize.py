from fastapi import APIRouter
from models.summarizer import summarize_text
from pydantic import BaseModel
router = APIRouter()

class SummarizeRequest(BaseModel):
    text: str

@router.post("/")
def summarize(request: SummarizeRequest):
    summary = summarize_text(request.text)
    return {"summary": summary}