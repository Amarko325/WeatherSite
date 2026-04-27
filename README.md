"# Weather App

A React web application built with Next.js that displays weather information for a given city.

## Setup

1. Install Node.js if needed: download from [https://nodejs.org/](https://nodejs.org/) and restart your terminal.

2. Install dependencies:
   ```
   npm install
   ```

2. Get an API key from [OpenWeatherMap](https://openweathermap.org/api) if you want to use that service.

3. If you do not have an OpenWeatherMap API key, the app can still work using a free fallback service.

4. If you have a key, add it to `.env.local`:
   ```
   OPENWEATHER_API_KEY=your_actual_api_key
   ```

   If you leave `your_api_key_here`, the app will use the fallback weather service instead of OpenWeatherMap.

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Enter a city name to get current weather information
- Displays temperature, weather description, humidity, and wind speed
- Error handling for invalid cities or API issues" 
