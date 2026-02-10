export const meta = () => {
  return [{title: 'Privacy Policy | BLACMELO'}];
};

export default function PrivacyPolicyPage() {
  return (
    <div className="policy-page" style={{padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto'}}>
      <h1 style={{fontSize: '2.5rem', marginBottom: '2rem', fontFamily: 'DM Sans, sans-serif'}}>
        Privacy Policy
      </h1>

      <div style={{lineHeight: '1.8', fontFamily: 'DM Sans, sans-serif', color: '#333'}}>
        <p style={{marginBottom: '1rem', fontSize: '0.875rem', color: '#666'}}>
          Last Updated: February 11, 2026
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>1. Information We Collect</h2>
        <p style={{marginBottom: '1rem'}}>
          We collect information you provide directly to us when you create an account, make a purchase, 
          subscribe to our newsletter, or contact us for support. This may include:
        </p>
        <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
          <li style={{marginBottom: '0.5rem'}}>Name and contact information</li>
          <li style={{marginBottom: '0.5rem'}}>Billing and shipping addresses</li>
          <li style={{marginBottom: '0.5rem'}}>Payment information</li>
          <li style={{marginBottom: '0.5rem'}}>Purchase history</li>
          <li style={{marginBottom: '0.5rem'}}>Email preferences</li>
        </ul>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>2. How We Use Your Information</h2>
        <p style={{marginBottom: '1rem'}}>
          We use the information we collect to:
        </p>
        <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
          <li style={{marginBottom: '0.5rem'}}>Process and fulfill your orders</li>
          <li style={{marginBottom: '0.5rem'}}>Communicate with you about your orders and account</li>
          <li style={{marginBottom: '0.5rem'}}>Send you marketing communications (with your consent)</li>
          <li style={{marginBottom: '0.5rem'}}>Improve our products and services</li>
          <li style={{marginBottom: '0.5rem'}}>Prevent fraud and enhance security</li>
        </ul>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>3. Information Sharing</h2>
        <p style={{marginBottom: '1rem'}}>
          We do not sell or rent your personal information to third parties. We may share your information with:
        </p>
        <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
          <li style={{marginBottom: '0.5rem'}}>Service providers who assist with order fulfillment and payment processing</li>
          <li style={{marginBottom: '0.5rem'}}>Shipping carriers to deliver your orders</li>
          <li style={{marginBottom: '0.5rem'}}>Analytics providers to help us improve our website</li>
        </ul>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>4. Cookies and Tracking</h2>
        <p style={{marginBottom: '1rem'}}>
          We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, 
          and personalize content. You can control cookies through your browser settings.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>5. Data Security</h2>
        <p style={{marginBottom: '1rem'}}>
          We implement appropriate security measures to protect your personal information. However, no method of 
          transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>6. Your Rights</h2>
        <p style={{marginBottom: '1rem'}}>
          You have the right to:
        </p>
        <ul style={{paddingLeft: '1.5rem', marginBottom: '1rem'}}>
          <li style={{marginBottom: '0.5rem'}}>Access and update your personal information</li>
          <li style={{marginBottom: '0.5rem'}}>Request deletion of your data</li>
          <li style={{marginBottom: '0.5rem'}}>Opt-out of marketing communications</li>
          <li style={{marginBottom: '0.5rem'}}>Request a copy of your data</li>
        </ul>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>7. Children's Privacy</h2>
        <p style={{marginBottom: '1rem'}}>
          Our website is not intended for children under 16. We do not knowingly collect personal information 
          from children under 16.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>8. Changes to This Policy</h2>
        <p style={{marginBottom: '1rem'}}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
          new policy on this page and updating the "Last Updated" date.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>9. Contact Us</h2>
        <p style={{marginBottom: '1rem'}}>
          If you have questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:privacy@blacmelo.com" style={{color: '#000', textDecoration: 'underline'}}>
            privacy@blacmelo.com
          </a>
        </p>
      </div>
    </div>
  );
}
