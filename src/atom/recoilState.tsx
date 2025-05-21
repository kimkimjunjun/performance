import { atom, selector } from 'recoil';

// 제휴사 실적 항목 타입 정의
export interface AffiliatePerformanceItem {
    id: string; // 실적 항목 고유 ID (예: 주문 ID, 트랜잭션 ID 등)
    category: string; // 상품 카테고리
    amount: number; // 발생 금액 (수익)
    date: string; // 발생 날짜
    // 필요에 따라 다른 필드 추가
}

// 제휴사 실적 데이터 상태 (atom)
export const affiliatePerformanceState = atom<AffiliatePerformanceItem[]>({
    key: 'affiliatePerformanceState', // 고유한 키
    default: [], // 기본값은 빈 배열
});

// 제휴사 실적 데이터 로딩 상태 (atom)
export const affiliatePerformanceLoadingState = atom<boolean>({
    key: 'affiliatePerformanceLoadingState',
    default: false,
});

// 제휴사 실적 데이터 에러 상태 (atom)
export const affiliatePerformanceErrorState = atom<string | null>({
    key: 'affiliatePerformanceErrorState',
    default: null,
});

// 총 수익을 계산하는 selector
export const totalAffiliateRevenueSelector = selector<number>({
    key: 'totalAffiliateRevenueSelector', // 고유한 키
    get: ({ get }) => {
        const performanceData = get(affiliatePerformanceState); // affiliatePerformanceState의 값을 가져옴
        // 데이터가 없으면 0을 반환, 있으면 각 항목의 amount를 더하여 총합 계산
        return performanceData.reduce((sum, item) => sum + item.amount, 0);
    },
});
