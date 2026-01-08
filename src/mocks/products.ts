export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  timeAgo: string;
  isSafe: boolean;
  isAd?: boolean;
  categoryId?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: '아이폰 15 프로 맥스 256GB 내추럴 티타늄 자급제',
    price: 1550000,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=500',
    location: '서울시 강남구',
    timeAgo: '1분 전',
    isSafe: true,
    categoryId: 'smartphone',
  },
  {
    id: '2',
    title: '소니 WH-1000XM5 노이즈 캔슬링 헤드폰',
    price: 320000,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=500',
    location: '서울시 마포구',
    timeAgo: '5분 전',
    isSafe: true,
    categoryId: 'audio',
  },
  {
    id: '3',
    title: '맥북 에어 M2 미드나이트 13인치 기본형',
    price: 1100000,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=500',
    location: '부산시 해운대구',
    timeAgo: '10분 전',
    isSafe: true,
    categoryId: 'laptop',
  },
  {
    id: '4',
    title: '닌텐도 스위치 OLED 화이트 풀박스',
    price: 340000,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&q=80&w=500',
    location: '경기도 성남시',
    timeAgo: '30분 전',
    isSafe: false,
    categoryId: 'game',
  },
  {
    id: '5',
    title: '스노우피크 랜드락 텐트 풀세트 캠핑',
    price: 1800000,
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=500',
    location: '강원도 춘천시',
    timeAgo: '1시간 전',
    isSafe: true,
    categoryId: 'tent',
  },
  {
    id: '6',
    title: '펜더 스트라토캐스터 미펜 스탠다드 일렉기타',
    price: 1250000,
    image: 'https://images.unsplash.com/photo-1550985543-f4423c8d361c?auto=format&fit=crop&q=80&w=500',
    location: '서울시 종로구',
    timeAgo: '2시간 전',
    isSafe: false,
    categoryId: 'guitar-elec',
  },
  {
    id: '7',
    title: '캐논 EOS R6 Mark II 바디 미러리스 카메라',
    price: 2800000,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=500',
    location: '경기도 수원시',
    timeAgo: '3시간 전',
    isSafe: true,
    categoryId: 'dslr-mirrorless',
  },
  {
    id: '8',
    title: '뉴진스 How Sweet 한정판 앨범 미개봉',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?auto=format&fit=crop&q=80&w=500',
    location: '인천시 연수구',
    timeAgo: '4시간 전',
    isSafe: false,
    categoryId: 'idol-girl',
  },
  {
    id: '9',
    title: '나이키 덩크 로우 범고래 270',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=500',
    location: '대구시 중구',
    timeAgo: '5시간 전',
    isSafe: true,
    categoryId: 'shoes',
  },
  {
    id: '10',
    title: 'PS5 플레이스테이션 5 디스크 에디션',
    price: 520000,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=500',
    location: '서울시 송파구',
    timeAgo: '6시간 전',
    isSafe: true,
    categoryId: 'game',
  },
];
