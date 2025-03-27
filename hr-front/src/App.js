import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './components/authentification/RegisterPage';
import LoginPage from './components/authentification/LoginPage';
import HrHome from './components/HrWorker/HrHome';
import Home from './components/Worker/Home';
import './App.css'; 
import Navigation from './components/Reusable/Navigation';

function App() {
  const [userData, setUserData] = useState({ user: null, token: null });
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');
    if (storedUser && storedToken) {
      setUserData({ user: JSON.parse(storedUser), token: storedToken });
    }
    setLoading(false); 
  }, []);

  const isAuthenticated = !!userData.user;
  const isHr = userData.user?.user_role === 'hr worker';

  return (
    <Router>
      {!loading && <Navigation userData={userData} setUserData={setUserData} />}

      <Routes>
        <Route path="/" element={<LoginPage setUser={setUserData} />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/home"
          element={isAuthenticated && !isHr ? <Home /> : <Navigate to="/" />}
        />

        <Route
          path="/hr-home"
          element={isAuthenticated && isHr ? <HrHome /> : <Navigate to="/" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}



export default App;

