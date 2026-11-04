import React from 'react';
import { getStatusInfo } from '../utils/statusMap';

export const StatusBadge = ({ status, showText = true, size = 'normal' }) => {
    const info = getStatusInfo(status);

    return (
        <span
            aria-label={`${info.icon} ${info.label}`}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                minHeight: size === 'large' ? '2.5rem' : '2.25rem',
                padding: size === 'large' ? '0.375rem 0.875rem' : '0.25rem 0.625rem',
                borderRadius: 'var(--radius-pill)',
                background: info.bgVar,
                color: info.colorVar,
                border: `1px solid ${info.colorVar}`,
                fontSize: size === 'large' ? '1rem' : '0.9rem',
                fontWeight: '700',
                lineHeight: 1.2,
                whiteSpace: 'nowrap'
            }}
        >
            <span aria-hidden="true" style={{ fontSize: size === 'large' ? '1.125rem' : '1rem' }}>
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
        <div className="order-tracker" role="img" aria-label={`Escrow progress: step ${currentStep} of 3`} title={`Step ${currentStep} of 3`}>
            {steps.map((step, index) => {
                const isDoneOrCurrent = currentStep >= step.num;
                return (
                    <React.Fragment key={step.num}>
                        <span className={`order-tracker-step${isDoneOrCurrent ? ' is-current' : ''}`}>
                            <span aria-hidden="true">{step.icon}</span>
                            <span>{step.label}</span>
                        </span>
                        {index < steps.length - 1 && (
                            <span className="order-tracker-arrow" aria-hidden="true">→</span>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default StatusBadge;
