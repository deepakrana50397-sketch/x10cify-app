import apiClient from './api';

export const pagesApi = {
  async list() {
    const res = await apiClient.get('/admin/pages');
    return res.data;
  },
  async getOne(id: number) {
    const res = await apiClient.get(`/admin/pages/${id}`);
    return res.data;
  },
  async update(id: number, data: any) {
    const res = await apiClient.patch(`/admin/pages/${id}`, data);
    return res.data;
  },
  async delete(id: number) {
    const res = await apiClient.delete(`/admin/pages/${id}`);
    return res.data;
  }
};
export default pagesApi;
