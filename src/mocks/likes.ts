/**
 * 찜하기 Mock 데이터
 */

export interface ProductLike {
  id: string;
  productId: string;
  userId: string;
  createdAt: string;
}

const h = (n: number) => new Date(Date.now() - 1000 * 60 * 60 * n).toISOString();
const d = (n: number) => new Date(Date.now() - 1000 * 60 * 60 * 24 * n).toISOString();

// 상품별 찜하기 (최신 상품일수록 적게)
export const MOCK_PRODUCT_LIKES: ProductLike[] = [
  // 오래된 상품 (5~10개 찜)
  { id: 'l1', productId: 'p19', userId: 'u7', createdAt: d(14) },
  { id: 'l2', productId: 'p19', userId: 'u8', createdAt: d(13) },
  { id: 'l3', productId: 'p19', userId: 'u9', createdAt: d(12) },
  { id: 'l4', productId: 'p19', userId: 'u10', createdAt: d(11) },
  { id: 'l5', productId: 'p19', userId: 'u11', createdAt: d(10) },
  { id: 'l6', productId: 'p19', userId: 'u12', createdAt: d(9) },
  { id: 'l7', productId: 'p19', userId: 'u13', createdAt: d(8) },
  { id: 'l8', productId: 'p19', userId: 'u14', createdAt: d(7) },
  { id: 'l9', productId: 'p19', userId: 'u15', createdAt: d(6) },
  { id: 'l10', productId: 'p19', userId: 'u16', createdAt: d(5) },

  { id: 'l11', productId: 'p33', userId: 'u7', createdAt: d(13) },
  { id: 'l12', productId: 'p33', userId: 'u9', createdAt: d(12) },
  { id: 'l13', productId: 'p33', userId: 'u10', createdAt: d(11) },
  { id: 'l14', productId: 'p33', userId: 'u12', createdAt: d(10) },
  { id: 'l15', productId: 'p33', userId: 'u14', createdAt: d(9) },
  { id: 'l16', productId: 'p33', userId: 'u15', createdAt: d(8) },
  { id: 'l17', productId: 'p33', userId: 'u17', createdAt: d(7) },
  { id: 'l18', productId: 'p33', userId: 'u18', createdAt: d(6) },
  { id: 'l19', productId: 'p33', userId: 'u19', createdAt: d(5) },
  { id: 'l20', productId: 'p33', userId: 'u20', createdAt: d(4) },

  { id: 'l21', productId: 'p5', userId: 'u8', createdAt: d(13) },
  { id: 'l22', productId: 'p5', userId: 'u11', createdAt: d(12) },
  { id: 'l23', productId: 'p5', userId: 'u13', createdAt: d(11) },
  { id: 'l24', productId: 'p5', userId: 'u15', createdAt: d(10) },
  { id: 'l25', productId: 'p5', userId: 'u16', createdAt: d(9) },
  { id: 'l26', productId: 'p5', userId: 'u17', createdAt: d(8) },
  { id: 'l27', productId: 'p5', userId: 'u18', createdAt: d(7) },
  { id: 'l28', productId: 'p5', userId: 'u19', createdAt: d(6) },
  { id: 'l29', productId: 'p5', userId: 'u20', createdAt: d(5) },
  { id: 'l30', productId: 'p5', userId: 'u7', createdAt: d(4) },

  // 중간 상품 (3~6개 찜)
  { id: 'l31', productId: 'p10', userId: 'u7', createdAt: d(9) },
  { id: 'l32', productId: 'p10', userId: 'u10', createdAt: d(8) },
  { id: 'l33', productId: 'p10', userId: 'u12', createdAt: d(7) },
  { id: 'l34', productId: 'p10', userId: 'u14', createdAt: d(6) },
  { id: 'l35', productId: 'p10', userId: 'u16', createdAt: d(5) },
  { id: 'l36', productId: 'p10', userId: 'u18', createdAt: d(4) },
  { id: 'l37', productId: 'p10', userId: 'u20', createdAt: d(3) },
  { id: 'l38', productId: 'p10', userId: 'u9', createdAt: d(2) },
  { id: 'l39', productId: 'p10', userId: 'u11', createdAt: d(1) },

  { id: 'l40', productId: 'p1', userId: 'u9', createdAt: d(4) },
  { id: 'l41', productId: 'p1', userId: 'u11', createdAt: d(4) },
  { id: 'l42', productId: 'p1', userId: 'u13', createdAt: d(3) },
  { id: 'l43', productId: 'p1', userId: 'u15', createdAt: d(3) },
  { id: 'l44', productId: 'p1', userId: 'u17', createdAt: d(2) },
  { id: 'l45', productId: 'p1', userId: 'u19', createdAt: d(2) },
  { id: 'l46', productId: 'p1', userId: 'u8', createdAt: d(1) },
  { id: 'l47', productId: 'p1', userId: 'u10', createdAt: d(1) },

  { id: 'l48', productId: 'p37', userId: 'u7', createdAt: d(9) },
  { id: 'l49', productId: 'p37', userId: 'u8', createdAt: d(8) },
  { id: 'l50', productId: 'p37', userId: 'u9', createdAt: d(7) },
  { id: 'l51', productId: 'p37', userId: 'u10', createdAt: d(6) },
  { id: 'l52', productId: 'p37', userId: 'u11', createdAt: d(5) },
  { id: 'l53', productId: 'p37', userId: 'u12', createdAt: d(4) },
  { id: 'l54', productId: 'p37', userId: 'u13', createdAt: d(3) },
  { id: 'l55', productId: 'p37', userId: 'u14', createdAt: d(2) },
  { id: 'l56', productId: 'p37', userId: 'u15', createdAt: d(1) },
  { id: 'l57', productId: 'p37', userId: 'u16', createdAt: h(12) },

  { id: 'l58', productId: 'p40', userId: 'u7', createdAt: d(11) },
  { id: 'l59', productId: 'p40', userId: 'u8', createdAt: d(10) },
  { id: 'l60', productId: 'p40', userId: 'u9', createdAt: d(9) },
  { id: 'l61', productId: 'p40', userId: 'u10', createdAt: d(8) },
  { id: 'l62', productId: 'p40', userId: 'u11', createdAt: d(7) },
  { id: 'l63', productId: 'p40', userId: 'u12', createdAt: d(6) },
  { id: 'l64', productId: 'p40', userId: 'u13', createdAt: d(5) },
  { id: 'l65', productId: 'p40', userId: 'u14', createdAt: d(4) },
  { id: 'l66', productId: 'p40', userId: 'u15', createdAt: d(3) },
  { id: 'l67', productId: 'p40', userId: 'u16', createdAt: d(2) },

  { id: 'l68', productId: 'p41', userId: 'u8', createdAt: d(7) },
  { id: 'l69', productId: 'p41', userId: 'u9', createdAt: d(6) },
  { id: 'l70', productId: 'p41', userId: 'u10', createdAt: d(5) },
  { id: 'l71', productId: 'p41', userId: 'u11', createdAt: d(4) },
  { id: 'l72', productId: 'p41', userId: 'u12', createdAt: d(3) },
  { id: 'l73', productId: 'p41', userId: 'u13', createdAt: d(2) },
  { id: 'l74', productId: 'p41', userId: 'u14', createdAt: d(1) },
  { id: 'l75', productId: 'p41', userId: 'u15', createdAt: h(12) },
  { id: 'l76', productId: 'p41', userId: 'u16', createdAt: h(6) },
  { id: 'l77', productId: 'p41', userId: 'u17', createdAt: h(3) },

  // 최신 상품 (0~2개 찜)
  { id: 'l78', productId: 'p7', userId: 'u10', createdAt: h(6) },
  { id: 'l79', productId: 'p7', userId: 'u12', createdAt: h(3) },

  { id: 'l80', productId: 'p35', userId: 'u8', createdAt: h(12) },

  { id: 'l81', productId: 'p9', userId: 'u18', createdAt: h(8) },

  { id: 'l82', productId: 'p27', userId: 'u14', createdAt: h(4) },

  { id: 'l83', productId: 'p45', userId: 'u19', createdAt: h(2) },

  // 세미콜론(u1)의 찜 목록 추가 (목업용)
  { id: 'l-u1-1', productId: 'p1', userId: 'u1', createdAt: d(1) },
  { id: 'l-u1-2', productId: 'p5', userId: 'u1', createdAt: d(2) },
  { id: 'l-u1-3', productId: 'p10', userId: 'u1', createdAt: d(3) },
];

/**
 * 특정 상품의 찜하기 목록 조회
 */
export const getProductLikes = (productId: string): ProductLike[] => 
  MOCK_PRODUCT_LIKES.filter(l => l.productId === productId);

/**
 * 특정 사용자의 찜 목록 조회
 */
export const getUserLikes = (userId: string): ProductLike[] =>
  MOCK_PRODUCT_LIKES.filter(l => l.userId === userId);

/**
 * 사용자가 특정 상품을 찜했는지 확인
 */
export const isProductLikedByUser = (productId: string, userId: string): boolean =>
  MOCK_PRODUCT_LIKES.some(l => l.productId === productId && l.userId === userId);
