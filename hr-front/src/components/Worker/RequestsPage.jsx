import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [newRequest, setNewRequest] = useState({ dates_from: '', dates_to: '', leave_type: 'vacation' });
  const [editingRequest, setEditingRequest] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchRequests();
  }, []);

  //vraca radnikove prethodne zahteve za odsustvo
  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/requests', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      setRequests(res.data.data);
    } catch (err) {
      console.error('Greška pri dohvatanju zahteva:', err);
    }
  };

  //slanje novog zahteva za odsustvo
  const handleCreate = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/requests', newRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      setNewRequest({ dates_from: '', dates_to: '', leave_type: 'vacation' });
      fetchRequests();
    } catch (err) {
      alert('Greška pri kreiranju zahteva.');
    }
  };

  //azuriranje zaheva
  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/requests/${editingRequest.id}`, editingRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      setEditModal(false);
      alert("Uspesno azuriran zahtev za odsustvo.");
      fetchRequests();
    } catch (err) {
      alert('Greška pri izmeni.');
    }
  };

  //brisanje zahteva
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/requests/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      alert("Uspesno obrisan zahtev za odsustvo.");
      fetchRequests();
    } catch (err) {
      alert('Greška pri brisanju.');
    }
  };

  return (
    <div className="requests-container">
      <h1>Moji Zahtevi za Odsustvo</h1>
      <h4>Novi Zahtev</h4>
      <p> * Možete poslati zahtev samo za buduće datume. Datum „do“ može biti isti ili posle datuma „od“. </p>
      <div className="requests-controls">
        <input
          type="date"
          value={newRequest.dates_from}
          onChange={(e) => setNewRequest({ ...newRequest, dates_from: e.target.value })}
        />
        <input
          type="date"
          value={newRequest.dates_to}
          onChange={(e) => setNewRequest({ ...newRequest, dates_to: e.target.value })}
        />
        <select
          value={newRequest.leave_type}
          onChange={(e) => setNewRequest({ ...newRequest, leave_type: e.target.value })}
        >
          <option value="vacation">Godišnji Odmor</option>
          <option value="sick">Bolovanje</option>
          <option value="other">Drugo</option>
        </select>
        <button onClick={handleCreate}>Pošalji Zahtev</button>
      </div>

      <table className="requests-table">
        <thead>
          <tr>
            <th>Odsustvo</th>
            <th>Od</th>
            <th>Do</th>
            <th>Status</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.leave_type}</td>
              <td>{req.dates_from}</td>
              <td>{req.dates_to}</td>
              <td className={`status ${req.status}`}>{req.status}</td>
              <td>
                {req.status === 'sent' && (
                  <>
                    <button onClick={() => { setEditingRequest(req); setEditModal(true); }}>Izmeni</button>
                    <button onClick={() => handleDelete(req.id)}>Obriši</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal za izmenu */}
      {editModal && editingRequest && (
        <div className="modal-overlay" onClick={() => setEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Izmeni Zahtev</h3>
            <input
              type="date"
              value={editingRequest.dates_from}
              onChange={(e) => setEditingRequest({ ...editingRequest, dates_from: e.target.value })}
            />
            <input
              type="date"
              value={editingRequest.dates_to}
              onChange={(e) => setEditingRequest({ ...editingRequest, dates_to: e.target.value })}
            />
            <select
              value={editingRequest.leave_type}
              onChange={(e) => setEditingRequest({ ...editingRequest, leave_type: e.target.value })}
            >
              <option value="vacation">Godišnji Odmor</option>
              <option value="sick">Bolovanje</option>
              <option value="other">Drugo</option>
            </select>
            <button onClick={handleUpdate}>Sačuvaj Izmene</button>
            <button onClick={() => setEditModal(false)}>Otkaži</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsPage;