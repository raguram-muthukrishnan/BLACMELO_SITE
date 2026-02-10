export const meta = () => {
  return [{title: 'Terms of Service | BLACMELO'}];
};

export default function TermsOfServicePage() {
  return (
    <div className="policy-page" style={{padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto'}}>
      <h1 style={{fontSize: '2.5rem', marginBottom: '2rem', fontFamily: 'DM Sans, sans-serif'}}>
        Terms of Service
      </h1>

      <div style={{lineHeight: '1.8', fontFamily: 'DM Sans, sans-serif', color: '#333'}}>
        <p style={{marginBottom: '1rem', fontSize: '0.875rem', color: '#666'}}>
          Last Updated: February 11, 2026
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>1. Agreement to Terms</h2>
        <p style={{marginBottom: '1rem'}}>
          By accessing and using the BLACMELO website, you agree to be bound by these Terms of Service and all 
          applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from 
          using or accessing this site.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>2. Use License</h2>
        <p style={{marginBottom: '1rem'}}>
          Permission is granted to temporarily download one copy of the materials on BLACMELO's website for 
          personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>3. Product Information</h2>
        <p style={{marginBottom: '1rem'}}>
          We strive to provide accurate product descriptions and imagery. However, we do not warrant that product 
          descriptions, colors, or other content available on the site is accurate, complete, reliable, current, 
          or error-free.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>4. Pricing</h2>
        <p style={{marginBottom: '1rem'}}>
          All prices are subject to change without notice. We reserve the right to modify or discontinue products 
          at any time. Prices are displayed in USD unless otherwise specified.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>5. Account Registration</h2>
        <p style={{marginBottom: '1rem'}}>
          When you create an account with us, you must provide accurate and complete information. You are responsible 
          for maintaining the confidentiality of your account and password.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>6. Intellectual Property</h2>
        <p style={{marginBottom: '1rem'}}>
          All content on this website, including but not limited to text, graphics, logos, images, and software, 
          is the property of BLACMELO and is protected by international copyright laws.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>7. Limitation of Liability</h2>
        <p style={{marginBottom: '1rem'}}>
          BLACMELO shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
          resulting from your access to or use of the website.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>8. Governing Law</h2>
        <p style={{marginBottom: '1rem'}}>
          These terms shall be governed by and construed in accordance with the laws of the United Arab Emirates, 
          without regard to its conflict of law provisions.
        </p>

        <h2 style={{fontSize: '1.5rem', marginBottom: '1rem', marginTop: '2rem'}}>9. Contact Information</h2>
        <p style={{marginBottom: '1rem'}}>
          For questions about these Terms of Service, please contact us at{' '}
          <a href="mailto:support@blacmelo.com" style={{color: '#000', textDecoration: 'underline'}}>
            support@blacmelo.com
          </a>
        </p>
      </div>
    </div>
  );
}
