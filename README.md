# Weather Application

A modern weather application built with React, TypeScript, and Vite that provides real-time weather information, user authentication, and voice weather reading capabilities.

## Features

- Real-time weather information
- User authentication (Login/Signup)
- City search functionality
- Voice weather reading
- Location-based weather using geolocation
- Responsive and modern UI
- Weather icons and animations

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Getting Started

1. **Create the Project**
   ```bash
   npm create vite@latest weather-app -- --template react-ts
   cd weather-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Install Additional Dependencies**
   ```bash
   npm install @lucide/react tailwindcss postcss autoprefixer
   ```

4. **Set Up Environment Variables**
   Create a `.env` file in the root directory and add your OpenWeatherMap API key:
   ```
   VITE_API_KEY=your_openweathermap_api_key
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:5173`

## Project Structure

```
weather-app/
├── public/
│   └── ...
├── src/
│   ├── components/
│   ├── App.tsx
│   ├── main.tsx
│   ├── vite-env.d.ts
│   └── ...
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Key Dependencies

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (for icons)
- OpenWeatherMap API

## Development Steps

1. **Set Up Basic Project Structure**
   - Create Vite project with React + TypeScript template
   - Install necessary dependencies
   - Set up Tailwind CSS

2. **Implement User Authentication**
   - Create login/signup forms
   - Implement local storage for user data
   - Add session management

3. **Weather Data Integration**
   - Set up OpenWeatherMap API integration
   - Create weather data fetching functions
   - Implement error handling

4. **UI Development**
   - Create responsive layouts
   - Add weather icons and animations
   - Implement search functionality
   - Add voice reading feature

5. **Testing and Deployment**
   - Test all features
   - Optimize performance
   - Deploy to hosting service

## API Integration

The application uses the OpenWeatherMap API. To get an API key:
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your API key from the dashboard
3. Add it to your `.env` file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email [sahilrodies000@gmail.com] or open an issue in the repository. 