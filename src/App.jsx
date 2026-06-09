import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import useAuth from './hooks/useAuth';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import Loader from './components/common/Loader';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import OrderTracking from './pages/OrderTracking';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminProductForm from './pages/admin/ProductForm';
import AdminOrders from './pages/admin/Orders';
import AdminCustomers from './pages/admin/Customers';
import AdminReports from './pages/admin/Reports';
import AdminNotifications from './pages/admin/Notifications';

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <Loader fullPage />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout><Home /></Layout>} />
    <Route path="/shop" element={<Layout><Shop /></Layout>} />
    <Route path="/product/:id" element={<Layout><ProductDetails /></Layout>} />
    <Route path="/cart" element={<Layout><Cart /></Layout>} />
    <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
    <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
    <Route path="/login" element={<Layout><Login /></Layout>} />
    <Route path="/register" element={<Layout><Register /></Layout>} />
    <Route path="/profile" element={<Layout><Profile /></Layout>} />
    <Route path="/orders" element={<Layout><OrderHistory /></Layout>} />
    <Route path="/orders/:id" element={<Layout><OrderTracking /></Layout>} />
    <Route path="/about" element={<Layout><About /></Layout>} />
    <Route path="/contact" element={<Layout><Contact /></Layout>} />
    <Route path="/faq" element={<Layout><FAQ /></Layout>} />

    <Route path="/admin" element={
      <AdminRoute>
        <AdminLayout><AdminDashboard /></AdminLayout>
      </AdminRoute>
    } />
    <Route path="/admin/products" element={
      <AdminRoute>
        <AdminLayout><AdminProducts /></AdminLayout>
      </AdminRoute>
    } />
    <Route path="/admin/products/new" element={
      <AdminRoute>
        <AdminLayout><AdminProductForm /></AdminLayout>
      </AdminRoute>
    } />
    <Route path="/admin/products/edit/:id" element={
      <AdminRoute>
        <AdminLayout><AdminProductForm /></AdminLayout>
      </AdminRoute>
    } />
    <Route path="/admin/orders" element={
      <AdminRoute>
        <AdminLayout><AdminOrders /></AdminLayout>
      </AdminRoute>
    } />
    <Route path="/admin/customers" element={
      <AdminRoute>
        <AdminLayout><AdminCustomers /></AdminLayout>
      </AdminRoute>
    } />
    <Route path="/admin/reports" element={
      <AdminRoute>
        <AdminLayout><AdminReports /></AdminLayout>
      </AdminRoute>
    } />
    <Route path="/admin/notifications" element={
      <AdminRoute>
        <AdminLayout><AdminNotifications /></AdminLayout>
      </AdminRoute>
    } />

    <Route path="*" element={
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <p className="text-gray-400 text-lg mb-6">Page not found</p>
          <a href="/" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">Go Home</a>
        </div>
      </Layout>
    } />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
