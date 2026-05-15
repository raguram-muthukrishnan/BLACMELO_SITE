import { useState, useEffect, useRef } from 'react';
import { useCurrency } from '~/context/CurrencyContext';

const FlagIN = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32" style={{borderRadius: '3px', flexShrink: 0}}>
    <path fill="#fff" d="M1 11H31V21H1z"/>
    <path d="M5,4H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" fill="#e06535"/>
    <path d="M5,20H27c2.208,0,4,1.792,4,4v4H1v-4c0-2.208,1.792-4,4-4Z" transform="rotate(180 16 24)" fill="#2c6837"/>
    <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"/>
    <path d="M16,12.292c-2.048,0-3.708,1.66-3.708,3.708s1.66,3.708,3.708,3.708,3.708-1.66,3.708-3.708-1.66-3.708-3.708-3.708Zm3.041,4.109c-.01,.076,.042,.145,.117,.157-.033,.186-.08,.367-.143,.54-.071-.028-.152,.006-.181,.077-.029,.071,.004,.151,.073,.182-.04,.085-.083,.167-.13,.248l-1.611-1.069-.592-.249c.013-.026,.024-.053,.034-.081l.595,.242,1.895,.383-1.833-.616-.636-.087c.006-.028,.009-.057,.011-.087l.638,.08,1.93-.12-1.93-.12-.638,.08c-.002-.03-.005-.059-.011-.087l.636-.087,1.833-.616-1.895,.383-.595,.242c-.009-.028-.021-.055-.034-.081l.592-.249,1.611-1.069c.047,.081,.09,.163,.13,.248-.07,.031-.103,.111-.073,.182,.029,.071,.11,.105,.181,.077,.063,.173,.111,.354,.143,.54-.075,.012-.127,.081-.117,.157,.01,.076,.078,.129,.154,.121,.008,.092,.013,.185,.013,.279s-.005,.187-.013,.279c-.075-.008-.144,.045-.154,.121Z" fill="#2c2c6b"/>
    <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"/>
  </svg>
);

const FlagAE = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32" style={{borderRadius: '3px', flexShrink: 0}}>
    <path d="M5,4h6V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z" fill="#ea3323"/>
    <path d="M10,20v8H27c2.209,0,4-1.791,4-4v-4H10Z"/>
    <path fill="#fff" d="M10 11H31V21H10z"/>
    <path d="M27,4H10V12H31v-4c0-2.209-1.791-4-4-4Z" fill="#317234"/>
    <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"/>
    <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"/>
  </svg>
);

const FlagUS = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32" style={{borderRadius: '3px', flexShrink: 0}}>
    <rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#fff"/>
    <path d="M1.638,5.846H30.362c-.711-1.108-1.947-1.846-3.362-1.846H5c-1.414,0-2.65,.738-3.362,1.846Z" fill="#a62842"/>
    <path d="M2.03,7.692c-.008,.103-.03,.202-.03,.308v1.539H31v-1.539c0-.105-.022-.204-.03-.308H2.03Z" fill="#a62842"/>
    <path fill="#a62842" d="M2 11.385H31V13.231H2z"/>
    <path fill="#a62842" d="M2 15.077H31V16.923H2z"/>
    <path fill="#a62842" d="M1 18.769H31V20.615H1z"/>
    <path d="M1,24c0,.105,.023,.204,.031,.308H30.969c.008-.103,.031-.202,.031-.308v-1.539H1v1.539Z" fill="#a62842"/>
    <path d="M30.362,26.154H1.638c.711,1.108,1.947,1.846,3.362,1.846H27c1.414,0,2.65-.738,3.362-1.846Z" fill="#a62842"/>
    <path d="M5,4h11v12.923H1V8c0-2.208,1.792-4,4-4Z" fill="#102d5e"/>
    <path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"/>
    <path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"/>
    <path fill="#fff" d="M4.601 7.463L5.193 7.033 4.462 7.033 4.236 6.338 4.01 7.033 3.279 7.033 3.87 7.463 3.644 8.158 4.236 7.729 4.827 8.158 4.601 7.463z"/>
    <path fill="#fff" d="M7.58 7.463L8.172 7.033 7.441 7.033 7.215 6.338 6.989 7.033 6.258 7.033 6.849 7.463 6.623 8.158 7.215 7.729 7.806 8.158 7.58 7.463z"/>
    <path fill="#fff" d="M10.56 7.463L11.151 7.033 10.42 7.033 10.194 6.338 9.968 7.033 9.237 7.033 9.828 7.463 9.603 8.158 10.194 7.729 10.785 8.158 10.56 7.463z"/>
    <path fill="#fff" d="M13.539 7.463L14.13 7.033 13.399 7.033 13.173 6.338 12.947 7.033 12.216 7.033 12.808 7.463 12.582 8.158 13.173 7.729 13.765 8.158 13.539 7.463z"/>
    <path fill="#fff" d="M4.601 11.104L5.193 10.674 4.462 10.674 4.236 9.979 4.01 10.674 3.279 10.674 3.87 11.104 3.644 11.799 4.236 11.369 4.827 11.799 4.601 11.104z"/>
    <path fill="#fff" d="M7.58 11.104L8.172 10.674 7.441 10.674 7.215 9.979 6.989 10.674 6.258 10.674 6.849 11.104 6.623 11.799 7.215 11.369 7.806 11.799 7.58 11.104z"/>
    <path fill="#fff" d="M10.56 11.104L11.151 10.674 10.42 10.674 10.194 9.979 9.968 10.674 9.237 10.674 9.828 11.104 9.603 11.799 10.194 11.369 10.785 11.799 10.56 11.104z"/>
    <path fill="#fff" d="M13.539 11.104L14.13 10.674 13.399 10.674 13.173 9.979 12.947 10.674 12.216 10.674 12.808 11.104 12.582 11.799 13.173 11.369 13.765 11.799 13.539 11.104z"/>
  </svg>
);

const SUPPORTED_CURRENCIES = [
  { code: 'AED', label: 'UAE Dirham',   Flag: FlagAE },
  { code: 'USD', label: 'US Dollar',    Flag: FlagUS },
  { code: 'INR', label: 'Indian Rupee', Flag: FlagIN },
];

export function CurrencySwitcher() {
  const { currency, rates, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only show on client to avoid hydration mismatch
    setIsReady(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!isReady || !rates) return null;

  const current = SUPPORTED_CURRENCIES.find(c => c.code === currency)!;

  return (
    <div ref={dropdownRef} className="currency-switcher-root" id="currency-switcher">
      <button
        className="currency-switcher-btn"
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Currency: ${current.code}`}
      >
        <current.Flag />
        <span className="currency-code">{current.code}</span>
        <svg
          className={`currency-chevron ${isOpen ? 'open' : ''}`}
          width="10" height="6" viewBox="0 0 10 6" fill="none"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className="currency-dropdown" role="listbox" aria-label="Select currency">
          {SUPPORTED_CURRENCIES.map(c => (
            <button
              key={c.code}
              role="option"
              aria-selected={currency === c.code}
              className={`currency-option ${currency === c.code ? 'selected' : ''}`}
              onClick={() => { setCurrency(c.code); setIsOpen(false); }}
            >
              <c.Flag />
              <span className="currency-option-label">
                <span className="currency-option-code">{c.code}</span>
                <span className="currency-option-name">{c.label}</span>
              </span>
              {currency === c.code && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="currency-check">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

