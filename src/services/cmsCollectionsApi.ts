import apiClient from './api';

export const cmsCollectionsApi = {
  async list(resource: 'services' | 'industries' | 'faqs') {
    const res = await apiClient.get(`/admin/${resource}`);
    return res.data;
  },
  async getOne(resource: 'services' | 'industries' | 'faqs', id: number) {
    const res = await apiClient.get(`/admin/${resource}/${id}`);
    return res.data;
  },
  async update(resource: 'services' | 'industries' | 'faqs', id: number, data: any) {
    const res = await apiClient.patch(`/admin/${resource}/${id}`, data);
    return res.data;
  },
  async delete(resource: 'services' | 'industries' | 'faqs', id: number) {
    const res = await apiClient.delete(`/admin/${resource}/${id}`);
    return res.data;
  }
};
export default cmsCollectionsApi;
