import { describe, expect, it } from 'vitest';
import { createAuthStorage, isAdminUser, normalizeAccessToken } from './useAuthStore';

const createMemoryStorage = () => {
  const values = new Map<string, string>();

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
};

describe('useAuthStore helpers', () => {
  it('keeps refresh tokens in session storage while allowing rememberMe to move the rest of the session', () => {
    const localStorageAdapter = createMemoryStorage();
    const sessionStorageAdapter = createMemoryStorage();
    const storage = createAuthStorage(localStorageAdapter, sessionStorageAdapter);

    storage.setItem(
      'auth-storage',
      JSON.stringify({
        state: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
          rememberMe: true,
        },
      }),
    );

    expect(localStorageAdapter.getItem('auth-storage')).toContain('"accessToken":"access-token"');
    expect(localStorageAdapter.getItem('auth-storage')).toContain('"refreshToken":null');
    expect(sessionStorageAdapter.getItem('auth-storage')).toBeNull();
    expect(sessionStorageAdapter.getItem('auth-storage:refresh-token')).toBe('refresh-token');

    const hydrated = storage.getItem('auth-storage');
    expect(hydrated).not.toBeNull();
    expect(JSON.parse(hydrated!).state.refreshToken).toBe('refresh-token');
  });

  it('normalizes bearer prefixes and detects admin users centrally', () => {
    expect(normalizeAccessToken('Bearer test-token')).toBe('test-token');
    expect(normalizeAccessToken('test-token')).toBe('test-token');
    expect(isAdminUser({ role: 'ADMIN' })).toBe(true);
    expect(isAdminUser({ role: 'USER' })).toBe(false);
  });
});
