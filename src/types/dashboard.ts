export interface RecentAuditSummary {
  id: number;
  company: string; // matches Shopify URL
  name: string;
  status: 'new' | 'contacted' | 'archived';
  createdAt: string;
}

export interface DashboardStats {
  totalAudits: number;
  newAudits: number;
  contactedAudits: number;
  archivedAudits: number;
  pendingReviews: number;
  averageAuditScore: number;
  recentAudits: RecentAuditSummary[];
}

export interface DashboardState extends DashboardStats {
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}
