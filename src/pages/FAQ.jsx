import { useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';

const faqs = [
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Mobile Money payments.' },
  { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days. Free shipping on orders over $100.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day return policy for unworn items in their original packaging. Simply initiate a return through your account and we\'ll provide a prepaid shipping label.' },
  { q: 'How do I find my correct shoe size?', a: 'Check our size guide page for detailed measurements. You can also refer to the brand-specific sizing information on each product page.' },
  { q: 'Can I cancel or modify my order?', a: 'Orders can be cancelled within 1 hour of placing. After that, please contact customer support for assistance.' },
  { q: 'Do you offer international shipping?', a: 'Yes, we ship to over 50 countries worldwide. International shipping typically takes 7-14 business days and costs vary by location.' },
  { q: 'How can I track my order?', a: 'Once your order ships, you\'ll receive a tracking number via email. You can also track your order in the "My Orders" section of your account.' },
  { q: 'Are the products authentic?', a: 'Absolutely! We source all products directly from authorized distributors and brand partners. Every item is 100% authentic.' },
];

const FAQItem = ({ faq, isOpen, onClick }) => (
  <div className={`card overflow-hidden ${isOpen ? 'border-brand-600/50' : ''}`}>
    <button onClick={onClick} className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-surface-800/50">
      <span className="text-white font-semibold text-sm pr-4">{faq.q}</span>
      <HiOutlineChevronDown className={`w-5 h-5 text-surface-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180 text-brand-400' : ''}`} />
    </button>
    {isOpen && (
      <div className="px-5 pb-5">
        <p className="text-surface-300 text-sm leading-relaxed">{faq.a}</p>
      </div>
    )}
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-surface-400">Find answers to common questions about our products, shipping, and policies.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} faq={faq} isOpen={openIndex === idx} onClick={() => setOpenIndex(openIndex === idx ? null : idx)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
