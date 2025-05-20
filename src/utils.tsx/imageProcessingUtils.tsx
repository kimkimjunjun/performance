// src/utils/imageProcessingUtils.ts

interface RawProductImage {
    id: string;
    url: string;
    fileName: string;
    caption: string; // 이미지 설명 (원본)
    displayOrder: number; // 목록 내 표시 순서
    isHidden: boolean; // 사용자에게 숨김 여부
    uploadedAt: number; // Unix timestamp
}

interface ProcessedImageItem {
    id: string;
    url: string;
    fileName: string;
    caption: string; // 가공될 수 있음
    displayOrder: number;
    isHidden: boolean;
    uploadedAt: string; // 포맷된 날짜 문자열
    statusText: string; // 숨김 여부 및 순서 상태 표시
}

interface ImageSummary {
    totalCount: number;
    visibleCount: number;
    hiddenCount: number;
    hasHiddenImages: boolean;
    primaryImageStatus: string; // 예: "대표 이미지 (순서 1)" 또는 "대표 이미지 없음"
}

/**
 * 원본 이미지 데이터 목록을 화면 표시에 적합한 형태로 가공하고 정렬합니다.
 * 가공 및 정렬 비용이 데이터 양에 비례한다고 가정합니다.
 */
export const processAndSortImages = (images: RawProductImage[]): ProcessedImageItem[] => {
    console.log(`🔄 [UTILS] 이미지 데이터 가공 및 정렬 중...`);

    const processed = images.map(img => {
        // 날짜 포맷팅
        const uploadedAt = new Date(img.uploadedAt * 1000).toLocaleDateString();
        // 상태 텍스트 생성
        const statusText = img.isHidden ? `숨김 (순서: ${img.displayOrder})` : `노출 (순서: ${img.displayOrder})`;

        // 기타 복잡한 가공 로직이 있을 수 있음
        // 예: 파일명에서 확장자 제거, 특정 키워드 포함 시 경고 플래그 추가 등

        return {
            id: img.id,
            url: img.url,
            fileName: img.fileName,
            caption: img.caption,
            displayOrder: img.displayOrder,
            isHidden: img.isHidden,
            uploadedAt: uploadedAt,
            statusText: statusText,
        };
    });

    // 표시 순서에 따라 정렬
    processed.sort((a, b) => a.displayOrder - b.displayOrder);

    // 계산 비용 시뮬레이션
    for (let i = 0; i < 30000000; i++) { /* busy wait */ }

    return processed;
};

/**
 * 가공된 이미지 목록을 바탕으로 전체 이미지 요약 정보를 계산합니다.
 * 계산 비용이 데이터 양에 비례한다고 가정합니다.
 */
export const calculateImageSummary = (processedImages: ProcessedImageItem[]): ImageSummary => {
    console.log(`📊 [UTILS] 이미지 요약 정보 계산 중...`);

    const totalCount = processedImages.length;
    const visibleCount = processedImages.filter(img => !img.isHidden).length;
    const hiddenCount = totalCount - visibleCount;
    const hasHiddenImages = hiddenCount > 0;

    // 대표 이미지 상태 판단 (순서 1번 이미지가 대표 이미지라 가정)
    const primaryImage = processedImages.find(img => img.displayOrder === 1 && !img.isHidden);
    const primaryImageStatus = primaryImage ? `대표 이미지 (${primaryImage.fileName})` : '대표 이미지 없음';

    // 계산 비용 시뮬레이션
    for (let i = 0; i < 20000000; i++) { /* busy wait */ }

    return {
        totalCount,
        visibleCount,
        hiddenCount,
        hasHiddenImages,
        primaryImageStatus,
    };
};

// 기타 유틸리티 함수 (예: validateImageMetadata 등)
