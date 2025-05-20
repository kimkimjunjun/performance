// --- userSettings.ts (설정 데이터 타입 정의 - 현재는 사용되지 않음) ---
/*
export interface UserSettings {
    showExperimentalFeatures: boolean;
    itemsPerPage: number;
    enableDarkMode: boolean;
}
*/
// ----------------------------------------------------------------------

// --- RootComponent.tsx (최상위 컴포넌트 - 설정 데이터를 불러온다고 가정) ---
import React, { useState, useEffect } from 'react';

// 가상의 사용자 설정 데이터 구조 (현재는 타입 없이 사용)
// interface UserSettings { showExperimentalFeatures: boolean; itemsPerPage: number; enableDarkMode: boolean; }

function RootComponent() {
    // 실제로는 API 호출 등으로 설정 데이터를 불러옴
    const [settings, setSettings] = useState<any | null>(null); // 타입 불명확

    useEffect(() => {
        // 비동기 데이터 불러오기 시뮬레이션 (예: 1초 후 데이터 로드)
        const fetchSettings = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const fetchedSettings = {
                showExperimentalFeatures: true,
                itemsPerPage: 20,
                enableDarkMode: false,
            };
            setSettings(fetchedSettings);
        };

        fetchSettings();
    }, []);

    if (!settings) {
        return <div>설정 불러오는 중...</div>;
    }

    // 설정 데이터를 하위 컴포넌트로 Prop Drilling
    return (
        <div>
            <h1>백오피스 대시보드</h1>
            <DashboardLayout
                // 필요한 설정 Prop들을 개별적으로 전달
                showExperimentalFeatures={settings.showExperimentalFeatures}
                itemsPerPage={settings.itemsPerPage}
                enableDarkMode={settings.enableDarkMode}
            />
        </div>
    );
}

export default RootComponent;

// --- DashboardLayout.tsx (중간 컴포넌트 1 - 설정을 직접 사용하지 않지만 하위로 전달) ---
// Prop 타입 정의 누락
// interface DashboardLayoutProps { showExperimentalFeatures: boolean; itemsPerPage: number; enableDarkMode: boolean; }

// Props를 받아서 그대로 하위 컴포넌트로 다시 전달
function DashboardLayout(props: any) { // Prop 타입 불명확
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar
                // 설정을 다시 하위 Sidebar로 전달
                showExperimentalFeatures={props.showExperimentalFeatures}
                enableDarkMode={props.enableDarkMode}
            />
            <ContentArea
                // 설정을 다시 하위 ContentArea로 전달
                itemsPerPage={props.itemsPerPage}
                enableDarkMode={props.enableDarkMode}
            />
        </div>
    );
}

// export default DashboardLayout; // 실제 코드에서는 export 됨

// --- Sidebar.tsx (중간 컴포넌트 2 - 일부 설정을 하위로 전달) ---
// Prop 타입 정의 누락
// interface SidebarProps { showExperimentalFeatures: boolean; enableDarkMode: boolean; }

// Props를 받아서 하위 컴포넌트로 전달
function Sidebar(props: any) { // Prop 타입 불명확
    const sidebarStyle = {
        width: '200px',
        padding: '10px',
        backgroundColor: props.enableDarkMode ? '#333' : '#f0f0f0', // 다크 모드 설정 사용
        color: props.enableDarkMode ? '#f0f0f0' : '#333', // 다크 모드 설정 사용
    };

    return (
        <div style={sidebarStyle}>
            <h3>사이드바 메뉴</h3>
            {/* 특정 설정을 필요로 하는 하위 컴포넌트로 전달 */}
            <FeatureToggleComponent
                showExperimentalFeatures={props.showExperimentalFeatures} // 실험적 기능 설정 전달
            />
            {/* 다른 메뉴 항목들... */}
        </div>
    );
}

// export default Sidebar; // 실제 코드에서는 export 됨


// --- ContentArea.tsx (중간 컴포넌트 3 - 다른 설정을 하위로 전달) ---
// Prop 타입 정의 누락
// interface ContentAreaProps { itemsPerPage: number; enableDarkMode: boolean; }

// Props를 받아서 하위 컴포넌트로 전달
function ContentArea(props: any) { // Prop 타입 불명확
    const contentStyle = {
        flexGrow: 1,
        padding: '10px',
        backgroundColor: props.enableDarkMode ? '#555' : '#fff', // 다크 모드 설정 사용
        color: props.enableDarkMode ? '#fff' : '#333', // 다크 모드 설정 사용
    };

    return (
        <div style={contentStyle}>
            <h3>메인 콘텐츠</h3>
            {/* 다른 설정을 필요로 하는 하위 컴포넌트로 전달 */}
            <DataDisplayComponent
                itemsPerPage={props.itemsPerPage} // 페이지당 항목 수 설정 전달
            />
            {/* 다른 콘텐츠들... */}
        </div>
    );
}

// export default ContentArea; // 실제 코드에서는 export 됨


// --- FeatureToggleComponent.tsx (설정을 사용하는 말단 컴포넌트 1) ---
// Prop 타입 정의 누락
// interface FeatureToggleProps { showExperimentalFeatures: boolean; }

// Prop으로 전달받은 설정을 사용
function FeatureToggleComponent(props: any) { // Prop 타입 불명확
    if (!props.showExperimentalFeatures) { // 설정 값 사용
        return null; // 실험적 기능이 꺼져있으면 아무것도 표시하지 않음
    }

    return (
        <p>✨ 새로운 실험적 기능 메뉴</p>
    );
}

// export default FeatureToggleComponent; // 실제 코드에서는 export 됨


// --- DataDisplayComponent.tsx (설정을 사용하는 말단 컴포넌트 2) ---
// Prop 타입 정의 누락
// interface DataDisplayProps { itemsPerPage: number; }

// Prop으로 전달받은 설정을 사용
function DataDisplayComponent(props: any) { // Prop 타입 불명확
    // 페이지당 항목 수 설정 사용 (가상으로 표시)
    const displayCount = props.itemsPerPage;

    return (
        <div>
            <p>데이터 목록 (페이지당 {displayCount}개 표시)</p>
            {/* 실제로는 이 설정에 따라 데이터를 불러오거나 페이징 UI가 달라질 것입니다. */}
        </div>
    );
}

// export default DataDisplayComponent; // 실제 코드에서는 export 됨
