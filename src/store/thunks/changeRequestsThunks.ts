import { createAsyncThunk } from '@reduxjs/toolkit';
import { changeRequestsApi } from '../../services/changeRequestsApi';
import { ChangeRequest } from '../../types/cms';

export const fetchChangeRequests = createAsyncThunk<
  ChangeRequest[],
  void,
  { rejectValue: string }
>('changeRequests/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await changeRequestsApi.list();
    if (Array.isArray(res)) {
      return res;
    }
    return rejectWithValue('Invalid server response.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const approveChangeRequest = createAsyncThunk<
  ChangeRequest,
  number,
  { rejectValue: string }
>('changeRequests/approve', async (id, { rejectWithValue }) => {
  try {
    const res = await changeRequestsApi.approve(id);
    if (res && res.id) {
      return res;
    }
    return rejectWithValue('Failed to approve request.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const rejectChangeRequest = createAsyncThunk<
  ChangeRequest,
  { id: number; reason: string },
  { rejectValue: string }
>('changeRequests/reject', async ({ id, reason }, { rejectWithValue }) => {
  try {
    const res = await changeRequestsApi.reject(id, reason);
    if (res && res.id) {
      return res;
    }
    return rejectWithValue('Failed to reject request.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});
