import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <header className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-bold">Healthcare AI</h1>
    <div className="flex items-center space-x-6">
      <Link to="/dashboard" className="hover:underline">Dashboard</Link>
      <Link to="/upload" className="hover:underline">Upload Claim</Link>
      <Link to="/analytics" className="hover:underline">Analytics</Link>
      <Link to="/settings" className="hover:underline">Settings</Link>

      {/* Profile Pic */}
      <Link to="/profile">
        <img
          src="https://i.pravatar.cc/40?img=12" // Replace with your avatar URL if needed
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-500"
        />
      </Link>
    </div>
  </header>
);

export default Navbar;
