import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    id: null,
    username: '',
    email: '',
    profileImage: 'default.jpg', // Default image path
  },
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
        profileImage: action.payload.profileImage || state.user.profileImage
      };
      state.isAuthenticated = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateProfileImage: (state, action) => {
      state.user.profileImage = action.payload;
    },
    logout: (state) => {
      state.user = initialState.user;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
    },
  },
});

export const { 
  setLoading, 
  setUser, 
  setToken, 
  setError, 
  logout,
  updateProfileImage 
} = authSlice.actions;

export default authSlice.reducer;
