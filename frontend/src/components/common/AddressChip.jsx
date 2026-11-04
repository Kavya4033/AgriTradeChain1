import React from 'react';
import { getExplorerAddressUrl, shortenHash } from '../../utils/web3';
import { CHAIN_ID } from '../../config';
import { useToast } from '../../context/ToastContext';

const AddressChip = ({ address, chainId = CHAIN_ID }) => {
    const { showToast } = useToast();

    if (!address) {
        return <span className="address-chip-empty">Address unavailable</span>;
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(address);
            showToast('Address copied', 'success');
        } catch {
            showToast('Could not copy address', 'error');
        }
    };

    return (
        <span className="address-chip">
            <span className="address-chip-value" title={address}>{shortenHash(address, 6, 4)}</span>
            <a
                className="address-chip-action"
                href={getExplorerAddressUrl(address, chainId)}
                target="_blank"
                rel="noreferrer"
                aria-label="View address on block explorer"
                title="View address on block explorer"
            >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 3h7v7" />
                    <path d="M10 14 21 3" />
                    <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
                </svg>
            </a>
            <button
                className="address-chip-action"
                type="button"
                onClick={handleCopy}
                aria-label="Copy full address"
                title="Copy full address"
            >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
            </button>
        </span>
    );
};

export default AddressChip;