import React from 'react';
import useWeather from '../../hooks/useWeather';

const Home = () => {
  const weather = useWeather(); 

  return (
    <div className="home">
        <div className="home-section">
          <h1>Dobrodošli!</h1>
          <p>Vaš radni kutak za upravljanje zahtevima, prisustvom i projektima.</p>
          <img src='images/home.png' alt="hero" className="home-image" />
        </div>

        <div className="home-section">
          <h1>Trenutna vremenska prognoza</h1>
          {weather && (
            <div className="weather-card">
              <img 
                src={`/weather-icons/${weather.icon}`} 
                alt={weather.description} 
                className='weather-icon-image'
              /> 
              <div className='weather-stats'>
                <div className="weather-info">
                    <h5>Vreme:</h5>
                    <p>{weather.description}</p>
                  </div>
                  <div className="weather-info">
                    <h5>Temperatura:</h5>
                    <p>{weather.temperature}°C</p>
                  </div>
                  <div className="weather-info">
                    <h5>Osećaj u vazduhu:</h5>
                    <p>{weather.apparent}°C</p>
                  </div>
                  <div className="weather-info">
                    <h5>Brzina vetra:</h5>
                    <p>{weather.wind} km/h</p>
                  </div>
                  <div className="weather-info">
                    <h5>Vlažnost:</h5>
                    <p>{weather.humidity}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      
    </div>
  );
};

export default Home;
