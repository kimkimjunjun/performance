import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';

// 주문 데이터의 실제 구조는 백엔드 API 명세를 따르지만,
// 현재 코드에는 타입 정의가 명시적으로 되어있지 않다고 가정합니다.
// 예시 데이터 구조: { id: string; product: string; quantity: number; status: string; }
interface AllOrderType {
    id: string;
    product: string;
    quantity: number;
    status: string;
}

type FilterStauts = 'All' | AllOrderType['status']

function OrderList() { // Prop 타입이 정의되지 않음
    const [allOrders, setAllOrders] = useState<AllOrderType[]>([]); // 타입 불명확
    const [filterStatus, setFilterStatus] = useState<FilterStauts>('All'); // 필터 상태

    useEffect(() => {
        // 실제로는 API 호출을 통해 데이터를 가져오지만, 여기서는 임의 데이터 사용
        const fetchedOrders: AllOrderType[] = [
            { id: '1', product: 'Product A', quantity: 10, status: 'Pending' },
            { id: '2', product: 'Product B', quantity: 5, status: 'Completed' },
            { id: '3', product: 'Product C', quantity: 20, status: 'Pending' },
            { id: '4', product: 'Product A', quantity: 3, status: 'Completed' },
        ];
        setAllOrders(fetchedOrders);
    }, []); // 컴포넌트 마운트 시 한 번만 실행되도록 의존성 배열 비워둠


    const filteredOrdered = useMemo(() => {
        if (filterStatus === 'All') return allOrders
        else return allOrders.filter((order) => order.status === filterStatus);
    }, [allOrders, filterStatus])
    // filterStatus 또는 allOrders가 변경될 때마다 필터링 다시 수행

    // 필터 상태 변경 이벤트 핸들러
    const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => { // 이벤트 객체 타입 불명확
        setFilterStatus(event.target.value);
        // Note: 필터링 로직은 별도의 useEffect에서 처리됨
    };

    return (
        <div>
            <h2>주문 목록</h2>
            <div>
                <label htmlFor="statusFilter">상태별 필터:</label>
                <select id="statusFilter" value={filterStatus} onChange={handleFilterChange}>
                    <option value="All">전체</option>
                    <option value="Pending">대기중</option>
                    <option value="Completed">완료</option>
                </select>
            </div>
            <ul>
                {/* map 함수 내에서 order 객체의 타입이 any로 추론됨 */}
                {filteredOrdered.map((order: any) => (
                    <li key={order.id}>
                        {order.product} - {order.quantity}개 - 상태: {order.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default OrderList;
