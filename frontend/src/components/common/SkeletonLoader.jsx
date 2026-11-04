import React from 'react';

export const SkeletonRow = ({ columns = 5 }) => {
    return (
        <tr style={{ animation: 'pulseGlow 1.5s ease-in-out infinite' }}>
            {Array.from({ length: columns }).map((_, idx) => (
                <td key={idx} style={{ padding: '1rem', minHeight: '3.5rem' }}>
                    <div style={{
                            height: '1.125rem',
                            background: 'var(--surface-2)',
                            borderRadius: 'var(--radius-control)',
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
            background: 'var(--surface)',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--line)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            animation: 'pulseGlow 1.5s ease-in-out infinite'
        }}>
            <div style={{ height: '1.25rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-control)', width: '50%' }} />
            <div style={{ height: '2.25rem', background: 'var(--line)', borderRadius: 'var(--radius-control)', width: '35%' }} />
            <div style={{ height: '0.875rem', background: 'var(--surface-2)', borderRadius: 'var(--radius-control)', width: '70%' }} />
        </div>
    );
};

export default { SkeletonRow, SkeletonCard };
