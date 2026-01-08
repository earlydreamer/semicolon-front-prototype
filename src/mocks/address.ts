/**
 * 배송지 관련 Mock 데이터
 */

export interface Address {
  id: string;
  name: string; // 배송지명 (예: 집, 회사)
  recipient: string; // 받는 사람
  phone: string;
  address: string;
  detailAddress: string;
  zipCode: string;
  isDefault: boolean;
}

export const MOCK_ADDRESSES: Address[] = [
  {
    id: 'addr1',
    name: '집',
    recipient: '김철수',
    phone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 123',
    detailAddress: '삼성동 아파트 101동 101호',
    zipCode: '06234',
    isDefault: true,
  },
  {
    id: 'addr2',
    name: '회사',
    recipient: '김철수',
    phone: '010-1234-5678',
    address: '서울시 강남구 역삼로 456',
    detailAddress: '메가타워 15층',
    zipCode: '06245',
    isDefault: false,
  },
];
