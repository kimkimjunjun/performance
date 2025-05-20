// src/App.tsx

import React from 'react';
import SourcingProductDetail from './components/SourcingProductDetail';
import ProductImageManager from './components/ProductImageManager';
import AffiliateCategoryEarningsTable from './components/AffiliateCategoryEarningsTable';

function App() {
  console.log('App rendered'); // App 컴포넌트 리렌더링 확인 로그

  return (
    // SettingsProvider로 애플리케이션의 일부 또는 전체를 감싸서 설정 Context를 제공
    <div>
      <AffiliateCategoryEarningsTable />
    </div>
  );
}

export default App;
