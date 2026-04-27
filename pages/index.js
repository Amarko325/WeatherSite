import { useState } from 'react';

const theme = {
  page: {
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: '#1f2937',
    background: 'linear-gradient(180deg, #89d4cf 0%, #6e45e2 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '680px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '28px',
    boxShadow: '0 30px 90px rgba(15, 23, 42, 0.18)',
    padding: '36px',
    backdropFilter: 'blur(18px)',
  },
  header: {
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  title: {
    margin: 0,
    fontSize: '2.1rem',
    letterSpacing: '-0.04em',
  },
  subtitle: {
    margin: '8px 0 0',
    color: '#475569',
  },
  form: {
    display: 'flex',
    gap: '12px',
    marginBottom: '22px',
    flexWrap: 'wrap',
  },
  input: {
    flex: '1 1 220px',
    minWidth: '0',
    padding: '14px 18px',
    borderRadius: '16px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  button: {
    padding: '14px 24px',
    borderRadius: '16px',
    border: 'none',
    background: '#4338ca',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'transform 0.2s ease, background 0.2s ease',
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  error: {
    color: '#dc2626',
    marginBottom: '16px',
    fontWeight: 600,
  },
  weatherCard: {
    marginTop: '20px',
    padding: '26px',
    background: '#eef2ff',
    borderRadius: '22px',
    border: '1px solid rgba(99, 102, 241, 0.18)',
  },
  weatherRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '12px',
    gap: '12px',
  },
  section: {
    marginTop: '24px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '14px',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1.2rem',
    fontWeight: 700,
  },
  adviceCard: {
    padding: '16px',
    borderRadius: '18px',
    background: '#eef2ff',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    marginTop: '18px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 14px',
    borderRadius: '14px',
    background: '#fff',
    border: '1px solid #c7d2fe',
    color: '#334155',
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  hourlyScroll: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    paddingBottom: '6px',
  },
  hourlyCard: {
    minWidth: '110px',
    padding: '16px',
    borderRadius: '18px',
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    flexShrink: 0,
  },
  dailyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '14px',
  },
  dailyCard: {
    padding: '18px',
    borderRadius: '18px',
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
  },
  label: {
    color: '#475569',
  },
  stat: {
    fontWeight: 700,
  },
};

const formatHour = (isoString) => new Date(isoString).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const formatDay = (isoString) => new Date(isoString).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name.');
      setWeather(null);
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to fetch weather');
      }
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={theme.page}>
      <div style={theme.card}>
        <header style={theme.header}>
          <div>
            <h1 style={theme.title}>Weather App</h1>
            <p style={theme.subtitle}>Search a city and see current weather, hourly forecast, and 7-day advice.</p>
          </div>
          <div style={{ fontSize: '2.2rem' }}>☁️</div>
        </header>

        <div style={theme.form}>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            style={theme.input}
          />
          <button
            onClick={fetchWeather}
            style={isLoading ? { ...theme.button, ...theme.buttonDisabled } : theme.button}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Get Weather'}
          </button>
        </div>

        {error && <p style={theme.error}>{error}</p>}

        {weather && (
          <>
            <div style={theme.weatherCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.9rem' }}>{weather.name}{weather.country ? `, ${weather.country}` : ''}</h2>
                  <p style={{ margin: '10px 0 0', color: '#475569' }}>{weather.current.icon} {weather.current.description}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '2.8rem', fontWeight: 700 }}>{weather.current.temp}°C</p>
                  <p style={{ margin: '8px 0 0', color: '#64748b' }}>Feels like {weather.current.feels_like}°C</p>
                </div>
              </div>

              <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
                <div style={theme.badge}>Humidity: {weather.current.humidity}%</div>
                <div style={theme.badge}>Wind: {weather.current.wind_speed} km/h</div>
                <div style={theme.badge}>Precip: {weather.current.pop}%</div>
              </div>

              <div style={theme.adviceCard}>
                <span style={theme.badge}>{weather.dressIcon} {weather.dressAdvice}</span>
              </div>
            </div>

            <section style={theme.section}>
              <div style={theme.sectionHeader}>
                <h3 style={theme.sectionTitle}>24-Hour Forecast</h3>
              </div>
              <div style={theme.hourlyScroll}>
                {weather.hourly.map((hour) => (
                  <div key={hour.time} style={theme.hourlyCard}>
                    <div style={{ fontWeight: 700, marginBottom: '10px' }}>{formatHour(hour.time)}</div>
                    <div style={{ fontSize: '1.3rem' }}>{hour.icon}</div>
                    <div style={{ marginTop: '10px', color: '#475569', fontSize: '0.92rem' }}>{hour.description}</div>
                    <div style={{ marginTop: '12px', ...theme.badge, padding: '10px 12px' }}>{hour.adviceIcon} {hour.advice}</div>
                    <div style={{ marginTop: '10px', fontWeight: 700 }}>{hour.temp}°C</div>
                  </div>
                ))}
              </div>
            </section>

            <section style={theme.section}>
              <div style={theme.sectionHeader}>
                <h3 style={theme.sectionTitle}>7-Day Forecast</h3>
              </div>
              <div style={theme.dailyGrid}>
                {weather.daily.map((day) => (
                  <div key={day.date} style={theme.dailyCard}>
                    <div style={{ fontWeight: 700 }}>{formatDay(day.date)}</div>
                    <div style={{ margin: '10px 0 0', color: '#475569' }}>{day.icon} {day.description}</div>
                    <div style={{ marginTop: '10px' }}>High {day.maxTemp}° | Low {day.minTemp}°</div>
                    <div style={{ marginTop: '8px', ...theme.badge, padding: '10px 12px' }}>{day.adviceIcon} {day.advice}</div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
