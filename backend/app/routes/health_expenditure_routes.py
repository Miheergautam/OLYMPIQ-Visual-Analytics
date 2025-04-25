from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter()

# Update the file path to your Health Expenditure dataset
health_exp_data_file_path = "C:\\Users\\kshub\\OneDrive\\Documents\\10th_semester\\cs661\\OLYMPIQ-Visual-Analytics\\backend\\app\\data\\processed\\health_expenditure_cleaned.csv"
# health_exp_data_file_path = os.path.expanduser(health_exp_data_file_path)
health_data = pd.read_csv(health_exp_data_file_path)
health_data = health_data.dropna()
# health_data = health_data.fillna(0)

@router.get("/health-exp")
async def get_all_health_expenditure_data():
    return health_data.to_dict(orient="records")

@router.get("/health-exp/years")
async def get_all_years():
    years = sorted(health_data['Year'].unique().tolist())
    return {"years": years}

@router.get("/health-exp/year/{year}")
async def get_health_expenditure_by_year(year: int):
    filtered_data = health_data[health_data['Year'] == year]
    if filtered_data.empty:
        return {"error": "No data for this year"}
    return filtered_data.to_dict(orient="records")

@router.get("/health-exp/countries")
async def get_all_countries():
    countries = sorted(health_data['Country'].unique().tolist())
    return {"countries": countries}

@router.get("/health-exp/country/{country}")
async def get_health_expenditure_by_country(country: str):
    filtered_data = health_data[health_data['Country'].str.lower() == country.lower()]
    if filtered_data.empty:
        return {"error": "Country not found"}
    return filtered_data.sort_values(by="Year").to_dict(orient="records")

@router.get("/health-exp/top/{year}")
async def get_top_health_exp_countries(year: int, top_n: int = 10):
    year_data = health_data[health_data['Year'] == year]
    year_data = year_data.dropna(subset=["Health Exp (%GDP)"])
    if year_data.empty:
        return {"error": "No data for this year"}
    top_countries = year_data.sort_values(by="Health Exp (%GDP)", ascending=False).head(top_n)
    return top_countries.to_dict(orient="records")

@router.get("/health-exp/bottom/{year}")
async def get_bottom_health_exp_countries(year: int, bottom_n: int = 10):
    year_data = health_data[health_data['Year'] == year]
    year_data = year_data.dropna(subset=["Health Exp (%GDP)"])
    if year_data.empty:
        return {"error": "No data for this year"}
    bottom_countries = year_data.sort_values(by="Health Exp (%GDP)", ascending=True).head(bottom_n)
    return bottom_countries.to_dict(orient="records")
