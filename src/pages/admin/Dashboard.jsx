import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import { formatPrice, getDate } from '../../utils/helpers';
import { HiOutlineCurrencyDollar, HiOutlineClipboardList, HiOutlineCollection, HiOutlineUsers } from 'react-icons/hi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await API.get('/admin/stats');
        setStats(response.data);
        setRecentOrders(response.data?.recentOrders || []);
      } catch {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Message variant="error">{error}</Message>;

  const statCards = [
    { label: 'Total Sales', value: stats?.totalSales ? formatPrice(stats.totalSales) : '$0', icon: HiOutlineCurrencyDollar, color: 'from-green-500 to-emerald-700' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: HiOutlineClipboardList, color: 'from-blue-500 to-indigo-700' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: HiOutlineCollection, color: 'from-orange-500 to-red-700' },
    { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: HiOutlineUsers, color: 'from-purple-500 to-pink-700' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card p-6 relative overflow-hidden border-l-4 border-l-brand-600 hover:border-surface-600 transition-all">
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full`} />
              <Icon className="w-8 h-8 text-brand-400 mb-3" />
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-sm text-surface-400 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <div className="card-header">
            <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
            <h2 className="text-lg font-semibold text-white">Sales Overview</h2>
          </div>
          <div className="h-64 flex items-center justify-center text-surface-400 border-2 border-dashed border-surface-700 rounded-lg">
            <p className="text-sm">Sales Chart Placeholder</p>
          </div>
        </div>
        <div className="card p-6">
          <div className="card-header">
            <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
            <h2 className="text-lg font-semibold text-white">Orders Overview</h2>
          </div>
          <div className="h-64 flex items-center justify-center text-surface-400 border-2 border-dashed border-surface-700 rounded-lg">
            <p className="text-sm">Orders Chart Placeholder</p>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-800 flex items-center gap-3">
          <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-brand-400 hover:text-brand-500 ml-auto">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-700 bg-surface-800">
                <th className="text-left px-6 py-3 text-sm font-medium text-surface-300 uppercase tracking-wider">Order ID</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-surface-300 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-surface-300 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-surface-300 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-surface-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-surface-400">No orders yet</td></tr>
              ) : recentOrders.map((order) => (
                <tr key={order._id || order.id} className="border-b border-surface-700/50 hover:bg-surface-800/50">
                  <td className="px-6 py-4 text-sm text-white font-mono">#{(order._id || order.id).toString().slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 text-sm text-surface-400">{order.user?.name || order.shippingAddress?.fullName || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-surface-400">{getDate(order.createdAt)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-brand-400">{formatPrice(order.totalPrice || order.total || 0)}</td>
                  <td className="px-6 py-4">
                    <span className={`badge capitalize ${order.orderStatus === 'delivered' ? 'bg-green-900 text-green-300' : order.orderStatus === 'shipped' ? 'bg-blue-900 text-blue-300' : order.orderStatus === 'processing' ? 'bg-yellow-900 text-yellow-300' : 'bg-surface-700 text-surface-300'}`}>
                      {order.orderStatus || 'pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
