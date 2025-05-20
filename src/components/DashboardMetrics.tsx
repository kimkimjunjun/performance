import React, { useState, useEffect } from 'react';

// 핵심 지표 데이터의 실제 구조는 백엔드 API 명세를 따르지만,
// 현재 코드에는 타입 정의가 명시적으로 되어있지 않다고 가정합니다.
// 예시 데이터 구조: { totalOrders: number; totalRevenue: number; activeAffiliates: number; }

interface DataType {
    totalOrders: number;
    totalRevenue: number;
    activeAffiliates: number;
}

type status = 'loading' | 'success' | 'error'

function DashboardMetrics() {
    const [data, setData] = useState<DataType | null>(null); // 데이터 상태 (타입 불명확, 초기값 null)
    const [status, setStatus] = useState<status>('loading'); // 로딩 상태 (초기값 true)
    const [error, setError] = useState<Error | null>(null); // 에러 상태 (타입 불명확, 초기값 null)

    useEffect(() => {
        // 비동기 데이터 불러오기 시뮬레이션
        const fetchData = async () => {
            setStatus('loading');
            setData(null);
            setError(null);
            try {
                // API 호출 대기 (예: 2초)
                await new Promise(resolve => setTimeout(resolve, 2000));

                // 성공 응답 시뮬레이션
                const result = {
                    totalOrders: 1250,
                    totalRevenue: 5500000, // 예: 원화
                    activeAffiliates: 88,
                };
                setData(result); // 데이터 상태 업데이트
                setStatus('success');
                // 에러 응답 시뮬레이션 (필요하다면 주석 해제하여 테스트)
                // throw new Error('데이터 불러오기 실패');

            } catch (err: unknown) { // 에러 객체 타입 불명확
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error('알 수 없는 오류가 발생했습니다.'));
                }
                setStatus('error');
                // 에러 상태 업데이트
            }
        };

        fetchData(); // 비동기 함수 실행

    }, []); // 컴포넌트 마운트 시 한 번만 실행되도록 의존성 배열 비워둠

    // 로딩 중, 에러 발생, 데이터 로드 완료 상태에 따른 UI 분기 처리가 명확하지 않음
    // 데이터 구조가 타입 없이 사용되어 오류 가능성 있음
    return (
        <div>
            <h3>핵심 지표</h3>
            {status === 'loading' && <p>데이터를 불러오는 중...</p>} {/* 로딩 메시지 표시 */}
            {status === 'error' && <p>데이터 불러오기 오류: {error && error.message}</p>} {/* 에러 메시지 표시 */}

            {/* 데이터가 있을 때만 표시하지만, null 체크 외에 타입 안전성 확보 필요 */}
            {status === 'success' && data && (
                <div>
                    {/* data 객체의 속성 접근 시 타입 검사 미흡 */}
                    <p>오늘 주문 수: {data.totalOrders}</p>
                    <p>총 수익: {data.totalRevenue} 원</p>
                    <p>활성 파트너사: {data.activeAffiliates} 개</p>
                </div>
            )}

            {/* 로딩 중도 아니고 에러도 아니고 데이터도 없을 때의 처리가 명확하지 않음 */}
            {/* {!loading && !error && !data && <p>표시할 데이터가 없습니다.</p>} */}
        </div>
    );
}

export default DashboardMetrics;
