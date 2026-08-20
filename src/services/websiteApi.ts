import apiClient from './api';

export const websiteApi = {
  async listSections() {
    const res = await apiClient.get('/admin/homepage-sections');
    return res.data; // Expected: { success: true, data: WebsiteSection[] }
  },

  async updateSectionVisibility(id: number, visible: boolean) {
    const res = await apiClient.patch(`/admin/homepage-sections/${id}`, { visible });
    return res.data; // Expected: { success: true, data: WebsiteSection }
  }
};
export default websiteApi;
