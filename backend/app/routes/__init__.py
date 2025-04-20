from fastapi import APIRouter
from .medal_routes import router as medal_router
from .gdp_routes import router as gdp_router
from .gdp_per_capita_routes import router as gdp_pc_router
from .education_expenditure_routes import router as edu_router

router = APIRouter()
router.include_router(medal_router)
router.include_router(gdp_router)
router.include_router(gdp_pc_router)
router.include_router(edu_router)
