import { createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardApi } from '../../services/dashboardApi';
import { DashboardStats } from '../../types/dashboard';

export const fetchDashboardStats = createAsyncThunk<
  DashboardStats,
  void,
  { rejectValue: string }
>('dashboard/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const res = await dashboardApi.getStats();
    if (res.success && res.data) {
      const statsObj = res.data.stats;
      const recentList = res.data.recentMessages || [];
      
      const total = statsObj.messages?.total || 0;
      const newCount = statsObj.messages?.new || 0;
      const contactedCount = total - newCount;

      return {
        totalAudits: total,
        newAudits: newCount,
        contactedAudits: contactedCount >= 0 ? contactedCount : 0,
        archivedAudits: 0,
        pendingReviews: statsObj.reviews?.pending || 0,
        averageAuditScore: 0,
        recentAudits: recentList.map((m: any) => ({
          id: m.id,
          company: m.company || 'Shopify Store',
          name: m.name || 'Guest Lead',
          status: m.status || 'new',
          createdAt: m.createdAt || new Date().toISOString()
        }))
      };
    }
    return rejectWithValue(res.message || 'Failed to load stats.');
  } catch (error: any) {
    return rejectWithValue(error.message || 'Connection error.');
  }
});
