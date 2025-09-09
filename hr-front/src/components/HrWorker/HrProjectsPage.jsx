// src/components/HrProjectsPage.jsx
import React, { useEffect, useState } from 'react';
import Footer from '../Reusable/Footer';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function HrProjectsPage() {
  const token = sessionStorage.getItem('token');
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  const [projects, setProjects]       = useState([]);
  const [employees, setEmployees]     = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selProj, setSelProj] = useState(null);
  const [selEmp,  setSelEmp]  = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [showModal,  setShowModal]  = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editDate,   setEditDate]   = useState('');

  // Helper to reload pivot table
  const fetchAssignments = () => {
    fetch(`${API_BASE}/all-employee-projects`, { headers: authHeaders })
      .then(r => r.json())
      .then(json => setAssignments(Array.isArray(json) ? json : json.data ?? []))
      .catch(console.error);
  };

  useEffect(() => {
    fetch(`${API_BASE}/projects`, { headers: authHeaders })
      .then(r => r.json())
      .then(json => setProjects(Array.isArray(json) ? json : json.data ?? []))
      .catch(console.error);

    fetch(`${API_BASE}/users`, { headers: authHeaders })
      .then(r => r.json())
      .then(json =>
        setEmployees(
          (Array.isArray(json) ? json : json.data ?? []).filter(u => u.user_role !== 'hr worker')
        )
      )
      .catch(console.error);

    fetchAssignments();
  }, [token]);

  const assign = async () => {
    if (!selProj || !selEmp) {
      alert('Molimo izaberite projekat i zaposlenog.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/employee-projects/assign`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ project_id: selProj, user_id: selEmp })
      });
      if (!res.ok) throw new Error();
      await fetchAssignments();
      alert('Uspešno dodeljeno!');
      setSelProj(null);
      setSelEmp(null);
    } catch {
      alert('Greška prilikom dodele.');
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async id => {
    if (!window.confirm('Obrisati ovo angažovanje?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/employee-projects/${id}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      if (!res.ok) throw new Error();
      await fetchAssignments();
      alert('Angažovanje obrisano.');
    } catch {
      alert('Greška pri brisanju.');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = () => {
    if (!selProj) {
      alert('Odaberite projekat za izmenu.');
      return;
    }
    const p = projects.find(x => x.id === selProj);
    setEditStatus(p.status || 'active');
    setEditDate(p.start_date || '');
    setShowModal(true);
  };

  const saveEdit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/projects/${selProj}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status: editStatus, start_date: editDate })
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setProjects(projects.map(p => p.id === selProj ? updated : p));
      setShowModal(false);
      alert('Podaci projekta su izmenjeni.');
      fetchAssignments();
    } catch {
      alert('Greška pri čuvanju izmena.');
    } finally {
      setLoading(false);
    }
  };

  const exportCsv = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/employee-projects/export`, {
        method: 'GET',
        headers: authHeaders
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'employee_projects.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      alert('Greška pri eksportu CSV.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hrp-page">
      <h1 style={{ textAlign: 'center', margin: '20px 0', color: '#762577' }}>
        Menadžment Angažovanja Zaposlenih
      </h1>

      <div
        className="hrp-button-bar"
        style={{ margin: '0 70px 20px', display: 'flex', gap: '10px' }}
      >
        <button
          className="hrp-assign-btn"
          onClick={assign}
          disabled={loading}
        >
          {loading ? 'Dodeljivanje…' : 'Dodeli zaposlenog'}
        </button>
        <button
          className="hrp-assign-btn"
          onClick={openEdit}
          disabled={!selProj}
          style={{ background: '#DD88CF' }}
        >
          Izmeni podatke projekta
        </button>
        <button
          className="hrp-assign-btn"
          onClick={exportCsv}
          disabled={loading}
          style={{ background: '#34D399' }}
        >
          {loading ? '...' : 'Eksport CSV'}
        </button>
      </div>

      <div
        className="hrp-double-table-container"
        style={{ margin: '0 70px', display: 'flex', gap: '1rem' }}
      >
        {/* Projekti */}
        <div className="hrp-table-container" style={{ flex: 2 }}>
          <h2>Projekti</h2>
          <div className="hrp-table-wrapper" style={{ overflowX: 'auto' }}>
            <table className="hrp-select-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th></th><th>ID</th><th>Naziv</th><th>Opis</th>
                  <th style={{ width: '120px' }}>Datum početka</th>
                  <th style={{ width: '120px' }}>Datum završetka</th>
                  <th style={{ width: '100px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id}>
                    <td style={{ textAlign: 'center', width: '40px' }}>
                      <input
                        type="radio"
                        name="selectProject"
                        checked={selProj === p.id}
                        onChange={() => setSelProj(p.id)}
                      />
                    </td>
                    <td style={{ width: '50px' }}>{p.id}</td>
                    <td style={{ minWidth: '120px' }}>{p.name}</td>
                    <td>{p.description}</td>
                    <td>{p.start_date}</td>
                    <td>{p.end_date}</td>
                    <td style={{ padding: '8px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        backgroundColor: p.status === 'active' ? '#d1fae5' : '#fee2e2',
                        color: p.status === 'active' ? '#065f46' : '#b91c1c',
                        fontWeight: '500'
                      }}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Zaposleni */}
        <div className="hrp-table-container" style={{ flex: 1 }}>
          <h2>Zaposleni</h2>
          <div className="hrp-table-wrapper" style={{ overflowX: 'auto' }}>
            <table className="hrp-select-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th></th><th>ID</th><th>Ime</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(u => (
                  <tr key={u.id}>
                    <td style={{ textAlign: 'center', width: '40px' }}>
                      <input
                        type="radio"
                        name="selectEmployee"
                        checked={selEmp === u.id}
                        onChange={() => setSelEmp(u.id)}
                      />
                    </td>
                    <td style={{ width: '50px' }}>{u.id}</td>
                    <td>{u.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lista angažovanja */}
      <div style={{ margin: '30px 70px' }}>
        <h2>Lista angažovanja</h2>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              tableLayout: 'fixed'
            }}
          >
            <thead style={{ background: '#f3f4f6' }}>
              <tr>
                <th style={{ width: '8%', padding: '8px', textAlign: 'left' }}>ID</th>
                <th style={{ width: '26%', padding: '8px', textAlign: 'left' }}>Projekat</th>
                <th style={{ width: '26%', padding: '8px', textAlign: 'left' }}>Zaposleni</th>
                <th style={{ width: '25%', padding: '8px', textAlign: 'left' }}>Assigned At</th>
                <th style={{ width: '15%', padding: '8px', textAlign: 'center' }}>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => {
                const proj = projects.find(p => p.id === a.project_id);
                const emp  = employees.find(u => u.id === a.user_id);
                return (
                  <tr key={a.id}>
                    <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>{a.id}</td>
                    <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>{proj?.name || '—'}</td>
                    <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>{emp?.name || '—'}</td>
                    <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                      {new Date(a.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                      <button
                        onClick={() => deleteAssignment(a.id)}
                        disabled={loading}
                        style={{
                          padding: '4px 8px',
                          background: '#ef4444',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Obriši
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />

      {/* Edit Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
          }}
        >
          <div
            style={{
              background: '#fff', padding: '20px', borderRadius: '8px',
              minWidth: '320px', boxSizing: 'border-box'
            }}
          >
            <h3 style={{ marginBottom: '10px' }}>Izmena projekta</h3>
            <label>Status:</label>
            <select
              value={editStatus}
              onChange={e => setEditStatus(e.target.value)}
              style={{ width: '100%', marginBottom: '10px', padding: '6px' }}
            >
              <option value="active">active</option>
              <option value="cancelled">cancelled</option>
            </select>
            <label>Datum početka:</label>
            <input
              type="date"
              value={editDate}
              onChange={e => setEditDate(e.target.value)}
              style={{ width: '100%', marginBottom: '20px', padding: '6px' }}
            />
            <div style={{ textAlign: 'right', display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '6px 12px' }}>
                Otkaži
              </button>
              <button onClick={saveEdit} style={{ padding: '6px 12px' }}>
                Sačuvaj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
