import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { formatPrice, getDate } from '../utils/helpers';

const statusColors = {
  pending: 'badge bg-amber-500/10 text-amber-400 border-amber-500/20',
  confirmed: 'badge bg-brand-500/10 text-brand-300 border-brand-500/20',
  processing: 'badge bg-brand-500/10 text-brand-300 border-brand-500/20',
  shipped: 'badge bg-brand-500/10 text-brand-300 border-brand-500/20',
  delivered: 'badge bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled: 'badge bg-red-500/10 text-red-400 border-red-500/20',
};

const paymentColors = {
  pending: 'text-amber-400',
  paid: 'text-emerald-400',
  failed: 'text-red-400',
  refunded: 'text-brand-400',
};

const OrderHistory = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders');
        setOrders(data.data || []);
      } catch {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchOrders();
    else setLoading(false);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-surface-950 flex items-center justify-center"><Message variant="info">Please login to view orders.</Message></div>;
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Order History</h1>
        {loading ? <Loader /> : error ? <Message variant="error">{error}</Message> : orders.length === 0 ? (
          <Message variant="info">No orders yet. <Link to="/shop" className="text-brand-400">Start shopping</Link></Message>
        ) : (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-700">
                    <th className="text-left px-6 py-4 text-sm font-medium text-surface-400">Order ID</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-surface-400">Date</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-surface-400">Items</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-surface-400">Total</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-surface-400">Status</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-surface-400">Payment</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-surface-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const orderId = order._id || order.id;
                    return (
                      <tr key={orderId} className="border-b border-surface-700/50 hover:bg-surface-800/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-brand-400 font-mono">#{orderId.toString().slice(-8).toUpperCase()}</td>
                        <td className="px-6 py-4 text-sm text-surface-400">{getDate(order.createdAt)}</td>
                        <td className="px-6 py-4 text-sm text-surface-400">{order.orderItems?.length || order.items?.length || 0}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-brand-400">{formatPrice(order.totalPrice || order.total || 0)}</td>
                        <td className="px-6 py-4">
                          <span className={statusColors[order.orderStatus] || statusColors.pending}>
                            {(order.orderStatus || 'pending').charAt(0).toUpperCase() + (order.orderStatus || 'pending').slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-medium ${order.isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {order.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/orders/${orderId}`}
                            className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
