import pandas as pd
from pathlib import Path

script_dir = Path(__file__).resolve().parent

# Load raw life expectancy data
life_path = script_dir.parents[1] / "data/RAW/socio-economic/life_expectancy.csv"
df = pd.read_csv(life_path, na_values="..")

# Clean headers
df.columns = df.columns.str.strip()

# Drop unused metadata columns
drop_cols = [col for col in ["Series Name", "Series Code", "Country Code"] if col in df.columns]
df = df.drop(columns=drop_cols)

# Rename
df = df.rename(columns={"Country Name": "Country"})

# Convert wide to long
df = df.melt(id_vars=["Country"], var_name="Year", value_name="Life Expectancy")

# Extract year digits
df["Year"] = df["Year"].str.extract(r"(\d{4})")

# Keep only relevant years
df = df[df["Year"].astype(int).between(2000, 2023)]

# Country harmonization
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

# Filter
df = df[df["Country"].isin(mapped_olympic_countries)]

# Sort
df = df.sort_values(by=["Country", "Year"])

# Optional check
missing = olympic_countries - set(country_name_mapping.keys()) - set(df["Country"].unique())
if missing:
    print("⚠️ Missing Olympic countries in life expectancy dataset:")
    print(sorted(missing))
else:
    print("✅ All Olympic countries matched successfully for life expectancy.")

# Save
output_path = script_dir.parents[1] / "data/processed/life_expectancy_cleaned.csv"
df.to_csv(output_path, index=False)
print("✅ Cleaned and saved: life_expectancy_cleaned.csv")
