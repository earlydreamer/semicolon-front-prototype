/**
 * 상점 후기 Mock 데이터
 */

export interface ShopReview {
  id: string;
  shopId: string;
  buyerId: string;
  buyerNickname: string;
  buyerAvatar?: string;
  orderId: string;
  productTitle: string;
  rating: number; // 1-5
  content: string;
  createdAt: string;
}

const d = (n: number) => new Date(Date.now() - 1000 * 60 * 60 * 24 * n).toISOString();

// 상점별 5~6개 후기 (20개 상점 × 5~6개 = 약 110개)
export const MOCK_SHOP_REVIEWS: ShopReview[] = [
  // s2 IT월드 (6개)
  { id: 'r1', shopId: 's2', buyerId: 'u7', buyerNickname: '찰칵찰칵', orderId: 'o1', productTitle: '아이폰 15 프로 맥스', rating: 5, content: '새제품 그대로 왔어요! 최고입니다.', createdAt: d(30) },
  { id: 'r2', shopId: 's2', buyerId: 'u10', buyerNickname: '겜돌이', orderId: 'o2', productTitle: '갤럭시탭 S9', rating: 5, content: '포장 꼼꼼하고 배송 빨라요.', createdAt: d(25) },
  { id: 'r3', shopId: 's2', buyerId: 'u13', buyerNickname: '블럭쌓기', orderId: 'o3', productTitle: '맥북 에어', rating: 4, content: '상태 좋아요. 다만 케이블이 없었어요.', createdAt: d(20) },
  { id: 'r4', shopId: 's2', buyerId: 'u15', buyerNickname: '가방조아', orderId: 'o4', productTitle: '애플워치', rating: 5, content: '정품 확실하고 상태 S급!', createdAt: d(15) },
  { id: 'r5', shopId: 's2', buyerId: 'u18', buyerNickname: '득근득근', orderId: 'o5', productTitle: 'LG 그램', rating: 4, content: '무게 가볍고 좋습니다.', createdAt: d(10) },
  { id: 'r6', shopId: 's2', buyerId: 'u20', buyerNickname: '레트로매니아', orderId: 'o6', productTitle: '갤럭시 S24', rating: 5, content: '친절한 판매자님!', createdAt: d(5) },

  // s3 하이파이클럽 (5개)
  { id: 'r7', shopId: 's3', buyerId: 'u8', buyerNickname: '라이더', orderId: 'o7', productTitle: '소니 WH-1000XM5', rating: 5, content: '노캔 성능 최고예요.', createdAt: d(28) },
  { id: 'r8', shopId: 's3', buyerId: 'u11', buyerNickname: '강태공', orderId: 'o8', productTitle: 'B&W 스피커', rating: 5, content: '소리가 너무 좋습니다.', createdAt: d(22) },
  { id: 'r9', shopId: 's3', buyerId: 'u14', buyerNickname: '슈즈홀릭', orderId: 'o9', productTitle: '마란츠 앰프', rating: 4, content: '입문용으로 충분해요.', createdAt: d(17) },
  { id: 'r10', shopId: 's3', buyerId: 'u16', buyerNickname: '식집사', orderId: 'o10', productTitle: '젠하이저 헤드폰', rating: 5, content: '레퍼런스 사운드 만족!', createdAt: d(12) },
  { id: 'r11', shopId: 's3', buyerId: 'u19', buyerNickname: '그림쟁이', orderId: 'o11', productTitle: 'iFi DAC', rating: 5, content: 'MQA 재생 잘 됩니다.', createdAt: d(7) },

  // s4 캠핑가자 (6개)
  { id: 'r12', shopId: 's4', buyerId: 'u9', buyerNickname: '책벌레', orderId: 'o12', productTitle: '스노우피크 랜드록', rating: 5, content: '가족 캠핑에 딱이에요!', createdAt: d(35) },
  { id: 'r13', shopId: 's4', buyerId: 'u12', buyerNickname: '요리왕', orderId: 'o13', productTitle: '헬리녹스 체어', rating: 5, content: '가볍고 튼튼해요.', createdAt: d(28) },
  { id: 'r14', shopId: 's4', buyerId: 'u17', buyerNickname: '차마시는날', orderId: 'o14', productTitle: '페트로막스 랜턴', rating: 4, content: '분위기 최고인데 관리가 필요해요.', createdAt: d(21) },
  { id: 'r15', shopId: 's4', buyerId: 'u7', buyerNickname: '찰칵찰칵', orderId: 'o15', productTitle: 'DD 타프', rating: 5, content: '부쉬크래프트에 필수!', createdAt: d(14) },
  { id: 'r16', shopId: 's4', buyerId: 'u10', buyerNickname: '겜돌이', orderId: 'o16', productTitle: '코펠세트', rating: 5, content: '솔캠 갈 때 쓰기 좋아요.', createdAt: d(7) },
  { id: 'r17', shopId: 's4', buyerId: 'u13', buyerNickname: '블럭쌓기', orderId: 'o17', productTitle: '침낭', rating: 5, content: '따뜻하고 좋습니다.', createdAt: d(3) },

  // s5 그린필드 (5개)
  { id: 'r18', shopId: 's5', buyerId: 'u8', buyerNickname: '라이더', orderId: 'o18', productTitle: '테일러메이드 드라이버', rating: 5, content: '비거리가 늘었어요!', createdAt: d(40) },
  { id: 'r19', shopId: 's5', buyerId: 'u11', buyerNickname: '강태공', orderId: 'o19', productTitle: '타이틀리스트 아이언', rating: 4, content: '상태 좋아요. 샤프트 좀 낡음.', createdAt: d(30) },
  { id: 'r20', shopId: 's5', buyerId: 'u14', buyerNickname: '슈즈홀릭', orderId: 'o20', productTitle: '스카티카메론 퍼터', rating: 5, content: '명품 퍼터! 감사합니다.', createdAt: d(20) },
  { id: 'r21', shopId: 's5', buyerId: 'u16', buyerNickname: '식집사', orderId: 'o21', productTitle: '골프백', rating: 5, content: '가벼워서 좋아요.', createdAt: d(10) },
  { id: 'r22', shopId: 's5', buyerId: 'u19', buyerNickname: '그림쟁이', orderId: 'o22', productTitle: 'PXG 셔츠', rating: 5, content: '사이즈 딱 맞아요.', createdAt: d(5) },

  // s6 덕질공간 (6개)
  { id: 'r23', shopId: 's6', buyerId: 'u7', buyerNickname: '찰칵찰칵', orderId: 'o23', productTitle: '뉴진스 앨범', rating: 5, content: '미개봉 맞아요! 감사합니다.', createdAt: d(25) },
  { id: 'r24', shopId: 's6', buyerId: 'u9', buyerNickname: '책벌레', orderId: 'o24', productTitle: 'IVE 앨범', rating: 5, content: '포장 꼼꼼해요.', createdAt: d(20) },
  { id: 'r25', shopId: 's6', buyerId: 'u12', buyerNickname: '요리왕', orderId: 'o25', productTitle: '민지 포카', rating: 5, content: '최애 득템 성공!', createdAt: d(15) },
  { id: 'r26', shopId: 's6', buyerId: 'u15', buyerNickname: '가방조아', orderId: 'o26', productTitle: '아미밤', rating: 5, content: '새것 같아요.', createdAt: d(10) },
  { id: 'r27', shopId: 's6', buyerId: 'u17', buyerNickname: '차마시는날', orderId: 'o27', productTitle: '캐럿봉', rating: 5, content: '한정 색상 구해서 좋아요.', createdAt: d(5) },
  { id: 'r28', shopId: 's6', buyerId: 'u20', buyerNickname: '레트로매니아', orderId: 'o28', productTitle: 'IVE 콘서트 티켓', rating: 5, content: 'VIP석 최고였어요!', createdAt: d(2) },

  // s7~s20 일반 상점 (각 5개씩 간략히)
  { id: 'r29', shopId: 's7', buyerId: 'u10', buyerNickname: '겜돌이', orderId: 'o29', productTitle: '소니 A7IV', rating: 4, content: '셔터 컷 맞아요.', createdAt: d(15) },
  { id: 'r30', shopId: 's7', buyerId: 'u13', buyerNickname: '블럭쌓기', orderId: 'o30', productTitle: '24-70 렌즈', rating: 5, content: 'GM 렌즈 화질 최고.', createdAt: d(10) },
  { id: 'r31', shopId: 's7', buyerId: 'u15', buyerNickname: '가방조아', orderId: 'o31', productTitle: '카메라 용품', rating: 5, content: '좋습니다.', createdAt: d(5) },
  { id: 'r32', shopId: 's7', buyerId: 'u18', buyerNickname: '득근득근', orderId: 'o32', productTitle: '삼각대', rating: 4, content: '튼튼해요.', createdAt: d(3) },
  { id: 'r33', shopId: 's7', buyerId: 'u20', buyerNickname: '레트로매니아', orderId: 'o33', productTitle: '필름카메라', rating: 5, content: '레트로 감성!', createdAt: d(1) },

  { id: 'r34', shopId: 's8', buyerId: 'u11', buyerNickname: '강태공', orderId: 'o34', productTitle: '테일러 통기타', rating: 5, content: '소리가 좋아요.', createdAt: d(12) },
  { id: 'r35', shopId: 's8', buyerId: 'u14', buyerNickname: '슈즈홀릭', orderId: 'o35', productTitle: '기타 용품', rating: 4, content: '상태 괜찮아요.', createdAt: d(8) },
  { id: 'r36', shopId: 's8', buyerId: 'u16', buyerNickname: '식집사', orderId: 'o36', productTitle: '기타줄', rating: 5, content: '빠른 배송.', createdAt: d(4) },
  { id: 'r37', shopId: 's8', buyerId: 'u19', buyerNickname: '그림쟁이', orderId: 'o37', productTitle: '카포', rating: 5, content: '좋습니다.', createdAt: d(2) },
  { id: 'r38', shopId: 's8', buyerId: 'u7', buyerNickname: '찰칵찰칵', orderId: 'o38', productTitle: '기타 스탠드', rating: 5, content: '튼튼해요.', createdAt: d(1) },

  { id: 'r39', shopId: 's9', buyerId: 'u8', buyerNickname: '라이더', orderId: 'o39', productTitle: '펜더 스트랫', rating: 5, content: '명기!', createdAt: d(10) },
  { id: 'r40', shopId: 's9', buyerId: 'u12', buyerNickname: '요리왕', orderId: 'o40', productTitle: '일렉기타', rating: 4, content: '입문용 좋아요.', createdAt: d(6) },
  { id: 'r41', shopId: 's9', buyerId: 'u17', buyerNickname: '차마시는날', orderId: 'o41', productTitle: '기타 앰프', rating: 5, content: '소리 좋습니다.', createdAt: d(3) },
  { id: 'r42', shopId: 's9', buyerId: 'u10', buyerNickname: '겜돌이', orderId: 'o42', productTitle: '이펙터', rating: 5, content: '딜레이 최고.', createdAt: d(1) },
  { id: 'r43', shopId: 's9', buyerId: 'u13', buyerNickname: '블럭쌓기', orderId: 'o43', productTitle: '기타 케이스', rating: 5, content: '하드케이스 튼튼.', createdAt: d(0.5) },

  // s10~s20 간략 (각 5개)
  { id: 'r44', shopId: 's10', buyerId: 'u15', buyerNickname: '가방조아', orderId: 'o44', productTitle: '갤럭시 Z플립', rating: 5, content: '게임폰으로 최고.', createdAt: d(8) },
  { id: 'r45', shopId: 's10', buyerId: 'u18', buyerNickname: '득근득근', orderId: 'o45', productTitle: '게임패드', rating: 5, content: '진동 좋아요.', createdAt: d(5) },
  { id: 'r46', shopId: 's10', buyerId: 'u20', buyerNickname: '레트로매니아', orderId: 'o46', productTitle: '레트로 게임기', rating: 5, content: '추억의 게임!', createdAt: d(2) },
  { id: 'r47', shopId: 's10', buyerId: 'u7', buyerNickname: '찰칵찰칵', orderId: 'o47', productTitle: 'PS5', rating: 4, content: '상태 괜찮아요.', createdAt: d(1) },
  { id: 'r48', shopId: 's10', buyerId: 'u9', buyerNickname: '책벌레', orderId: 'o48', productTitle: '닌텐도 스위치', rating: 5, content: '가족용 좋아요.', createdAt: d(0.5) },

  { id: 'r49', shopId: 's11', buyerId: 'u11', buyerNickname: '강태공', orderId: 'o49', productTitle: '낚시대', rating: 4, content: '괜찮아요.', createdAt: d(10) },
  { id: 'r50', shopId: 's11', buyerId: 'u14', buyerNickname: '슈즈홀릭', orderId: 'o50', productTitle: '릴', rating: 3, content: '좀 낡았어요.', createdAt: d(5) },
  { id: 'r51', shopId: 's11', buyerId: 'u16', buyerNickname: '식집사', orderId: 'o51', productTitle: '쿨러박스', rating: 4, content: '시원해요.', createdAt: d(2) },
  { id: 'r52', shopId: 's11', buyerId: 'u19', buyerNickname: '그림쟁이', orderId: 'o52', productTitle: '의자', rating: 5, content: '편해요.', createdAt: d(1) },
  { id: 'r53', shopId: 's11', buyerId: 'u8', buyerNickname: '라이더', orderId: 'o53', productTitle: '도시락통', rating: 5, content: '실용적.', createdAt: d(0.5) },

  { id: 'r54', shopId: 's12', buyerId: 'u12', buyerNickname: '요리왕', orderId: 'o54', productTitle: '르크루제', rating: 5, content: '무쇠냄비 최고.', createdAt: d(12) },
  { id: 'r55', shopId: 's12', buyerId: 'u17', buyerNickname: '차마시는날', orderId: 'o55', productTitle: '냄비', rating: 5, content: '요리가 맛있어져요.', createdAt: d(8) },
  { id: 'r56', shopId: 's12', buyerId: 'u10', buyerNickname: '겜돌이', orderId: 'o56', productTitle: '프라이팬', rating: 4, content: '좋아요.', createdAt: d(4) },
  { id: 'r57', shopId: 's12', buyerId: 'u13', buyerNickname: '블럭쌓기', orderId: 'o57', productTitle: '칼세트', rating: 5, content: '잘 들어요.', createdAt: d(2) },
  { id: 'r58', shopId: 's12', buyerId: 'u15', buyerNickname: '가방조아', orderId: 'o58', productTitle: '도마', rating: 5, content: '원목 좋아요.', createdAt: d(1) },

  { id: 'r59', shopId: 's13', buyerId: 'u18', buyerNickname: '득근득근', orderId: 'o59', productTitle: '레고 AT-AT', rating: 5, content: 'UCS 대박!', createdAt: d(15) },
  { id: 'r60', shopId: 's13', buyerId: 'u20', buyerNickname: '레트로매니아', orderId: 'o60', productTitle: '레고 테크닉', rating: 5, content: '조립 재미있어요.', createdAt: d(10) },
  { id: 'r61', shopId: 's13', buyerId: 'u7', buyerNickname: '찰칵찰칵', orderId: 'o61', productTitle: '레고 시티', rating: 5, content: '아이 선물용.', createdAt: d(5) },
  { id: 'r62', shopId: 's13', buyerId: 'u9', buyerNickname: '책벌레', orderId: 'o62', productTitle: '레고 해리포터', rating: 5, content: '디테일 최고.', createdAt: d(2) },
  { id: 'r63', shopId: 's13', buyerId: 'u11', buyerNickname: '강태공', orderId: 'o63', productTitle: '미니피규어', rating: 5, content: '희귀템 득템!', createdAt: d(1) },

  { id: 'r64', shopId: 's14', buyerId: 'u14', buyerNickname: '슈즈홀릭', orderId: 'o64', productTitle: '나이키 골프화', rating: 5, content: '착화감 좋아요.', createdAt: d(10) },
  { id: 'r65', shopId: 's14', buyerId: 'u16', buyerNickname: '식집사', orderId: 'o65', productTitle: '조던', rating: 5, content: '레어템!', createdAt: d(6) },
  { id: 'r66', shopId: 's14', buyerId: 'u19', buyerNickname: '그림쟁이', orderId: 'o66', productTitle: '뉴발란스', rating: 4, content: '편해요.', createdAt: d(3) },
  { id: 'r67', shopId: 's14', buyerId: 'u8', buyerNickname: '라이더', orderId: 'o67', productTitle: '아디다스', rating: 5, content: '가벼워요.', createdAt: d(1) },
  { id: 'r68', shopId: 's14', buyerId: 'u12', buyerNickname: '요리왕', orderId: 'o68', productTitle: '컨버스', rating: 5, content: '클래식!', createdAt: d(0.5) },

  { id: 'r69', shopId: 's15', buyerId: 'u17', buyerNickname: '차마시는날', orderId: 'o69', productTitle: '루이비통 가방', rating: 5, content: '명품 정품!', createdAt: d(12) },
  { id: 'r70', shopId: 's15', buyerId: 'u10', buyerNickname: '겜돌이', orderId: 'o70', productTitle: '구찌', rating: 5, content: '상태 최상.', createdAt: d(8) },
  { id: 'r71', shopId: 's15', buyerId: 'u13', buyerNickname: '블럭쌓기', orderId: 'o71', productTitle: '프라다', rating: 5, content: '만족합니다.', createdAt: d(4) },
  { id: 'r72', shopId: 's15', buyerId: 'u15', buyerNickname: '가방조아', orderId: 'o72', productTitle: '샤넬', rating: 5, content: '드림백 득템!', createdAt: d(2) },
  { id: 'r73', shopId: 's15', buyerId: 'u18', buyerNickname: '득근득근', orderId: 'o73', productTitle: '발렌시아가', rating: 4, content: '좋아요.', createdAt: d(1) },

  { id: 'r74', shopId: 's16', buyerId: 'u20', buyerNickname: '레트로매니아', orderId: 'o74', productTitle: '화분', rating: 5, content: '식물 키우기 좋아요.', createdAt: d(8) },
  { id: 'r75', shopId: 's16', buyerId: 'u7', buyerNickname: '찰칵찰칵', orderId: 'o75', productTitle: '다육이', rating: 5, content: '귀여워요.', createdAt: d(5) },
  { id: 'r76', shopId: 's16', buyerId: 'u9', buyerNickname: '책벌레', orderId: 'o76', productTitle: '화분 받침', rating: 5, content: '깔끔해요.', createdAt: d(3) },
  { id: 'r77', shopId: 's16', buyerId: 'u11', buyerNickname: '강태공', orderId: 'o77', productTitle: '분갈이 흙', rating: 4, content: '좋아요.', createdAt: d(1) },
  { id: 'r78', shopId: 's16', buyerId: 'u14', buyerNickname: '슈즈홀릭', orderId: 'o78', productTitle: '물뿌리개', rating: 5, content: '이뻐요.', createdAt: d(0.5) },

  { id: 'r79', shopId: 's17', buyerId: 'u16', buyerNickname: '식집사', orderId: 'o79', productTitle: '다기세트', rating: 5, content: '작가님 작품 최고!', createdAt: d(10) },
  { id: 'r80', shopId: 's17', buyerId: 'u19', buyerNickname: '그림쟁이', orderId: 'o80', productTitle: '찻잔', rating: 5, content: '손맛이 느껴져요.', createdAt: d(6) },
  { id: 'r81', shopId: 's17', buyerId: 'u8', buyerNickname: '라이더', orderId: 'o81', productTitle: '다관', rating: 5, content: '예뻐요.', createdAt: d(3) },
  { id: 'r82', shopId: 's17', buyerId: 'u12', buyerNickname: '요리왕', orderId: 'o82', productTitle: '차호', rating: 5, content: '멋있어요.', createdAt: d(1) },
  { id: 'r83', shopId: 's17', buyerId: 'u17', buyerNickname: '차마시는날', orderId: 'o83', productTitle: '보이차', rating: 5, content: '향이 좋아요.', createdAt: d(0.5) },

  { id: 'r84', shopId: 's18', buyerId: 'u10', buyerNickname: '겜돌이', orderId: 'o84', productTitle: '가민 워치', rating: 5, content: '운동 필수!', createdAt: d(10) },
  { id: 'r85', shopId: 's18', buyerId: 'u13', buyerNickname: '블럭쌓기', orderId: 'o85', productTitle: '덤벨', rating: 4, content: '무게 맞아요.', createdAt: d(6) },
  { id: 'r86', shopId: 's18', buyerId: 'u15', buyerNickname: '가방조아', orderId: 'o86', productTitle: '요가매트', rating: 5, content: '쿠션감 좋아요.', createdAt: d(3) },
  { id: 'r87', shopId: 's18', buyerId: 'u18', buyerNickname: '득근득근', orderId: 'o87', productTitle: '풀업바', rating: 5, content: '튼튼해요.', createdAt: d(1) },
  { id: 'r88', shopId: 's18', buyerId: 'u20', buyerNickname: '레트로매니아', orderId: 'o88', productTitle: '케틀벨', rating: 5, content: '홈트 최고.', createdAt: d(0.5) },

  { id: 'r89', shopId: 's19', buyerId: 'u7', buyerNickname: '찰칵찰칵', orderId: 'o89', productTitle: '라이카 M6', rating: 5, content: '필카 명기!', createdAt: d(20) },
  { id: 'r90', shopId: 's19', buyerId: 'u9', buyerNickname: '책벌레', orderId: 'o90', productTitle: '그림 액자', rating: 5, content: '작품 느낌나요.', createdAt: d(12) },
  { id: 'r91', shopId: 's19', buyerId: 'u11', buyerNickname: '강태공', orderId: 'o91', productTitle: '스케치북', rating: 5, content: '종이 질 좋아요.', createdAt: d(6) },
  { id: 'r92', shopId: 's19', buyerId: 'u14', buyerNickname: '슈즈홀릭', orderId: 'o92', productTitle: '물감세트', rating: 4, content: '색감 좋아요.', createdAt: d(2) },
  { id: 'r93', shopId: 's19', buyerId: 'u16', buyerNickname: '식집사', orderId: 'o93', productTitle: '이젤', rating: 5, content: '튼튼해요.', createdAt: d(1) },

  { id: 'r94', shopId: 's20', buyerId: 'u19', buyerNickname: '그림쟁이', orderId: 'o94', productTitle: '야마하 피아노', rating: 5, content: '입문용 최고.', createdAt: d(10) },
  { id: 'r95', shopId: 's20', buyerId: 'u8', buyerNickname: '라이더', orderId: 'o95', productTitle: '고프로', rating: 5, content: '브이로그 필수!', createdAt: d(6) },
  { id: 'r96', shopId: 's20', buyerId: 'u12', buyerNickname: '요리왕', orderId: 'o96', productTitle: 'LP 플레이어', rating: 5, content: '레트로 감성!', createdAt: d(3) },
  { id: 'r97', shopId: 's20', buyerId: 'u17', buyerNickname: '차마시는날', orderId: 'o97', productTitle: '카세트 플레이어', rating: 5, content: '추억이에요.', createdAt: d(1) },
  { id: 'r98', shopId: 's20', buyerId: 'u10', buyerNickname: '겜돌이', orderId: 'o98', productTitle: '레트로 게임기', rating: 5, content: '어릴 때 생각나요.', createdAt: d(0.5) },
];
