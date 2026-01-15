/**
 * 어드민 대시보드 통계 Mock 데이터
 * 
 * 집계 기준:
 * - 매일 00:00 (자정) 기준으로 일일 집계
 * - 롤링 30일 비교: 최근 30일 vs 이전 30일 (동일 기간 기준)
 * - 변화율: (집계 기간 - 비교 기간) / 비교 기간 * 100
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
 * 기간별 통계 요약 (30일 단위)
 */
export interface PeriodStats {
  periodStart: string; // YYYY-MM-DD
  periodEnd: string; // YYYY-MM-DD
  aggregatedAt: string; // ISO datetime (집계 시점)
  totalRevenue: number; // 해당 기간 총 거래액
  newUsers: number; // 해당 기간 신규 가입자 수
  newProducts: number; // 해당 기간 신규 등록 상품 수
  totalOrders: number; // 해당 기간 총 주문 수
}

/**
 * 대시보드 통계 집계 정보
 */
export interface StatsAggregation {
  lastAggregatedAt: string; // 마지막 집계 시점
  aggregationCycle: string; // 집계 주기 설명
  aggregationPeriod: string; // 집계 기간
  comparisonPeriod: string; // 비교 기간
}

// 롤링 30일 기간 계산
const today = new Date();
const todayStr = today.toISOString().split('T')[0];
const lastMidnight = new Date(today);
lastMidnight.setHours(0, 0, 0, 0);

// 30일 전 (집계 기간 시작)
const thirtyDaysAgo = new Date(today);
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29); // 오늘 포함 30일
const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

// 60일 전 (비교 기간 시작)
const sixtyDaysAgo = new Date(today);
sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 59);
const sixtyDaysAgoStr = sixtyDaysAgo.toISOString().split('T')[0];

// 31일 전 (비교 기간 종료)
const thirtyOneDaysAgo = new Date(today);
thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 30);
const thirtyOneDaysAgoStr = thirtyOneDaysAgo.toISOString().split('T')[0];

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
 * 30일 단위 기간 통계 (Mock)
 */
export const MOCK_PERIOD_STATS: PeriodStats[] = [
  // 집계 기간 (최근 30일)
  {
    periodStart: thirtyDaysAgoStr,
    periodEnd: todayStr,
    aggregatedAt: lastMidnight.toISOString(),
    totalRevenue: 15280000,
    newUsers: 14,
    newProducts: 8,
    totalOrders: 18,
  },
  // 비교 기간 (이전 30일)
  {
    periodStart: sixtyDaysAgoStr,
    periodEnd: thirtyOneDaysAgoStr,
    aggregatedAt: lastMidnight.toISOString(),
    totalRevenue: 12450000,
    newUsers: 11,
    newProducts: 12,
    totalOrders: 24,
  },
];

/**
 * 집계 정보
 */
export const STATS_AGGREGATION_INFO: StatsAggregation = {
  lastAggregatedAt: lastMidnight.toISOString(),
  aggregationCycle: '매일 00:00 KST',
  aggregationPeriod: `${thirtyDaysAgoStr} ~ ${todayStr}`,
  comparisonPeriod: `${sixtyDaysAgoStr} ~ ${thirtyOneDaysAgoStr}`,
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
 * 대시보드용 통계 데이터 (집계 기간 vs 비교 기간)
 */
export const getDashboardStats = () => {
  const current = MOCK_PERIOD_STATS[0];
  const previous = MOCK_PERIOD_STATS[1];
  
  return {
    // 현재 값
    totalRevenue: current.totalRevenue,
    newUsers: current.newUsers,
    totalProducts: 61, // 전체 상품 수 (누적)
    totalOrders: 69, // 전체 주문 수 (누적)
    
    // 변화율
    revenueChange: calculateChangeRate(current.totalRevenue, previous.totalRevenue),
    usersChange: calculateChangeRate(current.newUsers, previous.newUsers),
    productsChange: calculateChangeRate(current.newProducts, previous.newProducts),
    ordersChange: calculateChangeRate(current.totalOrders, previous.totalOrders),
    
    // 집계 정보
    aggregation: STATS_AGGREGATION_INFO,
  };
};
