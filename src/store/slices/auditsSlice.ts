import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuditsState, AuditStatus } from '../../types/audit';
import { fetchAudits, fetchAuditById, updateAuditStatus, deleteAudit } from '../thunks/auditThunks';

const initialState: AuditsState = {
  items: [],
  selectedAudit: null,
  activeFilter: 'all',
  searchQuery: '',
  loading: false,
  refreshing: false,
  loadingDetail: false,
  updating: false,
  deleting: false,
  error: null,
};

const auditsSlice = createSlice({
  name: 'audits',
  initialState,
  reducers: {
    setAuditFilter(state, action: PayloadAction<'all' | AuditStatus>) {
      state.activeFilter = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    clearSelectedAudit(state) {
      state.selectedAudit = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Audits cases
    builder
      .addCase(fetchAudits.pending, (state, action) => {
        state.loading = !state.refreshing;
        state.error = null;
      })
      .addCase(fetchAudits.fulfilled, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.items = action.payload;
      })
      .addCase(fetchAudits.rejected, (state, action) => {
        state.loading = false;
        state.refreshing = false;
        state.error = action.payload || 'Failed to load audits';
      });

    // Fetch Audit By ID cases
    builder
      .addCase(fetchAuditById.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(fetchAuditById.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.selectedAudit = action.payload;
      })
      .addCase(fetchAuditById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload || 'Failed to load audit details';
      });

    // Update Status cases
    builder
      .addCase(updateAuditStatus.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateAuditStatus.fulfilled, (state, action) => {
        state.updating = false;
        // Update item in list
        const idx = state.items.findIndex(item => item.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        // Update selected audit details
        if (state.selectedAudit && state.selectedAudit.id === action.payload.id) {
          state.selectedAudit = action.payload;
        }
      })
      .addCase(updateAuditStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || 'Failed to update audit status';
      });

    // Delete Audit cases
    builder
      .addCase(deleteAudit.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteAudit.fulfilled, (state, action) => {
        state.deleting = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.selectedAudit && state.selectedAudit.id === action.payload) {
          state.selectedAudit = null;
        }
      })
      .addCase(deleteAudit.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || 'Failed to delete audit';
      });
  },
});

export const { setAuditFilter, setSearchQuery, clearSelectedAudit } = auditsSlice.actions;
export default auditsSlice.reducer;
