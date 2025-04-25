from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter()

# Update the file path to your Population dataset
population_data_file_path = "C:\\Users\\kshub\\OneDrive\\Documents\\10th_semester\\cs661\\OLYMPIQ-Visual-Analytics\\backend\\app\\data\\processed\\population_cleaned.csv"
# population_data_file_path = os.path.expanduser(population_data_file_path)
population_data = pd.read_csv(population_data_file_path)
population_data = population_data.dropna()
# population_data = population_data.fillna(0)


@router.get("/population")
async def get_all_population_data():
    return population_data.to_dict(orient="records")

@router.get("/population/years")
async def get_all_years():
    years = sorted(population_data['Year'].unique().tolist())
    return {"years": years}

@router.get("/population/year/{year}")
async def get_population_by_year(year: int):
    filtered_data = population_data[population_data['Year'] == year]
    if filtered_data.empty:
        return {"error": "No data for this year"}
    return filtered_data.to_dict(orient="records")

@router.get("/population/countries")
async def get_all_countries():
    countries = sorted(population_data['Country'].unique().tolist())
    return {"countries": countries}

@router.get("/population/country/{country}")
async def get_population_by_country(country: str):
    filtered_data = population_data[population_data['Country'].str.lower() == country.lower()]
    if filtered_data.empty:
        return {"error": "Country not found"}
    return filtered_data.sort_values(by="Year").to_dict(orient="records")


@router.get("/population/top/{year}")
async def get_top_populated_countries(year: int, top_n: int = 10):
    year_data = population_data[population_data['Year'] == year]
    if year_data.empty:
        return {"error": "No data for this year"}
    top_countries = year_data.sort_values(by="Population", ascending=False).head(top_n)
    return top_countries.to_dict(orient="records")

@router.get("/population/bottom/{year}")
async def get_bottom_populated_countries(year: int, bottom_n: int = 10):
    year_data = population_data[population_data['Year'] == year]
    if year_data.empty:
        return {"error": "No data for this year"}
    bottom_countries = year_data.sort_values(by="Population", ascending=True).head(bottom_n)
    return bottom_countries.to_dict(orient="records")
