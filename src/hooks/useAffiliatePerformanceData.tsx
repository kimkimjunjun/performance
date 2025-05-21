import { useSetRecoilState } from 'recoil';
import {
    AffiliatePerformanceItem,
    affiliatePerformanceState,
    affiliatePerformanceLoadingState,
    affiliatePerformanceErrorState
} from '../atom/recoilState'; // Recoil 상태 정의 파일 경로에 맞춰 수정

// 가상 API 호출 함수 (실제 API 호출 로직으로 대체 필요)
const fetchPerformanceData = async (affiliateId: string): Promise<AffiliatePerformanceItem[]> => {
    console.log(`제휴사 ID ${affiliateId}의 실적 데이터 가져오는 중...`);
    // 실제 API 호출 (예: fetch('/api/performance', { body: JSON.stringify({ affiliateId }) }))
    // 여기서는 더미 데이터를 비동기적으로 반환하도록 시뮬레이션합니다.
    const DUMMY_PERFORMANCE_DATA: AffiliatePerformanceItem[] = [
        { id: 'order_101', category: '전자제품', amount: 150000, date: '2023-10-01' },
        { id: 'order_102', category: '의류', amount: 85000, date: '2023-10-01' },
        { id: 'order_103', category: '전자제품', amount: 220000, date: '2023-10-02' },
        { id: 'order_104', category: '도서', amount: 30000, date: '2023-10-02' },
        { id: 'order_105', category: '의류', amount: 120000, date: '2023-10-03' },
        // ... 더 많은 데이터
    ];

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(DUMMY_PERFORMANCE_DATA);
        }, 1500); // 1.5초 지연 시뮬레이션
    });
};

// 제휴사 실적 데이터를 가져오는 커스텀 훅
export const useAffiliatePerformanceData = () => {
    // Recoil 상태를 업데이트하는 setter 함수 가져오기
    const setPerformanceState = useSetRecoilState(affiliatePerformanceState);
    const setLoadingState = useSetRecoilState(affiliatePerformanceLoadingState);
    const setErrorState = useSetRecoilState(affiliatePerformanceErrorState);

    // 데이터를 가져오는 함수
    const loadPerformanceData = async (affiliateId: string) => {
        setLoadingState(true); // 로딩 시작
        setErrorState(null); // 이전 에러 초기화
        try {
            const data = await fetchPerformanceData(affiliateId);
            setPerformanceState(data); // Recoil 상태 업데이트
        } catch (err) {
            console.error("Failed to fetch performance data:", err);
            setErrorState("실적 데이터를 가져오는 데 실패했습니다."); // 에러 상태 업데이트
            setPerformanceState([]); // 데이터 상태 초기화 (에러 시)
        } finally {
            setLoadingState(false); // 로딩 종료
        }
    };

    // 외부에서 사용할 함수를 반환
    return { loadPerformanceData };
};
