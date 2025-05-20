// src/utils/sourcingAnalysisUtils.ts

interface RawSourcingProductData {
    id: string;
    name: string;
    baseCostUSD: number; // 기준 원가 (USD)
    currentStock: number;
    sourcingStatus: 'active' | 'inactive' | 'pending' | 'closed';
    internalApproval: boolean; // 내부 판매 승인 여부
    rawTechSpecs: string; // 기술 사양 문자열 (예: "CPU:i7; RAM:16GB; SSD:512GB")
    // ... 기타 데이터
}

interface CalculatedProfitData {
    estimatedSalePriceKRW: number; // 예상 판매가 (KRW)
    estimatedProfitKRW: number; // 예상 수익 (KRW)
    estimatedProfitMargin: number; // 예상 수익률 (%)
}

interface ParsedSpecItem {
    key: string;
    value: string;
}

/**
 * 상품의 원가, 환율, 마진율을 기반으로 예상 수익 관련 데이터를 계산합니다.
 * 계산 비용이 다소 발생한다고 가정합니다.
 */
export const calculateProfit = (
    product: RawSourcingProductData,
    exchangeRateUSDToKRW: number,
    marginRate: number // 0-1 사이 값 (예: 0.3 for 30%)
): CalculatedProfitData => {
    console.log(`✨ [UTILS] 수익 계산 중: ${product.name}`);

    // 간단한 계산 로직 시뮬레이션
    const costKRW = product.baseCostUSD * exchangeRateUSDToKRW;
    let estimatedSalePriceKRW = costKRW / (1 - marginRate); // 마진율 적용 판매가

    // 재고나 상태에 따른 추가 가격 조정 시뮬레이션 (복잡한 비즈니스 로직 가정)
    if (product.currentStock < 10 && product.sourcingStatus === 'active') {
        estimatedSalePriceKRW *= 1.05; // 저재고 할증
    } else if (product.sourcingStatus === 'closed') {
        estimatedSalePriceKRW *= 0.8; // 종료 상품 할인
    }
    // ... 기타 복잡한 계산 로직

    const estimatedProfitKRW = estimatedSalePriceKRW - costKRW;
    const estimatedProfitMargin = (estimatedProfitKRW / estimatedSalePriceKRW) * 100;

    // 계산 비용 시뮬레이션
    for (let i = 0; i < 40000000; i++) { /* busy wait */ }

    return {
        estimatedSalePriceKRW: Math.round(estimatedSalePriceKRW), // 소수점 처리
        estimatedProfitKRW: Math.round(estimatedProfitKRW),
        estimatedProfitMargin: parseFloat(estimatedProfitMargin.toFixed(1)), // 소수점 첫째자리
    };
};

/**
 * 원본 기술 사양 문자열을 파싱하여 구조화된 목록으로 변환합니다.
 * 파싱 및 가공 비용이 다소 발생한다고 가정합니다.
 */
export const parseTechSpecs = (rawSpecs: string): ParsedSpecItem[] => {
    console.log(`📋 [UTILS] 사양 파싱 중: "${rawSpecs.substring(0, 20)}..."`);

    const parsed: ParsedSpecItem[] = [];
    if (!rawSpecs) return parsed;

    try {
        const items = rawSpecs.split(';'); // 세미콜론으로 항목 분리
        for (const item of items) {
            const parts = item.split(':'); // 콜론으로 키/값 분리
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join(':').trim(); // 값에 콜론이 포함될 수 있음
                if (key && value) {
                    // 값에 대한 추가 가공/검증 로직이 있을 수 있음
                    parsed.push({ key, value });
                }
            }
        }
    } catch (error) {
        console.error("Error parsing tech specs:", error);
        // 에러 발생 시 빈 배열 반환 또는 에러 표시를 위한 특별 항목 추가 고려
        return [];
    }


    // 파싱 비용 시뮬레이션
    for (let i = 0; i < 30000000; i++) { /* busy wait */ }

    return parsed;
};

/**
 * 여러 조건을 조합하여 상품의 현재 판매 가능 상태를 판단합니다.
 * 판단 로직이 다소 복잡하다고 가정합니다.
 */
export const determineSellableStatus = (product: RawSourcingProductData): { isSellable: boolean; statusText: string } => {
    console.log(`✅ [UTILS] 판매 가능 상태 판단 중: ${product.name}`);

    const { sourcingStatus, currentStock, internalApproval } = product;
    let isSellable = false;
    let statusText = '';

    if (sourcingStatus !== 'active') {
        statusText = '소싱 비활성';
    } else if (!internalApproval) {
        statusText = '내부 승인 대기';
    } else if (currentStock <= 0) {
        statusText = '재고 없음';
    } else {
        isSellable = true;
        statusText = '판매 가능';
        if (currentStock < 20) {
            statusText += ' (재고 부족 임박)';
        }
    }

    // 판단 로직 비용 시뮬레이션
    for (let i = 0; i < 10000000; i++) { /* busy wait */ }


    return { isSellable, statusText };
};
