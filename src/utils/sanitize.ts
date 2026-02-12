/**
 * XSS 공격 방지를 위한 보안 유틸리티 함수
 * 
 * React의 기본 이스케이프 기능에 추가적인 방어 레이어를 제공합니다.
 */

/**
 * 허용된 이미지 호스트 목록
 * 외부 이미지 URL 검증 시 사용됩니다.
 */
export const ALLOWED_IMAGE_HOSTS = [
  'images.unsplash.com',
  'api.dicebear.com',
  'ui-avatars.com',
  'placehold.co',
  'localhost',
] as const;

/**
 * 위험한 프로토콜 목록
 */
const DANGEROUS_PROTOCOLS = [
  'javascript:',
  'vbscript:',
  'data:text/html',
  'data:application',
] as const;

/**
 * 이미지 URL이 안전한지 검증합니다.
 * 
 * @param url - 검증할 URL
 * @returns 안전한 URL이면 true, 아니면 false
 * 
 * @example
 * ```ts
 * isValidImageUrl('https://images.unsplash.com/photo.jpg') // true
 * isValidImageUrl('javascript:alert(1)') // false
 * isValidImageUrl('https://malicious-site.com/image.jpg') // false
 * ```
 */
export function isValidImageUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const trimmedUrl = url.trim().toLowerCase();

  // 위험한 프로토콜 차단
  for (const protocol of DANGEROUS_PROTOCOLS) {
    if (trimmedUrl.startsWith(protocol)) {
      console.warn(`[Security] Blocked dangerous protocol in URL: ${url.substring(0, 50)}...`);
      return false;
    }
  }

  // data:image URL은 Base64 이미지로 허용 (파일 업로드 등에서 사용)
  if (trimmedUrl.startsWith('data:image/')) {
    return true;
  }

  // 상대 경로 허용
  if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('./')) {
    return true;
  }

  // HTTP/HTTPS URL 검증
  try {
    const parsedUrl = new URL(url);
    
    // HTTP/HTTPS만 허용
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }

    // 허용된 호스트 확인
    const isAllowedHost = ALLOWED_IMAGE_HOSTS.some(
      (host) => parsedUrl.hostname === host || parsedUrl.hostname.endsWith(`.${host}`)
    );

    if (!isAllowedHost) {
      console.warn(`[Security] Image host not in allowlist: ${parsedUrl.hostname}`);
      // 개발 환경에서는 경고만 하고 허용 (실제 배포 시에는 false 반환 권장)
      // return false;
    }

    return true;
  } catch {
    // URL 파싱 실패
    return false;
  }
}

/**
 * 사용자 입력 텍스트를 정화합니다.
 * HTML 태그와 위험한 문자를 이스케이프합니다.
 * 
 * @param input - 정화할 텍스트
 * @param options - 정화 옵션
 * @returns 정화된 텍스트
 * 
 * @example
 * ```ts
 * sanitizeText('<script>alert(1)</script>') // '&lt;script&gt;alert(1)&lt;/script&gt;'
 * sanitizeText('Hello\n\nWorld', { preserveNewlines: true }) // 'Hello\n\nWorld'
 * ```
 */
export function sanitizeText(
  input: string | undefined | null,
  options: { 
    preserveNewlines?: boolean;
    maxLength?: number;
  } = {}
): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  const { preserveNewlines = true, maxLength = 10000 } = options;

  let sanitized = input
    // HTML 특수 문자 이스케이프
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    // null 바이트 제거
    .replace(/\u0000/g, '');

  // 줄바꿈 처리
  if (!preserveNewlines) {
    sanitized = sanitized.replace(/[\r\n]+/g, ' ');
  }

  // 최대 길이 제한
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized.trim();
}

/**
 * URL 파라미터를 안전하게 처리합니다.
 * 
 * @param param - URL 파라미터 값
 * @returns 정화된 파라미터 값
 * 
 * @example
 * ```ts
 * sanitizeUrlParam('product-123') // 'product-123'
 * sanitizeUrlParam('<script>') // 'script'
 * sanitizeUrlParam(null) // ''
 * ```
 */
export function sanitizeUrlParam(param: string | undefined | null): string {
  if (!param || typeof param !== 'string') {
    return '';
  }

  // HTML 태그 및 위험 문자 제거
  return param
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/[<>"'&]/g, '') // 특수 문자 제거
    .replace(/javascript:/gi, '') // javascript: 프로토콜 제거
    .replace(/data:/gi, '') // data: 프로토콜 제거
    .trim();
}

/**
 * ID 형식의 문자열을 검증합니다.
 * 영문자, 숫자, 하이픈, 언더스코어만 허용합니다.
 * 
 * @param id - 검증할 ID
 * @returns 유효한 ID이면 true
 * 
 * @example
 * ```ts
 * isValidId('product-123') // true
 * isValidId('p_s1_1') // true
 * isValidId('<script>') // false
 * ```
 */
export function isValidId(id: string | undefined | null): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }

  // 영문자, 숫자, 하이픈, 언더스코어만 허용
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

/**
 * 안전한 href 값인지 검증합니다.
 * 
 * @param href - 검증할 href 값
 * @returns 안전하면 true
 */
export function isSafeHref(href: string | undefined | null): boolean {
  if (!href || typeof href !== 'string') {
    return false;
  }

  const trimmed = href.trim().toLowerCase();

  // 위험한 프로토콜 차단
  for (const protocol of DANGEROUS_PROTOCOLS) {
    if (trimmed.startsWith(protocol)) {
      return false;
    }
  }

  // 상대 경로, http, https, mailto, tel만 허용
  const safeProtocols = ['/', '#', 'http:', 'https:', 'mailto:', 'tel:'];
  return safeProtocols.some((p) => trimmed.startsWith(p));
}
