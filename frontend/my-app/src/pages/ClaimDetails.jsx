import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const ClaimDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const claim = state?.claim;

  const [aiData, setAiData] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState('');

  const fetchAdditionalData = async () => {
    try {
      setLoadingAI(true);
      setErrorAI('');
      const res = await api.get(`/claims/${id}`);
      setAiData(res.data);
    } catch (err) {
      setErrorAI('Failed to fetch AI data.');
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  if (!claim) {
    return (
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Navbar />
          <div className="text-red-600 mt-4">No claim data found. Please go back to the dashboard.</div>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Back to Dashboard
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Navbar />

        <div className="bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Claim Details</h1>

          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div><strong>Name:</strong> {claim.name}</div>
            <div><strong>Hospital:</strong> {claim.hospital}</div>
            <div><strong>Phone Number:</strong> {claim.phoneNumber}</div>
            <div><strong>Date:</strong> {new Date(claim.date).toLocaleDateString()}</div>
            <div><strong>Status:</strong> {claim.claimStatus}</div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Go Back
            </button>
            <button
              onClick={fetchAdditionalData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              disabled={loadingAI}
            >
              {loadingAI ? 'Fetching AI Data...' : 'Show AI Analysis'}
            </button>
          </div>

          {errorAI && <p className="text-red-600 mt-4">{errorAI}</p>}

          {aiData && (
            <div className="mt-6 bg-blue-50 p-4 rounded border border-blue-200">
              <h2 className="text-xl font-semibold mb-2 text-blue-800">AI Analysis</h2>
              <div className="mb-2">
                <strong>Classification:</strong>{' '}
                <span className={`font-medium ${aiData.response.classify === 'Suspicious' ? 'text-red-600' : 'text-green-600'}`}>
                  {aiData.response.classify}
                </span>
              </div>
              <div className="mb-2">
                <strong>Summarized Text:</strong>
                <p className="bg-white p-2 rounded mt-1 text-sm border">{aiData.response.text_summarize}</p>
              </div>
              <div className="mb-2">
                <strong>Extracted Text:</strong>
                <p className="bg-white p-2 rounded mt-1 text-sm border whitespace-pre-line">
                  {aiData.response.text_extraction?.text?.text}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClaimDetails;
