import { writable } from 'svelte/store';

interface AuthState {
  isLoggedIn: boolean;
  userHandle: string | null; // userHandle is the unique ID from the passkey
  error: string | null;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    isLoggedIn: false,
    userHandle: null,
    error: null,
  });

  return {
    subscribe,
    setLoggedIn: (userHandle: string) => update(state => ({ ...state, isLoggedIn: true, userHandle, error: null })),
    setLoggedOut: () => update(state => ({ ...state, isLoggedIn: false, userHandle: null, error: null })),
    setError: (error: string | null) => update(state => ({ ...state, error })),
    reset: () => set({ isLoggedIn: false, userHandle: null, error: null }),
  };
}

export const authStore = createAuthStore();
