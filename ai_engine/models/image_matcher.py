import cv2
from skimage.metrics import structural_similarity as ssim
import numpy as np

def load_and_prepare(img_bytes):
    # Convert bytes to OpenCV image
    file_array = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(file_array, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (800, 800))
    return img

def compare_images(img1_bytes, img2_bytes):
    img1 = load_and_prepare(img1_bytes)
    img2 = load_and_prepare(img2_bytes)

    score, diff = ssim(img1, img2, full=True)
    diff = (diff * 255).astype("uint8")

    # Threshold difference
    thresh = cv2.threshold(diff, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    regions = []
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        regions.append({"x": int(x), "y": int(y), "width": int(w), "height": int(h)})
   
    result = {
    "similarity_score": round(float(score), 3),  # also safe
    "fraud_detected": bool(score < 0.90),         # 🔧 convert to native bool
    "difference_regions": regions
    }

    return result
