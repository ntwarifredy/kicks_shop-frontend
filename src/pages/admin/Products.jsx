import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import { formatPrice, placeholderImg } from '../../utils/helpers';
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data: response } = await API.get('/products', { params: { page, limit: 10, status: '' } });
      setProducts(response.data || []);
      const total = response.count || 0;
      setTotalPages(Math.ceil(total / 10) || 1);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted');
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <Link to="/admin/products/new"
          className="btn-primary flex items-center gap-2">
          <HiOutlinePlus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {loading ? <Loader /> : error ? <Message variant="error">{error}</Message> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-700 bg-surface-800">
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Image</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Stock</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-surface-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-surface-400">No products found</td></tr>
                ) : products.map((product) => (
                  <tr key={product._id || product.id} className="border-b border-surface-700/50 hover:bg-surface-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <img src={product.images?.[0] || product.image || placeholderImg(60, 60, 'N')}
                        alt={product.name} className="w-12 h-12 object-cover rounded-lg"
                        onError={(e) => { e.target.src = placeholderImg(60, 60, 'N'); }} />
                    </td>
                    <td className="px-6 py-4 text-sm text-white">{product.name}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-brand-400">{formatPrice(product.discountPrice || product.price)}</td>
                    <td className="px-6 py-4 text-sm text-surface-400">{product.stock}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${(product.stock || 0) > 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {(product.stock || 0) > 0 ? 'Active' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/admin/products/edit/${product._id || product.id}`)}
                          className="btn-ghost p-2">
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product._id || product.id)}
                          className="btn-ghost p-2 text-surface-400 hover:text-red-400">
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t border-surface-700">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                className="px-3 py-1.5 bg-surface-800 rounded-lg text-sm text-surface-300 disabled:opacity-50">Previous</button>
              <span className="text-sm text-surface-400">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 bg-surface-800 rounded-lg text-sm text-surface-300 disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
