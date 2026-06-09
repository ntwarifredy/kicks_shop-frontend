import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineViewGrid, HiOutlineCollection, HiOutlineClipboardList, HiOutlineUsers, HiOutlineChartBar, HiOutlineMenu, HiOutlineX, HiOutlineBell } from 'react-icons/hi';
import API from '../../api/axios';

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: HiOutlineViewGrid },
  { name: 'Products', path: '/admin/products', icon: HiOutlineCollection },
  { name: 'Orders', path: '/admin/orders', icon: HiOutlineClipboardList },
  { name: 'Customers', path: '/admin/customers', icon: HiOutlineUsers },
  { name: 'Notifications', path: '/admin/notifications', icon: HiOutlineBell },
  { name: 'Reports', path: '/admin/reports', icon: HiOutlineChartBar },
];

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  const fetchUnreadCount = async () => {
    try {
      const { data } = await API.get('/admin/notifications');
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [location.pathname]);

  useEffect(() => {
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-surface-950 flex">
      <div className={`fixed inset-0 z-40 bg-black/50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)} />

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface-900 border-r border-surface-700 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-surface-700">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold text-brand-600">KICKS</span>
            <span className="text-xl font-bold text-white">_ADMIN</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-surface-400 hover:text-white">
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
            return (
              <Link key={link.path} to={link.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-brand-600 text-white' : 'text-surface-400 hover:text-white hover:bg-surface-800'}`}>
                <Icon className="w-5 h-5" />
                {link.name}
                {link.name === 'Notifications' && unreadCount > 0 && (
                  <span className="ml-auto bg-brand-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[18px] px-1.5 flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-surface-700 mt-4">
            <Link to="/" onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-400 hover:text-white hover:bg-surface-800 transition-colors">
              ← Back to Store
            </Link>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-surface-950/80 backdrop-blur border-b border-surface-700 flex items-center px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-surface-400 hover:text-white mr-4">
            <HiOutlineMenu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-white">Admin Panel</h1>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
