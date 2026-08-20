import { createSlice } from '@reduxjs/toolkit';
import { Review } from '../../types/cms';
import { fetchReviews, updateReviewStatus, deleteReview } from '../thunks/reviewsThunks';

interface ReviewsState {
  items: Review[];
  loading: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  items: [],
  loading: false,
  updating: false,
  deleting: false,
  error: null,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch reviews';
      })

      // Update Status
      .addCase(updateReviewStatus.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        state.updating = false;
        const idx = state.items.findIndex((item) => item.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      })
      .addCase(updateReviewStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || 'Failed to update review status';
      })

      // Delete
      .addCase(deleteReview.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.deleting = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || 'Failed to delete review';
      });
  },
});

export default reviewsSlice.reducer;
