import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CaseStudiesState } from '../../types/caseStudy';
import { fetchCaseStudies, fetchCaseStudyById, updateCaseStudy, toggleCaseStudyVisibility } from '../thunks/caseStudyThunks';

const initialState: CaseStudiesState = {
  items: [],
  selectedCaseStudy: null,
  loading: false,
  saving: false,
  updatingVisibility: false,
  error: null,
};

const caseStudiesSlice = createSlice({
  name: 'caseStudies',
  initialState,
  reducers: {
    clearSelectedCaseStudy(state) {
      state.selectedCaseStudy = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Case Studies cases
    builder
      .addCase(fetchCaseStudies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCaseStudies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCaseStudies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load case studies';
      });

    // Fetch Case Study By ID cases
    builder
      .addCase(fetchCaseStudyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCaseStudyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCaseStudy = action.payload;
      })
      .addCase(fetchCaseStudyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load case study details';
      });

    // Update Case Study cases
    builder
      .addCase(updateCaseStudy.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateCaseStudy.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.items.findIndex(item => item.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        if (state.selectedCaseStudy && state.selectedCaseStudy.id === action.payload.id) {
          state.selectedCaseStudy = action.payload;
        }
      })
      .addCase(updateCaseStudy.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || 'Failed to update case study';
      });

    // Toggle Case Study Visibility cases
    builder
      .addCase(toggleCaseStudyVisibility.pending, (state) => {
        state.updatingVisibility = true;
      })
      .addCase(toggleCaseStudyVisibility.fulfilled, (state, action) => {
        state.updatingVisibility = false;
        const idx = state.items.findIndex(item => item.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        if (state.selectedCaseStudy && state.selectedCaseStudy.id === action.payload.id) {
          state.selectedCaseStudy = action.payload;
        }
      })
      .addCase(toggleCaseStudyVisibility.rejected, (state, action) => {
        state.updatingVisibility = false;
        state.error = action.payload || 'Failed to update visibility toggle';
      });
  },
});

export const { clearSelectedCaseStudy } = caseStudiesSlice.actions;
export default caseStudiesSlice.reducer;
