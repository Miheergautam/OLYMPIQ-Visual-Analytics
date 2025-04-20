import pandas as pd
from pathlib import Path

# Setup paths
script_dir = Path(__file__).resolve().parent
lit_path = script_dir.parents[1] / "data/RAW/socio-economic/literacy_rate.csv"
medals_path = script_dir.parents[1] / "data/processed/medals.csv"

# Load the data with ".." as NaN
lit_df = pd.read_csv(lit_path, na_values="..")

# Clean column names
lit_df.columns = lit_df.columns.str.strip()

# Drop unnecessary columns
drop_cols = [col for col in ["Series Name", "Series Code", "Country Code"] if col in lit_df.columns]
lit_df = lit_df.drop(columns=drop_cols)

# Rename for clarity
lit_df = lit_df.rename(columns={"Country Name": "Country"})

# Melt from wide to long format
lit_df = lit_df.melt(id_vars=["Country"], var_name="Year", value_name="Literacy Rate (% 15+)")

# Extract year digits
lit_df["Year"] = lit_df["Year"].str.extract(r"(\d{4})")

# Drop rows with missing values and restrict years
# lit_df = lit_df.dropna(subset=["Literacy Rate (% 15+)"])
lit_df = lit_df[lit_df["Year"].astype(int).between(2000, 2023)]

# Load Olympic countries
olympic_countries = set(pd.read_csv(medals_path)["Country"].unique())

# Mapping for Olympic country alignment
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

# Filter relevant countries
mapped_olympic_countries = {
    country_name_mapping.get(c, c)
    for c in olympic_countries
    if country_name_mapping.get(c, c) is not None
}
lit_df = lit_df[lit_df["Country"].isin(mapped_olympic_countries)]

# Sort
lit_df = lit_df.sort_values(by=["Country", "Year"])

# Optional: check for unmapped
missing = olympic_countries - set(country_name_mapping.keys()) - set(lit_df["Country"].unique())
if missing:
    print("⚠️ The following Olympic countries are missing in literacy rate dataset:")
    print(sorted(missing))
else:
    print("✅ All Olympic countries matched successfully for literacy rate.")

# Save cleaned version
lit_df.to_csv(script_dir.parents[1] / "data/processed/literacy_rate_cleaned.csv", index=False)
print("✅ Cleaned and saved: literacy_rate_cleaned.csv")
