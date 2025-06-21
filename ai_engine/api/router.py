from fastapi import APIRouter
from api.endpoints import summarize, ocr,classify,doc_qa,image_match

router = APIRouter()

router.include_router(summarize.router, prefix="/summarize", tags=["Summarization"])
router.include_router(ocr.router, prefix="/image_text", tags=["Image to Text"])
router.include_router(classify.router, prefix="/classify", tags=["Classify"])
router.include_router(doc_qa.router, prefix="/doc_qa", tags=["Document QA"])
router.include_router(image_match.router, prefix="/image_match", tags=["Image Match"])