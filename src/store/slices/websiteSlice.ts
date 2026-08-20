import { createSlice } from '@reduxjs/toolkit';
import { WebsiteState } from '../../types/website';
import { fetchWebsiteSections, toggleWebsiteSection } from '../thunks/websiteThunks';

const initialState: WebsiteState = {
  sections: [],
  loading: false,
  updating: false,
  error: null,
};

const websiteSlice = createSlice({
  name: 'website',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Sections cases
      .addCase(fetchWebsiteSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWebsiteSections.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload;
      })
      .addCase(fetchWebsiteSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load website sections';
      })

      // Toggle Section cases
      .addCase(toggleWebsiteSection.pending, (state) => {
        state.updating = true;
      })
      .addCase(toggleWebsiteSection.fulfilled, (state, action) => {
        state.updating = false;
        const idx = state.sections.findIndex(sec => sec.id === action.payload.id);
        if (idx !== -1) {
          state.sections[idx] = action.payload;
        }
      })
      .addCase(toggleWebsiteSection.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || 'Failed to update section visibility';
      });
  },
});

export default websiteSlice.reducer;
