// src/types.ts

// 상품 변형 (Variant) 데이터 인터페이스
export interface ProductVariant {
    // id: string; // 기존 변형은 ID를 가질 수 있음 (생성 시에는 없을 수 있음)
    localId: string; // 폼 내부에서만 사용할 고유 임시 ID (변형 추가 시 생성)
    name: string; // 변형 이름 (예: "빨간색 M 사이즈")
    priceAdjustment: number; // 기본 가격 대비 조정 금액
    stock: number; // 변형별 재고 수량
    sku?: string; // 재고 관리 코드 (선택 사항)
}

// 상품 데이터 인터페이스 (기존 예시 + 변형 목록 포함)
export interface Product {
    id: number;
    name: string; // 상품 기본 이름
    basePrice: number; // 상품 기본 가격
    variants: ProductVariant[]; // 상품 변형 목록 (중첩된 배열)
    // 다른 상품 기본 속성들 (카테고리, 설명 등)
    category?: string;
    description?: string;
}

// API 응답 데이터의 일반적인 형태
export interface ApiResponse<T> {
    data: T | null;
    message: string;
    success: boolean;
}

// 상품 데이터 가져오기 API 응답 타입
export type ProductApiResponse = ApiResponse<Product>;

// 상품 데이터 저장 API 요청 페이로드 (Product와 유사)
export interface SaveProductPayload {
    id: number; // 상품 ID (업데이트 시 필요)
    name: string;
    basePrice: number;
    variants: ProductVariant[]; // 변형 목록
    category?: string;
    description?: string;
}

// 상품 데이터 저장 API 응답 데이터 (예시)
export interface SaveProductResponseData {
    productId: number; // 저장된 상품 ID
    success: boolean;
}

// --- フォームの状態および検証に関する型定義 ---

// フォームの状態の型（Product と同様の構造）
// 編集中の一時的な状態や検証情報を含めることができます。
// この例では Product とほぼ同じですが、後で変更される可能性があります。
export type ProductFormData = Product;

// 検証エラーの状態の型
// フィールド名をキーとし、エラーメッセージ文字列を値とします。
// ネストされた構造（variants）のエラーも表現できる必要があります。
export type ProductFormErrors = {
    [K in keyof ProductFormData]?: string; // 基本フィールドのエラー
} & {
    variants?: { // variants 配列全体のエラー（例：少なくとも1つのvariantが必要など）
        [index: number]: { // variants 配列の各要素（index）ごとのエラー
            [K in keyof ProductVariant]?: string; // variant の各フィールドのエラー
        };
        // 全体的な variants リストのエラー（例：同じ variant 名が複数存在）
        _overall?: string;
    };
    // 全体的なフォームのエラー（サーバーからのエラーなど）
    _overall?: string;
};

// 検証関数型の定義
// value: 検証対象の値、formData: フォーム全体のデータ
// エラーメッセージを返し、エラーがない場合は null を返します。
export type Validator<T> = (value: T, formData: ProductFormData) => string | null;

// 各フォームフィールドごとの検証ルールセットの型
// ネストされた構造の検証ルールも定義できる必要があります。
export type ValidationRules = {
    [K in keyof ProductFormData]?: Validator<ProductFormData[K]>[]; // 基本フィールドのルール
} & {
    variants?: {
        // variants 配列全体のルール（例：配列の最小長）
        _overall?: Validator<ProductVariant[]>[];
        // variants 配列内の各要素（ProductVariant）に対するルール
        item?: {
            [K in keyof ProductVariant]?: Validator<ProductVariant[K]>[]; // variant フィールドごとのルール
        };
        // variants 全体に対するカスタムルール（例：variant 名の重複チェック）
        _custom?: Validator<ProductVariant[]>[];
    };
};
