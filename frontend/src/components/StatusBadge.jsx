import React from 'react';
import { getStatusInfo } from '../utils/statusMap';

export const StatusBadge = ({ status, showText = true, size = 'normal' }) => {
    const info = getStatusInfo(status);

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: size === 'large' ? '6px 14px' : '4px 10px',
                borderRadius: 'var(--radius-pill)',
                background: info.bgVar,
                color: info.colorVar,
                border: `1px solid ${info.colorVar}`,
                fontSize: size === 'large' ? '0.95rem' : '0.88rem',
                fontWeight: '700',
                lineHeight: 1.2,
                whiteSpace: 'nowrap'
            }}
        >
            <span role="img" aria-hidden="true" style={{ fontSize: size === 'large' ? '1.05rem' : '0.95rem' }}>
                {info.icon}
            </span>
            {showText && <span>{info.label}</span>}
        </span>
    );
};

export const StepTracker = ({ currentStep = 1 }) => {
    // 3 steps: 1: 🔒 Safe in escrow -> 2: 🚚 On the way -> 3: ✅ Paid to farmer
    const steps = [
        { num: 1, icon: '🔒', label: 'Safe' },
        { num: 2, icon: '🚚', label: 'On way' },
        { num: 3, icon: '✅', label: 'Paid' }
    ];

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }} title={`Step ${currentStep} of 3`}>
            {steps.map((st, i) => {
                const isDoneOrCurrent = currentStep >= st.num;
                return (
                    <React.Fragment key={st.num}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-pill)',
                                background: isDoneOrCurrent ? 'var(--surface-2)' : 'transparent',
                                border: `1px solid ${isDoneOrCurrent ? 'var(--line)' : 'transparent'}`,
                                opacity: isDoneOrCurrent ? 1 : 0.35,
                                fontSize: '0.88rem',
                                fontWeight: isDoneOrCurrent ? '700' : '500',
                                color: isDoneOrCurrent ? 'var(--ink)' : 'var(--ink-3)'
                            }}
                        >
                            <span>{st.icon}</span>
                            <span>{st.label}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <span style={{ color: 'var(--line)', fontSize: '0.85rem' }}>→</span>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default StatusBadge;
