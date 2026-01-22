import {type MetaFunction} from 'react-router';

export const meta: MetaFunction = () => {
  return [{title: 'FAQ - Frequently Asked Questions'}];
};

export default function FAQ() {
  const faqs = [
    {
      question: 'What is your shipping policy?',
      answer: 'We offer free shipping on orders over $50. Standard shipping takes 5-7 business days.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of purchase. Items must be unused and in original packaging.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive a tracking number via email.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs vary by location.',
    },
  ];

  return (
    <div className="faq-page">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
