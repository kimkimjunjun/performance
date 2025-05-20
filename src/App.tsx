// src/App.tsx

import React from 'react';
import SourcingProductDetail from './components/SourcingProductDetail';

function App() {
  console.log('App rendered'); // App 컴포넌트 리렌더링 확인 로그

  return (
    // SettingsProvider로 애플리케이션의 일부 또는 전체를 감싸서 설정 Context를 제공
    <div>
      <SourcingProductDetail productId='2' />
    </div>
  );
}

export default App;
