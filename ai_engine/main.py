from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.router import router

app = FastAPI(title="Medichain AI Engine", description="AI Engine API", version="1.0.0")

app.include_router(router)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # or ["*"] for dev
    allow_credentials=True,           # needed if you send cookies/Auth headers
    allow_methods=["*"],              # or the specific verbs you need
    allow_headers=["*"],              # or e.g. ["Content-Type", "Authorization"]
)

@app.get("/")
def read_root():
    return {"message": "FastAPI service is running"}
