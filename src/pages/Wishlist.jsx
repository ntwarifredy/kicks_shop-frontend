import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { formatPrice, placeholderImg } from '../utils/helpers';
import { HiOutlineTrash, HiOutlineShoppingCart, HiOutlineArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data: response } = await API.get('/wishlist');
        setItems(response.data?.items || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchWishlist();
    else setLoading(false);
  }, [isAuthenticated]);

  const removeFromWishlist = async (productId) => {
    try {
      await API.delete(`/wishlist/${productId}`);
      setItems(items.filter((item) => {
        const id = item._id || item.id || item.product?._id || item.product?.id;
        return id !== productId;
      }));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  if (loading) return <Loader fullPage />;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <Message variant="info">Please login to view your wishlist.</Message>
          <Link to="/login" className="inline-block mt-4 text-brand-400 hover:text-brand-300">Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">My Wishlist</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Message variant="info">Your wishlist is empty.</Message>
            <Link to="/shop" className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 mt-4 transition-colors">
              <HiOutlineArrowLeft className="w-4 h-4" /> Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const product = item.product || item;
              const imageUrl = product.images?.[0] || product.image || placeholderImg(300, 300, 'No Image');
              const price = product.discountPrice || product.price;
              const productId = product._id || product.id;

              return (
                <div key={productId} className="card overflow-hidden group hover:border-surface-600 hover:shadow-xl hover:-translate-y-1 transition-all">
                  <Link to={`/product/${productId}`} className="block aspect-square overflow-hidden">
                    <img src={imageUrl} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.target.src = placeholderImg(300, 300, 'No Image'); }} />
                  </Link>
                  <div className="p-4">
                    <Link to={`/product/${productId}`} className="text-sm font-medium text-white hover:text-brand-400 transition-colors truncate block">
                      {product.name}
                    </Link>
                    <p className="text-lg font-bold text-brand-400 mt-1">{formatPrice(price)}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        className="flex-1 btn-primary text-xs py-2 font-medium flex items-center justify-center gap-1">
                        <HiOutlineShoppingCart className="w-3 h-3" /> Add to Cart
                      </button>
                      <button onClick={() => removeFromWishlist(productId)}
                        className="p-2 btn-ghost hover:text-red-400 hover:bg-red-500/10">
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
