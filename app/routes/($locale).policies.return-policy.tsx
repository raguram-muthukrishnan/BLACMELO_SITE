export const meta = () => {
  return [{title: 'Return and Refund Policy | BLACMELO'}];
};

export default function ReturnPolicyPage() {
  return (
    <div className="policy-page" style={{padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto'}}>
      <h1 style={{fontSize: '2.5rem', marginBottom: '2rem', fontFamily: 'DM Sans, sans-serif'}}>
        Return and Refund Policy
      </h1>

      <div style={{lineHeight: '1.8', fontFamily: 'DM Sans, sans-serif', color: '#333'}}>
        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>Returns</h2>
        <p style={{marginBottom: '1rem'}}>
          At BLACMELO, we want you to be completely satisfied with your purchase. If for any reason you're not happy 
          with your order, you may return it within 30 days of receipt for a full refund or exchange.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>Return Conditions</h2>
        <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
          <li style={{marginBottom: '0.5rem'}}>Items must be unworn, unwashed, and in original condition with all tags attached</li>
          <li style={{marginBottom: '0.5rem'}}>Original packaging must be included</li>
          <li style={{marginBottom: '0.5rem'}}>Proof of purchase required</li>
          <li style={{marginBottom: '0.5rem'}}>Sale items are final sale unless defective</li>
        </ul>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>How to Return</h2>
        <p style={{marginBottom: '1rem'}}>
          To initiate a return, please contact our customer service team at{' '}
          <a href="mailto:support@blacmelo.com" style={{color: '#000', textDecoration: 'underline'}}>
            support@blacmelo.com
          </a>{' '}
          with your order number and reason for return.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>Refunds</h2>
        <p style={{marginBottom: '1rem'}}>
          Once your return is received and inspected, we will send you an email notification. If approved, 
          your refund will be processed within 5-10 business days to your original payment method.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>Exchanges</h2>
        <p style={{marginBottom: '1rem'}}>
          We're happy to exchange items for a different size or color. Please contact us to arrange an exchange.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>Questions?</h2>
        <p style={{marginBottom: '1rem'}}>
          If you have any questions about our return policy, please contact us at{' '}
          <a href="mailto:support@blacmelo.com" style={{color: '#000', textDecoration: 'underline'}}>
            support@blacmelo.com
          </a>{' '}
          or call{' '}
          <a href="tel:+971525648367" style={{color: '#000', textDecoration: 'underline'}}>
            +971 52 5648367
          </a>
        </p>
      </div>
    </div>
  );
}
