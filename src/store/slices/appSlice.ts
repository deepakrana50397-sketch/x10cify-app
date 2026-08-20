import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CONFIG } from '../../constants/config';

export interface AppState {
  isOnline: boolean;
  theme: 'light' | 'dark';
  appVersion: string;
  globalError: string | null;
  toastMessage: string | null;
  toastType: 'error' | 'success' | 'info';
}

const initialState: AppState = {
  isOnline: true,
  theme: 'light',
  appVersion: CONFIG.APP_VERSION,
  globalError: null,
  toastMessage: null,
  toastType: 'info',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setOnlineStatus(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
    },
    setGlobalError(state, action: PayloadAction<string | null>) {
      state.globalError = action.payload;
    },
    showToast(state, action: PayloadAction<{ message: string; type?: 'error' | 'success' | 'info' }>) {
      state.toastMessage = action.payload.message;
      state.toastType = action.payload.type || 'info';
    },
    hideToast(state) {
      state.toastMessage = null;
    }
  },
  extraReducers: (builder) => {
    // 1. Centralized Matcher for Rejected Errors
    builder.addMatcher(
      (action) => action.type.endsWith('/rejected'),
      (state, action) => {
        // Skip session restore silent errors
        if (action.type.includes('restoreSession')) return;

        const errorMsg = (action as any).payload as string || (action as any).error?.message || 'An connection error occurred.';
        state.toastMessage = errorMsg;
        state.toastType = 'error';
      }
    );

    // 2. Centralized Matcher for Successful Mutations
    builder.addMatcher(
      (action) => action.type.endsWith('/fulfilled') && (
        action.type.includes('updateStatus') || 
        action.type.includes('delete') || 
        action.type.includes('update') || 
        action.type.includes('toggle')
      ),
      (state, action) => {
        let msg = 'Changes saved successfully.';
        if (action.type.includes('updateStatus')) msg = 'Lead status updated.';
        if (action.type.includes('delete')) msg = 'Lead deleted successfully.';
        if (action.type.includes('toggleVisibility')) msg = 'Case study visibility toggled.';
        if (action.type.includes('toggleSection')) msg = 'Website layout section updated.';
        if (action.type.includes('updateCaseStudy')) msg = 'Case study details updated.';

        state.toastMessage = msg;
        state.toastType = 'success';
      }
    );
  }
});

export const { setOnlineStatus, setTheme, setGlobalError, showToast, hideToast } = appSlice.actions;
export default appSlice.reducer;
