import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import {
    TSHIRT_SIZE_CHART,
    JACKET_SIZE_CHART,
    detectSizeChartType,
    type Unit,
} from '~/lib/sizeCharts';

type Metafield = { namespace?: string; key?: string; value?: string } | null;

interface SizeGuideModalProps {
    productType?: string | null;
    metafields?: Metafield[] | null;
    title?: string | null;
    handle?: string | null;
    onClose: () => void;
    className?: string;
}

function fmt(val: number): string {
    return val % 1 === 0 ? String(val) : val.toFixed(1);
}

/** Removes the right-fade mask once the user scrolls sideways */
function useScrollReveal() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const onScroll = () => {
            if (el.scrollLeft > 4) el.setAttribute('data-scrolled', '1');
        };
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, []);
    return ref;
}

// ─── Unit Toggle ─────────────────────────────────────────────────────────────
function UnitToggle({
    unit,
    onChange,
    cls = 'size-guide-unit-toggle',
}: {
    unit: Unit;
    onChange: (u: Unit) => void;
    cls?: string;
}) {
    return (
        <div className={cls}>
            <button className={`unit-btn${unit === 'cm' ? ' active' : ''}`} onClick={() => onChange('cm')}>CM</button>
            <button className={`unit-btn${unit === 'in' ? ' active' : ''}`} onClick={() => onChange('in')}>INCH</button>
        </div>
    );
}

// ─── T-Shirt / Hoodie Table ──────────────────────────────────────────────────
function TshirtTable({ unit, cls = 'size-guide-table' }: { unit: Unit; cls?: string }) {
    return (
        <table className={cls}>
            <thead>
                <tr>
                    <th>SIZE</th>
                    <th>CHEST ({unit})</th>
                    <th>LENGTH ({unit})</th>
                    <th>SHOULDER ({unit})</th>
                </tr>
            </thead>
            <tbody>
                {TSHIRT_SIZE_CHART.map((row) => (
                    <tr key={row.size}>
                        <td>{row.size}</td>
                        <td>{fmt(row.chest[unit])}</td>
                        <td>{fmt(row.length[unit])}</td>
                        <td>{fmt(row.shoulder[unit])}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

// ─── Jacket Table ────────────────────────────────────────────────────────────
function JacketTable({ unit, cls = 'size-guide-table' }: { unit: Unit; cls?: string }) {
    return (
        <table className={cls}>
            <thead>
                <tr>
                    <th>SIZE</th>
                    <th>BODY LEN ({unit})</th>
                    <th>CHEST ({unit})</th>
                    <th>BTOM W ({unit})</th>
                    <th>SLEEVE ({unit})</th>
                    <th>BICEP ({unit})</th>
                    <th>CUFF ({unit})</th>
                </tr>
            </thead>
            <tbody>
                {JACKET_SIZE_CHART.map((row) => (
                    <tr key={row.size}>
                        <td>{row.size}</td>
                        <td>{fmt(row[unit].body_length)}</td>
                        <td>{fmt(row[unit].chest_half)}</td>
                        <td>{fmt(row[unit].bottom_width)}</td>
                        <td>{fmt(row[unit].sleeve_length)}</td>
                        <td>{fmt(row[unit].muscle_bicep)}</td>
                        <td>{fmt(row[unit].cuff_opening)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

// ─── Pant Table (hardcoded for now) ─────────────────────────────────────────
function PantTable({ cls = 'size-guide-table' }: { cls?: string }) {
    return (
        <table className={cls}>
            <thead>
                <tr>
                    <th>SIZE</th>
                    <th>WAIST (cm)</th>
                    <th>HIP (cm)</th>
                    <th>INSEAM (cm)</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>XS</td><td>72</td><td>90</td><td>76</td></tr>
                <tr><td>S</td><td>76</td><td>94</td><td>77</td></tr>
                <tr><td>M</td><td>80</td><td>98</td><td>78</td></tr>
                <tr><td>L</td><td>84</td><td>102</td><td>79</td></tr>
                <tr><td>XL</td><td>88</td><td>106</td><td>80</td></tr>
                <tr><td>XXL</td><td>92</td><td>110</td><td>81</td></tr>
            </tbody>
        </table>
    );
}

// ─── Full-Screen Modal ───────────────────────────────────────────────────────
export function SizeGuideModal({
    productType,
    metafields,
    title,
    handle,
    onClose,
    className,
}: SizeGuideModalProps) {
    const [unit, setUnit] = useState<Unit>('cm');
    const chartType = detectSizeChartType(productType, metafields, title, handle);
    const wrapperRef = useScrollReveal();

    return (
        <div className={`product-size-guide-modal${className ? ` ${className}` : ''}`}>
            <button className="product-size-guide-close" onClick={onClose} aria-label="Close size guide">
                <X size={18} strokeWidth={1.5} />
            </button>

            <div className="product-size-guide-content">
                <h2 className="size-guide-title">Size Guide</h2>
                <p className="size-guide-model">Model is 184.5cm / 72kg — wearing size M</p>

                {chartType !== 'pant' && (
                    <UnitToggle unit={unit} onChange={setUnit} cls="size-guide-unit-toggle" />
                )}

                <div className="size-guide-table-wrapper" ref={wrapperRef}>
                    {(chartType === 'tshirt' || chartType === 'unknown') && <TshirtTable unit={unit} />}
                    {chartType === 'jacket' && <JacketTable unit={unit} />}
                    {chartType === 'pant' && <PantTable />}
                </div>
            </div>
        </div>
    );
}

// ─── Inline (ProductHero desktop takeover panel) ─────────────────────────────
export function SizeGuideInline({
    productType,
    metafields,
    title,
    handle,
}: {
    productType?: string | null;
    metafields?: Metafield[] | null;
    title?: string | null;
    handle?: string | null;
}) {
    const [unit, setUnit] = useState<Unit>('cm');
    const chartType = detectSizeChartType(productType, metafields, title, handle);
    const wrapperRef = useScrollReveal();

    return (
        <div className="inner-padding">
            {chartType !== 'pant' && (
                <UnitToggle unit={unit} onChange={setUnit} cls="size-chart-unit-toggle" />
            )}

            <div className="size-chart-table-wrapper" ref={wrapperRef}>
                {(chartType === 'tshirt' || chartType === 'unknown') && <TshirtTable unit={unit} cls="size-chart-table" />}
                {chartType === 'jacket' && <JacketTable unit={unit} cls="size-chart-table" />}
                {chartType === 'pant' && <PantTable cls="size-chart-table" />}
            </div>
        </div>
    );
}
