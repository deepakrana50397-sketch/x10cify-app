import { createSlice } from '@reduxjs/toolkit';
import { ChangeRequest } from '../../types/cms';
import { fetchChangeRequests, approveChangeRequest, rejectChangeRequest } from '../thunks/changeRequestsThunks';

interface ChangeRequestsState {
  items: ChangeRequest[];
  loading: boolean;
  processing: boolean;
  error: string | null;
}

const initialState: ChangeRequestsState = {
  items: [],
  loading: false,
  processing: false,
  error: null,
};

const changeRequestsSlice = createSlice({
  name: 'changeRequests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchChangeRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChangeRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchChangeRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch change requests';
      })

      // Approve Request
      .addCase(approveChangeRequest.pending, (state) => {
        state.processing = true;
      })
      .addCase(approveChangeRequest.fulfilled, (state, action) => {
        state.processing = false;
        const idx = state.items.findIndex((item) => item.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      })
      .addCase(approveChangeRequest.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload || 'Failed to approve request';
      })

      // Reject Request
      .addCase(rejectChangeRequest.pending, (state) => {
        state.processing = true;
      })
      .addCase(rejectChangeRequest.fulfilled, (state, action) => {
        state.processing = false;
        const idx = state.items.findIndex((item) => item.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      })
      .addCase(rejectChangeRequest.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload || 'Failed to reject request';
      });
  },
});

export default changeRequestsSlice.reducer;
