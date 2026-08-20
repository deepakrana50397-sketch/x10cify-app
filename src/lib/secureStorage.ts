import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'x10cify_access_token';

export const secureStorage = {
  async saveToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    } catch (error) {
      console.error('[SecureStore] Save token failed:', error);
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('[SecureStore] Get token failed:', error);
      return null;
    }
  },

  async deleteToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('[SecureStore] Delete token failed:', error);
    }
  }
};
