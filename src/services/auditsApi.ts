import apiClient from './api';
import { AuditStatus } from '../types/audit';

export const auditsApi = {
  async list() {
    const res = await apiClient.get('/admin/messages');
    return res.data; // Expected: { success: true, data: Audit[] }
  },

  async getOne(id: number) {
    const res = await apiClient.get(`/admin/messages/${id}`);
    return res.data; // Expected: { success: true, data: Audit }
  },

  async updateStatus(id: number, status: AuditStatus) {
    const res = await apiClient.patch(`/admin/messages/${id}`, { status });
    return res.data; // Expected: { success: true, data: Audit }
  },

  async delete(id: number) {
    const res = await apiClient.delete(`/admin/messages/${id}`);
    return res.data; // Expected: { success: true }
  }
};
export default auditsApi;
