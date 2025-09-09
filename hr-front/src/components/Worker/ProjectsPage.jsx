// src/components/ProjectsPage.jsx
import React, { useEffect, useState } from 'react';
import Footer from '../Reusable/Footer';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function ProjectsPage() {
  const token = sessionStorage.getItem('token');
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  };

  const [projects, setProjects] = useState([]);
  const [search,   setSearch]   = useState('');
  const [error,    setError]    = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/employee-projects`, { headers: authHeaders })
      .then(r => {
        if (!r.ok) throw new Error(`(${r.status})`);
        return r.json();
      })
      .then(json => setProjects(Array.isArray(json) ? json : json.data ?? []))
      .catch(err => setError('Ne možete videti svoje projekte: ' + err.message));
  }, [token]);

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="hrp-page">
      <h1 style={{ textAlign: 'center', marginBottom: '1rem', color: '#762577' }}>
        Moji projekti
      </h1>

      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div style={{ margin: '0 70px 1.5rem', textAlign: 'right' }}>
        <input
          type="text"
          placeholder="Pretraga projekata…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: '6px 10px',
            width: '200px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      <div style={{ margin: '0 70px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead style={{ background: '#f3f4f6' }}>
            <tr>
              <th style={{ width: '10%', padding: '8px', textAlign: 'left' }}>ID</th>
              <th style={{ width: '25%', padding: '8px', textAlign: 'left' }}>Naziv</th>
              <th style={{ width: '35%', padding: '8px', textAlign: 'left' }}>Opis</th>
              <th style={{ width: '15%', padding: '8px', textAlign: 'left' }}>Početak</th>
              <th style={{ width: '15%', padding: '8px', textAlign: 'left' }}>Završetak</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>{p.id}</td>
                <td style={{ padding: '8px' }}>{p.name}</td>
                <td style={{ padding: '8px' }}>{p.description}</td>
                <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>{p.start_date}</td>
                <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>{p.end_date}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                  Nema projekata koji odgovaraju pretrazi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
}
