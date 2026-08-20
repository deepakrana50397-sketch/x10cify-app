import { createAsyncThunk } from '@reduxjs/toolkit';
import { websiteApi } from '../../services/websiteApi';
import { WebsiteSection } from '../../types/website';

export const fetchWebsiteSections = createAsyncThunk<
  WebsiteSection[],
  void,
  { rejectValue: string }
>('website/fetchAllSections', async (_, { rejectWithValue }) => {
  try {
    const res = await websiteApi.listSections();
    // Aligns with raw array returns from Express listAdmin generic controllers
    if (Array.isArray(res)) {
      return res;
    }
    return rejectWithValue('Failed to fetch homepage sections. Invalid server response.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const toggleWebsiteSection = createAsyncThunk<
  WebsiteSection,
  { id: number; visible: boolean },
  { rejectValue: string }
>('website/toggleSection', async ({ id, visible }, { rejectWithValue }) => {
  try {
    const res = await websiteApi.updateSectionVisibility(id, visible);
    if (res && res.id) {
      return res;
    }
    return rejectWithValue('Failed to update section visibility.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});
