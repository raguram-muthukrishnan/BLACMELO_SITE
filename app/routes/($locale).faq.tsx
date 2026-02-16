import {type MetaFunction} from 'react-router';
import {useState} from 'react';
import banner3 from '~/assets/banner images/3.jpeg';
import aboutContactStyles from '~/styles/pages/about-contact.css?url';

export const links = () => [
  {rel: 'stylesheet', href: aboutContactStyles},
];

export const meta: MetaFunction = () => {
  return [
    {title: 'BLACMELO | FAQ - Frequently Asked Questions'},
    {
      name: 'description',
      content: 'Find answers to frequently asked questions about BLACMELO products, shipping, returns, and more.',
    },
  ];
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqCategories = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          question: 'What is your shipping policy?',
          answer: 'We offer free standard shipping on all orders over $100. Standard shipping typically takes 5-7 business days within the continental United States. Express shipping options are available at checkout for faster delivery.',
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes, we ship to most countries worldwide. International shipping costs and delivery times vary by location. Customs duties and taxes may apply and are the responsibility of the customer.',
        },
        {
          question: 'How can I track my order?',
          answer: 'Once your order ships, you will receive a shipping confirmation email with a tracking number. You can use this number to track your package on our website or the carrier\'s website.',
        },
        {
          question: 'Can I change or cancel my order?',
          answer: 'Orders can be modified or cancelled within 2 hours of placement. After this time, the order enters our fulfillment process and cannot be changed. Please contact our customer service team immediately if you need assistance.',
        },
      ],
    },
    {
      category: 'Returns & Exchanges',
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original condition with all tags attached. Sale items and final sale products are not eligible for return.',
        },
        {
          question: 'How do I initiate a return?',
          answer: 'To start a return, log into your account and navigate to your order history. Select the items you wish to return and follow the prompts. You will receive a prepaid return label via email.',
        },
        {
          question: 'Can I exchange an item?',
          answer: 'Yes, we offer exchanges for different sizes or colors. Please initiate a return for the original item and place a new order for the desired item to ensure availability.',
        },
        {
          question: 'When will I receive my refund?',
          answer: 'Refunds are processed within 5-7 business days after we receive your return. The refund will be issued to your original payment method. Please allow additional time for your bank to process the refund.',
        },
      ],
    },
    {
      category: 'Products & Sizing',
      questions: [
        {
          question: 'How do I find my size?',
          answer: 'Each product page includes a detailed size guide. We recommend measuring yourself and comparing your measurements to our size chart for the best fit. If you\'re between sizes, we suggest sizing up.',
        },
        {
          question: 'Are your products true to size?',
          answer: 'Our products are designed to fit true to size. However, some styles may have an oversized or relaxed fit as part of the design. Please check the product description and size guide for specific fit information.',
        },
        {
          question: 'How do I care for my BLACMELO products?',
          answer: 'Care instructions are included on the garment label. Generally, we recommend washing in cold water, turning garments inside out, and air drying to maintain quality and longevity.',
        },
        {
          question: 'Do you restock sold-out items?',
          answer: 'Popular items are often restocked, but availability varies. Sign up for restock notifications on the product page to be alerted when an item becomes available again.',
        },
      ],
    },
    {
      category: 'Account & Payment',
      questions: [
        {
          question: 'Do I need an account to place an order?',
          answer: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save addresses, and access exclusive member benefits.',
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay. All transactions are secure and encrypted.',
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, we use industry-standard SSL encryption to protect your payment information. We do not store your credit card details on our servers.',
        },
        {
          question: 'Do you offer gift cards?',
          answer: 'Yes, BLACMELO gift cards are available in various denominations. They can be purchased on our website and are delivered via email.',
        },
      ],
    },
  ];

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <section className="faq-hero-section">
        <div className="faq-hero-content">
          <p className="faq-hero-subtitle">HELP CENTER</p>
          <h1 className="faq-hero-title">FREQUENTLY ASKED QUESTIONS</h1>
          <p className="faq-hero-description">
            Find answers to common questions about our products, orders, shipping, and more.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="faq-content-section">
        <div className="faq-container">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="faq-category">
              <h2 className="faq-category-title">{category.category}</h2>
              <div className="faq-list">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = categoryIndex * 100 + questionIndex;
                  const isOpen = openIndex === globalIndex;
                  
                  return (
                    <div key={questionIndex} className="faq-item">
                      <button
                        className={`faq-question ${isOpen ? 'active' : ''}`}
                        onClick={() => toggleFAQ(globalIndex)}
                      >
                        <span>{faq.question}</span>
                        <svg
                          className={`faq-icon ${isOpen ? 'rotated' : ''}`}
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 3V13M3 8H13"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Side Image */}
        <div className="faq-side-image">
          <img src={banner3} alt="BLACMELO Collection" />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="faq-cta-section">
        <h2 className="faq-cta-title">Still have questions?</h2>
        <p className="faq-cta-text">
          Our customer service team is here to help. Get in touch with us.
        </p>
        <a href="/contact" className="faq-cta-button">
          CONTACT US
        </a>
      </section>
    </div>
  );
}
