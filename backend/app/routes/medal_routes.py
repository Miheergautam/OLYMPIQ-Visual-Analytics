from fastapi import APIRouter
import pandas as pd

router = APIRouter()

data_file_path = "/Users/miheergautam/Documents/GitHub/OlympIQ/backend/app/data/processed/medals.csv"
data = pd.read_csv(data_file_path)

@router.get("/medals")
async def get_medals():
    return data.to_dict(orient="records")

@router.get("/medals/{country}")
async def get_medals_by_country(country: str):
    filtered_data = data[data['Country'] == country]
    if filtered_data.empty:
        return {"error": "Country not found"}
    return filtered_data.to_dict(orient="records")
