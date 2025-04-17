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

#### GET /medals
Retrieve all Olympic medal data across countries and years.

#### GET /medals/{country}
Retrieve medal data for a specific country.

**Path Parameters:**
- country (string) – Name of the country (case-insensitive)

#### GET /medals/year/{year}
Retrieve medal data for all countries in a specific year.

**Path Parameters:**
- year (integer) – Olympic year (e.g., 2008, 2024)

#### GET /medals/aggregate
Retrieve total medal counts (Gold, Silver, Bronze, Total) aggregated by country.

#### GET /medals/trend/{country}
Retrieve year-wise medal trend for a specific country.

**Path Parameters:**
- country (string) – Name of the country (case-insensitive)

#### GET /medals/top/{year}?top_n=10
Retrieve top N countries by total medals in a specific year.

**Path Parameters:**
- year (integer) – Olympic year

**Query Parameters:**
- top_n (integer, optional) – Number of top countries to return (default: 10)

## Data Format

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

## Troubleshooting

- Confirm the medals.csv file exists at:
  `backend/app/data/processed/medals.csv`
- Verify the file path in medal_routes.py is correctly set.
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