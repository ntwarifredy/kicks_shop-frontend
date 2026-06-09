import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductList from '../components/product/ProductList';
import ProductFilter from '../components/product/ProductFilter';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { HiOutlineAdjustments, HiOutlineX } from 'react-icons/hi';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 12, sort };
      const search = searchParams.get('search');
      const urlCategory = searchParams.get('category');
      if (search) params.search = search;
      const cats = [];
      if (urlCategory) cats.push(urlCategory);
      if (filters.category?.length) cats.push(...filters.category);
      if (cats.length) params.category = cats.join(',');
      if (filters.brand?.length) params.brand = filters.brand.join(',');
      if (filters.gender) params.gender = filters.gender;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.size) params.size = filters.size;
      if (filters.color?.length) params.color = filters.color.join(',');

      const { data } = await API.get('/products', { params });
      setProducts(data.data || []);
      const total = data.count || 0;
      setTotalProducts(total);
      setTotalPages(Math.ceil(total / 12) || 1);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load products';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, sort, searchParams, filters]);

  useEffect(() => {
    if (searchParams.get('category')) {
      setFilters(prev => {
        const { category, ...rest } = prev;
        return rest;
      });
    }
  }, [searchParams]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const searchTerm = searchParams.get('search') || '';
  const categoryTerm = searchParams.get('category') || '';
  const displayCategory = categoryTerm ? categoryTerm.charAt(0).toUpperCase() + categoryTerm.slice(1) : '';

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {searchTerm ? `Results for "${searchTerm}"` : categoryTerm ? `${displayCategory} Shoes` : 'All Products'}
            </h1>
            <p className="text-sm text-surface-400 mt-1">{totalProducts} products found</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 text-surface-400 hover:text-white bg-surface-800 border border-surface-700 px-3 py-2 rounded-xl text-sm transition-all">
              {showFilters ? <HiOutlineX className="w-4 h-4" /> : <HiOutlineAdjustments className="w-4 h-4" />}
              Filters
            </button>
            <select value={sort} onChange={handleSortChange}
              className="input-field text-sm">
              <option value="-createdAt">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-rating">Top Rated</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}>
            <ProductFilter
              filters={filters}
              setFilters={setFilters}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
            />
          </aside>

          <div className="flex-1 min-w-0">
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant="error">{error}</Message>
            ) : (
              <>
                <ProductList products={products} />
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
                      className="px-3 py-2 bg-surface-800 border border-surface-700 text-surface-300 rounded-xl text-sm hover:border-brand-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === p ? 'bg-brand-600 text-white' : 'bg-surface-800 border border-surface-700 text-surface-300 hover:border-brand-600/50'}`}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
                      className="px-3 py-2 bg-surface-800 border border-surface-700 text-surface-300 rounded-xl text-sm hover:border-brand-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
