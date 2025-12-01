// tests/auth.store.test.ts
import { act, renderHook } from '@testing-library/react';
import { useAuthStore } from '@/store/auth';

test('register and login set user and auth flag', async () => {
  const { result } = renderHook(() => useAuthStore());

  await act(async () => {
    await result.current.register('Test', 'test@example.com', 'password123');
  });

  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user?.email).toBe('test@example.com');

  act(() => {
    result.current.logout();
  });

  expect(result.current.isAuthenticated).toBe(false);
});

test('auth store initializes with default values', () => {
  const { result } = renderHook(() => useAuthStore());

  expect(result.current.user).toBeNull();
  expect(result.current.token).toBeNull();
  expect(result.current.isAuthenticated).toBe(false);
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

test('login sets user and token', async () => {
  const { result } = renderHook(() => useAuthStore());

  await act(async () => {
    await result.current.login('user@example.com', 'password123');
  });

  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user?.email).toBe('user@example.com');
  expect(result.current.token).not.toBeNull();
});

test('logout clears user and token', () => {
  const { result } = renderHook(() => useAuthStore());

  act(() => {
    result.current.logout();
  });

  expect(result.current.isAuthenticated).toBe(false);
  expect(result.current.user).toBeNull();
  expect(result.current.token).toBeNull();
});
