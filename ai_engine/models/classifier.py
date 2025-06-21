# model.py
from transformers import pipeline

# Load and cache the model once
classifier = pipeline("text-classification", model="distilbert-base-uncased-finetuned-sst-2-english")

def classify_text(text: str) -> dict:
    result = classifier(text)[0]
    label = result['label']
    score = result['score']

    # Example mapping logic: adjust based on your dataset
    if label == "POSITIVE" and score > 0.7:
        classification = "Legit"
    else:
        classification = "Suspicious"

    return {
        "classification": classification,
        "confidence": score,
        "raw_label": label
    }
