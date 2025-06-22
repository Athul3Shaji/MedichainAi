import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import axios from 'axios'

const ClaimDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const claim = state?.claim;

  const [aiData, setAiData] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState('');
  const [showFile, setShowFile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

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

  const fileUrl = claim?.file;

  const getFullFileUrl = (relativePath) => {
    return `${import.meta.env.VITE_API_BASE_URL || ''}/${relativePath}`;
  };

  const handleChatSend = async () => {
    if (claim.claimStatus !== 'approved') return;

    if (!chatInput.trim()) return;

    const userQuestion = chatInput.trim();

    setChatMessages(prev => [...prev, { sender: 'user', text: userQuestion }]);
    setChatInput('');

    try {
      const response = await axios.post('http://localhost:8000/doc_qa/', {
        context: aiData.response.text_summarize,
        questions: [userQuestion]
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
      const data = response.data;
      console.log(data); // Check your response format here


      if (Array.isArray(data) && data.length > 0) {
        const { answer, confidence } = data[0];
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `${answer}`,
          },
        ]);
      } else {
        setChatMessages(prev => [
          ...prev,
          { sender: 'ai', text: "Sorry, I couldn't find an answer." },
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'An error occurred while fetching the response.' },
      ]);
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
      <main className="flex-1 p-6 overflow-auto relative">
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
              className={`px-4 py-2 ${
                claim.claimStatus === 'processing' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } text-white rounded`}
              disabled={loadingAI || claim.claimStatus === 'processing'}
            >
              {loadingAI ? 'Fetching AI Data...' : 'Show AI Analysis'}
            </button>
            <button
              onClick={() => setShowFile(prev => !prev)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
            >
              {showFile ? 'Hide Uploaded File' : 'View Uploaded File'}
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

          {showFile && fileUrl && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-green-800">Uploaded File Preview</h2>
              {fileUrl.endsWith('.pdf') ? (
                <iframe
                  src={getFullFileUrl(fileUrl)}
                  title="Uploaded PDF"
                  className="w-full h-96 border rounded"
                ></iframe>
              ) : (
                <img
                  src={getFullFileUrl(fileUrl)}
                  alt="Uploaded Claim"
                  className="max-w-full h-auto rounded shadow border"
                />
              )}
            </div>
          )}
        </div>

        {/* Chat Help Button */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        >
          {showChat ? 'Close Chat' : 'Chat Help'}
        </button>

        {/* Chat Box */}
        {showChat && (
          <div className="fixed bottom-20 right-4 z-50 w-80 bg-white border rounded shadow-lg p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-2">QA Chat</h2>

            <div className="flex-1 overflow-y-auto border p-2 rounded text-sm mb-2 bg-gray-50 h-48">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${msg.sender === 'user' ? 'text-right text-blue-700' : 'text-left text-gray-800'}`}
                >
                  <div className="inline-block p-2 rounded bg-white border shadow-sm">
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            {claim.claimStatus !== 'approved' ? (
      <p className="text-red-600 text-sm text-center">
        Chat is only available when the claim is <strong>to be approved</strong>.
      </p>
    ) : (
      <div className="flex gap-2">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
          placeholder="Type your question..."
          className="flex-1 border rounded p-2 text-sm"
        />
        <button
          onClick={handleChatSend}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Send
        </button>
      </div>
    )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClaimDetails;
