import apiClient from './api';

export const dashboardApi = {
  async getStats() {
    const res = await apiClient.get('/admin/dashboard/stats');
    return res.data; // Expected: { success: true, data: DashboardStats }
  }
};
