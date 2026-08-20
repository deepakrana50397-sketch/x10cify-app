export interface CaseStudy {
  id: number;
  title: string;
  clientName: string;
  category: string;
  year: string;
  image: string;
  description: string;
  content: string; // JSON content string
  displayOrder: number;
  visible: boolean;
  status: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
}

export interface CaseStudiesState {
  items: CaseStudy[];
  selectedCaseStudy: CaseStudy | null;
  loading: boolean;
  saving: boolean;
  updatingVisibility: boolean;
  error: string | null;
}
