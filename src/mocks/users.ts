/**
 * 사용자 관련 Mock 데이터
 */

import { MOCK_PRODUCTS, type Product } from './products';

/**
 * 정산 계좌 정보 인터페이스
 */
export interface SettlementAccount {
  bank: string;
  accountNumber: string;
  holder: string;
}

/**
 * 사용자 프로필 인터페이스
 */
export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  intro?: string;
  point: number;
  createdAt: string;
  settlementAccount?: SettlementAccount;
}

/**
 * 주문 상태
 */
export type OrderStatus = 
  | 'PENDING'    // 결제 대기
  | 'PAID'       // 결제 완료
  | 'SHIPPING'   // 배송중
  | 'DELIVERED'  // 배송 완료
  | 'CONFIRMED'  // 구매 확정
  | 'CANCELLED'  // 취소됨
  | 'REFUNDED';  // 환불됨

/**
 * 주문 내역 인터페이스
 */
export interface OrderHistory {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  product: Product;
  status: OrderStatus;
  createdAt: string;
  totalPrice: number;
  shippingFee: number;
  hasReview?: boolean;
}

/**
 * 주문 상태 라벨 매핑
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, { text: string; className: string }> = {
  PENDING: { text: '결제 대기', className: 'bg-yellow-100 text-yellow-700' },
  PAID: { text: '결제 완료', className: 'bg-blue-100 text-blue-700' },
  SHIPPING: { text: '배송중', className: 'bg-purple-100 text-purple-700' },
  DELIVERED: { text: '배송 완료', className: 'bg-green-100 text-green-700' },
  CONFIRMED: { text: '구매 확정', className: 'bg-neutral-100 text-neutral-700' },
  CANCELLED: { text: '취소됨', className: 'bg-red-100 text-red-700' },
  REFUNDED: { text: '환불됨', className: 'bg-orange-100 text-orange-700' },
};

/**
 * 상점 정보 인터페이스
 */
export interface Shop {
  id: string;
  userId: string;
  name: string;
  intro?: string;
  avatar?: string;
  rating: number;
  salesCount: number;
  activeListingCount: number;
  followerCount: number;
  createdAt: string;
}

