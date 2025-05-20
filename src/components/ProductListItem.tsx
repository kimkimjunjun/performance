import React from 'react';

// 상품 데이터의 실제 구조는 백엔드 API 명세를 따르지만,
// 현재 이 컴포넌트에서는 여러 개의 개별 Prop으로 데이터를 받고 있습니다.
interface DataProps {
    id: number;
    name: string;
    price: number;
    status: boolean;
}

interface ProductListItemProps {
    product: DataProps;
    onEdit: (id: number) => void
}

function ProductListItem({ product, onEdit }: ProductListItemProps) { // Prop 타입 정의 누락 및 any 사용
    // '수정' 버튼 클릭 시 호출될 내부 함수
    const onEditButtonClick = () => {
        onEdit(product.id); // productId 전달
    };

    return (
        <form style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            {/* 상품 정보 표시 */}
            <div>ID: {product.id}</div>
            <div>상품 이름: {product.name}</div>
            <div>가격: {product.price}</div>
            <div>상태: {product.status}</div>

            {/* '수정' 버튼 */}
            <button onClick={onEditButtonClick}>수정</button>
            {/* '삭제' 버튼 등 다른 버튼이 추가될 수도 있습니다. */}
        </form>
    );
}

export default ProductListItem;
