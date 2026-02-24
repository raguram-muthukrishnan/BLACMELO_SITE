import { useState } from 'react';
import { Link } from 'react-router';
import type { MetaFunction } from 'react-router';
import banner1 from '~/assets/banner_images/1.jpeg';
import productHeroStyles from '~/styles/components/product/product-hero.css?url';
import productHeroInfoStyles from '~/styles/components/product/product-hero-info.css?url';
import giftCardStyles from '~/styles/pages/gift-card.css?url';

export const links = () => [
  { rel: 'stylesheet', href: productHeroStyles },
  { rel: 'stylesheet', href: productHeroInfoStyles },
  { rel: 'stylesheet', href: giftCardStyles },
];

export const meta: MetaFunction = () => {
  return [
    { title: 'BLACMELO | Gift Card' },
    {
      name: 'description',
      content:
        'Give the gift of luxury. BLACMELO gift cards are delivered instantly and never expire.',
    },
  ];
};

const AMOUNTS = [50, 100, 150, 200, 500];

export default function GiftCard() {
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <section className="hero-product">
      {/* Left — Banner Image */}
      <div className="hero-left">
        <div className="hero-image-container">
          <img
            src={banner1}
            alt="BLACMELO Gift Card"
            className="hero-image"
            loading="eager"
          />
        </div>
      </div>

      {/* Right — Gift Card Details */}
      <div className="hero-right">
        {openSection ? (
          <div className="hero-expanded-view">
            <div className="hero-expanded-header">
              <h2 className="hero-expanded-title">
                {openSection === 'how' ? 'How It Works' : 'Terms & Conditions'}
              </h2>
              <button
                className="hero-expanded-close"
                onClick={() => setOpenSection(null)}
                aria-label="Close"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="hero-expanded-content">
              {openSection === 'how' && (
                <div style={{ whiteSpace: 'pre-line' }}>
                  {`1. Choose your desired gift card amount\n2. Enter the recipient's email address\n3. Add a personal message (optional)\n4. Complete checkout — the gift card is delivered instantly via email\n5. The recipient can redeem the gift card at checkout on any BLACMELO product`}
                </div>
              )}
              {openSection === 'terms' && (
                <div style={{ whiteSpace: 'pre-line' }}>
                  {`Gift cards are non-refundable and cannot be exchanged for cash.\n\nGift cards never expire and have no additional fees.\n\nGift cards can be used across multiple orders until the balance is fully redeemed.\n\nLost or stolen gift cards cannot be replaced. Please treat them like cash.\n\nGift cards can only be redeemed on blacmelo.com.`}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="hero-header">
              <div>
                <h1 className="hero-title">GIFT CARD</h1>
              </div>
              <div className="hero-price">${selectedAmount}.00</div>
            </div>

            {/* Description */}
            <p className="gc-description">
              Give the gift of luxury. Delivered instantly via email — never
              expires, redeemable on any BLACMELO product.
            </p>

            {/* Amount Selector */}
            <div style={{ marginBottom: '2rem' }}>
              <div className="size-header">
                <span>Select Amount</span>
              </div>
              <div className="hero-sizes">
                {AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    className={`size-btn ${selectedAmount === amount ? 'selected' : ''}`}
                    onClick={() => setSelectedAmount(amount)}
                    type="button"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Email */}
            <div className="gc-field">
              <label className="gc-label" htmlFor="gc-email">
                Recipient Email
              </label>
              <input
                id="gc-email"
                type="email"
                className="gc-input"
                placeholder="recipient@email.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>

            {/* Sender Name */}
            <div className="gc-field">
              <label className="gc-label" htmlFor="gc-sender">
                Your Name
              </label>
              <input
                id="gc-sender"
                type="text"
                className="gc-input"
                placeholder="Your name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
              />
            </div>

            {/* Personal Message */}
            <div className="gc-field">
              <label className="gc-label" htmlFor="gc-message">
                Personal Message{' '}
                <span style={{ fontWeight: 300, color: '#888' }}>(optional)</span>
              </label>
              <textarea
                id="gc-message"
                className="gc-textarea"
                placeholder="Write a personal message..."
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Add to Cart CTA */}
            <div className="hero-cart-container">
              <button type="button" style={{ width: '100%', padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}>
                <div className="hero-cta">ADD TO CART — ${selectedAmount}.00</div>
              </button>
            </div>

            {/* Benefits */}
            <div className="hero-benefits">
              <div className="benefit-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <span>INSTANT DELIVERY</span>
              </div>
              <div className="benefit-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>NEVER EXPIRES</span>
              </div>
              <div className="benefit-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                <span>REDEEMABLE ONLINE</span>
              </div>
            </div>

            {/* Expandable Sections */}
            <div className="hero-expandable-sections">
              <button
                className="expandable-section-btn"
                onClick={() => toggleSection('how')}
                type="button"
              >
                <span className="expandable-icon">+</span>
                <span className="expandable-title">How It Works</span>
              </button>

              <button
                className="expandable-section-btn"
                onClick={() => toggleSection('terms')}
                type="button"
              >
                <span className="expandable-icon">+</span>
                <span className="expandable-title">Terms & Conditions</span>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
