from fastapi import FastAPI
from .db.database import engine, Base
from .routes.feedback import router as feedback_router
from .routes.auth import router as auth_router

# IMPORTANT: import models
from .db import models

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This line creates tables
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(feedback_router)
app.include_router(auth_router)

@app.get("/")
def home():
    return {"message": "API running"}