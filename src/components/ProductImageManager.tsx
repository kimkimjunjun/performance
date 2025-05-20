// src/components/ProductImageManager.tsx
import React, { useState, ChangeEvent, useMemo, useCallback } from 'react';
import useProductImageData from '../hooks/useProductImageData';
import { processAndSortImages, calculateImageSummary } from '../utils.tsx/imageProcessingUtils';
import ProductImageRow from './ProductImageRow'; // React.memo로 최적화된 자식 컴포넌트

// useProductImageData 훅 및 유틸리티 함수에서 사용되는 타입들을 임포트한다고 가정
// import { RawProductImage, ProcessedImageItem, ImageSummary } from '../types'; // 또는 해당 파일에서 직접 임포트


interface ProductImageManagerProps {
    productId: string;
}

function ProductImageManager({ productId }: ProductImageManagerProps) {
    const { images: rawImages, isLoading, error, refetch } = useProductImageData(productId);

    // UI 관련 상태 (데이터 계산/가공과 직접적인 관련 없음)
    const [filterText, setFilterText] = useState<string>(''); // 파일명/설명 검색 필터
    const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false); // 고급 옵션 패널 토글

    // 1. 이미지 데이터 가공 및 정렬
    console.log('📊 [Component] 이미지 데이터 가공 및 정렬 로직 실행...');
    const processedImages = useMemo(() => {
        return processAndSortImages(rawImages);
    }, [rawImages])

    // 2. 검색 필터링 (가공된 데이터를 필터링)
    console.log('🔍 [Component] 이미지 데이터 필터링 중...');
    const filteredImages = useMemo(() => {
        return processedImages.filter(img =>
            img.fileName.toLowerCase().includes(filterText.toLowerCase()) ||
            img.caption.toLowerCase().includes(filterText.toLowerCase())
        );
    }, [processedImages, filterText])

    // 3. 이미지 요약 정보 계산 (필터링된 데이터 기반)
    console.log('📈 [Component] 이미지 요약 정보 계산 로직 실행...');
    const imageSummary = useMemo(() => {
        return calculateImageSummary(filteredImages);
    }, [filteredImages])

    const handleCaptionChange = useCallback((imageId: string, newCaption: string) => {
        console.log(`[Component] 설명 변경 핸들러 실행: ${imageId} -> "${newCaption}"`);
        // 실제 이미지 데이터(rawImages) 상태를 업데이트하는 로직이 필요
        // setRawImages(...)
    }, []);

    const handleToggleVisibility = useCallback((imageId: string, isHidden: boolean) => {
        console.log(`[Component] 노출/숨김 토글 핸들러 실행: ${imageId} -> ${isHidden}`);
        // 실제 이미지 데이터(rawImages) 상태를 업데이트하는 로직이 필요
        // setRawImages(...)
    }, []);

    const handleRemoveImage = useCallback((imageId: string) => {
        console.log(`[Component] 이미지 삭제 핸들러 실행: ${imageId}`);
        // 실제 이미지 데이터(rawImages) 상태를 업데이트하는 로직이 필요
        // setRawImages(...)
    }, []);

    console.log('🔄 [Component] ProductImageManager 렌더링'); // 컴포넌트 렌더링 시 로그

    if (isLoading) {
        return <div>이미지 데이터를 불러오는 중입니다...</div>;
    }

    if (error) {
        return (
            <div>
                오류 발생: {error.message}
                <button onClick={refetch}>다시 시도</button>
            </div>
        );
    }

    if (!rawImages) {
        return <div>이미지 데이터를 찾을 수 없습니다.</div>;
    }

    // --- 리뷰 포인트 1: 계산 및 가공 로직이 렌더링 시마다 실행 ---


    // --- 리뷰 포인트 1 끝 ---


    // --- 리뷰 포인트 2: 이벤트 핸들러 함수 정의 ---
    // 이 함수들은 자식 컴포넌트인 ProductImageRow에게 props로 전달됨

    // ... 기타 액션 핸들러 (예: handleMoveUp, handleMoveDown 등)
    // --- 리뷰 포인트 2 끝 ---


    const handleFilterTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilterText(e.target.value); // 이 상태 변경은 계산 로직에 영향
    };

    const toggleAdvancedOptionsPanel = () => {
        setShowAdvancedOptions(prev => !prev); // 이 상태 변경은 계산 로직/핸들러와 무관
    }


    return (
        <div style={{ border: '1px solid #ff0000', padding: '15px' }}>
            <h2>상품 이미지 관리</h2>

            <div style={{ marginBottom: '15px' }}>
                <button onClick={refetch} style={{ marginRight: '10px' }}>이미지 데이터 새로고침</button>
            </div>


            <div style={{ marginBottom: '15px' }}>
                파일명/설명 검색:
                <input
                    type="text"
                    value={filterText}
                    onChange={handleFilterTextChange}
                    placeholder="검색어 입력"
                    style={{ marginLeft: '5px', marginRight: '10px' }}
                />
                <button onClick={toggleAdvancedOptionsPanel}>고급 옵션 {showAdvancedOptions ? '숨기기' : '보이기'}</button>
            </div>

            {showAdvancedOptions && (
                <div style={{ border: '1px dashed blue', padding: '10px', marginTop: '10px' }}>
                    <h4>고급 옵션 (이미지 목록 계산과 무관)</h4>
                    <p>여기에 이미지 일괄 편집, 파일 업로드 설정 등 고급 옵션 UI가 위치합니다.</p>
                    <p style={{ fontSize: '0.9em', color: 'blue', marginTop: '5px' }}>
                        **확인:** 이 패널을 토글하거나 여기에 다른 UI 조작을 해도 이미지 가공/계산 로직이 다시 실행될까요?
                    </p>
                </div>
            )}


            <div style={{ marginTop: '15px' }}>
                <h4>이미지 요약</h4>
                <p>총 이미지: {imageSummary.totalCount}개 | 노출: {imageSummary.visibleCount}개 | 숨김: {imageSummary.hiddenCount}개</p>
                <p>{imageSummary.primaryImageStatus}</p>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '15px', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
                {/* 가공 및 필터링된 이미지 목록을 기반으로 ProductImageRow 컴포넌트 렌더링 */}
                {filteredImages.map(image => (
                    <ProductImageRow
                        key={image.id}
                        image={image} // 가공된 이미지 데이터 전달
                        onCaptionChange={handleCaptionChange} // 이벤트 핸들러 전달
                        onToggleVisibility={handleToggleVisibility} // 이벤트 핸들러 전달
                        onRemove={handleRemoveImage} // 이벤트 핸들러 전달
                    />
                ))}
            </div>

            <p style={{ fontSize: '0.9em', color: 'red', marginTop: '15px' }}>
                **코드 리뷰 중점:** 위 코드에서 성능을 개선하고 불필요한 계산/함수 재생성을 막기 위해 `useMemo`와 `useCallback` 훅을 어떻게 적용할 수 있을지 검토하고 제안하세요. 특히 계산 비용이 높은 유틸리티 함수 호출 및 자식 컴포넌트(`ProductImageRow`)에 전달되는 함수 prop에 주목하세요. 또한 코드의 가독성, 유지보수성, 타입 안전성 측면에서 개선할 부분도 찾아보세요.
            </p>

        </div>
    );
}

export default ProductImageManager;
