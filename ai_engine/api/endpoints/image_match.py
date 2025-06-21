from fastapi import APIRouter, File, UploadFile
from models.image_matcher import compare_images
from pydantic import BaseModel

router = APIRouter()


@router.post("/compare")
async def compare_docs(original: UploadFile = File(...), submitted: UploadFile = File(...)):
    original_bytes = await original.read()
    submitted_bytes = await submitted.read()

    result = compare_images(original_bytes, submitted_bytes)
    return result