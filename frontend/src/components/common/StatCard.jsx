import React from 'react';

const StatCard = ({ title, value, subtitle, icon, trend, colorTheme = 'green' }) => {
    const themes = {
        green: {
            bg: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
            border: '#bbf7d0',
            text: '#166534',
            iconBg: '#dcfce7',
            iconColor: '#15803d'
        },
        blue: {
            bg: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)',
            border: '#bae6fd',
            text: '#075985',
            iconBg: '#e0f2fe',
            iconColor: '#0284c7'
        },
        amber: {
            bg: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)',
            border: '#fde68a',
            text: '#92400e',
            iconBg: '#fef3c7',
            iconColor: '#d97706'
        },
        purple: {
            bg: 'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)',
            border: '#e9d5ff',
            text: '#6b21a8',
            iconBg: '#f3e8ff',
            iconColor: '#9333ea'
        }
    };

    const t = themes[colorTheme] || themes.green;

    return (
        <div style={{
            background: t.bg,
            border: `1px solid ${t.border}`,
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '12px',
            transition: 'transform 0.2s, box-shadow 0.2s'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748b' }}>
                    {title}
                </span>
                {icon && (
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: t.iconBg,
                        color: t.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem'
                    }}>
                        {icon}
                    </div>
                )}
            </div>

            <div style={{ fontSize: '2rem', fontWeight: '700', color: t.text, lineHeight: 1.1 }}>
                {value != null ? value : '--'}
            </div>

            {(subtitle || trend) && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b' }}>
                    {subtitle && <span>{subtitle}</span>}
                    {trend && <span style={{ fontWeight: '600', color: t.iconColor }}>{trend}</span>}
                </div>
            )}
        </div>
    );
};

export default StatCard;
