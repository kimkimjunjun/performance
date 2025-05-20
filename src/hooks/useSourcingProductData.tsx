// src/hooks/useSourcingProductData.ts
import { useState, useEffect } from 'react';

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

interface ExchangeRateData {
    USD_to_KRW: number;
    lastUpdated: string; // ISO date string
}

// 더미 데이터 및 페칭 시뮬레이션
const DUMMY_PRODUCT_DATA: RawSourcingProductData = {
    id: 'src-123',
    name: '프리미엄 해외 가젯',
    baseCostUSD: 150,
    currentStock: 55,
    sourcingStatus: 'active',
    internalApproval: true,
    rawTechSpecs: "CPU:Dual-core 1.5GHz; Display:6.2 inch OLED; Battery:4000mAh; Weight:180g; Connectivity:5G, Wi-Fi 6; Features:Waterproof, NFC",
};

const DUMMY_EXCHANGE_RATE: ExchangeRateData = {
    USD_to_KRW: 1355.50,
    lastUpdated: new Date().toISOString(),
};

const fetchProductDetail = async (productId: string): Promise<RawSourcingProductData | null> => {
    console.log(`🌐 [HOOK] 상품 상세 데이터 페칭 중: ${productId}`);
    // 실제 API 호출 대신 setTimeout으로 시뮬레이션
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(DUMMY_PRODUCT_DATA); // 항상 동일한 더미 데이터 반환
        }, 500); // 0.5초 지연
    });
};

const fetchExchangeRate = async (): Promise<ExchangeRateData | null> => {
    console.log(`🌐 [HOOK] 환율 정보 페칭 중`);
    // 실제 API 호출 대신 setTimeout으로 시뮬레이션
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(DUMMY_EXCHANGE_RATE); // 항상 동일한 더미 데이터 반환
        }, 300); // 0.3초 지연
    });
};


interface UseSourcingProductData {
    product: RawSourcingProductData | null;
    exchangeRate: ExchangeRateData | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void; // 데이터 새로고침 함수
}

const useSourcingProductData = (productId: string): UseSourcingProductData => {
    const [product, setProduct] = useState<RawSourcingProductData | null>(null);
    const [exchangeRate, setExchangeRate] = useState<ExchangeRateData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [lastFetchTime, setLastFetchTime] = useState<number>(0); // 새로고침 트리거용 상태

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [productData, rateData] = await Promise.all([
                    fetchProductDetail(productId),
                    fetchExchangeRate()
                ]);
                setProduct(productData);
                setExchangeRate(rateData);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error('데이터 로딩 중 알 수 없는 오류 발생'));
                }
                setProduct(null); // 에러 시 데이터 초기화
                setExchangeRate(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();

    }, [productId, lastFetchTime]); // productId 또는 lastFetchTime 변경 시 데이터 다시 로드

    const refetch = () => {
        setLastFetchTime(Date.now()); // 상태를 업데이트하여 Effect 트리거
    };


    return { product, exchangeRate, isLoading, error, refetch };
};

export default useSourcingProductData;

