from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter()

# Update the file path to your Life Expectancy dataset
life_expectancy_data_file_path = "C:\\Users\\kshub\\OneDrive\\Documents\\10th_semester\\cs661\\OLYMPIQ-Visual-Analytics\\backend\\app\\data\\processed\\life_expectancy_cleaned.csv"
# life_expectancy_data_file_path = os.path.expanduser(life_expectancy_data_file_path)
life_data = pd.read_csv(life_expectancy_data_file_path)
life_data = life_data.dropna()
# life_data = life_data.fillna(0)

@router.get("/life-expectancy")
async def get_all_life_expectancy_data():
    return life_data.to_dict(orient="records")

@router.get("/life-expectancy/years")
async def get_all_years():
    years = sorted(life_data['Year'].unique().tolist())
    return {"years": years}

@router.get("/life-expectancy/year/{year}")
async def get_life_expectancy_by_year(year: int):
    filtered_data = life_data[life_data['Year'] == year]
    if filtered_data.empty:
        return {"error": "No data for this year"}
    return filtered_data.to_dict(orient="records")

@router.get("/life-expectancy/countries")
async def get_all_countries():
    countries = sorted(life_data['Country'].unique().tolist())
    return {"countries": countries}

@router.get("/life-expectancy/country/{country}")
async def get_life_expectancy_by_country(country: str):
    filtered_data = life_data[life_data['Country'].str.lower() == country.lower()]
    if filtered_data.empty:
        return {"error": "Country not found"}
    return filtered_data.sort_values(by="Year").to_dict(orient="records")

@router.get("/life-expectancy/top/{year}")
async def get_top_life_expectancy_countries(year: int, top_n: int = 10):
    year_data = life_data[life_data['Year'] == year]
    if year_data.empty:
        return {"error": "No data for this year"}
    top_countries = year_data.sort_values(by="Life Expectancy", ascending=False).head(top_n)
    return top_countries.to_dict(orient="records")

@router.get("/life-expectancy/bottom/{year}")
async def get_bottom_life_expectancy_countries(year: int, bottom_n: int = 10):
    year_data = life_data[life_data['Year'] == year]
    if year_data.empty:
        return {"error": "No data for this year"}
    bottom_countries = year_data.sort_values(by="Life Expectancy", ascending=True).head(bottom_n)
    return bottom_countries.to_dict(orient="records")
