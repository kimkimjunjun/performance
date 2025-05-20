// src/api.ts

import { Product, ProductVariant, ApiResponse, SaveProductPayload, SaveProductResponseData, ProductApiResponse } from './types';

// --- 가상 API 호출 시뮬레이션 ---

// 가상 상품 데이터 (변형 포함)
const mockProduct: Product = {
    id: 1,
    name: '프리미엄 티셔츠',
    basePrice: 30000,
    variants: [
        { localId: 'v1', name: 'S 사이즈 - 블랙', priceAdjustment: 0, stock: 50, sku: 'TS-BLK-S' },
        { localId: 'v2', name: 'M 사이즈 - 블랙', priceAdjustment: 0, stock: 50, sku: 'TS-BLK-M' },
        { localId: 'v3', name: 'L 사이즈 - 화이트', priceAdjustment: 5000, stock: 30, sku: 'TS-WHT-L' },
    ],
    category: '의류',
    description: '고품질 면 소재 티셔츠입니다.',
};

// 상품 데이터 가져오기 API 시뮬레이션 (특정 ID 상품 가정)
export const fetchProduct = (productId: number): Promise<ProductApiResponse> => {
    console.log(`API Call: Fetching product ${productId}...`);
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('API Response: Product fetched.');
            // mockProduct의 변형 목록에 localId가 없으면 추가 (생성 시뮬레이션)
            const productWithLocalIds = {
                ...mockProduct,
                variants: mockProduct.variants.map(v => ({
                    ...v,
                    localId: v.localId || Math.random().toString(16).slice(2), // 고유 localId 생성
                })),
            };
            resolve({
                data: productWithLocalIds, // 가상 데이터 반환
                message: '상품 정보를 성공적으로 가져왔습니다.',
                success: true,
            });
        }, 1000); // 1초 딜레이
    });
};

// 상품 데이터 저장 API 시뮬레이션 (업데이트만 가정)
export const saveProduct = (payload: SaveProductPayload): Promise<ApiResponse<SaveProductResponseData>> => {
    console.log('API Call: Saving product with payload', payload);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 가상 저장 로직: 실제 앱에서는 서버 통신 후 응답 처리
            console.log(`API Response: Product saved successfully (simulated). ID: ${payload.id}`);

            // 20% 확률로 실패 시뮬레이션
            if (Math.random() < 0.2) {
                console.error('API Response: Product save failed (simulated error).');
                reject(new Error('상품 정보 저장 중 서버 오류 발생 (시뮬레이션)'));
                return;
            }

            // 성공 시 응답 데이터 반환
            resolve({
                data: { productId: payload.id, success: true },
                message: '상품 정보가 성공적으로 저장되었습니다.',
                success: true,
            });
        }, 1500); // 1.5초 딜레이
    });
};
