import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/authApi';
import { secureStorage } from '../../lib/secureStorage';
import { User } from '../../types/auth';

export const login = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await authApi.login(email, password);
    if (res.success && res.token && res.user) {
      await secureStorage.saveToken(res.token);
      return { user: res.user, token: res.token };
    }
    return rejectWithValue(res.message || 'Login failed. Invalid response.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});

export const restoreSession = createAsyncThunk<
  { user: User; token: string } | null,
  void,
  { rejectValue: string }
>('auth/restoreSession', async (_, { rejectWithValue }) => {
  try {
    const token = await secureStorage.getToken();
    if (!token) return null;

    // Fetch user profile to validate token
    const res = await authApi.getProfile();
    if (res && res.email) {
      return { user: res, token };
    }
    
    // Token was invalid, clean it
    await secureStorage.deleteToken();
    return null;
  } catch (error: any) {
    // If it's a network error rather than a token error, don't delete the token, just fail silently
    if (error.message && error.message.includes('Network Error')) {
      return rejectWithValue('Network error occurred during session restore.');
    }
    await secureStorage.deleteToken();
    return null;
  }
});

export const logout = createAsyncThunk<void, void>(
  'auth/logout',
  async () => {
    await secureStorage.deleteToken();
  }
);
