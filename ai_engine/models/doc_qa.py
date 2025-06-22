from transformers import pipeline

qa_pipeline = pipeline("question-answering", model="distilbert-base-uncased-distilled-squad")

PREDEFINED_QUESTIONS = [
    "What is the diagnosis?",
    "What is the claimed amount?",
    "What is the date of treatment?",
    "What is the hospital name?",
    "Who is the patient?"
]

CONFIDENCE_THRESHOLD = 0.5  # You can tweak this

def batch_doc_qa(context: str,questions: list = None) -> list:
    questions = questions or PREDEFINED_QUESTIONS
    answers = []
    for question in questions:
        result = qa_pipeline(question=question, context=context)
        answer_text = result["answer"] if result["score"] >= CONFIDENCE_THRESHOLD else "Not Found"
        answers.append({
            "question": question,
            "answer": answer_text,
            "confidence": result["score"]
        })
     
    
    return answers
