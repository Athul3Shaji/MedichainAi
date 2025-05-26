import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const claims = [
    { id: 1, claimId: '123456', hospital: 'General Hospital', date: '2024-05-01', amount: '$1,200', status: 'Pending' },
    { id: 2, claimId: '123457', hospital: 'City Clinic', date: '2024-04-28', amount: '$450', status: 'Approved' },
    { id: 3, claimId: '123458', hospital: 'Health Center', date: '2024-04-25', amount: '$3,100', status: 'Rejected' },
    { id: 4, claimId: '123459', hospital: 'Medical Plaza', date: '2024-04-20', amount: '$900', status: 'Pending' },
    { id: 5, claimId: '123450', hospital: 'General Hospital', date: '2024-04-18', amount: '$700', status: 'Approved' },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return '';
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Navbar />
        <section className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <div>Total Claims</div>
            <div className="text-2xl font-bold">320</div>
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
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">ID</th>
                <th>Claim ID</th>
                <th>Hospital</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => (
                <tr key={claim.id} className="border-b">
                  <td className="py-2">{claim.id}</td>
                  <td>{claim.claimId}</td>
                  <td>{claim.hospital}</td>
                  <td>{claim.date}</td>
                  <td>{claim.amount}</td>
                  <td>
                    <span className={`px-2 py-1 text-sm rounded ${getStatusClass(claim.status)}`}>
                      {claim.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
