import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // Replace the current history entry with login page
    // This prevents going back to protected routes after logout
    navigate('/login', { replace: true });
    
    // Clear any remaining history entries
    window.history.pushState(null, '', '/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition duration-300"
    >
      Logout
    </button>
  );
};

export default Logout; 