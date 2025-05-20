// src/hooks/useProductImageData.ts
import { useState, useEffect } from 'react';

interface RawProductImage {
    id: string;
    url: string;
    fileName: string;
    caption: string; // 이미지 설명 (원본)
    displayOrder: number; // 목록 내 표시 순서
    isHidden: boolean; // 사용자에게 숨김 여부
    uploadedAt: number; // Unix timestamp
}


// 더미 이미지 데이터 생성
const generateDummyImages = (count: number): RawProductImage[] => {
    const images: RawProductImage[] = [];
    for (let i = 0; i < count; i++) {
        const isHidden = Math.random() > 0.8; // 20% 숨김
        images.push({
            id: `img-${i + 1}`,
            url: `https://example.com/images/product/img-${i + 1}.jpg`,
            fileName: `product_image_${i + 1}.jpg`,
            caption: `상품 이미지 설명 ${i + 1}`,
            displayOrder: i + 1, // 순서대로
            isHidden: isHidden,
            uploadedAt: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 365 * 24 * 3600), // 최근 1년 이내
        });
    }
    // 순서를 랜덤하게 섞어서 정렬 로직이 필요함을 시뮬레이션
    images.sort(() => Math.random() - 0.5);
    return images;
};

const ALL_DUMMY_IMAGES: RawProductImage[] = generateDummyImages(50); // 50개의 이미지 데이터 생성 (더 많을 수 있음)

const fetchProductImages = async (productId: string): Promise<RawProductImage[]> => {
    console.log(`🌐 [HOOK] 상품 이미지 데이터 페칭 중: ${productId}`);
    // 실제 API 호출 대신 setTimeout으로 시뮬레이션
    return new Promise(resolve => {
        setTimeout(() => {
            // 실제로는 productId에 따라 다른 데이터 반환
            resolve(ALL_DUMMY_IMAGES); // 항상 동일한 더미 데이터 반환
        }, 600); // 0.6초 지연
    });
};


interface UseProductImageData {
    images: RawProductImage[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => void; // 데이터 새로고침 함수
}

const useProductImageData = (productId: string): UseProductImageData => {
    const [images, setImages] = useState<RawProductImage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [lastFetchTime, setLastFetchTime] = useState<number>(0); // 새로고침 트리거용 상태

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const imageData = await fetchProductImages(productId);
                setImages(imageData);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error('이미지 데이터 로딩 중 오류 발생'));
                }
                setImages([]); // 에러 시 데이터 초기화
            } finally {
                setIsLoading(false);
            }
        };

        loadData();

    }, [productId, lastFetchTime]); // productId 또는 lastFetchTime 변경 시 데이터 다시 로드

    const refetch = () => {
        setLastFetchTime(Date.now()); // 상태를 업데이트하여 Effect 트리거
    };


    return { images, isLoading, error, refetch };
};

export default useProductImageData;