// ----------------------------------------------------------------------
// Users Data (20 Users)
// ----------------------------------------------------------------------
export const MOCK_USERS_DATA: User[] = [
  // 1. Current User (정산 계좌 있음)
  { 
    id: 'u1', 
    email: 'user1@test.com', 
    nickname: '세미콜론', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u1', 
    intro: '취미 장비 거래를 좋아하는 세미콜론입니다.', 
    point: 15000, 
    createdAt: '2024-01-15T00:00:00.000Z',
    settlementAccount: {
      bank: '카카오뱅크',
      accountNumber: '3333-01-1234567',
      holder: '김세미'
    }
  },
  // 2-6. Power Sellers (Big 5)
  { id: 'u2', email: 'tech@test.com', nickname: '테크마스터', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u2', intro: 'IT 기기 전문', point: 500000, createdAt: '2023-01-10T00:00:00.000Z' },
  { id: 'u3', email: 'sound@test.com', nickname: '소리사랑', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u3', intro: '음향기기 수집가', point: 320000, createdAt: '2023-02-20T00:00:00.000Z' },
  { id: 'u4', email: 'camp@test.com', nickname: '숲속의집', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u4', intro: '감성 캠핑 용품', point: 120000, createdAt: '2023-03-15T00:00:00.000Z' },
  { id: 'u5', email: 'golf@test.com', nickname: '나이스샷', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u5', intro: '골프 클럽 거래', point: 890000, createdAt: '2023-04-05T00:00:00.000Z' },
  { id: 'u6', email: 'idol@test.com', nickname: '최애보관소', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u6', intro: 'K-POP 굿즈', point: 54000, createdAt: '2023-05-25T00:00:00.000Z' },
  // 7-20. General Users (Mixed)
  { id: 'u7', email: 'camera@test.com', nickname: '찰칵찰칵', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u7', point: 1000, createdAt: '2024-01-01T00:00:00.000Z' },
  { id: 'u8', email: 'bike@test.com', nickname: '라이더', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u8', point: 2000, createdAt: '2024-01-02T00:00:00.000Z' },
  { id: 'u9', email: 'book@test.com', nickname: '책벌레', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u9', point: 500, createdAt: '2024-01-03T00:00:00.000Z' },
  { id: 'u10', email: 'game@test.com', nickname: '겜돌이', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u10', point: 60000, createdAt: '2024-01-04T00:00:00.000Z' },
  { id: 'u11', email: 'fish@test.com', nickname: '강태공', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u11', point: 1500, createdAt: '2024-01-05T00:00:00.000Z' },
  { id: 'u12', email: 'cook@test.com', nickname: '요리왕', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u12', point: 8000, createdAt: '2024-01-06T00:00:00.000Z' },
  { id: 'u13', email: 'lego@test.com', nickname: '블럭쌓기', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u13', point: 25000, createdAt: '2024-01-07T00:00:00.000Z' },
  { id: 'u14', email: 'shoes@test.com', nickname: '슈즈홀릭', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u14', point: 4000, createdAt: '2024-01-08T00:00:00.000Z' },
  { id: 'u15', email: 'bag@test.com', nickname: '가방조아', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u15', point: 3000, createdAt: '2024-01-09T00:00:00.000Z' },
  { id: 'u16', email: 'plant@test.com', nickname: '식집사', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u16', point: 1200, createdAt: '2024-01-10T00:00:00.000Z' },
  { id: 'u17', email: 'tea@test.com', nickname: '차마시는날', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u17', point: 900, createdAt: '2024-01-11T00:00:00.000Z' },
  { id: 'u18', email: 'gym@test.com', nickname: '득근득근', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u18', point: 5500, createdAt: '2024-01-12T00:00:00.000Z' },
  { id: 'u19', email: 'art@test.com', nickname: '그림쟁이', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u19', point: 7000, createdAt: '2024-01-13T00:00:00.000Z' },
  { id: 'u20', email: 'retro@test.com', nickname: '레트로매니아', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u20', point: 18000, createdAt: '2024-01-14T00:00:00.000Z' },
];

export const MOCK_USER = MOCK_USERS_DATA[0];

// ----------------------------------------------------------------------
// Shops Data (20 Shops)
// ----------------------------------------------------------------------
export const MOCK_SHOPS: Shop[] = [
  // 1. Current User Shop
  { id: 's1', userId: 'u1', name: '세미콜론의 상점', intro: '깔끔한 거래 원해요', avatar: MOCK_USER.avatar, rating: 4.5, salesCount: 5, activeListingCount: 3, followerCount: 2, createdAt: '2024-01-15T00:00:00.000Z' },
  // 2-6. Power Sellers (Specialized)
  { id: 's2', userId: 'u2', name: 'IT월드', intro: '전자기기 전문 매입/판매합니다.', avatar: MOCK_USERS_DATA[1].avatar, rating: 4.9, salesCount: 154, activeListingCount: 12, followerCount: 342, createdAt: '2023-01-10T00:00:00.000Z' },
  { id: 's3', userId: 'u3', name: '하이파이클럽', intro: '진공관 앰프부터 최신 리시버까지.', avatar: MOCK_USERS_DATA[2].avatar, rating: 4.8, salesCount: 89, activeListingCount: 8, followerCount: 120, createdAt: '2023-02-20T00:00:00.000Z' },
  { id: 's4', userId: 'u4', name: '캠핑가자', intro: '노지 캠핑 전문 장비.', avatar: MOCK_USERS_DATA[3].avatar, rating: 4.7, salesCount: 210, activeListingCount: 25, followerCount: 560, createdAt: '2023-03-15T00:00:00.000Z' },
  { id: 's5', userId: 'u5', name: '그린필드', intro: '중고 골프채 명품관.', avatar: MOCK_USERS_DATA[4].avatar, rating: 4.6, salesCount: 67, activeListingCount: 15, followerCount: 88, createdAt: '2023-04-05T00:00:00.000Z' },
  { id: 's6', userId: 'u6', name: '덕질공간', intro: '한정판 앨범/포카 양도.', avatar: MOCK_USERS_DATA[5].avatar, rating: 5.0, salesCount: 320, activeListingCount: 40, followerCount: 1200, createdAt: '2023-05-25T00:00:00.000Z' },
  // 7-20. General Shops
  { id: 's7', userId: 'u7', name: '찰칵스튜디오', avatar: MOCK_USERS_DATA[6].avatar, rating: 4.2, salesCount: 12, activeListingCount: 2, followerCount: 5, createdAt: '2024-01-01T00:00:00.000Z' },
  { id: 's8', userId: 'u8', name: '달려라자전거', avatar: MOCK_USERS_DATA[7].avatar, rating: 4.0, salesCount: 8, activeListingCount: 1, followerCount: 3, createdAt: '2024-01-02T00:00:00.000Z' },
  { id: 's9', userId: 'u9', name: '중고서점', avatar: MOCK_USERS_DATA[8].avatar, rating: 4.5, salesCount: 45, activeListingCount: 5, followerCount: 12, createdAt: '2024-01-03T00:00:00.000Z' },
  { id: 's10', userId: 'u10', name: '레트로게임', avatar: MOCK_USERS_DATA[9].avatar, rating: 4.8, salesCount: 23, activeListingCount: 4, followerCount: 15, createdAt: '2024-01-04T00:00:00.000Z' },
  { id: 's11', userId: 'u11', name: '낚시왕', avatar: MOCK_USERS_DATA[10].avatar, rating: 3.5, salesCount: 3, activeListingCount: 1, followerCount: 1, createdAt: '2024-01-05T00:00:00.000Z' },
  { id: 's12', userId: 'u12', name: '주방용품떨이', avatar: MOCK_USERS_DATA[11].avatar, rating: 4.1, salesCount: 15, activeListingCount: 2, followerCount: 4, createdAt: '2024-01-06T00:00:00.000Z' },
  { id: 's13', userId: 'u13', name: '브릭나라', avatar: MOCK_USERS_DATA[12].avatar, rating: 4.9, salesCount: 67, activeListingCount: 6, followerCount: 45, createdAt: '2024-01-07T00:00:00.000Z' },
  { id: 's14', userId: 'u14', name: '나이키매니아', avatar: MOCK_USERS_DATA[13].avatar, rating: 4.3, salesCount: 22, activeListingCount: 3, followerCount: 8, createdAt: '2024-01-08T00:00:00.000Z' },
  { id: 's15', userId: 'u15', name: '럭셔리백', avatar: MOCK_USERS_DATA[14].avatar, rating: 4.7, salesCount: 9, activeListingCount: 2, followerCount: 6, createdAt: '2024-01-09T00:00:00.000Z' },
  { id: 's16', userId: 'u16', name: '풀꽃향기', avatar: MOCK_USERS_DATA[15].avatar, rating: 4.4, salesCount: 18, activeListingCount: 4, followerCount: 10, createdAt: '2024-01-10T00:00:00.000Z' },
  { id: 's17', userId: 'u17', name: '다도세트', avatar: MOCK_USERS_DATA[16].avatar, rating: 5.0, salesCount: 4, activeListingCount: 1, followerCount: 2, createdAt: '2024-01-11T00:00:00.000Z' },
  { id: 's18', userId: 'u18', name: '홈짐정리', avatar: MOCK_USERS_DATA[17].avatar, rating: 4.0, salesCount: 11, activeListingCount: 2, followerCount: 3, createdAt: '2024-01-12T00:00:00.000Z' },
  { id: 's19', userId: 'u19', name: '화방정리', avatar: MOCK_USERS_DATA[18].avatar, rating: 4.6, salesCount: 5, activeListingCount: 1, followerCount: 2, createdAt: '2024-01-13T00:00:00.000Z' },
  { id: 's20', userId: 'u20', name: '응답하라1990', avatar: MOCK_USERS_DATA[19].avatar, rating: 4.8, salesCount: 56, activeListingCount: 7, followerCount: 30, createdAt: '2024-01-14T00:00:00.000Z' },
  // 21-22. 빈 상점 (판매중인 상품 없음)
  { id: 's21', userId: 'u21', name: '새싹판매자', intro: '이제 막 시작했어요!', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u21', rating: 0, salesCount: 0, activeListingCount: 0, followerCount: 0, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 's22', userId: 'u22', name: '준비중상점', intro: '상품 준비중입니다.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u22', rating: 0, salesCount: 0, activeListingCount: 0, followerCount: 0, createdAt: '2026-01-05T00:00:00.000Z' },
];

// ----------------------------------------------------------------------
// Helper functions
// ----------------------------------------------------------------------
const d = (n: number) => new Date(Date.now() - 1000 * 60 * 60 * 24 * n).toISOString();
const getProduct = (id: string): Product => MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];

// 판매자 ID -> 상점 ID 매핑 (헬퍼)
export const SELLER_TO_SHOP: Record<string, string> = {
  's2': 's2', 's3': 's3', 's4': 's4', 's5': 's5', 's6': 's6',
  's7': 's7', 's8': 's8', 's9': 's9', 's10': 's10', 's11': 's11',
  's12': 's12', 's13': 's13', 's14': 's14', 's15': 's15', 's16': 's16',
  's17': 's17', 's18': 's18', 's19': 's19', 's20': 's20',
};

// ----------------------------------------------------------------------
// Order History (사용자별 2~10개, 상태 배리에이션)
// ----------------------------------------------------------------------
export const MOCK_ORDER_HISTORY: OrderHistory[] = [
  // u1 세미콜론 (구매 5개)
  { id: 'o1', buyerId: 'u1', sellerId: 's2', productId: 'p1', product: getProduct('p1'), status: 'CONFIRMED', createdAt: d(30), totalPrice: 1550000, shippingFee: 0, hasReview: true },
  { id: 'o2', buyerId: 'u1', sellerId: 's3', productId: 'p10', product: getProduct('p10'), status: 'DELIVERED', createdAt: d(15), totalPrice: 320000, shippingFee: 0, hasReview: false },
  { id: 'o3', buyerId: 'u1', sellerId: 's4', productId: 'p22', product: getProduct('p22'), status: 'SHIPPING', createdAt: d(3), totalPrice: 95000, shippingFee: 3000 },
  { id: 'o4', buyerId: 'u1', sellerId: 's6', productId: 'p37', product: getProduct('p37'), status: 'PAID', createdAt: d(1), totalPrice: 35000, shippingFee: 2000 },
  { id: 'o5', buyerId: 'u1', sellerId: 's5', productId: 'p32', product: getProduct('p32'), status: 'CANCELLED', createdAt: d(20), totalPrice: 150000, shippingFee: 3000 },

  // u7 찰칵찰칵 (구매 6개)
  { id: 'o6', buyerId: 'u7', sellerId: 's2', productId: 'p3', product: getProduct('p3'), status: 'CONFIRMED', createdAt: d(45), totalPrice: 1100000, shippingFee: 0, hasReview: true },
  { id: 'o7', buyerId: 'u7', sellerId: 's4', productId: 'p19', product: getProduct('p19'), status: 'CONFIRMED', createdAt: d(35), totalPrice: 1800000, shippingFee: 0, hasReview: true },
  { id: 'o8', buyerId: 'u7', sellerId: 's6', productId: 'p38', product: getProduct('p38'), status: 'DELIVERED', createdAt: d(10), totalPrice: 28000, shippingFee: 2000 },
  { id: 'o9', buyerId: 'u7', sellerId: 's3', productId: 'p12', product: getProduct('p12'), status: 'SHIPPING', createdAt: d(2), totalPrice: 420000, shippingFee: 4000 },
  { id: 'o10', buyerId: 'u7', sellerId: 's5', productId: 'p28', product: getProduct('p28'), status: 'REFUNDED', createdAt: d(25), totalPrice: 450000, shippingFee: 0 },
  { id: 'o11', buyerId: 'u7', sellerId: 's20', productId: 'p60', product: getProduct('p60'), status: 'PENDING', createdAt: d(0), totalPrice: 520000, shippingFee: 0 },

  // u8 라이더 (구매 3개)
  { id: 'o12', buyerId: 'u8', sellerId: 's5', productId: 'p29', product: getProduct('p29'), status: 'CONFIRMED', createdAt: d(40), totalPrice: 520000, shippingFee: 0, hasReview: true },
  { id: 'o13', buyerId: 'u8', sellerId: 's3', productId: 'p13', product: getProduct('p13'), status: 'DELIVERED', createdAt: d(12), totalPrice: 890000, shippingFee: 0 },
  { id: 'o14', buyerId: 'u8', sellerId: 's4', productId: 'p24', product: getProduct('p24'), status: 'SHIPPING', createdAt: d(4), totalPrice: 320000, shippingFee: 0 },

  // u9 책벌레 (구매 4개)
  { id: 'o15', buyerId: 'u9', sellerId: 's4', productId: 'p20', product: getProduct('p20'), status: 'CONFIRMED', createdAt: d(50), totalPrice: 2200000, shippingFee: 0, hasReview: true },
  { id: 'o16', buyerId: 'u9', sellerId: 's6', productId: 'p42', product: getProduct('p42'), status: 'CONFIRMED', createdAt: d(30), totalPrice: 120000, shippingFee: 3000, hasReview: true },
  { id: 'o17', buyerId: 'u9', sellerId: 's2', productId: 'p5', product: getProduct('p5'), status: 'SHIPPING', createdAt: d(5), totalPrice: 2800000, shippingFee: 0 },
  { id: 'o18', buyerId: 'u9', sellerId: 's3', productId: 'p16', product: getProduct('p16'), status: 'PAID', createdAt: d(1), totalPrice: 180000, shippingFee: 3000 },

  // u10 겜돌이 (구매 7개)
  { id: 'o19', buyerId: 'u10', sellerId: 's2', productId: 'p2', product: getProduct('p2'), status: 'CONFIRMED', createdAt: d(60), totalPrice: 1350000, shippingFee: 3000, hasReview: true },
  { id: 'o20', buyerId: 'u10', sellerId: 's2', productId: 'p4', product: getProduct('p4'), status: 'CONFIRMED', createdAt: d(45), totalPrice: 980000, shippingFee: 4000, hasReview: true },
  { id: 'o21', buyerId: 'u10', sellerId: 's3', productId: 'p11', product: getProduct('p11'), status: 'DELIVERED', createdAt: d(20), totalPrice: 480000, shippingFee: 0 },
  { id: 'o22', buyerId: 'u10', sellerId: 's6', productId: 'p40', product: getProduct('p40'), status: 'CONFIRMED', createdAt: d(15), totalPrice: 85000, shippingFee: 1500, hasReview: true },
  { id: 'o23', buyerId: 'u10', sellerId: 's4', productId: 'p21', product: getProduct('p21'), status: 'SHIPPING', createdAt: d(3), totalPrice: 85000, shippingFee: 3000 },
  { id: 'o24', buyerId: 'u10', sellerId: 's5', productId: 'p31', product: getProduct('p31'), status: 'PAID', createdAt: d(1), totalPrice: 280000, shippingFee: 4000 },
  { id: 'o25', buyerId: 'u10', sellerId: 's7', productId: 'p46', product: getProduct('p46'), status: 'CANCELLED', createdAt: d(10), totalPrice: 2200000, shippingFee: 0 },

  // u11 강태공 (구매 2개)
  { id: 'o26', buyerId: 'u11', sellerId: 's4', productId: 'p25', product: getProduct('p25'), status: 'CONFIRMED', createdAt: d(30), totalPrice: 380000, shippingFee: 4000, hasReview: true },
  { id: 'o27', buyerId: 'u11', sellerId: 's12', productId: 'p52', product: getProduct('p52'), status: 'DELIVERED', createdAt: d(8), totalPrice: 280000, shippingFee: 0 },

  // u12 요리왕 (구매 5개)
  { id: 'o28', buyerId: 'u12', sellerId: 's4', productId: 'p26', product: getProduct('p26'), status: 'CONFIRMED', createdAt: d(25), totalPrice: 65000, shippingFee: 3000, hasReview: true },
  { id: 'o29', buyerId: 'u12', sellerId: 's6', productId: 'p39', product: getProduct('p39'), status: 'CONFIRMED', createdAt: d(18), totalPrice: 45000, shippingFee: 1500, hasReview: true },
  { id: 'o30', buyerId: 'u12', sellerId: 's3', productId: 'p15', product: getProduct('p15'), status: 'SHIPPING', createdAt: d(4), totalPrice: 550000, shippingFee: 5000 },
  { id: 'o31', buyerId: 'u12', sellerId: 's17', productId: 'p57', product: getProduct('p57'), status: 'PAID', createdAt: d(1), totalPrice: 450000, shippingFee: 0 },
  { id: 'o32', buyerId: 'u12', sellerId: 's2', productId: 'p6', product: getProduct('p6'), status: 'REFUNDED', createdAt: d(35), totalPrice: 1150000, shippingFee: 0 },

  // u13 블럭쌓기 (구매 4개)
  { id: 'o33', buyerId: 'u13', sellerId: 's2', productId: 'p7', product: getProduct('p7'), status: 'CONFIRMED', createdAt: d(40), totalPrice: 1650000, shippingFee: 5000, hasReview: true },
  { id: 'o34', buyerId: 'u13', sellerId: 's5', productId: 'p33', product: getProduct('p33'), status: 'CONFIRMED', createdAt: d(28), totalPrice: 650000, shippingFee: 0, hasReview: true },
  { id: 'o35', buyerId: 'u13', sellerId: 's6', productId: 'p43', product: getProduct('p43'), status: 'DELIVERED', createdAt: d(10), totalPrice: 95000, shippingFee: 3000 },
  { id: 'o36', buyerId: 'u13', sellerId: 's19', productId: 'p59', product: getProduct('p59'), status: 'SHIPPING', createdAt: d(2), totalPrice: 4500000, shippingFee: 0 },

  // u14 슈즈홀릭 (구매 3개)
  { id: 'o37', buyerId: 'u14', sellerId: 's5', productId: 'p30', product: getProduct('p30'), status: 'CONFIRMED', createdAt: d(55), totalPrice: 780000, shippingFee: 0, hasReview: true },
  { id: 'o38', buyerId: 'u14', sellerId: 's3', productId: 'p14', product: getProduct('p14'), status: 'DELIVERED', createdAt: d(15), totalPrice: 1450000, shippingFee: 0 },
  { id: 'o39', buyerId: 'u14', sellerId: 's18', productId: 'p58', product: getProduct('p58'), status: 'PAID', createdAt: d(1), totalPrice: 650000, shippingFee: 0 },

  // u15 가방조아 (구매 8개)
  { id: 'o40', buyerId: 'u15', sellerId: 's2', productId: 'p8', product: getProduct('p8'), status: 'CONFIRMED', createdAt: d(50), totalPrice: 850000, shippingFee: 0, hasReview: true },
  { id: 'o41', buyerId: 'u15', sellerId: 's4', productId: 'p23', product: getProduct('p23'), status: 'CONFIRMED', createdAt: d(38), totalPrice: 280000, shippingFee: 5000, hasReview: true },
  { id: 'o42', buyerId: 'u15', sellerId: 's6', productId: 'p41', product: getProduct('p41'), status: 'CONFIRMED', createdAt: d(22), totalPrice: 180000, shippingFee: 0, hasReview: true },
  { id: 'o43', buyerId: 'u15', sellerId: 's5', productId: 'p34', product: getProduct('p34'), status: 'DELIVERED', createdAt: d(12), totalPrice: 180000, shippingFee: 5000 },
  { id: 'o44', buyerId: 'u15', sellerId: 's3', productId: 'p17', product: getProduct('p17'), status: 'SHIPPING', createdAt: d(4), totalPrice: 420000, shippingFee: 0 },
  { id: 'o45', buyerId: 'u15', sellerId: 's7', productId: 'p47', product: getProduct('p47'), status: 'PAID', createdAt: d(1), totalPrice: 1850000, shippingFee: 0 },
  { id: 'o46', buyerId: 'u15', sellerId: 's8', productId: 'p48', product: getProduct('p48'), status: 'CANCELLED', createdAt: d(30), totalPrice: 850000, shippingFee: 0 },
  { id: 'o47', buyerId: 'u15', sellerId: 's10', productId: 'p50', product: getProduct('p50'), status: 'REFUNDED', createdAt: d(18), totalPrice: 780000, shippingFee: 3000 },

  // u16 식집사 (구매 4개)
  { id: 'o48', buyerId: 'u16', sellerId: 's3', productId: 'p10', product: getProduct('p10'), status: 'CONFIRMED', createdAt: d(42), totalPrice: 320000, shippingFee: 0, hasReview: true },
  { id: 'o49', buyerId: 'u16', sellerId: 's5', productId: 'p35', product: getProduct('p35'), status: 'DELIVERED', createdAt: d(14), totalPrice: 85000, shippingFee: 3000 },
  { id: 'o50', buyerId: 'u16', sellerId: 's6', productId: 'p44', product: getProduct('p44'), status: 'SHIPPING', createdAt: d(3), totalPrice: 65000, shippingFee: 2500 },
  { id: 'o51', buyerId: 'u16', sellerId: 's4', productId: 'p27', product: getProduct('p27'), status: 'PENDING', createdAt: d(0), totalPrice: 120000, shippingFee: 3000 },

  // u17 차마시는날 (구매 3개)
  { id: 'o52', buyerId: 'u17', sellerId: 's4', productId: 'p24', product: getProduct('p24'), status: 'CONFIRMED', createdAt: d(48), totalPrice: 320000, shippingFee: 0, hasReview: true },
  { id: 'o53', buyerId: 'u17', sellerId: 's6', productId: 'p42', product: getProduct('p42'), status: 'DELIVERED', createdAt: d(20), totalPrice: 120000, shippingFee: 3000 },
  { id: 'o54', buyerId: 'u17', sellerId: 's13', productId: 'p53', product: getProduct('p53'), status: 'PAID', createdAt: d(2), totalPrice: 850000, shippingFee: 0 },

  // u18 득근득근 (구매 5개)
  { id: 'o55', buyerId: 'u18', sellerId: 's2', productId: 'p5', product: getProduct('p5'), status: 'CONFIRMED', createdAt: d(55), totalPrice: 2800000, shippingFee: 0, hasReview: true },
  { id: 'o56', buyerId: 'u18', sellerId: 's4', productId: 'p19', product: getProduct('p19'), status: 'CONFIRMED', createdAt: d(40), totalPrice: 1800000, shippingFee: 0, hasReview: true },
  { id: 'o57', buyerId: 'u18', sellerId: 's5', productId: 'p28', product: getProduct('p28'), status: 'DELIVERED', createdAt: d(18), totalPrice: 450000, shippingFee: 0 },
  { id: 'o58', buyerId: 'u18', sellerId: 's6', productId: 'p37', product: getProduct('p37'), status: 'SHIPPING', createdAt: d(4), totalPrice: 35000, shippingFee: 2000 },
  { id: 'o59', buyerId: 'u18', sellerId: 's20', productId: 'p61', product: getProduct('p61'), status: 'PENDING', createdAt: d(0), totalPrice: 380000, shippingFee: 3000 },

  // u19 그림쟁이 (구매 4개)
  { id: 'o60', buyerId: 'u19', sellerId: 's3', productId: 'p13', product: getProduct('p13'), status: 'CONFIRMED', createdAt: d(38), totalPrice: 890000, shippingFee: 0, hasReview: true },
  { id: 'o61', buyerId: 'u19', sellerId: 's5', productId: 'p33', product: getProduct('p33'), status: 'DELIVERED', createdAt: d(22), totalPrice: 650000, shippingFee: 0 },
  { id: 'o62', buyerId: 'u19', sellerId: 's4', productId: 'p22', product: getProduct('p22'), status: 'SHIPPING', createdAt: d(5), totalPrice: 95000, shippingFee: 3000 },
  { id: 'o63', buyerId: 'u19', sellerId: 's2', productId: 'p1', product: getProduct('p1'), status: 'CANCELLED', createdAt: d(12), totalPrice: 1550000, shippingFee: 0 },

  // u20 레트로매니아 (구매 6개)
  { id: 'o64', buyerId: 'u20', sellerId: 's2', productId: 'p3', product: getProduct('p3'), status: 'CONFIRMED', createdAt: d(52), totalPrice: 1100000, shippingFee: 0, hasReview: true },
  { id: 'o65', buyerId: 'u20', sellerId: 's3', productId: 'p11', product: getProduct('p11'), status: 'CONFIRMED', createdAt: d(35), totalPrice: 480000, shippingFee: 0, hasReview: true },
  { id: 'o66', buyerId: 'u20', sellerId: 's6', productId: 'p40', product: getProduct('p40'), status: 'DELIVERED', createdAt: d(16), totalPrice: 85000, shippingFee: 1500 },
  { id: 'o67', buyerId: 'u20', sellerId: 's4', productId: 'p20', product: getProduct('p20'), status: 'SHIPPING', createdAt: d(4), totalPrice: 2200000, shippingFee: 0 },
  { id: 'o68', buyerId: 'u20', sellerId: 's5', productId: 'p29', product: getProduct('p29'), status: 'PAID', createdAt: d(1), totalPrice: 520000, shippingFee: 0 },
  { id: 'o69', buyerId: 'u20', sellerId: 's7', productId: 'p46', product: getProduct('p46'), status: 'REFUNDED', createdAt: d(28), totalPrice: 2200000, shippingFee: 0 },
];

/**
 * 특정 사용자의 구매 내역 조회
 */
export const getUserPurchases = (userId: string): OrderHistory[] =>
  MOCK_ORDER_HISTORY.filter(o => o.buyerId === userId);

/**
 * 특정 판매자의 판매 내역 조회
 */
export const getSellerOrders = (sellerId: string): OrderHistory[] =>
  MOCK_ORDER_HISTORY.filter(o => o.sellerId === sellerId);

/**
 * 현재 사용자(u1)의 판매 상품 목록
 * - SOLD_OUT: 구매확정된 판매완료 상품
 * - RESERVED: 결제 완료됐지만 구매확정 안 된 상품 (정책: 예약중으로 표시)
 * - ON_SALE: 판매중 상품
 */
const IMG = {
  chair: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=500',
  earphone: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=500',
  mug: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=500',
  lens: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=500',
  watch: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=500',
  gopro: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=500',
  lego: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=500',
};

const u1_d = (n: number) => new Date(Date.now() - 1000 * 60 * 60 * 24 * n).toISOString();

export const MOCK_SALES_PRODUCTS = [
  // 판매완료 (SOLD_OUT) - 구매확정된 상품 3개
  {
    id: 'sp1',
    categoryId: 'chair',
    sellerId: 'u1',
    title: '헬리녹스 체어제로 블랙',
    description: '초경량 백패킹 체어입니다. 2회 사용했고 상태 좋습니다.',
    price: 180000,
    shippingFee: 3000,
    conditionStatus: 'MINOR_WEAR',
    saleStatus: 'SOLD_OUT',
    viewCount: 156,
    likeCount: 12,
    commentCount: 4,
    createdAt: u1_d(45),
    image: IMG.chair,
    images: [IMG.chair],
    
    isSafe: true,
  },
  {
    id: 'sp2',
    categoryId: 'audio-headphone',
    sellerId: 'u1',
    title: '소니 WF-1000XM5 무선이어폰',
    description: '소니 플래그십 이어폰. 박스 풀구성.',
    price: 280000,
    shippingFee: 0,
    conditionStatus: 'NO_WEAR',
    saleStatus: 'SOLD_OUT',
    viewCount: 234,
    likeCount: 18,
    commentCount: 6,
    createdAt: u1_d(30),
    image: IMG.earphone,
    images: [IMG.earphone],
    
    isSafe: true,
  },
  {
    id: 'sp3',
    categoryId: 'cookware',
    sellerId: 'u1',
    title: '스노우피크 티타늄 싱글머그 450',
    description: '캠핑 필수템. 깨끗하게 사용했습니다.',
    price: 45000,
    shippingFee: 2500,
    conditionStatus: 'MINOR_WEAR',
    saleStatus: 'SOLD_OUT',
    viewCount: 89,
    likeCount: 7,
    commentCount: 2,
    createdAt: u1_d(20),
    image: IMG.mug,
    images: [IMG.mug],
    
    isSafe: true,
  },
  
  // 예약중 (RESERVED) - 결제 완료됐지만 구매확정 안 된 상품 2개
  {
    id: 'sp4',
    categoryId: 'lens',
    sellerId: 'u1',
    title: '캐논 RF 35mm F1.8 IS STM 렌즈',
    description: 'RF 마운트 단렌즈. 풍경/인물 모두 좋습니다.',
    price: 450000,
    shippingFee: 0,
    conditionStatus: 'MINOR_WEAR',
    saleStatus: 'RESERVED',
    viewCount: 178,
    likeCount: 14,
    commentCount: 5,
    createdAt: u1_d(10),
    image: IMG.lens,
    images: [IMG.lens],
    
    isSafe: true,
  },
  {
    id: 'sp5',
    categoryId: 'wearable',
    sellerId: 'u1',
    title: '애플워치 SE 2세대 40mm 미드나이트',
    description: '아이폰 바꾸면서 정리합니다.',
    price: 180000,
    shippingFee: 0,
    conditionStatus: 'NO_WEAR',
    saleStatus: 'RESERVED',
    viewCount: 134,
    likeCount: 9,
    commentCount: 3,
    createdAt: u1_d(5),
    image: IMG.watch,
    images: [IMG.watch],
    
    isSafe: true,
  },
  
  // 판매중 (ON_SALE) - 현재 판매중인 상품 2개
  {
    id: 'sp6',
    categoryId: 'actioncam',
    sellerId: 'u1',
    title: '고프로 맥스 360도 카메라',
    description: '360도 촬영 가능한 액션캠. 여행용으로 구매했다가 거의 못 썼어요.',
    price: 320000,
    shippingFee: 3000,
    conditionStatus: 'NO_WEAR',
    saleStatus: 'ON_SALE',
    viewCount: 67,
    likeCount: 5,
    commentCount: 2,
    createdAt: u1_d(3),
    image: IMG.gopro,
    images: [IMG.gopro],
    
    isSafe: true,
  },
  {
    id: 'sp7',
    categoryId: 'goods-stray',
    sellerId: 'u1',
    title: '레고 테크닉 포르쉐 911 GT3 RS',
    description: '미개봉 새제품. 선물받았는데 조립할 시간이 없네요.',
    price: 150000,
    shippingFee: 4000,
    conditionStatus: 'SEALED',
    saleStatus: 'ON_SALE',
    viewCount: 45,
    likeCount: 3,
    commentCount: 1,
    createdAt: u1_d(1),
    image: IMG.lego,
    images: [IMG.lego],
    
    isSafe: true,
  },
];

