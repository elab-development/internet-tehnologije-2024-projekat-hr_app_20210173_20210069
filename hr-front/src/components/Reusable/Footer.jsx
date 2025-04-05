import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

const routeTitles = {
  '/home': 'Početna',
  '/requests': 'Moji Zahtevi',
  '/attendance': 'Prisustvo',
  '/projects': 'Moji Projekti',
  '/hr-home': 'HR Početna',
  '/manage-requests': 'Upravljanje Odsustvima',
  '/projects-employees': 'Projekti i Zaposleni',
};

const Footer = () => {
  const location = useLocation();
  const path = location.pathname;

  const user = JSON.parse(sessionStorage.getItem('user'));
  const isHr = user?.user_role === 'hr worker';

  const basePath = isHr ? '/hr-home' : '/home';
  const baseLabel = isHr ? 'HR Početna' : 'Početna';

  const currentTitle = routeTitles[path] || 'Nepoznata stranica';

  return (
    <footer className="footer">
      <div className="footer-left">
        <img src="/images/logo.png" alt="TeamTrack Logo" className="footer-logo" />
        <p>&copy; {new Date().getFullYear()} TeamTrack HR • Sva prava zadržana.</p>
      </div>

      <div className="footer-center">
        <strong>Putanja:</strong>{' '}
        <Link to={basePath}>{baseLabel}</Link>
        {path !== basePath && (
          <>
            {' / '}
            <span>{currentTitle}</span>
          </>
        )}
      </div>

      <div className="footer-right">
        <p> Verzija: 1.0   Made with <FaHeart color="purple" /> by TeamTrack </p>
      </div>
    </footer>
  );
};

export default Footer;

