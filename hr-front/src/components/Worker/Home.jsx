// src/components/Home.jsx
import React from 'react';
import useWeather from '../../hooks/useWeather';
import useGif     from '../../hooks/useGif';
import Footer     from '../Reusable/Footer';
import { FaHome } from 'react-icons/fa';

const Home = () => {
  const weather                  = useWeather();
  const { gifUrl, loading, error } = useGif();

  return (
    <div className="home-page">
      <h1><FaHome/> Početna <FaHome/></h1>

      {/* Prve dve kartice u redu */}
      <div className="home">
        <div className="home-section">
          <h1>Dobrodošli!</h1>
          <p>Vaš radni kutak za upravljanje zahtevima, prisustvom i projektima.</p>
          <img src="images/home.png" alt="hero" className="home-image" />
        </div>
        <div className="home-section">
          <h1>Trenutna vremenska prognoza</h1>
          {weather && (
            <div className="weather-card">
              <img
                src={`/weather-icons/${weather.icon}`}
                alt={weather.description}
                className="weather-icon-image"
              />
              <div className="weather-stats">
                <div className="weather-info">
                  <h5>Vreme:</h5>
                  <p>{weather.description}</p>
                </div>
                <div className="weather-info">
                  <h5>Temperatura:</h5>
                  <p>{weather.temperature}°C</p>
                </div>
                <div className="weather-info">
                  <h5>Osećaj:</h5>
                  <p>{weather.apparent}°C</p>
                </div>
                <div className="weather-info">
                  <h5>Vetar:</h5>
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

      {/* GIF dana ispod, ista širina kao home-section */}
      <div className="home" style={{ justifyContent: 'center' }}>
        <div className="home-section">
          <h1>GIF dana</h1>
          {loading && <p>Učitavanje GIF-a…</p>}
          {error   && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && gifUrl && (
            <img
              src={gifUrl}
              alt="Crazy worker GIF"
              style={{
                width: '500px',
                height: '400px',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
              }}
            />
          )}
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default Home;
