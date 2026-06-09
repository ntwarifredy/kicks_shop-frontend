import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { formatPrice, placeholderImg } from '../utils/helpers';
import { HiOutlineTrash, HiOutlineMinus, HiOutlinePlus, HiOutlineArrowLeft } from 'react-icons/hi';

const Cart = () => {
  const { cartItems, loading, removeFromCart, updateCartItem } = useContext(CartContext);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.discountPrice || item.product?.price || item.price || 0;
    return sum + price * (item.qty || 1);
  }, 0);

  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (loading) return <Loader fullPage />;

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <Message variant="info">Your cart is empty.</Message>
            <Link to="/shop" className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 mt-4 transition-colors">
              <HiOutlineArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const product = item.product || {};
                const price = product.discountPrice || product.price || item.price || 0;
                const imageUrl = product.images?.[0] || product.image || placeholderImg(100, 100, 'N');
                const itemSubtotal = price * (item.qty || 1);

                return (
                  <div key={item._id || item.id} className="bg-surface-900 rounded-2xl border border-surface-800 p-4 flex gap-4">
                    <Link to={`/product/${product._id || product.id}`} className="w-24 h-24 flex-shrink-0">
                      <img src={imageUrl} alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => { e.target.src = placeholderImg(100, 100, 'N'); }} />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${product._id || product.id}`}
                        className="text-white font-medium hover:text-brand-400 transition-colors truncate block">
                        {product.name}
                      </Link>
                      <p className="text-sm text-surface-400 mt-1">{formatPrice(price)}</p>
                      {item.size && <p className="text-xs text-surface-500">Size: {item.size}</p>}
                      {item.color && <p className="text-xs text-surface-500">Color: {item.color}</p>}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateCartItem(product._id || item.productId, Math.max(1, item.qty - 1))}
                            className="w-8 h-8 flex items-center justify-center border border-surface-700 rounded-xl text-surface-400 hover:text-white transition-all">
                            <HiOutlineMinus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium text-white w-6 text-center">{item.qty}</span>
                          <button onClick={() => updateCartItem(product._id || item.productId, (item.qty || 1) + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-surface-700 rounded-xl text-surface-400 hover:text-white transition-all">
                            <HiOutlinePlus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-brand-400">{formatPrice(itemSubtotal)}</span>
                          <button onClick={() => removeFromCart(product._id || item.productId || item.product)}
                            className="text-surface-500 hover:text-red-400 transition-colors">
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card p-6 sticky top-24">
              <div className="card-header">
                <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
                <h2 className="text-lg font-semibold text-white">Order Summary</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-surface-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-surface-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-emerald-400">Free</span> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-surface-400">
                  <span>Tax (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-surface-700 pt-3 flex justify-between text-white font-semibold text-base">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Link to="/checkout"
                className="block mt-6 w-full btn-primary text-center py-3 font-medium">
                Proceed to Checkout
              </Link>
              <Link to="/shop"
                className="flex items-center justify-center gap-2 mt-3 text-surface-400 hover:text-white text-sm transition-colors">
                <HiOutlineArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
