import { createSlice } from '@reduxjs/toolkit';
import { CmsItem } from '../../types/cms';
import { fetchCmsCollection, updateCmsCollectionItem, deleteCmsCollectionItem } from '../thunks/cmsCollectionsThunks';

interface CmsCollectionsState {
  services: CmsItem[];
  industries: CmsItem[];
  faqs: CmsItem[];
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: CmsCollectionsState = {
  services: [],
  industries: [],
  faqs: [],
  loading: false,
  saving: false,
  deleting: false,
  error: null,
};

const cmsCollectionsSlice = createSlice({
  name: 'cmsCollections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchCmsCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCmsCollection.fulfilled, (state, action) => {
        state.loading = false;
        const { resource, data } = action.payload;
        state[resource] = data;
      })
      .addCase(fetchCmsCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch CMS collections';
      })

      // Update
      .addCase(updateCmsCollectionItem.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateCmsCollectionItem.fulfilled, (state, action) => {
        state.saving = false;
        const { resource, data } = action.payload;
        const idx = state[resource].findIndex((item) => item.id === data.id);
        if (idx !== -1) {
          state[resource][idx] = data;
        }
      })
      .addCase(updateCmsCollectionItem.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || 'Failed to update CMS collection item';
      })

      // Delete
      .addCase(deleteCmsCollectionItem.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteCmsCollectionItem.fulfilled, (state, action) => {
        state.deleting = false;
        const { resource, id } = action.payload;
        state[resource] = state[resource].filter((item) => item.id !== id);
      })
      .addCase(deleteCmsCollectionItem.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || 'Failed to delete CMS collection item';
      });
  },
});

export default cmsCollectionsSlice.reducer;
