const VERIFICATION_COOLDOWN_SECONDS = 60;
const STORAGE_PREFIX = 'email-verification-cooldown:';

function getStorageKey(email: string) {
  return `${STORAGE_PREFIX}${email.trim().toLowerCase()}`;
}

export function getVerificationCooldownSeconds() {
  return VERIFICATION_COOLDOWN_SECONDS;
}

export function getRemainingVerificationCooldown(email: string) {
  if (!email) return 0;

  const key = getStorageKey(email);
  const stored = sessionStorage.getItem(key);
  if (!stored) return 0;

  const sentAt = Number(stored);
  if (Number.isNaN(sentAt)) {
    sessionStorage.removeItem(key);
    return 0;
  }

  const elapsedSeconds = Math.floor((Date.now() - sentAt) / 1000);
  const remaining = VERIFICATION_COOLDOWN_SECONDS - elapsedSeconds;

  if (remaining <= 0) {
    sessionStorage.removeItem(key);
    return 0;
  }

  return remaining;
}

export function markVerificationEmailSent(email: string) {
  if (!email) return;
  sessionStorage.setItem(getStorageKey(email), String(Date.now()));
}
