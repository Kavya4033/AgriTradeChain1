import React from 'react';
import Panel from './layout/Panel';
import StatusBadge from './StatusBadge';

const StatusLegendPanel = () => {
    return (
        <Panel title="What the signs mean">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <StatusBadge status="Pending" />
                    <div style={{ fontSize: '0.9rem', color: 'var(--ink-2)', lineHeight: 1.4 }}>
                        <strong>Safe in escrow:</strong> Money is safely locked inside the blockchain contract awaiting delivery.
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <StatusBadge status="OnTheWay" />
                    <div style={{ fontSize: '0.9rem', color: 'var(--ink-2)', lineHeight: 1.4 }}>
                        <strong>On the way:</strong> Harvest is packed and currently in physical transit.
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <StatusBadge status="Delivered" />
                    <div style={{ fontSize: '0.9rem', color: 'var(--ink-2)', lineHeight: 1.4 }}>
                        <strong>Paid and settled:</strong> Delivery confirmed. Smart contract transferred payout to the farmer.
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <StatusBadge status="Available" />
                    <div style={{ fontSize: '0.9rem', color: 'var(--ink-2)', lineHeight: 1.4 }}>
                        <strong>Crops for sale:</strong> Listed produce ready for buyers to purchase.
                    </div>
                </div>
            </div>
        </Panel>
    );
};

export default StatusLegendPanel;
