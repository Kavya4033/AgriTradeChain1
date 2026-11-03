import React from 'react';

const MetricCard = ({
    icon,
    value,
    unit = '',
    title,
    subtext,
    tone = 'neutral' // 'neutral' | 'safe' | 'wait' | 'alert'
}) => {
    // Only cards that need active attention get an accent border
    const isAlert = tone === 'alert';
    const isWait = tone === 'wait';
    const isSafe = tone === 'safe';

    let borderColor = 'var(--line)';
    let iconBg = 'var(--surface-2)';
    let iconColor = 'var(--ink)';

    if (isAlert) {
        borderColor = 'var(--alert)';
        iconBg = 'var(--alert-bg)';
        iconColor = 'var(--alert)';
    } else if (isWait) {
        borderColor = 'var(--accent)';
        iconBg = 'var(--go-bg)';
        iconColor = 'var(--go)';
    } else if (isSafe) {
        borderColor = 'var(--safe)';
        iconBg = 'var(--safe-bg)';
        iconColor = 'var(--safe)';
    }

    const isNumericZero = value === 0 || value === '0' || value === '0 ETH' || value === '0.0000 ETH';

    return (
        <div
            className="card-neutral"
            style={{
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '24px',
                borderColor: isNumericZero ? 'var(--line)' : borderColor,
                background: 'var(--surface)',
                boxShadow: 'var(--shadow)',
                opacity: isNumericZero ? 0.85 : 1,
                boxSizing: 'border-box'
            }}
        >
            {/* Top row: 64px icon tile */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div
                    style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: 'var(--radius-control)',
                        background: iconBg,
                        color: iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.85rem'
                    }}
                >
                    {icon}
                </div>
            </div>

            {/* Middle: Metric value & Title */}
            <div style={{ margin: '14px 0 8px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '8px',
                    lineHeight: 1
                }}>
                    <span
                        className="tabular-nums"
                        style={{
                            fontSize: '2.8rem',
                            fontWeight: '800',
                            color: 'var(--ink)'
                        }}
                    >
                        {value != null ? value : '--'}
                    </span>
                    {unit && (
                        <span style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: 'var(--ink-2)'
                        }}>
                            {unit}
                        </span>
                    )}
                </div>

                <div style={{
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    color: 'var(--ink)',
                    marginTop: '8px'
                }}>
                    {title}
                </div>
            </div>

            {/* Bottom: Subtext pinned to bottom */}
            {subtext && (
                <div style={{
                    fontSize: '0.9rem',
                    color: 'var(--ink-3)',
                    marginTop: 'auto',
                    lineHeight: 1.4,
                    borderTop: '1px solid var(--line)',
                    paddingTop: '8px'
                }}>
                    {subtext}
                </div>
            )}
        </div>
    );
};

export default MetricCard;
