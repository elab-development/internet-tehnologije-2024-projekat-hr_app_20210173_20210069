import { useEffect, useState } from 'react';
import axios from 'axios';


//kodovi za vreme, da bismo znali koju sliku da vratimo iz public foldera
const weatherCodes = {
  0: { description: 'Sunčano', icon: '01d.png' },
  1: { description: 'Delimično suncano', icon: '02d.png' },
  2: { description: 'Oblačno', icon: '03d.png' },
  3: { description: 'Zatamnjeno', icon: '04d.png' },
  45: { description: 'Magla', icon: '04d.png' },
  51: { description: 'Slaba kiša', icon: '09d.png' },
  61: { description: 'Kiša', icon: '09d.png' },
  71: { description: 'Sneg', icon: '13d.png' },
  80: { description: 'Pljuskovi', icon: '09d.png' }
};

const useWeather = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    //koordinate u beogradu
    const latitude = 44.7866;
    const longitude = 20.4489;

    //dohvatanje podataka o vremenu sa javnog apija - prosledjujemo koordinate, i sta nam sve treba
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`
        );

        const data = res.data.current;
        const code = data.weather_code;

        setWeather({
          temperature: data.temperature_2m,
          apparent: data.apparent_temperature,
          wind: data.wind_speed_10m,
          humidity: data.relative_humidity_2m,
          code,
          description: weatherCodes[code]?.description || 'Nepoznato',
          icon: weatherCodes[code]?.icon || 'unknown.png',
        });
      } catch (err) {
        console.error('Greška prilikom dohvatanja vremenske prognoze:', err);
      }
    };

    fetchWeather();
  }, []);

  return weather;
};

export default useWeather;
