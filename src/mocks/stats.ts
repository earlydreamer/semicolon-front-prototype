/**
 * 어드민 대시보드 통계 Mock 데이터
 * 
 * 집계 기준:
 * - 매일 00:00 (자정) 기준으로 일일 집계
 * - 월간 비교: 이번 달 vs 이전 달 (동일 기간 기준)
 * - 변화율: (현재 기간 - 이전 기간) / 이전 기간 * 100
 */

/**
 * 일일 통계 스냅샷
 */
export interface DailyStats {
  date: string; // YYYY-MM-DD
  aggregatedAt: string; // ISO datetime (집계 시점)
  totalRevenue: number; // 해당 일자까지의 누적 거래액
  confirmedOrdersCount: number; // 해당 일자까지의 구매확정 주문 수
  totalUsers: number; // 해당 일자까지의 누적 회원 수
  newUsersToday: number; // 해당 일자 신규 가입자 수
  totalProducts: number; // 해당 일자 기준 등록 상품 수
  totalOrders: number; // 해당 일자까지의 누적 주문 수
  ordersToday: number; // 해당 일자 신규 주문 수
}

/**
 * 월간 통계 요약
 */
export interface MonthlyStats {
  yearMonth: string; // YYYY-MM
  aggregatedAt: string; // ISO datetime (집계 시점)
  totalRevenue: number; // 해당 월 총 거래액
  newUsers: number; // 해당 월 신규 가입자 수
  newProducts: number; // 해당 월 신규 등록 상품 수
  totalOrders: number; // 해당 월 총 주문 수
}

/**
 * 대시보드 통계 집계 정보
 */
export interface StatsAggregation {
  lastAggregatedAt: string; // 마지막 집계 시점
  aggregationCycle: string; // 집계 주기 설명
  currentPeriod: string; // 현재 집계 기간
  comparisonPeriod: string; // 비교 기간
}

// 현재 날짜 기준으로 Mock 데이터 생성
const today = new Date();
const todayStr = today.toISOString().split('T')[0];
const lastMidnight = new Date(today);
lastMidnight.setHours(0, 0, 0, 0);

// 이번 달, 저번 달 계산
const currentYear = today.getFullYear();
const currentMonth = today.getMonth(); // 0-indexed
const currentYearMonth = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
const prevYearMonth = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}`;

/**
 * 최근 7일간 일일 통계 (Mock)
 */
export const MOCK_DAILY_STATS: DailyStats[] = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(today);
  date.setDate(date.getDate() - i);
  const dateStr = date.toISOString().split('T')[0];
  const midnight = new Date(date);
  midnight.setHours(0, 0, 0, 0);
  
  // 일자별로 점진적으로 증가하는 데이터
  const baseRevenue = 28500000;
  const baseUsers = 20;
  const baseProducts = 61;
  const baseOrders = 69;
  
  return {
    date: dateStr,
    aggregatedAt: midnight.toISOString(),
    totalRevenue: baseRevenue + (6 - i) * 850000,
    confirmedOrdersCount: 32 + (6 - i) * 2,
    totalUsers: baseUsers + (6 - i),
    newUsersToday: i === 0 ? 0 : Math.floor(Math.random() * 3) + 1,
    totalProducts: baseProducts + (6 - i),
    totalOrders: baseOrders + (6 - i) * 2,
    ordersToday: i === 0 ? 2 : Math.floor(Math.random() * 5) + 1,
  };
}).reverse();

/**
 * 최근 3개월 월간 통계 (Mock)
 */
export const MOCK_MONTHLY_STATS: MonthlyStats[] = [
  // 이번 달 (진행 중)
  {
    yearMonth: currentYearMonth,
    aggregatedAt: lastMidnight.toISOString(),
    totalRevenue: 15280000,
    newUsers: 14,
    newProducts: 8,
    totalOrders: 18,
  },
  // 지난 달
  {
    yearMonth: prevYearMonth,
    aggregatedAt: new Date(prevYear, prevMonth + 1, 1, 0, 0, 0).toISOString(),
    totalRevenue: 12450000,
    newUsers: 11,
    newProducts: 12,
    totalOrders: 24,
  },
  // 2달 전
  {
    yearMonth: `${prevMonth === 0 ? prevYear - 1 : prevYear}-${String(prevMonth === 0 ? 12 : prevMonth).padStart(2, '0')}`,
    aggregatedAt: new Date(prevMonth === 0 ? prevYear - 1 : prevYear, prevMonth === 0 ? 11 : prevMonth - 1, 1, 0, 0, 0).toISOString(),
    totalRevenue: 10800000,
    newUsers: 8,
    newProducts: 15,
    totalOrders: 21,
  },
];

/**
 * 집계 정보
 */
export const STATS_AGGREGATION_INFO: StatsAggregation = {
  lastAggregatedAt: lastMidnight.toISOString(),
  aggregationCycle: '매일 00:00 KST',
  currentPeriod: `${currentYearMonth}-01 ~ ${todayStr}`,
  comparisonPeriod: `${prevYearMonth}-01 ~ ${prevYearMonth}-${new Date(prevYear, prevMonth + 1, 0).getDate()}`,
};

/**
 * 변화율 계산 헬퍼 함수
 */
export const calculateChangeRate = (current: number, previous: number): { value: number; isPositive: boolean } => {
  if (previous === 0) {
    return { value: current > 0 ? 100 : 0, isPositive: current > 0 };
  }
  const rate = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(rate * 10) / 10),
    isPositive: rate >= 0,
  };
};

/**
 * 대시보드용 통계 데이터 (현재 vs 이전 달 비교)
 */
export const getDashboardStats = () => {
  const current = MOCK_MONTHLY_STATS[0];
  const previous = MOCK_MONTHLY_STATS[1];
  
  return {
    // 현재 값
    totalRevenue: current.totalRevenue,
    newUsers: current.newUsers,
    totalProducts: 61, // 전체 상품 수 (누적)
    totalOrders: 69, // 전체 주문 수 (누적)
    
    // 변화율
    revenueChange: calculateChangeRate(current.totalRevenue, previous.totalRevenue),
    usersChange: calculateChangeRate(current.newUsers, previous.newUsers),
    productsChange: calculateChangeRate(8, 12), // 이번 달 신규 vs 이전 달 신규
    ordersChange: calculateChangeRate(current.totalOrders, previous.totalOrders),
    
    // 집계 정보
    aggregation: STATS_AGGREGATION_INFO,
  };
};
