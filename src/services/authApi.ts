import apiClient from './api';

export const authApi = {
  async login(email: string, password: string) {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data; // Expected: { success: true, token: string, user: User }
  },

  async getProfile() {
    const res = await apiClient.get('/admin/profile');
    return res.data; // Expected: { success: true, data: User }
  }
};
