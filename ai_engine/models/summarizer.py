from transformers import pipeline
from nltk.tokenize import sent_tokenize
import nltk
import logging
import os

nltk.download('punkt_tab')  # or 'punkt_tab' if you really need that


# Initialize summarizera
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")  # Or "google/pegasus-pubmed" for medical
logging.info(f"NLTK data paths: {nltk.data.path}")
logging.info(f"NLTK data files at path: {os.listdir('/home/mask-code/nltk_data/tokenizers/punkt')}")

# Optional: Use logging instead of print
logging.basicConfig(level=logging.INFO)

def sentence_chunker(text, max_chars=1000):
    sentences = sent_tokenize(text)
    chunks, current_chunk = [], ""
    print("sentences",sentences)

    for sentence in sentences:
        if len(current_chunk) + len(sentence) <= max_chars:
            current_chunk += " " + sentence
        else:
            chunks.append(current_chunk.strip())
            current_chunk = sentence
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks

def summarize_text(text: str, max_length: int = 130, min_length: int = 30, do_sample: bool = False) -> str:
    text = text.strip()
    if not text:
        return ""

    chunks = sentence_chunker(text, max_chars=1000)
    print("chunks",chunks)
    logging.info(f"Total Chunks: {chunks}")

    summaries = []
    for i, chunk in enumerate(chunks):
        try:
            result = summarizer(
                chunk, max_length=max_length, min_length=min_length, do_sample=do_sample
            )
            summary = result[0]['summary_text']
            summaries.append(summary)
        except Exception as e:
            summaries.append(f"[Error in chunk {i+1}: {str(e)}]")

    return " ".join(summaries)
