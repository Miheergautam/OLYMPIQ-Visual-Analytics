from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router as api_router

app = FastAPI()

# Add CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")