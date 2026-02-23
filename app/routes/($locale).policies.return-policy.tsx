import policyStyles from '~/styles/pages/policy.css?url';

export const links = () => [
  { rel: 'stylesheet', href: policyStyles },
];

export const meta = () => {
  return [{title: 'Return and Refund Policy | BLACMELO'}];
};

export default function ReturnPolicyPage() {
  return (
    <div className="policy-page">
      <div className="policy-header">
        <h1 className="policy-title">Return and Refund Policy</h1>
      </div>

      <div className="policy-content">
        <h2>Returns</h2>
        <p>
          At BLACMELO, we want you to be completely satisfied with your purchase. If for any reason you're not happy 
          with your order, you may return it within 30 days of receipt for a full refund or exchange.
        </p>

        <h2>Return Conditions</h2>
        <ul>
          <li>Items must be unworn, unwashed, and in original condition with all tags attached</li>
          <li>Original packaging must be included</li>
          <li>Proof of purchase required</li>
          <li>Sale items are final sale unless defective</li>
        </ul>

        <h2>How to Return</h2>
        <p>
          To initiate a return, please contact our customer service team at{' '}
          <a href="mailto:support@blacmelo.com">support@blacmelo.com</a>{' '}
          with your order number and reason for return.
        </p>

        <h2>Refunds</h2>
        <p>
          Once your return is received and inspected, we will send you an email notification. If approved, 
          your refund will be processed within 5-10 business days to your original payment method.
        </p>

        <h2>Exchanges</h2>
        <p>
          We're happy to exchange items for a different size or color. Please contact us to arrange an exchange.
        </p>

        <h2>Questions?</h2>
        <p>
          If you have any questions about our return policy, please contact us at{' '}
          <a href="mailto:support@blacmelo.com">support@blacmelo.com</a>{' '}
          or call{' '}
          <a href="tel:+971525648367">+971 52 5648367</a>
        </p>
      </div>
    </div>
  );
}
