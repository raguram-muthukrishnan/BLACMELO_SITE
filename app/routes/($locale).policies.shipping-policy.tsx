export const meta = () => {
  return [{title: 'Shipping Policy | BLACMELO'}];
};

export default function ShippingPolicyPage() {
  return (
    <div className="policy-page" style={{padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto'}}>
      <h1 style={{fontSize: '2.5rem', marginBottom: '2rem', fontFamily: 'DM Sans, sans-serif'}}>
        Shipping Policy
      </h1>

      <div style={{lineHeight: '1.8', fontFamily: 'DM Sans, sans-serif', color: '#333'}}>
        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>Shipping Information</h2>
        <p style={{marginBottom: '1rem'}}>
          At BLACMELO, we offer worldwide shipping to bring luxury to your doorstep. All orders are processed 
          within 1-2 business days and shipped via express courier services.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>Delivery Times</h2>
        <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
          <li style={{marginBottom: '0.5rem'}}>UAE: 1-2 business days</li>
          <li style={{marginBottom: '0.5rem'}}>GCC Countries: 2-4 business days</li>
          <li style={{marginBottom: '0.5rem'}}>Europe: 3-5 business days</li>
          <li style={{marginBottom: '0.5rem'}}>United States: 4-7 business days</li>
          <li style={{marginBottom: '0.5rem'}}>Rest of World: 5-10 business days</li>
        </ul>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>Shipping Costs</h2>
        <p style={{marginBottom: '1rem'}}>
          We offer <strong>FREE SHIPPING</strong> on all orders over $100. For orders under $100:
        </p>
        <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
          <li style={{marginBottom: '0.5rem'}}>UAE: $10</li>
          <li style={{marginBottom: '0.5rem'}}>GCC Countries: $15</li>
          <li style={{marginBottom: '0.5rem'}}>International: $25</li>
        </ul>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>Order Tracking</h2>
        <p style={{marginBottom: '1rem'}}>
          Once your order ships, you'll receive a tracking number via email. You can track your order at any time 
          through our website or the courier's tracking portal.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>Customs & Duties</h2>
        <p style={{marginBottom: '1rem'}}>
          International orders may be subject to customs duties and taxes based on your country's regulations. 
          These charges are the responsibility of the recipient.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>Questions?</h2>
        <p style={{marginBottom: '1rem'}}>
          For shipping inquiries, please contact us at{' '}
          <a href="mailto:support@blacmelo.com" style={{color: '#000', textDecoration: 'underline'}}>
            support@blacmelo.com
          </a>
        </p>
      </div>
    </div>
  );
}
