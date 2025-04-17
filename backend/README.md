# OlympIQ Backend

A FastAPI backend service for the OlympIQ application that provides Olympic medals data via RESTful API endpoints.

## Overview

OlympIQ Backend serves Olympic medal statistics through various API endpoints. It uses **FastAPI** for the API framework and **pandas** for data processing.

## Prerequisites

- Python 3.10 or higher  
- pip (Python package manager)

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/OlympIQ.git
   cd OlympIQ/backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   
   macOS/Linux:
   ```bash
   source venv/bin/activate
   ```
   
   Windows:
   ```bash
   venv\Scripts\activate
   ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

Start the FastAPI development server with:
```bash
uvicorn app.main:app --reload
```

Once started, access the API documentation at:
http://127.0.0.1:8000/docs

## API Endpoints

The OlympIQ backend provides various API endpoints organized by category.

### 🏅 Medal Data Endpoints

| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `GET /medals` | Retrieve all Olympic medal data across countries and years. | None |
| `GET /medals/{country}` | Retrieve medal data for a specific country. | **Path Parameters:**<br>• country (string) – Name of the country (case-insensitive) |
| `GET /medals/year/{year}` | Retrieve medal data for all countries in a specific year. | **Path Parameters:**<br>• year (integer) – Olympic year (e.g., 2008, 2024) |
| `GET /medals/aggregate` | Retrieve total medal counts (Gold, Silver, Bronze, Total) aggregated by country. | None |
| `GET /medals/trend/{country}` | Retrieve year-wise medal trend for a specific country. | **Path Parameters:**<br>• country (string) – Name of the country (case-insensitive) |
| `GET /medals/top/{year}?top_n=10` | Retrieve top N countries by total medals in a specific year. | **Path Parameters:**<br>• year (integer) – Olympic year<br>**Query Parameters:**<br>• top_n (integer, optional) – Number of top countries to return (default: 10) |

### 💰 GDP Data Endpoints

| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `GET /gdp` | Retrieve all GDP data across countries and years. | None |
| `GET /gdp/{country}` | Retrieve GDP data for a specific country. | **Path Parameters:**<br>• country (string) – Name of the country (case-insensitive) |
| `GET /gdp/year/{year}` | Retrieve GDP data for all countries in a specific year. | **Path Parameters:**<br>• year (integer) – Year for GDP data |
| `GET /gdp/trend/{country}` | Retrieve year-wise GDP trend for a specific country. | **Path Parameters:**<br>• country (string) – Name of the country (case-insensitive) |
| `GET /gdp/top/{year}?top_n=10` | Retrieve top N countries by GDP in a specific year. | **Path Parameters:**<br>• year (integer) – Year for GDP data<br>**Query Parameters:**<br>• top_n (integer, optional) – Number of top countries to return (default: 10) |

### 📊 GDP Per Capita Endpoints

| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `GET /gdp-per-capita` | Retrieve all GDP per capita data across countries and years. | None |
| `GET /gdp-per-capita/{country}` | Retrieve GDP per capita data for a specific country. | **Path Parameters:**<br>• country (string) – Name of the country (case-insensitive) |
| `GET /gdp-per-capita/year/{year}` | Retrieve GDP per capita data for all countries in a specific year. | **Path Parameters:**<br>• year (integer) – Year for GDP per capita data |
| `GET /gdp-per-capita/top/{year}?top_n=10` | Retrieve top N countries by GDP per capita in a specific year. | **Path Parameters:**<br>• year (integer) – Year for GDP per capita data<br>**Query Parameters:**<br>• top_n (integer, optional) – Number of top countries to return (default: 10) |

## Data Format

### Medal Data Format
Ensure the medals.csv file contains the following columns:
- Country
- Gold
- Silver
- Bronze
- Total
- Year

**Example:**
```
Country,Gold,Silver,Bronze,Total,Year
Argentina,2,0,4,6,2004
```

### GDP Data Format
Ensure the gdp_total_cleaned.csv file contains the following columns:
- Country
- Year
- GDP (total)

**Example:**
```
Country,Year,GDP (total)
United States,2020,20936600000000
China,2020,14722731304880
```

### GDP Per Capita Data Format
Ensure the gdp_per_capita_cleaned.csv file contains the following columns:
- Country
- Year
- GDP per capita

**Example:**
```
Country,Year,GDP per capita
Luxembourg,2020,115873.60
Switzerland,2020,86601.56
```

## Troubleshooting

- Confirm the data files exist at their expected locations:
  - `backend/app/data/processed/medals.csv`
  - `backend/app/data/processed/gdp_total_cleaned.csv`
  - `backend/app/data/processed/gdp_per_capita_cleaned.csv`
- Verify the file paths in route files are correctly set.
- Ensure dependencies are installed correctly in your virtual environment.

## Contributing

1. Fork the repository.
2. Create a new branch:
   ```
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit:
   ```
   git commit -m "Add your feature"
   ```
4. Push to your branch:
   ```
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request.