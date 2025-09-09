// src/components/AttendancePage.jsx
import React, { useEffect, useState } from 'react';
import Footer from '../Reusable/Footer';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function AttendancePage() {
  const token = sessionStorage.getItem('token');
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const [projects, setProjects]       = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [status, setStatus]           = useState('present');
  const [projectId, setProjectId]     = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [leaveType, setLeaveType]     = useState('sick');
  const [remarks, setRemarks]         = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  // load projects and attendance on mount
  useEffect(() => {
    fetch(`${API_BASE}/employee-projects`, { headers: authHeaders })
      .then(r => r.json())
      .then(json => setProjects(Array.isArray(json) ? json : json.data ?? []))
      .catch(err => console.error(err));

    fetchAttendances();
  }, [token]);

  const fetchAttendances = () => {
    fetch(`${API_BASE}/my-attendance`, { headers: authHeaders })
      .then(r => r.json())
      .then(json => setAttendances(Array.isArray(json) ? json : json.data ?? []))
      .catch(err => console.error(err));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!projectId) {
      alert('Izaberite projekat.');
      return;
    }
    if (status === 'present' && (hoursWorked === '' || isNaN(hoursWorked))) {
      alert('Unesite broj odrađenih sati.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = {
        project_id: projectId,
        status,
        hours_worked: status === 'present' ? parseInt(hoursWorked, 10) : null,
        leave_type: status !== 'present' ? leaveType : null,
        remarks,
      };
      const res = await fetch(`${API_BASE}/attendances`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Greška pri čuvanju.');
      // refresh list
      fetchAttendances();
      // reset form
      setProjectId('');
      setStatus('present');
      setHoursWorked('');
      setLeaveType('sick');
      setRemarks('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="attendance-page" style={{ padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem', color: '#762577' }}>
          Prisustvo
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            margin: '0 70px 2rem',
            padding: '1rem',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {error && (
            <div style={{ color: 'red', marginBottom: '0.5rem' }}>{error}</div>
          )}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label>Projekat:</label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                style={{ width: '100%', padding: '6px', marginTop: '4px' }}
              >
                <option value="">-- Izaberite --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: '1 1 150px' }}>
              <label>Status:</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                style={{ width: '100%', padding: '6px', marginTop: '4px' }}
              >
                <option value="present">present</option>
                <option value="absent">absent</option>
                <option value="on_leave">on_leave</option>
              </select>
            </div>

            {status === 'present' ? (
              <div style={{ flex: '1 1 100px' }}>
                <label>Sati:</label>
                <input
                  type="number"
                  min="0"
                  max="8"
                  value={hoursWorked}
                  onChange={e => setHoursWorked(e.target.value)}
                  style={{ width: '100%', padding: '6px', marginTop: '4px' }}
                />
              </div>
            ) : (
              <div style={{ flex: '1 1 150px' }}>
                <label>Tip odsustva:</label>
                <select
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value)}
                  style={{ width: '100%', padding: '6px', marginTop: '4px' }}
                >
                  <option value="sick">sick</option>
                  <option value="vacation">vacation</option>
                  <option value="other">other</option>
                </select>
              </div>
            )}

            <div style={{ flex: '2 1 100%' }}>
              <label>Beleške:</label>
              <textarea
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                rows="1"
                style={{ width: '100%', padding: '6px', marginTop: '4px' }}
              />
            </div>
          </div>

          <div style={{ textAlign: 'right', marginTop: '1rem' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '8px 16px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Čuvanje…' : 'Prijavi prisustvo'}
            </button>
          </div>
        </form>

        <div style={{ margin: '0 70px', overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              tableLayout: 'fixed'
            }}
          >
            <thead style={{ background: '#f3f4f6' }}>
              <tr>
                <th style={{ width: '10%', padding: '8px', textAlign: 'left' }}>#</th>
                <th style={{ width: '30%', padding: '8px', textAlign: 'left' }}>
                  Projekat
                </th>
                <th style={{ width: '15%', padding: '8px', textAlign: 'left' }}>
                  Datum
                </th>
                <th style={{ width: '15%', padding: '8px', textAlign: 'left' }}>
                  Status
                </th>
                <th style={{ width: '10%', padding: '8px', textAlign: 'left' }}>
                  Sati
                </th>
                <th style={{ width: '10%', padding: '8px', textAlign: 'left' }}>
                  Odsustvo
                </th>
                <th style={{ width: '20%', padding: '8px', textAlign: 'left' }}>
                  Beleške
                </th>
              </tr>
            </thead>
            <tbody>
              {attendances.map(a => (
                <tr key={a.id}>
                  <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>{a.id}</td>
                  <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                    {a.project.name}
                  </td>
                  <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                    {a.date}
                  </td>
                  <td style={{ padding: '8px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      backgroundColor:
                        a.status === 'present' ? '#d1fae5'
                        : a.status === 'absent' ? '#fee2e2'
                        : '#fef9c3',
                      color:
                        a.status === 'present' ? '#065f46'
                        : a.status === 'absent' ? '#b91c1c'
                        : '#92400e',
                      fontWeight: '500'
                    }}>
                      {a.status}
                    </span>
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    {a.hours_worked ?? '—'}
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    {a.leave_type ?? '—'}
                  </td>
                  <td style={{ padding: '8px' }}>{a.remarks}</td>
                </tr>
              ))}
              {attendances.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                    Još nema zabeleženog prisustva.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}
