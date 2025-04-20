import pandas as pd
from pathlib import Path


script_dir = Path(__file__).resolve().parent
urban_path = script_dir.parents[1] / "data/RAW/socio-economic/urban_population_percent.csv"

# Load CSV
df = pd.read_csv(urban_path, na_values="..")
df.columns = df.columns.str.strip()

# Drop unnecessary columns
drop_cols = [col for col in ["Series Name", "Series Code", "Country Code"] if col in df.columns]
df = df.drop(columns=drop_cols)

# Standardize column
df = df.rename(columns={"Country Name": "Country"})

# Melt wide to long
df = df.melt(id_vars=["Country"], var_name="Year", value_name="Urban Population (%)")

# Extract and filter years
df["Year"] = df["Year"].str.extract(r"(\d{4})")
df = df[df["Year"].astype(int).between(2000, 2023)]

# Olympic filtering
medals_path = script_dir.parents[1] / "data/processed/medals.csv"
olympic_countries = set(pd.read_csv(medals_path)["Country"].unique())

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

mapped_olympic_countries = {
    country_name_mapping.get(country, country)
    for country in olympic_countries
    if country_name_mapping.get(country, country) is not None
}

df = df[df["Country"].isin(mapped_olympic_countries)]
df = df.sort_values(by=["Country", "Year"])

# Report any missing
missing = olympic_countries - set(country_name_mapping.keys()) - set(df["Country"].unique())
if missing:
    print("⚠️ Missing Olympic countries in urban population dataset:")
    print(sorted(missing))
else:
    print("✅ All Olympic countries matched successfully for urban population.")

# Save
output_path = script_dir.parents[1] / "data/processed/urban_population_cleaned.csv"
df.to_csv(output_path, index=False)
print("✅ Cleaned and saved: urban_population_cleaned.csv")
