import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from './Auth/Logout';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
 


  return (
    <header className="flex justify-between items-center mb-6 px-4 py-2 bg-white shadow">
      <h1 className="text-2xl font-bold">Healthcare AI</h1>
      <div className="flex items-center space-x-6">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/upload" className="hover:underline">Upload Claim</Link>
        <Link to="/analytics" className="hover:underline">Analytics</Link>
        <Link to="/settings" className="hover:underline">Settings</Link>

        {/* Profile Pic */}
        {user?.profileImage && (
          <Link to="/profile">
            <img
              src={`http://localhost:5000/${user.profileImage}`}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-500"
            />
          </Link>
        )}

        {/* Logout Button */}
        <Logout />
      </div>
    </header>
  );
};

export default Navbar;
