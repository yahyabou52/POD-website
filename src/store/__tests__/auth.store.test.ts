import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../auth';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Auth Store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
    localStorage.clear();
  });

  it('should login a user', async () => {
    const { login } = useAuthStore.getState();
    await login('test@example.com', 'password');

    const state = useAuthStore.getState();
    expect(state.user).not.toBeNull();
    expect(state.isAuthenticated).toBe(true);
  });

  it('should logout a user', () => {
    const { logout } = useAuthStore.getState();
    logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should persist state to localStorage', async () => {
    const { login, loadFromStorage } = useAuthStore.getState();
    await login('test@example.com', 'password');

    const storedAuth = JSON.parse(localStorage.getItem('auth-storage')!);
    expect(storedAuth.user.email).toBe('test@example.com');

    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
    loadFromStorage();

    const state = useAuthStore.getState();
    expect(state.user?.email).toBe('test@example.com');
    expect(state.isAuthenticated).toBe(true);
  });
});