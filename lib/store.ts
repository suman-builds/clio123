import { create } from 'zustand';
import { UserProfile } from './auth';

interface AppState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  
  // UI State
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Messages State
  selectedConversation: string | null;
  setSelectedConversation: (id: string | null) => void;
  
  // Loading States
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  selectedConversation: null,
  setSelectedConversation: (id) => set({ selectedConversation: id }),
  
  loading: false,
  setLoading: (loading) => set({ loading }),
}));