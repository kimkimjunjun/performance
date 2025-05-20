import React, { useState, useEffect, ChangeEvent, useMemo, useCallback } from 'react';

// 상품 데이터 인터페이스 (이전 과제에서 사용한 인터페이스를 재활용하거나 정의)
interface Order {
    id: string;
    product: string;
    quantity: number;
    status: 'Pending' | 'Completed' | 'Canceled'; // 가능한 상태 값을 유니온 타입으로 정의
}

// 필터 상태 타입을 정의합니다. 'All' 또는 Order 인터페이스의 status 타입
type FilterStatus = 'All' | Order['status'];

// 하위 OrderList 컴포넌트 (간소화된 형태)
// 이 컴포넌트는 Prop으로 orders와 onViewOrder를 받는다고 가정합니다.
// OrderList 컴포넌트 자체나 내부 OrderItem 컴포넌트가 React.memo로 최적화되어 있다면,
// Prop이 변경되지 않을 때 리렌더링되지 않습니다.
interface OrderListProps {
    orders: Order[]; // Order 객체 배열 타입
    onViewOrder: (orderId: string) => void; // 주문 ID를 인자로 받는 콜백 함수 타입
}

// 가상의 OrderList 컴포넌트 (실제 구현 코드는 과제 범위 밖)
const OrderList: React.FC<OrderListProps> = React.memo(({ orders, onViewOrder }) => {
    console.log('OrderList rendered'); // 리렌더링 확인을 위한 로그
    return (
        <ul>
            {orders.map(order => (
                // OrderItem 컴포넌트가 있다고 가정하며, key Prop 필수
                // OrderItem 컴포넌트도 Prop으로 order와 onViewOrder를 받을 것입니다.
                // onViewOrder Prop이 매번 새로 생성되면 OrderItem도 불필요하게 리렌더링될 수 있습니다.
                <li key={order.id} onClick={() => onViewOrder(order.id)}>
                    {order.product} - {order.status}
                </li>
            ))}
        </ul>
    );
})


function OrderDashboard() {
    // 원본 주문 데이터 상태
    const [allOrders, setAllOrders] = useState<Order[]>([]); // 타입 명시

    // 필터 상태
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('All'); // 타입 명시

    // 데이터 로딩 상태 (선택 사항이지만 비동기 로직에서는 중요)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 비동기 데이터 불러오기 시뮬레이션 (대규모 데이터 생성)
        const generateMockOrders = (count: number): Order[] => {
            const statuses: Order['status'][] = ['Pending', 'Completed', 'Canceled'];
            const orders: Order[] = [];
            for (let i = 1; i <= count; i++) {
                orders.push({
                    id: `order-${i}`,
                    product: `Product ${String.fromCharCode(65 + (i % 10))}`,
                    quantity: Math.floor(Math.random() * 10) + 1,
                    status: statuses[i % statuses.length],
                });
            }
            return orders;
        };

        const fetchData = async () => {
            setLoading(true);
            try {
                // API 호출 대기 (예: 1초)
                await new Promise(resolve => setTimeout(resolve, 1000));
                // 5000개 이상의 대규모 데이터 생성
                const fetchedOrders = generateMockOrders(5000);
                setAllOrders(fetchedOrders);
            } catch (error) {
                console.error("데이터 불러오기 오류:", error);
                // 에러 처리 로직 (예: 에러 메시지 상태 업데이트)
            } finally {
                setLoading(false);
            }
        };

        fetchData(); // 비동기 함수 실행

    }, []); // 컴포넌트 마운트 시 한 번만 실행

    // ### 필터링 로직 - 개선 필요 ###
    // allOrders나 filterStatus가 변경될 때마다 (또는 OrderDashboard가 리렌더링될 때마다)
    // 이 필터링 로직이 다시 실행됩니다.
    // 특히 allOrders 배열의 크기가 클 경우 매 렌더링 시마다 비용이 발생합니다.
    const filteredOrders = useMemo(() => {
        return allOrders.filter(order =>
            filterStatus === 'All' || order.status === filterStatus
        );
    }, [allOrders, filterStatus])
    console.log('Filtering re-calculated'); // 필터링 로직 재실행 확인을 위한 로그

    // ### 이벤트 핸들러 - 개선 필요 ###
    // 이 함수는 OrderDashboard 컴포넌트가 리렌더링될 때마다 새로 생성됩니다.
    // 하위 OrderList 컴포넌트가 이 함수를 Prop으로 받아서 사용하는데,
    // 만약 OrderList가 React.memo로 최적화되어 있더라도
    // 이 onViewOrder 함수의 "참조"가 매번 달라지므로 OrderList는 불필요하게 리렌더링됩니다.
    const handleViewOrder = useCallback((orderId: string) => {
        console.log(`주문 상세 보기: ${orderId}`);
        // 실제로는 모달을 열거나 상세 페이지로 이동하는 로직이 들어갈 것입니다.
    }, []);
    console.log('handleViewOrder re-created'); // 핸들러 함수 재생성 확인을 위한 로그


    const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setFilterStatus(event.target.value as FilterStatus); // 타입 단언
    };

    return (
        <div>
            <h2>주문 대시보드</h2>
            <div>
                <label htmlFor="statusFilter">상태별 필터:</label>
                <select id="statusFilter" value={filterStatus} onChange={handleFilterChange}>
                    <option value="All">전체</option>
                    <option value="Pending">대기중</option>
                    <option value="Completed">완료</option>
                    <option value="Canceled">취소됨</option>
                </select>
            </div>

            {loading ? (
                <p>주문 데이터를 불러오는 중...</p>
            ) : (
                // ### OrderList 컴포넌트에 필터링된 데이터와 핸들러 전달 ###
                // filteredOrders와 handleViewOrder가 최적화되지 않으면 OrderList의 불필요한 리렌더링 발생 가능
                <OrderList orders={filteredOrders} onViewOrder={handleViewOrder} />
            )}

            {/* 데이터가 없을 때 메시지 (로딩 중이 아니고 필터링 결과도 비어있을 때) */}
            {!loading && filteredOrders.length === 0 && <p>표시할 주문이 없습니다.</p>}
        </div>
    );
}

export default OrderDashboard;
