import { createAsyncThunk } from '@reduxjs/toolkit';
import { cmsCollectionsApi } from '../../services/cmsCollectionsApi';
import { CmsItem } from '../../types/cms';

export const fetchCmsCollection = createAsyncThunk<
  { resource: 'services' | 'industries' | 'faqs'; data: CmsItem[] },
  'services' | 'industries' | 'faqs',
  { rejectValue: string }
>('cmsCollections/fetchAll', async (resource, { rejectWithValue }) => {
  try {
    const res = await cmsCollectionsApi.list(resource);
    if (Array.isArray(res)) {
      return { resource, data: res };
    }
    return rejectWithValue('Invalid server response.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const updateCmsCollectionItem = createAsyncThunk<
  { resource: 'services' | 'industries' | 'faqs'; data: CmsItem },
  { resource: 'services' | 'industries' | 'faqs'; id: number; data: Partial<CmsItem> },
  { rejectValue: string }
>('cmsCollections/update', async ({ resource, id, data }, { rejectWithValue }) => {
  try {
    const res = await cmsCollectionsApi.update(resource, id, data);
    if (res && res.id) {
      return { resource, data: res };
    }
    return rejectWithValue('Failed to save CMS item.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const deleteCmsCollectionItem = createAsyncThunk<
  { resource: 'services' | 'industries' | 'faqs'; id: number },
  { resource: 'services' | 'industries' | 'faqs'; id: number },
  { rejectValue: string }
>('cmsCollections/delete', async ({ resource, id }, { rejectWithValue }) => {
  try {
    const res = await cmsCollectionsApi.delete(resource, id);
    if (res) {
      return { resource, id };
    }
    return rejectWithValue('Failed to delete CMS item.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});
