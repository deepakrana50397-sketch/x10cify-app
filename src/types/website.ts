export interface WebsiteSection {
  id: number;
  sectionId: string; // e.g. 'hero', 'services', 'reviews'
  title: string;
  visible: boolean;
  displayOrder: number;
}

export interface WebsiteState {
  sections: WebsiteSection[];
  loading: boolean;
  updating: boolean;
  error: string | null;
}
export interface AppState {
  isOnline: boolean;
  theme: 'light' | 'dark';
  appVersion: string;
  globalError: string | null;
}
