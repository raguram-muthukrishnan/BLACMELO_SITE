import {NavLink} from 'react-router';
import {useState} from 'react';
import type {FooterQuery} from 'storefrontapi.generated';
import logo from '~/assets/logos/Logo.avif';

type FooterProps = {
  footer: FooterQuery;
};

export function Footer({}: FooterProps) {
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Desktop Layout */}
        <div className="footer-desktop">
          <div className="footer-section footer-brand">
            <img src={logo} alt="BLACMELO" className="footer-logo-image" />
            <p className="footer-tagline">The missing piece of luxury.</p>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Help</h3>
            <nav className="footer-links">
              <NavLink to="/search">Search</NavLink>
              <NavLink to="/policies/return-policy">Return and Refund Policy</NavLink>
              <NavLink to="/policies/shipping-policy">Shipping Policy</NavLink>
              <NavLink to="/policies/terms-of-service">Terms of Services</NavLink>
              <NavLink to="/policies/privacy-policy">Privacy Policy</NavLink>
            </nav>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">BRAND</h3>
            <nav className="footer-links">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/shop">Shop</NavLink>
              <NavLink to="/about">About Us</NavLink>
              <NavLink to="/contact">Contact Us</NavLink>
              <NavLink to="/faq">FAQ</NavLink>
            </nav>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">CONTACT</h3>
            <div className="footer-links">
              <a href="mailto:support@blacmelo.com">support@blacmelo.com</a>
              <a href="tel:+971525648367">+971 52 5648367</a>
            </div>
          </div>

          <div className="footer-section footer-newsletter">
            <h3 className="footer-heading">NEWSLETTER</h3>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Your email"
                className="newsletter-input"
                aria-label="Email for newsletter"
              />
              <button type="submit" className="newsletter-button">
                SUBSCRIBE
              </button>
            </form>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2H10C8.89543 2 8 2.89543 8 4V8H6V12H8V20H12V12H14L15 8H12V4H15V2H12Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="15" cy="5" r="0.5" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="footer-mobile">
          {/* Logo and Tagline */}
          <div className="footer-mobile-brand">
            <img src={logo} alt="BLACMELO" className="footer-logo-image" />
            <p className="footer-tagline">The missing piece of luxury.</p>
          </div>

          {/* Newsletter Signup */}
          <div className="footer-mobile-newsletter">
            <h3 className="footer-mobile-newsletter-title">JOIN BLACMELO +</h3>
            <p className="footer-mobile-newsletter-subtitle">EARN POINTS & REWARDS ON ALL PURCHASES</p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Your email"
                className="newsletter-input"
                aria-label="Email for newsletter"
              />
              <button type="submit" className="newsletter-button">
                SUBSCRIBE
              </button>
            </form>
          </div>

          {/* Collapsible Sections */}
          <div className="footer-mobile-sections">
            {/* Client Services */}
            <div className="footer-mobile-section">
              <button 
                className="footer-mobile-toggle"
                onClick={() => toggleSection('help')}
                aria-expanded={openSections.help}
              >
                <span>CLIENT SERVICES</span>
                <svg 
                  className={`footer-mobile-icon ${openSections.help ? 'rotated' : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                >
                  <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              {openSections.help && (
                <nav className="footer-mobile-links">
                  <NavLink to="/search">Search</NavLink>
                  <NavLink to="/policies/return-policy">Return and Refund Policy</NavLink>
                  <NavLink to="/policies/shipping-policy">Shipping Policy</NavLink>
                  <NavLink to="/policies/terms-of-service">Terms of Services</NavLink>
                  <NavLink to="/policies/privacy-policy">Privacy Policy</NavLink>
                </nav>
              )}
            </div>

            {/* Company */}
            <div className="footer-mobile-section">
              <button 
                className="footer-mobile-toggle"
                onClick={() => toggleSection('company')}
                aria-expanded={openSections.company}
              >
                <span>COMPANY</span>
                <svg 
                  className={`footer-mobile-icon ${openSections.company ? 'rotated' : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                >
                  <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              {openSections.company && (
                <nav className="footer-mobile-links">
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/shop">Shop</NavLink>
                  <NavLink to="/about">About Us</NavLink>
                  <NavLink to="/contact">Contact Us</NavLink>
                  <NavLink to="/faq">FAQ</NavLink>
                </nav>
              )}
            </div>

            {/* Social */}
            <div className="footer-mobile-section">
              <button 
                className="footer-mobile-toggle"
                onClick={() => toggleSection('social')}
                aria-expanded={openSections.social}
              >
                <span>SOCIAL</span>
                <svg 
                  className={`footer-mobile-icon ${openSections.social ? 'rotated' : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                >
                  <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              {openSections.social && (
                <div className="footer-mobile-links">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                </div>
              )}
            </div>

            {/* Download App */}
            <div className="footer-mobile-section">
              <button 
                className="footer-mobile-toggle"
                onClick={() => toggleSection('download')}
                aria-expanded={openSections.download}
              >
                <span>DOWNLOAD APP</span>
                <svg 
                  className={`footer-mobile-icon ${openSections.download ? 'rotated' : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                >
                  <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              {openSections.download && (
                <div className="footer-mobile-links">
                  <a href="#" target="_blank" rel="noopener noreferrer">iOS App Store</a>
                  <a href="#" target="_blank" rel="noopener noreferrer">Google Play Store</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          Copyright © 2026, blacmelo. All rights reserved. See our terms of use and privacy notice.
        </p>
      </div>
    </footer>
  );
}
