import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import claimsReducer from './slices/claimsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    claims: claimsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
