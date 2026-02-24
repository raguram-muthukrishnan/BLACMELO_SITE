/**
 * Sorts clothing sizes in the correct display order.
 * Alphabetic sizes: XS, S, M, L, XL, XXL/2XL
 * Numeric sizes: ascending numerically (e.g. 28, 30, 32)
 * Mixed: alphabetic first, then numeric
 */

const ALPHA_SIZE_ORDER: Record<string, number> = {
    XS: 0,
    S: 1,
    M: 2,
    L: 3,
    XL: 4,
    XXL: 5,
    '2XL': 5,
    'XXXL': 6,
    '3XL': 6,
};

function isNumeric(s: string): boolean {
    return /^\d+(\.\d+)?$/.test(s.trim());
}

export function sortSizeLabels<T extends { label: string }>(sizes: T[]): T[] {
    // Deduplicate sizes by label (keep first occurrence = most available)
    const seen = new Set<string>();
    const deduped = sizes.filter((s) => {
        const key = s.label.toUpperCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    return [...deduped].sort((a, b) => {
        const au = a.label.toUpperCase();
        const bu = b.label.toUpperCase();
        const aIsAlpha = ALPHA_SIZE_ORDER[au] !== undefined;
        const bIsAlpha = ALPHA_SIZE_ORDER[bu] !== undefined;
        const aIsNum = isNumeric(au);
        const bIsNum = isNumeric(bu);

        // Both alpha — sort by known order
        if (aIsAlpha && bIsAlpha) return ALPHA_SIZE_ORDER[au] - ALPHA_SIZE_ORDER[bu];

        // Both numeric — sort ascending
        if (aIsNum && bIsNum) return parseFloat(au) - parseFloat(bu);

        // Alpha before numeric
        if (aIsAlpha) return -1;
        if (bIsAlpha) return 1;

        // Both unknown — sort alphabetically
        return au.localeCompare(bu);
    });
}
