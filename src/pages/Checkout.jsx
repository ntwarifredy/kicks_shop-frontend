import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import useAuth from '../hooks/useAuth';
import Message from '../components/common/Message';
import Loader from '../components/common/Loader';
import { formatPrice, placeholderImg } from '../utils/helpers';
import toast from 'react-hot-toast';
import API from '../api/axios';

const PAYMENT_METHODS = [
  {
    value: 'stripe',
    label: 'Credit / Debit Card',
    description: 'Pay securely with Visa, Mastercard, or other cards',
    icon: '💳',
  },
  {
    value: 'mobile_money',
    label: 'Mobile Money',
    description: 'MTN Mobile Money or Airtel Money',
    icon: '📱',
  },
  {
    value: 'paypal',
    label: 'PayPal',
    description: 'Fast and secure online payments',
    icon: '🅿️',
  },
  {
    value: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: '💵',
  },
];

const MOBILE_MONEY_PROVIDERS = [
  { value: 'mtn', label: 'MTN Mobile Money' },
  { value: 'airtel', label: 'Airtel Money' },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useContext(CartContext);
  const { isAuthenticated, user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const [mobileProvider, setMobileProvider] = useState('mtn');
  const [mobilePhone, setMobilePhone] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [paypalOrderId, setPaypalOrderId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [stripeDemo, setStripeDemo] = useState(false);

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const p = item.product?.discountPrice || item.product?.price || item.price || 0;
    return sum + p * (item.qty || 1);
  }, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const placeOrder = async () => {
    setSubmitting(true);
    try {
      const orderItems = cartItems.map((item) => ({
        product: item.product?._id || item.product?.id,
        name: item.product?.name,
        image: item.product?.images?.[0] || item.product?.image,
        price: item.product?.discountPrice || item.product?.price || item.price,
        qty: item.qty,
        size: item.size,
        color: item.color,
      }));
      const { data } = await API.post('/orders', {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      });
      const placedOrderId = data.data?._id || data.data?.id;
      setOrderId(placedOrderId);

      if (paymentMethod === 'cod') {
        toast.success('Order placed successfully! Pay on delivery.');
        await clearCart();
        navigate(`/orders/${placedOrderId}`);
        return;
      }

      await clearCart();

      if (paymentMethod === 'stripe') {
        await handleStripePayment(placedOrderId);
      } else if (paymentMethod === 'mobile_money') {
        setStep(4);
      } else if (paymentMethod === 'paypal') {
        await handlePayPalInit(placedOrderId);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStripePayment = async (oid) => {
    setPaymentProcessing(true);
    try {
      const { data } = await API.post('/payments/create-intent', { orderId: oid });
      if (data.mode === 'demo') {
        setStripeDemo(true);
        setStep(4);
      } else {
        setClientSecret(data.clientSecret);
        setStep(4);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initialize payment');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const confirmStripeDemo = async () => {
    setPaymentProcessing(true);
    try {
      await API.post('/payments/confirm-stripe', {
        orderId,
        paymentIntentId: 'demo_' + Date.now(),
      });
      toast.success('Payment successful!');
      navigate(`/orders/${orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleMobileMoneyInit = async () => {
    if (!mobilePhone) {
      toast.error('Please enter your mobile number');
      return;
    }
    if (!orderId) {
      toast.error('No order found. Please place the order again.');
      return;
    }
    setPaymentProcessing(true);
    try {
      const { data } = await API.post('/payments/mobile-money/initiate', {
        orderId,
        phoneNumber: mobilePhone,
        provider: mobileProvider,
      });
      setPaymentRef(data.reference);
      toast.success(data.message);
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;
      if (!err.response) {
        toast.error('Cannot reach the server. Make sure the backend is running and try again.');
      } else if (status === 401 || status === 403) {
        toast.error('Session expired. Please login again.');
      } else if (status === 404) {
        toast.error('Order not found. Please place the order again.');
      } else if (status === 400) {
        toast.error(msg || 'Invalid request. Check your details and try again.');
      } else {
        toast.error(msg || 'Failed to initiate payment. Please try again.');
      }
      console.error('[Payment Init Error]', { status, message: msg, error: err });
    } finally {
      setPaymentProcessing(false);
    }
  };

  const confirmMobileMoneyPayment = async () => {
    setPaymentProcessing(true);
    try {
      await API.post('/payments/mobile-money/confirm', {
        orderId,
        reference: paymentRef,
      });
      toast.success('Mobile money payment confirmed!');
      navigate(`/orders/${orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Confirmation failed');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handlePayPalInit = async (oid) => {
    setPaymentProcessing(true);
    try {
      const { data } = await API.post('/payments/paypal/initiate', { orderId: oid });
      setPaypalOrderId(data.paypalOrderId);
      toast.success(data.message);
      setStep(4);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate PayPal');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const confirmPayPalPayment = async () => {
    setPaymentProcessing(true);
    try {
      await API.post('/payments/paypal/confirm', {
        orderId,
        paypalOrderId,
      });
      toast.success('PayPal payment confirmed!');
      navigate(`/orders/${orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Confirmation failed');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const payLater = () => {
    navigate(`/orders/${orderId}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <Message variant="info">Please login to checkout.</Message>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderId) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <Message variant="info">Your cart is empty.</Message>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Checkout</h1>

        {!orderId && (
          <div className="flex items-center gap-2 mb-8">
            {['Shipping', 'Payment', 'Review'].map((label, idx) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= idx + 1 ? 'bg-brand-600 text-white' : 'bg-surface-700 text-surface-400'}`}>
                  {idx + 1}
                </div>
                <span className={`text-sm ${step >= idx + 1 ? 'text-white' : 'text-surface-500'}`}>{label}</span>
                {idx < 2 && <div className="w-12 h-px bg-surface-700" />}
              </div>
            ))}
          </div>
        )}

        {orderId && step === 4 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-surface-400 mb-4">
              <span>Order placed</span>
              <span className="text-surface-600">/</span>
              <span className="text-white font-medium">Payment</span>
            </div>
          </div>
        )}

        {step === 1 && !orderId && (
          <div className="card p-6">
            <div className="card-header">
              <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
              <h2 className="text-lg font-semibold text-white">Shipping Address</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm text-surface-300 block mb-1">Full Name</label>
                <input type="text" name="fullName" value={shippingAddress.fullName} onChange={handleAddressChange} required className="input-field w-full" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-surface-300 block mb-1">Address</label>
                <input type="text" name="address" value={shippingAddress.address} onChange={handleAddressChange} required className="input-field w-full" />
              </div>
              <div>
                <label className="text-sm text-surface-300 block mb-1">City</label>
                <input type="text" name="city" value={shippingAddress.city} onChange={handleAddressChange} required className="input-field w-full" />
              </div>
              <div>
                <label className="text-sm text-surface-300 block mb-1">State</label>
                <input type="text" name="state" value={shippingAddress.state} onChange={handleAddressChange} required className="input-field w-full" />
              </div>
              <div>
                <label className="text-sm text-surface-300 block mb-1">ZIP Code</label>
                <input type="text" name="zipCode" value={shippingAddress.zipCode} onChange={handleAddressChange} required className="input-field w-full" />
              </div>
              <div>
                <label className="text-sm text-surface-300 block mb-1">Country</label>
                <input type="text" name="country" value={shippingAddress.country} onChange={handleAddressChange} required className="input-field w-full" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-surface-300 block mb-1">Phone</label>
                <input type="tel" name="phone" value={shippingAddress.phone} onChange={handleAddressChange} required className="input-field w-full" />
              </div>
            </div>
            <button onClick={() => setStep(2)}
              disabled={!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city}
              className="btn-primary mt-6 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-2.5 font-medium">
              Continue to Payment
            </button>
          </div>
        )}

        {step === 2 && !orderId && (
          <div className="card p-6">
            <div className="card-header">
              <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
              <h2 className="text-lg font-semibold text-white">Payment Method</h2>
            </div>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <label key={method.value}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border ${paymentMethod === method.value ? 'border-brand-500/50 bg-brand-500/10' : 'border-surface-700 bg-surface-800 hover:bg-surface-700'}`}>
                  <input type="radio" name="payment" value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-brand-600 focus:ring-brand-500/40" />
                  <div>
                    <span className="text-white text-sm font-medium block">{method.label}</span>
                    <span className="text-surface-400 text-xs">{method.description}</span>
                  </div>
                </label>
              ))}
            </div>

            {paymentMethod === 'mobile_money' && (
              <div className="mt-4 p-4 bg-surface-800 rounded-xl space-y-3 border border-surface-700">
                <label className="text-sm text-surface-300 block mb-1">Select Provider</label>
                <div className="flex gap-3">
                  {MOBILE_MONEY_PROVIDERS.map((p) => (
                    <button key={p.value} type="button"
                      onClick={() => setMobileProvider(p.value)}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${mobileProvider === p.value ? 'bg-brand-600 text-white' : 'bg-surface-700 text-surface-300 hover:bg-surface-600'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-sm text-surface-300 block mb-1">Mobile Number</label>
                  <input type="tel" value={mobilePhone} onChange={(e) => setMobilePhone(e.target.value)}
                    placeholder="e.g. +256 7XX XXX XXX"
                    className="input-field w-full" />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="btn-secondary px-8 py-2.5 font-medium">Back</button>
              <button onClick={() => setStep(3)} className="btn-primary px-8 py-2.5 font-medium">Continue to Review</button>
            </div>
          </div>
        )}

        {step === 3 && !orderId && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="card-header">
                <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
                <h2 className="text-lg font-semibold text-white">Order Items</h2>
              </div>
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const product = item.product || {};
                  const price = product.discountPrice || product.price || item.price || 0;
                  return (
                    <div key={item._id || item.id} className="flex items-center gap-4">
                      <img src={product.images?.[0] || product.image || placeholderImg(60, 60, 'N')}
                        alt={product.name} className="w-14 h-14 object-cover rounded-lg"
                        onError={(e) => { e.target.src = placeholderImg(60, 60, 'N'); }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{product.name}</p>
                        <p className="text-xs text-surface-400">Qty: {item.qty} x {formatPrice(price)}</p>
                        {item.size && <p className="text-xs text-surface-500">Size: {item.size}</p>}
                      </div>
                      <p className="text-sm font-medium text-brand-400">{formatPrice(price * (item.qty || 1))}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card p-6">
              <div className="card-header">
                <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
                <h2 className="text-lg font-semibold text-white">Shipping Address</h2>
              </div>
              <p className="text-sm text-surface-400">{shippingAddress.fullName}</p>
              <p className="text-sm text-surface-400">{shippingAddress.address}</p>
              <p className="text-sm text-surface-400">{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
              <p className="text-sm text-surface-400">{shippingAddress.country}</p>
              <p className="text-sm text-surface-400">{shippingAddress.phone}</p>
            </div>

            <div className="card p-6">
              <div className="card-header">
                <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
                <h2 className="text-lg font-semibold text-white">Payment Method</h2>
              </div>
              <p className="text-sm text-surface-400 capitalize">
                {PAYMENT_METHODS.find((m) => m.value === paymentMethod)?.label || paymentMethod.replace('_', ' ')}
              </p>
              {paymentMethod === 'mobile_money' && (
                <p className="text-sm text-surface-500 mt-1">
                  {MOBILE_MONEY_PROVIDERS.find((p) => p.value === mobileProvider)?.label} — {mobilePhone}
                </p>
              )}
            </div>

            <div className="card p-6">
              <div className="card-header">
                <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
                <h2 className="text-lg font-semibold text-white">Order Summary</h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-surface-400"><span>Items</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-surface-400"><span>Shipping</span><span>{shipping === 0 ? <span className="text-emerald-400">Free</span> : formatPrice(shipping)}</span></div>
                <div className="flex justify-between text-surface-400"><span>Tax</span><span>{formatPrice(tax)}</span></div>
                <div className="border-t border-surface-700 pt-3 flex justify-between text-white font-semibold text-base">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary px-8 py-2.5 font-medium">Back</button>
              <button onClick={placeOrder} disabled={submitting || paymentProcessing}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 font-medium">
                {submitting || paymentProcessing ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
              </button>
            </div>
          </div>
        )}

        {step === 4 && orderId && (
          <div className="card p-6">
            <div className="card-header">
              <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
              <h2 className="text-lg font-semibold text-white">Complete Payment</h2>
            </div>

            {paymentMethod === 'stripe' && (
              <div className="space-y-4">
                <div className="p-4 bg-surface-800 rounded-xl">
                  <p className="text-white text-sm font-medium mb-2">Order #{orderId.toString().slice(-8).toUpperCase()}</p>
                  <p className="text-2xl font-bold text-brand-400">{formatPrice(total)}</p>
                </div>

                {stripeDemo ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                      <p className="text-amber-400 text-sm font-medium">Demo Mode</p>
                      <p className="text-surface-400 text-xs mt-1">Stripe is not configured with live keys. Click below to simulate a successful payment.</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={payLater} disabled={paymentProcessing}
                        className="btn-secondary flex-1 py-2.5 font-medium">Pay Later</button>
                      <button onClick={confirmStripeDemo} disabled={paymentProcessing}
                        className="btn-primary flex-1 py-2.5 font-medium">
                        {paymentProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-surface-400 text-sm">Stripe payment form would render here with client secret.</p>
                    <div className="p-4 bg-surface-800 rounded-xl border border-surface-700">
                      <p className="text-surface-400 text-xs font-mono break-all">Client Secret: {clientSecret?.slice(0, 30)}...</p>
                    </div>
                    <button onClick={confirmStripeDemo} disabled={paymentProcessing}
                      className="btn-primary w-full py-2.5 font-medium">
                      {paymentProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
                    </button>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'mobile_money' && (
              <div className="space-y-4">
                <div className="p-4 bg-surface-800 rounded-xl">
                  <p className="text-white text-sm font-medium mb-2">Order #{orderId.toString().slice(-8).toUpperCase()}</p>
                  <p className="text-2xl font-bold text-brand-400">{formatPrice(total)}</p>
                </div>

                {!paymentRef ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-surface-800 rounded-xl space-y-3 border border-surface-700">
                      <label className="text-sm text-surface-300 block mb-1">Select Provider</label>
                      <div className="flex gap-3">
                        {MOBILE_MONEY_PROVIDERS.map((p) => (
                          <button key={p.value} type="button"
                            onClick={() => setMobileProvider(p.value)}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${mobileProvider === p.value ? 'bg-brand-600 text-white' : 'bg-surface-700 text-surface-300 hover:bg-surface-600'}`}>
                            {p.label}
                          </button>
                        ))}
                      </div>
                      <div>
                        <label className="text-sm text-surface-300 block mb-1">Mobile Number</label>
                        <input type="tel" value={mobilePhone} onChange={(e) => setMobilePhone(e.target.value)}
                          placeholder="e.g. +256 7XX XXX XXX" className="input-field w-full" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={payLater} className="btn-secondary flex-1 py-2.5 font-medium">Pay Later</button>
                      <button onClick={handleMobileMoneyInit} disabled={paymentProcessing || !mobilePhone}
                        className="btn-primary flex-1 py-2.5 font-medium disabled:opacity-50">
                        {paymentProcessing ? 'Initiating...' : 'Initiate Payment'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <p className="text-emerald-400 text-sm font-medium">Payment Initiated</p>
                      <p className="text-surface-300 text-sm mt-1">Reference: <span className="font-mono text-white">{paymentRef}</span></p>
                      <p className="text-surface-400 text-xs mt-2">Check your phone and enter your Mobile Money PIN to authorize the payment. Then click confirm below.</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={payLater} className="btn-secondary flex-1 py-2.5 font-medium">Pay Later</button>
                      <button onClick={confirmMobileMoneyPayment} disabled={paymentProcessing}
                        className="btn-primary flex-1 py-2.5 font-medium">
                        {paymentProcessing ? 'Confirming...' : 'Confirm Payment'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="space-y-4">
                <div className="p-4 bg-surface-800 rounded-xl">
                  <p className="text-white text-sm font-medium mb-2">Order #{orderId.toString().slice(-8).toUpperCase()}</p>
                  <p className="text-2xl font-bold text-brand-400">{formatPrice(total)}</p>
                </div>

                {!paypalOrderId ? (
                  <div className="flex gap-3">
                    <button onClick={payLater} className="btn-secondary flex-1 py-2.5 font-medium">Pay Later</button>
                    <button onClick={() => handlePayPalInit(orderId)} disabled={paymentProcessing}
                      className="btn-primary flex-1 py-2.5 font-medium">
                      {paymentProcessing ? 'Initiating...' : 'Pay with PayPal'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-surface-800 border border-surface-700 rounded-xl">
                      <p className="text-surface-300 text-sm">PayPal Order ID: <span className="font-mono text-white">{paypalOrderId}</span></p>
                      <p className="text-surface-400 text-xs mt-2">Click confirm once you&apos;ve completed payment via PayPal.</p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={payLater} className="btn-secondary flex-1 py-2.5 font-medium">Pay Later</button>
                      <button onClick={confirmPayPalPayment} disabled={paymentProcessing}
                        className="btn-primary flex-1 py-2.5 font-medium">
                        {paymentProcessing ? 'Confirming...' : 'Confirm PayPal Payment'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
