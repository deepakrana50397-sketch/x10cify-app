import apiClient from './api';

export const reviewsApi = {
  async list() {
    const res = await apiClient.get('/admin/reviews');
    return res.data;
  },
  async getOne(id: number) {
    const res = await apiClient.get(`/admin/reviews/${id}`);
    return res.data;
  },
  async updateStatus(id: number, status: 'pending' | 'approved' | 'rejected') {
    const res = await apiClient.patch(`/admin/reviews/${id}`, { status });
    return res.data;
  },
  async delete(id: number) {
    const res = await apiClient.delete(`/admin/reviews/${id}`);
    return res.data;
  }
};
export default reviewsApi;
