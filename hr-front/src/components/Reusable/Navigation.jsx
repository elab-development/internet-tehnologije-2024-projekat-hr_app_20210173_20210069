// src/components/Navigation.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = ({ userData, setUserData }) => {
  const navigate = useNavigate();

  if (!userData || !userData.user || !userData.token) return null;
  const { user, token } = userData;

  const handleLogout = async () => {
    try {
      await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      setUserData({ user: null, token: null });
      navigate('/');
    } catch (error) {
      console.error('Greška pri odjavi:', error);
      alert('Došlo je do greške pri odjavi.');
    }
  };

  // Safely get name or fallback
  const userName = user?.name || '';
  const initials = userName
    ? userName
        .trim()
        .split(/\s+/)
        .map(n => n.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    : '';

  // Capitalize first letter of user_role
  const roleDisplay = user.user_role
    ? user.user_role.charAt(0).toUpperCase() + user.user_role.slice(1)
    : '';

  return (
    <div className="navbar">
      <div className="navbar-left">
        {user.user_role === 'worker' && (
          <>
            <Link to="/home">Početna</Link>
            <Link to="/projects">Projekti</Link>
            <Link to="/requests">Zahtevi</Link>
            <Link to="/attendance">Prisustvo</Link>
          </>
        )}
        {user.user_role === 'hr worker' && (
          <>
            <Link to="/hr-home">Početna</Link>
            <Link to="/projects-employees">Projekti i Zaposleni</Link>
            <Link to="/manage-requests">Upravljaj Zahtevima</Link>
          </>
        )}
      </div>

      <div
        className="navbar-right"
        style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
      >
        {/* Avatar with initials */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            color: '#762577',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: '600',
            fontSize: '1rem',
            textTransform: 'uppercase',
          }}
        >
          {initials || '??'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {/* User name */}
          <span style={{ color: '#fff', fontWeight: '500' }}>
            {userName || 'Nepoznati korisnik'}
          </span>
          {/* User role */}
          <span style={{ color: '#fff', fontSize: '0.8rem', opacity: 0.8 }}>
            {roleDisplay}
          </span>
        </div>
        {/* Logout button */}
        <button className="logout-button" onClick={handleLogout}>
          Odjava
        </button>
      </div>
    </div>
  );
};

export default Navigation;
