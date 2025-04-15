import pandas as pd

# Load GDP data
gdp_path = r"c:\Users\HP\Documents\GitHub\OlympiQ\data\raw\socio-economic\gdp_per_capita.csv"
gdp_df = pd.read_csv(gdp_path, skiprows=4)

# Drop irrelevant columns
gdp_df = gdp_df.drop(columns=["Country Code", "Indicator Name", "Indicator Code"])

# Reshape from wide to long format
gdp_df = gdp_df.melt(id_vars=["Country Name"], var_name="Year", value_name="GDP per capita")

# Drop rows with empty GDP or invalid years
gdp_df = gdp_df.dropna(subset=["GDP per capita"])
gdp_df = gdp_df[gdp_df["Year"].astype(str).str.isdigit()]  # Remove non-numeric year labels

# Keep only data from 2000 to 2023
gdp_df = gdp_df[gdp_df["Year"].astype(int).between(2000, 2023)]

# Load Olympic country names
medals_path = r"c:\Users\HP\Documents\GitHub\OlympiQ\data\processed\medals.csv"
olympic_countries = set(pd.read_csv(medals_path)["Country"].unique())

# Mapping medals country names ➡️ GDP dataset names
country_name_mapping = {
    "Russia": "Russian Federation",
    "Iran": "Iran, Islamic Rep.",
    "Egypt": "Egypt, Arab Rep.",
    "Czech Republic": "Czechia",
    "Hong Kong": "Hong Kong SAR, China",
    "Turkey": "Turkiye",
    "Syria": "Syrian Arab Republic",
    "Venezuela": "Venezuela, RB",
    "Ivory Coast": "Cote d'Ivoire",
    "South Korea": "Korea, Rep.",
    "North Korea": "Korea, Dem. People’s Rep.",
    "Slovakia": "Slovak Republic",
    "Great Britain": "United Kingdom",
    "Chinese Taipei": "Taiwan",  # Not in GDP dataset
    "Olympic Athletes from Russia": None,
    "Russian Olympic Committee": "Russian Federation",
    "Independent Olympic Athletes": None,
    "Individual Olympic Athletes": None,
    "Refugee Olympic Team": None,
    "Serbia and Montenegro": "Serbia",
    "Yugoslavia": None,
    "Cape Verde": "Cabo Verde",
    "Bahamas": "Bahamas, The",
    "Saint Lucia": "St. Lucia",
    "Vietnam": "Viet Nam",
    "Kyrgyzstan": "Kyrgyz Republic"
}

# Reverse mapping: GDP name ➡️ Medals name (for renaming later)
reverse_mapping = {v: k for k, v in country_name_mapping.items() if v}
# Add direct matches (countries not in mapping)
for country in olympic_countries:
    if country not in country_name_mapping:
        reverse_mapping[country] = country

# Filter GDP rows to only mapped GDP country names
gdp_df = gdp_df[gdp_df["Country Name"].isin(reverse_mapping.keys())]

# Replace GDP country names with medals country names
gdp_df["Country Name"] = gdp_df["Country Name"].map(reverse_mapping)

# Sort and save
gdp_df = gdp_df.sort_values(by=["Country Name", "Year"])
gdp_df.to_csv(r"c:\Users\HP\Documents\GitHub\OlympiQ\data\processed\gdp_per_capita_cleaned.csv", index=False)
print("✅ Cleaned and saved: gdp_per_capita_cleaned.csv")

# Optional: Report countries still missing from GDP
missing = [c for c in olympic_countries if country_name_mapping.get(c, c) not in gdp_df["Country Name"].unique()]
if missing:
    print("⚠️ Olympic countries still missing in GDP data:")
    print(sorted(missing))
else:
    print("✅ All Olympic countries successfully included in GDP dataset.")
