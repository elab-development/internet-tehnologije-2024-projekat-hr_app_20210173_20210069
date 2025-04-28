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

      <div className="navbar-right">
        <button className="logout-button" onClick={handleLogout}>Odjava</button>
      </div>
    </div>
  );
};

export default Navigation;
