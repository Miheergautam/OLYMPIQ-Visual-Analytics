from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router as api_router
from app.dimensionality_reduction import router as dr_router
from app.clusteranalysis import router as cluster_router


app = FastAPI()

# Add CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
app.include_router(cluster_router, prefix="/api/clusteranalysis")
app.include_router(dr_router, prefix="/api/dimensionality-reduction")