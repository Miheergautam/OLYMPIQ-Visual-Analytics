from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter()

# Update this file path to your Urban Population dataset
urban_data_file_path = "C:\\Users\\kshub\\OneDrive\\Documents\\10th_semester\\cs661\\OLYMPIQ-Visual-Analytics\\backend\\app\\data\\processed\\urban_population_cleaned.csv"
# urban_data_file_path = os.path.expanduser(urban_data_file_path)
urban_data = pd.read_csv(urban_data_file_path)

urban_data= urban_data.dropna()
# urban_data=urban_data.fillna(0)

@router.get("/urban")
async def get_all_urban_data():
    return urban_data.to_dict(orient="records")

@router.get("/urban/years")
async def get_all_years():
    years = sorted(urban_data['Year'].unique().tolist())
    return {"years": years}

@router.get("/urban/year/{year}")
async def get_urban_by_year(year: int):
    filtered_data = urban_data[urban_data['Year'] == year]
    if filtered_data.empty:
        return {"error": "No data for this year"}
    return filtered_data.to_dict(orient="records")

@router.get("/urban/countries")
async def get_all_countries():
    countries = sorted(urban_data['Country'].unique().tolist())
    return {"countries": countries}

@router.get("/urban/country/{country}")
async def get_urban_by_country(country: str):
    filtered_data = urban_data[urban_data['Country'].str.lower() == country.lower()]
    if filtered_data.empty:
        return {"error": "Country not found"}
    return filtered_data.sort_values(by="Year").to_dict(orient="records")

@router.get("/urban/top/{year}")
async def get_top_urbanized_countries(year: int, top_n: int = 10):
    year_data = urban_data[urban_data['Year'] == year]
    if year_data.empty:
        return {"error": "No data for this year"}
    top_countries = year_data.sort_values(by="Urban Population (%)", ascending=False).head(top_n)
    return top_countries.to_dict(orient="records")

@router.get("/urban/bottom/{year}")
async def get_bottom_urbanized_countries(year: int, bottom_n: int = 10):
    year_data = urban_data[urban_data['Year'] == year]
    if year_data.empty:
        return {"error": "No data for this year"}
    bottom_countries = year_data.sort_values(by="Urban Population (%)", ascending=True).head(bottom_n)
    return bottom_countries.to_dict(orient="records")
