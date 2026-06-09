import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a1a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-1 mb-4">
              <span className="text-2xl font-extrabold text-brand-600">KICKS</span>
              <span className="text-2xl font-light text-white">_SHOP</span>
            </Link>
            <div className="space-y-2 text-sm text-surface-400">
              <a href="mailto:kicksshop1@gmail.com" className="flex items-center gap-2 hover:text-brand-400 transition-colors">
                <HiOutlineMail className="w-4 h-4 text-brand-500" /> kicksshop1@gmail.com
              </a>
              <a href="tel:+250781089893" className="flex items-center gap-2 hover:text-brand-400 transition-colors">
                <HiOutlinePhone className="w-4 h-4 text-brand-500" /> +250 781 089 893
              </a>
              <span className="flex items-center gap-2">
                <HiOutlineLocationMarker className="w-4 h-4 text-brand-500" /> Downtown, Nyarugenge, Kigali
              </span>
              <a href="https://www.instagram.com/kick_s_shop1/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-brand-400 transition-colors">
                <FaInstagram className="w-4 h-4 text-brand-500" /> @kick_s_shop1
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-surface-200 uppercase tracking-wider mb-4">Company Info</h3>
            <ul className="space-y-2.5">
              {[['About Us', '/about'], ['Contact Us', '/contact'], ['Careers', '/careers']].map(([name, path]) => (
                <li key={name}>
                  <Link to={path} className="text-sm text-surface-400 hover:text-brand-400 transition-colors">{name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-surface-200 uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {['Running Shoes', 'Casual Sneakers', 'Sports Shoes', 'Boots', 'Accessories'].map((item) => (
                <li key={item}>
                  <Link to={`/shop?category=${item.replace(' ', '%20')}`} className="text-sm text-surface-400 hover:text-brand-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-surface-200 uppercase tracking-wider mb-4">Customer Service</h3>
            <ul className="space-y-2.5">
              {[['Help Center', '/help'], ['FAQ', '/faq'], ['Shipping Info', '/shipping'], ['Returns & Exchanges', '/returns'], ['Order Tracking', '/orders']].map(([name, path]) => (
                <li key={name}>
                  <Link to={path} className="text-sm text-surface-400 hover:text-brand-400 transition-colors">{name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-500">
            &copy; {new Date().getFullYear()} KICKS_SHOP. All rights reserved. |{' '}
            <Link to="/privacy" className="hover:text-brand-400 transition-colors">Privacy Policy</Link>
            {' · '}
            <Link to="/terms" className="hover:text-brand-400 transition-colors">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
