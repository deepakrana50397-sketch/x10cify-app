export type AuditStatus = 'new' | 'contacted' | 'archived';

export interface Audit {
  id: number;
  firstName: string; // maps to firstName (lead name)
  lastName: string | null;
  email: string;
  phone: string;
  company: string; // maps to store URL in database
  serviceInterested: string;
  message: string; // contains the bottleneck details and notes
  source: string;
  status: AuditStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuditsState {
  items: Audit[];
  selectedAudit: Audit | null;
  activeFilter: 'all' | AuditStatus;
  searchQuery: string;
  loading: boolean;
  refreshing: boolean;
  loadingDetail: boolean;
  updating: boolean;
  deleting: boolean;
  error: string | null;
}
