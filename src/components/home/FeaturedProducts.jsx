import { useState, useEffect } from 'react';
import API from '../../api/axios';
import ProductCard from '../product/ProductCard';
import Loader from '../common/Loader';
import Message from '../common/Message';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineLightningBolt } from 'react-icons/hi';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data: response } = await API.get('/products/featured');
        setProducts(response.data || []);
      } catch {
        setError('Failed to load featured products');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 lg:py-16 bg-surface-900/50">
      <div className="alibaba-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-deal-500 to-orange-600 flex items-center justify-center">
              <HiOutlineLightningBolt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Flash Deals</h2>
              <p className="text-sm text-surface-400">Limited time offers — grab them before they're gone!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-surface-400">Ends in:</span>
              <div className="flex items-center gap-1.5">
                <span className="bg-surface-800 text-white font-bold text-lg px-2.5 py-1 rounded-lg min-w-[36px] text-center">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-surface-500 font-bold">:</span>
                <span className="bg-surface-800 text-white font-bold text-lg px-2.5 py-1 rounded-lg min-w-[36px] text-center">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-surface-500 font-bold">:</span>
                <span className="bg-surface-800 text-white font-bold text-lg px-2.5 py-1 rounded-lg min-w-[36px] text-center">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
            <Link to="/shop?sort=-discountPrice" className="hidden sm:flex items-center gap-1 text-sm text-brand-500 hover:text-brand-400 font-medium transition-colors">
              View All <HiOutlineArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {loading && <Loader />}
        {error && <Message variant="error">{error}</Message>}
        {!loading && !error && products.length === 0 && (
          <Message variant="info">No deals available right now. Check back soon!</Message>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>

        <div className="mt-4 text-center sm:hidden">
          <Link to="/shop" className="btn-secondary text-sm inline-flex items-center gap-1">
            View All Deals <HiOutlineArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
