// ─── SIZE CHART DATA ────────────────────────────────────────────────────────
// Used by ProductPage and ProductHero size-guide modals.
// T-Shirt chart also applies to Hoodies.
// Pants are intentionally left out (hardcoded separately pending future update).

export type Unit = 'cm' | 'in';

// ─── T-SHIRT / HOODIE ────────────────────────────────────────────────────────
export interface TshirtRow {
    size: string;
    chest: { in: number; cm: number };
    length: { in: number; cm: number };
    shoulder: { in: number; cm: number };
}

export const TSHIRT_SIZE_CHART: TshirtRow[] = [
    { size: 'XS', chest: { in: 40, cm: 101.6 }, length: { in: 27, cm: 68.58 }, shoulder: { in: 19, cm: 48.26 } },
    { size: 'S', chest: { in: 42, cm: 106.68 }, length: { in: 27.5, cm: 69.85 }, shoulder: { in: 20, cm: 50.8 } },
    { size: 'M', chest: { in: 44, cm: 111.76 }, length: { in: 28, cm: 71.12 }, shoulder: { in: 21, cm: 53.34 } },
    { size: 'L', chest: { in: 46, cm: 116.84 }, length: { in: 28.5, cm: 72.39 }, shoulder: { in: 22, cm: 55.88 } },
    { size: 'XL', chest: { in: 48, cm: 121.92 }, length: { in: 29, cm: 73.66 }, shoulder: { in: 23, cm: 58.42 } },
    { size: 'XXL', chest: { in: 50, cm: 127.0 }, length: { in: 29.5, cm: 74.93 }, shoulder: { in: 24, cm: 60.96 } },
];

// ─── JACKET ──────────────────────────────────────────────────────────────────
export interface JacketRow {
    size: string;
    in: {
        body_length: number;
        chest_half: number;
        bottom_width: number;
        sleeve_length: number;
        muscle_bicep: number;
        cuff_opening: number;
    };
    cm: {
        body_length: number;
        chest_half: number;
        bottom_width: number;
        sleeve_length: number;
        muscle_bicep: number;
        cuff_opening: number;
    };
}

export const JACKET_SIZE_CHART: JacketRow[] = [
    {
        size: 'XS',
        in: { body_length: 24.4, chest_half: 22.0, bottom_width: 20.1, sleeve_length: 24.4, muscle_bicep: 7.7, cuff_opening: 5.2 },
        cm: { body_length: 61.98, chest_half: 55.88, bottom_width: 51.05, sleeve_length: 61.98, muscle_bicep: 19.56, cuff_opening: 13.21 },
    },
    {
        size: 'S',
        in: { body_length: 24.8, chest_half: 22.8, bottom_width: 20.9, sleeve_length: 24.8, muscle_bicep: 8.1, cuff_opening: 5.3 },
        cm: { body_length: 62.99, chest_half: 57.91, bottom_width: 53.09, sleeve_length: 62.99, muscle_bicep: 20.57, cuff_opening: 13.46 },
    },
    {
        size: 'M',
        in: { body_length: 25.2, chest_half: 23.6, bottom_width: 21.7, sleeve_length: 25.2, muscle_bicep: 8.5, cuff_opening: 5.5 },
        cm: { body_length: 64.01, chest_half: 59.94, bottom_width: 55.12, sleeve_length: 64.01, muscle_bicep: 21.59, cuff_opening: 13.97 },
    },
    {
        size: 'L',
        in: { body_length: 25.6, chest_half: 24.4, bottom_width: 22.4, sleeve_length: 25.6, muscle_bicep: 8.9, cuff_opening: 5.7 },
        cm: { body_length: 65.02, chest_half: 61.98, bottom_width: 56.90, sleeve_length: 65.02, muscle_bicep: 22.61, cuff_opening: 14.48 },
    },
    {
        size: 'XL',
        in: { body_length: 26.0, chest_half: 25.2, bottom_width: 23.2, sleeve_length: 26.0, muscle_bicep: 9.3, cuff_opening: 5.9 },
        cm: { body_length: 66.04, chest_half: 64.01, bottom_width: 58.93, sleeve_length: 66.04, muscle_bicep: 23.62, cuff_opening: 14.99 },
    },
    {
        size: 'XXL',
        in: { body_length: 26.4, chest_half: 26.0, bottom_width: 24.0, sleeve_length: 26.4, muscle_bicep: 9.6, cuff_opening: 6.1 },
        cm: { body_length: 67.06, chest_half: 66.04, bottom_width: 60.96, sleeve_length: 67.06, muscle_bicep: 24.38, cuff_opening: 15.49 },
    },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
/**
 * Detects which size chart to use.
 *
 * Resolution order (most → least reliable):
 *  1. Shopify taxonomy metafield  (namespace "shopify", key "category")
 *  2. Custom metafield            (namespace "custom", key "product_type" | "product_category" | "category")
 *  3. Standard productType field
 *  4. Product title               (e.g. "The Signature Jacket")
 *  5. Product handle              (e.g. "the-signature-jacket")
 *
 * Returns 'jacket' | 'tshirt' | 'pant' | 'unknown'
 */
export function detectSizeChartType(
    productType: string | undefined | null,
    metafields?: Array<{ namespace?: string; key?: string; value?: string } | null> | null,
    title?: string | null,
    handle?: string | null,
): 'tshirt' | 'jacket' | 'pant' | 'unknown' {
    function classifyString(s: string): 'tshirt' | 'jacket' | 'pant' | null {
        const t = s.toLowerCase();
        if (
            t.includes('jacket') || t.includes('coat') || t.includes('bomber') ||
            t.includes('windbreaker') || t.includes('parka') || t.includes('gilet') ||
            t.includes('blazer') || t.includes('outerwear') || t.includes('varsity') ||
            t.includes('leather') || t.includes('suede')
        ) return 'jacket';
        if (
            t.includes('pant') || t.includes('short') || t.includes('trouser') ||
            t.includes('denim') || t.includes('jean') || t.includes('jogger') ||
            t.includes('bottom') || t.includes('legging')
        ) return 'pant';
        if (
            t.includes('shirt') || t.includes('tee') || t.includes('top') ||
            t.includes('hoodie') || t.includes('sweatshirt') || t.includes('longsleeve') ||
            t.includes('long sleeve') || t.includes('long-sleeve') || t.includes('crew') ||
            t.includes('vest') || t.includes('pullover') || t.includes('knitwear') ||
            t.includes('fleece') || t.includes('arc') || t.includes('hoodie')
        ) return 'tshirt';
        return null;
    }

    // Build an ordered list of strings to try
    const candidates: Array<string | null | undefined> = [];

    // 1. Shopify taxonomy / custom category metafields (highest priority)
    if (Array.isArray(metafields)) {
        for (const m of metafields) {
            if (!m?.value) continue;
            if (
                (m.namespace === 'shopify' && m.key === 'category') ||
                (m.namespace === 'custom' && (
                    m.key === 'product_type' || m.key === 'product_category' || m.key === 'category'
                ))
            ) {
                candidates.push(m.value);
            }
        }
    }

    // 2. Standard productType
    candidates.push(productType);

    // 3. Title (e.g. "The Signature Jacket") — very reliable
    candidates.push(title);

    // 4. Handle (e.g. "the-signature-jacket") — last resort
    candidates.push(handle);

    for (const s of candidates) {
        if (!s) continue;
        const result = classifyString(s);
        if (result) return result;
    }

    return 'unknown';
}
