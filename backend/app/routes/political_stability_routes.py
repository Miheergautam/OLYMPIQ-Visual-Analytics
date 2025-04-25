from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter()

# Update the file path to point to your Political Stability dataset
stability_data_file_path = "C:\\Users\\kshub\\OneDrive\\Documents\\10th_semester\\cs661\\OLYMPIQ-Visual-Analytics\\backend\\app\\data\\processed\\political_stability_cleaned.csv"
# stability_data_file_path = os.path.expanduser(stability_data_file_path)
stability_data = pd.read_csv(stability_data_file_path)
stability_data = stability_data.dropna()
# stability_data = stability_data.fillna(0)

@router.get("/stability")
async def get_all_stability_data():
    return stability_data.to_dict(orient="records")

@router.get("/stability/years")
async def get_all_years():
    years = sorted(stability_data['Year'].unique().tolist())
    return {"years": years}

@router.get("/stability/year/{year}")
async def get_stability_by_year(year: int):
    filtered_data = stability_data[stability_data['Year'] == year]
    if filtered_data.empty:
        return {"error": "No data for this year"}
    return filtered_data.to_dict(orient="records")

@router.get("/stability/countries")
async def get_all_countries():
    countries = sorted(stability_data['Country'].unique().tolist())
    return {"countries": countries}

@router.get("/stability/country/{country}")
async def get_stability_by_country(country: str):
    filtered_data = stability_data[stability_data['Country'].str.lower() == country.lower()]
    if filtered_data.empty:
        return {"error": "Country not found"}
    return filtered_data.sort_values(by="Year").to_dict(orient="records")

@router.get("/stability/top/{year}")
async def get_top_stable_countries(year: int, top_n: int = 10):
    year_data = stability_data[stability_data['Year'] == year]
    if year_data.empty:
        return {"error": "No data for this year"}
    top_countries = year_data.sort_values(by="Political Stability Index", ascending=False).head(top_n)
    return top_countries.to_dict(orient="records")

@router.get("/stability/bottom/{year}")
async def get_bottom_stable_countries(year: int, bottom_n: int = 10):
    year_data = stability_data[stability_data['Year'] == year]
    if year_data.empty:
        return {"error": "No data for this year"}
    bottom_countries = year_data.sort_values(by="Political Stability Index", ascending=True).head(bottom_n)
    return bottom_countries.to_dict(orient="records")
