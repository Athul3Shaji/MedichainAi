from fastapi import APIRouter
from models.doc_qa import batch_doc_qa
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter()

class DocQARequest(BaseModel):
    context: str
    questions: Optional[List[str]] = None

@router.post("/")
def doc_qa(request: DocQARequest):
    return batch_doc_qa(request.context,questions=request.questions)