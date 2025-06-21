import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  claims: [],
  loading: false,
  error: null,
  stats: {
    totalClaims: 0,
    fraudDetection: 0,
    averageRiskScore: 0,
  },
  filters: {
    status: 'all',
    dateRange: 'all',
    searchQuery: '',
  },
};

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setClaims: (state, action) => {
      state.claims = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    updateClaimStatus: (state, action) => {
      const { claimId, status } = action.payload;
      const claim = state.claims.find(c => c.claimId === claimId);
      if (claim) {
        claim.status = status;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
});

export const {
  setLoading,
  setClaims,
  setError,
  setStats,
  updateClaimStatus,
  setFilters,
} = claimsSlice.actions;

export default claimsSlice.reducer;
