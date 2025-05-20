import React from 'react';

interface StatusTagProps {
    status: string;
    type: string;
}
// 상태 값에 따른 색상 정보를 컴포넌트 내부에 정의
const STATUS_COLORS: { [key: string]: string } = {
    '판매중': 'green',
    '품절': 'red',
    '대기중': 'gray',
    '결제 완료': 'blue',
    '배송중': 'orange',
    '배송 완료': 'purple',
    // 새로운 상태가 추가될 때마다 이 객체를 수정해야 함
};

// 상태 값에 따른 표시 텍스트 정보를 컴포넌트 내부에 정의 (현재는 상태 값 그대로 표시하지만, 복잡해질 경우를 가정)
// const STATUS_TEXTS: { [key: string]: string } = { ... };

function StatusTag({ status, type }: StatusTagProps) { // Prop 타입 정의 누락 및 any 사용

    // 상태 값에 따라 색상 결정 로직 - STATUS_COLORS 객체 사용
    // 만약 type에 따라 색상 결정 로직이 달라진다면 이곳이 더 복잡해질 수 있음
    const backgroundColor = STATUS_COLORS[status] || 'default'; // 매핑되지 않은 상태는 'default' 색상

    return (
        <span
            style={{
                backgroundColor: backgroundColor, // 결정된 배경색 적용
                color: 'white', // 텍스트 색상 고정
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
            }}
        >
            {status} {/* 표시할 텍스트 */}
        </span>
    );
}

export default StatusTag;
