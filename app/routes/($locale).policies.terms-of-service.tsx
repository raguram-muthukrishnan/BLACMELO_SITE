import policyStyles from '~/styles/pages/policy.css?url';

export const links = () => [
  { rel: 'stylesheet', href: policyStyles },
];

export const meta = () => {
  return [{title: 'Terms of Service | BLACMELO'}];
};

export default function TermsOfServicePage() {
  return (
    <div className="policy-page">
      <div className="policy-header">
        <h1 className="policy-title">Terms of Service</h1>
        <p className="policy-last-updated">Last Updated: February 11, 2026</p>
      </div>

      <div className="policy-content">
        <h2>1. Agreement to Terms</h2>
        <p>
          By accessing and using the BLACMELO website, you agree to be bound by these Terms of Service and all 
          applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from 
          using or accessing this site.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials on BLACMELO's website for 
          personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
        </p>

        <h2>3. Product Information</h2>
        <p>
          We strive to provide accurate product descriptions and imagery. However, we do not warrant that product 
          descriptions, colors, or other content available on the site is accurate, complete, reliable, current, 
          or error-free.
        </p>

        <h2>4. Pricing</h2>
        <p>
          All prices are subject to change without notice. We reserve the right to modify or discontinue products 
          at any time. Prices are displayed in USD unless otherwise specified.
        </p>

        <h2>5. Account Registration</h2>
        <p>
          When you create an account with us, you must provide accurate and complete information. You are responsible 
          for maintaining the confidentiality of your account and password.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          All content on this website, including but not limited to text, graphics, logos, images, and software, 
          is the property of BLACMELO and is protected by international copyright laws.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          BLACMELO shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
          resulting from your access to or use of the website.
        </p>

        <h2>8. Governing Law</h2>
        <p>
          These terms shall be governed by and construed in accordance with the laws of the United Arab Emirates, 
          without regard to its conflict of law provisions.
        </p>

        <h2>9. Contact Information</h2>
        <p>
          For questions about these Terms of Service, please contact us at{' '}
          <a href="mailto:support@blacmelo.com">support@blacmelo.com</a>
        </p>
      </div>
    </div>
  );
}
