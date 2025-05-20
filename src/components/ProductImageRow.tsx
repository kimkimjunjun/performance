// src/components/ProductImageRow.tsx
import React, { ChangeEvent } from 'react';

// useImageProcessingUtils에서 정의된 타입을 임포트한다고 가정
// import { ProcessedImageItem } from '../utils/imageProcessingUtils';

// 화면 표시에 사용될 가공된 상품 데이터 타입 정의
interface ProcessedImageItem {
    id: string;
    url: string;
    fileName: string;
    caption: string; // 가공될 수 있음
    displayOrder: number; // 목록 내 표시 순서
    isHidden: boolean; // 사용자에게 숨김 여부
    uploadedAt: string; // 포맷된 날짜 문자열
    statusText: string; // 숨김 여부 및 순서 상태 표시
}

interface ProductImageRowProps {
    image: ProcessedImageItem;
    onCaptionChange: (imageId: string, newCaption: string) => void;
    onToggleVisibility: (imageId: string, isHidden: boolean) => void;
    onRemove: (imageId: string) => void;
    // ... 기타 액션 핸들러 (예: onMoveUp, onMoveDown 등)
}

// React.memo로 감싸서 props가 변경되지 않으면 리렌더링되지 않도록 함
// props 비교 로직은 기본 얕은 비교 사용
const ProductImageRow = React.memo(({ image, onCaptionChange, onToggleVisibility, onRemove }: ProductImageRowProps) => {
    console.log(`✨ [Item] ProductImageRow 렌더링: ${image.fileName} (ID: ${image.id})`); // 렌더링 시 로그

    const handleCaptionInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        onCaptionChange(image.id, e.target.value);
    };

    const handleToggleVisibilityClick = () => {
        onToggleVisibility(image.id, !image.isHidden);
    };

    const handleRemoveClick = () => {
        onRemove(image.id);
    };

    return (
        <div style={{ border: '1px solid #eee', padding: '10px', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <img src={image.url} alt={image.fileName} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px' }} />
            <div style={{ flexGrow: 1 }}>
                <strong>{image.fileName}</strong>
                <p style={{ fontSize: '0.9em', color: '#555', margin: '5px 0' }}>
                    업로드: {image.uploadedAt} | 상태: {image.statusText}
                </p>
                <div>
                    설명:
                    <input
                        type="text"
                        value={image.caption}
                        onChange={handleCaptionInputChange}
                        style={{ marginLeft: '5px', width: '80%' }}
                    />
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <button onClick={handleToggleVisibilityClick} style={{ fontSize: '0.8em', marginBottom: '5px' }}>
                    {image.isHidden ? '노출하기' : '숨기기'}
                </button>
                {/* onMoveUp, onMoveDown 버튼 등 순서 변경 버튼이 있을 수 있음 */}
                <button onClick={handleRemoveClick} style={{ fontSize: '0.8em' }}>
                    삭제
                </button>
            </div>
        </div>
    );
});

export default ProductImageRow;
