# MedichainAI

MedichainAI is a full-stack platform for medical claim management and fraud detection, featuring:
- **AI-powered document analysis** (classification, OCR, summarization, QA, image matching)
- **Secure backend** for user and claim management
- **Modern frontend** for claim upload, analytics, and user interaction

## Project Structure

```
MedichainAi/
  ai_engine/      # FastAPI-based AI microservice (Python)
  backend/        # Node.js/Express backend API and database
  frontend/       # React + Vite frontend (in frontend/my-app)
  docker-compose.yml
```

---

## Features

### AI Engine (`ai_engine/`)
- **Document Classification**: Classifies uploaded documents.
- **OCR**: Extracts text from images and PDFs.
- **Summarization**: Summarizes medical documents.
- **Question Answering**: Answers questions based on document content.
- **Image Matching**: Compares and matches medical images.
- Built with **FastAPI** and integrates ML models (see `ai_engine/models/`).

### Backend (`backend/`)
- **User Authentication**: Register, login, JWT-based auth.
- **Claim Management**: Upload, view, and manage claims.
- **Fraud Detection**: Integrates with AI engine for risk scoring.
- **MongoDB** via Mongoose for data storage.
- **Logging** and **file uploads** supported.

### Frontend (`frontend/my-app/`)
- **User Dashboard**: View analytics, claim status, and risk scores.
- **Claim Upload**: Upload documents, images, and enter claim details.
- **Authentication**: Register/login/logout.
- **Responsive UI**: Built with React, TailwindCSS, and Vite.

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- (For local dev) Node.js 18+, Python 3.10+, MongoDB

### Quick Start (with Docker)

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd MedichainAi
   ```

2. **Set up environment variables:**
   - Copy your backend `.env` file to `backend/.env` (see `backend/config/db.js` for required variables).

3. **Build and run all services:**
  
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)
   - AI Engine: [http://localhost:8000](http://localhost:8000)

---

## Development

### AI Engine

- **Run locally:**
  ```bash
  cd ai_engine
  pip install -r requirements.txt
  uvicorn main:app --reload --host 0.0.0.0 --port 8000
  ```

### Backend

- **Install dependencies & run:**
  ```bash
  cd backend
  npm install
  npm run start
  ```

- **Run tests:**
  ```bash
  npm test
  ```

### Frontend

- **Install dependencies & run:**
  ```bash
  cd frontend/my-app
  npm install
  npm run dev
  ```

---

## API Overview

- **AI Engine**: `/classify`, `/ocr`, `/summarize`, `/doc-qa`, `/image-match` (see `ai_engine/api/endpoints/`)
- **Backend**: `/api/users`, `/api/claims` (see `backend/routes/`)
- **Frontend**: User-friendly UI for all features

---

## Technologies Used

- **Frontend**: React, Vite, TailwindCSS, Redux
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Multer
- **AI Engine**: FastAPI, scikit-learn, transformers, pytesseract, FAISS, PDF/image processing libs
- **DevOps**: Docker, Docker Compose

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

This project is licensed under the ISC License.

---

## Authors

- Athul Shaji 

---

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [MongoDB](https://www.mongodb.com/)
- [HuggingFace Transformers](https://huggingface.co/transformers/)

![Screenshot from 2025-06-22 19-46-34](https://github.com/user-attachments/assets/e10da023-4e5a-4220-8e2f-5253a755da0e)

![Screenshot from 2025-06-22 19-49-25](https://github.com/user-attachments/assets/3180c7d7-c784-4734-a6a3-6e3b74760869)


