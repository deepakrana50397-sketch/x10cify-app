import { createAsyncThunk } from '@reduxjs/toolkit';
import { pagesApi } from '../../services/pagesApi';
import { Page } from '../../types/cms';

export const fetchPages = createAsyncThunk<
  Page[],
  void,
  { rejectValue: string }
>('pages/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await pagesApi.list();
    if (Array.isArray(res)) {
      return res;
    }
    return rejectWithValue('Invalid server response.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const fetchPageById = createAsyncThunk<
  Page,
  number,
  { rejectValue: string }
>('pages/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await pagesApi.getOne(id);
    if (res && res.id) {
      return res;
    }
    return rejectWithValue('Page detail not found.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const updatePage = createAsyncThunk<
  Page,
  { id: number; data: Partial<Page> },
  { rejectValue: string }
>('pages/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await pagesApi.update(id, data);
    if (res && res.id) {
      return res;
    }
    return rejectWithValue('Failed to save page updates.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const deletePage = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>('pages/delete', async (id, { rejectWithValue }) => {
  try {
    const res = await pagesApi.delete(id);
    if (res) {
      return id;
    }
    return rejectWithValue('Failed to delete page.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});
