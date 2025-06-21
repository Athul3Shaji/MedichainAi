# api.py
from fastapi import APIRouter
from pydantic import BaseModel
from models.classifier import classify_text

router = APIRouter()


class Document(BaseModel):
    text: str

@router.post("/classify")
def classify(doc: Document):
    result = classify_text(doc.text)
    return result
