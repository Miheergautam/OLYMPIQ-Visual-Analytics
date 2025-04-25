from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter()

# Update the file path to your Literacy Rate dataset
literacy_data_file_path = "C:\\Users\\kshub\\OneDrive\\Documents\\10th_semester\\cs661\\OLYMPIQ-Visual-Analytics\\backend\\app\\data\\processed\\literacy_rate_cleaned.csv"
# literacy_data_file_path = os.path.expanduser(literacy_data_file_path)
literacy_data = pd.read_csv(literacy_data_file_path)
literacy_data = literacy_data.dropna()
# literacy_data = literacy_data.fillna(0)

# Clean: Optional, drop rows where Literacy Rate is NaN
# literacy_data = literacy_data.dropna(subset=["Literacy Rate (% 15+)"])

@router.get("/literacy")
async def get_all_literacy_data():
    return literacy_data.to_dict(orient="records")

@router.get("/literacy/years")
async def get_all_years():
    years = sorted(literacy_data['Year'].unique().tolist())
    return {"years": years}

@router.get("/literacy/year/{year}")
async def get_literacy_by_year(year: int):
    filtered_data = literacy_data[literacy_data['Year'] == year]
    if filtered_data.empty:
        return {"error": "No data for this year"}
    return filtered_data.to_dict(orient="records")

@router.get("/literacy/countries")
async def get_all_countries():
    countries = sorted(literacy_data['Country'].unique().tolist())
    return {"countries": countries}

@router.get("/literacy/country/{country}")
async def get_literacy_by_country(country: str):
    filtered_data = literacy_data[literacy_data['Country'].str.lower() == country.lower()]
    if filtered_data.empty:
        return {"error": "Country not found"}
    return filtered_data.sort_values(by="Year").to_dict(orient="records")

@router.get("/literacy/top/{year}")
async def get_top_literate_countries(year: int, top_n: int = 10):
    year_data = literacy_data[literacy_data['Year'] == year]
    year_data = year_data.dropna(subset=["Literacy Rate (% 15+)"])
    if year_data.empty:
        return {"error": "No data for this year"}
    top_countries = year_data.sort_values(by="Literacy Rate (% 15+)", ascending=False).head(top_n)
    return top_countries.to_dict(orient="records")

@router.get("/literacy/bottom/{year}")
async def get_bottom_literate_countries(year: int, bottom_n: int = 10):
    year_data = literacy_data[literacy_data['Year'] == year]
    year_data = year_data.dropna(subset=["Literacy Rate (% 15+)"])
    if year_data.empty:
        return {"error": "No data for this year"}
    bottom_countries = year_data.sort_values(by="Literacy Rate (% 15+)", ascending=True).head(bottom_n)
    return bottom_countries.to_dict(orient="records")
