// src/components/SourcingProductDetail.tsx
import React, { useState, ChangeEvent, useMemo, useCallback } from 'react';
import useSourcingProductData from '../hooks/useSourcingProductData';
import { calculateProfit, parseTechSpecs, determineSellableStatus } from '../utils.tsx/sourcingAnalysisUtils'

interface SourcingProductDetailProps {
    productId: string;
}

function SourcingProductDetail({ productId }: SourcingProductDetailProps) {
    const { product, exchangeRate, isLoading, error, refetch } = useSourcingProductData(productId);

    // 사용자가 임의로 변경 가능한 값 (수익 계산에 영향)
    const [manualMarginRate, setManualMarginRate] = useState<number>(0.25); // 25% 기본 마진

    // 화면 UI 상태 (데이터 계산/가공과 직접적인 관련 없음)
    const [showNotesPanel, setShowNotesPanel] = useState<boolean>(false);
    const [notesContent, setNotesContent] = useState<string>('');



    // useMemo를 사용하여 수익 계산 결과를 메모이제이션
    // product, 환율, 수동 마진율이 변경될 때만 다시 계산
    const profitData = useMemo(() => {
        console.log('📊 [Component] 수익 계산 로직 실행 (useMemo 내부)...');
        if (!product || !exchangeRate) {
            return { estimatedSalePriceKRW: 0, estimatedProfitKRW: 0, estimatedProfitMargin: 0 };
        }
        return calculateProfit(product, exchangeRate.USD_to_KRW, manualMarginRate);
    }, [product, exchangeRate?.USD_to_KRW, manualMarginRate]);

    // useMemo를 사용하여 판매 가능 상태 판단 결과를 메모이제이션
    // product 데이터가 변경될 때만 다시 판단
    const sellableStatus = useMemo(() => {
        console.log('✅ [Component] 판매 가능 상태 판단 로직 실행 (useMemo 내부)...');
        if (!product) {
            return { isSellable: false, statusText: '상품 정보 없음' };
        }
        return determineSellableStatus(product);
    }, [product]);

    // useMemo를 사용하여 기술 사양 파싱 결과를 메모이제이션
    // product 데이터의 rawTechSpecs 값이 변경될 때만 다시 파싱
    const parsedSpecs = useMemo(() => {
        console.log('📋 [Component] 사양 파싱 로직 실행 (useMemo 내부)...');
        if (!product) {
            return []
        }
        return parseTechSpecs(product.rawTechSpecs);
    }, [product?.rawTechSpecs]);

    // useCallback을 사용하여 이벤트 핸들러 함수를 메모이제이션
    const handleUpdateStock = useCallback(() => {
        console.log(`[Component] 재고 업데이트 버튼 클릭됨 for ${product?.id}`);
        // 실제 재고 업데이트 로직 호출 (product.id 사용)
    }, [product?.id]); // product?.id가 변경될 때 함수 재생성

    const handleRequestPriceChange = useCallback(() => {
        console.log(`[Component] 가격 변경 요청 버튼 클릭됨 for ${product?.id}`);
        // 실제 가격 변경 요청 로직 호출 (product.id 사용)
    }, [product?.id]); // product?.id가 변경될 때 함수 재생성

    const handleNotesChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setNotesContent(e.target.value);
    }, [setNotesContent]); // setNotesContent는 React에 의해 안정성이 보장됨

    const toggleNotesPanel = useCallback(() => {
        setShowNotesPanel(prev => !prev);
    }, [setShowNotesPanel]); // setShowNotesPanel는 React에 의해 안정성이 보장됨

    // --- 리뷰 포인트 1 끝 ---

    console.log('🔄 [Component] SourcingProductDetail 렌더링'); // 컴포넌트 렌더링 시 로그

    if (isLoading) {
        return <div>상품 정보와 환율을 불러오는 중입니다...</div>;
    }

    if (error) {
        return (
            <div>
                오류 발생: {error.message}
                <button onClick={refetch}>다시 시도</button>
            </div>
        );
    }

    if (!product || !exchangeRate) {
        return <div>데이터를 찾을 수 없습니다.</div>;
    }

    // --- 리뷰 포인트 2 끝 ---


    return (
        <div style={{ border: '1px solid #ff0000', padding: '15px' }}>
            <h2>해외 소싱 상품 상세: {product.name}</h2>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={refetch} style={{ marginRight: '10px' }}>데이터 새로고침</button>
                <button onClick={handleUpdateStock} style={{ marginRight: '10px' }}>재고 업데이트</button>
                <button onClick={handleRequestPriceChange} style={{ marginRight: '10px' }}>가격 변경 요청</button>
                <button onClick={toggleNotesPanel}>운영 노트 {showNotesPanel ? '숨기기' : '보이기'}</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* 좌측: 기본 정보 및 사양 */}
                <div>
                    <h4>기본 정보</h4>
                    <p>ID: {product.id}</p>
                    <p>소싱 상태: {product.sourcingStatus}</p>
                    <p>현재 재고: {product.currentStock}개</p>
                    <p>내부 승인: {product.internalApproval ? '완료' : '필요'}</p>

                    <h4 style={{ marginTop: '15px' }}>기술 사양</h4>
                    {parsedSpecs.length > 0 ? (
                        <ul>
                            {parsedSpecs.map((spec, index) => (
                                <li key={index} style={{ fontSize: '0.9em' }}>
                                    <strong>{spec.key}:</strong> {spec.value}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>사양 정보 없음</p>
                    )}
                </div>

                {/* 우측: 수익성 분석 및 판매 가능 상태 */}
                <div>
                    <h4>수익성 분석</h4>
                    <p>기준 원가 (USD): ${product.baseCostUSD}</p>
                    <p>현재 환율 (USD/KRW): {exchangeRate.USD_to_KRW.toFixed(2)} ({new Date(exchangeRate.lastUpdated).toLocaleString()})</p>
                    <div>
                        수동 마진율 (%):
                        <input
                            type="number"
                            value={manualMarginRate * 100}
                            onChange={(e) => setManualMarginRate(parseFloat(e.target.value) / 100 || 0)}
                            style={{ width: '60px', marginLeft: '5px' }}
                        />
                    </div>

                    <div style={{ marginTop: '10px' }}>
                        <p>예상 판매가 (KRW): <strong>{profitData.estimatedSalePriceKRW.toLocaleString()} 원</strong></p>
                        <p>예상 수익 (KRW): <strong>{profitData.estimatedProfitKRW.toLocaleString()} 원</strong></p>
                        <p>예상 수익률: <strong>{profitData.estimatedProfitMargin}%</strong></p>
                    </div>

                    <h4 style={{ marginTop: '15px' }}>판매 가능 상태</h4>
                    <p style={{ fontWeight: 'bold', color: sellableStatus.isSellable ? 'green' : 'red' }}>
                        {sellableStatus.statusText} ({sellableStatus.isSellable ? '판매 가능' : '판매 불가능'})
                    </p>
                </div>
            </div>

            {/* 리뷰 포인트 3: 계산/가공과 무관한 패널 */}
            {showNotesPanel && (
                <div style={{ border: '1px dashed blue', padding: '10px', marginTop: '20px' }}>
                    <h4>운영 노트</h4>
                    <textarea
                        value={notesContent}
                        onChange={handleNotesChange}
                        placeholder="상품 관련 메모 입력..."
                        rows={4}
                        style={{ width: '98%' }}
                    />
                    <p style={{ fontSize: '0.9em', color: 'blue', marginTop: '5px' }}>
                        **확인:** 위의 텍스트 에어리어에 타이핑하거나 '도움말 숨기기/보이기' 버튼을 눌러보세요.
                        부모 컴포넌트는 리렌더링되지만, 계산/파싱 로직이 불필요하게 다시 실행될까요?
                    </p>
                </div>
            )}

            <p style={{ fontSize: '0.9em', color: 'red', marginTop: '20px' }}>
                **코드 리뷰 중점:** 위 코드에서 성능을 개선하고 불필요한 계산/함수 재생성을 막기 위해 useMemo 또는 useCallback 훅을 어떻게 적용할 수 있을지 검토하고 제안하세요. 또한 코드의 가독성, 유지보수성, 타입 안전성 측면에서 개선할 부분도 찾아보세요.
            </p>

        </div>
    );
}

export default SourcingProductDetail;
