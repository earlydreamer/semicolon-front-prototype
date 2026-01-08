export interface Category {
  id: string;
  name: string;
  children?: Category[];
}

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'camping',
    name: '캠핑/레저',
    children: [
      {
        id: 'tent',
        name: '텐트/타프',
        children: [
          { id: 'tent-dome', name: '돔텐트' },
          { id: 'tent-tunnel', name: '터널형텐트' },
          { id: 'tent-shelter', name: '쉘터' },
          { id: 'tarp', name: '타프' },
        ],
      },
      {
        id: 'furniture',
        name: '캠핑가구',
        children: [
          { id: 'table', name: '테이블' },
          { id: 'chair', name: '의자' },
          { id: 'shelf', name: '수납장/쉘프' },
        ],
      },
      { id: 'lamp', name: '랜턴/조명' },
      { id: 'cookware', name: '취사용품' },
    ],
  },
  {
    id: 'instruments',
    name: '악기/음향',
    children: [
      {
        id: 'guitar',
        name: '기타/베이스',
        children: [
          { id: 'guitar-elec', name: '일렉기타' },
          { id: 'guitar-acoustic', name: '통기타' },
          { id: 'guitar-bass', name: '베이스기타' },
        ],
      },
      { id: 'piano', name: '건반악기' },
      { id: 'wind', name: '관악기' },
      { id: 'audio', name: '음향기기' },
    ],
  },
  {
    id: 'camera',
    name: '카메라/렌즈',
    children: [
      {
        id: 'dslr-mirrorless',
        name: 'DSLR/미러리스',
        children: [
          { id: 'body', name: '바디' },
          { id: 'lens', name: '렌즈' },
        ],
      },
      { id: 'film', name: '필름카메라' },
      { id: 'actioncam', name: '액션캠/캠코더' },
      { id: 'gimbal', name: '삼각대/짐벌' },
    ],
  },
  {
    id: 'ticket',
    name: '티켓/교환권',
    children: [
      { id: 'concert', name: '콘서트/공연' },
      { id: 'musical', name: '뮤지컬/연극' },
      { id: 'sports', name: '스포츠' },
      { id: 'giftcard', name: '상품권/쿠폰' },
    ],
  },
  {
    id: 'goods',
    name: '스타굿즈',
    children: [
      { id: 'idol-boy', name: '보이그룹' },
      { id: 'idol-girl', name: '걸그룹' },
      { id: 'actor', name: '배우' },
    ],
  },
];
