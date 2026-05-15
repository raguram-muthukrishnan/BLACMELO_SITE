/**
 * CurrencyContext
 * Provides the selected currency and a formatted price helper
 * to any component in the tree.
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

const BASE_CURRENCY = 'AED';
const RATES_API = `https://api.exchangerate-api.com/v4/latest/${BASE_CURRENCY}`;
const CACHE_KEY = 'blacmelo_fx_rates';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const SEL_KEY   = 'blacmelo_currency';

type Rates = Record<string, number>;

interface CurrencyContextValue {
  currency: string;
  rates: Rates | null;
  setCurrency: (code: string) => void;
  formatPrice: (aedAmount: number) => string;
  convertAmount: (aedAmount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: BASE_CURRENCY,
  rates: null,
  setCurrency: () => {},
  formatPrice: (n) => `AED ${n.toFixed(2)}`,
  convertAmount: (n) => n,
});

function getCachedRates(): Rates | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; rates: Rates };
    if (Date.now() - parsed.ts > CACHE_TTL) return null;
    return parsed.rates;
  } catch { return null; }
}

function setCachedRates(rates: Rates) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), rates }));
  } catch {}
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, _setCurrency] = useState(BASE_CURRENCY);
  const [rates, setRates] = useState<Rates | null>(null);

  // Boot: load saved currency + fetch rates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(SEL_KEY) || BASE_CURRENCY;
    _setCurrency(saved);

    const cached = getCachedRates();
    if (cached) { setRates(cached); return; }

    fetch(RATES_API)
      .then(r => r.json())
      .then((data: unknown) => {
        const d = data as { rates?: Rates };
        if (d?.rates) {
          setCachedRates(d.rates);
          setRates(d.rates);
        }
      })
      .catch(() => {
        // Approximate fallback rates relative to AED
        setRates({ AED: 1, USD: 0.272, INR: 23.86 });
      });
  }, []);

  const setCurrency = useCallback((code: string) => {
    _setCurrency(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SEL_KEY, code);
      window.dispatchEvent(new CustomEvent('currencyChanged', { detail: { currency: code } }));
    }
  }, []);

  const convertAmount = useCallback((aedAmount: number): number => {
    if (!rates) return aedAmount;
    return aedAmount * (rates[currency] ?? 1);
  }, [rates, currency]);

  const formatPrice = useCallback((aedAmount: number): string => {
    const converted = convertAmount(aedAmount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  }, [convertAmount, currency]);

  // ── DOM price scanner ────────────────────────────────────────────────────────
  // Matches "AED 375.00" or "AED375.00"
  const AED_PRICE_RE = /^AED\s?([\d,]+\.?\d*)$/;

  const fmt = useCallback((amount: number, targetCurrency: string) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  , []);

  const scanAndConvert = useCallback((rate: number, targetCurrency: string) => {
    // ── Step 1: collect — walk the tree without touching the DOM ──────────────
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
    );

    // Elements already stamped need re-conversion
    const stamped: HTMLElement[] = [];
    // Text nodes whose parent looks like an AED price for the first time
    const fresh: Array<{ el: HTMLElement; base: number }> = [];

    let node: Node | null = walker.nextNode();
    while (node) {
      const textNode = node as Text;
      const parent = textNode.parentElement;
      node = walker.nextNode(); // advance BEFORE any DOM change
      if (!parent) continue;

      if (parent.dataset.basePrice !== undefined) {
        stamped.push(parent);
        continue;
      }

      const text = textNode.textContent?.trim() ?? '';
      const match = AED_PRICE_RE.exec(text);
      if (!match) continue;

      const base = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(base)) {
        fresh.push({ el: parent, base });
      }
    }

    // ── Step 2: mutate — all at once after traversal is complete ─────────────
    for (const el of stamped) {
      const base = parseFloat(el.dataset.basePrice!);
      if (!isNaN(base)) {
        el.textContent = fmt(base * rate, targetCurrency);
      }
    }

    for (const { el, base } of fresh) {
      el.dataset.basePrice = String(base);
      el.textContent = fmt(base * rate, targetCurrency);
    }
  }, [fmt]);

  // Re-scan whenever currency or rates change
  useEffect(() => {
    if (!rates || typeof window === 'undefined') return;
    const rate = rates[currency] ?? 1;
    // Defer to let React finish rendering
    const raf = requestAnimationFrame(() => scanAndConvert(rate, currency));
    return () => cancelAnimationFrame(raf);
  }, [currency, rates, scanAndConvert]);

  // Watch for new price elements added by SPA navigation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new MutationObserver(() => {
      if (!rates) return;
      const rate = rates[currency] ?? 1;
      requestAnimationFrame(() => scanAndConvert(rate, currency));
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [currency, rates, scanAndConvert]);

  return (
    <CurrencyContext.Provider value={{ currency, rates, setCurrency, formatPrice, convertAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
