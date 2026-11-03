import React from 'react';

export const SkeletonRow = ({ columns = 5 }) => {
    return (
        <tr style={{ animation: 'pulseGlow 1.5s ease-in-out infinite' }}>
            {Array.from({ length: columns }).map((_, idx) => (
                <td key={idx} style={{ padding: '16px' }}>
                    <div style={{
                        height: '18px',
                        background: '#e2e8f0',
                        borderRadius: '4px',
                        width: idx === 0 ? '60%' : (idx === 1 ? '80%' : '40%')
                    }} />
                </td>
            ))}
        </tr>
    );
};

export const SkeletonCard = () => {
    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            animation: 'pulseGlow 1.5s ease-in-out infinite'
        }}>
            <div style={{ height: '20px', background: '#e2e8f0', borderRadius: '4px', width: '50%' }} />
            <div style={{ height: '36px', background: '#cbd5e1', borderRadius: '6px', width: '35%' }} />
            <div style={{ height: '14px', background: '#f1f5f9', borderRadius: '4px', width: '70%' }} />
        </div>
    );
};

export default { SkeletonRow, SkeletonCard };
