import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  email: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch("/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as { detail?: string };
            set({ isLoading: false, error: body.detail ?? `Login failed (${res.status})` });
            return false;
          }
          const data = (await res.json()) as { access_token: string };
          set({ token: data.access_token, email, isLoading: false, error: null });
          return true;
        } catch {
          set({ isLoading: false, error: "Network error — is the API running?" });
          return false;
        }
      },

      register: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          if (!res.ok) {
            const body = (await res.json().catch(() => ({}))) as { detail?: string };
            set({ isLoading: false, error: body.detail ?? `Registration failed (${res.status})` });
            return false;
          }
          const data = (await res.json()) as { access_token: string };
          set({ token: data.access_token, email, isLoading: false, error: null });
          return true;
        } catch {
          set({ isLoading: false, error: "Network error — is the API running?" });
          return false;
        }
      },

      logout: () => set({ token: null, email: null, error: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "agentcanvas-auth",
      partialize: (state) => ({ token: state.token, email: state.email }),
    },
  ),
);
