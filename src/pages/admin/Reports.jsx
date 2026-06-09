import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import { formatPrice } from '../../utils/helpers';

const AdminReports = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [salesSummary, setSalesSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data: response } = await API.get('/admin/reports');
        setBestSellers(response.data?.bestSellingProducts || []);
        setLowStock(response.data?.lowStockItems || []);
        setSalesSummary(response.data?.salesSummary || null);
      } catch {
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Message variant="error">{error}</Message>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Reports</h1>

      {salesSummary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 border-l-4 border-l-brand-600">
            <p className="text-sm text-surface-400">Total Revenue</p>
            <p className="text-2xl font-bold text-white mt-1">{formatPrice(salesSummary.totalRevenue || 0)}</p>
          </div>
          <div className="card p-6 border-l-4 border-l-brand-600">
            <p className="text-sm text-surface-400">Total Orders</p>
            <p className="text-2xl font-bold text-white mt-1">{salesSummary.totalOrders || 0}</p>
          </div>
          <div className="card p-6 border-l-4 border-l-brand-600">
            <p className="text-sm text-surface-400">Avg. Order Value</p>
            <p className="text-2xl font-bold text-white mt-1">{formatPrice(salesSummary.averageOrderValue || 0)}</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-800 flex items-center gap-3">
            <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
            <h2 className="text-lg font-semibold text-white">Best Selling Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-700 bg-surface-800">
                  <th className="text-left px-6 py-3 text-sm font-medium text-surface-300 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-surface-300 uppercase tracking-wider">Sold</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-surface-300 uppercase tracking-wider">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {bestSellers.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-surface-400">No data</td></tr>
                ) : bestSellers.map((item, idx) => (
                  <tr key={idx} className="border-b border-surface-700/50">
                    <td className="px-6 py-3 text-sm text-white">{item.name || item.product?.name || 'Unknown'}</td>
                    <td className="px-6 py-3 text-sm text-surface-400">{item.sold || item.quantity || 0}</td>
                    <td className="px-6 py-3 text-sm font-semibold text-brand-400">{formatPrice(item.revenue || (item.price * (item.quantity || 0)))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-800 flex items-center gap-3">
            <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
            <h2 className="text-lg font-semibold text-white">Low Stock Alerts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-700 bg-surface-800">
                  <th className="text-left px-6 py-3 text-sm font-medium text-surface-300 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-surface-300 uppercase tracking-wider">Stock</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-surface-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-surface-400">All products well stocked</td></tr>
                ) : lowStock.map((item, idx) => (
                  <tr key={idx} className="border-b border-surface-700/50">
                    <td className="px-6 py-3 text-sm text-white">{item.name || item.product?.name || 'Unknown'}</td>
                    <td className="px-6 py-3 text-sm text-surface-400">{item.countInStock || item.stock || 0}</td>
                    <td className="px-6 py-3">
                      <span className="badge bg-red-900/50 text-red-300">
                        {(item.countInStock || item.stock || 0) <= 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
