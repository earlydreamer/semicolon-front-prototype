import { describe, expect, it } from 'vitest';
import {
  buildAuthorizationHeader,
  buildSessionExpiryRedirectUrl,
  createSingleFlightCoordinator,
  isSessionExpiryCandidate,
} from './api';

describe('api helpers', () => {
  it('runs refresh work only once for concurrent callers', async () => {
    let callCount = 0;
    const run = createSingleFlightCoordinator(async () => {
      callCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 10));
      return 'ok';
    });

    const [first, second, third] = await Promise.all([run(), run(), run()]);

    expect(callCount).toBe(1);
    expect(first).toBe('ok');
    expect(second).toBe('ok');
    expect(third).toBe('ok');
  });

  it('builds the correct redirect target for admin and user session expiry', () => {
    expect(buildSessionExpiryRedirectUrl('/admin/settlements', '?page=2')).toBe(
      '/admin/login?error=expired&returnUrl=%2Fadmin%2Fsettlements%3Fpage%3D2',
    );
    expect(buildSessionExpiryRedirectUrl('/orders/me')).toBe(
      '/login?error=expired&returnUrl=%2Forders%2Fme',
    );
    expect(buildSessionExpiryRedirectUrl('/login')).toBeNull();
  });

  it('keeps only refresh-worthy API requests in the shared recovery path', () => {
    expect(isSessionExpiryCandidate('/api/v1/orders/me')).toBe(true);
    expect(isSessionExpiryCandidate('/api/v1/auth/login')).toBe(false);
    expect(isSessionExpiryCandidate('/api/v1/payments/request')).toBe(false);
    expect(buildAuthorizationHeader('Bearer token')).toBe('Bearer token');
    expect(buildAuthorizationHeader('token')).toBe('Bearer token');
  });
});
