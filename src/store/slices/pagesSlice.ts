import { createSlice } from '@reduxjs/toolkit';
import { Page } from '../../types/cms';
import { fetchPages, fetchPageById, updatePage, deletePage } from '../thunks/pagesThunks';

interface PagesState {
  items: Page[];
  selectedPage: Page | null;
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: PagesState = {
  items: [],
  selectedPage: null,
  loading: false,
  saving: false,
  deleting: false,
  error: null,
};

const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    clearSelectedPage(state) {
      state.selectedPage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch pages';
      })

      // Fetch One
      .addCase(fetchPageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPageById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPage = action.payload;
      })
      .addCase(fetchPageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch page details';
      })

      // Update
      .addCase(updatePage.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.items.findIndex((item) => item.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        if (state.selectedPage && state.selectedPage.id === action.payload.id) {
          state.selectedPage = action.payload;
        }
      })
      .addCase(updatePage.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || 'Failed to update page';
      })

      // Delete
      .addCase(deletePage.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deletePage.fulfilled, (state, action) => {
        state.deleting = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.selectedPage && state.selectedPage.id === action.payload) {
          state.selectedPage = null;
        }
      })
      .addCase(deletePage.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || 'Failed to delete page';
      });
  },
});

export const { clearSelectedPage } = pagesSlice.actions;
export default pagesSlice.reducer;
