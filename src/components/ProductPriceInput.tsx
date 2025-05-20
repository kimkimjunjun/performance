import React, { useState, useEffect, ChangeEvent } from 'react';

interface propsData {
    initialPrice?: string;
    onPriceChange: (price: string) => void;
}

function ProductPriceInput({ initialPrice, onPriceChange }: propsData) {
    const [price, setPrice] = useState('');

    useEffect(() => {
        if (initialPrice) {
            setPrice(initialPrice);
        }
    }, [initialPrice]);

    const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        // 숫자만 입력받도록 검증 로직 필요
        setPrice(value);
        if (onPriceChange) {
            onPriceChange(value);
        }
    };

    return (
        <div>
            <label htmlFor="price">상품 가격:</label>
            <input
                id="price"
                type="text"
                value={price}
                onChange={handlePriceChange}
                placeholder="가격을 입력하세요"
            />
        </div>
    );
}

export default ProductPriceInput;
