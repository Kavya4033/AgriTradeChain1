import React from 'react';
import StatusBadge, { StepTracker } from './StatusBadge';
import { getStatusInfo, getCropEmoji } from '../utils/statusMap';
import TxHashBadge from './common/TxHashBadge';

const DataRow = ({
    cropIcon,
    cropType = 'Harvest Item',
    quantity = '',
    party = '',
    amount = '',
    status = 'Pending',
    step = 1,
    action = null,
    txHash = null,
    date = null
}) => {
    const statusInfo = getStatusInfo(status);
    const displayEmoji = cropIcon || getCropEmoji(cropType);

    return (
        <div
            className="data-row-card"
            style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderLeft: `4px solid ${statusInfo.colorVar}`,
                borderRadius: 'var(--radius-control)',
                padding: '18px 22px',
                minHeight: '72px',
                boxShadow: 'var(--shadow)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxSizing: 'border-box'
            }}
        >
            <div className="data-row-desktop">
                {/* 1. Crop + Quantity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '200px' }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-control)',
                        background: 'var(--surface-2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        flexShrink: 0
                    }}>
                        {displayEmoji}
                    </div>
                    <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--ink)' }}>
                            {cropType}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--ink-2)' }}>
                            {quantity ? `${quantity} kg` : ''} {party ? `• ${party}` : ''}
                        </div>
                    </div>
                </div>

                {/* 2. Amount */}
                <div style={{ minWidth: '120px' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--ink)' }}>
                        {amount}
                    </div>
                    {date && (
                        <div style={{ fontSize: '0.9rem', color: 'var(--ink-3)' }}>
                            {date}
                        </div>
                    )}
                </div>

                {/* 3. 3-step tracker */}
                <div className="data-row-tracker">
                    <StepTracker currentStep={step || statusInfo.step} />
                </div>

                {/* 4. Status label */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <StatusBadge status={status} />
                </div>

                {/* 5. Action */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                    {action}
                </div>
            </div>

            {/* Optional Tx Hash below or secondary row */}
            {txHash && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderTop: '1px solid var(--line)',
                    paddingTop: '8px',
                    fontSize: '0.9rem',
                    color: 'var(--ink-3)'
                }}>
                    <span>Escrow transaction:</span>
                    <TxHashBadge hash={txHash} />
                </div>
            )}

            <style>{`
                .data-row-desktop {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1.5fr auto auto;
                    gap: 16px;
                    align-items: center;
                }
                @media (max-width: 860px) {
                    .data-row-desktop {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }
                    .data-row-tracker {
                        width: 100%;
                        overflow-x: auto;
                    }
                }
            `}</style>
        </div>
    );
};

export default DataRow;
