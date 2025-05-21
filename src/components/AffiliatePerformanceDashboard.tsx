// AffiliatePerformanceDashboard.tsx - 시작 코드 (개선 필요)
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAffiliatePerformanceData } from '../hooks/useAffiliatePerformanceData';
import { useRecoilValue } from 'recoil';
import { affiliatePerformanceErrorState, affiliatePerformanceLoadingState, affiliatePerformanceState } from '../atom/recoilState';

// 데이터 타입 정의 (필요에 따라 확장/수정)
interface AffiliatePerformanceItem {
    id: string; // 실적 항목 고유 ID
    category: string; // 상품 카테고리
    amount: number; // 발생 금액 (수익)
    date: string; // 발생 날짜 (YYYY-MM-DD 형식)
}

// 가상 API 호출 함수 (실제 API 로직으로 대체 필요)
// 현재는 컴포넌트 외부에 있지만, 커스텀 훅으로 이동해야 함
const fetchPerformanceData = async (affiliateId: string): Promise<AffiliatePerformanceItem[]> => {
    console.log(`[API Mock] 제휴사 ID ${affiliateId}의 실적 데이터 가져오는 중... (Mock)`);
    const DUMMY_DATA: AffiliatePerformanceItem[] = [
        { id: 'order_101', category: '전자제품', amount: 150000, date: '2023-10-01' },
        { id: 'order_102', category: '의류', amount: 85000, date: '2023-10-01' },
        { id: 'order_103', category: '전자제품', amount: 220000, date: '2023-10-02' },
        { id: 'order_104', category: '도서', amount: 30000, date: '2023-10-02' },
        { id: 'order_105', category: '의류', amount: 120000, date: '2023-10-03' },
        { id: 'order_106', category: '전자제품', amount: 180000, date: '2023-10-03' },
        { id: 'order_107', category: '도서', amount: 45000, date: '2023-10-04' },
        { id: 'order_108', category: '의류', amount: 95000, date: '2023-10-04' },
        { id: 'order_109', category: '전자제품', amount: 310000, date: '2023-10-05' },
        { id: 'order_110', category: '도서', amount: 60000, date: '2023-10-05' },
        { id: 'order_111', category: '의류', amount: 70000, date: '2023-10-05' },
        // 실제 과제 수행 시 이 데이터를 늘려서 성능 테스트 가능
    ];

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 데이터 Fetching 성공 또는 실패 시뮬레이션
            const shouldFail = Math.random() < 0; // 0% 확률로 실패 (테스트 편의상)
            if (shouldFail) {
                reject(new Error("API 호출 실패: 네트워크 오류"));
            } else {
                resolve(DUMMY_DATA);
            }
        }, 1000); // 1초 지연
    });
};


// 하위 컴포넌트 - 현재 React.memo 적용 안 됨 (적용 필요)
interface PerformanceListProps {
    data: AffiliatePerformanceItem[];
    onItemClick: (item: AffiliatePerformanceItem) => void; // 이 함수에 useCallback 적용 필요
}

const PerformanceList: React.FC<PerformanceListProps> = React.memo(({ data, onItemClick }) => {
    console.log('PerformanceList 렌더링'); // 렌더링 시점 확인
    if (data.length === 0) {
        return <p>표시할 실적 목록이 없습니다.</p>;
    }
    return (
        <div>
            <h4>상세 실적 목록 ({data.length}개)</h4>
            <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '10px' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>카테고리</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>금액</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>날짜</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        // onItemClick 핸들러는 부모 컴포넌트 리렌더링 시 매번 새로 생성됨
                        <tr key={item.id} onClick={() => onItemClick(item)} style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}>
                            <td style={{ padding: '8px' }}>{item.id}</td>
                            <td style={{ padding: '8px' }}>{item.category}</td>
                            <td style={{ padding: '8px' }}>{item.amount.toLocaleString()}</td>
                            <td style={{ padding: '8px' }}>{item.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
});


// 메인 대시보드 컴포넌트 - Recoil, 커스텀 훅, useMemo, useCallback 적용 필요
export default function AffiliatePerformanceDashboard({ affiliateId }: { affiliateId: string }) {
    // 현재 컴포넌트 내에서 상태 관리 -> Recoil로 변경 필요
    const performanceData = useRecoilValue<AffiliatePerformanceItem[]>(affiliatePerformanceState);
    const loading = useRecoilValue(affiliatePerformanceLoadingState);
    const error = useRecoilValue<string | null>(affiliatePerformanceErrorState);

    const { loadPerformanceData } = useAffiliatePerformanceData();

    useEffect(() => {
        if (affiliateId) {
            loadPerformanceData(affiliateId)
        }
    }, [affiliateId, loadPerformanceData])

    // --- useMemo 적용 필요 부분 ---
    // 예시: 총 수익 계산 (데이터가 많으면 비용이 커짐)
    const totalRevenue = useMemo(() => {
        return performanceData.reduce((sum, item) => sum + item.amount, 0);
    }, [performanceData])
    console.log('totalRevenue 계산'); // 이 계산이 불필요하게 자주 일어날 수 있음

    // 예시: 특정 조건 필터링 (useMemo 적용 필요)
    const highValuePerformanceData = useMemo(() => {
        return performanceData.filter(item => item.amount >= 100000);
    }, [performanceData])
    console.log('highValuePerformanceData 필터링'); // 이 필터링도 불필요하게 자주 일어날 수 있음


    // --- useCallback 적용 필요 부분 ---
    // 하위 컴포넌트로 전달될 클릭 이벤트 핸들러
    // 현재는 부모 컴포넌트 리렌더링 시 매번 새로운 함수가 생성됨 -> useCallback 적용 필요
    const handleItemClick = useCallback((item: AffiliatePerformanceItem) => {
        console.log("항목 클릭됨:", item);
        alert(`클릭된 항목:\nID: ${item.id}\n카테고리: ${item.category}\n금액: ${item.amount.toLocaleString()}원\n날짜: ${item.date}`);
    }, []);


    // --- 조건부 렌더링 (일부 개선 필요) ---
    if (loading) {
        return <p>실적 데이터를 불러오는 중입니다...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>오류 발생: {error}</p>;
    }

    if (!performanceData || performanceData.length === 0) {
        return <p>표시할 실적 데이터가 없습니다. 제휴사 ID를 확인하거나 데이터를 로드해 보세요.</p>;
    }


    // --- 대시보드 UI 렌더링 (컴포넌트 분리 및 최적화 필요) ---
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>제휴사 실적 대시보드 (ID: {affiliateId})</h2>

            {/* 총 수익 표시 */}
            <div style={{ marginBottom: '20px' }}>
                <p><strong>전체 총 수익:</strong> <span style={{ fontWeight: 'bold', color: 'green' }}>{totalRevenue.toLocaleString()}</span> 원</p>
            </div>

            {/* 상세 실적 목록 컴포넌트 (하위 컴포넌트로 분리 및 React.memo 적용 필요) */}
            <PerformanceList
                data={highValuePerformanceData} // 필터링된 데이터 사용 (useMemo 적용된 결과로 변경)
                onItemClick={handleItemClick} // useCallback 적용된 함수로 변경
            />

            {/* 필요에 따라 다른 통계/요약 컴포넌트 추가 및 분리 */}

        </div>
    );
}
