import React from 'react';
import StatusBadge from '../StatusBadge';
import { getCropEmoji } from '../../utils/statusMap';

const CropCard = ({ crop, action }) => {
    const farmer = crop?.farmer && typeof crop.farmer === 'object' ? crop.farmer : null;

    return (
        <article className="crop-card">
            <div className="crop-card-heading">
                <StatusBadge status={crop?.status} />
                <span className="crop-card-price tabular-nums">
                    {crop?.priceInEth != null ? `${crop.priceInEth} ETH` : 'Price unavailable'}
                </span>
            </div>
            <div className="crop-card-details">
                <span className="crop-card-icon" aria-hidden="true">{getCropEmoji(crop?.cropType)}</span>
                <div>
                    <h3 className="crop-card-title">{crop?.cropType || 'Harvest listing'}</h3>
                    <p className="crop-card-meta">
                        {crop?.quantity != null ? `Available quantity: ${crop.quantity} kg` : 'Quantity unavailable'}
                    </p>
                </div>
            </div>
            <div className="crop-card-meta">
                <span>Farmer: </span>
                <strong>{farmer?.name || 'Name unavailable'}</strong>
                {farmer?.location && <span> · {farmer.location}</span>}
            </div>
            {action && <div className="crop-card-action">{action}</div>}
        </article>
    );
};

export default CropCard;