export interface Category {
  id: string; // SQL 상에서는 INT이나, 프론트엔드 라우팅 및 관리 편의성을 위해 string 유지
  name: string;
  depth: 1 | 2 | 3;
  parentId: string | null;
  children?: Category[];
}

export const MOCK_CATEGORIES: Category[] = [
  // 전자기기 (Big 5: IT월드)
  {
    id: 'electronics',
    name: '전자기기',
    depth: 1,
    parentId: null,
    children: [
      {
        id: 'smartphone',
        name: '스마트폰',
        depth: 2,
        parentId: 'electronics',
        children: [
          { id: 'phone-apple', name: '아이폰', depth: 3, parentId: 'smartphone' },
          { id: 'phone-samsung', name: '삼성', depth: 3, parentId: 'smartphone' },
          { id: 'phone-etc', name: '기타', depth: 3, parentId: 'smartphone' },
        ],
      },
      {
        id: 'tablet',
        name: '태블릿',
        depth: 2,
        parentId: 'electronics',
        children: [
          { id: 'tablet-ipad', name: '아이패드', depth: 3, parentId: 'tablet' },
          { id: 'tablet-galaxy', name: '갤럭시탭', depth: 3, parentId: 'tablet' },
        ],
      },
      {
        id: 'computer',
        name: 'PC/노트북',
        depth: 2,
        parentId: 'electronics',
        children: [
          { id: 'laptop-macbook', name: '맥북', depth: 3, parentId: 'computer' },
          { id: 'laptop-common', name: '일반 노트북', depth: 3, parentId: 'computer' },
          { id: 'pc-parts', name: 'PC부품', depth: 3, parentId: 'computer' },
        ],
      },
      {
        id: 'etc-electronics',
        name: '기타 가전',
        depth: 2,
        parentId: 'electronics',
        children: [
          { id: 'wearable', name: '웨어러블', depth: 3, parentId: 'etc-electronics' },
          { id: 'actioncam', name: '액션캠', depth: 3, parentId: 'etc-electronics' },
        ],
      },
    ],
  },
  // 캠핑/레저 (Big 5: 캠핑가자)
  {
    id: 'camping',
    name: '캠핑/레저',
    depth: 1,
    parentId: null,
    children: [
      {
        id: 'tent-group',
        name: '텐트/타프',
        depth: 2,
        parentId: 'camping',
        children: [
          { id: 'tent-dome', name: '돔/거실형', depth: 3, parentId: 'tent-group' },
          { id: 'tent-etc', name: '기타 텐트', depth: 3, parentId: 'tent-group' },
          { id: 'tarp', name: '타프', depth: 3, parentId: 'tent-group' },
        ],
      },
      {
        id: 'camping-furniture',
        name: '캠핑가구',
        depth: 2,
        parentId: 'camping',
        children: [
          { id: 'table', name: '테이블', depth: 3, parentId: 'camping-furniture' },
          { id: 'chair', name: '의자', depth: 3, parentId: 'camping-furniture' },
        ],
      },
      {
        id: 'camping-gear',
        name: '캠핑소품',
        depth: 2,
        parentId: 'camping',
        children: [
          { id: 'lamp', name: '랜턴/조명', depth: 3, parentId: 'camping-gear' },
          { id: 'cookware', name: '취사용품', depth: 3, parentId: 'camping-gear' },
          { id: 'sleeping', name: '침낭/매트', depth: 3, parentId: 'camping-gear' },
        ],
      },
    ],
  },
  // 악기/음향 (Big 5: 하이파이클럽)
  {
    id: 'instruments',
    name: '악기/음향',
    depth: 1,
    parentId: null,
    children: [
      {
        id: 'string-instruments',
        name: '현악기',
        depth: 2,
        parentId: 'instruments',
        children: [
          { id: 'guitar-elec', name: '일렉기타', depth: 3, parentId: 'string-instruments' },
          { id: 'guitar-acoustic', name: '통기타', depth: 3, parentId: 'string-instruments' },
          { id: 'guitar-bass', name: '베이스', depth: 3, parentId: 'string-instruments' },
        ],
      },
      {
        id: 'audio-gear',
        name: '음향기기',
        depth: 2,
        parentId: 'instruments',
        children: [
          { id: 'audio-headphone', name: '헤드폰/이어폰', depth: 3, parentId: 'audio-gear' },
          { id: 'audio-speaker', name: '스피커', depth: 3, parentId: 'audio-gear' },
          { id: 'audio-amp', name: '앰프/DAC', depth: 3, parentId: 'audio-gear' },
        ],
      },
      {
        id: 'keyboard-instruments',
        name: '건반악기',
        depth: 2,
        parentId: 'instruments',
        children: [
          { id: 'piano', name: '피아노/신디', depth: 3, parentId: 'keyboard-instruments' },
        ],
      },
    ],
  },
  // 카메라/렌즈
  {
    id: 'camera',
    name: '카메라/렌즈',
    depth: 1,
    parentId: null,
    children: [
      {
        id: 'digital-camera',
        name: '디지털 카메라',
        depth: 2,
        parentId: 'camera',
        children: [
          { id: 'dslr-mirrorless', name: 'DSLR/미러리스', depth: 3, parentId: 'digital-camera' },
          { id: 'compact-camera', name: '하이엔드/컴팩트', depth: 3, parentId: 'digital-camera' },
        ],
      },
      {
        id: 'camera-parts',
        name: '렌즈/주변기기',
        depth: 2,
        parentId: 'camera',
        children: [
          { id: 'lens', name: '교환렌즈', depth: 3, parentId: 'camera-parts' },
          { id: 'camera-acc', name: '삼각대/액세서리', depth: 3, parentId: 'camera-parts' },
        ],
      },
      {
        id: 'film-group',
        name: '필름카메라',
        depth: 2,
        parentId: 'camera',
        children: [
          { id: 'film-camera', name: '필름 바디', depth: 3, parentId: 'film-group' },
        ],
      },
    ],
  },
  // 골프 (Big 5: 그린필드)
  {
    id: 'golf',
    name: '골프',
    depth: 1,
    parentId: null,
    children: [
      {
        id: 'golf-club',
        name: '골프채',
        depth: 2,
        parentId: 'golf',
        children: [
          { id: 'golf-driver', name: '드라이버', depth: 3, parentId: 'golf-club' },
          { id: 'golf-wood', name: '우드/유틸', depth: 3, parentId: 'golf-club' },
          { id: 'golf-iron', name: '아이언', depth: 3, parentId: 'golf-club' },
          { id: 'golf-wedge', name: '웨지', depth: 3, parentId: 'golf-club' },
          { id: 'golf-putter', name: '퍼터', depth: 3, parentId: 'golf-club' },
        ],
      },
      {
        id: 'golf-acc-group',
        name: '용품/의류',
        depth: 2,
        parentId: 'golf',
        children: [
          { id: 'golf-bag', name: '골프백', depth: 3, parentId: 'golf-acc-group' },
          { id: 'golf-wear', name: '골프웨어', depth: 3, parentId: 'golf-acc-group' },
          { id: 'golf-acc', name: '기타용품', depth: 3, parentId: 'golf-acc-group' },
        ],
      },
    ],
  },
  // 스타굿즈 (Big 5: 덕질공간)
  {
    id: 'goods',
    name: '스타굿즈',
    depth: 1,
    parentId: null,
    children: [
      {
        id: 'idol-boy',
        name: '보이그룹',
        depth: 2,
        parentId: 'goods',
        children: [
          { id: 'goods-bts', name: 'BTS', depth: 3, parentId: 'idol-boy' },
          { id: 'goods-seventeen', name: '세븐틴', depth: 3, parentId: 'idol-boy' },
          { id: 'goods-stray', name: '스트레이키즈', depth: 3, parentId: 'idol-boy' },
        ],
      },
      {
        id: 'idol-girl',
        name: '걸그룹',
        depth: 2,
        parentId: 'goods',
        children: [
          { id: 'goods-newjeans', name: '뉴진스', depth: 3, parentId: 'idol-girl' },
          { id: 'goods-ive', name: 'IVE', depth: 3, parentId: 'idol-girl' },
          { id: 'goods-aespa', name: 'aespa', depth: 3, parentId: 'idol-girl' },
        ],
      },
      {
        id: 'goods-common',
        name: '교통수단/일반',
        depth: 2,
        parentId: 'goods',
        children: [
          { id: 'album', name: '앨범', depth: 3, parentId: 'goods-common' },
          { id: 'photocard', name: '포토카드', depth: 3, parentId: 'goods-common' },
          { id: 'concert', name: '콘서트티켓', depth: 3, parentId: 'goods-common' },
        ],
      },
    ],
  },
];
