// 1. Blog Type
export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published';
  authorId: number;
  createdAt: string;
  updatedAt: string;
}

// 2. Page Type
export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// 3. Review Type
export interface Review {
  id: number;
  clientName: string;
  clientCompany: string;
  reviewText: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// 4. Change Request Type
export interface ChangeRequest {
  id: number;
  entityType: string;
  entityId: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  requestedByName?: string;
  requestedByEmail?: string;
  actionedByName?: string;
  actionedByEmail?: string;
}

// 5. Shared Generic CMS Item (Services, Industries, FAQs)
export interface CmsItem {
  id: number;
  title?: string;
  name?: string;
  question?: string;
  answer?: string;
  description?: string;
  visible: boolean;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}
