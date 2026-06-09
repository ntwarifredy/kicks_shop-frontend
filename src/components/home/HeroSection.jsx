import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { formatPrice, placeholderImg } from '../../utils/helpers';
import { HiOutlineArrowRight, HiOutlineShieldCheck, HiOutlineTruck, HiOutlineRefresh } from 'react-icons/hi';

const HeroSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products', { params: { limit: 4, sort: '-createdAt' } });
        setProducts(data.data || []);
      } catch {
        // fallback to empty
      }
    };
    fetchProducts();
  }, []);

  const displayProducts = products.length >= 4 ? products : [
    { name: 'Premium Sneaker', images: ['/api/placeholder?text=👟+Premium+Sneaker&w=200&h=200'], price: 4999 },
    { name: 'Classic Trainer', images: ['/api/placeholder?text=👟+Classic+Trainer&w=200&h=200'], price: 5999 },
    { name: 'Sport Runner', images: ['/api/placeholder?text=👟+Sport+Runner&w=200&h=200'], price: 7999 },
    { name: 'Street Style', images: ['/api/placeholder?text=👟+Street+Style&w=200&h=200'], price: 6499 },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0a0a1a] via-surface-950 to-brand-950/30">
      <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-800/10 rounded-full blur-[100px]" />
      
      <div className="alibaba-container relative py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Premium Footwear Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
              Source the Best{' '}
              <span className="text-brand-500">Sneakers</span>
              <br />for Your Store
            </h1>

            <p className="text-lg text-surface-400 mb-8 max-w-lg leading-relaxed">
              Connect with verified suppliers, compare prices, and order premium footwear 
              with trade assurance — all in one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link to="/shop" className="btn-primary text-base px-8 py-3 inline-flex items-center justify-center gap-2">
                Start Sourcing <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about" className="btn-secondary text-base px-8 py-3 inline-flex items-center justify-center gap-2">
                Learn More
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: HiOutlineShieldCheck, label: 'Trade Assurance', desc: 'Protected payments' },
                { icon: HiOutlineTruck, label: 'Global Shipping', desc: '185+ countries' },
                { icon: HiOutlineRefresh, label: 'Easy Returns', desc: '30-day guarantee' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{label}</p>
                    <p className="text-xs text-surface-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden border border-surface-800 bg-surface-900/50 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xs font-bold text-white">K</div>
                  <div>
                    <p className="text-sm font-semibold text-white">Premium Supplier</p>
                    <p className="text-xs text-surface-500">Verified · 5 years on KICKS</p>
                  </div>
                </div>
                <span className="trust-badge"><HiOutlineShieldCheck className="w-3 h-3" /> Verified</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {displayProducts.slice(0, 4).map((p, i) => {
                  const imgSrc = p.images?.[0] || placeholderImg(200, 200, p.name);
                  return (
                    <div key={i} className="aspect-square rounded-xl bg-surface-800 overflow-hidden">
                      <img src={imgSrc} alt={p.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = placeholderImg(200, 200, p.name); }} />
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-800">
                <span className="text-sm text-surface-400">Starting from</span>
                <span className="text-2xl font-bold text-brand-500">{formatPrice(Math.min(...displayProducts.map(p => p.price || 9999)))}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-surface-500">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 12K+ products</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-500" /> 500+ suppliers</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-trust-500" /> 99% satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
