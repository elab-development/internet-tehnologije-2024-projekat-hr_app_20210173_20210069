// src/hooks/useGif.js
import { useState, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;  // iz .env
const TAG     = 'office funny';

export default function useGif() {
  const [gifUrl,     setGifUrl]     = useState('');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    async function fetchGif() {
      setLoading(true);
      setError(null);
      if (!API_KEY) {
        setError('GIF API ključ nije postavljen.');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `https://api.giphy.com/v1/gifs/random?api_key=${API_KEY}&tag=${encodeURIComponent(TAG)}`
        );
        if (!res.ok) throw new Error(`(${res.status})`);
        const json = await res.json();
        setGifUrl(json.data.images.fixed_width.url);
      } catch (err) {
        setError('Ne mogu da dohvatim GIF.');
      } finally {
        setLoading(false);
      }
    }
    fetchGif();
  }, []);

  return { gifUrl, loading, error };
}
