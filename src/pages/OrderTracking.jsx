import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { formatPrice, getDate, placeholderImg } from '../utils/helpers';
import { HiOutlineCheckCircle, HiOutlineClock, HiOutlineTruck, HiOutlineCube, HiOutlineHome, HiOutlineXCircle, HiOutlineCreditCard } from 'react-icons/hi';
import toast from 'react-hot-toast';

const statusSteps = [
  { key: 'pending', label: 'Pending', icon: HiOutlineClock },
  { key: 'confirmed', label: 'Confirmed', icon: HiOutlineCheckCircle },
  { key: 'processing', label: 'Processing', icon: HiOutlineCube },
  { key: 'shipped', label: 'Shipped', icon: HiOutlineTruck },
  { key: 'delivered', label: 'Delivered', icon: HiOutlineHome },
];

const PAYMENT_METHODS = {
  stripe: { label: 'Credit / Debit Card', color: 'text-blue-400' },
  mobile_money: { label: 'Mobile Money', color: 'text-emerald-400' },
  paypal: { label: 'PayPal', color: 'text-indigo-400' },
  cod: { label: 'Cash on Delivery', color: 'text-amber-400' },
};

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data.data);
      } catch {
        setError('Order not found');
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchOrder();
    else setLoading(false);
  }, [id, isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-surface-950 flex items-center justify-center"><Message variant="info">Please login to view order details.</Message></div>;
  }

  if (loading) return <Loader fullPage />;
  if (error) return <div className="min-h-screen bg-surface-950 flex items-center justify-center"><Message variant="error">{error}</Message></div>;
  const handlePayNow = async () => {
    setPaying(true);
    try {
      const { data } = await API.post('/payments/create-intent', { orderId: order._id || order.id });
      if (data.mode === 'demo') {
        await API.post('/payments/confirm-stripe', {
          orderId: order._id || order.id,
          paymentIntentId: 'demo_' + Date.now(),
        });
        toast.success('Payment successful!');
        const { data: updated } = await API.get(`/orders/${order._id || order.id}`);
        setOrder(updated.data);
      } else {
        navigate(`/checkout?pay=${order._id || order.id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (!order) return <div className="min-h-screen bg-surface-950 flex items-center justify-center"><Message variant="info">Order not found</Message></div>;

  const currentStatusIdx = statusSteps.findIndex((s) => s.key === (order.orderStatus || 'pending'));

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 text-sm text-surface-400 mb-8">
          <Link to="/orders" className="hover:text-white transition-colors">Orders</Link>
          <span>/</span>
          <span className="text-white">Order #{(order._id || order.id).toString().slice(-8).toUpperCase()}</span>
        </div>

        <div className="card p-6 mb-6">
          <div className="card-header">
            <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
            <h1 className="text-xl font-bold text-white">Order Status</h1>
          </div>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx <= currentStatusIdx;
              const isCurrent = idx === currentStatusIdx;
              const isCancelled = order.orderStatus === 'cancelled';
              return (
                <div key={step.key} className="flex flex-col items-center flex-1">
                  <div className="relative flex items-center justify-center w-full">
                    {idx > 0 && (
                      <div className={`absolute right-1/2 top-1/2 w-full h-0.5 -translate-y-1/2 ${isCompleted && !isCancelled ? 'bg-brand-600' : 'bg-surface-700'}`} />
                    )}
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${isCancelled ? 'bg-red-500/10 border-2 border-red-500' : isCompleted ? 'bg-brand-600' : 'bg-surface-800 border-2 border-surface-700'}`}>
                      <Icon className={`w-5 h-5 ${isCancelled ? 'text-red-400' : isCompleted ? 'text-white' : 'text-surface-500'}`} />
                    </div>
                  </div>
                  <span className={`text-xs mt-2 ${isCancelled ? 'text-red-400' : isCurrent ? 'text-brand-400 font-medium' : isCompleted ? 'text-surface-300' : 'text-surface-600'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          {order.orderStatus === 'cancelled' && (
            <div className="mt-4 flex items-center gap-2 text-red-400 bg-red-500/10 rounded-lg px-4 py-2 border border-red-500/20">
              <HiOutlineXCircle className="w-5 h-5" />
              <span className="text-sm">This order has been cancelled.</span>
            </div>
          )}
        </div>

        {!order.isPaid && order.orderStatus !== 'cancelled' && (
          <div className="card p-6 mb-6 border-2 border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="card-header mb-2">
                  <HiOutlineCreditCard className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-semibold text-white">Payment Required</h2>
                </div>
                <p className="text-sm text-surface-400">
                  This order has not been paid yet. Complete your payment to confirm the order.
                </p>
              </div>
              <button onClick={handlePayNow} disabled={paying}
                className="btn-primary whitespace-nowrap px-6 py-2.5 font-medium disabled:opacity-50">
                {paying ? 'Processing...' : `Pay Now — ${formatPrice(order.totalPrice || order.total || 0)}`}
              </button>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <div className="card p-6">
            <div className="card-header">
              <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
              <h2 className="text-lg font-semibold text-white">Order Details</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-surface-400"><span>Order ID</span><span className="text-white font-mono">#{(order._id || order.id).toString().slice(-8).toUpperCase()}</span></div>
              <div className="flex justify-between text-surface-400"><span>Date</span><span className="text-white">{getDate(order.createdAt)}</span></div>
              <div className="flex justify-between text-surface-400"><span>Status</span><span className="capitalize text-white">{order.orderStatus}</span></div>
              <div className="flex justify-between text-surface-400"><span>Payment</span><span className={`capitalize ${PAYMENT_METHODS[order.paymentMethod]?.color || 'text-white'}`}>{PAYMENT_METHODS[order.paymentMethod]?.label || order.paymentMethod?.replace('_', ' ') || 'N/A'}</span></div>
              <div className="flex justify-between text-surface-400"><span>Payment Status</span><span className={`capitalize ${order.isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>{order.isPaid ? 'Paid' : 'Pending'}</span></div>
              {order.paidAt && (
                <div className="flex justify-between text-surface-400"><span>Paid At</span><span className="text-white">{getDate(order.paidAt)}</span></div>
              )}
              {order.paymentResult?.id && (
                <div className="flex justify-between text-surface-400"><span>Transaction ID</span><span className="text-white font-mono text-xs">{order.paymentResult.id}</span></div>
              )}
            </div>
          </div>
          <div className="card p-6">
            <div className="card-header">
              <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
              <h2 className="text-lg font-semibold text-white">Shipping Address</h2>
            </div>
            {order.shippingAddress ? (
              <div className="text-sm text-surface-400 space-y-1">
                <p className="text-white font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                <p>{order.shippingAddress.country}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-surface-500">Not provided</p>
            )}
          </div>
        </div>

        <div className="card p-6 mb-6">
          <div className="card-header">
            <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
            <h2 className="text-lg font-semibold text-white">Order Items</h2>
          </div>
          <div className="space-y-4">
            {(order.orderItems || order.items || []).map((item, idx) => {
              const imgUrl = item.image || item.images?.[0] || placeholderImg(80, 80, 'N');
              return (
                <div key={idx} className="flex items-center gap-4 pb-4 border-b border-surface-700 last:border-0 last:pb-0">
                  <img src={imgUrl} alt={item.name} className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => { e.target.src = placeholderImg(80, 80, 'N'); }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.name}</p>
                    <p className="text-xs text-surface-400">Qty: {item.qty} x {formatPrice(item.price)}</p>
                    {item.size && <p className="text-xs text-surface-500">Size: {item.size}</p>}
                    {item.color && <p className="text-xs text-surface-500">Color: {item.color}</p>}
                  </div>
                  <p className="text-sm font-medium text-brand-400">{formatPrice(item.price * (item.qty || 1))}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <div className="card-header">
            <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
            <h2 className="text-lg font-semibold text-white">Order Summary</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-surface-400"><span>Items Total</span><span>{formatPrice(order.itemsPrice || 0)}</span></div>
            <div className="flex justify-between text-surface-400"><span>Shipping</span><span>{order.shippingPrice === 0 ? <span className="text-emerald-400">Free</span> : formatPrice(order.shippingPrice || 0)}</span></div>
            <div className="flex justify-between text-surface-400"><span>Tax</span><span>{formatPrice(order.taxPrice || 0)}</span></div>
            <div className="border-t border-surface-700 pt-3 flex justify-between text-white font-semibold text-base">
              <span>Total</span><span>{formatPrice(order.totalPrice || order.total || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
