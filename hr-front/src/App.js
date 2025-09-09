import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './components/authentification/RegisterPage';
import LoginPage from './components/authentification/LoginPage';
import HrHome from './components/HrWorker/HrHome';
import Home from './components/Worker/Home';
import './App.css'; 
import Navigation from './components/Reusable/Navigation';
import HrRequestsPage from './components/HrWorker/HrRequestsPage';
import HrProjectsPage from './components/HrWorker/HrProjectsPage';
import AttendancePage from './components/Worker/AttendancePage';
import RequestsPage from './components/Worker/RequestsPage';
import ProjectsPage from './components/Worker/ProjectsPage';

function App() {
  //podaci koji je korisnik i token
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

  //provera da li je ulogovan i da li je hr
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
          path="/projects"
          element={isAuthenticated && !isHr ? <ProjectsPage /> : <Navigate to="/" />}
        />
        <Route
          path="/requests"
          element={isAuthenticated && !isHr ? <RequestsPage /> : <Navigate to="/" />}
        />
         <Route
          path="/attendance"
          element={isAuthenticated && !isHr ? <AttendancePage /> : <Navigate to="/" />}
        />

        <Route
          path="/hr-home"
          element={isAuthenticated && isHr ? <HrHome /> : <Navigate to="/" />}
        />
         <Route
          path="/projects-employees"
          element={isAuthenticated && isHr ? <HrProjectsPage/> : <Navigate to="/" />}
        />
         <Route
          path="/manage-requests"
          element={isAuthenticated && isHr ? <HrRequestsPage /> : <Navigate to="/" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>

  );
}



export default App;

