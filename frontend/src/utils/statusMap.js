/**
 * Maps existing backend status values to accessible, icon-first presentation language.
 * Meaning never depends on color alone: always icon + color + short word.
 */

export const STATUS_MAP = {
    // Orders in escrow awaiting delivery
    Pending: {
        icon: '🔒',
        label: 'Safe',
        plainText: 'Money kept safe',
        step: 1,
        colorVar: 'var(--safe)',
        bgVar: 'var(--safe-bg)'
    },
    // In-transit / processing
    OnTheWay: {
        icon: '🚚',
        label: 'On the way',
        plainText: 'Harvest in transit',
        step: 2,
        colorVar: 'var(--go)',
        bgVar: 'var(--go-bg)'
    },
    // Confirmed delivery & released escrow
    Delivered: {
        icon: '✅',
        label: 'Paid',
        plainText: 'Money received',
        step: 3,
        colorVar: 'var(--done)',
        bgVar: 'var(--done-bg)'
    },
    // Active crop listing ready for sale
    Available: {
        icon: '⏳',
        label: 'Ready',
        plainText: 'Crops for sale',
        step: 0,
        colorVar: 'var(--wait)',
        bgVar: 'var(--wait-bg)'
    },
    // Crop listing sold
    Sold: {
        icon: '🔒',
        label: 'Sold',
        plainText: 'Purchased in escrow',
        step: 1,
        colorVar: 'var(--safe)',
        bgVar: 'var(--safe-bg)'
    }
};

export const getStatusInfo = (status) => {
    if (!status) return STATUS_MAP.Available;
    const normalized = String(status).trim();
    if (STATUS_MAP[normalized]) {
        return STATUS_MAP[normalized];
    }
    const lower = normalized.toLowerCase();
    if (lower.includes('deliver') || lower.includes('settle') || lower.includes('complete')) {
        return STATUS_MAP.Delivered;
    }
    if (lower.includes('pend') || lower.includes('escrow') || lower.includes('safe')) {
        return STATUS_MAP.Pending;
    }
    if (lower.includes('transit') || lower.includes('way')) {
        return STATUS_MAP.OnTheWay;
    }
    if (lower.includes('sold')) {
        return STATUS_MAP.Sold;
    }
    return STATUS_MAP.Available;
};

// Crop emoji helper
export const getCropEmoji = (cropType) => {
    if (!cropType) return '🌾';
    const lower = cropType.toLowerCase();
    if (lower.includes('wheat')) return '🌾';
    if (lower.includes('rice') || lower.includes('paddy')) return '🍚';
    if (lower.includes('corn') || lower.includes('maize')) return '🌽';
    if (lower.includes('barley') || lower.includes('oat') || lower.includes('grain')) return '🌾';
    if (lower.includes('soy') || lower.includes('bean') || lower.includes('legume')) return '🫘';
    if (lower.includes('cotton')) return '☁️';
    if (lower.includes('apple') || lower.includes('fruit')) return '🍎';
    if (lower.includes('tomato')) return '🍅';
    if (lower.includes('potato')) return '🥔';
    if (lower.includes('vegetable')) return '🥬';
    return '🌱';
};
