import type {MetaFunction} from 'react-router';
import prestigeStyles from '~/styles/pages/prestige.css?url';

export const links = () => [
  {rel: 'stylesheet', href: prestigeStyles},
];

export const meta: MetaFunction = () => {
  return [
    {title: `BLACMELO | Prestige Membership`},
    {
      name: 'description',
      content: 'Join BLACMELO Prestige Membership for exclusive rewards, early access, and special benefits.',
    },
  ];
};

export default function Prestige() {
  return (
    <div className="prestige-page">
      {/* Prestige Hero Banner */}
      <section className="prestige-hero-banner">
        <div className="prestige-hero-overlay">
          <p className="prestige-hero-subtitle">10% OFF YOUR FIRST ORDER</p>
          <h1 className="prestige-hero-title">PRESTIGE MEMBERSHIP</h1>
          <div className="prestige-hero-actions">
            <a href="/account/login" className="prestige-action-link">
              <span className="prestige-action-arrow">→</span>
              <span className="prestige-action-text">REGISTER</span>
            </a>
            <a href="/account/login" className="prestige-action-link">
              <span className="prestige-action-arrow">→</span>
              <span className="prestige-action-text">SIGN IN</span>
            </a>
          </div>
        </div>
      </section>

      {/* Membership Tiers Section */}
      <section className="prestige-content-section">
        <div className="prestige-intro">
          <h2 className="prestige-section-title">
            Earn points and redeem exclusive member rewards and benefits
            whilst ranking up from a Bronze to Platinum member.
          </h2>
        </div>

        <div className="prestige-tiers">
          {/* Bronze Tier */}
          <div className="prestige-tier">
            <div className="prestige-tier-header">
              <div className="prestige-tier-icon">
                <span className="prestige-tier-badge bronze">R</span>
                <span className="prestige-tier-name">Start here</span>
              </div>
              <h3 className="prestige-tier-level">Bronze</h3>
            </div>
            <ul className="prestige-tier-benefits">
              <li>1 point per $1</li>
              <li>Early access to releases</li>
              <li>Redeemable Rewards</li>
              <li>Secret Promo Codes</li>
              <li>10% off first purchase for signing up</li>
            </ul>
          </div>

          {/* Silver Tier */}
          <div className="prestige-tier">
            <div className="prestige-tier-header">
              <div className="prestige-tier-icon">
                <span className="prestige-tier-badge silver">R</span>
                <span className="prestige-tier-name">Reach 500 Points</span>
              </div>
              <h3 className="prestige-tier-level">Silver</h3>
            </div>
            <ul className="prestige-tier-benefits">
              <li>1 point per $1</li>
              <li>Early access to releases</li>
              <li>Redeemable Rewards</li>
              <li>Secret Promo Codes</li>
              <li>5% off every order</li>
            </ul>
          </div>

          {/* Gold Tier */}
          <div className="prestige-tier">
            <div className="prestige-tier-header">
              <div className="prestige-tier-icon">
                <span className="prestige-tier-badge gold">R</span>
                <span className="prestige-tier-name">Reach 2000 Points</span>
              </div>
              <h3 className="prestige-tier-level">Gold</h3>
            </div>
            <ul className="prestige-tier-benefits">
              <li>1 point per $1</li>
              <li>Early access to releases</li>
              <li>Redeemable Rewards</li>
              <li>Secret Promo Codes</li>
              <li>12% off every order</li>
            </ul>
          </div>

          {/* Platinum Tier */}
          <div className="prestige-tier">
            <div className="prestige-tier-header">
              <div className="prestige-tier-icon">
                <span className="prestige-tier-badge platinum">R</span>
                <span className="prestige-tier-name">Reach 5000 Points</span>
              </div>
              <h3 className="prestige-tier-level">Platinum</h3>
            </div>
            <ul className="prestige-tier-benefits">
              <li>1 point per $1</li>
              <li>Early access to releases</li>
              <li>Redeemable Rewards</li>
              <li>Secret Promo Codes</li>
              <li>15% off every order</li>
            </ul>
          </div>

          {/* VIP Tier */}
          <div className="prestige-tier">
            <div className="prestige-tier-header">
              <div className="prestige-tier-icon">
                <span className="prestige-tier-badge vip">R</span>
                <span className="prestige-tier-name">Reach 10000 Points</span>
              </div>
              <h3 className="prestige-tier-level">VIP</h3>
            </div>
            <ul className="prestige-tier-benefits">
              <li>1 point per $1</li>
              <li>Early access to releases</li>
              <li>Redeemable Rewards</li>
              <li>Secret Promo Codes</li>
              <li>20% off every order</li>
              <li>Focus Group Discussions</li>
              <li>Christmas Gift</li>
            </ul>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="prestige-bottom-cta">
          <div className="prestige-cta-actions">
            <a href="/account/login" className="prestige-cta-link">
              <span className="prestige-cta-arrow">→</span>
              <span className="prestige-cta-text">REGISTER</span>
            </a>
            <a href="/account/login" className="prestige-cta-link">
              <span className="prestige-cta-arrow">→</span>
              <span className="prestige-cta-text">SIGN IN</span>
            </a>
          </div>
          <p className="prestige-disclaimer">
            The more you spend on site, the higher and more beneficial rewards you'll receive. Collect prestige and level up in order to reach the top. To get you started, 
            <strong> you'll receive 50 PTS just for registering, as well as 10% off your first purchase.</strong> Already made a purchase? Don't worry, you can still redeem discounts!
          </p>
        </div>
      </section>
    </div>
  );
}
