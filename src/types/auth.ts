export interface User {
  id: number;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'manager' | 'employee';
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  error: string | null;
}
