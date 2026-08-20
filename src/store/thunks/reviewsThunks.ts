import { createAsyncThunk } from '@reduxjs/toolkit';
import { reviewsApi } from '../../services/reviewsApi';
import { Review } from '../../types/cms';

export const fetchReviews = createAsyncThunk<
  Review[],
  void,
  { rejectValue: string }
>('reviews/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await reviewsApi.list();
    if (Array.isArray(res)) {
      return res;
    }
    return rejectWithValue('Invalid server response.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const updateReviewStatus = createAsyncThunk<
  Review,
  { id: number; status: 'pending' | 'approved' | 'rejected' },
  { rejectValue: string }
>('reviews/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await reviewsApi.updateStatus(id, status);
    if (res && res.id) {
      return res;
    }
    return rejectWithValue('Failed to update review status.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const deleteReview = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('reviews/delete', async (id, { rejectWithValue }) => {
  try {
    const res = await reviewsApi.delete(id);
    if (res) {
      return id;
    }
    return rejectWithValue('Failed to delete review.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});
