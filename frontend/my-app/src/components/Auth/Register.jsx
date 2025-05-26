import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (value) => {
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    if (!/[A-Z]/.test(value)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(value)) {
      setPasswordError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!/[0-9]/.test(value)) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    if (!/[!@#$%^&*]/.test(value)) {
      setPasswordError('Password must contain at least one special character (!@#$%^&*)');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validatePassword(password)) {
      console.log(username, email, password);
      try {
        const res = await api.post('/users/register', { username, email, password });
        console.log('Registration Success:', res.data);
        navigate('/login');
      } catch (error) {
        console.error('Registration Failed:', error.response?.data || error.message);
      }
      // Proceed with registration
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Panel */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white flex-col p-10">
          <h2 className="text-3xl font-bold mb-4">Welcome!</h2>
          <p className="text-sm text-center">Join us today by creating your account.</p>
        </div>

        {/* Right Panel */}
        <div className="p-10">
          <h3 className="text-xl font-semibold mb-2">Hello!</h3>
          <p className="text-sm text-purple-500 font-medium mb-6">Good Morning</p>
          <h4 className="text-lg font-bold mb-6">
            <span className="text-purple-600">Create</span> Your Account
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-b-2 focus:outline-none focus:border-blue-500 placeholder-gray-400 py-2"
                placeholder="john_doe"
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b-2 focus:outline-none focus:border-blue-500 placeholder-gray-400 py-2"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full border-b-2 focus:outline-none focus:border-blue-500 placeholder-gray-400 py-2 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}
              <div className="mt-2 text-xs text-gray-500">
                Password must contain:
                <ul className="list-disc list-inside">
                  <li className={password.length >= 8 ? "text-green-500" : ""}>At least 8 characters</li>
                  <li className={/[A-Z]/.test(password) ? "text-green-500" : ""}>One uppercase letter</li>
                  <li className={/[a-z]/.test(password) ? "text-green-500" : ""}>One lowercase letter</li>
                  <li className={/[0-9]/.test(password) ? "text-green-500" : ""}>One number</li>
                  <li className={/[!@#$%^&*]/.test(password) ? "text-green-500" : ""}>One special character (!@#$%^&*)</li>
                </ul>
              </div>
            </div>

            <button
              type="submit"   
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-md hover:opacity-90 transition"
            >
              CREATE ACCOUNT
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

