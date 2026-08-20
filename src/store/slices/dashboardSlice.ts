import { createSlice } from '@reduxjs/toolkit';
import { DashboardState } from '../../types/dashboard';
import { fetchDashboardStats } from '../thunks/dashboardThunks';

const initialState: DashboardState = {
  totalAudits: 0,
  newAudits: 0,
  contactedAudits: 0,
  archivedAudits: 0,
  pendingReviews: 0,
  averageAuditScore: 0,
  recentAudits: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.totalAudits = action.payload.totalAudits;
        state.newAudits = action.payload.newAudits;
        state.contactedAudits = action.payload.contactedAudits;
        state.archivedAudits = action.payload.archivedAudits;
        state.pendingReviews = action.payload.pendingReviews;
        state.averageAuditScore = action.payload.averageAuditScore;
        state.recentAudits = action.payload.recentAudits;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load dashboard metrics';
      });
  },
});

export default dashboardSlice.reducer;
