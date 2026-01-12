/**
 * 가격 포맷팅 유틸리티
 * 
 * 숫자를 한국 원화 형식으로 포맷팅합니다.
 */

/**
 * 숫자를 원화 형식으로 포맷팅
 * 
 * @param price - 포맷팅할 금액
 * @returns 포맷팅된 문자열 (예: "1,000,000원")
 * 
 * @example
 * ```ts
 * formatPrice(1500000) // "1,500,000원"
 * formatPrice(0) // "0원"
 * ```
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('ko-KR') + '원';
};

/**
 * 숫자를 원화 형식으로 포맷팅 (단위 없이)
 * 
 * @param price - 포맷팅할 금액
 * @returns 포맷팅된 문자열 (예: "1,000,000")
 */
export const formatPriceWithoutUnit = (price: number): string => {
  return price.toLocaleString('ko-KR');
};
