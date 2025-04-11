import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Mic, LogIn, LogOut, User, Cloud as CloudIcon, Loader2 } from 'lucide-react';
interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  sys: {
    country: string;
  };
  wind: {
    speed: number;
  };
}

interface UserData {
  username: string;
  password: string;
}

const API_KEY = '3be03e6660fe9451d7a0d41ada9f82d5'; // Consider using environment variables

// const API_KEY = process.env.API_KEY; // Fallback for local testing

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return <Sun className="w-12 h-12 text-yellow-400" />;
    case 'rain':
      return <CloudRain className="w-12 h-12 text-blue-400" />;
    case 'snow':
      return <CloudSnow className="w-12 h-12 text-blue-200" />;
    case 'thunderstorm':
      return <CloudLightning className="w-12 h-12 text-purple-400" />;
    case 'clouds':
      return <Cloud className="w-12 h-12 text-gray-300" />;
    default:
      return <CloudIcon className="w-12 h-12 text-gray-400" />;
  }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchCity, setSearchCity] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check login status on mount
  useEffect(() => {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
      setIsLoggedIn(true);
      setUsername(loggedInUser);
      
      const savedCity = localStorage.getItem('savedCity');
      if (savedCity) {
        setSearchCity(savedCity);
        fetchWeatherData(savedCity);
      } else {
        getCurrentLocation();
      }
    }
  }, []);

  const fetchWeatherData = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'City not found' : 'Failed to fetch weather data');
      }

      const data: WeatherData = await response.json();
      setWeatherData(data);
      localStorage.setItem('savedCity', location);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${API_KEY}`
            );
            const data = await response.json();
            setWeatherData(data);
          } catch (error) {
            console.error('Error fetching weather data:', error);
            setError('Failed to get weather for your location');
            fetchWeatherData('London'); // Fallback
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Location access denied. Using default location.');
          fetchWeatherData('London'); // Fallback
        }
      );
    } else {
      setError('Geolocation not supported. Using default location.');
      fetchWeatherData('London'); // Fallback
    }
  }, [fetchWeatherData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: UserData) => u.username === username && u.password === password);
      
      if (user) {
        sessionStorage.setItem('loggedInUser', username);
        setIsLoggedIn(true);
        getCurrentLocation();
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!username.trim() || !password.trim()) {
        setError('Username and password are required');
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.some((u: UserData) => u.username === username)) {
        setError('Username already exists');
        return;
      }

      users.push({ username, password });
      localStorage.setItem('users', JSON.stringify(users));
      sessionStorage.setItem('loggedInUser', username);
      setIsLoggedIn(true);
      getCurrentLocation();
    } catch (err) {
      setError('Signup failed. Please try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setWeatherData(null);
    setError(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeatherData(searchCity);
    }
  };

  const speakWeather = () => {
    if (!weatherData) return;

    const speech = new SpeechSynthesisUtterance(
      `The current temperature in ${weatherData.name} is ${Math.round(weatherData.main.temp)} degrees Celsius with ${weatherData.weather[0].description}.`
    );
    
    setIsSpeaking(true);
    speech.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(speech);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2069&auto=format&fit=crop')",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <header className="mb-12">
          <div className="flex justify-between items-center backdrop-blur-sm bg-white/10 p-6 rounded-lg shadow-2xl border border-white/20">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <CloudIcon className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Weather App
                </h1>
                <p className="text-sm text-blue-200">Real-time weather updates</p>
              </div>
            </div>
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="block text-sm text-blue-200">Welcome back,</span>
                  <span className="block font-semibold text-white">{username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500/80 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg border border-red-400/30"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <User className="w-5 h-5 text-blue-300" />
                <span className="text-blue-200">Please login or signup</span>
              </div>
            )}
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {!isLoggedIn ? (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Login Form */}
            <form onSubmit={handleLogin} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 text-white">Login</h2>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mb-4 px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-white/10 text-white placeholder-blue-200"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-4 px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-white/10 text-white placeholder-blue-200"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500/80 backdrop-blur-sm py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 border border-blue-400/30 text-white"
              >
                <LogIn className="w-4 h-4" />
                Login
              </button>
            </form>

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 text-white">Sign Up</h2>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mb-4 px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-white/10 text-white placeholder-blue-200"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-4 px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-white/10 text-white placeholder-blue-200"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-500/80 backdrop-blur-sm py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 border border-green-400/30 text-white"
              >
                <User className="w-4 h-4" />
                Sign Up
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-4">
              <input
                type="text"
                placeholder="Enter city name"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="flex-1 px-4 py-2 bg-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border border-white/10 backdrop-blur-sm text-white placeholder-blue-200"
                required
              />
              <button
                type="submit"
                className="bg-blue-500/80 backdrop-blur-sm px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors border border-blue-400/30 text-white flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : 'Search'}
              </button>
            </form>

            {/* Weather Display */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
              </div>
            ) : weatherData ? (
              <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm border border-white/20 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white">
                    {weatherData.name}, {weatherData.sys.country}
                  </h2>
                  <button
                    onClick={speakWeather}
                    disabled={isSpeaking}
                    className={`p-2 rounded-full ${
                      isSpeaking ? 'bg-blue-600' : 'bg-blue-500/80 hover:bg-blue-600'
                    } transition-colors backdrop-blur-sm border border-blue-400/30`}
                    aria-label="Speak weather information"
                  >
                    <Mic className="w-6 h-6 text-white" />
                  </button>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-5xl">
                    {getWeatherIcon(weatherData.weather[0].main)}
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-white">
                      {Math.round(weatherData.main.temp)}°C
                    </div>
                    <div className="text-xl text-blue-200 capitalize">
                      {weatherData.weather[0].description}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-blue-100">
                      <div>Feels like: {Math.round(weatherData.main.feels_like)}°C</div>
                      <div>Humidity: {weatherData.main.humidity}%</div>
                      <div>Wind: {weatherData.wind.speed} m/s</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 p-8 rounded-lg backdrop-blur-sm border border-white/20 shadow-xl text-center text-blue-200">
                No weather data available. Try searching for a city.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;