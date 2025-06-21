from fastapi import FastAPI
from api.router import router
app = FastAPI(title="Medichain AI Engine", description="AI Engine API", version="1.0.0")

app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "FastAPI service is running"}
