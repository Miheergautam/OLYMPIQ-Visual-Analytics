import pandas as pd
from pathlib import Path

# Define the base directory relative to the script location
script_dir = Path(__file__).resolve().parent

# Load the dataset
# edu_path = r"c:\Users\HP\Documents\GitHub\OlympiQ\backend\app\data\RAW\socio-economic\education_expenditure.csv"
edu_path = script_dir.parents[1] / "data/RAW/socio-economic/education_expenditure.csv"
edu_df = pd.read_csv(edu_path, na_values="..")

# Strip column name whitespace
edu_df.columns = edu_df.columns.str.strip()

# Drop unnecessary columns
drop_cols = [col for col in ["Series Name", "Series Code", "Country Code"] if col in edu_df.columns]
edu_df = edu_df.drop(columns=drop_cols)

# Rename Country column
edu_df = edu_df.rename(columns={"Country Name": "Country"})

# Convert wide to long format
edu_df = edu_df.melt(id_vars=["Country"], var_name="Year", value_name="Education Exp (%GDP)")

# Extract numeric year
edu_df["Year"] = edu_df["Year"].str.extract(r"(\d{4})")

# Drop missing and invalid year rows
# edu_df = edu_df.dropna(subset=["Education Exp (%GDP)"])
edu_df = edu_df[edu_df["Year"].astype(int).between(2000, 2023)]

# Load Olympic countries
# medals_path = r"c:\Users\HP\Documents\GitHub\OlympiQ\backend\app\data\processed\medals.csv"
medals_path = script_dir.parents[1] / "data/processed/medals.csv"
olympic_countries = set(pd.read_csv(medals_path)["Country"].unique())

# Country name mapping for alignment with Olympic names
country_name_mapping = {
    "Russia": "Russian Federation",
    "Iran": "Iran, Islamic Rep.",
    "Egypt": "Egypt, Arab Rep.",
    "Czech Republic": "Czechia",
    "Hong Kong": "Hong Kong SAR, China",
    "Turkey": "Turkiye",
    "Syria": "Syrian Arab Republic",
    "Venezuela": "Venezuela, RB",
    "Vietnam": "Vietnam",
    "Ivory Coast": "Cote d'Ivoire",
    "South Korea": "Korea, Rep.",
    "North Korea": "Korea, Dem. People’s Rep.",
    "Slovakia": "Slovak Republic",
    "Great Britain": "United Kingdom",
    "Chinese Taipei": "Taiwan",
    "Olympic Athletes from Russia": "Russian Federation",
    "Russian Olympic Committee": "Russian Federation",
    "Independent Olympic Athletes": None,
    "Individual Olympic Athletes": None,
    "Refugee Olympic Team": None,
    "Serbia and Montenegro": "Serbia", 
    "Yugoslavia": None,
    "Cape Verde": "Cabo Verde",
    "Bahamas": "Bahamas, The",
    "Saint Lucia": "St. Lucia",
    "Kyrgyzstan": "Kyrgyz Republic"
}

# Map and filter relevant countries
mapped_olympic_countries = {
    country_name_mapping.get(country, country)
    for country in olympic_countries
    if country_name_mapping.get(country, country) is not None
}
edu_df = edu_df[edu_df["Country"].isin(mapped_olympic_countries)]

# Sort for neatness
edu_df = edu_df.sort_values(by=["Country", "Year"])

# Optional: check if any countries are missing
missing = olympic_countries - set(country_name_mapping.keys()) - set(edu_df["Country"].unique())
if missing:
    print("⚠️ The following Olympic countries are missing in education expenditure dataset:")
    print(sorted(missing))
else:
    print("✅ All Olympic countries matched successfully for education expenditure.")

# Save cleaned version
edu_df.to_csv(script_dir.parents[1] / "data/processed/education_expenditure_cleaned.csv", index=False)
print("✅ Cleaned and saved: education_expenditure_cleaned.csv")
