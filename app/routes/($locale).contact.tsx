import {Form} from 'react-router';
import type {LoaderFunctionArgs, MetaFunction} from 'react-router';
import banner4 from '~/assets/banner images/4.png';
import banner2 from '~/assets/banner images/2.jpeg';
import aboutContactStyles from '~/styles/pages/about-contact.css?url';

export const links = () => [
  {rel: 'stylesheet', href: aboutContactStyles},
];

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `BLACMELO | Contact Us`},
    {
      name: 'description',
      content: 'Get in touch with BLACMELO - we\'re here to help.',
    },
  ];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  return {};
}

export default function Contact() {
  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero-section">
        <div className="contact-hero-content">
          <p className="contact-hero-subtitle">GET IN TOUCH</p>
          <h1 className="contact-hero-title">CONTACT US</h1>
          <p className="contact-hero-description">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="contact-main-section">
        {/* Contact Form */}
        <div className="contact-form-container">
          <h2 className="contact-section-title">SEND US A MESSAGE</h2>
          <Form method="post" className="contact-form">
            <div className="contact-form-row">
              <div className="contact-form-group">
                <label htmlFor="name" className="contact-label">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="contact-input"
                  placeholder="Your name"
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="email" className="contact-label">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="contact-input"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="contact-form-group">
              <label htmlFor="subject" className="contact-label">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="contact-input"
                placeholder="How can we help?"
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="message" className="contact-label">Message *</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="contact-textarea"
                placeholder="Tell us more..."
              />
            </div>

            <button type="submit" className="contact-submit-btn">
              SEND MESSAGE
            </button>
          </Form>
        </div>

        {/* Contact Information with Image */}
        <div className="contact-info-container">
          <div className="contact-info-image">
            <img src={banner4} alt="BLACMELO Store" />
          </div>
          
          <div className="contact-info-details">
            <div className="contact-info-item">
              <h3 className="contact-info-title">EMAIL</h3>
              <p className="contact-info-text">
                <a href="mailto:hello@blacmelo.com">hello@blacmelo.com</a>
              </p>
              <p className="contact-info-text">
                <a href="mailto:support@blacmelo.com">support@blacmelo.com</a>
              </p>
            </div>

            <div className="contact-info-item">
              <h3 className="contact-info-title">PHONE</h3>
              <p className="contact-info-text">+1 (555) 123-4567</p>
              <p className="contact-info-subtext">Mon - Fri: 9:00 AM - 6:00 PM EST</p>
            </div>

            <div className="contact-info-item">
              <h3 className="contact-info-title">ADDRESS</h3>
              <p className="contact-info-text">
                BLACMELO Headquarters<br />
                123 Fashion Street<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>

            <div className="contact-info-item">
              <h3 className="contact-info-title">FOLLOW US</h3>
              <div className="contact-social-links">
                <a href="https://instagram.com/blacmelo" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
                <a href="https://twitter.com/blacmelo" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
                <a href="https://facebook.com/blacmelo" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Image Section */}
      <section className="contact-bottom-section">
        <img src={banner2} alt="BLACMELO Collection" />
      </section>
    </div>
  );
}
