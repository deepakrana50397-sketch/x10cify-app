import { createAsyncThunk } from '@reduxjs/toolkit';
import { caseStudiesApi } from '../../services/caseStudiesApi';
import { CaseStudy } from '../../types/caseStudy';

export const fetchCaseStudies = createAsyncThunk<
  CaseStudy[],
  void,
  { rejectValue: string }
>('caseStudies/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await caseStudiesApi.list();
    // Aligns with raw array returns from Express listAdmin generic controllers
    if (Array.isArray(res)) {
      return res;
    }
    return rejectWithValue('Failed to fetch case studies. Invalid server response.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const fetchCaseStudyById = createAsyncThunk<
  CaseStudy,
  number,
  { rejectValue: string }
>('caseStudies/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await caseStudiesApi.getOne(id);
    // Aligns with raw record object returns from Express getOne generic controllers
    if (res && res.id) {
      return res;
    }
    return rejectWithValue('Failed to fetch case study details.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const updateCaseStudy = createAsyncThunk<
  CaseStudy,
  { id: number; data: Partial<CaseStudy> },
  { rejectValue: string }
>('caseStudies/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await caseStudiesApi.update(id, data);
    if (res && res.id) {
      return res;
    }
    return rejectWithValue('Failed to save case study.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const toggleCaseStudyVisibility = createAsyncThunk<
  CaseStudy,
  { id: number; visible: boolean },
  { rejectValue: string }
>('caseStudies/toggleVisibility', async ({ id, visible }, { rejectWithValue }) => {
  try {
    const res = await caseStudiesApi.toggleVisibility(id, visible);
    if (res && res.id) {
      return res;
    }
    return rejectWithValue('Failed to toggle visibility.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});
