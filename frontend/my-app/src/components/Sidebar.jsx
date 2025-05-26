import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <aside className="w-64 bg-white shadow-md p-4 h-screen sticky top-0">
    <div className="text-xl font-bold mb-10">LOGO</div>
    <nav className="space-y-4">
      <Link to="/dashboard" className="block p-2 bg-blue-100 rounded">Dashboard</Link>
      <Link to="/upload" className="block p-2 hover:bg-gray-100 rounded">Upload Claim</Link>
      <Link to="/analytics" className="block p-2 hover:bg-gray-100 rounded">Analytics</Link>
      <Link to="/settings" className="block p-2 hover:bg-gray-100 rounded">Settings</Link>
    </nav>
  </aside>
);

export default Sidebar;
