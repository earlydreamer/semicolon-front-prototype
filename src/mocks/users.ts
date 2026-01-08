/**
 * 사용자 관련 Mock 데이터
 */

import type { Product } from './products';

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
  | 'CANCELLED'; // 취소됨

/**
 * 주문 내역 인터페이스
 */
export interface OrderHistory {
  id: string;
  productId: string;
  product: Product;
  status: OrderStatus;
  createdAt: string;
  totalPrice: number;
  shippingFee: number;
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
};

/**
 * Mock 사용자 데이터
 */
export const MOCK_USER: User = {
  id: 'u1',
  email: 'semicolon@example.com',
  nickname: '세미콜론',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  intro: '취미 장비 거래를 좋아하는 세미콜론입니다. 매너 거래 지향합니다!',
  point: 15000,
  createdAt: '2024-01-15T00:00:00.000Z',
};

/**
 * Mock 주문 내역 데이터
 */
export const MOCK_ORDER_HISTORY: OrderHistory[] = [
  {
    id: 'order-001',
    productId: '2',
    product: {
      id: '2',
      categoryId: 'audio',
      sellerId: 's2',
      title: '소니 WH-1000XM5 노이즈 캔슬링 헤드폰',
      price: 320000,
      shippingFee: 0,
      conditionStatus: 'NO_WEAR',
      saleStatus: 'SOLD_OUT',
      viewCount: 85,
      likeCount: 8,
      commentCount: 2,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      location: '서울시 마포구',
      isSafe: true,
      description: '소니 헤드폰 팝니다.',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=500',
      images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800'],
      seller: { id: 's2', userId: 'u2', nickname: '음향기기덕후', rating: 3.5, salesCount: 5, activeListingCount: 1 }
    },
    status: 'DELIVERED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    totalPrice: 320000,
    shippingFee: 0,
  },
  {
    id: 'order-002',
    productId: '8',
    product: {
      id: '8',
      categoryId: 'idol-girl',
      sellerId: 's8',
      title: '뉴진스 How Sweet 한정판 앨범 미개봉',
      price: 45000,
      shippingFee: 1800,
      conditionStatus: 'SEALED',
      saleStatus: 'SOLD_OUT',
      viewCount: 500,
      likeCount: 100,
      commentCount: 20,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      location: '인천시 연수구',
      isSafe: false,
      description: '뉴진스 How Sweet 한정판 앨범 미개봉입니다.',
      image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?auto=format&fit=crop&q=80&w=500',
      images: ['https://images.unsplash.com/photo-1619983081563-430f63602796?auto=format&fit=crop&q=80&w=800'],
      seller: { id: 's8', userId: 'u8', nickname: '버니즈', rating: 4.9, salesCount: 120, activeListingCount: 15 }
    },
    status: 'CONFIRMED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    totalPrice: 46800,
    shippingFee: 1800,
  },
];

/**
 * Mock 판매 내역 (현재 사용자가 판매 중인 상품)
 */
export const MOCK_SALES_PRODUCTS = [
  {
    id: '101',
    categoryId: 'tent',
    sellerId: 'u1',
    title: '코베아 듀얼 돔 텐트 4인용',
    price: 450000,
    shippingFee: 0,
    conditionStatus: 'MINOR_WEAR',
    saleStatus: 'ON_SALE',
    viewCount: 28,
    likeCount: 3,
    commentCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    location: '서울시 강남구',
    isSafe: true,
    description: '코베아 듀얼 돔 텐트입니다. 5회 사용했고 상태 좋습니다.',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=500',
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800'],
  },
  {
    id: '102',
    categoryId: 'guitar',
    sellerId: 'u1',
    title: '펜더 스트라토캐스터 MIM',
    price: 850000,
    shippingFee: 5000,
    conditionStatus: 'NO_WEAR',
    saleStatus: 'RESERVED',
    viewCount: 156,
    likeCount: 22,
    commentCount: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    location: '서울시 강남구',
    isSafe: true,
    description: '펜더 멕시코 스트라토캐스터입니다. 거의 새것 상태.',
    image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&q=80&w=500',
    images: ['https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&q=80&w=800'],
  },
  {
    id: '103',
    categoryId: 'camera',
    sellerId: 'u1',
    title: '소니 A7C 바디 + 렌즈 세트',
    price: 2200000,
    shippingFee: 0,
    conditionStatus: 'NO_WEAR',
    saleStatus: 'SOLD_OUT',
    viewCount: 342,
    likeCount: 45,
    commentCount: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    location: '서울시 강남구',
    isSafe: true,
    description: '소니 A7C 풀프레임 미러리스입니다.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=500',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800'],
  },
];

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

/**
 * Mock 상점 데이터
 */
export const MOCK_SHOPS: Shop[] = [
  {
    id: 's1',
    userId: 'u1',
    name: '애플러버',
    intro: '애플 제품 전문 상점입니다. 정품만 취급합니다.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100',
    rating: 4.5,
    salesCount: 52,
    activeListingCount: 3,
    followerCount: 128,
    createdAt: '2023-06-15T00:00:00.000Z',
  },
  {
    id: 's2',
    userId: 'u2',
    name: '음향기기덕후',
    intro: '오디오 장비 전문입니다. 헤드폰, 이어폰, 스피커 등',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    rating: 3.5,
    salesCount: 5,
    activeListingCount: 1,
    followerCount: 23,
    createdAt: '2024-01-20T00:00:00.000Z',
  },
  {
    id: 's3',
    userId: 'u3',
    name: '캠핑매니아',
    intro: '캠핑 장비 전문 매장! 텐트, 타프, 체어 등 다양한 장비 판매중',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
    rating: 4.8,
    salesCount: 89,
    activeListingCount: 12,
    followerCount: 456,
    createdAt: '2022-11-01T00:00:00.000Z',
  },
  {
    id: 's8',
    userId: 'u8',
    name: '버니즈',
    intro: '아이돌 앨범/굿즈 전문! 뉴진스, 에스파, 르세라핌 등',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
    rating: 4.9,
    salesCount: 120,
    activeListingCount: 15,
    followerCount: 892,
    createdAt: '2023-03-10T00:00:00.000Z',
  },
];
