// src/store/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error?: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUserFromStorage: () => void;
  loadFromStorage: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          // mock async auth — replace with axios POST later
          await new Promise((r) => setTimeout(r, 600));
          // naive mock validation
          if (!email || !password) throw new Error('Invalid credentials');

          const mockUser = { id: 'u_' + Date.now(), name: 'Demo User', email };
          const mockToken = 'mock-token-' + Date.now();

          set({ user: mockUser, token: mockToken, isAuthenticated: true, loading: false });
        } catch (err: any) {
          set({ error: err?.message ?? 'Login failed', loading: false });
          throw err;
        }
      },

      register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
          await new Promise((r) => setTimeout(r, 700));
          if (!name || !email || !password) throw new Error('Missing fields');
          const mockUser = { id: 'u_' + Date.now(), name, email };
          const mockToken = 'mock-token-' + Date.now();
          set({ user: mockUser, token: mockToken, isAuthenticated: true, loading: false });
        } catch (err: any) {
          set({ error: err?.message ?? 'Register failed', loading: false });
          throw err;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUserFromStorage: () => {
        const s = (get as any).__store?.getState?.(); // not standard; we rely on persist middleware saving
        // persist middleware will rehydrate automatically; we keep API for future use
      },

      loadFromStorage: () => {
        const storedAuth = localStorage.getItem('auth-storage');
        if (storedAuth) {
          const { user, token, isAuthenticated } = JSON.parse(storedAuth);
          set({ user, token, isAuthenticated });
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
