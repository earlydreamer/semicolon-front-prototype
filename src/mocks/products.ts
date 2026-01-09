export type ConditionStatus = 'SEALED' | 'NO_WEAR' | 'MINOR_WEAR' | 'VISIBLE_WEAR' | 'DAMAGED';
export type SaleStatus = 'ON_SALE' | 'RESERVED' | 'SOLD_OUT' | 'HIDDEN' | 'BLOCKED';

export interface ProductSeller {
  id: string;
  userId: string;
  nickname: string;
  avatar?: string;
  rating: number;
  intro?: string;
  salesCount: number;
  activeListingCount: number;
}

export interface ProductComment {
  id: number;
  productId: string;
  parentId: number | null;
  userId: string;
  user: { nickname: string; avatar?: string; };
  content: string;
  createdAt: string;
  replies?: ProductComment[];
}

export interface Product {
  id: string;
  categoryId: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  shippingFee: number;
  conditionStatus: ConditionStatus;
  saleStatus: SaleStatus;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt?: string;
  image: string;
  images: string[];
  location: string;
  isSafe: boolean;
  seller: ProductSeller;
  comments?: ProductComment[];
}

// 판매자 정보 헬퍼
const SELLERS: Record<string, ProductSeller> = {
  s2: { id: 's2', userId: 'u2', nickname: '테크마스터', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u2', rating: 4.9, intro: '전자기기 전문', salesCount: 154, activeListingCount: 12 },
  s3: { id: 's3', userId: 'u3', nickname: '소리사랑', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u3', rating: 4.8, intro: '음향기기 수집가', salesCount: 89, activeListingCount: 8 },
  s4: { id: 's4', userId: 'u4', nickname: '숲속의집', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u4', rating: 4.7, intro: '감성 캠핑 용품', salesCount: 210, activeListingCount: 25 },
  s5: { id: 's5', userId: 'u5', nickname: '나이스샷', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u5', rating: 4.6, intro: '골프 클럽 거래', salesCount: 67, activeListingCount: 15 },
  s6: { id: 's6', userId: 'u6', nickname: '최애보관소', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u6', rating: 5.0, intro: 'K-POP 굿즈', salesCount: 320, activeListingCount: 40 },
  s7: { id: 's7', userId: 'u7', nickname: '찰칵찰칵', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u7', rating: 4.2, salesCount: 12, activeListingCount: 2 },
  s8: { id: 's8', userId: 'u8', nickname: '라이더', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u8', rating: 4.0, salesCount: 8, activeListingCount: 1 },
  s9: { id: 's9', userId: 'u9', nickname: '책벌레', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u9', rating: 4.5, salesCount: 45, activeListingCount: 5 },
  s10: { id: 's10', userId: 'u10', nickname: '겜돌이', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u10', rating: 4.8, salesCount: 23, activeListingCount: 4 },
  s11: { id: 's11', userId: 'u11', nickname: '강태공', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u11', rating: 3.5, salesCount: 3, activeListingCount: 1 },
  s12: { id: 's12', userId: 'u12', nickname: '요리왕', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u12', rating: 4.1, salesCount: 15, activeListingCount: 2 },
  s13: { id: 's13', userId: 'u13', nickname: '블럭쌓기', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u13', rating: 4.9, salesCount: 67, activeListingCount: 6 },
  s14: { id: 's14', userId: 'u14', nickname: '슈즈홀릭', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u14', rating: 4.3, salesCount: 22, activeListingCount: 3 },
  s15: { id: 's15', userId: 'u15', nickname: '가방조아', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u15', rating: 4.7, salesCount: 9, activeListingCount: 2 },
  s16: { id: 's16', userId: 'u16', nickname: '식집사', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u16', rating: 4.4, salesCount: 18, activeListingCount: 4 },
  s17: { id: 's17', userId: 'u17', nickname: '차마시는날', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u17', rating: 5.0, salesCount: 4, activeListingCount: 1 },
  s18: { id: 's18', userId: 'u18', nickname: '득근득근', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u18', rating: 4.0, salesCount: 11, activeListingCount: 2 },
  s19: { id: 's19', userId: 'u19', nickname: '그림쟁이', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u19', rating: 4.6, salesCount: 5, activeListingCount: 1 },
  s20: { id: 's20', userId: 'u20', nickname: '레트로매니아', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u20', rating: 4.8, salesCount: 56, activeListingCount: 7 },
};

const IMG = {
  phone: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=500',
  laptop: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=500',
  tablet: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=500',
  headphone: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=500',
  speaker: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=500',
  amp: 'https://images.unsplash.com/photo-1558470598-a5dda9640f68?auto=format&fit=crop&q=80&w=500',
  tent: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=500',
  chair: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=500',
  lamp: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=500',
  golf: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=500',
  album: 'https://images.unsplash.com/photo-1619983081563-430f63602796?auto=format&fit=crop&q=80&w=500',
  photocard: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=500',
  camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=500',
};

const LOC = ['서울시 강남구', '서울시 마포구', '경기도 성남시', '부산시 해운대구', '인천시 연수구', '대전시 유성구', '강원도 춘천시', '대구시 수성구'];
const h = (n: number) => new Date(Date.now() - 1000 * 60 * 60 * n).toISOString();
const d = (n: number) => new Date(Date.now() - 1000 * 60 * 60 * 24 * n).toISOString();

export const MOCK_PRODUCTS: Product[] = [
  // ===== s2 IT월드 (전자기기) 9개 =====
  { id: 'p1', categoryId: 'phone-apple', sellerId: 's2', title: '아이폰 15 프로 맥스 256GB 자급제', description: '미개봉 새제품입니다. 자급제.', price: 1550000, shippingFee: 0, conditionStatus: 'SEALED', saleStatus: 'ON_SALE', viewCount: 320, likeCount: 8, commentCount: 2, createdAt: d(5), image: IMG.phone, images: [IMG.phone], location: LOC[0], isSafe: true, seller: SELLERS.s2 },
  { id: 'p2', categoryId: 'phone-samsung', sellerId: 's2', title: '갤럭시 S24 울트라 512GB 티타늄블랙', description: '개봉 후 1회 통화만 했습니다.', price: 1350000, shippingFee: 3000, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 180, likeCount: 6, commentCount: 1, createdAt: d(4), image: IMG.phone, images: [IMG.phone], location: LOC[0], isSafe: true, seller: SELLERS.s2 },
  { id: 'p3', categoryId: 'tablet-ipad', sellerId: 's2', title: '아이패드 프로 12.9 M2 256GB', description: '애플케어 2025년까지.', price: 1100000, shippingFee: 0, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 95, likeCount: 5, commentCount: 2, createdAt: d(7), image: IMG.tablet, images: [IMG.tablet], location: LOC[1], isSafe: true, seller: SELLERS.s2 },
  { id: 'p4', categoryId: 'tablet-galaxy', sellerId: 's2', title: '갤럭시탭 S9 울트라 256GB', description: '키보드 커버 포함.', price: 980000, shippingFee: 4000, conditionStatus: 'NO_WEAR', saleStatus: 'RESERVED', viewCount: 67, likeCount: 3, commentCount: 0, createdAt: d(3), image: IMG.tablet, images: [IMG.tablet], location: LOC[2], isSafe: true, seller: SELLERS.s2 },
  { id: 'p5', categoryId: 'laptop-macbook', sellerId: 's2', title: '맥북 프로 14인치 M3 Pro 18GB', description: '박스 풀구성.', price: 2800000, shippingFee: 0, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 412, likeCount: 10, commentCount: 3, createdAt: d(14), image: IMG.laptop, images: [IMG.laptop], location: LOC[0], isSafe: true, seller: SELLERS.s2 },
  { id: 'p6', categoryId: 'laptop-macbook', sellerId: 's2', title: '맥북 에어 M2 256GB 미드나이트', description: '가벼운 외출용.', price: 1150000, shippingFee: 0, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 89, likeCount: 4, commentCount: 1, createdAt: d(6), image: IMG.laptop, images: [IMG.laptop], location: LOC[3], isSafe: true, seller: SELLERS.s2 },
  { id: 'p7', categoryId: 'laptop-gram', sellerId: 's2', title: 'LG 그램 17인치 2024 i7', description: '업무용 최적화.', price: 1650000, shippingFee: 5000, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 56, likeCount: 2, commentCount: 0, createdAt: d(2), image: IMG.laptop, images: [IMG.laptop], location: LOC[4], isSafe: true, seller: SELLERS.s2 },
  { id: 'p8', categoryId: 'wearable', sellerId: 's2', title: '애플워치 울트라2 49mm', description: '등산용 구매.', price: 850000, shippingFee: 0, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 78, likeCount: 3, commentCount: 1, createdAt: d(4), image: IMG.phone, images: [IMG.phone], location: LOC[5], isSafe: true, seller: SELLERS.s2 },
  { id: 'p9', categoryId: 'tent', sellerId: 's2', title: '코베아 고스트 플러스 텐트', description: '전자기기 상점이지만 캠핑도 해봅니다.', price: 450000, shippingFee: 0, conditionStatus: 'VISIBLE_WEAR', saleStatus: 'ON_SALE', viewCount: 23, likeCount: 1, commentCount: 0, createdAt: d(1), image: IMG.tent, images: [IMG.tent], location: LOC[6], isSafe: false, seller: SELLERS.s2 },
  
  // ===== s3 하이파이클럽 (음향기기) 9개 =====
  { id: 'p10', categoryId: 'audio-headphone', sellerId: 's3', title: '소니 WH-1000XM5 무선 헤드폰', description: '노캔 최강.', price: 320000, shippingFee: 0, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 245, likeCount: 9, commentCount: 3, createdAt: d(10), image: IMG.headphone, images: [IMG.headphone], location: LOC[1], isSafe: true, seller: SELLERS.s3 },
  { id: 'p11', categoryId: 'audio-headphone', sellerId: 's3', title: '에어팟 맥스 스페이스그레이', description: '케이스 포함.', price: 480000, shippingFee: 0, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 167, likeCount: 7, commentCount: 2, createdAt: d(8), image: IMG.headphone, images: [IMG.headphone], location: LOC[1], isSafe: true, seller: SELLERS.s3 },
  { id: 'p12', categoryId: 'audio-headphone', sellerId: 's3', title: '젠하이저 HD660S2', description: '오픈형 레퍼런스.', price: 420000, shippingFee: 4000, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 98, likeCount: 5, commentCount: 1, createdAt: d(6), image: IMG.headphone, images: [IMG.headphone], location: LOC[2], isSafe: true, seller: SELLERS.s3 },
  { id: 'p13', categoryId: 'audio-speaker', sellerId: 's3', title: 'B&W 606 S2 부크쉘프 스피커', description: '우아한 소리.', price: 890000, shippingFee: 0, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 134, likeCount: 6, commentCount: 2, createdAt: d(12), image: IMG.speaker, images: [IMG.speaker], location: LOC[1], isSafe: true, seller: SELLERS.s3 },
  { id: 'p14', categoryId: 'audio-speaker', sellerId: 's3', title: 'KEF LS50 Meta 화이트', description: '동축 유닛 최고.', price: 1450000, shippingFee: 0, conditionStatus: 'MINOR_WEAR', saleStatus: 'RESERVED', viewCount: 89, likeCount: 4, commentCount: 1, createdAt: d(5), image: IMG.speaker, images: [IMG.speaker], location: LOC[3], isSafe: true, seller: SELLERS.s3 },
  { id: 'p15', categoryId: 'audio-amp', sellerId: 's3', title: '마란츠 PM6007 인티앰프', description: '입문용 추천.', price: 550000, shippingFee: 5000, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 76, likeCount: 3, commentCount: 0, createdAt: d(3), image: IMG.amp, images: [IMG.amp], location: LOC[4], isSafe: true, seller: SELLERS.s3 },
  { id: 'p16', categoryId: 'audio-dac', sellerId: 's3', title: 'iFi Zen DAC V2 USB DAC', description: 'MQA 지원.', price: 180000, shippingFee: 3000, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 54, likeCount: 2, commentCount: 0, createdAt: d(2), image: IMG.amp, images: [IMG.amp], location: LOC[5], isSafe: true, seller: SELLERS.s3 },
  { id: 'p17', categoryId: 'audio-amp', sellerId: 's3', title: '데논 PMA-600NE 인티앰프', description: '클래식 디자인.', price: 420000, shippingFee: 0, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 45, likeCount: 2, commentCount: 1, createdAt: d(4), image: IMG.amp, images: [IMG.amp], location: LOC[0], isSafe: true, seller: SELLERS.s3 },
  { id: 'p18', categoryId: 'phone-apple', sellerId: 's3', title: '아이폰 14 프로 128GB', description: '음향기기 상점이지만.', price: 950000, shippingFee: 3000, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 32, likeCount: 1, commentCount: 0, createdAt: h(12), image: IMG.phone, images: [IMG.phone], location: LOC[1], isSafe: true, seller: SELLERS.s3 },

  // ===== s4 캠핑가자 (캠핑/레저) 9개 =====
  { id: 'p19', categoryId: 'tent', sellerId: 's4', title: '스노우피크 랜드록 텐트', description: '패밀리 캠핑 최고.', price: 1800000, shippingFee: 0, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 356, likeCount: 10, commentCount: 3, createdAt: d(15), image: IMG.tent, images: [IMG.tent], location: LOC[6], isSafe: true, seller: SELLERS.s4 },
  { id: 'p20', categoryId: 'tent-dome', sellerId: 's4', title: '힐레베르그 아틀라스 4인용', description: '4계절 익스페디션.', price: 2200000, shippingFee: 0, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 178, likeCount: 8, commentCount: 2, createdAt: d(10), image: IMG.tent, images: [IMG.tent], location: LOC[6], isSafe: true, seller: SELLERS.s4 },
  { id: 'p21', categoryId: 'tarp', sellerId: 's4', title: 'DD 타프 3x3 올리브', description: '부쉬크래프트 필수.', price: 85000, shippingFee: 3000, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 89, likeCount: 4, commentCount: 1, createdAt: d(5), image: IMG.tent, images: [IMG.tent], location: LOC[6], isSafe: true, seller: SELLERS.s4 },
  { id: 'p22', categoryId: 'chair', sellerId: 's4', title: '헬리녹스 체어원 블랙', description: '가벼운 백패킹용.', price: 95000, shippingFee: 3000, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 123, likeCount: 5, commentCount: 2, createdAt: d(7), image: IMG.chair, images: [IMG.chair], location: LOC[6], isSafe: true, seller: SELLERS.s4 },
  { id: 'p23', categoryId: 'table', sellerId: 's4', title: '스노우피크 IGT 슬림', description: 'IGT 시스템.', price: 280000, shippingFee: 5000, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 67, likeCount: 3, commentCount: 0, createdAt: d(3), image: IMG.chair, images: [IMG.chair], location: LOC[6], isSafe: true, seller: SELLERS.s4 },
  { id: 'p24', categoryId: 'lamp', sellerId: 's4', title: '페트로막스 HK500 랜턴', description: '압력식 랜턴.', price: 320000, shippingFee: 0, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 98, likeCount: 4, commentCount: 1, createdAt: d(6), image: IMG.lamp, images: [IMG.lamp], location: LOC[6], isSafe: true, seller: SELLERS.s4 },
  { id: 'p25', categoryId: 'sleeping', sellerId: 's4', title: '씨투써밋 스파크 침낭 -3도', description: '경량 백패킹.', price: 380000, shippingFee: 4000, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 54, likeCount: 2, commentCount: 0, createdAt: d(2), image: IMG.tent, images: [IMG.tent], location: LOC[6], isSafe: true, seller: SELLERS.s4 },
  { id: 'p26', categoryId: 'cookware', sellerId: 's4', title: '스노우피크 트렉900 코펠세트', description: '솔캠 필수.', price: 65000, shippingFee: 3000, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 45, likeCount: 2, commentCount: 1, createdAt: d(4), image: IMG.lamp, images: [IMG.lamp], location: LOC[6], isSafe: true, seller: SELLERS.s4 },
  { id: 'p27', categoryId: 'audio-speaker', sellerId: 's4', title: 'JBL 플립6 블루투스 스피커', description: '캠핑장 분위기용.', price: 120000, shippingFee: 3000, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 34, likeCount: 1, commentCount: 0, createdAt: h(8), image: IMG.speaker, images: [IMG.speaker], location: LOC[6], isSafe: true, seller: SELLERS.s4 },

  // ===== s5 그린필드 (골프) 9개 =====
  { id: 'p28', categoryId: 'golf-driver', sellerId: 's5', title: '테일러메이드 스텔스2 플러스 드라이버', description: '10.5도 스티프.', price: 450000, shippingFee: 0, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 234, likeCount: 9, commentCount: 3, createdAt: d(12), image: IMG.golf, images: [IMG.golf], location: LOC[2], isSafe: true, seller: SELLERS.s5 },
  { id: 'p29', categoryId: 'golf-driver', sellerId: 's5', title: '캘러웨이 파라다임 Ai 스모크', description: '2024 신형.', price: 520000, shippingFee: 0, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 189, likeCount: 7, commentCount: 2, createdAt: d(8), image: IMG.golf, images: [IMG.golf], location: LOC[2], isSafe: true, seller: SELLERS.s5 },
  { id: 'p30', categoryId: 'golf-iron', sellerId: 's5', title: '타이틀리스트 T200 아이언세트 5-PW', description: '스틸 샤프트.', price: 780000, shippingFee: 0, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 156, likeCount: 6, commentCount: 2, createdAt: d(10), image: IMG.golf, images: [IMG.golf], location: LOC[2], isSafe: true, seller: SELLERS.s5 },
  { id: 'p31', categoryId: 'golf-wood', sellerId: 's5', title: '핑 G430 MAX 5번 우드', description: '시니어 플렉스.', price: 280000, shippingFee: 4000, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 87, likeCount: 4, commentCount: 1, createdAt: d(6), image: IMG.golf, images: [IMG.golf], location: LOC[3], isSafe: true, seller: SELLERS.s5 },
  { id: 'p32', categoryId: 'golf-wedge', sellerId: 's5', title: '클리블랜드 RTX 풀페이스 56도', description: '스핀 최고.', price: 150000, shippingFee: 3000, conditionStatus: 'MINOR_WEAR', saleStatus: 'SOLD_OUT', viewCount: 67, likeCount: 3, commentCount: 0, createdAt: d(4), image: IMG.golf, images: [IMG.golf], location: LOC[4], isSafe: true, seller: SELLERS.s5 },
  { id: 'p33', categoryId: 'golf-putter', sellerId: 's5', title: '스카티카메론 뉴포트2 퍼터', description: '명품 퍼터.', price: 650000, shippingFee: 0, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 345, likeCount: 10, commentCount: 3, createdAt: d(14), image: IMG.golf, images: [IMG.golf], location: LOC[2], isSafe: true, seller: SELLERS.s5 },
  { id: 'p34', categoryId: 'golf-bag', sellerId: 's5', title: '타이틀리스트 스탠드백 TB22', description: '가벼운 라운딩용.', price: 180000, shippingFee: 5000, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 56, likeCount: 2, commentCount: 0, createdAt: d(2), image: IMG.golf, images: [IMG.golf], location: LOC[5], isSafe: true, seller: SELLERS.s5 },
  { id: 'p35', categoryId: 'golf-wear', sellerId: 's5', title: 'PXG 남성 폴로셔츠 XL', description: '시즌오프 정리.', price: 85000, shippingFee: 3000, conditionStatus: 'SEALED', saleStatus: 'ON_SALE', viewCount: 34, likeCount: 1, commentCount: 0, createdAt: d(1), image: IMG.golf, images: [IMG.golf], location: LOC[0], isSafe: true, seller: SELLERS.s5 },
  { id: 'p36', categoryId: 'tablet-ipad', sellerId: 's5', title: '아이패드 미니6 64GB', description: '골프 스윙 분석용.', price: 420000, shippingFee: 0, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 28, likeCount: 1, commentCount: 0, createdAt: h(6), image: IMG.tablet, images: [IMG.tablet], location: LOC[2], isSafe: true, seller: SELLERS.s5 },

  // ===== s6 덕질공간 (스타굿즈) 9개 =====
  { id: 'p37', categoryId: 'album', sellerId: 's6', title: '뉴진스 2nd EP Get Up 미개봉', description: '한정판 버니.', price: 35000, shippingFee: 2000, conditionStatus: 'SEALED', saleStatus: 'ON_SALE', viewCount: 456, likeCount: 10, commentCount: 3, createdAt: d(10), image: IMG.album, images: [IMG.album], location: LOC[4], isSafe: true, seller: SELLERS.s6 },
  { id: 'p38', categoryId: 'album', sellerId: 's6', title: 'IVE 1st Album WAVE', description: '포토북 ver.', price: 28000, shippingFee: 2000, conditionStatus: 'SEALED', saleStatus: 'ON_SALE', viewCount: 312, likeCount: 8, commentCount: 2, createdAt: d(7), image: IMG.album, images: [IMG.album], location: LOC[4], isSafe: true, seller: SELLERS.s6 },
  { id: 'p39', categoryId: 'photocard', sellerId: 's6', title: '뉴진스 민지 공식 포카 세트', description: 'OMG 시즌그리팅.', price: 45000, shippingFee: 1500, conditionStatus: 'NO_WEAR', saleStatus: 'RESERVED', viewCount: 234, likeCount: 9, commentCount: 2, createdAt: d(5), image: IMG.photocard, images: [IMG.photocard], location: LOC[4], isSafe: true, seller: SELLERS.s6 },
  { id: 'p40', categoryId: 'photocard', sellerId: 's6', title: 'aespa 카리나 럭키드로우 포카', description: '메가박스 한정.', price: 85000, shippingFee: 1500, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 567, likeCount: 10, commentCount: 3, createdAt: d(12), image: IMG.photocard, images: [IMG.photocard], location: LOC[4], isSafe: true, seller: SELLERS.s6 },
  { id: 'p41', categoryId: 'concert', sellerId: 's6', title: 'IVE WORLD TOUR 서울 공연 티켓', description: 'VIP석 1장.', price: 180000, shippingFee: 0, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 789, likeCount: 10, commentCount: 3, createdAt: d(8), image: IMG.album, images: [IMG.album], location: LOC[0], isSafe: false, seller: SELLERS.s6 },
  { id: 'p42', categoryId: 'goods-bts', sellerId: 's6', title: 'BTS 공식 아미밤 세트', description: '미사용.', price: 120000, shippingFee: 3000, conditionStatus: 'SEALED', saleStatus: 'ON_SALE', viewCount: 234, likeCount: 7, commentCount: 2, createdAt: d(6), image: IMG.album, images: [IMG.album], location: LOC[4], isSafe: true, seller: SELLERS.s6 },
  { id: 'p43', categoryId: 'goods-seventeen', sellerId: 's6', title: '세븐틴 캐럿봉 Ver.3', description: '한정 색상.', price: 95000, shippingFee: 3000, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 156, likeCount: 5, commentCount: 1, createdAt: d(4), image: IMG.album, images: [IMG.album], location: LOC[4], isSafe: true, seller: SELLERS.s6 },
  { id: 'p44', categoryId: 'album', sellerId: 's6', title: 'aespa Armageddon 콜렉터스 에디션', description: '시리얼 넘버.', price: 65000, shippingFee: 2500, conditionStatus: 'SEALED', saleStatus: 'ON_SALE', viewCount: 89, likeCount: 4, commentCount: 1, createdAt: d(3), image: IMG.album, images: [IMG.album], location: LOC[4], isSafe: true, seller: SELLERS.s6 },
  { id: 'p45', categoryId: 'golf-driver', sellerId: 's6', title: '미즈노 ST-Z 드라이버', description: '덕질하다 골프 시작.', price: 280000, shippingFee: 0, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 23, likeCount: 1, commentCount: 0, createdAt: h(4), image: IMG.golf, images: [IMG.golf], location: LOC[4], isSafe: true, seller: SELLERS.s6 },

  // ===== 일반 판매자 (s7~s20) 각 1~2개 =====
  { id: 'p46', categoryId: 'body', sellerId: 's7', title: '소니 A7IV 바디 셔터 1만컷', description: '풀프레임 미러리스.', price: 2200000, shippingFee: 0, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 178, likeCount: 6, commentCount: 2, createdAt: d(9), image: IMG.camera, images: [IMG.camera], location: LOC[1], isSafe: true, seller: SELLERS.s7 },
  { id: 'p47', categoryId: 'lens', sellerId: 's7', title: '소니 FE 24-70mm F2.8 GM2', description: 'G마스터 2세대.', price: 1850000, shippingFee: 0, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 123, likeCount: 5, commentCount: 1, createdAt: d(7), image: IMG.camera, images: [IMG.camera], location: LOC[1], isSafe: true, seller: SELLERS.s7 },
  { id: 'p48', categoryId: 'guitar-acoustic', sellerId: 's8', title: '테일러 214ce 통기타', description: 'ES2 픽업.', price: 850000, shippingFee: 0, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 89, likeCount: 4, commentCount: 1, createdAt: d(6), image: IMG.amp, images: [IMG.amp], location: LOC[3], isSafe: true, seller: SELLERS.s8 },
  { id: 'p49', categoryId: 'guitar-elec', sellerId: 's9', title: '펜더 스트라토캐스터 MIM', description: '멕시코산 입문용.', price: 650000, shippingFee: 0, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 67, likeCount: 3, commentCount: 1, createdAt: d(5), image: IMG.amp, images: [IMG.amp], location: LOC[5], isSafe: true, seller: SELLERS.s9 },
  { id: 'p50', categoryId: 'phone-samsung', sellerId: 's10', title: '갤럭시 Z플립5 256GB', description: '게임폰으로 사용.', price: 780000, shippingFee: 3000, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 56, likeCount: 2, commentCount: 0, createdAt: d(3), image: IMG.phone, images: [IMG.phone], location: LOC[0], isSafe: true, seller: SELLERS.s10 },
  { id: 'p51', categoryId: 'cookware', sellerId: 's11', title: '트랜지아 스톰쿠커 대형', description: '낚시터용.', price: 120000, shippingFee: 4000, conditionStatus: 'VISIBLE_WEAR', saleStatus: 'ON_SALE', viewCount: 34, likeCount: 1, commentCount: 0, createdAt: d(2), image: IMG.lamp, images: [IMG.lamp], location: LOC[6], isSafe: true, seller: SELLERS.s11 },
  { id: 'p52', categoryId: 'cookware', sellerId: 's12', title: '르크루제 22cm 라운드', description: '요리용 무쇠냄비.', price: 280000, shippingFee: 0, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 78, likeCount: 3, commentCount: 1, createdAt: d(5), image: IMG.lamp, images: [IMG.lamp], location: LOC[0], isSafe: true, seller: SELLERS.s12 },
  { id: 'p53', categoryId: 'goods-stray', sellerId: 's13', title: '레고 스타워즈 AT-AT 75313', description: 'UCS 시리즈.', price: 850000, shippingFee: 0, conditionStatus: 'SEALED', saleStatus: 'ON_SALE', viewCount: 234, likeCount: 8, commentCount: 2, createdAt: d(11), image: IMG.album, images: [IMG.album], location: LOC[2], isSafe: true, seller: SELLERS.s13 },
  { id: 'p54', categoryId: 'golf-wear', sellerId: 's14', title: '나이키 에어맥스 97 골프화 270', description: '한정판.', price: 180000, shippingFee: 4000, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 89, likeCount: 4, commentCount: 1, createdAt: d(6), image: IMG.golf, images: [IMG.golf], location: LOC[0], isSafe: true, seller: SELLERS.s14 },
  { id: 'p55', categoryId: 'camping', sellerId: 's15', title: '루이비통 모노그램 키폴 55', description: '캠핑 짐싸기용.', price: 1200000, shippingFee: 0, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 156, likeCount: 5, commentCount: 1, createdAt: d(8), image: IMG.tent, images: [IMG.tent], location: LOC[0], isSafe: true, seller: SELLERS.s15 },
  { id: 'p56', categoryId: 'lamp', sellerId: 's16', title: '고어선 화분 세트 3종', description: '다육 식물용.', price: 35000, shippingFee: 4000, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 45, likeCount: 2, commentCount: 0, createdAt: d(3), image: IMG.lamp, images: [IMG.lamp], location: LOC[1], isSafe: true, seller: SELLERS.s16 },
  { id: 'p57', categoryId: 'cookware', sellerId: 's17', title: '이화경 작가 다기세트', description: '도예 명장.', price: 450000, shippingFee: 0, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 67, likeCount: 3, commentCount: 1, createdAt: d(4), image: IMG.lamp, images: [IMG.lamp], location: LOC[5], isSafe: true, seller: SELLERS.s17 },
  { id: 'p58', categoryId: 'wearable', sellerId: 's18', title: '가민 페닉스7 사파이어', description: '운동용 스마트워치.', price: 650000, shippingFee: 0, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 89, likeCount: 4, commentCount: 1, createdAt: d(6), image: IMG.phone, images: [IMG.phone], location: LOC[3], isSafe: true, seller: SELLERS.s18 },
  { id: 'p59', categoryId: 'film', sellerId: 's19', title: '라이카 M6 블랙크롬 바디', description: '필름카메라 명기.', price: 4500000, shippingFee: 0, conditionStatus: 'VISIBLE_WEAR', saleStatus: 'ON_SALE', viewCount: 345, likeCount: 10, commentCount: 3, createdAt: d(15), image: IMG.camera, images: [IMG.camera], location: LOC[1], isSafe: true, seller: SELLERS.s19 },
  { id: 'p60', categoryId: 'piano', sellerId: 's20', title: '야마하 P-125 디지털피아노', description: '88건반 해머액션.', price: 520000, shippingFee: 0, conditionStatus: 'MINOR_WEAR', saleStatus: 'ON_SALE', viewCount: 78, likeCount: 3, commentCount: 1, createdAt: d(5), image: IMG.amp, images: [IMG.amp], location: LOC[7], isSafe: true, seller: SELLERS.s20 },
  { id: 'p61', categoryId: 'actioncam', sellerId: 's20', title: '고프로 히어로12 블랙', description: '레트로 브이로그용.', price: 380000, shippingFee: 3000, conditionStatus: 'NO_WEAR', saleStatus: 'ON_SALE', viewCount: 56, likeCount: 2, commentCount: 0, createdAt: d(2), image: IMG.camera, images: [IMG.camera], location: LOC[7], isSafe: true, seller: SELLERS.s20 },
];

// 댓글 Mock 데이터
export const MOCK_COMMENTS: ProductComment[] = [
  { id: 1, productId: 'p1', parentId: null, userId: 'u10', user: { nickname: '겜돌이', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u10' }, content: '혹시 네고 가능할까요?', createdAt: h(2), replies: [
    { id: 2, productId: 'p1', parentId: 1, userId: 'u2', user: { nickname: '테크마스터', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u2' }, content: '네 조금은 가능합니다. 채팅주세요!', createdAt: h(1) }
  ]},
  { id: 3, productId: 'p1', parentId: null, userId: 'u7', user: { nickname: '찰칵찰칵', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u7' }, content: '직거래 장소 변경 가능한가요?', createdAt: h(0.5) },
  { id: 4, productId: 'p5', parentId: null, userId: 'u15', user: { nickname: '가방조아', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u15' }, content: '배터리 사이클 몇회인가요?', createdAt: d(1) },
  { id: 5, productId: 'p5', parentId: null, userId: 'u18', user: { nickname: '득근득근', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u18' }, content: '외장 상태 궁금합니다', createdAt: h(12) },
  { id: 6, productId: 'p10', parentId: null, userId: 'u12', user: { nickname: '요리왕', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u12' }, content: '이어패드 교체했나요?', createdAt: d(2) },
];
