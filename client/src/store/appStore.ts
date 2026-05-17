import { create } from 'zustand';
import type { Module } from '@/types';

interface AppStore {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  modules: Module[];
  setTheme: (theme: 'dark' | 'light') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setModules: (modules: Module[]) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  theme: (localStorage.getItem('theme') as 'dark' | 'light') || 'dark',
  sidebarOpen: true,
  modules: [],
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    set({ theme });
  },
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setModules: (modules) => set({ modules }),
}));
