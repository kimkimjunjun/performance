import { useEffect, useMemo, useState } from "react";

interface ProductTypes {
    id: number;
    name: string;
    price: number;
    totalCount: number;
}

const DUMMY_DATA: ProductTypes[] = [
    { id: 1, name: "더미1", price: 100000, totalCount: 5 },
    { id: 2, name: "더미2", price: 1000000, totalCount: 6 },
    { id: 3, name: "더미3", price: 500000, totalCount: 8 },
    { id: 4, name: "더미4", price: 800000, totalCount: 2 },
]

export const getData = (): Promise<ProductTypes[]> => {
    return new Promise(resolve =>
        setTimeout(() => {
            resolve(DUMMY_DATA);
        }, 1000)
    )
}

export default function AffiliateCategoryEarningsTable() {
    const [product, setProduct] = useState<ProductTypes[]>([])

    useEffect(() => {
        const productData = async () => {
            try {
                const res = await getData()
                setProduct(res)
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.log(err)
                } else {
                    console.log(new Error(`알 수 없는 에러가 발생했습니다.`))
                }
            }
        }
        productData();
    }, [])

    const sortedProductsByPrice = useMemo(() => {
        if (!product || !Array.isArray(product) || product.length === 0) return []
        return [...product].sort((a, b) => b.price - a.price)
    }, [product])


    return (
        <div>
            <h3>가격별 상품 정렬 (내림차순)</h3>
            {/* 정렬된 데이터를 화면에 표시하는 예시 */}
            <ul>
                {sortedProductsByPrice.map((item) => (
                    <li key={item.id}>
                        {item.name} - 가격: {item.price.toLocaleString()}원, 판매 수: {item.totalCount}개
                    </li>
                ))}
            </ul>
        </div>
    )
}