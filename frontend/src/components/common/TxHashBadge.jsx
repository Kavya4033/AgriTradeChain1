import React, { useState } from 'react';
import { shortenHash, getExplorerTxUrl } from '../../utils/web3';
import { CHAIN_ID } from '../../config';

const TxHashBadge = ({ hash, chainId = CHAIN_ID, label = '' }) => {
    const [copied, setCopied] = useState(false);

    if (!hash) {
        return <span style={{ color: 'var(--ink-3)', fontStyle: 'italic', fontSize: '0.9rem' }}>Pending On-Chain</span>;
    }

    const explorerUrl = getExplorerTxUrl(hash, chainId);

    const handleCopy = (e) => {
        e.stopPropagation();
        try {
            navigator.clipboard.writeText(hash);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {}
    };

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--surface-2)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-control)',
            border: '1px solid var(--line)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.92rem',
            color: 'var(--ink)'
        }}>
            {label && <span style={{ color: 'var(--ink-3)', fontWeight: '600', marginRight: '4px' }}>{label}:</span>}
            <span style={{ fontWeight: '700' }}>
                {shortenHash(hash, 6, 4)}
            </span>

            {/* External link with 40px minimum touch target */}
            <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                title={`View on Block Explorer: ${hash}`}
                aria-label="View on Block Explorer"
                style={{
                    width: '40px',
                    height: '40px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand)',
                    textDecoration: 'none',
                    borderRadius: 'var(--radius-control)'
                }}
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
            </a>

            {/* Copy button with 40px minimum touch target */}
            <button
                type="button"
                onClick={handleCopy}
                title={copied ? 'Copied full hash' : 'Copy full hash'}
                aria-label={copied ? 'Copied' : 'Copy hash'}
                style={{
                    width: '40px',
                    height: '40px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: copied ? 'var(--done)' : 'var(--ink-2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-control)',
                    padding: 0
                }}
            >
                {copied ? (
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                ) : (
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default TxHashBadge;
