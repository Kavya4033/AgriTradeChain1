import React from 'react';

const StatCard = ({ title, value, unit = '', subtitle, icon, trend, colorTheme = 'green', attention = false }) => {
    const themes = {
        green: { color: 'var(--done)', background: 'var(--done-bg)' },
        blue: { color: 'var(--safe)', background: 'var(--safe-bg)' },
        amber: { color: 'var(--go)', background: 'var(--go-bg)' },
        purple: { color: 'var(--ink-2)', background: 'var(--surface-2)' }
    };
    const theme = themes[colorTheme] || themes.green;
    const isZero = value === 0 || value === '0' || value === '0 ETH' || value === '0.0000 ETH';

    return (
        <article className={`stat-card${attention ? ' needs-attention' : ''}${isZero ? ' is-zero' : ''}`}>
            <div className="stat-card-heading">
                <span className="stat-card-title">{title}</span>
                {icon && (
                    <span className="stat-card-icon" style={{ color: theme.color, background: theme.background }} aria-hidden="true">
                        {icon}
                    </span>
                )}
            </div>

            <div className="stat-card-value tabular-nums">
                <span>{value != null ? value : '—'}</span>
                {unit && <span className="stat-card-unit">{unit}</span>}
            </div>

            {(subtitle || trend) && (
                <div className="stat-card-supporting">
                    {subtitle && <span>{subtitle}</span>}
                    {trend && <span className="stat-card-trend" style={{ color: theme.color }}>{trend}</span>}
                </div>
            )}
        </article>
    );
};

export default StatCard;
