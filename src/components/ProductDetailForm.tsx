import React, { ChangeEvent, useEffect, useState } from 'react';

// 상품 데이터의 실제 구조는 백엔드 API 명세를 따르지만,
// 현재 코드에는 타입 정의가 명시적으로 되어있지 않다고 가정합니다.
// 예시 데이터 구조: { id: string; name: string; description: string; price: number; status: string; }
interface ProductType {
    name: string;
    description: string;
    price: number | string;
    status: string;
}

interface submitType {
    initialData?: ProductType;
    onSubmit: (value: ProductType) => void;
}

function ProductDetailForm({ initialData, onSubmit }: submitType) { // Prop 타입 정의 누락
    // 각 필드의 상태를 개별적으로 관리
    const [formData, setFormData] = useState<ProductType>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price ?? '',
        status: initialData?.status || 'Pending'
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData?.name || '',
                description: initialData?.description || '',
                price: initialData?.price ?? '',
                status: initialData?.status || 'Pending'
            })
        }
    }, [initialData])

    // 각 필드별 변경 이벤트 핸들러
    const handleEventChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { // 이벤트 타입 불명확
        const { name, value } = event.target

        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? (value === '' ? '' : Number(value)) : value,
        }))
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!formData.name.trim()) {
            alert("상품 이름은 필수입니다.")
            return;
        }

        if (formData.price === '' || isNaN(Number(formData.price))) {
            alert("상품 가격은 필수입니다.")
            return;
        }

        onSubmit({
            ...formData,
            price: Number(formData.price)
        })
    };

    return (
        <div>
            <h2>상품 정보 편집</h2>
            <div>
                <label htmlFor="productName">상품 이름:</label>
                <input id="productName" type="text" value={formData.name} onChange={handleEventChange} />
            </div>
            <div>
                <label htmlFor="productDescription">상품 설명:</label>
                <textarea id="productDescription" value={formData.description} onChange={handleEventChange}></textarea>
            </div>
            <div>
                <label htmlFor="productPrice">상품 가격:</label>
                {/* type="number" 사용 시 브라우저 호환성 및 입력 제어 문제가 있을 수 있어 text로 하고 수동 검증하는 경우도 많음 */}
                <input id="productPrice" type="text" value={formData.price} onChange={handleEventChange} />
            </div>
            <div>
                <label htmlFor="productStatus">상태:</label>
                <select id="productStatus" value={formData.status} onChange={handleEventChange}>
                    <option value="Pending">대기중</option>
                    <option value="Active">활성</option>
                    <option value="SoldOut">품절</option>
                </select>
            </div>
            <button onClick={() => handleSubmit}>저장</button>
        </div>
    );
}

export default ProductDetailForm;
