# OlympIQ Backend

A FastAPI backend service for the OlympIQ application that provides comprehensive Olympic and socio-economic data via RESTful API endpoints.

## Overview

OlympIQ Backend serves:
- Olympic medal statistics
- Economic indicators (GDP, GDP per capita)
- Social metrics (Education, Health, Literacy rates)
- Demographic data (Population, Urbanization)
- Governance indicators (Political Stability)

Built with **FastAPI** framework and **pandas** for data processing.

## Prerequisites

- Python 3.10+
- pip (Python package manager)

## Setup Instructions

```bash
# Clone repository
git clone https://github.com/yourusername/OlympIQ.git
cd OlympIQ/backend

# Create virtual environment
python -m venv venv

# Activate environment
# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Running the Application

```bash
uvicorn app.main:app --reload
```

Access API documentation at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## API Endpoints

### Olympic Data

| Category          | Endpoint                          | Method | Description                          | Parameters |
|-------------------|-----------------------------------|--------|--------------------------------------|------------|
| Medal Data        | `/medals`                         | GET    | All Olympic medal data               | None       |
|                   | `/medals/{country}`               | GET    | Medal data by country                | country (str) |
|                   | `/medals/year/{year}`             | GET    | Medal data by year                   | year (int) |
|                   | `/medals/aggregate`               | GET    | Aggregated medal counts              | None       |
|                   | `/medals/trend/{country}`         | GET    | Year-wise medal trend                | country (str) |
|                   | `/medals/top/{year}`              | GET    | Top countries by medals              | year (int), top_n (int, optional) |

### Economic Indicators

| Category          | Endpoint                          | Method | Description                          | Parameters |
|-------------------|-----------------------------------|--------|--------------------------------------|------------|
| GDP               | `/gdp`                            | GET    | All GDP data                         | None       |
|                   | `/gdp/{country}`                  | GET    | GDP data by country                  | country (str) |
|                   | `/gdp/year/{year}`                | GET    | GDP data by year                     | year (int) |
| GDP Per Capita    | `/gdp-per-capita`                 | GET    | All GDP per capita data              | None       |
|                   | `/gdp-per-capita/{country}`       | GET    | GDP per capita by country            | country (str) |

### Social Metrics

| Category          | Endpoint                          | Method | Description                          | Parameters |
|-------------------|-----------------------------------|--------|--------------------------------------|------------|
| Education         | `/education-expenditure`          | GET    | All education expenditure data       | None       |
|                   | `/education-expenditure/{country}`| GET    | Education data by country            | country (str) |
| Health           | `/health-exp`                     | GET    | All health expenditure data          | None       |
|                   | `/health-exp/year/{year}`         | GET    | Health data by year                  | year (int) |
| Literacy         | `/literacy`                       | GET    | All literacy rate data               | None       |
|                   | `/literacy/top/{year}`            | GET    | Top literate countries               | year (int), top_n (int, optional) |

### Demographic Data

| Category          | Endpoint                          | Method | Description                          | Parameters |
|-------------------|-----------------------------------|--------|--------------------------------------|------------|
| Population        | `/population`                     | GET    | All population data                  | None       |
|                   | `/population/top/{year}`          | GET    | Most populated countries             | year (int), top_n (int, optional) |
| Urbanization     | `/urban`                          | GET    | All urban population data            | None       |
|                   | `/urban/bottom/{year}`            | GET    | Least urbanized countries            | year (int), bottom_n (int, optional) |

### Governance

| Category          | Endpoint                          | Method | Description                          | Parameters |
|-------------------|-----------------------------------|--------|--------------------------------------|------------|
| Political Stability | `/stability`                    | GET    | All political stability data         | None       |
|                   | `/stability/top/{year}`          | GET    | Most stable countries                | year (int), top_n (int, optional) |

## Data Formats

All data files should be in CSV format with the following structures:

| Dataset                 | Required Columns                  | Example |
|-------------------------|-----------------------------------|---------|
| Medals                  | Country, Gold, Silver, Bronze, Total, Year | `Argentina,2,0,4,6,2004` |
| GDP                     | Country, Year, GDP (total)        | `United States,2020,20936600000000` |
| GDP Per Capita          | Country, Year, GDP per capita     | `Luxembourg,2020,115873.60` |
| Education Expenditure   | Country, Year, Education Exp (%GDP) | `Afghanistan,2006,4.684` |
| Health Expenditure      | Country, Year, Health Exp (%GDP)  | `Afghanistan,2002,9.443` |
| Life Expectancy         | Country, Year, Life Expectancy    | `Afghanistan,2000,55.005` |
| Literacy Rate           | Country, Year, Literacy Rate (% 15+) | `Afghanistan,2015,33.753` |
| Political Stability     | Country, Year, Political Stability Index | `Afghanistan,2000,-2.438` |
| Population              | Country, Year, Population         | `Afghanistan,2000,20130327` |
| Urban Population        | Country, Year, Urban Population (%) | `Afghanistan,2000,22.078` |

## Troubleshooting

1. **File Paths**: Confirm data files exist at:
   ```
   backend/app/data/processed/
     - medals.csv
     - gdp_total_cleaned.csv
     - gdp_per_capita_cleaned.csv
     - education_expenditure_cleaned.csv
     - health_expenditure_cleaned.csv
     - life_expectancy_cleaned.csv
     - literacy_rate_cleaned.csv
     - political_stability_cleaned.csv
     - population_cleaned.csv
     - urban_population_cleaned.csv
   ```

2. **Common Issues**:
   - Verify file paths in route files
   - Ensure virtual environment is activated
   - Check all dependencies are installed

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request
```

Key improvements:
1. Standardized endpoint tables with consistent formatting
2. Grouped related endpoints by category
3. Consolidated data formats into a single table
4. Improved troubleshooting section organization
5. Added clear section headers
6. Better code block formatting
7. More concise parameter descriptions
8. Consistent naming conventions throughout