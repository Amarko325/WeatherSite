function mapWeatherCode(code) {
  const mapping = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with hail',
    99: 'Thunderstorm with heavy hail',
  };
  return mapping[code] || 'Unknown';
}

function weatherIcon(code) {
  if ([61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) return '🌧️';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '❄️';
  if ([45, 48].includes(code)) return '🌫️';
  if ([1, 2].includes(code)) return '⛅';
  return '☀️';
}

function getClothingAdvice(temp, pop, code) {
  const rainCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
  if (pop >= 60 || rainCodes.includes(code)) {
    return { label: 'Rain jacket and rain boots', icon: '🌧️🧥🥾' };
  }
  if (pop >= 30) {
    return { label: 'Light rain jacket', icon: '🌦️🧥' };
  }
  if (temp < 12) {
    return { label: 'Light jacket', icon: '🧥' };
  }
  if (temp < 20) {
    return { label: 'Long sleeve', icon: '👕' };
  }
  return { label: 'T-shirt', icon: '👕' };
}

export default async function handler(req, res) {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  try {
    const geocodeRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
    );
    if (!geocodeRes.ok) {
      return res.status(502).json({ error: 'Failed to geocode city name' });
    }

    const geocodeData = await geocodeRes.json();
    const location = geocodeData.results?.[0];
    if (!location) {
      return res.status(404).json({ error: 'City not found' });
    }

    const { latitude, longitude, name, country, timezone } = location;
    const forecastRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,relativehumidity_2m,precipitation_probability,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&current_weather=true&timezone=${encodeURIComponent(
        timezone || 'auto'
      )}`
    );

    if (!forecastRes.ok) {
      return res.status(502).json({ error: 'Failed to fetch weather forecast' });
    }

    const forecastData = await forecastRes.json();
    const hourly = forecastData.hourly || {};
    const daily = forecastData.daily || {};
    const current = forecastData.current_weather;
    const currentIndex = hourly.time?.findIndex((t) => t === current?.time) ?? 0;

    const hourlyForecast = (hourly.time || [])
      .slice(currentIndex, currentIndex + 24)
      .map((time, index) => {
        const idx = currentIndex + index;
        const code = Number(hourly.weathercode?.[idx] ?? 0);
        const temp = Number(hourly.temperature_2m?.[idx] ?? 0);
        const pop = Number(hourly.precipitation_probability?.[idx] ?? 0);
        const advice = getClothingAdvice(temp, pop, code);
        return {
          time,
          temp,
          pop,
          description: mapWeatherCode(code),
          icon: weatherIcon(code),
          advice: advice.label,
          adviceIcon: advice.icon,
        };
      });

    const dailyForecast = (daily.time || [])
      .slice(0, 7)
      .map((date, index) => {
        const code = Number(daily.weathercode?.[index] ?? 0);
        const maxTemp = Number(daily.temperature_2m_max?.[index] ?? 0);
        const minTemp = Number(daily.temperature_2m_min?.[index] ?? 0);
        const precip = Number(daily.precipitation_sum?.[index] ?? 0);
        const advice = getClothingAdvice(maxTemp, precip >= 1 ? 50 : 0, code);
        return {
          date,
          maxTemp,
          minTemp,
          precip,
          description: mapWeatherCode(code),
          icon: weatherIcon(code),
          advice: advice.label,
          adviceIcon: advice.icon,
        };
      });

    const currentHumidity = hourly.relativehumidity_2m?.[currentIndex] ?? null;
    const currentPop = Number(hourly.precipitation_probability?.[currentIndex] ?? 0);
    const currentCode = Number(hourly.weathercode?.[currentIndex] ?? 0);
    const dress = getClothingAdvice(current?.temperature ?? 0, currentPop, currentCode);

    res.status(200).json({
      name,
      country,
      current: {
        temp: current?.temperature ?? 0,
        feels_like: Number(hourly.apparent_temperature?.[currentIndex] ?? 0),
        humidity: currentHumidity,
        wind_speed: Number(hourly.windspeed_10m?.[currentIndex] ?? 0),
        description: mapWeatherCode(currentCode),
        icon: weatherIcon(currentCode),
        pop: currentPop,
      },
      dressAdvice: dress.label,
      dressIcon: dress.icon,
      hourly: hourlyForecast,
      daily: dailyForecast,
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}