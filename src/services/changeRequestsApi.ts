import apiClient from './api';

export const changeRequestsApi = {
  async list() {
    const res = await apiClient.get('/admin/change-requests');
    return res.data;
  },
  async approve(id: number) {
    const res = await apiClient.post(`/admin/change-requests/${id}/approve`);
    return res.data;
  },
  async reject(id: number, reason: string) {
    const res = await apiClient.post(`/admin/change-requests/${id}/reject`, { reason });
    return res.data;
  }
};
export default changeRequestsApi;
