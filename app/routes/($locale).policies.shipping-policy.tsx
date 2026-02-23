import policyStyles from '~/styles/pages/policy.css?url';

export const links = () => [
  { rel: 'stylesheet', href: policyStyles },
];

export const meta = () => {
  return [{title: 'Shipping Policy | BLACMELO'}];
};

export default function ShippingPolicyPage() {
  return (
    <div className="policy-page">
      <div className="policy-header">
        <h1 className="policy-title">Shipping Policy</h1>
      </div>

      <div className="policy-content">
        <h2>Shipping Information</h2>
        <p>
          At BLACMELO, we offer worldwide shipping to bring luxury to your doorstep. All orders are processed 
          within 1-2 business days and shipped via express courier services.
        </p>

        <h2>Delivery Times</h2>
        <ul>
          <li>UAE: 1-2 business days</li>
          <li>GCC Countries: 2-4 business days</li>
          <li>Europe: 3-5 business days</li>
          <li>United States: 4-7 business days</li>
          <li>Rest of World: 5-10 business days</li>
        </ul>

        <h2>Shipping Costs</h2>
        <div className="policy-highlight">
          <p>
            We offer <strong>FREE SHIPPING</strong> on all orders over $100.
          </p>
        </div>
        <p>For orders under $100:</p>
        <ul>
          <li>UAE: $10</li>
          <li>GCC Countries: $15</li>
          <li>International: $25</li>
        </ul>

        <h2>Order Tracking</h2>
        <p>
          Once your order ships, you'll receive a tracking number via email. You can track your order at any time 
          through our website or the courier's tracking portal.
        </p>

        <h2>Customs & Duties</h2>
        <p>
          International orders may be subject to customs duties and taxes based on your country's regulations. 
          These charges are the responsibility of the recipient.
        </p>

        <h2>Questions?</h2>
        <p>
          For shipping inquiries, please contact us at{' '}
          <a href="mailto:support@blacmelo.com">support@blacmelo.com</a>
        </p>
      </div>
    </div>
  );
}
