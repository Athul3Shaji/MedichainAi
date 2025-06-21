import { useSelector, useDispatch } from 'react-redux';
import { setToken, setUser, logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { token, user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = (userData, token) => {
    dispatch(setToken(token));
    dispatch(setUser(userData));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    token,
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout: logoutUser,
  };
}; 