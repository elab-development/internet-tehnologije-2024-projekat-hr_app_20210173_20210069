import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from '../Reusable/Footer';

const HrRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [sortByDate, setSortByDate] = useState('asc');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusModal, setStatusModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const token = sessionStorage.getItem('token');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/all-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      setRequests(res.data.data);
    } catch (err) {
      console.error('Greška:', err);
    }
  };

  const handleSort = () => {
    const sorted = [...requests].sort((a, b) => {
      return sortByDate === 'asc'
        ? new Date(a.dates_from) - new Date(b.dates_from)
        : new Date(b.dates_from) - new Date(a.dates_from);
    });
    setRequests(sorted);
    setSortByDate(sortByDate === 'asc' ? 'desc' : 'asc');
  };

  const handleStatusChange = async () => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/requests/${selectedRequest.id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      setStatusModal(false);
      fetchRequests();
    } catch (error) {
      alert('Greška prilikom izmene statusa.');
    }
  };

  const filteredRequests = requests.filter((req) =>
    req.user_name.toLowerCase().includes(search.toLowerCase())
  );

   //broj zahteva po stranici tabele - 5
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 5;
 
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
 
   //ukupan br stranica zaokruzujemo na veci broj
   const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
 
   //fja za menjanje stranice
   const goToPage = (pageNum) => setCurrentPage(pageNum);

  return (
    <>
    <div className="requests-container">
      <h1>Upravljanje Odsustvima</h1>

      <div className="requests-controls">
        <input
          type="text"
          placeholder="Pretraži po imenu korisnika..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSort}>Sortiraj po datumu ({sortByDate === 'asc' ? '↑' : '↓'})</button>
      </div>

      <table className="requests-table">
        <thead>
          <tr>
            <th>Zaposleni</th>
            <th>Odsustvo</th>
            <th>Od</th>
            <th>Do</th>
            <th>Status</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
        {currentItems.map((req) => (
            <tr key={req.id}>
                <td>{req.user_name}</td>
                <td>{req.leave_type}</td>
                <td>{req.dates_from}</td>
                <td>{req.dates_to}</td>
                <td className={`status ${req.status}`}>{req.status}</td>
                <td>
                <button onClick={() => { setSelectedRequest(req); setDetailsModal(true); }}>Detalji</button>
                {req.status === 'sent' && (
                    <button onClick={() => { setSelectedRequest(req); setStatusModal(true); }}>Izmeni</button>
                )}
                </td>
            </tr>
            ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
            <button
            key={i + 1}
            className={currentPage === i + 1 ? 'active-page' : ''}
            onClick={() => goToPage(i + 1)}
            >
            {i + 1}
            </button>
        ))}
        </div>

      {/* Modal za detalje */}
      {detailsModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setDetailsModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Detalji Zahteva</h3>
            <p><strong>Zaposleni:</strong> {selectedRequest.user_name}</p>
            <p><strong>Tip Odsustva:</strong> {selectedRequest.leave_type}</p>
            <p><strong>Period:</strong> {selectedRequest.dates_from} - {selectedRequest.dates_to}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            <button onClick={() => setDetailsModal(false)}>Zatvori</button>
          </div>
        </div>
      )}

      {/* Modal za izmenu statusa */}
      {statusModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setStatusModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Izmeni Status</h3>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="">-- Izaberi status --</option>
              <option value="accepted">Prihvati</option>
              <option value="declined">Odbij</option>
            </select>
            <button onClick={handleStatusChange}>Sačuvaj</button>
            <button onClick={() => setStatusModal(false)}>Otkaži</button>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default HrRequestsPage;
