# OlympIQ Backend

A FastAPI backend service for the OlympIQ application that provides Olympic medals data via RESTful API endpoints.

## Overview

OlympIQ Backend serves Olympic medal statistics through various API endpoints. It uses FastAPI for the API framework and pandas for data processing.

## Prerequisites

- Python 3.10+
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
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

Start the FastAPI server with:
```bash
uvicorn app.main:app --reload
```

The server will be available at `http://127.0.0.1:8000`

## API Endpoints

- `GET /medals` - Retrieve all Olympic medal data
- `GET /medals/{country}` - Retrieve medal data for a specific country


## Data Format

The `medals.csv` file should contain the following columns:
- Country
- Gold
- Silver
- Bronze
- (Additional columns as needed)

## Troubleshooting

If you encounter file not found errors when starting the application, ensure:
1. The directory structure is correctly set up
2. The medals.csv file exists in the proper location
3. The file path in `medal_routes.py` matches your project structure

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
