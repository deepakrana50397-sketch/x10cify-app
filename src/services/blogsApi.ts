import apiClient from './api';

export const blogsApi = {
  async list() {
    const res = await apiClient.get('/admin/blogs');
    return res.data; // Raw array response Compliant with React Admin API
  },
  async getOne(id: number) {
    const res = await apiClient.get(`/admin/blogs/${id}`);
    return res.data;
  },
  async update(id: number, data: any) {
    const res = await apiClient.patch(`/admin/blogs/${id}`, data);
    return res.data;
  },
  async delete(id: number) {
    const res = await apiClient.delete(`/admin/blogs/${id}`);
    return res.data;
  }
};
export default blogsApi;
