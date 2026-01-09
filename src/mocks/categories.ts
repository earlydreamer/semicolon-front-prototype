export interface Category {
  id: string;
  name: string;
  children?: Category[];
}

export const MOCK_CATEGORIES: Category[] = [
  // 전자기기 (Big 5: IT월드)
  {
    id: 'electronics',
    name: '전자기기',
    children: [
      {
        id: 'smartphone',
        name: '스마트폰',
        children: [
          { id: 'phone-apple', name: '아이폰' },
          { id: 'phone-samsung', name: '삼성' },
          { id: 'phone-etc', name: '기타' },
        ],
      },
      {
        id: 'tablet',
        name: '태블릿',
        children: [
          { id: 'tablet-ipad', name: '아이패드' },
          { id: 'tablet-galaxy', name: '갤럭시탭' },
        ],
      },
      {
        id: 'laptop',
        name: '노트북',
        children: [
          { id: 'laptop-macbook', name: '맥북' },
          { id: 'laptop-gram', name: '그램' },
          { id: 'laptop-etc', name: '기타' },
        ],
      },
      { id: 'wearable', name: '웨어러블' },
    ],
  },
  // 캠핑/레저 (Big 5: 캠핑가자)
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
      { id: 'sleeping', name: '침낭/매트' },
    ],
  },
  // 악기/음향 (Big 5: 하이파이클럽)
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
      {
        id: 'audio',
        name: '음향기기',
        children: [
          { id: 'audio-headphone', name: '헤드폰/이어폰' },
          { id: 'audio-speaker', name: '스피커' },
          { id: 'audio-amp', name: '앰프' },
          { id: 'audio-dac', name: 'DAC' },
        ],
      },
    ],
  },
  // 카메라/렌즈
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
  // 골프 (Big 5: 그린필드)
  {
    id: 'golf',
    name: '골프',
    children: [
      {
        id: 'golf-club',
        name: '골프채',
        children: [
          { id: 'golf-driver', name: '드라이버' },
          { id: 'golf-wood', name: '우드/유틸' },
          { id: 'golf-iron', name: '아이언' },
          { id: 'golf-wedge', name: '웨지' },
          { id: 'golf-putter', name: '퍼터' },
        ],
      },
      { id: 'golf-bag', name: '골프백' },
      { id: 'golf-wear', name: '골프웨어' },
      { id: 'golf-acc', name: '골프용품' },
    ],
  },
  // 티켓/교환권
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
  // 스타굿즈 (Big 5: 덕질공간)
  {
    id: 'goods',
    name: '스타굿즈',
    children: [
      {
        id: 'idol-boy',
        name: '보이그룹',
        children: [
          { id: 'goods-bts', name: 'BTS' },
          { id: 'goods-seventeen', name: '세븐틴' },
          { id: 'goods-stray', name: '스트레이키즈' },
        ],
      },
      {
        id: 'idol-girl',
        name: '걸그룹',
        children: [
          { id: 'goods-newjeans', name: '뉴진스' },
          { id: 'goods-ive', name: 'IVE' },
          { id: 'goods-aespa', name: 'aespa' },
        ],
      },
      { id: 'actor', name: '배우' },
      { id: 'album', name: '앨범/포토북' },
      { id: 'photocard', name: '포토카드' },
    ],
  },
];
