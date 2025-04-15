import pandas as pd

gdp_path = r"c:\Users\HP\Documents\GitHub\OlympiQ\data\raw\socio-economic\gdp_per_capita.csv"
gdp_df = pd.read_csv(gdp_path, skiprows=4)

# Drop irrelevant columns
gdp_df = gdp_df.drop(columns=["Country Code", "Indicator Name", "Indicator Code"])

# Reshape from wide to long format
gdp_df = gdp_df.melt(id_vars = ["Country Name"], var_name="Year", value_name="GDP per capita")

# Drop rows with empty GDP or invalid years
gdp_df = gdp_df.dropna(subset=["GDP per capita"])
gdp_df = gdp_df[gdp_df["Year"].astype(str).str.isdigit()] # Remove empty/non-numeric year labels

# keeping only data from 2000 to 2023
gdp_df = gdp_df[gdp_df["Year"].astype(int).between(2000, 2023)]

# Getting unique country names from medalists
medals_path = r"c:\Users\HP\Documents\GitHub\OlympiQ\data\processed\medals.csv"
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
    # The following are exceptions
    "Chinese Taipei": "Taiwan",  # Not present in World Bank
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

# Mappin olympic countries to GDP dataset names
mapped_olympic_countries = set()
for country in olympic_countries:
    mapped_name = country_name_mapping.get(country, country)
    if mapped_name:
        mapped_olympic_countries.add(mapped_name)

# Filter the DataFrame to keep only the countries present in the medals DataFrame
gdp_df = gdp_df[gdp_df["Country Name"].isin(mapped_olympic_countries)]

# Sorting by country and year
gdp_df = gdp_df.sort_values(by=["Country Name", "Year"])

# Check if any Olympic countries were not found in GDP dataset
unmapped = olympic_countries - set(country_name_mapping.keys()) - set(gdp_df["Country Name"].unique())
if unmapped:
    print("⚠️ Unmapped countries still missing in GDP data:")
    print(sorted(unmapped))
else:
    print("✅ All mapped Olympic countries matched in GDP dataset.")

# Saving the cleaned data
gdp_df.to_csv(r"c:\Users\HP\Documents\GitHub\OlympiQ\data\processed\gdp_per_capita_cleaned.csv", index=False)
print("✅ Cleaned and saved: gdp_per_capita_cleaned.csv")