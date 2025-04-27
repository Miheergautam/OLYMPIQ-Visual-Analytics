from fastapi import APIRouter
from .medal_routes import router as medal_router
from .gdp_routes import router as gdp_router
from .gdp_per_capita_routes import router as gdp_pc_router
from .education_expenditure_routes import router as edu_router
from .political_stability_routes import router as stability_router
from .urban_population_routes import router as urban_router
from .population_routes import router as population_router
from .literacy_rate_routes import router as literacy_router
from .life_expectancy_routes import router as life_expectancy_router
from .health_expenditure_routes import router as health_expenditure_router
from .correlation_routes import router as correlation_router

router = APIRouter()
router.include_router(medal_router)
router.include_router(gdp_router)
router.include_router(gdp_pc_router)
router.include_router(edu_router)
router.include_router(stability_router)
router.include_router(urban_router)
router.include_router(population_router)
router.include_router(literacy_router)
router.include_router(life_expectancy_router)
router.include_router(health_expenditure_router)
router.include_router(correlation_router)

