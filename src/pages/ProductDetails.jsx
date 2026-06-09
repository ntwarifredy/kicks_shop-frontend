import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { CartContext } from '../context/CartContext';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import StarRating from '../components/common/StarRating';
import ProductCard from '../components/product/ProductCard';
import { formatPrice, getDiscountPercentage, getDate, placeholderImg } from '../utils/helpers';
import { HiOutlineShoppingCart, HiOutlineHeart, HiOutlineMinus, HiOutlinePlus } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data.data);
        setReviews(data.reviews || []);
        if (data.data?.category) {
          try {
            const cat = data.data.category;
            const catName = typeof cat === 'object' ? cat.name : cat;
            const { data: relatedData } = await API.get('/products', { params: { category: catName, limit: 4 } });
            const filtered = (relatedData.data || []).filter(
              (p) => (p._id || p.id) !== id
            );
            setRelated(filtered.slice(0, 4));
          } catch {}
        }
      } catch {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    addToCart(product._id || product.id, quantity, selectedSize, selectedColor);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to post a review');
      return;
    }
    setSubmittingReview(true);
    try {
      await API.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewText });
      toast.success('Review submitted!');
      setReviewText('');
      setReviewRating(5);
      const { data } = await API.get(`/products/${id}`);
      setProduct(data.data);
      setReviews(data.reviews || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader fullPage />;
  if (error) return <div className="min-h-screen bg-surface-950 flex items-center justify-center"><Message variant="error">{error}</Message></div>;
  if (!product) return <div className="min-h-screen bg-surface-950 flex items-center justify-center"><Message variant="info">Product not found</Message></div>;

  const images = product.images?.length ? product.images : [product.image || placeholderImg(600, 600, 'No Image')];
  const discount = product.discountPrice ? getDiscountPercentage(product.price, product.discountPrice) : 0;
  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-surface-400 mb-8">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-surface-900 border border-surface-800 mb-4">
              <img src={images[selectedImage]} alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = placeholderImg(600, 600, 'No Image'); }} />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === idx ? 'border-brand-600' : 'border-surface-700 hover:border-surface-400'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = placeholderImg(100, 100, 'N'); }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.brand && (
              <span className="text-sm text-brand-400 font-medium uppercase">{product.brand}</span>
            )}
            <h1 className="text-2xl lg:text-3xl font-bold text-white mt-1">{product.name}</h1>
            <div className="flex items-center gap-2 mt-3">
              <StarRating rating={product.rating || 0} size="lg" />
              <span className="text-sm text-surface-400">({product.numReviews || 0} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mt-4">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-brand-400">{formatPrice(product.discountPrice)}</span>
                  <span className="text-xl text-surface-400 line-through">{formatPrice(product.price)}</span>
                  <span className="text-sm bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-xl">-{discount}%</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-white">{formatPrice(product.price)}</span>
              )}
            </div>

            <div className="mt-6 space-y-4">
              {product.sizes?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-surface-300 mb-2">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button key={size} onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 text-sm rounded-xl border transition-all ${selectedSize === size ? 'bg-brand-600 border-brand-500 text-white' : 'border-surface-700 text-surface-400 hover:border-surface-400'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.color?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-surface-300 mb-2">Color</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.color.map((color) => (
                      <button key={color} onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 text-sm rounded-xl border transition-all ${selectedColor === color ? 'bg-brand-600 border-brand-500 text-white' : 'border-surface-700 text-surface-400 hover:border-surface-400'}`}>
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-surface-300 mb-2">Quantity</h4>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center border border-surface-700 rounded-xl text-surface-400 hover:text-white hover:border-surface-400 transition-all">
                    <HiOutlineMinus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-medium text-white w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center border border-surface-700 rounded-xl text-surface-400 hover:text-white hover:border-surface-400 transition-all">
                    <HiOutlinePlus className="w-4 h-4" />
                  </button>
                    <span className="text-sm text-surface-500">{product.stock} available</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button onClick={handleAddToCart} disabled={!inStock}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                <HiOutlineShoppingCart className="w-5 h-5" />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="p-3 border border-surface-700 hover:border-brand-600/50 rounded-xl text-surface-400 hover:text-brand-400 transition-all">
                <HiOutlineHeart className="w-5 h-5" />
              </button>
            </div>

            {!inStock && (
              <p className="mt-2 text-sm text-red-400">This product is currently out of stock.</p>
            )}
            {inStock && product.stock <= 5 && (
              <p className="mt-2 text-sm text-orange-400">Only {product.stock} left in stock!</p>
            )}
          </div>
        </div>

        <div className="mb-12">
          <div className="flex border-b border-surface-700">
            {['description', 'reviews'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${activeTab === tab ? 'text-brand-400 border-brand-500' : 'text-surface-400 border-transparent hover:text-white'}`}>
                {tab === 'description' ? 'Description' : `Reviews (${product.numReviews || 0})`}
              </button>
            ))}
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <div className="text-surface-300 leading-relaxed whitespace-pre-line">
                {product.description || 'No description available.'}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review, idx) => (
                    <div key={idx} className="bg-surface-900 rounded-2xl p-6 border border-surface-800">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-sm font-medium text-white">
                            {review.name?.charAt(0) || 'U'}
                          </div>
                          <span className="text-sm font-medium text-white">{review.name || 'Anonymous'}</span>
                        </div>
                        <span className="text-xs text-surface-500">{getDate(review.createdAt)}</span>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                      <p className="text-sm text-surface-400 mt-2">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-surface-400">No reviews yet.</p>
                )}

                {isAuthenticated && (
                  <form onSubmit={handleReviewSubmit} className="bg-surface-900 rounded-2xl p-6 border border-surface-800">
                    <h4 className="text-lg font-semibold text-white mb-4">Write a Review</h4>
                    <div className="mb-4">
                      <label className="text-sm text-surface-300 block mb-2">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setReviewRating(star)}>
                            <StarRating rating={star >= reviewRating ? star : 0} size="lg" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-sm text-surface-300 block mb-2">Your Review</label>
                      <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} required rows={4}
                        className="input-field w-full resize-none"
                        placeholder="Share your thoughts about this product..." />
                    </div>
                    <button type="submit" disabled={submittingReview || !reviewText.trim()}
                      className="bg-brand-600 hover:bg-brand-500 disabled:bg-surface-700 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl text-sm font-medium transition-all">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
