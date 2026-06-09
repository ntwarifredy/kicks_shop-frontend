import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import useAuth from '../../hooks/useAuth';
import StarRating from '../common/StarRating';
import { formatPrice, getDiscountPercentage, placeholderImg } from '../../utils/helpers';
import { HiOutlineShoppingCart, HiOutlineShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    addToCart(product._id || product.id, 1, product.sizes?.[0], product.color?.[0]);
  };

  const discount = product.discountPrice
    ? getDiscountPercentage(product.price, product.discountPrice)
    : 0;

  const imageUrl = product.images?.[0] || product.image || placeholderImg(260, 260, 'No Image');

  return (
    <Link to={`/product/${product._id || product.id}`}
      className="group bg-surface-900 border border-surface-800 rounded-xl overflow-hidden hover:border-surface-600 hover:shadow-lg hover:shadow-black/30 transition-all duration-200 flex flex-col">
      <div className="relative overflow-hidden aspect-[4/3] bg-surface-800">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = placeholderImg(260, 260, 'No Image'); }}
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 deal-badge">-{discount}%</span>
        )}
        <div className="absolute top-2 right-2">
          <span className="trust-badge text-[10px]">
            <HiOutlineShieldCheck className="w-2.5 h-2.5" /> Verified
          </span>
        </div>
      </div>
      <div className="p-3 lg:p-4 flex flex-col flex-1 gap-1.5">
        <div className="flex items-center gap-1.5 text-[11px] text-surface-500">
          <span className="font-medium text-surface-400">{product.brand || 'Generic'}</span>
          <span className="w-1 h-1 rounded-full bg-surface-600" />
          <span>{product.sold || Math.floor(Math.random() * 500) + 50} sold</span>
        </div>
        <h3 className="text-sm font-medium text-surface-100 leading-snug line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1.5">
          <StarRating rating={product.rating || 0} size="sm" />
          <span className="text-[11px] text-surface-500">({product.numReviews || 0})</span>
        </div>
        <div className="flex items-center gap-2 mt-auto pt-2">
          {product.discountPrice ? (
            <>
              <span className="text-base lg:text-lg font-bold text-brand-500">{formatPrice(product.discountPrice)}</span>
              <span className="text-xs text-surface-500 line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-base lg:text-lg font-bold text-white">{formatPrice(product.price)}</span>
          )}
          <span className="text-[10px] text-surface-500 ml-auto">/ pair</span>
        </div>
        <button onClick={handleAddToCart}
          className="btn-primary w-full mt-2 text-xs lg:text-sm px-3 py-2 flex items-center justify-center gap-1.5 disabled:opacity-50"
          disabled={!isAuthenticated}>
          <HiOutlineShoppingCart className="w-3.5 h-3.5" />
          {isAuthenticated ? 'Add to Cart' : 'Login to Buy'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
