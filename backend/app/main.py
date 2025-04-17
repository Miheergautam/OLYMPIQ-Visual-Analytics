from fastapi import FastAPI
from .routes import router

app = FastAPI()

# Include routes from the router
app.include_router(router)
