import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';

const Dashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

const handleRowClick = (claim) => {
  navigate(`/claim/${claim._id}`, { state: { claim } });
};

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'started': return 'bg-yellow-100 text-yellow-800';
      default: return '';
    }
  };

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await api.get('/claims');
        console.log(response.data.data)
        setClaims(response.data.data);
        console.log(claims)
      } catch (err) {
        console.error(err);
        setError('Failed to fetch claims');
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Navbar />

        <section className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <div>Total Claims</div>
            <div className="text-2xl font-bold">{claims.length}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div>Fraud Detection</div>
            <div className="text-2xl font-bold">7%</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <div>Average Risk Score</div>
            <div className="text-2xl font-bold">45</div>
          </div>
        </section>

        <section className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Claims</h2>

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2">ID</th>
                  <th>Name</th>
                  <th>Hospital</th>
                  <th>Phone Number</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim, index) => (
                  <tr
                  key={claim._id || index}
                  className="border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRowClick(claim)}
                >
                    <td className="py-2">{index + 1}</td>
                    <td>{claim.name}</td>
                    <td>{claim.hospital}</td>
                    <td>{claim.phoneNumber}</td>
                    <td>{new Date(claim.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`px-2 py-1 text-sm rounded ${getStatusClass(claim.claimStatus)}`}>
                        {claim.claimStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
