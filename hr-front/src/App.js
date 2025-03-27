import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './components/authentification/RegisterPage';
import './App.css'; 


function App() {
  return (
      <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
