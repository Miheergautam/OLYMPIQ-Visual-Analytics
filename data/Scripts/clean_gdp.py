import pandas as pd

# Load the dataset
gdp_path = r"c:\Users\HP\Documents\GitHub\OlympiQ\data\raw\socio-economic\GDP_Data.csv"
gdp_df = pd.read_csv(gdp_path, na_values = "..")

# Strip whitespace from all column names
gdp_df.columns = gdp_df.columns.str.strip()

# Drop unnecessary columns if they exist
drop_cols = [col for col in ["Series Name", "Series Code", "Country Code"] if col in gdp_df.columns]
gdp_df = gdp_df.drop(columns=drop_cols)

# Rename 'Country Name' to just 'Country'
gdp_df = gdp_df.rename(columns={"Country Name": "Country"})

# Melt the data from wide to long format
gdp_df = gdp_df.melt(id_vars=["Country"], var_name="Year", value_name="GDP (total)")

# Clean year column: extract numeric year only
gdp_df["Year"] = gdp_df["Year"].str.extract(r"(\d{4})")

# Drop rows with missing GDP or invalid years
gdp_df = gdp_df.dropna(subset=["GDP (total)"])
gdp_df = gdp_df[gdp_df["Year"].astype(int).between(2000, 2023)]

# Load Olympic countries
medals_path = r"c:\Users\HP\Documents\GitHub\OlympiQ\data\processed\medals.csv"
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

# Map Olympic countries to GDP dataset names
mapped_olympic_countries = {
    country_name_mapping.get(country, country)
    for country in olympic_countries
    if country_name_mapping.get(country, country) is not None
}

# Filter GDP data for relevant Olympic countries
gdp_df = gdp_df[gdp_df["Country"].isin(mapped_olympic_countries)]

# Sort by Country and Year
gdp_df = gdp_df.sort_values(by=["Country", "Year"])

# Final check for missing mappings
missing = olympic_countries - set(country_name_mapping.keys()) - set(gdp_df["Country"].unique())
if missing:
    print("⚠️ The following Olympic countries are missing in total GDP dataset:")
    print(sorted(missing))
else:
    print("✅ All Olympic countries matched successfully for GDP total.")

# Save the cleaned file
gdp_df.to_csv(r"c:\Users\HP\Documents\GitHub\OlympiQ\data\processed\gdp_total_cleaned.csv", index=False)
print("✅ Cleaned and saved: gdp_total_cleaned.csv")
