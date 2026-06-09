import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import { getDate } from '../../utils/helpers';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data: response } = await API.get('/auth/users');
        setCustomers(response.data || []);
      } catch {
        setError('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Customers</h1>
      {loading ? <Loader /> : error ? <Message variant="error">{error}</Message> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-700 bg-surface-800">
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Phone</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Orders</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Joined</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-surface-400">No customers found</td></tr>
                ) : customers.map((customer) => (
                  <tr key={customer._id || customer.id} className="border-b border-surface-700/50 hover:bg-surface-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white text-xs font-bold">
                          {customer.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm text-white">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-surface-400">{customer.email}</td>
                    <td className="px-6 py-4 text-sm text-surface-400">{customer.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-surface-400">{customer.orderCount || customer.orders?.length || 0}</td>
                    <td className="px-6 py-4 text-sm text-surface-400">{getDate(customer.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${customer.role === 'admin' ? 'bg-brand-600/20 text-brand-400' : 'bg-surface-800 text-surface-300'}`}>
                        {customer.role || 'user'}
                      </span>
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

export default AdminCustomers;
