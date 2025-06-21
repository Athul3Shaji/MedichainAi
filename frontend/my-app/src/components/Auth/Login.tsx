import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Location } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../services/api';
import { setLoading, setUser, setToken, setError } from '../../store/slices/authSlice';

interface LocationState {
  from?: {
    pathname: string;
  };
}

interface RootState {
  auth: {
    loading: boolean;
    error: string | null;
  };
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation() as Location<LocationState>;
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const res = await api.post('/users/login', { email, password }, { withCredentials: true });
      
      if (res.data.token) {
        dispatch(setToken(res.data.token));
        dispatch(setUser(res.data.user));
        localStorage.setItem('user_id', res.data.user.id);
        
        // Get the redirect path from location state or default to dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        
        // Replace the current history entry with the dashboard
        // This prevents going back to login page after successful login
        navigate(from, { replace: true });
        
        // Clear any remaining history entries
        window.history.pushState(null, '', from);
      }
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Login failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Panel */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white flex-col p-10">
          <h2 className="text-3xl font-bold mb-4">Welcome Page</h2>
          <p className="text-sm">Sign In To Your Account</p>
        </div>

        {/* Right Panel */}
        <div className="p-10">
          <h3 className="text-xl font-semibold mb-2">Hello!</h3>
          <p className="text-sm text-purple-500 font-medium mb-6">Good Morning</p>
          <h4 className="text-lg font-bold mb-6">
            <span className="text-purple-600">Login</span> Your Account
          </h4>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b-2 focus:outline-none focus:border-blue-500 placeholder-gray-400 py-2"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b-2 focus:outline-none focus:border-blue-500 placeholder-gray-400 py-2 pr-10"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <label className="flex items-center gap-1">
                <input type="checkbox" className="form-checkbox" disabled={loading} />
                Remember
              </label>
              <a href="#" className="hover:text-blue-600">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-md hover:opacity-90 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            <a href="/register" className="text-blue-600 hover:underline">
              Create Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
