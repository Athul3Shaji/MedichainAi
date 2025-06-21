import pytesseract
from PIL import Image
import io
import cv2
import numpy as np
from pdf2image import convert_from_bytes
from langdetect import detect

def denoise_image(pil_img: Image.Image) -> Image.Image:
    """Converts PIL image to OpenCV, denoises, returns PIL."""
    np_img = np.array(pil_img)
    gray = cv2.cvtColor(np_img, cv2.COLOR_BGR2GRAY) if len(np_img.shape) == 3 else np_img
    blur = cv2.medianBlur(gray, 3)
    _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    morph = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, np.ones((2,2), np.uint8))
    return Image.fromarray(morph)

def extract_text_and_conf(image: Image.Image):
    """Returns cleaned text and average confidence."""
    data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
    words = []
    confidences = []

    for i in range(len(data['text'])):
        word = data['text'][i].strip()
        conf = int(data['conf'][i])
        if word and conf > 0:
            words.append(word)
            confidences.append(conf)

    avg_conf = round(sum(confidences) / len(confidences), 2) if confidences else 0.0
    return " ".join(words), avg_conf

def file_to_text(file_bytes: bytes, mime_type: str) -> dict:
    try:
        pages = []
        if mime_type == "application/pdf":
            pages = convert_from_bytes(file_bytes)
        else:
            image = Image.open(io.BytesIO(file_bytes))
            pages = [image]

        full_text = ""
        all_conf = []

        for page in pages:
            denoised = denoise_image(page)
            text, conf = extract_text_and_conf(denoised)
            full_text += text + "\n"
            all_conf.append(conf)

        language = detect(full_text) if full_text.strip() else "unknown"
        avg_confidence = round(sum(all_conf) / len(all_conf), 2) if all_conf else 0.0

        return {
            "text": full_text.strip(),
            "language": language,
            "confidence": avg_confidence
        }

    except Exception as e:
        return {
            "error": f"OCR Error: {str(e)}"
        }
