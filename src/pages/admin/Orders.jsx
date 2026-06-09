import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import { formatPrice, getDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.orderStatus = statusFilter;
      const { data: response } = await API.get('/orders/all', { params });
      setOrders(response.data || []);
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-800 border-surface-700 text-surface-300 rounded-lg px-4 py-2 text-sm input-field">
          <option value="">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? <Loader /> : error ? <Message variant="error">{error}</Message> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-700 bg-surface-800">
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Total</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Payment</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-surface-400">No orders found</td></tr>
                ) : orders.map((order) => (
                  <tr key={order._id || order.id} className="border-b border-surface-700/50 hover:bg-surface-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-mono">#{(order._id || order.id).toString().slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-sm text-surface-400">{order.user?.name || order.shippingAddress?.fullName || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-surface-400">{getDate(order.createdAt)}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-brand-400">{formatPrice(order.totalPrice || order.total || 0)}</td>
                    <td className="px-6 py-4">
                      <select value={order.orderStatus || 'pending'} onChange={(e) => handleStatusUpdate(order._id || order.id, e.target.value)}
                        className="bg-surface-800 border-surface-700 text-surface-300 rounded px-2 py-1 text-xs input-field">
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium ${order.isPaid ? 'text-green-400' : 'text-yellow-400'}`}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/orders/${order._id || order.id}`}
                        className="text-brand-400 hover:text-brand-500 text-sm transition-colors">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
