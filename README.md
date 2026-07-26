# Weather Intelligence App

A modern, responsive Weather Intelligence web application built with React, Vite, and Tailwind CSS. The application connects directly to public Open-Meteo APIs to provide real-time weather metrics, 7-day forecasts, temperature trend charts, and dynamic outdoor planning recommendations.

---

## Features

- **City Search:** Instant lookup for weather data across global cities.
- **Current Weather:** Displays temperature, wind speed, weather condition icons, and location details.
- **7-Day Forecast:** Daily breakdowns of max/min temperatures and expected precipitation.
- **Visual Temperature Charts:** Visual trend comparisons of daily temperature ranges over the 7-day period.
- **Smart Planning Recommendations:** Dynamic client-side outdoor recommendations based on specific weather conditions (rain, extreme heat, high wind).
- **Graceful Error Handling:** Friendly error notifications for invalid city names or network issues.

---

## API Integrations

This app relies entirely on direct, client-side requests to the public [Open-Meteo API](https://open-meteo.com/):

1. **Open-Meteo Geocoding API:**  
   `https://geocoding-api.open-meteo.com/v1/search?name={cityName}&count=1&language=en&format=json`  
   *Converts city name input into precise latitude and longitude coordinates.*

2. **Open-Meteo Forecast API:**  
   `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`  
   *Fetches real-time weather and 7-day forecast data.*

---

## Local Development Setup

To run this project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/](https://github.com/)<your-username>/<your-repo-name>.git
   cd <your-repo-name>
