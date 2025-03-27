import React from 'react';
import './App.css';

function App() {
  return (
    <div className="container">
      <h1>Dobrodošla u HR Aplikaciju</h1>
      <h2 className="section-title">Pregled tima i aktivnosti</h2>

      <div className="flex">
        <div className="card">
          <h3>Broj zaposlenih</h3>
          <p>25</p>
        </div>
        <div className="card">
          <h3>Aktivni projekti</h3>
          <p>6</p>
        </div>
        <div className="card">
          <h3>Zahtevi za odsustvo</h3>
          <p>3 na čekanju</p>
        </div>
      </div>

      <div >
        <h4>Kreiraj novi zahtev za odsustvo</h4>
        <button>+ Novi zahtev</button>
      </div>
    </div>
  );
}

export default App;
