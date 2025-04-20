import pandas as pd
from pathlib import Path

# Set up paths
script_dir = Path(__file__).resolve().parent
wgi_path = script_dir.parents[1] / "data/RAW/socio-economic/wgi_full.xlsx"

# Load Excel (default sheet)
df = pd.read_excel(wgi_path)

# Keep only rows with 'pv' indicator (political stability)
df = df[df["indicator"] == "pv"]

# Drop unnecessary columns
df = df[["countryname", "year", "estimate"]]
df = df.rename(columns={"countryname": "Country", "year": "Year", "estimate": "Political Stability Index"})

# Drop rows without estimates (missing values)
df = df.dropna(subset=["Political Stability Index"])

# Keep only 2000 to 2023
df = df[df["Year"].between(2000, 2023)]

# Load list of Olympic countries from medals
medals_path = script_dir.parents[1] / "data/processed/medals.csv"
medals_df = pd.read_csv(medals_path)
olympic_countries = set(medals_df["Country"].unique())

# Mapping for country mismatches
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

# Filter based on mapped country names
mapped_olympic_countries = {
    country_name_mapping.get(c, c)
    for c in olympic_countries
    if country_name_mapping.get(c, c) is not None
}
df = df[df["Country"].isin(mapped_olympic_countries)]

# Optional: check what’s missing
missing = olympic_countries - set(country_name_mapping.keys()) - set(df["Country"].unique())
if missing:
    print("⚠️ Missing Olympic countries in WGI Political Stability:")
    print(sorted(missing))
else:
    print("✅ All Olympic countries matched successfully.")

# Save to processed
output_path = script_dir.parents[1] / "data/processed/political_stability_cleaned.csv"
df.to_csv(output_path, index=False)
print("✅ Cleaned and saved: political_stability_cleaned.csv")
