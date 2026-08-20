import apiClient from './api';
import { CaseStudy } from '../types/caseStudy';

export const caseStudiesApi = {
  async list() {
    const res = await apiClient.get('/admin/case-studies');
    return res.data; // Expected: { success: true, data: CaseStudy[] }
  },

  async getOne(id: number) {
    const res = await apiClient.get(`/admin/case-studies/${id}`);
    return res.data; // Expected: { success: true, data: CaseStudy }
  },

  async update(id: number, data: Partial<CaseStudy>) {
    const res = await apiClient.patch(`/admin/case-studies/${id}`, data);
    return res.data; // Expected: { success: true, data: CaseStudy }
  },

  async toggleVisibility(id: number, visible: boolean) {
    const res = await apiClient.patch(`/admin/case-studies/${id}`, { visible });
    return res.data; // Expected: { success: true, data: CaseStudy }
  }
};
