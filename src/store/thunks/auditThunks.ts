import { createAsyncThunk } from '@reduxjs/toolkit';
import { auditsApi } from '../../services/auditsApi';
import { Audit, AuditStatus } from '../../types/audit';
import { fetchDashboardStats } from './dashboardThunks';

export const fetchAudits = createAsyncThunk<
  Audit[],
  void,
  { rejectValue: string }
>('audits/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await auditsApi.list();
    // Aligns with raw array returns from Express listAdmin messages controller
    if (Array.isArray(res)) {
      return res;
    }
    return rejectWithValue('Failed to fetch audits list. Invalid server response.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const fetchAuditById = createAsyncThunk<
  Audit,
  number,
  { rejectValue: string }
>('audits/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await auditsApi.getOne(id);
    // Aligns with raw record object returns from Express getOne messages controller
    if (res && res.id) {
      return res;
    }
    return rejectWithValue('Failed to fetch audit detail. Invalid server response.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const updateAuditStatus = createAsyncThunk<
  Audit,
  { id: number; status: AuditStatus },
  { rejectValue: string }
>('audits/updateStatus', async ({ id, status }, { dispatch, rejectWithValue }) => {
  try {
    const res = await auditsApi.updateStatus(id, status);
    if (res && res.id) {
      // Invalidate dashboard statistics
      dispatch(fetchDashboardStats());
      return res;
    }
    return rejectWithValue('Failed to update audit status.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const deleteAudit = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('audits/delete', async (id, { dispatch, rejectWithValue }) => {
  try {
    // Aligns with raw success boolean or count returned from Express controller
    const res = await auditsApi.delete(id);
    if (res) {
      // Invalidate dashboard statistics
      dispatch(fetchDashboardStats());
      return id;
    }
    return rejectWithValue('Failed to delete audit.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});
