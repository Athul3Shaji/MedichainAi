from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from utils.ocr import file_to_text

router = APIRouter()

@router.post("/file")
async def run_ocr_file(file: UploadFile = File(...)):
    content = await file.read()
    text = file_to_text(content, file.content_type)
    return {"text": text}