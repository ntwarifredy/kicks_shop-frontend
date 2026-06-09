import { useState, useEffect } from 'react';
import API from '../../api/axios';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import { getDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { HiOutlineBell, HiOutlineTrash, HiOutlineCheck, HiOutlineShoppingCart, HiOutlineStar, HiOutlineMail, HiOutlineRefresh } from 'react-icons/hi';

const typeConfig = {
  new_order: { icon: HiOutlineShoppingCart, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  new_review: { icon: HiOutlineStar, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  contact_message: { icon: HiOutlineMail, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  order_update: { icon: HiOutlineRefresh, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data: response } = await API.get('/admin/notifications');
      setNotifications(response.data || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load notifications';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await API.put(`/admin/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.put('/admin/notifications/read/all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('All marked as read');
    } catch {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success('Notification deleted');
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-brand-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead}
            className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors">
            <HiOutlineCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {loading ? <Loader /> : error ? <Message variant="error">{error}</Message> : (
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="card p-12 text-center">
              <HiOutlineBell className="w-12 h-12 text-surface-600 mx-auto mb-4" />
              <p className="text-surface-400 text-sm">No notifications yet</p>
            </div>
          ) : notifications.map((notif) => {
            const config = typeConfig[notif.type] || typeConfig.new_order;
            const Icon = config.icon;
            return (
              <div
                key={notif._id}
                className={`card p-4 flex items-start gap-4 transition-all ${!notif.isRead ? 'border-brand-600/30 bg-brand-600/5' : 'opacity-70'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm ${!notif.isRead ? 'text-white font-semibold' : 'text-surface-300'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-surface-500 mt-0.5">{notif.message}</p>
                    </div>
                    <span className="text-xs text-surface-500 whitespace-nowrap">{getDate(notif.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkRead(notif._id)}
                      className="p-1.5 text-surface-500 hover:text-brand-400 transition-colors"
                      title="Mark as read"
                    >
                      <HiOutlineCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif._id)}
                    className="p-1.5 text-surface-500 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
