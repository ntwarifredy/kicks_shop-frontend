import { HiOutlineShieldCheck, HiOutlineTruck, HiOutlineRefresh, HiOutlineSupport, HiOutlineCreditCard } from 'react-icons/hi';

const badges = [
  { icon: HiOutlineShieldCheck, title: 'Trade Assurance', desc: 'Your orders are protected from payment to delivery' },
  { icon: HiOutlineTruck, title: 'Global Shipping', desc: 'Fast & reliable shipping to 185+ countries worldwide' },
  { icon: HiOutlineRefresh, title: 'Easy Returns', desc: '30-day hassle-free return policy on all products' },
  { icon: HiOutlineSupport, title: '24/7 Support', desc: 'Dedicated support team available around the clock' },
  { icon: HiOutlineCreditCard, title: 'Secure Payments', desc: 'Multiple secure payment methods accepted' },
];

const TrustBadges = () => {
  return (
    <section className="py-12 lg:py-16 bg-surface-950 border-y border-surface-800">
      <div className="alibaba-container">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white">Why Choose KICKS_SHOP</h2>
          <p className="text-sm text-surface-400 mt-1">We make sourcing footwear simple, safe, and reliable</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {badges.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-6 text-center hover:border-surface-600 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-500/20 transition-colors">
                <Icon className="w-6 h-6 text-brand-500" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
              <p className="text-xs text-surface-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
