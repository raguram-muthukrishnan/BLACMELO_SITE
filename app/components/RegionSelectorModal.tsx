import { useState, useEffect } from 'react';
import { useCurrency } from '~/context/CurrencyContext';

const SUPPORTED_CURRENCIES = [
  { code: 'AED', label: 'UAE Dirham', country: 'UNITED ARAB EMIRATES' },
  { code: 'USD', label: 'US Dollar', country: 'UNITED STATES' },
  { code: 'INR', label: 'Indian Rupee', country: 'INDIA' },
];

export function RegionSelectorModal() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  useEffect(() => {
    // Check if the user has already confirmed their region
    const hasConfirmed = localStorage.getItem('blacmelo_region_confirmed');
    if (!hasConfirmed) {
      setIsOpen(true);
      // Disable scrolling on body
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleConfirm = () => {
    setCurrency(selectedCurrency);
    localStorage.setItem('blacmelo_region_confirmed', 'true');
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  if (!isOpen) return null;

  return (
    <div className="region-selector-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(10px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="region-selector-modal" style={{
        backgroundColor: 'transparent',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h2 style={{
          color: '#fff',
          fontFamily: 'var(--font-heading)',
          fontSize: '28px',
          fontWeight: 600,
          marginBottom: '16px',
          letterSpacing: '0.05em'
        }}>Welcome to Blacmelo</h2>
        
        <p style={{
          color: '#fff',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          marginBottom: '40px',
          lineHeight: '1.5',
          opacity: 0.9
        }}>
          Please confirm your shipping location to continue to our online store.
        </p>

        <div style={{ width: '100%', marginBottom: '24px', position: 'relative' }}>
          <select 
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              fontFamily: 'var(--font-heading)',
              fontSize: '14px',
              appearance: 'none',
              cursor: 'pointer',
              outline: 'none',
              textTransform: 'uppercase'
            }}
          >
            {SUPPORTED_CURRENCIES.map(c => (
              <option key={c.code} value={c.code} style={{ color: '#000' }}>
                {c.country} - {c.code}
              </option>
            ))}
          </select>
          <div style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: '#fff'
          }}>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
            </svg>
          </div>
        </div>

        <button 
          onClick={handleConfirm}
          style={{
            width: '100%',
            padding: '16px 20px',
            backgroundColor: '#fff',
            color: '#000',
            border: 'none',
            fontFamily: 'var(--font-heading)',
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#e0e0e0';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#fff';
          }}
        >
          CONFIRM SHIPPING LOCATION
        </button>
      </div>
    </div>
  );
}
