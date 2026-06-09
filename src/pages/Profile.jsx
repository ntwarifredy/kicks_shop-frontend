import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import API from '../api/axios';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { formatPrice, getDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { HiOutlineCamera } from 'react-icons/hi';

const Profile = () => {
  const { user, isAuthenticated, updateProfile, loadUser } = useAuth();
  const fileInputRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [uploading, setUploading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: response } = await API.get('/orders');
        setOrders(response.data || []);
      } catch {} finally { setLoading(false); }
    };
    if (isAuthenticated) fetchOrders();
    else setLoading(false);
  }, [isAuthenticated]);

  const handleSave = async () => {
    try {
      await updateProfile({ name, email, phone });
      setEditing(false);
    } catch {}
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data: response } = await API.put('/auth/avatar', formData);
      await loadUser();
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <Message variant="info">Please login to view your profile.</Message>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">My Profile</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="card p-6 h-fit">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 group disabled:opacity-50">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-xl font-bold text-white shadow-glow">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <HiOutlineCamera className="w-5 h-5 text-white" />
                </div>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              <div>
                <h2 className="text-lg font-semibold text-white">{user?.name}</h2>
                <p className="text-sm text-surface-400">{user?.email}</p>
              </div>
            </div>
            {!editing ? (
              <div className="space-y-3">
                <div><span className="text-sm text-surface-400">Name:</span><p className="text-white">{user?.name}</p></div>
                <div><span className="text-sm text-surface-400">Email:</span><p className="text-white">{user?.email}</p></div>
                <div><span className="text-sm text-surface-400">Phone:</span><p className="text-white">{user?.phone || 'Not set'}</p></div>
                <div><span className="text-sm text-surface-400">Member since:</span><p className="text-white">{getDate(user?.createdAt)}</p></div>
                <button onClick={() => setEditing(true)}
                  className="btn-primary mt-4">
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-surface-300 block mb-1">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className="input-field w-full" />
                </div>
                <div>
                  <label className="text-sm text-surface-300 block mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="input-field w-full" />
                </div>
                <div>
                  <label className="text-sm text-surface-300 block mb-1">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="input-field w-full" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave}
                    className="btn-primary">Save</button>
                  <button onClick={() => setEditing(false)}
                    className="btn-secondary">Cancel</button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="card-header">
                <span className="w-1 h-5 bg-brand-500 rounded-full flex-shrink-0" />
                <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
              </div>
            {loading ? <Loader /> : orders.length === 0 ? (
              <Message variant="info">No orders yet. <Link to="/shop" className="text-brand-400">Start shopping</Link></Message>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <Link key={order._id || order.id} to={`/orders/${order._id || order.id}`}
                    className="block bg-surface-800/50 border border-surface-700 rounded-xl p-4 hover:border-surface-600 hover:bg-surface-800 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">Order #{(order._id || order.id).toString().slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-surface-400 mt-1">{getDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-brand-400">{formatPrice(order.totalPrice || order.total)}</p>
                        <span className={`badge ${order.orderStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : order.orderStatus === 'shipped' ? 'bg-brand-500/10 text-brand-300 border-brand-500/20' : order.orderStatus === 'processing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}`}>
                          {order.orderStatus || 'Pending'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
                {orders.length > 5 && (
                  <Link to="/orders" className="block text-center text-sm text-brand-400 hover:text-brand-300 pt-2">
                    View all orders
                  </Link>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
